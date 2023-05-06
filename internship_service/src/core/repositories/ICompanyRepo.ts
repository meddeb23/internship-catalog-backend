import { Company } from "../entities";
export default interface ICompanyRepo {
  create(companyName: string): Promise<Company>;
  getById: (id: number) => Promise<Company>;
  update(id: number, value: any): Promise<Company>;
}
