import { Professor } from "../entities";
export default interface ISupervisorRepo {
  getById: (id: number) => Promise<Professor>;
}
