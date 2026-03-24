const cloudflareDb = require("../services/cloudflaredb")
const { generateRandomString } = require("../helpers/randomString")

const USER_SCHEMA = "users"
const USER_EMAIL_INDEX_SCHEMA = "users_by_email"

const normalizeEmail = (email) => email.toLowerCase().trim()

const create = async ({ name, email, password }) => {
  const now = new Date().toISOString()
  const user = {
    _id: generateRandomString({ prefix: "USR", length: 5, includeDate: true }),
    userId: generateRandomString({ prefix: "USR", length: 5, includeDate: true }),
    name: name || "",
    email: normalizeEmail(email),
    password,
    createdAt: now,
    updatedAt: now
  }

  await cloudflareDb.putOne({
    schemaName: USER_SCHEMA,
    id: user._id,
    payload: user
  })
  await cloudflareDb.putOne({
    schemaName: USER_EMAIL_INDEX_SCHEMA,
    id: user.email,
    payload: { userId: user._id, email: user.email }
  })

  return user
}

const findOne = async (filter = {}) => {
  if (filter.email) {
    const emailIndex = await cloudflareDb.getOne({
      schemaName: USER_EMAIL_INDEX_SCHEMA,
      id: normalizeEmail(filter.email)
    })
    if (!emailIndex || !emailIndex.userId) {
      return null
    }
    return cloudflareDb.getOne({ schemaName: USER_SCHEMA, id: emailIndex.userId })
  }

  if (filter._id) {
    return cloudflareDb.getOne({ schemaName: USER_SCHEMA, id: filter._id })
  }

  return null
}

const deleteOne = async (filter = {}) => {
  const user = await findOne(filter)
  if (!user) {
    return { deletedCount: 0 }
  }

  const tombstone = {
    ...user,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await cloudflareDb.putOne({
    schemaName: USER_SCHEMA,
    id: user._id,
    payload: tombstone
  })

  return { deletedCount: 1 }
}

const find = async () => {
  const users = await cloudflareDb.list({ schemaName: USER_SCHEMA })
  return users.filter((user) => !user.isDeleted)
}

module.exports = {
  create,
  findOne,
  deleteOne,
  find
}