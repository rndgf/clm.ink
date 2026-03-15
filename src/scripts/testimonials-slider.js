/**
 * Testimonials slider: prev/next, touch swipe, autoplay.
 */

import { onSwipe } from './touch-swipe.js';

/**
 * Initializes the testimonials slider. No-op if DOM is missing.
 */
export function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const prev = document.querySelector('.testimonials-prev');
  const next = document.querySelector('.testimonials-next');
  const wrapper = track?.closest('.testimonials-slider-wrapper');

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
    }, 5000);
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
