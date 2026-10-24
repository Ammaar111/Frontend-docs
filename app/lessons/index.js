// Single source of truth for the curriculum. Lessons appear in this order.
import { javascriptLessons } from './javascript.js';
import { htmlLessons } from './html.js';
import { cssLessons } from './css.js';

export const tracks = [
  { id: 'javascript', title: 'JavaScript' },
  { id: 'html', title: 'HTML' },
  { id: 'css', title: 'CSS' },
];

export const lessons = [...javascriptLessons, ...htmlLessons, ...cssLessons];

// Shown greyed out in the sidebar. These are not built yet.
export const upcoming = [
  'DOM manipulation',
  'Events and forms in JavaScript',
  'Browser storage',
  'Fetch and APIs',
  'Responsive layouts and Grid',
  'Accessibility',
  'React',
];
