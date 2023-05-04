import { Major, Student, User } from "../../core/entities";
import { IStudentRepository } from "../../core/repositeries";
import { MajorModel, StudentModel, UserModel } from "../model";

export default class StudentRepository implements IStudentRepository {
  readonly student: typeof StudentModel;

  constructor(studentModel: typeof StudentModel) {
    this.student = studentModel;
  }
  async getallStudent(): Promise<Student[]> {
    const students = await this.student.findAll({
      include: [{ model: UserModel }, { model: MajorModel }],
    });
    if (!students) return null;
    return students.map((s) => this.getStudentEntity(s));
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

  async getStudentById(studentId: number): Promise<Student> {
    const student: any = await this.student.findByPk(studentId, {
      include: [{ model: UserModel }, { model: MajorModel }],
    });
    return student ? this.getStudentEntity(student) : null;
  }

  async getStudentByUserId(userId: number): Promise<Student> {
    const student: any = await this.student.findOne({
      where: { userId },
      include: [{ model: UserModel }, { model: MajorModel }],
    });
    return student ? this.getStudentEntity(student) : null;
  }

  async createStudent(
    user: User,
    major: Major,
    address: string = null
  ): Promise<Student> {
    const student = await this.student.create({
      userId: user.id,
      majorId: major.id,
      address,
    });
    return this.getStudentById(student.id);
  }
}
