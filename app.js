const cookieParser = require("cookie-parser");
const express = require("express");
const jwt = require("jsonwebtoken");

const authorize = require("./authorization-middleware");
const config = require("./config");

const app = express();
app.use(cookieParser());

const port = process.env.PORT || 8080;

// Routes
app.get("/token", (req, res) => {
  // Create Dummy JWT payload, this should come from another service and be accurate for a user
  // WARNING: This assumes the user has been authenticated!!
  const payload = {
    name: "Jimmy",
    scopes: ["customers:read"]
  };

  const token = jwt.sign(payload, config.JWT_SECRET);

  // Split token into array to set onto cookies
  const arrayToken = token.split(".");

  // Set cookie
  res.cookie(config.JWT_PAYLOAD_COOKIE_KEY, `${arrayToken[0]}.${arrayToken[1]}`, config.JWT_PAYLOAD_COOKIE_OPTIONS); // header.payload
  res.cookie(config.JWT_SIGNATURE_COOKIE_KEY, `${arrayToken[2]}`, config.JWT_SIGNATURE_COOKIE_OPTIONS); // signature

  // We're also sending the token in the response, it's up to you
  res.send(token);
});

app.get("/customers", authorize(), (req, res) => {
  res.send("Customers results");
});

const server = app.listen(port, () => {
  console.log(`Server is listening on ${server.address().port}`);
});