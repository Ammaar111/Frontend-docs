// An in-memory REST API for the capstone lessons: products and orders with
// stock rules, run inside the sandbox in place of a real backend.
//
// The setup it builds defines `fetch` for the learner's code and exposes, to
// checks:
//   __requests  every request: { method, url, body, aborted }
//   __api       { offline, fail: { "METHOD /path": status }, delays: { "METHOD /path": ms } }
//   __db        the live data: { products, orders }
function createShopServer(defaultDelay) {
  const db = {
    products: [
      { id: 'p1', name: 'Wireless mouse', category: 'Electronics', price: 799, quantity: 24 },
      { id: 'p2', name: 'USB-C cable', category: 'Electronics', price: 349, quantity: 4 },
      { id: 'p3', name: 'Desk lamp', category: 'Home', price: 1299, quantity: 0 },
      { id: 'p4', name: 'Notebook (A5)', category: 'Stationery', price: 120, quantity: 60 },
      { id: 'p5', name: 'Gel pens (10)', category: 'Stationery', price: 250, quantity: 2 },
      { id: 'p6', name: 'Bluetooth speaker', category: 'Electronics', price: 2499, quantity: 9 },
      { id: 'p7', name: 'Wall clock', category: 'Home', price: 899, quantity: 5 },
    ],
    orders: [
      { id: 'o1', status: 'pending', lineItems: [{ productId: 'p1', productName: 'Wireless mouse', quantity: 2, unitPrice: 799 }], total: 1598, createdAt: '2026-10-01T10:00:00.000Z' },
      { id: 'o2', status: 'shipped', lineItems: [{ productId: 'p4', productName: 'Notebook (A5)', quantity: 5, unitPrice: 120 }, { productId: 'p5', productName: 'Gel pens (10)', quantity: 1, unitPrice: 250 }], total: 850, createdAt: '2026-10-03T12:30:00.000Z' },
      { id: 'o3', status: 'delivered', lineItems: [{ productId: 'p6', productName: 'Bluetooth speaker', quantity: 1, unitPrice: 2499 }], total: 2499, createdAt: '2026-09-28T09:15:00.000Z' },
    ],
  };
  const TRANSITIONS = { pending: ['processing', 'cancelled'], processing: ['shipped', 'cancelled'], shipped: ['delivered'], delivered: [], cancelled: [] };
  const requests = [];
  const api = { offline: false, fail: {}, delays: {} };
  let nextOrder = 4;
  let nextProduct = 8;
  globalThis.__requests = requests;
  globalThis.__api = api;
  globalThis.__db = db;

  const copy = (value) => JSON.parse(JSON.stringify(value));
  const reply = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => (String(name).toLowerCase() === 'content-type' ? 'application/json' : null) },
    json: async () => (body === undefined ? Promise.reject(new SyntaxError('Unexpected end of JSON input')) : copy(body)),
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
  });
  const page = (items, query) => {
    const size = Math.max(1, Number(query.get('pageSize')) || 20);
    const totalPages = Math.max(1, Math.ceil(items.length / size));
    const current = Math.min(Math.max(1, Number(query.get('page')) || 1), totalPages);
    return { slice: items.slice((current - 1) * size, current * size), totalPages, total: items.length, page: current };
  };

  function handle(method, path, query, body) {
    let match;
    if (method === 'GET' && path === '/api/products') {
      const search = (query.get('search') || '').toLowerCase();
      const category = query.get('category') || 'all';
      const items = db.products.filter((p) => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(search));
      const { slice, totalPages, total, page: current } = page(items, query);
      return reply(200, { products: slice, totalPages, total, page: current });
    }
    if ((match = path.match(/^\/api\/products\/([\w-]+)$/))) {
      const index = db.products.findIndex((p) => p.id === match[1]);
      if (index === -1) return reply(404, { message: 'Product not found' });
      if (method === 'GET') return reply(200, db.products[index]);
      if (method === 'PUT') {
        db.products[index] = { ...db.products[index], ...body, id: db.products[index].id };
        return reply(200, db.products[index]);
      }
      if (method === 'DELETE') {
        db.products.splice(index, 1);
        return reply(204);
      }
    }
    if (method === 'POST' && path === '/api/products') {
      if (!body?.name || !(body.price >= 0)) return reply(400, { message: 'name and a price of at least 0 are required' });
      const product = { id: `p${nextProduct++}`, quantity: 0, category: 'Home', ...body };
      db.products.push(product);
      return reply(201, product);
    }
    if (method === 'GET' && path === '/api/orders') {
      const status = query.get('status') || 'all';
      const items = db.orders.filter((o) => status === 'all' || o.status === status);
      const { slice, totalPages, total, page: current } = page(items, query);
      return reply(200, { orders: slice, totalPages, total, page: current });
    }
    if (method === 'POST' && path === '/api/orders') {
      const lines = Array.isArray(body?.lineItems) ? body.lineItems : [];
      if (lines.length === 0) return reply(400, { message: 'An order needs at least one line item' });
      for (const line of lines) {
        const product = db.products.find((p) => p.id === line.productId);
        if (!product) return reply(400, { message: `Unknown product ${line.productId}` });
        if (!Number.isInteger(line.quantity) || line.quantity < 1) return reply(400, { message: 'Quantities must be whole numbers of at least 1' });
        if (line.quantity > product.quantity) return reply(409, { message: `Only ${product.quantity} × ${product.name} in stock` });
      }
      // Stock and the order change together, or not at all.
      const lineItems = lines.map((line) => {
        const product = db.products.find((p) => p.id === line.productId);
        product.quantity -= line.quantity;
        return { productId: product.id, productName: product.name, quantity: line.quantity, unitPrice: product.price };
      });
      const order = {
        id: `o${nextOrder++}`,
        status: 'pending',
        lineItems,
        total: lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
        createdAt: new Date().toISOString(),
      };
      db.orders.push(order);
      return reply(201, order);
    }
    if ((match = path.match(/^\/api\/orders\/([\w-]+)(\/status)?$/))) {
      const order = db.orders.find((o) => o.id === match[1]);
      if (!order) return reply(404, { message: 'Order not found' });
      if (method === 'GET' && !match[2]) return reply(200, order);
      if (method === 'PATCH' && match[2]) {
        const next = body?.status;
        if (!TRANSITIONS[order.status]?.includes(next)) return reply(409, { message: `Cannot change a ${order.status} order to ${next}` });
        if (next === 'cancelled') {
          for (const item of order.lineItems) {
            const product = db.products.find((p) => p.id === item.productId);
            if (product) product.quantity += item.quantity;
          }
        }
        order.status = next;
        return reply(200, order);
      }
    }
    return reply(404, { message: 'Not found' });
  }

  return function fetch(input, options = {}) {
    const url = new URL(String(input), 'https://shop.example');
    const method = String(options.method || 'GET').toUpperCase();
    let body = null;
    try {
      body = options.body === undefined ? null : JSON.parse(options.body);
    } catch {
      body = null;
    }
    const record = { method, url: url.pathname + url.search, body: options.body ?? null, aborted: false };
    requests.push(record);
    const key = `${method} ${url.pathname}`;
    const delay = api.delays[key] ?? defaultDelay;

    return new Promise((resolve, reject) => {
      const abortError = () => {
        const error = new Error('The operation was aborted.');
        error.name = 'AbortError';
        return error;
      };
      if (options.signal?.aborted) {
        record.aborted = true;
        reject(abortError());
        return;
      }
      const timer = setTimeout(() => {
        if (api.offline) {
          reject(new TypeError('Failed to fetch'));
          return;
        }
        if (api.fail[key]) {
          resolve(reply(api.fail[key], { message: 'Simulated server error' }));
          return;
        }
        resolve(handle(method, url.pathname, url.searchParams, body));
      }, delay);
      options.signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        record.aborted = true;
        reject(abortError());
      });
    });
  };
}

export function shopServer({ defaultDelay = 40 } = {}) {
  return `const fetch = (${createShopServer.toString()})(${Number(defaultDelay)});`;
}
