import { Request, Response, Router } from "express";
import { IInternshipProcessRepository } from "../../core";
import { adaptRequest, httpRequest } from "../../helper";
import { InternshipProcessRepository } from "../../infrastructure";
import InternshipProcessService, {
  IInternshipProcessService,
} from "../services/InternshipProcessService";

const router = Router();

const internshipProcessRepository: IInternshipProcessRepository =
  new InternshipProcessRepository();
const service = new InternshipProcessService(internshipProcessRepository);

router.post("/add", makeInternshipController("addInternshipProcess", service));
router.put(
  "/update/:id",
  makeInternshipController("updateInternshipProcessData", service)
);
router.get("/", makeInternshipController("getInternshipProcessPage", service));
router.get(
  "/:id",
  makeInternshipController("getInternshipProcessById", service)
);

function makeInternshipController(
  action: keyof IInternshipProcessService,
  handler: IInternshipProcessService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
