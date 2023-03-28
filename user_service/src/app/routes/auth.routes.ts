import { Request, Response, Router } from "express";
import AuthHandler, { IAuthHandler } from "../services/AuthService";
import { httpRequest } from "../../helper";
import { adaptRequest } from "../../helper";
import { IUserRepository } from "../../core/repositeries";
import { UserModel } from "../../infrastructure/model";
import UserAdapter from "../../infrastructure/repositories/userAdapter";

const router = Router();

const userAdapter: Readonly<IUserRepository> = new UserAdapter(UserModel);

const authHandler = new AuthHandler(userAdapter);

router.post("/login", makeAuthController("login", authHandler));
router.post("/verifyToken", makeAuthController("verifyToken", authHandler));

function makeAuthController(action: keyof IAuthHandler, handler: IAuthHandler) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
