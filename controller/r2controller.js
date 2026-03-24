const r2services = require("../services/r2services")

exports.generateUploadUrl = async (req, res, next) => {
  try {
    const result = await r2services.createUploadUrl(req.body)
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
    const result = await r2services.createDownloadUrl(req.body)
    return res.status(200).json({
      message: "Download URL generated",
      ...result
    })
  } catch (error) {
    return next(error)
  }
}
