import InternshipProcess from "../entities/InternshipProcess";
export default interface IInternshipProcess {
  getInternshipProcessById: (intProc_id: number) => Promise<InternshipProcess>;
  save: (intProc: InternshipProcess, companyName: String) => Promise<void>;
  getInternshipProcessPage: (
    page: number,
    limit: number
  ) => Promise<Array<InternshipProcess>>;
  updateInternshipProcess(id: number, value: any): Promise<InternshipProcess>;
}
