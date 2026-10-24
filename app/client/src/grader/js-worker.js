// Web Worker entry point. The page posts { code, checks, config } and gets
// back { results } or { fatal }. Because this runs in a worker, the page
// stays responsive, and the page can terminate it if the code never ends.
import { runJsTests } from './js-sandbox.js';
import { describeError } from './values.js';

// Errors thrown later (inside setTimeout, or a rejected promise nobody
// handles) are recorded instead of crashing the worker.
const uncaught = [];
self.addEventListener('error', (event) => {
  event.preventDefault();
  uncaught.push(describeError(event.error ?? event.message));
});
self.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  uncaught.push(describeError(event.reason));
});

self.addEventListener('message', async (event) => {
  const { code, checks, config } = event.data;
  self.postMessage(await runJsTests(code, checks, config, { uncaught }));
});
