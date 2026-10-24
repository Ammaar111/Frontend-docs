// HTML & CSS course, Parts 28–29: CSS functions and custom properties.
export default {
  id: 'css-functions-variables',
  title: 'CSS functions and custom properties',
  lessons: [
    {
      id: 'css-math-functions',
      title: 'calc(), min() and max()',
      source: 'HTML & CSS course, Part 28',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="page-container">\n  <div class="wrap"><aside class="aside">300px panel</aside><main class="main">Main</main></div>\n  <div class="frame"><div class="container">Fluid but capped</div></div>\n  <p class="text">Prices include GST.</p>\n</div>',
        css: 'body { margin: 0; font: 16px/1.4 Arial, sans-serif; }\n.page-container { background: #f8fafc; }\n.wrap { width: 800px; display: flex; }\n.aside { width: 300px; flex-shrink: 0; background: #f1f5f9; }\n.main { background: #e0e7ff; }\n.frame { width: 800px; }\n.container { background: #fde68a; }',
      },
      teach: [
        { h: 'calc(): mix units' },
        '`calc()` does arithmetic (`+ - * /`) and, more importantly, mixes units that cannot otherwise be combined: `calc(100% - 300px)`, `calc(1rem + 2vw)`. It nests and follows normal precedence.',
        { warn: '`+` and `-` need a space on **both** sides. `calc(100% -300px)` reads `-300px` as a negative number with no operator between the two values: the declaration is invalid and silently dropped. `*` and `/` do not need spaces, but use them anyway.' },
        { h: 'min() and max(): one bound' },
        { list: ['`width: min(90%, 600px)`: the **smaller** one: fluid, but never wider than 600px. (min() sets a **maximum**: the name trips everyone up once.)', '`font-size: max(1rem, 2vw)`: the **larger** one: fluid, but never below 1rem.', '`clamp(MIN, VAL, MAX)` is exactly `max(MIN, min(VAL, MAX))`: both bounds at once (Part 26).', 'Inside min/max/clamp you can do maths without writing calc(): `min(100% - 2rem, 1140px)`.'] },
        { h: 'The page container pattern' },
        { code: '.page-container {\n  width: min(100% - 2rem, 1140px);   /* 1rem gutter each side on phones, capped on desktops */\n  margin-inline: auto;               /* centred (left + right margins, Part 38) */\n}', lang: 'css' },
        { warn: '`100vw` includes the vertical scrollbar on desktop browsers, so `width: 100vw` (or `calc(100vw - 300px)`) is wider than the visible page and causes a horizontal scrollbar. Prefer `100%` of a parent.' },
      ],
      example: [
        { code: '.sidebar-layout .content { width: calc(100% - 300px); }\n.hero h1 { font-size: max(1.5rem, 4vw); }', lang: 'css' },
      ],
      task: [
        { ol: ['`.main`: the width of `.wrap` minus the 300px panel, using `calc()` (500px here).', '`.container`: 90% of `.frame`, but never wider than 600px, using `min()`.', '`.text`: `max(1rem, 2vw)` font size (16px on phones, 24px at a 1200px viewport).', '`.page-container`: `min(100% - 2rem, 1140px)` wide, centred with `margin-inline: auto`.'] },
      ],
      starter: '.main {\n  width: calc(100% -300px);\n}\n\n.container {\n  width: 90%;\n  max-width: 60%;\n}\n',
      solution: '.main {\n  width: calc(100% - 300px);\n}\n\n.container {\n  width: min(90%, 600px);\n}\n\n.text {\n  font-size: max(1rem, 2vw);\n}\n\n.page-container {\n  width: min(100% - 2rem, 1140px);\n  margin-inline: auto;\n}\n',
      checks: [
        { label: 'calc() with spaced operators', mistake: 'width: calc(100% - 300px): without spaces around -, the whole declaration is invalid and ignored.', check: ({ document, rect, h }) => { const decl = h.declared(document.querySelector('style[data-source="learner"]').sheet, '.main', 'width'); return (Math.round(rect('.main').width) === 500 && /calc\(/.test(decl)) || (decl ? `.main is ${Math.round(rect('.main').width)}px wide` : 'the .main width declaration is missing or invalid (check the spaces around -)'); } },
        { label: 'fluid but capped', mistake: '.container { width: min(90%, 600px); }: 600px in an 800px frame, 360px in a 400px one.', check: async ({ $, rect, settle }) => { const wide = Math.round(rect('.container').width); $('.frame').style.width = '400px'; await settle(); const narrow = Math.round(rect('.container').width); $('.frame').style.width = ''; await settle(); return (wide === 600 && narrow === 360) || `the container is ${wide}px in an 800px frame and ${narrow}px in a 400px one`; } },
        { label: 'font size with a floor', mistake: '.text { font-size: max(1rem, 2vw); }', check: async ({ atWidth }) => { const out = []; for (const w of [400, 1200]) { const v = await atWidth(w); out.push(Math.round(parseFloat(v.style('.text', 'font-size')))); } return out.join() === '16,24' || `font size is ${out.join(' / ')}px at 400/1200px`; } },
        { label: 'page container with gutters', mistake: '.page-container { width: min(100% - 2rem, 1140px); margin-inline: auto; }', check: async ({ atWidth }) => { const small = await atWidth(500); const r1 = small.rect('.page-container'); const got1 = [Math.round(r1.width), Math.round(r1.left)]; const want1 = [small.width - 32, 16]; const large = await atWidth(1400); const r2 = large.rect('.page-container'); const got2 = [Math.round(r2.width), Math.round(r2.left)]; const want2 = [1140, Math.round((large.width - 1140) / 2)]; return (got1.join() === want1.join() && got2.join() === want2.join()) || `at 500px: ${got1[0]}px wide at x=${got1[1]} (want ${want1[0]} at 16); at 1400px: ${got2[0]}px at x=${got2[1]} (want 1140 at ${want2[1]})`; } },
      ],
    },
    {
      id: 'css-custom-properties',
      title: 'Custom properties: tokens, scope and fallbacks',
      source: 'HTML & CSS course, Part 29',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<button class="button" type="button">Add to cart</button>\n<button class="button button-danger" type="button">Remove</button>\n<div class="card">Free delivery in Mumbai</div>\n<section class="theme-dark"><button class="button" type="button">Dark button</button></section>',
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\n.button { color: white; border: 0; }\n.theme-dark { background: #0f172a; padding: 16px; margin-top: 16px; }\n.theme-dark .button { color: #0f172a; }',
      },
      teach: [
        { code: ':root {\n  --color-primary: #4f46e5;   /* names start with two dashes, case-sensitive */\n  --space-md: 1rem;\n}\n.button {\n  background: var(--color-primary);\n  padding: var(--space-md);\n}', lang: 'css' },
        { list: ['`:root` matches `<html>`. Custom properties **inherit**, so values defined there are available everywhere.', '`var(--name, fallback)` uses the fallback when the property is not defined.', 'They are **live**: change one (in CSS or with `element.style.setProperty(\'--color-primary\', …)` from JavaScript) and everything using it updates. That is how theme switchers work.'] },
        { h: 'Scope: what preprocessors cannot do' },
        'Sass `$variables` are replaced by fixed values at build time. Custom properties take part in the cascade, so you can **redefine them in a scope**:',
        { code: '.button        { --button-bg: var(--color-primary); background: var(--button-bg); }\n.button-danger { --button-bg: #dc2626; }   /* change the input, not the background rule */\n.theme-dark    { --color-primary: #a5b4fc; }   /* every button inside picks this up */', lang: 'css' },
        'Each `var()` is resolved on the element where it is **used**, from the values that element sees. So a button inside `.theme-dark` reads the dark section\'s `--color-primary`.',
        { warn: 'A `var()` that resolves to nothing (undefined, no fallback) does **not** fall back to your previous declaration: the property becomes "invalid at computed-value time" and behaves like `unset`: inherited properties inherit, others go to their initial value (a transparent background). Always give a fallback in reusable components.' },
      ],
      example: [
        { code: '.badge {\n  --badge-size: 24px;               /* component-level configuration */\n  width: var(--badge-size);\n  height: var(--badge-size);\n  color: var(--badge-text, white);  /* fallback when no theme defines it */\n}', lang: 'css' },
      ],
      task: [
        { ol: ['On `:root`, define `--color-primary: #4f46e5`, `--space-md: 1rem` and `--radius-md: 8px`.', '`.button`: define `--button-bg` as `var(--color-primary)`, then use `var(--button-bg)` for the background, `--space-md` for the padding and `--radius-md` for the corners.', '`.button-danger`: red (`#dc2626`) by overriding **only** `--button-bg`, not the background.', '`.card`: `color: var(--card-text, #333)` (no theme defines `--card-text` yet, so the fallback shows).', '`.theme-dark`: redefine `--color-primary` as `#a5b4fc`, so the button inside turns light indigo with no extra button rules.'] },
      ],
      starter: ':root {\n  --color-primary: #4f46e5;\n}\n\n.button {\n  background: #4f46e5;\n  padding: 16px;\n}\n\n.button-danger {\n  background: #dc2626;\n}\n',
      solution: ':root {\n  --color-primary: #4f46e5;\n  --space-md: 1rem;\n  --radius-md: 8px;\n}\n\n.button {\n  --button-bg: var(--color-primary);\n  background: var(--button-bg);\n  padding: var(--space-md);\n  border-radius: var(--radius-md);\n}\n\n.button-danger {\n  --button-bg: #dc2626;\n}\n\n.card {\n  color: var(--card-text, #333);\n}\n\n.theme-dark {\n  --color-primary: #a5b4fc;\n}\n',
      checks: [
        { label: 'tokens on :root', mistake: ':root { --color-primary: #4f46e5; --space-md: 1rem; --radius-md: 8px; }', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const v = ['--color-primary', '--space-md', '--radius-md'].map((n) => h.customProperty(sheet, ':root', n).toLowerCase()); return v.join() === '#4f46e5,1rem,8px' || `:root tokens: ${v.map((x) => x || '(missing)').join(', ')}`; } },
        { label: 'button built from variables', mistake: 'background: var(--button-bg), padding: var(--space-md), border-radius: var(--radius-md): changing the token must change the button.', check: async ({ $, h, settle }) => { const b = $('.button'); const s = getComputedStyle(b); const before = h.sameValue('background-color', s.backgroundColor, '#4f46e5') && s.paddingTop === '16px' && s.borderTopLeftRadius === '8px'; document.documentElement.style.setProperty('--color-primary', '#008000'); document.documentElement.style.setProperty('--space-md', '10px'); await settle(); const live = h.sameValue('background-color', getComputedStyle(b).backgroundColor, '#008000') && getComputedStyle(b).paddingTop === '10px'; document.documentElement.style.removeProperty('--color-primary'); document.documentElement.style.removeProperty('--space-md'); await settle(); return (before && live) || (before ? 'the button looks right but does not follow the tokens: use var()' : `button: background ${s.backgroundColor}, padding ${s.paddingTop}, radius ${s.borderTopLeftRadius}`); } },
        { label: 'danger overrides the variable', mistake: '.button-danger { --button-bg: #dc2626; } with no background declaration of its own.', check: ({ document, $, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const own = h.declared(sheet, '.button-danger', 'background-color') || h.declared(sheet, '.button-danger', 'background-image'); const red = h.sameValue('background-color', getComputedStyle($('.button-danger')).backgroundColor, '#dc2626'); return (red && !own && h.customProperty(sheet, '.button-danger', '--button-bg').toLowerCase() === '#dc2626') || (own ? 'override --button-bg instead of setting background on .button-danger' : 'the danger button is not #dc2626'); } },
        { label: 'fallback value', mistake: '.card { color: var(--card-text, #333); }', check: async ({ $, h, settle }) => { const card = $('.card'); const fallback = h.sameValue('color', getComputedStyle(card).color, '#333'); card.style.setProperty('--card-text', '#008000'); await settle(); const themed = h.sameValue('color', getComputedStyle(card).color, '#008000'); card.style.removeProperty('--card-text'); return (fallback && themed) || (fallback ? 'the card ignores --card-text when it is defined' : `the card colour is ${getComputedStyle(card).color}; the fallback is #333`); } },
        { label: 'scoped theme', mistake: '.theme-dark { --color-primary: #a5b4fc; }: the inner button follows without a rule of its own.', check: ({ document, $, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const bg = getComputedStyle($('.theme-dark .button')).backgroundColor; return (h.sameValue('background-color', bg, '#a5b4fc') && h.customProperty(sheet, '.theme-dark', '--color-primary').toLowerCase() === '#a5b4fc' && h.sameValue('background-color', getComputedStyle($('.button')).backgroundColor, '#4f46e5')) || `the dark-section button is ${bg}`; } },
      ],
    },
  ],
};
