import Joi from "joi";

const EndpointsSchema = Joi.object({
  description: Joi.string(),
  path: Joi.string()
    .pattern(new RegExp(/^\/(:?[a-zA-Z0-9-_~.]+\/?)*$/))
    .required(),
  params: Joi.array().items(Joi.string()),
  method: Joi.string()
    .valid(...["POST", "GET", "DELETE", "PUT", "PATCH"])
    .required(),
  auth: Joi.object().keys({
    type: Joi.string()
      .required()
      .valid(...["jwt"]),
    roles: Joi.array().items(Joi.string().valid("admin", "student", 'professor')),
  }),
});

const ServiceRegisteryRequestSchema = Joi.object({
  name: Joi.string()
    .min(7)
    .max(100)
    .pattern(new RegExp(/^[a-z][a-z\-]*service$/))
    .required(),
  version: Joi.string()
    .pattern(new RegExp(/^\d+\.\d+\.\d+$/))
    .required(),
  url: Joi.string(),
  port: Joi.number().greater(2000).required(),
  endpoints: Joi.array().items(EndpointsSchema),
});

export default ServiceRegisteryRequestSchema;
