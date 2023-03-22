import { Request, Response, Router } from "express";
import sanitizedConfig from "../../config";
import { EmailVerificationList } from "../../core/entities";
import { IUserRepository } from "../../core/repositeries";
import adaptRequest, { httpRequest } from "../../helper/adapt-request";
import { QueuePublisher } from "../../infrastructure";
import { UserModel } from "../../infrastructure/model";
import UserAdapter from "../../infrastructure/repositories/userAdapter";
import RegistrationHandler, {
  IRegistrationHandler,
} from "../services/RegistrationService";

const router = Router();

const userAdapter: Readonly<IUserRepository> = new UserAdapter(UserModel);
const emailVerificationList = new EmailVerificationList();

const registrationHandler = new RegistrationHandler(
  userAdapter,
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
router.post(
  "/create_account",
  makeRegistrationController("createAccount", registrationHandler)
);
router.post(
  "/user_personal_info",
  makeRegistrationController("submitPersonalInfo", registrationHandler)
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
