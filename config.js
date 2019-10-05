module.exports = {
  JWT_SECRET: "my super secret key",
  JWT_PAYLOAD_COOKIE_KEY: "_p",
  JWT_SIGNATURE_COOKIE_KEY: "_s",
  JWT_PAYLOAD_COOKIE_OPTIONS: {
    maxAge: 1000 * 60 * 30, // expires after 30 minutes
    sameSite: true
    // secure: true // TODO: Set to true when not on localhost
  },
  JWT_SIGNATURE_COOKIE_OPTIONS: {
    httpOnly: true, // The cookie only accessible by the web server
    sameSite: true
    // secure: true // TODO: Set to true when not on localhost
  }
};