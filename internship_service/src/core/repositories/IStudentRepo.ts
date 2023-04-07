import { Student } from "../entities";
export default interface IStudentRepo {
  getById: (id: number) => Promise<Student>;
  //update
}
