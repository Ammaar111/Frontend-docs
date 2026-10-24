// HTML & CSS course, Parts 13–14: what CSS is, and selectors.
// CSS lessons run as live pages: the fixture HTML plus the learner's CSS,
// checked through computed styles, so only rules that really apply count.
export default {
  id: 'css-selectors',
  title: 'CSS basics and selectors',
  lessons: [
    {
      id: 'css-how-it-applies',
      title: 'What CSS is and how it reaches the page',
      source: 'HTML & CSS course, Part 13',
      runner: 'quiz',
      teach: [
        '**CSS** (Cascading Style Sheets) describes presentation: colour, spacing, size, layout, typography, animation, separately from the HTML that describes meaning. It replaced presentational HTML like `<font color="red">` and `bgcolor`, which forced you to edit every page to change a colour scheme.',
        { code: 'p {                       /* selector: which elements */\n  color: darkslategray;   /* declaration: property: value; */\n  line-height: 1.5;\n}                         /* selector + declaration block = a rule */', lang: 'css' },
        { warn: 'End every declaration with `;`, even the last. Add a line after a missing semicolon and the two merge into one invalid declaration, which CSS silently ignores.' },
        { table: { head: ['Method', 'How', 'Use'], rows: [['Inline', '`<p style="color: red">`', 'one element only; very high specificity; avoid'], ['Internal', '`<style>` in `<head>`', 'one page only; fine for demos'], ['External', '`<link rel="stylesheet" href="styles.css">`', '**the default**: one file for every page, cached by the browser, keeps HTML about structure']] } },
        'Invalid CSS does not throw errors: the browser skips what it cannot parse and keeps going. DevTools\' Styles pane shows invalid declarations with a warning icon and overridden ones struck through.',
      ],
      example: [
        { code: '<head>\n  <link rel="stylesheet" href="styles.css">\n</head>', lang: 'html' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'In `h1 { margin-bottom: 20px; }`, what is `margin-bottom`?', options: ['The selector', 'The property', 'The value', 'The rule'], answer: 1, explain: 'h1 is the selector, 20px the value; property + value is a declaration.' },
        { q: 'Which is the most maintainable for a 20-page site?', options: ['Inline styles', 'A <style> block in each page', 'One external stylesheet linked from every page', 'They are equal'], answer: 2, explain: 'One edit point, and the browser downloads and caches it once.' },
        { q: 'What happens to `color: red font-size: 20px;` (missing semicolon)?', options: ['Both apply', 'Only the first applies', 'The broken declaration is ignored', 'The page shows an error'], answer: 2, explain: 'CSS silently drops what it cannot parse.' },
        { q: 'What problem was CSS created to solve?', options: ['Slow pages', 'Presentation mixed into HTML, so changing a look meant editing every page', 'Security', 'Interactivity'], answer: 1, explain: 'Separation of concerns: structure in HTML, presentation in CSS.' },
        { q: 'Why does caching favour external CSS?', options: ['External files are smaller', 'The file is downloaded once and reused on every page', 'Browsers cannot cache HTML', 'It is not true'], answer: 1, explain: 'Internal style blocks travel inside every HTML page.' },
      ],
    },
    {
      id: 'css-basic-selectors',
      title: 'Element, class, id and attribute selectors',
      source: 'HTML & CSS course, Part 14',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<header id="site-header"><h1>Toy Shop</h1></header>\n<main>\n  <p>Welcome to the shop. Free delivery in Mumbai.</p>\n  <button class="btn">Default</button>\n  <button class="btn btn-primary">Primary</button>\n  <button class="btn btn-primary btn-large">Big primary</button>\n  <form>\n    <input type="text" name="name" placeholder="Name">\n    <input type="email" name="email" required placeholder="Email">\n    <input type="password" name="pass" placeholder="Password">\n  </form>\n  <p class="links">\n    <a href="https://example.com">Secure site</a>\n    <a href="http://old.example.com">Old site</a>\n    <a href="/files/catalogue.pdf">Catalogue</a>\n    <a href="mailto:hi@toyshop.in">Email us</a>\n  </p>\n</main>',
      },
      teach: [
        { table: { head: ['Selector', 'Matches'], rows: [['`*`', 'every element (resets like `box-sizing`)'], ['`p`', 'every `<p>`'], ['`.card`', 'every element with class `card`: **the workhorse of real CSS**'], ['`.btn.btn-primary`', 'elements with **both** classes'], ['`#site-header`', 'the one element with that id (use sparingly: ids are unique and very specific)'], ['`[required]`', 'has the attribute'], ['`[type="email"]`', 'equals'], ['`[href^="https://"]`', 'starts with'], ['`[href$=".pdf"]`', 'ends with'], ['`[href*="example"]`', 'contains'], ['`[class~="card"]`', 'contains the word']] } },
        'An element can have many classes (`class="btn btn-primary btn-large"`); every matching rule applies. Composable classes are the basis of CSS architecture later.',
        'Attribute selectors style HTML semantics directly (`input[type="email"]`, `a[href^="mailto:"]`, `[disabled]`) without inventing extra classes.',
      ],
      example: [
        { code: '* { box-sizing: border-box; }\n.btn { padding: 10px 20px; }\n.btn-primary { background: #4338ca; color: white; }\na[href$=".pdf"] { font-weight: 700; }', lang: 'css' },
      ],
      task: [
        { ol: ['Every element: `box-sizing: border-box`.', 'Every paragraph: `line-height: 1.6`.', '`.btn`: `padding: 10px 20px`. `.btn-primary`: background `#4338ca`, text `white`. `.btn-large`: `font-size: 18px`.', 'The `#site-header`: `border-bottom: 4px solid #f59e0b`.', 'Only the email input: `border: 2px solid #4682b4`. Every required field: `background: #fff7e0`.', 'Links starting with `https://`: colour `#15803d`. Links ending in `.pdf`: `font-weight: 700`. `mailto:` links: `font-style: italic`.'] },
      ],
      starter: 'p {\n  line-height: 1.6\n  color: #1f2937;\n}\n\n#btn {\n  padding: 10px 20px;\n}\n\na {\n  color: #15803d;\n}\n',
      solution: '* {\n  box-sizing: border-box;\n}\n\np {\n  line-height: 1.6;\n}\n\n.btn {\n  padding: 10px 20px;\n}\n\n.btn-primary {\n  background: #4338ca;\n  color: white;\n}\n\n.btn-large {\n  font-size: 18px;\n}\n\n#site-header {\n  border-bottom: 4px solid #f59e0b;\n}\n\ninput[type="email"] {\n  border: 2px solid #4682b4;\n}\n\n[required] {\n  background: #fff7e0;\n}\n\na[href^="https://"] {\n  color: #15803d;\n}\n\na[href$=".pdf"] {\n  font-weight: 700;\n}\n\na[href^="mailto:"] {\n  font-style: italic;\n}\n',
      checks: [
        { label: 'universal box-sizing', mistake: '* { box-sizing: border-box; }', check: ({ $$, style }) => ['h1', 'p', 'button', 'input', 'a'].every((sel) => style(sel, 'box-sizing') === 'border-box') || 'some elements are not border-box' },
        { label: 'paragraph line-height', mistake: 'p { line-height: 1.6; } (and every declaration ends with a semicolon).', check: ({ style }) => style('main > p', 'line-height') === '25.6px' || `line-height is ${style('main > p', 'line-height')}` },
        { label: 'composable button classes', mistake: '.btn padding, .btn-primary colours, .btn-large font size: each class adds its part.', check: ({ $$, h }) => { const [plain, primary, large] = $$('.btn').map((b) => getComputedStyle(b)); const ok = plain.paddingTop === '10px' && plain.paddingLeft === '20px' && !h.sameValue('background-color', plain.backgroundColor, '#4338ca') && h.sameValue('background-color', primary.backgroundColor, '#4338ca') && h.sameValue('color', primary.color, 'white') && large.fontSize === '18px' && primary.fontSize !== '18px' && h.sameValue('background-color', large.backgroundColor, '#4338ca'); return ok || `padding ${plain.paddingTop}/${plain.paddingLeft}, primary bg ${primary.backgroundColor}, large font ${large.fontSize}`; } },
        { label: 'header by id', mistake: '#site-header { border-bottom: 4px solid #f59e0b; }', check: ({ $, h }) => { const s = getComputedStyle($('#site-header')); return (s.borderBottomWidth === '4px' && s.borderBottomStyle === 'solid' && h.sameValue('color', s.borderBottomColor, '#f59e0b')) || `border-bottom ${s.borderBottomWidth} ${s.borderBottomStyle} ${s.borderBottomColor}`; } },
        { label: 'input attributes', mistake: 'input[type="email"] gets the blue border; [required] gets the cream background.', check: ({ $, h }) => { const email = getComputedStyle($('input[type="email"]')); const text = getComputedStyle($('input[type="text"]')); return (email.borderTopWidth === '2px' && h.sameValue('color', email.borderTopColor, '#4682b4') && h.sameValue('background-color', email.backgroundColor, '#fff7e0') && !h.sameValue('color', text.borderTopColor, '#4682b4') && !h.sameValue('background-color', text.backgroundColor, '#fff7e0')) || `email border ${email.borderTopWidth} ${email.borderTopColor}, text input border ${text.borderTopColor}`; } },
        { label: 'link patterns', mistake: '^="https://" green, $=".pdf" bold, ^="mailto:" italic; the http link stays default.', check: ({ $$, h }) => { const [secure, old, pdf, mail] = $$('.links a').map((a) => getComputedStyle(a)); return (h.sameValue('color', secure.color, '#15803d') && !h.sameValue('color', old.color, '#15803d') && pdf.fontWeight === '700' && secure.fontWeight !== '700' && mail.fontStyle === 'italic' && secure.fontStyle !== 'italic') || `https ${secure.color}, http ${old.color}, pdf weight ${pdf.fontWeight}, mailto ${mail.fontStyle}`; } },
      ],
    },
    {
      id: 'css-combinators',
      title: 'Combinators: descendant, child and siblings',
      source: 'HTML & CSS course, Part 14',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<article class="post">\n  <header><h2>Monsoon diary</h2></header>\n  <p id="p1">Direct child one.</p>\n  <div class="note"><p id="p2">Nested in a note.</p></div>\n  <p id="p3">Direct child two.</p>\n  <h3>Day two</h3>\n  <p id="p4">Right after the h3.</p>\n  <ul><li>Umbrella</li></ul>\n  <p id="p5">A later sibling of the h3.</p>\n</article>\n<p id="outside">Outside the article.</p>',
      },
      teach: [
        { code: '<article>                  ← ancestor of everything inside\n  <header><h2>…</h2></header>\n  <p>first</p>             ← child of article\n  <div><p>nested</p></div> ← descendant, not child\n  <p>second</p>\n</article>', lang: 'text' },
        { table: { head: ['Combinator', 'Example', 'Matches'], rows: [['space (descendant)', '`article p`', 'any p inside article, at any depth'], ['`>` (child)', '`article > p`', 'only direct children'], ['`+` (adjacent sibling)', '`h2 + p`', 'the p immediately after an h2'], ['`~` (general sibling)', '`h2 ~ p`', 'every later p sibling of an h2']] } },
        { warn: 'A descendant selector like `.sidebar p` often matches more than you meant (every nested p). Use `>` when you mean one level.' },
      ],
      example: [
        { code: '.post > p { margin-left: 12px; }  /* not the p inside .note */\nh3 + p    { font-weight: 700; }   /* only the first p after the h3 */', lang: 'css' },
      ],
      task: [
        { ol: ['Every paragraph inside `.post` (any depth): colour `#334155`. The paragraph outside the article must not change.', 'Only direct-child paragraphs of `.post`: `margin-left: 12px`.', 'The paragraph immediately after the `h3`: `font-weight: 700`.', 'Every paragraph sibling after the `h3`: `font-style: italic`.', 'The paragraph directly inside `.note`: background `#fef3c7`.'] },
      ],
      starter: 'p {\n  color: #334155;\n}\n\n.post p {\n  margin-left: 12px;\n}\n',
      solution: '.post p {\n  color: #334155;\n}\n\n.post > p {\n  margin-left: 12px;\n}\n\nh3 + p {\n  font-weight: 700;\n}\n\nh3 ~ p {\n  font-style: italic;\n}\n\n.note > p {\n  background: #fef3c7;\n}\n',
      checks: [
        { label: 'descendant colour', mistake: '.post p: every paragraph in the article, none outside.', check: ({ $, h }) => { const inside = ['#p1', '#p2', '#p3', '#p4', '#p5'].every((id) => h.sameValue('color', getComputedStyle($(id)).color, '#334155')); const outside = h.sameValue('color', getComputedStyle($('#outside')).color, '#334155'); return (inside && !outside) || (outside ? 'the paragraph outside the article changed colour' : 'not every paragraph in the article is #334155'); } },
        { label: 'child combinator', mistake: '.post > p: p1, p3, p4, p5 get the margin; the nested p2 does not.', check: ({ $ }) => { const got = ['#p1', '#p2', '#p3', '#p4', '#p5'].map((id) => getComputedStyle($(id)).marginLeft); return JSON.stringify(got) === '["12px","0px","12px","12px","12px"]' || `margin-left p1–p5: ${got.join(', ')}`; } },
        { label: 'adjacent sibling', mistake: 'h3 + p: only p4 is bold.', check: ({ $ }) => { const got = ['#p1', '#p3', '#p4', '#p5'].map((id) => getComputedStyle($(id)).fontWeight); return JSON.stringify(got) === '["400","400","700","400"]' || `font-weight p1, p3, p4, p5: ${got.join(', ')}`; } },
        { label: 'general sibling', mistake: 'h3 ~ p: p4 and p5 are italic, the earlier ones are not.', check: ({ $ }) => { const got = ['#p1', '#p3', '#p4', '#p5'].map((id) => getComputedStyle($(id)).fontStyle); return JSON.stringify(got) === '["normal","normal","italic","italic"]' || `font-style p1, p3, p4, p5: ${got.join(', ')}`; } },
        { label: 'the note', mistake: '.note > p { background: #fef3c7; }', check: ({ $, h }) => (h.sameValue('background-color', getComputedStyle($('#p2')).backgroundColor, '#fef3c7') && !h.sameValue('background-color', getComputedStyle($('#p1')).backgroundColor, '#fef3c7')) || 'only the paragraph in .note should be highlighted' },
      ],
    },
    {
      id: 'css-pseudo-classes',
      title: 'Pseudo-classes: states, positions, :not, :is, :where, :has',
      source: 'HTML & CSS course, Part 14',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<ul class="list">\n  <li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li>\n  <li>Item 6</li><li>Item 7</li><li>Item 8</li><li>Item 9</li><li>Item 10</li>\n</ul>\n<article class="story">\n  <h2>Title</h2>\n  <p>First</p>\n  <p>Second</p>\n  <p>Third</p>\n</article>\n<nav class="tabs">\n  <a href="#overview" class="tab active">Overview</a>\n  <a href="#specs" class="tab">Specs</a>\n  <a href="#reviews" class="tab">Reviews</a>\n</nav>\n<div class="card"><span class="badge">New</span><p>Wooden train set</p></div>\n<div class="card"><p>Puzzle cube</p></div>\n<form class="signup">\n  <div class="field"><input type="email" required value="not-an-email" aria-label="Email"></div>\n  <div class="field"><input type="text" value="Ammaar" aria-label="Name"></div>\n  <label><input type="checkbox" checked> Updates</label>\n  <input type="text" disabled value="Locked" aria-label="Locked">\n</form>\n<button class="cta">Buy now</button>',
      },
      teach: [
        { h: 'States' },
        '`:hover`, `:active`, `:focus`, `:visited` (colour only, for privacy), and form states `:checked`, `:disabled`, `:required`, `:valid`, `:invalid`.',
        { code: '/* the accessible way to drop the ring for mouse clicks only */\nbutton:focus { outline: none; }\nbutton:focus-visible { outline: 3px solid steelblue; outline-offset: 2px; }', lang: 'css' },
        '`:focus-visible` is the browser\'s judgement of when a focus ring is needed (keyboard, yes; mouse click on a button, usually no). Never remove focus styling without it.',
        { h: 'Position' },
        { code: 'li:first-child   li:last-child\nli:nth-child(2)   li:nth-child(odd)   li:nth-child(even)\nli:nth-child(3n+1)   /* n = 0,1,2… → 1, 4, 7, 10 */', lang: 'css' },
        { warn: '`p:nth-child(2)` means "the 2nd child, if it is a p". With an `<h2>` first, that is the **first** paragraph. `p:nth-of-type(2)` counts only paragraphs: the second paragraph.' },
        { h: 'Logic' },
        { list: ['`li:not(.active)`: everything except.', '`:is(header, main, footer) a`: any of the list (specificity of its most specific argument).', '`:where(...)`: same matching, **zero** specificity (perfect for defaults).', '`.card:has(> .badge)`: the "parent selector": style an element by what it contains. `.field:has(input:invalid)` highlights a field wrapper without JavaScript.'] },
      ],
      example: [
        { code: '.list li:nth-child(odd) { background: #f1f5f9; }\n.story p:nth-of-type(2) { color: #4338ca; }\n.card:has(> .badge) { border: 2px solid #f59e0b; }', lang: 'css' },
      ],
      task: [
        { ol: ['Odd `.list` items: background `#f1f5f9`. Items 1, 4, 7, 10 (use one formula): `font-weight: 700`. The last item: colour `#b91c1c`.', 'The **second paragraph** of `.story` (not the second child): colour `#4338ca`.', 'Every `.tab` except `.active`: `opacity: 0.6`.', 'Paragraphs inside `.story` or `.card` (use `:is()`): `font-size: 18px`.', '`.card` elements that directly contain a `.badge`: `border: 2px solid #f59e0b`.', '`.field` wrappers containing an invalid input: `border-left: 3px solid #dc2626`.', 'Disabled inputs: `opacity: 0.5`. Checked checkboxes: `accent-color: #15803d`.', '`.cta`: no outline on `:focus`, and `outline: 3px solid #4338ca; outline-offset: 2px` on `:focus-visible`.'] },
      ],
      starter: '.list li:nth-child(1), .list li:nth-child(4), .list li:nth-child(7), .list li:nth-child(10) {\n  font-weight: 700;\n}\n\n.story p:nth-child(2) {\n  color: #4338ca;\n}\n\n.cta:focus {\n  outline: none;\n}\n',
      solution: '.list li:nth-child(odd) {\n  background: #f1f5f9;\n}\n\n.list li:nth-child(3n + 1) {\n  font-weight: 700;\n}\n\n.list li:last-child {\n  color: #b91c1c;\n}\n\n.story p:nth-of-type(2) {\n  color: #4338ca;\n}\n\n.tab:not(.active) {\n  opacity: 0.6;\n}\n\n:is(.story, .card) p {\n  font-size: 18px;\n}\n\n.card:has(> .badge) {\n  border: 2px solid #f59e0b;\n}\n\n.field:has(input:invalid) {\n  border-left: 3px solid #dc2626;\n}\n\ninput:disabled {\n  opacity: 0.5;\n}\n\ninput:checked {\n  accent-color: #15803d;\n}\n\n.cta:focus {\n  outline: none;\n}\n\n.cta:focus-visible {\n  outline: 3px solid #4338ca;\n  outline-offset: 2px;\n}\n',
      checks: [
        { label: 'odd stripes', mistake: '.list li:nth-child(odd) { background: #f1f5f9; }', check: ({ $$, h }) => { const striped = $$('.list li').map((li) => h.sameValue('background-color', getComputedStyle(li).backgroundColor, '#f1f5f9')); return JSON.stringify(striped) === JSON.stringify([true, false, true, false, true, false, true, false, true, false]) || `striped: ${striped.map(Number).join('')}`; } },
        { label: 'every third from the first', mistake: 'One formula: .list li:nth-child(3n + 1) gives 1, 4, 7, 10.', check: ({ $$, source }) => { const bold = $$('.list li').map((li, i) => (getComputedStyle(li).fontWeight === '700' ? i + 1 : null)).filter(Boolean); return (JSON.stringify(bold) === '[1,4,7,10]' && /nth-child\(\s*3n\s*\+\s*1\s*\)/.test(source)) || `bold items ${JSON.stringify(bold)}${/3n/.test(source) ? '' : ' (use a 3n + 1 formula, not a list)'}`; } },
        { label: 'last item', mistake: '.list li:last-child { color: #b91c1c; }', check: ({ $$, h }) => { const colors = $$('.list li').map((li) => h.sameValue('color', getComputedStyle(li).color, '#b91c1c')); return (colors[9] && colors.slice(0, 9).every((c) => !c)) || 'only item 10 should be red'; } },
        { label: 'nth-of-type', mistake: '.story p:nth-of-type(2) counts only paragraphs: "Second".', check: ({ $$, h }) => { const blue = $$('.story p').filter((p) => h.sameValue('color', getComputedStyle(p).color, '#4338ca')).map((p) => p.textContent); return JSON.stringify(blue) === '["Second"]' || `coloured: ${JSON.stringify(blue)}`; } },
        { label: ':not, :is and :has', mistake: 'Inactive tabs fade; :is(.story, .card) p is 18px; only the card with a direct .badge gets the border.', check: ({ $$ }) => { const tabs = $$('.tab').map((t) => getComputedStyle(t).opacity); const sizes = [...$$('.story p'), ...$$('.card p')].map((p) => getComputedStyle(p).fontSize); const borders = $$('.card').map((c) => getComputedStyle(c).borderTopWidth); return (JSON.stringify(tabs) === '["1","0.6","0.6"]' && sizes.every((s) => s === '18px') && JSON.stringify(borders) === '["2px","0px"]') || `tabs ${tabs.join(',')}, p sizes ${[...new Set(sizes)].join(',')}, card borders ${borders.join(',')}`; } },
        { label: 'form states', mistake: '.field:has(input:invalid) red left border; input:disabled opacity 0.5; input:checked accent-color.', check: ({ $$, $, h }) => { const fields = $$('.field').map((f) => getComputedStyle(f).borderLeftWidth); return (JSON.stringify(fields) === '["3px","0px"]' && getComputedStyle($('input:disabled')).opacity === '0.5' && h.sameValue('color', getComputedStyle($('input:checked')).accentColor, '#15803d')) || `field borders ${fields.join(',')}, disabled opacity ${getComputedStyle($('input:disabled')).opacity}`; } },
        { label: 'accessible focus pattern', mistake: 'Keep .cta:focus { outline: none } only together with .cta:focus-visible { outline: 3px solid #4338ca; outline-offset: 2px }.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; return (h.declared(sheet, '.cta:focus-visible', 'outline-width') === '3px' && h.sameValue('color', h.declared(sheet, '.cta:focus-visible', 'outline-color'), '#4338ca') && h.declared(sheet, '.cta:focus-visible', 'outline-offset') === '2px') || 'no complete .cta:focus-visible rule'; } },
      ],
    },
    {
      id: 'css-pseudo-elements',
      title: 'Pseudo-elements: ::before, ::after and friends',
      source: 'HTML & CSS course, Part 14',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<p class="intro">Long before Mumbai had local trains, seven islands sat in the Arabian Sea.</p>\n<p><a class="external" href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">MDN docs</a></p>\n<div class="card">A card with an accent bar.</div>\n<ol class="steps"><li>Boil water</li><li>Add tea</li></ol>\n<input class="search" placeholder="Search toys" aria-label="Search toys">',
      },
      teach: [
        'Pseudo-**classes** (one colon) select elements in a state. Pseudo-**elements** (two colons) select a **part** of an element, or generate one.',
        { table: { head: ['Pseudo-element', 'Targets'], rows: [['`::first-letter`', 'the first letter (drop caps)'], ['`::first-line`', 'the first **rendered** line (changes with width)'], ['`::selection`', 'text the user highlights'], ['`::marker`', 'a list item\'s bullet or number'], ['`::placeholder`', 'an input\'s placeholder text'], ['`::before` / `::after`', 'generated content before/after the element\'s content']] } },
        { code: '.card { position: relative; }\n.card::before {\n  content: "";               /* required, even empty, or nothing renders */\n  position: absolute;\n  top: 0; left: 0;\n  width: 4px; height: 100%;\n  background: steelblue;\n}', lang: 'css' },
        { warn: 'Generated content is for decoration only: it is not in the DOM, may not be selectable or copyable, and assistive technology handles it inconsistently. Never put essential information in `content`.' },
      ],
      example: [
        { code: 'p::first-letter { font-size: 3em; float: left; }\nli::marker { color: crimson; }\n.external::after { content: " ↗"; }', lang: 'css' },
      ],
      task: [
        { ol: ['`.intro` gets a drop cap: first letter `font-size: 3em` and `float: left`.', '`.external` links get a decorative ` ↗` after them (a space, then the arrow).', '`.card` gets a 4px-wide full-height accent bar in `#4338ca` on its left edge, using `::before` (the card must be the positioning context).', 'Numbers of `.steps` items: colour `#b45309`.', 'The search placeholder: colour `#64748b`, italic.', 'Selected text anywhere: background `#fde68a`.'] },
      ],
      starter: '.card::before {\n  position: absolute;\n  width: 4px;\n  height: 100%;\n  background: #4338ca;\n}\n',
      solution: '.intro::first-letter {\n  font-size: 3em;\n  float: left;\n}\n\n.external::after {\n  content: " ↗";\n}\n\n.card {\n  position: relative;\n  padding-left: 1rem;\n}\n\n.card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: #4338ca;\n}\n\n.steps li::marker {\n  color: #b45309;\n}\n\n.search::placeholder {\n  color: #64748b;\n  font-style: italic;\n}\n\n::selection {\n  background: #fde68a;\n}\n',
      checks: [
        { label: 'accent bar renders', mistake: '::before needs content: "" and the .card needs position: relative.', check: ({ $, h }) => { const card = $('.card'); const before = getComputedStyle(card, '::before'); const rect = card.getBoundingClientRect(); return (before.content === '""' && before.width === '4px' && Math.abs(parseFloat(before.height) - rect.height) < 1 && getComputedStyle(card).position === 'relative' && h.sameValue('background-color', before.backgroundColor, '#4338ca')) || `::before content ${before.content}, ${before.width} × ${before.height}, card position ${getComputedStyle(card).position}`; } },
        { label: 'external arrow', mistake: '.external::after { content: " ↗"; }', check: ({ $ }) => getComputedStyle($('.external'), '::after').content === '" ↗"' || `::after content is ${getComputedStyle($('.external'), '::after').content}` },
        { label: 'drop cap', mistake: '.intro::first-letter { font-size: 3em; float: left; }', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; return (h.declared(sheet, '.intro::first-letter', 'font-size') === '3em' && h.declared(sheet, '.intro::first-letter', 'float') === 'left') || 'no .intro::first-letter rule with font-size 3em and float left'; } },
        { label: 'markers, placeholder, selection', mistake: '.steps li::marker colour, .search::placeholder colour + italic, ::selection background.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const ok = h.is(sheet, '.steps li::marker', 'color', '#b45309') && h.is(sheet, '.search::placeholder', 'color', '#64748b') && h.declared(sheet, '.search::placeholder', 'font-style') === 'italic' && h.is(sheet, '::selection', 'background-color', '#fde68a'); return ok || 'check the ::marker, ::placeholder and ::selection rules'; } },
      ],
    },
  ],
};
