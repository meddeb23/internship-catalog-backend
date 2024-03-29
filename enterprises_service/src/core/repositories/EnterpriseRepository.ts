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
  likeCompany(userId: number, companyId: number): Promise<boolean>;
  unlikeCompany(userId: number, companyId: number): Promise<boolean>;
  isLikedCompany(userId: number, companyId: number): Promise<boolean>;
  saveCompany(userId: number, companyId: number): Promise<boolean>;
  unsaveCompany(userId: number, companyId: number): Promise<boolean>;
  isSavedCompany(userId: number, companyId: number): Promise<boolean>;
}
