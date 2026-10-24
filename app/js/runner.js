// Main-thread side of grading. Chooses how to run a lesson's code:
//   - JavaScript lessons run in a Web Worker with a time limit.
//   - HTML and CSS lessons are parsed, never executed. A DOMParser document
//     is inert (its scripts never run), and a CSSStyleSheet that is never
//     attached to the page has no effect on it.

import { summarize } from './grading.js';
import { describeError } from './js-sandbox.js';

export const TIME_LIMIT_MS = 2000;

export async function gradeLesson(lesson, code) {
  const outcome =
    lesson.runner === 'js'
      ? await runInWorker(code, lesson.tests)
      : checkMarkup(lesson, code);
  return summarize(lesson.tests, outcome);
}

function runInWorker(code, tests) {
  return new Promise((resolve) => {
    let worker;
    try {
      worker = new Worker(new URL('./js-worker.js', import.meta.url), { type: 'module' });
    } catch (err) {
      resolve({ fatal: `the browser could not start a sandbox (${describeError(err)})` });
      return;
    }

    const finish = (outcome) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(outcome);
    };

    const timer = setTimeout(() => {
      finish({
        fatal: `it ran for more than ${TIME_LIMIT_MS / 1000} seconds. Look for a loop whose condition never becomes false.`,
      });
    }, TIME_LIMIT_MS);

    worker.addEventListener('message', (event) => finish(event.data));
    worker.addEventListener('error', (event) => {
      finish({ fatal: event.message || 'the sandbox crashed' });
    });
    worker.postMessage({ code, tests });
  });
}

function checkMarkup(lesson, code) {
  let ctx;
  try {
    ctx = lesson.runner === 'css' ? { sheet: parseCss(code) } : { doc: parseHtml(code) };
  } catch (err) {
    return { fatal: `your ${lesson.runner.toUpperCase()} could not be read (${describeError(err)})` };
  }
  return { results: lesson.tests.map((test) => runCheck(test, ctx)) };
}

function parseHtml(code) {
  return new DOMParser().parseFromString(code, 'text/html');
}

function parseCss(code) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(code);
  return sheet;
}

function runCheck(test, ctx) {
  try {
    return { pass: test.check(ctx) === true, detail: '' };
  } catch (err) {
    return { pass: false, detail: describeError(err) };
  }
}
