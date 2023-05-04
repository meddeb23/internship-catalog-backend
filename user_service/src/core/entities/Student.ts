import User from "./User";

export default class Student extends User {
  public address!: string;
  public major!: string;
  constructor(
    id: number | undefined,
    first_name: string | undefined,
    last_name: string | undefined,
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

  format() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      major: this.major,
      registration_completed: this.registration_completed,
    };
  }
}
