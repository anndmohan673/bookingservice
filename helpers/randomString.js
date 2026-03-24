const crypto = require("crypto")

const getDatePart = (date) => {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${day}${month}${year}`
}

const generateRandomString = ({ prefix, length, includeDate = false }) => {
  if (!prefix || typeof prefix !== "string" || !prefix.trim()) {
    throw new Error("prefix is required to generate random string")
  }

  const size = Math.max(4, Number(length) || 16)
  let token = ""
  for (let i = 0; i < size; i += 1) {
    token += crypto.randomInt(10)
  }
  const cleanPrefix = prefix.trim().toUpperCase()

  if (!includeDate) {
    return `${cleanPrefix}${token}`
  }

  return `${cleanPrefix}${getDatePart(new Date())}${token}`
}

module.exports = {
  generateRandomString
}
