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
    return makeHttpError(404, "Method not implemented.");
  }
  async getMajorById(req: httpRequest) {
    const { majorId } = req.pathParams;
    const major = await this.majorRepository.getMajorById(majorId);
    if (!major) return makeHttpError(404, "Major not found");
    return makeHttpResponse(200, { major });
  }
  async getAllMajors(req: httpRequest) {
    const majors = await this.majorRepository.getAllMajors();
    return makeHttpResponse(200, { majors });
  }
  updateMajor(req: httpRequest) {
    return makeHttpError(404, "Method not implemented.");
  }
  deleteMajor(req: httpRequest) {
    return makeHttpError(404, "Method not implemented.");
  }
}

export default MajorService;
