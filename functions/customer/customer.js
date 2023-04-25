//----------------- Setup ------------------------------//
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

const express = require("express");

const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");

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
customerApi.use(validateFirebaseIdToken);
customerApi.use(cookieParser);
customerApi.use(bodyParser.json());

//---------------- Controllers ---------------------------------------//
customerApi.get(
  "/:orgId/get-customer-details",
  customerController.getCustomerDetails
);

customerApi.patch(
  "/:orgId/update-customer-details",
  customerController.updateCustomerDetails
);

//----------------- Exports ------------------------------//
exports.customerApi = functions
  .region("australia-southeast1")
  .https.onRequest(customerApi);
