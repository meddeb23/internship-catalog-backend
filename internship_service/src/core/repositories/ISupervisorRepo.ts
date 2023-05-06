import { Professor } from "../entities";
export default interface ISupervisorRepo {
  findAll: (id: number[]) => Promise<Professor[]>;
}
