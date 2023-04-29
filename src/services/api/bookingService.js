import { getIdToken, getAuth } from "firebase/auth";
const apiUrl = import.meta.env.VITE_APIURL;

import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

//get user
const user = getAuth().currentUser;
let userId = user.uid;

//get token
const token = await getIdToken(user);

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

  // 3 months ahead from the current date
  let bookMonthsAhead = new Date();
  bookMonthsAhead.setMonth(bookMonthsAhead.getMonth() + bookMonthsAheadLimit);

  console.log("bookMonthsAhead", bookMonthsAhead);

  //query the bookedSchedules collection for the bookMonthsAheadLimit
  let bookedSchedulesQuery = query(
    collection(db, `organisations/${orgId}/bookedSchedule`),
    where("bookingScheduleDate", ">=", new Date())
  );

  let bookedSchedules = await getDocs(bookedSchedulesQuery);

  bookedSchedules = bookedSchedules.docs.map((doc) => doc.data());
  //----------------------------------------------//

  //-------------- Adds the bookedout dates to the booked out dates array --------------//

  let businessClosedDays = [];

  //days the business is closed
  Object.keys(openingTimes).forEach((day) => {
    if (!openingTimes[day].open) {
      businessClosedDays.push(day);
    }
  });

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

      let numberOfBookingsForTheDay = Object.keys(schedule.bookedTimes).filter(
        (key) => {
          return !schedule[key];
        }
      );

      //Get the available hours for that day
      let availableHours = endTime - startTime;

      //Check if the business is booked out for that day
      let IsBookedOut = numberOfBookingsForTheDay.length >= availableHours;

      //If the business is Booked out for that day
      if (IsBookedOut) {
        bookedOutDates.push(scheduleDate);
      }
    }
  });

  //return values
  //also work on creating timeslots for the available times
  //maybe make this another function
  console.log(bookedOutDates, "bookedOutDates");
  console.log(businessClosedDays, "businessClosedDays");
};

const getTimeslotAvailability = async (orgId, selectedDate) => {
  return "";
};

export { getTimeslotAvailability, getCalendarDatesAvailability };
