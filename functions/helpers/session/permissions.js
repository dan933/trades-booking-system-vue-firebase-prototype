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
  } catch (error) {
    functions.logger.error("Error while verifying Firebase ID token:", error);
    res.status(403).send({ message: "Unauthorized" });
    return;
  }
};

exports.validateFirebaseAdminIdToken = async (req, res, next) => {
  functions.logger.log("Check if request is authorized with Firebase ID token");

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
    req.headers.admin &&
    req.headers.admin === "true" &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    await checkSuperUser(req, res, next);
    return;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
    // functions.logger.log("line 85 idtoken", idToken);
  } else if (req.cookies) {
    functions.logger.log('Found "__session" cookie', req.cookies.__session);
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send({ message: "Unauthorized" });
    return;
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((token) => {
      functions.logger.log("ID Token correctly decoded", token);
      req.user = token;
      return next();
    })
    .catch((error) => {
      functions.logger.error("Error while verifying Firebase ID token:", error);
      res.status(403).send({ message: "Unauthorized" });
      return;
    });
};

exports.validateSuperUser = async (req, res, next) => {
  checkSuperUser(req, res, next);
  return;
};

//helpers
function superUserTokenCheck(token) {
  if (token === process.env.ADMIN_TOKEN) {
    return true;
  }

  return false;
}

async function checkSuperUser(req, res, next) {
  //check if the user is a super admin
  //Ability to set admin permissions and claims

  let idToken = req.headers.authorization.split("Bearer ")[1];
  functions.logger.log("Admin Token", idToken);
  const IsSuperUser = superUserTokenCheck(idToken);

  if (IsSuperUser) {
    next();
    return;
  }

  res.status(403).send({ message: "Unauthorized" });
  return;
}
