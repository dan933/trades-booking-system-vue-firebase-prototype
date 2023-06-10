const admin = require("firebase-admin");
const functions = require("firebase-functions");

exports.test = (req, res) => {
  res.send("Hello from the Admin API");
  return;
};

exports.setAdminUserPermissions = async (req, res) => {
  const { uid, permissions } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, permissions);
    res.status(200).send({ message: "Permissions set successfully" });
    return;
  } catch (error) {
    functions.logger.error("Error while setting permissions:", error);
    res.status(500).send({ message: "Error while setting permissions" });
    return;
  }
};

exports.rescheduleBooking = async (req, res) => {
  try {
    let idToken = req.headers.authorization.split("Bearer ")[1];
    if (!idToken) {
      res.status(403).send({ message: "Unauthorized" });
      return;
    }
    let token = await admin.auth().verifyIdToken(idToken, true);

    res.status(200).send({ message: "Booking rescheduled", token: token });
  } catch (error) {
    res.status(500).send({ error: error?.message || "" });
    return;
  }
};

exports.cancelBooking = async (req, res) => {};

exports.addBooking = async (req, res) => {};
