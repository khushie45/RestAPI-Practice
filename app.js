import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

mongoose
  .connect("mongodb://127.0.0.1:27017/Product")
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = new mongoose.model("Product", ProductSchema);

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.post("/api/v1/product/new", async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    success: true,
    newProduct,
  });
});

app.get("/api/v1/product/all", async (req, res) => {
  const allProduct = await Product.find();

  res.status(200).json({
    success: true,
    allProduct,
  });
});

app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.param.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

app.delete("/api/v1/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

app.listen(8000, () => {
  console.log("Server is working on port 8000");
});
