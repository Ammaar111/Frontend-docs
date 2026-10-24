// JavaScript & React course, Parts 32–37: errors, accessibility, security,
// testing, TypeScript and production.

const testingSetup = `
const __state = { results: [], prefix: [] };

function describe(name, fn) {
  __state.prefix.push(name);
  try {
    fn();
  } finally {
    __state.prefix.pop();
  }
}

function it(name, fn) {
  const fullName = [...__state.prefix, name].join(" > ");
  try {
    fn();
    __state.results.push({ name: fullName, pass: true });
  } catch (error) {
    __state.results.push({ name: fullName, pass: false, error: error.message });
  }
}
const test = it;

function __show(value) {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

function expect(actual) {
  return {
    toBe(expected) {
      if (!Object.is(actual, expected)) throw new Error("expected " + __show(expected) + ", got " + __show(actual));
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
    },
    toBeTruthy() {
      if (!actual) throw new Error("expected a truthy value, got " + __show(actual));
    },
    toBeFalsy() {
      if (actual) throw new Error("expected a falsy value, got " + __show(actual));
    },
    toContain(item) {
      if (!actual.includes(item)) throw new Error("expected " + __show(actual) + " to contain " + __show(item));
    },
    toThrow(message) {
      if (typeof actual !== "function") throw new Error("toThrow needs a function: expect(() => fn()).toThrow()");
      let thrown = null;
      try {
        actual();
      } catch (error) {
        thrown = error;
      }
      if (!thrown) throw new Error("expected the function to throw, but it returned normally");
      if (message !== undefined && !String(thrown.message).includes(message)) {
        throw new Error("expected an error containing " + __show(message) + ", got " + __show(thrown.message));
      }
    },
  };
}

const __email = (email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
const __price = (amount) => "₹" + amount.toLocaleString("en-IN");
const __discount = (price, percent) => {
  if (percent < 0 || percent > 100) throw new RangeError("percent must be between 0 and 100");
  return price - (price * percent) / 100;
};
const __correct = { isValidEmail: __email, formatPrice: __price, calculateDiscount: __discount };

// Each mutant is the correct code with one realistic bug.
const __impls = {
  correct: __correct,
  emailAtOnly: { ...__correct, isValidEmail: (email) => email.includes("@") },
  emailAllowsSpaces: { ...__correct, isValidEmail: (email) => /^[^@]+@[^@]+\\.[^@]+$/.test(email) },
  emailAlwaysTrue: { ...__correct, isValidEmail: () => true },
  priceUsGrouping: { ...__correct, formatPrice: (amount) => "₹" + amount.toLocaleString("en-US") },
  priceNoSymbol: { ...__correct, formatPrice: (amount) => amount.toLocaleString("en-IN") },
  discountNoValidation: { ...__correct, calculateDiscount: (price, percent) => price - (price * percent) / 100 },
  discountReturnsSaving: { ...__correct, calculateDiscount: (price, percent) => { __discount(price, percent); return (price * percent) / 100; } },
  discountRejects100: { ...__correct, calculateDiscount: (price, percent) => { if (percent < 0 || percent >= 100) throw new RangeError("percent must be between 0 and 100"); return price - (price * percent) / 100; } },
  discountRejects0: { ...__correct, calculateDiscount: (price, percent) => { if (percent <= 0 || percent > 100) throw new RangeError("percent must be between 0 and 100"); return price - (price * percent) / 100; } },
};

function __run(impl) {
  __state.results = [];
  __state.prefix = [];
  if (typeof runTests !== "function") throw new Error("write function runTests({ isValidEmail, formatPrice, calculateDiscount }) { ... }");
  runTests(impl);
  return __state.results;
}

function __survivors(names) {
  return names.filter((name) => __run(__impls[name]).every((result) => result.pass));
}
`;

export default {
  id: 'react-quality',
  title: 'Errors, accessibility, security, testing and production',
  lessons: [
    {
      id: 'error-boundaries',
      title: 'Error boundaries and where errors are handled',
      source: 'JavaScript & React course, Part 32',
      runner: 'react',
      expose: ['ErrorBoundary'],
      setup: 'function saveDraft() {\n  throw new Error("Server rejected the draft");\n}',
      teach: [
        { table: { head: ['Error', 'Example', 'Handled by'], rows: [['API error', 'fetch fails or returns 500', '`try/catch` around `await` (data-fetching module)'], ['Validation error', 'a field is invalid', 'component state'], ['Render error', 'reading `.price` of `undefined` while rendering', '**error boundary**'], ['Event handler / async error', 'a click handler or `setTimeout` throws', '`try/catch` in that code']] } },
        'By default an error thrown **while rendering** unmounts the whole tree: the page goes blank. A `try/catch` inside one component cannot protect against a **child\'s** render error, because the child renders in a separate call outside that `try`.',
        'An **error boundary** catches render errors anywhere below it, logs them and shows a fallback. It must be a **class component**: there is no hook for this.',
        { code: 'import { Component } from "react";\n\nclass ErrorBoundary extends Component {\n  state = { hasError: false };\n\n  static getDerivedStateFromError() {\n    return { hasError: true };            // next render shows the fallback\n  }\n\n  componentDidCatch(error, info) {\n    console.error("Caught by Error Boundary:", error.message, info.componentStack);\n  }\n\n  handleRetry = () => this.setState({ hasError: false });\n\n  render() {\n    if (this.state.hasError) {\n      return (\n        <div role="alert">\n          <p>{this.props.fallback ?? "Something went wrong."}</p>\n          <button onClick={this.handleRetry}>Try again</button>\n        </div>\n      );\n    }\n    return this.props.children;\n  }\n}', lang: 'jsx' },
        { h: 'Placement' },
        'One boundary around the whole app turns any bug into a full-page failure. Wrap **independent sections** separately so a broken product list leaves the header, cart and footer working.',
        { warn: 'Error boundaries do **not** catch errors in event handlers, in async code (`setTimeout`, promises, `await`), during server rendering, or in the boundary itself. Use `try/catch` there and show the error through state.' },
        '"Try again" resets `hasError` and renders the children again. That helps with transient failures; a permanent bug just throws again.',
      ],
      example: [
        { code: '<Header />\n<ErrorBoundary fallback="Prices are unavailable.">\n  <ProductPrice product={featured} />\n</ErrorBoundary>\n<Footer />', lang: 'jsx' },
      ],
      task: [
        'The featured product is missing, so `ProductPrice` crashes and takes the whole page with it. `saveDraft()` throws when called.',
        { ol: ['Write the `ErrorBoundary` class: `getDerivedStateFromError`, `componentDidCatch` logging `console.error("Caught by Error Boundary:", error.message)`, a fallback inside `<div role="alert">` (the `fallback` prop, default `"Something went wrong."`) and a `Try again` button that resets it.', 'Wrap only `ProductPrice` in a boundary with `fallback="Prices are unavailable."`; the header, save button and footer must keep working.', 'In `SaveButton`, catch the handler error and show `<p className="save-message">Save failed: …</p>`. Keep `"Saved"` on success.'] },
      ],
      starter: `import { Component, useState } from "react";

const FEATURED = [][0]; // the API returned no featured product

function Header() {
  return <header>Toy Shop</header>;
}

function Footer() {
  return <footer>© Toy Shop</footer>;
}

function ProductPrice({ product }) {
  return <p className="price">₹{product.price.toFixed(2)}</p>;
}

function SaveButton() {
  const [message, setMessage] = useState("");
  function handleClick() {
    saveDraft();
    setMessage("Saved");
  }
  return (
    <div>
      <button onClick={handleClick}>Save draft</button>
      {message && <p className="save-message">{message}</p>}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Header />
      <ProductPrice product={FEATURED} />
      <SaveButton />
      <Footer />
    </div>
  );
}
`,
      solution: `import { Component, useState } from "react";

const FEATURED = [][0]; // the API returned no featured product

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Caught by Error Boundary:", error.message);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <p>{this.props.fallback ?? "Something went wrong."}</p>
          <button onClick={this.handleRetry}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Header() {
  return <header>Toy Shop</header>;
}

function Footer() {
  return <footer>© Toy Shop</footer>;
}

function ProductPrice({ product }) {
  return <p className="price">₹{product.price.toFixed(2)}</p>;
}

function SaveButton() {
  const [message, setMessage] = useState("");
  function handleClick() {
    try {
      saveDraft();
      setMessage("Saved");
    } catch (error) {
      setMessage(\`Save failed: \${error.message}\`);
    }
  }
  return (
    <div>
      <button onClick={handleClick}>Save draft</button>
      {message && <p className="save-message">{message}</p>}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback="Prices are unavailable.">
        <ProductPrice product={FEATURED} />
      </ErrorBoundary>
      <SaveButton />
      <Footer />
    </div>
  );
}
`,
      checks: [
        { label: 'the failure is contained', mistake: 'Wrap only <ProductPrice> in <ErrorBoundary fallback="Prices are unavailable.">; Header and Footer stay outside it.', check: ({ text }) => (text('header') === 'Toy Shop' && text('footer') === '© Toy Shop' && text('[role="alert"] p') === 'Prices are unavailable.') || `page shows "${text()}"` },
        { label: 'default fallback', mistake: 'Use this.props.fallback ?? "Something went wrong." inside <div role="alert">.', check: async ({ render, el, exposed }) => { const Bomb = () => { throw new Error('kaboom'); }; const view = await render(el(exposed.ErrorBoundary, null, el(Bomb))); return view.text('[role="alert"] p') === 'Something went wrong.' || `boundary shows "${view.text()}"`; } },
        { label: 'errors are logged', mistake: 'In componentDidCatch(error) call console.error("Caught by Error Boundary:", error.message).', check: async ({ render, el, exposed, logs }) => { const before = logs.length; const Bomb = () => { throw new Error('kaboom-logged'); }; await render(el(exposed.ErrorBoundary, null, el(Bomb))); const line = logs.slice(before).find((l) => l.includes('kaboom-logged')); return (Boolean(line) && line.startsWith('[error] Caught by Error Boundary:')) || (line ? `logged "${line}"` : 'nothing was logged'); } },
        { label: 'Try again renders the children again', mistake: 'The Try again button should setState({ hasError: false }).', check: async ({ render, el, exposed, click }) => { let broken = true; const Flaky = () => { if (broken) throw new Error('temporary'); return el('p', { className: 'ok' }, 'Recovered'); }; const view = await render(el(exposed.ErrorBoundary, null, el(Flaky))); broken = false; const retry = view.$$('button').find((b) => b.textContent === 'Try again'); if (!retry) return 'no Try again button'; await click(retry); return view.text('.ok') === 'Recovered' || `after retry: "${view.text()}"`; } },
        { label: 'event handler errors are caught', mistake: 'Boundaries ignore event handlers: wrap saveDraft() in try/catch and show "Save failed: " + error.message.', check: async ({ $$, click, text, errors }) => { const before = errors.length; await click($$('button').find((b) => b.textContent === 'Save draft')); return (text('.save-message') === 'Save failed: Server rejected the draft' && errors.length === before) || (errors.length > before ? `the click threw ${errors[errors.length - 1]}` : `shows "${text('.save-message')}"`); } },
        { label: 'a class component boundary', mistake: 'ErrorBoundary must be a class extending Component with static getDerivedStateFromError.', check: ({ exposed }) => (Boolean(exposed.ErrorBoundary?.prototype?.isReactComponent) && typeof exposed.ErrorBoundary.getDerivedStateFromError === 'function') || 'ErrorBoundary is not a class component with getDerivedStateFromError' },
      ],
    },
    {
      id: 'a11y-components',
      title: 'Accessible components',
      source: 'JavaScript & React course, Part 33',
      runner: 'react',
      component: null,
      expose: ['MenuToggle', 'NewsletterForm', 'CloseButton', 'ProductTile', 'Modal'],
      teach: [
        '**Accessibility (a11y)** means people using screen readers, keyboards only, zoom or high contrast can use the interface. It is the ethical default, often a legal requirement, and accessible markup is also easier to test.',
        { h: 'Semantic HTML first' },
        { code: '// 🔴 not focusable, not announced as a button, Enter/Space do nothing\n<div onClick={handleSubmit}>Submit</div>\n\n// ✅ focusable, announced, keyboard-operable for free\n<button onClick={handleSubmit}>Submit</button>', lang: 'jsx' },
        { list: ['Every input needs a linked label: `<label htmlFor="email">` + `<input id="email">`. Screen readers announce it, and clicking the label focuses the input.', 'Everything must work with the keyboard alone: Tab to move, Enter/Space to activate.', 'When a dialog opens, **move focus into it** (a ref + effect), and let Escape close it.', 'Images: `alt` describes the content; decorative images get `alt=""` (a missing `alt` makes some screen readers read the file name).', 'Text needs enough contrast (WCAG: 4.5:1 for normal text); DevTools can measure it.'] },
        { h: 'ARIA fills gaps' },
        { code: '<button aria-label="Close">×</button>          {/* a name when the visible text is not one */}\n<p role="alert">Enter a valid email</p>        {/* announced immediately when it appears */}\n<p role="status">Saved</p>                     {/* announced politely */}\n<button aria-expanded={isOpen} aria-controls="menu">Menu</button>\n<input aria-invalid="true" aria-describedby="email-error" />', lang: 'jsx' },
        { warn: 'First rule of ARIA: **no ARIA is better than bad ARIA**. Use a native element when one exists; wrong roles override correct native semantics and make things worse.' },
      ],
      example: [
        { code: 'function Modal({ isOpen, onClose }) {\n  const closeButtonRef = useRef(null);\n  useEffect(() => {\n    if (isOpen) closeButtonRef.current?.focus();\n  }, [isOpen]);\n  if (!isOpen) return null;\n  return (\n    <div role="dialog" aria-modal="true">\n      <button ref={closeButtonRef} onClick={onClose}>Close</button>\n    </div>\n  );\n}', lang: 'jsx' },
      ],
      task: [
        'Fix each component. No `<div>` or `<span>` with `onClick`.',
        { ol: ['`MenuToggle`: a real `<button>` "Menu" with `aria-expanded` and `aria-controls="main-menu"`; the `<ul id="main-menu">` is always rendered and uses `hidden` when closed.', '`NewsletterForm`: `<label htmlFor="newsletter-email">Email</label>` linked to the input; a `type="submit"` "Subscribe" button. Invalid email → `<p id="newsletter-error" role="alert">Enter a valid email address</p>` plus `aria-invalid="true"` and `aria-describedby="newsletter-error"` on the input. Valid → replace the form with `<p role="status">Thanks for subscribing!</p>`.', '`CloseButton({ onClose })`: an icon button showing `×` with the accessible name "Close".', '`ProductTile({ product })`: product image `alt={product.imageAlt}`, and the decorative divider image `alt=""`.', '`Modal({ isOpen, onClose, title, children })`: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at its `<h2>` title, focus moves to its Close button on open, and Escape calls `onClose`.'] },
      ],
      starter: `import { useState, useRef, useEffect } from "react";

function MenuToggle() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      <div className="menu-toggle" onClick={() => setOpen(!open)}>Menu</div>
      {open && (
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/toys">Toys</a></li>
        </ul>
      )}
    </nav>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form>
      <span>Email</span>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div onClick={() => {}}>Subscribe</div>
    </form>
  );
}

function CloseButton({ onClose }) {
  return <span onClick={onClose}>×</span>;
}

function ProductTile({ product }) {
  return (
    <article>
      <img src={product.image} />
      <img src="/divider.svg" className="divider" />
      <h3>{product.name}</h3>
    </article>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <h2>{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
`,
      solution: `import { useState, useRef, useEffect } from "react";

function MenuToggle() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      <button aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>
        Menu
      </button>
      <ul id="main-menu" hidden={!open}>
        <li><a href="/">Home</a></li>
        <li><a href="/toys">Toys</a></li>
      </ul>
    </nav>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setSubscribed(true);
  }

  if (subscribed) return <p role="status">Thanks for subscribing!</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="newsletter-email">Email</label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "newsletter-error" : undefined}
      />
      {error && (
        <p id="newsletter-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit">Subscribe</button>
    </form>
  );
}

function CloseButton({ onClose }) {
  return (
    <button type="button" aria-label="Close" onClick={onClose}>
      ×
    </button>
  );
}

function ProductTile({ product }) {
  return (
    <article>
      <img src={product.image} alt={product.imageAlt} />
      <img src="/divider.svg" className="divider" alt="" />
      <h3>{product.name}</h3>
    </article>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button ref={closeButtonRef} onClick={onClose}>
        Close
      </button>
    </div>
  );
}
`,
      checks: [
        { label: 'menu toggle is a real button with state', mistake: 'Use <button aria-expanded={open} aria-controls="main-menu">, and keep <ul id="main-menu" hidden={!open}> in the DOM.', check: async ({ render, el, exposed, click }) => { const view = await render(el(exposed.MenuToggle)); const button = view.$('button'); if (!button) return 'there is no <button>'; const menu = view.$('#main-menu'); const closed = button.getAttribute('aria-expanded') === 'false' && button.getAttribute('aria-controls') === 'main-menu' && menu?.hidden === true; await click(button); const open = button.getAttribute('aria-expanded') === 'true' && view.$('#main-menu')?.hidden === false; return (closed && open) || `closed: ${closed ? 'ok' : 'wrong'}, open: ${open ? 'ok' : 'wrong'} (aria-expanded="${button.getAttribute('aria-expanded')}")`; } },
        { label: 'labelled input and submit button', mistake: 'Link <label htmlFor="newsletter-email"> to <input id="newsletter-email">, and use <button type="submit">.', check: async ({ render, el, exposed }) => { const view = await render(el(exposed.NewsletterForm)); const input = view.$('input'); const label = input?.labels?.[0]?.textContent; const submit = view.$('button[type="submit"]'); return (label === 'Email' && submit?.textContent === 'Subscribe') || `input label: ${JSON.stringify(label)}, submit button: ${submit ? 'yes' : 'no'}`; } },
        { label: 'errors are announced and linked', mistake: 'Show <p id="newsletter-error" role="alert"> and set aria-invalid="true" and aria-describedby="newsletter-error" on the input.', check: async ({ render, el, exposed, type, click }) => { const view = await render(el(exposed.NewsletterForm)); await type(view.$('input'), 'not-an-email'); await click(view.$('button')); const input = view.$('input'); const alert = view.$('[role="alert"]'); return (alert?.textContent === 'Enter a valid email address' && input?.getAttribute('aria-invalid') === 'true' && input?.getAttribute('aria-describedby') === alert?.id && alert.id === 'newsletter-error') || `alert: ${JSON.stringify(alert?.textContent)}, aria-invalid=${input?.getAttribute('aria-invalid')}, aria-describedby=${input?.getAttribute('aria-describedby')}`; } },
        { label: 'success uses a status message', mistake: 'After a valid submit, render <p role="status">Thanks for subscribing!</p>.', check: async ({ render, el, exposed, type, click }) => { const view = await render(el(exposed.NewsletterForm)); await type(view.$('input'), 'ammaar@example.com'); await click(view.$('button')); return view.text('[role="status"]') === 'Thanks for subscribing!' || `shows "${view.text()}"`; } },
        { label: 'icon button has a name', mistake: 'Use <button aria-label="Close">×</button>.', check: async ({ render, el, exposed, click }) => { let closed = 0; const view = await render(el(exposed.CloseButton, { onClose: () => { closed += 1; } })); const button = view.$('button'); if (!button) return 'there is no <button>'; await click(button); return (button.getAttribute('aria-label') === 'Close' && closed === 1) || `aria-label="${button.getAttribute('aria-label')}", onClose calls: ${closed}`; } },
        { label: 'meaningful and decorative alt text', mistake: 'alt={product.imageAlt} on the product image and alt="" on the divider.', check: async ({ render, el, exposed }) => { const view = await render(el(exposed.ProductTile, { product: { name: 'Wooden train set', image: '/train.jpg', imageAlt: 'Red wooden train with three carriages' } })); const [photo, divider] = view.$$('img'); return (photo?.getAttribute('alt') === 'Red wooden train with three carriages' && divider?.hasAttribute('alt') && divider.getAttribute('alt') === '') || `alts: ${JSON.stringify(view.$$('img').map((i) => i.getAttribute('alt')))}`; } },
        { label: 'dialog semantics and focus', mistake: 'role="dialog", aria-modal="true", aria-labelledby="modal-title" on the wrapper, id="modal-title" on the h2, and focus the Close button in an effect.', check: async ({ render, el, exposed, document }) => { const props = { onClose: () => {}, title: 'Your cart' }; const view = await render(el(exposed.Modal, { ...props, isOpen: false })); const nothing = !view.$('[role="dialog"]'); await view.rerender(el(exposed.Modal, { ...props, isOpen: true })); const dialog = view.$('[role="dialog"]'); const labelled = dialog && document.getElementById(dialog.getAttribute('aria-labelledby'))?.textContent === 'Your cart'; const focused = document.activeElement?.textContent === 'Close' && dialog?.contains(document.activeElement); return (nothing && dialog?.getAttribute('aria-modal') === 'true' && labelled && focused) || `dialog: ${dialog ? 'found' : 'missing'}, labelled: ${Boolean(labelled)}, focus on Close: ${Boolean(focused)}`; } },
        { label: 'Escape closes the dialog', mistake: 'Handle onKeyDown on the dialog: if (event.key === "Escape") onClose().', check: async ({ render, el, exposed, press }) => { let closed = 0; const view = await render(el(exposed.Modal, { isOpen: true, title: 'Cart', onClose: () => { closed += 1; } })); const target = view.$('[role="dialog"] button') ?? view.$('button'); await press(target, 'Escape'); return closed === 1 || `onClose was called ${closed} time(s)`; } },
        { label: 'no clickable divs or spans', mistake: 'Replace every <div onClick> / <span onClick> with a <button>.', check: ({ source }) => !/<(div|span)\b[^>]*\bonClick/.test(source) || 'a div or span still has onClick' },
      ],
    },
    {
      id: 'security-xss',
      title: 'XSS, dangerouslySetInnerHTML and sanitizing',
      source: 'JavaScript & React course, Part 34.1; Part 6.2',
      runner: 'react',
      component: null,
      expose: ['Comment', 'sanitizeHtml', 'BlogPost', 'ExternalLink'],
      teach: [
        '**Cross-site scripting (XSS)**: untrusted text is inserted as markup, so the browser runs it. An injected script can read the page, its tokens in `localStorage`, and act as the user.',
        { code: 'function Comment({ text }) {\n  return <p>{text}</p>;   // ✅ always text: "<script>" is displayed, never run\n}', lang: 'jsx' },
        'JSX escapes every `{value}`, like `textContent`. The escape hatch is deliberately named to scare you:',
        { code: '<div dangerouslySetInnerHTML={{ __html: htmlContent }} />   // raw HTML: XSS if htmlContent is untrusted', lang: 'jsx' },
        'Use it only for HTML you trust or have **sanitized**. A sanitizer parses the HTML into an inert document (`DOMParser` does not run scripts), keeps an allowlist of tags, drops dangerous ones entirely, and removes every attribute except safe ones.',
        { list: ['Drop `script`, `style`, `iframe`, `object`, `embed` with their content.', 'Unknown tags (`marquee`, `img`, `svg`…): unwrap them, keeping only their (cleaned) children.', 'Remove **all** attributes (`onclick`, `onerror`, `style`…) except `href` on links.', 'Check `href` by **parsing** it: `new URL(href, base).protocol` must be `http:`, `https:` or `mailto:`. String checks like `startsWith("javascript:")` miss `" JaVaScRiPt:"` and `"java\\tscript:"`.'] },
        { warn: 'In production use a maintained sanitizer such as **DOMPurify**, ideally on the server too. Hand-written sanitizers miss edge cases attackers know about. Write one here to understand what that library does.' },
        { h: 'Links to other sites' },
        '`target="_blank"` opens a new tab. Add `rel="noopener noreferrer"` so the new page cannot reach back through `window.opener`, and never put an unchecked URL in `href`.',
      ],
      example: [
        { code: 'function isSafeUrl(href) {\n  try {\n    return ["http:", "https:", "mailto:"].includes(new URL(href, "https://example.com").protocol);\n  } catch {\n    return false;\n  }\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['`Comment({ text })`: render the text safely in a `<p>`.', '`sanitizeHtml(html)`: allow `b strong i em p a ul ol li br code`; drop `script style iframe object embed` completely; unwrap anything else; strip every attribute except a safe `href` on `<a>`; return the cleaned `body.innerHTML`.', '`BlogPost({ html })`: `<div className="post">` showing `sanitizeHtml(html)` through `dangerouslySetInnerHTML`.', '`ExternalLink({ href, children })`: for http/https URLs, `<a href target="_blank" rel="noopener noreferrer">`; otherwise just `<span>{children}</span>`.'] },
      ],
      starter: `function Comment({ text }) {
  return <p dangerouslySetInnerHTML={{ __html: text }} />;
}

function sanitizeHtml(html) {
  return html.replace(/<script>/g, "");
}

function BlogPost({ html }) {
  return <div className="post" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank">
      {children}
    </a>
  );
}
`,
      solution: `const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "P", "A", "UL", "OL", "LI", "BR", "CODE"]);
const DROPPED_TAGS = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "TEMPLATE", "NOSCRIPT"]);
const SAFE_PROTOCOLS = ["http:", "https:", "mailto:"];

function isSafeUrl(href) {
  try {
    return SAFE_PROTOCOLS.includes(new URL(href, "https://example.com").protocol);
  } catch {
    return false;
  }
}

function cleanChildren(parent) {
  for (const node of [...parent.childNodes]) {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove();
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const tag = node.nodeName.toUpperCase();
    if (DROPPED_TAGS.has(tag)) {
      node.remove();
      continue;
    }
    cleanChildren(node);
    if (!ALLOWED_TAGS.has(tag)) {
      node.replaceWith(...node.childNodes);
      continue;
    }
    for (const attribute of [...node.attributes]) {
      const keep = tag === "A" && attribute.name === "href" && isSafeUrl(attribute.value);
      if (!keep) node.removeAttribute(attribute.name);
    }
  }
}

function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  cleanChildren(doc.body);
  return doc.body.innerHTML;
}

function Comment({ text }) {
  return <p>{text}</p>;
}

function BlogPost({ html }) {
  return <div className="post" dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}

function ExternalLink({ href, children }) {
  let safe = false;
  try {
    safe = ["http:", "https:"].includes(new URL(href).protocol);
  } catch {
    safe = false;
  }
  if (!safe) return <span>{children}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
`,
      checks: [
        { label: 'comments render as text', mistake: 'Render {text} inside <p>; never put user text in dangerouslySetInnerHTML.', check: async ({ render, el, exposed }) => { const text = 'Nice toy! <img src="x" onerror="window.__xss = 1">'; const view = await render(el(exposed.Comment, { text })); return (!view.$('img') && view.text('p') === text) || 'the comment was parsed as HTML'; } },
        { label: 'keeps safe formatting', mistake: 'Allowed tags (p, b, em, …) should survive unchanged.', check: ({ exposed }) => { const html = '<p>Hello <b>world</b> and <em>you</em></p><ul><li>one</li></ul>'; const out = exposed.sanitizeHtml(html); return out === html || `got ${JSON.stringify(out)}`; } },
        { label: 'drops scripts and frames with their content', mistake: 'Remove script, style, iframe, object and embed elements entirely.', check: ({ exposed }) => { const out = exposed.sanitizeHtml('<p>Hi</p><script>alert(1)</script><style>p{}</style><iframe src="https://evil.example"></iframe>'); return out === '<p>Hi</p>' || `got ${JSON.stringify(out)}`; } },
        { label: 'strips attributes', mistake: 'Remove every attribute (onclick, onerror, style, …) from kept elements.', check: ({ exposed }) => { const out = exposed.sanitizeHtml('<b onclick="steal()" style="color:red" class="x">bold</b>'); return out === '<b>bold</b>' || `got ${JSON.stringify(out)}`; } },
        { label: 'blocks javascript: links', mistake: 'Keep href only if new URL(href, base).protocol is http:, https: or mailto:. Parsing catches case and whitespace tricks.', check: ({ exposed }) => { const out = exposed.sanitizeHtml('<a href="javascript:alert(1)">a</a><a href=" JaVaScRiPt:alert(1)">b</a><a href="java\tscript:alert(1)">c</a><a href="https://example.com/x">d</a><a href="mailto:hi@example.com">e</a>'); return out === '<a>a</a><a>b</a><a>c</a><a href="https://example.com/x">d</a><a href="mailto:hi@example.com">e</a>' || `got ${JSON.stringify(out)}`; } },
        { label: 'unwraps unknown tags', mistake: 'For tags outside the allowlist, replace the element with its cleaned children.', check: ({ exposed }) => { const out = exposed.sanitizeHtml('<marquee>Sale <b onmouseover="x()">today</b></marquee><img src="x" onerror="alert(1)">'); return out === 'Sale <b>today</b>' || `got ${JSON.stringify(out)}`; } },
        { label: 'BlogPost renders sanitized HTML', mistake: 'Pass sanitizeHtml(html) to dangerouslySetInnerHTML.', check: async ({ render, el, exposed, wait, window }) => { const view = await render(el(exposed.BlogPost, { html: '<p>Post</p><img src="x" onerror="window.__xss = 2"><script>window.__xss = 3</script>' })); await wait(50); return (view.text('.post p') === 'Post' && !view.$('.post img') && !view.$('.post script') && window.__xss === undefined) || `post HTML: ${JSON.stringify(view.$('.post')?.innerHTML)}`; } },
        { label: 'safe external links', mistake: 'http(s) links get target="_blank" rel="noopener noreferrer"; anything else renders a <span>.', check: async ({ render, el, exposed }) => { const good = await render(el(exposed.ExternalLink, { href: 'https://example.com' }, 'Docs')); const a = good.$('a'); const okGood = a?.getAttribute('target') === '_blank' && /noopener/.test(a.getAttribute('rel') ?? '') && /noreferrer/.test(a.getAttribute('rel') ?? ''); const bad = await render(el(exposed.ExternalLink, { href: 'javascript:alert(1)' }, 'Click')); return (okGood && !bad.$('a') && bad.text('span') === 'Click') || `https link rel="${a?.getAttribute('rel')}", javascript: link ${bad.$('a') ? 'rendered an <a>' : 'ok'}`; } },
      ],
    },
    {
      id: 'testing-basics',
      title: 'Writing tests that catch bugs',
      source: 'JavaScript & React course, Part 35',
      runner: 'js',
      setup: testingSetup,
      teach: [
        { table: { head: ['Type', 'Tests', 'Speed', 'Example'], rows: [['Unit', 'one function or component', 'very fast', '`formatPrice(1500)` → `"₹1,500"`'], ['Integration', 'pieces together', 'fast–moderate', 'submitting the form adds a row'], ['End-to-end', 'the whole app in a real browser', 'slow', 'sign up → log in → checkout']] } },
        'The **testing pyramid**: many unit tests, fewer integration tests, a few end-to-end tests. Unit tests pinpoint failures; E2E tests catch what only shows up when everything runs together, but are slow and brittle.',
        { code: '// validators.test.js (Vitest)\nimport { describe, it, expect } from "vitest";\nimport { isValidEmail } from "./validators.js";\n\ndescribe("isValidEmail", () => {\n  it("accepts a valid email", () => {\n    expect(isValidEmail("test@example.com")).toBe(true);\n  });\n  it("rejects a string with no @", () => {\n    expect(isValidEmail("not-an-email")).toBe(false);\n  });\n});', lang: 'js' },
        { list: ['`describe(name, fn)` groups tests.', '`it(name, fn)` (alias `test`) is one case.', '`expect(value).toBe(x)` uses `Object.is`; `.toEqual` compares structure; `.toThrow(msg?)` takes a **function** that should throw: `expect(() => fn(-1)).toThrow()`.'] },
        'Pure functions are the easiest to test: same input, same output, nothing to set up or mock.',
        { h: 'A test is only as good as the bugs it catches' },
        'A suite that only checks the happy path passes against buggy code too. Test the **edges**: empty input, boundaries (0 and 100 for a percentage), invalid input that should throw, values large enough to expose formatting rules.',
        '**Mutation testing** measures this: a tool plants small bugs ("mutants") in your code and re-runs the tests. A mutant that no test notices "survives" and shows a gap in your suite. That is how this lesson grades you.',
        { h: 'Components and mocks' },
        'React Testing Library tests components the way users use them: find by role and visible text (`screen.getByRole("button", { name: "Increment" })`), click with `userEvent`, assert on what is shown. Such tests survive refactors (useState → useReducer) because they ignore implementation details. Network calls are **mocked** (`vi.stubGlobal("fetch", vi.fn(...))`) so tests are fast, deterministic and can simulate failures.',
      ],
      example: [
        { code: 'describe("calculateDiscount", () => {\n  it("rejects a percentage above 100", () => {\n    expect(() => calculateDiscount(500, 150)).toThrow("between 0 and 100");\n  });\n});', lang: 'js' },
      ],
      task: [
        'Write `function runTests({ isValidEmail, formatPrice, calculateDiscount })` containing your `describe`/`it` tests. The grader runs it once against the correct functions (every test must pass) and once against each of nine buggy versions (at least one test must fail for each).',
        { list: ['`isValidEmail(email)`: a non-empty part without spaces or `@`, then `@`, then a domain with a dot.', '`formatPrice(amount)`: `"₹"` + Indian digit grouping, e.g. `150000` → `"₹1,50,000"`.', '`calculateDiscount(price, percent)`: the price after the discount; throws a `RangeError("percent must be between 0 and 100")` outside 0–100 (both ends allowed).', 'Write at least 8 tests.'] },
      ],
      starter: `function runTests({ isValidEmail, formatPrice, calculateDiscount }) {
  describe("isValidEmail", () => {
    it("accepts a valid email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
    });
  });

  describe("formatPrice", () => {
    it("formats a price", () => {
      expect(formatPrice(1200)).toBe("₹1,200");
    });
  });
}
`,
      solution: `function runTests({ isValidEmail, formatPrice, calculateDiscount }) {
  describe("isValidEmail", () => {
    it("accepts a valid email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
    });
    it("rejects a string with no @", () => {
      expect(isValidEmail("not-an-email")).toBe(false);
    });
    it("rejects a missing name before @", () => {
      expect(isValidEmail("@example.com")).toBe(false);
    });
    it("rejects a domain without a dot", () => {
      expect(isValidEmail("user@domain")).toBe(false);
    });
    it("rejects spaces", () => {
      expect(isValidEmail("ammaar khatri@example.com")).toBe(false);
    });
  });

  describe("formatPrice", () => {
    it("adds the rupee symbol and a thousands separator", () => {
      expect(formatPrice(1200)).toBe("₹1,200");
    });
    it("uses Indian lakh grouping", () => {
      expect(formatPrice(150000)).toBe("₹1,50,000");
    });
  });

  describe("calculateDiscount", () => {
    it("returns the price after the discount", () => {
      expect(calculateDiscount(1000, 10)).toBe(900);
    });
    it("allows 0%", () => {
      expect(calculateDiscount(500, 0)).toBe(500);
    });
    it("allows 100%", () => {
      expect(calculateDiscount(500, 100)).toBe(0);
    });
    it("rejects more than 100%", () => {
      expect(() => calculateDiscount(500, 150)).toThrow("between 0 and 100");
    });
    it("rejects negative percentages", () => {
      expect(() => calculateDiscount(500, -5)).toThrow();
    });
  });
}
`,
      checks: [
        { label: 'all tests pass on correct code', expr: '__run(__impls.correct).filter((r) => !r.pass).map((r) => r.name + ": " + r.error)', expect: [], mistake: 'Every test must pass against the correct functions; a failing test here is a wrong expectation.' },
        { label: 'at least 8 tests', expr: '__run(__impls.correct).length >= 8', expect: true, mistake: 'Write at least 8 it(...) cases inside runTests.' },
        { label: 'tests are grouped and named', expr: '__run(__impls.correct).every((r) => r.name.includes(" > ") && r.name.split(" > ").pop().trim().length > 3)', expect: true, mistake: 'Put each it() inside a describe() and describe what it checks.' },
        { label: 'email bugs are caught', expr: '__survivors(["emailAtOnly", "emailAllowsSpaces", "emailAlwaysTrue"])', expect: [], mistake: 'Surviving bugs: emailAtOnly (only checks for @: test "@example.com" and "user@domain"), emailAllowsSpaces (test an address with a space), emailAlwaysTrue (test any invalid address).' },
        { label: 'price formatting bugs are caught', expr: '__survivors(["priceUsGrouping", "priceNoSymbol"])', expect: [], mistake: 'priceUsGrouping survives unless you test an amount of at least 1,00,000; priceNoSymbol survives unless you check the ₹ sign.' },
        { label: 'discount bugs are caught', expr: '__survivors(["discountNoValidation", "discountReturnsSaving", "discountRejects100", "discountRejects0"])', expect: [], mistake: 'Test an invalid percentage throws (discountNoValidation), the actual result (discountReturnsSaving), and both boundaries 0 and 100 being allowed (discountRejects0 / discountRejects100).' },
      ],
    },
    {
      id: 'typescript-intro',
      title: 'TypeScript: types for JavaScript and React',
      source: 'JavaScript & React course, Part 36',
      runner: 'quiz',
      teach: [
        'JavaScript checks types only when a line **runs**, so a bug on a rare path waits for a real user. **TypeScript** adds a static type system: the compiler checks the whole codebase before it runs. It is a superset: every JavaScript program is valid TypeScript, and the types are erased in the output.',
        { code: 'function add(a: number, b: number): number {\n  return a + b;\n}\nadd(2, "3");   // ❌ caught in the editor\n\nlet age = 17;          // inferred: number\nage = "seventeen";     // ❌ Type \'string\' is not assignable to type \'number\'', lang: 'ts' },
        { code: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  isAdmin?: boolean;        // optional\n}\n\ntype ID = number | string;                           // union\ntype Status = "idle" | "loading" | "success" | "error";  // literal union: typos cannot compile\n\nfunction firstElement<T>(array: T[]): T {               // generic: type in = type out\n  return array[0];\n}', lang: 'ts' },
        'Convention: `interface` for object shapes (extendable), `type` for unions and composed types. For simple objects they are nearly interchangeable.',
        { h: 'In React' },
        { code: 'interface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: "primary" | "secondary";\n}\n\nfunction Button({ label, onClick, variant = "primary" }: ButtonProps) {\n  return <button className={variant} onClick={onClick}>{label}</button>;\n}\n\nconst [user, setUser] = useState<User | null>(null);  // null alone would infer type null forever', lang: 'tsx' },
        { note: 'Types are checked at build time only. Data arriving from an API at runtime is not checked by TypeScript: validate it (or use a schema library) at the boundary.' },
      ],
      example: [
        { code: 'type Status = "idle" | "loading" | "success" | "error";\nconst [status, setStatus] = useState<Status>("idle");\nsetStatus("loadingg");   // ❌ compile error instead of a silent UI bug', lang: 'tsx' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'When does TypeScript report `add(2, "3")` where `add(a: number, b: number)`?', options: ['When the line runs', 'Before running, when the code is type-checked', 'Never; it converts "3"', 'Only in production'], answer: 1, explain: 'Static checking happens in the editor and at build time.' },
        { q: 'What is the type of `x`?', code: 'let x = [1, 2, 3].map((n) => String(n));', lang: 'ts', options: ['number[]', 'string[]', 'any', '(string | number)[]'], answer: 1, explain: 'Inference follows map\'s callback return type.' },
        { q: 'Which object satisfies `interface User { id: number; name: string; isAdmin?: boolean }`?', options: ['{ id: "1", name: "A" }', '{ id: 1 }', '{ id: 1, name: "A" }', '{ name: "A", isAdmin: true }'], answer: 2, explain: 'isAdmin is optional; id must be a number and name is required.' },
        { q: 'Why write `useState<User | null>(null)`?', options: ['It is faster', 'From null alone TypeScript infers the type null, so setUser(user) would be an error', 'React requires generics', 'To allow undefined'], answer: 1, explain: 'The explicit union states every value the state will ever hold.' },
        { q: 'What does this generic return for `firstElement(["a", "b"])`?', code: 'function firstElement<T>(array: T[]): T {\n  return array[0];\n}', lang: 'ts', options: ['any', 'unknown', 'string', 'T[]'], answer: 2, explain: 'T is inferred as string from the argument.' },
        { q: 'Why is `type Status = "idle" | "loading" | "error"` better than `string`?', options: ['It uses less memory', 'Only those exact values compile, so typos are caught', 'It is required by React', 'It runs faster'], answer: 1, explain: 'A literal union turns invalid states into compile errors.' },
        { q: 'An API returns JSON typed as `User` in your code. Is it guaranteed to match at runtime?', options: ['Yes, TypeScript checks responses', 'No: types are erased; validate data at the boundary', 'Only with strict mode', 'Only for GET requests'], answer: 1, explain: 'TypeScript cannot see what the server actually sends.' },
      ],
    },
    {
      id: 'security-production',
      title: 'Security and production checklist',
      source: 'JavaScript & React course, Parts 34.2–34.6, 37',
      runner: 'quiz',
      teach: [
        { h: 'Secrets and tokens' },
        { list: ['Never ship a secret key in frontend code. `VITE_`-prefixed variables are **embedded in the bundle** at build time and readable by every visitor; they are for non-secret config like `VITE_API_URL`. Secrets live on a server.', 'Auth tokens: `localStorage` is simple but readable by any script, so one XSS bug leaks the token. An `HttpOnly` cookie is invisible to JavaScript but sent automatically, which brings **CSRF** (mitigated with SameSite cookies and CSRF tokens). It is a trade-off, not a single right answer.', '**CORS** protects users\' browsers from other sites; it does not protect your API from curl or scripts. Use real authentication and authorization on the server.', '**HTTPS** encrypts traffic so it cannot be read or modified on the way (public Wi-Fi, ISPs). Every production site needs it.', 'Frontend validation is for UX only; the server must validate everything again.'] },
        { h: 'Shipping' },
        { list: ['`npm run build` creates a minified, optimised `dist/` without development checks (StrictMode double rendering, dev warnings).', '`.env.development` / `.env.production` with `import.meta.env.VITE_API_URL`; set them **before** building, because they are baked in.', '**SPA fallback**: a direct visit to `/products/42` hits the server first; configure it to serve `index.html` for unknown paths so the router can take over.', 'The service layer reads the base URL from the environment, never a hard-coded string.', '**Source maps** map minified stack traces back to your source.', 'An error-tracking service reports real users\' crashes (including those caught by error boundaries).', 'Frontend and backend deploy separately; `VITE_API_URL` connects them.'] },
      ],
      example: [
        { code: '# .env.production\nVITE_API_URL=https://api.toyshop.in\n\n// services/apiClient.js\nconst BASE_URL = import.meta.env.VITE_API_URL;', lang: 'js' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'You put `VITE_STRIPE_SECRET=sk_live_…` in `.env`. What happens?', options: ['Vite encrypts it', 'It is embedded in the JavaScript bundle and anyone can read it', 'It stays on the build machine', 'Only admins can see it'], answer: 1, explain: 'Frontend env variables are configuration, never secrets.' },
        { q: 'The main risk of keeping a token in localStorage is…', options: ['It expires on reload', 'Any injected script (XSS) can read and steal it', 'CSRF', 'It is sent with every request'], answer: 1, explain: 'HttpOnly cookies avoid this but bring CSRF instead.' },
        { q: 'Your API returns CORS headers allowing only your domain. Is the API protected from a Python script?', options: ['Yes', 'No: CORS is enforced by browsers only; the API needs authentication', 'Only over HTTPS', 'Only for POST'], answer: 1, explain: 'Non-browser clients ignore CORS.' },
        { q: 'Why validate a form on the server if the frontend already does?', options: ['Browsers are slow', 'Anyone can send requests straight to the API, skipping the frontend', 'To show nicer errors', 'It is not needed'], answer: 1, explain: 'Client checks are UX; server checks are security and data integrity.' },
        { q: 'You changed `VITE_API_URL` on the host after deploying. The app still calls the old URL because…', options: ['Caching', 'The value was baked into the bundle at build time; rebuild', 'Vite ignores env files', 'The router caches it'], answer: 1, explain: 'Build-time variables need a new build.' },
        { q: 'Refreshing `/orders/7` on the deployed SPA shows the host\'s 404 page. Fix:', options: ['Add a 404 route in React', 'Configure the host to serve index.html for unknown paths', 'Use more Links', 'Disable source maps'], answer: 1, explain: 'The server answers before React runs; it must fall back to index.html.' },
        { q: 'What do source maps give you?', options: ['Smaller bundles', 'Readable stack traces for minified production code', 'Faster builds', 'Type checking'], answer: 1, explain: 'They map minified positions back to your original source.' },
        { q: 'Which statement about `dangerouslySetInnerHTML` is right?', options: ['React sanitizes it', 'Only use it with trusted or sanitized HTML', 'It is safe with HTTPS', 'It only works on div'], answer: 1, explain: 'It bypasses JSX escaping completely.' },
      ],
    },
  ],
};
