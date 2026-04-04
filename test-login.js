/* ================================================
   test-login.js — Auth page logic (UI layer)
   Backend: NOT YET CONNECTED — see comments below
   ================================================ */

(function () {

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

  /* ----- Error helpers ----- */
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
    if (on) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }

  /* ----- Success state ----- */
  function showSuccess(msg) {
    document.getElementById('panelSignin').classList.add('hidden');
    document.getElementById('panelSignup').classList.add('hidden');
    document.getElementById('successMsg').textContent = msg;
    document.getElementById('panelSuccess').classList.remove('hidden');
  }

  /* ============================================================
     BACKEND PLACEHOLDER
     ============================================================
     This is where you plug in Firebase / Supabase / Auth0.

     Option A — Firebase (recommended):
       1. npm not needed — load Firebase CDN scripts in <head>
       2. import { initializeApp } from 'https://www.gstatic.com/firebasejs/...'
       3. import { getAuth, signInWithEmailAndPassword,
               createUserWithEmailAndPassword,
               signInWithPopup, GoogleAuthProvider,
               GithubAuthProvider } from '...'
       4. Replace the fake doSignIn / doSignUp / doSocial calls below

     Option B — Supabase:
       1. Load: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
       2. const { createClient } = supabase
       3. const sb = createClient(YOUR_URL, YOUR_ANON_KEY)
       4. Replace fake calls with sb.auth.signInWithPassword() etc.
  ============================================================ */

  async function doSignIn(email, password) {
    // REPLACE with real auth call
    await fakeDelay(1200);
    if (email === 'test@test.com' && password === 'password') {
      return { ok: true };
    }
    return { ok: false, error: 'Incorrect email or password.' };
  }

  async function doSignUp(name, email, password) {
    // REPLACE with real auth call
    await fakeDelay(1500);
    if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };
    return { ok: true };
  }

  async function doSocialAuth(provider) {
    // REPLACE with real OAuth popup
    await fakeDelay(800);
    return { ok: true };
  }

  function fakeDelay(ms) {
    return new Promise(r => setTimeout(r, ms));
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
    const result = await doSignIn(email, pw);
    setLoading(signinSubmit, false);

    if (result.ok) {
      showSuccess('Signed in successfully. Redirecting to your dashboard...');
    } else {
      showError('signinError', result.error);
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
    const result = await doSignUp(name, email, pw);
    setLoading(signupSubmit, false);

    if (result.ok) {
      showSuccess(`Welcome, ${name}! Your account is ready. Redirecting...`);
    } else {
      showError('signupError', result.error);
    }
  });

  /* ----- Social auth buttons ----- */
  ['googleSignIn', 'googleSignUp'].forEach(id => {
    const btn = document.getElementById(id);
    btn && btn.addEventListener('click', async () => {
      const result = await doSocialAuth('google');
      if (result.ok) showSuccess('Signed in with Google. Redirecting...');
      else showError(id.includes('SignIn') ? 'signinError' : 'signupError', 'Google sign-in failed. Please try again.');
    });
  });

  ['githubSignIn', 'githubSignUp'].forEach(id => {
    const btn = document.getElementById(id);
    btn && btn.addEventListener('click', async () => {
      const result = await doSocialAuth('github');
      if (result.ok) showSuccess('Signed in with GitHub. Redirecting...');
      else showError(id.includes('SignIn') ? 'signinError' : 'signupError', 'GitHub sign-in failed. Please try again.');
    });
  });

  /* ----- Forgot password link ----- */
  const forgotLink = document.getElementById('forgotLink');
  forgotLink && forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value.trim();
    if (!email) {
      showError('signinError', 'Enter your email above first, then click Forgot password.');
      return;
    }
    // REPLACE: call your auth provider's password reset method here
    showError('signinError', `Reset link sent to ${email} (feature not yet active).`);
  });

})();
