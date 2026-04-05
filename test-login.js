/* ================================================
   test-login.js — Firebase Auth (Email + Google)
   ================================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

/* ----- Firebase init ----- */
const firebaseConfig = {
  apiKey: "AIzaSyBBZeNnPzS3cNGzuoIZNvB5oiVUn0nd5a4",
  authDomain: "johnblogin-fdcc6.firebaseapp.com",
  projectId: "johnblogin-fdcc6",
  storageBucket: "johnblogin-fdcc6.firebasestorage.app",
  messagingSenderId: "510548408095",
  appId: "1:510548408095:web:bd9a204bb7de785203222a",
  measurementId: "G-XDR9MJ7S6E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

/* ----- Create/update user doc in Firestore ----- */
async function ensureUserDoc(user, extraData = {}) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || extraData.name || '',
      email: user.email,
      createdAt: serverTimestamp(),
      courseProgress: {},
      certificateIssued: false
    });
  }
}

/* ----- Tabs ----- */
const tabs = document.querySelectorAll('.auth-tab');
const panelSignin = document.getElementById('panelSignin');
const panelSignup = document.getElementById('panelSignup');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const which = tab.dataset.tab;
    panelSignin.classList.toggle('hidden', which !== 'signin');
    panelSignup.classList.toggle('hidden', which !== 'signup');
    clearErrors();
  });
});

/* ----- Password visibility toggles ----- */
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.auth-input-wrap').querySelector('input');
    const icon = btn.querySelector('.material-symbols-outlined');
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = 'visibility_off';
    } else {
      input.type = 'password';
      icon.textContent = 'visibility';
    }
  });
});

/* ----- Password strength meter ----- */
const signupPw = document.getElementById('signupPassword');
const pwStrength = document.getElementById('pwStrength');

if (signupPw && pwStrength) {
  signupPw.addEventListener('input', () => {
    const v = signupPw.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const widths = ['0%', '20%', '45%', '65%', '80%', '100%'];
    const colours = ['transparent', '#ef4444', '#f97316', '#eab308', '#22c55e', '#4ade80'];
    pwStrength.style.setProperty('--pw-w', widths[score]);
    pwStrength.style.setProperty('--pw-col', colours[score]);
  });
}

/* ----- Helpers ----- */
function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ['signinError', 'signupError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function setLoading(btn, on) {
  if (on) { btn.classList.add('loading'); btn.disabled = true; }
  else { btn.classList.remove('loading'); btn.disabled = false; }
}

function showSuccess(msg) {
  document.getElementById('panelSignin').classList.add('hidden');
  document.getElementById('panelSignup').classList.add('hidden');
  document.getElementById('successMsg').textContent = msg;
  document.getElementById('panelSuccess').classList.remove('hidden');
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with that email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/popup-closed-by-user': 'Sign-in window was closed. Please try again.',
    'auth/cancelled-popup-request': '',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.'
  };
  return map[code] || 'Something went wrong. Please try again.';
}

/* ----- Sign in form ----- */
const signinForm = document.getElementById('signinForm');
const signinSubmit = document.getElementById('signinSubmit');

signinForm && signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  const email = document.getElementById('signinEmail').value.trim();
  const pw = document.getElementById('signinPassword').value;
  if (!email) return showError('signinError', 'Please enter your email.');
  if (!pw) return showError('signinError', 'Please enter your password.');

  setLoading(signinSubmit, true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pw);
    await ensureUserDoc(cred.user);
    showSuccess(`Welcome back! Redirecting to your dashboard...`);
    setTimeout(() => { window.location.href = getRedirect(); }, 1200);
  } catch (err) {
    showError('signinError', friendlyError(err.code));
  } finally {
    setLoading(signinSubmit, false);
  }
});

/* ----- Sign up form ----- */
const signupForm = document.getElementById('signupForm');
const signupSubmit = document.getElementById('signupSubmit');

signupForm && signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pw = document.getElementById('signupPassword').value;

  if (!name) return showError('signupError', 'Please enter your name.');
  if (!email) return showError('signupError', 'Please enter your email.');
  if (!pw || pw.length < 8) return showError('signupError', 'Password must be at least 8 characters.');

  setLoading(signupSubmit, true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    await updateProfile(cred.user, { displayName: name });
    await ensureUserDoc(cred.user, { name });
    showSuccess(`Welcome, ${name}! Your account is ready. Redirecting...`);
    setTimeout(() => { window.location.href = getRedirect(); }, 1200);
  } catch (err) {
    showError('signupError', friendlyError(err.code));
  } finally {
    setLoading(signupSubmit, false);
  }
});

/* ----- Google sign-in ----- */
async function handleGoogle(errorElId) {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    await ensureUserDoc(cred.user);
    showSuccess(`Welcome! Redirecting to your dashboard...`);
    setTimeout(() => { window.location.href = getRedirect(); }, 1200);
  } catch (err) {
    const msg = friendlyError(err.code);
    if (msg) showError(errorElId, msg);
  }
}

document.getElementById('googleSignIn')?.addEventListener('click', () => handleGoogle('signinError'));
document.getElementById('googleSignUp')?.addEventListener('click', () => handleGoogle('signupError'));

/* ----- GitHub sign-in (needs GitHub OAuth app configured in Firebase console) ----- */
async function handleGitHub(errorElId) {
  try {
    const cred = await signInWithPopup(auth, githubProvider);
    await ensureUserDoc(cred.user);
    showSuccess(`Welcome! Redirecting to your dashboard...`);
    setTimeout(() => { window.location.href = getRedirect(); }, 1200);
  } catch (err) {
    const msg = friendlyError(err.code);
    if (msg) showError(errorElId, msg || 'GitHub sign-in is not yet configured.');
  }
}

document.getElementById('githubSignIn')?.addEventListener('click', () => handleGitHub('signinError'));
document.getElementById('githubSignUp')?.addEventListener('click', () => handleGitHub('signupError'));

/* ----- Forgot password ----- */
const forgotLink = document.getElementById('forgotLink');
forgotLink && forgotLink.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signinEmail').value.trim();
  if (!email) {
    showError('signinError', 'Enter your email above, then click Forgot password.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showError('signinError', `Reset link sent to ${email} - check your inbox.`);
    document.getElementById('signinError').style.color = '#4ade80';
  } catch (err) {
    showError('signinError', friendlyError(err.code));
  }
});

/* ----- Redirect helper ----- */
function getRedirect() {
  const p = new URLSearchParams(location.search);
  const dest = p.get('redirect');
  if (dest && dest.startsWith('/')) return dest;
  return '/course';
}
