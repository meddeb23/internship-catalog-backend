import { Request, Response, Router } from "express";
import { EmailVerificationList } from "../../core/entities";
import {
  IMajorRepository,
  IStudentRepository,
  IUserRepository,
} from "../../core/repositeries";
import adaptRequest, { httpRequest } from "../../helper/adapt-request";
import { MajorRepository, UserRepoFacad } from "../../infrastructure";
import {
  MajorModel,
  StudentModel,
  UserModel,
} from "../../infrastructure/model";
import StudentRepository from "../../infrastructure/repositories/StudentRepository";
import UserRepository from "../../infrastructure/repositories/userRepository";
import StudentService, { IStudentService } from "../services/StudentService";
import { emailVerificationList } from "./emailVerification.routes";

const router = Router();

const majorRepository = new MajorRepository(MajorModel);
const userRepository = new UserRepository(UserModel);
const studentRepository = new StudentRepository(StudentModel);
const userRepoFacad = new UserRepoFacad(userRepository, studentRepository);

// Email Verification cache
// const emailVerificationList = new EmailVerificationList();

const studentService = new StudentService(
  userRepoFacad,
  emailVerificationList,
  majorRepository
);

router.post(
  "/create_account",
  makeStudentController("createStudentAccount", studentService)
);
router.post(
  "/user_personal_info",
  makeStudentController("submitPersonalInfo", studentService)
);
router.get("/all", makeStudentController("getAllStudent", studentService));
router.get("/", makeStudentController("getStudent", studentService));
router.get("/:userId", makeStudentController("getStudentById", studentService));

function makeStudentController(
  action: keyof IStudentService,
  handler: IStudentService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
