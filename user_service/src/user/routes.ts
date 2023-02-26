import { Request, Response, Router } from "express";
import adaptRequest, { httpRequest } from "../helper/adapt-request";
import {
  IRegistrationHandler,
  registrationHandler,
} from "./RegistrationUseCase";

const router = Router();

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
