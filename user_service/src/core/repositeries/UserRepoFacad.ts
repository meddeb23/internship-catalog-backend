import IStudentRepository from "./StudentRepository";
import IUserRepository from "./UserRepositery";

export default interface IUserRepoFacad {
  UserRepo: IUserRepository;
  StudentRepo: IStudentRepository;
}
