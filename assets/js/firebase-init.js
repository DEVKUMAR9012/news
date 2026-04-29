// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCUxGwOEy0962mYmaIbl2G_fZGT886HIcA",
  authDomain: "daily-news-digest-2026.firebaseapp.com",
  projectId: "daily-news-digest-2026",
  storageBucket: "daily-news-digest-2026.firebasestorage.app",
  messagingSenderId: "275437268276",
  appId: "1:275437268276:web:ee4489aa3f5d6956020961",
  measurementId: "G-KHGED3621P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for other scripts to use
window.firebaseAuth = auth;
window.firebaseDb = db;
window.onAuthStateChanged = onAuthStateChanged;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.sendEmailVerification = sendEmailVerification;
window.updateProfile = updateProfile;
window.signOut = signOut;
window.GoogleAuthProvider = GoogleAuthProvider;
window.signInWithPopup = signInWithPopup;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.collection = collection;
window.addDoc = addDoc;

// ============================================
// FIX: Auth State Management with Loading State
// Prevents premature redirect before auth loads
// ============================================
let authStateLoaded = false;

// Mark auth state as fully loaded (after onAuthStateChanged settles)
setTimeout(() => {
  // Add 50ms buffer to ensure onAuthStateChanged has fired
  window.addEventListener('DOMContentLoaded', () => {
    // This ensures DOM is ready before we make redirect decisions
  }, { once: true });
}, 50);

onAuthStateChanged(auth, (user) => {
  // Express/JWT auth in auth.js is the primary app session. Firebase is
  // optional; do not redirect public pages based on Firebase state.
  if (user) {
    updateUIWithUser(user);
  }

  authStateLoaded = true;
});

// Export for other scripts to use
window.authStateLoaded = () => authStateLoaded;

function updateUIWithUser(user) {
  // Update the hamburger dropdown menu
  const navMenu = document.querySelector('.dropdown-menu');
  if (navMenu) {
    let authOptionsHtml = '';
    // Determine the correct path prefixes depending on current directory
    const inPagesFolder = window.location.pathname.includes('/pages/');
    const contactHtml = inPagesFolder ? 'contact.html' : 'pages/contact.html';
    const settingsHtml = inPagesFolder ? 'settings.html' : 'pages/settings.html';
    const helpHtml = inPagesFolder ? 'help.html' : 'pages/help.html';

    navMenu.innerHTML = `
      <li style="padding: 1rem; border-bottom: 1px solid var(--border); background: var(--hover);">
        <div style="font-size: 0.8rem; opacity: 0.7;">Logged in as</div>
        <div style="font-weight: bold; color: var(--text); overflow: hidden; text-overflow: ellipsis;" title="${user.email}">${user.email}</div>
      </li>
      <li><a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> 🚪 Logout</a></li>
      <li><a href="${contactHtml}"><i class="fas fa-envelope"></i> ✅ Contact</a></li>
      <li><a href="${settingsHtml}"><i class="fas fa-cog"></i> 🔗 Settings</a></li>
      <li><a href="${helpHtml}"><i class="fas fa-question-circle"></i> ❓ Help</a></li>
    `;
    
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            window.location.reload();
        });
    });
  }
}
