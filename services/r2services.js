const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { getR2Client } = require("../config/r2")

const PRESIGNED_URL_EXPIRES_SECONDS = Number(process.env.R2_SIGNED_URL_EXPIRES || 900)

const bucketName = () => process.env.R2_BUCKET_NAME

exports.createUploadUrl = async ({ key, contentType }) => {
  const client = getR2Client()
  const command = new PutObjectCommand({
    Bucket: bucketName(),
    Key: key,
    ContentType: contentType || "application/octet-stream"
  })

  const url = await getSignedUrl(client, command, {
    expiresIn: PRESIGNED_URL_EXPIRES_SECONDS
  })

  return { url, key, expiresIn: PRESIGNED_URL_EXPIRES_SECONDS }
}

exports.createDownloadUrl = async ({ key }) => {
  const client = getR2Client()
  const command = new GetObjectCommand({
    Bucket: bucketName(),
    Key: key
  })

  const url = await getSignedUrl(client, command, {
    expiresIn: PRESIGNED_URL_EXPIRES_SECONDS
  })

  return { url, key, expiresIn: PRESIGNED_URL_EXPIRES_SECONDS }
}
