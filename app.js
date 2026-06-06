// MatchBook — app.js
// Shared application logic

'use strict';

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  EMAIL CONFIG  ·  PASTE YOUR EMAILJS VALUES HERE                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// The survey popup (email + 4 Yes/No answers) is sent here via EmailJS, a free
// email API that works from a static site — no backend / no GitHub Pages server.
//
// HOW TO FILL THIS IN (one-time setup at https://www.emailjs.com — free plan):
//   1. Sign up, then "Add an Email Service" and connect the mailbox that will
//      SEND the emails (e.g. a Gmail). Copy its Service ID below.
//      → The SENDER email + its password live in the EmailJS dashboard only.
//        With Gmail you connect via Google login (OAuth), so NO password is
//        stored anywhere. With custom SMTP you'd type the SMTP password into
//        the EmailJS dashboard — NEVER into this file (this repo is public).
//   2. "Create an Email Template". In the template's "To Email" field put
//      {{to_email}} so the RECEIVER is taken from `toEmail` below. Copy the
//      Template ID. (Template variables you can use: {{respondent_email}},
//      {{link_school}}, {{sell_book}}, {{buy_book}}, {{upgrade_pro}},
//      {{trigger_feature}}, {{submitted_at}}.)
//   3. Account → General: copy your Public Key (safe to expose on the client).
//   4. Paste the four values below. Leave them as-is to keep email OFF (the
//      answers still save locally, the popup still works — it just won't send).
const EMAILJS = {
  serviceId:  'service_kuhvf9e',    // ← EmailJS → Email Services
  templateId: 'template_9w4dzym',   // ← EmailJS → Email Templates
  publicKey:  'nwSR8D4wAzNEEMI0j',    // ← EmailJS → Account → General  (public, OK in client code)
  toEmail:    'matchbook.business@gmail.com',    // ← RECEIVER: where the survey responses are delivered
};

// Sends one survey response via the EmailJS REST API (no SDK needed).
// Returns a Promise<boolean>. Safe to call even before setup: if the config
// still holds placeholders it skips the network call and just warns.
async function sendWaitlistEmail(record) {
  const notConfigured =
    !EMAILJS.serviceId  || EMAILJS.serviceId  === 'YOUR_SERVICE_ID'  ||
    !EMAILJS.templateId || EMAILJS.templateId === 'YOUR_TEMPLATE_ID' ||
    !EMAILJS.publicKey  || EMAILJS.publicKey  === 'YOUR_PUBLIC_KEY';
  if (notConfigured) {
    console.warn('[MatchBook] EmailJS not configured — response saved locally only.', record);
    return false;
  }
  const a = record.answers || {};
  const payload = {
    service_id: EMAILJS.serviceId,
    template_id: EMAILJS.templateId,
    user_id: EMAILJS.publicKey,
    template_params: {
      to_email: EMAILJS.toEmail,
      respondent_email: record.email,
      trigger_feature: record.feature,
      link_school: a.linkSchool,
      sell_book: a.sellBook,
      buy_book: a.buyBook,
      upgrade_pro: a.upgradePro,
      submitted_at: new Date(record.ts).toLocaleString('en-GB'),
    },
  };
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('[MatchBook] EmailJS send failed:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[MatchBook] EmailJS network error:', err);
    return false;
  }
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

function buildNav() {
  const session = DB.getSession();
  const navEl = document.querySelector('nav.mb-nav');
  if (!navEl) return;
  const user = session ? DB.getUserById(session.userId) : null;
  const school = user ? getSchoolById(user.schoolId) : null;

  navEl.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="index.html" aria-label="MatchBook">
        <img class="mb-logo-img" src="assets/logo.png" alt="MatchBook">
      </a>
      <div class="nav-links">
        ${session ? (
          user && user.role === 'admin'
            ? `<a href="dashboard.html" class="nav-link nav-link-admin ${isPage('dashboard') ? 'active' : ''}">Dashboard</a>`
            : `
          <a href="announcements.html" class="nav-link ${isPage('announcements') ? 'active' : ''}">Browse</a>
          <a href="my-listings.html" class="nav-link ${isPage('my-listings') ? 'active' : ''}">Your Listings</a>
          <a href="chat.html" class="nav-link ${isPage('chat') ? 'active' : ''}">Messages</a>
          <a href="transactions.html" class="nav-link ${isPage('transactions') ? 'active' : ''}">Transactions</a>
        `) : ''}
      </div>
      <div class="nav-right">
        ${session && user ? `
          <div class="nav-user" id="navUserMenu">
            <div class="nav-avatar">${user.name[0].toUpperCase()}</div>
            <div class="nav-user-info">
              <span class="nav-username">${user.name.split(' ')[0]}</span>
              <span class="nav-plan ${user.plan || 'free'}">${(user.plan || 'free').toUpperCase()}</span>
            </div>
            <div class="nav-dropdown" id="navDropdown">
              <div class="dropdown-school">${school ? school.name : ''}</div>
              <div class="dropdown-balance">Balance: €${user.balance?.toFixed(2) ?? '0.00'}</div>
              ${user.plan === 'pro' ? `
                <div class="dropdown-pro-info">
                  <div class="dropdown-pro-badge">
                    <svg class="crown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z"/>
                    </svg>
                    PRO Member
                  </div>
                  <div class="dropdown-pro-boosts">${user.freeBoosts || 0} free boost${(user.freeBoosts || 0) === 1 ? '' : 's'} left</div>
                </div>
              ` : `
                <a href="pro.html" class="btn-upgrade-pro" aria-label="Upgrade to PRO">
                  <svg class="crown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z"/>
                  </svg>
                  Upgrade to PRO
                </a>
              `}
              ${user.role === 'admin' ? `<a href="dashboard.html" class="dropdown-btn dropdown-admin-link">📊 Metrics Dashboard</a>` : ''}
              <hr>
              <button class="dropdown-btn" onclick="logout()">Sign out</button>
            </div>
          </div>
        ` : `
          <a href="auth.html" class="btn btn-sm btn-primary">Sign in</a>
        `}
      </div>
    </div>
  `;

  // Dropdown toggle
  const userMenu = document.getElementById('navUserMenu');
  if (userMenu) {
    userMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('navDropdown')?.classList.toggle('open');
    });
    document.addEventListener('click', () => document.getElementById('navDropdown')?.classList.remove('open'));
  }
}

function isPage(name) { return location.pathname.includes(name); }

function logout() {
  DB.clearSession();
  toast('Signed out successfully', 'info');
  setTimeout(() => location.href = 'index.html', 800);
}

// ─── AUTH GUARDS ─────────────────────────────────────────────────────────────

function requireAuth() {
  const user = DB.currentUser();
  if (!user || !user.active) {
    location.href = 'auth.html?next=' + encodeURIComponent(location.pathname);
    return null;
  }
  return user;
}

function requireGuest() {
  const user = DB.currentUser();
  if (user) { location.href = 'index.html'; return false; }
  return true;
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function toast(msg, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  t.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span><span>${msg}</span>`;
  container.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, duration);
}

// ─── MODALS ──────────────────────────────────────────────────────────────────

function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
  if (e.target.dataset.closeModal) closeModal(e.target.dataset.closeModal);
});

// ─── FORMATTERS ──────────────────────────────────────────────────────────────

function formatPrice(n) { return '€' + parseFloat(n).toFixed(2); }
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateTime(ts) {
  return new Date(ts).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const CONDITION_LABELS = { new: 'New', like_new: 'Like New', good: 'Good', fair: 'Fair' };
const CONDITION_COLORS = { new: 'success', like_new: 'info', good: 'warning', fair: 'muted' };

function conditionBadge(c) {
  return `<span class="badge badge-${CONDITION_COLORS[c] || 'muted'}">${CONDITION_LABELS[c] || c}</span>`;
}

const STATUS_LABELS = {
  pending_payment: 'Awaiting Payment',
  paid: 'Paid',
  completed: 'Completed',
  refunded: 'Refunded',
  disputed: 'Disputed',
};

function statusBadge(s) {
  const colors = { pending_payment: 'warning', paid: 'info', completed: 'success', refunded: 'error', disputed: 'error' };
  return `<span class="badge badge-${colors[s] || 'muted'}">${STATUS_LABELS[s] || s}</span>`;
}

// ─── SCHOOL SELECT BUILDER ────────────────────────────────────────────────────

function buildSchoolSelect(selectEl) {
  const cities = getAllCities();
  selectEl.innerHTML = `<option value="">Select your school…</option>`;
  cities.forEach(city => {
    const schools = getSchoolsByCity(city);
    const og = document.createElement('optgroup');
    og.label = city;
    schools.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name;
      og.appendChild(o);
    });
    selectEl.appendChild(og);
  });
}

// ─── COMING SOON (interest + quick survey) ──────────────────────────────────────
// Shared, brand-styled modal used by every monetary CTA across the app. Payments
// aren't built yet for the pilot, so instead of running the (fake) money flow we
// collect an email plus a short 4-question intent survey. Responses are stored
// locally under mb_waitlist. (Step 3 will POST these to an email endpoint.)

// The four intent questions shown in the modal. `key` is what gets stored.
const CS_QUESTIONS = [
  { key: 'linkSchool', text: 'Would you link your school to your account?' },
  { key: 'sellBook',   text: 'Would you sell a book on our platform?' },
  { key: 'buyBook',    text: 'Would you buy a book on our platform?' },
  { key: 'upgradePro', text: 'Would you consider upgrading to MatchBook PRO?' },
];

function _csInjectModal() {
  if (document.getElementById('comingSoonModal')) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'comingSoonModal';
  // Short "what is PRO" card, shown right before the PRO question so people know
  // what they're answering about without leaving the popup.
  const proNote = `
        <div class="cs-pro-note">
          <div class="cs-pro-head"><span class="cs-pro-tag">PRO</span> &euro;5 / year</div>
          <div class="cs-pro-text">Removes the &euro;1 buyer fee on every purchase for a whole year &mdash; already worth it from your 6th book &mdash; and gives sellers 5 free listing boosts.</div>
        </div>`;
  const questionsHtml = CS_QUESTIONS.map(q => `${q.key === 'upgradePro' ? proNote : ''}
        <div class="cs-q" data-q="${q.key}">
          <div class="cs-q-text">${q.text}</div>
          <div class="cs-q-opts" role="group" aria-label="${q.text}">
            <button type="button" class="cs-q-btn" data-val="yes" onclick="csAnswer('${q.key}','yes',this)">Yes</button>
            <button type="button" class="cs-q-btn" data-val="no" onclick="csAnswer('${q.key}','no',this)">No</button>
          </div>
        </div>`).join('');
  overlay.innerHTML = `
    <div class="modal coming-soon-modal" role="dialog" aria-modal="true" aria-labelledby="csTitle">
      <button class="modal-close" data-close-modal="comingSoonModal" aria-label="Close">&times;</button>
      <div class="cs-body" id="csFormView">
        <span class="cs-badge">Coming soon</span>
        <h2 class="cs-title" id="csTitle">This feature is coming.</h2>
        <p class="cs-sub" id="csSub">Secure online payments aren't live yet in this pilot. Leave your email and answer four quick questions — it helps us build the right thing, and we'll let you know the moment it's ready.</p>
        <div class="cs-form">
          <input type="email" id="csEmail" class="form-input cs-input" placeholder="name@school.it" autocomplete="email" />
          <div class="cs-questions">
            ${questionsHtml}
          </div>
          <div class="form-error" id="csError" style="display:none;"></div>
          <button class="btn btn-primary btn-full cs-submit" onclick="submitComingSoon()">Keep me updated</button>
        </div>
        <p class="cs-fine">No spam — just one message when we open sign-ups.</p>
      </div>
      <div class="cs-done" id="csDoneView" style="display:none;">
        <div class="cs-done-icon">✓</div>
        <h2 class="cs-done-title">You're on the list!</h2>
        <p class="cs-sub">We'll write to you as soon as it's ready. Thanks for helping us shape MatchBook.</p>
        <button class="btn btn-secondary btn-full" data-close-modal="comingSoonModal">Close</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  // Submit on Enter inside the email field
  overlay.querySelector('#csEmail')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitComingSoon(); }
  });
}

// Toggle a Yes/No answer for one question. Only one option stays selected per row.
function csAnswer(key, val, btn) {
  const row = btn.closest('.cs-q');
  if (!row) return;
  row.querySelectorAll('.cs-q-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  row.classList.remove('error');
}

function openComingSoon(feature) {
  _csInjectModal();
  const label = feature || 'this feature';
  // reset to the form view every time it's opened
  const form = document.getElementById('csFormView');
  const done = document.getElementById('csDoneView');
  const err = document.getElementById('csError');
  const email = document.getElementById('csEmail');
  if (form) form.style.display = '';
  if (done) done.style.display = 'none';
  if (err) { err.style.display = 'none'; err.textContent = ''; }
  // clear any previously selected / errored answers
  document.querySelectorAll('#comingSoonModal .cs-q-btn.selected').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('#comingSoonModal .cs-q.error').forEach(r => r.classList.remove('error'));
  // prefill with the logged-in user's email if available
  if (email) {
    const u = DB.currentUser();
    email.value = (u && u.email && !u.email.endsWith('@matchbook.it')) ? u.email : '';
    email.classList.remove('error');
  }
  // stash which feature/button triggered this modal (recorded with the response)
  const modal = document.getElementById('comingSoonModal');
  if (modal) modal.dataset.feature = label;
  openModal('comingSoonModal');
  setTimeout(() => email?.focus(), 120);
}

function submitComingSoon() {
  const email = document.getElementById('csEmail');
  const err = document.getElementById('csError');
  const val = (email?.value || '').trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Collect the four Yes/No answers from the selected buttons.
  const answers = {};
  let unanswered = 0;
  CS_QUESTIONS.forEach(q => {
    const row = document.querySelector(`#comingSoonModal .cs-q[data-q="${q.key}"]`);
    const sel = row?.querySelector('.cs-q-btn.selected');
    if (sel) {
      answers[q.key] = sel.dataset.val; // 'yes' | 'no'
    } else {
      answers[q.key] = null;
      unanswered++;
      row?.classList.add('error');
    }
  });

  // Validate email first, then make sure every question is answered.
  if (!validEmail) {
    if (err) { err.textContent = 'Please enter a valid email address.'; err.style.display = 'block'; }
    email?.classList.add('error');
    email?.focus();
    return;
  }
  email?.classList.remove('error');
  if (unanswered > 0) {
    if (err) { err.textContent = 'Please answer all four questions.'; err.style.display = 'block'; }
    return;
  }
  if (err) err.style.display = 'none';

  const modal = document.getElementById('comingSoonModal');
  const feature = modal?.dataset.feature || 'unknown';
  const record = { email: val, feature, answers, ts: Date.now() };
  try {
    const list = DB._get('mb_waitlist', []);
    list.push(record);
    DB._set('mb_waitlist', list);
  } catch (_) { /* storage best-effort */ }

  // Fire off the email (non-blocking — the thank-you screen shows either way).
  sendWaitlistEmail(record);

  // swap to the thank-you view
  const form = document.getElementById('csFormView');
  const done = document.getElementById('csDoneView');
  if (form) form.style.display = 'none';
  if (done) done.style.display = '';
}

// ─── INIT ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  // Highlight current nav link
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    if (l.href && location.href.includes(l.getAttribute('href'))) l.classList.add('active');
  });
});