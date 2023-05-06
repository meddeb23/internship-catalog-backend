import TechnicalDomain from "./TechnicalDomain";
import User from "./User";

export default class Professor extends User {
  officeLocation: string | null;
  department: string;
  preferedDomains?: Array<TechnicalDomain> | null;
  SFE_limit: number;
  PFE_limit: number;
  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
    registration_completed: boolean,
    officeLocation: string | null,
    department: string,
    preferedDomains?: Array<TechnicalDomain> | null,
    SFE_limit: number = 8,
    PFE_limit: number = 8
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
    this.preferedDomains = preferedDomains;
    this.SFE_limit = SFE_limit;
    this.PFE_limit = PFE_limit;
  }
}
