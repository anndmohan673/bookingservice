const userservices = require("../services/userservices")

exports.register = async (req, res, next) => {
  try {
    const result = await userservices.register(req.body)
    return res.status(201).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const result = await userservices.login(req.body)
    return res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}