import config from "./config";

import express, { Request, Response } from "express";

import Debug from "debug";
import morgan from "morgan";

import sequelize from "./database";
import { QueueListener } from "./infrastructure";
import { VerificationEmailControler } from "./app/controlers";

const debug = Debug("app:startup");

const app = express();

app.use(express.json());
app.use(morgan("common"));

// (async function () {
//   await sequelize.sync({ force: false });
// })().then(() => debug("init DB"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world 👋" });
});

const queue = new QueueListener(
  config.Q_URL,
  "verificationEmail",
  new VerificationEmailControler()
);
queue.execute();

const PORT: Number = config.PORT;

app.listen(PORT, () =>
  debug(`server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
