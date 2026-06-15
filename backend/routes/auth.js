const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hash,
    });

    res.json({ message: "Register Successfully" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "Invalid Credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({
  message: "Login Successfully",
  token,
  user: {
    name: user.name,
    email: user.email,
  },
});
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;