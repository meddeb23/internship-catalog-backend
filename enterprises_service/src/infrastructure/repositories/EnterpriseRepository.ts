import { Enterprise, IEnterpriseRepository } from "../../core";
import * as fs from "fs";
import { EnterpriseModel } from "../../model";
import { RepoError } from "../../helper";

export default class EnterpriseRepository implements IEnterpriseRepository {
  #handleError(err: any, action: string) {
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

  #GetEntityFromModel(e: EnterpriseModel): Enterprise {
    return new Enterprise(
      e.company_name,
      e.company_address,
      e.company_city,
      e.company_phone,
      e.company_website,
      e.company_logo_url,
      e.company_linkedin_url,
      e.overview,
      e.specialties,
      e.is_verified,
      e.id
    );
  }

  async getEnterpriseById(enp_id: number): Promise<Enterprise> {
    try {
      const e = await EnterpriseModel.findByPk(enp_id);
      if (!e) return null;
      return this.#GetEntityFromModel(e);
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting company by Pk");
    }
  }

  async verfiyCompany(enp_id: number): Promise<number> {
    try {
      const [nb_rows] = await EnterpriseModel.update(
        { is_verified: true },
        {
          where: {
            id: enp_id,
          },
        }
      );
      return nb_rows;
    } catch (error) {}
  }

  async getEnterprisePage(
    page: number,
    limit: number,
    isVerify?: boolean
  ): Promise<Enterprise[]> {
    const where: any = {};
    if (isVerify) where.is_verified = isVerify;
    console.log(isVerify, where);
    const enps = await EnterpriseModel.findAll({
      offset: (page - 1) * limit,
      limit: limit + 1,
      where,
    });

    const res = enps.map((e) => this.#GetEntityFromModel(e));
    return res;
  }

  async save(enp: Enterprise): Promise<void> {
    try {
      await EnterpriseModel.create({ ...enp });
    } catch (err) {
      this.#handleError(err, "Error inserting company");
    }
  }

  async updateEnterprise(id: number, value: any): Promise<Enterprise> {
    const [row] = await EnterpriseModel.update(value, { where: { id } });
    if (row !== 1) return null;
    return this.getEnterpriseById(id);
  }

  async readFromFiles(): Promise<Array<any>> {
    const directory: string = "src/infrastructure/data/";
    try {
      let enterpriseList: any[] = [];
      const files: string[] = await fs.promises.readdir(directory);
      for (const filename of files) {
        if (filename.endsWith(".json")) {
          const filepath: string = directory + filename;
          const data: string = await fs.promises.readFile(filepath, "utf8");
          const jsonData: any = JSON.parse(data);
          enterpriseList = [...enterpriseList, ...jsonData];
        }
      }
      return enterpriseList;
    } catch (err) {
      console.error(err);
    }
  }
}
