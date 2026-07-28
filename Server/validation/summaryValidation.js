const Joi = require('joi');

const createSummarySchema = Joi.object({
  courseName: Joi.string().min(2).max(100).required(),
  university: Joi.string().min(2).max(100).required(),
  subject: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow('').optional(),
  fileUrl: Joi.string().allow('').optional()
});

module.exports = {
  createSummarySchema
};