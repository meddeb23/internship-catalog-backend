import config from "./config";

import express, { Request, Response } from "express";

import Debug from "debug";
import morgan from "morgan";

import sequelize from "./database";
import { authRoutes, userRoute } from "./user";
import { UserModel } from "./model";

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

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoutes);

const PORT: Number = config.PORT;

app.listen(PORT, () =>
  debug(`🚀 server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
