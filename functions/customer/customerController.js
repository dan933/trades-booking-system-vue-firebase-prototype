// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const functions = require("firebase-functions");

exports.getCustomerDetails = async (req, res) => {
  functions.logger.log("req", req);
  const userDetails = await admin
    .firestore()
    .collection("organisations")
    .doc("Okq3IGUln18QM90ObeI4")
    .collection("users")
    .doc(`${req.user.sub}`)
    .get();

  res.send(userDetails.data());
};
