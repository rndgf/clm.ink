/**
 * Client-side testimonials shuffle: reads data from window.__TESTIMONIALS__,
 * shuffles the array, then replaces either the slider track (homepage) or
 * the grid (temoignages-clients page). Must run after DOM is ready.
 */

const STAR_SVG =
  '<svg class="w-4 h-4 shrink-0" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getInitials(author) {
  const parts = String(author).trim().split(/\s+/);
  const letters = parts
    .map((p) => p.replace(/[^a-zA-Z]/g, '').charAt(0))
    .filter(Boolean)
    .join('')
    .toUpperCase();
  return letters.slice(0, 2) || '—';
}

const MONTHS = {
  janvier: 1, février: 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, août: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12,
};

function parseDateKey(dateStr) {
  if (!dateStr || !String(dateStr).trim()) return 0;
  const parts = String(dateStr).trim().toLowerCase().split(/\s+/);
  const month = MONTHS[parts[0]] ?? 0;
  const year = parseInt(parts[1], 10);
  if (!year || !month) return 0;
  return year * 12 + month;
}

function sortByDateDesc(data) {
  return [...data].sort((a, b) => parseDateKey(b.date) - parseDateKey(a.date));
}

function renderSliderSlide(item, index) {
  const text = escapeHtml(item.text);
  const author = escapeHtml(item.author);
  const initials = escapeHtml(getInitials(item.author));
  const date = item.date ? escapeHtml(item.date) : '';
  const dateHtml = date ? `<p class="text-xs text-neutral-500 pt-1">${date}</p>` : '';
  return `<div class="min-w-full px-2 sm:px-4 flex justify-center" data-page="${index}">
  <blockquote class="w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-4 sm:px-6 sm:py-5 space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-600 flex items-center justify-center shrink-0 text-sm font-semibold text-neutral-100" aria-hidden="true">${initials}</div>
        <p class="text-sm font-medium text-neutral-100 not-italic truncate">${author}</p>
      </div>
      <div class="flex gap-0.5 text-amber-400/90 shrink-0" aria-hidden="true">${STAR_SVG.repeat(5)}</div>
    </div>
    <p class="text-sm text-neutral-200 leading-relaxed">${text}</p>
    ${dateHtml}
  </blockquote>
</div>`;
}

function renderGridCard(item) {
  const text = escapeHtml(item.text);
  const author = escapeHtml(item.author);
  const initials = escapeHtml(getInitials(item.author));
  const date = item.date ? escapeHtml(item.date) : '';
  const dateHtml = date ? `<p class="text-xs text-neutral-500 pt-1">${date}</p>` : '';
  return `<blockquote class="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-4 sm:px-5 sm:py-5 space-y-3">
  <div class="flex items-center justify-between gap-3">
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-600 flex items-center justify-center shrink-0 text-sm font-semibold text-neutral-100" aria-hidden="true">${initials}</div>
      <p class="text-sm font-medium text-neutral-100 not-italic truncate">${author}</p>
    </div>
    <div class="flex gap-0.5 text-amber-400/90 shrink-0" aria-hidden="true">${STAR_SVG.repeat(5)}</div>
  </div>
  <p class="text-sm sm:text-base text-neutral-200 leading-relaxed">${text}</p>
  ${dateHtml}
</blockquote>`;
}

export function runTestimonialsShuffle() {
  const data = window.__TESTIMONIALS__;
  if (!Array.isArray(data) || data.length === 0) return;

  const track = document.querySelector('.testimonials-track');
  if (track) {
    const shuffled = shuffle(data);
    const limit = 10;
    const items = shuffled.slice(0, limit);
    track.innerHTML = items.map((item, i) => renderSliderSlide(item, i)).join('');
    track.dataset.pageCount = String(items.length);
  }

  const grid = document.querySelector('.testimonials-grid');
  if (grid) {
    const sorted = sortByDateDesc(data);
    grid.innerHTML = sorted.map((item) => renderGridCard(item)).join('');
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTestimonialsShuffle);
  } else {
    runTestimonialsShuffle();
  }
}
