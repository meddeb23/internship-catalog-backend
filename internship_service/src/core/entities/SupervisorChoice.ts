export default class SupervisorChoice {
  id?: number;
  supervisor_id: number;
  internshipProcess_id: number;
  is_validated: boolean;
  constructor(
    supervisor_id: number,
    internshipProcess_id: number,
    is_validated: boolean = false,
    id?: number
  ) {
    this.id = id;
    this.supervisor_id = supervisor_id;
    this.internshipProcess_id = internshipProcess_id;
    this.is_validated = is_validated;
  }
}
