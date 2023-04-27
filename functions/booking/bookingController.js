const admin = require("firebase-admin");
const functions = require("firebase-functions");

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
