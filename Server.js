const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const port = process.env.PORT || 8000
const BASE_URL = process.env.BASE_URL
const cors = require("cors")
const app = express()
app.use(cors())


const router = require("./routes/users")
const product = require("./models/User")

// app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)
app.use("/uploads", express.static("./uploads"))
app.use("/files", express.static("./public/files"))


mongoose.connect(process.env.MONGO_URL, {
  // mongoose.connect('mongodb://localhost:27017/userShopping', {
  UseNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Mongodb connected SuccessFully...!!"))
  .catch((err) => console.log(err))


app.get("/", (req, res) => {
  res.send("shopping product ...")
})

app.listen(port, () => {
  console.log(`your server is running port no ${port}`)
})