const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();


// Get user categories
router.get("/categories", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      categories: [
        "sports",
        "entertainment",
        "technology",
        "health",
        "science",
      ], // Define available categories
      selectedCategories: user.categories,
    });
  } catch (error) {
    console.error("Error fetching user categories:", error);
    res.status(500).json({ error: "Error fetching user categories" });
  }
});

// Update user categories
router.put("/updatecategories", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.categories = req.body.categories;
    await user.save();

    res.status(200).json({ message: "Categories updated successfully" });
  } catch (error) {
    console.error("Error updating user categories:", error);
    res.status(500).json({ error: "Error updating user categories" });
  }
});

// Edit custom news
router.put('/editNews/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, url, urlToImage, category } = req.body;
    const { id } = req.params;

    const updatedNews = await CustomNews.findByIdAndUpdate(
      id,
      { title, description, url, urlToImage, category },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.status(200).json({ message: 'News article updated successfully', updatedNews });
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ error: 'Failed to update news article' });
  }
});

// Delete custom news
router.delete('/deleteNews/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNews = await CustomNews.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.status(200).json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ error: 'Failed to delete news article' });
  }
});

module.exports = router;
