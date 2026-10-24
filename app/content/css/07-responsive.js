// HTML & CSS course, Parts 26–27: responsive design and container queries.
// Media queries are tested with atWidth(), which renders a copy of the page
// in an off-screen frame of the given width.
const THUMB = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23f59e0b'/%3E%3Crect x='40' y='120' width='220' height='40' fill='%23b45309'/%3E%3C/svg%3E";

export default {
  id: 'css-responsive',
  title: 'Responsive design and container queries',
  lessons: [
    {
      id: 'css-media-queries',
      title: 'Mobile-first media queries',
      source: 'HTML & CSS course, Part 26',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<header class="site-header"><h1 class="title">Toy Shop</h1><button class="menu-btn" type="button">Menu</button><ul class="nav-links"><li>Trains</li><li>Puzzles</li><li>Blocks</li></ul></header>\n<div class="layout"><aside class="sidebar">Filters</aside><main class="content"><p class="tablet-tip">Tip: rotate your tablet to see more filters.</p><div class="card">Train set · ₹1,499</div></main></div>',
        css: 'body { margin: 0; font: 16px/1.4 Arial, sans-serif; }\n.title { margin: 0; font-size: 1.5rem; }\n.sidebar { background: #f1f5f9; }\n.content { background: #fff; }\n.nav-links { list-style: none; margin: 0; padding: 0; }\n.card { padding: 16px; border: 1px solid #cbd5e1; transition: transform 0.2s; }\n.menu-btn { padding: 4px 8px; }',
      },
      teach: [
        '**Responsive design** is one set of HTML and CSS that adapts to every screen, instead of a separate `m.example.com` site that drifts out of sync. It only works on phones if the page has `<meta name="viewport" content="width=device-width, initial-scale=1">`; without it, mobile browsers pretend to be ~980px wide and your queries never match.',
        { h: 'Media query syntax' },
        { code: '@media (min-width: 768px) { … }                        /* at least 768px */\n@media (max-width: 767px) { … }                        /* at most 767px */\n@media (min-width: 600px) and (max-width: 1023px) { … } /* a range; both ends inclusive */\n@media (600px <= width <= 1023px) { … }                /* modern range syntax, same thing */', lang: 'css' },
        { h: 'Mobile-first' },
        'Write the **base** styles for the smallest screen (usually one column), then add `min-width` queries that **add** layout as space grows. Desktop-first does the opposite: complex base styles that `max-width` queries must undo. Mobile-first wins because the base is simple, queries only add, and it forces you to decide what matters on a small screen.',
        { code: '.layout { display: grid; gap: 16px; }               /* phone: one column */\n@media (min-width: 768px) {\n  .layout { grid-template-columns: 250px 1fr; }   /* more room: add a sidebar */\n}', lang: 'css' },
        { h: 'Breakpoints come from your layout, not from devices' },
        'There are hundreds of screen widths. Widen the browser slowly and add a breakpoint where **your** design starts to look cramped or empty. 480 / 768 / 1024 / 1280 are rough starting points, not rules.',
        { h: 'Other media features' },
        { list: ['`(hover: hover)`: the device can really hover. Wrap hover effects in it so a tap on a phone does not leave a stuck hover state.', '`(pointer: coarse)`: a finger; make targets at least 44 × 44px. `(pointer: fine)`: a mouse.', '`(orientation: landscape)`, `(prefers-color-scheme: dark)` (Part 43), `(prefers-reduced-motion: reduce)` (Part 32).'] },
        { warn: 'Mixing `min-width: 768px` and `max-width: 768px` makes both match at exactly 768px. Pair 768 with 767, or use the range syntax with `<`.' },
      ],
      example: [
        { code: '.menu-btn { display: block; }\n.nav-links { display: none; }\n\n@media (min-width: 768px) {\n  .menu-btn { display: none; }\n  .nav-links { display: flex; gap: 16px; }\n}', lang: 'css' },
      ],
      task: [
        'Mobile-first: base styles for phones, `min-width` queries for larger screens.',
        { ol: ['`.layout`: one column on phones (sidebar above content, full width). From 768px: a grid with a 250px sidebar and a flexible content column.', 'Phones show `.menu-btn` and hide `.nav-links`. From 768px: hide the button and show the links as a flex row with `gap: 16px`.', '`.tablet-tip`: visible only from 600px to 1023px (hidden below and above).', '`.card:hover` lifts the card (`transform: translateY(-4px)`), but only on devices that can hover.', 'On coarse pointers, `button` gets `min-height: 44px`.'] },
      ],
      starter: '.layout {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n}\n\n@media (max-width: 767px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}\n\n.card:hover {\n  transform: translateY(-4px);\n}\n',
      solution: '.layout {\n  display: grid;\n}\n\n.menu-btn {\n  display: block;\n}\n\n.nav-links {\n  display: none;\n}\n\n.tablet-tip {\n  display: none;\n}\n\n@media (min-width: 600px) and (max-width: 1023px) {\n  .tablet-tip {\n    display: block;\n  }\n}\n\n@media (min-width: 768px) {\n  .layout {\n    grid-template-columns: 250px 1fr;\n  }\n\n  .menu-btn {\n    display: none;\n  }\n\n  .nav-links {\n    display: flex;\n    gap: 16px;\n  }\n}\n\n@media (hover: hover) {\n  .card:hover {\n    transform: translateY(-4px);\n  }\n}\n\n@media (pointer: coarse) {\n  button {\n    min-height: 44px;\n  }\n}\n',
      checks: [
        { label: 'one column, then a sidebar from 768px', mistake: 'Base .layout is one column; @media (min-width: 768px) adds grid-template-columns: 250px 1fr.', check: async ({ atWidth }) => { const out = []; for (const w of [375, 767, 768, 1200]) { const v = await atWidth(w); const s = v.rect('.sidebar'); const c = v.rect('.content'); out.push(Math.round(c.top) >= Math.round(s.bottom) && Math.round(s.width) === v.width ? 'stacked' : Math.round(s.width) === 250 && Math.round(c.width) === v.width - 250 && Math.round(c.top) === Math.round(s.top) ? 'sidebar' : `${Math.round(s.width)}px sidebar`); } return out.join() === 'stacked,stacked,sidebar,sidebar' || `at 375/767/768/1200px: ${out.join(' / ')}`; } },
        { label: 'built mobile-first', mistake: 'Do not start from the desktop layout and undo it with max-width: base styles for phones, min-width queries for larger screens.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const undo = h.mediaRules(sheet, 'max-width').filter((r) => /\.(layout|nav-links|menu-btn)/.test(r.selectorText)); const base = h.declared(sheet, '.layout', 'grid-template-columns'); return (undo.length === 0 && !base && h.mediaRules(sheet, 'min-width:768px').length > 0) || (base ? 'the base .layout rule sets the desktop columns' : 'no min-width: 768px query, or max-width queries undo the layout'); } },
        { label: 'menu button vs links', mistake: 'Phones: .menu-btn visible, .nav-links display: none. From 768px: the reverse, with the links as a flex row, gap 16px.', check: async ({ atWidth }) => { const phone = await atWidth(375); const p = [phone.style('.menu-btn', 'display'), phone.style('.nav-links', 'display')]; const wide = await atWidth(1024); const w = [wide.style('.menu-btn', 'display'), wide.style('.nav-links', 'display'), wide.style('.nav-links', 'column-gap')]; return (p[0] !== 'none' && p[1] === 'none' && w[0] === 'none' && w[1] === 'flex' && w[2] === '16px') || `phone: button ${p[0]}, links ${p[1]}; 1024px: button ${w[0]}, links ${w[1]} gap ${w[2]}`; } },
        { label: 'tablet-only tip', mistake: 'Hidden by default; shown inside @media (min-width: 600px) and (max-width: 1023px).', check: async ({ atWidth }) => { const out = []; for (const w of [599, 600, 1023, 1024]) { const v = await atWidth(w); out.push(v.style('.tablet-tip', 'display') === 'none' ? 'hidden' : 'shown'); } return out.join() === 'hidden,shown,shown,hidden' || `at 599/600/1023/1024px: ${out.join(' / ')}`; } },
        { label: 'hover only where it exists', mistake: 'Put .card:hover inside @media (hover: hover) so taps on touch screens do not leave it stuck.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const inside = h.mediaRules(sheet, '(hover:hover)').some((r) => r.selectorText === '.card:hover' && /translateY\(-4px\)/.test(r.style.transform)); return (inside && !h.hasRule(sheet, '.card:hover')) || (inside ? 'there is still a .card:hover rule outside the media query' : 'no .card:hover rule inside @media (hover: hover)'); } },
        { label: 'bigger touch targets', mistake: '@media (pointer: coarse) { button { min-height: 44px; } }', check: ({ document, h }) => h.mediaRules(document.querySelector('style[data-source="learner"]').sheet, '(pointer:coarse)').some((r) => /button/.test(r.selectorText) && r.style.minHeight === '44px') || 'no min-height: 44px for buttons inside @media (pointer: coarse)' },
      ],
    },
    {
      id: 'css-fluid-clamp',
      title: 'Fluid type and spacing with clamp()',
      source: 'HTML & CSS course, Part 26',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<section class="section"><h1 class="headline">Monsoon toy sale</h1><div class="button-group"><button type="button">Trains</button><button type="button">Puzzles</button><button type="button">Building blocks</button><button type="button">Art supplies</button><button type="button">Outdoor games</button></div></section>',
        css: 'body { margin: 0; font: 16px/1.4 Arial, sans-serif; }\n.headline { margin: 0 0 16px; }\n.button-group button { padding: 8px 16px; white-space: nowrap; }',
      },
      teach: [
        'Sizes that jump at breakpoints feel abrupt; pure viewport units (`font-size: 4vw`) scale smoothly but have no limits: 13px on a phone, 77px on a big monitor. And because `vw` ignores the user\'s font-size setting, text sized only in `vw` does not grow when someone raises their browser\'s default size (WCAG 1.4.4, Resize Text).',
        { code: 'font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);\n/*              MIN       PREFERRED   MAX   → the browser uses the middle value of the three */', lang: 'css' },
        { list: ['Below the point where `4vw + 1rem` drops under `1.75rem`, the minimum wins; above the point where it passes `3.5rem`, the maximum wins; in between it scales smoothly with the viewport.', 'Adding `rem` to the `vw` part softens the growth **and** keeps the text responsive to the user\'s font settings. Keep the min and max in `rem` too.', 'Math works inside `clamp()` without `calc()`.'] },
        { h: 'Worked example at three widths' },
        { table: { head: ['Viewport', '4vw + 1rem', 'Result'], rows: [['300px', '12 + 16 = 28px', '28px (equal to the 1.75rem minimum)'], ['800px', '32 + 16 = 48px', '48px (fluid)'], ['1400px', '56 + 16 = 72px', '56px (capped at 3.5rem)']] } },
        { h: 'Responsive without media queries' },
        'Much of responsive design needs no breakpoints at all: `repeat(auto-fit, minmax(…))` grids (Part 25), `flex-wrap: wrap` rows and `clamp()` sizes adapt continuously. Keep media queries for real **structural** changes, like adding a sidebar.',
      ],
      example: [
        { code: '.section { padding: clamp(1rem, 5vw, 4rem); }\n.button-group { display: flex; flex-wrap: wrap; gap: 8px; }', lang: 'css' },
      ],
      task: [
        'No media queries in this lesson.',
        { ol: ['`.headline`: `font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem)` (28px at a 300px viewport, 48px at 800px, 56px at 1400px, and the minimum must follow the user\'s root font size).', '`.section`: padding `clamp(1rem, 5vw, 4rem)` on every side.', '`.button-group`: a flex row that wraps onto new lines on a narrow phone, with an 8px gap.'] },
      ],
      starter: '.headline {\n  font-size: 4vw;\n}\n',
      solution: '.headline {\n  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);\n}\n\n.section {\n  padding: clamp(1rem, 5vw, 4rem);\n}\n\n.button-group {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n',
      checks: [
        { label: 'fluid headline with limits', mistake: 'clamp(1.75rem, 4vw + 1rem, 3.5rem): 28px at 300px, 48px at 800px, capped at 56px at 1400px.', check: async ({ atWidth }) => { const out = []; for (const w of [300, 800, 1400]) { const v = await atWidth(w); out.push(Math.round(parseFloat(v.style('.headline', 'font-size')))); } return out.join() === '28,48,56' || `headline is ${out.join(' / ')}px at 300/800/1400px; expected 28 / 48 / 56`; } },
        { label: 'respects the user\'s font size', mistake: 'Keep the minimum in rem: with a 20px root font, the 300px headline should be 35px (1.75rem).', check: async ({ atWidth }) => { const v = await atWidth(300); v.doc.documentElement.style.fontSize = '20px'; const size = Math.round(parseFloat(v.style('.headline', 'font-size'))); v.doc.documentElement.style.fontSize = ''; return size === 35 || `with a 20px root font the headline is ${size}px`; } },
        { label: 'fluid section padding', mistake: '.section { padding: clamp(1rem, 5vw, 4rem); }: 16px at 300px, 40px at 800px, 64px at 1600px.', check: async ({ atWidth }) => { const out = []; for (const w of [300, 800, 1600]) { const v = await atWidth(w); out.push([v.style('.section', 'padding-top'), v.style('.section', 'padding-left')].map((x) => Math.round(parseFloat(x))).join('/')); } return out.join() === '16/16,40/40,64/64' || `padding (top/left) at 300/800/1600px: ${out.join(', ')}`; } },
        { label: 'buttons wrap on a phone', mistake: '.button-group { display: flex; flex-wrap: wrap; gap: 8px; }', check: async ({ atWidth }) => { const v = await atWidth(320); const g = v.$('.button-group'); const b = v.$$('.button-group button').map((x) => x.getBoundingClientRect()); const fits = g.scrollWidth <= g.clientWidth + 1; const wraps = Math.round(b[b.length - 1].top) > Math.round(b[0].top); const gap = Math.round(b[1].left - b[0].right); const display = v.style('.button-group', 'display'); return (display === 'flex' && fits && wraps && gap === 8) || `display ${display}, fits ${fits}, wraps ${wraps}, gap ${gap}px`; } },
        { label: 'no breakpoints needed', mistake: 'Solve this lesson without @media.', check: ({ document, h }) => h.allRules(document.querySelector('style[data-source="learner"]').sheet, 'CSSMediaRule').length === 0 || 'remove the media queries: clamp() and wrap do the work' },
      ],
    },
    {
      id: 'css-container-queries',
      title: 'Container queries: components that fit their space',
      source: 'HTML & CSS course, Part 27',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: `<div class="page">\n  <aside class="sidebar"><div class="card-slot"><article class="card"><img src="${THUMB}" alt="Wooden train set"><div class="card-body"><h3>Train set</h3><p>24 magnetic carriages.</p></div></article></div></aside>\n  <main class="main"><div class="card-slot"><article class="card"><img src="${THUMB}" alt="Wooden train set"><div class="card-body"><h3>Train set</h3><p>24 magnetic carriages.</p></div></article></div></main>\n</div>`,
        css: 'body { margin: 0; font: 16px/1.4 Arial, sans-serif; }\n.page { display: flex; gap: 24px; }\n.sidebar { width: 260px; flex-shrink: 0; }\n.main { width: 700px; }\n.card { border: 1px solid #cbd5e1; padding: 12px; gap: 12px; }\n.card img { width: 100%; height: auto; display: block; }\n.card h3, .card p { margin: 0; }',
      },
      teach: [
        'Media queries know only the **viewport**. The same card can sit in a 700px main column and a 260px sidebar on the same page at the same moment, and a media query cannot tell those two apart. A **container query** asks how wide the card\'s **container** is.',
        { h: 'Step 1: make an ancestor a container' },
        { code: '.card-slot {\n  container-type: inline-size;   /* queryable by its width */\n  container-name: card;          /* optional: target it by name */\n}\n/* shorthand: container: card / inline-size; */', lang: 'css' },
        { h: 'Step 2: query it' },
        { code: '.card { display: flex; flex-direction: column; }   /* narrow default */\n\n@container card (min-width: 400px) {\n  .card { flex-direction: row; align-items: center; }\n  .card img { width: 150px; flex-shrink: 0; }\n}', lang: 'css' },
        { list: ['An `@container` query matches the nearest **ancestor** container (or the one you name). An element cannot query itself: the rules inside style its descendants.', 'Container units: `cqi` is 1% of the container\'s inline size, e.g. `font-size: clamp(1rem, 4cqi, 1.5rem)`.'] },
        { warn: '`container-type: inline-size` applies size containment: the container\'s width can no longer come from its content. A container that is shrink-to-fit (an `inline-block`, a flex item with no width, a `float`) collapses to zero. Put the container on an element whose width comes from its parent.' },
        'Use media queries for page-level structure, container queries for reusable components. They work together.',
      ],
      example: [
        { code: '.widget { container-type: inline-size; }\n\n@container (min-width: 350px) {\n  .profile-card { display: flex; gap: 16px; }\n}', lang: 'css' },
      ],
      task: [
        { ol: ['Make every `.card-slot` an inline-size container named `card`.', '`.card`: a flex column by default.', 'When its `card` container is at least 400px wide: a row with items centred vertically, and the image a fixed 150px that never shrinks.', 'Use a container query, not a media query: the sidebar card must stay stacked while the main card turns into a row, at the same viewport width.'] },
      ],
      starter: '.card {\n  display: flex;\n  flex-direction: column;\n}\n\n@media (min-width: 400px) {\n  .card {\n    flex-direction: row;\n  }\n}\n',
      solution: '.card-slot {\n  container-type: inline-size;\n  container-name: card;\n}\n\n.card {\n  display: flex;\n  flex-direction: column;\n}\n\n@container card (min-width: 400px) {\n  .card {\n    flex-direction: row;\n    align-items: center;\n  }\n\n  .card img {\n    width: 150px;\n    flex-shrink: 0;\n  }\n}\n',
      checks: [
        { label: 'named inline-size containers', mistake: '.card-slot { container-type: inline-size; container-name: card; }', check: ({ $ }) => { const s = getComputedStyle($('.card-slot')); return (s.containerType === 'inline-size' && s.containerName === 'card') || `container-type ${s.containerType}, container-name ${s.containerName}`; } },
        { label: 'sidebar card stays stacked', mistake: 'The default .card is a flex column; only the container query switches it to a row.', check: ({ $, rect }) => { const card = $('.sidebar .card'); const img = rect(card.querySelector('img')); const body = rect(card.querySelector('.card-body')); return (getComputedStyle(card).display === 'flex' && Math.round(body.top) >= Math.round(img.bottom)) || 'the sidebar card is not stacked: a media query cannot see that its slot is only 260px'; } },
        { label: 'main card becomes a row', mistake: '@container card (min-width: 400px) { .card { flex-direction: row; align-items: center; } }', check: ({ $, rect }) => { const card = $('.main .card'); const img = rect(card.querySelector('img')); const body = rect(card.querySelector('.card-body')); const centred = Math.abs(img.top + img.height / 2 - (body.top + body.height / 2)) < 1; return (Math.round(body.left) >= Math.round(img.right) && centred) || 'the main card is not a vertically centred row'; } },
        { label: 'fixed 150px image', mistake: 'Inside the container query: .card img { width: 150px; flex-shrink: 0; }', check: ({ $, rect }) => { const img = $('.main .card img'); return (Math.round(rect(img).width) === 150 && getComputedStyle(img).flexShrink === '0') || `the main image is ${Math.round(rect(img).width)}px, flex-shrink ${getComputedStyle(img).flexShrink}`; } },
        { label: 'a container query, not a media query', mistake: 'Write the row layout inside @container card (…), and remove the @media rule for .card.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const viaMedia = h.mediaRules(sheet).some((r) => /\.card/.test(r.selectorText)); return (!viaMedia && h.containerRules(sheet, 'card').length > 0) || (viaMedia ? 'a @media rule still styles .card' : 'no @container card query'); } },
      ],
    },
    {
      id: 'css-responsive-quiz',
      title: 'Responsive design check',
      source: 'HTML & CSS course, Parts 26–27',
      runner: 'quiz',
      teach: [
        { table: { head: ['Tool', 'Responds to', 'Use for'], rows: [['`@media (min-width: …)`', 'the viewport', 'page structure: columns, sidebars, navigation'], ['`@container (min-width: …)`', 'an ancestor container', 'reusable components'], ['`clamp()`', 'continuous values', 'fluid type and spacing'], ['`auto-fit` + `minmax()`, `flex-wrap`', 'available space', 'grids and rows that need no breakpoints'], ['`(hover)`, `(pointer)`', 'the input device', 'hover effects, touch-target size']] } },
      ],
      example: [
        { code: '@media (min-width: 600px) and (max-width: 900px) {\n  /* 600px and 900px themselves are included */\n}', lang: 'css' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'What makes CSS mobile-first?', options: ['Using max-width queries', 'Base styles for small screens, then min-width queries that add layout', 'Hiding content on phones', 'Using vw units everywhere'], answer: 1, explain: 'Queries only add; nothing has to be undone.' },
        { q: 'How should you choose breakpoints?', options: ['The iPhone and iPad widths', 'Where your own layout starts to look cramped or broken as you resize', 'Every 100px', 'Only at 768px'], answer: 1, explain: 'Hundreds of device widths exist; your content decides.' },
        { q: 'Your media queries never match on a real phone, which shows a tiny zoomed-out desktop page. What is missing?', options: ['A reset stylesheet', '<meta name="viewport" content="width=device-width, initial-scale=1">', 'A container query', 'JavaScript'], answer: 1, explain: 'Without it, mobile browsers lay out at about 980px.' },
        { q: 'Why wrap `.card:hover` in `@media (hover: hover)`?', options: ['Hover is faster that way', 'Touch screens cannot hover, and a tap can leave the hover style stuck on', 'It is required syntax', 'To support dark mode'], answer: 1, explain: 'Only devices that really hover get the effect.' },
        { q: 'What is wrong with `h1 { font-size: 5vw; }`?', options: ['Nothing', 'No limits, and it ignores the user\'s font-size setting', 'vw is not valid for fonts', 'It only works in Grid'], answer: 1, explain: 'clamp(min-rem, vw + rem, max-rem) fixes both.' },
        { q: 'One card component sits in a 260px sidebar and a 700px main column at the same viewport width. Which can lay them out differently?', options: ['A media query', 'A container query', 'Neither', 'Only JavaScript'], answer: 1, explain: 'A container query reads each card\'s own container width.' },
        { q: 'You set `container-type: inline-size` on an `inline-block` wrapper and it collapses to 0 width. Why?', options: ['A browser bug', 'Size containment stops its width coming from its content, and an inline-block gets its width from its content', 'Containers need a height', 'container-name is missing'], answer: 1, explain: 'Put the container on an element whose width comes from its parent.' },
      ],
    },
  ],
};
