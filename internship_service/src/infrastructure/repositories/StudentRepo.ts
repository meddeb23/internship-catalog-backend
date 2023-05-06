import { MajorModel, StudentModel, UserModel } from "../model";
import { RepoError } from "../../helper";
import { IStudentRepo } from "../../core/repositories";
import { Student } from "../../core/entities";

export default class StudentRepository implements IStudentRepo {
  private handleError(err: any, action: string) {
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

  private getStudentEntity(student: StudentModel): Student {
    return new Student(
      student.user.id,
      student.user.first_name,
      student.user.last_name,
      student.user.email,
      student.user.password,
      student.user.role,
      student.user.registration_completed,
      student.address,
      student.major.name
    );
  }

  async getById(id: number): Promise<Student> {
    try {
      const e = await StudentModel.findOne({
        where: { userId: id },
        include: [UserModel, MajorModel],
      });
      if (!e) return null;
      console.log(e);
      return this.getStudentEntity(e);
    } catch (err) {
      console.log(err);
      this.handleError(err, "Error getting choice by Pk");
    }
  }
}
