const Joi = require("joi")

// Generic validation middleware factory
module.exports = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property]

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => ({
          message: d.message,
          path: d.path
        }))
      })
    }

    // Replace with sanitized value
    req[property] = value
    return next()
  }
}


