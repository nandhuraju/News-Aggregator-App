const express = require("express");
const axios = require("axios");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");
const CustomNews = require("../models/CustomNews");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Get user categories
router.get("/", verifyToken, async (req, res) => {
  try {
    const { categories } = req.user;
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Error fetching user details" });
  }
});

// Fetch news (API + Custom)
router.get("/news", verifyToken, async (req, res) => {
  try {
    const { categories } = req.user;

    if (!categories || categories.length === 0) {
      return res.status(200).json({ articles: [] });
    }

    const newsPromises = categories.map((category) =>
      axios.get(`https://newsapi.org/v2/top-headlines`, {
        params: {
          country: "in",
          apiKey: process.env.NEWS_API_KEY,
          category: category.trim(),
          language: "en",
          pageSize: 10,
        },
      })
    );

    const customNews = await CustomNews.find({ category: { $in: categories } });
    const newsResponses = await Promise.all(newsPromises);
    const apiArticles = newsResponses.flatMap(
      (response) => response.data.articles
    );
    const allArticles = [
      ...customNews.map((news) => ({ ...news.toObject(), custom: true })),
      ...apiArticles,
    ];

    res.status(200).json({ articles: allArticles });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news" });
  }
});

// Add bookmark
router.post("/bookmark", verifyToken, async (req, res) => {
  try {
    const { article } = req.body;
    const user = await User.findById(req.user.userId);

    user.bookmarks.push(article);
    await user.save();

    res.status(201).json({ message: "Article bookmarked successfully" });
  } catch (error) {
    console.error("Error bookmarking article:", error);
    res.status(500).json({ error: "Failed to bookmark article" });
  }
});

// Fetch bookmarks
router.get("/bookmarks", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// Delete bookmark
router.delete("/bookmark", verifyToken, async (req, res) => {
  try {
    const { article } = req.body;
    const user = await User.findById(req.user.userId);

    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.url !== article.url
    );

    await user.save();

    res.status(200).json({ message: "Article removed from bookmarks" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

// Add custom news
router.post("/addNews", verifyToken, async (req, res) => {
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

    res.status(201).json({ message: "Custom news added successfully" });
  } catch (error) {
    console.error("Error adding custom news:", error);
    res.status(500).json({ error: "Failed to add custom news" });
  }
});

// Edit custom news
router.put("/editNews/custom/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, url, urlToImage, category } = req.body;
    const { id } = req.params;

    const updatedNews = await CustomNews.findByIdAndUpdate(
      id,
      { title, description, url, urlToImage, category },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ error: "Custom news article not found" });
    }

    res
      .status(200)
      .json({
        message: "Custom news article updated successfully",
        updatedNews,
      });
  } catch (error) {
    console.error("Error updating custom news article:", error);
    res.status(500).json({ error: "Failed to update custom news article" });
  }
});

// Delete custom news
router.delete("/deleteNews/custom/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNews = await CustomNews.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ error: "Custom news article not found" });
    }

    res
      .status(200)
      .json({ message: "Custom news article deleted successfully" });
  } catch (error) {
    console.error("Error deleting custom news article:", error);
    res.status(500).json({ error: "Failed to delete custom news article" });
  }
});

// Fetch specific custom news by ID
router.get("/customNews/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const customNews = await CustomNews.findById(id);

    if (!customNews) {
      return res.status(404).json({ error: "Custom news article not found" });
    }

    res.status(200).json(customNews);
  } catch (error) {
    console.error("Error fetching custom news article:", error);
    res.status(500).json({ error: "Error fetching custom news article" });
  }
});

module.exports = router;
