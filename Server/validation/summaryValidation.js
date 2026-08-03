const Joi = require('joi');

const createSummarySchema = Joi.object({
  courseName: Joi.string().trim().min(2).max(100).required(),
  university: Joi.string().trim().min(2).max(100).required(),
  subject: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).allow('').optional()
});

const updateSummarySchema = Joi.object({
  courseName: Joi.string().trim().min(2).max(100).required(),
  university: Joi.string().trim().min(2).max(100).required(),
  subject: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).allow('').optional()
});

module.exports = {
  createSummarySchema,
  updateSummarySchema
};