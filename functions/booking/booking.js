//----------------- Setup ------------------------------//
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

const express = require("express");

const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");

const bookingApi = express();

//---------------------------------------------------------//

//----------------------- Permissions -----------------------------------------//
const {
  validateFirebaseIdToken,
} = require("../helpers/session/permissions.js");

//-----------------------------------------------------------------------------//

const bookingController = require("./bookingController.js");

bookingApi.use(cors);
bookingApi.use(cookieParser);
bookingApi.use(validateFirebaseIdToken);
bookingApi.use(bodyParser.json());

//---------------- Controllers ---------------------------------------//
bookingApi.post("/:orgId/get-availability", bookingController.getAvailability);

exports.bookingApi = functions
  .region("australia-southeast1")
  .https.onRequest(bookingApi);
