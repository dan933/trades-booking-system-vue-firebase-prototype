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
  } catch (error) {
    functions.logger.error("Error while setting permissions:", error);
    res.status(500).send({ message: "Error while setting permissions" });
  }
};
