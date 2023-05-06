const admin = require("firebase-admin");
const functions = require("firebase-functions");
const bookingHlper = require("../helpers/booking/bookingHelper.js");

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

  //Get the availability for the chosen date from firestore

  //Create blocks of time for the chosen date leave 30 mins between each block

  res.send(bookings);
};

exports.book = async (req, res) => {
  try {
    functions.logger.log("request", req.body);

    //Get the organisation id from the request
    const orgId = req.params.orgId;

    //Get the bookingDate
    const bookingDate = req.body.bookingDate;

    functions.logger.log("bookingDate", bookingDate);

    //Get the Customer services required
    const customerServices = req.body.services;

    functions.logger.log("customerServices", customerServices);

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

    //Get the gap between settings
    const gapBetween = orgAvailabilityDoc.data().gapBetween;

    functions.logger.log("gapBetween", gapBetween);

    //Creats an array of the days hours to be used to create the bookedSchedule document
    const newBookedScheduleDoc = bookingHlper.createNewBookedSchedules(
      orgAvailabilityDoc.data(),
      bookingDate
    );

    functions.logger.log("newBookedScheduleDoc", newBookedScheduleDoc);

    //Get the bookedSchedule document for the requested date
    const bookedScheduleRef = admin
      .firestore()
      .collection("organisations")
      .doc(`${orgId}`)
      .collection("bookedSchedule")
      .doc(`${bookingDate}`);

    const bookedSchedule = await bookedScheduleRef.get();

    //check if bookings already exists for the requested date
    if (bookedSchedule.exists) {
      functions.logger.log("bookedSchedule", bookedSchedule.data());

      //check that requested time is not already booked
      const isAvailable = bookingHlper.checkRequestedBookingAvailability(
        bookedSchedule.data(),
        customerServices,
        startHour,
        orgAvailabilityDoc.data()
      );

      functions.logger.log("isAvailable", isAvailable);

      //if not available don't allow booking
      if (!isAvailable) {
        res.send({
          message: "Requested time is not available",
          status: "error",
        });

        return;
      }

      //otherwise update the bookedSchedule document
      const updatedSchdule = bookingHlper.updateBookedScheduleDocument(
        bookedSchedule.data(),
        customerServices,
        startHour,
        gapBetween,
        orgAvailabilityDoc.data()
      );

      await bookedScheduleRef.set({ ...updatedSchdule });

      functions.logger.log("Booking schedule updated", updatedSchdule);

      res.send({
        message: "Booking Scheudle Updated",
        status: "success",
        data: updatedSchdule,
      });

      return;
    }

    //If there is no document for the requested date create one
    if (!bookedSchedule.exists) {
      //check that booking times are within opperating hours
      const isAvailable = bookingHlper.checkRequestedBookingAvailability(
        newBookedScheduleDoc,
        customerServices,
        startHour,
        orgAvailabilityDoc.data()
      );

      functions.logger.log("isAvailable", isAvailable);

      //if not available don't allow booking
      if (!isAvailable) {
        res.send({
          message: "Requested time is not available",
          status: "error",
        });

        return;
      }

      //update bookedTimes Object with the requested booking
      const updatedSchdule = bookingHlper.updateBookedScheduleDocument(
        newBookedScheduleDoc,
        customerServices,
        startHour,
        gapBetween,
        orgAvailabilityDoc.data()
      );

      //create the bookedSchedule document
      await bookedScheduleRef.set({ ...updatedSchdule });

      functions.logger.log("New Booking Created", updatedSchdule);

      res.send({
        message: "New Booking Created",
        status: "success",
        data: updatedSchdule,
      });

      return;
    }
  } catch (error) {
    functions.logger.log("error", error);
    res.send(error);
    return;
  }
};
