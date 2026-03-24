const Joi = require("joi")

const referenceId = Joi.string().max(128)
const amount = Joi.number().positive()

exports.creditSchema = Joi.object({
  referenceId: referenceId.required(),
  amount: amount.required()
})

exports.debitSchema = Joi.object({
  referenceId: referenceId.required(),
  amount: amount.required()
})

exports.balanceSchema = Joi.object({
  referenceId: referenceId.required()
})

exports.transactionsSchema = Joi.object({})


