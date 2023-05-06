import { TechnicalDomainModel } from "../model";
import { RepoError } from "../../helper";
import { ITechnicalDomainRepo } from "../../core/repositories";
import { TechnicalDomain } from "../../core/entities";

export default class TechnicalDomainRepository implements ITechnicalDomainRepo {
  #handleError(err: any, action: string) {
    const error = new RepoError("Error in technical departement Repository");
    err.errors.forEach((e: any) => {
      error.response.push({
        message: e.message,
        value: e.value,
      });
      error.stack += `\n${action}:\n\t${e.message}\n\tvalue: ${e.value}`;
    });
    throw error;
  }

  #GetEntityFromModel(c: TechnicalDomainModel): TechnicalDomain {
    // return new TechnicalDomain();
    throw new Error("Not Implemented");
  }

  async getById(domainId: number): Promise<TechnicalDomain> {
    try {
      const e = await TechnicalDomainModel.findByPk(domainId);
      if (!e) return null;
      return this.#GetEntityFromModel(e);
    } catch (err) {
      console.log(err);
      this.#handleError(err, "Error getting choice by Pk");
    }
  }

  async save(ch: TechnicalDomain): Promise<void> {
    try {
      await TechnicalDomainModel.create({ ...ch });
    } catch (err) {
      this.#handleError(err, "Error in domain save");
    }
  }

  async update(id: number, value: any): Promise<TechnicalDomain> {
    const [row] = await TechnicalDomainModel.update(value, { where: { id } });
    if (row !== 1) return null;
    return this.getById(id);
  }
}
