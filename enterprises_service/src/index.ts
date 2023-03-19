import config from "./config";
import express, { Request, Response } from "express";
import Debug from "debug";
import morgan from "morgan";
import sequelize from "./database";

// Import Controlers
import { EnterpriseRoutes } from "./app";

const debug = Debug("app:startup");

const app = express();
app.use(express.json());
app.use(morgan("common"));

(async function () {
  await sequelize.sync({ force: false });
})().then(() => debug("init DB"));

// TestService remove in production !
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world 👋" });
});

app.use("/api/v1/company", EnterpriseRoutes);

const PORT: Number = config.PORT;

app.listen(PORT, () =>
  debug(`server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
