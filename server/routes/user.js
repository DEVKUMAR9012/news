const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /api/user/profile - Get logged-in user's profile
router.get('/profile', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    avatar: req.user.avatar,
    savedArticles: req.user.savedArticles,
    createdAt: req.user.createdAt
  });
});

// POST /api/user/save-article - Save an article
router.post('/save-article', protect, async (req, res) => {
  try {
    const { articleId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.savedArticles.includes(articleId)) {
      // Already saved — remove it (toggle)
      user.savedArticles = user.savedArticles.filter(id => id !== articleId);
      await user.save();
      return res.json({ message: 'Article removed from saved.', saved: false });
    }

    user.savedArticles.push(articleId);
    await user.save();
    res.json({ message: 'Article saved!', saved: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/user/saved-articles - Get all saved articles
router.get('/saved-articles', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ savedArticles: user.savedArticles });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
