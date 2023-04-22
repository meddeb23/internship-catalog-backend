export default class User {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;

  constructor(id: number, firstName: string, lastName: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
