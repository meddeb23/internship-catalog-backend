import { InternshipProcess, IInternshipProcessRepository } from "../../core";
import {
  httpRequest,
  makeHttpError,
  makeHttpResponse,
  RepoError,
} from "../../helper";
import IntershipProcessServiceValidator from "./validation";

export interface IInternshipProcessService {
  addInternshipProcess: (req: httpRequest) => Promise<any>;
  getInternshipProcessById(req: httpRequest): Promise<any>;
  getInternshipProcessPage(req: httpRequest): Promise<any>;
  updateInternshipProcessData(req: httpRequest): Promise<any>;
}

export default class InternshipProcessService
  implements IInternshipProcessService
{
  internProcessRepo: IInternshipProcessRepository;
  constructor(internProcessRepo: IInternshipProcessRepository) {
    this.internProcessRepo = internProcessRepo;
  }

  async getInternshipProcessById(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error,
    } = IntershipProcessServiceValidator.idSchema.validate(req.pathParams);

    if (error) return makeHttpError(400, "bad id");

    const internProcess = await this.internProcessRepo.getInternshipProcessById(
      id
    );
    if (!internProcess)
      return makeHttpError(404, "internship process not found");
    return makeHttpResponse(200, { internProcess });
  }

  async getInternshipProcessPage(req: httpRequest): Promise<any> {
    const page =
      isNaN(Number(req.queryParams.page)) || req.queryParams.page < 1
        ? 1
        : req.queryParams.page;
    const limit =
      isNaN(Number(req.queryParams.limit)) || req.queryParams.limit < 2
        ? 10
        : req.queryParams.limit;
    const int_process_list =
      await this.internProcessRepo.getInternshipProcessPage(page, limit);
    console.log(int_process_list.length);

    return makeHttpResponse(200, {
      intershipProcess: int_process_list.slice(0, limit),
      isNextPage: int_process_list.length > limit,
    });
  }

  async addInternshipProcess(req: httpRequest): Promise<any> {
    try {
      const intPros = new InternshipProcess(
        req.body.student_id,
        req.body.company_id,
        req.body.intern_department,
        req.body.intern_company_supervisor_name,
        req.body.intern_company_supervisor_address,
        req.body.intern_company_supervisor_phone
      );
      await this.internProcessRepo.save(intPros);
      return makeHttpResponse(200, { intPros });
    } catch (err) {
      const e: RepoError = err as RepoError;
      console.log(e);
      return makeHttpError(400, e.response[0].message);
    }
  }

  async updateInternshipProcessData(req: httpRequest): Promise<any> {
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
    const internProc = await this.internProcessRepo.updateInternshipProcess(
      id,
      value
    );
    if (!internProc) return makeHttpError(500, "something went wrong");
    return makeHttpResponse(200, { internProc });
  }
}
