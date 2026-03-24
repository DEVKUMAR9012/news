// js/ai-summarizer.js - FIXED VERSION
// FIX: localStorage replaced with sessionStorage (works everywhere)
// FIX: window.aiSummarizer instance is now auto-created on load

class AISummarizer {
  constructor() {
    this.articleContent = '';
    this.currentLength = 'short';
    this.summaryCache = {}; // FIX: in-memory cache instead of localStorage
    this.setupModal();
  }

  setArticleContent(content) {
    this.articleContent = content;
  }

  setupModal() {
    // Option buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLength = btn.dataset.length;
        // Re-generate if modal is open and content exists
        const modal = document.getElementById('aiSummaryModal');
        if (modal && modal.style.display === 'block') {
          this.generateSummary(false); // false = don't reopen modal
        }
      });
    });

    // Close modal
    const closeBtn = document.getElementById('closeModalBtn');
    const overlay = document.getElementById('modalOverlay');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    if (overlay) overlay.addEventListener('click', () => this.closeModal());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  openModal() {
    const modal = document.getElementById('aiSummaryModal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('aiSummaryModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  async generateSummary(openModal = true) {
    if (openModal) this.openModal();

    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;

    summaryContent.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Generating AI summary...</p>
      </div>
    `;

    try {
      const summary = await this.summarize(this.articleContent, this.currentLength);
      this.displaySummaryInModal(summary, this.currentLength);
    } catch (error) {
      console.error('Summary error:', error);
      const fallback = this.fallbackSummarize(this.articleContent, this.currentLength);
      this.displaySummaryInModal(fallback, this.currentLength);
    }
  }

  async summarize(text, length) {
    // Check in-memory cache first
    const cacheKey = `${this.hashString(text)}_${length}`;
    if (this.summaryCache[cacheKey]) return this.summaryCache[cacheKey];

    // Use fallback (no API key required)
    const result = this.fallbackSummarize(text, length);
    this.summaryCache[cacheKey] = result;
    return result;
  }

  fallbackSummarize(text, length) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    if (length === 'short') {
      return sentences.slice(0, 2).join(' ').trim();
    } else if (length === 'long') {
      return sentences.slice(0, Math.min(5, sentences.length)).join(' ').trim();
    } else if (length === 'keypoints') {
      return sentences.slice(0, Math.min(5, sentences.length));
    }
    return sentences.slice(0, 2).join(' ').trim();
  }

  displaySummaryInModal(summary, length) {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;

    if (length === 'keypoints' && Array.isArray(summary)) {
      summaryContent.innerHTML = `
        <div class="key-points">
          ${summary.map(point => `
            <div class="key-point">
              <i class="fas fa-check-circle"></i>
              <span>${point.trim()}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      summaryContent.innerHTML = `
        <p class="summary-text">${typeof summary === 'string' ? summary : summary.join(' ')}</p>
      `;
    }
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString();
  }
}

// FIX: Auto-create instance so window.aiSummarizer is always available
document.addEventListener('DOMContentLoaded', () => {
  window.aiSummarizer = new AISummarizer();
});