import { SupervisorChoice, ISupervisorChoiceRepository } from "../../core";
const { Op } = require("sequelize");
import { ChoiceModel, InternshipprocessModel } from "../model";
import { RepoError } from "../../helper";
import { companyApi, processStepsUpdateApi } from "../api";

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

  async getSupervisorChoicesbyStudent(): //student_id: number
  Promise<SupervisorChoice[]> {
    InternshipprocessModel.hasMany(ChoiceModel, {
      foreignKey: "internshipProcess_id",
    });
    ChoiceModel.belongsTo(InternshipprocessModel, {
      foreignKey: "internshipProcess_id",
    });

    const choices = await ChoiceModel.findAll({
      include: [InternshipprocessModel],
      /*  where: { 
        student_id:  , 
      },*/
    });
    console.log(choices);
    // const res = choices.map((e) => this.#GetEntityFromModel(e));
    return;
  }

  async save(ch: SupervisorChoice): Promise<void> {
    try {
      /** verify that professor id & process id exist
       * and that its not the same supervisor
       * and that we didnt pass 3 choices & the professor limit student
       * when its the third choice step3 process is completed and step=3 */

      const dublicatedSupervisor = await ChoiceModel.count({
        where: {
          [Op.and]: [
            { internshipProcess_id: ch.internshipProcess_id },
            { supervisor_id: ch.supervisor_id },
          ],
        },
      });
      if (!dublicatedSupervisor) {
        const choicesNum = await ChoiceModel.count({
          where: { internshipProcess_id: ch.internshipProcess_id },
        });
        if (choicesNum < 3) {
          await ChoiceModel.create({ ...ch });
        } else if (choicesNum > 3) {
          console.log("passed limit");
        } else {
          console.log("process completed");
          const [process, processerror] =
            await processStepsUpdateApi.GetProcess(1);
          const step = process.data.internProcess.step;
          const [Completeprocess, error] =
            await processStepsUpdateApi.UpdateProcessStep(1, step);
          console.log("===============Completeprocess=====================");
          console.log(Completeprocess);
          console.log("====================================");
          //
        }
      } else {
        console.log("duplicated supervisor");
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
