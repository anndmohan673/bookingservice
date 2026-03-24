const productservices = require("../services/productservices")

exports.createProduct = async (req, res, next) => {
  try {
    const result = await productservices.createProduct(req.body)
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.updateProduct = async (req, res, next) => {
  try {
    const result = await productservices.updateProduct({
      productId: req.params.productId,
      ...req.body
    })
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const result = await productservices.deleteProduct({
      productId: req.params.productId
    })
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.listProducts = async (req, res, next) => {
  try {
    const result = await productservices.listProducts()
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.listAllProducts = async (req, res, next) => {
  try {
    const result = await productservices.listAllProducts()
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}
