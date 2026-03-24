const Joi = require("joi")

const email = Joi.string().email().max(254)
const password = Joi.string().min(8).max(128)

exports.registerSchema = Joi.object({
  name: Joi.string().max(100).allow("", null),
  email: email.required(),
  password: password.required()
})

exports.loginSchema = Joi.object({
  email: email.required(),
  password: password.required()
})


