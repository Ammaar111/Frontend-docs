// Structural checks on the curriculum, plus proof that each JavaScript lesson is
// solvable. Run from the app folder with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons, tracks } from '../lessons/index.js';
import { runJsTests } from '../js/js-sandbox.js';
import { summarize } from '../js/grading.js';
import { solutions } from './solutions.js';

const RUNNERS = new Set(['js', 'html', 'css']);

test('every lesson has a unique id', () => {
  const ids = lessons.map((lesson) => lesson.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every lesson belongs to a known track and has its required sections', () => {
  const trackIds = new Set(tracks.map((track) => track.id));
  for (const lesson of lessons) {
    assert.ok(trackIds.has(lesson.track), `${lesson.id}: unknown track ${lesson.track}`);
    assert.ok(RUNNERS.has(lesson.runner), `${lesson.id}: unknown runner ${lesson.runner}`);
    assert.ok(lesson.title, `${lesson.id}: missing title`);
    assert.ok(lesson.module, `${lesson.id}: missing module`);
    assert.ok(lesson.source, `${lesson.id}: missing source reference`);
    assert.ok(lesson.teach?.length > 0, `${lesson.id}: missing teach text`);
    assert.ok(lesson.example?.code, `${lesson.id}: missing example code`);
    assert.ok(lesson.task?.length > 0, `${lesson.id}: missing task`);
    assert.equal(typeof lesson.starter, 'string', `${lesson.id}: missing starter code`);
    assert.ok(lesson.tests?.length >= 3, `${lesson.id}: needs at least three checks`);
  }
});

test('every check has a label and a mistake message the learner can act on', () => {
  for (const lesson of lessons) {
    for (const check of lesson.tests) {
      assert.ok(check.label, `${lesson.id}: a check has no label`);
      assert.ok(check.mistake, `${lesson.id}: "${check.label}" has no mistake message`);
      if (lesson.runner === 'js') {
        assert.ok('expr' in check, `${lesson.id}: "${check.label}" needs expr`);
        assert.ok('expect' in check || check.throws === true, `${lesson.id}: "${check.label}" needs expect or throws`);
      } else {
        assert.equal(typeof check.check, 'function', `${lesson.id}: "${check.label}" needs a check function`);
      }
    }
  }
});

test('every lesson has a reference solution', () => {
  for (const lesson of lessons) {
    assert.ok(solutions[lesson.id], `${lesson.id}: no reference solution in tests/solutions.js`);
  }
});

test('the starter code of a JavaScript lesson does not already pass', async () => {
  for (const lesson of lessons.filter((item) => item.runner === 'js')) {
    const outcome = await runJsTests(lesson.starter, lesson.tests);
    const graded = summarize(lesson.tests, outcome);
    assert.ok(graded.score < 10, `${lesson.id}: starter already scores ${graded.score}`);
  }
});

test('every JavaScript reference solution scores 10/10', async () => {
  for (const lesson of lessons.filter((item) => item.runner === 'js')) {
    const outcome = await runJsTests(solutions[lesson.id], lesson.tests);
    const graded = summarize(lesson.tests, outcome);
    assert.equal(graded.score, 10, `${lesson.id}: ${graded.mistakes.join(' | ')}`);
  }
});
