// JavaScript & React course, Part 28: routing with React Router.
export default {
  id: 'react-routing',
  title: 'Routing',
  lessons: [
    {
      id: 'routing-basics',
      title: 'Routes, Link and URL parameters',
      source: 'JavaScript & React course, Part 28.1–28.4, 28.6',
      runner: 'react',
      teach: [
        'A traditional site loads a whole new HTML page for every link: a full request/response cycle that throws away all JavaScript state. A single-page app wants to avoid that, but users still expect the address bar, back/forward buttons and shareable links to work.',
        '**Client-side routing** intercepts navigation, updates the URL with the History API (no reload) and swaps which components are rendered. React Router is the standard library for it: `npm install react-router-dom`.',
        { code: '// main.jsx\nimport { BrowserRouter } from "react-router-dom";\n\ncreateRoot(document.getElementById("root")).render(\n  <BrowserRouter>\n    <App />\n  </BrowserRouter>,\n);', lang: 'jsx' },
        '`<BrowserRouter>` provides routing **context** to the whole tree, which is how `Link`, `useParams` and `useNavigate` work anywhere inside it.',
        { code: 'import { Routes, Route } from "react-router-dom";\n\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/" element={<Home />} />\n      <Route path="/about" element={<About />} />\n      <Route path="/products/:id" element={<ProductDetail />} />\n      <Route path="*" element={<NotFound />} />\n    </Routes>\n  );\n}', lang: 'jsx' },
        '`<Routes>` picks the route that matches the current URL, like a `switch` on the path. `path="*"` matches anything, so it is the 404 page; keep it last so the intent is obvious.',
        { h: 'URL parameters' },
        '`:id` in a path is a **parameter**. On `/products/42`, `useParams()` returns `{ id: "42" }`. Parameters are always **strings**: use `Number(id)` before comparing with numeric ids.',
        { code: 'function ProductDetail() {\n  const { id } = useParams();\n  const product = PRODUCTS.find((p) => p.id === Number(id));\n  if (!product) return <h1>Product not found</h1>;\n  return <h1>{product.name}</h1>;\n}', lang: 'jsx' },
        { h: 'Link, not <a>' },
        { warn: '`<a href="/about">` makes the browser do a full page load, which defeats client-side routing and wipes every bit of in-memory state.' },
        '`<Link to="/about">` renders a real `<a>` (so middle-click and "open in new tab" still work) but its click handler calls `preventDefault()` and updates the URL through the History API instead. `<NavLink>` is the same, plus an `active` class on the link for the current page.',
        { note: 'In this sandbox the address bar cannot change, so `BrowserRouter` is swapped for an in-memory router that starts at the path each check asks for. Your code is the same as in a real project.' },
      ],
      example: [
        { code: 'function Nav() {\n  return (\n    <nav>\n      <Link to="/">Home</Link>\n      <Link to="/about">About</Link>\n      <Link to="/products/1">First product</Link>\n    </nav>\n  );\n}', lang: 'jsx' },
      ],
      task: [
        'Here the app wraps itself in `BrowserRouter` (in a real project that wrapper sits in `main.jsx`).',
        { ol: ['Routes: `/` → `<h1>Home</h1>`, `/about` → `<h1>About</h1>`, `/products/:id` → `<h1>{product name}</h1>` (or `<h1>Product not found</h1>` for an unknown id), anything else → `<h1>Page not found</h1>`.', 'A `<nav>` (shown on every page) with `Link`s to `/`, `/about`, and each product (`/products/1`, `/products/2`). No plain `<a href>`.', 'Use `useParams` in `ProductDetail` and convert the id to a number.'] },
      ],
      starter: `import { BrowserRouter } from "react-router-dom";

const PRODUCTS = [
  { id: 1, name: "Wooden train set" },
  { id: 2, name: "Puzzle cube" },
];

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
      <Home />
    </BrowserRouter>
  );
}
`,
      solution: `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

const PRODUCTS = [
  { id: 1, name: "Wooden train set" },
  { id: 2, name: "Puzzle cube" },
];

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  if (!product) return <h1>Product not found</h1>;
  return <h1>{product.name}</h1>;
}

function NotFound() {
  return <h1>Page not found</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {PRODUCTS.map((p) => (
          <Link key={p.id} to={\`/products/\${p.id}\`}>
            {p.name}
          </Link>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
      checks: [
        { label: 'home and about routes', mistake: 'Use <Routes> with <Route path="/" element={<Home />} /> and <Route path="/about" element={<About />} />.', check: async ({ render, el, App }) => { const home = (await render(el(App), { path: '/' })).text('h1'); const about = (await render(el(App), { path: '/about' })).text('h1'); return (home === 'Home' && about === 'About') || `"/" showed "${home}", "/about" showed "${about}"`; } },
        { label: 'product parameter', mistake: 'Add <Route path="/products/:id" ...> and read it with const { id } = useParams(); compare with Number(id).', check: async ({ render, el, App }) => { const two = (await render(el(App), { path: '/products/2' })).text('h1'); const missing = (await render(el(App), { path: '/products/99' })).text('h1'); return (two === 'Puzzle cube' && missing === 'Product not found') || `"/products/2" showed "${two}", "/products/99" showed "${missing}"`; } },
        { label: '404 route', mistake: 'Add a catch-all <Route path="*" element={<NotFound />} />.', check: async ({ render, el, App }) => { const text = (await render(el(App), { path: '/no/such/page' })).text('h1'); return text === 'Page not found' || `showed "${text}"`; } },
        { label: 'links navigate without reloading', mistake: 'Use <Link to="/about">, not <a href>: a plain anchor triggers a full page load.', check: async ({ render, el, App, click, navigations }) => { const before = navigations.length; const view = await render(el(App), { path: '/' }); const link = view.$$('nav a').find((a) => a.getAttribute('href') === '/about'); if (!link) return 'no link to /about in the nav'; await click(link); const product = view.$$('nav a').find((a) => a.getAttribute('href') === '/products/1'); if (!product) return 'no link to /products/1 in the nav'; const after = view.text('h1'); await click(product); return (navigations.length === before && after === 'About' && view.text('h1') === 'Wooden train set') || (navigations.length > before ? 'the browser tried a full page load (plain <a href>)' : `pages: "${after}", "${view.text('h1')}"`); } },
        { label: 'nav on every page', mistake: 'Put the <nav> outside <Routes> so it renders for every URL.', check: async ({ render, el, App }) => { const view = await render(el(App), { path: '/unknown' }); return view.$$('nav a').length >= 4 || `${view.$$('nav a').length} link(s) in the nav on the 404 page`; } },
      ],
    },
    {
      id: 'routing-nested',
      title: 'Nested routes, layouts and useNavigate',
      source: 'JavaScript & React course, Part 28.4, 28.5',
      runner: 'react',
      teach: [
        'Most apps share a frame (sidebar, header) across many pages. **Nested routes** render a parent layout once and put the matching child route inside it, where `<Outlet />` is placed. It is the `children` idea, driven by the URL.',
        { code: '<Routes>\n  <Route path="/" element={<DashboardLayout />}>\n    <Route index element={<DashboardHome />} />      {/* exactly "/" */}\n    <Route path="orders" element={<Orders />} />       {/* "/orders" */}\n    <Route path="products" element={<Products />} />   {/* "/products" */}\n  </Route>\n  <Route path="/login" element={<LoginPage />} />      {/* no layout */}\n</Routes>', lang: 'jsx' },
        { code: 'function DashboardLayout() {\n  return (\n    <div>\n      <Sidebar />\n      <main>\n        <Outlet />   {/* the matched child renders here */}\n      </main>\n    </div>\n  );\n}', lang: 'jsx' },
        'Child paths are **relative** (`"orders"`, not `"/orders"`). An `index` route is the child shown at the parent\'s exact path.',
        { h: 'Navigating from code' },
        '`Link` is for navigation the user clicks. `useNavigate()` returns a function for navigation that happens **because something finished**: a successful login, a saved form, a timeout.',
        { code: 'function LoginForm() {\n  const navigate = useNavigate();\n  async function handleSubmit(event) {\n    event.preventDefault();\n    await login(credentials);\n    navigate("/dashboard");                  // after the action completes\n  }\n  return <form onSubmit={handleSubmit}>{/* ... */}</form>;\n}', lang: 'jsx' },
        { table: { head: ['Call', 'Effect'], rows: [['`navigate("/orders")`', 'push a new history entry'], ['`navigate("/orders", { replace: true })`', 'replace the current entry (Back skips it)'], ['`navigate(-1)`', 'go back one entry']] } },
      ],
      example: [
        { code: 'function Sidebar() {\n  return (\n    <aside>\n      <NavLink to="/" end>Dashboard</NavLink>\n      <NavLink to="/orders">Orders</NavLink>\n    </aside>\n  );\n}\n// NavLink adds class="active" to the link for the current URL; `end` stops "/" matching every page.', lang: 'jsx' },
      ],
      task: [
        { ol: ['A layout route at `/` rendering `<aside>` with `NavLink`s to `/`, `/orders`, `/products`, and `<main><Outlet /></main>`.', 'Children: index → `<h1>Dashboard</h1>`, `orders` → `<h1>Orders</h1>`, `products` → `<h1>Products</h1>`.', '`/login` (outside the layout, no `<aside>`): a `<form>` with a `Log in` button. On submit, `preventDefault()` and `navigate("/orders")`.', 'Mark the current link: `NavLink` gives it the class `active` (use `end` on the `/` link).'] },
      ],
      starter: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside>
      <Link to="/">Dashboard</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/products">Products</Link>
    </aside>
  );
}

function Orders() {
  return (
    <div>
      <Sidebar />
      <main><h1>Orders</h1></main>
    </div>
  );
}

function Products() {
  return (
    <div>
      <Sidebar />
      <main><h1>Products</h1></main>
    </div>
  );
}

function DashboardHome() {
  return (
    <div>
      <Sidebar />
      <main><h1>Dashboard</h1></main>
    </div>
  );
}

function LoginPage() {
  return (
    <form>
      <button>Log in</button>
    </form>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
      solution: `import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate } from "react-router-dom";

function Sidebar() {
  return (
    <aside>
      <NavLink to="/" end>
        Dashboard
      </NavLink>
      <NavLink to="/orders">Orders</NavLink>
      <NavLink to="/products">Products</NavLink>
    </aside>
  );
}

function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function DashboardHome() {
  return <h1>Dashboard</h1>;
}

function Orders() {
  return <h1>Orders</h1>;
}

function Products() {
  return <h1>Products</h1>;
}

function LoginPage() {
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    navigate("/orders");
  }
  return (
    <form onSubmit={handleSubmit}>
      <button>Log in</button>
    </form>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
      checks: [
        { label: 'pages render inside the layout', mistake: 'Each page should appear inside <main> next to the <aside>, at "/", "/orders" and "/products".', check: async ({ render, el, App }) => { const out = []; for (const path of ['/', '/orders', '/products']) { const view = await render(el(App), { path }); out.push(`${view.$$('aside').length}:${view.text('main h1')}`); } return JSON.stringify(out) === '["1:Dashboard","1:Orders","1:Products"]' || `got ${JSON.stringify(out)}`; } },
        { label: 'layout written once with Outlet', mistake: 'Render <Sidebar /> once in a layout component with <Outlet />, and nest the page routes inside its <Route>.', check: ({ source }) => { const sidebars = (source.match(/<Sidebar\s*\/>/g) || []).length; return (sidebars === 1 && /<Outlet\s*\/>/.test(source) && /<Route\s+index\b/.test(source)) || `<Sidebar /> appears ${sidebars} time(s); Outlet ${/<Outlet/.test(source) ? 'used' : 'missing'}; index route ${/<Route\s+index\b/.test(source) ? 'used' : 'missing'}`; } },
        { label: 'login page has no layout', mistake: 'Keep /login as its own top-level route, outside the layout route.', check: async ({ render, el, App }) => { const view = await render(el(App), { path: '/login' }); return (Boolean(view.$('form')) && !view.$('aside')) || (view.$('aside') ? 'the login page shows the sidebar' : 'no form on /login'); } },
        { label: 'login navigates after submit', mistake: 'In the submit handler call event.preventDefault() then navigate("/orders") from useNavigate().', check: async ({ render, el, App, click, submits }) => { const before = submits.length; const view = await render(el(App), { path: '/login' }); await click(view.$('button')); const sub = submits[before]; return (sub?.prevented && view.text('main h1') === 'Orders') || (!sub ? 'submitting did nothing' : !sub.prevented ? 'the form did a real submit: call event.preventDefault()' : `after login the page shows "${view.text()}"`); } },
        { label: 'sidebar links switch pages', mistake: 'Use NavLink/Link inside the layout; clicking should only swap <main>.', check: async ({ render, el, App, click, navigations }) => { const before = navigations.length; const view = await render(el(App), { path: '/' }); const aside = view.$('aside'); await click(view.$$('aside a').find((a) => a.getAttribute('href') === '/products')); return (navigations.length === before && view.text('main h1') === 'Products' && view.$('aside') === aside) || `after clicking: "${view.text('main h1')}"${view.$('aside') === aside ? '' : ' (the sidebar was re-created)'}`; } },
        { label: 'active link marked', mistake: 'Use NavLink; add end to the "/" link so it is only active on the dashboard itself.', check: async ({ render, el, App }) => { const view = await render(el(App), { path: '/orders' }); const active = view.$$('aside a.active').map((a) => a.getAttribute('href')); return JSON.stringify(active) === '["/orders"]' || `active links: ${JSON.stringify(active)}`; } },
      ],
    },
    {
      id: 'routing-protected',
      title: 'Protected routes and redirects',
      source: 'JavaScript & React course, Part 28.7; Part 25.3',
      runner: 'react',
      teach: [
        'A **protected route** is a wrapper component: it reads the auth state (from context) and either renders its `children` or redirects to the login page. It combines context, `children` composition and routing.',
        { code: 'function ProtectedRoute({ children }) {\n  const { user } = useAuth();\n  if (!user) return <Navigate to="/login" replace />;\n  return children;\n}\n\n<Route\n  path="/dashboard"\n  element={\n    <ProtectedRoute>\n      <Dashboard />\n    </ProtectedRoute>\n  }\n/>', lang: 'jsx' },
        '`<Navigate>` is the component form of `useNavigate`: rendering it redirects. `replace` swaps the current history entry, so pressing Back from the login page does not bounce the user into the redirect again.',
        { h: 'Returning to the page the user wanted' },
        'Pass the original location along and send the user back after login:',
        { code: 'const location = useLocation();\nreturn <Navigate to="/login" replace state={{ from: location.pathname }} />;\n\n// in the login page\nconst location = useLocation();\nconst from = location.state?.from ?? "/dashboard";\nnavigate(from, { replace: true });', lang: 'jsx' },
        { warn: 'A protected route only hides UI. It is **not security**: anyone can read your JavaScript bundle and call your API directly. The server must check the token on every request; the client-side guard is for user experience.' },
      ],
      example: [
        { code: 'function useAuth() {\n  const context = useContext(AuthContext);\n  if (!context) throw new Error("useAuth must be used within an AuthProvider");\n  return context;\n}', lang: 'jsx' },
      ],
      task: [
        'The `AuthProvider`, `useAuth` and pages are given.',
        { ol: ['Write `ProtectedRoute({ children })`: logged out → `<Navigate to="/login" replace state={{ from: location.pathname }} />`; logged in → `children`.', 'Protect `/dashboard` and `/settings`. `/` stays public.', 'In `LoginPage`, the `Log in` button calls `login({ name: "Ammaar" })` and then navigates (with `replace`) to `location.state?.from`, or `/dashboard` if there is none.'] },
      ],
      starter: `import { createContext, useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (data) => setUser(data);
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

function Home() {
  return <h1>Welcome</h1>;
}

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Dashboard for {user.name}</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

function Settings() {
  return <h1>Settings</h1>;
}

function LoginPage() {
  const { login } = useAuth();
  return (
    <div>
      <h1>Please log in</h1>
      <button onClick={() => login({ name: "Ammaar" })}>Log in</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
`,
      solution: `import { createContext, useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (data) => setUser(data);
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function Home() {
  return <h1>Welcome</h1>;
}

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Dashboard for {user.name}</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

function Settings() {
  return <h1>Settings</h1>;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  function handleLogin() {
    login({ name: "Ammaar" });
    navigate(location.state?.from ?? "/dashboard", { replace: true });
  }
  return (
    <div>
      <h1>Please log in</h1>
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
`,
      checks: [
        { label: 'logged-out users are redirected', mistake: 'ProtectedRoute should return <Navigate to="/login" replace /> when there is no user.', check: async ({ render, el, App }) => { const dash = (await render(el(App), { path: '/dashboard' })).text('h1'); const settings = (await render(el(App), { path: '/settings' })).text('h1'); return (dash === 'Please log in' && settings === 'Please log in') || `"/dashboard" showed "${dash}", "/settings" showed "${settings}"`; } },
        { label: 'public page stays public', mistake: 'Only wrap the private routes; "/" should render for everyone.', check: async ({ render, el, App }) => { const text = (await render(el(App), { path: '/' })).text('h1'); return text === 'Welcome' || `"/" showed "${text}"`; } },
        { label: 'login goes to the dashboard by default', mistake: 'After login(...), call navigate(location.state?.from ?? "/dashboard", { replace: true }).', check: async ({ render, el, App, click }) => { const view = await render(el(App), { path: '/login' }); await click(view.$('button')); return view.text('h1') === 'Dashboard for Ammaar' || `after logging in: "${view.text('h1')}"`; } },
        { label: 'login returns to the page that was asked for', mistake: 'Pass state={{ from: location.pathname }} on <Navigate>, and read location.state?.from in the login page.', check: async ({ render, el, App, click }) => { const view = await render(el(App), { path: '/settings' }); if (view.text('h1') !== 'Please log in') return 'visiting /settings did not show the login page'; await click(view.$('button')); return view.text('h1') === 'Settings' || `after logging in: "${view.text('h1')}"`; } },
        { label: 'logging out protects again', mistake: 'ProtectedRoute must read the user from context on every render, so logout redirects immediately.', check: async ({ render, el, App, click }) => { const view = await render(el(App), { path: '/login' }); await click(view.$('button')); await click(view.$$('button').find((b) => b.textContent === 'Log out')); return view.text('h1') === 'Please log in' || `after logging out: "${view.text('h1')}"`; } },
        { label: 'one reusable guard', mistake: 'Write a ProtectedRoute component that renders <Navigate> and wrap each private page with it.', check: ({ source }) => { const wraps = (source.match(/<ProtectedRoute>/g) || []).length; return (/function\s+ProtectedRoute/.test(source) && /<Navigate\b/.test(source) && wraps >= 2) || `ProtectedRoute wraps ${wraps} route(s)`; } },
      ],
    },
    {
      id: 'routing-search-params',
      title: 'Query strings with useSearchParams',
      source: 'JavaScript & React course, Part 28.8; Part 11.5',
      runner: 'react',
      teach: [
        'Filters, search terms, sort order and page numbers usually belong in the **URL query string** (`/products?category=books&sort=price`), not in `useState`. Then the filtered view survives a reload, can be bookmarked and shared, and Back undoes a filter change.',
        '`useSearchParams()` works like `useState`, but the state lives in the URL. The first value is a `URLSearchParams` object; the setter updates the query string.',
        { code: 'const [searchParams, setSearchParams] = useSearchParams();\nconst category = searchParams.get("category");   // null when absent\n\nsetSearchParams({ category: "books" });          // ?category=books\nsetSearchParams({});                              // removes every parameter', lang: 'jsx' },
        'To change one parameter and keep the others, start from the current ones:',
        { code: 'setSearchParams((prev) => {\n  const next = new URLSearchParams(prev);\n  next.set("sort", "price");\n  return next;\n});', lang: 'jsx' },
        { tip: 'Query values are strings, like route params and `dataset` values. `searchParams.get("page")` is `"2"`, not `2`.' },
        'The filtered list is **derived** from the URL during render: no extra state, no effect to keep them in sync.',
      ],
      example: [
        { code: 'const visible = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;', lang: 'jsx' },
      ],
      task: [
        { ol: ['`ProductList` (route `/products`) reads `category` and `sort` from the query string.', 'Buttons `All`, `books`, `toys` set the category (`All` removes it) **without** losing `sort`.', 'A `Sort by price` button sets `sort=price` and keeps the category. With it, the list is sorted by price ascending.', 'Render `<p className="filter">Showing: {category or "all"}</p>` and a `<ul>` of `<li>` names. Do not copy the URL into useState.'] },
      ],
      starter: `import { useState } from "react";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";

const PRODUCTS = [
  { id: 1, name: "Concepts of Physics", category: "books", price: 650 },
  { id: 2, name: "Wooden train set", category: "toys", price: 1200 },
  { id: 3, name: "Organic Chemistry", category: "books", price: 480 },
  { id: 4, name: "Puzzle cube", category: "toys", price: 300 },
];

function ProductList() {
  const [category, setCategory] = useState(null);
  const visible = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  return (
    <div>
      <button onClick={() => setCategory(null)}>All</button>
      <button onClick={() => setCategory("books")}>books</button>
      <button onClick={() => setCategory("toys")}>toys</button>
      <p className="filter">Showing: {category || "all"}</p>
      <ul>{visible.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
      solution: `import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";

const PRODUCTS = [
  { id: 1, name: "Concepts of Physics", category: "books", price: 650 },
  { id: 2, name: "Wooden train set", category: "toys", price: 1200 },
  { id: 3, name: "Organic Chemistry", category: "books", price: 480 },
  { id: 4, name: "Puzzle cube", category: "toys", price: 300 },
];

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  function update(name, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === null) next.delete(name);
      else next.set(name, value);
      return next;
    });
  }

  const filtered = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  const visible = sort === "price" ? [...filtered].sort((a, b) => a.price - b.price) : filtered;

  return (
    <div>
      <button onClick={() => update("category", null)}>All</button>
      <button onClick={() => update("category", "books")}>books</button>
      <button onClick={() => update("category", "toys")}>toys</button>
      <button onClick={() => update("sort", "price")}>Sort by price</button>
      <p className="filter">Showing: {category || "all"}</p>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
      checks: [
        { label: 'reads the category from the URL', mistake: 'const category = searchParams.get("category") from useSearchParams(); a shared link must open filtered.', check: async ({ render, el, App }) => { const view = await render(el(App), { path: '/products?category=toys' }); const names = view.$$('li').map((li) => li.textContent); return (view.text('.filter') === 'Showing: toys' && JSON.stringify(names) === '["Wooden train set","Puzzle cube"]') || `showed "${view.text('.filter')}" with ${JSON.stringify(names)}`; } },
        { label: 'buttons change the filter', mistake: 'The buttons should call setSearchParams; All removes the parameter.', check: async ({ render, el, App, click }) => { const view = await render(el(App), { path: '/products' }); const btn = (l) => view.$$('button').find((b) => b.textContent === l); await click(btn('books')); const books = view.$$('li').length; await click(btn('All')); return (books === 2 && view.$$('li').length === 4 && view.text('.filter') === 'Showing: all') || `books showed ${books} items; All showed ${view.$$('li').length}`; } },
        { label: 'sorts by price from the URL', mistake: 'When sort is "price", sort a copy ([...list].sort((a, b) => a.price - b.price)).', check: async ({ render, el, App }) => { const view = await render(el(App), { path: '/products?sort=price' }); const names = view.$$('li').map((li) => li.textContent); return JSON.stringify(names) === '["Puzzle cube","Organic Chemistry","Concepts of Physics","Wooden train set"]' || `order: ${JSON.stringify(names)}`; } },
        { label: 'changing one parameter keeps the other', mistake: 'Build the next params from the previous ones: new URLSearchParams(prev), then set or delete one key.', check: async ({ render, el, App, click }) => { const view = await render(el(App), { path: '/products?sort=price' }); const btn = (l) => view.$$('button').find((b) => b.textContent === l); if (!btn('Sort by price')) return 'no "Sort by price" button'; await click(btn('books')); const a = view.$$('li').map((li) => li.textContent); await click(btn('Sort by price')); const b = view.$$('li').map((li) => li.textContent); return (JSON.stringify(a) === '["Organic Chemistry","Concepts of Physics"]' && JSON.stringify(b) === JSON.stringify(a)) || `after books: ${JSON.stringify(a)}`; } },
        { label: 'no copied state', mistake: 'Derive category and sort from searchParams instead of useState.', check: ({ source }) => (!/useState\(/.test(source) && /useSearchParams\(/.test(source)) || 'the filter still lives in useState' },
      ],
    },
    {
      id: 'routing-quiz',
      title: 'Routing check',
      source: 'JavaScript & React course, Part 28 knowledge check',
      runner: 'quiz',
      teach: [
        'Review: client-side routing keeps one loaded page and swaps components when the URL changes.',
        { table: { head: ['Tool', 'Use it for'], rows: [['`<Routes>` / `<Route>`', 'map paths to elements'], ['`<Link>` / `<NavLink>`', 'navigation the user clicks'], ['`useNavigate()`', 'navigation after an action finishes'], ['`<Navigate>`', 'redirecting while rendering'], ['`useParams()`', '`:id` segments (strings)'], ['`useSearchParams()`', 'query-string state'], ['`<Outlet />`', 'where nested child routes render'], ['`useLocation()`', 'the current path, search and state']] } },
        { note: 'A deployed SPA needs a server fallback: a direct visit or reload of `/products/42` asks the server for that path, and the server must answer with `index.html` so the router can take over. Without it the host returns a 404.' },
      ],
      example: [
        { code: '<Routes>\n  <Route path="/" element={<Layout />}>\n    <Route index element={<Home />} />\n    <Route path="products/:id" element={<ProductDetail />} />\n    <Route\n      path="account"\n      element={\n        <ProtectedRoute>\n          <Account />\n        </ProtectedRoute>\n      }\n    />\n  </Route>\n  <Route path="/login" element={<Login />} />\n  <Route path="*" element={<NotFound />} />\n</Routes>', lang: 'jsx' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Why does `<a href="/about">` break a React SPA\'s navigation?', options: ['It is not valid JSX', 'It causes a full page load that discards in-memory state', 'React Router throws an error', 'It opens a new tab'], answer: 1, explain: 'Link intercepts the click with preventDefault and uses the History API instead.' },
        { q: 'After a successful form submission you want to show the order page. Use…', options: ['<Link>', 'window.location.href', 'useNavigate()', 'a new BrowserRouter'], answer: 2, explain: 'Programmatic navigation after an action completes is useNavigate\'s job.' },
        { q: 'On `/products/7`, `useParams().id` is…', options: ['7 (number)', '"7" (string)', '{ id: 7 }', 'undefined'], answer: 1, explain: 'URL parts are text. Convert with Number(id).' },
        { q: 'What does `<Outlet />` do?', options: ['Opens a link in a new window', 'Marks where the matched child route renders inside a layout', 'Catches 404s', 'Exports the router'], answer: 1, explain: 'Nested routes render the parent layout once and the child at the Outlet.' },
        { q: 'Why add `replace` to the login redirect?', options: ['It is faster', 'So Back does not return to the protected URL and redirect again', 'It clears the user', 'It is required by Navigate'], answer: 1, explain: 'replace swaps the history entry instead of adding one.' },
        { q: 'A client-side ProtectedRoute is…', options: ['Real security for the data', 'A UX guard; the server must still check auth on every request', 'Unnecessary with HTTPS', 'Only for admin pages'], answer: 1, explain: 'Anyone can call the API directly; protect data on the server.' },
        { q: 'Reloading `/products/42` on a static host gives a 404. Fix it by…', options: ['Using HashRouter only', 'Configuring the server to serve index.html for unknown paths', 'Adding path="*"', 'Removing BrowserRouter'], answer: 1, explain: 'The request reaches the server before React runs; it must fall back to index.html.' },
        { q: 'Where should a list\'s current filter live if users share links to filtered views?', options: ['useState', 'A ref', 'The URL query string (useSearchParams)', 'localStorage'], answer: 2, explain: 'The URL is shareable, bookmarkable and works with Back.' },
      ],
    },
  ],
};
