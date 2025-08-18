//----------------- Setup ------------------------------//
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const express = require("express");

const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });

const bookingApi = express();

//---------------------------------------------------------//

//----------------------- Permissions -----------------------------------------//
const {
  validateFirebaseIdToken,
} = require("../helpers/session/permissions.js");

//-----------------------------------------------------------------------------//

const bookingController = require("./bookingController.js");
const { onRequest } = require("firebase-functions/https");

bookingApi.use(cors);
bookingApi.use(cookieParser);
bookingApi.use(validateFirebaseIdToken);
bookingApi.use(express.json());

bookingApi.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    if (typeof data === "object") {
      return originalSend.call(this, JSON.stringify(data));
    }
    return originalSend.call(this, data);
  };
  next();
});

//---------------- Controllers ---------------------------------------//
bookingApi.post("/:orgId/book", bookingController.book);

bookingApi.post(
  "/:orgId/send-confirmation-email",
  bookingController.sendBookingConfirmationEmail
);

exports.bookingApi = onRequest({ region: "australia-southeast1" }, bookingApi);
