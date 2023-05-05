import path from "path"

import dotenv from "dotenv";

dotenv.config();

import express, { json } from "express";
import Registery from "../lib/registery.js";
import ip from "ip-address";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import helmet from "helmet";

import RequestHandler from "../lib/RequestHandler.js";
import ServiceRegisteryRequestSchema from "../helper/ServiceRegisteryRequestValidation.js";
import logger from "../lib/Logger.js"

const app = express();
app.use(json());
app.use(fileUpload());
app.use(helmet());
app.use((req, res, next) => {
  req.logger = logger;
  next();
});
app.use(morgan("common", {
  stream: { write: (message) => logger.http(message) },
  skip: (req, res) => req.path === "/register"
}));

const registery = new Registery();
const requestHandler = new RequestHandler();

app.get("/", (req, res) => res.send('<h1>hello world</h1>'))

app.post("/register", (req, res) => {
  const { value, error } = ServiceRegisteryRequestSchema.validate(req.body);
  if (error) {
    console.log(error)
    return res.status(400).json(error);
  }

  const { name, version, port, endpoints, url } = value;
  const a = new ip.Address6(req.socket.remoteAddress);
  const service = registery.register(
    name,
    version,
    port,
    url,
    endpoints
  );
  res.json(service);
});

app.get("/public/*", async (req, res) => {
  const { 0: path } = req.params;
  const service = registery.get("cdn", "1.0.0");
  if (!service)
    return res.status(404).json({ message: "service not found 😢" });
  try {
    const { data, status } = await requestHandler.requestFile(req, res, path, service);
    if (status == 200) data.pipe(res);
    else res.status(status).end();
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).end();
    }
    return res.status(500).end();
  }
});

app.all("/:service_name/:service_version/*", async (req, res) => {
  const { service_name, service_version, 0: path } = req.params;
  const service = registery.get(service_name, service_version);
  if (!service) {
    req.logger.warn(`service not found, service name: ${service_name}-${service_version}`)
    return res.status(404).json({ message: "service not found 😢" });
  }
  try {
    const { data, status } = await requestHandler.routingRequest(req, res, path, service);
    return res.status(status).json(data);
  } catch (err) {
    const error = new Error();
    console.log('stack: ', err.stack);
    if (process.env.NODE_ENV !== "development")
      return res.status(500).send("Something Went wrong 🍥");

    if (err.response) {
      return res.status(err.response.status).send(err.response.data);
    }
    return res.status(500).json({ stack: err.stack + "🍥" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`getway is runnning on port ${PORT} in ${process.env.NODE_ENV} mode`));
