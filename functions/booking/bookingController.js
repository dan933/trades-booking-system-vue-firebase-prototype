const admin = require("firebase-admin");
const functions = require("firebase-functions");
const bookingHelper = require("../helpers/booking/bookingHelper.js");
const { error } = require("firebase-functions/logger");
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);

exports.getAvailability = async (req, res) => {
  functions.logger.log("req", req.body);

  const requestBody = req.body;

  //Get the orgId from the request
  const orgId = req.params.orgId;

  //Get the booked schedule for the chosen date from firestore
  const bookedSchedulesRef = admin
    .firestore()
    .collection("organisations")
    .doc(`${orgId}`)
    .collection("bookedSchedule");

  //query the booked schedule for the chosen date
  let bookingsSnapshot = await bookedSchedulesRef
    .where(
      "endTimestamp",
      ">=",
      admin.firestore.Timestamp.fromDate(
        new Date(requestBody.selectedDate.startOfDay)
      )
    )
    .where(
      "endTimestamp",
      "<",
      admin.firestore.Timestamp.fromDate(
        new Date(requestBody.selectedDate.endOfDay)
      )
    )
    .get();

  //get the bookings for that day
  let bookings = bookingsSnapshot.docs.map((doc) => doc.data());

  functions.logger.log("bookings", bookings);

  res.send(bookings);
};

exports.book = async (req, res) => {
  try {
    functions.logger.log("request", req);

    //Get the organisation id from the request
    const orgId = req.params.orgId;

    //Get the bookingDate
    const bookingDate = req.body.bookingDate;

    functions.logger.log("bookingDate", bookingDate);

    //Get the Customer services required
    const customerServices = req.body.services;

    functions.logger.log("customerServices", customerServices);

    //Get the customer information
    const customerInfo = req.body.customerInformation;

    //Get the Start Hour
    const startHour = req.body.startHour;

    //Get the organisation details
    const orgAvailabilityRef = admin
      .firestore()
      .collection("organisations")
      .doc(`${orgId}`)
      .collection("availability")
      .doc("opperatingHours");

    //Get the organisation availability details
    const orgAvailabilityDoc = await orgAvailabilityRef.get();

    functions.logger.log("orgAvailabilityDoc", orgAvailabilityDoc.data());

    //Get the gap between settings for the organisation
    const gapBetween = orgAvailabilityDoc.data().gapBetween;

    functions.logger.log("gapBetween", gapBetween);

    //Creats an array of the days hours to be used to create the bookedSchedule document
    const newBookedScheduleDoc = bookingHelper.createNewBookedSchedules(
      orgAvailabilityDoc.data(),
      bookingDate
    );

    functions.logger.log("newBookedScheduleDoc", newBookedScheduleDoc);

    //Get the bookedSchedule ref document for the requested date
    const bookedScheduleRef = admin
      .firestore()
      .collection("organisations")
      .doc(`${orgId}`)
      .collection("bookedSchedule")
      .doc(`${bookingDate}`);

    //Booking ref for the customers booking
    const bookingRef = admin
      .firestore()
      .collection("organisations")
      .doc(`${orgId}`)
      .collection("bookings")
      .doc();

    //booking object to be created if the booking is available
    const bookingRequest = {
      bookingId: bookingRef.id,
      userId: customerInfo.userId,
      bookingDate: admin.firestore.Timestamp.fromDate(
        new Date(bookingDate)
      ).toDate(),
      startHour,
      endHour:
        startHour +
        customerServices.reduce((acc, service) => {
          return acc + service.hours;
        }, 0),
      services: customerServices,
      address: customerInfo.addressList[0],
      phoneNumber: customerInfo.phoneNumber,
      status: "pending",
    };

    functions.logger.log("bookingRequest", bookingRequest);
    //------------------------ Run transaction -----------------------//
    //this makes sure that there are no double bookings
    let holdTimeSlot = await admin.firestore().runTransaction(async (t) => {
      //Get the bookedSchedule document for the requested date
      const bookedSchedule = await t.get(bookedScheduleRef);

      functions.logger.log("bookedSchedule", bookedSchedule);

      //check if booking already exists for the requested date
      if (bookedSchedule.exists) {
        functions.logger.log("bookedSchedule", bookedSchedule.data());

        //check that requested time is not already booked
        const isAvailable = bookingHelper.checkRequestedBookingAvailability(
          bookedSchedule.data(),
          customerServices,
          startHour,
          orgAvailabilityDoc.data()
        );

        functions.logger.log("isAvailable", isAvailable);

        //if not available don't allow booking
        if (!isAvailable) {
          return {
            message: "Requested time is not available",
            success: false,
            status: "error",
          };
        }

        //update the bookedSchedule document if the requested time is available
        const updatedSchdule = bookingHelper.updateBookedScheduleDocument(
          bookedSchedule.data(),
          customerServices,
          startHour,
          gapBetween,
          orgAvailabilityDoc.data()
        );

        await t.set(bookedScheduleRef, { ...updatedSchdule });
        await t.create(bookingRef, { ...bookingRequest });

        functions.logger.log("Booking schedule updated", updatedSchdule);

        return {
          message: "Booking Scheudle Updated",
          status: "success",
          success: true,
        };
      }

      //If there is no document for the requested date create one
      if (!bookedSchedule.exists) {
        functions.logger.log("bookedSchedule not exist", bookedSchedule);
        //check that booking times are within opperating hours
        const isAvailable = bookingHelper.checkRequestedBookingAvailability(
          newBookedScheduleDoc,
          customerServices,
          startHour,
          orgAvailabilityDoc.data()
        );

        functions.logger.log("isAvailable", isAvailable);

        //if not available don't allow booking
        if (!isAvailable) {
          return {
            message: "Requested time is not available",
            success: false,
            status: "error",
          };
        }

        //update bookedTimes Object with the requested booking
        const updatedSchdule = bookingHelper.updateBookedScheduleDocument(
          newBookedScheduleDoc,
          customerServices,
          startHour,
          gapBetween,
          orgAvailabilityDoc.data()
        );

        //create the bookedSchedule document
        await t.set(bookedScheduleRef, { ...updatedSchdule });
        await t.create(bookingRef, { ...bookingRequest });

        functions.logger.log("New Booking Created", updatedSchdule);

        return {
          message: "New Booking Created",
          status: "success",
          success: true,
        };
      }
    });

    functions.logger.log("holdTimeSlot", holdTimeSlot);

    //If the timeslot is not available return message to user
    if (!holdTimeSlot.success) {
      res.send({ ...holdTimeSlot });
      return;
    }

    //----------------------------- Stripe Payment ---------------------------------//

    //Get the stripe payment token
    const paymentToken = req.body?.paymentDetails?.token?.id;

    let chargeResponse;

    try {
      //Attempt stripe payment
      const charge = await stripe.charges.create({
        amount: 1000,
        currency: "aud",
        source: paymentToken,
        description: "testing stripe payment",
      });

      chargeResponse = charge;

      functions.logger.log("charge", charge);
      functions.logger.log("chargeResponse", chargeResponse);
      functions.logger.log("chargeResponse captured", chargeResponse?.captured);
    } catch (error) {
      chargeResponse = error;
    }

    //----------------------------------------------------//

    functions.logger.log("after stripe Payment");

    //------ Run transaction to update the booking status to booked or failed ---//
    const updatedBookingResponse = await admin
      .firestore()
      .runTransaction(async (t) => {
        //Get the bookedSchedule document for the requested date
        const bookedSchedule = await t.get(bookedScheduleRef);

        functions.logger.log("bookedSchedule", bookedSchedule);

        //if the payment is a success
        if (chargeResponse?.captured) {
          //update the booking status to booked
          await t.update(bookingRef, {
            status: "paid",
            stripeChargeId: chargeResponse.id,
          });

          functions.logger.log("onPayment success update booking line 286");

          return {
            message: "Booking Successful",
            status: "success",
            success: true,
          };
        }

        //if something went wrong with the payment

        functions.logger.log("bookedSchedule line 237", bookedSchedule);

        //update the booking schedule by removing the reserved timeslot
        //remove the booking from the bookedSchedule document
        const updatedSchdule = bookingHelper.updateBookedScheduleDocument(
          bookedSchedule.data(),
          customerServices,
          startHour,
          gapBetween,
          orgAvailabilityDoc.data(),
          "remove"
        );

        functions.logger.log("updatedSchdule line 296", updatedSchdule);

        await t.set(bookedScheduleRef, { ...updatedSchdule });

        functions.logger.log(
          "onPayment Fail update bookedScheduleRef line 300"
        );

        //delete the booking
        await t.delete(bookingRef);

        functions.logger.log("onPayment Fail delete booking line 300");

        //return error
        return {
          message: chargeResponse?.raw?.message,
          code: chargeResponse.code,
          status: "failed",
          success: false,
        };
      });
    functions.logger.log("updatedBookingResponse", updatedBookingResponse);

    res.send({ ...updatedBookingResponse });
    return;
    //----------------------------------------------//
  } catch (error) {
    functions.logger.log("error", error);
    functions.logger.log("error", error?.raw?.message);

    res.send({
      code: error?.raw?.message,
      status: "Server error",
      success: false,
    });
    return;
  }
};

// {
//   "message": "Booking Scheudle Updated",
//   "status": "success",
//   "success": true,
//   "data": {
//       "bookedTimes": {
//           "9": true,
//           "10": true,
//           "11": true,
//           "12": true,
//           "13": false,
//           "14": false,
//           "15": false
//       },
//       "bookingScheduleDate": {
//           "_seconds": 1684108800,
//           "_nanoseconds": 0
//       }
//   },
//   "charge": {
//       "id": "ch_3N75DaD55ujpGr830SDnCgd3",
//       "object": "charge",
//       "amount": 1000,
//       "amount_captured": 1000,
//       "amount_refunded": 0,
//       "application": null,
//       "application_fee": null,
//       "application_fee_amount": null,
//       "balance_transaction": "txn_3N75DaD55ujpGr830HBJQL3F",
//       "billing_details": {
//           "address": {
//               "city": null,
//               "country": null,
//               "line1": null,
//               "line2": null,
//               "postal_code": null,
//               "state": null
//           },
//           "email": null,
//           "name": null,
//           "phone": null
//       },
//       "calculated_statement_descriptor": "Stripe",
//       "captured": true,
//       "created": 1683933466,
//       "currency": "aud",
//       "customer": null,
//       "description": "testing stripe payment",
//       "destination": null,
//       "dispute": null,
//       "disputed": false,
//       "failure_balance_transaction": null,
//       "failure_code": null,
//       "failure_message": null,
//       "fraud_details": {},
//       "invoice": null,
//       "livemode": false,
//       "metadata": {},
//       "on_behalf_of": null,
//       "order": null,
//       "outcome": {
//           "network_status": "approved_by_network",
//           "reason": null,
//           "risk_level": "normal",
//           "risk_score": 21,
//           "seller_message": "Payment complete.",
//           "type": "authorized"
//       },
//       "paid": true,
//       "payment_intent": null,
//       "payment_method": "card_1N75DVD55ujpGr833napVd0L",
//       "payment_method_details": {
//           "card": {
//               "brand": "visa",
//               "checks": {
//                   "address_line1_check": null,
//                   "address_postal_code_check": null,
//                   "cvc_check": "pass"
//               },
//               "country": "US",
//               "exp_month": 4,
//               "exp_year": 2024,
//               "fingerprint": "7CyLRLRmXsTNjFA6",
//               "funding": "credit",
//               "installments": null,
//               "last4": "4242",
//               "mandate": null,
//               "network": "visa",
//               "network_token": {
//                   "used": false
//               },
//               "three_d_secure": null,
//               "wallet": null
//           },
//           "type": "card"
//       },
//       "receipt_email": null,
//       "receipt_number": null,
//       "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTjZKeXVENTV1anBHcjgzKJqS-6IGMgYofbA9yO86LBZb80w3bebCd5eHMkQyviK2r42X1AjzNDCYSMiaVFRxtPCcyrRIbOKxlK9D",
//       "refunded": false,
//       "review": null,
//       "shipping": null,
//       "source": {
//           "id": "card_1N75DVD55ujpGr833napVd0L",
//           "object": "card",
//           "address_city": null,
//           "address_country": null,
//           "address_line1": null,
//           "address_line1_check": null,
//           "address_line2": null,
//           "address_state": null,
//           "address_zip": null,
//           "address_zip_check": null,
//           "brand": "Visa",
//           "country": "US",
//           "customer": null,
//           "cvc_check": "pass",
//           "dynamic_last4": null,
//           "exp_month": 4,
//           "exp_year": 2024,
//           "fingerprint": "7CyLRLRmXsTNjFA6",
//           "funding": "credit",
//           "last4": "4242",
//           "metadata": {},
//           "name": null,
//           "tokenization_method": null,
//           "wallet": null
//       },
//       "source_transfer": null,
//       "statement_descriptor": null,
//       "statement_descriptor_suffix": null,
//       "status": "succeeded",
//       "transfer_data": null,
//       "transfer_group": null
//   }
// }

// {
//   "type": "StripeInvalidRequestError",
//   "raw": {
//       "code": "missing_payment_information",
//       "message": "Could not find payment information",
//       "request_log_url": "https://dashboard.stripe.com/test/logs/req_dYeeq2nbXupWmu?t=1683932991",
//       "type": "invalid_request_error",
//       "headers": {
//           "server": "nginx",
//           "date": "Fri, 12 May 2023 23:09:51 GMT",
//           "content-type": "application/json",
//           "content-length": "250",
//           "connection": "keep-alive",
//           "access-control-allow-credentials": "true",
//           "access-control-allow-methods": "GET, POST, HEAD, OPTIONS, DELETE",
//           "access-control-allow-origin": "*",
//           "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
//           "access-control-max-age": "300",
//           "cache-control": "no-cache, no-store",
//           "idempotency-key": "bc827909-6bbc-4555-b9d9-cfe2371937ea",
//           "original-request": "req_dYeeq2nbXupWmu",
//           "request-id": "req_dYeeq2nbXupWmu",
//           "stripe-should-retry": "false",
//           "stripe-version": "2022-11-15",
//           "strict-transport-security": "max-age=63072000; includeSubDomains; preload"
//       },
//       "statusCode": 400,
//       "requestId": "req_dYeeq2nbXupWmu"
//   },
//   "rawType": "invalid_request_error",
//   "code": "missing_payment_information",
//   "headers": {
//       "server": "nginx",
//       "date": "Fri, 12 May 2023 23:09:51 GMT",
//       "content-type": "application/json",
//       "content-length": "250",
//       "connection": "keep-alive",
//       "access-control-allow-credentials": "true",
//       "access-control-allow-methods": "GET, POST, HEAD, OPTIONS, DELETE",
//       "access-control-allow-origin": "*",
//       "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
//       "access-control-max-age": "300",
//       "cache-control": "no-cache, no-store",
//       "idempotency-key": "bc827909-6bbc-4555-b9d9-cfe2371937ea",
//       "original-request": "req_dYeeq2nbXupWmu",
//       "request-id": "req_dYeeq2nbXupWmu",
//       "stripe-should-retry": "false",
//       "stripe-version": "2022-11-15",
//       "strict-transport-security": "max-age=63072000; includeSubDomains; preload"
//   },
//   "requestId": "req_dYeeq2nbXupWmu",
//   "statusCode": 400
// }
