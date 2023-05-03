import config from "./config";
import path from "path";
import fs from "fs";
import axios from "axios";

import express from "express";

import Debug from "debug";
import morgan from "morgan";

import {
  adminRegistrationRoutes,
  authRoutes,
  professorRegistrationRoutes,
  emailVerification,
  studentRegistrationRoutes,
  userRoutes,
  MajorRoutes,
} from "./app";
import connectToDB from "./infrastructure/database";

const debug = Debug("app:startup");

const app = express();

app.use(express.json());
app.use(morgan("common"));

connectToDB().then(() => debug("Database connection established "));

app.use("/", emailVerification);
app.use("/student", studentRegistrationRoutes);
app.use("/professor", professorRegistrationRoutes);
app.use("/admin", adminRegistrationRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/major", MajorRoutes);

const PORT: Number = config.PORT;

app.listen(PORT, function () {
  // read Endpoint configuration file
  const EndpointConfig = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "config", "ServiceMetadata.json"),
      "utf-8"
    )
  );
  const register_url = process.env.SERVICE_DISCOVERY_URL;
  const serviceRegister = () =>
    axios
      .post(`${register_url}/register`, {
        ...EndpointConfig,
        port: PORT,
        url: process.env.HOST,
      })
      .catch((err) => {
        debug("ERROR API registration");
        // console.log(err.response);
      });

  serviceRegister();
  setInterval(() => {
    serviceRegister();
  }, 5 * 1000);
  debug(`🚀 server is running on ${config.NODE_ENV} mode on PORT ${PORT}`);
});
