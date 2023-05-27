//----------------- Setup ------------------------------//
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

const express = require("express");

const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");

const emailAPI = express();

//---------------------------------------------------------//
//----------------------- Permissions -----------------------------------------//
// A user must be logged in
const {
  validateFirebaseIdToken,
} = require("../helpers/session/permissions.js");
//-----------------------------------------------------------------------------//

const emailController = require("./emailController.js");

emailAPI.use(cors);
emailAPI.use(validateFirebaseIdToken);
emailAPI.use(cookieParser);
emailAPI.use(bodyParser.json());

//---------------- Controllers ---------------------------------------//
emailAPI.post("/send-booking-email", emailController.sendBookingConfirmation);

exports.emailAPI = functions
  .region("australia-southeast1")
  .https.onRequest(emailAPI);
