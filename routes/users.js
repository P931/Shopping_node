const express = require('express')
const router = express.Router();
const multer = require("multer")
const product = require("../models/User")
const csv = require('fast-csv')
const fs = require('fs')
const URL = process.env.BASE_URL

// fs is file System

const imgconfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads")
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}. ${file.originalname}`)
  }
})

const isImage = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new Error("only images is allowed"))
  }
}

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage
})

// Create Product 
router.post("/addProduct", upload.single("ProductImage"), async (req, res) => {

  const { ProductName, ProductQuantity, ProductPrice, ProductDescription, } = req.body
  const ProductImage = req.file.filename


  if (!ProductName || !ProductQuantity || !ProductPrice || !ProductDescription || !ProductImage) {
    res.status(422).send("Please, first fill all Field")
  }

  if (!req.file) {
    res.status(422).send("No Image file is uploaded")
  }

  try {

    const addProduct = new product({
      ProductName,
      ProductQuantity,
      ProductPrice,
      ProductDescription,
      ProductImage,
    })
    await addProduct.save();

    // res.status(201).json(addProduct)
    res.status(201).json({ addProduct, message: "Product cart SuccessFull Created." })

  } catch (error) {
    res.send(error)
  }
})


// Get All product cart data...  
router.get("/getAllProductCart", async (req, res) => {

  try {

    const productData = await product.find()

    res.status(201).json({ productData })

  } catch (error) {
    console.log("error in productCartData is :- ", error)
    // res.status(422).json(error)
    res.json(error)
  }

})


const cart = [];

router.post("/addToProductCart", upload.single("ProductImage"), async (req, res) => {

  const { _id, ProductName, ProductQuantity, ProductPrice, ProductDescription, ProductImage } = req.body


  if (!_id || !ProductName || !ProductQuantity || !ProductPrice || !ProductDescription || !ProductImage) {
    res.status(422).send("Please, first fill all Field")
  }

  try {

    const existingItem = await product.findById(_id)

    if (existingItem) {

      // existingItem.ProductQuantity += 1;

      // await existingItem.save();

      res.send(existingItem);

    }
    else {
      cart.push({ _id, ProductName, ProductPrice, ProductDescription, ProductImage, ProductQuantity: 1, });
    }

  } catch (error) {

    console.log("error in addToCart is :- ", error)
    res.status(404).send(error);
  }

})


router.put('/incrementProductQuantity', async (req, res) => {

  try {

    const { productId } = req.body;

    const productData = await product.findById(productId);


    if (!productData) {
      return res.status(404).send('Product not found');
    }

    productData.ProductQuantity += 1;

    await productData.save();

    res.send(productData);

  } catch (error) {
    res.status(500).send(error);
  }
});



router.put('/decrementProductQuantity', async (req, res) => {

  try {

    const { productId } = req.body;

    const productDetail = await product.findById(productId);


    if (!productDetail) {
      return res.status(404).send('Product not found');
    }

    if (productDetail) {

      if (productDetail.ProductQuantity > 1) {

        productDetail.ProductQuantity -= 1;

        await productDetail.save();

        res.status(200).send(productDetail)

      }

    } else {

      return res.status(400).send("productDetail is not found")
    }

  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;