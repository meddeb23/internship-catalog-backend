import { Request, Response, Router } from "express";
import { ISupervisorChoiceRepository } from "../../core";
import { adaptRequest, httpRequest } from "../../helper";
import { SupervisorChoiceRepository } from "../../infrastructure";
import SupervisorChoiceService, {
  ISupervisorChoiceService,
} from "../services/SupervisorChoiceService";

const router = Router();

const choiceRepository: ISupervisorChoiceRepository =
  new SupervisorChoiceRepository();
const service = new SupervisorChoiceService(choiceRepository);

router.post("/add", makeChoiceController("addChoice", service));
router.put(
  "/update/:id",
  makeChoiceController("updateSupervisorChoice", service)
);
router.get("/", makeChoiceController("getSupervisorChoicesbyStudent", service));
router.get("/:id", makeChoiceController("getSupervisorChoiceById", service));
router.post(
  "/verify/:id",
  makeChoiceController("validateSupervisorChoice", service)
);

function makeChoiceController(
  action: keyof ISupervisorChoiceService,
  handler: ISupervisorChoiceService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
