require("express-async-errors");
const axios = require("axios");
const express = require("express");
const debug = require("debug")("app:startup");
const path = require("path");
const app = express();

// Set env variable
require("dotenv").config({
  path: path.join(process.cwd(), "/config/.env"),
});

// Mongosse database
require("./database/db");

require("./start/routes")(app);

app.listen(0);

var listener = app.listen(0, function () {
  const register_url = process.env.REGISTER_URL;
  const serviceRegister = () =>
    axios
      .post(register_url + "/user/1.0.0/" + listener.address().port)
      .catch((err) => 0);

  serviceRegister();
  setInterval(() => {
    serviceRegister();
  }, 5 * 1000);

  console.log(
    `Server is running in ${process.env.NODE_ENV} on Port ${
      listener.address().port
    }`
  );
});
