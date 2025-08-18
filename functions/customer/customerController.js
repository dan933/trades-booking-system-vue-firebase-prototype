// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
//--------------------- Gets the customers details ------------------//
exports.getCustomerDetails = async (req, res) => {
  functions.logger.log("req", req);

  const orgId = req.params.orgId;

  const userDetails = await admin
    .firestore()
    .collection("organisations")
    .doc(`${orgId}`)
    .collection("users")
    .doc(`${req.user.sub}`)
    .get();

  res.send(userDetails.data());
};

//------------------------ Update customer details ------------------------------//
exports.updateCustomerDetails = async (req, res) => {
  const orgId = req.params.orgId;

  const requestBody = req.body;
  console.log("requestBody line 27 customer controller", requestBody);

  //user details ref
  admin
    .firestore()
    .collection("organisations")
    .doc(`${orgId}`)
    .collection("users")
    .doc(`${req.user.sub}`)
    .set(requestBody, { merge: true })
    .then(async (resp) => {
      await res.send(resp);
    })
    .catch(async (err) => {
      await res.send(err);
    });
};
