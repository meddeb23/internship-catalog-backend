import User from "./User";

export default class Review {
  readonly id?: number;
  public content: string;
  public rating: number;
  readonly user: User;
  readonly companyId: number;
  readonly createdAt: Date;

  constructor(
    content: string,
    rating: number,
    user: User,
    companyId: number,
    id?: number,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.content = content;
    this.rating = rating;
    this.user = user;
    this.companyId = companyId;
    this.createdAt = createdAt;
  }

  isValidReview(review: number) {
    return review >= 0 && review <= 5;
  }
}
