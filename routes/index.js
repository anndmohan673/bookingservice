const express = require("express")
const router = express.Router()

const walletcontroller = require("../controller/walletcontroller")
const usercontroller = require("../controller/usercontroller")
const r2controller = require("../controller/r2controller")
const productcontroller = require("../controller/productcontroller")
const auth = require("../middleware/auth")
const validate = require("../middleware/validate")
const { registerSchema, loginSchema } = require("../validators/auth")
const { uploadUrlSchema, downloadUrlSchema } = require("../validators/r2")
const {
  createProductSchema,
  updateProductSchema,
  updateProductParamsSchema,
  deleteProductParamsSchema
} = require("../validators/product")
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

// Protected product routes (R2 only)
router.post("/products", auth, validate(createProductSchema), productcontroller.createProduct)
router.patch(
  "/products/:productId",
  auth,
  validate(updateProductParamsSchema, "params"),
  validate(updateProductSchema),
  productcontroller.updateProduct
)
router.delete(
  "/products/:productId",
  auth,
  validate(deleteProductParamsSchema, "params"),
  productcontroller.deleteProduct
)
router.get("/products", auth, productcontroller.listProducts)
router.get("/products/all", auth, productcontroller.listAllProducts)

module.exports = router
