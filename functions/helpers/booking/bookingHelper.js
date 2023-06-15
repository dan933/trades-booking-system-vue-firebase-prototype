const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.createNewBookedSchedules = (orgAvailabilityDoc, bookingDate) => {
  //get the day of the week
  let day = new Date(bookingDate).getDay();

  //get the opening times for that day
  let openingTimes = orgAvailabilityDoc.openingTimes[day];

  let startTime = openingTimes.start;
  let endTime = openingTimes.end;

  let bookedTimes = {};

  //loop through to make the blocks of time
  for (let index = startTime; index < endTime; index++) {
    bookedTimes[index] = false;
  }

  functions.logger.log("bookedTimes", bookedTimes);

  return { bookedTimes, bookingScheduleDate: new Date(bookingDate) };
};

exports.getBookingById = async (orgId, bookingId) => {
  try {
    const bookingDoc = await admin
      .firestore()
      .collection("organisations")
      .doc(orgId)
      .collection("bookings")
      .doc(bookingId)
      .get();

    return bookingDoc.data();
  } catch (error) {
    functions.logger.error("Error while getting booking:", error);
    return null;
  }
};

exports.updateBookingPaymentStatus = (orgId, bookingId, status, refundId) => {
  try {
    const bookingDoc = admin
      .firestore()
      .collection("organisations")
      .doc(orgId)
      .collection("bookings")
      .doc(bookingId);

    return bookingDoc.update({ status, refundId });
  } catch (error) {
    functions.logger.error("Error while updating booking:", error);
    return null;
  }
};

exports.removeBookingFromSchedule = async (
  bookedSchedule,
  customerServices,
  startHour
) => {
  //get the total hours required
  const totalHoursRequired = customerServices.reduce((acc, service) => {
    return acc + service.hours;
  }, 0);

  let bookedTimes = bookedSchedule.bookedTimes;

  //Get the number of hours required for the booking
  let endHour = startHour + totalHoursRequired + gapBetween;

  for (let index = startHour; index < endHour; index++) {
    bookedTimes[index] = false;
  }

  bookedSchedule.bookedTimes = bookedTimes;

  return bookedSchedule;
};

//Updates the booking schedule with the requested booking
exports.updateBookedScheduleDocument = (
  bookedSchedule,
  customerServices,
  startHour,
  gapBetween,
  orgAvailabilityDoc,
  updateType = "add"
) => {
  //get the total hours required
  const totalHoursRequired = customerServices.reduce((acc, service) => {
    return acc + service.hours;
  }, 0);

  let bookedTimes = bookedSchedule.bookedTimes;

  //Get the number of hours required for the booking
  let endHour = startHour + totalHoursRequired + gapBetween;

  //get the day of the week for the requested booking
  let bookedDay = bookedSchedule.bookingScheduleDate;
  bookedDay = bookedDay?.toDate
    ? bookedDay.toDate().getDay()
    : bookedDay.getDay();

  let closingTime = orgAvailabilityDoc.openingTimes[bookedDay].end;

  for (let index = startHour; index <= endHour; index++) {
    if (index >= closingTime) {
      break;
    }

    bookedTimes[index] = updateType === "remove" ? false : true;
  }

  bookedSchedule.bookedTimes = bookedTimes;

  return bookedSchedule;
};

//Checks existing booking schedule for availability
exports.checkRequestedBookingAvailability = (
  bookedSchedule,
  customerServices,
  startHour,
  orgAvailabilityDoc
) => {
  //get the total hours required
  const totalHoursRequired = customerServices.reduce((acc, service) => {
    return acc + service.hours;
  }, 0);

  functions.logger.log("totalHoursRequired", totalHoursRequired);

  functions.logger.log("startHour", startHour);

  functions.logger.log(
    "bookedSchedule.bookingScheduleDate.toDate()",
    bookedSchedule.bookingScheduleDate,
    typeof bookedSchedule.bookingScheduleDate
  );

  //get the day of the week for the requested booking
  let bookedDay = bookedSchedule.bookingScheduleDate;
  bookedDay = bookedDay?.toDate
    ? bookedDay.toDate().getDay()
    : bookedDay.getDay();

  functions.logger.log("bookedDay", bookedDay);

  //check opperating end time for that day
  let opperatingEndTime = orgAvailabilityDoc.openingTimes[bookedDay].end;

  let bookedTimes = bookedSchedule.bookedTimes;

  let gapBetween = orgAvailabilityDoc.gapBetween;

  functions.logger.log("gapBetween", gapBetween);

  let endHour = startHour + totalHoursRequired;

  functions.logger.log("endHour", endHour);

  for (let index = startHour; index < endHour; index++) {
    //if the hour is already booked return false
    //if there the gap between bookings is not available return false
    //if the index is greater than the opperating end time return false
    if (
      bookedTimes[index] ||
      bookedTimes[index + gapBetween] ||
      //if the booking is the last booking slot for the day
      index - gapBetween > opperatingEndTime
    ) {
      return false;
    }
  }

  return true;
};

exports.calculateInvoiceTotal = async (orgId, customerServices) => {
  const servicesRef = admin
    .firestore()
    .collection("organisations")
    .doc(`${orgId}`)
    .collection("availability")
    .doc("services");

  const servicesDoc = await servicesRef.get();

  const services = servicesDoc.data().services;

  const serviceAmounts = customerServices.map((service) => {
    const matchedService = services.find((s) => s.id === service.selection.id);

    functions.logger.log("matchedService", matchedService);

    if (!matchedService) {
      throw new Error(`Service with id ${service.id} not found`);
    }

    if (!matchedService?.rate) {
      throw new Error(`Service with id ${service.id} has no rate`);
    }

    if (!service.hours) {
      throw new Error(`Service with id ${service.id} has no hours`);
    }

    // Convert price to cents to avoid floating point arithmetic
    let serviceAmount = Math.round(matchedService.rate * service.hours * 100);

    functions.logger.log("serviceAmount", serviceAmount);

    return serviceAmount;
  });

  let subtotal = serviceAmounts.reduce((acc, amount) => {
    return acc + amount;
  }, 0);

  // Calculate GST in cents
  let gst = Math.round(subtotal * 0.1);

  // Calculate total in cents
  let total = subtotal + gst;

  // Now that all calculations are done, convert the total back to dollars for Stripe
  let stripeTotal = total;

  functions.logger.log("stripeTotal", stripeTotal);

  // Convert subtotal, gst, and total back to dollars for the return value
  return {
    subtotal: subtotal / 100,
    gst: gst / 100,
    total: total / 100,
    stripeTotal,
  };
};

exports.sendBookingConfirmationEmail = async () => {};
