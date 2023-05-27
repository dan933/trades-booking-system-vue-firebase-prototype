const admin = require("firebase-admin");
const functions = require("firebase-functions");
const emailHelper = require("../helpers/public-api-functions/emailHelper.js");

exports.sendBookingConfirmation = async (req, res) => {
  try {
    const emailResponse = await emailHelper.createBookingEmail(req);

    res.send({ message: "working email endpoint" });
  } catch (error) {}
};
