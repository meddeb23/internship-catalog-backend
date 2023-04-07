import Professor from "./Professor";

export default class SupervisorChoice {
  id?: number;
  supervisor: Professor;

  constructor(supervisor: Professor, id?: number) {
    this.id = id;
    this.supervisor = supervisor;
  }
}
