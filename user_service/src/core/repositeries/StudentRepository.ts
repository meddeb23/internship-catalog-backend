import { Major, Student, User } from "../entities";

export default interface IStudentRepository {
  createStudent(user: User, major: Major, address?: String): Promise<Student>;
  getallStudent(): Promise<Student[]>;
  getStudentById(studentId: number): Promise<Student>;
  getStudentByUserId(userId: number): Promise<Student>;
}
