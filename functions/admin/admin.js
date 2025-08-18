//----------------- Setup ------------------------------//
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
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
const { onRequest } = require("firebase-functions/https");

adminApi.use(cors);
adminApi.use(cookieParser);
adminApi.use(validateFirebaseAdminIdToken);
adminApi.use(express.json());

adminApi.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    if (typeof data === "object") {
      return originalSend.call(this, JSON.stringify(data));
    }
    return originalSend.call(this, data);
  };
  next();
});

//---------------- Controllers -------------------------//
//Used to set claims for an admin user
adminApi.post(
  "/set-admin-permissions",
  validateSuperUser,
  adminController.setAdminUserPermissions
);

//------------ Refund and Cancel the customers booking ---------//
adminApi.post("/refund-booking", adminController.refundBooking);

//------------------ Send a booking cancellation email ----------------//
// adminApi.post(
//   "/send-cancellation-email",
//   adminController.sendCancellationEmail
// );

exports.adminApi = onRequest({ region: "australia-southeast1" }, adminApi);
