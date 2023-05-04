import Joi from "joi";

const numIdSchema = Joi.number().greater(0).required();
const positiveInteger = Joi.number().greater(0);

export class Validator {
  static idSchema = numIdSchema;
  static Schema = {
    email: Joi.string().email(),
    first_name: Joi.string().min(3),
    last_name: Joi.string().min(3),
    majorId: numIdSchema,
    address: Joi.string().min(3),
  };
  static submitPersonalInfo = Joi.object({
    email: this.Schema.email.required(),
    first_name: this.Schema.first_name.required(),
    last_name: this.Schema.first_name.required(),
    majorId: this.Schema.majorId,
    address: this.Schema.address,
  });
}
