// HTML & CSS course, Parts 35–38: architecture, resets, modern CSS and
// logical properties.
const CHAI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='200' height='120' fill='%23d97706'/%3E%3C/svg%3E";

export default {
  id: 'css-architecture-modern',
  title: 'Architecture, resets and modern CSS',
  lessons: [
    {
      id: 'css-architecture-layers',
      title: 'BEM naming and layered architecture',
      source: 'HTML & CSS course, Parts 35 and 15',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: `<main id="main">\n  <article class="card card--featured"><img class="card__image" src="${CHAI}" alt="Train set" width="200" height="120"><h3 class="card__title card__title--large">Train set</h3><p class="card__price">₹1,499</p></article>\n  <article class="card"><h3 class="card__title">India puzzle</h3><p class="card__price card__price--discounted">₹699</p></article>\n  <article class="card u-hidden"><h3 class="card__title">Out of stock</h3></article>\n</main>`,
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; }',
      },
      teach: [
        'Large unstructured stylesheets rot in predictable ways: **specificity creep** (each fix needs a stronger selector or `!important`), **unclear ownership** (who else uses `.title`?), **dead CSS** nobody dares delete, and **name collisions** between unrelated components. Architecture is a set of conventions that prevents them.',
        { h: 'BEM: Block, Element, Modifier' },
        { code: '.card { }                 /* block: a standalone component */\n.card__title { }          /* element: a part of the block (two underscores) */\n.card--featured { }       /* modifier: a variation (two dashes) */\n.card__title--large { }   /* a modified element */', lang: 'css' },
        'Each selector is **one class**, so every rule has the same low specificity (0,1,0) and any override is just "a later single class". The name alone says which component a rule belongs to. The cost is long names.',
        { h: 'Utilities' },
        'Single-purpose classes (`.u-hidden`, `.mt-4`, Tailwind\'s `flex items-center gap-4`) are fast to compose and stop the stylesheet growing, at the price of busy HTML and less meaningful class names. CUBE CSS mixes both deliberately: layout compositions and utilities for what repeats, blocks for what is unique, exceptions via data attributes.',
        { h: 'ITCSS order, enforced with cascade layers' },
        'ITCSS orders CSS from broad and weak to narrow and strong: settings → generic (reset) → elements → objects → components → utilities. Traditionally utilities used `!important` to be sure to win. Cascade layers (Part 15) make the order itself decide: a later layer beats an earlier one **whatever the specificity**.',
        { code: '@layer reset, components, utilities;   /* declare the order once, first */\n\n@layer components { .card { display: block; } }\n@layer utilities  { .u-hidden { display: none; } }   /* wins, no !important */', lang: 'css' },
        { list: ['Name classes for what something **is** (`.card`, `.nav-link`) or **does** (`.is-active`, `.u-hidden`), never for how it looks today (`.red-box`, `.left-column`).', 'Avoid chains like `.page .content .sidebar .widget .title` and ids in selectors.', 'One component, one file (or one clear section). Consistency matters more than which method you pick.'] },
      ],
      example: [
        { code: 'styles/\n├── settings/tokens.css     custom properties\n├── base/reset.css          Part 36\n├── layout/layout.css       page structure\n├── components/button.css   one file per component\n└── utilities/utilities.css', lang: 'text' },
      ],
      task: [
        { ol: ['Start with `@layer reset, components, utilities;`.', 'In the `components` layer, using only single-class BEM selectors: `.card` (display block, `padding: 16px`, `1px solid #e5e7eb` border, `8px` radius, `margin-bottom: 16px`); `.card--featured` (border colour `#4f46e5`); `.card__title` (`font-size: 1.125rem`, `margin: 0`); `.card__title--large` (`1.5rem`); `.card__price--discounted` (colour `#dc2626`).', 'In the `utilities` layer: `.u-hidden { display: none; }`, which must hide the third card without `!important`.', 'No ids, no descendant chains, no `!important`.'] },
      ],
      starter: '#main .card {\n  display: block;\n  padding: 16px;\n}\n\n#main .card h3 {\n  font-size: 18px;\n}\n\n.u-hidden {\n  display: none !important;\n}\n',
      solution: '@layer reset, components, utilities;\n\n@layer components {\n  .card {\n    display: block;\n    padding: 16px;\n    border: 1px solid #e5e7eb;\n    border-radius: 8px;\n    margin-bottom: 16px;\n  }\n\n  .card--featured {\n    border-color: #4f46e5;\n  }\n\n  .card__title {\n    font-size: 1.125rem;\n    margin: 0;\n  }\n\n  .card__title--large {\n    font-size: 1.5rem;\n  }\n\n  .card__price--discounted {\n    color: #dc2626;\n  }\n}\n\n@layer utilities {\n  .u-hidden {\n    display: none;\n  }\n}\n',
      checks: [
        { label: 'layer order declared first', mistake: 'The first rule is @layer reset, components, utilities;', check: ({ document }) => { const first = document.querySelector('style[data-source="learner"]').sheet.cssRules[0]; return (first && first.constructor.name === 'CSSLayerStatementRule' && first.nameList.join() === 'reset,components,utilities') || 'start the stylesheet with @layer reset, components, utilities;'; } },
        { label: 'flat BEM selectors in layers', mistake: 'Put the component rules in @layer components, using one class per selector: no ids, no descendant chains, no !important.', check: ({ document }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const layers = [...sheet.cssRules].filter((r) => r.constructor.name === 'CSSLayerBlockRule'); const comp = layers.find((l) => l.name === 'components'); if (!comp) return 'no @layer components { … } block'; const rules = [...comp.cssRules].filter((r) => r.selectorText); const bad = rules.flatMap((r) => r.selectorText.split(',').map((s) => s.trim())).filter((s) => !/^\.[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(s)); const important = /!important/.test([...sheet.cssRules].map((r) => r.cssText).join('')); return (rules.length >= 5 && bad.length === 0 && !important) || (important ? 'remove !important: the layer order does that job' : bad.length ? `not a single BEM class: ${bad.join(', ')}` : 'the components layer needs the five card rules'); } },
        { label: 'card block styled', mistake: '.card { display: block; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; }', check: ({ $$, h }) => { const s = getComputedStyle($$('.card')[1]); return (s.paddingTop === '16px' && s.borderTopWidth === '1px' && s.borderTopStyle === 'solid' && h.sameValue('color', s.borderTopColor, '#e5e7eb') && s.borderTopLeftRadius === '8px') || `card: padding ${s.paddingTop}, border ${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}, radius ${s.borderTopLeftRadius}`; } },
        { label: 'modifiers and elements', mistake: '.card--featured border #4f46e5; .card__title 1.125rem, margin 0; .card__title--large 1.5rem; .card__price--discounted #dc2626.', check: ({ $, $$, h }) => { const titles = $$('.card__title').map((t) => getComputedStyle(t)); const ok = h.sameValue('color', getComputedStyle($('.card--featured')).borderTopColor, '#4f46e5') && titles[0].fontSize === '24px' && titles[1].fontSize === '18px' && titles[1].marginTop === '0px' && h.sameValue('color', getComputedStyle($('.card__price--discounted')).color, '#dc2626'); return ok || `featured border ${getComputedStyle($('.card--featured')).borderTopColor}, title sizes ${titles[0].fontSize} / ${titles[1].fontSize}`; } },
        { label: 'utility wins by layer', mistake: '@layer utilities { .u-hidden { display: none; } }: a later layer beats .card { display: block } without !important.', check: ({ document, $ }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const util = [...sheet.cssRules].find((r) => r.constructor.name === 'CSSLayerBlockRule' && r.name === 'utilities'); const inLayer = util && [...util.cssRules].some((r) => r.selectorText === '.u-hidden' && r.style.display === 'none'); return (inLayer && getComputedStyle($('.u-hidden')).display === 'none') || (inLayer ? 'the third card is still visible' : 'no .u-hidden rule in the utilities layer'); } },
      ],
    },
    {
      id: 'css-architecture-quiz',
      title: 'Architecture check',
      source: 'HTML & CSS course, Parts 35 and 37',
      runner: 'quiz',
      teach: [
        { table: { head: ['Approach', 'Strength', 'Cost'], rows: [['BEM', 'explicit ownership, flat specificity', 'long class names'], ['Utilities', 'fast, the CSS stops growing', 'busy HTML, less semantic names'], ['CUBE', 'uses both where each fits', 'needs team discipline'], ['ITCSS / layers', 'the order of the cascade is designed', 'a structure everyone must follow']] } },
        { h: 'Nesting and specificity' },
        'Native nesting (`.card { &:hover { … } }`) is mostly organisation: a nested selector gets the specificity it would have written flat. The exception: `&` behaves like `:is(parent)`, so with a **list** of parents (`.card, #promo { & h3 { … } }`) every match gets the specificity of the strongest one, `#promo`, which flat `.card h3` would not have.',
      ],
      example: [
        { code: '.nav {\n  display: flex;\n  & a {\n    color: black;\n    &:hover { color: blue; }   /* = .nav a:hover */\n  }\n}', lang: 'css' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Which class name follows BEM for the price label inside a product card, in its discounted variation?', options: ['.product-card .price.discounted', '.product-card__price--discounted', '.productCard-price-discounted', '.discounted-price'], answer: 1, explain: 'block__element--modifier.' },
        { q: 'Why does BEM keep specificity low?', options: ['It uses ids', 'Every selector is a single class, never chained', 'It uses !important', 'It forbids pseudo-classes'], answer: 1, explain: 'All rules sit at (0,1,0), so the later one simply wins.' },
        { q: 'In ITCSS, why do utilities come last?', options: ['They are the largest', 'They are narrow overrides meant to win reliably', 'Browsers require it', 'They contain the reset'], answer: 1, explain: 'With cascade layers, being in the last layer is enough; no !important needed.' },
        { q: 'Which class name will age worst?', options: ['.card', '.is-active', '.red-left-box', '.nav-link'], answer: 2, explain: 'Names describing today\'s look become lies after a redesign.' },
        { q: 'What is the specificity of the nested `h3` rule here?', options: ['(0,1,1) like .card h3', '(1,0,1), because & acts like :is(.card, #promo)', '(0,0,1)', 'Nesting has no specificity'], answer: 1, explain: ':is() takes the specificity of its most specific argument.', code: '.card, #promo {\n  & h3 { color: navy; }\n}', lang: 'css' },
        { q: 'What matters most when choosing a methodology?', options: ['Picking the newest', 'Applying one approach consistently across the codebase', 'Using all of them', 'Avoiding classes'], answer: 1, explain: 'Most CSS rot comes from inconsistency.' },
      ],
    },
    {
      id: 'css-reset',
      title: 'A modern reset, line by line',
      source: 'HTML & CSS course, Part 36',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: `<header><nav aria-label="Main"><ul class="nav-list"><li><a href="/">Home</a></li><li><a href="/shop">Shop</a></li></ul></nav></header>\n<h1>Recipe: masala chai</h1>\n<p>Serves two.</p>\n<ol class="steps"><li>Boil water with ginger and cardamom.</li><li>Add tea leaves, milk and sugar.</li></ol>\n<figure class="photo"><img src="${CHAI}" alt="A cup of chai" width="200" height="120"></figure>\n<form><input aria-label="Email" type="email"><button type="submit">Subscribe</button></form>\n<div class="panel" hidden>Only shown when opened</div>`,
        css: 'body { font: 18px/1.2 Georgia, serif; }\n.photo { background: #fee2e2; }\n.panel { display: flex; }',
      },
      teach: [
        'Every browser ships a **user-agent stylesheet**: margins on headings and paragraphs, padded bulleted lists, inline images, system fonts in form controls, and they differ between browsers. A reset at the very start of your CSS gives every project the same predictable starting point.',
        { code: '*, *::before, *::after { box-sizing: border-box; }       /* Part 18 */\n* { margin: 0; padding: 0; }                              /* all spacing becomes deliberate */\nhtml { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }   /* no surprise text inflation on mobile */\nbody { min-height: 100vh; min-height: 100dvh; line-height: 1.5; }\nimg, picture, video, canvas, svg { display: block; max-width: 100%; }\ninput, button, textarea, select { font: inherit; }\nbutton { cursor: pointer; }\n[hidden] { display: none !important; }', lang: 'css' },
        { list: ['Images are `inline` by default, so they sit on the text baseline and leave a gap of a few pixels under them (room for letters like "g"). `display: block` removes it.', '`100vh` on mobile is the height with the browser bars **hidden**, so a full-height section is cut off when they show. `100dvh` follows the bars; keep `100vh` first as the fallback.', 'An author `display` rule beats the `hidden` attribute (it is only a browser default), so a "hidden" element with `.panel { display: flex }` shows. `[hidden] { display: none !important; }` is the one justified `!important` in a reset.'] },
        { warn: 'Do not remove list markers everywhere. Navigation lists can lose them; reading lists (ingredients, numbered steps) should keep them, along with enough padding for the numbers to show.' },
        '**normalize.css** is the gentler alternative: instead of zeroing everything, it keeps the useful defaults and only fixes the differences **between** browsers. Many teams use a short reset like the one above on top of the browser defaults.',
      ],
      example: [
        { code: 'nav ul { list-style: none; }\n.prose ol, .prose ul { padding-inline-start: 1.5rem; }   /* content lists keep their markers */', lang: 'css' },
      ],
      task: [
        { ol: ['`box-sizing: border-box` on every element and its `::before`/`::after`.', 'Zero margin and padding on every element.', '`body`: `line-height: 1.5`, and at least the full **dynamic** viewport height (`100vh` fallback, then `100dvh`).', 'Images (and picture, video, canvas, svg): block, at most 100% wide, so the photo leaves no gap under it.', 'Form controls inherit the page font; buttons get a pointer cursor.', '`nav ul`: no bullets. `.steps` keeps its numbers with `padding-inline-start: 1.5rem`.', 'Make the `hidden` attribute win over `.panel { display: flex }`.'] },
      ],
      starter: '* {\n  margin: 0;\n  padding: 0;\n}\n\nul, ol {\n  list-style: none;\n}\n',
      solution: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n}\n\nhtml {\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n}\n\nbody {\n  min-height: 100vh;\n  min-height: 100dvh;\n  line-height: 1.5;\n}\n\nimg,\npicture,\nvideo,\ncanvas,\nsvg {\n  display: block;\n  max-width: 100%;\n}\n\ninput,\nbutton,\ntextarea,\nselect {\n  font: inherit;\n}\n\nbutton {\n  cursor: pointer;\n}\n\nnav ul {\n  list-style: none;\n}\n\n.steps {\n  padding-inline-start: 1.5rem;\n}\n\n[hidden] {\n  display: none !important;\n}\n',
      checks: [
        { label: 'border-box everywhere', mistake: '*, *::before, *::after { box-sizing: border-box; }', check: ({ $ }) => (getComputedStyle($('h1')).boxSizing === 'border-box' && getComputedStyle($('h1'), '::before').boxSizing === 'border-box' && getComputedStyle($('input')).boxSizing === 'border-box') || 'box-sizing is not border-box on elements and their pseudo-elements' },
        { label: 'default spacing removed', mistake: '* { margin: 0; padding: 0; }', check: ({ document, $ }) => { const els = [document.body, $('h1'), $('p'), $('.photo'), $('.nav-list')]; const bad = els.filter((el) => { const s = getComputedStyle(el); return s.marginTop !== '0px' || s.marginLeft !== '0px' || s.paddingLeft !== '0px'; }).map((el) => el.tagName.toLowerCase()); return bad.length === 0 || `still spaced by the browser: ${bad.join(', ')}`; } },
        { label: 'body height and line height', mistake: 'body { min-height: 100vh; min-height: 100dvh; line-height: 1.5; }', check: ({ document, h }) => { const s = getComputedStyle(document.body); const decl = h.declared(document.querySelector('style[data-source="learner"]').sheet, 'body', 'min-height'); return (s.lineHeight === '27px' && /dvh/.test(decl) && Math.round(parseFloat(s.minHeight)) === window.innerHeight) || `line-height ${s.lineHeight}, min-height ${decl || 'not set'}`; } },
        { label: 'no gap under images', mistake: 'img, picture, video, canvas, svg { display: block; max-width: 100%; }', check: ({ $, rect }) => { const gap = Math.round(rect('.photo').height - rect('.photo img').height); return (getComputedStyle($('img')).display === 'block' && getComputedStyle($('img')).maxWidth === '100%' && gap === 0) || `the figure is ${gap}px taller than its image`; } },
        { label: 'controls inherit the font', mistake: 'input, button, textarea, select { font: inherit; } and button { cursor: pointer; }', check: ({ document, $ }) => { const body = getComputedStyle(document.body); const ok = ['input', 'button'].every((sel) => getComputedStyle($(sel)).fontFamily === body.fontFamily && getComputedStyle($(sel)).fontSize === body.fontSize); return (ok && getComputedStyle($('button')).cursor === 'pointer') || 'form controls do not use the page font, or the button has no pointer cursor'; } },
        { label: 'nav lists bare, content lists numbered', mistake: 'nav ul { list-style: none; } and .steps { padding-inline-start: 1.5rem; } (it keeps list-style: decimal).', check: ({ $ }) => { const nav = getComputedStyle($('.nav-list')).listStyleType; const steps = getComputedStyle($('.steps')); return (nav === 'none' && steps.listStyleType === 'decimal' && steps.paddingLeft === '24px') || `nav list-style ${nav}; steps list-style ${steps.listStyleType}, padding ${steps.paddingLeft}`; } },
        { label: 'hidden really hides', mistake: '[hidden] { display: none !important; }: .panel { display: flex } otherwise beats the attribute.', check: ({ $ }) => getComputedStyle($('.panel')).display === 'none' || 'the hidden panel is visible' },
      ],
    },
    {
      id: 'css-modern-features',
      title: 'Modern CSS: nesting, aspect-ratio, text-wrap and color-scheme',
      source: 'HTML & CSS course, Part 37',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<nav class="nav"><a href="/">Home</a><a href="/shop">Shop</a><a href="/about">About</a></nav>\n<div class="video">Video</div>\n<div class="thumb">Thumb</div>\n<h2 class="headline">The complete guide to choosing safe wooden toys for toddlers</h2>',
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\n.video { width: 320px; background: #0f172a; color: white; }\n.thumb { width: 120px; background: #fde68a; }\n.headline { width: 420px; }',
      },
      teach: [
        { h: 'Native nesting' },
        { code: '.card {\n  padding: 1rem;\n  & .card-title { font-weight: 700; }   /* .card .card-title */\n  &:hover { border-color: #4f46e5; }    /* .card:hover */\n}', lang: 'css' },
        '`&` is the parent selector. No preprocessor is needed in current browsers. Keep nesting shallow (two levels): deep nesting recreates the long selector chains Part 35 warned about.',
        { h: 'Smaller modern tools' },
        { list: ['`aspect-ratio: 16 / 9`: set the width and the browser computes the height (no more padding-top hacks).', '`text-wrap: balance`: evens out line lengths in short text like headings, so a heading does not end with one orphaned word. (`text-wrap: pretty` is the gentler version for paragraphs.)', '`color-scheme: light dark` on `:root`: the browser styles its own UI (scrollbars, form controls, default canvas) to match the user\'s theme (Part 43).', '`accent-color` (Part 34), container queries (Part 27), `:has()` and `:where()` (Parts 14–15), cascade layers (Part 15).'] },
      ],
      example: [
        { code: '.square-thumbnail { width: 100%; aspect-ratio: 1; object-fit: cover; }\nh1, h2, h3 { text-wrap: balance; }', lang: 'css' },
      ],
      task: [
        { ol: ['Using native nesting inside one `.nav` rule: `.nav` is a flex row with `gap: 16px`; its links are `#111827` with no underline, and on hover (nested `&:hover` inside the link rule) they turn `#4f46e5`.', '`.video`: a 16:9 box (180px tall at its 320px width) with `aspect-ratio`.', '`.thumb`: a square.', '`.headline`: balanced wrapping.', '`:root`: supports both light and dark colour schemes.'] },
      ],
      starter: '.nav {\n  display: flex;\n}\n\n.nav a {\n  color: #111827;\n}\n\n.video {\n  height: 180px;\n}\n',
      solution: '.nav {\n  display: flex;\n  gap: 16px;\n\n  & a {\n    color: #111827;\n    text-decoration: none;\n\n    &:hover {\n      color: #4f46e5;\n    }\n  }\n}\n\n.video {\n  aspect-ratio: 16 / 9;\n}\n\n.thumb {\n  aspect-ratio: 1;\n}\n\n.headline {\n  text-wrap: balance;\n}\n\n:root {\n  color-scheme: light dark;\n}\n',
      checks: [
        { label: 'nav written with nesting', mistake: 'One .nav rule containing a nested `& a { … }` rule, which itself contains `&:hover { color: #4f46e5; }`.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const nav = [...sheet.cssRules].find((r) => r.selectorText === '.nav' && r.cssRules && r.cssRules.length); const link = nav && [...nav.cssRules].find((r) => r.selectorText && /a$/.test(r.selectorText.trim())); const hover = link && link.cssRules && [...link.cssRules].find((r) => /&:hover/.test(r.selectorText)); return Boolean(hover && h.sameValue('color', hover.style.color, '#4f46e5')) || (nav ? (link ? 'no nested &:hover rule with color #4f46e5 inside the link rule' : 'no nested & a rule inside .nav') : 'no .nav rule with nested rules'); } },
        { label: 'nav styles apply', mistake: '.nav: display flex, gap 16px; links #111827 with text-decoration none.', check: ({ $, h }) => { const nav = getComputedStyle($('.nav')); const a = getComputedStyle($('.nav a')); return (nav.display === 'flex' && nav.columnGap === '16px' && h.sameValue('color', a.color, '#111827') && a.textDecorationLine === 'none') || `nav ${nav.display} gap ${nav.columnGap}; links ${a.color}, decoration ${a.textDecorationLine}`; } },
        { label: 'aspect ratios', mistake: '.video { aspect-ratio: 16 / 9; } and .thumb { aspect-ratio: 1; } with no fixed heights.', check: ({ document, rect, h }) => { const fixed = h.declared(document.querySelector('style[data-source="learner"]').sheet, '.video', 'height'); return (!fixed && Math.round(rect('.video').height) === 180 && Math.round(rect('.thumb').height) === 120) || (fixed ? 'remove the fixed height: aspect-ratio computes it' : `video ${Math.round(rect('.video').height)}px, thumb ${Math.round(rect('.thumb').height)}px tall`); } },
        { label: 'balanced heading', mistake: '.headline { text-wrap: balance; }', check: ({ $ }) => { const s = getComputedStyle($('.headline')); return (s.textWrapStyle === 'balance' || /balance/.test(s.textWrap || '')) || 'the headline does not use text-wrap: balance'; } },
        { label: 'colour schemes', mistake: ':root { color-scheme: light dark; }', check: ({ document }) => getComputedStyle(document.documentElement).colorScheme === 'light dark' || `color-scheme is ${getComputedStyle(document.documentElement).colorScheme}` },
      ],
    },
    {
      id: 'css-modern-layout',
      title: 'Scroll snap, smooth scrolling and subgrid',
      source: 'HTML & CSS course, Part 37',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="carousel" aria-label="Featured toys"><div class="slide">Train set</div><div class="slide">Puzzle</div><div class="slide">Blocks</div></div>\n<div class="products">\n  <article class="product"><h3>Train set</h3><p>24 magnetic carriages.</p><span class="price">₹1,499</span></article>\n  <article class="product"><h3>Wooden alphabet puzzle with 26 chunky letters</h3><p>Ages 3 and up.</p><span class="price">₹699</span></article>\n  <article class="product"><h3>Blocks</h3><p>100 pieces in 8 colours, with a canvas storage bag.</p><span class="price">₹999</span></article>\n</div>',
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\n.carousel { width: 300px; margin-bottom: 24px; }\n.slide { height: 120px; background: #e0e7ff; display: grid; place-items: center; }\n.products { display: grid; grid-template-columns: repeat(3, 200px); gap: 16px; }\n.product { border: 1px solid #cbd5e1; padding: 12px; }\n.product h3, .product p { margin: 0; }',
      },
      teach: [
        { h: 'Scroll snap' },
        { code: '.carousel {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;   /* axis + strictness (or proximity) */\n}\n.slide {\n  flex: 0 0 100%;\n  scroll-snap-align: start;        /* start | center | end */\n}', lang: 'css' },
        'A swipeable carousel with no JavaScript: when scrolling stops, the browser settles on the nearest slide. Keep it reachable without swiping too (visible scrollbar or next/previous buttons), and give the scroller an accessible name.',
        { h: 'Smooth anchor scrolling' },
        '`html { scroll-behavior: smooth; }` animates jumps to `#section` links. It is motion, so turn it off under `prefers-reduced-motion: reduce`.',
        { h: 'Subgrid' },
        'A nested grid normally has its own independent tracks, so in a row of cards the titles, descriptions and prices only line up if every title happens to be the same length. `grid-template-rows: subgrid` makes a card use **the parent grid\'s rows** instead: the tallest title in the row sets the title track for all of them.',
        { code: '.products { display: grid; grid-template-columns: repeat(3, 1fr); }\n.product {\n  display: grid;\n  grid-row: span 3;               /* the card takes three of the parent\'s rows */\n  grid-template-rows: subgrid;    /* and uses them for its title, text and price */\n}', lang: 'css' },
      ],
      example: [
        { code: 'html { scroll-behavior: smooth; }\n@media (prefers-reduced-motion: reduce) {\n  html { scroll-behavior: auto; }\n}', lang: 'css' },
      ],
      task: [
        { ol: ['`.carousel`: a horizontal flex scroller that snaps strictly (`x mandatory`); each `.slide` is exactly the carousel\'s width, never shrinks, and snaps at its start.', '`html`: smooth scrolling, switched back to `auto` for users who prefer reduced motion.', '`.product`: a grid spanning 3 of the parent\'s rows, using `subgrid`, so all three descriptions start at the same height and all three prices line up.'] },
      ],
      starter: '.carousel {\n  display: flex;\n  overflow-x: auto;\n}\n\n.product {\n  display: flex;\n  flex-direction: column;\n}\n\n.price {\n  margin-top: auto;\n}\n',
      solution: '.carousel {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n}\n\n.slide {\n  flex: 0 0 100%;\n  scroll-snap-align: start;\n}\n\nhtml {\n  scroll-behavior: smooth;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html {\n    scroll-behavior: auto;\n  }\n}\n\n.product {\n  display: grid;\n  grid-row: span 3;\n  grid-template-rows: subgrid;\n}\n',
      checks: [
        { label: 'snapping scroller', mistake: '.carousel { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }', check: ({ $ }) => { const s = getComputedStyle($('.carousel')); return (s.display === 'flex' && s.overflowX === 'auto' && s.scrollSnapType === 'x mandatory') || `carousel: ${s.display}, overflow-x ${s.overflowX}, snap ${s.scrollSnapType}`; } },
        { label: 'full-width slides', mistake: '.slide { flex: 0 0 100%; scroll-snap-align: start; }', check: ({ $, $$, rect }) => { const widths = $$('.slide').map((x) => Math.round(rect(x).width)); const s = getComputedStyle($('.slide')); return (widths.every((w) => w === 300) && s.flexShrink === '0' && s.scrollSnapAlign.trim() === 'start' && $('.carousel').scrollWidth >= 900) || `slides ${widths.join('/')}px, flex-shrink ${s.flexShrink}, snap-align ${s.scrollSnapAlign}`; } },
        { label: 'smooth scroll respecting reduced motion', mistake: 'html { scroll-behavior: smooth; } and inside @media (prefers-reduced-motion: reduce): html { scroll-behavior: auto; }', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const calm = h.mediaRules(sheet, 'prefers-reduced-motion:reduce').some((r) => r.selectorText === 'html' && r.style.scrollBehavior === 'auto'); return (getComputedStyle(document.documentElement).scrollBehavior === 'smooth' && calm) || (calm ? 'html does not scroll smoothly' : 'no reduced-motion override for scroll-behavior'); } },
        { label: 'cards share the parent rows', mistake: '.product { display: grid; grid-row: span 3; grid-template-rows: subgrid; }: descriptions and prices align across cards.', check: ({ document, $$, rect, h }) => { const tops = (sel) => $$(sel).map((x) => Math.round(rect(x).top)); const p = tops('.product p'); const price = tops('.price'); const sub = /subgrid/.test(h.declared(document.querySelector('style[data-source="learner"]').sheet, '.product', 'grid-template-rows')); return (sub && new Set(p).size === 1 && new Set(price).size === 1) || (sub ? `description tops ${p.join('/')}, price tops ${price.join('/')}` : 'use grid-template-rows: subgrid on .product'); } },
      ],
    },
    {
      id: 'css-logical-properties',
      title: 'Logical properties for every writing direction',
      source: 'HTML & CSS course, Part 38',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<blockquote class="quote">Play is the work of childhood.</blockquote>\n<blockquote class="quote" dir="rtl">اللعب هو عمل الطفولة</blockquote>\n<div class="card"><span class="badge">New</span><p class="card-text"><span class="icon">★</span>Bestseller</p></div>\n<div class="card" dir="rtl"><span class="badge">جديد</span><p class="card-text"><span class="icon">★</span>الأكثر مبيعاً</p></div>',
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\n.card { position: relative; border: 1px solid #cbd5e1; margin-bottom: 16px; }\n.badge { background: #fde68a; padding: 2px 8px; }\n.card-text { margin: 0; }',
      },
      teach: [
        '`margin-left` always means the physical left of the screen. In Arabic, Hebrew or Urdu the text runs right to left, so spacing "before the text" belongs on the **right**. Logical properties follow the text direction instead:',
        { list: ['**inline** axis: the direction text runs in a line (horizontal in English and Arabic); **start** is where a line begins: left in LTR, right in RTL.', '**block** axis: the direction lines stack (top to bottom).'] },
        { table: { head: ['Physical', 'Logical'], rows: [['`width` / `height`', '`inline-size` / `block-size`'], ['`margin-left` / `margin-right`', '`margin-inline-start` / `margin-inline-end`'], ['`margin-top` + `margin-bottom`', '`margin-block`'], ['`padding-left` + `padding-right`', '`padding-inline`'], ['`top` / `right` / `bottom` / `left`', '`inset-block-start` / `inset-inline-end` / `inset-block-end` / `inset-inline-start`'], ['`border-left`', '`border-inline-start`'], ['`text-align: left`', '`text-align: start`']] } },
        'Even on an English-only site, many teams default to logical properties: they are as short to write (`margin-inline: auto`, `padding-block: 1rem`) and the layout is ready if an Urdu or Arabic version ever ships.',
      ],
      example: [
        { code: '.quote {\n  border-inline-start: 3px solid #4f46e5;   /* left in English, right in Arabic */\n  padding-inline-start: 1rem;\n}', lang: 'css' },
      ],
      task: [
        'Use only logical properties. The second quote and the second card are `dir="rtl"`.',
        { ol: ['`.quote`: a `4px solid #4f46e5` border on the start side, `16px` padding on the start side, `24px` margin above and below, no margin on the inline sides.', '`.card`: `padding-block: 12px`, `padding-inline: 16px`, and an inline size of `300px`.', '`.badge`: absolutely positioned `8px` from the top and `8px` from the **end** side.', '`.icon`: `8px` of space after it (on the end side).'] },
      ],
      starter: '.quote {\n  border-left: 4px solid #4f46e5;\n  padding-left: 16px;\n  margin: 24px 0;\n}\n\n.badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}\n',
      solution: '.quote {\n  border-inline-start: 4px solid #4f46e5;\n  padding-inline-start: 16px;\n  margin-block: 24px;\n  margin-inline: 0;\n}\n\n.card {\n  padding-block: 12px;\n  padding-inline: 16px;\n  inline-size: 300px;\n}\n\n.badge {\n  position: absolute;\n  inset-block-start: 8px;\n  inset-inline-end: 8px;\n}\n\n.icon {\n  margin-inline-end: 8px;\n}\n',
      checks: [
        { label: 'quote border follows the direction', mistake: '.quote { border-inline-start: 4px solid #4f46e5; padding-inline-start: 16px; }', check: ({ $$, h }) => { const [ltr, rtl] = $$('.quote').map((q) => getComputedStyle(q)); const ok = ltr.borderLeftWidth === '4px' && ltr.borderRightStyle === 'none' && ltr.paddingLeft === '16px' && rtl.borderRightWidth === '4px' && rtl.borderLeftStyle === 'none' && rtl.paddingRight === '16px' && h.sameValue('color', rtl.borderRightColor, '#4f46e5'); return ok || `LTR quote border-left ${ltr.borderLeftWidth}; RTL quote border-right ${rtl.borderRightWidth}, border-left ${rtl.borderLeftStyle}`; } },
        { label: 'quote block margins', mistake: '.quote { margin-block: 24px; margin-inline: 0; }', check: ({ $$ }) => { const s = getComputedStyle($$('.quote')[1]); return (s.marginTop === '24px' && s.marginBottom === '24px' && s.marginLeft === '0px' && s.marginRight === '0px') || `margins ${s.marginTop} ${s.marginRight} ${s.marginBottom} ${s.marginLeft}`; } },
        { label: 'card padding and size', mistake: '.card { padding-block: 12px; padding-inline: 16px; inline-size: 300px; }', check: ({ $$, rect }) => { const c = $$('.card'); const s = getComputedStyle(c[1]); return (s.paddingTop === '12px' && s.paddingRight === '16px' && s.paddingLeft === '16px' && Math.round(rect(c[0]).width) === 334) || `padding ${s.paddingTop} ${s.paddingRight}, width ${Math.round(rect(c[0]).width)}px (300 + padding + border = 334)`; } },
        { label: 'badge on the end side', mistake: '.badge { position: absolute; inset-block-start: 8px; inset-inline-end: 8px; }', check: ({ $$, rect }) => { const [c1, c2] = $$('.card').map((x) => rect(x)); const [b1, b2] = $$('.badge').map((x) => rect(x)); const ok = Math.round(c1.right - b1.right) === 9 && Math.round(b2.left - c2.left) === 9 && Math.round(b1.top - c1.top) === 9; return ok || `LTR badge is ${Math.round(c1.right - b1.right)}px from the right; RTL badge is ${Math.round(b2.left - c2.left)}px from the left (want 9 = 8 + border)`; } },
        { label: 'icon spacing after it', mistake: '.icon { margin-inline-end: 8px; }', check: ({ $$ }) => { const [a, b] = $$('.icon').map((x) => getComputedStyle(x)); return (a.marginRight === '8px' && a.marginLeft === '0px' && b.marginLeft === '8px' && b.marginRight === '0px') || `LTR icon margins ${a.marginLeft}/${a.marginRight}, RTL ${b.marginLeft}/${b.marginRight}`; } },
        { label: 'no physical properties', mistake: 'Replace left/right/top properties with their logical equivalents.', check: ({ document }) => { const css = [...document.querySelector('style[data-source="learner"]').sheet.cssRules].map((r) => r.cssText).join('\n'); const found = css.match(/(?:^|[\s;{])((?:margin|padding|border)-(?:left|right|top|bottom)|left|right|top|width)\s*:/m); return !found || `physical property used: ${found[1]}`; } },
      ],
    },
  ],
};
