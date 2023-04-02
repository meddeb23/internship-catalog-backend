import { Student, User } from "../../core/entities";
import { IStudentRepository } from "../../core/repositeries";
import { StudentModel } from "../model";

export default class StudentRepository implements IStudentRepository {
  readonly student: typeof StudentModel;

  constructor(studentModel: typeof StudentModel) {
    this.student = studentModel;
  }

  #getStudentEntity(user: User, student: StudentModel): Student {
    return new Student(
      user.id,
      user.first_name,
      user.last_name,
      user.email,
      user.password,
      user.role,
      user.registration_completed,
      student.address,
      student.major
    );
  }

  async createStudent(
    major: String,
    address: String,
    user: User
  ): Promise<User> {
    const student = await this.student.create({
      address,
      major,
      userId: user.id,
    });
    return this.#getStudentEntity(user, student);
  }
}
