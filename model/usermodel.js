const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, default: () => uuidv4(), unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("User", UserSchema)