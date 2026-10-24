# Frontend Lab

A local web app that teaches front-end development from scratch: HTML, CSS, JavaScript and React. The content comes from the four course documents in `../md files/`. Every lesson follows the same five steps:

1. **Teach**: the concept, its mechanism and the common misconceptions.
2. **Example**: a short, runnable example.
3. **Task**: what to build.
4. **Your code**: an editor with the starter code (or the quiz questions).
5. **Evaluation**: a score out of 10 and a "Mistakes made" list, one line per failed check, with the specific detail of what was found.

The content totals 249 lessons:

| Track | Modules | Lessons | Graded by |
|---|---|---|---|
| HTML | 5 | 25 | parsed documents and live pages |
| CSS | 18 | 74 | computed styles and layout boxes in a live page, at several viewport widths |
| JavaScript | 15 | 80 | running the code in a worker, and live DOM pages for the browser lessons |
| React | 14 | 70 | mounting the learner's components and interacting with them |

Each track ends with projects, a capstone built in stages, and a final assessment.

## Running it

Node 20.19 or newer. The app uses SQLite through `better-sqlite3`, a native module that `npm install` builds or downloads automatically.

```bash
cd app
npm install
npm run build      # builds the React client into client/dist
npm start          # http://127.0.0.1:3000
```

For development, `npm run dev` runs the API with file watching and the Vite dev server together. Vite proxies `/api` to the API.

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `HOST` | `127.0.0.1` | interface to bind to |
| `DB_FILE` | `data/frontend-lab.db` | SQLite database file |

On every start the server re-seeds the course tables from `content/`. Your progress, drafts and attempt history are stored in separate tables and are kept across re-seeds and content edits.

## Using it

- **Ctrl/⌘ + Enter** runs and grades your code. The editor saves a draft as you type.
- A lesson counts as **passed** at 7/10. The reference solution unlocks after you pass, or after 3 attempts.
- HTML and CSS lessons show a **live preview** of your page below the editor.
- **Progress** shows your best score per lesson; **Search** searches every lesson's text.
- The last 20 attempts per lesson are kept, and any of them can be loaded back into the editor.
- The theme button cycles through system, light and dark.

## Architecture

```
app/
├── content/            the course, as JavaScript modules
│   ├── index.js        track order
│   ├── html/ css/ javascript/ react/
│   │   ├── index.js    module order for the track
│   │   └── NN-*.js     one module: { id, title, lessons: [...] }
│   ├── shared/         mock fetch API and in-memory shop server used by lesson setups
│   └── assets/         images, stored in SQLite as BLOBs at seed time
├── server/             Express 5 + better-sqlite3
│   ├── migrations/     schema (course tables, assets, users, drafts, attempts, progress)
│   ├── content.js      loading and validating content/
│   ├── seed.js         content → SQLite (check functions stored as source text)
│   └── app.js          REST API, and the built client
├── client/             React 19 + React Router 7, built with Vite (two entry pages)
│   ├── index.html      the app
│   ├── sandbox.html    the page that runs learner code
│   └── src/
│       ├── pages/ components/ context/ hooks/
│       ├── grader/     runs a lesson's checks and turns the results into a score
│       └── sandbox/    the code that runs inside the sandbox frame
└── tests/              Node test suites plus a browser end-to-end run
```

### The API

| Method and path | Purpose |
|---|---|
| `GET /api/tracks` | tracks, modules, lesson titles and your progress |
| `GET /api/lessons/:id` | one lesson, without its solution or quiz answers |
| `PUT` / `DELETE /api/lessons/:id/draft` | save or discard a draft |
| `GET` / `POST /api/lessons/:id/attempts` | attempt history, record an attempt |
| `GET /api/lessons/:id/solution` | the solution, once unlocked (403 before) |
| `GET /api/progress`, `GET /api/search?q=` | the progress overview and search |
| `GET /api/assets/:name` | an image from the database |

### Grading

Code runs in the browser and never on the server.

| Runner | Where the code runs | What checks see |
|---|---|---|
| `js` | a Web Worker with a loop guard | values of expressions after your code ran, `console` output, your source |
| `html` | parsed with `DOMParser`, not rendered | the document |
| `css` | parsed into a `CSSStyleSheet` | the declared rules |
| `page` | a sandboxed iframe: the lesson's fixture page plus your JavaScript, CSS or whole HTML document | the live DOM, computed styles, layout boxes, events, `alert`/`confirm`/`prompt`, storage |
| `react` | the same iframe; JSX compiled with Sucrase, routers swapped for `MemoryRouter` | a fresh mount of your component for every check, plus render, click and type helpers |
| `quiz` | the server | your answers (the correct answers never reach the browser) |

The sandbox iframe has `sandbox="allow-scripts allow-forms"` and no `allow-same-origin`, so its origin is opaque. Learner code cannot read the app's page, storage or cookies. Loops are instrumented, and a run that takes more than 8 seconds is stopped. Each check has its own 3-second limit.

Responsive lessons call `atWidth(px)`. The sandbox asks the parent page to resize the frame, so media queries and `vw` units really respond, and the frame goes back to its normal width after every check.

The score is the weighted share of passed checks, out of 10 to one decimal. Each failed check adds its `mistake` text, plus the detail the check returned, to "Mistakes made".

## Adding a lesson

Add an object to a module file's `lessons` list. If you add a module, register it in the track's `index.js`. The server validates the whole course at start-up and refuses to start with a list of problems if anything is wrong.

```js
{
  id: 'css-example',                 // unique across the course: a-z, 0-9, dashes
  title: 'Centring with Grid',
  source: 'HTML & CSS course, Part 25',
  runner: 'page',
  slot: 'css',                       // page lessons: 'js', 'css' or 'html'
  fixture: { html: '<div class="box"><p>Hi</p></div>', css: '.box { height: 200px; }' },
  teach: ['Text with **bold** and `code`.', { h: 'A heading' }, { code: '...', lang: 'css' }],
  example: [{ code: '.box { display: grid; place-items: center; }', lang: 'css' }],
  task: [{ ol: ['Centre the paragraph inside `.box`.'] }],
  starter: '.box {\n\n}\n',
  solution: '.box {\n  display: grid;\n  place-items: center;\n}\n',
  checks: [
    {
      label: 'centred',
      mistake: '.box { display: grid; place-items: center; }',
      check: ({ rect }) => {
        const box = rect('.box');
        const p = rect('.box p');
        const off = Math.abs(box.top + box.height / 2 - (p.top + p.height / 2));
        return off < 1 || `the paragraph is ${Math.round(off)}px off centre`;
      },
    },
    // ...at least three checks per code lesson; quizzes need at least three questions
  ],
}
```

Block types for teach, example and task: a plain string (paragraph with inline markdown), `{ h }`, `{ list }`, `{ ol }`, `{ code, lang }`, `{ output }`, `{ table: { head, rows } }`, `{ tip }`, `{ warn }`, `{ note }`, and `{ img, alt }` for a file in `content/assets`.

Rules for check functions:

- They are stored with `fn.toString()` and rebuilt in the sandbox. A check **cannot use anything from the module's scope**: no helper functions or constants defined outside the check. Inline whatever it needs.
- A check must return exactly `true` to pass. Returning a string fails the check and shows that string as the detail. Any other value fails, including a truthy DOM element, so wrap element lookups in `Boolean(...)`.
- `js` checks are `{ expr, expect }` (or `throws: true`) instead of functions.
- Checks that change the page (resizing, toggling classes, setting custom properties) must put it back, because page lessons share one page across checks. React lessons get a fresh mount per check.

Then run the end-to-end test for the new lesson (below). It confirms the solution scores 10 and the starter scores below 10.

## Tests

```bash
npm test                        # validation, seeding, API, grading and sandbox tests
npm run build
npm start &                     # or: DB_FILE=/tmp/e2e.db PORT=3100 npm start &
APP_URL=http://127.0.0.1:3000 npm run test:e2e
ONLY="css-grid,css-flex" APP_URL=... npm run test:e2e   # lessons whose id starts with these prefixes
```

The end-to-end run uses Playwright with Chromium. It opens every lesson through the real UI, types the solution into the editor and expects 10/10, then types the starter and expects less than 10. Full runs also cover the loop guard, Ctrl+Enter and draft saving.

## Corrections to the source course

The lessons follow the course documents, but some of the course's code is wrong. Each such lesson teaches the problem explicitly instead of copying it. The main ones:

- **JavaScript**: the `apiRequest` helper sets headers in an order that lets callers overwrite `Content-Type`; an `AbortController` example never forwards the signal to `fetch` (and one "fix" never calls `abort`); a date-only string parsed as UTC makes the TaskFlow "overdue" check wrong in Indian time; `analyzeText` miscounts vowels.
- **React capstone**: rolling back an optimistic update by calling the transition function again throws, because the reverse transition is not allowed.
- **HTML/CSS**: `hidden` on a menu styled `display: flex` never hides it; a `translateY` "lift" on the popular pricing card breaks the course's own button-alignment requirement; the capstone's dark mode leaves "Add to cart" and the current page link as white text on a near-white background; the final challenge's reference page uses an undefined `.visually-hidden` class, has no `<main>` and a 3.5:1 badge; the final assessment's answers on margin collapsing, `flex: 1 1 0` and cascade order are incomplete or wrong; `clip: rect()` is deprecated in favour of `clip-path: inset(50%)`.

## Limits

- **One learner per database.** There are no accounts. Run one copy per person, or point `DB_FILE` at a different file for each.
- **Code grading is trusted to the browser.** The server checks that an attempt report is well-formed but cannot re-run it, so someone who wants to can submit a fake score through the API. That is acceptable for self-study and wrong for exams. Quizzes are graded on the server.
- **Some things cannot be rendered in the sandbox.** `prefers-color-scheme`, `prefers-reduced-motion`, `hover`/`pointer` and `@media print` cannot be switched on inside the frame. Those checks inspect your rules (and theme toggles through `data-theme`) rather than a rendered result.
- **Checks verify behaviour, not taste.** A lesson can confirm that a layout has three columns at 1024px and readable contrast. It cannot tell you whether the design is good. The project lessons' teach sections cover the judgement calls.
- **Chromium only for the end-to-end tests.** The app itself runs in any current browser, but the expected pixel values in the CSS checks were verified in Chromium. Firefox and Safari can round some layouts differently by a pixel, and most checks allow for that.
