import { Request, Response, Router } from "express";
import sanitizedConfig from "../../config";
import { EmailVerificationList } from "../../core/entities";
import { IStudentRepository, IUserRepository } from "../../core/repositeries";
import adaptRequest, { httpRequest } from "../../helper/adapt-request";
import { QueuePublisher, UserRepoFacad } from "../../infrastructure";
import { StudentModel, UserModel } from "../../infrastructure/model";
import StudentRepository from "../../infrastructure/repositories/StudentRepository";
import UserRepository from "../../infrastructure/repositories/userRepository";
import RegistrationHandler, {
  IRegistrationHandler,
} from "../services/RegistrationService";

const router = Router();

const userRepository: Readonly<IUserRepository> = new UserRepository(UserModel);
const studentRepository: Readonly<IStudentRepository> = new StudentRepository(
  StudentModel
);

// Email Verification cache
const emailVerificationList = new EmailVerificationList();

const userRepoFacad = new UserRepoFacad(userRepository, studentRepository);

const registrationHandler: IRegistrationHandler = new RegistrationHandler(
  userRepoFacad,
  emailVerificationList,
  new QueuePublisher(sanitizedConfig.Q_URL, "verificationEmail")
);

router.post(
  "/verify_email",
  makeRegistrationController("verifyEmail", registrationHandler)
);
router.post(
  "/request_email_verification",
  makeRegistrationController("submitEmail", registrationHandler)
);

function makeRegistrationController(
  action: keyof IRegistrationHandler,
  handler: IRegistrationHandler
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
