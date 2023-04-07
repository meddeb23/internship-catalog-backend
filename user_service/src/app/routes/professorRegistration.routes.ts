import { Request, Response, Router } from "express";
import { EmailVerificationList } from "../../core/entities";
import { IStudentRepository, IUserRepository } from "../../core/repositeries";
import adaptRequest, { httpRequest } from "../../helper/adapt-request";
import { UserRepoFacad } from "../../infrastructure";
import { StudentModel, UserModel } from "../../infrastructure/model";
import StudentRepository from "../../infrastructure/repositories/StudentRepository";
import UserRepository from "../../infrastructure/repositories/userRepository";
import ProfessorRegistrationHandler, {
  IProfessorRegistrationHandler,
} from "../services/ProfessorRegistrationService";

const router = Router();

const userRepository: Readonly<IUserRepository> = new UserRepository(UserModel);
const studentRepository: Readonly<IStudentRepository> = new StudentRepository(
  StudentModel
);
const userRepoFacad = new UserRepoFacad(userRepository, studentRepository);

// Email Verification cache
const emailVerificationList = new EmailVerificationList();

const professorRegistrationHandler: IProfessorRegistrationHandler =
  new ProfessorRegistrationHandler(userRepoFacad, emailVerificationList);

router.post(
  "/create_account",
  makeRegistrationController(
    "createProfessorAccount",
    professorRegistrationHandler
  )
);
router.post(
  "/user_personal_info",
  makeRegistrationController("submitPersonalInfo", professorRegistrationHandler)
);

function makeRegistrationController(
  action: keyof IProfessorRegistrationHandler,
  handler: IProfessorRegistrationHandler
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
