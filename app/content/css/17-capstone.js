// HTML & CSS course, Part 54: the Nestwell catalogue capstone. One page
// (the fixture), one stylesheet built across four stage lessons: each
// stage's starter is the stylesheet so far.
const img = (fill) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23${fill}'/%3E%3C/svg%3E`;
const PRODUCTS = [
  ['d6c7a1', 'Woven cotton table runner in natural beige', 'Woven Table Runner', '₹1,099', '₹1,499', true],
  ['b45309', 'Terracotta planter with drainage tray', 'Terracotta Planter', '₹649', null, false],
  ['fde68a', 'Brass table lamp with a linen shade', 'Brass Table Lamp', '₹3,299', null, false],
  ['94a3b8', 'Set of four stoneware mugs in slate grey', 'Stoneware Mug Set', '₹1,199', '₹1,599', true],
  ['a7f3d0', 'Hand-block printed cushion cover in mint', 'Block-print Cushion Cover', '₹549', null, false],
  ['e5e7eb', 'Stackable cane storage baskets, set of two', 'Cane Storage Baskets', '₹1,899', null, false],
];

const PAGE = `<a href="#main-content" class="skip-link">Skip to main content</a>
<header class="site-header">
  <div class="site-header__inner">
    <a href="/" class="site-header__logo">Nestwell</a>
    <nav class="site-header__nav" aria-label="Primary">
      <a href="/shop" aria-current="page">Shop</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
    <form class="site-header__search" role="search">
      <label class="visually-hidden" for="site-search">Search products</label>
      <input type="search" id="site-search" placeholder="Search products…">
    </form>
    <a href="/cart" class="site-header__cart" aria-label="Cart, 3 items"><span aria-hidden="true">🛒</span><span class="site-header__cart-count" aria-hidden="true">3</span></a>
  </div>
</header>
<main id="main-content">
  <div class="page-container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <span>Shop All</span></nav>
    <h1 class="page-title">Shop All</h1>
    <div class="catalogue-layout">
      <aside class="filters" aria-labelledby="filters-heading">
        <h2 id="filters-heading" class="filters__heading">Filters</h2>
        <div class="filter-group"><h3 class="filter-group__title">Category</h3>
          <label class="filter-group__option"><input type="checkbox"> Kitchen</label>
          <label class="filter-group__option"><input type="checkbox"> Lighting</label>
          <label class="filter-group__option"><input type="checkbox"> Textiles</label>
        </div>
        <div class="filter-group"><h3 class="filter-group__title">Price</h3>
          <label class="filter-group__option"><input type="radio" name="price"> Under ₹1,000</label>
          <label class="filter-group__option"><input type="radio" name="price"> ₹1,000–₹3,000</label>
        </div>
        <div class="filter-group"><h3 class="filter-group__title">Availability</h3>
          <label class="filter-group__option"><input type="checkbox"> In stock only</label>
        </div>
        <button type="button" class="filters__clear">Clear all filters</button>
      </aside>
      <div class="catalogue-main">
        <div class="toolbar">
          <p class="toolbar__count">Showing 1–6 of 48 results</p>
          <label class="toolbar__sort">Sort by <select><option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option></select></label>
        </div>
        <ul class="product-grid">
${PRODUCTS.map(([fill, alt, name, price, was, sale], i) => `          <li><article class="product-card">
            <a href="/p/${i + 1}" class="product-card__media-link" tabindex="-1" aria-hidden="true"><div class="product-card__media">${sale ? '<span class="product-card__badge">Sale</span>' : ''}<img src="${img(fill)}" alt="${alt}" width="400" height="400"${i > 2 ? ' loading="lazy"' : ''}></div></a>
            <div class="product-card__body">
              <h3 class="product-card__title"><a href="/p/${i + 1}">${name}</a></h3>
              <p class="product-card__price">${was ? `<span class="product-card__price-original"><span class="visually-hidden">Was </span>${was}</span> <span class="visually-hidden">now </span>` : ''}${price}</p>
              <button type="button" class="product-card__add">Add to cart</button>
            </div>
          </article></li>`).join('\n')}
        </ul>
        <nav class="pagination" aria-label="Pagination">
          <a href="?page=2" class="pagination__link" aria-label="Next page">»</a>
          <a href="?page=1" class="pagination__link pagination__link--current" aria-current="page">1</a>
          <a href="?page=2" class="pagination__link">2</a>
          <a href="?page=3" class="pagination__link">3</a>
        </nav>
      </div>
    </div>
  </div>
</main>
<footer class="site-footer">
  <div class="page-container site-footer__inner">
    <p>© 2026 Nestwell Home</p>
    <nav aria-label="Footer"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav>
  </div>
</footer>`;

const TOKENS = `/* Stage 3: design tokens */
:root {
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-muted: #6b6b6b;
  --color-border: #e3e3e3;
  --color-accent: #3454d1;
  --color-accent-dark: #253a94;
  --color-danger: #d1345a;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-full: 999px;
  --font-family-base: system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-size-sm: 0.85rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.75rem;
  --shadow-md: 0 4px 16px rgb(0 0 0 / 10%);
  --content-max-width: 1200px;
  --sidebar-width: 240px;
}
`;

const BASE = `
/* Stage 4: base and reset */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg);
}
img, picture, svg { display: block; max-width: 100%; }
h1, h2, h3, p { margin: 0; }
a { color: inherit; }
button, input, select { font: inherit; color: inherit; }
ul, ol { margin: 0; padding: 0; list-style: none; }
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.skip-link {
  position: absolute;
  top: 0;
  left: -9999px;
  z-index: 100;
  padding: var(--space-3) var(--space-4);
  background: var(--color-accent);
  color: white;
}
.skip-link:focus { left: 0; }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;

const HEADER = `
/* Stage 5: header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  max-width: var(--content-max-width);
  margin-inline: auto;
  padding: var(--space-4) var(--space-5);
}
.site-header__logo { margin-right: auto; font-size: var(--font-size-lg); font-weight: 800; text-decoration: none; }
.site-header__nav { display: flex; gap: var(--space-5); }
.site-header__nav a { color: var(--color-muted); font-size: var(--font-size-sm); text-decoration: none; }
.site-header__nav a[aria-current="page"] { color: var(--color-accent); font-weight: 600; }
.site-header__search { display: none; }
.site-header__search input { width: 220px; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-full); }
.site-header__cart { position: relative; font-size: var(--font-size-lg); text-decoration: none; }
.site-header__cart-count {
  position: absolute;
  top: -6px;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
}
@media (min-width: 640px) {
  .site-header__inner { gap: var(--space-6); }
  .site-header__search { display: block; }
}
`;

const LAYOUT = `
/* Stage 6: page shell */
.page-container {
  max-width: var(--content-max-width);
  margin-inline: auto;
  padding: var(--space-6) var(--space-5) var(--space-12);
}
.breadcrumb { margin-bottom: var(--space-3); color: var(--color-muted); font-size: var(--font-size-sm); }
.page-title { margin-bottom: var(--space-6); font-size: var(--font-size-xl); }
.catalogue-layout { display: grid; gap: var(--space-8); align-items: start; }
@media (min-width: 900px) {
  .catalogue-layout { grid-template-columns: var(--sidebar-width) 1fr; }
}

/* Stage 7: filters */
.filters { padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
.filters__heading { margin-bottom: var(--space-5); font-size: var(--font-size-base); }
.filter-group { margin-bottom: var(--space-6); padding-bottom: var(--space-5); border-bottom: 1px solid var(--color-border); }
.filter-group:last-of-type { border-bottom: none; }
.filter-group__title { margin-bottom: var(--space-3); color: var(--color-muted); font-size: 0.78rem; letter-spacing: 0.04em; text-transform: uppercase; }
.filter-group__option { display: flex; align-items: center; gap: var(--space-2); padding-block: var(--space-1); font-size: var(--font-size-sm); cursor: pointer; }
.filters__clear { width: 100%; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: none; color: var(--color-muted); font-size: var(--font-size-sm); cursor: pointer; }
.filters__clear:hover { border-color: var(--color-accent); color: var(--color-accent); }
@media (min-width: 900px) {
  .filters { padding: 0; border: 0; }
}

/* Stage 8: toolbar */
.toolbar { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-3); margin-bottom: var(--space-5); }
.toolbar__count { color: var(--color-muted); font-size: var(--font-size-sm); }
.toolbar__sort { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); font-weight: 600; }
.toolbar__sort select { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-sm); }
@media (min-width: 420px) {
  .toolbar { flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-items: center; }
}
`;

const PRODUCT_CSS = `
/* Stage 9: product grid and card */
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-3); }
@media (min-width: 480px) {
  .product-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-5); }
}
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.product-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
@media (prefers-reduced-motion: reduce) {
  .product-card { transition: none; }
  .product-card:hover { transform: none; }
}
.product-card__media { position: relative; aspect-ratio: 1; }
.product-card__media img { width: 100%; height: 100%; object-fit: cover; }
.product-card__badge {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  background: var(--color-danger);
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
}
.product-card__body { display: flex; flex-direction: column; flex: 1; padding: var(--space-4); }
.product-card__title { margin-bottom: var(--space-2); font-size: var(--font-size-sm); }
.product-card__title a { text-decoration: none; }
.product-card__price { margin-bottom: var(--space-3); font-weight: 700; }
.product-card__price-original { margin-right: var(--space-1); color: var(--color-muted); font-size: 0.9em; font-weight: 400; text-decoration: line-through; }
.product-card__add {
  margin-top: auto;
  padding: var(--space-3);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-text);
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.product-card__add:hover { background: var(--color-accent-dark); }

/* Stage 10: pagination and footer */
.pagination { display: flex; justify-content: center; gap: var(--space-2); margin-top: var(--space-8); }
.pagination__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  text-decoration: none;
}
.pagination__link:hover { background: var(--color-border); }
.pagination__link--current { background: var(--color-text); color: white; }
.site-footer { border-top: 1px solid var(--color-border); }
.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding-block: var(--space-6);
  color: var(--color-muted);
  font-size: var(--font-size-sm);
}
.site-footer__inner nav { display: flex; gap: var(--space-4); }
`;

const POLISH = `
/* Stage 12: interaction states */
.product-card__add:active { transform: scale(0.98); }
@media (prefers-reduced-motion: reduce) {
  .product-card__add:active { transform: none; }
}
.site-header__search input:focus-visible { outline-offset: 1px; border-color: transparent; }

/* Stage 14: dark mode, with tokens for strong surfaces */
:root {
  color-scheme: light dark;
  --color-strong: #1a1a1a;
  --color-on-strong: #ffffff;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --color-bg: #14141c;
  --color-surface: #1e1e2a;
  --color-text: #f0f0f5;
  --color-muted: #9797a8;
  --color-border: #33333f;
  --color-accent: #6c85e6;
  --color-accent-dark: #8fa3ee;
  --color-strong: #f0f0f5;
  --color-on-strong: #14141c;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #14141c;
    --color-surface: #1e1e2a;
    --color-text: #f0f0f5;
    --color-muted: #9797a8;
    --color-border: #33333f;
    --color-accent: #6c85e6;
    --color-accent-dark: #8fa3ee;
    --color-strong: #f0f0f5;
    --color-on-strong: #14141c;
  }
}
.product-card__add,
.pagination__link--current { background: var(--color-strong); color: var(--color-on-strong); }
.product-card__add:hover { background: var(--color-accent); color: white; }
`;

const FOUNDATION = TOKENS + BASE + HEADER;
const THROUGH_LAYOUT = FOUNDATION + LAYOUT;
const THROUGH_PRODUCTS = THROUGH_LAYOUT + PRODUCT_CSS;
const ALL = THROUGH_PRODUCTS + POLISH;

const learner = 'style[data-source="learner"]';

export default {
  id: 'css-capstone',
  title: 'Capstone: the Nestwell catalogue',
  lessons: [
    {
      id: 'css-capstone-plan',
      title: 'Requirements and structure first',
      source: 'HTML & CSS course, Part 54, Stages 1–2',
      runner: 'quiz',
      teach: [
        '**Nestwell**, a home-goods catalogue page, built as one evolving stylesheet across the next four lessons. The brief:',
        { ol: ['Header: logo, primary nav, search, cart with an item-count badge.', 'Breadcrumb and page title.', 'Filter sidebar: category, price range, availability.', 'Toolbar: result count and sort.', 'A responsive product grid of cards.', 'Pagination and footer.', 'Usable from a 360px phone to a 1440px desktop.', 'Accessible: landmarks, labels, focus states, contrast.', 'Every visual value from design tokens.', 'BEM naming, organised by component.'] },
        'Filtering, sorting and the cart need JavaScript; here the markup is built ready for it. The page HTML is given (it is Stage 2\'s structure, finished): **structure before styling**, so landmarks, heading levels and list semantics are decided before anything is coloured.',
        { h: 'Structure decisions worth defending' },
        { list: ['`<header>`, `<main id="main-content">`, `<aside>` for filters, `<footer>`: landmarks screen-reader users jump between.', 'Headings `h1` (page) → `h2` (Filters) → `h3` (filter groups and product names): a correct outline.', 'Products are a `<ul>` of `<li><article>`: a screen reader announces "list, 6 items". A reset can remove the bullets (`list-style: none`) without removing that.', 'Each card has two links to the same product (image and title). The image link is `tabindex="-1" aria-hidden="true"`, so keyboard and screen-reader users meet each product once.', 'The struck-through price has visually hidden "Was … now" text, because strikethrough is not announced.', 'Images carry `width`/`height` (no layout shift) and below-the-fold ones `loading="lazy"` (Stage 13).'] },
      ],
      example: [
        { code: '<a href="/p/1" class="product-card__media-link" tabindex="-1" aria-hidden="true">…image…</a>\n<h3 class="product-card__title"><a href="/p/1">Woven Table Runner</a></h3>', lang: 'html' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Why build the semantic HTML before any styling?', options: ['Browsers require it', 'Landmarks, heading levels and list semantics are structural decisions that are hard to retrofit after the visuals exist', 'CSS cannot style unstructured HTML', 'It loads faster'], answer: 1, explain: 'A late "accessibility pass" usually means rewriting markup the CSS depends on.' },
        { q: 'The product grid resets `list-style: none`. Is the `<ul>` still worth keeping?', options: ['No, use divs', 'Yes: screen readers still announce a list and its item count', 'Only for SEO', 'Only if bullets show'], answer: 1, explain: 'Removing markers changes the look, not the semantics.' },
        { q: 'Each card links to the product from both the image and the title. What does the course\'s final markup do to avoid two identical tab stops?', options: ['Removes the title link', 'Gives the image link tabindex="-1" and aria-hidden="true"', 'Uses a button for the image', 'Nothing; duplicates are fine'], answer: 1, explain: 'Mouse users can still click the image; keyboard and screen-reader users get one link per product.' },
        { q: 'Which heading level should each filter group title use, under the "Filters" h2?', options: ['h1', 'h2', 'h3', 'A bold div'], answer: 2, explain: 'h1 page → h2 region → h3 groups.' },
        { q: 'Why does the strikethrough price include visually hidden "Was" and "now" text?', options: ['For SEO', 'Screen readers do not announce strikethrough, so two prices would be ambiguous', 'To make the price longer', 'It is required by HTML'], answer: 1, explain: 'Visual meaning needs a text equivalent.' },
        { q: 'Colour tokens are named `--color-accent`, not `--color-blue`. Why?', options: ['Shorter', 'Role names survive a rebrand or a dark theme; colour names become lies', 'Browsers prefer it', 'No reason'], answer: 1, explain: 'Stage 14 swaps every value without renaming anything.' },
      ],
    },
    {
      id: 'css-capstone-foundation',
      title: 'Capstone 1: tokens, base styles and the header',
      source: 'HTML & CSS course, Part 54, Stages 3–5',
      runner: 'page',
      slot: 'css',
      fixture: { html: PAGE, css: '' },
      teach: [
        'Three layers, in this order (ITCSS, Part 35): **tokens** (no output), **base/reset**, then the first **component**.',
        { h: 'Stage 3: tokens' },
        'Only global primitives: role-named colours, a 4px-based spacing scale, radii, a type scale, a shadow, and two layout values (`--content-max-width: 1200px`, `--sidebar-width: 240px`). Component-specific tokens are added later only if a component needs them.',
        { h: 'Stage 4: base' },
        { list: ['The Part 36 reset, with body text from the tokens and `line-height: 1.6`.', 'A `.visually-hidden` utility (the search label, the hidden price text). Use `clip-path: inset(50%)`; the older `clip: rect(0 0 0 0)` in the course is deprecated.', 'A skip link, off-screen until focused, as the very first focusable element.', 'A global `:focus-visible` ring in the accent colour.'] },
        { h: 'Stage 5: header' },
        { list: ['Sticky, with the surface colour (opaque) and a bottom border.', 'An inner flex row capped at the content width and centred; the logo\'s `margin-right: auto` pushes everything else right.', 'The current nav link (`aria-current="page"`) in the accent colour.', 'The cart badge: absolutely positioned on the cart link\'s top-right corner. The link\'s `aria-label="Cart, 3 items"` carries the count for screen readers, so the visual badge is `aria-hidden`.', 'Mobile-first: on phones the search field is hidden; from 640px it shows. (The course hides it with a `max-width` query in a later "responsive pass"; keeping each component\'s responsive rules next to the component, mobile-first, is what the course\'s own Stage 15 recommends.)'] },
      ],
      example: [
        { code: '.site-header__inner {\n  display: flex;\n  align-items: center;\n  gap: var(--space-4);\n  max-width: var(--content-max-width);\n  margin-inline: auto;\n}\n.site-header__logo { margin-right: auto; }', lang: 'css' },
      ],
      task: [
        'Write the stylesheet for Stages 3–5 (the page HTML is given):',
        { ol: ['The token block on `:root` with exactly these values: colours `--color-bg #fafafa`, `--color-surface #ffffff`, `--color-text #1a1a1a`, `--color-muted #6b6b6b`, `--color-border #e3e3e3`, `--color-accent #3454d1`, `--color-accent-dark #253a94`, `--color-danger #d1345a`; spacing `--space-1 0.25rem`, `-2 0.5rem`, `-3 0.75rem`, `-4 1rem`, `-5 1.25rem`, `-6 1.5rem`, `-8 2rem`, `-12 3rem`; radii `--radius-sm 6px`, `--radius-md 10px`, `--radius-full 999px`; `--font-family-base` (any system stack), font sizes `--font-size-sm 0.85rem`, `-base 1rem`, `-lg 1.25rem`, `-xl 1.75rem`; `--shadow-md`; `--content-max-width 1200px`; `--sidebar-width 240px`.', 'Base: border-box everywhere; body without margin, using the font, size, text and background tokens with `line-height: 1.6`; block images; no margins on `h1`–`h3` and `p`; form controls inherit the font; lists without bullets, margin or padding.', '`.visually-hidden` (1px, clipped, still readable); `.skip-link` off-screen until `:focus`, then at the top-left; a global `:focus-visible` outline `2px solid var(--color-accent)` with `2px` offset.', 'Header: sticky at the top, `z-index: 20`, surface background, `1px` bottom border; `.site-header__inner` a centred flex row capped at the content width with `--space-5` side padding; the logo pushes the rest right; current nav link accent and 600; cart badge on the cart\'s top-right corner as an accent pill with white text.', 'Search hidden on phones, shown from 640px with a `220px` input. No horizontal scrolling at 360px.'] },
      ],
      starter: '/* Stage 3: design tokens */\n:root {\n\n}\n\n/* Stage 4: base and reset */\n\n/* Stage 5: header */\n',
      solution: FOUNDATION,
      checks: [
        { label: 'token block', mistake: 'Every listed token on :root, with the exact values.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const want = { '--color-bg': '#fafafa', '--color-surface': '#ffffff', '--color-text': '#1a1a1a', '--color-muted': '#6b6b6b', '--color-border': '#e3e3e3', '--color-accent': '#3454d1', '--color-accent-dark': '#253a94', '--color-danger': '#d1345a', '--space-1': '0.25rem', '--space-2': '0.5rem', '--space-3': '0.75rem', '--space-4': '1rem', '--space-5': '1.25rem', '--space-6': '1.5rem', '--space-8': '2rem', '--space-12': '3rem', '--radius-sm': '6px', '--radius-md': '10px', '--radius-full': '999px', '--font-size-sm': '0.85rem', '--font-size-base': '1rem', '--font-size-lg': '1.25rem', '--font-size-xl': '1.75rem', '--content-max-width': '1200px', '--sidebar-width': '240px' }; const wrong = Object.keys(want).filter((k) => h.customProperty(sheet, ':root', k).toLowerCase() !== want[k]); if (!h.customProperty(sheet, ':root', '--font-family-base')) wrong.push('--font-family-base'); if (!h.customProperty(sheet, ':root', '--shadow-md')) wrong.push('--shadow-md'); return wrong.length === 0 || `missing or different: ${wrong.join(', ')}`; } },
        { label: 'base layer', mistake: 'Border-box; body margin 0 with the font/size/text/bg tokens and line-height 1.6; block images; no heading/paragraph margins; inherited fonts on controls; bare lists.', check: ({ document, $, h }) => { const b = getComputedStyle(document.body); const ok = getComputedStyle($('.page-title')).boxSizing === 'border-box' && b.marginTop === '0px' && h.sameValue('background-color', b.backgroundColor, '#fafafa') && h.sameValue('color', b.color, '#1a1a1a') && b.lineHeight === '25.6px' && /system-ui/.test(b.fontFamily) && getComputedStyle($('img')).display === 'block' && getComputedStyle($('.page-title')).marginTop === '0px' && getComputedStyle($('.toolbar__count')).marginBottom === '0px' && getComputedStyle($('select')).fontFamily === b.fontFamily && getComputedStyle($('.product-grid')).listStyleType === 'none' && getComputedStyle($('.product-grid')).paddingLeft === '0px'; return ok || 'one of the base rules is missing: check body, images, heading/paragraph margins, form fonts and lists'; } },
        { label: 'hidden text and skip link', mistake: '.visually-hidden clipped to 1px but not display: none; .skip-link off-screen until :focus, then left: 0.', check: async ({ $, rect, settle }) => { const label = rect('label[for="site-search"]'); const hiddenOk = label.width <= 1 && getComputedStyle($('label[for="site-search"]')).display !== 'none'; const skip = $('.skip-link'); const away = rect(skip).right <= 0; skip.focus(); await settle(); const r = rect(skip); const shown = Math.round(r.left) === 0 && Math.round(r.top) === 0; skip.blur(); await settle(); return (hiddenOk && away && shown) || `visually hidden label ok: ${hiddenOk}; skip link off-screen: ${away}; visible on focus: ${shown}`; } },
        { label: 'sticky, capped header', mistake: '.site-header sticky top 0, z-index 20, surface background, 1px bottom border; .site-header__inner flex, centred, max-width var(--content-max-width), side padding var(--space-5); logo margin-right: auto.', check: async ({ $, atWidth }) => { const v = await atWidth(1440); const s = getComputedStyle($('.site-header')); const inner = v.rect('.site-header__inner'); const logo = v.rect('.site-header__logo'); const cart = v.rect('.site-header__cart'); const ok = s.position === 'sticky' && s.top === '0px' && s.zIndex === '20' && s.borderBottomWidth === '1px' && s.backgroundColor === 'rgb(255, 255, 255)' && getComputedStyle($('.site-header__inner')).display === 'flex' && Math.round(inner.width) === 1200 && Math.round(inner.left) === Math.round((v.width - 1200) / 2) && Math.round(logo.left - inner.left) === 20 && Math.round(inner.right - cart.right) >= 20 && Math.round(inner.right - cart.right) <= 30; return ok || `header ${s.position} z ${s.zIndex}; inner ${Math.round(inner.width)}px at x=${Math.round(inner.left)}; logo inset ${Math.round(logo.left - inner.left)}px`; } },
        { label: 'nav state and cart badge', mistake: 'a[aria-current="page"] accent + 600; .site-header__cart position relative; badge absolute on its top-right corner, accent pill (radius-full), white text.', check: ({ $, rect, h }) => { const cur = getComputedStyle($('.site-header__nav a[aria-current="page"]')); const badge = $('.site-header__cart-count'); const bs = getComputedStyle(badge); const cart = rect('.site-header__cart'); const b = rect(badge); const ok = h.sameValue('color', cur.color, '#3454d1') && cur.fontWeight === '600' && getComputedStyle($('.site-header__cart')).position === 'relative' && bs.position === 'absolute' && b.top < cart.top && b.right > cart.right && h.sameValue('background-color', bs.backgroundColor, '#3454d1') && bs.color === 'rgb(255, 255, 255)' && parseFloat(bs.borderTopLeftRadius) >= 999; return ok || `current link ${cur.color} ${cur.fontWeight}; badge ${bs.position}, background ${bs.backgroundColor}`; } },
        { label: 'mobile-first search', mistake: 'Search hidden by default, shown from 640px with a 220px input; nothing wider than 360px.', check: async ({ atWidth }) => { const phone = await atWidth(360); const hidden = phone.style('.site-header__search', 'display') === 'none'; const fits = phone.doc.documentElement.scrollWidth <= phone.doc.documentElement.clientWidth; const wide = await atWidth(1024); const shown = wide.style('.site-header__search', 'display') !== 'none' && Math.round(wide.rect('#site-search').width) === 220; return (hidden && fits && shown) || `360px: search hidden ${hidden}, fits ${fits}; 1024px: 220px search shown ${shown}`; } },
      ],
    },
    {
      id: 'css-capstone-layout',
      title: 'Capstone 2: page shell, filters and toolbar',
      source: 'HTML & CSS course, Part 54, Stages 6–8',
      runner: 'page',
      slot: 'css',
      fixture: { html: PAGE, css: '' },
      teach: [
        { h: 'Stage 6: the shell' },
        'A centred `.page-container` (max width from the token, `--space-6`/`--space-5`/`--space-12` padding), muted small breadcrumb, `--font-size-xl` title. The catalogue is a two-dimensional "sidebar + main" relationship, so **Grid**: one column on phones; from 900px `var(--sidebar-width) 1fr` with a `--space-8` gap and `align-items: start`, so the sidebar does not stretch to the grid\'s height.',
        { h: 'Stage 7: filters' },
        { list: ['Groups separated by spacing and a bottom border; `.filter-group:last-of-type` drops the last border (`:last-of-type` counts elements of the same **tag**, here the last `<div>` in the aside).', 'Uppercase, letter-spaced, muted group titles at `0.78rem`.', 'Each option a flex row (control + text) with the whole label clickable.', 'On phones the filters sit above the products, so they get a bordered card; from 900px the border and padding go.'] },
        { h: 'Stage 8: toolbar' },
        'Two items at opposite ends of one row: a one-dimensional job, so **Flexbox** with `space-between`. On the narrowest phones the two stack; from 420px they sit in a row.',
      ],
      example: [
        { code: '.catalogue-layout { display: grid; gap: var(--space-8); align-items: start; }\n@media (min-width: 900px) {\n  .catalogue-layout { grid-template-columns: var(--sidebar-width) 1fr; }\n}', lang: 'css' },
      ],
      task: [
        'Your Stage 3–5 stylesheet is in the editor. Add Stages 6–8:',
        { ol: ['`.page-container`: max width from the token, centred, padding `var(--space-6) var(--space-5) var(--space-12)`. `.breadcrumb`: muted, small, `--space-3` below. `.page-title`: `--font-size-xl`, `--space-6` below.', '`.catalogue-layout`: a grid, `--space-8` gap, items aligned to the start; one column below 900px, `var(--sidebar-width) 1fr` from 900px.', '`.filters`: a bordered card (`--space-5` padding, `--radius-md`) on small screens, no border or padding from 900px. `.filter-group`: `--space-6` margin and `--space-5` padding below, a bottom border except the last group. `.filter-group__title`: muted, `0.78rem`, uppercase, `0.04em` spacing. `.filter-group__option`: flex, centred, `--space-2` gap. `.filters__clear`: full width.', '`.toolbar`: a column below 420px; from 420px a row with the count and sort at opposite ends, vertically centred. `.toolbar__count` muted and small; `.toolbar__sort` a flex row with `--space-2` gap; the select gets a border and `--radius-sm`.'] },
      ],
      starter: FOUNDATION,
      solution: THROUGH_LAYOUT,
      checks: [
        { label: 'page container and title area', mistake: '.page-container { max-width: var(--content-max-width); margin-inline: auto; padding: var(--space-6) var(--space-5) var(--space-12); } plus the breadcrumb and title styles.', check: async ({ $, atWidth, h }) => { const v = await atWidth(1440); const r = v.rect('main .page-container'); const s = getComputedStyle($('main .page-container')); const bc = getComputedStyle($('.breadcrumb')); const t = getComputedStyle($('.page-title')); const ok = Math.round(r.width) === 1200 && Math.round(r.left) === Math.round((v.width - 1200) / 2) && s.paddingTop === '24px' && s.paddingLeft === '20px' && s.paddingBottom === '48px' && h.sameValue('color', bc.color, '#6b6b6b') && bc.fontSize === '13.6px' && bc.marginBottom === '12px' && t.fontSize === '28px' && t.marginBottom === '24px'; return ok || `container ${Math.round(r.width)}px, padding ${s.paddingTop} ${s.paddingLeft} ${s.paddingBottom}; title ${t.fontSize}`; } },
        { label: 'sidebar + main from 900px', mistake: 'Grid with gap var(--space-8), align-items: start; one column below 900px, var(--sidebar-width) 1fr from 900px.', check: async ({ atWidth }) => { const wide = await atWidth(1200); const f = wide.rect('.filters'); const m = wide.rect('.catalogue-main'); const twoCol = Math.round(f.width) === 240 && Math.round(m.left - f.right) === 32 && Math.round(f.top) === Math.round(m.top) && f.height < m.height; const phone = await atWidth(375); const pf = phone.rect('.filters'); const pm = phone.rect('.catalogue-main'); const stacked = Math.round(pm.top) >= Math.round(pf.bottom) && Math.abs(pf.width - pm.width) < 1; return (twoCol && stacked) || `1200px two columns (240px sidebar, 32px gap, not stretched): ${twoCol}; 375px stacked: ${stacked}`; } },
        { label: 'filter groups', mistake: 'Group spacing and bottom borders (none on the last), uppercase muted 0.78rem titles with 0.04em spacing, flex options with a --space-2 gap, a full-width clear button.', check: ({ $, $$, rect, h }) => { const groups = $$('.filter-group').map((g) => getComputedStyle(g)); const t = getComputedStyle($('.filter-group__title')); const opt = getComputedStyle($('.filter-group__option')); const ok = groups[0].marginBottom === '24px' && groups[0].paddingBottom === '20px' && groups[0].borderBottomStyle === 'solid' && groups[2].borderBottomStyle === 'none' && t.textTransform === 'uppercase' && h.sameValue('color', t.color, '#6b6b6b') && Math.round(parseFloat(t.fontSize) * 100) === Math.round(16 * 0.78 * 100) && opt.display === 'flex' && opt.alignItems === 'center' && opt.columnGap === '8px' && Math.abs(rect('.filters__clear').width - $('.filters').clientWidth + parseFloat(getComputedStyle($('.filters')).paddingLeft) * 2) < 1; return ok || 'check the group spacing/borders, the title style, the option rows and the clear button width'; } },
        { label: 'filters card only on small screens', mistake: '.filters bordered with --space-5 padding and --radius-md below 900px; border 0 and padding 0 from 900px.', check: async ({ atWidth }) => { const phone = await atWidth(375); const p = [phone.style('.filters', 'border-top-width'), phone.style('.filters', 'padding-top'), phone.style('.filters', 'border-top-left-radius')]; const wide = await atWidth(1200); const w = [wide.style('.filters', 'border-top-width'), wide.style('.filters', 'padding-top')]; return (p.join() === '1px,20px,10px' && w.join() === '0px,0px') || `375px border/padding/radius ${p.join(' ')}; 1200px border/padding ${w.join(' ')}`; } },
        { label: 'toolbar row and phone stack', mistake: 'Column below 420px; from 420px: flex row, space-between, centred. Muted small count; sort label flex with --space-2 gap; bordered select with --radius-sm.', check: async ({ atWidth }) => { const narrow = await atWidth(400); const c1 = narrow.rect('.toolbar__count'); const s1 = narrow.rect('.toolbar__sort'); const stacked = Math.round(s1.top) >= Math.round(c1.bottom); const wide = await atWidth(1200); const bar = wide.rect('.toolbar'); const c2 = wide.rect('.toolbar__count'); const s2 = wide.rect('.toolbar__sort'); const row = Math.round(c2.left) === Math.round(bar.left) && Math.round(s2.right) === Math.round(bar.right) && Math.abs(c2.top + c2.height / 2 - (s2.top + s2.height / 2)) < 1; const sel = [wide.style('.toolbar__sort select', 'border-top-width'), wide.style('.toolbar__sort select', 'border-top-left-radius')]; return (stacked && row && wide.style('.toolbar__sort', 'column-gap') === '8px' && sel.join() === '1px,6px') || `400px stacked ${stacked}; 1200px ends of one row ${row}; select border/radius ${sel.join(' ')}`; } },
      ],
    },
    {
      id: 'css-capstone-products',
      title: 'Capstone 3: product cards, pagination and footer',
      source: 'HTML & CSS course, Part 54, Stages 9–10',
      runner: 'page',
      slot: 'css',
      fixture: { html: PAGE, css: '' },
      teach: [
        { h: 'Stage 9: grid and card' },
        { list: ['`repeat(auto-fill, minmax(…))` (the course uses `auto-fill` here, so a short last page keeps card sizes consistent). On small phones a `150px` minimum gives two columns; from 480px a `220px` minimum.', 'The card: a flex column (`height: 100%` so every card fills its grid row), surface, border, `--radius-md`, `overflow: hidden` to clip the image to the corners.', 'Square media with `aspect-ratio: 1` and a covering image; the sale badge absolutely positioned in its top-left corner.', 'The body is a flex column with `flex: 1`; the button\'s `margin-top: auto` lines all buttons up across a row (Part 24).', 'Hover lifts the card with `transform` and a shadow, both transitioned, and both removed under `prefers-reduced-motion`.'] },
        { h: 'Stage 10: pagination and footer' },
        '36px square, centred page links; the current one (`aria-current="page"`) filled. The footer: a top border, a wrapping flex row with the copyright and links at opposite ends.',
      ],
      example: [
        { code: '.product-card__body { display: flex; flex-direction: column; flex: 1; padding: var(--space-4); }\n.product-card__add { margin-top: auto; }', lang: 'css' },
      ],
      task: [
        'Add Stages 9–10:',
        { ol: ['`.product-grid`: `repeat(auto-fill, minmax(150px, 1fr))` with `--space-3` gap; from 480px `minmax(220px, 1fr)` with `--space-5` gap.', '`.product-card`: flex column, full height, `overflow: hidden`, surface background, border, `--radius-md`; `box-shadow` and `transform` transition over `0.15s ease`; on hover `--shadow-md` and `translateY(-2px)`; under reduced motion no transition and no hover transform.', '`.product-card__media`: relative, square; its image covers it. `.product-card__badge`: absolute, `--space-2` from the top-left, `--color-danger` pill, white uppercase text.', '`.product-card__body`: flex column, `flex: 1`, `--space-4` padding. Title small; price bold; `.product-card__price-original` muted and struck through. `.product-card__add`: pushed to the bottom (`margin-top: auto`), `--color-text` background, white text, `--radius-sm`.', '`.pagination`: centred flex row, `--space-2` gap, `--space-8` above. `.pagination__link`: 36 × 36px, centred content, `--radius-sm`. `.pagination__link--current`: `--color-text` background, white text.', '`.site-footer`: top border. `.site-footer__inner`: wrapping flex row, space-between, centred; its nav a flex row with `--space-4` gap.'] },
      ],
      starter: THROUGH_LAYOUT,
      solution: THROUGH_PRODUCTS,
      checks: [
        { label: 'responsive product grid', mistake: 'repeat(auto-fill, minmax(150px, 1fr)) with --space-3 gap; from 480px minmax(220px, 1fr) with --space-5.', check: async ({ atWidth }) => { const cols = (v) => { const r = v.$$('.product-grid > li').map((li) => li.getBoundingClientRect()); return r.filter((x) => Math.abs(x.top - r[0].top) < 1).length; }; const phone = await atWidth(375); const c1 = cols(phone); const g1 = phone.style('.product-grid', 'column-gap'); const wide = await atWidth(1200); const c2 = cols(wide); const g2 = wide.style('.product-grid', 'column-gap'); return (c1 === 2 && g1 === '12px' && c2 === 3 && g2 === '20px') || `375px: ${c1} columns, gap ${g1}; 1200px: ${c2} columns, gap ${g2}`; } },
        { label: 'card shell and motion', mistake: 'Flex column, height 100%, overflow hidden, surface, border, --radius-md; transition box-shadow and transform 0.15s ease; reduced-motion rules that remove both.', check: ({ document, $, h }) => { const s = getComputedStyle($('.product-card')); const rules = h.mediaRules(document.querySelector('style[data-source="learner"]').sheet, 'prefers-reduced-motion:reduce'); const calm = rules.some((r) => r.selectorText === '.product-card' && /none/.test(r.style.transitionProperty + r.style.transition)) && rules.some((r) => r.selectorText === '.product-card:hover' && r.style.transform === 'none'); const hover = [...document.querySelector('style[data-source="learner"]').sheet.cssRules].some((r) => r.selectorText === '.product-card:hover' && /translateY\(-2px\)/.test(r.style.transform)); const ok = s.display === 'flex' && s.flexDirection === 'column' && s.overflowX === 'hidden' && h.sameValue('background-color', s.backgroundColor, '#ffffff') && s.borderTopWidth === '1px' && s.borderTopLeftRadius === '10px' && s.transitionProperty === 'box-shadow, transform' && s.transitionDuration === '0.15s, 0.15s' && hover && calm; return ok || `card ${s.display} ${s.flexDirection}, radius ${s.borderTopLeftRadius}, transition "${s.transitionProperty}"; hover lift ${hover}; reduced-motion rules ${calm}`; } },
        { label: 'square media and sale badge', mistake: '.product-card__media { position: relative; aspect-ratio: 1; } img covers it; .product-card__badge absolute at --space-2, danger pill, white uppercase.', check: ({ $, rect, h }) => { const m = rect('.product-card__media'); const i = rect('.product-card__media img'); const b = rect('.product-card__badge'); const bs = getComputedStyle($('.product-card__badge')); const ok = Math.abs(m.width - m.height) < 1 && Math.abs(i.height - m.height) < 1 && getComputedStyle($('.product-card__media img')).objectFit === 'cover' && Math.round(b.left - m.left) === 8 && Math.round(b.top - m.top) === 8 && h.sameValue('background-color', bs.backgroundColor, '#d1345a') && bs.color === 'rgb(255, 255, 255)' && bs.textTransform === 'uppercase' && parseFloat(bs.borderTopLeftRadius) >= 999; return ok || `media ${Math.round(m.width)}×${Math.round(m.height)}, badge at (${Math.round(b.left - m.left)}, ${Math.round(b.top - m.top)}), ${bs.backgroundColor}`; } },
        { label: 'buttons line up across a row', mistake: '.product-card__body { display: flex; flex-direction: column; flex: 1; padding: var(--space-4); } and .product-card__add { margin-top: auto; } with the text-colour background and white text.', check: async ({ $, atWidth, h }) => { const v = await atWidth(1200); const btns = v.$$('.product-card__add').map((b) => b.getBoundingClientRect()); const firstRow = btns.filter((b) => Math.abs(b.top - btns[0].top) < 60); const aligned = firstRow.length === 3 && firstRow.every((b) => Math.abs(b.top - firstRow[0].top) < 1); const s = getComputedStyle($('.product-card__add')); const was = getComputedStyle($('.product-card__price-original')); return (aligned && h.sameValue('background-color', s.backgroundColor, '#1a1a1a') && s.color === 'rgb(255, 255, 255)' && s.borderTopLeftRadius === '6px' && was.textDecorationLine === 'line-through' && h.sameValue('color', was.color, '#6b6b6b')) || `first-row buttons aligned: ${aligned}; button ${s.backgroundColor}/${s.color}; original price ${was.textDecorationLine}`; } },
        { label: 'pagination', mistake: '.pagination centred flex, --space-2 gap, --space-8 above; links 36×36 centred, --radius-sm; current link --color-text background, white text.', check: ({ $, $$, rect, h }) => { const p = rect('.pagination'); const links = $$('.pagination__link').map((a) => rect(a)); const total = links[links.length - 1].right - links[0].left; const centred = Math.abs((links[0].left - p.left) - (p.right - links[links.length - 1].right)) < 1.5 && total < p.width; const cur = getComputedStyle($('.pagination__link--current')); const ok = centred && links.every((r) => Math.round(r.width) === 36 && Math.round(r.height) === 36) && Math.round(links[1].left - links[0].right) === 8 && getComputedStyle($('.pagination')).marginTop === '32px' && h.sameValue('background-color', cur.backgroundColor, '#1a1a1a') && cur.color === 'rgb(255, 255, 255)'; return ok || `pagination centred ${centred}; link sizes ${links.map((r) => Math.round(r.width)).join('/')}; current ${cur.backgroundColor}`; } },
        { label: 'footer', mistake: '.site-footer { border-top: 1px solid var(--color-border); } .site-footer__inner: wrapping flex row, space-between, centred; nav flex with --space-4 gap.', check: async ({ atWidth }) => { const v = await atWidth(1200); const inner = v.rect('.site-footer__inner'); const p = v.rect('.site-footer__inner p'); const nav = v.rect('.site-footer__inner nav'); const links = v.$$('.site-footer__inner nav a').map((a) => a.getBoundingClientRect()); const ok = v.style('.site-footer', 'border-top-width') === '1px' && v.style('.site-footer__inner', 'flex-wrap') === 'wrap' && Math.round(p.left - inner.left) === 20 && Math.round(inner.right - nav.right) === 20 && Math.round(links[1].left - links[0].right) === 16; return ok || `footer: border ${v.style('.site-footer', 'border-top-width')}, copyright inset ${Math.round(p.left - inner.left)}px, nav inset ${Math.round(inner.right - nav.right)}px, link gap ${Math.round(links[1].left - links[0].right)}px`; } },
      ],
    },
    {
      id: 'css-capstone-polish',
      title: 'Capstone 4: states, motion and a dark mode that works',
      source: 'HTML & CSS course, Part 54, Stages 11–14',
      runner: 'page',
      slot: 'css',
      fixture: { html: PAGE, css: '' },
      teach: [
        { h: 'Stages 11–13: responsive, interaction and performance passes' },
        { list: ['Responsive: the earlier lessons already put each component\'s mobile-first rules next to it; test at 360, 768 and 1440px.', 'Interaction: every interactive element needs hover, focus and active states. The global `:focus-visible` ring from the base layer already covers links, buttons, checkboxes and the select; the search input adds a tighter offset. A small press effect on "Add to cart" (`scale(0.98)`), removed under reduced motion.', 'Performance: the HTML lazy-loads the images after the first row and gives every image `width`/`height`, so cards never jump while loading.'] },
        { h: 'Stage 14: dark mode, and the bug in the course version' },
        'The course redefines the colour tokens for dark mode and says no component changes are needed. Check that claim against two components: "Add to cart" and the current pagination link use `background: var(--color-text); color: white`. In dark mode `--color-text` becomes `#f0f0f5`, so both become **white text on a near-white background**, a contrast ratio of about 1.1:1.',
        'The fix is the same lesson as Part 45: those components need a token for their **role**, not for "the text colour". Add `--color-strong` (the strong fill) and `--color-on-strong` (text on it), defined for both themes:',
        { code: ':root { --color-strong: #1a1a1a; --color-on-strong: #ffffff; }\n:root[data-theme="dark"] { --color-strong: #f0f0f5; --color-on-strong: #14141c; }\n.product-card__add, .pagination__link--current {\n  background: var(--color-strong);\n  color: var(--color-on-strong);\n}', lang: 'css' },
      ],
      example: [
        { code: '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) { --color-bg: #14141c; /* … */ }\n}', lang: 'css' },
      ],
      task: [
        'Add Stages 12–14:',
        { ol: ['`.product-card__add:active`: `transform: scale(0.98)`, and `none` under reduced motion. `.site-header__search input:focus-visible`: `outline-offset: 1px`.', '`:root`: `color-scheme: light dark`, plus `--color-strong: #1a1a1a` and `--color-on-strong: #ffffff`.', '`:root[data-theme="dark"]`: `color-scheme: dark` and the dark values `--color-bg #14141c`, `--color-surface #1e1e2a`, `--color-text #f0f0f5`, `--color-muted #9797a8`, `--color-border #33333f`, `--color-accent #6c85e6`, `--color-accent-dark #8fa3ee`, `--color-strong #f0f0f5`, `--color-on-strong #14141c`. The same values for `:root:not([data-theme="light"])` under `@media (prefers-color-scheme: dark)`.', '`.product-card__add` and `.pagination__link--current` use `--color-strong` / `--color-on-strong`, so both stay readable (at least 4.5:1) in both themes.'] },
      ],
      starter: THROUGH_PRODUCTS,
      solution: ALL,
      checks: [
        { label: 'press feedback, motion-safe', mistake: '.product-card__add:active { transform: scale(0.98); } and none inside @media (prefers-reduced-motion: reduce).', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const press = h.allRules(sheet, 'CSSStyleRule').some((r) => r.selectorText === '.product-card__add:active' && /scale\(0\.98\)/.test(r.style.transform)); const calm = h.mediaRules(sheet, 'prefers-reduced-motion:reduce').some((r) => r.selectorText === '.product-card__add:active' && r.style.transform === 'none'); return (press && calm) || `press scale ${press}; reduced-motion override ${calm}`; } },
        { label: 'focus ring on every control', mistake: 'The base :focus-visible ring (2px solid accent, 2px offset) must reach links, buttons, inputs and the select; the search input uses outline-offset: 1px.', check: ({ document, h }) => { const rules = h.allRules(document.querySelector('style[data-source="learner"]').sheet, 'CSSStyleRule'); const ring = rules.some((r) => r.selectorText.trim() === ':focus-visible' && /outline:\s*2px solid var\(--color-accent\)/.test(r.cssText) && /outline-offset:\s*2px/.test(r.cssText)); const search = rules.some((r) => r.selectorText.replace(/\s+/g, ' ').trim() === '.site-header__search input:focus-visible' && r.style.outlineOffset === '1px'); return (ring && search) || `global :focus-visible ring (2px solid var(--color-accent), offset 2px): ${ring}; search input offset 1px: ${search}`; } },
        { label: 'explicit dark theme', mistake: ':root[data-theme="dark"] with color-scheme: dark and the dark token values; every component follows without its own dark rules.', check: async ({ document, $, h, settle }) => { const root = document.documentElement; root.dataset.theme = 'dark'; await settle(); document.querySelectorAll('*').forEach((el) => el.getAnimations().forEach((a) => a.finish())); const ok = h.sameValue('background-color', getComputedStyle(document.body).backgroundColor, '#14141c') && h.sameValue('color', getComputedStyle(document.body).color, '#f0f0f5') && h.sameValue('background-color', getComputedStyle($('.product-card')).backgroundColor, '#1e1e2a') && h.sameValue('background-color', getComputedStyle($('.site-header')).backgroundColor, '#1e1e2a') && h.sameValue('color', getComputedStyle($('.toolbar__count')).color, '#9797a8') && getComputedStyle(root).colorScheme === 'dark'; delete root.dataset.theme; await settle(); return ok || 'with data-theme="dark", the body, cards, header or muted text do not take the dark values'; } },
        { label: 'OS preference respected', mistake: '@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { …the same nine dark tokens… } } and :root { color-scheme: light dark; }', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const rule = h.mediaRules(sheet, 'prefers-color-scheme:dark').find((r) => r.selectorText.replace(/\s|"/g, '') === ':root:not([data-theme=light])'); const want = { '--color-bg': '#14141c', '--color-surface': '#1e1e2a', '--color-text': '#f0f0f5', '--color-muted': '#9797a8', '--color-border': '#33333f', '--color-accent': '#6c85e6', '--color-accent-dark': '#8fa3ee', '--color-strong': '#f0f0f5', '--color-on-strong': '#14141c' }; const wrong = rule ? Object.keys(want).filter((k) => rule.style.getPropertyValue(k).trim().toLowerCase() !== want[k]) : ['the rule itself']; const scheme = h.allRules(sheet, 'CSSStyleRule').some((r) => r.selectorText === ':root' && r.style.colorScheme === 'light dark'); return (wrong.length === 0 && scheme) || (scheme ? `missing in the OS dark rule: ${wrong.join(', ')}` : ':root needs color-scheme: light dark'); } },
        { label: 'strong buttons readable in both themes', mistake: 'Give .product-card__add and .pagination__link--current var(--color-strong) / var(--color-on-strong): with var(--color-text) and white they become white on near-white in dark mode.', check: async ({ document, $, settle }) => { const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number); const lum = (c) => { const [r, g, b] = parse(c).map((x) => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }; const ratio = (el) => { const s = getComputedStyle(el); const [a, b] = [lum(s.color), lum(s.backgroundColor)].sort((x, y) => y - x); return (a + 0.05) / (b + 0.05); }; const els = [$('.product-card__add'), $('.pagination__link--current')]; const light = els.map(ratio); document.documentElement.dataset.theme = 'dark'; await settle(); els.forEach((el) => el.getAnimations().forEach((a) => a.finish())); const dark = els.map(ratio); delete document.documentElement.dataset.theme; await settle(); return [...light, ...dark].every((r) => r >= 4.5) || `contrast light ${light.map((r) => r.toFixed(1)).join(' / ')}, dark ${dark.map((r) => r.toFixed(1)).join(' / ')} (button / current page)`; } },
      ],
    },
  ],
};
