// controllers/auth.controller.js

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Signup logic
const signup = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    // ✅ Validate required fields
    if (!username || !password || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    

    // ✅ Create and save user
    const newUser = new User({ username, password: password, email, phone });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// ✅ Login logic
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // ✅ Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // ✅ Compare password
    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // ✅ Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

module.exports = { signup, login };
