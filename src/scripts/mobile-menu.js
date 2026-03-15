/**
 * Mobile menu toggle: button toggles nav visibility; nav links close on click.
 * Uses #mobile-menu-btn, #main-nav, #site-header.
 */

/**
 * Initializes the mobile menu (toggle button and close on nav link click).
 * No-op if required elements are missing.
 */
export function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  const header = document.getElementById('site-header');

  if (!btn || !nav) return;

  function setOpen(open) {
    if (open) {
      nav.classList.add('max-sm:!flex');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Fermer le menu');
      header?.classList.add('mobile-menu-open');
    } else {
      nav.classList.remove('max-sm:!flex');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Ouvrir le menu');
      header?.classList.remove('mobile-menu-open');
    }
  }

  btn.addEventListener('click', () => {
    setOpen(!nav.classList.contains('max-sm:!flex'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}
