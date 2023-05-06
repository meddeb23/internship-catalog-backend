import { CompanyModel } from "../model";
import { RepoError } from "../../helper";
import { ICompanyRepo } from "../../core/repositories";
import { Company } from "../../core/entities";

export default class CompanyRepo implements ICompanyRepo {
  async create(companyName: string): Promise<Company> {
    const company = await CompanyModel.create({ company_name: companyName });
    if (!company) return null;
    return this.getEntityFromModel(company);
  }
  private handleError(err: any, action: string) {
    const error = new RepoError("Error in Enterprise Repository");
    err.errors.forEach((e: any) => {
      error.response.push({
        message: e.message,
        value: e.value,
      });
      error.stack += `\n${action}:\n\t${e.message}\n\tvalue: ${e.value}`;
    });
    throw error;
  }

  private getEntityFromModel(e: CompanyModel): Company {
    return new Company(
      e.id,
      e.company_name,
      e.company_address,
      e.company_city,
      e.company_phone,
      e.company_website,
      e.company_logo_url,
      e.company_linkedin_url,
      e.overview,
      e.specialties,
      e.is_verified
    );
  }

  async getById(enp_id: number): Promise<Company> {
    try {
      const e = await CompanyModel.findByPk(enp_id);
      if (!e) return null;
      return this.getEntityFromModel(e);
    } catch (err) {
      console.log(err);
      this.handleError(err, "Error getting company by Pk");
    }
  }

  async update(id: number, value: any): Promise<Company> {
    const [row] = await CompanyModel.update(value, { where: { id } });
    if (row !== 1) return null;
    return this.getById(id);
  }
}
