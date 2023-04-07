export default class TechnicalDomain {
  id?: number;
  name: String;
  constructor(name: String, id?: number) {
    this.id = id;
    this.name = name;
  }
}
