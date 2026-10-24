// The JavaScript sandbox, the grading rules and the loop guard, independent of any lesson.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runJsTests } from '../client/src/grader/js-sandbox.js';
import { summarize, formatScore } from '../client/src/grader/grading.js';
import { deepEqual, describe } from '../client/src/grader/values.js';
import { addLoopGuard, createGuard } from '../client/src/sandbox/loop-guard.js';

const grade = async (code, checks, config) => summarize(checks, await runJsTests(code, checks, config));

test('a passing run scores 10 and lists no mistakes', async () => {
  const checks = [{ label: 'two plus two', expr: 'add(2, 2)', expect: 4, mistake: 'wrong' }];
  const graded = await grade('function add(a, b) { return a + b; }', checks);
  assert.equal(graded.score, 10);
  assert.deepEqual(graded.mistakes, []);
});

test('a syntax error scores 0 and gives the line and column', async () => {
  const checks = [{ label: 'x', expr: 'x', expect: 1, mistake: 'wrong' }];
  const graded = await grade('const a = 1;\nconst x = ;', checks);
  assert.equal(graded.score, 0);
  assert.match(graded.mistakes[0], /could not run: SyntaxError: Unexpected token \(line 2, column 11\)/);
});

test('a runtime error at the top level fails every check', async () => {
  const checks = [
    { label: 'a', expr: 'a', expect: 1, mistake: 'a wrong' },
    { label: 'b', expr: 'b', expect: 2, mistake: 'b wrong' },
  ];
  const graded = await grade('const a = null.boom;', checks);
  assert.equal(graded.score, 0);
  assert.equal(graded.passed, 0);
  assert.match(graded.mistakes[0], /TypeError/);
});

test('each failed check reports its mistake and the actual value', async () => {
  const checks = [
    { label: 'doubles', expr: 'double(4)', expect: 8, mistake: 'double is wrong' },
    { label: 'adds', expr: 'add(1, 1)', expect: 2, mistake: 'add is wrong' },
  ];
  const graded = await grade('function double(n) { return n * 3; }\nfunction add(a, b) { return a + b; }', checks);
  assert.equal(graded.score, 5);
  assert.deepEqual(graded.mistakes, ['double is wrong (expected 8, got 12)']);
});

test('a missing function is a ReferenceError for that check only', async () => {
  const checks = [
    { label: 'missing', expr: 'notDefined()', expect: 1, mistake: 'define it' },
    { label: 'present', expr: 'one', expect: 1, mistake: 'define one' },
  ];
  const graded = await grade('const one = 1;', checks);
  assert.equal(graded.score, 5);
  assert.match(graded.mistakes[0], /define it \(it threw ReferenceError/);
});

test('throws: true passes only when the expression throws', async () => {
  const checks = [
    { label: 'throws', expr: 'fail()', throws: true, mistake: 'should throw' },
    { label: 'does not throw', expr: 'ok()', throws: true, mistake: 'should throw' },
  ];
  const outcome = await runJsTests('function fail() { throw new Error("no"); }\nfunction ok() { return 1; }', checks);
  assert.equal(outcome.results[0].pass, true);
  assert.equal(outcome.results[1].pass, false);
  assert.equal(outcome.results[1].detail, 'expected an error, got 1');
});

test('promises returned by a check are awaited, and top-level await works', async () => {
  const checks = [
    { label: 'async', expr: 'later()', expect: 'done', mistake: 'wrong' },
    { label: 'awaited', expr: 'value', expect: 3, mistake: 'wrong' },
  ];
  const graded = await grade('async function later() { return "done"; }\nconst value = await Promise.resolve(3);', checks);
  assert.equal(graded.score, 10);
});

test('console.log output is captured in __logs, and __source holds the code', async () => {
  const checks = [
    { label: 'logs', expr: '__logs', expect: ['hi 2', '[1,2]'], mistake: 'wrong' },
    { label: 'source', expr: '__source.includes("console")', expect: true, mistake: 'wrong' },
  ];
  const graded = await grade('console.log("hi", 2);\nconsole.log([1, 2]);', checks);
  assert.equal(graded.score, 10);
});

test('lesson setup runs before the learner code, in the same scope', async () => {
  const checks = [{ label: 'uses setup', expr: 'total', expect: 15, mistake: 'wrong' }];
  const graded = await grade('const total = base + 5;', checks, { setup: 'const base = 10;' });
  assert.equal(graded.score, 10);
});

test('code runs in strict mode, like a module', async () => {
  const checks = [{ label: 'x', expr: '1', expect: 1, mistake: 'wrong' }];
  const graded = await grade('undeclared = 5;', checks);
  assert.match(graded.mistakes[0], /ReferenceError/);
});

test('a top-level return is rejected with a clear message', async () => {
  const outcome = await runJsTests('return 5;', [{ label: 'x', expr: 'x', expect: 1, mistake: 'wrong' }]);
  assert.match(outcome.fatal, /top-level return/);
});

test('weights change how much each check contributes', async () => {
  const checks = [
    { label: 'heavy', expr: 'heavy', expect: 1, mistake: 'heavy wrong', weight: 3 },
    { label: 'light', expr: 'light', expect: 1, mistake: 'light wrong', weight: 1 },
  ];
  assert.equal((await grade('const heavy = 2; const light = 1;', checks)).score, 2.5);
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
  assert.equal(describe([1, 'a', undefined]), '[1,"a",undefined]');
  assert.equal(describe(NaN), 'NaN');
  assert.equal(describe(new Map([['a', 1]])), 'Map(1) {"a":1}');
  assert.equal(describe(new Set([1, 2])), 'Set(2) [1,2]');
});

test('formatScore shows whole numbers without decimals', () => {
  assert.equal(formatScore(8), '8/10');
  assert.equal(formatScore(7.5), '7.5/10');
});

test('the loop guard instruments every kind of loop', () => {
  const code = 'for (let i = 0; i < 3; i++) x();\nwhile (a) { b(); }\ndo c(); while (d);\nfor (const k in o) for (const v of k) e();';
  const out = addLoopGuard(code);
  assert.equal(out.match(/__guard\(\)/g).length, 5);
  assert.match(out, /for \(let i = 0; i < 3; i\+\+\) \{__guard\(\);x\(\);\}/);
  assert.match(out, /while \(a\) \{__guard\(\); b\(\); \}/);
  // The result is still valid JavaScript.
  assert.doesNotThrow(() => new Function('__guard', 'x', 'a', 'b', 'c', 'd', 'e', 'o', out));
});

test('the loop guard stops an infinite loop, and stays tripped', () => {
  const guard = createGuard(50);
  const run = new Function('__guard', addLoopGuard('let n = 0; while (true) { try { n++; } catch {} }'));
  guard.arm();
  assert.throws(() => run(guard), /loop ran for more than/);
  assert.throws(() => guard(), /loop ran for more than/);
});
