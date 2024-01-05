const Product = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
    // console.log(products);
    console.log("hello there");
    // res.json({ message: "hello there" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
    console.log(product);
    console.log(req.params.id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const imageName = req.file.filename;

  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: imageName,
    });
    await product.save();
    res.status(200).json(product);
    console.log(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
