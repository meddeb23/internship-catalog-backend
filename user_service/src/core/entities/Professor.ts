import User from "./User";

export default class Professor extends User {
  public officeLocation!: string;
  public department!: string;
  constructor(
    id: number | undefined,
    first_name: string | undefined,
    last_name: string | undefined,
    email: string,
    password: string,
    role: string,
    registration_completed: boolean,
    officeLocation: string,
    department: string
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
    this.officeLocation = officeLocation;
    this.department = department;
  }
}
