/**
 * Gallery: slider (prev/next, touch swipe, autoplay), lightbox modal, pagination.
 * Uses modal.js for modal open/close and body scroll lock; touch-swipe.js for swipe.
 */

import { openModal, closeModal } from './modal.js';
import { onSwipe } from './touch-swipe.js';

/**
 * Initializes the gallery slider (prev/next, touch swipe, optional autoplay).
 * No-op if slider DOM is missing.
 */
function initGallerySlider() {
  const track = document.querySelector('.gallery-track');
  const prev = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  const wrapper = track?.closest('.gallery-slider-wrapper');

  if (!track || !prev || !next) return;

  const pageCount = Number(track.dataset.pageCount ?? 1);
  let current = 0;
  let autoplayInterval = null;

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  function goPrev() {
    current = (current - 1 + pageCount) % pageCount;
    update();
  }

  function goNext() {
    current = (current + 1) % pageCount;
    update();
  }

  function startAutoplay() {
    if (autoplayInterval || !wrapper || wrapper.getAttribute('data-auto-play') !== 'true') return;
    autoplayInterval = setInterval(() => {
      goNext();
    }, 4000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  prev.addEventListener('click', goPrev);
  next.addEventListener('click', goNext);

  onSwipe(track, {
    onLeft: goNext,
    onRight: goPrev,
  });

  if (wrapper?.getAttribute('data-auto-play') === 'true') {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

  update();
}

/**
 * Initializes the gallery lightbox modal (open on image click, close buttons, Escape, arrows, touch swipe).
 * No-op if modal or image buttons are missing.
 */
function initGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-image');
  const imageButtons = document.querySelectorAll('[data-gallery-image]');
  const closeButtons = document.querySelectorAll('[data-gallery-close]');

  if (!modal || !modalImg || imageButtons.length === 0) return;

  const images = [];
  imageButtons.forEach((btn) => {
    const img = btn.querySelector('img');
    if (!img) return;
    images.push({ src: img.src, alt: img.alt ?? '' });
    btn.dataset.index = String(images.length - 1);
  });

  let currentIndex = 0;

  function showImage(index) {
    if (!modalImg || images.length === 0) return;
    const len = images.length;
    const boundedIndex = ((index % len) + len) % len;
    const { src, alt } = images[boundedIndex];
    modalImg.src = src;
    modalImg.alt = alt;
    currentIndex = boundedIndex;
  }

  function openGalleryModal(index) {
    showImage(index);
    openModal(modal);
  }

  function closeGalleryModal() {
    closeModal(modal);
    modalImg.src = '';
    modalImg.alt = '';
  }

  imageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const rawIndex = btn.dataset.index;
      if (rawIndex == null) return;
      const index = Number(rawIndex);
      if (Number.isNaN(index)) return;
      openGalleryModal(index);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeGalleryModal);
  });

  document.addEventListener('keydown', (event) => {
    if (!modal?.classList?.contains('flex')) return;
    if (event.key === 'Escape') {
      closeGalleryModal();
    } else if (event.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    }
  });

  onSwipe(modal, {
    onLeft: () => showImage(currentIndex + 1),
    onRight: () => showImage(currentIndex - 1),
  });
}

/**
 * Initializes gallery pagination (prev/next page, current/total display).
 * No-op if wrapper or pages are missing or totalPages <= 1.
 */
function initGalleryPagination() {
  const wrapper = document.querySelector('.gallery-pagination-wrapper');
  if (!wrapper) return;

  const pages = wrapper.querySelectorAll('.gallery-page');
  const prevBtn = wrapper.querySelector('.gallery-pagination-prev');
  const nextBtn = wrapper.querySelector('.gallery-pagination-next');
  const currentEl = wrapper.querySelector('.gallery-pagination-current');
  const totalPages = Number(wrapper.dataset.totalPages ?? 1);

  if (pages.length === 0 || totalPages <= 1) return;

  let current = 0;

  function update() {
    pages.forEach((page, i) => {
      page.classList.toggle('hidden', i !== current);
      page.classList.toggle('block', i === current);
    });
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === totalPages - 1;
    if (currentEl) currentEl.textContent = String(current + 1);
  }

  prevBtn?.addEventListener('click', () => {
    if (current > 0) {
      current--;
      update();
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (current < totalPages - 1) {
      current++;
      update();
    }
  });

  update();
}

/**
 * Initializes all gallery features (slider, modal, pagination).
 * Each init is a no-op when its DOM is absent.
 */
export function initGallery() {
  initGallerySlider();
  initGalleryPagination();
  initGalleryModal();
}
