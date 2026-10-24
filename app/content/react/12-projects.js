// JavaScript & React course, project catalogue Tiers 4–6 (projects 25–41).
import { mockApi } from '../shared/mock-api.js';

const moviesApi = mockApi({
  'GET /api/movies?q=star&page=1': { body: { results: [{ id: 1, title: 'Star Wars', year: 1977 }, { id: 2, title: 'Star Trek', year: 2009 }], totalPages: 2 }, delay: 40 },
  'GET /api/movies?q=star&page=2': { body: { results: [{ id: 3, title: 'A Star Is Born', year: 2018 }], totalPages: 2 }, delay: 40 },
  'GET /api/movies?q=lagaan&page=1': { body: { results: [{ id: 9, title: 'Lagaan', year: 2001 }], totalPages: 1 }, delay: 40 },
  'GET /api/movies?q=zzz&page=1': { body: { results: [], totalPages: 0 }, delay: 40 },
  'GET /api/movies?q=broken&page=1': { status: 500, body: {}, delay: 40 },
}) + '\nconst DEBOUNCE_MS = 150;';

const inventoryApi = mockApi({
  'GET /api/inventory': { body: [{ id: 1, name: 'Wooden train set', quantity: 12 }, { id: 2, name: 'Puzzle cube', quantity: 3 }, { id: 3, name: 'Science kit', quantity: 0 }, { id: 4, name: 'Ludo', quantity: 5 }], delay: 30 },
  'PATCH /api/inventory/1': { echo: 1, delay: 120 },
  'PATCH /api/inventory/3': { echo: 3, delay: 40 },
  'PATCH /api/inventory/2': { status: 500, body: { message: 'Database unavailable' }, delay: 120 },
});

const statsApi = mockApi({
  'GET /api/stats/revenue?range=7d': { body: { total: 45200 }, delay: 40 },
  'GET /api/stats/orders?range=7d': { body: { count: 38 }, delay: 40 },
  'GET /api/stats/top-products?range=7d': { body: [{ id: 1, name: 'Puzzle cube', sold: 14 }, { id: 2, name: 'Ludo', sold: 9 }], delay: 40 },
  'GET /api/stats/revenue?range=30d': { body: { total: 186750 }, delay: 40 },
  'GET /api/stats/orders?range=30d': { body: { count: 151 }, delay: 40 },
  'GET /api/stats/top-products?range=30d': { status: 500, body: {}, delay: 40 },
});

export default {
  id: 'react-projects',
  title: 'Projects: React apps',
  lessons: [
    {
      id: 'rproj-cart',
      title: 'Project: product cards and a shopping cart',
      source: 'JavaScript & React course, projects 25, 28 and 31',
      runner: 'react',
      teach: [
        'Two components far apart on the page (a header badge and the product cards) share the cart, so the cart lives in their **common parent** and flows down as props, with callbacks flowing up.',
        { h: 'What to store' },
        'Store only `{ productId, quantity }` per line. Name, price and subtotal are **looked up and derived** at render time, so a price change is reflected immediately and nothing can drift out of sync. (An order, once placed, is the opposite: it must snapshot the price it was sold at. The capstone covers that.)',
        { code: 'const lines = cart.map((line) => {\n  const product = PRODUCTS.find((p) => p.id === line.productId);\n  return { ...line, product, subtotal: product.price * line.quantity };\n});\nconst total = lines.reduce((sum, line) => sum + line.subtotal, 0);\nconst count = cart.reduce((sum, line) => sum + line.quantity, 0);', lang: 'jsx' },
        { list: ['Adding an existing product increases its quantity instead of adding a second line.', 'Decreasing to 0 removes the line (a stated decision; the alternative is a minimum of 1).', 'Persist with the `useLocalStorage` hook from the custom-hooks module.', 'Icon-like buttons (`−`, `+`) need accessible names: `aria-label="Increase Puzzle cube"`.'] },
      ],
      example: [
        { code: 'function changeQuantity(productId, delta) {\n  setCart((prev) =>\n    prev\n      .map((line) => (line.productId === productId ? { ...line, quantity: line.quantity + delta } : line))\n      .filter((line) => line.quantity > 0),\n  );\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['`App` owns the cart (`[{ productId, quantity }]`, saved under `"cart"` in localStorage) and renders a header with `<span className="cart-count">N</span>` (total items), the product cards and the cart.', 'Each `ProductCard` (`article.product-card`): `h3` name, `p.price` (`₹1,200`) and an `Add to cart` button.', 'The cart (`section.cart`): one `li.cart-item` per line with the name, buttons `−`/`+` labelled `Decrease <name>`/`Increase <name>`, `span.qty`, `span.subtotal` and a `Remove` button; then `p.cart-total` `Total: ₹N`. Empty cart: `Your cart is empty`.', 'Quantity reaching 0 removes the line.'] },
      ],
      starter: `import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Wooden train set", price: 1200 },
  { id: 2, name: "Puzzle cube", price: 300 },
  { id: 3, name: "Science kit", price: 2500 },
];

function ProductCard({ product }) {
  const [count, setCount] = useState(0);
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
    </article>
  );
}

export default function App() {
  return (
    <div>
      <header>
        Toy Shop <span className="cart-count">0</span>
      </header>
      {PRODUCTS.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
`,
      solution: `import { useState, useEffect } from "react";

const PRODUCTS = [
  { id: 1, name: "Wooden train set", price: 1200 },
  { id: 2, name: "Puzzle cube", price: 300 },
  { id: 3, name: "Science kit", price: 2500 },
];

const rupees = (amount) => \`₹\${amount.toLocaleString("en-IN")}\`;

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
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p className="price">{rupees(product.price)}</p>
      <button onClick={() => onAdd(product.id)}>Add to cart</button>
    </article>
  );
}

function Cart({ lines, total, onChange, onRemove }) {
  if (lines.length === 0) {
    return (
      <section className="cart">
        <p>Your cart is empty</p>
      </section>
    );
  }
  return (
    <section className="cart">
      <ul>
        {lines.map(({ product, quantity, subtotal }) => (
          <li key={product.id} className="cart-item">
            <span className="name">{product.name}</span>
            <button aria-label={\`Decrease \${product.name}\`} onClick={() => onChange(product.id, -1)}>−</button>
            <span className="qty">{quantity}</span>
            <button aria-label={\`Increase \${product.name}\`} onClick={() => onChange(product.id, 1)}>+</button>
            <span className="subtotal">{rupees(subtotal)}</span>
            <button onClick={() => onRemove(product.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p className="cart-total">Total: {rupees(total)}</p>
    </section>
  );
}

export default function App() {
  const [cart, setCart] = useLocalStorage("cart", []);

  function addToCart(productId) {
    setCart((prev) =>
      prev.some((line) => line.productId === productId)
        ? prev.map((line) => (line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line))
        : [...prev, { productId, quantity: 1 }],
    );
  }

  function changeQuantity(productId, delta) {
    setCart((prev) =>
      prev
        .map((line) => (line.productId === productId ? { ...line, quantity: line.quantity + delta } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  function removeLine(productId) {
    setCart((prev) => prev.filter((line) => line.productId !== productId));
  }

  const lines = cart
    .map((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      return product ? { ...line, product, subtotal: product.price * line.quantity } : null;
    })
    .filter(Boolean);
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div>
      <header>
        Toy Shop <span className="cart-count">{count}</span>
      </header>
      {PRODUCTS.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={addToCart} />
      ))}
      <Cart lines={lines} total={total} onChange={changeQuantity} onRemove={removeLine} />
    </div>
  );
}
`,
      checks: [
        { label: 'cards and an empty cart', mistake: 'Render article.product-card (h3, p.price "₹1,200", Add to cart) for each product; the cart says "Your cart is empty" and the badge shows 0.', check: async ({ render, el, App, storage }) => { storage.clear(); const view = await render(el(App)); return (view.$$('article.product-card').length === 3 && view.text('article.product-card .price') === '₹1,200' && view.text('.cart-count') === '0' && view.text('.cart') === 'Your cart is empty') || `badge "${view.text('.cart-count')}", cart "${view.text('.cart')}"`; } },
        { label: 'adding updates the badge and cart', mistake: 'Lift the cart into App; adding an existing product increases its quantity.', check: async ({ render, el, App, storage, click }) => { storage.clear(); const view = await render(el(App)); const add = (i) => view.$$('article.product-card button')[i]; await click(add(0)); await click(add(0)); await click(add(1)); const items = view.$$('li.cart-item').map((li) => `${li.querySelector('.name')?.textContent}:${li.querySelector('.qty')?.textContent}:${li.querySelector('.subtotal')?.textContent}`); return (view.text('.cart-count') === '3' && JSON.stringify(items) === '["Wooden train set:2:₹2,400","Puzzle cube:1:₹300"]' && view.text('.cart-total') === 'Total: ₹2,700') || `badge "${view.text('.cart-count')}", items ${JSON.stringify(items)}, "${view.text('.cart-total')}"`; } },
        { label: 'quantity buttons; 0 removes', mistake: 'Increase/Decrease change the quantity by 1 and filter out lines that reach 0.', check: async ({ render, el, App, storage, click }) => { storage.clear(); const view = await render(el(App)); await click(view.$$('article.product-card button')[1]); await click(view.$('[aria-label="Increase Puzzle cube"]')); const two = view.text('.qty'); await click(view.$('[aria-label="Decrease Puzzle cube"]')); await click(view.$('[aria-label="Decrease Puzzle cube"]')); return (two === '2' && view.$$('li.cart-item').length === 0 && view.text('.cart-count') === '0') || `after +: "${two}", then ${view.$$('li.cart-item').length} line(s)`; } },
        { label: 'remove a line', mistake: 'Remove filters the line out by productId.', check: async ({ render, el, App, storage, click }) => { storage.clear(); const view = await render(el(App)); await click(view.$$('article.product-card button')[0]); await click(view.$$('article.product-card button')[2]); await click(view.$$('li.cart-item')[0].querySelector('button:last-child')); return (view.$$('li.cart-item').length === 1 && view.text('.cart-total') === 'Total: ₹2,500') || `cart "${view.text('.cart')}"`; } },
        { label: 'persisted as productId and quantity only', mistake: 'Save [{ productId, quantity }] to localStorage "cart"; derive name and price from PRODUCTS.', check: async ({ render, el, App, storage, click }) => { storage.clear(); const view = await render(el(App)); await click(view.$$('article.product-card button')[2]); await click(view.$$('article.product-card button')[2]); let saved = null; try { saved = JSON.parse(storage.getItem('cart')); } catch { saved = null; } return JSON.stringify(saved) === '[{"productId":3,"quantity":2}]' || `saved ${storage.getItem('cart')}`; } },
        { label: 'restores the saved cart', mistake: 'Initialise the cart lazily from localStorage.', check: async ({ render, el, App, storage }) => { storage.clear(); storage.setItem('cart', JSON.stringify([{ productId: 2, quantity: 4 }])); const view = await render(el(App)); return (view.text('.cart-count') === '4' && view.text('.cart-total') === 'Total: ₹1,200') || `badge "${view.text('.cart-count')}", total "${view.text('.cart-total')}"`; } },
      ],
    },
    {
      id: 'rproj-movie-search',
      title: 'Project: movie search with the five UI states',
      source: 'JavaScript & React course, projects 21 and 32; Part 22',
      runner: 'react',
      component: 'MovieSearch',
      setup: moviesApi,
      teach: [
        'A search screen has **five** states, and each needs its own UI. Model it as one `status` value instead of several booleans that can contradict each other (`loading && error`):',
        { table: { head: ['status', 'When', 'Shows'], rows: [['`idle`', 'empty query', 'instructions, not an error'], ['`loading`', 'request in flight', '"Searching…"'], ['`success`', 'results', 'the list + pagination'], ['`empty`', 'zero results', '"No movies found for …"'], ['`error`', 'failed request', 'a message and a Retry button']] } },
        { h: 'The data flow' },
        { code: 'const [query, setQuery] = useState("");\nconst [page, setPage] = useState(1);\nconst debouncedQuery = useDebounce(query.trim(), DEBOUNCE_MS);\n\nuseEffect(() => {\n  if (!debouncedQuery) { setStatus("idle"); return; }\n  const controller = new AbortController();\n  setStatus("loading");\n  fetch(`/api/movies?${new URLSearchParams({ q: debouncedQuery, page })}`, { signal: controller.signal })\n  // ... set results and status\n  return () => controller.abort();\n}, [debouncedQuery, page, retryCount]);', lang: 'jsx' },
        { list: ['Typing a new query resets `page` to 1 (in the change handler).', 'A `retryCount` state in the dependency list makes Retry re-run the effect without copy-pasting the fetch.', 'Aborting in the cleanup stops a slow, stale response from overwriting a newer one.'] },
      ],
      example: [
        { code: 'function handleChange(event) {\n  setQuery(event.target.value);\n  setPage(1);\n}', lang: 'jsx' },
      ],
      task: [
        '`DEBOUNCE_MS` is defined. The API is `/api/movies?q=<query>&page=<n>` → `{ results: [{ id, title, year }], totalPages }`.',
        { ol: ['`MovieSearch` renders `<input aria-label="Search movies">` and one `p.status` line for idle (`Type to search for movies`), loading (`Searching…`), empty (`No movies found for "<q>"`) and error (`Something went wrong. Try again.` plus a `Retry` button).', 'Success: `ul.results` of `li` like `Star Wars (1977)` and, when `totalPages > 1`, `Previous`/`Next` buttons (disabled at the ends) and `p.page` `Page 1 of 2`.', 'Debounce the query; a new query resets to page 1; abort stale requests.'] },
      ],
      starter: `import { useState, useEffect } from "react";

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(\`/api/movies?q=\${query}&page=1\`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  }, [query]);

  return (
    <div>
      <input aria-label="Search movies" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul className="results">
        {movies.map((m) => (
          <li key={m.id}>{m.title}</li>
        ))}
      </ul>
    </div>
  );
}
`,
      solution: `import { useState, useEffect } from "react";

function useDebounce(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState({ results: [], totalPages: 0 });
  const debouncedQuery = useDebounce(query.trim(), DEBOUNCE_MS);

  useEffect(() => {
    if (!debouncedQuery) {
      setStatus("idle");
      setData({ results: [], totalPages: 0 });
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const params = new URLSearchParams({ q: debouncedQuery, page });
    fetch(\`/api/movies?\${params}\`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json();
      })
      .then((result) => {
        setData(result);
        setStatus(result.results.length === 0 ? "empty" : "success");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, [debouncedQuery, page, retryCount]);

  function handleChange(event) {
    setQuery(event.target.value);
    setPage(1);
  }

  return (
    <div>
      <input aria-label="Search movies" value={query} onChange={handleChange} />
      {status === "idle" && <p className="status">Type to search for movies</p>}
      {status === "loading" && <p className="status">Searching…</p>}
      {status === "empty" && <p className="status">No movies found for "{debouncedQuery}"</p>}
      {status === "error" && (
        <div>
          <p className="status">Something went wrong. Try again.</p>
          <button onClick={() => setRetryCount((n) => n + 1)}>Retry</button>
        </div>
      )}
      {status === "success" && (
        <>
          <ul className="results">
            {data.results.map((movie) => (
              <li key={movie.id}>
                {movie.title} ({movie.year})
              </li>
            ))}
          </ul>
          {data.totalPages > 1 && (
            <nav>
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <p className="page">
                Page {page} of {data.totalPages}
              </p>
              <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
`,
      checks: [
        { label: 'idle state', mistake: 'With an empty query, show "Type to search for movies" and make no request.', check: ({ text, window }) => (text('.status') === 'Type to search for movies' && window.__requests.length === 0) || `status "${text('.status')}", ${window.__requests.length} request(s)` },
        { label: 'debounced loading then results', mistake: 'Debounce the query; show "Searching…" while loading, then "Title (year)" items.', check: async ({ type, waitFor, text, $$, window }) => { const start = window.__requests.length; for (const v of ['s', 'st', 'sta', 'star']) await type('input', v); const loading = await waitFor(() => text('.status') === 'Searching…', 800); const done = await waitFor(() => $$('.results li').length === 2); const urls = window.__requests.slice(start).map((r) => r.url); return (loading && done && text('.results li') === 'Star Wars (1977)' && JSON.stringify(urls) === '["/api/movies?q=star&page=1"]') || `requests ${JSON.stringify(urls)}, status "${text('.status')}"`; } },
        { label: 'pagination', mistake: 'Show Page N of M with Previous/Next; Next loads page 2; buttons disable at the ends.', check: async ({ type, waitFor, text, $$, click }) => { await type('input', 'star'); await waitFor(() => $$('.results li').length === 2); const btn = (l) => $$('button').find((b) => b.textContent === l); const firstPage = text('.page') === 'Page 1 of 2' && btn('Previous')?.disabled; await click(btn('Next')); const ok = await waitFor(() => text('.results li') === 'A Star Is Born (2018)'); return (firstPage && ok && text('.page') === 'Page 2 of 2' && btn('Next').disabled) || `page text "${text('.page')}"`; } },
        { label: 'new query resets to page 1', mistake: 'Call setPage(1) when the query changes.', check: async ({ type, waitFor, text, $$, click, window }) => { await type('input', 'star'); await waitFor(() => $$('.results li').length === 2); await click($$('button').find((b) => b.textContent === 'Next')); await waitFor(() => text('.page') === 'Page 2 of 2'); const start = window.__requests.length; await type('input', 'lagaan'); const ok = await waitFor(() => text('.results li') === 'Lagaan (2001)'); const urls = window.__requests.slice(start).map((r) => r.url); return (ok && urls.includes('/api/movies?q=lagaan&page=1')) || `requests ${JSON.stringify(urls)}`; } },
        { label: 'empty state', mistake: 'Zero results is not an error: show `No movies found for "zzz"`.', check: async ({ type, waitFor, text }) => { await type('input', 'zzz'); const ok = await waitFor(() => text('.status') === 'No movies found for "zzz"'); return ok || `status "${text('.status')}"`; } },
        { label: 'error state and retry', mistake: 'On a failed request show the error and a Retry button that re-runs the same request.', check: async ({ type, waitFor, text, $$, click, window }) => { await type('input', 'broken'); const failed = await waitFor(() => text('.status') === 'Something went wrong. Try again.'); const retry = $$('button').find((b) => b.textContent === 'Retry'); if (!retry) return failed ? 'no Retry button' : `status "${text('.status')}"`; window.__api.overrides['GET /api/movies?q=broken&page=1'] = { body: { results: [{ id: 5, title: 'Broken Arrow', year: 1996 }], totalPages: 1 } }; try { await click(retry); const ok = await waitFor(() => text('.results li') === 'Broken Arrow (1996)'); return ok || `after retry: "${text()}"`; } finally { delete window.__api.overrides['GET /api/movies?q=broken&page=1']; } } },
        { label: 'stale responses are aborted', mistake: 'Return () => controller.abort() from the effect.', check: async ({ type, wait, waitFor, text, window }) => { window.__api.delays['GET /api/movies?q=star&page=1'] = 500; try { const start = window.__requests.length; await type('input', 'star'); await wait(220); await type('input', 'lagaan'); await waitFor(() => text('.results li') === 'Lagaan (2001)'); await wait(450); const first = window.__requests.slice(start).find((r) => r.url === '/api/movies?q=star&page=1'); return (first?.aborted && text('.results li') === 'Lagaan (2001)') || `star request aborted: ${first?.aborted}; shows "${text('.results')}"`; } finally { delete window.__api.delays['GET /api/movies?q=star&page=1']; } } },
      ],
    },
    {
      id: 'rproj-expense-reducer',
      title: 'Project: an expense manager with useReducer',
      source: 'JavaScript & React course, project 34; Parts 26–27',
      runner: 'react',
      expose: ['expensesReducer', 'initExpenses'],
      teach: [
        'Several related updates on one list (add, delete, change category, clear) are reducer-shaped: every rule lives in one pure function you can test without React.',
        { code: 'function expensesReducer(state, action) {\n  switch (action.type) {\n    case "ADD_EXPENSE":\n      return [...state, action.payload];\n    case "DELETE_EXPENSE":\n      return state.filter((e) => e.id !== action.payload);\n    default:\n      return state;\n  }\n}', lang: 'jsx' },
        { warn: 'Reducers must be **pure**: no `Date.now()`, `Math.random()` or `localStorage` inside. React may call a reducer more than once. Create the id in the event handler and pass it in the payload; save to storage in an effect.' },
        { h: 'Lazy initial state for useReducer' },
        '`useReducer(reducer, initialArg, init)` calls `init(initialArg)` once, on the first render: the place to read localStorage.',
        { code: 'function initExpenses(key) {\n  try {\n    const saved = JSON.parse(localStorage.getItem(key));\n    return Array.isArray(saved) ? saved : [];\n  } catch {\n    return [];\n  }\n}\n\nconst [expenses, dispatch] = useReducer(expensesReducer, "expenses", initExpenses);\nuseEffect(() => localStorage.setItem("expenses", JSON.stringify(expenses)), [expenses]);', lang: 'jsx' },
      ],
      example: [
        { code: 'dispatch({\n  type: "ADD_EXPENSE",\n  payload: { id: crypto.randomUUID(), description, amount: Number(amount), category },\n});', lang: 'jsx' },
      ],
      task: [
        { ol: ['`expensesReducer(state, action)` handles `ADD_EXPENSE` (payload: the expense), `DELETE_EXPENSE` (payload: id), `UPDATE_CATEGORY` (payload: `{ id, category }`) and `CLEAR_ALL`; unknown actions return the same state; never mutate.', '`initExpenses(key)` reads and validates the saved array (fallback `[]`).', '`App`: a form (`input[aria-label="Description"]`, `input[aria-label="Amount"]`, `select[aria-label="Category"]` with Food/Transport/Study, `Add` button) that rejects empty or non-positive input; `li.expense` rows with the description, `₹` amount and a `Delete` button; `p.total` `Total: ₹N`; `li.category-total` lines like `Food: ₹20` for categories with expenses (Food, Transport, Study order); a `Clear all` button.', 'Persist to `"expenses"` in an effect.'] },
      ],
      starter: `import { useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div>
      <input aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input aria-label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={() => setExpenses([...expenses, { description, amount }])}>Add</button>
      <ul>
        {expenses.map((e, i) => (
          <li key={i} className="expense">{e.description} {e.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
`,
      solution: `import { useState, useReducer, useEffect } from "react";

const STORAGE_KEY = "expenses";
const CATEGORIES = ["Food", "Transport", "Study"];
const rupees = (n) => \`₹\${n.toLocaleString("en-IN")}\`;

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE":
      return [...state, action.payload];
    case "DELETE_EXPENSE":
      return state.filter((expense) => expense.id !== action.payload);
    case "UPDATE_CATEGORY":
      return state.map((expense) =>
        expense.id === action.payload.id ? { ...expense, category: action.payload.category } : expense,
      );
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
}

function initExpenses(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function App() {
  const [expenses, dispatch] = useReducer(expensesReducer, STORAGE_KEY, initExpenses);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  function handleSubmit(event) {
    event.preventDefault();
    const value = Number(amount);
    if (description.trim() === "" || amount.trim() === "" || !(value > 0)) {
      setError("Enter a description and an amount above 0");
      return;
    }
    dispatch({
      type: "ADD_EXPENSE",
      payload: { id: \`\${Date.now()}-\${Math.random()}\`, description: description.trim(), amount: value, category },
    });
    setDescription("");
    setAmount("");
    setError("");
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input aria-label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button>Add</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="expense">
            {expense.description} {rupees(expense.amount)} ({expense.category})
            <button onClick={() => dispatch({ type: "DELETE_EXPENSE", payload: expense.id })}>Delete</button>
          </li>
        ))}
      </ul>
      <p className="total">Total: {rupees(total)}</p>
      <ul>
        {CATEGORIES.filter((c) => byCategory[c] !== undefined).map((c) => (
          <li key={c} className="category-total">
            {c}: {rupees(byCategory[c])}
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: "CLEAR_ALL" })}>Clear all</button>
    </div>
  );
}

export default App;
`,
      checks: [
        { label: 'reducer adds and deletes immutably', mistake: 'ADD_EXPENSE returns [...state, payload]; DELETE_EXPENSE filters by id; never mutate.', check: ({ exposed }) => { const r = exposed.expensesReducer; const start = Object.freeze([Object.freeze({ id: 'a', description: 'Chai', amount: 20, category: 'Food' })]); try { const added = r(start, { type: 'ADD_EXPENSE', payload: { id: 'b', description: 'Bus', amount: 15, category: 'Transport' } }); const deleted = r(added, { type: 'DELETE_EXPENSE', payload: 'a' }); return (added.length === 2 && deleted.length === 1 && deleted[0].id === 'b' && start.length === 1) || `added ${added.length}, after delete ${JSON.stringify(deleted)}`; } catch (err) { return `it threw ${err.message} (mutating frozen state?)`; } } },
        { label: 'update category, clear, unknown', mistake: 'UPDATE_CATEGORY maps a copy with the new category; CLEAR_ALL returns []; unknown actions return the same state.', check: ({ exposed }) => { const r = exposed.expensesReducer; const s = Object.freeze([Object.freeze({ id: 'a', description: 'Pens', amount: 50, category: 'Food' })]); try { const moved = r(s, { type: 'UPDATE_CATEGORY', payload: { id: 'a', category: 'Study' } }); return (moved[0].category === 'Study' && s[0].category === 'Food' && r(s, { type: 'CLEAR_ALL' }).length === 0 && r(s, { type: 'NOPE' }) === s) || `got ${JSON.stringify(moved)}`; } catch (err) { return `it threw ${err.message}`; } } },
        { label: 'initExpenses validates storage', mistake: 'Parse the saved value; anything that is not an array (or broken JSON) gives [].', check: ({ exposed, storage }) => { storage.setItem('t1', '[{"id":"x","description":"A","amount":1,"category":"Food"}]'); storage.setItem('t2', '{bad'); storage.setItem('t3', '{"a":1}'); const out = [exposed.initExpenses('t1').length, exposed.initExpenses('t2'), exposed.initExpenses('t3'), exposed.initExpenses('missing')]; return JSON.stringify(out) === '[1,[],[],[]]' || `got ${JSON.stringify(out)}`; } },
        { label: 'form adds and validates', mistake: 'Reject an empty description or a non-positive amount; otherwise dispatch ADD_EXPENSE and clear the inputs.', check: async ({ render, el, App, storage, type, select, click }) => { storage.clear(); const view = await render(el(App)); await type(view.$('input[aria-label="Amount"]'), '0'); await type(view.$('input[aria-label="Description"]'), 'Chai'); await click(view.$$('button').find((b) => b.textContent === 'Add')); const rejected = view.$$('li.expense').length === 0; await type(view.$('input[aria-label="Amount"]'), '20'); await click(view.$$('button').find((b) => b.textContent === 'Add')); await type(view.$('input[aria-label="Description"]'), 'Physics book'); await type(view.$('input[aria-label="Amount"]'), '650'); await select(view.$('select[aria-label="Category"]'), 'Study'); await click(view.$$('button').find((b) => b.textContent === 'Add')); const totals = view.$$('li.category-total').map((li) => li.textContent); return (rejected && view.$$('li.expense').length === 2 && view.text('.total') === 'Total: ₹670' && JSON.stringify(totals) === '["Food: ₹20","Study: ₹650"]' && view.$('input[aria-label="Description"]').value === '') || `rejected ${rejected}, ${view.$$('li.expense').length} rows, "${view.text('.total')}", ${JSON.stringify(totals)}`; } },
        { label: 'delete and clear from the UI', mistake: 'Delete dispatches DELETE_EXPENSE with the id; Clear all dispatches CLEAR_ALL.', check: async ({ render, el, App, storage, click }) => { storage.clear(); storage.setItem('expenses', JSON.stringify([{ id: '1', description: 'Chai', amount: 20, category: 'Food' }, { id: '2', description: 'Metro', amount: 40, category: 'Transport' }])); const view = await render(el(App)); await click(view.$$('li.expense')[0].querySelector('button')); const after = view.text('.total'); await click(view.$$('button').find((b) => b.textContent === 'Clear all')); return (after === 'Total: ₹40' && view.$$('li.expense').length === 0 && view.text('.total') === 'Total: ₹0') || `after delete "${after}"`; } },
        { label: 'persists through the reducer', mistake: 'useReducer(expensesReducer, "expenses", initExpenses) to load; an effect saves on every change.', check: async ({ render, el, App, storage, type, click }) => { storage.clear(); storage.setItem('expenses', JSON.stringify([{ id: '1', description: 'Chai', amount: 20, category: 'Food' }])); const view = await render(el(App)); const loaded = view.$$('li.expense').length === 1; await type(view.$('input[aria-label="Description"]'), 'Pens'); await type(view.$('input[aria-label="Amount"]'), '30'); await click(view.$$('button').find((b) => b.textContent === 'Add')); const saved = JSON.parse(storage.getItem('expenses') || '[]'); return (loaded && saved.length === 2 && saved[1].amount === 30) || `loaded ${loaded}, saved ${storage.getItem('expenses')}`; } },
        { label: 'reducer stays pure', mistake: 'Do not call Date.now, Math.random or localStorage inside the reducer: create the id in the handler.', check: ({ source }) => { const body = source.match(/function\s+expensesReducer[\s\S]*?\n\}/)?.[0] ?? ''; return (body !== '' && !/Date\.now|Math\.random|localStorage|crypto/.test(body)) || 'the reducer is missing or impure'; } },
      ],
    },
    {
      id: 'rproj-inventory',
      title: 'Project: inventory with optimistic updates',
      source: 'JavaScript & React course, project 36; Part 22',
      runner: 'react',
      expose: ['getStockStatus'],
      setup: inventoryApi,
      teach: [
        '**Pessimistic** updates wait for the server before changing the screen: simple, but every save feels slow. **Optimistic** updates change the screen immediately and **roll back** if the server refuses.',
        { code: 'async function saveQuantity(id, quantity) {\n  const previous = products.find((p) => p.id === id).quantity;\n  setProducts((list) => list.map((p) => (p.id === id ? { ...p, quantity } : p)));   // 1. apply\n  try {\n    await apiRequest(`/api/inventory/${id}`, { method: "PATCH", body: JSON.stringify({ quantity }) });\n  } catch {\n    setProducts((list) => list.map((p) => (p.id === id ? { ...p, quantity: previous } : p)));   // 2. roll back\n    setError(`Could not update ${name}`);\n  }\n}', lang: 'jsx' },
        { list: ['Remember the previous value **before** applying the change.', 'Roll back with a functional update so other rows changed in the meantime are kept.', 'Tell the user: a silent rollback looks like the app ignored them.', 'Use optimism when failures are rare and the change is easy to undo (a quantity, a like). Do not use it for payments.'] },
        { h: 'Derived stock status' },
        { code: 'function getStockStatus(quantity) {\n  if (quantity === 0) return "out-of-stock";\n  if (quantity <= 5) return "low-stock";\n  return "in-stock";\n}', lang: 'jsx' },
        'The status, the low-stock banner and the filter all derive from `quantity`, so an optimistic change updates all of them at once.',
      ],
      example: [
        { code: 'const lowStock = products.filter((p) => getStockStatus(p.quantity) === "low-stock");\n{lowStock.length > 0 && <p role="alert">Low stock: {lowStock.map((p) => p.name).join(", ")}</p>}', lang: 'jsx' },
      ],
      task: [
        'GET `/api/inventory` returns the products; PATCH `/api/inventory/<id>` with `{ quantity }` saves one.',
        { ol: ['`getStockStatus(quantity)` → `"out-of-stock"` (0), `"low-stock"` (1–5), `"in-stock"`.', 'Render `tr.product-row` per product: name cell, `td.status` with the label (`In stock`/`Low stock`/`Out of stock`), an `<input type="number" aria-label="Quantity for <name>">` and a `Save` button. Show `Loading inventory…` first.', 'A banner `<p role="alert" className="low-stock">Low stock: A, B</p>` when any product is low (not out).', 'A `select[aria-label="Stock filter"]` with `all`, `in-stock`, `low-stock`, `out-of-stock`.', 'Save is optimistic; on failure roll back and show `<p className="row-error" role="alert">Could not update <name></p>`.'] },
      ],
      starter: `import { useState, useEffect } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/api/inventory").then((r) => r.json()).then(setProducts);
  }, []);
  return (
    <table>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="product-row">
            <td>{p.name}</td>
            <td className="status">{p.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
      solution: `import { useState, useEffect, memo } from "react";

const LABELS = { "in-stock": "In stock", "low-stock": "Low stock", "out-of-stock": "Out of stock" };

function getStockStatus(quantity) {
  if (quantity === 0) return "out-of-stock";
  if (quantity <= 5) return "low-stock";
  return "in-stock";
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.status === 204 ? null : response.json();
}

const ProductRow = memo(function ProductRow({ product, onSave }) {
  const [draft, setDraft] = useState(String(product.quantity));
  useEffect(() => setDraft(String(product.quantity)), [product.quantity]);
  const status = getStockStatus(product.quantity);
  return (
    <tr className="product-row">
      <td>{product.name}</td>
      <td className={\`status \${status}\`}>{LABELS[status]}</td>
      <td>
        <input
          type="number"
          min="0"
          aria-label={\`Quantity for \${product.name}\`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button onClick={() => onSave(product.id, Number(draft))}>Save</button>
      </td>
    </tr>
  );
});

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/inventory")
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function saveQuantity(id, quantity) {
    if (!Number.isInteger(quantity) || quantity < 0) return;
    const product = products.find((p) => p.id === id);
    const previous = product.quantity;
    setError("");
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, quantity } : p)));
    try {
      await apiRequest(\`/api/inventory/\${id}\`, { method: "PATCH", body: JSON.stringify({ quantity }) });
    } catch {
      setProducts((list) => list.map((p) => (p.id === id ? { ...p, quantity: previous } : p)));
      setError(\`Could not update \${product.name}\`);
    }
  }

  if (status === "loading") return <p>Loading inventory…</p>;
  if (status === "error") return <p role="alert">Could not load inventory.</p>;

  const lowStock = products.filter((p) => getStockStatus(p.quantity) === "low-stock");
  const visible = filter === "all" ? products : products.filter((p) => getStockStatus(p.quantity) === filter);

  return (
    <div>
      {lowStock.length > 0 && (
        <p role="alert" className="low-stock">
          Low stock: {lowStock.map((p) => p.name).join(", ")}
        </p>
      )}
      {error && (
        <p className="row-error" role="alert">
          {error}
        </p>
      )}
      <select aria-label="Stock filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="in-stock">In stock</option>
        <option value="low-stock">Low stock</option>
        <option value="out-of-stock">Out of stock</option>
      </select>
      <table>
        <tbody>
          {visible.map((product) => (
            <ProductRow key={product.id} product={product} onSave={saveQuantity} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
`,
      checks: [
        { label: 'stock thresholds', mistake: '0 → out-of-stock, 1–5 → low-stock, otherwise in-stock.', check: ({ exposed }) => { const out = [0, 1, 5, 6, 40].map(exposed.getStockStatus); return JSON.stringify(out) === '["out-of-stock","low-stock","low-stock","in-stock","in-stock"]' || `got ${JSON.stringify(out)}`; } },
        { label: 'loads and labels every product', mistake: 'Show "Loading inventory…" first, then a tr.product-row per product with its status label.', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App)); const first = view.text(); await waitFor(() => view.$$('tr.product-row').length === 4); const labels = view.$$('td.status').map((td) => td.textContent); return (first === 'Loading inventory…' && JSON.stringify(labels) === '["In stock","Low stock","Out of stock","Low stock"]') || `first "${first}", labels ${JSON.stringify(labels)}`; } },
        { label: 'derived low-stock banner', mistake: 'Derive the low-stock list from products (quantity 1–5) and show it in p.low-stock with role="alert".', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 4); return view.text('p.low-stock[role="alert"]') === 'Low stock: Puzzle cube, Ludo' || `banner "${view.text('p.low-stock')}"`; } },
        { label: 'stock filter', mistake: 'Filter the rows by getStockStatus(quantity) === filter.', check: async ({ render, el, App, waitFor, select }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 4); await select(view.$('select[aria-label="Stock filter"]'), 'low-stock'); const low = view.$$('tr.product-row td:first-child').map((td) => td.textContent); await select(view.$('select[aria-label="Stock filter"]'), 'out-of-stock'); const out = view.$$('tr.product-row td:first-child').map((td) => td.textContent); return (JSON.stringify(low) === '["Puzzle cube","Ludo"]' && JSON.stringify(out) === '["Science kit"]') || `low ${JSON.stringify(low)}, out ${JSON.stringify(out)}`; } },
        { label: 'optimistic save', mistake: 'Update products immediately on Save, then PATCH { quantity } in the background.', check: async ({ render, el, App, waitFor, type, click, window }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 4); const row = () => view.$$('tr.product-row')[0]; await type(view.$('input[aria-label="Quantity for Wooden train set"]'), '2'); const start = window.__requests.length; await click(row().querySelector('button')); const immediate = row().querySelector('td.status').textContent; const banner = view.text('p.low-stock'); const req = await waitFor(() => window.__requests.slice(start).find((r) => r.method === 'PATCH')); return (immediate === 'Low stock' && banner.includes('Wooden train set') && req?.url === '/api/inventory/1' && req.body === '{"quantity":2}') || `right after Save: "${immediate}", banner "${banner}", request ${JSON.stringify(req && { url: req.url, body: req.body })}`; } },
        { label: 'rollback on failure', mistake: 'Keep the previous quantity; if the PATCH fails, restore it and show "Could not update <name>".', check: async ({ render, el, App, waitFor, type, click }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 4); const row = () => view.$$('tr.product-row')[1]; await type(view.$('input[aria-label="Quantity for Puzzle cube"]'), '10'); await click(row().querySelector('button')); const optimistic = row().querySelector('td.status').textContent; const rolled = await waitFor(() => row().querySelector('td.status').textContent === 'Low stock' && view.text('.row-error') === 'Could not update Puzzle cube'); return (optimistic === 'In stock' && rolled && view.$('input[aria-label="Quantity for Puzzle cube"]').value === '3') || `optimistic "${optimistic}", then "${row().querySelector('td.status').textContent}", error "${view.text('.row-error')}"`; } },
      ],
    },
    {
      id: 'rproj-form-app',
      title: 'Project: a validated multi-field form',
      source: 'JavaScript & React course, project 30; Part 20',
      runner: 'react',
      expose: ['validate'],
      teach: [
        'Keep all values in one state object and compute errors from it with a **pure** `validate(values)` function. Errors are derived, never stored, so they can never disagree with the inputs.',
        { code: 'function validate(values) {\n  const errors = {};\n  if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";\n  // ... one rule per field\n  return errors;\n}\nconst errors = validate(values);\nconst isValid = Object.keys(errors).length === 0;', lang: 'jsx' },
        { h: 'When to show an error' },
        'Showing "Email is invalid" before someone has typed anything is hostile. Track which fields were **touched** (blurred once) and show a field\'s error only after that, while still validating in real time as they type.',
        { list: ['One `handleChange` for every input: `const { name, type, value, checked } = event.target`, with `checked` for checkboxes.', 'Link errors to inputs: `aria-invalid` and `aria-describedby`.', 'Disable submit until `isValid`. Still validate on submit: disabled buttons are UX, not security.', 'After submit: show a summary, then reset `values` and `touched`.'] },
      ],
      example: [
        { code: 'function handleChange(event) {\n  const { name, type, value, checked } = event.target;\n  setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['`validate(values)` returns an errors object. Rules: `name` at least 2 characters (trimmed) → `Name must be at least 2 characters`; `email` matches `^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$` → `Enter a valid email`; `age` a whole number 13–120 → `Age must be between 13 and 120`; `stream` not empty → `Choose a stream`; `terms` checked → `Accept the terms`.', 'Fields: inputs `name`, `email`, `age` (type number), `select name="stream"` (empty option, `PCMB`, `PCM`, `Commerce`), checkbox `terms`, each with a label; errors in `p.error` with id `<field>-error`, shown only after the field is blurred, with `aria-invalid`/`aria-describedby`.', 'The submit button (`Register`) is disabled until valid. Submitting shows `section.summary` with `Registered <name> (<email>), age <age>, <stream>` and resets the form.'] },
      ],
      starter: `import { useState } from "react";

function validate(values) {
  return {};
}

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Register</button>
    </form>
  );
}
`,
      solution: `import { useState } from "react";

const EMPTY = { name: "", email: "", age: "", stream: "", terms: false };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)) errors.email = "Enter a valid email";
  const age = Number(values.age);
  if (values.age === "" || !Number.isInteger(age) || age < 13 || age > 120) errors.age = "Age must be between 13 and 120";
  if (!values.stream) errors.stream = "Choose a stream";
  if (!values.terms) errors.terms = "Accept the terms";
  return errors;
}

function Field({ name, label, error, touched, children }) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {children}
      {touched && error && (
        <p className="error" id={\`\${name}-error\`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function App() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function aria(name) {
    const show = touched[name] && errors[name];
    return { "aria-invalid": show ? "true" : "false", "aria-describedby": show ? \`\${name}-error\` : undefined };
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) {
      setTouched({ name: true, email: true, age: true, stream: true, terms: true });
      return;
    }
    setSubmitted(values);
    setValues(EMPTY);
    setTouched({});
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <Field name="name" label="Name" error={errors.name} touched={touched.name}>
          <input id="name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} {...aria("name")} />
        </Field>
        <Field name="email" label="Email" error={errors.email} touched={touched.email}>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} {...aria("email")} />
        </Field>
        <Field name="age" label="Age" error={errors.age} touched={touched.age}>
          <input id="age" name="age" type="number" value={values.age} onChange={handleChange} onBlur={handleBlur} {...aria("age")} />
        </Field>
        <Field name="stream" label="Stream" error={errors.stream} touched={touched.stream}>
          <select id="stream" name="stream" value={values.stream} onChange={handleChange} onBlur={handleBlur} {...aria("stream")}>
            <option value="">Choose…</option>
            <option>PCMB</option>
            <option>PCM</option>
            <option>Commerce</option>
          </select>
        </Field>
        <Field name="terms" label="I accept the terms" error={errors.terms} touched={touched.terms}>
          <input id="terms" name="terms" type="checkbox" checked={values.terms} onChange={handleChange} onBlur={handleBlur} {...aria("terms")} />
        </Field>
        <button type="submit" disabled={!isValid}>
          Register
        </button>
      </form>
      {submitted && (
        <section className="summary">
          Registered {submitted.name.trim()} ({submitted.email}), age {submitted.age}, {submitted.stream}
        </section>
      )}
    </div>
  );
}
`,
      checks: [
        { label: 'validate rules', mistake: 'One rule per field, returning the exact messages.', check: ({ exposed }) => { const e = exposed.validate({ name: ' A ', email: 'a@b', age: '12.5', stream: '', terms: false }); const ok = exposed.validate({ name: 'Ammaar', email: 'ammaar@example.com', age: '17', stream: 'PCMB', terms: true }); return (JSON.stringify(e) === JSON.stringify({ name: 'Name must be at least 2 characters', email: 'Enter a valid email', age: 'Age must be between 13 and 120', stream: 'Choose a stream', terms: 'Accept the terms' }) && Object.keys(ok).length === 0) || `invalid: ${JSON.stringify(e)}; valid: ${JSON.stringify(ok)}`; } },
        { label: 'age boundaries', mistake: 'Age must be a whole number from 13 to 120 inclusive.', check: ({ exposed }) => { const base = { name: 'Ammaar', email: 'a@b.co', stream: 'PCM', terms: true }; const out = ['13', '120', '12', '121', '', 'abc'].map((age) => Boolean(exposed.validate({ ...base, age }).age)); return JSON.stringify(out) === '[false,false,true,true,true,true]' || `errors for 13,120,12,121,"",abc: ${JSON.stringify(out)}`; } },
        { label: 'labelled fields', mistake: 'Every input/select needs an id matching its label\'s htmlFor.', check: ({ $$ }) => { const ids = ['name', 'email', 'age', 'stream', 'terms']; const missing = ids.filter((id) => !document.getElementById(id)?.labels?.length); return missing.length === 0 || `fields without a label: ${missing.join(', ')}`; } },
        { label: 'errors appear after blur, linked to the field', mistake: 'Track touched fields on blur; show p.error#<field>-error only then, with aria-invalid and aria-describedby.', check: async ({ type, fire, $ }) => { await type('#email', 'nope'); const early = Boolean($('#email-error')); await fire('#email', 'blur', { bubbles: false }); await fire('#email', 'focusout'); const msg = $('#email-error')?.textContent; return (!early && msg === 'Enter a valid email' && $('#email').getAttribute('aria-invalid') === 'true' && $('#email').getAttribute('aria-describedby') === 'email-error') || (early ? 'the error showed before the field was blurred' : `error "${msg}"`); } },
        { label: 'submit disabled until valid', mistake: 'disabled={!isValid} on the submit button.', check: async ({ type, select, check, $, $$ }) => { const btn = () => $$('button').find((b) => b.textContent === 'Register'); const before = btn()?.disabled; await type('#name', 'Ammaar'); await type('#email', 'ammaar@example.com'); await type('#age', '17'); await select('#stream', 'PCMB'); const almost = btn().disabled; await check('#terms'); return (before === true && almost === true && btn().disabled === false) || `disabled: at start ${before}, before terms ${almost}, when valid ${btn().disabled}`; } },
        { label: 'summary and reset', mistake: 'On submit, show section.summary and reset every field.', check: async ({ type, select, check, click, $, $$, text }) => { await type('#name', 'Priya Shah'); await type('#email', 'priya@example.com'); await type('#age', '18'); await select('#stream', 'PCM'); await check('#terms'); await click($$('button').find((b) => b.textContent === 'Register')); return (text('.summary') === 'Registered Priya Shah (priya@example.com), age 18, PCM' && $('#name').value === '' && $('#terms').checked === false) || `summary "${text('.summary')}", name now "${$('#name').value}"`; } },
      ],
    },
    {
      id: 'rproj-analytics',
      title: 'Project: an analytics dashboard with independent widgets',
      source: 'JavaScript & React course, project 39; Parts 22, 27, 32',
      runner: 'react',
      setup: statsApi,
      teach: [
        'A dashboard is several **independent** data sources on one screen. One slow or broken widget must not blank the others, and a shared filter (the date range) must drive them all.',
        { list: ['Each widget calls its own `useFetch(url)` (from the custom-hooks module), so it has its own loading and error state.', 'The shared filter lives in the dashboard and is passed to every widget; changing it changes every URL, so every effect re-runs (and aborts the old request).', 'A per-widget **Retry** re-runs only that widget: add a `reload()` to `useFetch` (a counter in the effect\'s dependencies).', 'Wrap each widget in its own error boundary as well, so a render bug in one stays in one.'] },
        { code: 'function useFetch(url) {\n  const [reloadKey, setReloadKey] = useState(0);\n  // ... the usual data / loading / error + AbortController\n  useEffect(() => { /* fetch url */ }, [url, reloadKey]);\n  return { data, loading, error, reload: () => setReloadKey((k) => k + 1) };\n}', lang: 'jsx' },
        'Each widget is a `<section aria-labelledby>` with its own heading, which also makes the dashboard navigable by screen-reader users.',
      ],
      example: [
        { code: 'function Widget({ title, children }) {\n  const id = useId();\n  return (\n    <section className="widget" aria-labelledby={id}>\n      <h2 id={id}>{title}</h2>\n      {children}\n    </section>\n  );\n}', lang: 'jsx' },
      ],
      task: [
        'Endpoints: `/api/stats/revenue?range=R` → `{ total }`, `/api/stats/orders?range=R` → `{ count }`, `/api/stats/top-products?range=R` → `[{ id, name, sold }]`, with R `7d` or `30d`.',
        { ol: ['A `select[aria-label="Date range"]` (`7d` "Last 7 days", `30d` "Last 30 days") at the top; default `7d`.', 'Three `section.widget` elements, each with an `h2` (`Revenue`, `Orders`, `Top products`) linked via `aria-labelledby`. While loading each shows `Loading…`.', 'Revenue shows `p.value` `₹45,200`; Orders shows `p.value` `38`; Top products shows `li`s like `Puzzle cube: 14 sold`.', 'A failing widget shows `Could not load <title lowercase>.` and a `Retry` button that refetches only that widget; the others keep working.'] },
      ],
      starter: `import { useState, useEffect } from "react";

export default function App() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    Promise.all([
      fetch("/api/stats/revenue?range=7d").then((r) => r.json()),
      fetch("/api/stats/orders?range=7d").then((r) => r.json()),
      fetch("/api/stats/top-products?range=7d").then((r) => r.json()),
    ]).then(([revenue, orders, top]) => setStats({ revenue, orders, top }));
  }, []);
  if (!stats) return <p>Loading…</p>;
  return (
    <div>
      <section className="widget"><h2>Revenue</h2><p className="value">₹{stats.revenue.total}</p></section>
      <section className="widget"><h2>Orders</h2><p className="value">{stats.orders.count}</p></section>
    </div>
  );
}
`,
      solution: `import { useState, useEffect, useId } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json();
      })
      .then((result) => setData(result))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [url, reloadKey]);

  return { data, loading, error, reload: () => setReloadKey((k) => k + 1) };
}

function Widget({ title, url, children }) {
  const id = useId();
  const { data, loading, error, reload } = useFetch(url);
  let body;
  if (loading) body = <p>Loading…</p>;
  else if (error)
    body = (
      <>
        <p>Could not load {title.toLowerCase()}.</p>
        <button onClick={reload}>Retry</button>
      </>
    );
  else body = children(data);
  return (
    <section className="widget" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {body}
    </section>
  );
}

export default function App() {
  const [range, setRange] = useState("7d");
  return (
    <div>
      <select aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value)}>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>
      <Widget title="Revenue" url={\`/api/stats/revenue?range=\${range}\`}>
        {(data) => <p className="value">₹{data.total.toLocaleString("en-IN")}</p>}
      </Widget>
      <Widget title="Orders" url={\`/api/stats/orders?range=\${range}\`}>
        {(data) => <p className="value">{data.count}</p>}
      </Widget>
      <Widget title="Top products" url={\`/api/stats/top-products?range=\${range}\`}>
        {(data) => (
          <ul>
            {data.map((p) => (
              <li key={p.id}>
                {p.name}: {p.sold} sold
              </li>
            ))}
          </ul>
        )}
      </Widget>
    </div>
  );
}
`,
      checks: [
        { label: 'three labelled widgets', mistake: 'Render three section.widget elements, each aria-labelledby its h2.', check: ({ $$, document }) => { const names = $$('section.widget').map((s) => document.getElementById(s.getAttribute('aria-labelledby'))?.textContent); return JSON.stringify(names) === '["Revenue","Orders","Top products"]' || `widget names: ${JSON.stringify(names)}`; } },
        { label: 'each widget loads its data', mistake: 'Each widget fetches its own URL and shows Loading… until it arrives.', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App)); const loading = view.$$('section.widget').every((s) => s.textContent.includes('Loading…')); const ok = await waitFor(() => view.$$('.widget .value').length === 2 && view.$$('.widget li').length === 2); const values = view.$$('.widget .value').map((p) => p.textContent); return (loading && ok && JSON.stringify(values) === '["₹45,200","38"]' && view.$$('.widget li')[0].textContent === 'Puzzle cube: 14 sold') || `loading ${loading}, values ${JSON.stringify(values)}`; } },
        { label: 'one failure stays in its widget', mistake: 'Each widget handles its own error; changing the range refetches every widget.', check: async ({ render, el, App, waitFor, select }) => { const view = await render(el(App)); await waitFor(() => view.$$('.widget .value').length === 2); await select(view.$('select[aria-label="Date range"]'), '30d'); const ok = await waitFor(() => view.$$('section.widget')[2].textContent.includes('Could not load top products.') && view.$$('.widget .value')[0]?.textContent === '₹1,86,750'); return (ok && view.$$('.widget .value')[1]?.textContent === '151') || `widgets: ${JSON.stringify(view.$$('section.widget').map((s) => s.textContent))}`; } },
        { label: 'retry refetches only that widget', mistake: 'The Retry button calls reload() from that widget\'s useFetch.', check: async ({ render, el, App, waitFor, select, click, window }) => { const view = await render(el(App)); await select(view.$('select[aria-label="Date range"]'), '30d'); await waitFor(() => view.$$('section.widget')[2].textContent.includes('Could not load')); window.__api.overrides['GET /api/stats/top-products?range=30d'] = { body: [{ id: 3, name: 'Science kit', sold: 31 }] }; const start = window.__requests.length; try { await click(view.$$('section.widget')[2].querySelector('button')); const ok = await waitFor(() => view.$$('.widget li')[0]?.textContent === 'Science kit: 31 sold'); const urls = window.__requests.slice(start).map((r) => r.url); return (ok && JSON.stringify(urls) === '["/api/stats/top-products?range=30d"]') || `requests after Retry: ${JSON.stringify(urls)}`; } finally { delete window.__api.overrides['GET /api/stats/top-products?range=30d']; } } },
      ],
    },
  ],
};
