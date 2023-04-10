import { Student, User } from "../entities";

export default interface IStudentRepository {
  createStudent(major: String, address: String, user: User): Promise<Student>;
  getStudent(studentId: number): Promise<Student>;
  formatUser(std: Student): any;
}
