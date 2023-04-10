import chalk from "chalk";
import Service from "./Service.js";
import logger from "./Logger.js";

class Registery {
  constructor() {
    this.services = {};
    this.log = (s, c) => console.log(`${chalk.blue(s)}: `, c);
    this.timeout = 1000 * 10;
  }

  cleanup() {
    const now = Date.now();
    Object.keys(this.services).forEach((k) => {
      if (now - this.services[k].registertime > this.timeout) {
        this.log("registery removed", this.services[k]);
        logger.info(`registery removed`, {
          service_name: this.services[k].service_name,
          service_version: this.services[k].service_version,
          service_port: this.services[k].service_port,
          service_address: this.services[k].service_address,
        })
        delete this.services[k];
      }
    });
  }

  getServiceKey(service_name, service_version) {
    return service_name + service_version;
  }

  register(
    service_name,
    service_version,
    service_port,
    service_address,
    endpoints
  ) {
    this.cleanup();
    const key = this.getServiceKey(service_name, service_version);
    if (!this.services[key]) logger.info(`service registration`, {
      service_name,
      service_version,
      service_port,
      service_address,
    })
    this.services[key] = new Service(
      service_name,
      service_version,
      service_port,
      service_address,
      endpoints
    );

    // this.log("service added", this.services[key]);
    return this.services[key];
  }

  unregister(service_name, service_version) {
    this.cleanup();

    const service =
      this.services[this.getServiceKey(service_name, service_version)];
    delete this.services[this.getServiceKey(service_name, service_version)];
    this.log("service removed", service);

    return service;
  }

  get(service_name, service_version) {
    this.cleanup();
    return (
      this.services[this.getServiceKey(service_name, service_version)] || null
    );
  }
}

export default Registery;
