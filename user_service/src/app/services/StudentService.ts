import Debug from "debug";

import { httpRequest, makeHttpError, makeHttpResponse } from "../../helper";
import { EmailVerificationList, Roles } from "../../core/entities";
import { IMajorRepository, IUserRepoFacad } from "../../core/repositeries";
import RepoError from "../../helper/RepoError";
import { Validator } from "./Validator";

const debug = Debug("user:router");

export interface IStudentService {
  createStudentAccount(req: httpRequest): any;
  submitPersonalInfo(req: httpRequest): any;
  getStudent(req: httpRequest): any;
  getStudentById(req: httpRequest): any;
  getAllStudent(req: httpRequest): any;
}

class StudentService implements IStudentService {
  userRepoFacad: IUserRepoFacad;
  cache: EmailVerificationList;
  majorRepository: IMajorRepository;
  constructor(
    userRepoFacad: IUserRepoFacad,
    cache: EmailVerificationList,
    majorRepository: IMajorRepository
  ) {
    this.userRepoFacad = userRepoFacad;
    this.cache = cache;
    this.majorRepository = majorRepository;
  }
  async getStudentById(req: httpRequest) {
    const { value: userId, error } = Validator.idSchema.validate(
      req.pathParams.userId
    );
    if (error) return makeHttpError(400, error.message);

    const student = await this.userRepoFacad.StudentRepo.getStudentByUserId(
      userId
    );
    if (!student) return makeHttpError(404, "user does not exsit");

    return makeHttpResponse(200, { user: student });
  }

  async getAllStudent(req: httpRequest) {
    const students = await this.userRepoFacad.StudentRepo.getallStudent();
    if (!students) return makeHttpError(404, "Could not get students");

    return makeHttpResponse(200, { students });
  }

  async getStudent(req: httpRequest) {
    const { id } = req.body.user;
    const { error } = Validator.idSchema.validate(id);
    if (error) return makeHttpError(400, error.message);

    const student = await this.userRepoFacad.StudentRepo.getStudentByUserId(id);
    if (!student) return makeHttpError(404, "user does not exsit");

    return makeHttpResponse(200, { user: student.format() });
  }

  async createStudentAccount(req: httpRequest) {
    const { email, password } = req.body;
    const user = await this.userRepoFacad.UserRepo.getUserByEmail(email);
    if (user) return makeHttpError(400, "Account already exsits");
    if (!this.cache.isVerified(email))
      return makeHttpError(400, "Email not verified");
    try {
      const userData = await this.userRepoFacad.UserRepo.createUser(
        email,
        password,
        Roles.Student
      );
      if (!userData) return makeHttpError(500, "something went wrong");
      const user = this.userRepoFacad.UserRepo.formatUser(userData);
      this.cache.removeItem(email);
      const token = await this.userRepoFacad.UserRepo.generateUserToken(user);
      return makeHttpResponse(200, { user }, { token });
    } catch (err) {
      const e: RepoError = err as RepoError;
      console.log(e);
      return makeHttpError(400, e.response[0].message);
    }
  }

  async submitPersonalInfo(req: httpRequest) {
    const { email, first_name, last_name, majorId, address } = req.body;

    const { error } = Validator.submitPersonalInfo.validate({
      email,
      first_name,
      last_name,
      majorId,
      address,
    });
    if (error) return makeHttpError(400, error.message);

    let user = await this.userRepoFacad.UserRepo.getUserByEmail(email);
    if (!user) return makeHttpError(400, "you don't have an account");

    if (user.registration_completed)
      return makeHttpError(400, "Registration already completed");

    const major = await this.majorRepository.getMajorById(majorId);
    if (!major) return makeHttpError(400, "Major doesn't exist");

    const newUser = await this.userRepoFacad.UserRepo.completeAccount(
      email,
      first_name,
      last_name
    );
    if (!newUser) return makeHttpError(500, "Could not complete your account");

    const student = await this.userRepoFacad.StudentRepo.createStudent(
      newUser,
      major
    );
    if (!student) return makeHttpError(500, "Could not create student account");
    return makeHttpResponse(
      200,
      { user: student.format() },
      { message: "account registration completed" }
    );
  }
}

export default StudentService;
