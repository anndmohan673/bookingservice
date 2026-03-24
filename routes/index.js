const express = require("express")
const router = express.Router()

const walletcontroller = require("../controller/walletcontroller")
const usercontroller = require("../controller/usercontroller")
const auth = require("../middleware/auth")
const validate = require("../middleware/validate")
const { registerSchema, loginSchema } = require("../validators/auth")
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

module.exports = router
