const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const productRouter = require("./routes/products");
const userRouter = require("./routes/users");
const stripe = require("stripe")(process.env.STRIPE_KEY);

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

app.post("/api/checkout", cors(), async (req, res) => {
  console.log(req.body);
  const items = req.body;
  let lineItems = [];

  items.map((item) => {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://watch-shop-react2.onrender.com/collection",
    cancel_url: "https://watch-shop-react2.onrender.com/login",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

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
