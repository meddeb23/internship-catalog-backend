import config from "./config";
import path from "path";
import fs from "fs";

import express, { Request, Response } from "express";

import Debug from "debug";
import morgan from "morgan";

import sequelize from "./database";
import { authRoutes, registrationRoutes } from "./app";
import { UserModel } from "./model";
import axios from "axios";
import { AddressInfo } from "net";

// read Endpoint configuration file
const EndpointConfig = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "config", "ServiceMetadata.json"),
    "utf-8"
  )
);

const debug = Debug("app:startup");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

(async function () {
  await sequelize.sync({ force: false });
  // await UserModel.create({
  //   first_name: "joe",
  //   last_name: "doe",
  //   email: "email@example.com",
  //   password: "password",
  // });
})().then(() => debug("init DB"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world 👋" });
});

app.use("/api/v1/user", registrationRoutes);
app.use("/api/v1/auth", authRoutes);

// const PORT: Number = config.PORT;

app.listen(0);

var listener = app.listen(0, function () {
  const register_url = process.env.SERVICE_DISCOVERY_URL;
  const { port: PORT } = listener.address() as AddressInfo;

  const serviceRegister = () =>
    axios
      .post(`${register_url}/register`, { ...EndpointConfig, port: PORT })
      .catch((err) => 0);

  serviceRegister();
  setInterval(() => {
    serviceRegister();
  }, 5 * 1000);
  debug(`🚀 server is running on ${config.NODE_ENV} mode on PORT ${PORT}`);
});
