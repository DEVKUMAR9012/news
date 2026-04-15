// ─────────────────────────────────────────────────────
// auth.js — Shared Authentication Utility
// Used by all pages to check login state & make API calls
// ─────────────────────────────────────────────────────

const API_BASE = (() => {
  const host = window.location.hostname;
  // Local development — backend runs on port 5000
  if (host === 'localhost' || host === '127.0.0.1') {
    return `http://${host}:5000/api`;
  }
  // Production — use a same-origin relative path (or replace with your deployed API URL)
  return '/api';
})();

// ── Token helpers ──
function getToken() {
  return localStorage.getItem('dnd_token');
}

function getUser() {
  const u = localStorage.getItem('dnd_user');
  return u ? JSON.parse(u) : null;
}

function setSession(token, user) {
  localStorage.setItem('dnd_token', token);
  localStorage.setItem('dnd_user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('dnd_token');
  localStorage.removeItem('dnd_user');
}

// ── Auth headers for protected API calls ──
function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

// ── Logout ──
function logout() {
  clearSession();
  // Redirect to login from any location
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? 'login.html' : 'pages/login.html';
}

// ── Route Guard: call this on protected pages ──
function requireAuth(waitForLoad = true) {
  const token = getToken();
  
  // If enabled and auth state not loaded yet, don't redirect immediately
  if (waitForLoad && typeof authStateLoaded !== 'undefined' && !authStateLoaded()) {
    // Wait a bit longer before redirect
    setTimeout(() => {
      const tokenNow = getToken();
      if (!tokenNow) {
        const inPages = window.location.pathname.includes('/pages/');
        window.location.replace(inPages ? 'login.html' : 'pages/login.html');
      }
    }, 100);
    return false;
  }
  
  if (!token) {
    const inPages = window.location.pathname.includes('/pages/');
    window.location.replace(inPages ? 'login.html' : 'pages/login.html');
    return false;
  }
  return true;
}

// ── Redirect logged-in users away from login/signup ──
function redirectIfLoggedIn() {
  if (getToken()) {
    window.location.replace('../index.html');
  }
}

// ── Update navbar based on auth state ──
function updateNavbar() {
  const user = getUser();
  const navMenu = document.querySelector('.dropdown-menu');
  if (!navMenu) return;

  const inPages = window.location.pathname.includes('/pages/');
  const contactPath = inPages ? 'contact.html' : 'pages/contact.html';
  const settingsPath = inPages ? 'settings.html' : 'pages/settings.html';
  const helpPath = inPages ? 'help.html' : 'pages/help.html';

  if (user) {
    // Logged in state — use safe DOM APIs to avoid XSS from user-controlled data

    // Build avatar element safely
    let avatarEl;
    if (user.avatar) {
      avatarEl = document.createElement('img');
      avatarEl.setAttribute('src', user.avatar);       // setAttribute is safe for URLs
      avatarEl.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover;';
    } else {
      avatarEl = document.createElement('span');
      avatarEl.style.cssText = 'width:28px;height:28px;border-radius:50%;background:var(--accent);display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:700;';
      avatarEl.textContent = (user.fullName || '?')[0].toUpperCase(); // textContent never parses HTML
    }

    // Build the user info header item safely
    const nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-weight:bold;color:var(--text);';
    nameEl.textContent = user.fullName;   // safe — no HTML parsing

    const emailEl = document.createElement('div');
    emailEl.style.cssText = 'font-size:0.75rem;opacity:0.6;overflow:hidden;text-overflow:ellipsis;max-width:180px;';
    emailEl.textContent = user.email;     // safe — no HTML parsing

    const infoDiv = document.createElement('div');
    infoDiv.appendChild(nameEl);
    infoDiv.appendChild(emailEl);

    const flexDiv = document.createElement('div');
    flexDiv.style.cssText = 'display:flex;align-items:center;gap:0.75rem;';
    flexDiv.appendChild(avatarEl);
    flexDiv.appendChild(infoDiv);

    const listItem1 = document.createElement('li');
    listItem1.style.cssText = 'padding:1rem;border-bottom:1px solid var(--border);background:var(--hover);';
    listItem1.appendChild(flexDiv);

    // Build each nav item safely with createElement — no innerHTML
    function makeNavLink(href, iconClass, label, id) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      if (id) a.id = id;
      const i = document.createElement('i');
      i.className = iconClass;
      a.appendChild(i);
      a.appendChild(document.createTextNode('\u00a0' + label));
      li.appendChild(a);
      return li;
    }

    const listItem2 = makeNavLink('#', 'fas fa-sign-out-alt', '🚪 Logout', 'logoutBtn');
    const listItem3 = makeNavLink(contactPath, 'fas fa-envelope', '✅ Contact');
    const listItem4 = makeNavLink(settingsPath, 'fas fa-cog', '🔗 Settings');
    const listItem5 = makeNavLink(helpPath, 'fas fa-question-circle', '❓ Help');
    const profileItem = makeNavLink(inPages ? 'profile.html' : 'pages/profile.html', 'fas fa-user-circle', '👤 My Profile');

    navMenu.replaceChildren(listItem1, listItem2, profileItem, listItem3, listItem4, listItem5);

    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  } else {
    // Logged out state — paths are derived from window.location (not user input), safe to use in innerHTML
    const loginPath = inPages ? 'login.html' : 'pages/login.html';
    const signupPath = inPages ? 'signup.html' : 'pages/signup.html';

    const items = [
      { href: loginPath, icon: 'fa-sign-in-alt', label: '🔒 Login' },
      { href: signupPath, icon: 'fa-user-plus', label: '📍 Signup' },
      { href: contactPath, icon: 'fa-envelope', label: '✅ Contact' },
      { href: helpPath, icon: 'fa-question-circle', label: '❓ Help' },
    ];

    navMenu.replaceChildren();
    items.forEach(({ href, icon, label }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      const i = document.createElement('i');
      i.className = `fas ${icon}`;
      a.appendChild(i);
      a.appendChild(document.createTextNode(` ${label}`));
      li.appendChild(a);
      navMenu.appendChild(li);
    });
  }
}

// Auto-run navbar update on every page load
document.addEventListener('DOMContentLoaded', updateNavbar);
