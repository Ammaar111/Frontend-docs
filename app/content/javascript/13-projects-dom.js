// JavaScript & React course, project catalogue Tier 1 (projects 1–8) and Tier 2 (projects 11–15).
export default {
  id: 'js-projects-dom',
  title: 'Projects: logic and the DOM',
  lessons: [
    {
      id: 'proj-logic-basics',
      title: 'Project pack: counter, guessing game, calculator, converter',
      source: 'JavaScript & React course, projects 1–4',
      runner: 'js',
      teach: [
        'Projects combine concepts. Every project has the same shape: **requirements** stated precisely, the **concepts** it exercises, and edge cases that decide whether it really works. Read the spec twice before typing.',
        { h: 'Counter (closures)' },
        'A plain top-level `let count` works, but any code in that scope can set it to `-500`. A closure keeps `count` private: the only way to change it is through the returned methods, which enforce the rules.',
        { h: 'Guessing game (control flow)' },
        '`Math.random()` returns `[0, 1)`. `Math.random() * 100` is `[0, 100)`, `Math.floor` gives 0–99, `+ 1` gives 1–100 inclusive. Accept the target as a parameter with a random **default** so the function stays testable.',
        { code: 'function randomTarget() {\n  return Math.floor(Math.random() * 100) + 1;\n}\n\nfunction playGuessingGame(guesses, target = randomTarget()) {\n  for (let i = 0; i < guesses.length; i++) {\n    // compare, log, return early when correct\n  }\n}', lang: 'js' },
        { h: 'Calculator (switch + custom errors)' },
        'A `switch` on the operator is clearer than an `if` chain. Division by zero and unknown operators must **throw** a custom `CalculatorError`, so callers can tell expected problems (`instanceof CalculatorError`) from real bugs, and `undefined` never leaks out silently.',
        { h: 'Temperature converter (validation)' },
        '`typeof NaN === "number"`, so a type check alone lets `NaN` through: also check `Number.isNaN`. `toFixed(1)` returns a **string**; wrap it in `Number(...)`.',
      ],
      example: [
        { code: 'class CalculatorError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = "CalculatorError";\n  }\n}\n\ntry {\n  calculate(10, "/", 0);\n} catch (error) {\n  if (error instanceof CalculatorError) console.error(`Calculator error: ${error.message}`);\n  else throw error;\n}', lang: 'js' },
      ],
      task: [
        { ol: ['`createCounter()` → `{ increment, decrement, reset }` with a private count from 0. After each change log `Count: N`; decrementing at 0 logs `Cannot decrement below 0.` and changes nothing.', '`randomTarget()` → 1–100. `playGuessingGame(guesses, target = randomTarget())` logs `Guess N (G): too low.` / `too high.` and `Correct! You found it in N attempt(s).`, or `Out of guesses! The number was T.`; it returns `{ found, attempts }`.', '`CalculatorError` and `calculate(a, operator, b)` for `+ - * /`; `"Division by zero is not allowed."` and `Unknown operator: "%"` (with the operator) are thrown as `CalculatorError`s.', '`celsiusToFahrenheit(c)` and `fahrenheitToCelsius(f)` round to 1 decimal (numbers) and throw on anything that is not a real number.'] },
      ],
      starter: `let count = 0;

function createCounter() {
  return {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    reset() {
      count = 0;
    },
  };
}

function calculate(a, operator, b) {
  if (operator === "+") return a + b;
  if (operator === "-") return a - b;
  if (operator === "*") return a * b;
  if (operator === "/") return a / b;
}

function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}
`,
      solution: `function createCounter() {
  let count = 0;
  return {
    increment() {
      count++;
      console.log(\`Count: \${count}\`);
    },
    decrement() {
      if (count === 0) {
        console.log("Cannot decrement below 0.");
        return;
      }
      count--;
      console.log(\`Count: \${count}\`);
    },
    reset() {
      count = 0;
      console.log(\`Count: \${count}\`);
    },
  };
}

function randomTarget() {
  return Math.floor(Math.random() * 100) + 1;
}

function playGuessingGame(guesses, target = randomTarget()) {
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const attempt = i + 1;
    if (guess === target) {
      console.log(\`Correct! You found it in \${attempt} attempt(s).\`);
      return { found: true, attempts: attempt };
    }
    console.log(\`Guess \${attempt} (\${guess}): \${guess < target ? "too low" : "too high"}.\`);
  }
  console.log(\`Out of guesses! The number was \${target}.\`);
  return { found: false, attempts: guesses.length };
}

class CalculatorError extends Error {
  constructor(message) {
    super(message);
    this.name = "CalculatorError";
  }
}

function calculate(a, operator, b) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) throw new CalculatorError("Division by zero is not allowed.");
      return a / b;
    default:
      throw new CalculatorError(\`Unknown operator: "\${operator}"\`);
  }
}

function assertNumber(value, name) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError(\`\${name} expects a valid number.\`);
  }
}

function celsiusToFahrenheit(celsius) {
  assertNumber(celsius, "celsiusToFahrenheit");
  return Number(((celsius * 9) / 5 + 32).toFixed(1));
}

function fahrenheitToCelsius(fahrenheit) {
  assertNumber(fahrenheit, "fahrenheitToCelsius");
  return Number((((fahrenheit - 32) * 5) / 9).toFixed(1));
}
`,
      checks: [
        { label: 'counter logs each change', expr: '(() => { const c = createCounter(); c.increment(); c.increment(); c.decrement(); c.reset(); c.decrement(); return __logs.slice(-5); })()', expect: ['Count: 1', 'Count: 2', 'Count: 1', 'Count: 0', 'Cannot decrement below 0.'], mistake: 'Log `Count: N` after every change; at 0, decrement logs "Cannot decrement below 0." and does nothing.' },
        { label: 'count is private and per counter', expr: '(() => { const a = createCounter(); const b = createCounter(); a.increment(); a.increment(); b.increment(); return [Object.keys(a).sort(), "count" in a, __logs.slice(-1)[0]]; })()', expect: [['decrement', 'increment', 'reset'], false, 'Count: 1'], mistake: 'Declare let count = 0 inside createCounter, so each counter has its own private count.' },
        { label: 'randomTarget covers 1 to 100', expr: '(() => { const real = Math.random; const out = []; try { for (const r of [0, 0.5, 0.999999]) { Math.random = () => r; out.push(randomTarget()); } } finally { Math.random = real; } return out; })()', expect: [1, 51, 100], mistake: 'Math.floor(Math.random() * 100) + 1.' },
        { label: 'guessing game finds the number', expr: '[playGuessingGame([50, 75, 62, 68, 65], 65), __logs.slice(-5)]', expect: [{ found: true, attempts: 5 }, ['Guess 1 (50): too low.', 'Guess 2 (75): too high.', 'Guess 3 (62): too low.', 'Guess 4 (68): too high.', 'Correct! You found it in 5 attempt(s).']], mistake: 'Loop over the guesses, log too low / too high, and return { found: true, attempts } as soon as one matches.' },
        { label: 'guessing game runs out', expr: '[playGuessingGame([10, 20], 99), __logs.slice(-1)[0]]', expect: [{ found: false, attempts: 2 }, 'Out of guesses! The number was 99.'], mistake: 'After the loop, log the target and return { found: false, attempts: guesses.length }.' },
        { label: 'calculator operations', expr: '[calculate(10, "+", 5), calculate(10, "-", 5), calculate(10, "*", 5), calculate(10, "/", 4)]', expect: [15, 5, 50, 2.5], mistake: 'Use a switch on the operator.' },
        { label: 'division by zero is a CalculatorError', expr: '(() => { try { calculate(1, "/", 0); return "no error"; } catch (e) { return [e instanceof CalculatorError, e instanceof Error, e.name, e.message]; } })()', expect: [true, true, 'CalculatorError', 'Division by zero is not allowed.'], mistake: 'class CalculatorError extends Error, set this.name, and throw it when b === 0.' },
        { label: 'unknown operator throws', expr: '(() => { try { calculate(1, "%", 2); return "no error"; } catch (e) { return [e instanceof CalculatorError, e.message]; } })()', expect: [true, 'Unknown operator: "%"'], mistake: 'The default case should throw new CalculatorError(`Unknown operator: "${operator}"`).' },
        { label: 'temperature conversions', expr: '[celsiusToFahrenheit(100), celsiusToFahrenheit(37), fahrenheitToCelsius(32), fahrenheitToCelsius(100)]', expect: [212, 98.6, 0, 37.8], mistake: 'Use the formulas, round with toFixed(1) and convert back with Number().' },
        { label: 'temperature rejects bad input', expr: '[NaN, "100", undefined].map((v) => { try { celsiusToFahrenheit(v); return "accepted"; } catch { try { fahrenheitToCelsius(v); return "half"; } catch { return "rejected"; } } })', expect: ['rejected', 'rejected', 'rejected'], mistake: 'Throw unless typeof value === "number" and !Number.isNaN(value), in both functions.' },
      ],
    },
    {
      id: 'proj-text-time',
      title: 'Project pack: text stats, colours, clock, stopwatch',
      source: 'JavaScript & React course, projects 5–8',
      runner: 'js',
      teach: [
        { h: 'Character counter' },
        '`.trim().split(/\\s+/)` splits on any run of whitespace; `.split(" ")` breaks on double spaces. But `"".split(/\\s+/)` is `[""]` (length 1), so empty text needs its own case.',
        'Counting vowels is the "count occurrences" `reduce`: accumulate into an object, `counts[ch] = (counts[ch] || 0) + 1`.',
        { h: 'Random colours' },
        'A channel is 0–255: `Math.floor(Math.random() * 256)`. In hex, `5` is `"5"`, one digit, so pad it: `value.toString(16).padStart(2, "0")`. Without padding the colour is malformed about 1 time in 16 per channel, which casual testing rarely catches.',
        { h: 'Digital clock' },
        '`getHours()`, `getMinutes()` and `getSeconds()` return unpadded numbers. Take the date as a parameter defaulting to `new Date()`: the live clock still works, and a test can pass a fixed date.',
        { h: 'Stopwatch logic' },
        'Track three things: whether it is running, when the current run started (`Date.now()`), and how much time earlier runs accumulated. Elapsed time is `accumulated + (running ? now - start : 0)`.',
        { warn: 'Guard `start()` when already running. Otherwise a second `start()` overwrites the start timestamp and silently loses the time since the first one.' },
      ],
      example: [
        { code: 'function getFormattedTime(date = new Date()) {\n  const hours = String(date.getHours()).padStart(2, "0");\n  // minutes, seconds ...\n}\ngetFormattedTime(new Date(2024, 0, 1, 9, 5, 2)); // "09:05:02"', lang: 'js' },
      ],
      task: [
        { ol: ['`analyzeText(text)` → `{ characterCount, wordCount, vowelCounts }` on the trimmed text; vowels case-insensitive, only vowels that appear.', '`randomHexColor()` → `"#rrggbb"` (lowercase, always 6 digits) and `randomRgbColor()` → `"rgb(r, g, b)"`, each channel from its own `Math.random()` call in r, g, b order.', '`getFormattedTime(date = new Date())` → `"HH:MM:SS"` (24-hour).', '`createStopwatch()` → `{ start, stop, reset, getElapsedSeconds }` using `Date.now()`, supporting pause/resume and reading while running.'] },
      ],
      starter: `function analyzeText(text) {
  return {
    characterCount: text.length,
    wordCount: text.split(" ").length,
    vowelCounts: {},
  };
}

function randomHexColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return "#" + r.toString(16) + g.toString(16) + b.toString(16);
}

function getFormattedTime(date = new Date()) {
  return \`\${date.getHours()}:\${date.getMinutes()}:\${date.getSeconds()}\`;
}
`,
      solution: `function analyzeText(text) {
  const trimmed = text.trim();
  const characterCount = trimmed.length;
  const wordCount = trimmed === "" ? 0 : trimmed.split(/\\s+/).length;
  const vowelCounts = trimmed
    .toLowerCase()
    .split("")
    .reduce((counts, char) => {
      if ("aeiou".includes(char)) counts[char] = (counts[char] || 0) + 1;
      return counts;
    }, {});
  return { characterCount, wordCount, vowelCounts };
}

function randomChannel() {
  return Math.floor(Math.random() * 256);
}

function randomHexColor() {
  const channels = [randomChannel(), randomChannel(), randomChannel()];
  return "#" + channels.map((value) => value.toString(16).padStart(2, "0")).join("");
}

function randomRgbColor() {
  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();
  return \`rgb(\${r}, \${g}, \${b})\`;
}

function getFormattedTime(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return \`\${hours}:\${minutes}:\${seconds}\`;
}

function createStopwatch() {
  let isRunning = false;
  let startTimestamp = null;
  let accumulatedMs = 0;

  return {
    start() {
      if (isRunning) return;
      isRunning = true;
      startTimestamp = Date.now();
    },
    stop() {
      if (!isRunning) return;
      accumulatedMs += Date.now() - startTimestamp;
      isRunning = false;
    },
    reset() {
      isRunning = false;
      startTimestamp = null;
      accumulatedMs = 0;
    },
    getElapsedSeconds() {
      const current = isRunning ? Date.now() - startTimestamp : 0;
      return (accumulatedMs + current) / 1000;
    },
  };
}
`,
      checks: [
        { label: 'text statistics', expr: 'analyzeText("The quick brown fox jumps")', expect: { characterCount: 25, wordCount: 5, vowelCounts: { e: 1, u: 2, i: 1, o: 2 } }, mistake: 'Count characters and words of the trimmed text, and reduce the lowercase characters into a vowel-count object.' },
        { label: 'extra spaces and capitals', expr: 'analyzeText("  AAa   bee  ")', expect: { characterCount: 9, wordCount: 2, vowelCounts: { a: 3, e: 2 } }, mistake: 'Trim first, split on /\\s+/, and lowercase before counting vowels.' },
        { label: 'empty text', expr: '[analyzeText(""), analyzeText("   ")]', expect: [{ characterCount: 0, wordCount: 0, vowelCounts: {} }, { characterCount: 0, wordCount: 0, vowelCounts: {} }], mistake: '"".split(/\\s+/) is [""]: return 0 words for empty text.' },
        { label: 'hex colours are padded', expr: '(() => { const real = Math.random; const seq = [0, 5 / 256, 255 / 256]; let i = 0; Math.random = () => seq[i++ % 3]; try { return randomHexColor(); } finally { Math.random = real; } })()', expect: '#0005ff', mistake: 'Pad each channel: value.toString(16).padStart(2, "0").' },
        { label: 'hex format always valid', expr: 'Array.from({ length: 300 }, () => randomHexColor()).every((c) => /^#[0-9a-f]{6}$/.test(c))', expect: true, mistake: 'Always produce # followed by exactly 6 lowercase hex digits, with channels 0–255.' },
        { label: 'rgb colours', expr: '(() => { const real = Math.random; const seq = [0, 0.5, 0.999]; let i = 0; Math.random = () => seq[i++ % 3]; try { return randomRgbColor(); } finally { Math.random = real; } })()', expect: 'rgb(0, 128, 255)', mistake: 'Return `rgb(${r}, ${g}, ${b})` with channels from Math.floor(Math.random() * 256).' },
        { label: 'clock format', expr: '[getFormattedTime(new Date(2024, 0, 1, 9, 5, 2)), getFormattedTime(new Date(2024, 0, 1, 23, 59, 59)), getFormattedTime(new Date(2024, 0, 1, 0, 0, 0))]', expect: ['09:05:02', '23:59:59', '00:00:00'], mistake: 'padStart(2, "0") each part of the date that was passed in.' },
        { label: 'stopwatch pause and resume', expr: '(() => { const real = Date.now; let t = 1000; Date.now = () => t; try { const sw = createStopwatch(); sw.start(); t += 1500; sw.stop(); t += 5000; const paused = sw.getElapsedSeconds(); sw.start(); t += 500; const running = sw.getElapsedSeconds(); t += 500; sw.stop(); return [paused, running, sw.getElapsedSeconds()]; } finally { Date.now = real; } })()', expect: [1.5, 2, 2.5], mistake: 'Accumulate each run on stop(); while running add Date.now() - startTimestamp; paused time must not count.' },
        { label: 'double start and reset', expr: '(() => { const real = Date.now; let t = 0; Date.now = () => t; try { const sw = createStopwatch(); sw.start(); t += 1000; sw.start(); t += 1000; sw.stop(); sw.stop(); const total = sw.getElapsedSeconds(); sw.reset(); return [total, sw.getElapsedSeconds()]; } finally { Date.now = real; } })()', expect: [2, 0], mistake: 'start() must do nothing while running, stop() nothing while stopped, and reset() clears everything.' },
      ],
    },
    {
      id: 'proj-modal',
      title: 'Project: a reusable modal system',
      source: 'JavaScript & React course, project 11; Part 6',
      runner: 'page',
      slot: 'js',
      expose: ['openModal', 'closeModal'],
      fixture: {
        html: '<header><button id="open-terms">Terms</button> <button id="open-help">Help</button></header>\n<main id="page"><p>Shop content…</p></main>',
        css: '.modal-overlay { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); display: grid; place-items: center; }\n.modal { background: white; padding: 1rem; border-radius: 8px; max-width: 30rem; }',
      },
      teach: [
        'A modal system is a pair of functions any part of the page can call: `openModal(content)` and `closeModal()`. The interesting part is everything around showing a box:',
        { list: ['**One at a time**: opening a new modal closes the current one first.', '**Three ways out**: the close button, a click on the dark overlay (but not inside the box), and Escape.', '**Scroll lock**: `document.body.style.overflow = "hidden"` while open, restored on close.', '**Clean up**: remove the Escape listener on close; otherwise listeners pile up with every open.', '**Accessibility**: `role="dialog"`, `aria-modal="true"`, and move focus to the close button.', '**Safety**: string content goes in with `textContent`, never `innerHTML`.'] },
        { code: 'overlay.addEventListener("click", (event) => {\n  if (event.target === overlay) closeModal();   // a click inside .modal has a different target\n});', lang: 'js' },
        'Keep the open modal in a variable (`let current = null`) so `closeModal` knows what to remove and the Escape handler is a named function that can be removed.',
      ],
      example: [
        { code: 'function handleKeydown(event) {\n  if (event.key === "Escape") closeModal();\n}\ndocument.addEventListener("keydown", handleKeydown);\n// later\ndocument.removeEventListener("keydown", handleKeydown);', lang: 'js' },
      ],
      task: [
        { ol: ['`openModal(content)`: close any open modal, then append `div.modal-overlay` > `div.modal[role="dialog"][aria-modal="true"]` holding a `div.modal-body` and a `button.modal-close` ("Close") to `document.body`. A string `content` becomes text; a DOM node is appended as is.', 'Lock scrolling while open and focus the close button.', '`closeModal()`: remove the modal, restore `body.style.overflow` to `""`, remove the Escape listener. Calling it with nothing open does nothing.', 'Close on the button, on an overlay click (not a click inside), and on Escape.', 'Wire `#open-terms` to open "Terms and conditions apply." and `#open-help` to open "Contact support@toyshop.in".'] },
      ],
      starter: `function openModal(content) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = content;
  document.body.append(modal);
}

function closeModal() {
  document.querySelector(".modal").remove();
}
`,
      solution: `let current = null;

function handleKeydown(event) {
  if (event.key === "Escape") closeModal();
}

function openModal(content) {
  closeModal();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const body = document.createElement("div");
  body.className = "modal-body";
  if (typeof content === "string") body.textContent = content;
  else body.append(content);

  const closeButton = document.createElement("button");
  closeButton.className = "modal-close";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeModal);

  modal.append(body, closeButton);
  overlay.append(modal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  document.body.append(overlay);
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleKeydown);
  closeButton.focus();
  current = overlay;
}

function closeModal() {
  if (!current) return;
  current.remove();
  current = null;
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleKeydown);
}

document.querySelector("#open-terms").addEventListener("click", () => openModal("Terms and conditions apply."));
document.querySelector("#open-help").addEventListener("click", () => openModal("Contact support@toyshop.in"));
`,
      checks: [
        { label: 'opens a dialog with text content', mistake: 'Build .modal-overlay > .modal[role=dialog][aria-modal=true] > .modal-body + button.modal-close, and use textContent for strings.', check: async ({ exposed, $, $$, settle }) => { exposed.openModal('<img src="x"> Hello'); await settle(); const modal = $('.modal-overlay > .modal[role="dialog"][aria-modal="true"]'); return (modal && $$('.modal-overlay').length === 1 && $('.modal-body')?.textContent === '<img src="x"> Hello' && !$('.modal-body img') && $('button.modal-close')?.textContent === 'Close') || `modal markup: ${JSON.stringify($('.modal-overlay')?.outerHTML?.slice(0, 160) ?? 'none')}`; } },
        { label: 'locks scroll and focuses Close', mistake: 'Set document.body.style.overflow = "hidden" and call closeButton.focus().', check: ({ document }) => (document.body.style.overflow === 'hidden' && document.activeElement?.classList.contains('modal-close')) || `overflow "${document.body.style.overflow}", focus on ${document.activeElement?.tagName}` },
        { label: 'only one modal at a time', mistake: 'Call closeModal() at the start of openModal.', check: async ({ exposed, $$, settle }) => { exposed.openModal('Second'); await settle(); return ($$('.modal-overlay').length === 1 && $$('.modal-body')[0]?.textContent === 'Second') || `${$$('.modal-overlay').length} overlays open`; } },
        { label: 'close button closes and unlocks', mistake: 'closeModal removes the overlay and resets body.style.overflow to "".', check: async ({ click, $, document }) => { await click('button.modal-close'); return (!$('.modal-overlay') && document.body.style.overflow === '') || `overlay ${$('.modal-overlay') ? 'still open' : 'closed'}, overflow "${document.body.style.overflow}"`; } },
        { label: 'overlay click closes, inside click does not', mistake: 'Close only when event.target === overlay.', check: async ({ exposed, click, $, settle }) => { exposed.openModal('Overlay test'); await settle(); await click('.modal-body'); const stillOpen = Boolean($('.modal-overlay')); await click('.modal-overlay'); return (stillOpen && !$('.modal-overlay')) || (stillOpen ? 'clicking the overlay did not close it' : 'clicking inside the modal closed it'); } },
        { label: 'Escape closes and the listener is removed', mistake: 'Add a named keydown handler on open and remove it in closeModal.', check: async ({ exposed, press, $, document, settle }) => { const added = []; const add = document.addEventListener; const remove = document.removeEventListener; document.addEventListener = function (type, fn, ...rest) { if (type === 'keydown') added.push(fn); return add.call(this, type, fn, ...rest); }; document.removeEventListener = function (type, fn, ...rest) { if (type === 'keydown') { const i = added.indexOf(fn); if (i >= 0) added.splice(i, 1); } return remove.call(this, type, fn, ...rest); }; try { exposed.openModal('One'); exposed.openModal('Two'); await settle(); await press(document.body, 'Escape'); return (!$('.modal-overlay') && added.length === 0) || ($('.modal-overlay') ? 'Escape did not close the modal' : `${added.length} keydown listener(s) left behind`); } finally { document.addEventListener = add; document.removeEventListener = remove; } } },
        { label: 'nodes as content, safe close when nothing is open', mistake: 'Append DOM nodes directly; closeModal() with nothing open should just return.', check: async ({ exposed, $, document, settle }) => { exposed.closeModal(); const p = document.createElement('p'); p.className = 'custom'; p.textContent = 'Node content'; exposed.openModal(p); await settle(); const ok = $('.modal-body > p.custom')?.textContent === 'Node content'; exposed.closeModal(); return ok || 'the node was not placed inside .modal-body'; } },
        { label: 'header buttons open their modals', mistake: 'Wire #open-terms and #open-help with click listeners that call openModal.', check: async ({ click, text, $ }) => { await click('#open-terms'); const terms = text('.modal-body'); await click('#open-help'); const help = text('.modal-body'); await click('button.modal-close'); return (terms === 'Terms and conditions apply.' && help === 'Contact support@toyshop.in' && !$('.modal-overlay')) || `terms: "${terms}", help: "${help}"`; } },
      ],
    },
    {
      id: 'proj-slideshow',
      title: 'Project: an auto-advancing slideshow',
      source: 'JavaScript & React course, project 12; Part 10 (timers)',
      runner: 'page',
      slot: 'js',
      setup: 'const SLIDES = [\n  { src: "/img/gateway.jpg", caption: "Gateway of India" },\n  { src: "/img/marine-drive.jpg", caption: "Marine Drive" },\n  { src: "/img/bandra-worli.jpg", caption: "Bandra–Worli Sea Link" },\n];\nconst SLIDE_MS = 150; // 3000 in a real page; short here so checks run quickly',
      fixture: {
        html: '<div class="slideshow">\n  <img class="slide" alt="">\n  <p class="caption"></p>\n  <button class="prev">Previous</button>\n  <button class="next">Next</button>\n</div>',
        css: '.slide { width: 100%; aspect-ratio: 16 / 9; background: #ddd; }',
      },
      teach: [
        'State: one number, `currentIndex`. Everything on screen is derived from it by a `show(index)` function. Buttons and the timer only change the index.',
        { code: 'function show(index) {\n  currentIndex = (index + SLIDES.length) % SLIDES.length;   // wraps both ways\n  img.src = SLIDES[currentIndex].src;\n  img.alt = SLIDES[currentIndex].caption;\n  caption.textContent = SLIDES[currentIndex].caption;\n}', lang: 'js' },
        '`(index + length) % length` wraps: from the last slide `+1` returns to 0, and from 0 `-1` goes to the last (plain `-1 % 3` is `-1` in JavaScript, hence the `+ length`).',
        { h: 'Auto-advance that pauses' },
        { list: ['`startAuto()`: if a timer already exists, do nothing; otherwise `setInterval(() => show(currentIndex + 1), SLIDE_MS)`.', '`stopAuto()`: `clearInterval` and set the id back to `null`.', '`mouseenter` → stop, `mouseleave` → start.', 'Without the "already running" guard, two `mouseleave` events (or a start on load plus one on leave) create two intervals and the slides race.'] },
      ],
      example: [
        { code: 'let timerId = null;\nfunction startAuto() {\n  if (timerId !== null) return;\n  timerId = setInterval(() => show(currentIndex + 1), SLIDE_MS);\n}', lang: 'js' },
      ],
      task: [
        '`SLIDES` and `SLIDE_MS` are defined for you.',
        { ol: ['Show the first slide on load: `img.slide` gets `src` and `alt` (the caption), `p.caption` the caption.', 'Previous/Next move one slide and wrap around at both ends.', 'Auto-advance every `SLIDE_MS` from page load; pause on `mouseenter` over `.slideshow`, resume on `mouseleave`.', 'Never run more than one interval at a time.'] },
      ],
      starter: `const img = document.querySelector(".slide");
const caption = document.querySelector(".caption");
let currentIndex = 0;

function show(index) {
  currentIndex = index;
  img.src = SLIDES[index].src;
  caption.textContent = SLIDES[index].caption;
}

document.querySelector(".next").addEventListener("click", () => show(currentIndex + 1));
document.querySelector(".prev").addEventListener("click", () => show(currentIndex - 1));
show(0);
`,
      solution: `const slideshow = document.querySelector(".slideshow");
const img = document.querySelector(".slide");
const caption = document.querySelector(".caption");
let currentIndex = 0;
let timerId = null;

function show(index) {
  currentIndex = (index + SLIDES.length) % SLIDES.length;
  const slide = SLIDES[currentIndex];
  img.src = slide.src;
  img.alt = slide.caption;
  caption.textContent = slide.caption;
}

function startAuto() {
  if (timerId !== null) return;
  timerId = setInterval(() => show(currentIndex + 1), SLIDE_MS);
}

function stopAuto() {
  clearInterval(timerId);
  timerId = null;
}

document.querySelector(".next").addEventListener("click", () => show(currentIndex + 1));
document.querySelector(".prev").addEventListener("click", () => show(currentIndex - 1));
slideshow.addEventListener("mouseenter", stopAuto);
slideshow.addEventListener("mouseleave", startAuto);

show(0);
startAuto();
`,
      checks: [
        { label: 'a slide is shown with matching alt text', mistake: 'show(0) on load: set img.src, img.alt and the caption from SLIDES.', check: ({ $, text }) => { const cap = text('.caption'); const img = $('.slide'); const names = ['Gateway of India', 'Marine Drive', 'Bandra–Worli Sea Link']; return (names.includes(cap) && img.getAttribute('alt') === cap && img.getAttribute('src')?.startsWith('/img/')) || `caption "${cap}", alt "${img.getAttribute('alt')}"`; } },
        { label: 'hover pauses auto-advance', mistake: 'mouseenter should clearInterval and set the id to null.', check: async ({ fire, text, wait }) => { await fire('.slideshow', 'mouseenter', { bubbles: false }); const before = text('.caption'); await wait(400); return text('.caption') === before || `the slide changed from "${before}" to "${text('.caption')}" while hovered`; } },
        { label: 'next and previous wrap around', mistake: 'Wrap with (index + SLIDES.length) % SLIDES.length.', check: async ({ click, text }) => { const names = ['Gateway of India', 'Marine Drive', 'Bandra–Worli Sea Link']; const start = names.indexOf(text('.caption')); const seen = []; for (const step of [1, 1, 1, -1, -1, -1, -1]) { await click(step === 1 ? '.next' : '.prev'); seen.push(names.indexOf(text('.caption'))); } const expected = []; let i = start; for (const step of [1, 1, 1, -1, -1, -1, -1]) { i = (i + step + 3) % 3; expected.push(i); } return JSON.stringify(seen) === JSON.stringify(expected) || `indexes went ${JSON.stringify(seen)}, expected ${JSON.stringify(expected)}`; } },
        { label: 'leaving resumes auto-advance', mistake: 'mouseleave should start the interval again.', check: async ({ fire, text, waitFor }) => { const before = text('.caption'); await fire('.slideshow', 'mouseleave', { bubbles: false }); const moved = await waitFor(() => text('.caption') !== before, 800); await fire('.slideshow', 'mouseenter', { bubbles: false }); return moved || 'no slide change after the mouse left'; } },
        { label: 'never two intervals', mistake: 'startAuto must return early when a timer is already running.', check: async ({ fire, window, wait }) => { const active = new Set(); const s = window.setInterval; const c = window.clearInterval; window.setInterval = (...a) => { const id = s(...a); active.add(id); return id; }; window.clearInterval = (id) => { active.delete(id); return c(id); }; try { await fire('.slideshow', 'mouseleave', { bubbles: false }); await fire('.slideshow', 'mouseleave', { bubbles: false }); await wait(20); const running = active.size; await fire('.slideshow', 'mouseenter', { bubbles: false }); return (running === 1 && active.size === 0) || `${running} interval(s) running after two mouseleave events`; } finally { window.setInterval = s; window.clearInterval = c; } } },
      ],
    },
    {
      id: 'proj-quiz-app',
      title: 'Project: a quiz app',
      source: 'JavaScript & React course, project 14',
      runner: 'page',
      slot: 'js',
      setup: 'const QUESTIONS = [\n  { question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Mars"], answer: 1 },\n  { question: "What is the SI unit of force?", options: ["Newton", "Joule", "Pascal"], answer: 0 },\n  { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon dioxide"], answer: 2 },\n];',
      fixture: {
        html: '<section id="quiz">\n  <h2 id="question"></h2>\n  <div id="options"></div>\n  <p id="feedback" role="status"></p>\n  <button id="next" hidden>Next question</button>\n  <p id="score"></p>\n</section>',
        css: '.option.correct { background: #c8f7c5; }\n.option.incorrect { background: #f7c5c5; }',
      },
      teach: [
        'State: `currentIndex`, `score`, and whether the current question has been answered. A `renderQuestion()` function draws the current question from that state.',
        { list: ['One `button.option` per option, built with `textContent`. Store the option index in `data-index`.', 'On an answer: compare with `question.answer`, add to the score, show feedback, mark the chosen button `correct` or `incorrect` (and the right one `correct` if they were wrong), **disable every option** so the score cannot be farmed, then reveal Next.', 'Next: move on, or show the summary after the last question.'] },
        { tip: 'Disable answered options with `button.disabled = true`. Removing listeners one by one is more code and easier to get wrong.' },
        'A quiz is a small **state machine**: answering → answered → (next question | finished). Writing the states down first makes the event handlers obvious.',
      ],
      example: [
        { code: 'function handleAnswer(chosen) {\n  const q = QUESTIONS[currentIndex];\n  const correct = chosen === q.answer;\n  if (correct) score += 1;\n  feedback.textContent = correct ? "Correct!" : `Wrong: the answer is ${q.options[q.answer]}.`;\n}', lang: 'js' },
      ],
      task: [
        '`QUESTIONS` is defined for you (`answer` is the index of the right option).',
        { ol: ['Show question 1 in `#question` and its options as `button.option` elements inside `#options`; `#score` shows `Score: 0`.', 'Clicking an option: feedback `Correct!` or `Wrong: the answer is <option>.`; the chosen button gets `correct`/`incorrect`, the right one always `correct`; all options disabled; `Score: N` updated; `#next` shown.', '`#next` shows the next question (clearing feedback and hiding `#next`).', 'After the last question, `#next` shows `Quiz complete!` in `#question`, empties `#options`, and `#score` becomes `You scored N / 3`.'] },
      ],
      starter: `const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");

questionEl.textContent = QUESTIONS[0].question;
QUESTIONS[0].options.forEach((option) => {
  optionsEl.innerHTML += "<button>" + option + "</button>";
});
`,
      solution: `const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");
const feedbackEl = document.querySelector("#feedback");
const nextButton = document.querySelector("#next");
const scoreEl = document.querySelector("#score");

let currentIndex = 0;
let score = 0;

function renderQuestion() {
  const q = QUESTIONS[currentIndex];
  questionEl.textContent = q.question;
  feedbackEl.textContent = "";
  nextButton.hidden = true;
  optionsEl.replaceChildren(
    ...q.options.map((option, index) => {
      const button = document.createElement("button");
      button.className = "option";
      button.dataset.index = index;
      button.textContent = option;
      return button;
    }),
  );
  scoreEl.textContent = \`Score: \${score}\`;
}

function handleAnswer(chosen) {
  const q = QUESTIONS[currentIndex];
  const buttons = [...optionsEl.querySelectorAll(".option")];
  const correct = chosen === q.answer;
  if (correct) score += 1;

  buttons.forEach((button) => {
    button.disabled = true;
  });
  buttons[q.answer].classList.add("correct");
  if (!correct) buttons[chosen].classList.add("incorrect");

  feedbackEl.textContent = correct ? "Correct!" : \`Wrong: the answer is \${q.options[q.answer]}.\`;
  scoreEl.textContent = \`Score: \${score}\`;
  nextButton.hidden = false;
}

function showSummary() {
  questionEl.textContent = "Quiz complete!";
  optionsEl.replaceChildren();
  feedbackEl.textContent = "";
  nextButton.hidden = true;
  scoreEl.textContent = \`You scored \${score} / \${QUESTIONS.length}\`;
}

optionsEl.addEventListener("click", (event) => {
  const button = event.target.closest(".option");
  if (!button || button.disabled) return;
  handleAnswer(Number(button.dataset.index));
});

nextButton.addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex < QUESTIONS.length) renderQuestion();
  else showSummary();
});

renderQuestion();
`,
      checks: [
        { label: 'first question and options', mistake: 'Render QUESTIONS[0] into #question and one button.option per option; #score shows "Score: 0".', check: ({ text, $$, $ }) => (text('#question') === 'Which planet is closest to the Sun?' && JSON.stringify($$('#options button.option').map((b) => b.textContent)) === '["Venus","Mercury","Mars"]' && text('#score') === 'Score: 0' && $('#next').hidden) || `question "${text('#question')}", options ${JSON.stringify($$('#options button').map((b) => b.textContent))}` },
        { label: 'a correct answer', mistake: 'Compare the chosen index with answer, add to the score, show "Correct!", mark it .correct and reveal #next.', check: async ({ $$, click, text, $ }) => { await click($$('button.option')[1]); return (text('#feedback') === 'Correct!' && $$('button.option')[1].classList.contains('correct') && text('#score') === 'Score: 1' && !$('#next').hidden) || `feedback "${text('#feedback')}", score "${text('#score')}"`; } },
        { label: 'answered options are locked', mistake: 'Disable every option after an answer so it cannot be scored twice.', check: async ({ $$, click, text }) => { await click($$('button.option')[0]); await click($$('button.option')[1]); return ($$('button.option').every((b) => b.disabled) && text('#score') === 'Score: 1') || `score became "${text('#score')}"`; } },
        { label: 'next question resets the view', mistake: '#next should render the next question, clear feedback and hide itself.', check: async ({ click, text, $, $$ }) => { await click('#next'); return (text('#question') === 'What is the SI unit of force?' && text('#feedback') === '' && $('#next').hidden && $$('button.option').every((b) => !b.disabled)) || `question "${text('#question')}", feedback "${text('#feedback')}"`; } },
        { label: 'a wrong answer shows the right one', mistake: 'Feedback "Wrong: the answer is Newton.", .incorrect on the chosen option and .correct on the right one.', check: async ({ $$, click, text }) => { await click($$('button.option')[1]); const [right, chosen] = [$$('button.option')[0], $$('button.option')[1]]; return (text('#feedback') === 'Wrong: the answer is Newton.' && chosen.classList.contains('incorrect') && right.classList.contains('correct') && text('#score') === 'Score: 1') || `feedback "${text('#feedback')}"`; } },
        { label: 'final summary', mistake: 'After the last question, #next shows "Quiz complete!", empties #options and shows "You scored N / 3".', check: async ({ click, $$, text, $ }) => { await click('#next'); await click($$('button.option')[2]); await click('#next'); return (text('#question') === 'Quiz complete!' && $$('#options *').length === 0 && text('#score') === 'You scored 2 / 3' && $('#next').hidden) || `question "${text('#question')}", score "${text('#score')}"`; } },
        { label: 'options built safely', mistake: 'Create buttons with createElement and textContent, not innerHTML +=.', check: ({ source }) => !/innerHTML\s*\+?=/.test(source) || 'innerHTML is used to build options' },
      ],
    },
    {
      id: 'proj-expense-tracker',
      title: 'Project: an expense tracker',
      source: 'JavaScript & React course, project 15; Parts 6–8',
      runner: 'page',
      slot: 'js',
      setup: 'localStorage.setItem("expenses", JSON.stringify([{ id: 1, description: "Chai", amount: 20, category: "Food" }, { id: 2, description: "Metro card recharge", amount: 500, category: "Transport" }]));',
      fixture: {
        html: '<form id="expense-form">\n  <label for="description">Description</label>\n  <input id="description">\n  <label for="amount">Amount (₹)</label>\n  <input id="amount" type="number" min="0" step="0.01">\n  <label for="category">Category</label>\n  <select id="category">\n    <option>Food</option>\n    <option>Transport</option>\n    <option>Study</option>\n  </select>\n  <button type="submit">Add</button>\n  <p id="form-error" role="alert"></p>\n</form>\n<ul id="expense-list"></ul>\n<p id="total"></p>\n<ul id="category-totals"></ul>',
      },
      teach: [
        'Same architecture as the stored to-do list: an array of expenses is the source of truth; every change is **update → save → render**; the DOM is redrawn from data.',
        { list: ['Give each expense a stable `id` (e.g. `Date.now()`), and delete by id, not by position.', 'Inputs give strings: `Number(amountInput.value)`; reject empty descriptions and amounts that are not positive numbers.', 'Derived values (total, per-category subtotals) are **computed** in `render()` from the array, never stored separately where they could drift.', 'Money: `toLocaleString("en-IN")` for ₹1,50,000-style grouping. For real money, store paise as integers to avoid floating-point surprises (`0.1 + 0.2`).'] },
        { code: 'const totals = expenses.reduce((acc, e) => {\n  acc[e.category] = (acc[e.category] || 0) + e.amount;\n  return acc;\n}, {});', lang: 'js' },
      ],
      example: [
        { code: 'const formatRupees = (amount) => `₹${amount.toLocaleString("en-IN")}`;\nformatRupees(150000); // "₹1,50,000"', lang: 'js' },
      ],
      task: [
        'Two expenses are already saved under `"expenses"`.',
        { ol: ['Render each as `li.expense` containing `span.description`, `span.amount` (`₹520`), `span.category` and `button.delete`.', 'Submitting adds `{ id, description, amount, category }` (no reload). Empty description or a non-positive amount shows `Enter a description and an amount above 0` in `#form-error` and adds nothing; a valid add clears the error and the inputs.', 'Delete removes by id.', '`#total` shows `Total: ₹N`; `#category-totals` has one `li` per category **that has expenses**, in the order Food, Transport, Study, like `Food: ₹20`.', 'Save to `"expenses"` after every change.'] },
      ],
      starter: `const form = document.querySelector("#expense-form");
const list = document.querySelector("#expense-list");
let expenses = [];

form.addEventListener("submit", () => {
  const description = document.querySelector("#description").value;
  const amount = document.querySelector("#amount").value;
  expenses.push({ description, amount });
  list.innerHTML += "<li>" + description + " " + amount + "</li>";
});
`,
      solution: `const STORAGE_KEY = "expenses";
const CATEGORIES = ["Food", "Transport", "Study"];

const form = document.querySelector("#expense-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const errorEl = document.querySelector("#form-error");
const list = document.querySelector("#expense-list");
const totalEl = document.querySelector("#total");
const categoryTotalsEl = document.querySelector("#category-totals");

let expenses = loadExpenses();

function loadExpenses() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

const formatRupees = (amount) => \`₹\${amount.toLocaleString("en-IN")}\`;

function span(className, text) {
  const el = document.createElement("span");
  el.className = className;
  el.textContent = text;
  return el;
}

function render() {
  list.replaceChildren(
    ...expenses.map((expense) => {
      const li = document.createElement("li");
      li.className = "expense";
      li.dataset.id = expense.id;
      const remove = document.createElement("button");
      remove.className = "delete";
      remove.textContent = "Delete";
      li.append(span("description", expense.description), span("amount", formatRupees(expense.amount)), span("category", expense.category), remove);
      return li;
    }),
  );

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalEl.textContent = \`Total: \${formatRupees(total)}\`;

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  categoryTotalsEl.replaceChildren(
    ...CATEGORIES.filter((c) => byCategory[c] !== undefined).map((c) => {
      const li = document.createElement("li");
      li.textContent = \`\${c}: \${formatRupees(byCategory[c])}\`;
      return li;
    }),
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  if (description === "" || amountInput.value.trim() === "" || !(amount > 0)) {
    errorEl.textContent = "Enter a description and an amount above 0";
    return;
  }
  errorEl.textContent = "";
  expenses.push({ id: Date.now() + Math.random(), description, amount, category: categoryInput.value });
  saveExpenses();
  render();
  descriptionInput.value = "";
  amountInput.value = "";
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".delete");
  if (!button) return;
  const id = Number(button.closest(".expense").dataset.id);
  expenses = expenses.filter((e) => e.id !== id);
  saveExpenses();
  render();
});

render();
`,
      checks: [
        { label: 'saved expenses render', mistake: 'Load the saved array and render li.expense with span.description, span.amount, span.category and button.delete.', check: ({ $$ }) => { const rows = $$('li.expense').map((li) => [li.querySelector('.description')?.textContent, li.querySelector('.amount')?.textContent, li.querySelector('.category')?.textContent, Boolean(li.querySelector('button.delete'))]); return JSON.stringify(rows) === JSON.stringify([['Chai', '₹20', 'Food', true], ['Metro card recharge', '₹500', 'Transport', true]]) || `rows: ${JSON.stringify(rows)}`; } },
        { label: 'total and category breakdown', mistake: 'Compute the total and per-category subtotals with reduce inside render().', check: ({ text, $$ }) => (text('#total') === 'Total: ₹520' && JSON.stringify($$('#category-totals li').map((li) => li.textContent)) === '["Food: ₹20","Transport: ₹500"]') || `total "${text('#total')}", categories ${JSON.stringify($$('#category-totals li').map((li) => li.textContent))}` },
        { label: 'invalid input is rejected', mistake: 'Reject an empty description or an amount that is not above 0, and show the error message.', check: async ({ type, click, text, $$, submits }) => { await type('#description', ''); await type('#amount', '50'); await click('#expense-form button'); await type('#description', 'Pens'); await type('#amount', '-5'); await click('#expense-form button'); return ($$('li.expense').length === 2 && text('#form-error') === 'Enter a description and an amount above 0' && submits.every((s) => s.prevented)) || `${$$('li.expense').length} expenses, error "${text('#form-error')}"`; } },
        { label: 'adding updates everything and saves', mistake: 'Push the new expense (amount as a number), save, re-render, clear the error and inputs.', check: async ({ type, select, click, text, $$, $, storage }) => { await type('#description', 'Physics textbook'); await type('#amount', '150000'); await select('#category', 'Study'); await click('#expense-form button'); const saved = JSON.parse(storage.getItem('expenses') || '[]'); return (saved.length === 3 && saved[2].amount === 150000 && saved[2].category === 'Study' && text('#total') === 'Total: ₹1,50,520' && $$('#category-totals li').map((li) => li.textContent).join('|') === 'Food: ₹20|Transport: ₹500|Study: ₹1,50,000' && text('#form-error') === '' && $('#description').value === '') || `total "${text('#total')}", saved ${storage.getItem('expenses')}`; } },
        { label: 'deleting by id', mistake: 'Delete should filter the expense out by id, save and re-render; empty categories disappear.', check: async ({ $$, click, text, storage }) => { await click($$('li.expense')[1].querySelector('button.delete')); const saved = JSON.parse(storage.getItem('expenses')); return (saved.length === 2 && !saved.some((e) => e.category === 'Transport') && text('#total') === 'Total: ₹1,50,020' && $$('#category-totals li').map((li) => li.textContent).join('|') === 'Food: ₹20|Study: ₹1,50,000') || `total "${text('#total')}", categories ${$$('#category-totals li').map((li) => li.textContent).join('|')}`; } },
        { label: 'text is inserted safely', mistake: 'Use textContent for user input, never innerHTML.', check: async ({ type, click, $ }) => { await type('#description', '<img src=x>'); await type('#amount', '1'); await click('#expense-form button'); return !$('#expense-list img') || 'the description was parsed as HTML'; } },
      ],
    },
  ],
};
