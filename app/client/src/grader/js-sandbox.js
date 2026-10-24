// Runs a learner's JavaScript against a list of checks.
//
// Pure: no DOM, no network. It runs inside a module Web Worker in the
// browser (js-worker.js) and directly in the Node test suite.
//
// A check is { label, expr, expect, throws?, mistake, weight? }. `expr` is
// evaluated after the learner's code has run, in the same scope, so it can
// use any top-level name the learner declared. Inside `expr`:
//   __logs    everything the learner printed with console.log, one string per call
//   __source  the learner's code as text
import { deepEqual, describe, describeError, recordingConsole } from './values.js';
import { syntaxProblem } from './syntax.js';

const AsyncFunction = (async () => {}).constructor;
export const CHECK_LIMIT_MS = 1000;

// `uncaught` collects errors thrown later, inside timers or promise
// callbacks. The worker fills it from its global error handler, so a
// failed check can say what went wrong.
export async function runJsTests(code, checks, config = {}, { uncaught = [] } = {}) {
  const problem = syntaxProblem(code);
  if (problem) return { fatal: problem };

  const logs = [];
  const console = recordingConsole(logs);
  let thunks;
  try {
    // Lesson setup, then the learner's code, then one arrow function per
    // check. The arrows close over the learner's top-level bindings.
    const list = checks.map((check) => `() => (${check.expr})`).join(',\n');
    const body = `"use strict";\n${config.setup ?? ''}\n;${code}\n;return [${list}];`;
    thunks = await new AsyncFunction('console', '__logs', '__source', body)(console, logs, code);
  } catch (err) {
    return { fatal: describeError(err), logs };
  }

  if (!Array.isArray(thunks) || thunks.length !== checks.length) {
    return { fatal: 'a top-level return statement stopped your code before the checks could run', logs };
  }

  const results = [];
  for (let i = 0; i < checks.length; i += 1) {
    const before = uncaught.length;
    const result = await runOne(thunks[i], checks[i]);
    if (!result.pass && uncaught.length > before) {
      result.detail = `${result.detail ? `${result.detail}; ` : ''}your code threw ${uncaught[uncaught.length - 1]} in a callback`;
    }
    results.push(result);
  }
  return { results, logs };
}

function withTimeout(promise) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error(`it did not finish within ${CHECK_LIMIT_MS / 1000} second (a promise that never resolves?)`);
        err.name = 'Timeout';
        reject(err);
      }, CHECK_LIMIT_MS);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function runOne(thunk, check) {
  let value;
  try {
    value = await withTimeout(Promise.resolve().then(thunk));
  } catch (err) {
    if (err?.name === 'Timeout') return { pass: false, detail: err.message };
    if (check.throws) return { pass: true, detail: '' };
    return { pass: false, detail: `it threw ${describeError(err)}` };
  }

  if (check.throws) return { pass: false, detail: `expected an error, got ${describe(value)}` };

  const pass = deepEqual(value, check.expect);
  return { pass, detail: pass ? '' : `expected ${describe(check.expect)}, got ${describe(value)}` };
}
