# Frontend Lab

A browser app that teaches JavaScript, HTML and CSS through lessons. Each lesson follows the same loop:

1. **Teach**: the concept, with a short explanation and common mistakes.
2. **Example**: working code to read.
3. **Task**: what to build.
4. **Your code**: write the answer in the editor.
5. **Evaluation**: a score out of 10, checked against the task.
6. **Mistakes made**: one line per failed check, saying what to fix.

Lesson content comes from the two courses in this repository: `md files/JAVASCRIPT_REACT_COMPLETE_COURSE.md` and `md files/HTML_CSS_COMPLETE_COURSE.md`. Each lesson names the part it draws on.

## Run it

The app loads its modules and its Web Worker from files, so it needs a web server. Opening `index.html` directly with `file://` will not work in Chrome.

```bash
cd app
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Tests

```bash
cd app
npm test                 # Node: sandbox, grading rules, every lesson is solvable
APP_URL=http://localhost:8000 node tests/e2e.cjs   # Browser: runs every solution through the UI
```

`npm test` needs nothing installed. The browser test needs Playwright and a running server.

## How grading works

**JavaScript lessons** run your code in a Web Worker, so the page stays responsive. Your code runs once, then each check is evaluated as an expression against your top-level names, for example `sumTo(5)` expecting `15`.

- A check passes when the value deep-equals `expect`. Use `throws: true` to require an error.
- A promise returned by a check is awaited.
- Code that runs longer than 2 seconds is stopped. The most likely cause is a loop that never ends.
- A syntax error, or an error at the top level of your code, means nothing could run: score 0, with the error shown as the mistake.

**HTML and CSS lessons** are parsed, never executed. Your HTML is read with `DOMParser`, so its scripts never run. Your CSS is read with `CSSStyleSheet`, which is never attached to the page. The checks compare declared values after a browser has normalized them, so `white` and `#fff` both pass.

**Score**: each check has a weight (default 1). Score = passed weight / total weight x 10, rounded to one decimal. A score of 7 or more counts as passed.

## Project layout

```
app/
  index.html           page shell
  styles.css           design tokens, light and dark themes, responsive layout
  js/
    main.js            page controller: sidebar, lesson view, history
    runner.js          chooses how to run each lesson, enforces the time limit
    js-worker.js       Web Worker entry point
    js-sandbox.js      runs learner JavaScript against checks (pure, testable)
    grading.js         score and mistake list (pure, testable)
    render.js          safe DOM helpers (textContent only, no innerHTML)
    storage.js         drafts and attempts in localStorage
  lessons/
    index.js           curriculum order, tracks, and "coming next" list
    javascript.js      JavaScript lessons
    html.js            HTML lessons
    css.js             CSS lessons
  tests/
    solutions.js       reference solution for every lesson
    sandbox.test.mjs   grading and sandbox behaviour
    lessons.test.mjs   curriculum structure, and every solution scores 10/10
    e2e.cjs            browser test
```

## Adding a lesson

Add an object to the right file in `lessons/`. Required fields:

```js
{
  id: 'js-example',              // unique, used in the URL hash
  track: 'javascript',           // 'javascript' | 'html' | 'css'
  module: 'Control flow',        // groups lessons in the sidebar
  title: 'Short title',
  source: 'JavaScript course, Part 2',
  runner: 'js',                  // 'js' | 'html' | 'css'
  teach: ['Paragraph.', { tip: '...' }, { warn: '...' }, { list: ['...'] }],
  example: { code: '...' },
  task: ['What to build.'],
  starter: '// starter code\n',
  tests: [
    // js: { label, expr, expect, mistake, weight? }   or   { label, expr, throws: true, mistake }
    // html/css: { label, check: ({ doc }) => boolean | ({ sheet }) => boolean, mistake }
  ],
}
```

Then add a reference solution to `tests/solutions.js`. `npm test` fails if a lesson has no solution, or if the starter already passes. Every check needs a `mistake` message that tells the learner what to fix.

## Scope and limits

- **Built**: 11 JavaScript lessons, 3 HTML lessons, 3 CSS lessons.
- **Not built yet**: DOM manipulation, events, storage, fetch, responsive Grid, accessibility, and React. The sidebar lists them under "Coming next".
- **JavaScript that touches the DOM** cannot be graded yet. Running learner code in the page needs a sandboxed iframe, and a tight loop in an iframe can freeze the tab. That needs more design before it is built.
- **HTML and CSS checks are static.** They read declared values, not computed layout. A check cannot tell whether a flex layout looks right, only that the declarations are there.
- **Grading is not a security boundary.** The sandbox guards against accidental infinite loops. It is not built to contain hostile code, and it doesn't need to be for a learner running their own code.
- **Progress is stored per browser** in localStorage. Clearing site data clears it.
