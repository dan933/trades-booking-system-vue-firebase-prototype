import { getIdToken, getAuth } from "firebase/auth";
const apiUrl = import.meta.env.VITE_APIURL;

import {
  getFirestore,
  getDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

//todo add a guest user

//get user
const user = getAuth().currentUser;
let userId = user.uid;

const db = getFirestore();

const getCalendarDatesAvailability = async (orgId) => {
  //Get the companies availability document
  let availabilityDocRef = doc(
    db,
    `organisations/${orgId}/availability/opperatingHours`
  );

  //get the opperating hours gapBetweenAppointments settings and bookMonthsAhead limit
  let availabilityDoc = await getDoc(availabilityDocRef);

  let { openingTimes, gapBetween, bookMonthsAheadLimit } =
    availabilityDoc.data();

  // get the date for the bookMonthsAheadLimit
  let bookMonthsAhead = new Date();
  bookMonthsAhead.setMonth(bookMonthsAhead.getMonth() + bookMonthsAheadLimit);

  // console.log("bookMonthsAhead", bookMonthsAhead);

  //query the bookedSchedules collection for dates in the future
  //todo paginate based on month selected range
  let bookedSchedulesQuery = query(
    collection(db, `organisations/${orgId}/bookedSchedule`),
    where("bookingScheduleDate", ">=", new Date())
  );

  let bookedSchedules = await getDocs(bookedSchedulesQuery);

  bookedSchedules = bookedSchedules.docs.map((doc) => doc.data());
  //----------------------------------------------//

  //-------------- Adds the bookedout dates to the booked out dates array --------------//

  let businessClosedDays = [];

  //------------------- Days the business is closed -------------//
  Object.keys(openingTimes).forEach((day) => {
    if (!openingTimes[day].open) {
      businessClosedDays.push(+day);
    }
  });
  //------------------------------------------------------------//

  let bookedOutDates = [];

  bookedSchedules.forEach((schedule) => {
    //the day of the week 0 is sunday 6 is saturday
    let scheduleDate = schedule.bookingScheduleDate.toDate();

    let dayOfWeek = scheduleDate.getDay();

    //check business is open that day
    if (openingTimes[dayOfWeek].open) {
      //get the start and end times for that day
      let startTime = openingTimes[dayOfWeek].start;
      let endTime = openingTimes[dayOfWeek].end;

      //get the number of timeslots taken for that day
      let numberOfSlotsTakenForTheDay = Object.keys(schedule.bookedTimes).map(
        (key) => {
          if (
            !schedule.bookedTimes[+key] &&
            gapBetweenCheck(+key, gapBetween, schedule.bookedTimes) &&
            +key < endTime
          ) {
            return false;
          } else {
            return true;
          }
        }
      );

      //filter the booked out slots
      numberOfSlotsTakenForTheDay = numberOfSlotsTakenForTheDay.filter(
        (booking) => booking
      );

      //Get the available hours for that day
      let availableHours = endTime - startTime;

      //Check if the business is booked out for that day
      let IsBookedOut = numberOfSlotsTakenForTheDay.length >= availableHours;

      //If the business is Booked out for that day
      if (IsBookedOut) {
        bookedOutDates.push(scheduleDate);
      }
    }
  });
  return {
    bookedOutDates,
    businessClosedDays,
    bookMonthsAhead,
    bookedSchedules,
    availabilityDoc: availabilityDoc.data(),
  };
};

const getTimeSlotsForDate = (
  bookingSchedule,
  selectedDate,
  availabilityDoc
) => {
  //get the weekday of the selected date
  let selectedDateWeekday = selectedDate.getDay();

  //get the opening times for the selected date
  let selectedDateOpeningTimes =
    availabilityDoc.openingTimes[selectedDateWeekday];

  //gapBetween
  let gapBetween = availabilityDoc.gapBetween;

  //todo potential api call to get the bookedSchedule for the selected date

  //filter the bookingSchedule for the selected date
  let bookingScheduleForSelectedDate = bookingSchedule.find((schedule) => {
    // console.log("schedule.bookingScheduleDate", schedule.bookingScheduleDate);
    //convert timestamp to date
    let scheduleDate = schedule.bookingScheduleDate
      .toDate()
      .toLocaleDateString();
    return scheduleDate === selectedDate.toLocaleDateString();
  });

  // console.log(
  //   "line 133 bookingScheduleForSelectedDate",
  //   bookingScheduleForSelectedDate
  // );

  //if there is a booking schedule for the selected date
  if (bookingScheduleForSelectedDate) {
    let timeSlotArray = [];
    let currentTimeSlot = [];

    Object.keys(bookingScheduleForSelectedDate.bookedTimes).forEach((key) => {
      //if the time slot is not booked
      //add current timeslot to the available timeslots array
      if (
        +key < selectedDateOpeningTimes.end &&
        !bookingScheduleForSelectedDate.bookedTimes[key] &&
        gapBetweenCheck(
          key,
          gapBetween,
          bookingScheduleForSelectedDate.bookedTimes
        )
      ) {
        currentTimeSlot.push(+key);

        //if the key is the last key
        if (+key === selectedDateOpeningTimes.end - 1)
          timeSlotArray.push(currentTimeSlot);
      } else {
        //add timeslot
        timeSlotArray.push(currentTimeSlot);

        //reset
        currentTimeSlot = [];
      }
    });

    console.log("timeSlotArray", timeSlotArray);

    //convert times into time and available hours
    let availableTimes = timeSlotArray.filter(
      (timeSlot) => timeSlot.length > 0
    );

    availableTimes = availableTimes.map((timeSlot) => {
      return { time: `${timeSlot[0]}:00`, availableHours: timeSlot.length };
    });

    return availableTimes;

    // //helper gapBetweenCheck
    // //check that the gap between settings have been met
    // function gapBetweenCheck(key) {
    //   for (let i = 1; gapBetween >= i; i++) {
    //     //if the next timeslot is booked
    //     if (bookingScheduleForSelectedDate.bookedTimes[`${+key + i}`]) {
    //       return false;
    //     }
    //   }

    //   return true;
    // }
  } else {
    //Number of opperating hours
    const startTime = selectedDateOpeningTimes.start;
    const endTime = selectedDateOpeningTimes.end;

    const availableTimes = [];

    //Number of bookings for the day
    for (let index = startTime; index < endTime; index++) {
      availableTimes.push({
        time: `${index}:00`,
        availableHours: endTime - index,
      });
    }

    //if there is no booking schedule for the selected date
    //return one time slot for the day
    // let availableTimes = [
    //   {
    //     time: `${selectedDateOpeningTimes.start}:00`,
    //     availableHours:
    //       selectedDateOpeningTimes.end - selectedDateOpeningTimes.start,
    //   },
    // ];

    return availableTimes;
  }

  //if there is no bookings scheduled for the selected date
  //return one time slot for the day
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

//Creates booking payload to be sent to the server
const createBookingPayload = (bookingData) => {
  console.log(bookingData);

  //get the timeSlot
  let timeSlot = bookingData?.selectedDateTimeSlot;

  //date in yyyy-mm-dd format
  let bookingDate = formatDate(timeSlot?.date);

  //get the start hour
  let startHour = timeSlot?.date.getHours();

  //add the userId to customer information
  let payload = bookingData;

  payload = {
    bookingDate: bookingDate,
    startHour: startHour,
    customerInformation: {
      ...payload.customerInformation,
      userId: userId,
    },
    services: payload.services,
    paymentDetails: bookingData.paymentDetails,
  };

  console.log("payload", payload);

  return JSON.stringify(payload);
};

//Calls api to attempt to create a booking
const createBooking = async (bookingData, orgId) => {
  try {
    //get token
    const token = await getIdToken(user);

    let payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
      body: createBookingPayload(bookingData),
    };

    console.log("payload", payload);

    const resposne = await fetch(`${apiUrl}/booking/${orgId}/book`, payload);

    const bodyResponse = await resposne.json();

    return bodyResponse;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//----------------------- Helpers --------------------------//
//helper gapBetweenCheck
//check that the gap between settings have been met
const gapBetweenCheck = (key, gapBetween, bookedTimes) => {
  for (let i = 1; gapBetween >= i; i++) {
    //if the next timeslot is booked
    if (bookedTimes[`${+key + i}`]) {
      return false;
    }
  }

  return true;
};

export { getTimeSlotsForDate, getCalendarDatesAvailability, createBooking };
