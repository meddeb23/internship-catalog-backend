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
        logger.info(`service removed: ${this.services[k].service_name} => ${this.services[k].service_address}:${this.services[k].service_port}`)
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
    if (!this.services[key]) logger.info(`service registration: ${service_name} => ${service_address}:${service_port}`)
    this.services[key] = new Service(
      service_name,
      service_version,
      service_port,
      service_address,
      endpoints
    );
    return this.services[key];
  }

  unregister(service_name, service_version) {
    this.cleanup();

    const service =
      this.services[this.getServiceKey(service_name, service_version)];
    if (!service) return
    logger.info(`service removed: ${service.service_name} => ${service.service_address}:${service.service_port}`)
    delete this.services[this.getServiceKey(service_name, service_version)];
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
