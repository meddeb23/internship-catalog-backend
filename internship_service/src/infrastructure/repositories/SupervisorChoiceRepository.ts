import { SupervisorChoice, ISupervisorChoiceRepository } from "../../core";

import { ChoiceModel } from "../model";
import { RepoError } from "../../helper";
import { companyApi } from "../api";

export default class SupervisorChoiceRepository
  implements ISupervisorChoiceRepository
{
  #handleError(err: any, action: string) {
    const error = new RepoError("Error in supervisor choice Repository");
    err.errors.forEach((e: any) => {
      error.response.push({
        message: e.message,
        value: e.value,
      });
      error.stack += `\n${action}:\n\t${e.message}\n\tvalue: ${e.value}`;
    });
    throw error;
  }

  #GetEntityFromModel(c: ChoiceModel): SupervisorChoice {
    return new SupervisorChoice(
      c.internshipProcess_id,
      c.supervisor_id,
      c.is_validated,
      c.id
    );
  }

  async getSupervisorChoiceById(enp_id: number): Promise<SupervisorChoice> {
    try {
      const e = await ChoiceModel.findByPk(enp_id);
      if (!e) return null;
      return this.#GetEntityFromModel(e);
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting choice by Pk");
    }
  }

  async getSupervisorChoicesbyStudent(
    student_id: number
  ): Promise<SupervisorChoice[]> {
    const choices = await ChoiceModel.findAll({});

    const res = choices.map((e) => this.#GetEntityFromModel(e));
    return res;
  }

  async save(ch: SupervisorChoice): Promise<void> {
    try {
      /** verify that professor id & process id exist
       * and that we didnt pass 3 choices & the professor limit student
       * when its the third choice step3 process is completed and step=3 */
      const choicesNum = await ChoiceModel.count({
        where: { internshipProcess_id: 1 },
      });
      if (choicesNum < 3) {
        await ChoiceModel.create({ ...ch });
      } else if (choicesNum > 3) {
        console.log("passed limit");
      } else {
        console.log("process completed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async updateSupervisorChoice(
    id: number,
    value: any
  ): Promise<SupervisorChoice> {
    const [row] = await ChoiceModel.update(value, { where: { id } });
    if (row !== 1) return null;
    return this.getSupervisorChoiceById(id);
  }

  async validateSupervisorChoice(ch_id: number): Promise<number> {
    try {
      const [nb_rows] = await ChoiceModel.update(
        { is_validated: true },
        {
          where: {
            id: ch_id,
          },
        }
      );
      return nb_rows;
    } catch (error) {}
  }
}
