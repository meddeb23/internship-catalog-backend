import Joi from "joi";

const numIdSchema = Joi.number().greater(0).required();
const positiveInteger = Joi.number().greater(0);

export class EnterpriseServiceValidator {
  static idSchema = Joi.object({
    id: Joi.number().greater(0).required(),
  });
  static updateEnterpriseDataSchema = Joi.object({
    company_name: Joi.string().alphanum().min(3).max(30),
    company_address: Joi.string().alphanum().min(3).max(150),
    company_city: Joi.string().min(3).max(150),
    company_phone: Joi.string().pattern(new RegExp(/^[\+]?[0-9]{4,14}$/)),
    company_website: Joi.string().uri(),
    company_logo_url: Joi.string().uri(),
    company_linkedin_url: Joi.string().uri(),
    overview: Joi.string(),
    specialties: Joi.string().alphanum().min(3).max(255),
    is_verified: Joi.boolean(),
  });
}
export class ReviewServiceValidator {
  static idSchema = numIdSchema;
  static Schema = {
    rating: Joi.number().greater(-1).less(6).required(),
    content: Joi.string(),
    companyId: numIdSchema,
    userId: numIdSchema,
  };
  static reviewSchema = Joi.object({
    ...ReviewServiceValidator.Schema,
  });
  static updateSchema = Joi.object({
    rating: ReviewServiceValidator.Schema.rating,
    content: ReviewServiceValidator.Schema.rating,
    userId: numIdSchema,
  });
}
