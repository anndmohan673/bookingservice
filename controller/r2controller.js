const cloudflareDb = require("../services/cloudflaredb")

exports.generateUploadUrl = async (req, res, next) => {
  try {
    const result = await cloudflareDb.createSignedUploadUrl(req.body)
    return res.status(200).json({
      message: "Upload URL generated",
      ...result
    })
  } catch (error) {
    return next(error)
  }
}

exports.generateDownloadUrl = async (req, res, next) => {
  try {
    const result = await cloudflareDb.createSignedDownloadUrl(req.body)
    return res.status(200).json({
      message: "Download URL generated",
      ...result
    })
  } catch (error) {
    return next(error)
  }
}
