import { Request, Response, Router } from "express";
import { adaptRequest, httpRequest } from "../../helper";
import {
  CompanyRepo,
  DepartementRepo,
  InternshipProcessRepo,
  StudentRepo,
  SupervisorChoiceRepo,
  SupervisorRepo,
} from "../../infrastructure";
import StudentProcessApplicationService, {
  IProcessApplicationService,
} from "../services/InternshipProcessService";
import {
  ICompanyRepo,
  IInternshipProcessRepo,
  IStudentRepo,
  ISupervisorChoiceRepo,
  ISupervisorRepo,
  ITechnicalDomainRepo,
} from "../../core/repositories";

const router = Router();

const processRepo: IInternshipProcessRepo = new InternshipProcessRepo();
const companyRepo: ICompanyRepo = new CompanyRepo();
const choiseRepo: ISupervisorChoiceRepo = new SupervisorChoiceRepo();
const supervisorRepo: ISupervisorRepo = new SupervisorRepo();
const studentRepo: IStudentRepo = new StudentRepo();
const domainRepo: ITechnicalDomainRepo = new DepartementRepo();

const service = new StudentProcessApplicationService(
  processRepo,
  companyRepo,
  studentRepo,
  choiseRepo,
  domainRepo,
  supervisorRepo
);

router.post("/subject", makeInternshipController("submitApplication", service));
router.post(
  "/supervisors",
  makeInternshipController("submitApplicationSupervisors", service)
);
// router.put(
//   "/update/:codeSujet",
//   makeInternshipController("updateApplicationData", service)
// );
// router.get(
//   "/:codeSujet",
//   makeInternshipController("getApplicationById", service)
// );

function makeInternshipController(
  action: keyof IProcessApplicationService,
  handler: IProcessApplicationService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
