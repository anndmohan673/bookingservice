const cloudflareDb = require("../services/cloudflaredb")
const { generateRandomString } = require("../helpers/randomString")

const WALLET_SCHEMA = "wallets"

const create = async ({ userid, referenceId, type, openingBalance, currentBalance }) => {
  const now = new Date().toISOString()
  const wallet = {
    _id: generateRandomString({ prefix: "w", length: 24 }),
    walletId: generateRandomString({ prefix: "wallet", length: 24 }),
    userid,
    referenceId,
    type,
    openingBalance,
    currentBalance,
    createdAt: now,
    updatedAt: now
  }
  await cloudflareDb.putOne({
    schemaName: WALLET_SCHEMA,
    id: referenceId,
    path: userid,
    payload: wallet
  })
  return wallet
}

const findOne = async ({ referenceId, userid }) =>
  cloudflareDb.getOne({
    schemaName: WALLET_SCHEMA,
    id: referenceId,
    path: userid
  })

const updateOne = async ({ referenceId, userid }, update = {}) => {
  let wallet = await findOne({ referenceId, userid })
  if (!wallet) {
    wallet = await create({
      userid,
      referenceId,
      type: null,
      openingBalance: "0",
      currentBalance: "0"
    })
  }

  const nextValue = {
    ...wallet,
    ...(update.$set || {}),
    updatedAt: new Date().toISOString()
  }

  await cloudflareDb.putOne({
    schemaName: WALLET_SCHEMA,
    id: referenceId,
    path: userid,
    payload: nextValue
  })

  return { modifiedCount: 1 }
}

const find = async ({ userid }) => {
  return cloudflareDb.list({
    schemaName: WALLET_SCHEMA,
    path: userid
  })
}

module.exports = {
  create,
  findOne,
  updateOne,
  find
}