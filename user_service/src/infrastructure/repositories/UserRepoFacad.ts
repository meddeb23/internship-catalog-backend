import {
  IStudentRepository,
  IUserRepoFacad,
  IUserRepository,
} from "../../core/repositeries";

export default class UserRepoFacad implements IUserRepoFacad {
  UserRepo: IUserRepository;
  StudentRepo: IStudentRepository;

  constructor(userRepo: IUserRepository, studentRepo: IStudentRepository) {
    this.UserRepo = userRepo;
    this.StudentRepo = studentRepo;
  }
}
