// HTML & CSS course, Part 53: representative projects. The learner writes
// the whole page (HTML with a <style> block); checks inspect the rendered
// page at several viewport widths.
const svg = (w, h, fill) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect width='${w}' height='${h}' fill='%23${fill}'/%3E%3C/svg%3E`;
const PHOTOS = [
  [svg(400, 250, '0ea5e9'), 'Wooden train set on a play mat', 400, 250, 'Train set'],
  [svg(300, 450, 'a78bfa'), 'Tall doll house with three floors', 300, 450, 'Doll house'],
  [svg(300, 300, 'f59e0b'), 'Box of 100 coloured blocks', 300, 300, 'Blocks'],
  [svg(400, 250, '34d399'), 'Outdoor cricket set', 400, 250, 'Cricket set'],
  [svg(300, 450, 'f472b6'), 'Art easel with paints', 300, 450, 'Art easel'],
  [svg(300, 300, '94a3b8'), 'Map of India jigsaw puzzle', 300, 300, 'India puzzle'],
];
const HERO = svg(560, 400, 'c7d2fe');

const DOC_START = (title) => `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${title}</title>\n<style>\n`;

export default {
  id: 'css-projects',
  title: 'Projects',
  lessons: [
    {
      id: 'css-proj-pricing',
      title: 'Project: pricing cards',
      source: 'HTML & CSS course, Part 53, Project 4',
      runner: 'page',
      slot: 'html',
      teach: [
        'A complete page from an empty document. Requirements, from the course:',
        { list: ['Three tiers side by side (Basic, Pro, Enterprise), stacked on phones.', 'One tier marked "most popular".', 'Each tier: name, price, a short feature list, a call-to-action button.', 'All three buttons line up at the same height, whatever the length of each feature list.'] },
        { h: 'Decisions that matter' },
        { list: ['**Not a `<table>`**: these are three independent cards, not rows and columns of related data. Use three `<article>`s in a flex container.', 'Equal heights come free from `align-items: stretch`; the buttons line up when each card is a flex column and the button has `margin-top: auto` (Part 24).', 'The popular tier is a **modifier class** (`.tier.popular`), not a different element.', 'The course draws "Most popular" with `::before { content: … }`. Text that only exists in CSS is not reliably announced and cannot be translated or selected: put the badge **in the HTML** and position it with CSS.', 'The course also lifts the popular card with `transform: translateY(-8px)`. That moves its button 8px above the others and breaks the alignment requirement. Mark it with the border and shadow instead.', 'Checkmarks drawn with `li::before` are decoration: give them empty alternative text, `content: "✓" / "";`.'] },
      ],
      example: [
        { code: '<article class="tier popular">\n  <p class="tier-badge">Most popular</p>\n  <h2>Pro</h2>\n  <p class="price">₹1,499<span>/month</span></p>\n  <ul><li>Unlimited classrooms</li>…</ul>\n  <button type="button">Choose Pro</button>\n</article>', lang: 'html' },
      ],
      task: [
        { ol: ['A complete document: `lang="en"`, charset, viewport meta, a title, a visible `<h1>`.', 'A `.pricing` container with three `article.tier` cards, each with an `<h2>`, a `.price`, a `<ul>` of features (3, 4 and 5 items) and a `<button type="button">`. The middle one also has the class `popular` and contains a `.tier-badge` element with the text "Most popular".', 'Phones (mobile-first): cards stacked, no horizontal scrolling. From `768px`: a row, equal heights, and the three buttons at exactly the same height.', '`.popular`: a different border colour from the other tiers; the badge is absolutely positioned on the card\'s top edge.', 'Feature items get a `✓` from `li::before` with empty alternative text.'] },
      ],
      starter: `${DOC_START('Pricing')}\n</style>\n</head>\n<body>\n\n</body>\n</html>\n`,
      solution: `${DOC_START('Pricing | ToyShop for Schools')}  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 48px 20px; font-family: system-ui, sans-serif; background: #fafafa; color: #1a1a1a; }
  h1 { text-align: center; margin: 0 0 40px; }
  .pricing { display: flex; flex-direction: column; align-items: center; gap: 32px; max-width: 1000px; margin-inline: auto; }
  .tier { position: relative; display: flex; flex-direction: column; width: 100%; max-width: 300px; padding: 32px 24px; background: white; border: 1px solid #e3e3e3; border-radius: 14px; }
  .tier.popular { border: 2px solid #3454d1; box-shadow: 0 8px 24px rgb(52 84 209 / 0.15); }
  .tier-badge { position: absolute; top: -13px; left: 50%; translate: -50% 0; margin: 0; padding: 4px 12px; border-radius: 999px; background: #3454d1; color: white; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
  .tier h2 { margin: 0; font-size: 1.125rem; }
  .price { margin: 8px 0 20px; font-size: 2rem; font-weight: 800; }
  .price span { font-size: 0.875rem; font-weight: 400; color: #595959; }
  .tier ul { list-style: none; margin: 0 0 24px; padding: 0; }
  .tier li { position: relative; padding: 6px 0 6px 24px; }
  .tier li::before { content: "✓" / ""; position: absolute; left: 0; color: #1f7a3a; font-weight: 700; }
  .tier button { margin-top: auto; padding: 12px; border: 0; border-radius: 8px; background: #e5e7eb; font: inherit; font-weight: 600; cursor: pointer; }
  .tier.popular button { background: #3454d1; color: white; }
  .tier button:focus-visible { outline: 3px solid #3454d1; outline-offset: 2px; }
  @media (min-width: 768px) {
    .pricing { flex-direction: row; align-items: stretch; justify-content: center; }
    .tier { width: 280px; }
  }
</style>
</head>
<body>
  <main>
    <h1>Plans for every classroom</h1>
    <div class="pricing">
      <article class="tier">
        <h2>Basic</h2>
        <p class="price">₹499<span>/month</span></p>
        <ul>
          <li>1 classroom</li>
          <li>20 toy loans a term</li>
          <li>Email support</li>
        </ul>
        <button type="button">Choose Basic</button>
      </article>
      <article class="tier popular">
        <p class="tier-badge">Most popular</p>
        <h2>Pro</h2>
        <p class="price">₹1,499<span>/month</span></p>
        <ul>
          <li>Unlimited classrooms</li>
          <li>100 toy loans a term</li>
          <li>Priority support</li>
          <li>Teacher activity guides</li>
        </ul>
        <button type="button">Choose Pro</button>
      </article>
      <article class="tier">
        <h2>Enterprise</h2>
        <p class="price">₹4,999<span>/month</span></p>
        <ul>
          <li>Every school in a trust</li>
          <li>Unlimited toy loans</li>
          <li>Named account manager</li>
          <li>On-site training</li>
          <li>Custom invoicing</li>
        </ul>
        <button type="button">Talk to us</button>
      </article>
    </div>
  </main>
</body>
</html>
`,
      checks: [
        { label: 'complete, semantic document', mistake: 'lang="en", a viewport meta, a title and an h1; a .pricing container with three article.tier cards (no table), each with h2, .price, ul and a type="button" button; exactly one .popular.', check: ({ doc, $, $$ }) => { const tiers = $$('.pricing article.tier'); const full = tiers.length === 3 && tiers.every((t) => t.querySelector('h2') && t.querySelector('.price') && t.querySelector('ul li') && t.querySelector('button[type="button"]')); const counts = tiers.map((t) => t.querySelectorAll('li').length).join(); const meta = doc.documentElement.lang === 'en' && /width=device-width/.test(doc.querySelector('meta[name="viewport"]')?.content ?? '') && doc.title.trim() !== '' && Boolean($('h1')); return (full && counts === '3,4,5' && $$('.tier.popular').length === 1 && !$('table') && meta) || (!meta ? 'check lang, the viewport meta, the title and the h1' : $('table') ? 'use articles, not a table' : `found ${tiers.length} tiers with ${counts || 'no'} features; each needs h2, .price, ul and a button`); } },
        { label: 'a row of equal cards from 768px', mistake: 'From 768px: .pricing { flex-direction: row; align-items: stretch; } so the cards sit side by side with equal heights.', check: async ({ atWidth }) => { const v = await atWidth(1024); const r = v.$$('.tier').map((t) => t.getBoundingClientRect()); const row = r.every((x) => Math.abs(x.top - r[0].top) < 1) && r[0].right <= r[1].left && r[1].right <= r[2].left; const equal = r.every((x) => Math.abs(x.height - r[0].height) < 1); return (row && equal) || `at 1024px: in a row ${row}, equal heights ${equal}`; } },
        { label: 'buttons line up', mistake: 'Each .tier is a flex column and its button has margin-top: auto. No translateY on the popular card: it would lift its button out of line.', check: async ({ atWidth }) => { const v = await atWidth(1024); const tops = v.$$('.tier button').map((b) => Math.round(b.getBoundingClientRect().top)); return tops.every((t) => Math.abs(t - tops[0]) <= 1) || `button tops at 1024px: ${tops.join(' / ')}`; } },
        { label: 'stacked on phones', mistake: 'Mobile-first: one column, and nothing wider than the screen.', check: async ({ atWidth }) => { const v = await atWidth(375); const r = v.$$('.tier').map((t) => t.getBoundingClientRect()); const stacked = r[1].top >= r[0].bottom && r[2].top >= r[1].bottom; const fits = v.doc.documentElement.scrollWidth <= v.doc.documentElement.clientWidth; return (stacked && fits) || `at 375px: stacked ${stacked}, no horizontal scroll ${fits}`; } },
        { label: 'popular tier stands out, in the HTML', mistake: 'A different border colour on .popular, and a .tier-badge element inside it saying "Most popular", absolutely positioned (not CSS-only text).', check: ({ $, $$ }) => { const [plain, pop] = [$$('.tier:not(.popular)')[0], $('.tier.popular')]; const badge = pop.querySelector('.tier-badge'); const differs = getComputedStyle(plain).borderTopColor !== getComputedStyle(pop).borderTopColor; return (differs && badge && /most popular/i.test(badge.textContent) && getComputedStyle(badge).position === 'absolute') || (!badge ? 'no .tier-badge element with the text "Most popular" inside .popular' : differs ? 'position the badge absolutely' : 'the popular tier needs its own border colour'); } },
        { label: 'decorative checkmarks', mistake: '.tier li::before { content: "✓" / ""; } (visible tick, empty alternative text).', check: ({ $ }) => { const c = getComputedStyle($('.tier li'), '::before').content; return (/✓/.test(c) && /\/\s*""/.test(c)) || `li::before content is ${c}`; } },
      ],
    },
    {
      id: 'css-proj-landing',
      title: 'Project: responsive landing page',
      source: 'HTML & CSS course, Part 53, Project 9',
      runner: 'page',
      slot: 'html',
      teach: [
        'The archetypal marketing page. From the course:',
        { list: ['Sticky header: logo, nav links, a call-to-action.', 'Hero: headline, subheadline, CTA button, an illustration.', 'Three-column features section (one column on phones): icon, title, description.', 'A closing CTA band on a contrasting background.', 'A footer with link columns.', 'Generous whitespace, large hero type, one accent colour used sparingly, only for calls to action.'] },
        { h: 'How the pieces map to the course' },
        { list: ['Header: Flexbox (Part 24) + `position: sticky; top: 0; z-index` and an **opaque** background, or content shows through (Part 20).', 'Features: Grid (Part 25), mobile-first `@media (min-width: …)` to three columns (Part 26).', 'Hero type: `clamp()` (Part 26).', 'Accent: one custom property (Part 29), so a rebrand is a one-line change.', 'Footer columns: a grid or wrapping flex row.', 'Decorative icons get `alt=""` or `aria-hidden="true"`; the illustration gets real alt text only if it carries information.'] },
      ],
      example: [
        { code: '<header class="site-header">\n  <a class="logo" href="/">ToyShop</a>\n  <nav aria-label="Main"><ul class="nav-links">…</ul></nav>\n  <a class="btn-accent" href="/signup">Start free</a>\n</header>', lang: 'html' },
      ],
      task: [
        { ol: ['Document basics as before. `:root` defines `--accent`, and every call-to-action (`.btn-accent`) uses it as its background.', '`header.site-header`: a flex row with `.logo`, a `<nav>` of at least 3 links and a `.btn-accent`; sticky at the top with a positive z-index and an opaque background.', '`main` contains `section.hero` (an `<h1>`, a `<p>`, a `.btn-accent` and an `<img>` with alt), `section.features` with three `.feature` cards (each an `<h3>` and a `<p>`), and `section.cta-band`.', 'Hero heading fluid: at least `40px` at 1024px, at most `40px` at 375px.', '`.features`: three columns from `768px`, one below.', '`.cta-band`: a background different from the page\'s, with text contrast of at least 4.5:1.', '`footer` with at least two `.footer-col` link columns side by side at 1024px. No horizontal scrolling at 375px.'] },
      ],
      starter: `${DOC_START('Landing page')}\n</style>\n</head>\n<body>\n\n</body>\n</html>\n`,
      solution: `${DOC_START('ToyShop for Schools | Toy libraries for every classroom')}  :root { --accent: #c2410c; --ink: #1c1917; --muted: #57534e; --bg: #fffbf5; --band: #1c1917; }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.5; color: var(--ink); background: var(--bg); }
  img { display: block; max-width: 100%; height: auto; }
  .container { width: min(100% - 2rem, 1100px); margin-inline: auto; }
  .site-header { position: sticky; top: 0; z-index: 10; background: white; border-bottom: 1px solid #e7e5e4; }
  .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-block: 12px; flex-wrap: wrap; }
  .logo { font-weight: 800; font-size: 1.25rem; color: var(--ink); text-decoration: none; }
  .nav-links { display: flex; gap: 16px; list-style: none; margin: 0; padding: 0; }
  .nav-links a { color: var(--ink); }
  .btn-accent { display: inline-block; padding: 10px 18px; border-radius: 8px; background: var(--accent); color: white; font-weight: 700; text-decoration: none; }
  .btn-accent:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }
  .hero { padding-block: clamp(2rem, 6vw, 5rem); }
  .hero-inner { display: grid; gap: 32px; align-items: center; }
  .hero h1 { margin: 0 0 16px; font-size: clamp(2rem, 4vw + 0.5rem, 3.5rem); line-height: 1.1; text-wrap: balance; }
  .hero p { margin: 0 0 24px; font-size: 1.125rem; color: var(--muted); max-width: 55ch; }
  .features { padding-block: 64px; }
  .features h2 { margin: 0 0 24px; }
  .feature-grid { display: grid; gap: 24px; }
  .feature { padding: 24px; background: white; border: 1px solid #e7e5e4; border-radius: 12px; }
  .feature-icon { font-size: 2rem; }
  .feature h3 { margin: 8px 0; }
  .feature p { margin: 0; color: var(--muted); }
  .cta-band { padding-block: 56px; background: var(--band); color: white; text-align: center; }
  .cta-band h2 { margin: 0 0 16px; }
  footer { padding-block: 40px; }
  .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 24px; }
  .footer-col h2 { font-size: 1rem; margin: 0 0 8px; }
  .footer-col ul { list-style: none; margin: 0; padding: 0; }
  .footer-col a { color: var(--ink); }
  @media (min-width: 768px) {
    .hero-inner { grid-template-columns: 1.1fr 1fr; }
    .feature-grid { grid-template-columns: repeat(3, 1fr); }
  }
</style>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="/">ToyShop</a>
      <nav aria-label="Main">
        <ul class="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
      <a class="btn-accent" href="/signup">Start free</a>
    </div>
  </header>
  <main>
    <section class="hero">
      <div class="container hero-inner">
        <div>
          <h1>A toy library for every classroom</h1>
          <p>Borrow wooden toys, puzzles and craft kits each term. We deliver across Mumbai and collect them again.</p>
          <a class="btn-accent" href="/signup">Start a free term</a>
        </div>
        <img src="${HERO}" alt="Children building a tower with wooden blocks" width="560" height="400">
      </div>
    </section>
    <section class="features" id="features" aria-labelledby="features-title">
      <div class="container">
        <h2 id="features-title">Why schools choose us</h2>
        <div class="feature-grid">
          <article class="feature"><span class="feature-icon" aria-hidden="true">🚚</span><h3>Free delivery</h3><p>Every Monday, anywhere in Mumbai.</p></article>
          <article class="feature"><span class="feature-icon" aria-hidden="true">🧸</span><h3>Safe toys</h3><p>Non-toxic paints, checked after every loan.</p></article>
          <article class="feature"><span class="feature-icon" aria-hidden="true">📚</span><h3>Activity guides</h3><p>Lesson ideas for each toy, by age group.</p></article>
        </div>
      </div>
    </section>
    <section class="cta-band" aria-labelledby="cta-title">
      <div class="container">
        <h2 id="cta-title">Ready for next term?</h2>
        <a class="btn-accent" href="/signup">Start free</a>
      </div>
    </section>
  </main>
  <footer>
    <div class="container footer-grid">
      <div class="footer-col"><h2>Company</h2><ul><li><a href="/about">About</a></li><li><a href="/careers">Careers</a></li></ul></div>
      <div class="footer-col"><h2>Help</h2><ul><li><a href="/faq">FAQ</a></li><li><a href="/contact">Contact</a></li></ul></div>
      <div class="footer-col"><h2>Legal</h2><ul><li><a href="/privacy">Privacy</a></li><li><a href="/terms">Terms</a></li></ul></div>
    </div>
  </footer>
</body>
</html>
`,
      checks: [
        { label: 'page structure', mistake: 'header.site-header (.logo, nav with 3+ links, .btn-accent); main with section.hero (h1, p, .btn-accent, img with alt), section.features with three .feature (h3 + p) and section.cta-band; footer with 2+ .footer-col.', check: ({ doc, $, $$ }) => { const header = $('header.site-header'); const hero = $('main section.hero'); const missing = []; if (!(doc.documentElement.lang && doc.querySelector('meta[name="viewport"]') && doc.title.trim())) missing.push('lang/viewport/title'); if (!(header && header.querySelector('.logo') && header.querySelectorAll('nav a').length >= 3 && header.querySelector('.btn-accent'))) missing.push('header'); if (!(hero && hero.querySelector('h1') && hero.querySelector('p') && hero.querySelector('.btn-accent') && hero.querySelector('img[alt]'))) missing.push('hero'); const features = $$('main section.features .feature'); if (!(features.length === 3 && features.every((f) => f.querySelector('h3') && f.querySelector('p')))) missing.push('three .feature cards'); if (!$('main section.cta-band')) missing.push('cta-band'); if ($$('footer .footer-col').length < 2) missing.push('footer columns'); return missing.length === 0 || `missing or incomplete: ${missing.join(', ')}`; } },
        { label: 'sticky, opaque header', mistake: '.site-header { position: sticky; top: 0; z-index: 10; background: white; } with its items in a flex row.', check: async ({ $, atWidth, settle }) => { const v = await atWidth(1024); const s = getComputedStyle($('.site-header')); const z = parseInt(s.zIndex, 10); const opaque = /^rgb\(/.test(s.backgroundColor) || s.backgroundColor.endsWith(', 1)'); const flexRow = [...$('.site-header').querySelectorAll('*')].concat($('.site-header')).some((el) => getComputedStyle(el).display === 'flex' && el.contains($('.logo')) && el.contains($('.site-header .btn-accent'))); window.scrollTo(0, 600); await settle(); const top = Math.round(v.rect('.site-header').top); window.scrollTo(0, 0); await settle(); return (s.position === 'sticky' && s.top === '0px' && z > 0 && opaque && flexRow && top === 0) || `header: ${s.position}, top ${s.top}, z-index ${s.zIndex}, background ${s.backgroundColor}, after scrolling at ${top}px`; } },
        { label: 'features: 3 columns, then 1', mistake: 'One column by default; three columns from 768px.', check: async ({ atWidth }) => { const count = (v) => { const r = v.$$('.feature').map((f) => f.getBoundingClientRect()); return new Set(r.map((x) => Math.round(x.top))).size; }; const wide = await atWidth(1024); const rowsWide = count(wide); const phone = await atWidth(375); const rowsPhone = count(phone); return (rowsWide === 1 && rowsPhone === 3) || `features use ${rowsWide} row(s) at 1024px and ${rowsPhone} at 375px`; } },
        { label: 'one accent token', mistake: ':root { --accent: …; } and .btn-accent { background: var(--accent); }: changing the token recolours every CTA.', check: async ({ document, $$, settle }) => { const root = document.documentElement; root.style.setProperty('--accent', 'rgb(0, 128, 0)'); await settle(); const all = $$('.btn-accent').every((b) => getComputedStyle(b).backgroundColor === 'rgb(0, 128, 0)'); root.style.removeProperty('--accent'); await settle(); return all || 'not every .btn-accent follows --accent'; } },
        { label: 'fluid hero and readable CTA band', mistake: 'Hero h1 ≥ 40px at 1024px and ≤ 40px at 375px (clamp); .cta-band on its own background with text contrast ≥ 4.5:1.', check: async ({ document, $, atWidth }) => { const wide = await atWidth(1024); const big = parseFloat(wide.style('.hero h1', 'font-size')); const phone = await atWidth(375); const small = parseFloat(phone.style('.hero h1', 'font-size')); const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number); const lum = (c) => { const [r, g, b] = parse(c).map((x) => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }; const band = getComputedStyle($('.cta-band')); const bodyBg = getComputedStyle(document.body).backgroundColor; const [l1, l2] = [lum(band.color), lum(band.backgroundColor)].sort((a, b) => b - a); const ratio = (l1 + 0.05) / (l2 + 0.05); const distinct = band.backgroundColor !== bodyBg && band.backgroundColor !== 'rgba(0, 0, 0, 0)'; return (big >= 40 && small <= 40 && distinct && ratio >= 4.5) || `h1 ${Math.round(big)}px at 1024 / ${Math.round(small)}px at 375; band background distinct ${distinct}, contrast ${ratio.toFixed(2)}:1`; } },
        { label: 'footer columns and no sideways scroll', mistake: 'Footer columns side by side at 1024px; nothing wider than a 375px screen.', check: async ({ atWidth }) => { const wide = await atWidth(1024); const cols = wide.$$('footer .footer-col').map((c) => c.getBoundingClientRect()); const side = cols.length >= 2 && Math.abs(cols[0].top - cols[1].top) < 1 && cols[1].left >= cols[0].right; const phone = await atWidth(375); const fits = phone.doc.documentElement.scrollWidth <= phone.doc.documentElement.clientWidth; return (side && fits) || `footer columns side by side: ${side}; fits a phone: ${fits}`; } },
      ],
    },
    {
      id: 'css-proj-dashboard',
      title: 'Project: admin dashboard with a data table',
      source: 'HTML & CSS course, Part 53, Projects 16 and 21',
      runner: 'page',
      slot: 'html',
      teach: [
        'An admin shell, one of the most common real layouts. From the course (Projects 16 and 21):',
        { list: ['A persistent left sidebar of icon + label links, with an active-state indicator.', 'A top bar: page title, search input, user avatar.', 'A row of stat cards: metric name, big number, small trend.', 'A large panel (chart placeholder) and a dense orders table with status badges.', 'At narrow widths the sidebar collapses to icons only.'] },
        { h: 'Decisions' },
        { list: ['`grid-template-areas: "sidebar topbar" "sidebar main"` is the cleanest description of this shape (Part 25).', 'Mark the active link with `aria-current="page"` and style **that** attribute.', 'Collapsed labels must stay available to screen readers: hide them **visually** (the `.sr-only` clip pattern), not with `display: none`, and keep each link\'s accessible name.', 'The orders table is real tabular data: `<caption>`, `<th scope="col">` on every header (Part 6), zebra striping with `tbody tr:nth-child(even)`, and status badges that say the status in text, not only in colour.', 'Stat cards: `repeat(auto-fit, minmax(180px, 1fr))` wraps them without media queries.', 'A wide table on a narrow screen should scroll inside its own wrapper (`overflow-x: auto`), not push the page sideways.'] },
      ],
      example: [
        { code: '.app {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-rows: 64px 1fr;\n  grid-template-areas: "sidebar topbar" "sidebar main";\n  min-height: 100dvh;\n}', lang: 'css' },
      ],
      task: [
        { ol: ['`div.app`: a grid shell with named areas `sidebar`, `topbar`, `main`: a `240px` sidebar spanning the full height on the left, the top bar beside it, main below the top bar.', '`aside.sidebar` with a `<nav>` of at least 4 links, each with a `.nav-icon` (decorative, `aria-hidden="true"`) and a `.nav-label`; one link has `aria-current="page"` and a visibly different background.', 'Below `800px`: the sidebar is `72px` wide and the labels are visually hidden but still in the accessibility tree (no `display: none` or `visibility: hidden`).', '`header.topbar`: an `<h1>`, a labelled `input[type="search"]` and an `.avatar`.', '`main.main`: `.stats` with 4 `.stat-card`s (each `.stat-label`, `.stat-value`, `.stat-trend`), all in one row at 1200px; a `.panel`; and `table.orders` with a caption, `th scope="col"` on every header cell, at least 3 rows, zebra-striped body rows, and a pill-shaped `.badge` (radius 999px) with the status text in each row.'] },
      ],
      starter: `${DOC_START('Dashboard')}\n</style>\n</head>\n<body>\n\n</body>\n</html>\n`,
      solution: `${DOC_START('Orders | ToyShop admin')}  :root { --bg: #f8fafc; --surface: #ffffff; --border: #e2e8f0; --text: #0f172a; --muted: #475569; --primary: #4f46e5; --primary-soft: #eef2ff; }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); background: var(--bg); }
  .app { display: grid; grid-template-columns: 240px 1fr; grid-template-rows: 64px 1fr; grid-template-areas: "sidebar topbar" "sidebar main"; min-height: 100dvh; }
  .sidebar { grid-area: sidebar; background: var(--surface); border-right: 1px solid var(--border); padding: 16px 12px; }
  .brand { margin: 0 0 16px; padding-inline: 12px; font-weight: 800; }
  .side-nav ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
  .side-nav a { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; color: var(--text); text-decoration: none; }
  .side-nav a[aria-current="page"] { background: var(--primary-soft); color: var(--primary); font-weight: 600; }
  .side-nav a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
  .nav-icon { width: 24px; text-align: center; flex-shrink: 0; }
  .topbar { grid-area: topbar; display: flex; align-items: center; gap: 16px; padding-inline: 24px; background: var(--surface); border-bottom: 1px solid var(--border); }
  .topbar h1 { margin: 0; font-size: 1.25rem; margin-right: auto; }
  .search input { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font: inherit; }
  .avatar { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: white; font-weight: 700; }
  .main { grid-area: main; padding: 24px; display: grid; gap: 24px; align-content: start; min-width: 0; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
  .stat-card, .panel, .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
  .stat-card { padding: 16px; }
  .stat-label { margin: 0; color: var(--muted); font-size: 0.875rem; }
  .stat-value { margin: 4px 0; font-size: 1.75rem; font-weight: 800; }
  .stat-trend { margin: 0; font-size: 0.875rem; color: #15803d; }
  .panel { min-height: 220px; padding: 16px; }
  .panel h2 { margin: 0; font-size: 1rem; }
  .table-wrap { overflow-x: auto; }
  .orders { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .orders caption { text-align: left; padding: 12px 16px; font-weight: 700; }
  .orders th, .orders td { padding: 10px 16px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .orders thead th { color: var(--muted); font-weight: 600; }
  .orders tbody tr:nth-child(even) { background: var(--bg); }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-shipped { background: #dbeafe; color: #1e40af; }
  .badge-delivered { background: #dcfce7; color: #166534; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (max-width: 799px) {
    .app { grid-template-columns: 72px 1fr; }
    .brand { font-size: 0; padding: 0; }
    .side-nav a { justify-content: center; padding-inline: 0; }
    .nav-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .search { display: none; }
  }
</style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <p class="brand">ToyShop</p>
      <nav class="side-nav" aria-label="Admin">
        <ul>
          <li><a href="/admin"><span class="nav-icon" aria-hidden="true">🏠</span><span class="nav-label">Overview</span></a></li>
          <li><a href="/admin/orders" aria-current="page"><span class="nav-icon" aria-hidden="true">📦</span><span class="nav-label">Orders</span></a></li>
          <li><a href="/admin/products"><span class="nav-icon" aria-hidden="true">🧸</span><span class="nav-label">Products</span></a></li>
          <li><a href="/admin/customers"><span class="nav-icon" aria-hidden="true">👥</span><span class="nav-label">Customers</span></a></li>
        </ul>
      </nav>
    </aside>
    <header class="topbar">
      <h1>Orders</h1>
      <form class="search" role="search"><label for="q" class="sr-only">Search orders</label><input type="search" id="q" name="q" placeholder="Search orders"></form>
      <span class="avatar" role="img" aria-label="Signed in as Ammaar">A</span>
    </header>
    <main class="main">
      <section class="stats" aria-label="This month">
        <article class="stat-card"><p class="stat-label">Revenue</p><p class="stat-value">₹4.2L</p><p class="stat-trend">▲ 12% vs last month</p></article>
        <article class="stat-card"><p class="stat-label">Orders</p><p class="stat-value">318</p><p class="stat-trend">▲ 8%</p></article>
        <article class="stat-card"><p class="stat-label">Returns</p><p class="stat-value">6</p><p class="stat-trend">▼ 2</p></article>
        <article class="stat-card"><p class="stat-label">New customers</p><p class="stat-value">54</p><p class="stat-trend">▲ 15%</p></article>
      </section>
      <section class="panel" aria-labelledby="chart-title"><h2 id="chart-title">Sales this month</h2></section>
      <div class="table-wrap">
        <table class="orders">
          <caption>Recent orders</caption>
          <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Total</th><th scope="col">Status</th></tr></thead>
          <tbody>
            <tr><td>#1042</td><td>Riya Shah</td><td>₹1,499</td><td><span class="badge badge-pending">Pending</span></td></tr>
            <tr><td>#1041</td><td>Kabir Mehta</td><td>₹699</td><td><span class="badge badge-shipped">Shipped</span></td></tr>
            <tr><td>#1040</td><td>Ananya Iyer</td><td>₹2,299</td><td><span class="badge badge-delivered">Delivered</span></td></tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</body>
</html>
`,
      checks: [
        { label: 'dashboard structure', mistake: 'div.app with aside.sidebar (nav, 4+ links with .nav-icon and .nav-label, one aria-current="page"), header.topbar (h1, labelled search input, .avatar), main.main (.stats with 4 .stat-card, .panel, table.orders).', check: ({ $, $$ }) => { const missing = []; const links = $$('.sidebar nav a'); if (!(links.length >= 4 && links.every((a) => a.querySelector('.nav-icon[aria-hidden="true"]') && a.querySelector('.nav-label')) && $$('.sidebar nav a[aria-current="page"]').length === 1)) missing.push('sidebar links'); const search = $('.topbar input[type="search"]'); const labelled = search && (search.getAttribute('aria-label') || (search.id && $(`label[for="${search.id}"]`))); if (!($('header.topbar h1') && labelled && $('.topbar .avatar'))) missing.push('top bar'); const cards = $$('main.main .stats .stat-card'); if (!(cards.length === 4 && cards.every((c) => c.querySelector('.stat-label') && c.querySelector('.stat-value') && c.querySelector('.stat-trend')))) missing.push('stat cards'); if (!$('main.main .panel')) missing.push('panel'); if (!$('main.main table.orders')) missing.push('orders table'); return missing.length === 0 || `missing or incomplete: ${missing.join(', ')}`; } },
        { label: 'named-area shell', mistake: '.app { display: grid; grid-template-columns: 240px 1fr; grid-template-areas: "sidebar topbar" "sidebar main"; } and grid-area on each region.', check: async ({ atWidth }) => { const v = await atWidth(1200); const areas = v.style('.app', 'grid-template-areas').replace(/\s+/g, ' '); const side = v.rect('.sidebar'); const top = v.rect('.topbar'); const main = v.rect('.main'); const ok = /"sidebar topbar" "sidebar main"/.test(areas) && Math.round(side.width) === 240 && Math.round(side.left) === 0 && Math.round(top.left) === 240 && Math.round(main.left) === 240 && Math.round(main.top) >= Math.round(top.bottom) && Math.round(side.bottom) >= Math.round(main.bottom) - 1; return ok || `areas ${areas}; sidebar ${Math.round(side.width)}px, topbar at x=${Math.round(top.left)}, main at x=${Math.round(main.left)}`; } },
        { label: 'icon-only sidebar on narrow screens', mistake: 'Below 800px: a 72px sidebar with the labels clipped visually (sr-only pattern), not display: none or visibility: hidden.', check: async ({ atWidth }) => { const v = await atWidth(700); const w = Math.round(v.rect('.sidebar').width); const labels = v.$$('.nav-label'); const hiddenVisually = labels.every((l) => { const r = l.getBoundingClientRect(); const s = getComputedStyle(l); return r.width <= 1 && s.display !== 'none' && s.visibility !== 'hidden'; }); return (w === 72 && hiddenVisually) || `at 700px the sidebar is ${w}px; labels visually hidden but still readable: ${hiddenVisually}`; } },
        { label: 'active link indicator', mistake: 'Style a[aria-current="page"] with its own background.', check: ({ $, $$ }) => { const cur = $('.sidebar a[aria-current="page"]'); const other = $$('.sidebar nav a').find((a) => a !== cur); return getComputedStyle(cur).backgroundColor !== getComputedStyle(other).backgroundColor || 'the current page link looks like the others'; } },
        { label: 'stat cards in one row', mistake: '.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }: four in a row at 1200px.', check: async ({ atWidth }) => { const v = await atWidth(1200); const tops = v.$$('.stat-card').map((c) => Math.round(c.getBoundingClientRect().top)); return tops.every((t) => t === tops[0]) || `stat card tops at 1200px: ${tops.join(' / ')}`; } },
        { label: 'accessible, styled table', mistake: 'A caption, th scope="col" on every header cell, 3+ body rows, tbody tr:nth-child(even) striping and a pill .badge (radius 999px) with text in each row.', check: ({ $, $$ }) => { const ths = $$('table.orders thead th'); const rows = $$('table.orders tbody tr'); const scoped = ths.length >= 4 && ths.every((th) => th.getAttribute('scope') === 'col'); const striped = rows.length >= 3 && getComputedStyle(rows[1]).backgroundColor !== getComputedStyle(rows[0]).backgroundColor; const badges = rows.every((r) => { const b = r.querySelector('.badge'); return b && b.textContent.trim() && parseFloat(getComputedStyle(b).borderTopLeftRadius) >= 999; }); return (Boolean($('table.orders caption')) && scoped && striped && badges) || `caption ${Boolean($('table.orders caption'))}, scoped headers ${scoped}, striped ${striped}, pill badges with text ${badges}`; } },
      ],
    },
    {
      id: 'css-proj-gallery',
      title: 'Project: photo gallery',
      source: 'HTML & CSS course, Part 53, Project 17',
      runner: 'page',
      slot: 'html',
      teach: [
        'From the course:',
        { list: ['A responsive grid of images with different shapes that still lines up cleanly.', 'A caption overlay revealed on hover.', 'Images never distort.', 'Each image wrapped in a link to its full-size version, ready for a future JavaScript lightbox.'] },
        { h: 'Decisions' },
        { list: ['Uniform tiles: every image gets the same `aspect-ratio` with `object-fit: cover` (Part 39). True masonry is not reliably available yet.', '`repeat(auto-fit, minmax(200px, 1fr))` gives the right column count at every width (Part 25).', 'A hover-only caption is invisible to keyboard and touch users. Show it on `:focus` too (and consider showing it permanently on touch screens with `@media (hover: none)`).', 'Animate the overlay with `opacity`/`transform` only, and switch the transition off under `prefers-reduced-motion`.', 'Keep `width`/`height` on each `<img>` (with `height: auto` in CSS) so the page does not jump while images load, and `loading="lazy"` on images below the fold.'] },
      ],
      example: [
        { code: '<li>\n  <a class="gallery-link" href="/photos/train-set.jpg">\n    <img src="train-set-thumb.jpg" alt="Wooden train set on a play mat" width="400" height="250" loading="lazy">\n    <span class="caption">Train set</span>\n  </a>\n</li>', lang: 'html' },
      ],
      task: [
        'The starter has the six images. Turn them into the gallery:',
        { ol: ['`ul.gallery` (no bullets or padding), a grid of `repeat(auto-fit, minmax(200px, 1fr))` with a `12px` gap. At 1024px it shows at least 4 columns; at 375px at most 2; never wider than the screen.', 'Wrap each image in `a.gallery-link` pointing at a full-size file, and add a `span.caption` (the short name) inside the link.', 'Every image: `display: block`, full width of its tile, `4 / 3` with `height: auto`, `object-fit: cover`.', 'The link is `position: relative`; the caption is absolutely positioned across its bottom, hidden with `opacity: 0`, and shown (`opacity: 1`) on `:hover` and `:focus`, with an `opacity` transition.', 'Under `prefers-reduced-motion: reduce`, the caption has no transition.'] },
      ],
      starter: `${DOC_START('Gallery')}\n</style>\n</head>\n<body>\n  <main>\n    <h1>Toy gallery</h1>\n    <ul class="gallery">\n${PHOTOS.map(([src, alt, w, h]) => `      <li><img src="${src}" alt="${alt}" width="${w}" height="${h}"></li>`).join('\n')}\n    </ul>\n  </main>\n</body>\n</html>\n`,
      solution: `${DOC_START('Toy gallery | ToyShop')}  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; }
  .gallery { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
  .gallery-link { position: relative; display: block; border-radius: 8px; overflow: hidden; color: white; }
  .gallery-link:focus-visible { outline: 3px solid #4f46e5; outline-offset: 3px; }
  .gallery img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; }
  .caption { position: absolute; left: 0; right: 0; bottom: 0; padding: 8px 12px; background: linear-gradient(transparent, rgb(0 0 0 / 0.75)); font-weight: 600; opacity: 0; transition: opacity 0.2s ease; }
  .gallery-link:hover .caption,
  .gallery-link:focus .caption { opacity: 1; }
  @media (hover: none) {
    .caption { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .caption { transition: none; }
  }
</style>
</head>
<body>
  <main>
    <h1>Toy gallery</h1>
    <ul class="gallery">
${PHOTOS.map(([src, alt, w, h, name]) => `      <li><a class="gallery-link" href="/photos/${name.toLowerCase().replace(/ /g, '-')}.jpg"><img src="${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy"><span class="caption">${name}</span></a></li>`).join('\n')}
    </ul>
  </main>
</body>
</html>
`,
      checks: [
        { label: 'lightbox-ready markup', mistake: 'Each li contains a.gallery-link[href] wrapping the img (alt kept) and a span.caption.', check: ({ $$ }) => { const items = $$('ul.gallery > li'); const ok = items.length === 6 && items.every((li) => { const a = li.querySelector('a.gallery-link[href]'); return a && a.querySelector('img[alt]') && a.querySelector('.caption')?.textContent.trim(); }); return ok || `${items.length} items; each needs a.gallery-link[href] containing the img and a .caption`; } },
        { label: 'responsive grid', mistake: '.gallery { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }', check: async ({ $, atWidth }) => { const cols = (v) => { const r = v.$$('.gallery > li').map((li) => li.getBoundingClientRect()); return r.filter((x) => Math.abs(x.top - r[0].top) < 1).length; }; const s = getComputedStyle($('.gallery')); const wide = await atWidth(1024); const c1 = cols(wide); const phone = await atWidth(375); const c2 = cols(phone); const fits = phone.doc.documentElement.scrollWidth <= phone.doc.documentElement.clientWidth; return (s.listStyleType === 'none' && s.paddingLeft === '0px' && s.columnGap === '12px' && c1 >= 4 && c2 <= 2 && fits) || `${c1} columns at 1024px, ${c2} at 375px, gap ${s.columnGap}, fits a phone ${fits}`; } },
        { label: 'uniform, undistorted tiles', mistake: '.gallery img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; }', check: ({ $$ }) => { const imgs = $$('.gallery img'); const r = imgs.map((i) => i.getBoundingClientRect()); const sameHeight = r.every((x) => Math.abs(x.height - r[0].height) < 1); const ratio = Math.abs(r[0].width / r[0].height - 4 / 3) < 0.02; const cover = imgs.every((i) => getComputedStyle(i).objectFit === 'cover'); return (sameHeight && ratio && cover) || `tiles equal height ${sameHeight}, 4:3 ${ratio}, object-fit cover ${cover}`; } },
        { label: 'caption overlay', mistake: '.gallery-link { position: relative; } .caption { position: absolute; left: 0; right: 0; bottom: 0; opacity: 0; transition: opacity …; }', check: ({ $, rect }) => { const cap = $('.caption'); const s = getComputedStyle(cap); const link = rect('.gallery-link'); const c = rect(cap); return (getComputedStyle($('.gallery-link')).position === 'relative' && s.position === 'absolute' && Math.abs(c.bottom - link.bottom) < 1 && Math.abs(c.width - link.width) < 1 && s.opacity === '0' && /opacity/.test(s.transitionProperty)) || `caption: position ${s.position}, opacity ${s.opacity}, transition ${s.transitionProperty}`; } },
        { label: 'caption on keyboard focus', mistake: 'Show the caption on .gallery-link:focus as well as :hover.', check: async ({ $, settle }) => { const link = $('.gallery-link'); link.focus(); await settle(); const cap = link.querySelector('.caption'); cap.getAnimations().forEach((a) => a.finish()); await settle(); const shown = getComputedStyle(cap).opacity === '1'; link.blur(); await settle(); cap.getAnimations().forEach((a) => a.finish()); return shown || 'focusing a link does not reveal its caption'; } },
        { label: 'reduced motion', mistake: '@media (prefers-reduced-motion: reduce) { .caption { transition: none; } }', check: ({ document, $, h }) => h.mediaRules(document.querySelector('style[data-source="learner"]').sheet, 'prefers-reduced-motion:reduce').some((r) => $('.caption').matches(r.selectorText) && /none|^0s/.test(r.style.transitionProperty + r.style.transitionDuration)) || 'no reduced-motion rule that removes the caption transition' },
      ],
    },
  ],
};
