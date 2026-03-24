const cloudflareDb = require("../services/cloudflaredb")
const { generateRandomString } = require("../helpers/randomString")

const PRODUCT_SCHEMA = "products"

const create = async ({ name, price, description }) => {
  const now = new Date().toISOString()
  const product = {
    productId: generateRandomString({ prefix: "prod", length: 24 }),
    name: name.trim(),
    normalizedName: name.trim().toLowerCase(),
    price: Number(price),
    description: description ? description.trim() : "",
    isDeleted: false,
    deletedAt: null,
    createdAt: now,
    updatedAt: now
  }

  await cloudflareDb.putOne({
    schemaName: PRODUCT_SCHEMA,
    id: product.productId,
    payload: product
  })
  return product
}

const findOne = async ({ productId }) =>
  cloudflareDb.getOne({
    schemaName: PRODUCT_SCHEMA,
    id: productId
  })

const updateOne = async ({ productId }, update = {}) => {
  const existing = await findOne({ productId })
  if (!existing) {
    return { modifiedCount: 0, value: null }
  }

  const nextValue = {
    ...existing,
    ...(update.$set || {}),
    updatedAt: new Date().toISOString()
  }

  await cloudflareDb.putOne({
    schemaName: PRODUCT_SCHEMA,
    id: productId,
    payload: nextValue
  })

  return { modifiedCount: 1, value: nextValue }
}

const find = async (filter = {}) => cloudflareDb.list({ schemaName: PRODUCT_SCHEMA, filters: filter })

module.exports = {
  create,
  findOne,
  updateOne,
  find
}
