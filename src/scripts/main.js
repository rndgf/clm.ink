/**
 * Entry point: inits mobile menu, map modal, and gallery when DOM is ready.
 * Each init is a no-op when its elements are absent.
 */

import { initMobileMenu } from './mobile-menu.js';
import { bindModal } from './modal.js';
import { initGallery } from './gallery.js';

function run() {
  initMobileMenu();

  const mapModal = document.getElementById('map-modal');
  if (mapModal) {
    bindModal(mapModal, {
      openSelector: '[data-map-open]',
      closeSelectors: '[data-map-close]',
    });
  }

  const hasGallery =
    document.querySelector('.gallery-slider-wrapper') ||
    document.querySelector('.gallery-pagination-wrapper') ||
    document.getElementById('gallery-modal');
  if (hasGallery) {
    initGallery();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run);
} else {
  run();
}
