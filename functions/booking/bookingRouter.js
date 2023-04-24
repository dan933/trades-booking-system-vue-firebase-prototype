const express = require("express");

const router = express.Router();

const bookingController = require("./bookingController.js");

router.get("/get-availability", bookingController.getAvailability);

module.exports = router;
