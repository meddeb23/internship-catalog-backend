import { Student, User } from "../../core/entities";
import { IStudentRepository } from "../../core/repositeries";
import { StudentModel, UserModel } from "../model";

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

  async getStudent(studentId: number): Promise<Student> {
    const student: any = await this.student.findByPk(studentId, {
      include: [
        {
          model: UserModel,
          // attributes: ["first_name","last_name"]
        },
      ],
    });
    return new Student(
      student.User.id,
      student.User.first_name,
      student.User.last_name,
      student.User.email,
      student.User.password,
      student.User.role,
      student.User.registration_completed,
      student.address,
      student.major
    );
  }

  formatUser(student: Student): any {
    return student;
  }

  async createStudent(
    major: String,
    address: String,
    user: User
  ): Promise<Student> {
    const student = await this.student.create({
      address,
      major,
      userId: user.id,
    });
    if (!student) return null;
    return this.#getStudentEntity(user, student);
  }
}
