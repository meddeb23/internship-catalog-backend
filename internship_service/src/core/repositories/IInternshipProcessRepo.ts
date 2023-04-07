import { InternshipProcess } from "../entities";
export default interface IInternshipProcessRepo {
  getById: (codeSujet: String) => Promise<InternshipProcess>;
  save: (intProc: InternshipProcess) => Promise<void>;
  getByPage: (page: number, limit: number) => Promise<Array<InternshipProcess>>;
  update(codeSujet: String, value: any): Promise<InternshipProcess>;
}
