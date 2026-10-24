// The whole course, in order. Each track lists its modules; each module
// file exports { id, title, lessons }. The server seeds SQLite from this.
import html from './html/index.js';
import css from './css/index.js';
import javascript from './javascript/index.js';
import react from './react/index.js';

export const tracks = [html, css, javascript, react];
