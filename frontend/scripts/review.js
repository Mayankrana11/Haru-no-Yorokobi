// review.js
// Handles loading bundled reviews, combining with local submissions,
// rendering the review UI, and handling review form submissions.

const REVIEWS_KEY = 'hnr_reviews_local'; // localStorage key for submitted reviews
const REVIEWS_JSON = '../assets/reviews.json';

/**
 * Load bundled reviews from assets and merge with locally submitted reviews.
 * Calls renderReviews() to update the UI.
 */
function loadSavedReviews() {
  fetch(REVIEWS_JSON)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    })
    .then(baseReviews => {
      const local = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
      // Local reviews should appear first (most recent)
      const combined = local.concat(baseReviews);
      renderReviews(combined);
    })
    .catch(() => {
      // If fetch fails, fall back to local reviews only
      const local = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
      renderReviews(local);
    });
}

/**
 * Render the average rating and the recent reviews list.
 * Expects an array of objects: { name, rating, comment, ts? }.
 */
function renderReviews(list) {
  const avgEl = document.getElementById('avg-rating');
  const recentEl = document.getElementById('recent-reviews');

  if (!avgEl || !recentEl) return;

  const avg = list.length ? list.reduce((s, r) => s + (r.rating || 0), 0) / list.length : 0;
  avgEl.textContent = avg ? `${avg.toFixed(1)} / 5` : '—';

  recentEl.innerHTML = '';
  const toShow = list.slice(0, 5);
  toShow.forEach(r => {
    const wrapper = document.createElement('div');
    wrapper.className = 'review';
    const name = r.name || 'Anonymous';
    const rating = r.rating || 0;
    const comment = r.comment || '';
    const time = r.ts ? new Date(r.ts).toLocaleString() : '';
    wrapper.innerHTML = `<strong>${escapeHtml(name)}</strong> — ${escapeHtml(String(rating))}/5`
                      + `<br/><small>${escapeHtml(comment)}</small>`
                      + (time ? `<div class="rev-time">${escapeHtml(time)}</div>` : '');
    recentEl.appendChild(wrapper);
  });
}

/**
 * Attach submit handler to the review form.
 * Saves new reviews to localStorage and refreshes the rendered list.
 */
function attachReviewForm() {
  const form = document.getElementById('review-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const nameEl = document.getElementById('reviewer-name');
    const ratingEl = document.getElementById('review-rating');
    const commentEl = document.getElementById('review-comment');

    const name = (nameEl && nameEl.value.trim()) || 'Anonymous';
    const rating = ratingEl ? parseInt(ratingEl.value, 10) : 5;
    const comment = commentEl ? commentEl.value.trim() : '';

    if (!comment) {
      // Keep it simple: require at least a short comment
      alert('Please write a short review before submitting.');
      return;
    }

    const entry = {
      name,
      rating: Math.max(1, Math.min(5, rating)),
      comment,
      ts: new Date().toISOString()
    };

    const local = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    local.unshift(entry); // newest first
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(local));

    // update UI
    loadSavedReviews();
    form.reset();
  });
}

/**
 * Escape HTML to prevent injection when inserting untrusted content.
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Exported initializer for pages that want to call review logic explicitly.
function initReviews() {
  attachReviewForm();
  loadSavedReviews();
}

// If this file is loaded directly in the page, initialize on DOM ready.
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if review elements exist on the page
  if (document.getElementById('review-form') || document.getElementById('recent-reviews')) {
    initReviews();
  }
});
