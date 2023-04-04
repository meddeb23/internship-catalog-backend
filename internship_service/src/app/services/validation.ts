const Joi = require("joi");

export default class InternshipProcessServiceValidator {
  static idSchema = Joi.object({
    id: Joi.number().greater(0).required(),
  });
  static updateInternProcessDataSchema = Joi.object({
    company_id: Joi.number().greater(0),
    student_id: Joi.number().greater(0).required(),
    intern_department: Joi.string().min(3).max(255).required(),
    intern_company_supervisor_name: Joi.string().min(3).max(150).required(),
    intern_company_supervisor_address: Joi.string().email().required(),
    step: Joi.number(),
    intern_company_supervisor_phone: Joi.string()
      .pattern(new RegExp(/^[\+]?[0-9]{4,14}$/))
      .required(),
  });
  static updateSupervisorChoiceDataSchema = Joi.object({
    supervisor_id: Joi.number().greater(0).required(),
    internshipProcess_id: Joi.number().greater(0).required(),
    is_validated: Joi.boolean(),
  });
}
