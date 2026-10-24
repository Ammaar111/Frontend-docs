// Shared machinery for the sandbox iframe: compiling the learner's program,
// browser stand-ins the opaque origin does not allow, interaction helpers
// for checks, and the check runner.
import { addLoopGuard, createGuard } from './loop-guard.js';
import { compileCheck } from '../grader/compile.js';
import { syntaxProblem } from '../grader/syntax.js';
import { describeError, recordingConsole } from '../grader/values.js';
import { helpers } from '../grader/helpers.js';

const AsyncFunction = (async () => {}).constructor;
export const LOOP_LIMIT_MS = 2000;
const CHECK_LIMIT_MS = 3000;

export class LearnerSyntaxError extends Error {}

// Compiles plain JavaScript into a runnable program. `prelude` names are in
// scope for the learner's code (and can be shadowed by it). `setup` is
// trusted lesson code that runs first. The program resolves to an object
// holding the `expose` names, so checks can call the learner's functions.
export function compileProgram(code, { prelude = {}, setup = '', expose = [], checkSyntax = true } = {}) {
  if (checkSyntax) {
    const problem = syntaxProblem(code);
    if (problem) throw new LearnerSyntaxError(problem);
  }
  const guarded = addLoopGuard(code);
  const names = Object.keys(prelude);
  const exposed = expose
    .map((name) => `${JSON.stringify(name)}: typeof ${name} === "undefined" ? undefined : ${name}`)
    .join(', ');
  const body = `"use strict";\n${setup}\n;return async function () {\n${guarded}\n;return { ${exposed} };\n};`;
  const outer = new Function('__guard', ...names, body);
  return (guard) => outer(guard, ...names.map((name) => prelude[name]))();
}

export function newGuard() {
  return createGuard(LOOP_LIMIT_MS);
}

export const settle = async () => {
  for (let i = 0; i < 3; i += 1) await new Promise((resolve) => setTimeout(resolve, 0));
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Browser features the opaque origin blocks, replaced with in-memory versions.

class MemoryStorage {
  #data = new Map();
  get length() {
    return this.#data.size;
  }
  key(index) {
    return [...this.#data.keys()][index] ?? null;
  }
  getItem(key) {
    return this.#data.has(String(key)) ? this.#data.get(String(key)) : null;
  }
  setItem(key, value) {
    this.#data.set(String(key), String(value));
  }
  removeItem(key) {
    this.#data.delete(String(key));
  }
  clear() {
    this.#data.clear();
  }
}

export function installEnvironment(state) {
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(window, name, { value: new MemoryStorage(), configurable: true });
  }
  window.alert = (message) => state.alerts.push(String(message));
  window.confirm = (message) => {
    state.alerts.push(String(message));
    return state.confirmAnswer;
  };
  window.prompt = (message, fallback = '') => {
    state.alerts.push(String(message));
    return state.promptAnswer ?? fallback;
  };

  // Record form submissions and link clicks, then stop them, so a missing
  // preventDefault() cannot navigate the sandbox away mid-check.
  window.addEventListener('submit', (event) => {
    state.submits.push({ prevented: event.defaultPrevented, form: event.target });
    event.preventDefault();
  });
  window.addEventListener('click', (event) => {
    const link = event.target?.closest?.('a[href]');
    if (link && !event.defaultPrevented) {
      state.navigations.push(link.getAttribute('href'));
      event.preventDefault();
    }
  });
  window.addEventListener('error', (event) => state.errors.push(describeError(event.error ?? event.message)));
  window.addEventListener('unhandledrejection', (event) => state.errors.push(describeError(event.reason)));
}

export function createState() {
  const logs = [];
  return {
    logs,
    console: recordingConsole(logs),
    alerts: [],
    submits: [],
    navigations: [],
    errors: [],
    confirmAnswer: true,
    promptAnswer: null,
  };
}

export function addStyle(css, id) {
  const style = document.createElement('style');
  style.dataset.source = id;
  style.textContent = css;
  document.head.append(style);
  return style;
}

// --- Helpers that checks receive.

export function domHelpers(scope = () => document) {
  const find = (target) => {
    if (typeof target !== 'string') {
      if (!target) throw new Error('the element the check needs was not found');
      return target;
    }
    const node = scope().querySelector(target);
    if (!node) throw new Error(`no element matches "${target}"`);
    return node;
  };
  const valueSetter = (node) => {
    const proto =
      node instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : node instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
    return Object.getOwnPropertyDescriptor(proto, 'value').set;
  };
  const text = (target) => {
    if (target === undefined) return helpers.text(scope());
    const node = typeof target === 'string' ? scope().querySelector(target) : target;
    return helpers.text(node);
  };

  return {
    $: (selector) => scope().querySelector(selector),
    $$: (selector) => [...scope().querySelectorAll(selector)],
    text,
    find,
    async click(target) {
      find(target).click();
      await settle();
    },
    async type(target, value) {
      const node = find(target);
      node.focus?.();
      valueSetter(node).call(node, value);
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
      await settle();
    },
    async select(target, value) {
      const node = find(target);
      valueSetter(node).call(node, value);
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
      await settle();
    },
    async check(target, checked = true) {
      const node = find(target);
      if (node.checked !== checked) node.click();
      await settle();
    },
    async submit(target) {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      find(target).dispatchEvent(event);
      await settle();
      return event;
    },
    async press(target, key, init = {}) {
      const node = find(target);
      node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
      node.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true, ...init }));
      await settle();
    },
    async fire(target, type, init = {}) {
      const event = new Event(type, { bubbles: true, cancelable: true, ...init });
      find(target).dispatchEvent(event);
      await settle();
      return event;
    },
    async wait(ms = 0) {
      await sleep(ms);
      await settle();
    },
    async waitFor(predicate, timeout = 1500) {
      const end = performance.now() + timeout;
      for (;;) {
        let value;
        try {
          value = await predicate();
        } catch {
          value = false;
        }
        if (value) return value;
        if (performance.now() > end) return false;
        await sleep(20);
      }
    },
    settle,
    style: (target, prop) => getComputedStyle(find(target)).getPropertyValue(prop).trim(),
    rect: (target) => find(target).getBoundingClientRect(),
    h: helpers,
  };
}

function withTimeout(promise, ms) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`the check waited more than ${ms / 1000} seconds for your code`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

// Runs each check in order. `prepare()` returns the context for the next
// check (React lessons mount a fresh component each time).
export async function runChecks(checks, prepare, { guard, state, crashed = () => null }) {
  const results = [];
  for (const check of checks) {
    const errorsBefore = state.errors.length;
    let result;
    try {
      const fn = compileCheck(check.check);
      guard.arm();
      const ctx = await prepare();
      const value = await withTimeout(Promise.resolve(fn(ctx)), CHECK_LIMIT_MS);
      result = value === true ? { pass: true, detail: '' } : { pass: false, detail: typeof value === 'string' ? value : '' };
    } catch (err) {
      result = { pass: false, detail: guard.tripped() ? describeError(guard.tripped()) : describeError(err) };
    }

    const crash = crashed();
    if (crash) result = { pass: false, detail: `your component crashed: ${describeError(crash)}` };
    else if (!result.pass && !result.detail && state.errors.length > errorsBefore) {
      result.detail = `your code threw ${state.errors[state.errors.length - 1]}`;
    }
    results.push(result);
  }
  return results;
}

export function describeFatal(err, guard) {
  if (guard?.tripped()) return describeError(guard.tripped());
  if (err instanceof LearnerSyntaxError) return err.message;
  return describeError(err);
}
