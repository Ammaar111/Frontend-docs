// Runs a learner's JavaScript against a list of test expressions.
//
// This module is deliberately pure: no DOM, no network, no timers.
// It runs inside a module Web Worker (js-worker.js) in the browser, and
// directly inside the Node test suite.
//
// A test is { label, expr, expect, throws?, mistake?, weight? }.
// `expr` is an expression evaluated AFTER the learner's code has run,
// so it can reference any top-level name the learner declared.

export async function runJsTests(code, tests) {
  let thunks;
  try {
    // The learner's code and one arrow function per test are compiled into
    // a single function body. Each thunk closes over the learner's bindings.
    const list = tests.map((test) => `() => (${test.expr})`).join(',\n');
    thunks = new Function(`${code}\n;return [${list}];`)();
  } catch (err) {
    return { fatal: describeError(err) };
  }

  if (!Array.isArray(thunks)) {
    return { fatal: 'a top-level return statement stopped your code early' };
  }

  const results = [];
  for (let i = 0; i < tests.length; i += 1) {
    results.push(await runOne(thunks[i], tests[i]));
  }
  return { results };
}

async function runOne(thunk, test) {
  let value;
  try {
    value = await thunk();
  } catch (err) {
    if (test.throws) return { pass: true, detail: '' };
    return { pass: false, detail: `it threw ${describeError(err)}` };
  }

  if (test.throws) {
    return { pass: false, detail: `expected an error, got ${describe(value)}` };
  }

  const pass = deepEqual(value, test.expect);
  return {
    pass,
    detail: pass ? '' : `expected ${describe(test.expect)}, got ${describe(value)}`,
  };
}

export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]),
  );
}

export function describe(value) {
  if (value === undefined) return 'undefined';
  if (typeof value === 'function') return 'a function';
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  if (typeof value === 'bigint' || typeof value === 'symbol') return String(value);
  try {
    const text = JSON.stringify(value);
    return text === undefined ? String(value) : text;
  } catch {
    return String(value);
  }
}

export function describeError(err) {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}
