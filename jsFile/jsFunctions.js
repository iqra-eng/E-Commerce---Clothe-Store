/* =========================================================
   jsFunctions.js — Shared JS for E-Commerce Clothing Store
========================================================= */

/* --------------------------------------------------
   NAV TOGGLE (Hamburger)
-------------------------------------------------- */
function initNavToggle() {
  const toggle = document.querySelector('.menu-toggle');
  const navUl  = document.querySelector('nav ul');
  if (!toggle || !navUl) return;

  toggle.addEventListener('click', () => {
    navUl.classList.toggle('open');
    const isOpen = navUl.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.querySelectorAll('span').forEach((s, i) => {
      if (isOpen) {
        if (i === 0) toggle.classList.toggle('nav-open');
        if (i === 1) toast.classList.add('show');
        if (i === 2) s.style.transform = 'rotate(-45deg) translate(4px, -5px)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      navUl.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    }
  });
}

/* --------------------------------------------------
   DARK MODE TOGGLE
-------------------------------------------------- */
function initDarkMode() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateToggleLabel(btn, saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleLabel(btn, next);
  });
}

function updateToggleLabel(btn, theme) {
  btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
}

/* --------------------------------------------------
   CART COUNTER (session-based)
-------------------------------------------------- */
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  const cart  = getCart();
  const index = cart.findIndex(c => c.id === item.id && c.size === item.size);
  if (index > -1) {
    cart[index].qty += item.qty || 1;
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  saveCart(cart);
  showToast('Item added to cart');
}

function removeFromCart(id, size) {
  let cart = getCart();
  cart = cart.filter(c => !(c.id === id && c.size === size));
  saveCart(cart);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const total = getCart().reduce((s, c) => s + c.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'inline-block' : 'none';
}

/* --------------------------------------------------
   TOAST NOTIFICATION
-------------------------------------------------- */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '28px', right: '28px',
      background: type === 'error' ? '#c0392b' : '#1a1a1a',
      color: '#fff', padding: '12px 24px',
      borderRadius: '4px', fontSize: '0.82rem',
      letterSpacing: '0.06em', zIndex: '9999',
      boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
      opacity: '0', transition: 'opacity 0.3s ease',
      fontFamily: 'Inter, sans-serif'
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = type === 'error' ? '#c0392b' : '#1a1a1a';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

/* --------------------------------------------------
   TABLE ROW SELECTION (optional UX)
-------------------------------------------------- */
function initTableSelection() {
  document.querySelectorAll('table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('table tbody tr').forEach(r => r.classList.remove('table-row-selected'));
      row.classList.add('table-row-selected');
    });
  });
}

/* --------------------------------------------------
   QUANTITY CONTROL (product detail / cart)
-------------------------------------------------- */
function initQtyControls() {
  document.querySelectorAll('.qty-control').forEach(ctrl => {
    const minus = ctrl.querySelector('.qty-minus');
    const plus  = ctrl.querySelector('.qty-plus');
    const input = ctrl.querySelector('.qty-input');
    if (!minus || !plus || !input) return;
    minus.addEventListener('click', () => {
      const val = parseInt(input.value, 10);
      if (val > 1) input.value = val - 1;
    });
    plus.addEventListener('click', () => {
      input.value = parseInt(input.value, 10) + 1;
    });
  });
}

/* --------------------------------------------------
   FORM VALIDATION (generic)
-------------------------------------------------- */
function validateRequired(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#c0392b';
      field.style.boxShadow   = '0 0 0 3px rgba(192,57,43,0.15)';
      valid = false;
    } else {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
    }
  });
  if (!valid) showToast('Please fill in all required fields.', 'error');
  return valid;
}

/* --------------------------------------------------
   INIT ON DOM READY
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initDarkMode();
  updateCartBadge();
  initTableSelection();
  initQtyControls();
});
