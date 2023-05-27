const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.validateFirebaseIdToken = async (req, res, next) => {
  functions.logger.log("Check if request is authorized with Firebase ID token");
  functions.logger.log("req", req);
  functions.logger.log("req", req.headers.guest);

  if (req.headers.guest && req.headers.guest === "true") {
    functions.logger.log("Guest User");
    next();
    return;
  }

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    functions.logger.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header."
    );
    res.status(403).send({ message: "Unauthorized" });
    return;
  }

  let idToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    functions.logger.log('Found "__session" cookie', req.cookies.__session);
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;

    //todo add a continue as guest option
  } else {
    // No cookie
    res.status(403).send({ message: "Unauthorized" });
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    functions.logger.log("ID Token correctly decoded", decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error("Error while verifying Firebase ID token:", error);
    res.status(403).send({ message: "Unauthorized" });
    return;
  }
};
