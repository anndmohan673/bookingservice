const express = require("express")
const router = express.Router()

const walletcontroller = require("../controller/walletcontroller")
const usercontroller = require("../controller/usercontroller")
const r2controller = require("../controller/r2controller")
const auth = require("../middleware/auth")
const validate = require("../middleware/validate")
const { registerSchema, loginSchema } = require("../validators/auth")
const { uploadUrlSchema, downloadUrlSchema } = require("../validators/r2")
const {
  creditSchema,
  debitSchema,
  balanceSchema,
  transactionsSchema
} = require("../validators/wallet")

// Authentication
router.post("/auth/register", validate(registerSchema), usercontroller.register)
router.post("/auth/login", validate(loginSchema), usercontroller.login)

// Protected wallet routes
router.post("/wallet/credit", auth, validate(creditSchema), walletcontroller.walletCredit)
router.post("/wallet/debit", auth, validate(debitSchema), walletcontroller.walletDebit)
router.post("/wallet/balance", auth, validate(balanceSchema), walletcontroller.balance)
router.post("/wallet/transactions",auth,validate(transactionsSchema),walletcontroller.transactions)

// Protected R2 routes
router.post("/r2/upload-url", auth, validate(uploadUrlSchema), r2controller.generateUploadUrl)
router.post("/r2/download-url", auth, validate(downloadUrlSchema), r2controller.generateDownloadUrl)

module.exports = router
