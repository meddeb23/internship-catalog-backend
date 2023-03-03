export default class User {
  id: number | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  email: string;
  password: string;
  email_verification_status: boolean = false;

  constructor(
    id: number | undefined,
    first_name: string | undefined,
    last_name: string | undefined,
    email: string,
    password: string,
    email_verification_status: boolean
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.email_verification_status = email_verification_status;
  }
}
