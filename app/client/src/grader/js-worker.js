// Web Worker entry point. The page posts { code, checks, config } and gets
// back { results } or { fatal }. Because this runs in a worker, the page
// stays responsive, and the page can terminate it if the code never ends.
import { runJsTests } from './js-sandbox.js';

self.addEventListener('message', async (event) => {
  const { code, checks, config } = event.data;
  self.postMessage(await runJsTests(code, checks, config));
});
