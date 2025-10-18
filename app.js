const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyToken = require('./src/authMiddleware');

dotenv.config();
const app = express();
app.use(express.json());

// Hardcoded user (for simplicity)
const USER = {
  username: 'dheeraj',
  password: '12345'
};

// Login Route (Generates JWT)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    // Generate JWT token valid for 1 hour
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected Route
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}! You have accessed a protected route.`,
    data: {
      accountType: 'Premium',
      lastLogin: '2025-10-17 10:30 AM'
    }
  });
});

// Another Protected Route Example
app.get('/settings', verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}, you can modify your account settings here.`,
  });
});

// Public Route (no token required)
app.get('/', (req, res) => {
  res.send('Public route: no authentication required.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
