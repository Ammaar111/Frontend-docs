// HTML & CSS course, Parts 55 (Level 15), 60 and 61: final assessment and
// the two build-from-a-brief challenges.
const photo = (fill) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23${fill}'/%3E%3C/svg%3E`;
const RECIPES = [
  ['fcd34d', 'Bowl of lemon garlic pasta with basil', 'Lemon Garlic Pasta', '25 min', 'easy', 'Easy'],
  ['f97316', 'Paneer tikka skewers on a grill', 'Paneer Tikka', '45 min', 'medium', 'Medium'],
  ['a3e635', 'Green moong dal chilla with chutney', 'Moong Dal Chilla', '20 min', 'easy', 'Easy'],
  ['b91c1c', 'Slow-cooked Hyderabadi biryani in a handi', 'Hyderabadi Biryani', '2 hr', 'hard', 'Hard'],
];
const DOC = (title) => `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${title}</title>\n<style>\n`;

export default {
  id: 'css-final',
  title: 'Final assessment and challenges',
  lessons: [
    {
      id: 'css-final-theory',
      title: 'Final CSS assessment',
      source: 'HTML & CSS course, Part 60',
      runner: 'quiz',
      teach: [
        'Take this without looking back. Three of the course\'s own answers need correcting, and the questions below use the corrected versions:',
        { list: ['**The cascade order** is more than "user agent → user → author → !important". From lowest to highest: normal declarations by origin (user agent, user, author), within author styles by **cascade layer** (unlayered last) and then **specificity** and **source order**; inline `style` attributes beat author rules; then CSS animations; then `!important` declarations in **reverse** origin and layer order (author important, then user important, then user-agent important); and running transitions above everything.', '**`overflow: hidden` and margin collapsing**: a new block formatting context stops the margins of the container and its children collapsing **through** its edge. Siblings **inside** it still collapse with each other.', '**`flex: 1 1 0` with uneven content**: the three children are equal, because the basis is 0. The exception is content that cannot shrink: an item will not go below its min-content width (`min-width: auto`), so a long unbreakable word makes that one wider. `min-width: 0` restores equal widths.'] },
      ],
      example: [
        { code: '.a { color: red !important; }\n#b { color: blue; }\n/* <p id="b" class="a">: red, because important beats any normal declaration */', lang: 'css' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'What colour is the text?', options: ['blue, because ids beat classes', 'red, because an !important declaration beats every normal declaration whatever the specificity', 'black', 'It depends on source order'], answer: 1, explain: 'Specificity is only compared between declarations of the same importance.', code: '.a { color: red !important; }\n#b { color: blue; }\n\n<p id="b" class="a">Text</p>', lang: 'css' },
        { q: '`.box { width: 50%; padding: 20px; box-sizing: content-box; }` in a 400px parent. Rendered width?', options: ['200px', '220px', '240px', '160px'], answer: 2, explain: '200px of content plus 2 × 20px padding.' },
        { q: 'Three `flex: 1 1 0` children: one has much more (normal, wrapping) text. Widths?', options: ['The long one is widest', 'Equal: with a zero basis the free space is shared equally', 'The short ones collapse', 'Random'], answer: 1, explain: 'Only content that cannot wrap (min-content wider than the share) breaks the equality; min-width: 0 fixes that.' },
        { q: 'Which ranks highest in the cascade?', options: ['An author rule with an id selector', 'An inline style attribute', 'An author !important declaration', 'A user-agent rule'], answer: 2, explain: 'Important declarations come above all normal ones, inline styles included (only transitions and user/UA important rank higher).' },
        { q: 'A parent has `overflow: hidden`. Which margins still collapse?', options: ['None at all', 'Margins of siblings inside it, with each other', 'The parent\'s margin with its first child\'s', 'Only horizontal margins'], answer: 1, explain: 'The new BFC stops collapsing through its edge, not between its children.' },
        { q: 'What is the difference between `inherit`, `initial` and `unset`?', options: ['They are synonyms', 'inherit: the parent\'s value; initial: the property\'s spec default; unset: inherit for inherited properties, initial otherwise', 'unset removes the element', 'initial uses the browser stylesheet'], answer: 1, explain: 'Note that initial is the spec default (display: inline for every element), not the browser\'s default for that element.' },
        { q: 'Why can `z-index: 9999` lose to `z-index: 2`?', options: ['A browser maximum', 'They are in different stacking contexts, and only the contexts\' own levels are compared', 'z-index needs !important', 'Only for fixed elements'], answer: 1, explain: 'Look for the ancestor that creates the context.' },
        { q: '`.item { flex: 1 1 auto; }` refuses to shrink below its content. Fix?', options: ['flex-shrink: 2', 'min-width: 0 (plus overflow-wrap or overflow for the content)', 'width: 0', 'display: block'], answer: 1, explain: 'Flex items default to min-width: auto.' },
        { q: 'Where does `gap` work?', options: ['Grid only', 'Flexbox, Grid and multi-column layout', 'Any block', 'Tables only'], answer: 1, explain: 'It spaces items without adding space at the outer edges.' },
        { q: 'What does `prefers-reduced-motion: reduce` detect?', options: ['A slow device', 'An OS setting asking for less motion, often because motion causes dizziness or nausea', 'Battery saver', 'Low bandwidth'], answer: 1, explain: 'Respecting it is an accessibility requirement for significant motion.' },
      ],
    },
    {
      id: 'css-final-toast',
      title: 'Build from a description: notification toasts',
      source: 'HTML & CSS course, Part 55, Level 15',
      runner: 'page',
      slot: 'html',
      teach: [
        'A handoff with no scaffold, as at work. The brief:',
        { code: '"A notification toast: a small floating card in the bottom-right corner, with an icon, a title, a short message and a close button. Three variants: success, warning and error. The variant must not be communicated by colour alone. Long messages must wrap without breaking the layout."', lang: 'text' },
        { h: 'Design decisions to make yourself' },
        { list: ['**Several toasts at once.** The course\'s solution fixes each toast to the corner, so two toasts sit on top of each other. Put one fixed `.toast-region` in the corner and stack toasts inside it with a flex column.', '**Announcements.** The region is labelled; success and warning toasts use `role="status"` (polite), the error uses `role="alert"` (interrupts). In a live app the region must exist before toasts are inserted, or nothing is announced.', '**Not colour alone.** Each variant has a different icon **glyph** (✓, !, ×) and its title says what happened ("Saved", "Low stock", "Payment failed").', '**Wrapping.** The content column is `flex: 1; min-width: 0` with `overflow-wrap: anywhere` (Part 24).', '**Close button.** Icon-only, so `aria-label="Dismiss notification"`; at least 24 × 24px.', '**Contrast.** Coloured icons with white glyphs and coloured borders need 3:1 against their neighbours; body text 4.5:1.'] },
      ],
      example: [
        { code: '<div class="toast toast--error" role="alert">\n  <span class="toast__icon" aria-hidden="true">×</span>\n  <div class="toast__content">\n    <p class="toast__title">Payment failed</p>\n    <p class="toast__message">…</p>\n  </div>\n  <button type="button" class="toast__close" aria-label="Dismiss notification">×</button>\n</div>', lang: 'html' },
      ],
      task: [
        { ol: ['A complete document (lang, viewport, title) with a page `<h1>`.', 'A `.toast-region` labelled with `aria-label`, fixed `24px` from the bottom and right of the viewport, stacking its toasts in a flex column with a gap.', 'Three `.toast`s inside it: `.toast--success` and `.toast--warning` with `role="status"`, `.toast--error` with `role="alert"`. Each has a `.toast__icon` (`aria-hidden="true"`, a different glyph per variant), a `.toast__content` with `.toast__title` and `.toast__message`, and a `button.toast__close` with an `aria-label`.', 'Each toast: a flex row, at most `360px` wide, with a `4px` start-side border whose colour differs per variant, and an icon background of the same colour.', 'The error message is a long unbroken string (an order reference or URL): it must wrap inside the toast.', 'The close button is at least 24 × 24px.'] },
      ],
      starter: `${DOC('Toasts')}\n</style>\n</head>\n<body>\n\n</body>\n</html>\n`,
      solution: `${DOC('Notifications | ToyShop')}  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; color: #1a1a1a; }
  p { margin: 0; }
  .toast-region { position: fixed; right: 24px; bottom: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 12px; width: min(360px, calc(100vw - 48px)); }
  .toast { display: flex; align-items: flex-start; gap: 12px; max-width: 360px; padding: 16px; background: white; border-radius: 10px; border-inline-start: 4px solid; box-shadow: 0 8px 24px rgb(0 0 0 / 0.15); }
  .toast--success { border-color: #1d7a3b; }
  .toast--warning { border-color: #8a5a00; }
  .toast--error { border-color: #b3123a; }
  .toast__icon { flex: 0 0 auto; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; color: white; font-weight: 700; }
  .toast--success .toast__icon { background: #1d7a3b; }
  .toast--warning .toast__icon { background: #8a5a00; }
  .toast--error .toast__icon { background: #b3123a; }
  .toast__content { flex: 1; min-width: 0; }
  .toast__title { font-weight: 700; }
  .toast__message { color: #4b5563; font-size: 0.875rem; overflow-wrap: anywhere; }
  .toast__close { flex: 0 0 auto; min-width: 24px; min-height: 24px; padding: 0; border: 0; border-radius: 4px; background: none; color: #4b5563; font-size: 1.25rem; line-height: 1; cursor: pointer; }
  .toast__close:hover { color: #1a1a1a; }
  .toast__close:focus-visible { outline: 2px solid #3454d1; outline-offset: 2px; }
</style>
</head>
<body>
  <main>
    <h1>Order updates</h1>
  </main>
  <div class="toast-region" aria-label="Notifications">
    <div class="toast toast--success" role="status">
      <span class="toast__icon" aria-hidden="true">✓</span>
      <div class="toast__content">
        <p class="toast__title">Saved</p>
        <p class="toast__message">Your delivery address has been updated.</p>
      </div>
      <button type="button" class="toast__close" aria-label="Dismiss notification">×</button>
    </div>
    <div class="toast toast--warning" role="status">
      <span class="toast__icon" aria-hidden="true">!</span>
      <div class="toast__content">
        <p class="toast__title">Low stock</p>
        <p class="toast__message">Only 2 train sets left at the Andheri store.</p>
      </div>
      <button type="button" class="toast__close" aria-label="Dismiss notification">×</button>
    </div>
    <div class="toast toast--error" role="alert">
      <span class="toast__icon" aria-hidden="true">×</span>
      <div class="toast__content">
        <p class="toast__title">Payment failed</p>
        <p class="toast__message">Reference TXN-20261024-MUMBAI-ANDHERI-00000017731942-RETRY-WITH-ANOTHER-CARD</p>
      </div>
      <button type="button" class="toast__close" aria-label="Dismiss notification">×</button>
    </div>
  </div>
</body>
</html>
`,
      checks: [
        { label: 'document and region', mistake: 'lang, viewport and title, an h1, and a .toast-region with an aria-label containing three .toast elements.', check: ({ doc, $, $$ }) => { const region = $('.toast-region'); const ok = doc.documentElement.lang && doc.querySelector('meta[name="viewport"]') && doc.title.trim() && Boolean($('h1')) && region && region.getAttribute('aria-label') && $$('.toast-region .toast').length === 3; return Boolean(ok) || 'check the document basics, the h1, and a labelled .toast-region holding three .toast elements'; } },
        { label: 'live-region roles', mistake: 'role="status" on the success and warning toasts, role="alert" on the error toast.', check: ({ $ }) => { const roles = ['.toast--success', '.toast--warning', '.toast--error'].map((s) => $(s)?.getAttribute('role')); return roles.join() === 'status,status,alert' || `roles are ${roles.join(', ')}`; } },
        { label: 'anatomy and accessible close', mistake: 'Each toast: .toast__icon (aria-hidden, a different glyph per variant), .toast__content with .toast__title and .toast__message, and button.toast__close with an aria-label, at least 24×24px.', check: ({ $$ }) => { const toasts = $$('.toast'); const icons = toasts.map((t) => t.querySelector('.toast__icon')); const parts = toasts.every((t) => t.querySelector('.toast__content .toast__title')?.textContent.trim() && t.querySelector('.toast__content .toast__message') && t.querySelector('button.toast__close[aria-label]')); const glyphs = new Set(icons.map((i) => i?.textContent.trim())).size === 3 && icons.every((i) => i?.getAttribute('aria-hidden') === 'true'); const big = toasts.every((t) => { const r = t.querySelector('.toast__close')?.getBoundingClientRect(); return r && r.width >= 24 && r.height >= 24; }); return (parts && glyphs && big) || `parts complete ${parts}, three different hidden glyphs ${glyphs}, close buttons ≥ 24px ${big}`; } },
        { label: 'stacked in the corner', mistake: '.toast-region { position: fixed; right: 24px; bottom: 24px; display: flex; flex-direction: column; gap: … }', check: ({ document, $, $$, rect }) => { const s = getComputedStyle($('.toast-region')); const r = rect('.toast-region'); const t = $$('.toast').map((x) => rect(x)); const stacked = t[1].top >= t[0].bottom && t[2].top >= t[1].bottom; return (s.position === 'fixed' && Math.round(document.documentElement.clientWidth - r.right) === 24 && Math.round(window.innerHeight - r.bottom) === 24 && s.display === 'flex' && s.flexDirection === 'column' && stacked) || `region ${s.position}, ${Math.round(document.documentElement.clientWidth - r.right)}px from the right and ${Math.round(window.innerHeight - r.bottom)}px from the bottom; toasts stacked ${stacked}`; } },
        { label: 'variants beyond colour', mistake: 'Each toast is a flex row ≤ 360px with a 4px start border; the border colour differs per variant and matches its icon background.', check: ({ $$ }) => { const toasts = $$('.toast'); const s = toasts.map((t) => getComputedStyle(t)); const row = s.every((x) => x.display === 'flex' && x.borderLeftWidth === '4px') && toasts.every((t) => t.getBoundingClientRect().width <= 360.5); const colours = s.map((x) => x.borderLeftColor); const matched = toasts.every((t, i) => getComputedStyle(t.querySelector('.toast__icon')).backgroundColor === colours[i]); return (row && new Set(colours).size === 3 && matched) || `flex rows ≤ 360px with 4px borders: ${row}; distinct border colours ${new Set(colours).size}; icons match borders ${matched}`; } },
        { label: 'long text wraps', mistake: '.toast__content { flex: 1; min-width: 0; } and overflow-wrap: anywhere on the message.', check: ({ $, rect }) => { const t = $('.toast--error'); const msg = t.querySelector('.toast__message'); const fits = msg.scrollWidth <= msg.clientWidth + 1 && rect(t).width <= 360.5 && rect(t.querySelector('.toast__close')).right <= rect(t).right; return fits || 'the long reference pushes the error toast wider or overflows its message'; } },
      ],
    },
    {
      id: 'css-final-recipe',
      title: 'Final challenge: recipe discovery page',
      source: 'HTML & CSS course, Part 61',
      runner: 'page',
      slot: 'html',
      teach: [
        'The course\'s final brief, as a real take-home task: a **recipe discovery** page (this lesson builds the grid page; the detail page reuses the same tokens and header).',
        { ol: ['A sticky header with logo, primary nav and a search that **widens on focus** (CSS only).', 'A hero introducing the app, with the large search as its call to action.', 'A horizontal filter bar of "chip" toggles that scrolls sideways on phones.', 'A responsive recipe-card grid: image, title, cook-time badge, difficulty badge, a save icon-button.', 'Dark mode by swapping tokens; responsive from 360px; tokens for every value; landmarks, labels, focus states, correct headings, no colour-only meaning.', 'At least one layout decision of your own.'] },
        { h: 'Problems in the course\'s reference implementation' },
        'Reviewing someone else\'s solution is part of the job. The reference page has real defects:',
        { list: ['It uses `class="visually-hidden"` on the search label but never defines the class, so the label shows as plain text.', 'The hero and grid sit outside any `<main>`, so the page has no main landmark (and the skip-link target is missing).', 'The "medium" difficulty badge, `#b3760b` text on `#fff4e0`, is about **3.5:1**, below the 4.5:1 that 12px text needs.', 'The logo is a `<span>`, not a link home, and the save buttons have no `aria-pressed` state.', 'The search widens with fixed `320px`/`480px` widths and a separate phone media query; `width: min(100%, 320px)` growing to `min(100%, 480px)` does the same at every size.'] },
        { h: 'Patterns to reuse' },
        { list: ['Search growth: `.hero-search:focus-within input { width: … }` with a `width` transition (motion-guarded). `:focus-within` on the form reacts to focus anywhere inside it.', 'Chips: `<button aria-pressed>` styled by `[aria-pressed="true"]`; the row is `display: flex; overflow-x: auto; scroll-snap-type: x proximity;` with chips that do not shrink.', 'Cards: the Part 53 pattern: `aspect-ratio: 4 / 3` media, `object-fit: cover`, an absolutely positioned save button.', 'Badges say their meaning in text ("Easy", "45 min"), so colour is a reinforcement, not the message.'] },
      ],
      example: [
        { code: '.hero-search input { width: min(100%, 320px); transition: width 0.25s ease; }\n.hero-search:focus-within input { width: min(100%, 480px); }\n@media (prefers-reduced-motion: reduce) { .hero-search input { transition: none; } }', lang: 'css' },
      ],
      task: [
        { ol: ['Document basics; `:root` tokens including `--color-accent` and three difficulty colours; a `[data-theme="dark"]` block that swaps at least `--color-bg`, `--color-surface` and `--color-text`, with every component built on the tokens.', '`header.site-header` sticky with a logo **link**, a `<nav aria-label>` of links. Then a `<main>` containing everything else.', '`section.hero` with the `<h1>` and `form.hero-search[role="search"]` holding a visually hidden but defined `<label>` and an `input[type="search"]`. The input is `min(100%, 320px)` wide and grows to `min(100%, 480px)` when the form has focus within.', '`.filter-row` (`role="group"` with an `aria-label`) of at least 4 `button.filter-chip[aria-pressed]`; exactly one pressed, styled with the accent background; the row never wraps and scrolls sideways at 360px instead of widening the page.', '`ul.recipe-grid` of `article.recipe-card`s (4 cards): `repeat(auto-fill, minmax(240px, 1fr))`; 4:3 covered images; an `<h3>` with a link; a `.badge--time` and a difficulty badge (`.badge--easy`, `--medium` or `--hard`) whose text says the level, each at least 4.5:1 contrast; a `button.recipe-card__save` with an `aria-label` and `aria-pressed`, absolutely positioned on the image.', 'No horizontal page scroll at 360px.'] },
      ],
      starter: `${DOC('Recipes')}\n</style>\n</head>\n<body>\n\n</body>\n</html>\n`,
      solution: `${DOC('Kitchenly | Discover recipes')}  :root {
    color-scheme: light dark;
    --color-bg: #fafaf7;
    --color-surface: #ffffff;
    --color-text: #1a1a1a;
    --color-muted: #5f5f5f;
    --color-border: #e5e2da;
    --color-accent: #a35f28;
    --color-on-accent: #ffffff;
    --color-difficulty-easy: #1d6b35;
    --color-difficulty-medium: #8a5300;
    --color-difficulty-hard: #a3112f;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-12: 3rem;
    --radius-md: 12px;
    --radius-full: 999px;
    --content-max-width: 1100px;
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --color-bg: #1a1712;
    --color-surface: #24211b;
    --color-text: #f2efe8;
    --color-muted: #b5ae9f;
    --color-border: #3a352c;
    --color-accent: #e0975a;
    --color-on-accent: #1a1712;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; color: var(--color-text); background: var(--color-bg); }
  img { display: block; max-width: 100%; }
  h1, h3, p { margin: 0; }
  a { color: inherit; }
  ul { list-style: none; margin: 0; padding: 0; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .container { width: min(100% - 2.5rem, var(--content-max-width)); margin-inline: auto; }
  .site-header { position: sticky; top: 0; z-index: 10; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
  .site-header .container { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-5); padding-block: var(--space-4); }
  .logo { margin-right: auto; font-weight: 800; font-size: 1.15rem; text-decoration: none; }
  .site-header nav { display: flex; gap: var(--space-5); font-size: 0.9rem; }
  .hero { padding-block: var(--space-12) var(--space-6); text-align: center; }
  .hero h1 { margin-bottom: var(--space-2); font-size: clamp(1.75rem, 4vw + 0.5rem, 2.75rem); text-wrap: balance; }
  .hero p { margin-bottom: var(--space-6); color: var(--color-muted); }
  .hero-search input { width: min(100%, 320px); padding: var(--space-3) var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-full); background: var(--color-surface); color: var(--color-text); font: inherit; transition: width 0.25s ease; }
  .hero-search:focus-within input { width: min(100%, 480px); }
  .filter-row { display: flex; flex-wrap: nowrap; gap: var(--space-2); overflow-x: auto; padding-block: var(--space-2) var(--space-6); scroll-snap-type: x proximity; }
  .filter-chip { flex: 0 0 auto; scroll-snap-align: start; padding: var(--space-2) var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-full); background: var(--color-surface); color: var(--color-text); font: inherit; font-size: 0.875rem; cursor: pointer; }
  .filter-chip[aria-pressed="true"] { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-on-accent); }
  .recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-5); padding-bottom: var(--space-12); }
  .recipe-card { overflow: hidden; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
  .recipe-card__media { position: relative; aspect-ratio: 4 / 3; }
  .recipe-card__media img { width: 100%; height: 100%; object-fit: cover; }
  .recipe-card__save { position: absolute; top: var(--space-2); right: var(--space-2); width: 36px; height: 36px; border: 0; border-radius: 50%; background: rgb(255 255 255 / 0.92); color: #1a1a1a; font-size: 1.1rem; cursor: pointer; }
  .recipe-card__save[aria-pressed="true"] { background: var(--color-accent); color: var(--color-on-accent); }
  .recipe-card__body { padding: var(--space-4); }
  .recipe-card__title { margin-bottom: var(--space-2); font-size: 1rem; }
  .recipe-card__title a { text-decoration: none; }
  .recipe-card__meta { display: flex; gap: var(--space-2); font-size: 0.75rem; }
  .badge { padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-weight: 700; }
  .badge--time { background: #eef0fb; color: #2b44a8; }
  .badge--easy { background: #e3f7e9; color: var(--color-difficulty-easy); }
  .badge--medium { background: #fff4e0; color: var(--color-difficulty-medium); }
  .badge--hard { background: #fde3e8; color: var(--color-difficulty-hard); }
  @media (prefers-reduced-motion: reduce) {
    .hero-search input { transition: none; }
  }
</style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="logo" href="/">Kitchenly</a>
      <nav aria-label="Primary"><a href="/">Discover</a><a href="/saved">Saved</a><a href="/plans">Meal plans</a></nav>
    </div>
  </header>
  <main>
    <section class="hero container">
      <h1>Find your next favourite recipe</h1>
      <p>Search by ingredient, cuisine or cook time.</p>
      <form class="hero-search" role="search">
        <label class="visually-hidden" for="recipe-search">Search recipes</label>
        <input type="search" id="recipe-search" placeholder="Try “30-minute dal”">
      </form>
    </section>
    <div class="container">
      <div class="filter-row" role="group" aria-label="Recipe filters">
        <button type="button" class="filter-chip" aria-pressed="true">All</button>
        <button type="button" class="filter-chip" aria-pressed="false">North Indian</button>
        <button type="button" class="filter-chip" aria-pressed="false">Vegetarian</button>
        <button type="button" class="filter-chip" aria-pressed="false">Under 30 minutes</button>
        <button type="button" class="filter-chip" aria-pressed="false">Gluten-free</button>
        <button type="button" class="filter-chip" aria-pressed="false">Jain</button>
      </div>
      <ul class="recipe-grid">
${RECIPES.map(([fill, alt, name, time, level, label], i) => `        <li>
          <article class="recipe-card">
            <div class="recipe-card__media">
              <img src="${photo(fill)}" alt="${alt}" width="400" height="300"${i > 1 ? ' loading="lazy"' : ''}>
              <button type="button" class="recipe-card__save" aria-label="Save ${name}" aria-pressed="false">♡</button>
            </div>
            <div class="recipe-card__body">
              <h3 class="recipe-card__title"><a href="/recipes/${name.toLowerCase().replace(/ /g, '-')}">${name}</a></h3>
              <p class="recipe-card__meta"><span class="badge badge--time">${time}</span><span class="badge badge--${level}">${label}</span></p>
            </div>
          </article>
        </li>`).join('\n')}
      </ul>
    </div>
  </main>
</body>
</html>
`,
      checks: [
        { label: 'landmarks and labels', mistake: 'header.site-header with a logo link and a labelled nav; a main containing the hero, filters and grid; the search label must be a real, defined visually hidden label.', check: ({ doc, $, $$ }) => { const main = $('main'); const label = $('label[for="recipe-search"]'); const hiddenWorks = label && label.getBoundingClientRect().width <= 1 && getComputedStyle(label).display !== 'none'; const ok = doc.documentElement.lang && doc.querySelector('meta[name="viewport"]') && doc.title.trim() && $('header.site-header a[href].logo, header.site-header .logo[href]') && $('header.site-header nav[aria-label]') && main && main.contains($('.hero')) && main.contains($('.recipe-grid')) && $('form.hero-search[role="search"] input#recipe-search[type="search"]') && hiddenWorks && $$('h1').length === 1; return Boolean(ok) || (!main ? 'put the hero, filters and grid inside <main>' : !hiddenWorks ? 'the search label is visible or missing: define .visually-hidden' : 'check the document basics, the logo link, the labelled nav and the search form'); } },
        { label: 'search widens on focus', mistake: '.hero-search input { width: min(100%, 320px); transition: width …; } and .hero-search:focus-within input { width: min(100%, 480px); }', check: async ({ $, atWidth, settle }) => { const v = await atWidth(1024); const input = $('#recipe-search'); const before = Math.round(input.getBoundingClientRect().width); input.focus(); await settle(); input.getAnimations().forEach((a) => a.finish()); await settle(); const after = Math.round(input.getBoundingClientRect().width); input.blur(); await settle(); input.getAnimations().forEach((a) => a.finish()); const phone = await atWidth(360); const narrow = phone.rect('#recipe-search').width <= phone.rect('.hero').width; return (before === 320 && after === 480 && narrow && /width/.test(getComputedStyle(input).transitionProperty)) || `search ${before}px, focused ${after}px; fits a phone ${narrow}`; } },
        { label: 'filter chips', mistake: 'A .filter-row[role="group"][aria-label] of 4+ button.filter-chip[aria-pressed], one pressed with the accent background; the row does not wrap and scrolls sideways on phones.', check: async ({ $, $$, atWidth }) => { const chips = $$('.filter-row button.filter-chip[aria-pressed]'); const pressed = chips.filter((c) => c.getAttribute('aria-pressed') === 'true'); const accent = pressed.length === 1 && getComputedStyle(pressed[0]).backgroundColor !== getComputedStyle(chips.find((c) => c !== pressed[0])).backgroundColor; const v = await atWidth(360); const row = v.$('.filter-row'); const tops = chips.map((c) => Math.round(c.getBoundingClientRect().top)); const oneLine = tops.every((t) => t === tops[0]); const scrolls = ['auto', 'scroll'].includes(getComputedStyle(row).overflowX) && row.scrollWidth > row.clientWidth; const page = v.doc.documentElement.scrollWidth <= v.doc.documentElement.clientWidth; return ($('.filter-row[role="group"][aria-label]') && chips.length >= 4 && accent && oneLine && scrolls && page) || `${chips.length} chips, one accent pressed ${accent}; at 360px one line ${oneLine}, scrolls inside ${scrolls}, page fits ${page}`; } },
        { label: 'recipe cards', mistake: 'ul.recipe-grid with 4 article.recipe-card: repeat(auto-fill, minmax(240px, 1fr)), 4:3 covered images, an h3 link, a time badge and a difficulty badge, and an absolutely positioned save button with aria-label and aria-pressed.', check: async ({ $$, atWidth }) => { const cards = $$('ul.recipe-grid > li > article.recipe-card'); const parts = cards.length === 4 && cards.every((c) => c.querySelector('h3 a[href]') && c.querySelector('.badge--time') && c.querySelector('.badge--easy, .badge--medium, .badge--hard') && c.querySelector('button.recipe-card__save[aria-label][aria-pressed]') && getComputedStyle(c.querySelector('.recipe-card__save')).position === 'absolute'); const imgs = cards.map((c) => c.querySelector('img').getBoundingClientRect()); const ratio = imgs.every((r) => Math.abs(r.width / r.height - 4 / 3) < 0.02) && cards.every((c) => getComputedStyle(c.querySelector('img')).objectFit === 'cover'); const v = await atWidth(1100); const r = v.$$('.recipe-card').map((c) => c.getBoundingClientRect()); const perRow = r.filter((x) => Math.abs(x.top - r[0].top) < 1).length; return (parts && ratio && perRow === 4) || `cards complete ${parts}; 4:3 covered images ${ratio}; ${perRow} per row at 1100px`; } },
        { label: 'badges readable and meaningful', mistake: 'Every badge says its meaning in text and has at least 4.5:1 contrast (the course\'s #b3760b on #fff4e0 is about 3.5:1).', check: ({ $$ }) => { const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number); const lum = (c) => { const [r, g, b] = parse(c).map((x) => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }; const bad = $$('.badge').filter((b) => { const s = getComputedStyle(b); const [x, y] = [lum(s.color), lum(s.backgroundColor)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) < 4.5 || !b.textContent.trim(); }).map((b) => b.textContent.trim() || '(empty)'); const levels = $$('.badge--easy, .badge--medium, .badge--hard').every((b) => /easy|medium|hard/i.test(b.textContent)); return (bad.length === 0 && levels) || (levels ? `low-contrast badges: ${bad.join(', ')}` : 'difficulty badges must say the level in text'); } },
        { label: 'dark mode by token swap', mistake: ':root[data-theme="dark"] redefines --color-bg, --color-surface and --color-text; body, header and cards follow.', check: async ({ document, $, settle }) => { const root = document.documentElement; const before = [document.body, $('.site-header'), $('.recipe-card')].map((el) => getComputedStyle(el).backgroundColor).join(); root.dataset.theme = 'dark'; await settle(); const after = [document.body, $('.site-header'), $('.recipe-card')].map((el) => getComputedStyle(el).backgroundColor); const textChanged = getComputedStyle(document.body).color; delete root.dataset.theme; await settle(); const darkBg = after.every((c) => { const [r, g, b] = (c.match(/[\d.]+/g) || []).map(Number); return r + g + b < 200; }); return (darkBg && after.join() !== before && textChanged !== getComputedStyle(document.body).color) || 'with data-theme="dark", the body, header and cards do not switch to dark tokens'; } },
        { label: 'fits a 360px phone', mistake: 'Nothing wider than the screen at 360px: the chips scroll inside their row, the grid drops to one column.', check: async ({ atWidth }) => { const v = await atWidth(360); const fits = v.doc.documentElement.scrollWidth <= v.doc.documentElement.clientWidth; const r = v.$$('.recipe-card').map((c) => c.getBoundingClientRect()); const oneCol = r.every((x, i) => i === 0 || x.top >= r[i - 1].bottom); return (fits && oneCol) || `fits ${fits}, one column ${oneCol}`; } },
      ],
    },
  ],
};
