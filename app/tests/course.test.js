// The course in content/ is well formed, and every JavaScript lesson is
// solvable: its reference solution scores 10/10 and its starter does not.
// Lessons that run in the browser (HTML, CSS, page, React) are proven by
// the browser test, tests/e2e.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCourse, validateCourse, flatten } from '../server/content.js';
import { summarize } from '../client/src/grader/grading.js';
import { runJsInWorker } from './helpers/run-js.js';

const tracks = await loadCourse();
const lessons = flatten(tracks).map((entry) => entry.lesson);
const jsLessons = lessons.filter((lesson) => lesson.runner === 'js');

test('the course passes validation', () => {
  assert.deepEqual(validateCourse(tracks), []);
});

test('every lesson id is unique across the course', () => {
  const ids = lessons.map((lesson) => lesson.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('check functions only use their argument', () => {
  // Checks are stored as text and compiled in the browser, so they cannot
  // close over helpers defined in the content files.
  for (const lesson of lessons) {
    for (const check of lesson.checks ?? []) {
      if (typeof check.check !== 'function') continue;
      const source = check.check.toString();
      assert.doesNotThrow(() => new Function(`return (${source})`), `${lesson.id}: "${check.label}" does not compile on its own`);
    }
  }
});

for (const lesson of jsLessons) {
  test(`${lesson.id}: the solution scores 10/10`, async () => {
    const graded = summarize(lesson.checks, await runJsInWorker(lesson.solution, lesson.checks, lesson));
    assert.equal(graded.score, 10, graded.mistakes.join(' | '));
  });

  test(`${lesson.id}: the starter does not already pass`, async () => {
    const graded = summarize(lesson.checks, await runJsInWorker(lesson.starter, lesson.checks, lesson));
    assert.ok(graded.score < 10, `starter scores ${graded.score}`);
  });
}
