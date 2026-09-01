const openButton = document.querySelector('.menu-button');
const overlay = document.querySelector('.menu-overlay');
const closeButton = document.querySelector('.menu-close');
const siteHeader = document.querySelector('.site-header');
const mainContent = document.querySelector('main');
const siteFooter = document.querySelector('.site-footer');
let lastFocus = null;

// Keep the full-screen menu outside the sticky, blurred header. CSS backdrop-filter
// creates its own containing/stacking context in some browsers, which can make a
// fixed child render behind page content. Moving the overlay to <body> makes it a
// true viewport-level layer on phones, tablets and desktop browsers.
if (overlay && overlay.parentElement !== document.body) {
  document.body.appendChild(overlay);
}

function focusables() {
  if (!overlay) return [];
  return [...overlay.querySelectorAll('a[href], button:not([disabled])')];
}

function setPageInert(isInert) {
  [siteHeader, mainContent, siteFooter].forEach((element) => {
    if (!element) return;
    if (isInert) {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    } else {
      element.removeAttribute('inert');
      element.removeAttribute('aria-hidden');
    }
  });
}

function openMenu() {
  if (!overlay || !openButton) return;
  lastFocus = document.activeElement;
  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
  openButton.setAttribute('aria-expanded', 'true');
  setPageInert(true);
  requestAnimationFrame(() => closeButton?.focus());
}

function closeMenu() {
  if (!overlay || !openButton) return;
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  openButton.setAttribute('aria-expanded', 'false');
  setPageInert(false);
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

if (overlay) overlay.setAttribute('aria-hidden', overlay.hidden ? 'true' : 'false');
openButton?.addEventListener('click', openMenu);
closeButton?.addEventListener('click', closeMenu);

overlay?.addEventListener('click', (event) => {
  if (event.target === overlay) closeMenu();
});

overlay?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
    return;
  }
  if (event.key !== 'Tab') return;
  const items = focusables();
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

overlay?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

// Internal links deliberately target index.html so they also work when the site is
// opened directly from a downloaded folder. On HTTP/HTTPS, hide index.html from
// the visible address after the page has loaded.
(() => {
  if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;
  const path = window.location.pathname;
  if (!path.endsWith('/index.html')) return;
  const cleanPath = path.slice(0, -'index.html'.length);
  window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
})();
