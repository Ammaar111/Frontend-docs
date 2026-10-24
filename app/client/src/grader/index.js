// Grades one attempt in the browser. Quizzes are graded by the server.
import { summarize } from './grading.js';
import { checkMarkup } from './markup.js';
import { runInFrame } from './frame.js';
import { describeError } from './values.js';

export const JS_TIME_LIMIT_MS = 4000;

export async function gradeLesson(lesson, code) {
  let outcome;
  switch (lesson.runner) {
    case 'js':
      outcome = await runInWorker(code, lesson.checks, lesson.config);
      break;
    case 'html':
    case 'css':
      outcome = checkMarkup(lesson, code);
      break;
    case 'page':
    case 'react':
      outcome = await runInFrame({ runner: lesson.runner, code, checks: lesson.checks, config: lesson.config });
      break;
    default:
      throw new Error(`Lesson ${lesson.id} cannot be graded in the browser (runner ${lesson.runner})`);
  }
  return summarize(lesson.checks, outcome);
}

function runInWorker(code, checks, config) {
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
        fatal: `it ran for more than ${JS_TIME_LIMIT_MS / 1000} seconds. Look for a loop whose condition never becomes false, or a promise that never settles.`,
      });
    }, JS_TIME_LIMIT_MS);

    worker.addEventListener('message', (event) => finish(event.data));
    worker.addEventListener('error', (event) => finish({ fatal: event.message || 'the sandbox crashed' }));
    worker.postMessage({ code, checks, config });
  });
}
