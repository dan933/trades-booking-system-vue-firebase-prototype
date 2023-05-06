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
  for (let index = startTime; index <= endTime; index++) {
    bookedTimes[index] = false;
  }

  functions.logger.log("bookedTimes", bookedTimes);

  return { bookedTimes, bookingScheduleDate: new Date(bookingDate) };
};

exports.updateBookedScheduleDocument = (
  bookedSchedule,
  customerServices,
  startHour,
  gapBetween
) => {
  //get the total hours required
  const totalHoursRequired = customerServices.reduce((acc, service) => {
    return acc + service.hours;
  }, 0);

  functions.logger.log("totalHoursRequired", totalHoursRequired);

  functions.logger.log("startHour", startHour);

  let bookedTimes = bookedSchedule.bookedTimes;

  let endHour = startHour + totalHoursRequired + gapBetween;

  for (let index = startHour; index < endHour; index++) {
    bookedTimes[index] = true;
  }

  bookedSchedule.bookedTimes = bookedTimes;

  functions.logger.log("bookedSchedule", bookedSchedule);

  return bookedSchedule;
};

exports.checkRequestedBookingAvailability = (bookedSchedule) => {};

exports.createBookedScheduleDocument = (bookingDate) => {};
