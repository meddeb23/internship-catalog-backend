import config from "./config";
import path from "path";
import fs from "fs";

import express, { Request, Response } from "express";

import Debug from "debug";
import morgan from "morgan";

import sequelize from "./database";
import { authRoutes, registrationRoutes } from "./app";
import axios from "axios";

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
})().then(() => debug("🎈 Database connection established "));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world 👋" });
});

app.use("/", registrationRoutes);
app.use("/auth", authRoutes);

const PORT: Number = config.PORT;

app.listen(PORT, function () {
  const register_url = process.env.SERVICE_DISCOVERY_URL;
  const serviceRegister = () =>
    axios
      .post(`${register_url}/register`, { ...EndpointConfig, port: PORT, url:process.env.HOST })
      .catch((err) => {debug("ERROR API registration");
    console.log(err)});

  serviceRegister();
  setInterval(() => {
    serviceRegister();
  }, 5 * 1000);
  debug(`🚀 server is running on ${config.NODE_ENV} mode on PORT ${PORT}`);
});
