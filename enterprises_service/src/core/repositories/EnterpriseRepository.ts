import Enterprise from "../entities/Enterprise";

export default interface IEnterpriseRepository {
  getCompaniesName(query: string, limit?: number): Promise<Enterprise[]>;
  getEnterpriseById: (enp_id: number) => Promise<Enterprise>;
  save: (enp: Enterprise) => Promise<void>;
  getEnterprisePage: (
    page: number,
    limit: number,
    isVerify?: boolean
  ) => Promise<Array<Enterprise>>;
  readFromFiles: () => Promise<Array<any>>;
  verfiyCompany(enp_id: number): Promise<number>;
  updateEnterprise(id: number, value: any): Promise<Enterprise>;
}
