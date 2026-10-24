// HTML & CSS course, Parts 46–47: layout patterns and debugging.
export default {
  id: 'css-layouts-debugging',
  title: 'Layout patterns and debugging',
  lessons: [
    {
      id: 'css-layout-patterns',
      title: 'Page layouts: holy grail, sticky footer, split and masonry',
      source: 'HTML & CSS course, Part 46',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<header class="hg-header">ToyShop</header>\n<nav class="hg-nav" aria-label="Categories">Categories</nav>\n<main class="hg-main">\n  <section class="hero"><h1>Monsoon sale</h1></section>\n  <div class="split"><div>Free delivery in Mumbai</div><div>Easy 30-day returns</div></div>\n  <div class="masonry"><div class="tile">Trains</div><div class="tile">Puzzles<br>and games</div><div class="tile">Blocks</div><div class="tile">Dolls</div><div class="tile">Art<br>supplies</div><div class="tile">Outdoor</div></div>\n</main>\n<aside class="hg-aside">Offers</aside>\n<footer class="hg-footer">© 2026 ToyShop, Mumbai</footer>',
        css: '*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font: 16px/1.4 Arial, sans-serif; }\n.hg-header, .hg-footer { background: #1e293b; color: white; padding: 8px 16px; }\n.hg-nav, .hg-aside { background: #f1f5f9; padding: 8px; }\n.hg-main { padding: 16px; }\n.hero h1 { margin: 0; }\n.tile { background: #e0e7ff; padding: 8px; }',
      },
      teach: [
        'Most pages are a handful of recurring patterns, each built from the tools of Parts 24–28:',
        { table: { head: ['Pattern', 'Core CSS'], rows: [['Centred container', '`width: min(100% - 2rem, 1200px); margin-inline: auto;`'], ['Full-bleed hero', '`min-height: 60vh; display: flex; align-items: center; justify-content: center;`'], ['Split / sidebar', 'one column on phones, `grid-template-columns: 1fr 1fr` (or `260px 1fr`) from a breakpoint'], ['Holy grail', 'header, nav, main, aside, footer with `grid-template-areas`'], ['Sticky footer', 'body as a column flex (`main { flex: 1 }`) or grid (`grid-template-rows: auto 1fr auto`) with `min-height: 100dvh`'], ['Masonry approximation', '`columns: 3 250px;` with `break-inside: avoid` on the items']] } },
        { h: 'Sticky footer, precisely' },
        'With `min-height: 100dvh` on the body and the main region given all **leftover** space (`flex: 1`, or the `1fr` row), a short page pushes the footer to the bottom of the screen, and a long page lets it follow the content normally. It is not `position: fixed`: it never covers content.',
        { h: 'Masonry' },
        'CSS multi-column layout flows items down column 1, then column 2: the reading order goes **down** columns, not across rows, so it suits independent tiles (photos), not ordered lists. A native `display: grid-lanes` / masonry layout is being standardised but is not safe to rely on yet; `columns` is the dependable fallback.',
      ],
      example: [
        { code: 'body { display: flex; flex-direction: column; min-height: 100dvh; }\nmain { flex: 1; }', lang: 'css' },
      ],
      task: [
        'Mobile-first. The `body` is the layout container.',
        { ol: ['`body`: a grid at least `100dvh` tall. On phones one column, areas in the order header, nav, main, aside, footer, with the **main** row taking the leftover height. From `900px`: columns `200px 1fr 200px`, rows `auto 1fr auto`, areas `"header header header" "nav main aside" "footer footer footer"`. Assign the five regions with `grid-area` (names `header`, `nav`, `main`, `aside`, `footer`).', '`.hero`: at least `30vh` tall, its heading centred both ways with flex, a `135deg` gradient from `#4f46e5` to `#7c3aed`, white text.', '`.split`: one column with `gap: 32px` on phones; two equal columns from `768px`.', '`.masonry`: `columns: 3 200px` with `column-gap: 16px`; each `.tile` avoids breaking across columns and has `margin-bottom: 16px`.'] },
      ],
      starter: 'body {\n  display: grid;\n  grid-template-columns: 200px 1fr 200px;\n}\n\n.hg-footer {\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n}\n',
      solution: 'body {\n  display: grid;\n  min-height: 100dvh;\n  grid-template-rows: auto auto 1fr auto auto;\n  grid-template-areas:\n    "header"\n    "nav"\n    "main"\n    "aside"\n    "footer";\n}\n\n.hg-header { grid-area: header; }\n.hg-nav { grid-area: nav; }\n.hg-main { grid-area: main; }\n.hg-aside { grid-area: aside; }\n.hg-footer { grid-area: footer; }\n\n@media (min-width: 900px) {\n  body {\n    grid-template-columns: 200px 1fr 200px;\n    grid-template-rows: auto 1fr auto;\n    grid-template-areas:\n      "header header header"\n      "nav main aside"\n      "footer footer footer";\n  }\n}\n\n.hero {\n  min-height: 30vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: linear-gradient(135deg, #4f46e5, #7c3aed);\n  color: white;\n}\n\n.split {\n  display: grid;\n  gap: 32px;\n}\n\n@media (min-width: 768px) {\n  .split {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n\n.masonry {\n  columns: 3 200px;\n  column-gap: 16px;\n}\n\n.tile {\n  break-inside: avoid;\n  margin-bottom: 16px;\n}\n',
      checks: [
        { label: 'holy grail on wide screens', mistake: 'From 900px: grid-template-columns: 200px 1fr 200px; rows auto 1fr auto; areas "header header header" "nav main aside" "footer footer footer".', check: async ({ atWidth }) => { const v = await atWidth(1200); const [hd, nav, main, aside, ft] = ['.hg-header', '.hg-nav', '.hg-main', '.hg-aside', '.hg-footer'].map((s) => v.rect(s)); const ok = Math.round(hd.width) === v.width && Math.round(nav.width) === 200 && Math.round(aside.width) === 200 && Math.round(main.left) === 200 && Math.round(main.right) === v.width - 200 && Math.round(nav.top) === Math.round(hd.bottom) && Math.round(ft.width) === v.width; return ok || `at 1200px: header ${Math.round(hd.width)}px, nav ${Math.round(nav.width)}px, main from ${Math.round(main.left)} to ${Math.round(main.right)}, aside ${Math.round(aside.width)}px`; } },
        { label: 'footer at the bottom of a short page', mistake: 'body { min-height: 100dvh; } with the main row as 1fr: the footer reaches the bottom of the screen without position: fixed.', check: async ({ atWidth }) => { const v = await atWidth(1200); const ft = v.rect('.hg-footer'); const pos = v.style('.hg-footer', 'position'); return (pos === 'static' && Math.round(ft.bottom) === window.innerHeight) || (pos !== 'static' ? `the footer is position: ${pos}; it should stay in the flow` : `the footer ends at ${Math.round(ft.bottom)}px; the screen is ${window.innerHeight}px tall`); } },
        { label: 'one column on phones', mistake: 'Base styles: one column, areas header, nav, main, aside, footer.', check: async ({ atWidth }) => { const v = await atWidth(375); const order = ['.hg-header', '.hg-nav', '.hg-main', '.hg-aside', '.hg-footer'].map((s) => v.rect(s)); const stacked = order.every((r, i) => Math.round(r.width) === v.width && (i === 0 || Math.round(r.top) >= Math.round(order[i - 1].bottom))); return stacked || 'on a phone the five regions should stack full width in order: header, nav, main, aside, footer'; } },
        { label: 'centred hero', mistake: '.hero { min-height: 30vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; }', check: ({ $, rect }) => { const hero = rect('.hero'); const h1 = rect('.hero h1'); const s = getComputedStyle($('.hero')); const centred = Math.abs(hero.left + hero.width / 2 - (h1.left + h1.width / 2)) < 1 && Math.abs(hero.top + hero.height / 2 - (h1.top + h1.height / 2)) < 1; return (Math.round(hero.height) === Math.round(window.innerHeight * 0.3) && centred && /linear-gradient\(135deg, rgb\(79, 70, 229\), rgb\(124, 58, 237\)\)/.test(s.backgroundImage) && s.color === 'rgb(255, 255, 255)') || `hero ${Math.round(hero.height)}px tall (want ${Math.round(window.innerHeight * 0.3)}), heading centred: ${centred}`; } },
        { label: 'split stacks, then sits side by side', mistake: '.split { display: grid; gap: 32px; } and from 768px grid-template-columns: 1fr 1fr.', check: async ({ atWidth }) => { const phone = await atWidth(375); const [a1, b1] = phone.$$('.split > div').map((x) => x.getBoundingClientRect()); const stacked = Math.round(b1.top - a1.bottom) === 32; const wide = await atWidth(1024); const [a2, b2] = wide.$$('.split > div').map((x) => x.getBoundingClientRect()); const side = Math.round(a2.top) === Math.round(b2.top) && Math.round(b2.left - a2.right) === 32 && Math.abs(a2.width - b2.width) < 1; return (stacked && side) || `phone stacked with 32px gap: ${stacked}; 1024px side by side: ${side}`; } },
        { label: 'masonry columns', mistake: '.masonry { columns: 3 200px; column-gap: 16px; } and .tile { break-inside: avoid; margin-bottom: 16px; }', check: ({ $ }) => { const m = getComputedStyle($('.masonry')); const t = getComputedStyle($('.tile')); return (m.columnCount === '3' && m.columnWidth === '200px' && m.columnGap === '16px' && t.breakInside === 'avoid' && t.marginBottom === '16px') || `columns ${m.columnCount} × ${m.columnWidth}, gap ${m.columnGap}; tiles break-inside ${t.breakInside}`; } },
      ],
    },
    {
      id: 'css-debug-box-flow',
      title: 'Debugging: the box, display and the cascade',
      source: 'HTML & CSS course, Part 47',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="frame"><div class="card">Card that overflows its frame</div></div>\n<div class="hero-wrap"><section class="hero">Hero with no height</section></div>\n<nav><a class="nav-link" href="/">Home</a><a class="nav-link" href="/shop">Shop</a></nav>\n<div class="stack"><section class="section">One</section><section class="section">Two</section></div>\n<article><h3 class="cardTitle">Title that should be navy</h3></article>',
        css: '/* the buggy stylesheet you inherited */\nbody { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\n.frame { width: 400px; background: #f1f5f9; }\n.card { width: 100%; padding: 40px; border: 2px solid black; }\n.hero { height: 100%; background: #4f46e5; color: white; }\n.nav-link { width: 120px; background: #e0e7ff; text-align: center; }\n.section { margin-bottom: 40px; background: #ecfdf5; }\n.section + .section { margin-top: 20px; }\n.card-title { color: navy; }',
      },
      teach: [
        'Debugging is a process, not a guess: **isolate** the element, **inspect** what the browser actually computed, form **one** hypothesis, change one thing, verify.',
        { table: { head: ['Symptom', 'Check in DevTools', 'Usual cause'], rows: [['Rule not listed at all for the element', 'Elements → Styles', 'the selector does not match: typo or case (`.cardTitle` vs `.card-title`), wrong structure, or the browser re-nested invalid HTML (a `<div>` inside `<p>`)'], ['Rule listed but struck through', 'Styles', 'something wins the cascade: compare origin, layer, specificity, order (Part 15)'], ['`width` / `height` ignored', 'Computed → display', '`display: inline` (links, spans)'], ['Element wider than its parent', 'box-model diagram', '`content-box`: 100% + padding + border'], ['`height: 100%` gives 0', 'parent\'s height in Computed', 'the parent\'s height is `auto`, so the percentage has nothing to resolve against'], ['Gap smaller than the two margins added', 'box-model diagram', 'vertical margins collapse to the larger one (Part 18)']] } },
        'The Flexbox and Grid badges in the Styles pane overlay the lines and gaps; the device toolbar (responsive mode) tests breakpoints; the Computed pane shows the final value and links back to the rule that produced it.',
      ],
      example: [
        { code: '/* margins of flex/grid items never collapse, so gap gives exact spacing */\n.stack { display: flex; flex-direction: column; gap: 60px; }\n.stack > * { margin: 0; }', lang: 'css' },
      ],
      task: [
        'The fixture CSS is a buggy stylesheet. Without editing it, add rules that fix each symptom:',
        { ol: ['`.card` overflows the 400px frame: make it exactly 400px including padding and border.', '`.hero` has no height (`height: 100%` of an `auto`-height parent): give it `min-height: 200px` and drop the percentage.', '`.nav-link` ignores its 120px width: make it respect width while staying in the line.', 'The two `.section`s should be exactly **60px** apart, but the margins collapse to 40px: make `.stack` a flex column with a 60px gap and remove the sections\' margins.', 'The title should be navy, but the stylesheet\'s `.card-title` does not match the HTML\'s class. Style the class the HTML actually uses.'] },
      ],
      starter: '.card {\n  width: 360px;\n}\n',
      solution: '.card {\n  box-sizing: border-box;\n}\n\n.hero {\n  height: auto;\n  min-height: 200px;\n}\n\n.nav-link {\n  display: inline-block;\n}\n\n.stack {\n  display: flex;\n  flex-direction: column;\n  gap: 60px;\n}\n\n.stack > .section {\n  margin: 0;\n}\n\n.cardTitle {\n  color: navy;\n}\n',
      checks: [
        { label: 'card fits its frame', mistake: '.card { box-sizing: border-box; }: with content-box, 100% + 80px padding + 4px border = 484px.', check: ({ rect }) => Math.round(rect('.card').width) === 400 || `the card is ${Math.round(rect('.card').width)}px wide in a 400px frame` },
        { label: 'hero has a height', mistake: '.hero { height: auto; min-height: 200px; }: a percentage height needs a parent with a definite height.', check: ({ rect }) => Math.round(rect('.hero').height) >= 200 || `the hero is ${Math.round(rect('.hero').height)}px tall` },
        { label: 'links respect width', mistake: '.nav-link { display: inline-block; }: inline elements ignore width.', check: ({ $, $$, rect }) => { const [a, b] = $$('.nav-link').map((x) => rect(x)); return (Math.round(a.width) === 120 && Math.round(a.top) === Math.round(b.top) && getComputedStyle($('.nav-link')).display === 'inline-block') || `links are ${Math.round(a.width)}px wide, display ${getComputedStyle($('.nav-link')).display}`; } },
        { label: 'exactly 60px between sections', mistake: '.stack { display: flex; flex-direction: column; gap: 60px; } and margin: 0 on the sections.', check: ({ $$, rect }) => { const [a, b] = $$('.section').map((x) => rect(x)); return Math.round(b.top - a.bottom) === 60 || `the sections are ${Math.round(b.top - a.bottom)}px apart`; } },
        { label: 'matching selector', mistake: 'The HTML says class="cardTitle": .cardTitle { color: navy; } (class names are case-sensitive).', check: ({ $, h }) => h.sameValue('color', getComputedStyle($('.cardTitle')).color, 'navy') || `the title is ${getComputedStyle($('.cardTitle')).color}` },
      ],
    },
    {
      id: 'css-debug-layout',
      title: 'Debugging: flex, grid, z-index and sticky',
      source: 'HTML & CSS course, Part 47',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="container"><aside class="sidebar">Filters</aside><main class="content">Supercalifragilisticexpialidocious-unbreakable-product-identifier</main></div>\n<div class="grid"><div>One</div><div>https://toyshop.example.in/catalogue/wooden-trains/figure-eight-set</div><div>Three</div></div>\n<div class="stage"><div class="parent"><span class="badge">Badge</span></div><div class="other-element">Other</div></div>\n<div class="scroller"><div class="sticky-wrap"><h2 class="sticky-title">Stays on top</h2><div class="long">Long content</div></div></div>',
        css: '/* the buggy stylesheet you inherited */\n*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\n.container { display: flex; width: 500px; margin-bottom: 16px; }\n.sidebar { width: 250px; background: #f1f5f9; }\n.content { flex: 1; background: #ecfdf5; }\n.grid { display: grid; grid-template-columns: repeat(3, 1fr); width: 600px; margin-bottom: 16px; }\n.grid > div { background: #e0e7ff; outline: 1px solid #6366f1; }\n.stage { position: relative; height: 120px; margin-bottom: 16px; }\n.parent { position: relative; z-index: 1; width: 200px; height: 100px; background: #fde68a; }\n.badge { position: absolute; top: 40px; left: 150px; z-index: 9999; background: #dc2626; color: white; padding: 4px 8px; }\n.other-element { position: absolute; top: 20px; left: 160px; z-index: 2; width: 200px; height: 80px; background: #94a3b8; }\n.scroller { overflow: hidden; }\n.sticky-title { position: sticky; top: 0; margin: 0; background: white; }\n.long { height: 1600px; background: linear-gradient(#f1f5f9, #cbd5e1); }',
      },
      teach: [
        { table: { head: ['Symptom', 'Cause', 'Fix'], rows: [['A `width: 250px` flex item is narrower', 'default `flex-shrink: 1`, and a sibling with long unbreakable content (min-width: auto) leaves no room', '`flex-shrink: 0` on the fixed item; `min-width: 0` on the flexible one'], ['One grid column is wider than `1fr`', 'grid items also default to their content minimum', '`minmax(0, 1fr)` and `overflow-wrap: anywhere`'], ['`z-index: 9999` loses to `z-index: 2`', 'an ancestor makes a stacking context (`position` + `z-index`, `opacity`, `transform`…)', 'compare the ancestors\' z-indexes, or remove the ancestor\'s context'], ['`position: sticky` does nothing', 'no offset, an ancestor with `overflow: hidden/auto/scroll`, or a parent no taller than the sticky element', 'set `top`, change the ancestor to `overflow: visible` or `clip`'], ['Horizontal scrollbar on the page', '`100vw` includes the vertical scrollbar', 'use `100%`']] } },
        '`overflow: clip` is the modern way to keep "hide whatever spills out" without breaking sticky children: unlike `hidden`, it does not make the element a scroll container, so the sticky element keeps sticking to the viewport.',
      ],
      example: [
        { code: '.layout { display: flex; }\n.sidebar { flex: 0 0 250px; }\n.content { flex: 1; min-width: 0; overflow-wrap: anywhere; }', lang: 'css' },
      ],
      task: [
        'Without editing the fixture CSS, add rules that fix each symptom:',
        { ol: ['`.sidebar` is squeezed below 250px by the long word in `.content`: keep it at 250px and let `.content` shrink and wrap the word.', 'The URL makes the middle `.grid` column wider than the others: make the three columns exactly equal and wrap the URL.', '`.badge` (z-index 9999) renders **under** `.other-element` (z-index 2): make the badge appear on top by fixing its parent\'s stacking context, without touching the badge\'s z-index or `.other-element`.', '`.sticky-title` does not stick while the page scrolls, because `.scroller` has `overflow: hidden`: keep clipping overflow but let the title stick.'] },
      ],
      starter: '.badge {\n  z-index: 99999;\n}\n\n.sidebar {\n  min-width: 250px;\n}\n',
      solution: '.sidebar {\n  flex-shrink: 0;\n}\n\n.content {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n\n.grid {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n\n.grid > div {\n  overflow-wrap: anywhere;\n}\n\n.parent {\n  z-index: 3;\n}\n\n.scroller {\n  overflow: clip;\n}\n',
      checks: [
        { label: 'sidebar keeps its width', mistake: '.sidebar { flex-shrink: 0; } and .content { min-width: 0; overflow-wrap: anywhere; }', check: ({ $, rect }) => { const side = Math.round(rect('.sidebar').width); const c = $('.content'); return (side === 250 && Math.round(rect(c).width) === 250 && c.scrollWidth <= c.clientWidth + 1) || `sidebar ${side}px, content ${Math.round(rect(c).width)}px (content overflows: ${c.scrollWidth > c.clientWidth + 1})`; } },
        { label: 'equal grid columns', mistake: 'grid-template-columns: repeat(3, minmax(0, 1fr)) and overflow-wrap: anywhere on the items.', check: ({ $$, rect }) => { const w = $$('.grid > div').map((x) => Math.round(rect(x).width)); const urlCell = $$('.grid > div')[1]; return (w.every((x) => x === 200) && urlCell.scrollWidth <= urlCell.clientWidth + 1) || `column widths ${w.join(' / ')}px`; } },
        { label: 'badge on top', mistake: 'The badge is compared only inside .parent\'s stacking context (z-index 1 < 2). Give .parent a z-index above 2 (or make it auto), leaving the badge and .other-element alone.', check: ({ document, $, rect }) => { const b = rect('.badge'); const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); const untouched = getComputedStyle($('.badge')).zIndex === '9999' && getComputedStyle($('.other-element')).zIndex === '2'; return (top === $('.badge') && untouched) || (untouched ? 'the badge is still hidden under .other-element' : 'leave the badge and .other-element z-indexes as they are; fix .parent'); } },
        { label: 'sticky title sticks', mistake: '.scroller { overflow: clip; }: hidden makes it a scroll container, which traps the sticky title.', check: async ({ $, rect, settle }) => { const start = rect('.sticky-title').top + window.scrollY; window.scrollTo(0, start + 300); await settle(); const top = Math.round(rect('.sticky-title').top); window.scrollTo(0, 0); await settle(); const clipped = ['clip', 'hidden'].includes(getComputedStyle($('.scroller')).overflowY); return (top === 0 && clipped) || (clipped ? `after scrolling, the title is at ${top}px instead of 0` : 'keep the overflow clipped (overflow: clip)'); } },
      ],
    },
    {
      id: 'css-debugging-quiz',
      title: 'Debugging check',
      source: 'HTML & CSS course, Part 47',
      runner: 'quiz',
      teach: [
        { code: '1. Select the element in DevTools.\n2. Is your rule listed in Styles?\n   no  → the selector does not match (typo, case, structure, re-nested HTML)\n   yes, struck through → something wins the cascade: find the declaration that is not struck\n   yes, not struck, still wrong → check Computed and the box model: display, box-sizing,\n                                    containing block, stacking context, flex/grid sizing\n3. Change one thing, re-check.', lang: 'text' },
      ],
      example: [
        { code: '<p>Text <div class="callout">Box</div></p>\n<!-- the parser closes the <p> before the <div>: your p .callout selector never matches -->', lang: 'html' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Your rule does not appear in the Styles pane for the element at all. What is the most likely cause?', options: ['Low specificity', 'The selector does not match the element', 'A transition delay', 'The browser cache'], answer: 1, explain: 'Rules that match but lose are shown struck through.' },
        { q: '`.card { width: 100%; padding: 40px; border: 2px solid; }` overflows its parent. Why?', options: ['Borders are not allowed with width 100%', 'With content-box, padding and border are added on top of the 100%', 'Padding is percentage-based', 'Cards are inline'], answer: 1, explain: 'box-sizing: border-box includes them in the width.' },
        { q: 'A `z-index: 9999` badge renders behind a sibling of its parent with `z-index: 2`. The parent has `position: relative; z-index: 1`. Why?', options: ['z-index max is 999', 'The badge is compared only inside its parent\'s stacking context, which ranks 1 < 2', 'Absolute elements ignore z-index', 'The sibling is fixed'], answer: 1, explain: 'Fix the ancestors, not the number.' },
        { q: '`position: sticky; top: 0` does not stick. Which ancestor style is the usual culprit?', options: ['display: flex', 'overflow: hidden or auto', 'color', 'margin: 0 auto'], answer: 1, explain: 'It creates a scroll container the sticky element sticks within. overflow: clip does not.' },
        { q: '`.hero { height: 100%; }` is 0px tall. Why?', options: ['100% is invalid for height', 'The parent\'s height is auto, so the percentage cannot resolve', 'Heroes need min-height', 'The hero is inline'], answer: 1, explain: 'Use min-height, or give every ancestor a definite height.' },
        { q: '`width: 100vw` on a section causes a horizontal scrollbar on desktop. Why?', options: ['vw is rounded up', '100vw includes the width of the vertical scrollbar', 'Sections have margins', 'It does not'], answer: 1, explain: 'Use 100% instead.' },
      ],
    },
  ],
};
