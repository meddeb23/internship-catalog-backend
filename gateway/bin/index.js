import express, { json } from "express";
import Registery from "../lib/registery.js";
import ip from "ip-address";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import helmet from "helmet";

import { routingRequest, requestFile } from "../lib/RequestHandler.js";
import ServiceRegisteryRequestSchema from "../helper/ServiceRegisteryRequestValidation.js";

const app = express();
app.use(json());
app.use(morgan("dev"));
app.use(fileUpload());
app.use(helmet());

const registery = new Registery();

app.post("/register", (req, res) => {
  const { value, error } = ServiceRegisteryRequestSchema.validate(req.body);
  if (error) return res.status(400).json(error);

  const { name, version, port, endpoints } = value;
  const a = new ip.Address6(req.socket.remoteAddress);

  const service = registery.register(
    name,
    version,
    port,
    a.to4().address,
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
    const { data, status } = await requestFile(req, res, path, service);
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
  if (!service)
    return res.status(404).json({ message: "service not found 😢" });
  // res.redirect(`http://${service.ip}:${service.port}/${path}`);
  try {
    const { data, status } = await routingRequest(req, res, path, service);
    return res.json(data).status(status);
  } catch (err) {
    console.log(err.stack);
    if (err.response)
      return res.status(err.response.status).send(err.response.data);
    return res.json({ stack: err.stack + "🍥" }).status(500);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`getway is runnning on port ${PORT}`));