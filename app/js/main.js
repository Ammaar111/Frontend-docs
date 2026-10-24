// Page controller: sidebar navigation, lesson view, grading and history.
import { lessons, tracks, upcoming } from '../lessons/index.js';
import { gradeLesson } from './runner.js';
import { PASS_MARK, formatScore } from './grading.js';
import { loadState, saveState, recordAttempt } from './storage.js';
import { el, renderBlocks } from './render.js';

const HISTORY_LENGTH = 20;
const sidebar = document.querySelector('#lesson-list');
const main = document.querySelector('#lesson');
const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const state = loadState();
let draftTimer;
let running = false;

function bestScore(id) {
  return (state.attempts[id] ?? []).reduce((best, attempt) => Math.max(best, attempt.score), 0);
}

function statusOf(id) {
  const attempts = state.attempts[id] ?? [];
  if (attempts.length === 0) return 'new';
  return bestScore(id) >= PASS_MARK ? 'passed' : 'attempted';
}

function currentLesson() {
  return byId.get(decodeURIComponent(location.hash.slice(1))) ?? lessons[0];
}

function renderSidebar(activeId) {
  const passedCount = lessons.filter((lesson) => statusOf(lesson.id) === 'passed').length;

  const navItem = (lesson) => {
    const status = statusOf(lesson.id);
    const badge =
      status === 'new'
        ? 'not started'
        : status === 'passed'
          ? `passed, best ${formatScore(bestScore(lesson.id))}`
          : `best ${formatScore(bestScore(lesson.id))}`;
    return el(
      'a',
      {
        href: `#${lesson.id}`,
        class: `nav-lesson ${status}`,
        'aria-current': lesson.id === activeId ? 'page' : null,
      },
      el('span', { class: 'nav-title' }, lesson.title),
      el('span', { class: 'nav-status' }, badge),
    );
  };

  const groups = tracks.map((track) => {
    const trackLessons = lessons.filter((lesson) => lesson.track === track.id);
    const modules = [...new Set(trackLessons.map((lesson) => lesson.module))];
    return el(
      'section',
      { class: 'track' },
      el('h2', {}, track.title),
      modules.map((moduleName) =>
        el(
          'div',
          { class: 'module' },
          el('h3', {}, moduleName),
          trackLessons.filter((lesson) => lesson.module === moduleName).map(navItem),
        ),
      ),
    );
  });

  const upcomingGroup = el(
    'section',
    { class: 'track upcoming' },
    el('h2', {}, 'Coming next'),
    el('ul', {}, upcoming.map((item) => el('li', {}, item))),
  );

  sidebar.replaceChildren(
    el('p', { class: 'progress' }, `${passedCount} of ${lessons.length} lessons passed`),
    ...groups,
    upcomingGroup,
  );
}

function renderResult(attempt) {
  const pass = attempt.score >= PASS_MARK;
  return el(
    'div',
    { class: 'result' },
    el(
      'p',
      { class: 'score-line' },
      el('span', { class: 'score', 'data-score': String(attempt.score) }, formatScore(attempt.score)),
      el(
        'span',
        { class: `verdict ${pass ? 'pass' : 'fail'}` },
        pass ? `Passed (pass mark ${PASS_MARK}/10)` : `Not yet (pass mark ${PASS_MARK}/10)`,
      ),
    ),
    el('p', {}, `${attempt.passed} of ${attempt.count} checks passed.`),
    el('h3', {}, 'Mistakes made'),
    attempt.mistakes.length === 0
      ? el('p', { class: 'all-clear' }, 'None. Every check passed.')
      : el('ol', { class: 'mistakes' }, attempt.mistakes.map((mistake) => el('li', {}, mistake))),
    el('details', {}, el('summary', {}, 'Every check'), el(
      'ul',
      { class: 'checks' },
      attempt.checks.map((check) =>
        el('li', { class: check.pass ? 'ok' : 'miss' }, `${check.pass ? 'Passed' : 'Failed'}: ${check.label}`),
      ),
    )),
  );
}

function renderHistory(lessonId) {
  const attempts = state.attempts[lessonId] ?? [];
  if (attempts.length === 0) return el('p', { class: 'muted' }, 'No attempts yet.');
  return el(
    'table',
    { class: 'history' },
    el(
      'thead',
      {},
      el('tr', {}, el('th', { scope: 'col' }, 'Attempt'), el('th', { scope: 'col' }, 'Score'), el('th', { scope: 'col' }, 'Mistakes'), el('th', { scope: 'col' }, 'When')),
    ),
    el(
      'tbody',
      {},
      attempts.map((attempt, index) =>
        el(
          'tr',
          {},
          el('td', {}, String(attempts.length - index)),
          el('td', {}, formatScore(attempt.score)),
          el('td', {}, String(attempt.mistakes.length)),
          el('td', {}, new Date(attempt.at).toLocaleString()),
        ),
      ),
    ),
  );
}

function renderLesson(lesson) {
  const index = lessons.indexOf(lesson);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const latest = (state.attempts[lesson.id] ?? [])[0];

  const textarea = el('textarea', {
    id: 'code',
    class: 'editor',
    rows: '16',
    spellcheck: 'false',
    autocapitalize: 'off',
    autocomplete: 'off',
    'aria-describedby': 'code-hint',
  });
  textarea.value = state.drafts[lesson.id] ?? lesson.starter;
  textarea.addEventListener('input', () => {
    state.drafts[lesson.id] = textarea.value;
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => saveState(state), 300);
  });
  textarea.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runLesson(lesson, textarea.value, runButton, resultBox, historyBox);
    }
  });

  const runButton = el('button', { type: 'button', class: 'primary', onclick: () => runLesson(lesson, textarea.value, runButton, resultBox, historyBox) }, 'Run and grade');
  const resetButton = el('button', {
    type: 'button',
    onclick: () => {
      if (!confirm('Replace your draft with the starter code?')) return;
      textarea.value = lesson.starter;
      state.drafts[lesson.id] = lesson.starter;
      saveState(state);
      textarea.focus();
    },
  }, 'Reset to starter');

  const resultBox = el('section', { class: 'panel', 'aria-live': 'polite', 'aria-labelledby': 'evaluation-title' },
    el('h2', { id: 'evaluation-title' }, '4. Evaluation'),
    el('div', { class: 'slot' },
      latest ? renderResult(latest) : el('p', { class: 'muted' }, 'Run your code to see your score and mistakes.'),
    ),
  );
  const historyBox = el('section', { class: 'panel', 'aria-labelledby': 'history-title' },
    el('h2', { id: 'history-title' }, 'History'),
    el('div', { class: 'slot' }, renderHistory(lesson.id)),
  );

  const pager = el(
    'nav',
    { class: 'pager', 'aria-label': 'Lesson navigation' },
    previous ? el('a', { href: `#${previous.id}` }, `← ${previous.title}`) : el('span'),
    next ? el('a', { href: `#${next.id}` }, `${next.title} →`) : el('span'),
  );

  main.replaceChildren(
    el('header', { class: 'lesson-head' },
      el('p', { class: 'crumb' }, `${tracks.find((t) => t.id === lesson.track).title} · ${lesson.module} · ${lesson.source}`),
      el('h1', {}, lesson.title),
    ),
    el('section', { class: 'panel' }, el('h2', {}, '1. Teach'), renderBlocks(lesson.teach)),
    el('section', { class: 'panel' },
      el('h2', {}, '2. Example'),
      lesson.example ? el('pre', { tabindex: '0' }, el('code', {}, lesson.example.code)) : null,
    ),
    el('section', { class: 'panel' }, el('h2', {}, '3. Task'), renderBlocks(lesson.task)),
    el('section', { class: 'panel' },
      el('h2', {}, '5. Your code'),
      el('label', { for: 'code', class: 'sr-only' }, 'Your code'),
      textarea,
      el('p', { id: 'code-hint', class: 'muted' }, 'Ctrl+Enter (Cmd+Enter on Mac) runs your code. Your draft is saved in this browser automatically.'),
      el('div', { class: 'actions' }, runButton, resetButton),
    ),
    resultBox,
    historyBox,
    pager,
  );

  main.focus({ preventScroll: true });
}

async function runLesson(lesson, code, runButton, resultBox, historyBox) {
  if (running) return;
  running = true;
  runButton.disabled = true;
  runButton.textContent = 'Running…';

  try {
    const outcome = await gradeLesson(lesson, code);
    const attempt = { ...outcome, at: new Date().toISOString() };
    recordAttempt(state, lesson.id, attempt);
    saveState(state);

    resultBox.querySelector('.slot').replaceChildren(renderResult(attempt));
    historyBox.querySelector('.slot').replaceChildren(renderHistory(lesson.id));
    renderSidebar(lesson.id);
  } finally {
    running = false;
    runButton.disabled = false;
    runButton.textContent = 'Run and grade';
  }
}

function render() {
  const lesson = currentLesson();
  if (location.hash !== `#${lesson.id}`) {
    history.replaceState(null, '', `#${lesson.id}`);
  }
  renderSidebar(lesson.id);
  renderLesson(lesson);
}

window.addEventListener('hashchange', render);
render();
