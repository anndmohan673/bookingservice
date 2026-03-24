const mongoose = require("mongoose")

const mongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected")
    } catch (error) {
        console.error("DB connection error:", error)
        console.log("DB not connected")
        throw error
    }
}

module.exports = mongoDb