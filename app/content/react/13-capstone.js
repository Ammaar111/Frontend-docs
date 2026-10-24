// JavaScript & React course, the capstone: an inventory + order management dashboard.
import { shopServer } from '../shared/shop-server.js';

// The domain layer written in the capstone-domain lesson, given to later lessons.
const DOMAIN = `// ---- utils and reducers (from the domain lesson) ----
const VALID_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
const ALL_STATUSES = Object.keys(VALID_TRANSITIONS);

function isValidTransition(current, next) {
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

function getStockStatus(quantity) {
  if (quantity === 0) return "out-of-stock";
  if (quantity <= 5) return "low-stock";
  return "in-stock";
}

function getLowStockItems(products) {
  return products.filter((p) => getStockStatus(p.quantity) === "low-stock");
}

function formatCurrency(amount) {
  return \`₹\${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
}

// ---- services/apiClient.js ----
async function apiRequest(path, options = {}) {
  const response = await fetch(\`/api\${path}\`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error = new Error(body?.message || \`Request failed with status \${response.status}\`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}
`;

const REDUCER = `function orderStatusReducer(order, action) {
  switch (action.type) {
    case "SET_ORDER":
      return action.payload;
    case "TRANSITION_STATUS":
      if (!isValidTransition(order.status, action.payload)) {
        throw new Error(\`Cannot transition from "\${order.status}" to "\${action.payload}".\`);
      }
      return { ...order, status: action.payload };
    case "ROLLBACK_STATUS":
      return { ...order, status: action.payload };
    default:
      throw new Error(\`Unknown action type: \${action.type}\`);
  }
}
`;

const NOTIFICATIONS = `// ---- contexts/NotificationContext.jsx ----
const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const showNotification = useCallback((message, type = "info") => {
    const id = \`\${Date.now()}-\${Math.random()}\`;
    setNotifications((list) => [...list, { id, message, type }]);
    setTimeout(() => setNotifications((list) => list.filter((n) => n.id !== id)), 4000);
  }, []);
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <ul className="notifications" role="status">
        {notifications.map((n) => (
          <li key={n.id} className={n.type}>
            {n.message}
          </li>
        ))}
      </ul>
    </NotificationContext.Provider>
  );
}

function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
}
`;

export default {
  id: 'react-capstone',
  title: 'Capstone: inventory and order dashboard',
  lessons: [
    {
      id: 'capstone-plan',
      title: 'Capstone stages 1–5: requirements, data, architecture, routes',
      source: 'JavaScript & React course, capstone stages 1–5',
      runner: 'quiz',
      teach: [
        'The capstone is an **inventory + order management dashboard**. It is built the way real apps are: requirements before code, architecture before components, working software at every stage. It needs nearly everything: two related resources, routing, shared state, a rule-constrained state machine, async complexity and real architecture.',
        { h: 'Stage 1: requirements' },
        { ol: ['Products: paginated, searchable list filterable by category and stock; detail page; create, edit, delete (with confirmation); an always-visible low-stock count (quantity ≤ 5).', 'Orders: paginated list filterable by status; a detail page with line items; create an order from several products with a running total.', 'Status transitions: `pending → processing → shipped → delivered`, and `pending`/`processing → cancelled`. Shipped or delivered orders can **not** be cancelled: the UI must enforce this, not just suggest it.', 'Creating an order decrements stock; cancelling restores it.', 'Dashboard: totals, orders by status, low-stock list.', 'Every view handles loading, error and empty states; everything works by keyboard with semantic markup.', 'Frontend only: it targets a REST API assumed to exist.'] },
        '**Out of scope**, written down on purpose: authentication, real-time updates between users, multiple currencies, exhaustive tests. An unstated boundary invites scope creep and makes it unclear whether a missing feature is a bug.',
        { h: 'Stage 2: data model' },
        { code: 'interface Product { id: string; name: string; category: string; price: number; quantity: number }\n\ninterface OrderLineItem {\n  productId: string;\n  productName: string;   // copied at order time\n  quantity: number;\n  unitPrice: number;     // copied at order time\n}\n\ntype OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";\n\ninterface Order { id: string; status: OrderStatus; lineItems: OrderLineItem[]; total: number; createdAt: string }', lang: 'ts' },
        'A cart is **transient**: it should show today\'s price, so it stores only `productId`. An order is a **historical record**: it must keep the price actually charged even if the product price changes next month, so line items **denormalize** (copy) the name and unit price, and the total is stored.',
        { h: 'Stage 3: architecture' },
        { code: 'src/\n  services/   apiClient.js, productService.js, orderService.js   (all fetch calls)\n  hooks/      useProducts, useProduct, useOrders, useOrder, useProductMutations, useOrderMutations\n  reducers/   orderStatusReducer.js\n  contexts/   NotificationContext.jsx                            (app-wide toasts)\n  utils/      inventoryUtils.js, orderUtils.js, formatters.js   (pure, testable)\n  components/ AppLayout, ErrorBoundary, ProductTable, ProductForm, OrderTable,\n              OrderStatusBadge, LowStockBanner, Modal           (props only, no fetch)\n  pages/      DashboardPage, ProductListPage, ProductDetailPage, ProductFormPage,\n              OrderListPage, OrderDetailPage, NewOrderPage', lang: 'text' },
        'Each layer has one reason to change: API shape → `services/`; business rule (the low-stock threshold) → `utils/`; looks → `components/`.',
        { h: 'Stages 4–5: component tree and routes' },
        { code: '<Routes>\n  <Route element={<AppLayout />}>\n    <Route path="/" element={<DashboardPage />} />\n    <Route path="/products" element={<ProductListPage />} />\n    <Route path="/products/new" element={<ProductFormPage />} />\n    <Route path="/products/:id" element={<ProductDetailPage />} />\n    <Route path="/products/:id/edit" element={<ProductFormPage />} />\n    <Route path="/orders" element={<OrderListPage />} />\n    <Route path="/orders/new" element={<NewOrderPage />} />\n    <Route path="/orders/:id" element={<OrderDetailPage />} />\n  </Route>\n  <Route path="*" element={<NotFoundPage />} />\n</Routes>', lang: 'jsx' },
        'Editing a product gets its **own URL** (linkable, survives refresh, Back works), unlike editing a note in place: the question is always "does this state deserve a URL?".',
      ],
      example: [
        { code: '// The API contract: one call creates the order AND decrements stock, atomically, on the server.\ncreateOrder({ lineItems: [{ productId: "p1", quantity: 2 }] });\n// Never: N "decrement stock" calls + 1 "create order" call from the browser.', lang: 'js' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Why do order line items copy `productName` and `unitPrice` instead of only storing `productId`?', options: ['To save bandwidth', 'An order is a historical record and must keep the price actually charged', 'React requires it', 'Product ids can change'], answer: 1, explain: 'Transactional data snapshots its inputs; a cart, which is live, does not.' },
        { q: 'Why is "shipped orders cannot be cancelled" enforced in code rather than with a warning?', options: ['It is faster', 'It is a business rule; the UI must make the invalid action impossible (and the server must reject it too)', 'Warnings are not accessible', 'It is out of scope'], answer: 1, explain: 'Requirement 10 says the UI enforces it, and the server has the final say.' },
        { q: 'Why should `createOrder` be one request instead of several "decrement stock" requests plus "create order"?', options: ['Fewer requests are always better', 'A failure between calls could leave stock and orders inconsistent; the server must do both atomically', 'PATCH is not allowed', 'For caching'], answer: 1, explain: 'The frontend says what it wants; the backend performs the multi-step change as a unit.' },
        { q: 'Which layer changes if the low-stock threshold moves from 5 to 10?', options: ['services/', 'components/', 'utils/ (inventoryUtils)', 'Every page'], answer: 2, explain: 'Business rules live in pure utilities.' },
        { q: 'Why does product editing get `/products/:id/edit`?', options: ['Forms need their own route', 'The edit state is meaningful: linkable, refresh-safe, and Back/Forward work', 'Edit forms are slow', 'React Router requires it'], answer: 1, explain: 'A quick throwaway edit (a note) can stay local; this one deserves a URL.' },
        { q: 'Why list "out of scope" items explicitly?', options: ['Documentation tools need it', 'So a missing feature is a known decision, not an ambiguous bug, and scope creep is visible', 'For SEO', 'It is a legal requirement'], answer: 1, explain: 'The final review checks the build against both lists.' },
        { q: 'Which component may call a service directly?', options: ['ProductTable', 'OrderStatusBadge', 'Neither: pages use hooks, hooks use services; components get props', 'Modal'], answer: 2, explain: 'Presentational components receive data and callbacks through props only.' },
      ],
    },
    {
      id: 'capstone-domain',
      title: 'Capstone stage 6: the domain layer',
      source: 'JavaScript & React course, capstone stages 6, 9, 10, 12',
      runner: 'js',
      teach: [
        'Before any component, write the **pure** functions that encode the business rules. They are the cheapest code to test and the most expensive to get wrong.',
        { h: 'Where each piece of state lives' },
        { table: { head: ['State', 'Lives in', 'Why'], rows: [['product list + search/filter/page', '`useProducts`, local to the list page', 'only that page needs it'], ['a form draft', '`useState` in the form page', 'transient, one view'], ['order status', '`orderStatusReducer` in the order page', 'several rule-constrained transitions'], ['toasts', '`NotificationContext`', 'triggered from anywhere'], ['low-stock count', '**derived** with `getLowStockItems(products)`', 'a stored copy would drift']] } },
        { h: 'The transition table is the rule' },
        { code: 'const VALID_TRANSITIONS = {\n  pending: ["processing", "cancelled"],\n  processing: ["shipped", "cancelled"],\n  shipped: ["delivered"],\n  delivered: [],\n  cancelled: [],\n};\nfunction isValidTransition(current, next) {\n  return VALID_TRANSITIONS[current]?.includes(next) ?? false;\n}', lang: 'js' },
        '`isValidTransition` is exported separately so that the reducer **enforces** the rule and the UI **offers** only valid buttons, from one source of truth.',
        { h: 'The reducer, and a bug in the course\'s version' },
        'The course\'s reducer starts with `TRANSITION_STATUS` only; wiring it to a fetch reveals it also needs `SET_ORDER` to load the order. The course then rolls back a failed optimistic update by dispatching `TRANSITION_STATUS` with the previous status. That **throws**: `processing → pending` is not a valid transition. A rollback is not a business transition, so it gets its own action:',
        { code: 'case "ROLLBACK_STATUS":\n  return { ...order, status: action.payload };   // restores what the server still has', lang: 'js' },
        { warn: 'React runs reducers during rendering, so a reducer that throws behaves like a component that throws: an error boundary catches it. That is acceptable for a programming error (a button that should never exist) but never for an expected event like a failed request.' },
        { h: 'Order helpers' },
        { list: ['`calculateOrderTotal(lineItems)` sums `unitPrice × quantity`.', '`buildLineItems(selection, products)` snapshots name and price from `{ productId, quantity }` pairs.', '`stockProblems(selection, products)` lists lines that ask for more than is in stock: UX validation before the server\'s real check.', '`formatCurrency(1598)` → `"₹1,598.00"`.', '`performOptimisticUpdate({ applyChange, revertChange, apiCall, onSuccess, onError })` captures the apply → try → roll back shape once (stage 12, refactor 2).'] },
      ],
      example: [
        { code: 'stockProblems([{ productId: "p2", quantity: 6 }], products);\n// ["Only 4 × USB-C cable in stock"]', lang: 'js' },
      ],
      task: [
        'Write: `VALID_TRANSITIONS`, `isValidTransition(current, next)`, `orderStatusReducer(order, action)` (`SET_ORDER`, `TRANSITION_STATUS` that throws `Cannot transition from "<a>" to "<b>".` when invalid, `ROLLBACK_STATUS`, and `Unknown action type: <type>` for anything else), `getStockStatus`, `getLowStockItems`, `calculateOrderTotal`, `buildLineItems` (throws `Unknown product: <id>`), `stockProblems`, `formatCurrency` and `performOptimisticUpdate` (resolves either way; returns the API result on success).',
      ],
      starter: `const VALID_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

function isValidTransition(current, next) {
  return VALID_TRANSITIONS[current].includes(next);
}

function orderStatusReducer(order, action) {
  switch (action.type) {
    case "TRANSITION_STATUS":
      order.status = action.payload;
      return order;
    default:
      return order;
  }
}

function calculateOrderTotal(lineItems) {
  return lineItems.reduce((sum, item) => sum + item.unitPrice, 0);
}
`,
      solution: `const VALID_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function isValidTransition(current, next) {
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

function orderStatusReducer(order, action) {
  switch (action.type) {
    case "SET_ORDER":
      return action.payload;
    case "TRANSITION_STATUS":
      if (!isValidTransition(order.status, action.payload)) {
        throw new Error(\`Cannot transition from "\${order.status}" to "\${action.payload}".\`);
      }
      return { ...order, status: action.payload };
    case "ROLLBACK_STATUS":
      return { ...order, status: action.payload };
    default:
      throw new Error(\`Unknown action type: \${action.type}\`);
  }
}

function getStockStatus(quantity) {
  if (quantity === 0) return "out-of-stock";
  if (quantity <= 5) return "low-stock";
  return "in-stock";
}

function getLowStockItems(products) {
  return products.filter((p) => getStockStatus(p.quantity) === "low-stock");
}

function calculateOrderTotal(lineItems) {
  return lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function buildLineItems(selection, products) {
  return selection.map(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error(\`Unknown product: \${productId}\`);
    return { productId, productName: product.name, quantity, unitPrice: product.price };
  });
}

function stockProblems(selection, products) {
  return selection.flatMap(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return [\`Unknown product: \${productId}\`];
    return quantity > product.quantity ? [\`Only \${product.quantity} × \${product.name} in stock\`] : [];
  });
}

function formatCurrency(amount) {
  return \`₹\${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
}

async function performOptimisticUpdate({ applyChange, revertChange, apiCall, onSuccess, onError }) {
  applyChange();
  try {
    const result = await apiCall();
    onSuccess?.(result);
    return result;
  } catch (error) {
    revertChange();
    onError?.(error);
    return undefined;
  }
}
`,
      checks: [
        { label: 'the transition rule', expr: '[["pending","processing"],["pending","cancelled"],["processing","shipped"],["processing","cancelled"],["shipped","cancelled"],["shipped","delivered"],["delivered","pending"],["cancelled","processing"],["unknown","pending"]].map(([a, b]) => isValidTransition(a, b))', expect: [true, true, true, true, false, true, false, false, false], mistake: 'shipped can only become delivered; delivered and cancelled are final; an unknown status returns false (?. and ??).' },
        { label: 'SET_ORDER and TRANSITION_STATUS', expr: '(() => { const o = Object.freeze({ id: "o1", status: "pending", total: 10 }); const a = orderStatusReducer(null, { type: "SET_ORDER", payload: o }); const b = orderStatusReducer(a, { type: "TRANSITION_STATUS", payload: "processing" }); return [a === o, b.status, o.status, b.total]; })()', expect: [true, 'processing', 'pending', 10], mistake: 'SET_ORDER returns the payload; TRANSITION_STATUS returns a copy with the new status.' },
        { label: 'invalid transitions throw', expr: '(() => { try { orderStatusReducer({ status: "shipped" }, { type: "TRANSITION_STATUS", payload: "cancelled" }); return "no error"; } catch (e) { return e.message; } })()', expect: 'Cannot transition from "shipped" to "cancelled".', mistake: 'Check isValidTransition and throw the exact message.' },
        { label: 'rollback bypasses the rule', expr: 'orderStatusReducer(Object.freeze({ id: "o1", status: "processing" }), { type: "ROLLBACK_STATUS", payload: "pending" })', expect: { id: 'o1', status: 'pending' }, mistake: 'ROLLBACK_STATUS restores a previous status without the transition check.' },
        { label: 'unknown actions throw', expr: '(() => { try { orderStatusReducer({ status: "pending" }, { type: "NOPE" }); return "no error"; } catch (e) { return e.message; } })()', expect: 'Unknown action type: NOPE', mistake: 'The default case throws `Unknown action type: ${action.type}`.' },
        { label: 'stock helpers', expr: '[[0, 1, 5, 6].map(getStockStatus), getLowStockItems([{ id: "a", quantity: 0 }, { id: "b", quantity: 3 }, { id: "c", quantity: 5 }, { id: "d", quantity: 9 }]).map((p) => p.id)]', expect: [['out-of-stock', 'low-stock', 'low-stock', 'in-stock'], ['b', 'c']], mistake: 'Low stock is 1–5; 0 is out of stock and is not "low".' },
        { label: 'order totals and snapshots', expr: '(() => { const products = [{ id: "p1", name: "Mouse", price: 799, quantity: 3 }, { id: "p5", name: "Pens", price: 250, quantity: 2 }]; const items = buildLineItems([{ productId: "p1", quantity: 2 }, { productId: "p5", quantity: 1 }], products); products[0].price = 999; return [items, calculateOrderTotal(items), calculateOrderTotal([])]; })()', expect: [[{ productId: 'p1', productName: 'Mouse', quantity: 2, unitPrice: 799 }, { productId: 'p5', productName: 'Pens', quantity: 1, unitPrice: 250 }], 1848, 0], mistake: 'Copy name and price into each line item; the total multiplies unitPrice by quantity.' },
        { label: 'unknown products and stock problems', expr: '(() => { const products = [{ id: "p2", name: "USB-C cable", price: 349, quantity: 4 }]; let thrown = "no error"; try { buildLineItems([{ productId: "zz", quantity: 1 }], products); } catch (e) { thrown = e.message; } return [thrown, stockProblems([{ productId: "p2", quantity: 6 }, { productId: "p2", quantity: 4 }], products)]; })()', expect: ['Unknown product: zz', ['Only 4 × USB-C cable in stock']], mistake: 'buildLineItems throws for unknown ids; stockProblems reports lines above the available quantity.' },
        { label: 'currency format', expr: '[formatCurrency(1598), formatCurrency(150000.5), formatCurrency(0)]', expect: ['₹1,598.00', '₹1,50,000.50', '₹0.00'], mistake: 'en-IN grouping with exactly 2 decimals.' },
        { label: 'optimistic update helper', expr: '(async () => { const log = []; const ok = await performOptimisticUpdate({ applyChange: () => log.push("apply"), revertChange: () => log.push("revert"), apiCall: async () => { log.push("call"); return 7; }, onSuccess: (r) => log.push("success:" + r) }); const failed = await performOptimisticUpdate({ applyChange: () => log.push("apply"), revertChange: () => log.push("revert"), apiCall: async () => { throw new Error("boom"); }, onError: (e) => log.push("error:" + e.message) }); return [ok, failed === undefined, log]; })()', expect: [7, true, ['apply', 'call', 'success:7', 'apply', 'revert', 'error:boom']], mistake: 'Apply, await the call, then onSuccess; on failure revert and onError, without throwing.' },
      ],
    },
    {
      id: 'capstone-products',
      title: 'Capstone stages 7–8: the product list',
      source: 'JavaScript & React course, capstone stages 7, 8, 11',
      runner: 'react',
      component: 'ProductListPage',
      setup: shopServer(),
      teach: [
        'The product list combines a service, a stateful hook and a page. All requests go through `apiRequest` (given), which turns error responses into `Error`s carrying the server\'s message and `status`.',
        { code: 'function getProducts({ search = "", category = "all", page = 1, pageSize = 3, signal } = {}) {\n  const params = new URLSearchParams({ search, category, page, pageSize });\n  return apiRequest(`/products?${params}`, { signal });\n}', lang: 'jsx' },
        { warn: 'The course passes `signal` into `getProducts` but never forwards it to `fetch`, so nothing is actually aborted. Forward it, or the AbortController is decoration.' },
        { h: 'useProducts' },
        { code: 'function updateFilters(changes) {\n  const resetPage = "search" in changes || "category" in changes;\n  setFilters((prev) => ({ ...prev, ...changes, page: resetPage ? 1 : changes.page ?? prev.page }));\n}', lang: 'jsx' },
        'Putting the "new filter → page 1" rule **inside** `updateFilters` means no caller can forget it, including filters added later.',
        { list: ['`status`: `loading` → `success` | `empty` | `error` (one value, never contradictory booleans).', 'The effect depends on `filters`, so any change refetches; its cleanup aborts the previous request.', 'The search box keeps its own text; a debounced copy is pushed into the filters by an effect.', 'The low-stock banner is **derived** from the loaded products with `getLowStockItems`.'] },
      ],
      example: [
        { code: 'const debouncedSearch = useDebouncedValue(searchInput, 300);\nuseEffect(() => {\n  updateFilters({ search: debouncedSearch });\n}, [debouncedSearch]);', lang: 'jsx' },
      ],
      task: [
        'The domain helpers and `apiRequest` are given. Page size is 3.',
        { ol: ['`getProducts(options)` forwards `signal`. `useProducts()` returns `{ status, products, totalPages, error, filters, updateFilters }` with filters `{ search: "", category: "all", page: 1 }`, page reset on search/category changes and abort on change.', '`ProductListPage`: `input[aria-label="Search products"]` (debounced 300 ms), `select[aria-label="Category"]` (`all`, `Electronics`, `Home`, `Stationery`).', 'States: `Loading products...`, `Failed to load products: <message>` (`p.error`), `No products match your search.`, or a table of `tr.product-row` (name, category, `formatCurrency(price)`, stock status) with `Previous`/`Next` and `Page N of M`.', 'When the loaded products include low stock: `<p role="alert" className="low-stock">Low stock: A, B</p>`.'] },
      ],
      starter: `import { useState, useEffect } from "react";

${DOMAIN}
function ProductListPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    apiRequest("/products?page=1&pageSize=3").then((data) => setProducts(data.products));
  }, []);
  return (
    <table>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="product-row">
            <td>{p.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
      solution: `import { useState, useEffect } from "react";

${DOMAIN}
// ---- services/productService.js ----
function getProducts({ search = "", category = "all", page = 1, pageSize = 3, signal } = {}) {
  const params = new URLSearchParams({ search, category, page, pageSize });
  return apiRequest(\`/products?\${params}\`, { signal });
}

// ---- hooks ----
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function useProducts() {
  const [filters, setFilters] = useState({ search: "", category: "all", page: 1 });
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState({ products: [], totalPages: 1 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    getProducts({ ...filters, signal: controller.signal })
      .then((result) => {
        setData(result);
        setStatus(result.products.length === 0 ? "empty" : "success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [filters]);

  function updateFilters(changes) {
    const resetPage = "search" in changes || "category" in changes;
    setFilters((prev) => {
      const next = { ...prev, ...changes, page: resetPage ? 1 : changes.page ?? prev.page };
      const same = next.search === prev.search && next.category === prev.category && next.page === prev.page;
      return same ? prev : next;
    });
  }

  return { status, products: data.products, totalPages: data.totalPages, error, filters, updateFilters };
}

// ---- components ----
const STOCK_LABELS = { "in-stock": "In stock", "low-stock": "Low stock", "out-of-stock": "Out of stock" };

function ProductTable({ products }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="product-row">
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>{formatCurrency(product.price)}</td>
            <td>{STOCK_LABELS[getStockStatus(product.quantity)]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LowStockBanner({ items }) {
  return (
    <p role="alert" className="low-stock">
      Low stock: {items.map((p) => p.name).join(", ")}
    </p>
  );
}

// ---- pages/ProductListPage.jsx ----
function ProductListPage() {
  const { status, products, totalPages, error, filters, updateFilters } = useProducts();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300);

  useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const lowStock = getLowStockItems(products);

  return (
    <div>
      {status === "success" && lowStock.length > 0 && <LowStockBanner items={lowStock} />}
      <input aria-label="Search products" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      <select aria-label="Category" value={filters.category} onChange={(e) => updateFilters({ category: e.target.value })}>
        <option value="all">All categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Home">Home</option>
        <option value="Stationery">Stationery</option>
      </select>

      {status === "loading" && <p>Loading products...</p>}
      {status === "error" && <p className="error">Failed to load products: {error}</p>}
      {status === "empty" && <p>No products match your search.</p>}
      {status === "success" && (
        <>
          <ProductTable products={products} />
          <nav aria-label="Pagination">
            <button disabled={filters.page === 1} onClick={() => updateFilters({ page: filters.page - 1 })}>
              Previous
            </button>
            <span className="page">
              Page {filters.page} of {totalPages}
            </span>
            <button disabled={filters.page >= totalPages} onClick={() => updateFilters({ page: filters.page + 1 })}>
              Next
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
`,
      checks: [
        { label: 'first page loads', mistake: 'useProducts starts loading with { search: "", category: "all", page: 1 } and pageSize 3; show "Loading products..." first.', check: async ({ render, el, App, waitFor, window }) => { const start = window.__requests.length; const view = await render(el(App)); const first = view.text().includes('Loading products...'); const ok = await waitFor(() => view.$$('tr.product-row').length === 3); const names = view.$$('tr.product-row td:first-child').map((td) => td.textContent); return (first && ok && JSON.stringify(names) === '["Wireless mouse","USB-C cable","Desk lamp"]' && view.text('.page') === 'Page 1 of 3' && window.__requests.slice(start).some((r) => r.url === '/api/products?search=&category=all&page=1&pageSize=3')) || `loading shown: ${first}; rows ${JSON.stringify(names)}; requests ${JSON.stringify(window.__requests.slice(start).map((r) => r.url))}`; } },
        { label: 'table cells', mistake: 'Each row shows name, category, formatCurrency(price) and the stock label.', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 3); const cells = view.$$('tr.product-row')[1].querySelectorAll('td'); return [...cells].map((td) => td.textContent).join('|') === 'USB-C cable|Electronics|₹349.00|Low stock' || `row: ${[...cells].map((td) => td.textContent).join('|')}`; } },
        { label: 'derived low-stock banner', mistake: 'Derive the banner from getLowStockItems(products); out-of-stock items are not "low".', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 3); return view.text('p.low-stock[role="alert"]') === 'Low stock: USB-C cable' || `banner "${view.text('p.low-stock')}"`; } },
        { label: 'pagination', mistake: 'Next/Previous update the page filter; disable them at the ends.', check: async ({ render, el, App, waitFor, click }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 3); const btn = (l) => view.$$('button').find((b) => b.textContent === l); const prevDisabled = btn('Previous').disabled; await click(btn('Next')); await waitFor(() => view.text('.page') === 'Page 2 of 3'); await click(btn('Next')); await waitFor(() => view.text('.page') === 'Page 3 of 3'); const names = view.$$('tr.product-row td:first-child').map((td) => td.textContent); return (prevDisabled && JSON.stringify(names) === '["Wall clock"]' && btn('Next').disabled) || `page "${view.text('.page')}", rows ${JSON.stringify(names)}`; } },
        { label: 'a new filter resets to page 1', mistake: 'Inside updateFilters, set page: 1 whenever search or category changes.', check: async ({ render, el, App, waitFor, click, select }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 3); await click(view.$$('button').find((b) => b.textContent === 'Next')); await waitFor(() => view.text('.page') === 'Page 2 of 3'); await select(view.$('select[aria-label="Category"]'), 'Stationery'); const ok = await waitFor(() => view.text('.page') === 'Page 1 of 1'); const names = view.$$('tr.product-row td:first-child').map((td) => td.textContent); return (ok && JSON.stringify(names) === '["Notebook (A5)","Gel pens (10)"]') || `page "${view.text('.page')}", rows ${JSON.stringify(names)}`; } },
        { label: 'debounced search', mistake: 'Debounce the search input (300 ms) and push it into the filters with an effect.', check: async ({ render, el, App, waitFor, type, window }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 3); const start = window.__requests.length; for (const v of ['l', 'la', 'lam', 'lamp']) await type(view.$('input[aria-label="Search products"]'), v); const ok = await waitFor(() => view.$$('tr.product-row').length === 1 && view.text('tr.product-row td') === 'Desk lamp', 2000); const urls = window.__requests.slice(start).map((r) => r.url); return (ok && JSON.stringify(urls) === '["/api/products?search=lamp&category=all&page=1&pageSize=3"]') || `requests ${JSON.stringify(urls)}`; } },
        { label: 'empty and error states', mistake: 'Zero results → "No products match your search."; a failed request → "Failed to load products: <message>".', check: async ({ render, el, App, waitFor, type, select, window }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 3); await type(view.$('input[aria-label="Search products"]'), 'zzz'); const empty = await waitFor(() => view.text().includes('No products match your search.'), 2000); window.__api.fail['GET /api/products'] = 500; try { await select(view.$('select[aria-label="Category"]'), 'Home'); const failed = await waitFor(() => view.text('p.error') === 'Failed to load products: Simulated server error'); return (empty && failed) || `empty ${empty}, error "${view.text('p.error')}"`; } finally { delete window.__api.fail['GET /api/products']; } } },
        { label: 'stale requests are aborted', mistake: 'Forward the AbortController signal to fetch and abort in the effect cleanup.', check: async ({ render, el, App, waitFor, select, window }) => { const view = await render(el(App)); await waitFor(() => view.$$('tr.product-row').length === 3); window.__api.delays['GET /api/products'] = 250; try { const start = window.__requests.length; await select(view.$('select[aria-label="Category"]'), 'Home'); await select(view.$('select[aria-label="Category"]'), 'Electronics'); await waitFor(() => view.$$('tr.product-row').length === 3 && view.text('tr.product-row td:nth-child(2)') === 'Electronics', 2000); const home = window.__requests.slice(start).find((r) => r.url.includes('category=Home')); return home?.aborted === true || 'the Home request was not aborted'; } finally { delete window.__api.delays['GET /api/products']; } } },
      ],
    },
    {
      id: 'capstone-order-detail',
      title: 'Capstone stage 9: order detail and status changes',
      source: 'JavaScript & React course, capstone stages 6, 9, 13',
      runner: 'react',
      setup: shopServer(),
      teach: [
        '`useOrder(id)` loads one order into the reducer with `SET_ORDER`. The page offers only the transitions `isValidTransition` allows, so the UI and the rule cannot drift apart.',
        { code: 'const availableTransitions = ALL_STATUSES.filter((s) => isValidTransition(order.status, s));\n{availableTransitions.map((next) => (\n  <button key={next} onClick={() => handleStatusChange(next)}>Mark as {next}</button>\n))}\n{availableTransitions.length === 0 && <p>This order is in a final state.</p>}', lang: 'jsx' },
        { h: 'Optimistic status change' },
        { code: 'async function handleStatusChange(next) {\n  const previous = order.status;\n  dispatch({ type: "TRANSITION_STATUS", payload: next });          // show it now\n  try {\n    await updateOrderStatus(id, next);                           // PATCH /orders/:id/status\n    showNotification(`Order status updated to ${next}.`, "success");\n  } catch (err) {\n    dispatch({ type: "ROLLBACK_STATUS", payload: previous });     // not TRANSITION_STATUS!\n    showNotification(`Failed to update status: ${err.message}`, "error");\n  }\n}', lang: 'jsx' },
        'Status-change errors happen inside an async event handler, so they are handled with `try/catch` and a toast, never by an error boundary.',
        { list: ['`PATCH`, not `PUT`: only one field changes.', 'The total shown is the **stored** `order.total`, never recomputed from current prices.', 'Toasts come from `NotificationContext` (given): `showNotification(message, type)` adds an `li` to `ul.notifications[role="status"]`.', 'A 404 from the server is an error state for the page: `Failed to load order: Order not found`.'] },
      ],
      example: [
        { code: 'function updateOrderStatus(id, status) {\n  return apiRequest(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });\n}', lang: 'jsx' },
      ],
      task: [
        'Given: the domain helpers, `apiRequest`, `orderStatusReducer` (with `ROLLBACK_STATUS`) and the notification context. The app routes `/orders/:id` to `OrderDetailPage`.',
        { ol: ['`getOrder(id)`, `updateOrderStatus(id, status)` services; `useOrder(id)` → `{ status, order, error, dispatch }` using `useReducer(orderStatusReducer, null)`.', 'Page: `Loading order...`, `Failed to load order: <message>`, or `h1` `Order #<id>`, `span.status-badge` (text = status, class includes it), a table of `tr.line-item` (name, quantity, `formatCurrency(unitPrice)`, line total) and `p.total` `Total: ₹1,598.00` (stored total).', 'Buttons `Mark as <status>` only for valid transitions; `This order is in a final state.` when none.', 'Optimistic change with `ROLLBACK_STATUS` on failure and toasts `Order status updated to <s>.` / `Failed to update status: <message>`.'] },
      ],
      starter: `import { useState, useEffect, useReducer, useContext, useCallback, createContext } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

${DOMAIN}
${REDUCER}
${NOTIFICATIONS}
function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    apiRequest(\`/orders/\${id}\`).then(setOrder);
  }, [id]);
  if (!order) return <p>Loading order...</p>;
  return (
    <div>
      <h1>Order #{order.id}</h1>
      <span className="status-badge">{order.status}</span>
      <button>Mark as processing</button>
      <button>Mark as shipped</button>
      <button>Mark as cancelled</button>
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
`,
      solution: `import { useState, useEffect, useReducer, useContext, useCallback, createContext } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

${DOMAIN}
${REDUCER}
${NOTIFICATIONS}
// ---- services/orderService.js ----
function getOrder(id, { signal } = {}) {
  return apiRequest(\`/orders/\${encodeURIComponent(id)}\`, { signal });
}

function updateOrderStatus(id, status) {
  return apiRequest(\`/orders/\${encodeURIComponent(id)}/status\`, { method: "PATCH", body: JSON.stringify({ status }) });
}

// ---- hooks/useOrder.js ----
function useOrder(id) {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [order, dispatch] = useReducer(orderStatusReducer, null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    getOrder(id, { signal: controller.signal })
      .then((data) => {
        dispatch({ type: "SET_ORDER", payload: data });
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [id]);

  return { status, order, error, dispatch };
}

// ---- components ----
function OrderStatusBadge({ status }) {
  return <span className={\`status-badge \${status}\`}>{status}</span>;
}

function OrderLineItemsTable({ lineItems }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Unit price</th>
          <th>Line total</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((item) => (
          <tr key={item.productId} className="line-item">
            <td>{item.productName}</td>
            <td>{item.quantity}</td>
            <td>{formatCurrency(item.unitPrice)}</td>
            <td>{formatCurrency(item.unitPrice * item.quantity)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- pages/OrderDetailPage.jsx ----
function OrderDetailPage() {
  const { id } = useParams();
  const { status, order, error, dispatch } = useOrder(id);
  const { showNotification } = useNotification();

  async function handleStatusChange(next) {
    const previous = order.status;
    dispatch({ type: "TRANSITION_STATUS", payload: next });
    try {
      await updateOrderStatus(id, next);
      showNotification(\`Order status updated to \${next}.\`, "success");
    } catch (err) {
      dispatch({ type: "ROLLBACK_STATUS", payload: previous });
      showNotification(\`Failed to update status: \${err.message}\`, "error");
    }
  }

  if (status === "loading") return <p>Loading order...</p>;
  if (status === "error") return <p className="error">Failed to load order: {error}</p>;

  const availableTransitions = ALL_STATUSES.filter((s) => isValidTransition(order.status, s));

  return (
    <div>
      <h1>Order #{order.id}</h1>
      <OrderStatusBadge status={order.status} />
      <div className="status-controls">
        {availableTransitions.map((next) => (
          <button key={next} onClick={() => handleStatusChange(next)}>
            Mark as {next}
          </button>
        ))}
        {availableTransitions.length === 0 && <p>This order is in a final state.</p>}
      </div>
      <OrderLineItemsTable lineItems={order.lineItems} />
      <p className="total">Total: {formatCurrency(order.total)}</p>
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
`,
      checks: [
        { label: 'loads an order', mistake: 'useOrder fetches /api/orders/:id and loads it with SET_ORDER; show "Loading order..." first.', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App), { path: '/orders/o2' }); const first = view.text().includes('Loading order...'); const ok = await waitFor(() => view.text('h1') === 'Order #o2'); const rows = view.$$('tr.line-item').map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent).join('|')); return (first && ok && JSON.stringify(rows) === '["Notebook (A5)|5|₹120.00|₹600.00","Gel pens (10)|1|₹250.00|₹250.00"]' && view.text('p.total') === 'Total: ₹850.00') || `rows ${JSON.stringify(rows)}, total "${view.text('p.total')}"`; } },
        { label: 'missing order', mistake: 'A failed load shows "Failed to load order: <message>".', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App), { path: '/orders/o99' }); const ok = await waitFor(() => view.text('.error') === 'Failed to load order: Order not found'); return ok || `shows "${view.text()}"`; } },
        { label: 'only valid transitions are offered', mistake: 'Derive the buttons with ALL_STATUSES.filter((s) => isValidTransition(order.status, s)).', check: async ({ render, el, App, waitFor }) => { const labels = async (path) => { const view = await render(el(App), { path }); await waitFor(() => view.$('h1')); return { buttons: view.$$('.status-controls button').map((b) => b.textContent), text: view.text('.status-controls') }; }; const pending = await labels('/orders/o1'); const shipped = await labels('/orders/o2'); const delivered = await labels('/orders/o3'); return (JSON.stringify(pending.buttons) === '["Mark as processing","Mark as cancelled"]' && JSON.stringify(shipped.buttons) === '["Mark as delivered"]' && delivered.buttons.length === 0 && delivered.text === 'This order is in a final state.') || `pending ${JSON.stringify(pending.buttons)}, shipped ${JSON.stringify(shipped.buttons)}, delivered "${delivered.text}"`; } },
        { label: 'failed change rolls back', mistake: 'Dispatch ROLLBACK_STATUS with the previous status when the PATCH fails, and show "Failed to update status: <message>".', check: async ({ render, el, App, waitFor, click, window }) => { window.__api.fail['PATCH /api/orders/o1/status'] = 500; window.__api.delays['PATCH /api/orders/o1/status'] = 120; try { const view = await render(el(App), { path: '/orders/o1' }); await waitFor(() => view.$('h1')); await click(view.$$('.status-controls button').find((b) => b.textContent === 'Mark as processing')); const optimistic = view.text('.status-badge'); const rolled = await waitFor(() => view.text('.status-badge') === 'pending' && view.text('.notifications') === 'Failed to update status: Simulated server error'); return (optimistic === 'processing' && rolled && window.__db.orders[0].status === 'pending') || `badge right after click "${optimistic}", then "${view.text('.status-badge')}", toast "${view.text('.notifications')}"`; } finally { delete window.__api.fail['PATCH /api/orders/o1/status']; delete window.__api.delays['PATCH /api/orders/o1/status']; } } },
        { label: 'successful change', mistake: 'PATCH /api/orders/:id/status with { status } and toast "Order status updated to <status>."', check: async ({ render, el, App, waitFor, click, window }) => { const start = window.__requests.length; const view = await render(el(App), { path: '/orders/o1' }); await waitFor(() => view.$('h1')); await click(view.$$('.status-controls button').find((b) => b.textContent === 'Mark as processing')); const ok = await waitFor(() => view.text('.notifications') === 'Order status updated to processing.'); const req = window.__requests.slice(start).find((r) => r.method === 'PATCH'); const buttons = view.$$('.status-controls button').map((b) => b.textContent); return (ok && req?.url === '/api/orders/o1/status' && req.body === '{"status":"processing"}' && view.$('.status-badge').classList.contains('processing') && JSON.stringify(buttons) === '["Mark as shipped","Mark as cancelled"]') || `request ${JSON.stringify(req && { url: req.url, body: req.body })}, buttons ${JSON.stringify(buttons)}`; } },
        { label: 'stored total, never recomputed', mistake: 'Show formatCurrency(order.total) from the order itself.', check: async ({ render, el, App, waitFor, window }) => { window.__db.orders[2].total = 2000; const view = await render(el(App), { path: '/orders/o3' }); await waitFor(() => view.$('h1')); return view.text('p.total') === 'Total: ₹2,000.00' || `total "${view.text('p.total')}" (should be the stored ₹2,000.00)`; } },
      ],
    },
    {
      id: 'capstone-new-order',
      title: 'Capstone stage 10: creating an order',
      source: 'JavaScript & React course, capstone stages 10, 11, 14',
      runner: 'react',
      setup: shopServer({ defaultDelay: 30 }),
      teach: [
        'The new-order form builds up a **list** of line items. Each line is `{ productId, quantity }`; names, prices, line totals and the running total are derived on every render.',
        { code: 'const runningTotal = lineItems.reduce((sum, item) => {\n  const product = products.find((p) => p.id === item.productId);\n  return sum + (product ? product.price * item.quantity : 0);\n}, 0);', lang: 'jsx' },
        { warn: 'Every button inside a `<form>` that is not the submit button needs `type="button"`. A `<button>` without a type is a **submit** button, so "Add Wireless mouse" would submit the whole order.' },
        { list: ['Show stock problems before submitting (`stockProblems(lineItems, products)`) and disable submit while any exist. The server still re-checks: stock can change between page load and submit.', 'While saving: disable the button and show `Creating...`.', 'On success: toast and `navigate(`/orders/${newOrder.id}`)`.', 'On failure: keep every line item and show the server\'s message (a 409 says which product ran out).', 'Out-of-stock products cannot be added.'] },
        { h: 'Performance decisions (stage 14)' },
        'The running total and the low-stock filter are **not** memoized: summing a few dozen items costs microseconds, less than `useMemo`\'s own bookkeeping. `NewOrderPage` is the one page worth `lazy()`: it is visited rarely and carries the heavy product picker, while lazy-loading the busy list pages would add a loading flash to the most common navigation.',
      ],
      example: [
        { code: 'function handleQuantityChange(productId, quantity) {\n  if (quantity <= 0) {\n    setLineItems(lineItems.filter((item) => item.productId !== productId));\n    return;\n  }\n  setLineItems(lineItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)));\n}', lang: 'jsx' },
      ],
      task: [
        'Given: domain helpers (including `stockProblems`, written below), `apiRequest` and the notification context. Routes: `/orders/new` → `NewOrderPage`, `/orders/:id` → `OrderPlaced` (given).',
        { ol: ['Load all products (`/products?pageSize=100`). For each, an `Add <name>` button of `type="button"`, disabled when out of stock.', '`ul.line-items`: `li.line-item` per line with the name, `<input type="number" aria-label="Quantity of <name>">` and the line total (`formatCurrency`); adding again increments; 0 removes.', '`p.total` `Total: ₹N`; each stock problem as `p.stock-error` (role `alert`); the submit button `Create Order` disabled when there are no lines or any problem, `Creating...` while saving.', 'Submit POSTs `{ lineItems: [{ productId, quantity }] }` to `/api/orders`; success → toast `Order created.` and navigate to `/orders/<id>`; failure → `<p role="alert" className="submit-error">Failed to create order: <message></p>`, keeping the lines.'] },
      ],
      starter: `import { useState, useEffect, useContext, useCallback, createContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";

${DOMAIN}
${NOTIFICATIONS}
function stockProblems(selection, products) {
  return selection.flatMap(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return [\`Unknown product: \${productId}\`];
    return quantity > product.quantity ? [\`Only \${product.quantity} × \${product.name} in stock\`] : [];
  });
}

function OrderPlaced() {
  const { id } = useParams();
  return <h1>Order #{id} placed</h1>;
}

function NewOrderPage() {
  const [products, setProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  useEffect(() => {
    apiRequest("/products?pageSize=100").then((data) => setProducts(data.products));
  }, []);
  return (
    <form>
      {products.map((p) => (
        <button key={p.id} onClick={() => setLineItems([...lineItems, { productId: p.id, quantity: 1 }])}>
          Add {p.name}
        </button>
      ))}
      <ul className="line-items">
        {lineItems.map((item, i) => (
          <li key={i} className="line-item">{item.productId}</li>
        ))}
      </ul>
      <button type="submit">Create Order</button>
    </form>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/orders/new" element={<NewOrderPage />} />
          <Route path="/orders/:id" element={<OrderPlaced />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
`,
      solution: `import { useState, useEffect, useContext, useCallback, createContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";

${DOMAIN}
${NOTIFICATIONS}
function stockProblems(selection, products) {
  return selection.flatMap(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return [\`Unknown product: \${productId}\`];
    return quantity > product.quantity ? [\`Only \${product.quantity} × \${product.name} in stock\`] : [];
  });
}

// ---- services ----
function getAllProducts() {
  return apiRequest("/products?pageSize=100").then((data) => data.products);
}

function createOrder(data) {
  return apiRequest("/orders", { method: "POST", body: JSON.stringify(data) });
}

function OrderPlaced() {
  const { id } = useParams();
  return <h1>Order #{id} placed</h1>;
}

// ---- pages/NewOrderPage.jsx ----
function NewOrderPage() {
  const [products, setProducts] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [lineItems, setLineItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    getAllProducts()
      .then((list) => {
        setProducts(list);
        setLoadStatus("success");
      })
      .catch(() => setLoadStatus("error"));
  }, []);

  function handleAdd(productId) {
    setLineItems((items) =>
      items.some((item) => item.productId === productId)
        ? items.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item))
        : [...items, { productId, quantity: 1 }],
    );
  }

  function handleQuantityChange(productId, quantity) {
    if (!(quantity > 0)) {
      setLineItems((items) => items.filter((item) => item.productId !== productId));
      return;
    }
    setLineItems((items) => items.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  }

  const runningTotal = lineItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const problems = stockProblems(lineItems, products);

  async function handleSubmit(event) {
    event.preventDefault();
    if (lineItems.length === 0 || problems.length > 0) return;
    setSaving(true);
    setSubmitError("");
    try {
      const newOrder = await createOrder({ lineItems });
      showNotification("Order created.", "success");
      navigate(\`/orders/\${newOrder.id}\`);
    } catch (err) {
      setSubmitError(\`Failed to create order: \${err.message}\`);
      setSaving(false);
    }
  }

  if (loadStatus === "loading") return <p>Loading products...</p>;
  if (loadStatus === "error") return <p role="alert">Could not load products.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>New order</h1>
      <div className="product-picker">
        {products.map((product) => (
          <button type="button" key={product.id} disabled={product.quantity === 0} onClick={() => handleAdd(product.id)}>
            Add {product.name}
          </button>
        ))}
      </div>
      <ul className="line-items">
        {lineItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return (
            <li key={item.productId} className="line-item">
              <span>{product?.name}</span>
              <input
                type="number"
                min="0"
                aria-label={\`Quantity of \${product?.name}\`}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
              />
              <span className="line-total">{formatCurrency((product?.price ?? 0) * item.quantity)}</span>
            </li>
          );
        })}
      </ul>
      {problems.map((problem) => (
        <p key={problem} className="stock-error" role="alert">
          {problem}
        </p>
      ))}
      <p className="total">Total: {formatCurrency(runningTotal)}</p>
      {submitError && (
        <p role="alert" className="submit-error">
          {submitError}
        </p>
      )}
      <button type="submit" disabled={lineItems.length === 0 || problems.length > 0 || saving}>
        {saving ? "Creating..." : "Create Order"}
      </button>
    </form>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/orders/new" element={<NewOrderPage />} />
          <Route path="/orders/:id" element={<OrderPlaced />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
`,
      checks: [
        { label: 'product picker', mistake: 'One "Add <name>" button per product, type="button", disabled when out of stock.', check: async ({ render, el, App, waitFor }) => { const view = await render(el(App), { path: '/orders/new' }); await waitFor(() => view.$$('.product-picker button, form button').length >= 7); const adds = view.$$('button').filter((b) => b.textContent.startsWith('Add ')); const lamp = adds.find((b) => b.textContent === 'Add Desk lamp'); return (adds.length === 7 && adds.every((b) => b.getAttribute('type') === 'button') && lamp?.disabled === true) || `${adds.length} add buttons; types ${JSON.stringify(adds.map((b) => b.getAttribute('type')))}; Desk lamp disabled: ${lamp?.disabled}`; } },
        { label: 'adding builds line items without submitting', mistake: 'Adding the same product again increments its quantity; buttons must not submit the form.', check: async ({ render, el, App, waitFor, click, submits }) => { const before = submits.length; const view = await render(el(App), { path: '/orders/new' }); await waitFor(() => view.$$('button').some((b) => b.textContent === 'Add Wireless mouse')); const add = (n) => view.$$('button').find((b) => b.textContent === `Add ${n}`); await click(add('Wireless mouse')); await click(add('Wireless mouse')); await click(add('Notebook (A5)')); const lines = view.$$('li.line-item').map((li) => `${li.querySelector('span')?.textContent}:${li.querySelector('input')?.value}:${li.querySelector('.line-total')?.textContent}`); return (submits.length === before && JSON.stringify(lines) === '["Wireless mouse:2:₹1,598.00","Notebook (A5):1:₹120.00"]' && view.text('p.total') === 'Total: ₹1,718.00') || `submits ${submits.length - before}, lines ${JSON.stringify(lines)}, "${view.text('p.total')}"`; } },
        { label: 'quantity edits and removal', mistake: 'Typing a quantity updates the line; 0 removes it.', check: async ({ render, el, App, waitFor, click, type }) => { const view = await render(el(App), { path: '/orders/new' }); await waitFor(() => view.$$('button').some((b) => b.textContent === 'Add Notebook (A5)')); await click(view.$$('button').find((b) => b.textContent === 'Add Notebook (A5)')); await type(view.$('input[aria-label="Quantity of Notebook (A5)"]'), '10'); const total = view.text('p.total'); await type(view.$('input[aria-label="Quantity of Notebook (A5)"]'), '0'); return (total === 'Total: ₹1,200.00' && view.$$('li.line-item').length === 0 && view.text('p.total') === 'Total: ₹0.00') || `total after 10: "${total}", lines after 0: ${view.$$('li.line-item').length}`; } },
        { label: 'stock problems block submit', mistake: 'Show each stockProblems message as p.stock-error and disable Create Order while any exist (or no lines).', check: async ({ render, el, App, waitFor, click, type }) => { const view = await render(el(App), { path: '/orders/new' }); await waitFor(() => view.$$('button').some((b) => b.textContent === 'Add USB-C cable')); const submit = () => view.$$('button').find((b) => b.textContent === 'Create Order'); const emptyDisabled = submit().disabled; await click(view.$$('button').find((b) => b.textContent === 'Add USB-C cable')); await type(view.$('input[aria-label="Quantity of USB-C cable"]'), '6'); const problem = view.text('p.stock-error'); const blocked = submit().disabled; await type(view.$('input[aria-label="Quantity of USB-C cable"]'), '4'); return (emptyDisabled && problem === 'Only 4 × USB-C cable in stock' && blocked && !submit().disabled && !view.$('p.stock-error')) || `empty disabled ${emptyDisabled}, problem "${problem}", blocked ${blocked}`; } },
        { label: 'failed create keeps the order', mistake: 'On failure show "Failed to create order: <message>" and keep every line item.', check: async ({ render, el, App, waitFor, click, window }) => { window.__api.fail['POST /api/orders'] = 500; try { const view = await render(el(App), { path: '/orders/new' }); await waitFor(() => view.$$('button').some((b) => b.textContent === 'Add Gel pens (10)')); await click(view.$$('button').find((b) => b.textContent === 'Add Gel pens (10)')); await click(view.$$('button').find((b) => b.textContent === 'Create Order')); const ok = await waitFor(() => view.text('.submit-error') === 'Failed to create order: Simulated server error'); return (ok && view.$$('li.line-item').length === 1 && !view.$$('button').find((b) => b.textContent === 'Create Order')?.disabled) || `error "${view.text('.submit-error')}", lines ${view.$$('li.line-item').length}`; } finally { delete window.__api.fail['POST /api/orders']; } } },
        { label: 'successful create', mistake: 'POST { lineItems: [{ productId, quantity }] }, show "Creating..." while saving, then toast and navigate to /orders/<id>.', check: async ({ render, el, App, waitFor, click, window }) => { window.__api.delays['POST /api/orders'] = 120; try { const start = window.__requests.length; const view = await render(el(App), { path: '/orders/new' }); await waitFor(() => view.$$('button').some((b) => b.textContent === 'Add Wireless mouse')); await click(view.$$('button').find((b) => b.textContent === 'Add Wireless mouse')); await click(view.$$('button').find((b) => b.textContent === 'Add Gel pens (10)')); await click(view.$$('button').find((b) => b.textContent === 'Create Order')); const saving = view.$$('button').some((b) => b.textContent === 'Creating...' && b.disabled); const ok = await waitFor(() => /^Order #o\d+ placed$/.test(view.text('h1'))); const req = window.__requests.slice(start).find((r) => r.method === 'POST'); const mouse = window.__db.products.find((p) => p.id === 'p1'); return (saving && ok && req?.body === '{"lineItems":[{"productId":"p1","quantity":1},{"productId":"p5","quantity":1}]}' && view.text('.notifications') === 'Order created.' && mouse.quantity === 23) || `saving shown ${saving}, heading "${view.text('h1')}", body ${req?.body}`; } finally { delete window.__api.delays['POST /api/orders']; } } },
      ],
    },
    {
      id: 'capstone-review',
      title: 'Capstone stages 11–15: consistency, refactoring, tests, performance, shipping',
      source: 'JavaScript & React course, capstone stages 11–15',
      runner: 'quiz',
      teach: [
        { h: 'Stage 11: check consistency deliberately' },
        'Build a table: every view × loading / error / empty / success. A missing empty state hides easily across many similar views; a table checked on purpose finds it.',
        { h: 'Stage 12: refactor after the second copy' },
        { list: ['`useProducts` and `useOrders` turn out nearly identical → extract `useResourceList(fetchFn, initialFilters)`. Abstract **after** seeing two real uses, not before.', 'The course\'s version branches on `result.products ?? result.orders`: a smell. Better: each service returns a normalized `{ items, totalPages }`.', 'Its effect depends on `fetchFn`: pass a stable function (module-level service), not an inline arrow, or it refetches every render.', 'The optimistic-update **shape** (apply → try → roll back) is shared through a higher-order helper taking functions; the state mechanics (dispatch vs setState) stay with each caller.'] },
        { h: 'Stage 13: test what is riskiest' },
        'Priority 1: `isValidTransition` (the key business rule) as unit tests. Priority 2: the order page with React Testing Library: only valid buttons appear, and a failed PATCH rolls back (needs `waitFor`, since rollback is async). Presentational components are lower risk and deliberately skipped.',
        { h: 'Stage 14: optimise only what is measured' },
        '`ProductRow` gets `memo` (+ stable callbacks) because inline edits would otherwise re-render every row. Cheap derived values are not memoized. Only the rarely visited `NewOrderPage` is lazy-loaded.',
        { h: 'Stage 15: production checklist' },
        { ol: ['`VITE_API_URL` set per environment, before building.', 'SPA fallback verified by visiting a deep link directly after a production build.', 'Clean `npm run build`.', 'Error boundary + error tracking wired up.', 'Security: no secrets in the bundle, no `dangerouslySetInnerHTML` (grep, do not assume), server-side validation documented.', 'Accessibility: real buttons, labelled inputs, `role="alert"` on the low-stock banner.', 'Re-read the stage 1 requirements against the finished app.'] },
      ],
      example: [
        { code: 'it("rejects shipped -> cancelled", () => {\n  expect(isValidTransition("shipped", "cancelled")).toBe(false);\n});', lang: 'js' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'The course rolls back a failed status change with `dispatch({ type: "TRANSITION_STATUS", payload: previousStatus })`. What happens when `pending → processing` fails?', options: ['It works', 'The reducer throws: processing → pending is not a valid transition', 'React ignores it', 'The server fixes it'], answer: 1, explain: 'A rollback is not a business transition; it needs its own action (ROLLBACK_STATUS).' },
        { q: 'When is extracting `useResourceList` justified?', options: ['Before writing the first list hook', 'After a second hook repeats the same logic', 'Never', 'Only with TypeScript'], answer: 1, explain: 'Two concrete uses show what the abstraction really needs.' },
        { q: '`useResourceList` branches on `result.products ?? result.orders`. The better fix is…', options: ['Add a third branch for each new resource', 'Have services return a normalized { items, totalPages }', 'Use any', 'Move it into the component'], answer: 1, explain: 'The generic hook should not know each resource\'s field names.' },
        { q: 'Which test gives the most value per line here?', options: ['Snapshot of OrderStatusBadge', 'Unit tests of isValidTransition', 'Testing the CSS', 'Testing that React renders'], answer: 1, explain: 'It is the central business rule and pure, so tests are cheap and precise.' },
        { q: 'Why is `runningTotal` NOT wrapped in `useMemo`?', options: ['useMemo is deprecated', 'Summing a small array is cheaper than useMemo\'s own bookkeeping', 'It must be stale', 'Totals cannot be memoized'], answer: 1, explain: 'Optimise measured costs only.' },
        { q: 'Why lazy-load `NewOrderPage` but not `ProductListPage`?', options: ['Alphabetical order', 'NewOrderPage is rare and heavy; lazy-loading the busiest pages adds a loading flash to the most common navigation', 'Lists cannot be lazy', 'Random choice'], answer: 1, explain: 'Split at infrequently visited boundaries.' },
        { q: 'How do you verify the SPA fallback before shipping?', options: ['Click links in the app', 'Open a deep link like /products/42 directly on the production build', 'Run unit tests', 'Check the console'], answer: 1, explain: 'In-app navigation never asks the server for that path.' },
        { q: 'What is the biggest risk when a large project is "done"?', options: ['Too few features', 'Drift between the original spec and what was built, and between pieces built separately', 'Too many tests', 'The bundle size'], answer: 1, explain: 'That is why the last step re-reads stage 1 against the app.' },
      ],
    },
  ],
};
