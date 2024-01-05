const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const productRouter = require("./routes/products");
const userRouter = require("./routes/users");

//express setup
const app = express();
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

//dbModels
const Product = require("./models/productModel");
const User = require("./models/userModel");

//db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("DB Connection failed", err);
  });

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
