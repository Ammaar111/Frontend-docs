// JavaScript & React course, Part 27: custom hooks.
import { mockApi } from '../shared/mock-api.js';

const api = mockApi({
  'GET /api/users/1': { body: { id: 1, name: 'Ammaar' }, delay: 30 },
  'GET /api/users/2': { body: { id: 2, name: 'Priya' }, delay: 30 },
  'GET /api/users/3': { body: { id: 3, name: 'Rohan' }, delay: 30 },
  'GET /api/users/500': { status: 500, body: { message: 'boom' }, delay: 30 },
  'GET /api/products?category=books': { body: [{ id: 1, name: 'Concepts of Physics' }, { id: 2, name: 'Organic Chemistry' }], delay: 30 },
  'GET /api/products?category=toys': { body: [], delay: 30 },
});

export default {
  id: 'react-custom-hooks',
  title: 'Custom hooks',
  lessons: [
    {
      id: 'custom-hooks-usefetch',
      title: 'Why custom hooks exist: useFetch',
      source: 'JavaScript & React course, Part 27.1, 27.2, 27.7',
      runner: 'react',
      component: null,
      expose: ['useFetch', 'UserProfile', 'ProductList'],
      setup: api,
      teach: [
        'Every component that loads data needs the same `useState` × 3 + `useEffect` + `AbortController` code from the data-fetching module. Copy-pasting it breaks DRY: a bug fix has to be repeated in every copy.',
        'A **custom hook** is a plain function whose name starts with `use` and which calls other hooks. It packages reusable **stateful logic**, not markup. Each component that calls it gets its **own** independent state; nothing is shared between callers.',
        { warn: 'The `use` prefix is not style. The hooks linter (and React\'s tooling) identifies hooks by it and checks the rules of hooks only on functions named `use…`.' },
        { code: 'function useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    async function load() {\n      setLoading(true);\n      setError(null);\n      try {\n        const response = await fetch(url, { signal: controller.signal });\n        if (!response.ok) throw new Error(`HTTP ${response.status}`);\n        setData(await response.json());\n      } catch (err) {\n        if (err.name !== "AbortError") setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    }\n    load();\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}', lang: 'jsx' },
        { h: 'A subtle bug in that version' },
        'When `url` changes, the cleanup aborts the old request and the new effect sets `loading` to `true`. Then the old request\'s `finally` runs **later** and sets `loading` back to `false`, while the new request is still in flight. The screen shows neither "Loading…" nor data. Guard it:',
        { code: 'finally {\n  if (!controller.signal.aborted) setLoading(false);  // only the current request may end loading\n}', lang: 'jsx' },
        'A hook that is meant to be composed (with `useDebounce` later) should also accept "nothing to fetch yet": when `url` is `null` or empty, make no request and report `loading: false`.',
        { h: 'Designing a hook\'s interface' },
        { ol: ['Notice the same combination of hooks repeated for the same purpose.', 'Move it into a `use…` function.', 'Call whatever hooks it needs, following the rules of hooks.', 'Return a small, well-named interface (`{ data, loading, error }`) and hide the internals.'] },
      ],
      example: [
        { code: 'function UserProfile({ userId }) {\n  const { data: user, loading, error } = useFetch(`/api/users/${userId}`); // rename while destructuring\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <h2>{user.name}</h2>;\n}', lang: 'jsx' },
      ],
      task: [
        'The two components below each contain their own copy of the fetch logic (and both copies forget `response.ok` and cancellation).',
        { ol: ['Write `useFetch(url)` returning `{ data, loading, error }`: check `response.ok` (error message `HTTP <status>`), abort the old request when `url` changes or the component unmounts, ignore `AbortError`, and only let the current request end loading.', 'When `url` is falsy, make no request: `data` null, `loading` false.', 'Rewrite `UserProfile({ userId })` (`<p>Loading...</p>`, `<p>Error: …</p>`, `<h2>name</h2>`) and `ProductList({ category })` (`/api/products?category=…`; `<ul>` of `<li>` names, or `<p>No products</p>` when empty) to use it. `fetch(` should appear only once in your code.'] },
      ],
      starter: `import { useState, useEffect } from "react";

function useFetch(url) {
  return { data: null, loading: false, error: null };
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h2>{user.name}</h2>;
}

function ProductList({ category }) {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/products?category=\${category}\`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (products.length === 0) return <p>No products</p>;
  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
`,
      solution: `import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        setData(await response.json());
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${userId}\`);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return null;
  return <h2>{user.name}</h2>;
}

function ProductList({ category }) {
  const { data: products, loading, error } = useFetch(\`/api/products?category=\${category}\`);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products || products.length === 0) return <p>No products</p>;
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
`,
      checks: [
        { label: 'useFetch loads data', mistake: 'useFetch should start with loading true, then return the parsed JSON as data.', check: async ({ render, el, exposed, wait }) => { const Probe = ({ url }) => { const r = exposed.useFetch(url); return el('p', null, r.loading ? 'loading' : r.error ? `error:${r.error}` : JSON.stringify(r.data)); }; const view = await render(el(Probe, { url: '/api/users/1' })); const first = view.text('p'); await wait(90); return (first === 'loading' && view.text('p') === '{"id":1,"name":"Ammaar"}') || `showed "${first}", then "${view.text('p')}"`; } },
        { label: 'useFetch reports HTTP errors', mistake: 'fetch does not reject on 500: check response.ok and throw new Error(`HTTP ${response.status}`).', check: async ({ render, el, exposed, wait }) => { const Probe = ({ url }) => { const r = exposed.useFetch(url); return el('p', null, r.loading ? 'loading' : r.error ? `error:${r.error}` : JSON.stringify(r.data)); }; const view = await render(el(Probe, { url: '/api/users/500' })); await wait(90); return view.text('p') === 'error:HTTP 500' || `showed "${view.text('p')}"`; } },
        { label: 'changing url aborts the old request and stays loading', mistake: 'Return () => controller.abort() from the effect, and in finally only call setLoading(false) if the request was not aborted.', check: async ({ render, el, exposed, wait, window }) => { window.__api.delays['GET /api/users/1'] = 150; window.__api.delays['GET /api/users/3'] = 120; try { const start = window.__requests.length; const Probe = ({ url }) => { const r = exposed.useFetch(url); return el('p', null, r.loading ? 'loading' : r.error ? `error:${r.error}` : JSON.stringify(r.data)); }; const view = await render(el(Probe, { url: '/api/users/1' })); await wait(20); await view.rerender(el(Probe, { url: '/api/users/3' })); await wait(40); const during = view.text('p'); await wait(200); const first = window.__requests[start]; return (first?.aborted && during === 'loading' && view.text('p') === '{"id":3,"name":"Rohan"}') || (!first?.aborted ? 'the first request was not aborted' : `while the new request was running it showed "${during}"`); } finally { delete window.__api.delays['GET /api/users/1']; delete window.__api.delays['GET /api/users/3']; } } },
        { label: 'null url makes no request', mistake: 'If url is falsy, return from the effect early after setLoading(false).', check: async ({ render, el, exposed, wait, window }) => { const start = window.__requests.length; const Probe = ({ url }) => { const r = exposed.useFetch(url); return el('p', null, `${r.loading}|${JSON.stringify(r.data)}`); }; const view = await render(el(Probe, { url: null })); await wait(60); return (window.__requests.length === start && view.text('p') === 'false|null') || `requests made: ${window.__requests.length - start}, showed "${view.text('p')}"`; } },
        { label: 'UserProfile uses the hook', mistake: 'UserProfile should render <h2>{user.name}</h2> from useFetch(`/api/users/${userId}`), and "Error: HTTP 500" on failure.', check: async ({ render, el, exposed, waitFor }) => { const ok = await render(el(exposed.UserProfile, { userId: 2 })); const loaded = await waitFor(() => ok.text('h2') === 'Priya'); const bad = await render(el(exposed.UserProfile, { userId: 500 })); const failed = await waitFor(() => bad.text('p') === 'Error: HTTP 500'); return (loaded && failed) || (loaded ? `error case showed "${bad.text()}"` : `showed "${ok.text()}"`); } },
        { label: 'ProductList uses the hook', mistake: 'ProductList should list product names, or show "No products" for an empty array.', check: async ({ render, el, exposed, waitFor }) => { const books = await render(el(exposed.ProductList, { category: 'books' })); const listed = await waitFor(() => books.$$('li').length === 2); const toys = await render(el(exposed.ProductList, { category: 'toys' })); const empty = await waitFor(() => toys.text('p') === 'No products'); return (listed && empty) || `books: "${books.text()}", toys: "${toys.text()}"`; } },
        { label: 'fetch logic written once', mistake: 'Both components should call useFetch; fetch( should appear only inside the hook.', check: ({ source }) => { const fetches = (source.match(/(?<![\w.])fetch\(/g) || []).length; const uses = (source.match(/useFetch\(/g) || []).length; return (fetches === 1 && uses >= 3) || `fetch( appears ${fetches} time(s), useFetch( ${uses} time(s)`; } },
      ],
    },
    {
      id: 'custom-hooks-storage',
      title: 'useLocalStorage and lazy initial state',
      source: 'JavaScript & React course, Part 27.3; Part 8',
      runner: 'react',
      component: 'ThemeToggle',
      expose: ['useLocalStorage'],
      teach: [
        '`useLocalStorage(key, initialValue)` behaves like `useState`, but the value survives a reload. It returns the same `[value, setValue]` pair, so it is a drop-in replacement.',
        { code: 'function useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    try {\n      const stored = localStorage.getItem(key);\n      return stored !== null ? JSON.parse(stored) : initialValue;\n    } catch {\n      return initialValue;          // corrupted JSON or storage blocked\n    }\n  });\n\n  useEffect(() => {\n    try {\n      localStorage.setItem(key, JSON.stringify(value));\n    } catch (error) {\n      console.error("Failed to save to localStorage:", error);\n    }\n  }, [key, value]);\n\n  return [value, setValue];\n}', lang: 'jsx' },
        { h: 'Lazy initializer' },
        '`useState(expensive())` calls `expensive()` on **every** render, because the whole component body runs every render, even though React only uses the initial value once. `useState(() => expensive())` passes a **function**, and React calls it only on the first render.',
        { table: { head: ['Code', 'localStorage read'], rows: [['`useState(JSON.parse(localStorage.getItem("k")))`', 'every render'], ['`useState(() => JSON.parse(localStorage.getItem("k")))`', 'first render only']] } },
        { warn: '`stored ? JSON.parse(stored) : initial` treats a stored empty string as missing. Compare with `null`: `getItem` returns exactly `null` for a missing key.' },
        'Values go through `JSON.stringify` / `JSON.parse`, so numbers, booleans, arrays and objects keep their types. A string `"dark"` is stored as `"\\"dark\\""`.',
      ],
      example: [
        { code: 'function App() {\n  const [theme, setTheme] = useLocalStorage("theme", "light");\n  return (\n    <div className={theme}>\n      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Toggle theme</button>\n    </div>\n  );\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['Write `useLocalStorage(key, initialValue)` with a lazy initializer, a `null` check, a `try/catch` fallback for corrupted data, and an effect that saves JSON whenever `key` or `value` changes.', 'Rewrite `ThemeToggle` with it (key `"theme"`, default `"light"`). It renders `<div className={theme}>` with a `Toggle theme` button.'] },
      ],
      starter: `import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  return useState(initialValue);
}

function ThemeToggle() {
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")) || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Toggle theme</button>
    </div>
  );
}
`,
      solution: `import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Toggle theme</button>
    </div>
  );
}
`,
      checks: [
        { label: 'reads a stored value', mistake: 'The initializer should JSON.parse localStorage.getItem(key) when it is not null.', check: async ({ render, el, exposed, storage }) => { storage.clear(); storage.setItem('settings', JSON.stringify({ fontSize: 18 })); const Probe = () => { const [v] = exposed.useLocalStorage('settings', { fontSize: 14 }); return el('p', null, JSON.stringify(v)); }; const view = await render(el(Probe)); return view.text('p') === '{"fontSize":18}' || `showed ${view.text('p')}`; } },
        { label: 'falls back to the initial value', mistake: 'Missing keys and corrupted JSON should both give initialValue (try/catch around JSON.parse).', check: async ({ render, el, exposed, storage }) => { storage.clear(); const Probe = ({ k }) => { const [v] = exposed.useLocalStorage(k, 'light'); return el('p', null, String(v)); }; const missing = await render(el(Probe, { k: 'theme' })); const a = missing.text('p'); storage.setItem('broken', '{not json'); const broken = await render(el(Probe, { k: 'broken' })); const b = broken.text('p'); return (a === 'light' && b === 'light') || `missing: "${a}", corrupted: "${b}"`; } },
        { label: 'saves JSON on change', mistake: 'An effect with [key, value] should call localStorage.setItem(key, JSON.stringify(value)).', check: async ({ render, el, exposed, storage, click }) => { storage.clear(); const Probe = () => { const [v, setV] = exposed.useLocalStorage('count', 0); return el('button', { onClick: () => setV(v + 1) }, String(v)); }; const view = await render(el(Probe)); await click(view.$('button')); await click(view.$('button')); return storage.getItem('count') === '2' || `stored ${JSON.stringify(storage.getItem('count'))}`; } },
        { label: 'stored empty string is kept', mistake: 'Compare with null (stored !== null); "" is falsy but is a real stored value.', check: async ({ render, el, exposed, storage }) => { storage.clear(); storage.setItem('note', '""'); const Probe = () => { const [v] = exposed.useLocalStorage('note', 'default'); return el('p', null, JSON.stringify(v)); }; const view = await render(el(Probe)); return view.text('p') === '""' || `showed ${view.text('p')}`; } },
        { label: 'lazy initializer reads storage once', mistake: 'Pass a function to useState: useState(() => ...) so getItem runs only on the first render.', check: async ({ render, el, exposed, storage, click, React }) => { storage.clear(); const original = storage.getItem; let reads = 0; storage.getItem = function (k) { if (k === 'lazy') reads += 1; return original.call(this, k); }; try { const Probe = () => { const [n, setN] = React.useState(0); exposed.useLocalStorage('lazy', 'x'); return el('button', { onClick: () => setN(n + 1) }, String(n)); }; const view = await render(el(Probe)); for (let i = 0; i < 3; i += 1) await click(view.$('button')); return reads === 1 || `getItem("lazy") ran ${reads} times over 4 renders`; } finally { storage.getItem = original; } } },
        { label: 'ThemeToggle persists', mistake: 'ThemeToggle should use useLocalStorage("theme", "light"); a remount should show the saved theme.', check: async ({ render, el, App, storage, click }) => { storage.clear(); const first = await render(el(App)); await click(first.$('button')); const saved = storage.getItem('theme'); const second = await render(el(App)); return (saved === '"dark"' && second.$('div').className === 'dark') || `stored ${saved}, remount class "${second.$('div').className}"`; } },
      ],
    },
    {
      id: 'custom-hooks-timing',
      title: 'useDebounce and usePrevious',
      source: 'JavaScript & React course, Part 27.4, 27.5',
      runner: 'react',
      component: null,
      expose: ['useDebounce', 'usePrevious', 'ScoreTracker'],
      teach: [
        '`useDebounce(value, delayMs)` returns a copy of `value` that only updates after `value` has stopped changing for `delayMs`. Each change starts a timer; the cleanup cancels the previous pending timer.',
        { code: 'function useDebounce(value, delayMs) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);\n    return () => clearTimeout(timeoutId);   // value changed again: cancel the pending update\n  }, [value, delayMs]);\n  return debouncedValue;\n}', lang: 'jsx' },
        { h: 'Hook composition' },
        'Hooks compose like components. `useDebounce` knows nothing about fetching; `useFetch` knows nothing about debouncing. Together they give a race-safe debounced search:',
        { code: 'const [query, setQuery] = useState("");\nconst debouncedQuery = useDebounce(query, 400);\nconst { data: results, loading } = useFetch(\n  debouncedQuery ? `/api/search?q=${encodeURIComponent(debouncedQuery)}` : null,\n);', lang: 'jsx' },
        { h: 'usePrevious' },
        { code: 'function usePrevious(value) {\n  const ref = useRef();          // undefined at first\n  useEffect(() => {\n    ref.current = value;          // runs AFTER this render is on screen\n  }, [value]);\n  return ref.current;             // still holds the value from the previous render\n}', lang: 'jsx' },
        'It needs a **ref**, not state: remembering the previous value must not cause another render (one is already happening because `value` changed). Because the effect runs after rendering, during a render `ref.current` is still one step behind.',
      ],
      example: [
        { code: 'function ScoreTracker({ score }) {\n  const previousScore = usePrevious(score);\n  const trend = previousScore === undefined ? "" : score > previousScore ? "📈" : score < previousScore ? "📉" : "➡️";\n  return <p>Score: {score} {trend}</p>;\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['Write `useDebounce(value, delayMs)`: it returns the initial value immediately, updates only after the value has been unchanged for `delayMs`, and clears its pending timer on change and on unmount.', 'Write `usePrevious(value)` with `useRef` + `useEffect`.', 'Write `ScoreTracker({ score })` rendering `<p>Score: N trend</p>` (📈 up, 📉 down, ➡️ same, nothing on the first render).'] },
      ],
      starter: `import { useState, useEffect, useRef } from "react";

function useDebounce(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    setTimeout(() => setDebouncedValue(value), delayMs);
  }, [value, delayMs]);
  return debouncedValue;
}

function usePrevious(value) {
  const [previous, setPrevious] = useState();
  useEffect(() => {
    setPrevious(value);
  }, [value]);
  return previous;
}

function ScoreTracker({ score }) {
  return <p>Score: {score}</p>;
}
`,
      solution: `import { useState, useEffect, useRef } from "react";

function useDebounce(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);
  return debouncedValue;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function ScoreTracker({ score }) {
  const previousScore = usePrevious(score);
  const trend =
    previousScore === undefined ? "" : score > previousScore ? "📈" : score < previousScore ? "📉" : "➡️";
  return (
    <p>
      Score: {score} {trend}
    </p>
  );
}
`,
      checks: [
        { label: 'debounced value waits for the delay', mistake: 'useDebounce should return the old value until delayMs has passed, then the new one.', check: async ({ render, el, exposed, wait }) => { const Probe = ({ v }) => el('p', null, exposed.useDebounce(v, 60)); const view = await render(el(Probe, { v: 'a' })); const initial = view.text('p'); await view.rerender(el(Probe, { v: 'ab' })); const soon = view.text('p'); await wait(110); return (initial === 'a' && soon === 'a' && view.text('p') === 'ab') || `showed "${initial}", "${soon}", then "${view.text('p')}"`; } },
        { label: 'rapid changes produce one update', mistake: 'Return () => clearTimeout(timeoutId) from the effect so every new value cancels the previous timer.', check: async ({ render, el, exposed, wait }) => { const shown = []; const Probe = ({ v }) => { const d = exposed.useDebounce(v, 60); shown.push(d); return el('p', null, d); }; const view = await render(el(Probe, { v: '' })); for (const v of ['b', 'bo', 'boo']) { await view.rerender(el(Probe, { v })); await wait(15); } await wait(120); const distinct = [...new Set(shown)]; return JSON.stringify(distinct) === '["","boo"]' || `the debounced value went through ${JSON.stringify(distinct)}`; } },
        { label: 'pending timer cleared on unmount', mistake: 'The effect cleanup clears the timeout, which also runs on unmount.', check: async ({ render, el, exposed, window }) => { const active = new Set(); const s = window.setTimeout; const c = window.clearTimeout; window.setTimeout = (fn, ms, ...rest) => { if (ms !== 77) return s(fn, ms, ...rest); const id = s((...a) => { active.delete(id); fn(...a); }, ms, ...rest); active.add(id); return id; }; window.clearTimeout = (id) => { active.delete(id); return c(id); }; try { const Probe = ({ v }) => el('p', null, exposed.useDebounce(v, 77)); const view = await render(el(Probe, { v: 'x' })); await view.rerender(el(Probe, { v: 'xy' })); await view.unmount(); return active.size === 0 || `${active.size} timer(s) still pending after unmount`; } finally { window.setTimeout = s; window.clearTimeout = c; } } },
        { label: 'usePrevious lags one render', mistake: 'Store value in ref.current inside useEffect and return ref.current.', check: async ({ render, el, exposed }) => { const Probe = ({ v }) => el('p', null, `${v}|${String(exposed.usePrevious(v))}`); const view = await render(el(Probe, { v: 1 })); const a = view.text('p'); await view.rerender(el(Probe, { v: 5 })); const b = view.text('p'); await view.rerender(el(Probe, { v: 3 })); return JSON.stringify([a, b, view.text('p')]) === '["1|undefined","5|1","3|5"]' || `got ${JSON.stringify([a, b, view.text('p')])}`; } },
        { label: 'usePrevious causes no extra render', mistake: 'Use useRef, not useState: updating a ref does not re-render.', check: async ({ render, el, exposed }) => { let renders = 0; const Probe = ({ v }) => { renders += 1; exposed.usePrevious(v); return null; }; const view = await render(el(Probe, { v: 1 })); const afterMount = renders; await view.rerender(el(Probe, { v: 2 })); return (afterMount === 1 && renders === 2) || `${renders} renders for 1 mount + 1 update`; } },
        { label: 'ScoreTracker trend', mistake: 'Compare score with usePrevious(score): 📈 higher, 📉 lower, ➡️ same, nothing at first.', check: async ({ render, el, exposed }) => { const view = await render(el(exposed.ScoreTracker, { score: 5 })); const out = [view.text('p')]; for (const score of [8, 2, 2]) { await view.rerender(el(exposed.ScoreTracker, { score })); out.push(view.text('p')); } return JSON.stringify(out) === JSON.stringify(['Score: 5', 'Score: 8 📈', 'Score: 2 📉', 'Score: 2 ➡️']) || `got ${JSON.stringify(out)}`; } },
      ],
    },
    {
      id: 'custom-hooks-window',
      title: 'useWindowSize: a hook around a browser event',
      source: 'JavaScript & React course, Part 27.6; Part 21.5',
      runner: 'react',
      component: 'ResponsiveLayout',
      expose: ['useWindowSize'],
      teach: [
        'Any effect that subscribes to something outside React (a `window` event, a WebSocket, a timer) can be wrapped in a hook. Components then just read the value.',
        { code: 'function useWindowSize() {\n  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });\n  useEffect(() => {\n    function handleResize() {\n      setSize({ width: window.innerWidth, height: window.innerHeight });\n    }\n    window.addEventListener("resize", handleResize);\n    return () => window.removeEventListener("resize", handleResize);\n  }, []);\n  return size;\n}', lang: 'jsx' },
        { warn: '`removeEventListener` needs the **same function reference** that was added. An inline arrow in both calls creates two different functions and removes nothing: the listener (and the component it closes over) leaks.' },
        'The `[]` dependency array means subscribe on mount and unsubscribe on unmount. Each component that calls the hook gets its own listener and state.',
        { tip: 'For pure styling, CSS media queries are better than JavaScript. Use a hook like this when the **component tree** changes with the size, for example rendering a different navigation component.' },
      ],
      example: [
        { code: 'function ResponsiveLayout() {\n  const { width } = useWindowSize();\n  return width < 768 ? <MobileNav /> : <DesktopNav />;\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['Write `useWindowSize()` returning `{ width, height }`, updating on `resize` and removing its listener on unmount.', '`ResponsiveLayout` renders `<nav className="mobile-nav">Menu</nav>` below 768 px and `<nav className="desktop-nav">Home · Courses · Profile</nav>` otherwise, plus `<p className="size">{width} × {height}</p>`.'] },
      ],
      starter: `import { useState, useEffect } from "react";

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    window.addEventListener("resize", () => setSize({ width: window.innerWidth, height: window.innerHeight }));
  });
  return size;
}

function ResponsiveLayout() {
  return <nav className="desktop-nav">Home · Courses · Profile</nav>;
}
`,
      solution: `import { useState, useEffect } from "react";

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

function ResponsiveLayout() {
  const { width, height } = useWindowSize();
  return (
    <div>
      {width < 768 ? (
        <nav className="mobile-nav">Menu</nav>
      ) : (
        <nav className="desktop-nav">Home · Courses · Profile</nav>
      )}
      <p className="size">
        {width} × {height}
      </p>
    </div>
  );
}
`,
      checks: [
        { label: 'reports the current size', mistake: 'Start from { width: window.innerWidth, height: window.innerHeight }.', check: async ({ render, el, exposed, window }) => { const Probe = () => { const s = exposed.useWindowSize(); return el('p', null, `${s.width}x${s.height}`); }; const view = await render(el(Probe)); return view.text('p') === `${window.innerWidth}x${window.innerHeight}` || `showed ${view.text('p')}`; } },
        { label: 'updates on resize', mistake: 'Listen for "resize" on window and set the new size.', check: async ({ render, el, exposed, window, settle }) => { const d = Object.getOwnPropertyDescriptor(window, 'innerWidth'); try { const Probe = () => { const s = exposed.useWindowSize(); return el('p', null, String(s.width)); }; const view = await render(el(Probe)); Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 }); window.dispatchEvent(new Event('resize')); await settle(); return view.text('p') === '500' || `showed ${view.text('p')} after resizing to 500`; } finally { if (d) Object.defineProperty(window, 'innerWidth', d); else delete window.innerWidth; } } },
        { label: 'listener removed on unmount', mistake: 'Add the listener once ([] deps) and return () => window.removeEventListener("resize", handleResize) with the same function.', check: async ({ render, el, exposed, window }) => { const live = new Set(); const add = window.addEventListener; const remove = window.removeEventListener; window.addEventListener = function (type, fn, ...rest) { if (type === 'resize') live.add(fn); return add.call(this, type, fn, ...rest); }; window.removeEventListener = function (type, fn, ...rest) { if (type === 'resize') live.delete(fn); return remove.call(this, type, fn, ...rest); }; try { const Probe = ({ n }) => { exposed.useWindowSize(); return el('p', null, n); }; const view = await render(el(Probe, { n: 1 })); await view.rerender(el(Probe, { n: 2 })); await view.rerender(el(Probe, { n: 3 })); const mounted = live.size; await view.unmount(); return (mounted === 1 && live.size === 0) || `${mounted} resize listener(s) while mounted, ${live.size} after unmount`; } finally { window.addEventListener = add; window.removeEventListener = remove; } } },
        { label: 'layout switches at 768 px', mistake: 'Render the mobile nav when width < 768 and the desktop nav otherwise.', check: async ({ render, el, App, window, settle }) => { const d = Object.getOwnPropertyDescriptor(window, 'innerWidth'); const resize = async (w) => { Object.defineProperty(window, 'innerWidth', { configurable: true, value: w }); window.dispatchEvent(new Event('resize')); await settle(); }; try { Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 }); const view = await render(el(App)); const wide = Boolean(view.$('nav.desktop-nav')) && !view.$('nav.mobile-nav'); await resize(767); const narrow = Boolean(view.$('nav.mobile-nav')) && !view.$('nav.desktop-nav'); await resize(768); const edge = Boolean(view.$('nav.desktop-nav')); return (wide && narrow && edge) || `1024: ${wide ? 'ok' : 'wrong nav'}, 767: ${narrow ? 'ok' : 'wrong nav'}, 768: ${edge ? 'ok' : 'wrong nav'}`; } finally { if (d) Object.defineProperty(window, 'innerWidth', d); else delete window.innerWidth; } } },
        { label: 'shows the size', mistake: 'Render <p className="size">{width} × {height}</p>.', check: ({ text, window }) => text('.size') === `${window.innerWidth} × ${window.innerHeight}` || `showed "${text('.size')}"` },
      ],
    },
  ],
};
