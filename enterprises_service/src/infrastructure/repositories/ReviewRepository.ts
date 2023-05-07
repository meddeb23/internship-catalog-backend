import { IReviewRepository, User } from "../../core";
import { ReviewsModel, UserModel } from "../model";
import { RepoError } from "../../helper";
import Review from "../../core/entities/Review";
import { sequelizeModel } from "../../database";

export default class ReviewRepository implements IReviewRepository {
  readonly model: typeof ReviewsModel;

  constructor(model: typeof ReviewsModel) {
    this.model = model;
  }

  async findById(reviewId: number): Promise<Review> {
    const review = await this.model.findByPk(reviewId, {
      include: [UserModel],
    });
    if (!review) return null;
    return this.#getEntity(review);
  }

  async findByUserId(userId: number): Promise<Review[]> {
    const reviews = await this.model.findAll({
      where: {
        userId,
      },
      include: [UserModel],
    });

    return reviews.map((i) => this.#getEntity(i));
  }

  async findByPage(
    companyId: number,
    page: number,
    limit: number
  ): Promise<Review[]> {
    const reviews = await this.model.findAll({
      where: {
        companyId,
      },
      include: [UserModel],
      offset: (page - 1) * limit,
      limit: limit + 1,
    });
    return reviews.map((i) => this.#getEntity(i));
  }
  async getRatingByCompanyId(companyId: number): Promise<any> {
    const result = await this.model.findOne({
      attributes: [
        [sequelizeModel.fn("AVG", sequelizeModel.col("rating")), "avgRating"],
        [sequelizeModel.fn("COUNT", sequelizeModel.col("id")), "nbReview"],
      ],
      where: { companyId },
    });
    return {
      avgRating: (result.get("avgRating") as number) ?? 0,
      nbReview: (result.get("nbReview") as number) ?? 0,
    };
  }

  async create(
    userId: number,
    content: string,
    rating: number,
    companyId: number
  ): Promise<Review> {
    try {
      const review = await this.model.create({
        userId,
        content,
        rating,
        companyId,
      });
      if (!review) return null;
      return await this.findById(review.id);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async delete(reviewId: number): Promise<number> {
    const rowAffected = await this.model.destroy({
      where: {
        id: reviewId,
      },
    });

    return rowAffected;
  }

  async update(
    reviewId: number,
    content: string,
    rating: number
  ): Promise<Review> {
    const [rowAffected] = await this.model.update(
      { content, rating },
      {
        where: {
          id: reviewId,
        },
      }
    );
    if (!rowAffected) return null;
    return await this.findById(reviewId);
  }

  async findOne(userId: number, companyId: number): Promise<Review> {
    const review = await this.model.findOne({
      where: {
        userId,
        companyId,
      },
      include: [UserModel],
    });

    return review ? this.#getEntity(review) : null;
  }

  #getEntity(m: ReviewsModel): Review {
    const user = new User(m.user.id, m.user.first_name, m.user.last_name);
    return new Review(
      m.content,
      m.rating,
      user,
      m.companyId,
      m.id,
      m.createdAt
    );
  }

  #handleError(err: any, action: string) {
    const error = new RepoError("Error in Enterprise Repository");
    if (!err.errors) throw err;
    err.errors.forEach((e: any) => {
      error.response.push({
        message: e.message,
        value: e.value,
      });
      error.stack += `\n${action}:\n\t${e.message}\n\tvalue: ${e.value}`;
    });
    throw error;
  }
}
