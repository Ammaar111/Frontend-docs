// JavaScript & React course, the final React assessment and the "build it yourself" challenge.
import { mockApi } from '../shared/mock-api.js';

const searchApi = mockApi({
  'GET /api/products?q=mouse': { body: [{ id: 1, name: 'Wireless mouse' }, { id: 2, name: 'Gaming mouse' }], delay: 40 },
  'GET /api/products?q=lamp': { body: [{ id: 3, name: 'Desk lamp' }], delay: 40 },
});

const usersApi = mockApi({
  'GET /api/users/1': { body: { id: 1, name: 'Ammaar' }, delay: 20 },
  'GET /api/users/2': { body: { id: 2, name: 'Priya' }, delay: 20 },
});

export default {
  id: 'react-final',
  title: 'Final React assessment',
  lessons: [
    {
      id: 'react-final-theory',
      title: 'Section A: theory',
      source: 'JavaScript & React course, final React assessment, section A',
      runner: 'quiz',
      teach: [
        'A checkpoint across everything from JSX to the capstone. If several questions feel shaky, revisit the lesson named in the explanation before moving on: that is the honest use of an assessment.',
        { list: ['State updates are scheduled and read from the current render\'s closure; functional updates chain.', 'Keys identify items across renders; index keys break on reorder.', 'Hooks are matched by call order.', 'Effects synchronise with the outside world; cleanups undo them.', 'Context avoids prop drilling but is not a replacement for props.', 'Memoization is an optimisation that needs stable references.', 'Boundaries catch render errors only.', 'JSX escapes text; `dangerouslySetInnerHTML` does not.'] },
      ],
      example: [
        { code: 'setCount(count + 1);\nsetCount(count + 1);          // both read the same count → +1\n\nsetCount((c) => c + 1);\nsetCount((c) => c + 1);       // chained → +2', lang: 'jsx' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Why does calling `setCount(count + 1)` twice in one handler add only 1?', options: ['React ignores the second call', 'Both calls read the same `count` from this render\'s closure', 'setState is asynchronous so the second call fails', 'It adds 2'], answer: 1, explain: 'Use `setCount((c) => c + 1)` so each update receives the latest pending value.' },
        { q: 'What goes wrong with index keys in a list that can be reordered?', options: ['Nothing', 'React matches DOM nodes and their state to the wrong items', 'It throws an error', 'The list renders twice'], answer: 1, explain: 'Keys must identify the data, e.g. an id.' },
        { q: '"UI is a function of state" means…', options: ['You write the steps to change the DOM', 'You describe the UI for a given state and React updates the DOM to match', 'State is stored in the DOM', 'Functions cannot have state'], answer: 1, explain: 'Declarative rendering, versus imperative DOM manipulation.' },
        { q: 'Why does a hook inside an `if` break React?', options: ['Syntax error', 'React matches hooks to their state by call order, which then changes between renders', 'Hooks are slow in conditions', 'It only breaks in production'], answer: 1, explain: 'Every later hook reads the wrong slot.' },
        { q: '`useEffect(fn)` with **no** dependency array runs…', options: ['Once', 'After every render', 'Never', 'Only on unmount'], answer: 1, explain: '`[]` = once after mount; `[x]` = when x changes.' },
        { q: 'Which needs an effect cleanup?', options: ['Computing a total', 'A `setInterval` or a `fetch` that may be superseded', 'Rendering a list', 'Reading props'], answer: 1, explain: 'Cleanups stop timers, listeners and requests.' },
        { q: 'The complete fix for search-as-you-type races is…', options: ['Debounce only', 'Debounce to send fewer requests and abort superseded ones', 'A bigger timeout', 'useMemo'], answer: 1, explain: 'Debouncing alone still lets a slow older response win.' },
        { q: 'When is Context the right tool?', options: ['Always instead of props', 'When many components at different depths need a value and intermediate ones do not', 'For every piece of state', 'Only for themes'], answer: 1, explain: 'One or two levels down, plain props are clearer.' },
        { q: 'Prefer `useReducer` over several `useState`s when…', options: ['There is one boolean', 'One piece of state has several related kinds of updates with real logic', 'You need performance', 'Always'], answer: 1, explain: 'A reducer puts every transition rule in one pure function.' },
        { q: 'A `memo`-wrapped child still re-renders on every parent render because…', options: ['memo is broken', 'It receives an inline function/object prop, which is a new reference each render', 'Children always re-render', 'It uses state'], answer: 1, explain: 'Pair memo with useCallback / useMemo for those props.' },
        { q: 'Which error does an error boundary catch?', options: ['A throw in an onClick handler', 'A rejected promise', 'A component throwing while rendering', 'An error in setTimeout'], answer: 2, explain: 'Handlers and async code need try/catch.' },
        { q: 'What removes JSX\'s XSS protection?', options: ['Using {value}', 'dangerouslySetInnerHTML', 'className', 'Fragments'], answer: 1, explain: 'Only use it with sanitized or trusted HTML.' },
        { q: 'An HttpOnly cookie token, compared with localStorage, is…', options: ['Readable by scripts but CSRF-proof', 'Invisible to scripts (XSS cannot read it) but sent automatically (CSRF risk)', 'Identical', 'Less secure in every way'], answer: 1, explain: 'Each choice trades one risk for another.' },
        { q: 'Serving index.html for unknown paths fixes…', options: ['Slow builds', 'The 404 on a direct visit or reload of a client-side route', 'XSS', 'CORS'], answer: 1, explain: 'The router can only take over once index.html has loaded.' },
        { q: 'When should logic be a plain function instead of a custom hook?', options: ['Never', 'When it uses no hooks (pure logic such as formatting or validation)', 'When it is long', 'When it fetches'], answer: 1, explain: 'A hook ties code to React; pure functions stay reusable and easy to test.' },
      ],
    },
    {
      id: 'react-final-hooks',
      title: 'Section B, tasks 1–4 and 6: state, effects and lists',
      source: 'JavaScript & React course, final React assessment, section B',
      runner: 'react',
      component: null,
      expose: ['useToggle', 'Counter', 'Timer', 'UserList', 'UserProfile'],
      setup: usersApi + '\nconst TICK_MS = 40; // 1000 in a real app; short here so checks run quickly',
      teach: [
        'Five short tasks, each one testing one rule you have used many times. Write each without looking back first.',
        { list: ['`useToggle`: a custom hook is just a function that calls hooks and returns a small interface.', 'Batching: repeated updates in one handler need the functional form.', 'Intervals: functional update inside, cleanup on unmount, `[]` dependencies.', 'Selection: compare ids to decide the class, update on click.', 'Effects: every value from the component used inside belongs in the dependency array.'] },
      ],
      example: [
        { code: 'useEffect(() => {\n  const id = setInterval(() => setSeconds((s) => s + 1), TICK_MS);\n  return () => clearInterval(id);\n}, []);', lang: 'jsx' },
      ],
      task: [
        { ol: ['`useToggle(initial = false)` → `[value, toggle]`.', 'Fix `Counter` so `Add 3` adds 3.', '`Timer` shows `<p>Elapsed: Ns</p>`, adding 1 every `TICK_MS`, and clears its interval on unmount.', '`UserList({ users })` renders `li`s; clicking one selects it (class `selected`; only one at a time).', 'Fix `UserProfile({ userId })` so it reloads when `userId` changes (and ignores stale responses).'] },
      ],
      starter: `import { useState, useEffect } from "react";

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  return [value, () => setValue(true)];
}

function Counter() {
  const [count, setCount] = useState(0);
  function handleAddThree() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={handleAddThree}>Count: {count}</button>;
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    setInterval(() => setSeconds(seconds + 1), TICK_MS);
  }, []);
  return <p>Elapsed: {seconds}s</p>;
}

function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`).then((res) => res.json()).then(setUser);
  }, []);
  return <p>{user?.name}</p>;
}
`,
      solution: `import { useState, useEffect } from "react";

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

function Counter() {
  const [count, setCount] = useState(0);
  function handleAddThree() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }
  return <button onClick={handleAddThree}>Count: {count}</button>;
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);
  return <p>Elapsed: {seconds}s</p>;
}

function UserList({ users }) {
  const [selectedId, setSelectedId] = useState(null);
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} className={user.id === selectedId ? "selected" : ""} onClick={() => setSelectedId(user.id)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setUser(data);
      });
    return () => {
      ignore = true;
    };
  }, [userId]);
  return <p>{user?.name}</p>;
}
`,
      checks: [
        { label: 'useToggle flips', mistake: 'toggle should be () => setValue((v) => !v).', check: async ({ render, el, exposed, click }) => { const Probe = () => { const [on, toggle] = exposed.useToggle(); return el('button', { onClick: toggle }, on ? 'on' : 'off'); }; const view = await render(el(Probe)); const seen = [view.text('button')]; await click(view.$('button')); seen.push(view.text('button')); await click(view.$('button')); seen.push(view.text('button')); return JSON.stringify(seen) === '["off","on","off"]' || `went ${JSON.stringify(seen)}`; } },
        { label: 'Add 3 adds 3', mistake: 'Use the functional form: setCount((c) => c + 1) three times.', check: async ({ render, el, exposed, click }) => { const view = await render(el(exposed.Counter)); await click(view.$('button')); await click(view.$('button')); return view.text('button') === 'Count: 6' || `after two clicks: "${view.text('button')}"`; } },
        { label: 'Timer counts', mistake: 'Use setSeconds((s) => s + 1) in the interval; a stale `seconds` stays at 1.', check: async ({ render, el, exposed, waitFor }) => { const view = await render(el(exposed.Timer)); const ok = await waitFor(() => Number(view.text('p').match(/\d+/)?.[0]) >= 3); return ok || `shows "${view.text('p')}"`; } },
        { label: 'Timer cleans up', mistake: 'Return () => clearInterval(id) from the effect.', check: async ({ render, el, exposed, window, wait }) => { const active = new Set(); const s = window.setInterval; const c = window.clearInterval; window.setInterval = (...a) => { const id = s(...a); active.add(id); return id; }; window.clearInterval = (id) => { active.delete(id); return c(id); }; try { const view = await render(el(exposed.Timer)); await wait(20); await view.unmount(); return active.size === 0 || `${active.size} interval(s) still running`; } finally { window.setInterval = s; window.clearInterval = c; } } },
        { label: 'one selected user', mistake: 'Store selectedId; give the matching li className="selected" and update it on click.', check: async ({ render, el, exposed, click }) => { const users = [{ id: 1, name: 'Ammaar' }, { id: 2, name: 'Priya' }, { id: 3, name: 'Rohan' }]; const view = await render(el(exposed.UserList, { users })); await click(view.$$('li')[1]); await click(view.$$('li')[2]); const selected = view.$$('li.selected').map((li) => li.textContent); return JSON.stringify(selected) === '["Rohan"]' || `selected ${JSON.stringify(selected)}`; } },
        { label: 'profile follows userId', mistake: 'Put userId in the dependency array (and ignore stale responses in the cleanup).', check: async ({ render, el, exposed, waitFor }) => { const view = await render(el(exposed.UserProfile, { userId: 1 })); await waitFor(() => view.text('p') === 'Ammaar'); await view.rerender(el(exposed.UserProfile, { userId: 2 })); const ok = await waitFor(() => view.text('p') === 'Priya'); return ok || `after switching to user 2 it shows "${view.text('p')}"`; } },
      ],
    },
    {
      id: 'react-final-patterns',
      title: 'Section B, tasks 7–10: context, reducers, boundaries, routes',
      source: 'JavaScript & React course, final React assessment, section B',
      runner: 'react',
      expose: ['CartProvider', 'useCart', 'formReducer', 'ErrorBoundary', 'ProtectedRoute', 'AuthContext'],
      teach: [
        'Four patterns, each with a classic mistake:',
        { table: { head: ['Pattern', 'Classic mistake'], rows: [['Context with a derived value', 'storing `total` in state and forgetting to update it'], ['Reducer with computed keys', 'mutating `state[action.field] = value`'], ['Error boundary with a fallback prop', 'writing it as a function component (impossible)'], ['Protected route', 'redirecting without `replace`, so Back loops']] } },
        { code: 'const total = items.reduce((sum, item) => sum + item.price, 0);   // derived on every render, never stale', lang: 'jsx' },
      ],
      example: [
        { code: 'function useCart() {\n  const context = useContext(CartContext);\n  if (!context) throw new Error("useCart must be used within a CartProvider");\n  return context;\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['`CartContext` with `CartProvider` and `useCart()` exposing `items`, `addItem(product)` and a derived `total`; `useCart` outside the provider throws `useCart must be used within a CartProvider`.', '`formReducer(state, action)`: `UPDATE_FIELD` (`{ field, value }`) and `RESET` (back to `{ name: "", email: "" }`); unknown actions throw `Unknown action: <type>`.', '`ErrorBoundary` class rendering `this.props.fallback` after a render error.', '`AuthContext` (value `{ isLoggedIn }`) and `ProtectedRoute({ children })` rendering children or `<Navigate to="/login" replace />`.', '`App` (given) wires them into routes.'] },
      ],
      starter: `import { createContext, useContext, useState, Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const CartContext = createContext();

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const addItem = (product) => items.push(product);
  return <CartContext.Provider value={{ items, addItem, total }}>{children}</CartContext.Provider>;
}

function useCart() {
  return useContext(CartContext);
}

function formReducer(state, action) {
  state[action.field] = action.value;
  return state;
}

const AuthContext = createContext({ isLoggedIn: false });

function ProtectedRoute({ children }) {
  return children;
}

function ErrorBoundary({ fallback, children }) {
  return children;
}

export default function App() {
  return (
    <AuthContext.Provider value={{ isLoggedIn: false }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/" element={<ProtectedRoute><h1>Dashboard</h1></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
`,
      solution: `import { createContext, useContext, useState, Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (product) => setItems((prev) => [...prev, product]);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <CartContext.Provider value={{ items, addItem, total }}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

const initialForm = { name: "", email: "" };

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialForm;
    default:
      throw new Error(\`Unknown action: \${action.type}\`);
  }
}

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const AuthContext = createContext({ isLoggedIn: false });

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthContext.Provider value={{ isLoggedIn: false }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/" element={<ProtectedRoute><h1>Dashboard</h1></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
`,
      checks: [
        { label: 'cart context with a derived total', mistake: 'addItem should use setItems((prev) => [...prev, product]); total = items.reduce(...) on every render.', check: async ({ render, el, exposed, click }) => { const Shop = () => { const { items, addItem, total } = exposed.useCart(); return el('div', null, el('button', { onClick: () => addItem({ id: items.length + 1, price: 250 }) }, 'Add'), el('p', null, `${items.length}|${total}`)); }; const view = await render(el(exposed.CartProvider, null, el(Shop))); await click(view.$('button')); await click(view.$('button')); return view.text('p') === '2|500' || `after two adds: "${view.text('p')}"`; } },
        { label: 'useCart guards its provider', mistake: 'Create the context with null and throw "useCart must be used within a CartProvider" when it is missing.', check: async ({ render, el, exposed }) => { let message = 'no error'; const Probe = () => { try { exposed.useCart(); } catch (err) { message = err.message; } return null; }; await render(el(Probe)); return message === 'useCart must be used within a CartProvider' || `got "${message}"`; } },
        { label: 'formReducer', mistake: 'Return { ...state, [action.field]: action.value }; RESET returns the empty form; unknown types throw.', check: ({ exposed }) => { const r = exposed.formReducer; const s = Object.freeze({ name: '', email: '' }); try { const a = r(s, { type: 'UPDATE_FIELD', field: 'email', value: 'a@b.co' }); const b = r(a, { type: 'RESET' }); let thrown = 'no error'; try { r(s, { type: 'NOPE' }); } catch (err) { thrown = err.message; } return (a.email === 'a@b.co' && s.email === '' && b.email === '' && thrown === 'Unknown action: NOPE') || `got ${JSON.stringify([a, b, thrown])}`; } catch (err) { return `it threw ${err.message} (mutating frozen state?)`; } } },
        { label: 'error boundary with a fallback prop', mistake: 'A class with static getDerivedStateFromError that renders this.props.fallback.', check: async ({ render, el, exposed }) => { const Bomb = () => { throw new Error('kaboom'); }; const view = await render(el(exposed.ErrorBoundary, { fallback: el('p', { className: 'fb' }, 'Oops') }, el(Bomb))); return view.text('.fb') === 'Oops' || `shows "${view.text()}"`; } },
        { label: 'protected route redirects', mistake: 'Read isLoggedIn from AuthContext and return <Navigate to="/login" replace /> when false.', check: async ({ render, el, App }) => { const view = await render(el(App), { path: '/' }); return view.text('h1') === 'Login' || `"/" shows "${view.text()}"`; } },
        { label: 'protected route lets members in', mistake: 'When isLoggedIn is true, render children.', check: async ({ render, el, exposed }) => { const view = await render(el(exposed.AuthContext.Provider, { value: { isLoggedIn: true } }, el(exposed.ProtectedRoute, null, el('h1', null, 'Secret')))); return view.text('h1') === 'Secret' || `shows "${view.text()}"`; } },
      ],
    },
    {
      id: 'react-final-debug',
      title: 'Section C: debugging challenge',
      source: 'JavaScript & React course, final React assessment, section C',
      runner: 'react',
      component: 'ProductSearch',
      setup: searchApi,
      teach: [
        'The component below should search products as the user types (debounced 300 ms) and show results. It has **four** bugs. Find them by reading before running anything: say what each line does, not what it was meant to do.',
        { list: ['What runs this effect, and how often?', 'What happens to a timer that was scheduled but is no longer wanted?', 'How does React learn that `query` changed?', 'What does React need to track list items?'] },
        { warn: 'The course\'s corrected version creates an `AbortController` inside the timeout but never calls `abort()`, so it protects nothing, and it never resets `loading` on failure. Fix those too: the cleanup must clear the timer **and** abort the request.' },
      ],
      example: [
        { code: 'useEffect(() => {\n  const timeoutId = setTimeout(() => { /* fetch */ }, 300);\n  return () => clearTimeout(timeoutId);\n}, [query]);', lang: 'jsx' },
      ],
      task: [
        'Fix all four bugs, plus the abort and loading issues. Keep the markup: an input, `<p>Loading...</p>` while loading, and a `<ul>` of names. An empty query shows no results and makes no request. `/api/products?q=<query>` returns `[{ id, name }]`.',
      ],
      starter: `import { useState, useEffect } from "react";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      fetch(\`/api/products?q=\${query}\`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        });
    }, 300);
  });

  return (
    <div>
      <input value={query} onChange={(e) => (query = e.target.value)} />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((product) => (
          <li>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
`,
      solution: `import { useState, useEffect } from "react";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      setLoading(true);
      fetch(\`/api/products?q=\${encodeURIComponent(trimmed)}\`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
          return res.json();
        })
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") setLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
`,
      checks: [
        { label: 'typing updates the input (bug 3)', mistake: 'Use setQuery(e.target.value); assigning to query does nothing (and throws for a const).', check: async ({ type, $, errors }) => { const before = errors.length; await type('input', 'mo'); return ($('input').value === 'mo' && errors.length === before) || (errors.length > before ? `typing threw ${errors[errors.length - 1]}` : `input shows "${$('input').value}"`); } },
        { label: 'no request loop (bug 1)', mistake: 'Add [query] as the dependency array; without it the effect re-runs after every render, forever.', check: async ({ type, wait, window }) => { await type('input', 'lamp'); await wait(900); const count = window.__requests.filter((r) => r.url === '/api/products?q=lamp').length; return count === 1 || `"/api/products?q=lamp" was requested ${count} times`; } },
        { label: 'debounced: one request per pause (bug 2)', mistake: 'Return () => clearTimeout(timeoutId) so each keystroke cancels the previous timer.', check: async ({ type, waitFor, $$, window }) => { const start = window.__requests.length; for (const v of ['m', 'mo', 'mou', 'mous', 'mouse']) await type('input', v); await waitFor(() => $$('li').length === 2, 2000); const urls = window.__requests.slice(start).map((r) => r.url); return JSON.stringify(urls) === '["/api/products?q=mouse"]' || `requests: ${JSON.stringify(urls)}`; } },
        { label: 'results render with keys (bug 4)', mistake: 'Give each <li> key={product.id}.', check: async ({ type, waitFor, $$, source }) => { await type('input', 'mouse'); const ok = await waitFor(() => $$('li').length === 2, 2000); return (ok && /<li\s+key=\{product\.id\}/.test(source)) || (ok ? 'the <li> has no key={product.id}' : 'results did not appear'); } },
        { label: 'loading indicator', mistake: 'Show Loading... while the request is in flight and hide it afterwards.', check: async ({ type, waitFor, text, $$ }) => { await type('input', 'lamp'); const shown = await waitFor(() => text().includes('Loading...'), 1500); const done = await waitFor(() => !text().includes('Loading...') && $$('li').length === 1, 1500); return (shown && done) || `loading shown ${shown}, finished ${done}`; } },
        { label: 'superseded requests are aborted', mistake: 'Create the AbortController in the effect, pass its signal, and abort it in the cleanup.', check: async ({ type, wait, waitFor, $$, window }) => { window.__api.delays['GET /api/products?q=mouse'] = 600; try { const start = window.__requests.length; await type('input', 'mouse'); await wait(450); await type('input', 'lamp'); await waitFor(() => $$('li').length === 1 && $$('li')[0].textContent === 'Desk lamp', 2000); await wait(500); const mouse = window.__requests.slice(start).find((r) => r.url === '/api/products?q=mouse'); return (mouse?.aborted && $$('li')[0]?.textContent === 'Desk lamp') || `mouse request aborted: ${mouse?.aborted}; list ${JSON.stringify($$('li').map((li) => li.textContent))}`; } finally { delete window.__api.delays['GET /api/products?q=mouse']; } } },
        { label: 'empty query, no request', mistake: 'When the query is empty, clear the results and skip the request.', check: async ({ type, waitFor, $$, wait, window }) => { await type('input', 'lamp'); await waitFor(() => $$('li').length === 1, 1500); const start = window.__requests.length; await type('input', ''); await wait(450); return ($$('li').length === 0 && window.__requests.length === start) || `${$$('li').length} results, ${window.__requests.length - start} request(s)`; } },
      ],
    },
    {
      id: 'react-final-mini-project',
      title: 'Section D: recipe favourites',
      source: 'JavaScript & React course, final React assessment, section D',
      runner: 'react',
      expose: ['favoritesReducer', 'initFavorites'],
      teach: [
        'Spec: a searchable recipe list where each recipe has a favourite toggle; favourites persist and have their own route with an empty state. Use `useReducer` for the favourites and React Router for the two views.',
        { h: 'A better design than the course\'s' },
        'The course keeps favourites in `useLocalStorage` **and** in `useReducer`, then copies one into the other with an effect: two sources of truth, an extra render on every change, and a sync effect that is easy to break. One reducer is enough:',
        { code: 'function initFavorites(key) {\n  try {\n    const saved = JSON.parse(localStorage.getItem(key));\n    return Array.isArray(saved) ? saved : [];\n  } catch {\n    return [];\n  }\n}\n\nconst [favorites, dispatch] = useReducer(favoritesReducer, "favoriteRecipeIds", initFavorites);\nuseEffect(() => localStorage.setItem("favoriteRecipeIds", JSON.stringify(favorites)), [favorites]);', lang: 'jsx' },
        { list: ['`ADD` is idempotent (adding twice keeps one copy); `TOGGLE` reads naturally in the UI.', 'The heart button needs an accessible name and state: `aria-pressed={isFavorite}` and `aria-label="Favourite Chicken Tikka"`.', 'The favourites state lives above `<Routes>` so both views share it.'] },
      ],
      example: [
        { code: '<button aria-pressed={isFavorite} aria-label={`Favourite ${recipe.name}`} onClick={() => dispatch({ type: "TOGGLE", payload: recipe.id })}>\n  {isFavorite ? "♥" : "♡"}\n</button>', lang: 'jsx' },
      ],
      task: [
        { ol: ['`favoritesReducer(favorites, action)`: `ADD` (no duplicates), `REMOVE`, `TOGGLE`; unknown actions throw `Unknown action: <type>`.', '`initFavorites(key)` reads and validates the saved id array.', '`App`: a nav with `Link`s `All recipes` (`/`) and `Favourites` (`/favorites`). On `/`: `input[aria-label="Search recipes"]` filtering `li.recipe`s, each with a heart button (`aria-label="Favourite <name>"`, `aria-pressed`). On `/favorites`: the favourite names as `li`s, or `No favourites yet.`', 'Persist to `"favoriteRecipeIds"`.'] },
      ],
      starter: `import { useState, useReducer } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const RECIPES = [
  { id: 1, name: "Pasta Primavera" },
  { id: 2, name: "Chicken Tikka" },
  { id: 3, name: "Veggie Stir Fry" },
  { id: 4, name: "Masala Dosa" },
];

function favoritesReducer(favorites, action) {
  return favorites;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ul>{RECIPES.map((r) => <li key={r.id} className="recipe">{r.name}</li>)}</ul>} />
      </Routes>
    </BrowserRouter>
  );
}
`,
      solution: `import { useState, useReducer, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const RECIPES = [
  { id: 1, name: "Pasta Primavera" },
  { id: 2, name: "Chicken Tikka" },
  { id: 3, name: "Veggie Stir Fry" },
  { id: 4, name: "Masala Dosa" },
];
const STORAGE_KEY = "favoriteRecipeIds";

function favoritesReducer(favorites, action) {
  switch (action.type) {
    case "ADD":
      return favorites.includes(action.payload) ? favorites : [...favorites, action.payload];
    case "REMOVE":
      return favorites.filter((id) => id !== action.payload);
    case "TOGGLE":
      return favorites.includes(action.payload)
        ? favorites.filter((id) => id !== action.payload)
        : [...favorites, action.payload];
    default:
      throw new Error(\`Unknown action: \${action.type}\`);
  }
}

function initFavorites(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function RecipeList({ favorites, dispatch }) {
  const [query, setQuery] = useState("");
  const visible = RECIPES.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div>
      <input aria-label="Search recipes" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {visible.map((recipe) => {
          const isFavorite = favorites.includes(recipe.id);
          return (
            <li key={recipe.id} className="recipe">
              {recipe.name}
              <button
                aria-pressed={isFavorite}
                aria-label={\`Favourite \${recipe.name}\`}
                onClick={() => dispatch({ type: "TOGGLE", payload: recipe.id })}
              >
                {isFavorite ? "♥" : "♡"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FavoritesPage({ favorites }) {
  const items = RECIPES.filter((r) => favorites.includes(r.id));
  if (items.length === 0) return <p>No favourites yet.</p>;
  return (
    <ul className="favorites">
      {items.map((r) => (
        <li key={r.id}>{r.name}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const [favorites, dispatch] = useReducer(favoritesReducer, STORAGE_KEY, initFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">All recipes</Link> <Link to="/favorites">Favourites</Link>
      </nav>
      <Routes>
        <Route path="/" element={<RecipeList favorites={favorites} dispatch={dispatch} />} />
        <Route path="/favorites" element={<FavoritesPage favorites={favorites} />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
      checks: [
        { label: 'reducer actions', mistake: 'ADD without duplicates, REMOVE by id, TOGGLE both ways, and throw on unknown actions.', check: ({ exposed }) => { const r = exposed.favoritesReducer; const s = Object.freeze([1]); try { const out = [r(s, { type: 'ADD', payload: 1 }), r(s, { type: 'ADD', payload: 2 }), r(s, { type: 'REMOVE', payload: 1 }), r(s, { type: 'TOGGLE', payload: 1 }), r(s, { type: 'TOGGLE', payload: 3 })]; let thrown = 'no error'; try { r(s, { type: 'X' }); } catch (err) { thrown = err.message; } return (JSON.stringify(out) === '[[1],[1,2],[],[],[1,3]]' && out[0] === s && thrown === 'Unknown action: X') || `got ${JSON.stringify(out)}, ${thrown}`; } catch (err) { return `it threw ${err.message}`; } } },
        { label: 'initFavorites', mistake: 'Return the saved array, or [] for missing, broken or non-array data.', check: ({ exposed, storage }) => { storage.setItem('fa', '[2,4]'); storage.setItem('fb', 'oops'); storage.setItem('fc', '{"x":1}'); const out = [exposed.initFavorites('fa'), exposed.initFavorites('fb'), exposed.initFavorites('fc'), exposed.initFavorites('none')]; return JSON.stringify(out) === '[[2,4],[],[],[]]' || `got ${JSON.stringify(out)}`; } },
        { label: 'search and toggle', mistake: 'Filter li.recipe by the search box; the heart button toggles aria-pressed.', check: async ({ render, el, App, storage, type, click }) => { storage.clear(); const view = await render(el(App), { path: '/' }); await type(view.$('input[aria-label="Search recipes"]'), 'TIKKA'); const names = view.$$('li.recipe').map((li) => li.firstChild?.textContent); const heart = view.$('button[aria-label="Favourite Chicken Tikka"]'); if (!heart) return 'no "Favourite Chicken Tikka" button'; await click(heart); const pressed = heart.getAttribute('aria-pressed'); return (JSON.stringify(names) === '["Chicken Tikka"]' && pressed === 'true') || `names ${JSON.stringify(names)}, aria-pressed ${pressed}`; } },
        { label: 'favourites route and empty state', mistake: 'Keep favourites above <Routes>; /favorites lists them or says "No favourites yet."', check: async ({ render, el, App, storage, click }) => { storage.clear(); const empty = await render(el(App), { path: '/favorites' }); const emptyText = empty.text('p'); const view = await render(el(App), { path: '/' }); await click(view.$('button[aria-label="Favourite Masala Dosa"]')); await click(view.$$('nav a').find((a) => a.textContent === 'Favourites')); const listed = view.$$('li').map((li) => li.textContent); return (emptyText === 'No favourites yet.' && JSON.stringify(listed) === '["Masala Dosa"]') || `empty "${emptyText}", listed ${JSON.stringify(listed)}`; } },
        { label: 'persists', mistake: 'Load with useReducer(favoritesReducer, key, initFavorites) and save in an effect.', check: async ({ render, el, App, storage, click }) => { storage.clear(); storage.setItem('favoriteRecipeIds', '[3]'); const view = await render(el(App), { path: '/' }); const restored = view.$('button[aria-label="Favourite Veggie Stir Fry"]')?.getAttribute('aria-pressed'); await click(view.$('button[aria-label="Favourite Pasta Primavera"]')); return (restored === 'true' && storage.getItem('favoriteRecipeIds') === '[3,1]') || `restored ${restored}, saved ${storage.getItem('favoriteRecipeIds')}`; } },
      ],
    },
    {
      id: 'common-errors',
      title: 'Common errors and what they mean',
      source: 'JavaScript & React course, common errors; final learning roadmap',
      runner: 'quiz',
      teach: [
        'Never treat an error message as magic to make go away. Each one says something precise about the mechanism.',
        { table: { head: ['Message', 'What it means'], rows: [
          ['`Cannot read properties of undefined (reading \'x\')`', 'the object is not there (data not loaded yet, a typo, a missing return)'],
          ['`Cannot read properties of null`', 'specifically null: often `querySelector` found nothing, or a "no data yet" state read too early'],
          ['`x is not defined`', 'never declared in reach, or used before its `let`/`const` line (TDZ)'],
          ['`Unexpected token`', 'invalid syntax: a missing bracket, comma or quote'],
          ['`Maximum call stack size exceeded`', 'recursion without a working base case'],
          ['`NaN` appears', 'arithmetic on something that is not a number; check with `Number.isNaN`'],
          ['`Unhandled promise rejection`', 'a rejected promise with no `.catch` or `try/catch` around `await`'],
          ['`AbortError`', 'you cancelled the request on purpose: ignore it'],
          ['`Failed to fetch`', 'no response at all: offline, DNS, CORS block, server down'],
          ['`No \'Access-Control-Allow-Origin\' header`', 'the server does not allow your origin; fix it on the server'],
          ['`Unexpected token < in JSON`', '`response.json()` on an HTML page: usually a wrong URL'],
          ['`Too many re-renders`', 'a setter called during render, e.g. `onClick={setX(1)}`'],
          ['`Rendered more hooks than during the previous render`', 'a hook called conditionally'],
          ['`Each child in a list should have a unique "key"`', 'missing `key` in a `.map()`'],
          ['`changing an uncontrolled input to be controlled`', '`value` started as `undefined`; initialise with `""`'],
          ['`Objects are not valid as a React child`', 'rendering a plain object; render its fields'],
          ['`Invalid hook call`', 'a hook outside a component or custom hook'],
        ] } },
        { h: 'What to learn next' },
        { ol: ['A real backend (any language) with a real database: the other half of every API decision you made here.', 'TanStack Query for server state, now that you know what it automates.', 'TypeScript on a real project, continuously.', 'A broader testing habit, prioritised by risk.', 'A state library only when Context genuinely strains.'] },
      ],
      example: [
        { code: '// Too many re-renders: the setter runs during render\n<button onClick={setOpen(true)}>Open</button>\n\n// Correct: pass a function\n<button onClick={() => setOpen(true)}>Open</button>', lang: 'jsx' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: '`Cannot read properties of null (reading \'addEventListener\')` right after `document.querySelector("#btn")` most likely means…', options: ['addEventListener is misspelled', 'No element matched #btn (wrong id, or the script ran before the element existed)', 'The browser is old', 'The event name is wrong'], answer: 1, explain: 'querySelector returns null when nothing matches.' },
        { q: '`Unexpected token < in JSON at position 0` usually means…', options: ['The JSON has a typo', 'The response was HTML (an error page), often from a wrong URL', 'The server is down', 'CORS'], answer: 1, explain: '`<` is the start of `<!DOCTYPE html>`.' },
        { q: 'React says "Too many re-renders". The likely cause:', options: ['A missing key', 'Calling a state setter during render, e.g. onClick={setX(1)}', 'Too many components', 'A slow effect'], answer: 1, explain: 'Pass a function: onClick={() => setX(1)}.' },
        { q: '`Failed to fetch` versus a 404 response:', options: ['The same thing', 'Failed to fetch means no response arrived; a 404 is a response with an error status', '404 means offline', 'Failed to fetch means 500'], answer: 1, explain: 'fetch rejects only when there is no response.' },
        { q: 'A CORS error appears when calling another domain\'s API. The fix is…', options: ['Add mode: "no-cors"', 'Configure the server to allow your origin (or call it from your own server)', 'Disable CORS in the code', 'Use XMLHttpRequest'], answer: 1, explain: 'CORS is decided by the server\'s response headers.' },
        { q: '"A component is changing an uncontrolled input to be controlled" comes from…', options: ['useState(undefined) for an input value that later becomes a string', 'Using onChange', 'Missing a label', 'A form without onSubmit'], answer: 0, explain: 'Initialise controlled inputs with "".' },
        { q: 'An `AbortError` in your logs after typing quickly in a search box is…', options: ['A bug to fix', 'Expected: superseded requests were cancelled; check err.name and ignore it', 'A network failure', 'A CORS issue'], answer: 1, explain: 'It is the race-condition protection working.' },
        { q: '`Rendered more hooks than during the previous render` means…', options: ['Too many components', 'A hook call depends on a condition or loop', 'A missing dependency', 'Hooks are imported twice'], answer: 1, explain: 'The rules of hooks: same hooks, same order, every render.' },
      ],
    },
    {
      id: 'react-final-taskflow',
      title: 'Build it yourself: TaskFlow',
      source: 'JavaScript & React course, the final "build it yourself" challenge',
      runner: 'react',
      component: 'DashboardPage',
      expose: ['toLocalDateString', 'getTasksDueToday', 'getOverdueTasks', 'getTaskCountByProject', 'sortTasks', 'taskService', 'projectService'],
      teach: [
        'The last project gives only a spec. **TaskFlow**: tasks (title, optional description, due date, priority low/medium/high) in projects (with a "No Project" bucket); complete, edit, delete; a dashboard of due-today and overdue tasks and counts per project; a filterable, sortable project view; persistence **shaped like an API** so a real backend replaces one layer; keyboard and semantic markup; deleting a project moves its tasks to "No Project"; loading/error discipline everywhere.',
        { h: 'Decision 1: a fake API with real latency' },
        { code: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nconst taskService = {\n  async getTasks(filters = {}) {\n    await wait(30);                    // without latency, loading states are never really exercised\n    let tasks = readTasks();\n    if (filters.projectId !== undefined) tasks = tasks.filter((t) => t.projectId === filters.projectId);\n    return tasks;\n  },\n  // createTask, updateTask, deleteTask: same shape\n};', lang: 'jsx' },
        { h: 'Decision 2: integrity rules live in the service' },
        '`projectService.deleteProject(id)` reassigns that project\'s tasks to `projectId: null` **before** removing the project, so every caller (today\'s button, tomorrow\'s bulk delete) gets the rule for free.',
        { h: 'Decision 3: dates, and a bug in the reference' },
        'The reference compares `new Date(t.dueDate) < now`. A due date of today (`"2026-10-24"`) parses as **midnight UTC**, which is already in the past, so every task due today is also reported overdue. Worse, west of UTC that midnight is still yesterday locally. Store due dates as `"YYYY-MM-DD"` strings and compare them with today\'s **local** date string: ISO date strings sort correctly as plain strings.',
        { code: 'function toLocalDateString(date = new Date()) {\n  const y = date.getFullYear();\n  const m = String(date.getMonth() + 1).padStart(2, "0");\n  const d = String(date.getDate()).padStart(2, "0");\n  return `${y}-${m}-${d}`;\n}\nconst isOverdue = (task, today) => !task.completed && task.dueDate !== "" && task.dueDate < today;', lang: 'jsx' },
        { warn: 'The reference `useTasks` uses `JSON.stringify(filters)` in a dependency array to dodge new-object-every-render loops. It works, but the linter cannot check it; prefer passing primitive filters (`useTasks(projectId, completed)`).' },
      ],
      example: [
        { code: 'const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };\n[...tasks].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);', lang: 'jsx' },
      ],
      task: [
        'Build the data layer and the dashboard (storage keys `"taskflow_tasks"` and `"taskflow_projects"`; each service call waits ~30 ms).',
        { ol: ['Utils: `toLocalDateString(date)`; `getTasksDueToday(tasks, today)` and `getOverdueTasks(tasks, today)` (incomplete only, `today` defaulting to the local date); `getTaskCountByProject(tasks, projects)` → `{ [projectId]: n, none: n }`; `sortTasks(tasks, by)` by `"dueDate"` (no date last) or `"priority"` (high first), without mutating.', '`taskService`: `getTasks({ projectId?, completed? })`, `createTask(data)` (rejects with `Title is required` or `Priority must be low, medium or high`; new tasks get an `id` and `completed: false`), `updateTask(id, changes)`, `deleteTask(id)`.', '`projectService`: `getProjects()`, `createProject(name)`, `deleteProject(id)` (tasks move to `projectId: null` first).', '`DashboardPage`: `Loading dashboard...`, then `section`s labelled by headings `Overdue (N)`, `Due today (N)` (lists of titles, or `Nothing overdue.` / `Nothing due today.`) and `Tasks per project` with `li`s like `Physics: 2` and `No Project: 1`; on failure `Failed to load tasks: <message>`.'] },
      ],
      starter: `import { useState, useEffect } from "react";

function getOverdueTasks(tasks) {
  const now = new Date();
  return tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < now);
}

function getTasksDueToday(tasks) {
  const today = new Date().toDateString();
  return tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate).toDateString() === today);
}

function DashboardPage() {
  const tasks = JSON.parse(localStorage.getItem("taskflow_tasks") || "[]");
  return (
    <div>
      <h2>Overdue ({getOverdueTasks(tasks).length})</h2>
      <h2>Due today ({getTasksDueToday(tasks).length})</h2>
    </div>
  );
}
`,
      solution: `import { useState, useEffect } from "react";

// ---- utils/dates.js + utils/taskUtils.js ----
function toLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return \`\${y}-\${m}-\${d}\`;
}

function getTasksDueToday(tasks, today = toLocalDateString()) {
  return tasks.filter((t) => !t.completed && t.dueDate === today);
}

function getOverdueTasks(tasks, today = toLocalDateString()) {
  return tasks.filter((t) => !t.completed && Boolean(t.dueDate) && t.dueDate < today);
}

function getTaskCountByProject(tasks, projects) {
  const counts = { none: 0 };
  for (const project of projects) counts[project.id] = 0;
  for (const task of tasks) {
    const key = task.projectId && counts[task.projectId] !== undefined ? task.projectId : "none";
    counts[key] += 1;
  }
  return counts;
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

function sortTasks(tasks, by) {
  const copy = [...tasks];
  if (by === "priority") return copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  if (by === "dueDate") {
    return copy.sort((a, b) => {
      if (!a.dueDate) return b.dueDate ? 1 : 0;
      if (!b.dueDate) return -1;
      return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
    });
  }
  return copy;
}

// ---- services (shaped like a real API) ----
const TASKS_KEY = "taskflow_tasks";
const PROJECTS_KEY = "taskflow_projects";
const PRIORITIES = ["low", "medium", "high"];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

const newId = () => \`\${Date.now().toString(36)}-\${Math.random().toString(36).slice(2, 8)}\`;

const taskService = {
  async getTasks(filters = {}) {
    await wait(30);
    let tasks = readList(TASKS_KEY);
    if (filters.projectId !== undefined) tasks = tasks.filter((t) => t.projectId === filters.projectId);
    if (filters.completed !== undefined) tasks = tasks.filter((t) => t.completed === filters.completed);
    return tasks;
  },
  async createTask(data) {
    await wait(30);
    const title = String(data.title ?? "").trim();
    if (!title) throw new Error("Title is required");
    const priority = data.priority ?? "medium";
    if (!PRIORITIES.includes(priority)) throw new Error("Priority must be low, medium or high");
    const task = {
      id: newId(),
      title,
      description: data.description ?? "",
      dueDate: data.dueDate ?? "",
      priority,
      projectId: data.projectId ?? null,
      completed: false,
    };
    writeList(TASKS_KEY, [...readList(TASKS_KEY), task]);
    return task;
  },
  async updateTask(id, changes) {
    await wait(30);
    const tasks = readList(TASKS_KEY);
    if (!tasks.some((t) => t.id === id)) throw new Error("Task not found");
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...changes, id } : t));
    writeList(TASKS_KEY, updated);
    return updated.find((t) => t.id === id);
  },
  async deleteTask(id) {
    await wait(30);
    writeList(TASKS_KEY, readList(TASKS_KEY).filter((t) => t.id !== id));
  },
};

const projectService = {
  async getProjects() {
    await wait(30);
    return readList(PROJECTS_KEY);
  },
  async createProject(name) {
    await wait(30);
    const trimmed = String(name ?? "").trim();
    if (!trimmed) throw new Error("Project name is required");
    const project = { id: newId(), name: trimmed };
    writeList(PROJECTS_KEY, [...readList(PROJECTS_KEY), project]);
    return project;
  },
  async deleteProject(id) {
    const affected = await taskService.getTasks({ projectId: id });
    await Promise.all(affected.map((task) => taskService.updateTask(task.id, { projectId: null })));
    await wait(30);
    writeList(PROJECTS_KEY, readList(PROJECTS_KEY).filter((p) => p.id !== id));
  },
};

// ---- hooks ----
function useDashboardData() {
  const [state, setState] = useState({ status: "loading", tasks: [], projects: [], error: null });
  useEffect(() => {
    let ignore = false;
    Promise.all([taskService.getTasks(), projectService.getProjects()])
      .then(([tasks, projects]) => {
        if (!ignore) setState({ status: "success", tasks, projects, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ status: "error", tasks: [], projects: [], error: error.message });
      });
    return () => {
      ignore = true;
    };
  }, []);
  return state;
}

// ---- pages/DashboardPage.jsx ----
function TaskSection({ id, title, tasks, emptyText }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>
        {title} ({tasks.length})
      </h2>
      {tasks.length === 0 ? (
        <p>{emptyText}</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>{t.title}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DashboardPage() {
  const { status, tasks, projects, error } = useDashboardData();
  if (status === "loading") return <p>Loading dashboard...</p>;
  if (status === "error") return <p className="error">Failed to load tasks: {error}</p>;

  const today = toLocalDateString();
  const counts = getTaskCountByProject(tasks, projects);

  return (
    <div>
      <TaskSection id="overdue-heading" title="Overdue" tasks={getOverdueTasks(tasks, today)} emptyText="Nothing overdue." />
      <TaskSection id="today-heading" title="Due today" tasks={getTasksDueToday(tasks, today)} emptyText="Nothing due today." />
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading">Tasks per project</h2>
        <ul className="project-counts">
          {projects.map((p) => (
            <li key={p.id}>
              {p.name}: {counts[p.id]}
            </li>
          ))}
          <li>No Project: {counts.none}</li>
        </ul>
      </section>
    </div>
  );
}
`,
      checks: [
        { label: 'local date strings', mistake: 'Build YYYY-MM-DD from getFullYear/getMonth+1/getDate with padStart; never from toISOString (that is UTC).', check: ({ exposed }) => { const out = [exposed.toLocalDateString(new Date(2026, 0, 5, 0, 30)), exposed.toLocalDateString(new Date(2026, 11, 31, 23, 59))]; return JSON.stringify(out) === '["2026-01-05","2026-12-31"]' || `got ${JSON.stringify(out)}`; } },
        { label: 'due today vs overdue', mistake: 'Compare dueDate strings with today: === today is due today, < today is overdue; completed tasks and tasks without a date never count.', check: ({ exposed }) => { const tasks = [{ id: 'a', dueDate: '2026-10-24', completed: false }, { id: 'b', dueDate: '2026-10-23', completed: false }, { id: 'c', dueDate: '2026-10-22', completed: true }, { id: 'd', dueDate: '', completed: false }, { id: 'e', dueDate: '2026-10-25', completed: false }]; const ids = (list) => list.map((t) => t.id); const out = [ids(exposed.getTasksDueToday(tasks, '2026-10-24')), ids(exposed.getOverdueTasks(tasks, '2026-10-24'))]; return JSON.stringify(out) === '[["a"],["b"]]' || `due today ${JSON.stringify(out[0])}, overdue ${JSON.stringify(out[1])}`; } },
        { label: 'counts and sorting', mistake: 'Count per project id plus "none"; sort a copy (no-date last; high, medium, low).', check: ({ exposed }) => { const tasks = Object.freeze([Object.freeze({ id: 1, projectId: 'p', priority: 'low', dueDate: '' }), Object.freeze({ id: 2, projectId: null, priority: 'high', dueDate: '2026-11-02' }), Object.freeze({ id: 3, projectId: 'p', priority: 'medium', dueDate: '2026-10-30' })]); try { const counts = exposed.getTaskCountByProject(tasks, [{ id: 'p', name: 'Physics' }, { id: 'q', name: 'Maths' }]); const byDate = exposed.sortTasks(tasks, 'dueDate').map((t) => t.id); const byPriority = exposed.sortTasks(tasks, 'priority').map((t) => t.id); return (JSON.stringify(counts) === JSON.stringify({ none: 1, p: 2, q: 0 }) || (counts.none === 1 && counts.p === 2 && counts.q === 0)) && JSON.stringify(byDate) === '[3,2,1]' && JSON.stringify(byPriority) === '[2,3,1]' ? true : `counts ${JSON.stringify(counts)}, by date ${JSON.stringify(byDate)}, by priority ${JSON.stringify(byPriority)}`; } catch (err) { return `it threw ${err.message} (sorting the original array?)`; } } },
        { label: 'task service behaves like an API', mistake: 'Every method is async; createTask validates and fills defaults; filters work; updates and deletes persist.', check: async ({ exposed, storage }) => { storage.clear(); const t = exposed.taskService; const pending = t.getTasks(); if (!(pending instanceof Promise)) return 'getTasks does not return a Promise'; await pending; const errors = []; for (const bad of [{ title: '  ' }, { title: 'X', priority: 'urgent' }]) { try { await t.createTask(bad); errors.push('accepted'); } catch (err) { errors.push(err.message); } } const a = await t.createTask({ title: 'Revise optics', priority: 'high', projectId: 'p1', dueDate: '2026-10-30' }); await t.createTask({ title: 'Buy chart paper', priority: 'low' }); await t.updateTask(a.id, { completed: true }); const done = await t.getTasks({ completed: true }); const inP1 = await t.getTasks({ projectId: 'p1' }); await t.deleteTask(a.id); const left = await t.getTasks(); return (JSON.stringify(errors) === '["Title is required","Priority must be low, medium or high"]' && typeof a.id === 'string' && a.completed === false && done.length === 1 && inP1.length === 1 && left.length === 1 && left[0].projectId === null) || `errors ${JSON.stringify(errors)}, done ${done.length}, in p1 ${inP1.length}, left ${JSON.stringify(left)}`; } },
        { label: 'deleting a project keeps its tasks', mistake: 'deleteProject moves the project\'s tasks to projectId: null before removing it.', check: async ({ exposed, storage }) => { storage.clear(); const p = await exposed.projectService.createProject('Chemistry'); const keep = await exposed.projectService.createProject('Biology'); await exposed.taskService.createTask({ title: 'Titration practice', projectId: p.id }); await exposed.taskService.createTask({ title: 'Diagram of the heart', projectId: keep.id }); await exposed.projectService.deleteProject(p.id); const projects = await exposed.projectService.getProjects(); const tasks = await exposed.taskService.getTasks(); const moved = tasks.find((t) => t.title === 'Titration practice'); return (projects.length === 1 && projects[0].name === 'Biology' && tasks.length === 2 && moved?.projectId === null) || `projects ${JSON.stringify(projects.map((x) => x.name))}, tasks ${JSON.stringify(tasks.map((t) => [t.title, t.projectId]))}`; } },
        { label: 'dashboard', mistake: 'Show "Loading dashboard..." first, then Overdue (N), Due today (N) and Tasks per project (with No Project).', check: async ({ render, el, App, storage, waitFor, exposed }) => { storage.clear(); const today = exposed.toLocalDateString(); const past = exposed.toLocalDateString(new Date(Date.now() - 3 * 86400000)); storage.setItem('taskflow_projects', JSON.stringify([{ id: 'p1', name: 'Physics' }])); storage.setItem('taskflow_tasks', JSON.stringify([{ id: '1', title: 'Optics worksheet', dueDate: past, priority: 'high', projectId: 'p1', completed: false }, { id: '2', title: 'Lab record', dueDate: today, priority: 'medium', projectId: 'p1', completed: false }, { id: '3', title: 'Old essay', dueDate: past, priority: 'low', projectId: null, completed: true }])); const view = await render(el(App)); const first = view.text(); await waitFor(() => view.$$('section').length === 3); const headings = view.$$('section h2').map((h) => h.textContent); const counts = view.$$('section:nth-of-type(3) li').map((li) => li.textContent); const labelled = view.$$('section').every((s) => document.getElementById(s.getAttribute('aria-labelledby'))); return (first === 'Loading dashboard...' && JSON.stringify(headings) === '["Overdue (1)","Due today (1)","Tasks per project"]' && view.$$('section')[0].textContent.includes('Optics worksheet') && view.$$('section')[1].textContent.includes('Lab record') && JSON.stringify(counts) === '["Physics: 2","No Project: 1"]' && labelled) || `first "${first}", headings ${JSON.stringify(headings)}, counts ${JSON.stringify(counts)}`; } },
        { label: 'empty dashboard', mistake: 'With no tasks, show "Nothing overdue." and "Nothing due today."', check: async ({ render, el, App, storage, waitFor }) => { storage.clear(); const view = await render(el(App)); await waitFor(() => view.$$('section').length === 3); return (view.text().includes('Nothing overdue.') && view.text().includes('Nothing due today.') && view.text().includes('No Project: 0')) || `shows "${view.text()}"`; } },
      ],
    },
  ],
};
