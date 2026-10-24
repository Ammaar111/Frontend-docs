// Node equivalent of client/src/grader/js-worker.js: runs one lesson in its
// own thread, so errors the learner's code throws later (in timers, or
// rejected promises nobody handles) are recorded instead of leaking into
// the test runner.
import { parentPort, workerData } from 'node:worker_threads';
import { runJsTests } from '../../client/src/grader/js-sandbox.js';
import { describeError } from '../../client/src/grader/values.js';

const uncaught = [];
process.on('uncaughtException', (err) => uncaught.push(describeError(err)));
process.on('unhandledRejection', (err) => uncaught.push(describeError(err)));

const { code, checks, config } = workerData;
parentPort.postMessage(await runJsTests(code, checks, config, { uncaught }));
