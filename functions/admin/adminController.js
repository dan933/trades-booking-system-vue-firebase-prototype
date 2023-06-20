const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);
const bookingHelper = require("../helpers/booking/bookingHelper.js");
const emailHelper = require("../helpers/public-api-functions/emailHelper.js");

exports.test = (req, res) => {
  res.send("Hello from the Admin API");
  return;
};

exports.setAdminUserPermissions = async (req, res) => {
  const { uid, permissions } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, permissions);
    res.status(200).send({ message: "Permissions set successfully" });
  } catch (error) {
    functions.logger.error("Error while setting permissions:", error);
    res.status(500).send({ message: "Error while setting permissions" });
  }

  return;
};

exports.refundBooking = async (req, res) => {
  try {
    //Get org id from token
    const orgId = req.user.org;

    if (!orgId) {
      res.status(403).send({ message: "Org not found" });
      return;
    }

    functions.logger.log("orgId", orgId);

    //Get booking id from request
    let bookingId = req?.body?.bookingId;

    if (!bookingId) {
      res.status(400).send({ message: "Booking id is required" });
      return;
    }

    functions.logger.log("Refunding booking:", bookingId);

    //get booking from db
    const booking = await bookingHelper.getBookingById(orgId, bookingId);

    //if no booking found, return error
    if (!booking) {
      res.status(400).send({ message: "Booking not found" });
      return;
    }

    //Get the organisation details
    const orgAvailabilityRef = admin
      .firestore()
      .collection("organisations")
      .doc(`${orgId}`)
      .collection("availability")
      .doc("opperatingHours");

    //Get the organisation availability details
    const orgAvailabilityDoc = await orgAvailabilityRef.get();

    if (!orgAvailabilityDoc.exists) {
      res.status(400).send({ message: "Organisation availability not found" });
      return;
    }

    functions.logger.log("orgAvailabilityDoc", orgAvailabilityDoc.data());

    //Get the gap between settings for the organisation
    const gapBetween = orgAvailabilityDoc.data().gapBetween;

    functions.logger.log("gapBetween", gapBetween);

    //get stripe charge id from booking
    const stripeChargeId = booking?.stripeChargeId;

    if (!stripeChargeId) {
      res.status(400).send({ message: "Stripe charge id not found" });
      return;
    }

    //refund stripe charge
    let refund = null;
    try {
      refund = await stripe.refunds.create({
        charge: stripeChargeId,
      });
    } catch (error) {
      functions.logger.error("Error while refunding booking:", error);
      res.status(500).send({ error: error?.message || "" });
      return;
    }

    if (!refund) {
      //todo if refund error add it to the booking maybe??
      res.status(500).send({ message: "Error while refunding booking" });
      return;
    }

    //update booking status to refunded
    await bookingHelper.updateBookingPaymentStatus(
      orgId,
      bookingId,
      "refunded",
      refund.id
    );

    //Get the date in yyyy-mm-dd format from the booking
    const bookingDate = booking?.bookingDate
      .toDate()
      .toISOString()
      .split("T")[0];

    functions.logger.log("bookingDate", bookingDate);

    //create bookedschedule reference
    const bookedScheduleRef = admin
      .firestore()
      .collection("organisations")
      .doc(orgId)
      .collection("bookedSchedule")
      .doc(bookingDate);

    //Run transaction to remove booking from bookedschedule collection
    let removedBookedScheduleResponse = await admin
      .firestore()
      .runTransaction(async (transaction) => {
        //get booked schedule
        const bookedScheduleDoc = await transaction.get(bookedScheduleRef);

        functions.logger.log("bookedScheduleDoc", bookedScheduleDoc);

        //if no booked schedule found, return error
        if (!bookedScheduleDoc.exists) {
          return {
            success: false,
            message: "Booked schedule document not found",
          };
        }

        //remove booking from booked schedule
        const bookedSchedule = bookedScheduleDoc.data();
        const customerServices = booking?.services;
        const startHour = booking?.startHour;

        if (!customerServices || !startHour || !bookedSchedule) {
          return {
            success: false,
            message: "Error while removing booking from booked schedule",
          };
        }

        const updatedBookedSchedule =
          bookingHelper.updateBookedScheduleDocument(
            bookedSchedule,
            customerServices,
            startHour,
            gapBetween,
            orgAvailabilityDoc.data(),
            "remove"
          );

        if (!updatedBookedSchedule) {
          return {
            success: false,
            message: "Error while removing booking from booked schedule",
          };
        }

        functions.logger.log("updatedBookedSchedule", updatedBookedSchedule);

        //update booked schedule
        await transaction.set(bookedScheduleRef, { ...updatedBookedSchedule });

        return {
          success: true,
          updatedBookedSchedule: updatedBookedSchedule,
          message: "Booking removed from booked schedule",
          refund: refund,
        };
      });

    //Email customer about refund
    const refundAmount = refund?.amount / 100;

    const emailResponse = await emailHelper.sendCancelBookingEmail(
      booking,
      refundAmount
    );
    functions.logger.log("emailResponse", emailResponse);

    res.status(200).send({
      ...removedBookedScheduleResponse,
      cancelationEmailSent: emailResponse?.success || false,
    });
  } catch (error) {
    res.status(500).send({ error: error?.message || "" });
    return;
  }
};
