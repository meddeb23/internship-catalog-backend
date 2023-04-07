import SupervisorChoice from "../entities/SupervisorChoice";
export default interface ISupervisorChoice {
  getSupervisorChoiceById: (choice_id: number) => Promise<SupervisorChoice>;
  save: (choice: SupervisorChoice) => Promise<void>;
  getSupervisorChoicesbyStudent: (
    student_id: number
  ) => Promise<Array<SupervisorChoice>>;
  updateSupervisorChoice(id: number, value: any): Promise<SupervisorChoice>;
  validateSupervisorChoice(choice_id: number): Promise<number>;
}
