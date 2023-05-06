import { ProfessorModel, UserModel } from "../model";
import { RepoError } from "../../helper";
import { ISupervisorRepo } from "../../core/repositories";
import { Professor, SupervisorChoice } from "../../core/entities";

export default class SupervisorRepository implements ISupervisorRepo {
  async findAll(id: number[]): Promise<Professor[]> {
    const professors = await ProfessorModel.findAll({
      where: {
        id,
      },
      include: [UserModel],
    });
    return professors.map((p) => this.#GetEntityFromModel(p));
  }

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
    return new Professor(
      p.user.id,
      p.user.first_name,
      p.user.last_name,
      p.user.email,
      p.user.password,
      p.user.role,
      p.user.registration_completed,
      p.officeLocation,
      p.department
    );
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
