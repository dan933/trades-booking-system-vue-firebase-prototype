//----------------- Setup ------------------------------//
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

const express = require("express");

const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");

const adminApi = express();

//---------------------------------------------------------//

//----------------------- Permissions -----------------------------------------//
const {
  validateFirebaseAdminIdToken,
  validateSuperUser,
} = require("../helpers/session/permissions.js");

//-----------------------------------------------------------------------------//

const adminController = require("./adminController.js");

adminApi.use(cors);
adminApi.use(cookieParser);
adminApi.use(validateFirebaseAdminIdToken);
adminApi.use(bodyParser.json());

//---------------- Controllers ---------------------------------------//

adminApi.get("/test", validateSuperUser, adminController.test);

//Used to set claims for an admin user
adminApi.post(
  "/set-admin-permissions",
  validateSuperUser,
  adminController.setAdminUserPermissions
);

exports.adminApi = functions
  .region("australia-southeast1")
  .https.onRequest(adminApi);
