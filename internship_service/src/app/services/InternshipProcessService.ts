import { Company, InternshipProcess } from "../../core/entities";
import {
  ICompanyRepo,
  IInternshipProcessRepo,
  IStudentRepo,
  ISupervisorChoiceRepo,
  ISupervisorRepo,
  ITechnicalDomainRepo,
} from "../../core/repositories";
import {
  httpRequest,
  makeHttpError,
  makeHttpResponse,
  RepoError,
} from "../../helper";
import { InternshipProcessServiceValidator as ApplicationValidation } from "./validation";

export interface IProcessApplicationService {
  submitApplication: (req: httpRequest) => Promise<any>;
  getApplicationById(req: httpRequest): Promise<any>;
  updateApplicationData(req: httpRequest): Promise<any>;
  submitApplicationSupervisors(req: httpRequest): Promise<any>;
}

export default class StudentProcessApplicationService
  implements IProcessApplicationService
{
  internProcessRepo: IInternshipProcessRepo;
  companyRepo: ICompanyRepo;
  studentRepo: IStudentRepo;
  choiceRepo: ISupervisorChoiceRepo;
  domainRepo: ITechnicalDomainRepo;
  supervisorRepo: ISupervisorRepo;
  constructor(
    internProcessRepo: IInternshipProcessRepo,
    companyRepo: ICompanyRepo,
    studentRepo: IStudentRepo,
    choiceRepo: ISupervisorChoiceRepo,
    domainRepo: ITechnicalDomainRepo,
    supervisorRepo: ISupervisorRepo
  ) {
    this.internProcessRepo = internProcessRepo;
    this.companyRepo = companyRepo;
    this.studentRepo = studentRepo;
    this.choiceRepo = choiceRepo;
    this.domainRepo = domainRepo;
    this.supervisorRepo = supervisorRepo;
  }
  async submitApplicationSupervisors(req: httpRequest): Promise<any> {
    const { value: choices, error } =
      ApplicationValidation.choicesSchema.validate(req.body.choices);
    if (error) return makeHttpError(400, error.message);

    const application = await this.internProcessRepo.getByStudent(
      req.body.user.id
    );
    if (!application) return makeHttpError(404, "application not found");

    const professors = await this.supervisorRepo.findAll(choices);
    if (professors.length < 3)
      return makeHttpError(404, "could not found professor");
    const supervisors = await this.choiceRepo.create(
      application.id,
      choices as number[]
    );

    if (!supervisors) return makeHttpError(500, "could not add Supervisors");

    return makeHttpResponse(201, { supervisors });
  }

  async getApplicationById(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error,
    } = ApplicationValidation.idSchema.validate(req.pathParams);

    if (error) return makeHttpError(400, "bad id");

    const internProcess = await this.internProcessRepo.getById(id);
    if (!internProcess)
      return makeHttpError(404, "internship process not found");
    return makeHttpResponse(200, { internProcess });
  }

  async submitApplication(req: httpRequest): Promise<any> {
    try {
      const studentId = req.body.user.id;
      const {
        companyId,
        companyName,
        intern_department,
        internCompanySupervisorName,
        internCompanySupervisorAddress,
        internCompanySupervisorPhone,
      } = req.body;

      const { value, error } = ApplicationValidation.applicationSchema.validate(
        {
          studentId,
          companyId,
          intern_department,
          internCompanySupervisorName,
          internCompanySupervisorAddress,
          internCompanySupervisorPhone,
        }
      );
      if (error) return makeHttpError(400, error.message);

      //student & codeSujet
      let company: Company = null;
      if (companyId) {
        company = await this.companyRepo.getById(companyId);
        if (!company) makeHttpError(404, "company does not exist");
      } else {
        company = await this.companyRepo.create(companyName);
        if (!company) makeHttpError(500, "Could not add company");
      }

      const student = await this.studentRepo.getById(studentId);

      const application = await this.internProcessRepo.create(
        student.id,
        companyId,
        intern_department,
        internCompanySupervisorName,
        internCompanySupervisorAddress,
        internCompanySupervisorPhone
      );
      if (!application) makeHttpError(500, "Could not add application");

      return makeHttpResponse(200, { application });
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
    } = ApplicationValidation.idSchema.validate(req.pathParams);
    if (id_error) return makeHttpError(400, "bad id");
    const { value, error } =
      ApplicationValidation.updateInternProcessDataSchema.validate(req.body);
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
