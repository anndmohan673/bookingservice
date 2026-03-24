const walletservices = require("../services/walletservices")

exports.walletCredit = async (req, res, next) => {
  try {
    const result = await walletservices.creditWallet({
      ...req.body,
      userId: req.user.id
    })
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.walletDebit = async (req, res, next) => {
  try {
    const result = await walletservices.debitWallet({
      ...req.body,
      userId: req.user.id
    })
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.transactions = async (req, res, next) => {
  try {
    const result = await walletservices.allTransactions(req.user.id)
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}

exports.balance = async (req, res, next) => {
  try {
    const result = await walletservices.balance({
      ...req.body,
      userId: req.user.id
    })
    return res.status(result.status || 200).json(result)
  } catch (error) {
    return next(error)
  }
}