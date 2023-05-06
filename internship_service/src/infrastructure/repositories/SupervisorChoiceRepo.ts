import {
  SupervisorChoiceModel,
  InternshipProcessModel,
  ProfessorModel,
  UserModel,
} from "../model";
import { RepoError } from "../../helper";
import { companyApi, processStepsUpdateApi } from "../api";
import { ISupervisorChoiceRepo } from "../../core/repositories";
import { Professor, SupervisorChoice } from "../../core/entities";

export default class SupervisorChoiceRepository
  implements ISupervisorChoiceRepo
{
  async create(
    applicationId: number,
    professorId: number[]
  ): Promise<SupervisorChoice[]> {
    console.log("creating");
    const choices = professorId.map((i) => ({
      internshipProcess: applicationId,
      supervisorId: i,
    }));
    console.log(choices);
    const savedChoices = await SupervisorChoiceModel.bulkCreate(choices);
    return this.getApplicationChoices(applicationId);
  }
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

  #GetEntityFromModel(c: SupervisorChoiceModel): SupervisorChoice {
    const professor = new Professor(
      c.professor.user.id,
      c.professor.user.first_name,
      c.professor.user.last_name,
      c.professor.user.email,
      c.professor.user.password,
      c.professor.user.role,
      c.professor.user.registration_completed,
      c.professor.officeLocation,
      c.professor.department
    );
    return new SupervisorChoice(professor, c.id);
  }

  async getApplicationChoices(applicationId: number) {
    const choices = await SupervisorChoiceModel.findAll({
      where: {
        internshipProcess: applicationId,
      },
      include: [{ model: ProfessorModel, include: [UserModel] }],
    });
    return choices.map((c) => this.#GetEntityFromModel(c));
  }

  async getById(
    intershipProcessId: number,
    professorId: number
  ): Promise<SupervisorChoice> {
    // try {
    //   const e = await SupervisorChoiceModel.findOne({
    //     where: {
    //       supervisor: professorId,
    //       intershipProcess: intershipProcessId,
    //     },
    //     include: ProfessorModel,
    //   });
    //   if (!e) return null;
    //   return this.#GetEntityFromModel(e);
    // } catch (err) {
    //   console.log(err);
    //   this.#handleError(err, "Error getting choice by Pk");
    // }
    throw new Error("Not Implemented");
  }

  async update(
    intershipProcessId: number,
    professorId: number,
    value: any
  ): Promise<SupervisorChoice> {
    // const [row] = await SupervisorChoiceModel.update(value, {
    //   where: { supervisor: professorId, intershipProcess: intershipProcessId },
    // });
    // if (row !== 1) return null;
    // return this.getById(intershipProcessId, professorId);
    throw new Error("Not Implemented");
  }
}
