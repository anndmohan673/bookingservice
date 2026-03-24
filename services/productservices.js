const Product = require("../model/productmodel")

const baseResp = () => ({
  status: 400,
  message: "Error"
})

const normalizeName = (name) => name.trim().toLowerCase()
const listAllProducts = async () => Product.find()

const findActiveByName = async (name, excludeProductId = null) => {
  const normalized = normalizeName(name)
  const products = await listAllProducts()
  return products.find(
    (product) =>
      !product.isDeleted &&
      product.normalizedName === normalized &&
      product.productId !== excludeProductId
  )
}

exports.createProduct = async (data) => {
  const resp = baseResp()
  const { name, price, description } = data

  const existing = await findActiveByName(name)
  if (existing) {
    resp.message = "Product already exists"
    return resp
  }

  const product = await Product.create({
    name,
    price,
    description
  })

  return {
    status: 201,
    message: "Product created successfully",
    data: product
  }
}

exports.updateProduct = async ({ productId, name, price, description }) => {
  const resp = baseResp()
  const existing = await Product.findOne({ productId })

  if (!existing || existing.isDeleted) {
    resp.message = "Product not found"
    return resp
  }

  if (typeof name !== "undefined") {
    const duplicate = await findActiveByName(name, productId)
    if (duplicate) {
      resp.message = "Another product with this name already exists"
      return resp
    }
    existing.name = name.trim()
    existing.normalizedName = normalizeName(name)
  }

  if (typeof price !== "undefined") {
    existing.price = Number(price)
  }

  if (typeof description !== "undefined") {
    existing.description = description ? description.trim() : ""
  }

  const updated = await Product.updateOne(
    { productId },
    {
      $set: {
        name: existing.name,
        normalizedName: existing.normalizedName,
        price: existing.price,
        description: existing.description
      }
    }
  )

  if (!updated.modifiedCount) {
    resp.message = "Unable to update product"
    return resp
  }

  return {
    status: 200,
    message: "Product updated successfully",
    data: updated.value
  }
}

exports.deleteProduct = async ({ productId }) => {
  const resp = baseResp()
  const existing = await Product.findOne({ productId })

  if (!existing || existing.isDeleted) {
    resp.message = "Product not found"
    return resp
  }

  const updated = await Product.updateOne(
    { productId },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date().toISOString()
      }
    }
  )

  if (!updated.modifiedCount) {
    resp.message = "Unable to delete product"
    return resp
  }

  return {
    status: 200,
    message: "Product deleted successfully"
  }
}

exports.listProducts = async () => {
  const products = await listAllProducts()
  const active = products.filter((product) => !product.isDeleted)
  return {
    status: 200,
    message: "Products fetched successfully",
    data: active
  }
}

exports.listAllProducts = async () => {
  const products = await listAllProducts()
  return {
    status: 200,
    message: "All products fetched successfully",
    data: products
  }
}
