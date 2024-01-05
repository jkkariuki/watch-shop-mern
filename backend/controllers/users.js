const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  if (user) {
    user.password = undefined;
    res
      .cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(201)
      .send(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    user.password = undefined;
    res
      .cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send(user);
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const logoutUser = asyncHandler(async function (req, res) {
  console.log(res.user);
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "logged out successfully" });
});

const getMe = asyncHandler(async function (req, res) {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);
    res.json(true);
  } catch (error) {
    res.json(false);
  }

  // console.log("USER ID " + req.user);
  // const { _id, name, email } = await User.findById(req.user.id);

  // res.status(200).json({
  //   id: _id,
  //   name,
  //   email,
  // });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
