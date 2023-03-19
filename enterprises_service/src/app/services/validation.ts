import Joi from 'joi';

export default class EnterpriseServiceValidator {
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
