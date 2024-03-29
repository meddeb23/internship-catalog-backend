import { query } from "express";
import { Enterprise, IEnterpriseRepository } from "../../core";
import {
  httpRequest,
  makeHttpError,
  makeHttpResponse,
  RepoError,
} from "../../helper";
import { EnterpriseServiceValidator as EnterpriseValidator } from "./validation";

export interface IEnterpriseService {
  addCompany: (req: httpRequest) => Promise<any>;
  verifyCompany(req: httpRequest): Promise<any>;
  getCompanyById(req: httpRequest): Promise<any>;
  getCompaniesPage(req: httpRequest): Promise<any>;
  updateCompanyData(req: httpRequest): Promise<any>;
  autoComplete(req: httpRequest): Promise<any>;
  likeCompany(req: httpRequest): Promise<any>;
  SaveCompany(req: httpRequest): Promise<any>;
}

export default class EnterpriseService implements IEnterpriseService {
  enterpriseRepo: IEnterpriseRepository;
  constructor(enterpriseRepo: IEnterpriseRepository) {
    this.enterpriseRepo = enterpriseRepo;
  }

  async likeCompany(req: httpRequest): Promise<any> {
    const { id } = req.body.user;

    const {
      value: { id: companyId },
      error,
    } = EnterpriseValidator.idSchema.validate(req.pathParams);
    if (error) return makeHttpError(400, error.message);

    const company = await this.enterpriseRepo.getEnterpriseById(companyId);
    if (!company) return makeHttpError(404, "company not found");

    const isLiked = await this.enterpriseRepo.isLikedCompany(id, company.id);
    if (isLiked) {
      const unlike = await this.enterpriseRepo.unlikeCompany(id, company.id);
      if (!unlike) return makeHttpError(500, "could not unlike company");
      return makeHttpResponse(200, {});
    }

    const like = this.enterpriseRepo.likeCompany(id, company.id);
    if (!like) return makeHttpError(500, "could not like company");

    return makeHttpResponse(201, {});
  }

  async SaveCompany(req: httpRequest): Promise<any> {
    const { id } = req.body.user;

    const {
      value: { id: companyId },
      error,
    } = EnterpriseValidator.idSchema.validate(req.pathParams);
    if (error) return makeHttpError(400, error.message);

    const company = await this.enterpriseRepo.getEnterpriseById(companyId);
    if (!company) return makeHttpError(404, "company not found");

    const isSaved = await this.enterpriseRepo.isSavedCompany(id, company.id);
    if (isSaved) {
      const unsave = await this.enterpriseRepo.unsaveCompany(id, company.id);
      if (!unsave) return makeHttpError(500, "could not unsave company");
      return makeHttpResponse(200, {});
    }

    const save = this.enterpriseRepo.saveCompany(id, company.id);
    if (!save) return makeHttpError(500, "could not save company");

    return makeHttpResponse(201, {});
  }

  async autoComplete(req: httpRequest): Promise<any> {
    const { value: query, error } = EnterpriseValidator.stringSchema.validate(
      req.pathParams.query,
      { abortEarly: false }
    );

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      console.log(errorDetails);
      return makeHttpError(400, "bad id");
    }
    const result = await this.enterpriseRepo.getCompaniesName(query);
    return makeHttpResponse(200, { result });
  }

  async verifyCompany(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error,
    } = EnterpriseValidator.idSchema.validate(req.pathParams);
    if (error) return makeHttpError(400, "bad id");
    const nb = await this.enterpriseRepo.verfiyCompany(id);
    if (!nb) return makeHttpError(400, "No Company updated");
    return makeHttpResponse(201, {});
  }

  async getCompanyById(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error,
    } = EnterpriseValidator.idSchema.validate(req.pathParams);
    if (error) return makeHttpError(404, "bad company id");

    const company = await this.enterpriseRepo.getEnterpriseById(id);
    if (!company) return makeHttpError(404, "company not found");

    return makeHttpResponse(200, { company });
  }

  getValidNumberParam(
    param: string,
    minValue: number,
    defaultValue?: number
  ): number {
    const value = Number(param);
    if (isNaN(value) || value < minValue) {
      return defaultValue || minValue;
    }
    return value;
  }

  async getCompaniesPage(req: httpRequest): Promise<any> {
    const page = this.getValidNumberParam(req.queryParams.page, 1);
    const limit = this.getValidNumberParam(req.queryParams.limit, 10);

    const is_verify = req.queryParams.verifyOnly === "true";
    const enp_list = await this.enterpriseRepo.getEnterprisePage(
      page,
      limit,
      is_verify
    );

    return makeHttpResponse(200, {
      companies: enp_list.slice(0, limit),
      isNextPage: enp_list.length > limit,
      page,
    });
  }

  async addCompany(req: httpRequest): Promise<any> {
    try {
      const enp = new Enterprise(
        req.body.company_name,
        req.body.company_address,
        req.body.company_city,
        req.body.company_phone,
        req.body.company_website,
        req.body.company_logo_url,
        req.body.company_linkedin_url,
        req.body.overview,
        req.body.specialties
      );
      await this.enterpriseRepo.save(enp);
      return makeHttpResponse(200, { enp });
    } catch (err) {
      const e: RepoError = err as RepoError;
      console.log(e);
      return makeHttpError(400, e.response[0].message);
    }
  }

  async updateCompanyData(req: httpRequest): Promise<any> {
    const {
      value: { id },
      error: id_error,
    } = EnterpriseValidator.idSchema.validate(req.pathParams);
    if (id_error) return makeHttpError(400, "bad id");
    const { value, error } =
      EnterpriseValidator.updateEnterpriseDataSchema.validate(req.body);
    if (error) {
      if (error.message.includes("company_phone"))
        error.message = "unvalide phone number";
      error.message = error.message.replace(/"/g, "");
      return makeHttpError(400, error.message);
    }
    const enp = await this.enterpriseRepo.updateEnterprise(id, value);
    if (!enp) return makeHttpError(500, "something went wrong");
    return makeHttpResponse(200, { enp });
  }

  async initDbFromCrawlers() {
    try {
      const enterpriseList = await this.enterpriseRepo.readFromFiles();
      enterpriseList.forEach(async (e) => {
        console.log(`✅ ${e.company_name} is inserted`);
        delete e.codeSujet;
        const enp = new Enterprise(
          e.company_name,
          e.company_address,
          e.company_city,
          e.company_phone,
          e.company_website,
          e.company_logo_url,
          e.company_linkedin_url,
          e.overview,
          e.specialties
        );
        await this.enterpriseRepo.save(enp);
      });
    } catch (err) {
      console.error(err);
    }
  }
}
