const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { userName, password, email, userType, categories } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: userName,
      password: hashedPassword,
      email,
      userType,
      categories,
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed - User doesn\'t exist' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed - Password doesn\'t match' });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType, categories: user.categories },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    res.cookie('Authtoken', token);

    res.json({
      status: true,
      message: 'Login successful',
      token,
      userType: user.userType,
      categories: user.categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('Authtoken');
  res.status(200).send('Logout successful');
});

module.exports = router;
