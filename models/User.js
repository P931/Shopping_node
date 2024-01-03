const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

  ProductName: {
    type: String,
    required: "ProductName is required",
    trim: true,
  },

  ProductQuantity: {
    type: Number,
    required: "ProductQuantity is required",
    trim: true,
  },

  ProductPrice: {
    type: Number,
    required: "ProductPrice is required",
    trim: true,
    unique: [true, "product price already exists in database!"],
  },

  ProductDescription: {
    type: String,
    required: "ProductDescription is required",
    trim: true,
  },

  ProductImage: {
    type: String,
    required: "ProductImage is required",
  },

})

const product = mongoose.model("product", productSchema)

module.exports = product