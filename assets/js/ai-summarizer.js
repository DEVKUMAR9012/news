/**
 * ai-summarizer.js — ENHANCED VERSION with Claude API
 * XSS-safe: dynamic content rendered via textContent / DOM methods, never raw innerHTML.
 *
 * SETUP:
 *   1. Replace 'YOUR_ANTHROPIC_API_KEY_HERE' below with your key, OR
 *   2. Set window.ANTHROPIC_API_KEY = '...' anywhere before this script loads.
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = window.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_API_KEY_HERE';
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 400;
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Escapes HTML special characters — call on every untrusted string
 * before it touches innerHTML. Prefer textContent where possible.
 */
function sanitize(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

class AISummarizer {
  constructor() {
    this.articleContent = '';
    this.articleTitle = '';
    this.currentLength = 'short';
    this.summaryCache = {};
    this.isLoading = false;
    this._setupModal();
  }

  setArticleContent(content, title = '') {
    this.articleContent = content;
    this.articleTitle = title;
    this.summaryCache = {};
  }

  async generateSummary(openModal = true) {
    if (this.isLoading) return;
    if (openModal) this._openModal();

    const el = document.getElementById('summaryContent');
    if (!el) return;

    this._setLoadingState(el);  // pure DOM — no user data

    this.isLoading = true;
    try {
      const summary = await this._summarize(this.articleContent, this.currentLength);
      this._renderSummary(el, summary, this.currentLength);
    } catch (err) {
      console.warn('[AISummarizer] Claude API failed, using fallback:', err.message);
      const fallback = this._extractiveFallback(this.articleContent, this.currentLength);
      this._renderSummary(el, fallback, this.currentLength, true);
    } finally {
      this.isLoading = false;
    }
  }

  // ── API call ───────────────────────────────────────────────────────────────

  async _summarize(text, length) {
    const cacheKey = `${this._hash(text)}_${length}`;
    if (this.summaryCache[cacheKey]) return this.summaryCache[cacheKey];

    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'YOUR_ANTHROPIC_API_KEY_HERE') {
      throw new Error('No API key configured.');
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: 'user', content: this._buildPrompt(text, this.articleTitle, length) }],
      }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const result = data.content?.[0]?.text?.trim() || '';
    if (!result) throw new Error('Empty response from Claude.');

    this.summaryCache[cacheKey] = result;
    return result;
  }

  _buildPrompt(text, title, length) {
    const base = `You are a professional news editor. Summarize the following article.\n\nTitle: ${title || '(untitled)'}\n\nArticle:\n${text}\n\n`;
    switch (length) {
      case 'short': return base + 'Write a crisp 1-2 sentence summary. Return only the summary text.';
      case 'long': return base + 'Write a detailed 4-5 sentence summary. Return only the summary text.';
      case 'keypoints': return base + 'Extract 4 key bullet points as a JSON array: ["Point 1","Point 2","Point 3","Point 4"]. Return ONLY the JSON array.';
      default: return base + 'Write a 2-sentence summary. Return only the summary text.';
    }
  }

  _extractiveFallback(text, length) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (length === 'short') return sentences.slice(0, 2).join(' ').trim();
    if (length === 'long') return sentences.slice(0, 5).join(' ').trim();
    if (length === 'keypoints') return sentences.slice(0, 4).map(s => s.trim());
    return sentences.slice(0, 2).join(' ').trim();
  }

  // ── Rendering — DOM methods only, no dynamic innerHTML ────────────────────

  _setLoadingState(el) {
    el.replaceChildren();
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1rem;padding:2rem;';
    const ring = document.createElement('div');
    ring.className = 'ai-pulse-ring';
    const msg = document.createElement('p');
    msg.style.opacity = '0.7';
    msg.textContent = 'Claude is reading the article\u2026';
    wrap.append(ring, msg);
    el.appendChild(wrap);
  }

  _renderSummary(el, summary, length, isFallback = false) {
    el.replaceChildren();

    if (length === 'keypoints') {
      let points = [];
      if (typeof summary === 'string') {
        try {
          points = JSON.parse(summary.replace(/```json|```/g, '').trim());
        } catch {
          points = summary.split(/\n|•|-/).map(p => p.trim()).filter(p => p.length > 10).slice(0, 5);
        }
      } else if (Array.isArray(summary)) {
        points = summary;
      }

      const list = document.createElement('div');
      list.className = 'key-points';
      points.forEach((point, i) => {
        const item = document.createElement('div');
        item.className = 'key-point';
        item.style.animationDelay = `${i * 0.1}s`;

        const num = document.createElement('span');
        num.className = 'kp-num';
        num.textContent = String(i + 1);

        const txt = document.createElement('span');
        txt.textContent = String(point).trim(); // textContent — XSS-safe

        item.append(num, txt);
        list.appendChild(item);
      });
      el.appendChild(list);

    } else {
      const raw = Array.isArray(summary) ? summary.join(' ') : summary;
      const p = document.createElement('p');
      p.className = 'summary-text';
      p.textContent = raw; // textContent — XSS-safe
      el.appendChild(p);
    }

    if (isFallback) {
      const note = document.createElement('p');
      note.className = 'fallback-note';
      const icon = document.createElement('i');
      icon.className = 'fas fa-info-circle';
      note.append(icon, '\u00a0Using extractive summary — add your API key for AI-generated summaries.');
      el.appendChild(note);
    }

    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  _setupModal() {
    document.addEventListener('DOMContentLoaded', () => {
      this._injectStyles();
      document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentLength = btn.dataset.length;
          const modal = document.getElementById('aiSummaryModal');
          if (modal?.style.display === 'block') this.generateSummary(false);
        });
      });
      document.getElementById('closeModalBtn')?.addEventListener('click', () => this._closeModal());
      document.getElementById('modalOverlay')?.addEventListener('click', () => this._closeModal());
      document.addEventListener('keydown', e => { if (e.key === 'Escape') this._closeModal(); });
    });
  }

  _openModal() { const m = document.getElementById('aiSummaryModal'); if (m) { m.style.display = 'block'; document.body.style.overflow = 'hidden'; } }
  _closeModal() { const m = document.getElementById('aiSummaryModal'); if (m) { m.style.display = 'none'; document.body.style.overflow = 'auto'; } }

  _hash(str) {
    let h = 0;
    for (let i = 0; i < Math.min(str.length, 200); i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
    return h.toString();
  }

  _injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      .ai-pulse-ring { width:48px;height:48px;border-radius:50%;border:3px solid var(--accent,#0066ff);border-top-color:transparent;animation:ai-spin .8s linear infinite; }
      @keyframes ai-spin { to { transform:rotate(360deg); } }
      .key-points { display:flex;flex-direction:column;gap:.75rem; }
      .key-point { display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;background:var(--bg,#f5f5f5);border-radius:12px;border-left:3px solid var(--accent,#0066ff);animation:kp-slide .35s ease both; }
      @keyframes kp-slide { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }
      .kp-num { min-width:22px;height:22px;border-radius:50%;background:var(--accent,#0066ff);color:white;font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center; }
      .summary-text { line-height:1.75;font-size:1rem; }
      .fallback-note { margin-top:1rem;font-size:.8rem;opacity:.6;padding:.5rem 1rem;background:var(--bg,#f5f5f5);border-radius:8px; }
    `;
    document.head.appendChild(s);
  }
}

window.aiSummarizer = new AISummarizer();