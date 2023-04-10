import { Request, Response, Router } from "express";
import { IStudentRepository } from "../../core/repositeries";
import adaptRequest, { httpRequest } from "../../helper/adapt-request";
import { StudentModel } from "../../infrastructure/model";
import StudentRepository from "../../infrastructure/repositories/StudentRepository";
import UserService, { IUserService } from "../services/UserService";

const router = Router();

const studentRepository: Readonly<IStudentRepository> = new StudentRepository(
  StudentModel
);

const userService: IUserService = new UserService(studentRepository);

router.get(
  "/student/:studentId",
  makeRegistrationController("getStudent", userService)
);
router.get("/me", makeRegistrationController("getSelfInfo", userService));

function makeRegistrationController(
  action: keyof IUserService,
  handler: IUserService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
