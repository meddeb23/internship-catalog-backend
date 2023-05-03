import { Request, Response, Router } from "express";
import { EmailVerificationList } from "../../core/entities";
import {
  IMajorRepository,
  IStudentRepository,
  IUserRepository,
} from "../../core/repositeries";
import adaptRequest, { httpRequest } from "../../helper/adapt-request";
import { MajorRepository } from "../../infrastructure";
import { MajorModel } from "../../infrastructure/model";
import MajorService, { IMajorService } from "../services/MajorServiec";

const router = Router();

const majorRepository: IMajorRepository = new MajorRepository(MajorModel);
const majorsService = new MajorService(majorRepository);

router.post("/", makeMajorController("createMajor", majorsService));
router.get("/", makeMajorController("getAllMajors", majorsService));
router.get("/:id", makeMajorController("getMajorById", majorsService));
router.put("/:id", makeMajorController("updateMajor", majorsService));
router.delete("/:id", makeMajorController("deleteMajor", majorsService));

function makeMajorController(
  action: keyof IMajorService,
  handler: IMajorService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
