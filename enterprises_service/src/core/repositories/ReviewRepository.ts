import Review from "../entities/Review";

export default interface IReviewRepository {
  findById(reviewId: number): Promise<Review>;
  findByPage(companyId: number, page: number, limit: number): Promise<Review[]>;
  findOne(userId: number, companyId: number): Promise<Review>;
  findByUserId(userId: number): Promise<Review[]>;
  create(
    userId: number,
    content: string,
    rating: number,
    companyId: number
  ): Promise<Review>;
  delete(reviewId: number): Promise<number>;
  update(reviewId: number, content: string, rating: number): Promise<Review>;
  getRatingByCompanyId(companyId: number): Promise<any>;
}
