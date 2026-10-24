// Entry point of the sandbox iframe (sandbox.html). It runs one job, posts
// the outcome to the parent page, and is then thrown away.
import { runPageJob } from './page.js';
import { runReactJob } from './react.js';
import { describeError } from '../grader/values.js';

let started = false;

window.addEventListener('message', async (event) => {
  if (event.source !== window.parent || event.data?.type !== 'run' || started) return;
  started = true;
  const { job } = event.data;
  let outcome;
  try {
    outcome = job.runner === 'react' ? await runReactJob(job) : await runPageJob(job);
  } catch (err) {
    outcome = { fatal: `the sandbox failed: ${describeError(err)}` };
  }
  window.parent.postMessage({ type: 'result', outcome: JSON.parse(JSON.stringify(outcome)) }, '*');
});

window.parent.postMessage({ type: 'ready' }, '*');
