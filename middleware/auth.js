const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME_IN_PRODUCTION"

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || ""
    const parts = authHeader.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Authorization header missing or malformed" })
    }

    const token = parts[1]
    const payload = jwt.verify(token, JWT_SECRET)

    req.user = {
      id: payload.id,
      email: payload.email
    }

    next()
  } catch (error) {
    console.error("Auth error:", error)
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}


