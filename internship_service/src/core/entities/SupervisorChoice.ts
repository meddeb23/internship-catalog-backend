export default class SupervisorChoice {
  id?: number;

  internshipProcess_id: number;
  supervisor_id: number;
  is_validated: boolean;
  constructor(
    internshipProcess_id: number,
    supervisor_id: number,
    is_validated: boolean = false,
    id?: number
  ) {
    this.id = id;
    this.internshipProcess_id = internshipProcess_id;
    this.supervisor_id = supervisor_id;
    this.is_validated = is_validated;
  }
}
