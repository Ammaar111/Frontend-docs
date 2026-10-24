// The HTTP API against an in-memory SQLite database seeded with the real course.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDatabase } from '../server/db.js';
import { seed } from '../server/seed.js';
import { createApp } from '../server/app.js';
import { loadCourse, flatten } from '../server/content.js';

let server;
let base;
let db;
const course = flatten(await loadCourse()).map((entry) => entry.lesson);
const codeLesson = course.find((lesson) => lesson.runner !== 'quiz');
const quiz = course.find((lesson) => lesson.runner === 'quiz');

before(async () => {
  db = openDatabase(':memory:');
  await seed(db);
  server = createApp(db).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(() => {
  server.close();
  db.close();
});

const call = async (path, options = {}) => {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
};

const report = (lesson, passedCount) => {
  const checks = lesson.checks.map((check, index) => ({ label: check.label, pass: index < passedCount }));
  return {
    code: '// attempt',
    score: Math.round((passedCount / lesson.checks.length) * 100) / 10,
    passed: passedCount,
    total: lesson.checks.length,
    mistakes: lesson.checks.slice(passedCount).map((check) => check.mistake),
    checks,
  };
};

test('the course outline lists every lesson in order', async () => {
  const { status, body } = await call('/tracks');
  assert.equal(status, 200);
  const ids = body.tracks.flatMap((track) => track.modules.flatMap((mod) => mod.lessons.map((lesson) => lesson.id)));
  assert.deepEqual(ids, course.map((lesson) => lesson.id));
});

test('a lesson comes without its solution', async () => {
  const { status, body } = await call(`/lessons/${codeLesson.id}`);
  assert.equal(status, 200);
  assert.equal(body.lesson.id, codeLesson.id);
  assert.equal(body.lesson.solution, undefined);
  assert.equal(body.lesson.checks.length, codeLesson.checks.length);
  assert.equal(body.lesson.solutionUnlocked, false);
});

test('quiz answers are not sent with the lesson', async () => {
  const { body } = await call(`/lessons/${quiz.id}`);
  for (const question of body.lesson.config.questions) {
    assert.equal(question.answer, undefined);
    assert.equal(question.explain, undefined);
  }
});

test('an unknown lesson is a 404', async () => {
  assert.equal((await call('/lessons/no-such-lesson')).status, 404);
});

test('drafts are saved and returned with the lesson', async () => {
  assert.equal((await call(`/lessons/${codeLesson.id}/draft`, { method: 'PUT', body: { code: 'let draft = 1;' } })).status, 200);
  const { body } = await call(`/lessons/${codeLesson.id}`);
  assert.equal(body.lesson.draft, 'let draft = 1;');
  assert.equal((await call(`/lessons/${codeLesson.id}/draft`, { method: 'PUT', body: { code: 42 } })).status, 400);
});

test('attempts are validated, stored, and update progress', async () => {
  const bad = await call(`/lessons/${codeLesson.id}/attempts`, { method: 'POST', body: { ...report(codeLesson, 1), score: 11 } });
  assert.equal(bad.status, 400);
  const mismatch = await call(`/lessons/${codeLesson.id}/attempts`, { method: 'POST', body: { ...report(codeLesson, 1), passed: 2 } });
  assert.equal(mismatch.status, 400);

  const first = await call(`/lessons/${codeLesson.id}/attempts`, { method: 'POST', body: report(codeLesson, 1) });
  assert.equal(first.status, 201);
  assert.equal(first.body.progress.attempts, 1);
  assert.equal(first.body.progress.status, 'tried');

  const pass = await call(`/lessons/${codeLesson.id}/attempts`, { method: 'POST', body: report(codeLesson, codeLesson.checks.length) });
  assert.equal(pass.body.progress.status, 'passed');
  assert.equal(pass.body.progress.bestScore, 10);

  const history = await call(`/lessons/${codeLesson.id}/attempts`);
  assert.equal(history.body.attempts.length, 2);
  assert.equal(history.body.attempts[0].score, 10);
});

test('a lower score later does not lower the best score or un-pass the lesson', async () => {
  const { body } = await call(`/lessons/${codeLesson.id}/attempts`, { method: 'POST', body: report(codeLesson, 0) });
  assert.equal(body.progress.bestScore, 10);
  assert.equal(body.progress.status, 'passed');
});

test('the solution unlocks after a pass', async () => {
  const other = course.filter((lesson) => lesson.runner !== 'quiz')[1] ?? codeLesson;
  if (other !== codeLesson) assert.equal((await call(`/lessons/${other.id}/solution`)).status, 403);
  const { status, body } = await call(`/lessons/${codeLesson.id}/solution`);
  assert.equal(status, 200);
  assert.equal(body.solution, codeLesson.solution);
});

test('quizzes are graded on the server', async () => {
  const wrong = quiz.questions.map((question) => (question.answer + 1) % question.options.length);
  const failed = await call(`/lessons/${quiz.id}/attempts`, { method: 'POST', body: { code: JSON.stringify(wrong) } });
  assert.equal(failed.status, 201);
  assert.equal(failed.body.result.score, 0);
  assert.equal(failed.body.result.mistakes.length, quiz.questions.length);
  assert.match(failed.body.result.mistakes[0], /The answer is/);

  const right = quiz.questions.map((question) => question.answer);
  const passed = await call(`/lessons/${quiz.id}/attempts`, { method: 'POST', body: { code: JSON.stringify(right) } });
  assert.equal(passed.body.result.score, 10);
  assert.equal(passed.body.progress.status, 'passed');

  const malformed = await call(`/lessons/${quiz.id}/attempts`, { method: 'POST', body: { code: '[1]' } });
  assert.equal(malformed.status, 400);
});

test('progress sums up the course', async () => {
  const { body } = await call('/progress');
  assert.equal(body.totals.lessons, course.length);
  assert.equal(body.totals.passed, 2);
  assert.ok(body.recent.length >= 3);
  assert.ok(body.next);
});

test('search finds lessons by title', async () => {
  const { body } = await call(`/search?q=${encodeURIComponent(codeLesson.title.slice(0, 8))}`);
  assert.ok(body.results.some((result) => result.id === codeLesson.id));
  assert.deepEqual((await call('/search?q=a')).body.results, []);
});

test('reseeding keeps the learner\'s attempts', async () => {
  await seed(db);
  const history = await call(`/lessons/${codeLesson.id}/attempts`);
  assert.equal(history.body.attempts.length, 3);
});

test('assets are served from the database with an ETag', async () => {
  const name = db.prepare('SELECT name FROM assets LIMIT 1').pluck().get();
  if (!name) return;
  const response = await fetch(`${base}/assets/${name}`);
  assert.equal(response.status, 200);
  const etag = response.headers.get('etag');
  assert.ok(etag);
  const again = await fetch(`${base}/assets/${name}`, { headers: { 'If-None-Match': etag } });
  assert.equal(again.status, 304);
});

test('bad JSON is a 400, unknown API routes are 404', async () => {
  const response = await fetch(`${base}/lessons/${codeLesson.id}/draft`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: '{not json',
  });
  assert.equal(response.status, 400);
  assert.equal((await call('/nope')).status, 404);
});
