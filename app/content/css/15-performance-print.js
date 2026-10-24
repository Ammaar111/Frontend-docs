// HTML & CSS course, Parts 48, 51–52 and 58–59: performance, print,
// progressive enhancement and production practice.
export default {
  id: 'css-performance-print',
  title: 'Performance, print and production',
  lessons: [
    {
      id: 'css-performance',
      title: 'CSS that renders fast',
      source: 'HTML & CSS course, Parts 48 and 0',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<aside class="panel" aria-label="Filters">Filters</aside>\n<div class="toast">Saved</div>\n<main>\n' + Array.from({ length: 6 }, (_, i) => `  <section class="review-section"><h2>Reviews page ${i + 1}</h2><p>Lots of review text…</p></section>`).join('\n') + '\n</main>',
        css: 'body { margin: 0; font: 16px/1.4 Arial, sans-serif; }\n.panel { position: fixed; top: 0; left: 0; width: 280px; height: 100%; background: white; box-shadow: 0 0 24px rgb(0 0 0 / 0.2); }\n.toast { position: fixed; bottom: 16px; right: 16px; padding: 8px 16px; background: #0f172a; color: white; }\n.review-section { padding: 16px; border-bottom: 1px solid #e5e7eb; }',
      },
      teach: [
        'Every frame the browser may run **style → layout → paint → composite** (Part 0). Which steps a change triggers decides whether an animation is smooth:',
        { table: { head: ['Changing', 'Triggers', 'Cost'], rows: [['`width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`', 'layout + paint + composite', 'high: geometry of possibly many elements is recalculated every frame'], ['`color`, `background`, `box-shadow`', 'paint + composite', 'medium'], ['`transform`, `opacity`', 'usually composite only', 'low: the GPU moves an already painted layer']] } },
        '**Animate `transform` and `opacity`.** Slide a panel with `translateX`, not `left`; grow with `scale`, not `width`; fade with `opacity`, not `visibility` toggles or `display`.',
        { h: 'More levers' },
        { list: ['`will-change: transform` promotes an element to its own layer before an animation. Use it sparingly and briefly: every layer costs memory, and putting it on everything makes things slower.', '`content-visibility: auto` lets the browser skip rendering off-screen sections until they come near the viewport, a large win on long pages. Pair it with `contain-intrinsic-size: auto 400px` so the skipped sections keep a placeholder height and the scrollbar does not jump.', 'Images are usually the heaviest bytes: `srcset`/`sizes`, AVIF/WebP, `loading="lazy"` below the fold but never on the main (LCP) image, and `width`/`height` attributes to prevent layout shift (HTML track).', 'Fonts: load only the weights you use, WOFF2, `font-display: swap`.', 'Dead CSS still has to be downloaded and matched; DevTools\' **Coverage** panel shows which rules a page used.', '**Layout thrashing** is a JavaScript problem: reading a layout value (`offsetHeight`) right after writing a style forces a synchronous layout. Batch reads, then writes.'] },
      ],
      example: [
        { code: '/* ❌ layout every frame */\n.box { transition: left 0.3s, width 0.3s; }\n.box:hover { left: 20px; width: 220px; }\n\n/* ✅ composite only */\n.box { transition: transform 0.3s; }\n.box:hover { transform: translateX(20px) scale(1.1); }', lang: 'css' },
      ],
      task: [
        { ol: ['`.panel`: closed by default with `transform: translateX(-100%)`; `.panel.is-open` uses `translateX(0)`. Transition **only** `transform` (`0.3s ease`). No `left`/`width` animation.', '`.toast`: hidden with `opacity: 0`; `.toast.is-visible` has `opacity: 1`. Transition **only** `opacity` (`0.2s`).', '`.review-section`: `content-visibility: auto` with `contain-intrinsic-size: auto 400px`.'] },
      ],
      starter: '.panel {\n  left: -280px;\n  transition: left 0.3s ease;\n}\n\n.panel.is-open {\n  left: 0;\n}\n\n.toast {\n  display: none;\n}\n\n.toast.is-visible {\n  display: block;\n}\n',
      solution: '.panel {\n  transform: translateX(-100%);\n  transition: transform 0.3s ease;\n}\n\n.panel.is-open {\n  transform: translateX(0);\n}\n\n.toast {\n  opacity: 0;\n  transition: opacity 0.2s;\n}\n\n.toast.is-visible {\n  opacity: 1;\n}\n\n.review-section {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 400px;\n}\n',
      checks: [
        { label: 'panel slides with transform', mistake: '.panel { transform: translateX(-100%); transition: transform 0.3s ease; } and .panel.is-open { transform: translateX(0); }', check: async ({ $, rect, settle }) => { const p = $('.panel'); const s = getComputedStyle(p); const closed = Math.round(rect(p).right) <= 0 && s.left === '0px'; const timing = s.transitionProperty === 'transform' && s.transitionDuration === '0.3s'; p.classList.add('is-open'); await settle(); const animatedTransform = p.getAnimations().length > 0 && p.getAnimations().every((a) => a.transitionProperty === 'transform'); p.getAnimations().forEach((a) => a.finish()); await settle(); const open = Math.round(rect(p).left) === 0; p.classList.remove('is-open'); p.getAnimations().forEach((a) => a.finish()); await settle(); return (closed && timing && animatedTransform && open) || `closed off-screen with left 0: ${closed}; transition "${s.transitionProperty}" ${s.transitionDuration}; opens to x=0: ${open}`; } },
        { label: 'toast fades with opacity', mistake: '.toast { opacity: 0; transition: opacity 0.2s; } and .toast.is-visible { opacity: 1; }: display cannot be animated.', check: async ({ $, settle }) => { const t = $('.toast'); const s = getComputedStyle(t); const hidden = s.opacity === '0' && s.display !== 'none' && s.transitionProperty === 'opacity' && s.transitionDuration === '0.2s'; t.classList.add('is-visible'); await settle(); const fades = t.getAnimations().some((a) => a.transitionProperty === 'opacity'); t.getAnimations().forEach((a) => a.finish()); await settle(); const shown = getComputedStyle(t).opacity === '1'; t.classList.remove('is-visible'); t.getAnimations().forEach((a) => a.finish()); return (hidden && fades && shown) || `toast: opacity ${s.opacity}, display ${s.display}, transition "${s.transitionProperty}" ${s.transitionDuration}`; } },
        { label: 'only cheap properties animate', mistake: 'Transition transform and opacity only: no left, top, width, height, margin or all.', check: ({ document }) => { const css = [...document.querySelector('style[data-source="learner"]').sheet.cssRules].map((r) => r.cssText).join('\n'); const bad = css.match(/transition(?:-property)?\s*:[^;]*\b(left|top|right|bottom|width|height|margin|padding|all)\b/); return !bad || `a transition animates ${bad[1]}`; } },
        { label: 'off-screen sections skipped', mistake: '.review-section { content-visibility: auto; contain-intrinsic-size: auto 400px; }', check: ({ $ }) => { const s = getComputedStyle($('.review-section')); return (s.contentVisibility === 'auto' && (s.containIntrinsicHeight === 'auto 400px' || /auto 400px/.test(s.containIntrinsicSize))) || `content-visibility ${s.contentVisibility}, contain-intrinsic-size ${s.containIntrinsicSize}`; } },
      ],
    },
    {
      id: 'css-print',
      title: 'Print stylesheets for articles and invoices',
      source: 'HTML & CSS course, Parts 51–52',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<nav class="site-nav">Home · Shop · Orders</nav>\n<article class="invoice">\n  <h1>Invoice #1042</h1>\n  <p>Thank you for shopping at <a href="https://toyshop.example.in">ToyShop</a>.</p>\n  <h2>Items</h2>\n  <table class="items"><tr><th>Item</th><th>Price</th></tr><tr><td>Train set</td><td>₹1,499</td></tr></table>\n  <pre class="note">Delivery note: leave with the building security desk if nobody answers.</pre>\n  <p class="total">Total: ₹1,499</p>\n  <button type="button" class="no-print">Download PDF</button>\n</article>',
        css: 'body { margin: 0; font: 16px/1.4 Arial, sans-serif; background: #0f172a; color: #e2e8f0; }\n.invoice { padding: 24px; box-shadow: 0 4px 12px rgb(0 0 0 / 0.3); }',
      },
      teach: [
        '`@media print` styles apply when a page is printed or saved as PDF (invoices, tickets, recipes, documentation). The checks inspect your print rules, because the sandbox renders for a screen.',
        { code: '@media print {\n  @page { size: A4; margin: 2cm; }\n  nav, button, .no-print { display: none; }\n  body { background: white; color: black; font-size: 12pt; }\n  * { box-shadow: none; text-shadow: none; }\n  a[href^="http"]::after { content: " (" attr(href) ")"; }   /* paper has no links */\n  h1, h2, h3 { break-after: avoid; }      /* no heading stranded at a page bottom */\n  table, pre { break-inside: avoid; }     /* keep blocks whole where possible */\n  pre { white-space: pre-wrap; }          /* wrap instead of being cut at the page edge */\n  p { orphans: 3; widows: 3; }\n}', lang: 'css' },
        { list: ['`pt` is a print unit (1pt = 1/72 inch); `cm`/`mm` make sense for page margins.', '`break-before: page` starts each chapter (`h1`) on a new page in long documents.', '**orphans**: minimum lines of a paragraph left at the **bottom** of a page; **widows**: minimum lines carried to the **top** of the next. Both default to 2.', '`break-inside: avoid` is a request: a table longer than a page will still break. For long tables, repeating `<thead>` rows is what keeps them readable.', 'Serif type for long printed text is a convention, not a proven readability rule; pick what suits the document.'] },
      ],
      example: [
        { code: '@media print {\n  .chapter { break-before: page; }\n  table { width: 100%; font-size: 10pt; }\n}', lang: 'css' },
      ],
      task: [
        'Inside one `@media print` block:',
        { ol: ['`@page`: A4 with `2cm` margins.', 'Hide `nav` and `.no-print`.', '`body`: white background, black text, `12pt`.', 'Remove box shadows from everything.', 'Show external link URLs after the link: `a[href^="http"]::after` with `" (" attr(href) ")"`.', 'Headings `h1, h2` avoid a break after them; `table` and `pre` avoid breaking inside; `pre` wraps with `white-space: pre-wrap`.', 'Paragraphs: `orphans: 3; widows: 3`.'] },
      ],
      starter: '@media print {\n  nav {\n    display: none;\n  }\n}\n',
      solution: '@media print {\n  @page {\n    size: A4;\n    margin: 2cm;\n  }\n\n  nav,\n  .no-print {\n    display: none;\n  }\n\n  body {\n    background: white;\n    color: black;\n    font-size: 12pt;\n  }\n\n  * {\n    box-shadow: none;\n  }\n\n  a[href^="http"]::after {\n    content: " (" attr(href) ")";\n  }\n\n  h1,\n  h2 {\n    break-after: avoid;\n  }\n\n  table,\n  pre {\n    break-inside: avoid;\n  }\n\n  pre {\n    white-space: pre-wrap;\n  }\n\n  p {\n    orphans: 3;\n    widows: 3;\n  }\n}\n',
      checks: [
        { label: 'A4 page with margins', mistake: '@page { size: A4; margin: 2cm; } inside @media print.', check: ({ document }) => { const media = [...document.querySelector('style[data-source="learner"]').sheet.cssRules].filter((r) => r.constructor.name === 'CSSMediaRule' && /print/.test(r.conditionText)); const page = media.flatMap((m) => [...m.cssRules]).find((r) => r.constructor.name === 'CSSPageRule'); return Boolean(page && /a4/i.test(page.style.getPropertyValue('size')) && page.style.marginTop === '2cm') || 'no @page { size: A4; margin: 2cm; } in the print block'; } },
        { label: 'screen-only UI hidden', mistake: 'nav, .no-print { display: none; } in print.', check: ({ document, $, h }) => { const rules = h.mediaRules(document.querySelector('style[data-source="learner"]').sheet, 'print'); const hides = (el) => rules.some((r) => el.matches(r.selectorText) && r.style.display === 'none'); return (hides($('nav')) && hides($('.no-print'))) || 'nav and .no-print are not both hidden in print'; } },
        { label: 'ink-friendly body', mistake: 'body { background: white; color: black; font-size: 12pt; } and * { box-shadow: none; } in print.', check: ({ document, h }) => { const rules = h.mediaRules(document.querySelector('style[data-source="learner"]').sheet, 'print'); const body = rules.filter((r) => r.selectorText === 'body'); const has = (p, v) => body.some((r) => h.sameValue(p, r.style.getPropertyValue(p), v)); const shadows = rules.some((r) => r.selectorText === '*' && r.style.boxShadow === 'none'); return (has('background-color', 'white') && has('color', 'black') && body.some((r) => r.style.fontSize === '12pt') && shadows) || 'check the print body colours, the 12pt size and * { box-shadow: none; }'; } },
        { label: 'printed link URLs', mistake: 'a[href^="http"]::after { content: " (" attr(href) ")"; }', check: ({ document, h }) => { const rule = h.mediaRules(document.querySelector('style[data-source="learner"]').sheet, 'print').find((r) => /a\[href\^=["']?http["']?\]::after/.test(r.selectorText)); return Boolean(rule && /attr\(href\)/.test(rule.style.content)) || 'no a[href^="http"]::after rule with attr(href)'; } },
        { label: 'page-break control', mistake: 'h1, h2 { break-after: avoid; } table, pre { break-inside: avoid; } pre { white-space: pre-wrap; } p { orphans: 3; widows: 3; }', check: ({ document, $, h }) => { const rules = h.mediaRules(document.querySelector('style[data-source="learner"]').sheet, 'print'); const val = (el, prop) => rules.filter((r) => el.matches(r.selectorText)).map((r) => r.style.getPropertyValue(prop)).filter(Boolean).pop(); const ok = val($('h1'), 'break-after') === 'avoid' && val($('h2'), 'break-after') === 'avoid' && val($('table'), 'break-inside') === 'avoid' && val($('pre'), 'break-inside') === 'avoid' && val($('pre'), 'white-space') === 'pre-wrap' && val($('p'), 'orphans') === '3' && val($('p'), 'widows') === '3'; return ok || 'one of the break, white-space, orphans or widows rules is missing'; } },
      ],
    },
    {
      id: 'css-progressive-enhancement',
      title: 'Progressive enhancement with @supports',
      source: 'HTML & CSS course, Part 58',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="gallery"><div>Trains</div><div>Puzzles</div><div>Blocks</div><div>Dolls</div><div>Art</div></div>\n<header class="glass">Frosted header</header>\n<form class="signup"><label>Email <input type="email" required></label><button type="submit">Join</button></form>',
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\n.gallery { width: 700px; margin-bottom: 16px; }\n.gallery > div { background: #e0e7ff; padding: 16px; }\n.glass { padding: 16px; margin-bottom: 16px; }\n.signup { padding: 16px; border: 1px solid #cbd5e1; }',
      },
      teach: [
        '**Progressive enhancement**: start from a baseline that works everywhere, then add features where the browser supports them. **Graceful degradation** starts from the full experience and patches older browsers afterwards. Enhancement is the safer default, because the baseline is designed rather than left over.',
        { code: '.gallery { display: flex; flex-wrap: wrap; }      /* baseline */\n.gallery > * { flex: 1 1 220px; }\n\n@supports (display: grid) {                          /* enhancement */\n  .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }\n}\n\n@supports selector(:has(input:user-invalid)) { … }  /* selectors can be tested too */\n@supports not (backdrop-filter: blur(1px)) { … }    /* and absence */', lang: 'css' },
        { list: ['Write the baseline unconditionally first, and only the enhancement inside `@supports`. The reverse (modern rules everywhere, undo them inside `@supports not`) breaks in exactly the browsers you were trying to help.', 'Unknown properties are simply ignored, so a fallback declaration followed by a modern one also works: `height: 100vh; height: 100dvh;`.', 'Vendor prefixes are mostly history; a few remain (`-webkit-backdrop-filter` for older Safari, `-webkit-text-size-adjust`). Put the prefixed version first, then the standard one.', 'Check real support data (MDN\'s compatibility tables, "Baseline" status) before treating a feature as a requirement, and test in real Chromium, Firefox and Safari (including iOS Safari).', 'Known gotchas: `100vh` on mobile (use `dvh`), flexbox `gap` arrived later than grid `gap` in old Safari, `:has()` became Baseline only in December 2023.'] },
      ],
      example: [
        { code: '.glass { background: rgb(255 255 255 / 0.9); }   /* readable everywhere */\n@supports (backdrop-filter: blur(8px)) {\n  .glass {\n    background: rgb(255 255 255 / 0.6);\n    -webkit-backdrop-filter: blur(8px);\n    backdrop-filter: blur(8px);\n  }\n}', lang: 'css' },
      ],
      task: [
        { ol: ['`.gallery` baseline: a wrapping flex row with `gap: 16px`, items `flex: 1 1 220px`. Enhancement inside `@supports (display: grid)`: a grid with `repeat(auto-fit, minmax(220px, 1fr))` and the same gap.', '`.glass` baseline: background `rgb(255 255 255 / 0.9)`. Enhancement inside `@supports (backdrop-filter: blur(8px))`: background `rgb(255 255 255 / 0.6)` plus `-webkit-backdrop-filter` and `backdrop-filter` `blur(8px)`, prefixed first.', '`.signup`: inside `@supports selector(:has(input:user-invalid))`, `.signup:has(input:user-invalid)` gets a `#dc2626` border colour.'] },
      ],
      starter: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n}\n\n@supports not (display: grid) {\n  .gallery {\n    display: flex;\n  }\n}\n',
      solution: '.gallery {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.gallery > * {\n  flex: 1 1 220px;\n}\n\n@supports (display: grid) {\n  .gallery {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  }\n}\n\n.glass {\n  background: rgb(255 255 255 / 0.9);\n}\n\n@supports (backdrop-filter: blur(8px)) {\n  .glass {\n    background: rgb(255 255 255 / 0.6);\n    -webkit-backdrop-filter: blur(8px);\n    backdrop-filter: blur(8px);\n  }\n}\n\n@supports selector(:has(input:user-invalid)) {\n  .signup:has(input:user-invalid) {\n    border-color: #dc2626;\n  }\n}\n',
      checks: [
        { label: 'flex baseline first', mistake: 'Unconditional .gallery { display: flex; flex-wrap: wrap; gap: 16px; } and .gallery > * { flex: 1 1 220px; }: the baseline must not live inside @supports.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const ok = h.declared(sheet, '.gallery', 'display') === 'flex' && h.declared(sheet, '.gallery', 'flex-wrap') === 'wrap' && h.declared(sheet, '.gallery', 'row-gap') === '16px' && h.declared(sheet, '.gallery > *', 'flex-basis') === '220px' && h.declared(sheet, '.gallery > *', 'flex-grow') === '1'; return ok || 'the top-level .gallery baseline should be a wrapping flex row with gap 16px and items flex: 1 1 220px'; } },
        { label: 'grid enhancement', mistake: '@supports (display: grid) { .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); } }', check: ({ document, $, $$, rect }) => { const sup = [...document.querySelector('style[data-source="learner"]').sheet.cssRules].find((r) => r.constructor.name === 'CSSSupportsRule' && /display:\s*grid/.test(r.conditionText)); const w = $$('.gallery > div').map((x) => Math.round(rect(x).width)); return (sup && getComputedStyle($('.gallery')).display === 'grid' && w.slice(0, 3).every((x) => x === 223)) || (sup ? `the gallery is ${getComputedStyle($('.gallery')).display}; first items ${w.slice(0, 3).join('/')}px` : 'no @supports (display: grid) block'); } },
        { label: 'glass with a readable fallback', mistake: 'Baseline background rgb(255 255 255 / 0.9); inside @supports (backdrop-filter: blur(8px)): 0.6 background, -webkit-backdrop-filter then backdrop-filter blur(8px).', check: ({ document, $, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const base = h.declared(sheet, '.glass', 'background-color'); const sup = [...sheet.cssRules].find((r) => r.constructor.name === 'CSSSupportsRule' && /backdrop-filter/.test(r.conditionText)); const inner = sup && [...sup.cssRules].find((r) => r.selectorText === '.glass'); const text = inner ? inner.cssText : ''; return (h.sameValue('background-color', base, 'rgb(255 255 255 / 0.9)') && inner && /blur\(8px\)/.test(getComputedStyle($('.glass')).backdropFilter) && h.sameValue('background-color', inner.style.backgroundColor, 'rgb(255 255 255 / 0.6)') && /backdrop-filter/.test(text)) || 'check the .glass baseline background and its @supports enhancement'; } },
        { label: 'enhancement tested by selector', mistake: '@supports selector(:has(input:user-invalid)) { .signup:has(input:user-invalid) { border-color: #dc2626; } }', check: ({ document, h }) => { const sup = [...document.querySelector('style[data-source="learner"]').sheet.cssRules].find((r) => r.constructor.name === 'CSSSupportsRule' && /selector\(/.test(r.conditionText)); const inner = sup && [...sup.cssRules].find((r) => /\.signup:has\(input:user-invalid\)/.test(r.selectorText)); return Boolean(inner && h.sameValue('color', inner.style.borderTopColor, '#dc2626')) || 'no .signup:has(input:user-invalid) rule inside @supports selector(…)'; } },
      ],
    },
    {
      id: 'css-production-quiz',
      title: 'Performance, print and production check',
      source: 'HTML & CSS course, Parts 48–59',
      runner: 'quiz',
      teach: [
        'A pre-merge checklist from the course (Part 59), worth running on every pull request:',
        { list: ['Every image has appropriate `alt`; every input has a label; heading levels are sequential.', 'Every interactive element has a visible focus state; colour is never the only signal.', '`box-sizing: border-box` comes from the reset; tokens replace magic numbers.', 'The layout was checked at a real narrow width (360px), not just a squeezed desktop window.', 'Non-trivial animation has a `prefers-reduced-motion` guard.', 'No dead CSS left behind; no `!important` that fixing the specificity would remove.'] },
        'Teams also set **performance budgets** (maximum CSS size, number of font files, a target Largest Contentful Paint), so regressions are caught when they are introduced.',
      ],
      example: [
        { code: 'styles/\n  tokens.css  reset.css  layout.css\n  components/button.css  components/card.css\n  utilities.css', lang: 'text' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'Which animation is cheapest for the browser?', options: ['left from 0 to 100px', 'width from 200px to 300px', 'transform: translateX(100px)', 'margin-left from 0 to 100px'], answer: 2, explain: 'transform can usually be handled by the compositor alone.' },
        { q: 'Where should `loading="lazy"` NOT go?', options: ['Images far down a long page', 'The large hero image at the top (the LCP element)', 'Gallery thumbnails below the fold', 'Footer logos'], answer: 1, explain: 'Lazy-loading the main above-the-fold image delays the page\'s largest paint.' },
        { q: 'What does `content-visibility: auto` do?', options: ['Hides content from screen readers', 'Skips rendering off-screen content until it is near the viewport', 'Lazy-loads images', 'Removes unused CSS'], answer: 1, explain: 'Pair it with contain-intrinsic-size to keep scroll height stable.' },
        { q: 'A printed article shows "Read the guide" with no way to find the page. Fix?', options: ['Underline links in print', 'a[href^="http"]::after { content: " (" attr(href) ")"; } in @media print', 'Remove links', 'Use a QR code font'], answer: 1, explain: 'Paper cannot be clicked, so print the URL.' },
        { q: 'What is a widow in print typography?', options: ['A lone line of a paragraph at the bottom of a page', 'A lone line carried over to the top of the next page', 'A heading without content', 'An empty page'], answer: 1, explain: 'An orphan is the lone line left at the bottom.' },
        { q: 'Which is progressive enhancement done right?', options: ['Modern grid everywhere, undone inside @supports not (display: grid)', 'A flex baseline everywhere, grid added inside @supports (display: grid)', 'Only supporting the latest Chrome', 'Browser sniffing with JavaScript'], answer: 1, explain: 'The baseline is unconditional; only the enhancement is conditional.' },
        { q: 'Which DevTools panel shows CSS rules a page never used?', options: ['Network', 'Coverage', 'Console', 'Application'], answer: 1, explain: 'Coverage lists used and unused bytes per file.' },
      ],
    },
  ],
};
