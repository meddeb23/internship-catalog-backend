import { SupervisorChoice, ISupervisorChoiceRepository } from "../../core";
import {
  httpRequest,
  makeHttpError,
  makeHttpResponse,
  RepoError,
} from "../../helper";
import IntershipProcessServiceValidator from "./validation";

export interface ISupervisorChoiceService {
  addChoice: (req: httpRequest) => Promise<any>;
  getSupervisorChoiceById(req: httpRequest): Promise<any>;
  getSupervisorChoicesbyStudent(req: httpRequest): Promise<any>;
  updateSupervisorChoice(req: httpRequest): Promise<any>;
  validateSupervisorChoice(req: httpRequest): Promise<any>;
}

export default class SupervisorChoiceService
  implements ISupervisorChoiceService
{
  choiceRepo: ISupervisorChoiceRepository;
  constructor(choiceRepo: ISupervisorChoiceRepository) {
    this.choiceRepo = choiceRepo;
  }

  async getSupervisorChoiceById(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error,
    } = IntershipProcessServiceValidator.idSchema.validate(req.pathParams);

    if (error) return makeHttpError(400, "bad id");

    const choice = await this.choiceRepo.getSupervisorChoiceById(id);
    if (!choice) return makeHttpError(404, "chosen supervisor not found");
    return makeHttpResponse(200, { choice });
  }

  async getSupervisorChoicesbyStudent(req: httpRequest): Promise<any> {
    const student_id =
      isNaN(Number(req.queryParams.student_id)) ||
      req.queryParams.student_id < 1
        ? 1
        : req.queryParams.student_id;

    const choice_list = await this.choiceRepo.getSupervisorChoicesbyStudent(
      student_id
    );
    console.log(choice_list.length);

    return makeHttpResponse(200, {
      choice_list: choice_list,
    });
  }

  async addChoice(req: httpRequest): Promise<any> {
    try {
      const choice = new SupervisorChoice(
        req.body.internshipProcess_id,
        req.body.supervisor_id
      );

      await this.choiceRepo.save(choice);
      return makeHttpResponse(200, { choice });
    } catch (err) {
      const e: RepoError = err as RepoError;
      console.log(e);
      return makeHttpError(400, e.response[0].message);
    }
  }

  async updateSupervisorChoice(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error: id_error,
    } = IntershipProcessServiceValidator.idSchema.validate(req.pathParams);
    if (id_error) return makeHttpError(400, "bad id");
    const { value, error } =
      IntershipProcessServiceValidator.updateSupervisorChoiceDataSchema.validate(
        req.body
      );
    if (error) {
      return makeHttpError(400, error.message);
    }
    const internProc = await this.choiceRepo.updateSupervisorChoice(id, value);
    if (!internProc) return makeHttpError(500, "something went wrong");
    return makeHttpResponse(200, { internProc });
  }

  async validateSupervisorChoice(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error,
    } = IntershipProcessServiceValidator.idSchema.validate(req.pathParams);
    if (error) return makeHttpError(400, "bad id");
    const nb = await this.choiceRepo.validateSupervisorChoice(id);
    if (!nb) return makeHttpError(400, "No choice updated");
    return makeHttpResponse(201, {});
  }
}
