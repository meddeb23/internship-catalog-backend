import { ProfessorModel } from "../model";
import { RepoError } from "../../helper";
import { ISupervisorRepo } from "../../core/repositories";
import { Professor, SupervisorChoice } from "../../core/entities";

export default class SupervisorRepository implements ISupervisorRepo {
  #handleError(err: any, action: string) {
    const error = new RepoError("Error in supervisor Repository");
    err.errors.forEach((e: any) => {
      error.response.push({
        message: e.message,
        value: e.value,
      });
      error.stack += `\n${action}:\n\t${e.message}\n\tvalue: ${e.value}`;
    });
    throw error;
  }

  #GetEntityFromModel(p: ProfessorModel): Professor {
    return new Professor();
  }

  async getById(id: number): Promise<Professor> {
    try {
      const e = await ProfessorModel.findByPk(id);
      if (!e) return null;
      return this.#GetEntityFromModel(e);
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting choice by Pk");
    }
  }
}
