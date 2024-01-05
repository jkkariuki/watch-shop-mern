const express = require("express");
const router = express.Router();

const {
  loginUser,
  logoutUser,
  registerUser,
  getMe,
} = require("../controllers/users");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getMe);

module.exports = router;
