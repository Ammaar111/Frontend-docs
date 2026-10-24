// Grades JavaScript in a worker thread with a time limit, like the browser.
import { Worker } from 'node:worker_threads';

const WORKER = new URL('./node-js-worker.js', import.meta.url);
export const TIME_LIMIT_MS = 4000;

export function runJsInWorker(code, checks, config = {}) {
  return new Promise((resolve) => {
    const worker = new Worker(WORKER, { workerData: { code, checks, config: { setup: config.setup } } });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ fatal: `it ran for more than ${TIME_LIMIT_MS / 1000} seconds` });
    }, TIME_LIMIT_MS);
    worker.once('message', (outcome) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(outcome);
    });
    worker.once('error', (err) => {
      clearTimeout(timer);
      resolve({ fatal: `the worker crashed: ${err.message}` });
    });
  });
}
