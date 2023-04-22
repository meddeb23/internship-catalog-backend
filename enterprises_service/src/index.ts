import config from "./config";
import express, { Request, Response } from "express";
import Debug from "debug";
import morgan from "morgan";
import connectToDB from "./database";

// Import Controlers
import { EnterpriseRoutes, ReviewControler } from "./app";

const debug = Debug("app:startup");

const app = express();
app.use(express.json());
app.use(morgan("common"));

connectToDB().then(() => debug("Database connection established"));

// TestService remove in production !
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world 👋" });
});

app.use("/company", EnterpriseRoutes);
app.use("/review", ReviewControler);

const PORT: Number = config.PORT;

app.listen(PORT, () =>
  debug(`server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
