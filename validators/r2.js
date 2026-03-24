const Joi = require("joi")

const key = Joi.string().trim().min(1).max(1024)

exports.uploadUrlSchema = Joi.object({
  key: key.required(),
  contentType: Joi.string().trim().max(255).optional()
})

exports.downloadUrlSchema = Joi.object({
  key: key.required()
})
