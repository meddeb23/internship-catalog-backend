import { Company, InternshipProcess } from "../../core/entities";
import {
  ICompanyRepo,
  IInternshipProcessRepo,
  IStudentRepo,
  ISupervisorChoiceRepo,
  ITechnicalDomainRepo,
} from "../../core/repositories";
import {
  httpRequest,
  makeHttpError,
  makeHttpResponse,
  RepoError,
} from "../../helper";
import IntershipProcessServiceValidator from "./validation";

export interface IProcessApplicationService {
  submitApplication: (req: httpRequest) => Promise<any>;
  getApplicationById(req: httpRequest): Promise<any>;
  updateApplicationData(req: httpRequest): Promise<any>;
}

export default class StudentProcessApplicationService
  implements IProcessApplicationService
{
  internProcessRepo: IInternshipProcessRepo;
  companyRepo: ICompanyRepo;
  studentRepo: IStudentRepo;
  choiceRepo: ISupervisorChoiceRepo;
  domainRepo: ITechnicalDomainRepo;
  supervisorRepo: ISupervisorChoiceRepo;
  constructor(
    internProcessRepo: IInternshipProcessRepo,
    companyRepo: ICompanyRepo,
    studentRepo: IStudentRepo,
    choiceRepo: ISupervisorChoiceRepo,
    domainRepo: ITechnicalDomainRepo,
    supervisorRepo: ISupervisorChoiceRepo
  ) {
    this.internProcessRepo = internProcessRepo;
    this.companyRepo = companyRepo;
    this.studentRepo = studentRepo;
    this.choiceRepo = choiceRepo;
    this.domainRepo = domainRepo;
    this.supervisorRepo = supervisorRepo;
  }

  async getApplicationById(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error,
    } = IntershipProcessServiceValidator.idSchema.validate(req.pathParams);

    if (error) return makeHttpError(400, "bad id");

    const internProcess = await this.internProcessRepo.getById(id);
    if (!internProcess)
      return makeHttpError(404, "internship process not found");
    return makeHttpResponse(200, { internProcess });
  }

  async submitApplication(req: httpRequest): Promise<any> {
    try {
      //check comany

      const intPros = new InternshipProcess(
        req.body.codeSujet,
        req.body.student,
        req.body.company,
        req.body.department,
        req.body.universatySupervisor,
        req.body.companySupervisorName,
        req.body.companySupervisorAddress,
        req.body.companySupervisorPhone,
        req.body.choices
      );
      //student & codeSujet

      if (intPros.company === null) {
        const newCompany = new Company(
          req.queryParams.companyName,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
        await this.companyRepo.save(newCompany);
        intPros.company = newCompany;
      } else {
        // Check if a company with the given object already exists

        const company = await this.companyRepo.getById(intPros.company.id);
        if (company!) {
          console.log("company does not exist");
          return;
        }
      }

      await this.internProcessRepo.save(intPros);
      return makeHttpResponse(200, { intPros });
    } catch (err) {
      const e: RepoError = err as RepoError;
      console.log(e);
      return makeHttpError(400, e.response[0].message);
    }
  }

  async updateApplicationData(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error: id_error,
    } = IntershipProcessServiceValidator.idSchema.validate(req.pathParams);
    if (id_error) return makeHttpError(400, "bad id");
    const { value, error } =
      IntershipProcessServiceValidator.updateInternProcessDataSchema.validate(
        req.body
      );
    if (error) {
      if (error.message.includes("intern_company_supervisor_phone"))
        error.message = "unvalide phone number";
      error.message = error.message.replace(/"/g, "");
      return makeHttpError(400, error.message);
    }
    const internProc = await this.internProcessRepo.update(id, value);
    if (!internProc) return makeHttpError(500, "something went wrong");
    return makeHttpResponse(200, { internProc });
  }
}
