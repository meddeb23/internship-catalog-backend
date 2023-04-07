export enum Roles {
  Student = "student",
  Admin = "admin",
  Professor = "professor",
}

export default class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
  registration_completed: boolean = false;

  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
    registration_completed: boolean
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.role = role as Roles;
    this.registration_completed = registration_completed;
  }
}
