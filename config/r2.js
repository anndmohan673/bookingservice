const { S3Client } = require("@aws-sdk/client-s3")

const requiredEnvVars = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME"
]

const getMissingEnvVars = () =>
  requiredEnvVars.filter((name) => !process.env[name] || !process.env[name].trim())

const getR2Client = () => {
  const missing = getMissingEnvVars()
  if (missing.length > 0) {
    const error = new Error(`Missing R2 env vars: ${missing.join(", ")}`)
    error.status = 500
    throw error
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  })
}

module.exports = {
  getR2Client,
  getMissingEnvVars
}
