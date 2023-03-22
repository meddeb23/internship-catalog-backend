import { Request, Response, Router } from "express";
import { IEnterpriseRepository } from "../../core";
import { adaptRequest, httpRequest } from "../../helper";
import { EnterpriseRepository } from "../../infrastructure";
import EnterpriseService, {
  IEnterpriseService,
} from "../services/EnterpriseService";

const router = Router();

const enterpriseRepository: IEnterpriseRepository = new EnterpriseRepository();
const service = new EnterpriseService(enterpriseRepository);

router.post("/add", makeEnterpriseController("addCompany", service));
router.post("/verify/:id", makeEnterpriseController("verifyCompany", service));
router.put(
  "/update/:id",
  makeEnterpriseController("updateCompanyData", service)
);
router.get("/", makeEnterpriseController("getCompaniesPage", service));
router.get("/:id", makeEnterpriseController("getCompanyById", service));

function makeEnterpriseController(
  action: keyof IEnterpriseService,
  handler: IEnterpriseService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
