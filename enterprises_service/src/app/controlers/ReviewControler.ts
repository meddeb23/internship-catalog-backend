import { Request, Response, Router } from "express";
import { IEnterpriseRepository, IReviewRepository } from "../../core";
import { adaptRequest, httpRequest } from "../../helper";
import { EnterpriseRepository, ReviewRepository } from "../../infrastructure";
import {
  EnterpriseModel,
  LikeCompanyModel,
  ReviewsModel,
  SaveCompanyModel,
} from "../../infrastructure/model";
import ReviewService, { IReviewService } from "../services/ReviewService";

const router = Router();

const enterpriseRepository: IEnterpriseRepository = new EnterpriseRepository(
  EnterpriseModel,
  SaveCompanyModel,
  LikeCompanyModel
);
const reviewRepository: IReviewRepository = new ReviewRepository(ReviewsModel);
const service = new ReviewService(reviewRepository, enterpriseRepository);

router.post("/", makeReviewController("addReview", service));
router.get("/user/:userId", makeReviewController("getUserReview", service));
router.get(
  "/company/:companyId",
  makeReviewController("getReviewsPage", service)
);
router.get("/:id", makeReviewController("getReview", service));
// router.put("/:reviewId", makeReviewController("updateReview", service));
router.delete("/:reviewId", makeReviewController("deleteReview", service));

function makeReviewController(
  action: keyof IReviewService,
  handler: IReviewService
) {
  return async function controller(req: Request, res: Response) {
    const httpRequest: httpRequest = adaptRequest(req);
    const { headers, status, data } = await handler[action](httpRequest);
    res.status(status).set(headers).json(data);
  };
}

export default router;
