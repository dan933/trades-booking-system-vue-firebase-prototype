// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

//todo add specific allowed origins
//todo add security
//todo maybe add firebase app check

//----------------- Setup ------------------------------//

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const api = express();

//---------------------- Permissions -------------------//
const { validateFirebaseIdToken } = require("./helpers/session/permissions.js");

//------------------ Modules ---------------------------//
//contact us form
const contactUsFormModule = require("./contactForm.js");
//-----------------------------------------------------//

//---------------------- Router ------------------------//
const bookingRouter = require("./booking/bookingRouter.js");

api.get("/hello", (req, res) => {
  // @ts-ignore
  res.send(`Hello`);
});

api.post("/submit-contact-form", (req, res) => {
  contactUsFormModule.handler(req, res);
});

api.use(cors);
api.use(cookieParser);
api.use(validateFirebaseIdToken);
api.use("/booking", bookingRouter);

exports.api = functions.region("australia-southeast1").https.onRequest(api);

// // contact us form
// exports.submitContactUsForm = functions
//   .region("australia-southeast1")
//   .https.onRequest((req, res) => {
//     contactUsFormModule.handler(req, res);
//   });

// // Booking - Get Availability
// exports.getAvailability = functions
//   .region("australia-southeast1")
//   .https.onRequest((req, res) => {
//     getAvailabilityModule.handler(req, res);
//   });
