// js/script.js - DYNAMIC API VERSION

document.addEventListener('DOMContentLoaded', () => {
  // Global news state
  let newsData = [];
  const API_ROOT = (() => {
    if (typeof window.API_BASE === 'string') return window.API_BASE.replace(/\/$/, '');
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${host}:5000/api`;
    }
    return '/api';
  })();
  const API_BASE = `${API_ROOT}/news`;

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function safeUrl(value) {
    const url = String(value || '');
    return /^(https?:|data:image\/)/i.test(url) ? url : '';
  }

  function safeExternalUrl(value) {
    const url = String(value || '');
    return /^https?:\/\//i.test(url) ? url : '';
  }

  function isProviderPreview(content) {
    return /\.\.\.\s*\[\d+\s+chars\]\s*$/i.test(String(content || ''));
  }

  function removeProviderPreviewMarker(content) {
    return String(content || '').replace(/\s*\.\.\.\s*\[\d+\s+chars\]\s*$/i, '').trim();
  }

  function articlePath(base, id) {
    return `${base}article.html?id=${encodeURIComponent(String(id))}`;
  }

  // ============================================
  // HELPER: Determine base path for links
  // ============================================
  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) return '';
    return 'pages/';
  }

  // ============================================
  // RENDER NEWS CARDS
  // ============================================
  function renderNewsCards(articles) {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    const base = getBasePath();
    const user = typeof getUser === 'function' ? getUser() : null;
    
    if (!articles || articles.length === 0) {
      newsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">No articles found.</p>';
      return;
    }

    newsGrid.innerHTML = articles.map(a => `
      <div class="news-card" data-id="${escapeHTML(a.id)}" onclick="window.location.href='${articlePath(base, a.id)}'">
        <div class="card-img">
          <img src="${escapeHTML(safeUrl(a.image))}" loading="lazy" alt="${escapeHTML(a.title)}">
          <div class="img-overlay">
            <span>${escapeHTML(a.category)}</span>
          </div>
        </div>
        <div class="card-content">
          <h3>${escapeHTML(a.title)}</h3>
          <p>${escapeHTML(a.desc)}</p>
          <div class="card-footer">
            <span>${a.date ? a.date.split(' ')[0] : 'Today'} · ${a.author ? a.author.split(' ')[0] : 'Admin'}</span>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              ${user ? `<button class="bookmark-btn" data-id="${escapeHTML(a.id)}" onclick="event.stopPropagation(); toggleBookmark(this, '${escapeHTML(a.id)}')" title="Save article" style="background:none;border:1px solid var(--border);border-radius:50%;width:34px;height:34px;cursor:pointer;color:var(--text);font-size:0.75rem;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">Save</button>` : ''}
              <button class="read-more" onclick="event.stopPropagation(); window.location.href='${articlePath(base, a.id)}'">
                Read Full →
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    observeCards();
  }

  // Bookmark toggle function
  window.toggleBookmark = async function(btn, articleId) {
    const token = typeof getToken === 'function' ? getToken() : null;
    if (!token) { alert('Please log in to save articles.'); return; }
    btn.textContent = '⏳';
    try {
      const res = await fetch(`${API_ROOT}/user/save-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ articleId: String(articleId) })
      });
      const data = await res.json();
      btn.textContent = data.saved ? '❤️' : '🔖';
      btn.title = data.saved ? 'Saved!' : 'Save article';
      btn.style.background = data.saved ? 'rgba(239,68,68,0.1)' : 'none';
    } catch { btn.textContent = '🔖'; }
  };

  // ============================================
  // SEARCH WITH API DEBOUNCE
  // ============================================
  function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let searchTimeout;
    const searchContainer = searchInput.parentElement;
    searchContainer.style.position = 'relative';

    const searchLoader = document.createElement('span');
    searchLoader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchLoader.style.cssText = 'display:none; margin-left:8px; color:var(--accent);';
    searchContainer.appendChild(searchLoader);

    const clearButton = document.createElement('span');
    clearButton.innerHTML = '<i class="fas fa-times-circle"></i>';
    clearButton.style.cssText = 'display:none; cursor:pointer; margin-left:8px; color:var(--accent); font-size:1.2rem;';
    clearButton.title = 'Clear search';
    searchContainer.appendChild(clearButton);

    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'search-suggestions';
    suggestionsBox.style.cssText = `
      position:absolute; top:100%; left:0; right:0;
      background:var(--card-bg); backdrop-filter:blur(16px);
      border:1px solid var(--border); border-radius:16px;
      margin-top:5px; max-height:300px; overflow-y:auto;
      z-index:1000; display:none; box-shadow:var(--shadow);
    `;
    searchContainer.appendChild(suggestionsBox);

    let recentSearches = [];
    try { recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || []; } catch(e) {}

    function saveRecentSearch(term) {
      if (!term || term.length < 2) return;
      recentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      try { localStorage.setItem('recentSearches', JSON.stringify(recentSearches)); } catch(e) {}
    }

    async function performSearch(term) {
      searchLoader.style.display = 'inline-block';
      const searchTerm = term.toLowerCase().trim();
      const oldCount = document.querySelector('.search-result-count');
      if (oldCount) oldCount.remove();

      if (searchTerm.length === 0) {
        renderNewsCards(newsData);
        clearButton.style.display = 'none';
        suggestionsBox.style.display = 'none';
        searchLoader.style.display = 'none';
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        const filtered = data.articles || [];

        const newsGrid = document.getElementById('newsGrid');
        if (filtered.length === 0) {
          newsGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem;">
              <i class="fas fa-search" style="font-size:4rem; color:var(--accent); margin-bottom:1rem;"></i>
              <h3>No results found for "${searchTerm}"</h3>
              <p style="margin:1rem 0; opacity:0.7;">Try different keywords</p>
              <button onclick="document.getElementById('searchInput').value=''; document.getElementById('searchInput').dispatchEvent(new Event('input'));"
                      style="background:var(--accent); color:white; border:none; padding:0.8rem 2rem; border-radius:40px; cursor:pointer; margin-top:1rem;">
                Clear Search
              </button>
            </div>
          `;
        } else {
          renderNewsCards(filtered);
          let resultCount = document.createElement('div');
          resultCount.className = 'search-result-count';
          resultCount.style.cssText = 'grid-column:1/-1; text-align:center; margin-bottom:1rem; padding:0.5rem; background:var(--card-bg); border-radius:30px; font-weight:500;';
          resultCount.textContent = `Found ${filtered.length} result${filtered.length > 1 ? 's' : ''} for "${searchTerm}"`;
          newsGrid.parentNode.insertBefore(resultCount, newsGrid);
        }

        clearButton.style.display = 'inline-block';
        searchLoader.style.display = 'none';
        saveRecentSearch(searchTerm);
      } catch (err) {
        console.error(err);
        searchLoader.style.display = 'none';
      }
    }

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value;
      clearTimeout(searchTimeout);
      const oldCount = document.querySelector('.search-result-count');
      if (oldCount) oldCount.remove();
      searchTimeout = setTimeout(() => performSearch(term), 500);
    });

    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      suggestionsBox.style.display = 'none';
      performSearch('');
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(searchTimeout);
        suggestionsBox.style.display = 'none';
        performSearch(searchInput.value);
      }
    });
  }

  // ============================================
  // ARTICLE PAGE API
  // ============================================
  function showArticleError(msg) {
    const content = document.querySelector('.article-content') || document.querySelector('main');
    if (content) {
      content.innerHTML = `
        <div style="text-align:center; padding:4rem 2rem;">
          <i class="fas fa-exclamation-triangle" style="font-size:3rem; color:var(--accent); margin-bottom:1rem;"></i>
          <h2>Article Not Found</h2>
          <p style="opacity:0.7; margin:1rem 0;">${escapeHTML(msg)}</p>
          <a href="../index.html" style="background:var(--accent); color:white; padding:0.8rem 2rem; border-radius:40px; text-decoration:none; display:inline-block; margin-top:1rem;">← Back to Home</a>
        </div>`;
    } else {
      window.location.href = '../index.html';
    }
  }

  async function loadArticleFromStorage(id) {
    if (!id || id.length < 10) {
      showArticleError('Invalid article ID.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showArticleError(errData.message || `Article could not be loaded (HTTP ${res.status})`);
        return;
      }
      const data = await res.json();
      const article = data.article;

      document.title = `${article.title} - Daily News Digest`;

      const articleTitle = document.querySelector('.article-title');
      const articleMeta = document.querySelector('.article-meta');
      const articleImage = document.querySelector('.article-image');
      const articleContent = document.querySelector('.article-content');
      const articleSource = document.getElementById('articleSource');
      const sourceLink = document.getElementById('sourceLink');
      const relatedGrid = document.getElementById('relatedGrid');

      if (articleTitle) articleTitle.textContent = article.title;
      if (articleMeta) {
        articleMeta.innerHTML = `
          <span class="author"><i class="fas fa-user"></i> ${escapeHTML(article.author)}</span>
          <span class="date"><i class="fas fa-calendar-alt"></i> ${escapeHTML(article.date)}</span>
          <span class="read-time"><i class="fas fa-clock"></i> ${escapeHTML(article.readTime || '4 min read')}</span>
          <span class="category" onclick="window.location.href='category.html?cat=${encodeURIComponent(article.category)}'" style="cursor:pointer;">
            <i class="fas fa-tag"></i> ${escapeHTML(article.category)}
          </span>
        `;
      }
      if (articleImage) articleImage.src = safeUrl(article.image);
      if (articleContent) {
        const sourceUrl = safeExternalUrl(article.sourceUrl);
        const isPreview = isProviderPreview(article.fullContent);
        const paragraph = document.createElement('p');
        paragraph.textContent = isPreview ? removeProviderPreviewMarker(article.fullContent) : (article.fullContent || '');
        articleContent.replaceChildren(paragraph);

        if (isPreview && sourceUrl) {
          const notice = document.createElement('p');
          notice.className = 'article-preview-notice';
          notice.textContent = 'This news provider only shares a preview through the API. Use the source link below to read the complete article.';
          articleContent.appendChild(notice);
        }
      }

      if (articleSource && sourceLink) {
        const sourceUrl = safeExternalUrl(article.sourceUrl);
        if (sourceUrl) {
          sourceLink.href = sourceUrl;
          sourceLink.rel = 'noopener noreferrer';
          sourceLink.textContent = isProviderPreview(article.fullContent) ? 'Read full article at source' : 'Original source';
          articleSource.style.display = 'inline-flex';
        } else {
          articleSource.style.display = 'none';
        }
      }

      if (window.aiSummarizer) {
        window.aiSummarizer.setArticleContent(article.fullContent);
      }

      // Fetch related
      try {
        const relRes = await fetch(`${API_BASE}/category/${encodeURIComponent(article.category)}`);
        const relData = await relRes.json();
        const related = (relData.articles || []).filter(a => a.id != id).slice(0, 3);
        
        if (relatedGrid) {
          if (related.length > 0) {
            relatedGrid.innerHTML = related.map(a => `
              <div class="news-card" style="cursor:pointer;" onclick="window.location.href='article.html?id=${encodeURIComponent(String(a.id))}'">
                <div class="card-img"><img src="${escapeHTML(safeUrl(a.image))}" alt="${escapeHTML(a.title)}"></div>
                <div class="card-content">
                  <h4 style="font-size:1rem;">${escapeHTML(a.title)}</h4>
                  <span style="font-size:0.8rem; opacity:0.7;">${escapeHTML(a.date)}</span>
                </div>
              </div>
            `).join('');
          } else {
            relatedGrid.innerHTML = '<p style="grid-column:1/-1;">No related articles found</p>';
          }
        }
      } catch (err) {
        console.error('Failed to load related articles', err);
      }

      setupArticleBookmark(article.id);
      setupDarkMode();
      setupHamburgerMenu();
    } catch (e) {
      console.error('Article load error:', e);
      showArticleError('Could not connect to the server. Please make sure the backend is running.');
    }
  }

  // ============================================
  // CATEGORY PAGE API
  // ============================================
  async function loadCategoryPage(category) {
    document.title = `${category} News - Daily News Digest`;
    const categoryGrid = document.getElementById('categoryGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle) categoryTitle.textContent = `${category} News`;

    if (categoryGrid) {
      categoryGrid.innerHTML = Array(3).fill(0).map(() => `
        <div class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      `).join('');
      
      try {
        const res = await fetch(`${API_BASE}/category/${encodeURIComponent(category)}`);
        const data = await res.json();
        const filteredArticles = data.articles || [];
        
        if (filteredArticles.length === 0) {
          categoryGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem;">
              <h3>No articles found in ${escapeHTML(category)}</h3>
              <a href="../index.html" style="color:var(--accent);">Back to Home</a>
            </div>
          `;
        } else {
          categoryGrid.innerHTML = filteredArticles.map(a => `
            <div class="news-card" data-id="${escapeHTML(a.id)}" onclick="window.location.href='article.html?id=${encodeURIComponent(String(a.id))}'">
              <div class="card-img">
                <img src="${escapeHTML(safeUrl(a.image))}" loading="lazy" alt="${escapeHTML(a.title)}">
                <div class="img-overlay"><span>${escapeHTML(a.category)}</span></div>
              </div>
              <div class="card-content">
                <h3>${escapeHTML(a.title)}</h3>
                <p>${escapeHTML(a.desc)}</p>
                <div class="card-footer">
                  <span>${escapeHTML(a.date)} &middot; ${escapeHTML(a.author)}</span>
                  <button class="read-more" onclick="event.stopPropagation(); window.location.href='article.html?id=${encodeURIComponent(String(a.id))}'">
                    Read Full →
                  </button>
                </div>
              </div>
            </div>
          `).join('');
        }
      } catch (e) {
        categoryGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">Failed to load category news.</p>';
      }
    }
    setupDarkMode();
    setupHamburgerMenu();
  }

  // ============================================
  // HOMEPAGE API
  // ============================================
  function initHomePage() {
    setupCategoryLinks();
    renderHomePageNews();
    setupSearch();
    setupDarkMode();
    setupHamburgerMenu();
    setupBookmarkSidebar();
    setupNewsletterForm();
    makeTagsClickable();
  }

  async function renderHomePageNews() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;

    newsGrid.innerHTML = Array(6).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
      </div>
    `).join('');

    try {
      const res = await fetch(`${API_BASE}/latest`);
      const data = await res.json();
      newsData = data.articles || [];
      renderNewsCards(newsData);
      initBreakingTicker();
      setupTrendingList();
    } catch (e) {
      console.error(e);
      newsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">Failed to load news.</p>';
    }
  }

  function setupCategoryLinks() {
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.textContent.trim();
        if (category === 'Home') { window.location.href = 'index.html'; return; }
        window.location.href = `pages/category.html?cat=${encodeURIComponent(category)}`;
      });
    });
  }

  function makeTagsClickable() {
    document.querySelectorAll('.tags span').forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', () => {
        const category = tag.textContent.replace('#', '');
        window.location.href = `pages/category.html?cat=${encodeURIComponent(category)}`;
      });
    });
  }

  function initBreakingTicker() {
    const tickerContent = document.getElementById('tickerContent');
    if (!tickerContent) return;
    const headlines = newsData.map(a => ({
      text: a.title,
      icon: a.category === 'AI' ? '🤖' : a.category === 'World' ? '🌍' : a.category === 'Sports' ? '⚽' : a.category === 'Business' ? '📈' : '📱'
    }));
    const all = [...headlines, ...headlines];
    tickerContent.innerHTML = all.map(h => `<span class="ticker-item"><i class="fas fa-bolt"></i> ${escapeHTML(h.icon)} ${escapeHTML(h.text)}</span>`).join('');
  }

  function setupDarkMode() {
    const darkToggle = document.getElementById('darkToggle');
    const darkToggleArticle = document.getElementById('darkToggleArticle');

    const toggleDark = () => {
      document.body.classList.toggle('dark-mode');
      document.querySelectorAll('#darkToggle i, #darkToggleArticle i').forEach(icon => {
        if (document.body.classList.contains('dark-mode')) {
          icon.classList.replace('fa-moon', 'fa-sun');
        } else {
          icon.classList.replace('fa-sun', 'fa-moon');
        }
      });
    };

    if (darkToggle) darkToggle.addEventListener('click', toggleDark);
    if (darkToggleArticle) darkToggleArticle.addEventListener('click', toggleDark);
  }

  function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const dropdown = document.getElementById('hamburgerDropdown');
    const overlay = document.getElementById('dropdownOverlay');
    const closeBtn = document.getElementById('closeDropdown');

    if (!hamburgerBtn || !dropdown || !overlay) return;

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDropdown = () => {
      dropdown.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDropdown);
    overlay.addEventListener('click', closeDropdown);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) closeDropdown();
    });
    dropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  function setupTrendingList() {
    const trendingList = document.getElementById('trendingList');
    if (!trendingList) return;
    trendingList.innerHTML = newsData.slice(0, 5).map(a => `
      <li onclick="window.location.href='pages/article.html?id=${encodeURIComponent(String(a.id))}'" style="cursor:pointer;">
        <span>${escapeHTML(a.title)}</span>
        <span style="color:var(--accent);">🔥 ${Math.floor(Math.random() * 50) + 50}k</span>
      </li>
    `).join('');
  }

  function setupBookmarkSidebar() {
    const bookmarkList = document.getElementById('bookmarkList');
    if (!bookmarkList) return;
    updateBookmarkSidebar();
  }

  async function updateBookmarkSidebar() {
    const bookmarkList = document.getElementById('bookmarkList');
    if (!bookmarkList) return;
    let bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; } catch(e) {}

    if (bookmarks.length === 0) {
      bookmarkList.innerHTML = '<li style="opacity:0.7;">No bookmarks yet</li>';
    } else {
      bookmarkList.innerHTML = bookmarks.map(id => {
        // Find in local loaded newsData, else just render ID
        const article = newsData.find(n => n.id == id);
        if (article) {
          return `
            <li onclick="window.location.href='pages/article.html?id=${encodeURIComponent(String(id))}'" style="cursor:pointer;">
              <span>${escapeHTML(article.title.length > 30 ? article.title.substring(0, 30) + '...' : article.title)}</span>
              <i class="fas fa-bookmark" style="color:var(--accent);"></i>
            </li>
          `;
        }
        return '';
      }).join('');
    }
  }

  function setupArticleBookmark(articleId) {
    const bookmarkBtn = document.getElementById('bookmarkArticleBtn');
    if (!bookmarkBtn) return;

    let bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; } catch(e) {}

    bookmarkBtn.innerHTML = bookmarks.includes(articleId)
      ? '<i class="fas fa-bookmark"></i>'
      : '<i class="far fa-bookmark"></i>';

    bookmarkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try { bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; } catch(e) { bookmarks = []; }

      if (bookmarks.includes(articleId)) {
        bookmarks = bookmarks.filter(b => b !== articleId);
        bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
        showToast('✓ Bookmark removed');
      } else {
        bookmarks.push(articleId);
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        showToast('✓ Article bookmarked');
      }
      try { localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); } catch(e) {}
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed; bottom:20px; right:20px;
      background:var(--accent); color:white;
      padding:12px 24px; border-radius:30px;
      z-index:9999; animation:slideIn 0.3s ease;
      box-shadow:0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (email) { showToast('✓ Thanks for subscribing!'); form.reset(); }
    });
  }

  function observeCards() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.news-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  }

  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
      @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // PAGE ROUTING
  // ============================================
  const path = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const categoryParam = urlParams.get('cat');

  if (path.includes('article.html') && articleId) {
    loadArticleFromStorage(articleId);
  } else if (path.includes('category.html') && categoryParam) {
    loadCategoryPage(categoryParam);
  } else {
    initHomePage();
  }

  addAnimationStyles();

  // Expose showToast globally for ai-summarizer.js
  window.showToast = showToast;
});
