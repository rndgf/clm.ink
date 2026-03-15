/**
 * Shared modal utilities: open/close by element, body scroll lock, Escape key.
 * Use openModal/closeModal for programmatic control, or bindModal to wire buttons.
 */

const HIDDEN_CLASS = 'hidden';
const VISIBLE_CLASS = 'flex';

/**
 * Shows a modal element and locks body scroll.
 * @param {HTMLElement} modalEl - The modal container element
 */
export function openModal(modalEl) {
  if (!modalEl?.classList) return;
  modalEl.classList.remove(HIDDEN_CLASS);
  modalEl.classList.add(VISIBLE_CLASS);
  document.body.style.overflow = 'hidden';
}

/**
 * Hides a modal element and restores body scroll.
 * @param {HTMLElement} modalEl - The modal container element
 */
export function closeModal(modalEl) {
  if (!modalEl?.classList) return;
  modalEl.classList.add(HIDDEN_CLASS);
  modalEl.classList.remove(VISIBLE_CLASS);
  document.body.style.overflow = '';
}

/**
 * Binds open/close buttons and Escape key to a modal.
 * @param {HTMLElement} modalEl - The modal container element
 * @param {{ openSelector: string, closeSelectors: string }} options - Selectors for open trigger and close triggers
 * @returns {void}
 */
export function bindModal(modalEl, { openSelector, closeSelectors }) {
  if (!modalEl) return;

  const openBtn = document.querySelector(openSelector);
  const closeBtns = document.querySelectorAll(closeSelectors ?? '');

  if (!openBtn && closeBtns.length === 0) return;

  function handleClose() {
    closeModal(modalEl);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && modalEl.classList.contains(VISIBLE_CLASS)) {
      handleClose();
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => openModal(modalEl));
  }
  closeBtns.forEach((btn) => btn.addEventListener('click', handleClose));
  modalEl.addEventListener('keydown', handleKeydown);
  document.addEventListener('keydown', handleKeydown);
}
