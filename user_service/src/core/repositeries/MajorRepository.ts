import { Major } from "../entities";

export default interface IMajorRepository {
  getAllMajors(): Promise<Major[]>;
  getMajorById(id: number): Promise<Major | null>;
  createMajor(major: Major): Promise<Major>;
  updateMajor(id: number, major: Major): Promise<boolean>;
  deleteMajor(id: number): Promise<boolean>;
}
