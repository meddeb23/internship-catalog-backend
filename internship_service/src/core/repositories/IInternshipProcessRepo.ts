import { InternshipProcess } from "../entities";
export default interface IInternshipProcessRepo {
  getById: (id: number) => Promise<InternshipProcess>;
  getByStudent(studentId: number): Promise<InternshipProcess>;
  create: (
    studentId: number,
    companyId: number,
    department: string,
    companySupervisorName: string,
    companySupervisorAddress: string,
    companySupervisorPhone: string
  ) => Promise<InternshipProcess>;
  getByPage: (page: number, limit: number) => Promise<Array<InternshipProcess>>;
  update(id: number, value: any): Promise<InternshipProcess>;
}
