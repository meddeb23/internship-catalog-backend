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

router.post("/add", makeRegistrationController("addCompany", service));
router.post(
  "/verify/:id",
  makeRegistrationController("verifyCompany", service)
);
router.get("/", makeRegistrationController("getCompaniesPage", service));
router.put(
  "/update/:id",
  makeRegistrationController("updateCompanyData", service)
);
router.get("/:id", makeRegistrationController("getCompanyById", service));

function makeRegistrationController(
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
