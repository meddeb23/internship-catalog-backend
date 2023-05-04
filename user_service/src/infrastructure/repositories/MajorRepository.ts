import { IMajorRepository } from "../../core/repositeries";
import { MajorModel } from "../model";
import RepoError from "../../helper/RepoError";
import { Major } from "../../core/entities";

export default class MajorRepository implements IMajorRepository {
  readonly Major: typeof MajorModel;

  constructor(model: typeof MajorModel) {
    this.Major = model;
  }
  async getAllMajors(): Promise<Major[]> {
    const majors = await this.Major.findAll();
    return majors.map((m) => this.getMajorEntity(m));
  }
  async getMajorById(id: number): Promise<Major> {
    const major = await this.Major.findOne({ where: { id } });
    console.log(major);
    return major ? this.getMajorEntity(major) : null;
  }
  async createMajor(major: Major): Promise<Major> {
    throw new Error("Method not implemented.");
  }
  async updateMajor(id: number, major: Major): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async deleteMajor(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  #handleError(err: any, action: string) {
    const error = new RepoError("Error in Major Repository");
    err.errors.forEach((e: any) => {
      error.response.push({
        message: e.message,
        value: e.value,
      });
      error.stack += `\n${action}:\n\t${e.message}\n\tvalue: ${e.value}`;
    });
    throw error;
  }

  private getMajorEntity(major: MajorModel): Major {
    return new Major(major.id, major.name, major.createdAt, major.updatedAt);
  }
}
