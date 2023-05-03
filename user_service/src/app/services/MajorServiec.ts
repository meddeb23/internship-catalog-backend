import { httpRequest, makeHttpError, makeHttpResponse } from "../../helper";
import { IMajorRepository } from "../../core/repositeries";

export interface IMajorService {
  createMajor(req: httpRequest): any;
  getMajorById(req: httpRequest): any;
  getAllMajors(req: httpRequest): any;
  updateMajor(req: httpRequest): any;
  deleteMajor(req: httpRequest): any;
}

class MajorService implements IMajorService {
  majorRepository: IMajorRepository;
  constructor(majorRepository: IMajorRepository) {
    this.majorRepository = majorRepository;
  }
  createMajor(req: httpRequest) {
    throw new Error("Method not implemented.");
  }
  getMajorById(req: httpRequest) {
    throw new Error("Method not implemented.");
  }
  async getAllMajors(req: httpRequest) {
    const majors = await this.majorRepository.getAllMajors();
    return makeHttpResponse(200, { majors });
  }
  updateMajor(req: httpRequest) {
    throw new Error("Method not implemented.");
  }
  deleteMajor(req: httpRequest) {
    throw new Error("Method not implemented.");
  }
}

export default MajorService;
