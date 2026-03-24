const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")

const routes = require("./routes")

const app = express()

// Basic security and parsing middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// API routes
app.use("/api", routes)

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  const message = err.message || "Internal Server Error"
  res.status(status).json({ message })
})

module.exports = app