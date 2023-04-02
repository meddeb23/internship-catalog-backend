import User from "./User";

export default class Admin extends User {
  public jobTitle!: string;
  public department!: string;
  constructor(
    id: number | undefined,
    first_name: string | undefined,
    last_name: string | undefined,
    email: string,
    password: string,
    role: string,

    registration_completed: boolean,
    jobTitle: string,
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
    this.jobTitle = jobTitle;
    this.department = department;
  }
}
