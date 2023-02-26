import { Request, Response, Router } from "express";
import { IAuthHandler, authHandler } from "../services/AuthService";
import { httpRequest } from "../../helper";
import { adaptRequest } from "../../helper";

const router = Router();

router.post("/login", makeAuthController("login", authHandler));

function makeAuthController(action: keyof IAuthHandler, handler: IAuthHandler) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
