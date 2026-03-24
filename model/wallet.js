const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const WalletSchema = new mongoose.Schema(
  {
    walletId: { type: String, default: () => uuidv4(), unique: true },
    userid: { type: String, required: true },
    referenceId: { type: String, required: true, unique: true },
    type: { type: String, enum: ["credit", "debit"] },
    openingBalance: { type: String },
    currentBalance: { type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("Wallet", WalletSchema)