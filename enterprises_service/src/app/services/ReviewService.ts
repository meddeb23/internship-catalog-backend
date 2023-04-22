import { IEnterpriseRepository, IReviewRepository } from "../../core";
import {
  httpRequest,
  makeHttpError,
  makeHttpResponse,
  RepoError,
} from "../../helper";
import { ReviewServiceValidator as Validator } from "./validation";

export interface IReviewService {
  addReview: (req: httpRequest) => Promise<any>;
  getReview(req: httpRequest): Promise<any>;
  getUserReview(req: httpRequest): Promise<any>;
  getReviewsPage(req: httpRequest): Promise<any>;
  updateReview(req: httpRequest): Promise<any>;
  deleteReview(req: httpRequest): Promise<any>;
}

export default class ReviewService implements IReviewService {
  reviewRepo: IReviewRepository;
  enterpriseRepo: IEnterpriseRepository;

  constructor(
    reviewRepo: IReviewRepository,
    enterpriseRepo: IEnterpriseRepository
  ) {
    this.reviewRepo = reviewRepo;
    this.enterpriseRepo = enterpriseRepo;
  }

  async getReview(req: httpRequest): Promise<any> {
    const reviewId = parseInt(req.pathParams.reviewId);

    const { error } = Validator.idSchema.validate(reviewId);
    if (error) return makeHttpError(400, error.message);

    const review = await this.reviewRepo.findById(reviewId);
    if (!review) return makeHttpError(404, "review not found");

    return makeHttpResponse(200, { review });
  }

  async getUserReview(req: httpRequest): Promise<any> {
    const { userId } = req.pathParams;

    const { error } = Validator.idSchema.validate(userId);
    if (error) return makeHttpError(400, error.message);

    const review = await this.reviewRepo.findByUserId(userId);
    if (!review) return makeHttpError(404, "review not found");

    return makeHttpResponse(200, { review });
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

  async getReviewsPage(req: httpRequest): Promise<any> {
    const page = this.getValidNumberParam(req.queryParams.page, 1);
    const limit = this.getValidNumberParam(req.queryParams.limit, 10);

    const { companyId } = req.pathParams;

    const { error } = Validator.idSchema.validate(companyId);
    if (error) return makeHttpError(400, error.message);

    const reviewsSlice = await this.reviewRepo.findByPage(
      companyId,
      page,
      limit
    );
    const isNextPage = reviewsSlice.length > limit;
    const reviews = reviewsSlice.slice(0, limit);
    return makeHttpResponse(200, { reviews, isNextPage });
  }

  async addReview(req: httpRequest): Promise<any> {
    try {
      const { value, error } = Validator.reviewSchema.validate(req.body);
      if (error) return makeHttpError(400, error.message);

      const { userId, companyId, rating, content } = value;

      const company = await this.enterpriseRepo.getEnterpriseById(companyId);
      if (!company) return makeHttpError(404, "Company does not exist");

      const review = await this.reviewRepo.findOne(userId, companyId);
      if (review) {
        if (review.user.id !== userId) return makeHttpError(403, "Forbidden");
        const updatedReview = await this.reviewRepo.update(
          review.id,
          value.content,
          value.rating
        );
        if (!updatedReview) return makeHttpError(500, "Something went wrong");
        return makeHttpResponse(200, { review: updatedReview });
      }

      const newReview = await this.reviewRepo.create(
        userId,
        content,
        rating,
        companyId
      );
      console.log(!newReview);
      if (!newReview) return makeHttpError(500, "Review Couldn't be created");
      return makeHttpResponse(200, { review: newReview });
    } catch (err) {
      const e: RepoError = err as RepoError;
      console.log(e);
      return makeHttpError(400, e.response[0].message);
    }
  }

  async updateReview(req: httpRequest): Promise<any> {
    const { value: reviewId, error: id_error } = Validator.idSchema.validate(
      req.pathParams.reviewId
    );
    if (id_error) return makeHttpError(404, "review not found");
    const { value, error } = Validator.updateSchema.validate(req.body);
    if (error) return makeHttpError(400, error.message);

    const review = await this.reviewRepo.findById(reviewId);
    if (!review) return makeHttpError(404, "Review not found");

    if (review.user.id !== value.userId) return makeHttpError(403, "Forbidden");

    const updatedReview = await this.reviewRepo.update(
      reviewId,
      value.content,
      value.rating
    );
    if (!updatedReview) return makeHttpError(500, "Something went wrong");

    return makeHttpResponse(200, { review: updatedReview });
  }

  async deleteReview(req: httpRequest): Promise<any> {
    const { value: reviewId, error: id_error } = Validator.idSchema.validate(
      req.pathParams.reviewId
    );
    if (id_error) return makeHttpError(400, "Review not found");

    const review = await this.reviewRepo.findById(reviewId);
    if (!review) return makeHttpError(404, "Review not found");

    const { value: userId, error } = Validator.idSchema.validate(
      req.body.userId
    );
    if (error || review.user.id !== userId)
      return makeHttpError(403, "Forbidden");

    const deletedReview = await this.reviewRepo.delete(reviewId);
    if (!deletedReview) return makeHttpError(500, "Something went wrong");

    return makeHttpResponse(200, { review });
  }
}
