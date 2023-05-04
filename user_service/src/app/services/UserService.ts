import Debug from "debug";
import { httpRequest, makeHttpError, makeHttpResponse } from "../../helper";
import { IStudentRepository, IUserRepository } from "../../core/repositeries";

const debug = Debug("user_login");

export interface IUserService {
  getSelfInfo(req: httpRequest): any;
}

class UserService implements IUserService {
  StudentRepository: IStudentRepository;
  constructor(StudentRepository: IStudentRepository) {
    this.StudentRepository = StudentRepository;
  }

  async getSelfInfo(req: httpRequest) {
    console.log(req.body.user);
    return makeHttpResponse(200, {
      msg: "not implemented",
    });
  }

  // const user = await this.UserRepository.getUserByEmail(email);
  // if (!user) return makeHttpError(400, "Unvalid email");
  // if (!(await this.UserRepository.verifyPassword(password, user.password)))
  //   return makeHttpError(400, "Wrong password");
  //   }
}

export default UserService;
