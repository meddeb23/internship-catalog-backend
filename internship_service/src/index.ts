import config from "./config";
import path from "path";
import fs from "fs";
import axios from "axios";
import express, { Request, Response } from "express";
import Debug from "debug";
import morgan from "morgan";
import sequelize from "./infrastructure/database";

// Import Controlers
import { InternshipProcessRoutes } from "./app";
import connectToDB from "./infrastructure/database";

const debug = Debug("app:startup");

const app = express();
app.use(express.json());
app.use(morgan("common"));

connectToDB().then(() => debug("Database connection established"));

// TestService remove in production !
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "internship process service🎓" });
});

app.use("/", InternshipProcessRoutes);

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
