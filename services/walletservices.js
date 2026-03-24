const Wallet = require("../model/wallet")

const baseResp = () => ({
  status: 400,
  message: "Error"
})

exports.creditWallet = async (data) => {
  const resp = baseResp()

  const { referenceId, amount, userId } = data
  if (!referenceId || typeof amount === "undefined") {
    resp.message = "referenceId and amount are required"
    return resp
  }

  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    resp.message = "Amount must be a positive number"
    return resp
  }

  const fetchWallet = await Wallet.findOne({ referenceId, userid: userId }).lean()
  if (!fetchWallet) {
    resp.message = "Wallet not found for this user"
    return resp
  }

  const currentBalance = Number(fetchWallet.currentBalance || 0)
  const newBalance = currentBalance + numericAmount

  const updateWallet = await Wallet.updateOne(
    { referenceId, userid: userId },
    {
      $set: {
        type: "credit",
        currentBalance: String(newBalance)
      }
    }
  )

  if (!updateWallet || updateWallet.modifiedCount === 0) {
    resp.message = "Unable to update wallet"
    return resp
  }

  return {
    status: 200,
    message: "Wallet amount credited",
    balance: newBalance
  }
}

exports.debitWallet = async (data) => {
  const resp = baseResp()

  const { referenceId, amount, userId } = data
  if (!referenceId || typeof amount === "undefined") {
    resp.message = "referenceId and amount are required"
    return resp
  }

  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    resp.message = "Amount must be a positive number"
    return resp
  }

  const fetchWallet = await Wallet.findOne({ referenceId, userid: userId }).lean()
  if (!fetchWallet) {
    resp.message = "Wallet not found for this user"
    return resp
  }

  const currentBalance = Number(fetchWallet.currentBalance || 0)
  const newBalance = currentBalance - numericAmount

  if (newBalance < 0) {
    resp.message = "Insufficient wallet balance"
    return resp
  }

  const updateWallet = await Wallet.updateOne(
    { referenceId, userid: userId },
    {
      $set: {
        type: "debit",
        currentBalance: String(newBalance)
      }
    }
  )

  if (!updateWallet || updateWallet.modifiedCount === 0) {
    resp.message = "Unable to update wallet"
    return resp
  }

  return {
    status: 200,
    message: "Wallet amount debited",
    balance: newBalance
  }
}

exports.allTransactions = async (userId) => {
  const resp = baseResp()

  const fetchWallet = await Wallet.find({ userid: userId }).lean()
  if (!fetchWallet || fetchWallet.length === 0) {
    resp.message = "No wallet transactions found"
    return resp
  }

  return {
    status: 200,
    message: "Success",
    data: fetchWallet
  }
}

exports.balance = async (data) => {
  const resp = baseResp()

  const { referenceId, userId } = data
  if (!referenceId) {
    resp.message = "referenceId is required"
    return resp
  }

  const fetchWallet = await Wallet.findOne({ referenceId, userid: userId }).lean()
  if (!fetchWallet) {
    resp.message = "Wallet not found for this user"
    return resp
  }

  const balance = Number(fetchWallet.currentBalance || 0)

  return {
    status: 200,
    message: "Wallet amount fetched successfully",
    balance
  }
}