// Per-browser progress: saved drafts and graded attempts.
// localStorage can be blocked (private windows, disabled site data), so every
// access is wrapped. If storage is unavailable the app still works, and
// progress just does not persist.

const KEY = 'frontend-lab:v1';
const MAX_ATTEMPTS_PER_LESSON = 20;

function emptyState() {
  return { drafts: {}, attempts: {} };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage is full or blocked. Progress stays in memory for this page view.
  }
}

export function recordAttempt(state, lessonId, attempt) {
  const list = state.attempts[lessonId] ?? [];
  state.attempts[lessonId] = [attempt, ...list].slice(0, MAX_ATTEMPTS_PER_LESSON);
}
