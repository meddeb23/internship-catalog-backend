export default class InternshipProcess {
  id?: number;
  student_id: number;
  company_id: number | null; //if id is null then we gonna create new company.
  intern_department: string;
  intern_company_supervisor_name: string;
  intern_company_supervisor_address: string;
  intern_company_supervisor_phone: string;
  step: number;

  constructor(
    student_id: number,
    company_id: number | null,
    intern_department: string,
    intern_company_supervisor_name: string,
    intern_company_supervisor_address: string,
    intern_company_supervisor_phone: string,
    step: number = 1,
    id?: number
  ) {
    this.id = id;
    this.student_id = student_id;
    this.company_id = company_id;
    this.intern_department = intern_department;
    this.intern_company_supervisor_name = intern_company_supervisor_name;
    this.intern_company_supervisor_address = intern_company_supervisor_address;
    this.intern_company_supervisor_phone = intern_company_supervisor_phone;
    this.step = step;
  }
}
