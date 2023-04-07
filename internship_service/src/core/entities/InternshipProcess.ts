import SupervisorChoice from "./SupervisorChoice";
import Student from "./Student";
import Company from "./Company";
import TechnicalDomain from "./TechnicalDomain";
import Professor from "./Professor";
export default class InternshipProcess {
  codeSujet: String;
  student: Student;
  company: Company | null;
  department: TechnicalDomain;
  companySupervisorName: string;
  companySupervisorAddress: string;
  companySupervisorPhone: string;
  choices: Array<SupervisorChoice>;
  universatySupervisor: Professor | null;

  constructor(
    student: Student,
    company: Company | null,
    department: TechnicalDomain,
    companySupervisorName: string,
    companySupervisorAddress: string,
    companySupervisorPhone: string,
    choices: Array<SupervisorChoice>,
    universatySupervisor: Professor | null,
    codeSujet: String
  ) {
    this.codeSujet = codeSujet;
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
