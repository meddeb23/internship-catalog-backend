import { InternshipprocessModel } from "../model";
import { RepoError } from "../../helper";

import { IInternshipProcessRepo } from "../../core/repositories";
import { InternshipProcess } from "../../core/entities";

export default class InternshipProcessRepo implements IInternshipProcessRepo {
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

  // #GetEntityFromModel(i: InternshipprocessModel): InternshipProcess {
  //   i.ge
  //   return new InternshipProcess(
  //     i.studentId,
  //     i.companyId,
  //     i.department,
  //     i.companySupervisorName,
  //     i.companySupervisorAddress,
  //     i.companySupervisorPhone,
  //     i.choices,
  //     i.universitySupervisor,
  //     i.codeSujet
  //   );
  // }

  async getById(codeSujet: string): Promise<InternshipProcess> {
    try {
      const e = await InternshipprocessModel.findByPk(codeSujet);
      if (!e) return null;
      // return this.#GetEntityFromModel(e);
      return null;
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting process by Pk");
    }
  }

  async getByPage(page: number, limit: number): Promise<InternshipProcess[]> {
    const enps = await InternshipprocessModel.findAll({
      offset: (page - 1) * limit,
      limit: limit + 1,
    });

    // const res = enps.map((e) => this.#GetEntityFromModel(e));
    // return res;
    return null;
  }

  async save(enp: InternshipProcess): Promise<void> {
    try {
      await InternshipprocessModel.create({ ...enp });
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async update(codeSujet: string, value: any): Promise<InternshipProcess> {
    const [row] = await InternshipprocessModel.update(value, {
      where: { codeSujet },
    });
    if (row !== 1) return null;
    return this.getById(codeSujet);
  }
}
