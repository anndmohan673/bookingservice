const {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { getR2Client } = require("../config/r2")

const SIGNED_URL_EXPIRES_SECONDS = Number(process.env.R2_SIGNED_URL_EXPIRES || 900)

const bucketName = () => process.env.R2_BUCKET_NAME
const normalizeSchemaName = (schemaName) => schemaName.trim().toUpperCase()

const ensureSchemaName = (schemaName) => {
  if (!schemaName || typeof schemaName !== "string" || !schemaName.trim()) {
    throw new Error("schemaName is required")
  }
}

const streamToString = async (stream) => {
  const chunks = []
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString("utf-8")
}

const buildSchemaPrefix = (schemaName) => {
  ensureSchemaName(schemaName)
  return `${normalizeSchemaName(schemaName)}/`
}

const buildObjectKey = ({ schemaName, id, path = "" }) => {
  ensureSchemaName(schemaName)
  if (!id || typeof id !== "string" || !id.trim()) {
    throw new Error("id is required")
  }
  const cleanPath = path ? `${path.replace(/^\/+|\/+$/g, "")}/` : ""
  return `${buildSchemaPrefix(schemaName)}${cleanPath}${id}.json`
}

const putJsonByKey = async ({ key, payload }) => {
  const client = getR2Client()
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      Body: JSON.stringify(payload),
      ContentType: "application/json"
    })
  )
  return { key }
}

const getJsonByKey = async ({ key }) => {
  const client = getR2Client()
  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucketName(),
        Key: key
      })
    )
    const body = await streamToString(response.Body)
    return JSON.parse(body)
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return null
    }
    throw error
  }
}

const listJsonByPrefix = async ({ prefix, filters = {} }) => {
  const client = getR2Client()
  const data = []
  let continuationToken

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName(),
        Prefix: prefix,
        ContinuationToken: continuationToken
      })
    )

    const keys = (response.Contents || [])
      .map((item) => item.Key)
      .filter((key) => key && key.endsWith(".json"))

    const rows = await Promise.all(keys.map((key) => getJsonByKey({ key })))
    const records = rows.filter(Boolean).filter((row) => {
      const entries = Object.entries(filters || {})
      return entries.every(([field, value]) => row[field] === value)
    })

    data.push(...records)
    continuationToken = response.IsTruncated ? response.NextContinuationToken : null
  } while (continuationToken)

  return data
}

const putOne = async ({ schemaName, id, path = "", payload }) =>
  putJsonByKey({ key: buildObjectKey({ schemaName, id, path }), payload })

const getOne = async ({ schemaName, id, path = "" }) =>
  getJsonByKey({ key: buildObjectKey({ schemaName, id, path }) })

const list = async ({ schemaName, path = "", filters = {} }) => {
  const prefix = path
    ? `${buildSchemaPrefix(schemaName)}${path.replace(/^\/+|\/+$/g, "")}/`
    : buildSchemaPrefix(schemaName)
  return listJsonByPrefix({ prefix, filters })
}

const createSignedUploadUrl = async ({ key, contentType }) => {
  const client = getR2Client()
  const url = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      ContentType: contentType || "application/octet-stream"
    }),
    { expiresIn: SIGNED_URL_EXPIRES_SECONDS }
  )

  return { url, key, expiresIn: SIGNED_URL_EXPIRES_SECONDS }
}

const createSignedDownloadUrl = async ({ key }) => {
  const client = getR2Client()
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucketName(),
      Key: key
    }),
    { expiresIn: SIGNED_URL_EXPIRES_SECONDS }
  )

  return { url, key, expiresIn: SIGNED_URL_EXPIRES_SECONDS }
}

module.exports = {
  buildSchemaPrefix,
  buildObjectKey,
  putJsonByKey,
  getJsonByKey,
  listJsonByPrefix,
  putOne,
  getOne,
  list,
  createSignedUploadUrl,
  createSignedDownloadUrl
}
