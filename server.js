require("dotenv").config()

const app = require("./app")
const connectDb = require("./config/db")

const PORT = process.env.PORT || 3001

// Connect to DB first, then start server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Failed to start server due to DB error:", error)
    process.exit(1)
  })