// JavaScript & React course, Final JavaScript Assessment.
import { mockApi } from '../shared/mock-api.js';

export default {
  id: 'js-final',
  title: 'Final JavaScript assessment',
  lessons: [
    {
      id: 'js-final-theory',
      title: 'Assessment A: theory',
      source: 'JavaScript & React course, Final JavaScript Assessment, Section A',
      runner: 'quiz',
      teach: [
        'Before React, prove the foundation is solid. These questions cover the ideas everything after this builds on. If several feel shaky, go back to the module named in the explanation before continuing; React will be much harder otherwise.',
      ],
      example: [
        { code: 'function makeCounters() {\n  const counters = [];\n  for (let i = 0; i < 3; i++) counters.push(() => i);\n  return counters;\n}\nconst [a, b, c] = makeCounters();\nconsole.log(a(), b(), c()); // 0 1 2: let gives each iteration its own i' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Which statement about `var`, `let` and `const` is correct?', options: ['All three are block-scoped', '`var` is function-scoped and reads as undefined before its line; `let`/`const` are block-scoped and throw in the TDZ', '`const` objects cannot be mutated', '`let` cannot be reassigned'], answer: 1, explain: 'Variables, scope and hoisting.' },
        { q: 'What is a closure?', options: ['A function that has finished running', 'A function together with the outer variables it can still reach after the outer function returned', 'A way to close a module', 'A private class field'], answer: 1, explain: 'Functions module, closures lesson.' },
        { q: 'What does `this` refer to inside an arrow function?', options: ['The arrow function itself', 'Whatever `this` was where the arrow was written', 'Always window', 'The object before the dot at the call site'], answer: 1, explain: 'Arrows have no own `this`; they borrow it lexically.' },
        { q: 'You need one number from an array of orders: the total revenue. Which method fits?', options: ['map', 'filter', 'reduce', 'forEach'], answer: 2, explain: 'reduce combines everything into one value; map and filter return arrays.' },
        { q: 'What happens when an async function reaches `await` on a pending promise?', options: ['The whole page freezes until it resolves', 'That function pauses and control returns to its caller; it resumes as a microtask when the promise settles', 'The promise is cancelled', 'It throws'], answer: 1, explain: 'await pauses only its own function.' },
        { q: 'How do you detect a 404 from `fetch`?', options: ['fetch rejects, so use catch', 'Check `response.ok` / `response.status` and throw yourself', 'Read `response.error`', 'It cannot be detected'], answer: 1, explain: 'fetch resolves for every HTTP response; only network failures reject.' },
        { q: 'Why does event delegation work for items added later?', options: ['The browser copies listeners to new elements', 'Events bubble from the new child up to the parent that has the one listener', 'querySelectorAll is live', 'It does not'], answer: 1, explain: 'The listener lives on a stable ancestor.' },
        { q: 'What is the difference between `null` and `undefined`?', options: ['None', '`undefined` means no value was assigned; `null` is an explicit "no value" set on purpose', '`null` is a string', '`undefined` is an object'], answer: 1, explain: 'Data types lesson.' },
        { q: 'Which line correctly makes a new object with one changed key, without mutating `settings`?', options: ['`settings[key] = value`', '`Object.assign(settings, { [key]: value })`', '`{ ...settings, [key]: value }`', '`settings.key = value`'], answer: 2, explain: 'Spread into a new object, then override with a computed key.' },
        { q: 'Which is a microtask?', options: ['A setTimeout callback', 'A click handler', 'A `.then` callback', 'A setInterval callback'], answer: 2, explain: 'Promise callbacks and await continuations are microtasks; they run before the next task.' },
      ],
    },
    {
      id: 'js-final-data',
      title: 'Assessment B: closures, data and classes',
      source: 'JavaScript & React course, Final JavaScript Assessment, Section B Tasks 1, 2, 5',
      runner: 'js',
      teach: [
        'Three tasks from the final assessment. No new concepts: closures for private state, array methods for data, and a class with a getter, a static factory and private validation.',
        { list: ['Private data: keep it in a closure (or `#field`); expose only methods.', 'Data questions are usually `filter` → `map` → `reduce`, plus `new Set` for uniqueness.', 'Validate in the constructor and **throw** on bad input, so an invalid object can never exist.'] },
      ],
      example: [
        { code: 'const orders = [\n  { id: 1, customer: "Ammaar", total: 1500, status: "delivered" },\n  { id: 2, customer: "Priya", total: 800, status: "pending" },\n];\nconst revenue = orders\n  .filter((o) => o.status === "delivered")\n  .reduce((sum, o) => sum + o.total, 0);' },
      ],
      task: [
        { ol: ['`createInventoryTracker()` returns `{ addItem(name, quantity), removeItem(name), getTotal() }` keeping a private inventory; adding the same name again adds to its quantity; `getTotal()` is the total quantity.', '`deliveredRevenue(orders)`: the sum of `total` for delivered orders.', '`uniqueCustomers(orders)`: unique customer names in first-seen order.', '`groupByStatus(orders)`: `{ status: [orders…] }`.', '`class Rectangle`: private `#width`/`#height`, a constructor that throws `Error("Width and height must be non-negative")` for negatives (via a private `#validate()` method), a getter `area`, and `static fromSquare(side)`.'] },
      ],
      setup: 'const __orders = [\n  { id: 1, customer: "Ammaar", total: 1500, status: "delivered" },\n  { id: 2, customer: "Priya", total: 800, status: "pending" },\n  { id: 3, customer: "Ammaar", total: 2200, status: "delivered" },\n  { id: 4, customer: "Rohan", total: 500, status: "cancelled" },\n];',
      starter: 'function createInventoryTracker() {\n\n}\n\nfunction deliveredRevenue(orders) {\n\n}\n\nfunction uniqueCustomers(orders) {\n\n}\n\nfunction groupByStatus(orders) {\n\n}\n\nclass Rectangle {\n\n}\n',
      solution: 'function createInventoryTracker() {\n  const inventory = {};\n  return {\n    addItem(name, quantity) {\n      inventory[name] = (inventory[name] || 0) + quantity;\n    },\n    removeItem(name) {\n      delete inventory[name];\n    },\n    getTotal() {\n      return Object.values(inventory).reduce((sum, qty) => sum + qty, 0);\n    },\n  };\n}\n\nfunction deliveredRevenue(orders) {\n  return orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);\n}\n\nfunction uniqueCustomers(orders) {\n  return [...new Set(orders.map((o) => o.customer))];\n}\n\nfunction groupByStatus(orders) {\n  return orders.reduce((acc, order) => {\n    if (!acc[order.status]) acc[order.status] = [];\n    acc[order.status].push(order);\n    return acc;\n  }, {});\n}\n\nclass Rectangle {\n  #width;\n  #height;\n\n  constructor(width, height) {\n    this.#width = width;\n    this.#height = height;\n    this.#validate();\n  }\n\n  #validate() {\n    if (this.#width < 0 || this.#height < 0) {\n      throw new Error("Width and height must be non-negative");\n    }\n  }\n\n  get area() {\n    return this.#width * this.#height;\n  }\n\n  static fromSquare(side) {\n    return new Rectangle(side, side);\n  }\n}\n',
      checks: [
        { label: 'inventory adds and totals', expr: '(() => { const t = createInventoryTracker(); t.addItem("Pens", 50); t.addItem("Notebooks", 20); t.addItem("Pens", 5); return t.getTotal(); })()', expect: 75, mistake: 'Adding Pens 50, Notebooks 20, Pens 5 should total 75: add to an existing quantity.' },
        { label: 'inventory removes and is private', expr: '(() => { const t = createInventoryTracker(); t.addItem("Pens", 50); t.addItem("Ink", 3); t.removeItem("Pens"); return [t.getTotal(), Object.keys(t).sort()]; })()', expect: [3, ['addItem', 'getTotal', 'removeItem']], mistake: 'removeItem should drop that item, and the tracker should expose only its three methods (inventory stays in the closure).' },
        { label: 'deliveredRevenue', expr: 'deliveredRevenue(__orders)', expect: 3700, mistake: 'deliveredRevenue should be 3700 (1500 + 2200).' },
        { label: 'uniqueCustomers', expr: 'uniqueCustomers(__orders)', expect: ['Ammaar', 'Priya', 'Rohan'], mistake: 'uniqueCustomers should be ["Ammaar", "Priya", "Rohan"].' },
        { label: 'groupByStatus', expr: '(() => { const g = groupByStatus(__orders); return [Object.keys(g), g.delivered.map((o) => o.id)]; })()', expect: [['delivered', 'pending', 'cancelled'], [1, 3]], mistake: 'groupByStatus should create one array per status, in first-seen order.' },
        { label: 'Rectangle area and fromSquare', expr: '[new Rectangle(4, 5).area, Rectangle.fromSquare(5).area, Rectangle.fromSquare(2) instanceof Rectangle]', expect: [20, 25, true], mistake: 'Rectangle needs a getter area and a static fromSquare(side) returning a new Rectangle.' },
        { label: 'Rectangle validates privately', expr: '(() => { let message = "no error"; try { new Rectangle(-1, 2); } catch (e) { message = e.message; } return [message, Object.keys(new Rectangle(1, 1)).length, /#validate\\s*\\(/.test(__source)]; })()', expect: ['Width and height must be non-negative', 0, true], mistake: 'The constructor should call a private #validate() that throws "Width and height must be non-negative"; width and height should be private fields (no public keys).' },
      ],
    },
    {
      id: 'js-final-async',
      title: 'Assessment C: async, API errors and debugging',
      source: 'JavaScript & React course, Final JavaScript Assessment, Section B Tasks 6, 7, 8, 10',
      runner: 'js',
      teach: [
        'The async half of the assessment: parallel requests that tolerate failures, a custom error for 404, a "safe" wrapper that only swallows one specific failure, and a debugging exercise with four bugs.',
        { list: ['`Promise.allSettled` when every result matters, success or not.', 'A custom error class lets callers react to one failure type with `instanceof`.', 'A wrapper that returns `null` must re-throw everything it does not specifically handle.', 'Debugging checklist: missing `await`, missing `response.ok`, braces with no `return`, no `.catch`.'] },
      ],
      example: [
        { code: 'const results = await Promise.allSettled(urls.map((url) => fetch(url).then((r) => r.json())));\nresults.map((result, i) => ({\n  url: urls[i],\n  success: result.status === "fulfilled",\n  data: result.status === "fulfilled" ? result.value : null,\n}));' },
      ],
      task: [
        { ol: ['`fetchAll(urls)` returns `[{ url, success, data }]` for **every** url in parallel; a request counts as failed if it rejects **or** the status is not ok (data `null`).', '`class NotFoundError extends Error` (name `"NotFoundError"`), and `getUserOrThrow(id)` that fetches `/api/users/<id>`: throws `NotFoundError` on 404, `Error("HTTP <status>")` on other failures, returns the JSON otherwise.', '`getUserSafely(id)` returns `null` for a not-found user and lets every other error reject.', 'Fix all bugs in `loadProductNames()` from the course: it must resolve to the product names and reject with `Error("HTTP <status>")` when the response is not ok.'] },
      ],
      setup: mockApi({
        'GET /api/users/1': { body: { id: 1, name: 'Ammaar' } },
        'GET /api/users/2': { body: { id: 2, name: 'Priya' } },
        'GET /api/users/500': { status: 500, body: { message: 'boom' } },
        'GET /api/products': { body: [{ name: 'Mouse' }, { name: 'Keyboard' }] },
        'GET /api/offline': { network: true },
      }),
      starter: 'async function fetchAll(urls) {\n\n}\n\nasync function getUserOrThrow(id) {\n\n}\n\nasync function getUserSafely(id) {\n\n}\n\nasync function loadProductNames() {\n  const response = fetch("/api/products");\n  const data = response.json();\n  return data.map((p) => { p.name });\n}\n',
      solution: 'async function fetchAll(urls) {\n  const results = await Promise.allSettled(\n    urls.map(async (url) => {\n      const response = await fetch(url);\n      if (!response.ok) throw new Error(`HTTP ${response.status}`);\n      return response.json();\n    }),\n  );\n  return results.map((result, index) => ({\n    url: urls[index],\n    success: result.status === "fulfilled",\n    data: result.status === "fulfilled" ? result.value : null,\n  }));\n}\n\nclass NotFoundError extends Error {\n  constructor(id) {\n    super(`User ${id} not found`);\n    this.name = "NotFoundError";\n  }\n}\n\nasync function getUserOrThrow(id) {\n  const response = await fetch(`/api/users/${id}`);\n  if (response.status === 404) throw new NotFoundError(id);\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n\nasync function getUserSafely(id) {\n  try {\n    return await getUserOrThrow(id);\n  } catch (error) {\n    if (error instanceof NotFoundError) return null;\n    throw error;\n  }\n}\n\nasync function loadProductNames() {\n  const response = await fetch("/api/products");\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  const data = await response.json();\n  return data.map((p) => p.name);\n}\n',
      checks: [
        { label: 'fetchAll reports every url', expr: 'fetchAll(["/api/users/1", "/api/users/9", "/api/offline"])', expect: [{ url: '/api/users/1', success: true, data: { id: 1, name: 'Ammaar' } }, { url: '/api/users/9', success: false, data: null }, { url: '/api/offline', success: false, data: null }], mistake: 'fetchAll should return one { url, success, data } per url. A 404 and a network failure both count as failures with data null. Use Promise.allSettled and throw on !response.ok inside each request.' },
        { label: 'fetchAll is parallel', expr: '(async () => { const t = Date.now(); await fetchAll(["/api/users/1", "/api/users/2", "/api/users/1", "/api/users/2"]); return Date.now() - t < 45; })()', expect: true, mistake: 'fetchAll should start every request at once (map + allSettled), not await them one by one.' },
        { label: 'NotFoundError', expr: '(() => { const e = new NotFoundError(3); return [e instanceof Error, e.name]; })()', expect: [true, 'NotFoundError'], mistake: 'NotFoundError should extend Error and set name "NotFoundError".' },
        { label: 'getUserOrThrow', expr: '(async () => [await getUserOrThrow(2), await getUserOrThrow(9).catch((e) => e instanceof NotFoundError), await getUserOrThrow(500).catch((e) => e.message)])()', expect: [{ id: 2, name: 'Priya' }, true, 'HTTP 500'], mistake: 'getUserOrThrow should return the user, throw NotFoundError on 404, and Error("HTTP 500") for a 500.' },
        { label: 'getUserSafely', expr: '(async () => [await getUserSafely(1), await getUserSafely(9), await getUserSafely(500).catch((e) => e.message)])()', expect: [{ id: 1, name: 'Ammaar' }, null, 'HTTP 500'], mistake: 'getUserSafely should return null only for NotFoundError and re-throw everything else.' },
        { label: 'loadProductNames fixed', expr: 'loadProductNames()', expect: ['Mouse', 'Keyboard'], mistake: 'loadProductNames has four bugs: await fetch, await response.json(), check response.ok, and `p => p.name` (braces with no return give undefined).' },
        { label: 'loadProductNames checks ok', expr: '(async () => { __api.overrides["GET /api/products"] = { status: 503 }; const r = await loadProductNames().then(() => "resolved", (e) => e.message); __api.overrides = {}; return r; })()', expect: 'HTTP 503', mistake: 'loadProductNames should reject with "HTTP 503" when the response is not ok.' },
      ],
    },
  ],
};
