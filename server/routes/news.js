const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

async function sendLatestNews(req, res) {
  try {
    const articles = await newsService.fetchTopHeadlines();
    res.json({ articles });
  } catch (error) {
    console.error('latest error:', error);
    res.status(500).json({ message: 'Failed to fetch latest news' });
  }
}

// GET /api/news
router.get('/', sendLatestNews);

// GET /api/news/latest
router.get('/latest', sendLatestNews);

// GET /api/news/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const articles = await newsService.fetchNewsByCategory(req.params.category);
    res.json({ articles });
  } catch (error) {
    console.error('category error:', error);
    res.status(500).json({ message: 'Failed to fetch category news' });
  }
});

// GET /api/news/search?q=query
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const articles = await newsService.searchArticles(q);
    res.json({ articles });
  } catch (error) {
    console.error('search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

// GET /api/news/:id  — MUST come after /latest, /category, /search
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim().length < 6) {
      return res.status(400).json({ message: 'Invalid article ID format' });
    }

    const article = await newsService.fetchArticleById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ article });
  } catch (error) {
    console.error('article fetch error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid article ID' });
    }
    res.status(500).json({ message: 'Failed to fetch article' });
  }
});

module.exports = router;
