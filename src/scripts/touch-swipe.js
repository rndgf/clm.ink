/**
 * Touch swipe detection: calls onLeft/onRight when horizontal swipe exceeds threshold.
 * Returns a cleanup function to remove listeners.
 */

const DEFAULT_THRESHOLD = 40;

/**
 * Attaches touchstart/touchend to detect horizontal swipes.
 * @param {HTMLElement} element - Element to listen on
 * @param {{ threshold?: number, onLeft?: () => void, onRight?: () => void }} options - Threshold in px; onLeft when swipe left, onRight when swipe right
 * @returns {() => void} Cleanup function to remove listeners
 */
export function onSwipe(element, { threshold = DEFAULT_THRESHOLD, onLeft, onRight } = {}) {
  if (!element) return () => {};

  let touchStartX = null;

  function handleTouchStart(e) {
    if (e.touches?.length !== 1) return;
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX == null) return;
    const touchEndX = e.changedTouches?.[0]?.clientX ?? 0;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        onLeft?.();
      } else {
        onRight?.();
      }
    }
    touchStartX = null;
  }

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}
