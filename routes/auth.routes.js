const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');

// ✅ Clean version — only routes
router.post('/signup', signup);
router.post('/login', login); // ← this now uses your controller logic

module.exports = router;

