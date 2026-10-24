// JavaScript & React course, Part 29 (architecture), 30 (state management), 31 (performance).
import { mockApi } from '../shared/mock-api.js';

const shopApi = mockApi({
  'GET /api/products': { body: [{ id: 1, name: 'Wooden train set', price: 1200 }, { id: 2, name: 'Puzzle cube', price: 300 }, { id: 3, name: 'Science kit', price: 150000 }], delay: 30 },
  'GET /api/products/1': { body: { id: 1, name: 'Wooden train set', price: 1200 }, delay: 20 },
  'GET /api/products/99': { status: 404, body: { message: 'Not found' }, delay: 20 },
  'POST /api/products': { status: 201, echo: 4, delay: 20 },
});

const lazySetup = `
let __adminLoads = 0;
globalThis.__adminLoads = () => __adminLoads;
// Stands in for import("./AdminDashboard.jsx"): a module that takes 60 ms to download.
function loadAdminDashboard() {
  __adminLoads += 1;
  return new Promise((resolve) =>
    setTimeout(() => resolve({ default: function AdminDashboard() { return React.createElement("h2", null, "Admin dashboard"); } }), 60),
  );
}
`;

export default {
  id: 'react-architecture',
  title: 'Architecture, state and performance',
  lessons: [
    {
      id: 'arch-layers',
      title: 'Folder structure and the service layer',
      source: 'JavaScript & React course, Part 29',
      runner: 'react',
      component: 'ProductListPage',
      expose: ['apiRequest', 'productService', 'useProducts', 'formatPrice', 'ProductCard'],
      setup: shopApi,
      teach: [
        'Past a handful of components, **where code lives** matters as much as how it works. A predictable structure tells everyone where to find, and where to add, each kind of code.',
        { code: 'src/\n├── components/   small reusable UI (Button, Card, ProductCard): props in, callbacks out\n├── pages/        route-level screens that compose components and load data\n├── hooks/        custom hooks: reusable stateful logic\n├── services/     the API layer: every request goes through here\n├── utils/        pure helpers with no React (formatting, validation)\n├── context/      providers + their hooks (AuthProvider, useAuth)\n├── assets/       images, fonts\n├── styles/       global CSS, theme\n└── App.jsx', lang: 'text' },
        { h: 'Separate the UI from the data layer' },
        { code: '// 🔴 fetch inside the component: URL, headers and error handling tangled with rendering\nfunction ProductList() {\n  const [products, setProducts] = useState([]);\n  useEffect(() => {\n    fetch("https://api.example.com/products").then((res) => res.json()).then(setProducts);\n  }, []);\n}', lang: 'jsx' },
        'If the base URL changes or every request needs an auth header, you would edit every component. Instead, each layer gets **one job**:',
        { code: '// services/apiClient.js\nconst BASE_URL = "https://api.toyshop.in";\nexport async function apiRequest(path, options = {}) {\n  const response = await fetch(`${BASE_URL}${path}`, {\n    ...options,\n    headers: { "Content-Type": "application/json", ...options.headers },\n  });\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.status === 204 ? null : response.json();\n}\n\n// services/productService.js\nexport const productService = {\n  getProducts: () => apiRequest("/api/products"),\n  getProduct: (id) => apiRequest(`/api/products/${id}`),\n  createProduct: (data) => apiRequest("/api/products", { method: "POST", body: JSON.stringify(data) }),\n};', lang: 'jsx' },
        { table: { head: ['Layer', 'Responsibility', 'Must not'], rows: [['UI (`components/`, `pages/`)', 'render from props/state', 'call `fetch`, hold business rules'], ['Hooks (`hooks/`)', 'stateful logic, bridge UI and services', 'contain JSX, know API URLs'], ['Services (`services/`)', 'talk to the API, shape requests/responses', 'import React, use hooks'], ['Utils (`utils/`)', 'pure helpers', 'depend on React or component state']] } },
        { warn: 'Spread `...options` **before** `headers`, then merge the headers. `{ headers: {...}, ...options }` lets a caller\'s `options.headers` replace the JSON header entirely.' },
        { tip: '`Number.toLocaleString("en-IN")` formats with Indian digit grouping: `150000` → `1,50,000`.' },
      ],
      example: [
        { code: '// pages/ProductListPage.jsx\nfunction ProductListPage() {\n  const { products, loading, error } = useProducts();\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <div>{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>;\n}', lang: 'jsx' },
      ],
      task: [
        'Everything is in one file here, but keep the layers separate as if each were its own module.',
        { ol: ['**Service layer**: `BASE_URL = "https://api.toyshop.in"`, `apiRequest(path, options)` (JSON header merged, `HTTP <status>` errors, `null` for 204) and `productService` with `getProducts`, `getProduct(id)`, `createProduct(data)` (POST).', '**Util**: `formatPrice(amount)` → `"₹1,200"` using `en-IN` grouping.', '**Hook**: `useProducts()` → `{ products, loading, error }` using `productService.getProducts()` (products start as `[]`).', '**Component**: `ProductCard({ product })` → `<article className="product-card"><h3>name</h3><p>formatted price</p></article>`, no data loading inside.', '**Page**: `ProductListPage` shows `Loading...`, `Error: …`, or the cards.'] },
      ],
      starter: `import { useState, useEffect } from "react";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("https://api.toyshop.in/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);
  return (
    <div>
      {products.map((p) => (
        <article key={p.id} className="product-card">
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
        </article>
      ))}
    </div>
  );
}
`,
      solution: `import { useState, useEffect } from "react";

// services/apiClient.js
const BASE_URL = "https://api.toyshop.in";

async function apiRequest(path, options = {}) {
  const response = await fetch(\`\${BASE_URL}\${path}\`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.status === 204 ? null : response.json();
}

// services/productService.js
const productService = {
  getProducts: () => apiRequest("/api/products"),
  getProduct: (id) => apiRequest(\`/api/products/\${id}\`),
  createProduct: (data) => apiRequest("/api/products", { method: "POST", body: JSON.stringify(data) }),
};

// utils/format.js
function formatPrice(amount) {
  return \`₹\${amount.toLocaleString("en-IN")}\`;
}

// hooks/useProducts.js
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    productService
      .getProducts()
      .then((data) => {
        if (!ignore) setProducts(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { products, loading, error };
}

// components/ProductCard.jsx
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
    </article>
  );
}

// pages/ProductListPage.jsx
function ProductListPage() {
  const { products, loading, error } = useProducts();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
`,
      checks: [
        { label: 'service functions', mistake: 'productService.getProducts() and getProduct(id) should return the parsed JSON from apiRequest.', check: async ({ exposed }) => { const list = await exposed.productService.getProducts(); const one = await exposed.productService.getProduct(1); return (Array.isArray(list) && list.length === 3 && one?.name === 'Wooden train set') || `got ${JSON.stringify(list)?.slice(0, 60)} and ${JSON.stringify(one)}`; } },
        { label: 'apiRequest throws on HTTP errors', mistake: 'Check response.ok and throw new Error(`HTTP ${response.status}`).', check: async ({ exposed }) => { try { const value = await exposed.productService.getProduct(99); return `it resolved with ${JSON.stringify(value)}`; } catch (err) { return err.message === 'HTTP 404' || `it threw "${err.message}"`; } } },
        { label: 'POST sends JSON with merged headers', mistake: 'createProduct should POST JSON.stringify(data); apiRequest must spread options first and then merge headers, keeping Content-Type.', check: async ({ exposed, window }) => { const start = window.__requests.length; const created = await exposed.apiRequest('/api/products', { method: 'POST', body: JSON.stringify({ name: 'Kite' }), headers: { Authorization: 'Bearer t' } }); await exposed.productService.createProduct({ name: 'Yo-yo', price: 90 }); const [a, b] = window.__requests.slice(start); return (created?.id === 4 && a?.headers['Content-Type'] === 'application/json' && a?.headers.Authorization === 'Bearer t' && b?.method === 'POST' && b?.body === '{"name":"Yo-yo","price":90}') || `requests: ${JSON.stringify(window.__requests.slice(start).map((r) => ({ method: r.method, headers: r.headers, body: r.body })))}`; } },
        { label: 'base URL lives in one place', mistake: 'Declare const BASE_URL once and build every URL from it; no other component should hard-code the host or call fetch.', check: ({ source }) => { const hosts = (source.match(/api\.toyshop\.in/g) || []).length; const fetches = (source.match(/(?<![\w.])fetch\(/g) || []).length; return (/const\s+BASE_URL\s*=/.test(source) && hosts === 1 && fetches === 1) || `the host appears ${hosts} time(s) and fetch( ${fetches} time(s)`; } },
        { label: 'formatPrice uses Indian grouping', mistake: 'Return `₹${amount.toLocaleString("en-IN")}`.', check: ({ exposed }) => { const out = [exposed.formatPrice(1200), exposed.formatPrice(150000), exposed.formatPrice(0)]; return JSON.stringify(out) === '["₹1,200","₹1,50,000","₹0"]' || `got ${JSON.stringify(out)}`; } },
        { label: 'ProductCard is presentational', mistake: 'ProductCard should render only from its product prop: <h3> name and <p> formatPrice(price).', check: async ({ render, el, exposed, window }) => { const start = window.__requests.length; const view = await render(el(exposed.ProductCard, { product: { id: 9, name: 'Kite', price: 2500 } })); return (view.text('article.product-card h3') === 'Kite' && view.text('article.product-card p') === '₹2,500' && window.__requests.length === start) || `card shows "${view.text()}"`; } },
        { label: 'page composes the layers', mistake: 'ProductListPage should use useProducts() and render a ProductCard per product, after "Loading...".', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App)); const first = view.text(); const ok = await waitFor(() => view.$$('article.product-card').length === 3); return (first === 'Loading...' && ok && view.text('article.product-card:last-child p') === '₹1,50,000') || `showed "${first}" then "${view.text().slice(0, 80)}"`; } },
      ],
    },
    {
      id: 'state-lifting',
      title: 'Lifting state up and deriving values',
      source: 'JavaScript & React course, Part 30.1, 30.2',
      runner: 'react',
      expose: ['TemperatureInput'],
      teach: [
        'Picking where state lives is a decision, not a new mechanism:',
        { table: { head: ['Tool', 'Scope'], rows: [['`useState`', 'one component'], ['lifted state', 'a parent and its nearby children, via props'], ['Context', 'many components deep in a subtree'], ['`useReducer`', 'complex update logic (combine with any of the above)']] } },
        { h: 'Two siblings, one truth' },
        { code: '// 🔴 each input owns its own state: they can never see each other\nfunction TemperatureInput() {\n  const [value, setValue] = useState("");\n  return <input value={value} onChange={(e) => setValue(e.target.value)} />;\n}', lang: 'jsx' },
        'When siblings must stay in sync, move the state up to their **closest common parent** and pass it down as props. The children become **controlled**: they show `value` and report changes through `onChange`.',
        { code: 'function TemperatureInput({ label, value, onChange }) {\n  return <input aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />;\n}\n\nfunction App() {\n  const [celsius, setCelsius] = useState("");\n  const fahrenheit = celsius === "" ? "" : (Number(celsius) * 9) / 5 + 32;   // derived, not stored\n  return <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />;\n}', lang: 'jsx' },
        'To let **both** inputs be edited, store the one value the user typed plus **which scale** they typed it in, and derive the other. Storing both temperatures would let them drift out of sync.',
        { tip: 'Lifting is right when the common parent is a level or two up. When it is far up and props would pass through many components that do not use them, that is prop drilling: use Context.' },
      ],
      example: [
        { code: 'function tryConvert(value, convert) {\n  if (value.trim() === "" || Number.isNaN(Number(value))) return "";\n  return String(Math.round(convert(Number(value)) * 1000) / 1000);\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['`TemperatureInput({ label, value, onChange })`: a controlled `<input aria-label={label}>` with **no state of its own**.', '`App` keeps `temperature` and `scale` (`"c"` or `"f"`) and derives the other value with `tryConvert` (round to 3 decimals; invalid or empty input gives `""`).', 'Typing in either box updates the other. Below them, when Celsius is a number, show `<p className="verdict">The water would boil.</p>` (≥ 100 °C) or `The water would not boil.`'] },
      ],
      starter: `import { useState } from "react";

function TemperatureInput({ label }) {
  const [value, setValue] = useState("");
  return <input aria-label={label} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export default function App() {
  return (
    <div>
      <TemperatureInput label="Celsius" />
      <TemperatureInput label="Fahrenheit" />
    </div>
  );
}
`,
      solution: `import { useState } from "react";

function toCelsius(f) {
  return ((f - 32) * 5) / 9;
}

function toFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

function tryConvert(value, convert) {
  if (value.trim() === "" || Number.isNaN(Number(value))) return "";
  return String(Math.round(convert(Number(value)) * 1000) / 1000);
}

function TemperatureInput({ label, value, onChange }) {
  return <input aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />;
}

export default function App() {
  const [temperature, setTemperature] = useState("");
  const [scale, setScale] = useState("c");

  const celsius = scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;
  const celsiusNumber = celsius.trim() === "" ? NaN : Number(celsius);

  return (
    <div>
      <TemperatureInput
        label="Celsius"
        value={celsius}
        onChange={(value) => {
          setScale("c");
          setTemperature(value);
        }}
      />
      <TemperatureInput
        label="Fahrenheit"
        value={fahrenheit}
        onChange={(value) => {
          setScale("f");
          setTemperature(value);
        }}
      />
      {!Number.isNaN(celsiusNumber) && (
        <p className="verdict">{celsiusNumber >= 100 ? "The water would boil." : "The water would not boil."}</p>
      )}
    </div>
  );
}
`,
      checks: [
        { label: 'Celsius updates Fahrenheit', mistake: 'Lift the state into App and derive Fahrenheit with tryConvert(temperature, toFahrenheit).', check: async ({ $, type }) => { await type('input[aria-label="Celsius"]', '100'); return $('input[aria-label="Fahrenheit"]').value === '212' || `Fahrenheit shows "${$('input[aria-label="Fahrenheit"]').value}"`; } },
        { label: 'Fahrenheit updates Celsius', mistake: 'Store which scale was edited; derive Celsius from a Fahrenheit edit.', check: async ({ $, type }) => { await type('input[aria-label="Fahrenheit"]', '50'); const c = $('input[aria-label="Celsius"]').value; await type('input[aria-label="Fahrenheit"]', '-40'); return (c === '10' && $('input[aria-label="Celsius"]').value === '-40') || `50 °F gave "${c}" °C`; } },
        { label: 'invalid input clears the other box', mistake: 'tryConvert should return "" for empty or non-numeric input.', check: async ({ $, type }) => { await type('input[aria-label="Celsius"]', 'abc'); const a = $('input[aria-label="Fahrenheit"]').value; await type('input[aria-label="Celsius"]', ''); return (a === '' && $('input[aria-label="Fahrenheit"]').value === '') || `"abc" gave "${a}"`; } },
        { label: 'rounded to 3 decimals', mistake: 'Round with Math.round(x * 1000) / 1000.', check: async ({ $, type }) => { await type('input[aria-label="Fahrenheit"]', '100'); return $('input[aria-label="Celsius"]').value === '37.778' || `100 °F gave "${$('input[aria-label="Celsius"]').value}"`; } },
        { label: 'boiling verdict', mistake: 'Show the verdict from the derived Celsius value (≥ 100 boils), only when it is a number.', check: async ({ $, type, text }) => { const none = !$('.verdict'); await type('input[aria-label="Fahrenheit"]', '212'); const boil = text('.verdict'); await type('input[aria-label="Celsius"]', '20'); return (none && boil === 'The water would boil.' && text('.verdict') === 'The water would not boil.') || `verdicts: ${none ? '' : 'shown while empty; '}"${boil}", "${text('.verdict')}"`; } },
        { label: 'TemperatureInput is controlled', mistake: 'TemperatureInput must show its value prop and call onChange; it must not keep its own state.', check: async ({ render, el, exposed, type }) => { const calls = []; const view = await render(el(exposed.TemperatureInput, { label: 'T', value: '7', onChange: (v) => calls.push(v) })); await type(view.$('input'), '8'); return (calls[0] === '8' && view.$('input').value === '7') || `onChange got ${JSON.stringify(calls)}, input shows "${view.$('input').value}"`; } },
      ],
    },
    {
      id: 'state-management-quiz',
      title: 'Choosing where state lives: client vs server state',
      source: 'JavaScript & React course, Part 29.4, 30.3–30.5',
      runner: 'quiz',
      teach: [
        '**Client state** exists only in the browser: is the modal open, what is typed in the field, which tab is active. `useState`, `useReducer` and Context are built for it.',
        '**Server state** lives on a server; your component shows a cached, possibly stale copy (products, the user profile, order history). It brings problems client state does not have:',
        { list: ['**Caching**: the header and the profile page both need the user. Should each fetch it?', '**Staleness**: the server data can change at any time.', '**Background revalidation**: refetch when the tab regains focus.', '**Deduplication**: five components asking for the same URL should cause one request.', '**Retries** with backoff.'] },
        { h: 'TanStack Query' },
        { code: 'import { useQuery } from "@tanstack/react-query";\n\nfunction ProductList() {\n  const { data: products, isLoading, error } = useQuery({\n    queryKey: ["products"],              // same key = same cache entry and one shared request\n    queryFn: () => productService.getProducts(),\n  });\n  if (isLoading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error.message}</p>;\n  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}', lang: 'jsx' },
        'It looks like `useFetch` and adds caching by key, background refetching, retries and `useMutation` with cache invalidation. Building `useFetch` yourself first is what lets you debug such a library when its abstraction leaks.',
        { table: { head: ['Question', 'Tool'], rows: [['Purely local UI state?', '`useState`'], ['A sibling needs it too?', 'lift it to the common parent'], ['Many distant components need it?', 'Context'], ['Many related update cases?', '`useReducer`'], ['It lives on a server and several components need it?', 'a server-state tool (`useFetch` for small apps, TanStack Query in production)'], ['Should survive reload / be shareable?', 'the URL (`useSearchParams`) or storage']] } },
      ],
      example: [
        { code: '// client state\nconst [isMenuOpen, setIsMenuOpen] = useState(false);\n\n// server state\nconst { data: orders } = useQuery({ queryKey: ["orders", userId], queryFn: () => getOrders(userId) });', lang: 'jsx' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Two sibling components must show the same selected date. The simplest correct fix is…', options: ['Give each its own useState and sync them with useEffect', 'Lift the state to their nearest common parent and pass it down', 'Put it in localStorage', 'Use a ref'], answer: 1, explain: 'One source of truth in the common parent; syncing two copies with effects is fragile.' },
        { q: 'Which is server state?', options: ['Whether a dropdown is open', 'Text typed in a search box', 'The list of a user\'s orders', 'The active tab'], answer: 2, explain: 'Orders live in the backend; the component holds a copy.' },
        { q: 'Why does `queryKey` matter in TanStack Query?', options: ['It encrypts the request', 'Identical keys share one cache entry and one in-flight request', 'It sets the HTTP method', 'It is the URL'], answer: 1, explain: 'That is how it caches and deduplicates.' },
        { q: 'In a layered app, the API base URL changes. What should you edit?', options: ['Every component that loads data', 'Only the service layer (one constant/config)', 'All custom hooks', 'The router'], answer: 1, explain: 'Components and hooks only call service functions, so they do not change.' },
        { q: 'Which belongs in `utils/`?', options: ['useProducts', 'AuthProvider', 'formatPrice(amount)', 'ProductListPage'], answer: 2, explain: 'Pure, React-free helpers go in utils.' },
        { q: 'A `components/ProductCard` should…', options: ['Fetch its own product', 'Receive the product through props and report clicks through callbacks', 'Read the router to find the product', 'Write to localStorage'], answer: 1, explain: 'Presentational components stay reusable by not knowing where data comes from.' },
        { q: 'When is Context a better fit than lifting state?', options: ['When the common ancestor is one level up', 'When many deeply nested components need the value and intermediate components do not', 'Always', 'Never; Context is deprecated'], answer: 1, explain: 'That is the prop-drilling case.' },
      ],
    },
    {
      id: 'perf-memo',
      title: 'Re-renders, React.memo, useMemo and useCallback',
      source: 'JavaScript & React course, Part 31.1–31.4, 31.6; Part 23.8–23.9',
      runner: 'react',
      expose: ['ItemList'],
      teach: [
        'When a component re-renders, **every child re-renders too**, even if its props did not change. That is usually fine: rendering is just calling functions and diffing the result; React only touches the DOM where something changed.',
        'It becomes a problem only when a render is genuinely expensive (huge lists, heavy computation) or happens far too often (every keystroke, every scroll frame). **Measure first** with the React DevTools Profiler; intuition about what is slow is often wrong.',
        { h: 'React.memo' },
        '`memo(Component)` skips re-rendering when every prop is the same as last time (compared with `Object.is`, i.e. by reference for objects and functions).',
        { code: 'const ItemList = memo(function ItemList({ items, onSelect }) { /* ... */ });\n\nfunction Parent() {\n  // ❌ both props are NEW on every render, so memo never skips\n  const visible = ITEMS.filter((i) => i.name.includes(query));\n  return <ItemList items={visible} onSelect={(id) => setSelectedId(id)} />;\n}', lang: 'jsx' },
        { code: 'const visible = useMemo(() => ITEMS.filter((i) => i.name.includes(query)), [query]); // same array until query changes\nconst handleSelect = useCallback((id) => setSelectedId(id), []);                     // same function every render', lang: 'jsx' },
        '`useMemo` caches a **value**; `useCallback` caches a **function** (it is `useMemo(() => fn, deps)`). Their main job is keeping props stable for a memoized child, or keeping an effect\'s dependency from changing every render.',
        { warn: 'Default to **not** using them. Each one stores dependencies and compares them every render; for cheap work that overhead can cost more than it saves, and it adds noise. The app must behave identically without them.' },
        'Workflow: build it plainly and correctly → measure → optimise the one measured bottleneck with the narrowest tool.',
      ],
      example: [
        { code: 'function ItemList({ items, onSelect }) {\n  console.log("render list");    // watch how often this prints\n  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;\n}', lang: 'jsx' },
      ],
      task: [
        'Pretend `ItemList` is slow (it logs `render list` each time it renders). Right now clicking the counter re-renders it.',
        { ol: ['Wrap `ItemList` in `memo`.', 'Memoize the filtered list with `useMemo` (depends on `query`).', 'Memoize the select handler with `useCallback`.', 'Result: clicking the counter or selecting an item does **not** re-render the list, but typing a filter does.'] },
      ],
      starter: `import { useState } from "react";

const ITEMS = [
  { id: 1, name: "Physics notes" },
  { id: 2, name: "Chemistry lab manual" },
  { id: 3, name: "Maths formula sheet" },
  { id: 4, name: "Biology diagrams" },
  { id: 5, name: "Physics past papers" },
];

function ItemList({ items, onSelect }) {
  console.log("render list");
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={() => onSelect(item.id)}>{item.name}</button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const visible = ITEMS.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <button className="counter" onClick={() => setCount(count + 1)}>Clicked {count} times</button>
      <input aria-label="Filter" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p className="selected">Selected: {selectedId ?? "none"}</p>
      <ItemList items={visible} onSelect={(id) => setSelectedId(id)} />
    </div>
  );
}
`,
      solution: `import { useState, useMemo, useCallback, memo } from "react";

const ITEMS = [
  { id: 1, name: "Physics notes" },
  { id: 2, name: "Chemistry lab manual" },
  { id: 3, name: "Maths formula sheet" },
  { id: 4, name: "Biology diagrams" },
  { id: 5, name: "Physics past papers" },
];

const ItemList = memo(function ItemList({ items, onSelect }) {
  console.log("render list");
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={() => onSelect(item.id)}>{item.name}</button>
        </li>
      ))}
    </ul>
  );
});

export default function App() {
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const visible = useMemo(
    () => ITEMS.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const handleSelect = useCallback((id) => setSelectedId(id), []);

  return (
    <div>
      <button className="counter" onClick={() => setCount(count + 1)}>Clicked {count} times</button>
      <input aria-label="Filter" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p className="selected">Selected: {selectedId ?? "none"}</p>
      <ItemList items={visible} onSelect={handleSelect} />
    </div>
  );
}
`,
      checks: [
        { label: 'ItemList is memoized', mistake: 'Wrap it: const ItemList = memo(function ItemList(...) { ... }).', check: ({ exposed }) => exposed.ItemList?.$$typeof === Symbol.for('react.memo') || 'ItemList is a plain component' },
        { label: 'counter clicks skip the list', mistake: 'memo alone is not enough: the filtered array (useMemo) and the handler (useCallback) must keep the same reference.', check: async ({ click, logs }) => { const before = logs.filter((l) => l === 'render list').length; for (let i = 0; i < 3; i += 1) await click('.counter'); const after = logs.filter((l) => l === 'render list').length; return after === before || `the list re-rendered ${after - before} time(s) for 3 counter clicks`; } },
        { label: 'selecting skips the list too', mistake: 'useCallback((id) => setSelectedId(id), []) keeps onSelect stable.', check: async ({ $$, click, logs, text }) => { const before = logs.filter((l) => l === 'render list').length; await click($$('li button')[2]); const after = logs.filter((l) => l === 'render list').length; return (text('.selected') === 'Selected: 3' && after === before) || (text('.selected') !== 'Selected: 3' ? `shows "${text('.selected')}"` : `the list re-rendered ${after - before} time(s)`); } },
        { label: 'filtering still updates the list', mistake: 'useMemo must list query as a dependency, or the list goes stale.', check: async ({ type, $$, logs }) => { const before = logs.filter((l) => l === 'render list').length; await type('input[aria-label="Filter"]', 'physics'); const names = $$('li').map((li) => li.textContent); return (JSON.stringify(names) === '["Physics notes","Physics past papers"]' && logs.filter((l) => l === 'render list').length > before) || `the list shows ${JSON.stringify(names)}`; } },
      ],
    },
    {
      id: 'perf-lazy',
      title: 'Code splitting with lazy and Suspense',
      source: 'JavaScript & React course, Part 31.5; Part 12.1',
      runner: 'react',
      setup: lazySetup,
      teach: [
        'By default every component you import ends up in the **initial** JavaScript download, even pages most users never open. `lazy` defers downloading a component\'s code until it is first rendered, using dynamic `import()` (which returns a Promise for the module).',
        { code: 'import { lazy, Suspense } from "react";\n\nconst AdminDashboard = lazy(() => import("./AdminDashboard.jsx"));   // a separate chunk\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading dashboard...</p>}>\n      <AdminDashboard />\n    </Suspense>\n  );\n}', lang: 'jsx' },
        '`<Suspense fallback>` shows the fallback while the code downloads, like a loading state for **code** rather than data.',
        { list: ['Call `lazy` at **module level**, once. Calling it inside a component creates a new lazy component on every render: it re-downloads and loses its state.', 'The module must have a **default export** (the component).', 'Good candidates: whole route pages, admin panels, rarely opened modals with heavy dependencies.'] },
        { note: 'This sandbox cannot load files, so `loadAdminDashboard()` stands in for `import("./AdminDashboard.jsx")`: it resolves to `{ default: AdminDashboard }` after 60 ms.' },
      ],
      example: [
        { code: 'const Settings = lazy(() => import("./pages/Settings.jsx"));\n\n<Route\n  path="/settings"\n  element={\n    <Suspense fallback={<Spinner />}>\n      <Settings />\n    </Suspense>\n  }\n/>', lang: 'jsx' },
      ],
      task: [
        { ol: ['Create `AdminDashboard` with `lazy(loadAdminDashboard)` at the top level.', 'The app shows an `Open admin` button. Only after clicking it, render the dashboard inside `<Suspense fallback={<p>Loading dashboard...</p>}>`.', 'The code must be downloaded once, and not before it is needed.'] },
      ],
      starter: `import { useState } from "react";

function AdminDashboard() {
  return <h2>Admin dashboard</h2>;
}

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open admin</button>
      {open && <AdminDashboard />}
    </div>
  );
}
`,
      solution: `import { useState, lazy, Suspense } from "react";

const AdminDashboard = lazy(loadAdminDashboard);

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open admin</button>
      {open && (
        <Suspense fallback={<p>Loading dashboard...</p>}>
          <AdminDashboard />
        </Suspense>
      )}
    </div>
  );
}
`,
      checks: [
        { label: 'not downloaded before it is needed', mistake: 'Render the lazy component only after the button is clicked.', check: ({ window }) => window.__adminLoads() === 0 || `the dashboard code was loaded ${window.__adminLoads()} time(s) before anyone opened it` },
        { label: 'fallback while loading, then the dashboard', mistake: 'const AdminDashboard = lazy(loadAdminDashboard), wrapped in <Suspense fallback={<p>Loading dashboard...</p>}>.', check: async ({ $$, click, text, waitFor, window }) => { await click($$('button').find((b) => b.textContent === 'Open admin')); const during = text(); const loaded = await waitFor(() => text('h2') === 'Admin dashboard'); return (during.includes('Loading dashboard...') && loaded && window.__adminLoads() === 1) || (window.__adminLoads() === 0 ? 'loadAdminDashboard was never called: use lazy(loadAdminDashboard)' : `while loading it showed "${during}"`); } },
        { label: 'downloaded only once', mistake: 'Call lazy() once at module level, not inside the component.', check: async ({ render, el, App, $$, click, waitFor, window }) => { for (let i = 0; i < 2; i += 1) { const view = await render(el(App)); await click(view.$$('button').find((b) => b.textContent === 'Open admin')); await waitFor(() => view.text('h2') === 'Admin dashboard'); } return window.__adminLoads() === 1 || `the code was downloaded ${window.__adminLoads()} times`; } },
      ],
    },
  ],
};
