import User from "./User";

export default class Student extends User {
  address: string;
  major: string;
  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
    registration_completed: boolean,
    address: string,
    major: string
  ) {
    super(
      id,
      first_name,
      last_name,
      email,
      password,
      role,
      registration_completed
    );
    this.address = address;
    this.major = major;
  }
}
