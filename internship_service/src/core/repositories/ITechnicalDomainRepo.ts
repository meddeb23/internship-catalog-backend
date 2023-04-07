import { TechnicalDomain } from "../entities";
export default interface ITechnicalDomainRepo {
  save: (domain: TechnicalDomain) => Promise<void>;
  getById: (id: number) => Promise<TechnicalDomain>;
  update(id: number, value: any): Promise<TechnicalDomain>;
}
