import foundations from './01-foundations.js';
import basics from './02-basics.js';
import controlFlow from './03-control-flow.js';
import functions from './04-functions.js';
import data from './05-data.js';
import internals from './06-internals.js';
import dom from './07-dom.js';
import formsStorage from './08-forms-storage.js';
import errors from './09-errors.js';
import asyncJs from './10-async.js';

export default {
  id: 'javascript',
  title: 'JavaScript',
  description: 'The language from zero: values, control flow, functions and closures, arrays and objects, the DOM, forms, storage, errors, async code, APIs and modern syntax.',
  modules: [foundations, basics, controlFlow, functions, data, internals, dom, formsStorage, errors, asyncJs],
};
