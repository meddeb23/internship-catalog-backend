import { ChoiceModel, InternshipprocessModel, ProfessorModel } from "../model";
import { RepoError } from "../../helper";
import { companyApi, processStepsUpdateApi } from "../api";
import { ISupervisorChoiceRepo } from "../../core/repositories";
import { SupervisorChoice } from "../../core/entities";

export default class SupervisorChoiceRepository
  implements ISupervisorChoiceRepo
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
    // const supervisors: Array<ProfessorModel> = c.supervisor
    return new SupervisorChoice(c.id, c.supervisor);
  }

  async getById(
    intershipProcessId: number,
    professorId: number
  ): Promise<SupervisorChoice> {
    try {
      const e = await ChoiceModel.findOne({
        where: {
          supervisor: professorId,
          intershipProcess: intershipProcessId,
        },
        include: ProfessorModel,
      });
      if (!e) return null;
      return this.#GetEntityFromModel(e);
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting choice by Pk");
    }
  }

  async save(ch: SupervisorChoice): Promise<void> {
    try {
      await ChoiceModel.create({ ...ch });
    } catch (err) {
      this.#handleError(err, "Error in save");
    }
  }

  async update(
    intershipProcessId: number,
    professorId: number,
    value: any
  ): Promise<SupervisorChoice> {
    const [row] = await ChoiceModel.update(value, {
      where: { supervisor: professorId, intershipProcess: intershipProcessId },
    });
    if (row !== 1) return null;
    return this.getById(intershipProcessId, professorId);
  }
}
