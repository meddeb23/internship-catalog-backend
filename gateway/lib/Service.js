export default class Service {
  constructor(
    service_name,
    service_version,
    service_port,
    service_address,
    endpoints
  ) {
    this.name = service_name;
    this.version = service_version;
    this.port = service_port;
    this.ip = service_address;
    this.registertime = Date.now();
    this.endpoints = endpoints;
  }
}
