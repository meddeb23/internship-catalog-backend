import { Company } from "../entities";
export default interface ICompanyRepo {
  save: (company: Company) => Promise<void>;
  getById: (id: number) => Promise<Company>;
  update(id: number, value: any): Promise<Company>;
}
