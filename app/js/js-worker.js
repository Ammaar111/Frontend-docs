// Module Web Worker entry point. The main thread posts { code, tests }
// and gets back { results } or { fatal }. Because this runs in a worker,
// the main page stays responsive, and the main thread can terminate it
// if the learner's code loops forever.

import { runJsTests } from './js-sandbox.js';

self.addEventListener('message', async (event) => {
  const { code, tests } = event.data;
  self.postMessage(await runJsTests(code, tests));
});
