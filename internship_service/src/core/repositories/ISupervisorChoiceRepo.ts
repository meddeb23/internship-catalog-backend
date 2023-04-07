import { SupervisorChoice } from "../entities";
export default interface ISupervisorChoiceRepo {
  save: (choice: SupervisorChoice) => Promise<void>;
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
