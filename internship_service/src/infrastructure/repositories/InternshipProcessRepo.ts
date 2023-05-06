import { InternshipProcessModel } from "../model";
import { RepoError } from "../../helper";

import { IInternshipProcessRepo } from "../../core/repositories";
import { InternshipProcess } from "../../core/entities";

export default class InternshipProcessRepo implements IInternshipProcessRepo {
  async getByStudent(studentId: number): Promise<InternshipProcess> {
    try {
      const e = await InternshipProcessModel.findOne({
        where: {
          studentId,
        },
      });
      if (!e) return null;
      return this.getEntityFromModel(e);
      return null;
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting process by Pk");
    }
  }
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

  private getEntityFromModel(i: InternshipProcessModel): InternshipProcess {
    return new InternshipProcess(
      i.id,
      i.department,
      i.companySupervisorName,
      i.companySupervisorAddress,
      i.companySupervisorPhone
    );
  }

  async getById(id: number): Promise<InternshipProcess> {
    try {
      const e = await InternshipProcessModel.findByPk(id);
      if (!e) return null;
      // return this.#getEntityFromModel(e);
      return null;
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting process by Pk");
    }
  }

  async getByPage(page: number, limit: number): Promise<InternshipProcess[]> {
    const enps = await InternshipProcessModel.findAll({
      offset: (page - 1) * limit,
      limit: limit + 1,
    });

    // const res = enps.map((e) => this.#getEntityFromModel(e));
    // return res;
    return null;
  }

  async create(
    studentId: number,
    companyId: number,
    department: string,
    companySupervisorName: string,
    companySupervisorAddress: string,
    companySupervisorPhone: string
  ): Promise<InternshipProcess> {
    const application = await InternshipProcessModel.create({
      studentId,
      companyId,
      department,
      companySupervisorName,
      companySupervisorAddress,
      companySupervisorPhone,
    });
    return this.getEntityFromModel(application);
  }

  async update(id: number, value: any): Promise<InternshipProcess> {
    const [row] = await InternshipProcessModel.update(value, {
      where: { id },
    });
    if (row !== 1) return null;
    return this.getById(id);
  }
}
