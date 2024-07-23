const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const NewsAPI = require('newsapi'); // Make sure you have installed newsapi package
const router = express.Router();
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// Get user categories
router.get('/categories', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ 
      categories: ['sports', 'entertainment', 'technology', 'health', 'science'], // Define available categories
      selectedCategories: user.categories 
    });
  } catch (error) {
    console.error('Error fetching user categories:', error);
    res.status(500).json({ error: 'Error fetching user categories' });
  }
});

// Update user categories
router.put('/updatecategories', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.categories = req.body.categories;
    await user.save();

    res.status(200).json({ message: 'Categories updated successfully' });
  } catch (error) {
    console.error('Error updating user categories:', error);
    res.status(500).json({ error: 'Error updating user categories' });
  }
});



module.exports = router;
