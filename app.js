// MatchBook — app.js
// Shared application logic

'use strict';

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
        ${session ? `
          <a href="announcements.html" class="nav-link ${isPage('announcements') ? 'active' : ''}">Browse</a>
          <a href="my-listings.html" class="nav-link ${isPage('my-listings') ? 'active' : ''}">Your Listings</a>
          <a href="chat.html" class="nav-link ${isPage('chat') ? 'active' : ''}">Messages</a>
          <a href="transactions.html" class="nav-link ${isPage('transactions') ? 'active' : ''}">Transactions</a>
        ` : ''}
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
  pending_deposit: 'Awaiting Deposit',
  deposit_paid: 'Deposit Paid',
  completed: 'Completed',
  refunded: 'Refunded',
  disputed: 'Disputed',
};

function statusBadge(s) {
  const colors = { pending_deposit: 'warning', deposit_paid: 'info', completed: 'success', refunded: 'error', disputed: 'error' };
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

// ─── INIT ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  // Highlight current nav link
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    if (l.href && location.href.includes(l.getAttribute('href'))) l.classList.add('active');
  });
});