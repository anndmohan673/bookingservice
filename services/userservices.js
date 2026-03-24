const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../model/usermodel")

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME_IN_PRODUCTION"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"
const SALT_ROUNDS = 10

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc }
  delete user.password
  return user
}

exports.register = async (data) => {
  const { name, email, password } = data

  if (!email || !password) {
    const error = new Error("Email and password are required")
    error.status = 400
    throw error
  }

  const existing = await User.findOne({ email })
  if (existing) {
    const error = new Error("User already exists with this email")
    error.status = 409
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return {
    user: sanitizeUser(user),
    token
  }
}

exports.login = async (data) => {
  const { email, password } = data

  if (!email || !password) {
    const error = new Error("Email and password are required")
    error.status = 400
    throw error
  }

  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    const error = new Error("Invalid email or password")
    error.status = 401
    throw error
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const error = new Error("Invalid email or password")
    error.status = 401
    throw error
  }

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return {
    user: sanitizeUser(user),
    token
  }
}

exports.getUsers = async (filter = {}) => {
  const users = await User.find(filter)
  return users.map(sanitizeUser)
}