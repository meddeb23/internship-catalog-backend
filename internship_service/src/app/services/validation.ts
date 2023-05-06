import Joi from "joi";

const id = Joi.number().greater(0);

export class InternshipProcessServiceValidator {
  static idSchema = Joi.object({
    id: Joi.number().greater(0).required(),
  });

  static choicesSchema = Joi.array()
    .length(3)
    .items(Joi.number().required())
    .required();

  static applicationSchema = Joi.object({
    companyId: id,
    companyName: Joi.string().min(3).max(255),
    studentId: id.required(),
    intern_department: Joi.string().min(3).max(255).required(),
    internCompanySupervisorName: Joi.string().min(3).max(150).required(),
    internCompanySupervisorAddress: Joi.string().email().required(),
    internCompanySupervisorPhone: Joi.string()
      .pattern(new RegExp(/^[\+]?[0-9]{4,14}$/))
      .required(),
  });
  static updateInternProcessDataSchema = Joi.object({
    companyId: id,
    studentId: id.required(),
    intern_department: Joi.string().min(3).max(255).required(),
    internCompanySupervisorName: Joi.string().min(3).max(150).required(),
    internCompanySupervisorAddress: Joi.string().email().required(),
    step: Joi.number(),
    internCompanySupervisorPhone: Joi.string()
      .pattern(new RegExp(/^[\+]?[0-9]{4,14}$/))
      .required(),
  });

  static updateSupervisorChoiceDataSchema = Joi.object({
    supervisor_id: id.required(),
    internshipProcess_id: id.required(),
    is_validated: Joi.boolean(),
  });
}
