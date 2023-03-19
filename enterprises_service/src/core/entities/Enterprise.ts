export default class Enterprise {
  id?: number;
  company_name: string;
  company_address: string | null;
  company_city: string | null;
  company_phone: string | null;
  company_website: string | null;
  company_logo_url: string | null;
  company_linkedin_url: string | null;
  overview: string | null;
  specialties: string | null;
  is_verified: boolean;

  constructor(
    company_name: string,
    company_address: string | null,
    company_city: string | null,
    company_phone: string | null,
    company_website: string | null,
    company_logo_url: string | null,
    company_linkedin_url: string | null,
    overview: string | null,
    specialties: string | null,
    is_verified: boolean = false,
    id?: number
  ) {
    this.company_name = company_name;
    this.company_address = company_address;
    this.company_city = company_city;
    this.company_phone = company_phone.replace(/\s+/g, "");
    this.company_website = company_website;
    this.company_logo_url = company_logo_url;
    this.company_linkedin_url = company_linkedin_url;
    this.overview = overview;
    this.specialties = specialties;
    this.is_verified = is_verified;
    this.id = id;
  }
}
