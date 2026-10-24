// Comparing and describing values for feedback. Shared by the Web Worker,
// the sandbox iframe and the Node tests, so it must not touch the DOM.

export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]));
}

export function describe(value) {
  if (value === undefined) return 'undefined';
  if (typeof value === 'function') return value.name ? `the function ${value.name}` : 'a function';
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'symbol') return String(value);
  if (value instanceof Map) return `Map(${value.size}) ${describe(Object.fromEntries(value))}`;
  if (value instanceof Set) return `Set(${value.size}) ${describe([...value])}`;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === 'object' && value !== null && typeof value.then === 'function') return 'a Promise';
  try {
    const text = JSON.stringify(value, (key, inner) => (inner === undefined ? '__undefined__' : inner));
    if (text === undefined) return String(value);
    const clean = text.replaceAll('"__undefined__"', 'undefined');
    return clean.length > 300 ? `${clean.slice(0, 300)}…` : clean;
  } catch {
    return String(value);
  }
}

export function describeError(err) {
  if (err && typeof err === 'object' && 'name' in err && 'message' in err) return `${err.name}: ${err.message}`;
  return String(err);
}

// A console that records what the learner logs, so checks can read it.
export function recordingConsole(logs, passthrough) {
  const format = (args) => args.map((arg) => (typeof arg === 'string' ? arg : describe(arg))).join(' ');
  const record = (level) => (...args) => {
    logs.push(level === 'log' ? format(args) : `[${level}] ${format(args)}`);
    passthrough?.[level]?.(...args);
  };
  return {
    log: record('log'),
    info: record('info'),
    warn: record('warn'),
    error: record('error'),
    table: record('table'),
    debug: record('debug'),
    dir: record('dir'),
    group: () => {},
    groupEnd: () => {},
    time: () => {},
    timeEnd: () => {},
    count: record('count'),
    assert: (condition, ...args) => {
      if (!condition) logs.push(`[assert] ${format(args)}`);
    },
    clear: () => {},
  };
}
