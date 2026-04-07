/**
 * features.js — Advanced Feature Pack for Daily News Digest
 * XSS-safe: all dynamic values use textContent or sanitize() before innerHTML.
 *
 * Features:
 *   1. Reading Progress Bar
 *   2. Text-to-Speech ("Listen" button)
 *   3. Sentiment Analysis badge
 *   4. Emoji Reactions
 *   5. Community Poll (sidebar)
 *   6. Markets Ticker (navbar strip)
 */

(function () {
    'use strict';

    // ── Sanitizer — escape every untrusted string before innerHTML ─────────────
    function sanitize(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    function isArticlePage() { return window.location.pathname.includes('article.html'); }

    function getArticleId() { return new URLSearchParams(window.location.search).get('id') || 'unknown'; }

    function getStorage(key, fallback) {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    }

    function setStorage(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
    }

    function showToast(msg) {
        if (window.showToast) { window.showToast(msg); return; }
        const t = document.createElement('div');
        t.textContent = msg; // textContent — XSS-safe
        t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--accent,#0066ff);color:#fff;padding:12px 22px;border-radius:30px;z-index:9999;font-size:.9rem;box-shadow:0 6px 20px rgba(0,0,0,.25);animation:ftSlide .3s ease';
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2200);
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  1. READING PROGRESS BAR
    // ════════════════════════════════════════════════════════════════════════════
    function initProgressBar() {
        if (!isArticlePage()) return;
        const bar = document.createElement('div');
        bar.id = 'ft-progress-bar';
        bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,var(--accent,#0066ff),#a855f7,#ec4899);z-index:99999;transition:width .1s linear;box-shadow:0 0 8px var(--accent,#0066ff);';
        document.body.prepend(bar);
        window.addEventListener('scroll', () => {
            const doc = document.documentElement;
            const total = doc.scrollHeight - doc.clientHeight;
            bar.style.width = (total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0) + '%';
        }, { passive: true });
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  2. TEXT-TO-SPEECH
    // ════════════════════════════════════════════════════════════════════════════
    function initTTS() {
        if (!isArticlePage() || !window.speechSynthesis) return;
        const shareBar = document.querySelector('.social-share');
        if (!shareBar) return;

        const btn = document.createElement('button');
        btn.id = 'ft-tts-btn';
        btn.className = 'summary-btn';
        btn.style.marginLeft = '0.5rem';

        // Build button children with DOM — no innerHTML needed
        const icon = document.createElement('i');
        icon.className = 'fas fa-headphones';
        btn.append(icon, '\u00a0Listen');
        shareBar.appendChild(btn);

        let playing = false;

        btn.addEventListener('click', () => {
            if (playing) {
                window.speechSynthesis.cancel();
                playing = false;
                icon.className = 'fas fa-headphones';
                btn.childNodes[1].textContent = '\u00a0Listen';
                return;
            }

            const title = document.getElementById('articleTitle')?.textContent || '';
            const body = document.getElementById('articleContent')?.textContent || '';
            const text = `${title}. ${body}`.trim();
            if (!text) { showToast('No content to read.'); return; }

            const utt = new SpeechSynthesisUtterance(text);
            utt.rate = 0.95;
            utt.pitch = 1;
            utt.lang = 'en-US';
            const voices = window.speechSynthesis.getVoices();
            const pref = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang === 'en-US');
            if (pref) utt.voice = pref;

            utt.onend = () => {
                playing = false;
                icon.className = 'fas fa-headphones';
                btn.childNodes[1].textContent = '\u00a0Listen';
            };

            window.speechSynthesis.speak(utt);
            playing = true;
            icon.className = 'fas fa-stop-circle';
            btn.childNodes[1].textContent = '\u00a0Stop';
        });
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  3. SENTIMENT ANALYSIS
    // ════════════════════════════════════════════════════════════════════════════
    const SENTIMENT = {
        positive: ['breakthrough', 'success', 'historic', 'record', 'win', 'growth', 'improve', 'launch', 'celebrate',
            'hope', 'achieve', 'award', 'profit', 'rise', 'rally', 'gain', 'innovative', 'milestone', 'discovery',
            'advance', 'promise', 'expand', 'agreement', 'hero', 'save', 'recover', 'boost', 'surpass'],
        negative: ['crisis', 'disaster', 'war', 'conflict', 'death', 'kill', 'attack', 'crash', 'collapse', 'fail',
            'loss', 'threat', 'danger', 'decline', 'lawsuit', 'arrest', 'scandal', 'accident', 'explosion',
            'flood', 'fire', 'risk', 'concern', 'fear', 'ban', 'cut', 'drop', 'refuse', 'delay'],
    };

    function analyzeSentiment(text) {
        const lower = text.toLowerCase();
        let pos = 0, neg = 0;
        SENTIMENT.positive.forEach(w => { if (lower.includes(w)) pos++; });
        SENTIMENT.negative.forEach(w => { if (lower.includes(w)) neg++; });
        const total = pos + neg || 1;
        if (pos / total > 0.6) return { label: 'Positive', emoji: '\uD83D\uDE0A', color: '#22c55e' };
        if (neg / total > 0.6) return { label: 'Negative', emoji: '\uD83D\uDE1F', color: '#ef4444' };
        return { label: 'Neutral', emoji: '\uD83D\uDE10', color: '#f59e0b' };
    }

    function initSentimentBadge() {
        if (!isArticlePage()) return;
        const target = document.getElementById('articleContent');
        if (!target) return;

        const observer = new MutationObserver(() => {
            const content = target.textContent;
            if (!content || content.includes('Loading')) return;
            observer.disconnect();
            injectSentimentBadge(content);
        });
        observer.observe(target, { childList: true, subtree: true });
    }

    function injectSentimentBadge(text) {
        const meta = document.querySelector('.article-meta');
        if (!meta || document.getElementById('ft-sentiment')) return;
        const s = analyzeSentiment(text);

        const badge = document.createElement('span');
        badge.id = 'ft-sentiment';
        badge.title = 'AI-detected article sentiment';
        badge.style.cssText = `display:inline-flex;align-items:center;gap:.3rem;padding:.25rem .7rem;border-radius:20px;font-size:.8rem;font-weight:600;background:${sanitize(s.color)}22;color:${sanitize(s.color)};border:1px solid ${sanitize(s.color)}44;margin-left:.5rem;`;

        // Use textContent for user-visible strings — the color values above are from
        // our own static object so sanitize() is a belt-and-suspenders defence only.
        badge.textContent = `${s.emoji} ${s.label}`;
        meta.appendChild(badge);
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  4. EMOJI REACTIONS
    // ════════════════════════════════════════════════════════════════════════════
    const REACTIONS = [
        { key: 'like', emoji: '\uD83D\uDC4D', label: 'Like' },
        { key: 'love', emoji: '\u2764\uFE0F', label: 'Love' },
        { key: 'wow', emoji: '\uD83D\uDE2E', label: 'Wow' },
        { key: 'sad', emoji: '\uD83D\uDE22', label: 'Sad' },
        { key: 'angry', emoji: '\uD83D\uDE21', label: 'Angry' },
    ];

    function initReactions() {
        if (!isArticlePage()) return;
        const artId = getArticleId();
        const storeKey = `reactions_${artId}`;
        let counts = getStorage(storeKey, { like: 0, love: 0, wow: 0, sad: 0, angry: 0 });
        let voted = getStorage(`voted_${artId}`, null);

        // Build section with DOM methods
        const section = document.createElement('div');
        section.id = 'ft-reactions';
        section.style.cssText = 'margin:2rem 0;padding:1.5rem;background:var(--card-bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:20px;';

        const heading = document.createElement('h4');
        heading.style.cssText = 'margin-bottom:.75rem;font-size:.9rem;opacity:.7;letter-spacing:.05em;text-transform:uppercase;';
        heading.textContent = 'How does this story make you feel?';
        section.appendChild(heading);

        const row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;';

        REACTIONS.forEach(r => {
            const btn = document.createElement('button');
            btn.className = 'reaction-btn';
            btn.dataset.key = r.key;
            btn.title = r.label;
            btn.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:.2rem;padding:.6rem 1rem;border-radius:16px;border:1px solid var(--border,#e5e7eb);background:var(--card-bg,#fff);cursor:pointer;transition:all .2s;font-size:1.4rem;${voted === r.key ? 'border-color:var(--accent,#0066ff);background:var(--accent-glow,rgba(0,102,255,.13));' : ''}`;

            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = r.emoji; // textContent — XSS-safe

            const countSpan = document.createElement('span');
            countSpan.className = 'reaction-count';
            countSpan.style.cssText = 'font-size:.75rem;font-weight:600;';
            countSpan.textContent = String(counts[r.key] || 0);

            btn.append(emojiSpan, countSpan);
            row.appendChild(btn);
        });

        section.appendChild(row);

        // Insert before .related
        const related = document.querySelector('.related');
        const articleEl = document.querySelector('article');
        if (related) related.before(section);
        else if (articleEl) articleEl.after(section);

        // Event delegation
        row.addEventListener('click', e => {
            const btn = e.target.closest('.reaction-btn');
            if (!btn) return;
            const key = btn.dataset.key;

            if (voted === key) {
                counts[key] = Math.max(0, (counts[key] || 1) - 1);
                voted = null;
            } else {
                if (voted) counts[voted] = Math.max(0, (counts[voted] || 1) - 1);
                counts[key] = (counts[key] || 0) + 1;
                voted = key;
            }

            setStorage(storeKey, counts);
            setStorage(`voted_${artId}`, voted);
            refreshReactionUI(row, counts, voted);
        });
    }

    function refreshReactionUI(row, counts, voted) {
        row.querySelectorAll('.reaction-btn').forEach(btn => {
            const key = btn.dataset.key;
            const active = voted === key;
            btn.style.borderColor = active ? 'var(--accent,#0066ff)' : 'var(--border,#e5e7eb)';
            btn.style.background = active ? 'var(--accent-glow,rgba(0,102,255,.13))' : 'var(--card-bg,#fff)';
            btn.style.transform = active ? 'scale(1.12)' : 'scale(1)';
            btn.querySelector('.reaction-count').textContent = String(counts[key] || 0);
        });
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  5. COMMUNITY POLL
    // ════════════════════════════════════════════════════════════════════════════
    const POLLS = [
        { id: 'poll_ai_journalism', question: 'Will AI replace journalists within 10 years?', options: ['Yes, completely', 'Partially', 'No, never'] },
        { id: 'poll_social_news', question: 'Where do you get most of your news?', options: ['News websites', 'Social media', 'TV / Radio', 'Podcasts'] },
        { id: 'poll_trust', question: 'How much do you trust online news?', options: ['Very much', 'Somewhat', 'Not much', 'Not at all'] },
        { id: 'poll_climate', question: 'Is climate change the biggest global challenge?', options: ['Strongly agree', 'Agree', 'Disagree', 'Strongly disagree'] },
    ];

    function initCommunityPoll() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const today = new Date();
        const poll = POLLS[(today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % POLLS.length];
        const sk = `poll_${poll.id}`;
        const voted = getStorage(sk + '_voted', null);
        let votes = getStorage(sk + '_votes', poll.options.map(() => Math.floor(Math.random() * 40) + 5));

        const widget = document.createElement('div');
        widget.className = 'sidebar-widget';
        widget.id = 'ft-poll';

        renderPoll(widget, poll, votes, voted);

        const newsletter = sidebar.querySelector('.newsletter');
        if (newsletter) newsletter.before(widget);
        else sidebar.appendChild(widget);

        widget.addEventListener('click', e => {
            const btn = e.target.closest('.poll-option-btn');
            if (!btn || voted !== null) return;
            const idx = parseInt(btn.dataset.idx, 10);
            votes[idx] += 1;
            setStorage(sk + '_votes', votes);
            setStorage(sk + '_voted', idx);
            renderPoll(widget, poll, votes, idx);
            showToast('\u2713 Thanks for voting!');
        });
    }

    function renderPoll(widget, poll, votes, voted) {
        widget.replaceChildren();

        const total = votes.reduce((s, v) => s + v, 0) || 1;
        const hasVoted = voted !== null;

        const heading = document.createElement('h3');
        heading.textContent = '\uD83D\uDDF3\uFE0F Community Poll';
        widget.appendChild(heading);

        const question = document.createElement('p');
        question.style.cssText = 'font-size:.9rem;margin-bottom:1rem;line-height:1.4;';
        question.textContent = poll.question; // from our static array — textContent is correct practice
        widget.appendChild(question);

        const optContainer = document.createElement('div');
        optContainer.style.cssText = 'display:flex;flex-direction:column;gap:.5rem;';

        poll.options.forEach((opt, i) => {
            const pct = hasVoted ? Math.round((votes[i] / total) * 100) : 0;
            const isMe = hasVoted && voted === i;

            const btn = document.createElement('button');
            btn.className = 'poll-option-btn';
            btn.dataset.idx = String(i);
            btn.style.cssText = `position:relative;text-align:left;padding:.6rem .9rem;border-radius:12px;border:1px solid ${isMe ? 'var(--accent,#0066ff)' : 'var(--border,#e5e7eb)'};background:var(--bg,#f9f9f9);cursor:${hasVoted ? 'default' : 'pointer'};font-size:.88rem;overflow:hidden;transition:all .2s;`;

            if (hasVoted) {
                const fill = document.createElement('div');
                fill.style.cssText = `position:absolute;top:0;left:0;height:100%;width:${pct}%;background:${isMe ? 'var(--accent-glow,rgba(0,102,255,.18))' : 'var(--border,#e5e7eb)'};transition:width .6s ease;`;
                btn.appendChild(fill);
            }

            const label = document.createElement('span');
            label.style.cssText = 'position:relative;z-index:1;';
            label.textContent = opt; // textContent — XSS-safe

            btn.appendChild(label);

            if (hasVoted) {
                const pctLabel = document.createElement('span');
                pctLabel.style.cssText = 'position:absolute;right:.9rem;top:50%;transform:translateY(-50%);font-size:.8rem;font-weight:700;color:var(--accent,#0066ff);z-index:1;';
                pctLabel.textContent = `${pct}%`;
                btn.appendChild(pctLabel);
            }

            optContainer.appendChild(btn);
        });

        widget.appendChild(optContainer);

        const footer = document.createElement('p');
        footer.style.cssText = 'font-size:.75rem;opacity:.5;margin-top:.75rem;';
        footer.textContent = `${total} votes \u2022 Resets daily`;
        widget.appendChild(footer);
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  6. MARKETS TICKER
    // ════════════════════════════════════════════════════════════════════════════
    const MARKET_SEEDS = [
        { symbol: 'BTC', base: 98400, step: 600 },
        { symbol: 'ETH', base: 3850, step: 80 },
        { symbol: 'S&P', base: 5850, step: 30 },
        { symbol: 'NASDAQ', base: 18600, step: 120 },
        { symbol: 'GOLD', base: 2380, step: 15 },
    ];

    function simulatePrice(seed) {
        const variation = (Math.random() - 0.48) * seed.step;
        const price = (seed.base + variation).toLocaleString('en-US', { maximumFractionDigits: 0 });
        const change = Math.abs((variation / seed.base) * 100).toFixed(2);
        const up = variation >= 0;
        return { price, change, up };
    }

    function initMarketsTicker() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const strip = document.createElement('div');
        strip.id = 'ft-markets';
        strip.style.cssText = 'background:var(--card-bg,#fff);border-top:1px solid var(--border,#e5e7eb);font-size:.78rem;font-weight:600;display:flex;gap:0;overflow:hidden;height:28px;align-items:center;position:sticky;top:60px;z-index:998;backdrop-filter:blur(10px);';
        navbar.after(strip);

        function refresh() {
            strip.replaceChildren(); // clear old items — no innerHTML
            MARKET_SEEDS.forEach((seed, idx) => {
                const p = simulatePrice(seed);
                const item = document.createElement('span');
                item.style.cssText = 'padding:0 1rem;border-right:1px solid var(--border,#e5e7eb);white-space:nowrap;display:flex;gap:.4rem;align-items:center;';

                const symEl = document.createElement('span');
                symEl.style.opacity = '0.7';
                symEl.textContent = seed.symbol; // static data — textContent is correct

                const priceEl = document.createElement('span');
                priceEl.textContent = `$${p.price}`; // simulated number — textContent

                const changeEl = document.createElement('span');
                changeEl.style.color = p.up ? '#22c55e' : '#ef4444';
                changeEl.textContent = `${p.up ? '\u25B2' : '\u25BC'} ${p.change}%`;

                item.append(symEl, priceEl, changeEl);
                strip.appendChild(item);
            });
        }

        refresh();
        setInterval(refresh, 8000);
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  GLOBAL STYLES + BOOT
    // ════════════════════════════════════════════════════════════════════════════
    function injectGlobalStyles() {
        const s = document.createElement('style');
        s.textContent = `
      @keyframes ftSlide { from{transform:translateX(100%);opacity:0} to{transform:none;opacity:1} }
      .reaction-btn:hover { transform:scale(1.1);border-color:var(--accent,#0066ff)!important; }
      .poll-option-btn:hover:not([disabled]) { border-color:var(--accent,#0066ff)!important; }
      @media(max-width:600px){ #ft-markets{font-size:.7rem} .reaction-btn{padding:.5rem .6rem;font-size:1.2rem} }
    `;
        document.head.appendChild(s);
    }

    function boot() {
        injectGlobalStyles();
        initProgressBar();
        initTTS();
        initSentimentBadge();
        initReactions();
        initCommunityPoll();
        initMarketsTicker();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();

})();