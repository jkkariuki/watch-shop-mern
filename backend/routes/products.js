const express = require("express");
const router = express.Router();
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const {
  getProducts,
  getProductById,
  addProduct,
} = require("../controllers/products");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/add", upload.single("image"), addProduct);

module.exports = router;
