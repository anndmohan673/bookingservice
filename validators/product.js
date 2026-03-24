const Joi = require("joi")

const productId = Joi.string().trim().min(8).max(128)
const name = Joi.string().trim().min(2).max(150)
const price = Joi.number().positive().precision(2)
const description = Joi.string().trim().max(2000).allow("")

exports.createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.optional()
})

exports.updateProductParamsSchema = Joi.object({
  productId: productId.required()
})

exports.updateProductSchema = Joi.object({
  name: name.optional(),
  price: price.optional(),
  description: description.optional()
}).min(1)

exports.deleteProductParamsSchema = Joi.object({
  productId: productId.required()
})
