import { User } from "../entities";

export default interface IStudentRepository {
  createStudent(major: String, address: String, user: User): Promise<User>;
}
