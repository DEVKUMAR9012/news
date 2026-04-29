// ============================================================
// API Configuration
// Set RENDER_BACKEND_URL to your Render backend URL
// Example: 'https://daily-news-digest.onrender.com'
// ============================================================
(function () {
  const RENDER_BACKEND_URL = 'YOUR_RENDER_URL_HERE'; // <-- paste your Render URL here

  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';

  if (!isLocal && RENDER_BACKEND_URL && RENDER_BACKEND_URL !== 'YOUR_RENDER_URL_HERE') {
    window.API_BASE = RENDER_BACKEND_URL.replace(/\/$/, '') + '/api';
  }
  // On localhost: script.js auto-detects http://localhost:5000/api
})();
