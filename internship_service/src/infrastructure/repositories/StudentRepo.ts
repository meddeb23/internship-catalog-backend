import { StudentModel } from "../model";
import { RepoError } from "../../helper";
import { IStudentRepo } from "../../core/repositories";
import { Student } from "../../core/entities";

export default class StudentRepository implements IStudentRepo {
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

  // #GetEntityFromModel(s: StudentModel): Student {
  //   return new Student();
  // }

  async getById(id: number): Promise<Student> {
    try {
      const e = await StudentModel.findByPk(id);
      if (!e) return null;
      // return this.#GetEntityFromModel(e);
      return null;
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting choice by Pk");
    }
  }
}
