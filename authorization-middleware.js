const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = (credentials = []) => {
  return (req, res, next) => {
    // Allow for string or Array
    if (typeof credentials === "string") {
      credentials = [credentials];
    }

    // API Processing
    // Find JWT token in headers
    const tokenHeader = req.headers["authorization"];

    // Browser Processing
    // Find JWT token in cookies
    const tokenPayloadCookie = req.cookies[config.JWT_PAYLOAD_COOKIE_KEY];
    const tokenSignatureCookie = req.cookies[config.JWT_SIGNATURE_COOKIE_KEY];

    let tokenStr = null;

    if (tokenPayloadCookie && tokenSignatureCookie) { // Cookie processing
      // Assemble 2 cookies then validate
      tokenStr = `${tokenPayloadCookie}.${tokenSignatureCookie}`;

    } else if (tokenHeader) { // Header Processing
      // Bearer yhju7uyu...
      const arrayHeader = tokenHeader.split(" ");

      if (arrayHeader[0] !== "Bearer") {

        // Invalid token type error. Token should be a 'Bearer' Token
        return res.status(401).send("Access Denied: Invalid Token");

      } else {
        tokenStr = arrayHeader[1];
      }

    } else {
      return res.status(401).send("Access Denied: Invalid Credentials");
    }

    // Check if we have something to validate
    if (!tokenStr) {
      return res.status(401).send("Access Denied");
    } else {
      // Validate JWT
      jwt.verify(tokenStr, config.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(`Error validating JWT: ${err}`);
          return res.status(401).send("Error: Access Denied");
        }

        // Reset Payload Cookie expiration time
        res.cookie(config.JWT_PAYLOAD_COOKIE_KEY, tokenPayloadCookie, config.JWT_PAYLOAD_COOKIE_OPTIONS);

        if (credentials.length > 0) {
          if (decoded.scopes && decoded.scopes.length && credentials.some(cred => decoded.scopes.indexOf(cred) >= 0)) {
            next();
          } else {
            return res.status(401).send("Error: Access Denied, no credentials");
          }
        } else {
          console.log("no credentials required for route, just authentication");
          // User is authenticated and there are no credentials to check for authorization
          next();
        }
      });
    }
  };
};