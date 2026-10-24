// Behaviour of the JavaScript sandbox and the grading rules, independent of any lesson.
// Run from the app folder with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runJsTests, deepEqual, describe } from '../js/js-sandbox.js';
import { summarize, formatScore } from '../js/grading.js';

test('a passing run scores 10 and lists no mistakes', async () => {
  const tests = [{ label: 'two plus two', expr: 'add(2, 2)', expect: 4, mistake: 'wrong' }];
  const graded = summarize(tests, await runJsTests('function add(a, b) { return a + b; }', tests));
  assert.equal(graded.score, 10);
  assert.deepEqual(graded.mistakes, []);
});

test('a syntax error scores 0 and reports the parser message', async () => {
  const tests = [{ label: 'x', expr: 'x', expect: 1, mistake: 'wrong' }];
  const graded = summarize(tests, await runJsTests('const x = ;', tests));
  assert.equal(graded.score, 0);
  assert.match(graded.mistakes[0], /could not run: SyntaxError/);
});

test('a runtime error at the top level fails every check', async () => {
  const tests = [
    { label: 'a', expr: 'a', expect: 1, mistake: 'a wrong' },
    { label: 'b', expr: 'b', expect: 2, mistake: 'b wrong' },
  ];
  const graded = summarize(tests, await runJsTests('const a = null.boom;', tests));
  assert.equal(graded.score, 0);
  assert.equal(graded.passed, 0);
  assert.match(graded.mistakes[0], /TypeError/);
});

test('each failed check reports its mistake and the actual value', async () => {
  const tests = [
    { label: 'doubles', expr: 'double(4)', expect: 8, mistake: 'double is wrong' },
    { label: 'adds', expr: 'add(1, 1)', expect: 2, mistake: 'add is wrong' },
  ];
  const code = 'function double(n) { return n * 3; }\nfunction add(a, b) { return a + b; }';
  const graded = summarize(tests, await runJsTests(code, tests));
  assert.equal(graded.score, 5);
  assert.equal(graded.passed, 1);
  assert.deepEqual(graded.mistakes, ['double is wrong (expected 8, got 12)']);
});

test('a missing function is reported as a ReferenceError for that check only', async () => {
  const tests = [
    { label: 'missing', expr: 'notDefined()', expect: 1, mistake: 'define it' },
    { label: 'present', expr: 'one', expect: 1, mistake: 'define one' },
  ];
  const graded = summarize(tests, await runJsTests('const one = 1;', tests));
  assert.equal(graded.score, 5);
  assert.match(graded.mistakes[0], /define it \(it threw ReferenceError/);
});

test('throws: true passes only when the expression throws', async () => {
  const tests = [
    { label: 'throws', expr: 'fail()', throws: true, mistake: 'should throw' },
    { label: 'does not throw', expr: 'ok()', throws: true, mistake: 'should throw' },
  ];
  const code = 'function fail() { throw new Error("no"); }\nfunction ok() { return 1; }';
  const outcome = await runJsTests(code, tests);
  assert.equal(outcome.results[0].pass, true);
  assert.equal(outcome.results[1].pass, false);
  assert.equal(outcome.results[1].detail, 'expected an error, got 1');
});

test('promises returned by an expression are awaited', async () => {
  const tests = [{ label: 'async', expr: 'later()', expect: 'done', mistake: 'wrong' }];
  const code = 'async function later() { return "done"; }';
  assert.equal(summarize(tests, await runJsTests(code, tests)).score, 10);
});

test('a top-level return is rejected with a clear message', async () => {
  const tests = [{ label: 'x', expr: 'x', expect: 1, mistake: 'wrong' }];
  const outcome = await runJsTests('return 5;', tests);
  assert.match(outcome.fatal, /top-level return/);
});

test('weights change how much each check contributes', async () => {
  const tests = [
    { label: 'heavy', expr: 'heavy', expect: 1, mistake: 'heavy wrong', weight: 3 },
    { label: 'light', expr: 'light', expect: 1, mistake: 'light wrong', weight: 1 },
  ];
  const graded = summarize(tests, await runJsTests('const heavy = 2; const light = 1;', tests));
  assert.equal(graded.score, 2.5);
});

test('deepEqual distinguishes arrays, objects and NaN', () => {
  assert.equal(deepEqual([1, [2]], [1, [2]]), true);
  assert.equal(deepEqual([1], { 0: 1 }), false);
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: undefined }), false);
  assert.equal(deepEqual(NaN, NaN), true);
  assert.equal(deepEqual(null, undefined), false);
});

test('describe produces readable values for feedback', () => {
  assert.equal(describe(undefined), 'undefined');
  assert.equal(describe('hi'), '"hi"');
  assert.equal(describe([1, 'a']), '[1,"a"]');
  assert.equal(describe(NaN), 'NaN');
});

test('formatScore shows whole numbers without decimals', () => {
  assert.equal(formatScore(8), '8/10');
  assert.equal(formatScore(7.5), '7.5/10');
});
