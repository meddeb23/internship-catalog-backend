import { InternshipProcess, IInternshipProcessRepository } from "../../core";

import { InternshipprocessModel } from "../model";
import { RepoError } from "../../helper";
import { companyApi } from "../api";

export default class InternshipProcessRepository
  implements IInternshipProcessRepository
{
  #handleError(err: any, action: string) {
    const error = new RepoError("Error in InternshipProcess Repository");
    err.errors.forEach((e: any) => {
      error.response.push({
        message: e.message,
        value: e.value,
      });
      error.stack += `\n${action}:\n\t${e.message}\n\tvalue: ${e.value}`;
    });
    throw error;
  }

  #GetEntityFromModel(i: InternshipprocessModel): InternshipProcess {
    return new InternshipProcess(
      i.student_id,
      i.company_id,
      i.intern_department,
      i.intern_company_supervisor_name,
      i.intern_company_supervisor_address,
      i.intern_company_supervisor_phone,
      i.step,
      i.id
    );
  }

  async getInternshipProcessById(enp_id: number): Promise<InternshipProcess> {
    try {
      const e = await InternshipprocessModel.findByPk(enp_id);
      if (!e) return null;
      return this.#GetEntityFromModel(e);
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting process by Pk");
    }
  }

  async getInternshipProcessPage(
    page: number,
    limit: number
  ): Promise<InternshipProcess[]> {
    const enps = await InternshipprocessModel.findAll({
      offset: (page - 1) * limit,
      limit: limit + 1,
    });

    const res = enps.map((e) => this.#GetEntityFromModel(e));
    return res;
  }

  async save(enp: InternshipProcess, companyName: String): Promise<void> {
    try {
      const idCompany = enp.company_id;
      // If company_id is null, create a new company with the given name in path param
      if (idCompany === null) {
        const company_name = companyName;
        const [newCompany, error] = await companyApi.SaveCompany(company_name);
        enp.company_id = newCompany.data.enp.company_id;
        // Create the new internship with the updated company_id
        await InternshipprocessModel.create({ ...enp });
      } else {
        // Check if a company with the given id already exists
        const [existingCompany, error] = await companyApi.GetCompany(idCompany);
        if (existingCompany.status !== 200) {
          console.log("company does not exist");
          return;
        } else {
          await InternshipprocessModel.create({ ...enp });
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async updateInternshipProcess(
    id: number,
    value: any
  ): Promise<InternshipProcess> {
    const [row] = await InternshipprocessModel.update(value, { where: { id } });
    if (row !== 1) return null;
    return this.getInternshipProcessById(id);
  }
}
