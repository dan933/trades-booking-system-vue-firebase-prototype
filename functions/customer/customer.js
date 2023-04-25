//----------------- Setup ------------------------------//
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

const express = require("express");

const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });

const customerApi = express();

//---------------------------------------------------------//
//----------------------- Permissions -----------------------------------------//
// A user must be logged in
const {
  validateFirebaseIdToken,
} = require("../helpers/session/permissions.js");

//-----------------------------------------------------------------------------//

const customerController = require("./customerController.js");

customerApi.use(cors);
customerApi.use(cookieParser);
customerApi.use(validateFirebaseIdToken);

//---------------- Controllers ---------------------------------------//
customerApi.get("/get-customer-details", customerController.getCustomerDetails);

//----------------- Exports ------------------------------//
exports.customerApi = functions
  .region("australia-southeast1")
  .https.onRequest(customerApi);
