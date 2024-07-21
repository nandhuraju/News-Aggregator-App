const express = require('express');
const axios = require('axios');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const CustomNews = require('../models/CustomNews');
const router = express.Router();
require('dotenv').config(); 

// Get user categories
router.get('/', verifyToken, async (req, res) => {
  try {
    const { categories } = req.user;
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Error fetching user details' });
  }
});

// Fetch news
router.get('/news', verifyToken, async (req, res) => {
  try {
    const { categories } = req.user;

    if (!categories || categories.length === 0) {
      return res.status(200).json({ articles: [] });
    }

    const newsPromises = categories.map(category =>
      axios.get(`https://newsapi.org/v2/top-headlines`, {
        params: {
          country: 'in',
          apiKey: process.env.NEWS_API_KEY,
          category: category.trim(),
          language: 'en',
          pageSize: 10
        }
      })
    );

    const customNews = await CustomNews.find({ category: { $in: categories } });
    const newsResponses = await Promise.all(newsPromises);
    const allArticles = [
      ...customNews,
      ...newsResponses.flatMap(response => response.data.articles)
    ];

    res.status(200).json({ articles: allArticles });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// Add bookmark
router.post('/bookmark', verifyToken, async (req, res) => {
  try {
    const { article } = req.body;
    const user = await User.findById(req.user.userId);

    user.bookmarks.push(article);
    await user.save();

    res.status(201).json({ message: 'Article bookmarked successfully' });
  } catch (error) {
    console.error('Error bookmarking article:', error);
    res.status(500).json({ error: 'Failed to bookmark article' });
  }
});


router.get('/bookmarks', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});


// Update categories

router.put('/updateCategories', verifyToken, async (req, res) => {
  try {
    const { categories } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.categories = categories;
    await user.save();

    res.status(200).json({ message: 'Categories updated successfully' });
  } catch (error) {
    console.error('Error updating categories:', error);
    res.status(500).json({ error: 'Failed to update categories' });
  }
});



// Add custom news
router.post('/addNews', verifyToken, async (req, res) => {
  try {
    const { title, description, url, urlToImage, category } = req.body;

    const customNews = new CustomNews({
      title,
      description,
      url,
      urlToImage,
      category,
    });

    await customNews.save();

    res.status(201).json({ message: 'Custom news added successfully' });
  } catch (error) {
    console.error('Error adding custom news:', error);
    res.status(500).json({ error: 'Failed to add custom news' });
  }
});

module.exports = router;
