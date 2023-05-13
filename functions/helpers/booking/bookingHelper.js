//Returns the opperating hours for that day as an array
//Returns the gap between settings as part of the object
const functions = require("firebase-functions");

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

  functions.logger.log("totalHoursRequired", totalHoursRequired);

  functions.logger.log("startHour", startHour);

  functions.logger.log(
    "updateType line 44 helper update booking schedule",
    updateType
  );

  let bookedTimes = bookedSchedule.bookedTimes;

  functions.logger.log(
    "bookedTimes line 53 helper update booking schedule",
    bookedTimes
  );

  //Get the number of hours required for the booking
  let endHour = startHour + totalHoursRequired + gapBetween;

  functions.logger.log(
    "endHour line 61 helper update booking schedule",
    endHour
  );

  //get the day of the week for the requested booking
  let bookedDay = bookedSchedule.bookingScheduleDate;
  bookedDay = bookedDay?.toDate
    ? bookedDay.toDate().getDay()
    : bookedDay.getDay();

  functions.logger.log("bookedDay", bookedDay);

  let closingTime = orgAvailabilityDoc.openingTimes[bookedDay].end;

  functions.logger.log(
    "closingTime line 76 helper update booking schedule",
    closingTime
  );

  for (let index = startHour; index < endHour; index++) {
    if (index >= closingTime) {
      break;
    }

    bookedTimes[index] = updateType === "remove" ? false : true;
  }

  bookedSchedule.bookedTimes = bookedTimes;

  functions.logger.log("bookedSchedule", bookedSchedule);

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
