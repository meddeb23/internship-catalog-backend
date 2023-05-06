import SupervisorChoice from "./SupervisorChoice";
import Student from "./Student";
import Company from "./Company";
import TechnicalDomain from "./TechnicalDomain";
import Professor from "./Professor";
export default class InternshipProcess {
  id: number;
  student?: Student;
  company?: Company | null;
  department: string;
  companySupervisorName: string;
  companySupervisorAddress: string;
  companySupervisorPhone: string;
  choices?: Array<SupervisorChoice>;
  universatySupervisor?: Professor;

  constructor(
    id: number,
    department: string,
    companySupervisorName: string,
    companySupervisorAddress: string,
    companySupervisorPhone: string,
    choices?: Array<SupervisorChoice>,
    student?: Student,
    company?: Company | null,
    universatySupervisor?: Professor
  ) {
    this.id = id;
    this.student = student;
    this.company = company;
    this.department = department;
    this.companySupervisorName = companySupervisorName;
    this.companySupervisorAddress = companySupervisorAddress;
    this.companySupervisorPhone = companySupervisorPhone;
    this.choices = choices;
    this.universatySupervisor = universatySupervisor;
  }
}
