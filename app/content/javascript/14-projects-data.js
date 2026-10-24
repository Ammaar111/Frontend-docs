// JavaScript & React course, project catalogue Tier 2 (projects 13, 16) and Tier 3 (projects 17–24).
import { mockApi } from '../shared/mock-api.js';

const PRODUCTS = `const PRODUCTS = [
  { id: 1, name: "Wooden train set", category: "toys", price: 1200 },
  { id: 2, name: "Puzzle cube", category: "games", price: 300 },
  { id: 3, name: "Concepts of Physics", category: "books", price: 650 },
  { id: 4, name: "Chess board", category: "games", price: 900 },
  { id: 5, name: "Organic Chemistry", category: "books", price: 480 },
  { id: 6, name: "Building blocks", category: "toys", price: 750 },
  { id: 7, name: "Ludo", category: "games", price: 150 },
  { id: 8, name: "Remote control car", category: "toys", price: 2100 },
];
const DEBOUNCE_MS = 120;`;

const profileApi = mockApi({
  'GET /api/users/ammaar': { body: { login: 'ammaar', name: 'Ammaar Khatri', bio: 'PCMB student who builds apps', public_repos: 12, followers: 340 }, delay: 40 },
  'GET /api/users/priya': { body: { login: 'priya', name: 'Priya Shah', bio: 'Frontend developer', public_repos: 31, followers: 1200 }, delay: 40 },
  'GET /api/users/broken': { status: 500, body: {}, delay: 40 },
}) + '\nconst DEBOUNCE_MS = 150;';

const ratesApi = mockApi({
  'GET /api/rates?base=INR': { body: { base: 'INR', rates: { INR: 1, USD: 0.012, EUR: 0.011 } }, delay: 60 },
  'GET /api/rates?base=USD': { body: { base: 'USD', rates: { USD: 1, INR: 83.2, EUR: 0.92 } }, delay: 60 },
  'GET /api/rates?base=EUR': { body: { base: 'EUR', rates: { EUR: 1, INR: 90.5, USD: 1.09 } }, delay: 60 },
});

const contactsApi = mockApi({
  'GET /api/contacts': { body: [{ id: 1, name: 'Ammaar Khatri', email: 'ammaar@example.com' }, { id: 2, name: 'Priya Shah', email: 'priya@example.com' }, { id: 3, name: 'Rohan Mehta', email: 'rohan@example.com' }], delay: 80 },
  'POST /api/contacts': { status: 201, echo: 4, delay: 30 },
  'PUT /api/contacts/1': { echo: 1, delay: 30 },
  'DELETE /api/contacts/2': { status: 204, delay: 30 },
  'DELETE /api/contacts/3': { status: 500, body: { message: 'Server error' }, delay: 30 },
});

export default {
  id: 'js-projects-data',
  title: 'Projects: data, search and APIs',
  lessons: [
    {
      id: 'proj-catalogue-search',
      title: 'Project: a product catalogue with debounced search',
      source: 'JavaScript & React course, projects 13 and 16; Part 10.16',
      runner: 'page',
      slot: 'js',
      setup: PRODUCTS,
      fixture: {
        html: '<div class="controls">\n  <label for="search">Search</label>\n  <input id="search" type="search">\n  <label for="category">Category</label>\n  <select id="category">\n    <option value="all">All</option>\n    <option value="toys">Toys</option>\n    <option value="books">Books</option>\n    <option value="games">Games</option>\n  </select>\n  <label for="sort">Sort</label>\n  <select id="sort">\n    <option value="none">Featured</option>\n    <option value="price-asc">Price: low to high</option>\n    <option value="price-desc">Price: high to low</option>\n  </select>\n</div>\n<p id="count"></p>\n<div id="results"></div>\n<p id="empty" hidden>No results found</p>',
        css: '#results { display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: 1rem; }',
      },
      teach: [
        'Keep the controls\' current values in one place and derive the visible list from them in a single function. Then every combination works by construction:',
        { code: 'function getVisibleProducts() {\n  const query = state.query.toLowerCase();\n  let list = PRODUCTS.filter(\n    (p) => (state.category === "all" || p.category === state.category) && p.name.toLowerCase().includes(query),\n  );\n  if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);\n  if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);\n  return list;\n}', lang: 'js' },
        { warn: '`Array.prototype.sort` sorts **in place**. Sorting `PRODUCTS` directly destroys the original "Featured" order. `filter` already returns a new array, but copy before sorting anyway so the function never depends on that.' },
        { h: 'Debouncing the search box' },
        '`input` fires on every keystroke. For a big list (or a request per search), wait until typing pauses: each keystroke cancels the previous timer and starts a new one.',
        { code: 'function debounce(fn, delayMs) {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delayMs);\n  };\n}', lang: 'js' },
        'Dropdowns change rarely, so they apply immediately; only the text box is debounced.',
        { tip: 'Matching "anywhere, case-insensitive" is `name.toLowerCase().includes(query.toLowerCase())`, not `startsWith`.' },
      ],
      example: [
        { code: 'searchInput.addEventListener("input", debounce((event) => {\n  state.query = event.target.value.trim();\n  render();\n}, DEBOUNCE_MS));', lang: 'js' },
      ],
      task: [
        '`PRODUCTS` and `DEBOUNCE_MS` are defined for you.',
        { ol: ['Render the visible products into `#results` as `article.product` with an `h3` name and `p.price` (`₹1,200`), and `#count` as `N products` (`1 product` for one).', 'Category and sort apply immediately and combine with each other and with the search.', 'Search is case-insensitive, matches anywhere in the name and is debounced by `DEBOUNCE_MS`.', 'When nothing matches, show `#empty` (remove `hidden`); hide it otherwise.', 'Choosing "Featured" again restores the original order.'] },
      ],
      starter: `const results = document.querySelector("#results");

PRODUCTS.forEach((p) => {
  results.innerHTML += \`<article class="product"><h3>\${p.name}</h3><p class="price">₹\${p.price}</p></article>\`;
});

document.querySelector("#sort").addEventListener("change", (event) => {
  if (event.target.value === "price-asc") PRODUCTS.sort((a, b) => a.price - b.price);
});
`,
      solution: `const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sortSelect = document.querySelector("#sort");
const results = document.querySelector("#results");
const countEl = document.querySelector("#count");
const emptyEl = document.querySelector("#empty");

const state = { query: "", category: "all", sort: "none" };

function debounce(fn, delayMs) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

function getVisibleProducts() {
  const query = state.query.toLowerCase();
  let list = PRODUCTS.filter(
    (p) => (state.category === "all" || p.category === state.category) && p.name.toLowerCase().includes(query),
  );
  if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

function render() {
  const visible = getVisibleProducts();
  results.replaceChildren(
    ...visible.map((product) => {
      const article = document.createElement("article");
      article.className = "product";
      const name = document.createElement("h3");
      name.textContent = product.name;
      const price = document.createElement("p");
      price.className = "price";
      price.textContent = \`₹\${product.price.toLocaleString("en-IN")}\`;
      article.append(name, price);
      return article;
    }),
  );
  countEl.textContent = \`\${visible.length} \${visible.length === 1 ? "product" : "products"}\`;
  emptyEl.hidden = visible.length > 0;
}

searchInput.addEventListener(
  "input",
  debounce(() => {
    state.query = searchInput.value.trim();
    render();
  }, DEBOUNCE_MS),
);

categorySelect.addEventListener("change", () => {
  state.category = categorySelect.value;
  render();
});

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});

render();
`,
      checks: [
        { label: 'all products render', mistake: 'Render article.product with an h3 and p.price for every product, and "8 products" in #count.', check: ({ $$, text }) => { const names = $$('article.product h3').map((h) => h.textContent); return (names.length === 8 && names[0] === 'Wooden train set' && text('article.product .price') === '₹1,200' && text('#count') === '8 products') || `showed ${names.length} products, count "${text('#count')}"`; } },
        { label: 'category filter', mistake: 'On change of #category, keep only matching products (or all).', check: async ({ select, $$, text }) => { await select('#category', 'toys'); const names = $$('article.product h3').map((h) => h.textContent); return (JSON.stringify(names) === '["Wooden train set","Building blocks","Remote control car"]' && text('#count') === '3 products') || `toys: ${JSON.stringify(names)}`; } },
        { label: 'sort combines with the category', mistake: 'Sort a copy of the filtered list by price.', check: async ({ select, $$ }) => { await select('#sort', 'price-desc'); const names = $$('article.product h3').map((h) => h.textContent); return JSON.stringify(names) === '["Remote control car","Wooden train set","Building blocks"]' || `got ${JSON.stringify(names)}`; } },
        { label: 'search is debounced', mistake: 'Wrap the input handler in a debounce: the list should not change until typing pauses for DEBOUNCE_MS.', check: async ({ select, type, $$, waitFor }) => { await select('#category', 'all'); await select('#sort', 'price-asc'); await type('#search', 'Ch'); const immediate = $$('article.product').length; const filtered = await waitFor(() => $$('article.product').length === 2); const names = $$('article.product h3').map((h) => h.textContent); return (immediate === 8 && filtered && JSON.stringify(names) === '["Organic Chemistry","Chess board"]') || `right after typing ${immediate} products were shown; then ${JSON.stringify(names)}`; } },
        { label: 'case-insensitive, anywhere in the name', mistake: 'Compare name.toLowerCase().includes(query.toLowerCase()).', check: async ({ type, $$, waitFor, text }) => { await type('#search', 'CUBE'); const ok = await waitFor(() => $$('article.product').length === 1); return (ok && text('article.product h3') === 'Puzzle cube' && text('#count') === '1 product') || `"CUBE" showed ${$$('article.product').length} products, count "${text('#count')}"`; } },
        { label: 'no results message', mistake: 'Show #empty (hidden = false) when nothing matches, and hide it again otherwise.', check: async ({ type, $, $$, waitFor }) => { await type('#search', 'xyz'); const shown = await waitFor(() => !$('#empty').hidden); const none = $$('article.product').length === 0; await type('#search', ''); const back = await waitFor(() => $$('article.product').length === 8); return (shown && none && back && $('#empty').hidden) || `empty message ${shown ? 'shown' : 'not shown'}, then ${$$('article.product').length} products`; } },
        { label: 'original order survives sorting', mistake: 'Never sort PRODUCTS in place: copy first ([...list].sort(...)).', check: async ({ select, $$ }) => { await select('#sort', 'none'); const names = $$('article.product h3').map((h) => h.textContent); return JSON.stringify(names.slice(0, 3)) === '["Wooden train set","Puzzle cube","Concepts of Physics"]' || `"Featured" order is ${JSON.stringify(names.slice(0, 3))}`; } },
      ],
    },
    {
      id: 'proj-profile-search',
      title: 'Project: a profile search (404 vs network failure)',
      source: 'JavaScript & React course, projects 17–19; Part 11.7',
      runner: 'page',
      slot: 'js',
      setup: profileApi,
      fixture: {
        html: '<label for="username">GitHub-style username</label>\n<input id="username" autocomplete="off">\n<p id="status" role="status"></p>\n<div id="profile"></div>',
      },
      teach: [
        'An API search has more outcomes than "worked" and "broke", and the user needs a different message for each:',
        { table: { head: ['What happened', 'How you detect it', 'Message'], rows: [['Empty input', '`query === ""`', 'ask them to type'], ['Request in flight', 'before `await fetch`', 'Loading…'], ['User not found', '`response.status === 404`', 'No user called "x"'], ['Server problem', '`!response.ok` (500, 503…)', 'Something went wrong (HTTP 500)'], ['No connection', '`fetch` **rejects** with a `TypeError`', 'Network error'], ['Success', '`response.ok`', 'show the profile']] } },
        'A 404 is a **successful request** with an error status; a network failure means no response at all. That is why `fetch` resolves for the first and rejects for the second.',
        { h: 'Debounce + cancel' },
        'Debounce the input so typing "ammaar" makes one request, not six. Also abort the previous request when a new search starts: otherwise a slow old response can arrive **after** a newer one and overwrite it (a race condition).',
        { code: 'let controller = null;\nasync function search(query) {\n  controller?.abort();\n  controller = new AbortController();\n  const { signal } = controller;\n  try {\n    const response = await fetch(`/api/users/${encodeURIComponent(query)}`, { signal });\n    // ...\n  } catch (error) {\n    if (error.name === "AbortError") return;   // replaced by a newer search: say nothing\n    // network error\n  }\n}', lang: 'js' },
        { tip: '`encodeURIComponent` stops a username like `a/b?c` from changing the URL\'s structure.' },
      ],
      example: [
        { code: 'if (response.status === 404) {\n  statusEl.textContent = `No user called "${query}"`;\n  return;\n}\nif (!response.ok) throw new Error(`HTTP ${response.status}`);', lang: 'js' },
      ],
      task: [
        { ol: ['On load `#status` reads `Type a username`.', 'Debounce the input by `DEBOUNCE_MS`. Empty input clears `#profile` and shows `Type a username` without a request.', 'Otherwise show `Loading…`, abort any previous request, and fetch `/api/users/<encoded name>`.', 'Success: clear the status and render `h2` (name), `p.bio`, and `ul.stats` with `li`s `Repos: N` and `Followers: N`.', '404: `No user called "<name>"`; other HTTP errors: `Something went wrong (HTTP <status>)`; network failure: `Network error. Check your connection.`; clear `#profile` in each case. Ignore aborted requests.'] },
      ],
      starter: `const input = document.querySelector("#username");
const profile = document.querySelector("#profile");

input.addEventListener("input", async () => {
  const response = await fetch("/api/users/" + input.value);
  const user = await response.json();
  profile.innerHTML = "<h2>" + user.name + "</h2>";
});
`,
      solution: `const input = document.querySelector("#username");
const statusEl = document.querySelector("#status");
const profileEl = document.querySelector("#profile");

let controller = null;

function debounce(fn, delayMs) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

function renderProfile(user) {
  const name = document.createElement("h2");
  name.textContent = user.name;
  const bio = document.createElement("p");
  bio.className = "bio";
  bio.textContent = user.bio;
  const stats = document.createElement("ul");
  stats.className = "stats";
  for (const text of [\`Repos: \${user.public_repos}\`, \`Followers: \${user.followers}\`]) {
    const li = document.createElement("li");
    li.textContent = text;
    stats.append(li);
  }
  profileEl.replaceChildren(name, bio, stats);
}

async function search(query) {
  controller?.abort();
  if (query === "") {
    controller = null;
    profileEl.replaceChildren();
    statusEl.textContent = "Type a username";
    return;
  }

  controller = new AbortController();
  const { signal } = controller;
  statusEl.textContent = "Loading…";

  try {
    const response = await fetch(\`/api/users/\${encodeURIComponent(query)}\`, { signal });
    if (response.status === 404) {
      profileEl.replaceChildren();
      statusEl.textContent = \`No user called "\${query}"\`;
      return;
    }
    if (!response.ok) {
      profileEl.replaceChildren();
      statusEl.textContent = \`Something went wrong (HTTP \${response.status})\`;
      return;
    }
    const user = await response.json();
    if (signal.aborted) return;
    statusEl.textContent = "";
    renderProfile(user);
  } catch (error) {
    if (error.name === "AbortError") return;
    profileEl.replaceChildren();
    statusEl.textContent = "Network error. Check your connection.";
  }
}

input.addEventListener(
  "input",
  debounce(() => search(input.value.trim()), DEBOUNCE_MS),
);

statusEl.textContent = "Type a username";
`,
      checks: [
        { label: 'starts with a prompt', mistake: 'Set #status to "Type a username" on load.', check: ({ text }) => text('#status') === 'Type a username' || `status "${text('#status')}"` },
        { label: 'debounced: one request per pause', mistake: 'Debounce the input handler so typing a name quickly makes one request.', check: async ({ type, window, waitFor, text }) => { const start = window.__requests.length; for (const v of ['a', 'am', 'amm', 'amma', 'ammaa', 'ammaar']) await type('#username', v); const loaded = await waitFor(() => text('#profile h2') === 'Ammaar Khatri'); const urls = window.__requests.slice(start).map((r) => r.url); return (loaded && JSON.stringify(urls) === '["/api/users/ammaar"]') || `requests: ${JSON.stringify(urls)}`; } },
        { label: 'profile details', mistake: 'Render h2 name, p.bio and ul.stats with "Repos: N" and "Followers: N"; clear the status.', check: ({ text, $$ }) => (text('#profile .bio') === 'PCMB student who builds apps' && JSON.stringify($$('#profile .stats li').map((li) => li.textContent)) === '["Repos: 12","Followers: 340"]' && text('#status') === '') || `profile "${text('#profile')}", status "${text('#status')}"` },
        { label: 'user not found', mistake: 'Check response.status === 404 and show `No user called "name"`.', check: async ({ type, waitFor, text }) => { await type('#username', 'nobody'); const ok = await waitFor(() => text('#status') === 'No user called "nobody"'); return (ok && text('#profile') === '') || `status "${text('#status')}"`; } },
        { label: 'server error', mistake: 'For other non-ok responses show `Something went wrong (HTTP 500)`.', check: async ({ type, waitFor, text }) => { await type('#username', 'broken'); const ok = await waitFor(() => text('#status') === 'Something went wrong (HTTP 500)'); return ok || `status "${text('#status')}"`; } },
        { label: 'network failure', mistake: 'fetch rejects (TypeError) when there is no connection: catch it and show the network message.', check: async ({ type, waitFor, text, window }) => { window.__api.offline = true; try { await type('#username', 'priya'); const ok = await waitFor(() => text('#status') === 'Network error. Check your connection.'); return ok || `status "${text('#status')}"`; } finally { window.__api.offline = false; } } },
        { label: 'slow old responses never win', mistake: 'Abort the previous request (AbortController) when a new search starts, and ignore AbortError.', check: async ({ type, wait, waitFor, text, window }) => { window.__api.delays['GET /api/users/ammaar'] = 600; try { await type('#username', 'ammaar'); await wait(220); await type('#username', 'priya'); const ok = await waitFor(() => text('#profile h2') === 'Priya Shah'); await wait(450); return (ok && text('#profile h2') === 'Priya Shah') || `finally showed "${text('#profile h2')}"`; } finally { delete window.__api.delays['GET /api/users/ammaar']; } } },
        { label: 'clearing the box', mistake: 'For empty input, clear #profile and show "Type a username" without a request.', check: async ({ type, waitFor, text, window }) => { const start = window.__requests.length; await type('#username', '   '); const ok = await waitFor(() => text('#status') === 'Type a username'); return (ok && text('#profile') === '' && window.__requests.length === start) || `status "${text('#status')}", requests ${window.__requests.length - start}`; } },
      ],
    },
    {
      id: 'proj-currency',
      title: 'Project: a currency converter with retry',
      source: 'JavaScript & React course, project 20; Part 10.18',
      runner: 'page',
      slot: 'js',
      setup: ratesApi,
      fixture: {
        html: '<form id="converter">\n  <label for="amount">Amount</label>\n  <input id="amount" type="number" value="1000" min="0">\n  <label for="from">From</label>\n  <select id="from"><option>INR</option><option>USD</option><option>EUR</option></select>\n  <label for="to">To</label>\n  <select id="to"><option>INR</option><option selected>USD</option><option>EUR</option></select>\n  <button id="convert" type="submit">Convert</button>\n</form>\n<p id="result" role="status"></p>\n<div id="error" role="alert" hidden>\n  <p id="error-message"></p>\n  <button id="retry" type="button">Try again</button>\n</div>',
      },
      teach: [
        'Live data fails sometimes. A good converter makes failure **recoverable**: it says what went wrong, keeps the user\'s input, and offers a one-click retry of exactly the same conversion.',
        { list: ['Validate before requesting: an amount must be a number above 0.', 'Same currency on both sides needs no request.', 'While loading: disable the button (no double submits) and show progress.', 'Treat a rejected `fetch` and a non-ok response the same way here: rates unavailable.', '`finally` re-enables the button whatever happened.'] },
        { code: 'async function convert() {\n  button.disabled = true;\n  result.textContent = "Converting…";\n  try {\n    const response = await fetch(`/api/rates?base=${from}`);\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    const { rates } = await response.json();\n    // show the result\n  } catch {\n    // show the error box with a retry button\n  } finally {\n    button.disabled = false;\n  }\n}', lang: 'js' },
        { tip: 'Automatic retry with exponential backoff (from the async module) suits background refreshes. For a button the user just pressed, a visible "Try again" is clearer.' },
        'Money formatting: `amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })` gives `4,160.00`.',
      ],
      example: [
        { code: 'const money = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n`${amount.toLocaleString("en-IN")} ${from} = ${money(amount * rate)} ${to}`  // "1,000 INR = 12.00 USD"', lang: 'js' },
      ],
      task: [
        { ol: ['On submit (no reload): if the amount is not above 0, show `Enter an amount above 0` in `#result` and stop.', 'If from and to match, show the result without a request.', 'Otherwise disable `#convert`, show `Converting…`, fetch `/api/rates?base=<from>` and show `1,000 INR = 12.00 USD` (amount in en-IN, result with 2 decimals).', 'On any failure: empty `#result`, show `#error` with `Exchange rates are unavailable right now.`; on success hide `#error`.', '`#retry` hides the error and repeats the last conversion. The button is re-enabled in every case.'] },
      ],
      starter: `document.querySelector("#convert").addEventListener("click", async () => {
  const amount = document.querySelector("#amount").value;
  const from = document.querySelector("#from").value;
  const to = document.querySelector("#to").value;
  const response = await fetch("/api/rates?base=" + from);
  const data = await response.json();
  document.querySelector("#result").textContent = amount * data.rates[to];
});
`,
      solution: `const form = document.querySelector("#converter");
const amountInput = document.querySelector("#amount");
const fromSelect = document.querySelector("#from");
const toSelect = document.querySelector("#to");
const convertButton = document.querySelector("#convert");
const resultEl = document.querySelector("#result");
const errorBox = document.querySelector("#error");
const errorMessage = document.querySelector("#error-message");
const retryButton = document.querySelector("#retry");

const money = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let lastRequest = null;

function showResult(amount, from, converted, to) {
  resultEl.textContent = \`\${amount.toLocaleString("en-IN")} \${from} = \${money(converted)} \${to}\`;
}

async function convert({ amount, from, to }) {
  errorBox.hidden = true;
  if (from === to) {
    showResult(amount, from, amount, to);
    return;
  }

  convertButton.disabled = true;
  resultEl.textContent = "Converting…";
  try {
    const response = await fetch(\`/api/rates?base=\${encodeURIComponent(from)}\`);
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const { rates } = await response.json();
    const rate = rates[to];
    if (typeof rate !== "number") throw new Error(\`No rate for \${to}\`);
    showResult(amount, from, amount * rate, to);
  } catch {
    resultEl.textContent = "";
    errorMessage.textContent = "Exchange rates are unavailable right now.";
    errorBox.hidden = false;
  } finally {
    convertButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(amountInput.value);
  if (amountInput.value.trim() === "" || !(amount > 0)) {
    errorBox.hidden = true;
    resultEl.textContent = "Enter an amount above 0";
    return;
  }
  lastRequest = { amount, from: fromSelect.value, to: toSelect.value };
  convert(lastRequest);
});

retryButton.addEventListener("click", () => {
  if (lastRequest) convert(lastRequest);
});
`,
      checks: [
        { label: 'converts with live rates', mistake: 'Fetch /api/rates?base=<from> and show `1,000 INR = 12.00 USD`.', check: async ({ click, waitFor, text, submits }) => { await click('#convert'); const ok = await waitFor(() => text('#result') === '1,000 INR = 12.00 USD'); return (ok && submits.every((s) => s.prevented)) || `result "${text('#result')}"`; } },
        { label: 'loading state', mistake: 'Disable #convert and show "Converting…" while the request is in flight; re-enable afterwards.', check: async ({ select, type, click, text, $, waitFor }) => { await type('#amount', '50'); await select('#from', 'USD'); await select('#to', 'INR'); await click('#convert'); const during = [text('#result'), $('#convert').disabled]; const done = await waitFor(() => text('#result') === '50 USD = 4,160.00 INR'); return (during[0] === 'Converting…' && during[1] === true && done && !$('#convert').disabled) || `during: "${during[0]}" disabled=${during[1]}; after: "${text('#result')}"`; } },
        { label: 'validation before any request', mistake: 'Reject amounts that are empty or not above 0 without fetching.', check: async ({ type, click, text, window }) => { const start = window.__requests.length; await type('#amount', '0'); await click('#convert'); const zero = text('#result'); await type('#amount', ''); await click('#convert'); return (zero === 'Enter an amount above 0' && text('#result') === 'Enter an amount above 0' && window.__requests.length === start) || `result "${zero}", requests ${window.__requests.length - start}`; } },
        { label: 'same currency needs no request', mistake: 'When from === to, show the result directly.', check: async ({ type, select, click, text, window }) => { const start = window.__requests.length; await type('#amount', '250'); await select('#from', 'EUR'); await select('#to', 'EUR'); await click('#convert'); return (text('#result') === '250 EUR = 250.00 EUR' && window.__requests.length === start) || `result "${text('#result')}", requests ${window.__requests.length - start}`; } },
        { label: 'failure shows a recoverable error', mistake: 'Catch failures: empty #result, unhide #error with the message, re-enable the button.', check: async ({ type, select, click, waitFor, text, $, window }) => { window.__api.offline = true; await type('#amount', '1000'); await select('#from', 'INR'); await select('#to', 'EUR'); await click('#convert'); const shown = await waitFor(() => !$('#error').hidden); return (shown && text('#error-message') === 'Exchange rates are unavailable right now.' && text('#result') === '' && !$('#convert').disabled) || `error ${shown ? 'shown' : 'hidden'}, message "${text('#error-message')}"`; } },
        { label: 'retry repeats the conversion', mistake: '#retry should hide the error and call the same conversion again.', check: async ({ click, waitFor, text, $, window }) => { window.__api.offline = false; await click('#retry'); const ok = await waitFor(() => text('#result') === '1,000 INR = 11.00 EUR'); return (ok && $('#error').hidden) || `after retry: "${text('#result')}", error ${$('#error').hidden ? 'hidden' : 'still shown'}`; } },
        { label: 'HTTP errors are failures too', mistake: 'Check response.ok; a 503 must show the error box, not NaN.', check: async ({ click, waitFor, text, $, window }) => { window.__api.overrides['GET /api/rates'] = { status: 503, body: {} }; try { await click('#convert'); const shown = await waitFor(() => !$('#error').hidden); return (shown && !/NaN/.test(text('#result'))) || `result "${text('#result')}"`; } finally { delete window.__api.overrides['GET /api/rates']; } } },
      ],
    },
    {
      id: 'proj-crud-dashboard',
      title: 'Project: a CRUD dashboard',
      source: 'JavaScript & React course, project 24; Part 11',
      runner: 'page',
      slot: 'js',
      setup: contactsApi,
      fixture: {
        html: '<p id="status" role="status"></p>\n<form id="add-form">\n  <label for="name">Name</label>\n  <input id="name" required>\n  <label for="email">Email</label>\n  <input id="email" type="email" required>\n  <button type="submit">Add contact</button>\n</form>\n<ul id="contacts"></ul>',
      },
      teach: [
        'CRUD = **C**reate (POST), **R**ead (GET), **U**pdate (PUT/PATCH), **D**elete (DELETE). A dashboard needs all four, and each one can fail **independently**.',
        { list: ['Keep `contacts` (an array) as the source of truth; render from it.', 'Update the array only **after** the server confirms (pessimistic updates). Then a failed request leaves the screen matching the server.', 'A failed create must not clear the list or the form: the user should be able to try again.', 'Destructive actions get a confirmation step: `confirm(`Delete ${name}?`)`.', 'Use the server\'s response (with its `id`) as the new item, not your local guess.', 'Disable the submit button while a create is in flight.'] },
        { code: 'async function api(path, options = {}) {\n  const response = await fetch(path, {\n    ...options,\n    headers: { "Content-Type": "application/json", ...options.headers },\n  });\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.status === 204 ? null : response.json();\n}', lang: 'js' },
        { tip: 'Optimistic updates (change the UI first, roll back on failure) feel faster; they appear in the React inventory project. Pessimistic is simpler and correct by default.' },
      ],
      example: [
        { code: 'const updated = await api(`/api/contacts/${id}`, { method: "PUT", body: JSON.stringify({ ...contact, name }) });\ncontacts = contacts.map((c) => (c.id === id ? updated : c));\nrender();', lang: 'js' },
      ],
      task: [
        { ol: ['On load show `Loading contacts…`, GET `/api/contacts`, then clear the status and render `li.contact[data-id]` with `span.name`, `span.email`, `button.edit` ("Edit") and `button.delete` ("Delete").', 'Add: POST JSON `{ name, email }`, disable the submit button while saving, append the returned contact and reset the form. On failure show `Could not add the contact. Try again.` and keep the list and the typed values.', 'Edit: `prompt("New name", currentName)`; empty or cancelled → nothing. Otherwise PUT `/api/contacts/<id>` with `{ name, email }` and update from the response.', 'Delete: `confirm(`Delete <name>?`)`; on yes DELETE `/api/contacts/<id>` and remove it; on failure show `Could not delete <name>.` and keep it.', 'If loading fails, show `Could not load contacts.`'] },
      ],
      starter: `const list = document.querySelector("#contacts");

fetch("/api/contacts")
  .then((response) => response.json())
  .then((contacts) => {
    contacts.forEach((c) => {
      list.innerHTML += "<li>" + c.name + "</li>";
    });
  });
`,
      solution: `const statusEl = document.querySelector("#status");
const form = document.querySelector("#add-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const submitButton = form.querySelector('button[type="submit"]');
const list = document.querySelector("#contacts");

let contacts = [];

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.status === 204 ? null : response.json();
}

function render() {
  list.replaceChildren(
    ...contacts.map((contact) => {
      const li = document.createElement("li");
      li.className = "contact";
      li.dataset.id = contact.id;
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = contact.name;
      const email = document.createElement("span");
      email.className = "email";
      email.textContent = contact.email;
      const edit = document.createElement("button");
      edit.className = "edit";
      edit.textContent = "Edit";
      const remove = document.createElement("button");
      remove.className = "delete";
      remove.textContent = "Delete";
      li.append(name, " ", email, " ", edit, remove);
      return li;
    }),
  );
}

async function loadContacts() {
  statusEl.textContent = "Loading contacts…";
  try {
    contacts = await api("/api/contacts");
    statusEl.textContent = "";
    render();
  } catch {
    statusEl.textContent = "Could not load contacts.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  if (!name || !email) return;
  submitButton.disabled = true;
  try {
    const created = await api("/api/contacts", { method: "POST", body: JSON.stringify({ name, email }) });
    contacts = [...contacts, created];
    statusEl.textContent = "";
    render();
    form.reset();
  } catch {
    statusEl.textContent = "Could not add the contact. Try again.";
  } finally {
    submitButton.disabled = false;
  }
});

list.addEventListener("click", async (event) => {
  const li = event.target.closest(".contact");
  if (!li) return;
  const id = Number(li.dataset.id);
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return;

  if (event.target.closest(".edit")) {
    const name = prompt("New name", contact.name);
    if (name === null || name.trim() === "") return;
    try {
      const updated = await api(\`/api/contacts/\${id}\`, {
        method: "PUT",
        body: JSON.stringify({ name: name.trim(), email: contact.email }),
      });
      contacts = contacts.map((c) => (c.id === id ? updated : c));
      statusEl.textContent = "";
      render();
    } catch {
      statusEl.textContent = \`Could not update \${contact.name}.\`;
    }
  }

  if (event.target.closest(".delete")) {
    if (!confirm(\`Delete \${contact.name}?\`)) return;
    try {
      await api(\`/api/contacts/\${id}\`, { method: "DELETE" });
      contacts = contacts.filter((c) => c.id !== id);
      statusEl.textContent = "";
      render();
    } catch {
      statusEl.textContent = \`Could not delete \${contact.name}.\`;
    }
  }
});

loadContacts();
`,
      checks: [
        { label: 'loading, then the list', mistake: 'Show "Loading contacts…" first, then render one li.contact (with data-id, .name, .email, .edit, .delete) per contact and clear the status.', check: async ({ text, $$, waitFor }) => { const first = text('#status'); const ok = await waitFor(() => $$('li.contact').length === 3); const li = $$('li.contact')[0]; return (first === 'Loading contacts…' && ok && li.dataset.id === '1' && li.querySelector('.name')?.textContent === 'Ammaar Khatri' && li.querySelector('.email')?.textContent === 'ammaar@example.com' && li.querySelector('button.edit') && li.querySelector('button.delete') && text('#status') === '') || `status "${first}", ${$$('li.contact').length} contacts`; } },
        { label: 'create', mistake: 'POST JSON { name, email } with a Content-Type header, append the returned contact and reset the form.', check: async ({ type, click, $$, $, waitFor, window }) => { const start = window.__requests.length; await type('#name', 'Sara Iyer'); await type('#email', 'sara@example.com'); await click('#add-form button'); const ok = await waitFor(() => $$('li.contact').length === 4); const req = window.__requests.slice(start).find((r) => r.method === 'POST'); const last = $$('li.contact')[3]; return (ok && req?.body === '{"name":"Sara Iyer","email":"sara@example.com"}' && /json/.test(req.headers['Content-Type'] ?? '') && last.dataset.id === '4' && $('#name').value === '') || `POST body ${req?.body}, contacts ${$$('li.contact').length}`; } },
        { label: 'a failed create keeps everything', mistake: 'On a failed POST show the error and keep both the list and the typed values.', check: async ({ type, click, waitFor, text, $$, $, window }) => { window.__api.overrides['POST /api/contacts'] = { status: 500, body: {} }; try { await type('#name', 'Dev Rao'); await type('#email', 'dev@example.com'); await click('#add-form button'); const ok = await waitFor(() => text('#status') === 'Could not add the contact. Try again.'); return (ok && $$('li.contact').length === 4 && $('#name').value === 'Dev Rao' && !$('#add-form button').disabled) || `status "${text('#status')}", ${$$('li.contact').length} contacts, name "${$('#name').value}"`; } finally { delete window.__api.overrides['POST /api/contacts']; } } },
        { label: 'update', mistake: 'Edit: prompt for a name, PUT /api/contacts/<id> and render the server\'s response.', check: async ({ click, waitFor, $, state, window }) => { const start = window.__requests.length; state.promptAnswer = 'Ammaar K.'; try { await click($('li.contact[data-id="1"] button.edit')); const ok = await waitFor(() => $('li.contact[data-id="1"] .name')?.textContent === 'Ammaar K.'); const req = window.__requests.slice(start).find((r) => r.method === 'PUT'); return (ok && req?.url === '/api/contacts/1' && JSON.parse(req.body).name === 'Ammaar K.') || `PUT ${req?.url} ${req?.body}`; } finally { state.promptAnswer = null; } } },
        { label: 'empty edit does nothing', mistake: 'If prompt returns null or an empty name, make no request.', check: async ({ click, wait, $, state, window }) => { const start = window.__requests.length; state.promptAnswer = '   '; try { await click($('li.contact[data-id="1"] button.edit')); await wait(60); return window.__requests.length === start || 'an empty name was sent'; } finally { state.promptAnswer = null; } } },
        { label: 'delete asks first', mistake: 'Call confirm(`Delete ${name}?`) and stop when it returns false.', check: async ({ click, wait, $, state, alerts, window }) => { const start = window.__requests.length; state.confirmAnswer = false; try { await click($('li.contact[data-id="2"] button.delete')); await wait(60); return (alerts.includes('Delete Priya Shah?') && window.__requests.length === start && Boolean($('li.contact[data-id="2"]'))) || `confirm messages: ${JSON.stringify(alerts)}`; } finally { state.confirmAnswer = true; } } },
        { label: 'delete', mistake: 'After confirming, DELETE /api/contacts/<id> and remove it from the array.', check: async ({ click, waitFor, $ }) => { await click($('li.contact[data-id="2"] button.delete')); const ok = await waitFor(() => !$('li.contact[data-id="2"]')); return ok || 'Priya is still listed'; } },
        { label: 'a failed delete keeps the contact', mistake: 'If DELETE fails, show `Could not delete <name>.` and keep the item.', check: async ({ click, waitFor, text, $ }) => { await click($('li.contact[data-id="3"] button.delete')); const ok = await waitFor(() => text('#status') === 'Could not delete Rohan Mehta.'); return (ok && Boolean($('li.contact[data-id="3"]'))) || `status "${text('#status')}"`; } },
      ],
    },
  ],
};
