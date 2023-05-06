import { SupervisorChoice } from "../entities";
export default interface ISupervisorChoiceRepo {
  create(
    applicationId: number,
    professorId: number[]
  ): Promise<SupervisorChoice[]>;
  getById: (
    intershipProcessId: number,
    professorId: number
  ) => Promise<SupervisorChoice>;
  //getByCodeSujet: (codeSujet: String) => Promise<Array<SupervisorChoice>>;
  update(
    intershipProcessId: number,
    professorId: number,
    value: any
  ): Promise<SupervisorChoice>;
}
