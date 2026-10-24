// HTML & CSS course, Parts 18–20: the box model, display, positioning.
const WIDE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='500'%3E%3Crect width='1000' height='500' fill='%2393c5fd'/%3E%3C/svg%3E";

export default {
  id: 'css-box-position',
  title: 'Box model, display and positioning',
  lessons: [
    {
      id: 'css-box-model',
      title: 'The box model and box-sizing',
      source: 'HTML & CSS course, Part 18',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: `<div class="box">Box</div>\n<div class="wrap">\n  <div class="container">Container</div>\n  <div class="card">Card</div>\n  <img src="${WIDE_IMAGE}" width="1000" height="500" alt="A wide placeholder graphic">\n  <div class="panel"><p>Line 1</p><p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p></div>\n</div>`,
        css: 'body { margin: 0; }\n.box { width: 300px; padding: 20px; border: 5px solid #1e293b; }\n.wrap { width: 800px; }\n.card, .container { background: #e0e7ff; }\n.panel { border: 1px solid #94a3b8; }',
      },
      teach: [
        { code: '┌──────────── margin ────────────┐   outside the border; never part of the background\n│ ┌────────── border ──────────┐ │\n│ │ ┌──────── padding ───────┐ │ │   inside the border; shows the background\n│ │ │        content         │ │ │\n│ │ └────────────────────────┘ │ │\n│ └────────────────────────────┘ │\n└────────────────────────────────┘', lang: 'text' },
        { h: 'box-sizing' },
        'By default (`content-box`) `width` sets only the content. `width: 300px; padding: 20px; border: 5px` renders **350px** wide. With `border-box`, `width` is the whole box (300px) and the content shrinks to 250px. Margin is outside either way.',
        { code: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}', lang: 'css' },
        'That reset is at the top of nearly every professional stylesheet: every `width` then means what it says.',
        { h: 'Flexible sizes with limits' },
        '`width: 100%; max-width: 600px; margin: 0 auto;` is fluid until 600px, then centred. `min-width` sets a floor. `img { max-width: 100%; height: auto; }` shrinks images to fit their container without ever upscaling or distorting them.',
        { h: 'overflow' },
        '`visible` (default, spills out), `hidden` (clipped, unreachable), `scroll` (always shows scrollbars), `auto` (scrollbars only when needed: the sensible default). `overflow-x` and `overflow-y` can differ.',
      ],
      example: [
        { code: '.container {\n  width: 100%;\n  max-width: 600px;\n  margin: 0 auto;   /* auto side margins centre a block with a width */\n}', lang: 'css' },
      ],
      task: [
        { ol: ['Add the global `border-box` reset (including `::before` and `::after`) so `.box` renders exactly 300px wide.', '`.container`: fluid but at most `600px`, centred in its 800px parent.', '`.card`: `width: 50%` (400px in its 800px parent) but never narrower than `250px`.', 'Images: never wider than their container, keeping their aspect ratio.', '`.panel`: `height: 120px`, scrolling vertically only when its content overflows.'] },
      ],
      starter: '.container {\n  width: 600px;\n}\n\n.panel {\n  height: 120px;\n  overflow: scroll;\n}\n',
      solution: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n.container {\n  width: 100%;\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.card {\n  width: 50%;\n  min-width: 250px;\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\n.panel {\n  height: 120px;\n  overflow: auto;\n}\n',
      checks: [
        { label: 'border-box everywhere', mistake: '*, *::before, *::after { box-sizing: border-box; } — then .box is 300px including padding and border.', check: ({ $, rect }) => (Math.round(rect('.box').width) === 300 && getComputedStyle($('.box'), '::before').boxSizing === 'border-box') || `.box renders ${rect('.box').width}px wide` },
        { label: 'fluid, capped and centred', mistake: 'width: 100%; max-width: 600px; margin: 0 auto.', check: ({ $, rect }) => { const r = rect('.container'); const parent = rect('.wrap'); return (Math.round(r.width) === 600 && Math.round(r.left - parent.left) === 100) || `width ${r.width}, left offset ${r.left - parent.left}`; } },
        { label: 'min-width floor', mistake: '.card { width: 50%; min-width: 250px; }', check: async ({ $, rect, settle }) => { const wide = Math.round(rect('.card').width); $('.wrap').style.width = '300px'; await settle(); const narrow = Math.round(rect('.card').width); $('.wrap').style.width = ''; return (wide === 400 && narrow === 250) || `card is ${wide}px in 800px and ${narrow}px in 300px`; } },
        { label: 'responsive image', mistake: 'img { max-width: 100%; height: auto; }', check: ({ rect }) => { const r = rect('img'); return (Math.round(r.width) === 800 && Math.round(r.height) === 400) || `image renders ${r.width} × ${r.height}`; } },
        { label: 'overflow: auto', mistake: 'height: 120px with overflow: auto (scroll always shows scrollbars).', check: ({ $ }) => { const p = $('.panel'); const s = getComputedStyle(p); return (s.overflowY === 'auto' && Math.round(p.getBoundingClientRect().height) === 120 && p.scrollHeight > p.clientHeight) || `overflow ${s.overflowY}, height ${p.getBoundingClientRect().height}`; } },
      ],
    },
    {
      id: 'css-margin-collapse',
      title: 'Margin collapsing and how to avoid surprises',
      source: 'HTML & CSS course, Part 18',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="top">Top bar</div>\n<section class="banner"><h2 class="banner-title">Monsoon sale</h2></section>\n<p class="first">First paragraph.</p>\n<p class="second">Second paragraph.</p>\n<ul class="list"><li>One</li><li>Two</li><li>Three</li></ul>',
        css: 'body { margin: 0; }\n.top { height: 40px; background: #1e293b; color: white; }\n.banner { background: #fde68a; }\n.banner-title { margin: 24px 0; }\n.first { margin: 0 0 30px; }\n.second { margin: 20px 0 0; }\n.list { list-style: none; padding: 0; margin: 0; }\n.list li { margin: 0 0 12px; background: #e0e7ff; }',
      },
      teach: [
        'Vertical margins of block boxes that touch **collapse** into the larger one: a 30px bottom margin meeting a 20px top margin makes a **30px** gap, not 50px. This keeps text rhythm sane.',
        { list: ['Between adjacent siblings.', 'Between a parent and its first/last child when nothing (no padding, border, content) separates them: the child\'s margin "leaks" out and pushes the parent away from its neighbours, outside its background.', 'Never for horizontal margins, never inside flex or grid containers, never when padding or a border separates them.'] },
        { code: '/* the child margin escapes and moves the yellow banner down */\n.banner { background: #fde68a; }\n.banner-title { margin: 24px 0; }\n\n/* fix: something between the margins, or a new formatting context */\n.banner { padding-block: 1px; }       /* or */\n.banner { display: flow-root; }', lang: 'css' },
        { tip: 'The modern way to space siblings is the parent\'s `gap` in a flex or grid container: no collapsing, no "last item has an extra margin" problem.' },
      ],
      example: [
        { code: '.list {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.list li { margin: 0; }', lang: 'css' },
      ],
      task: [
        { ol: ['Predict, then confirm in the preview: the gap between `.first` and `.second` is 30px. Make it exactly **50px** by changing only `.second`\'s top margin.', 'Stop the heading\'s margin escaping the yellow `.banner`: the banner must touch the top bar, with the heading\'s 24px margin inside the yellow area. Use `display: flow-root` on `.banner`.', 'Turn `.list` into a flex column with `gap: 12px` and remove the item margins, so there is no extra space after the last item.'] },
      ],
      starter: '.second {\n  margin-top: 50px;\n}\n',
      solution: '.second {\n  margin-top: 50px;\n}\n\n.first {\n  margin-bottom: 0;\n}\n\n.banner {\n  display: flow-root;\n}\n\n.list {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.list li {\n  margin: 0;\n}\n',
      checks: [
        { label: '50px between the paragraphs', mistake: 'Margins collapse to the larger one: either make the bigger margin 50px or remove the other.', check: ({ rect }) => { const gap = rect('.second').top - rect('.first').bottom; return Math.round(gap) === 50 || `the gap is ${gap}px`; } },
        { label: 'banner contains its heading margin', mistake: '.banner { display: flow-root; } stops the margin leaking out.', check: ({ rect, $ }) => { const banner = rect('.banner'); const topBar = rect('.top'); const title = rect('.banner-title'); return (Math.round(banner.top - topBar.bottom) === 0 && Math.round(title.top - banner.top) === 24 && getComputedStyle($('.banner')).display === 'flow-root') || `banner starts ${banner.top - topBar.bottom}px below the top bar; heading is ${title.top - banner.top}px inside`; } },
        { label: 'gap instead of margins', mistake: '.list { display: flex; flex-direction: column; gap: 12px; } and no item margins.', check: ({ $, $$, rect }) => { const items = $$('.list li').map((li) => li.getBoundingClientRect()); const gaps = items.slice(1).map((r, i) => Math.round(r.top - items[i].bottom)); const list = rect('.list'); return (JSON.stringify(gaps) === '[12,12]' && Math.round(list.bottom - items[2].bottom) === 0 && getComputedStyle($('.list')).display === 'flex') || `gaps ${JSON.stringify(gaps)}, space after the last item ${list.bottom - items[2].bottom}`; } },
      ],
    },
    {
      id: 'css-display',
      title: 'Display: block, inline, inline-block, none vs hidden',
      source: 'HTML & CSS course, Part 19',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<p>Status: <span class="pill">In stock</span> ships today.</p>\n<nav class="nav"><a href="#a">Home</a><a href="#b">Toys</a><a href="#c">Books</a></nav>\n<div class="tabs">\n  <section class="panel active">Overview panel</section>\n  <section class="panel">Specs panel</section>\n</div>\n<p class="after-tabs">After the tabs.</p>\n<div class="icons"><span class="icon">A</span><span class="icon off">B</span><span class="icon">C</span></div>',
        css: 'body { margin: 0; font: 16px/1.5 sans-serif; }\n.pill { background: #dcfce7; }\n.nav a { background: #e0e7ff; }\n.panel { background: #f1f5f9; height: 80px; }\n.icon { display: inline-block; width: 40px; height: 40px; background: #fde68a; text-align: center; }',
      },
      teach: [
        { table: { head: ['display', 'Line breaks', 'width/height', 'Vertical padding/margin'], rows: [['`block`', 'own line, full width', 'respected', 'pushes neighbours'], ['`inline`', 'flows in text', '**ignored**', 'painted but does not push lines apart'], ['`inline-block`', 'flows in text', 'respected', 'respected']] } },
        'Block by default: div, p, h1–h6, lists, section, article, header, footer, form. Inline: span, a, strong, em. If `width` does nothing, the element is probably still inline.',
        { table: { head: ['', 'Takes space', 'Visible', 'Accessibility tree'], rows: [['normal', '✅', '✅', '✅'], ['`visibility: hidden`', '✅ (empty gap)', '❌', '❌'], ['`display: none`', '❌ (neighbours move up)', '❌', '❌']] } },
        'Hide a tab panel with `display: none` (it should vanish); hide one icon in an aligned row with `visibility: hidden` (the others must not shift).',
        { h: 'Normal flow' },
        'Without positioning, flex or grid, blocks stack top to bottom in source order and inline content flows left to right, wrapping like words. Positioning, flexbox and grid are deliberate departures from it.',
      ],
      example: [
        { code: '.badge { display: inline-block; width: 80px; padding: 4px 8px; }', lang: 'css' },
      ],
      task: [
        { ol: ['`.pill`: stays in the sentence but is exactly `110px` wide and `28px` tall.', '`.nav a`: sit side by side, each `44px` tall with `0 16px` padding.', 'Hide every `.panel` that is not `.active` so the paragraph after the tabs moves up.', 'Hide `.icon.off` while keeping its space, so A and C stay in their places.'] },
      ],
      starter: '.pill {\n  width: 110px;\n  height: 28px;\n}\n\n.nav a {\n  display: block;\n  height: 44px;\n  padding: 0 16px;\n}\n\n.icon.off {\n  display: none;\n}\n',
      solution: '.pill {\n  display: inline-block;\n  width: 110px;\n  height: 28px;\n}\n\n.nav a {\n  display: inline-block;\n  height: 44px;\n  padding: 0 16px;\n}\n\n.panel:not(.active) {\n  display: none;\n}\n\n.icon.off {\n  visibility: hidden;\n}\n',
      checks: [
        { label: 'sized pill in the text', mistake: 'width and height only work once .pill is inline-block.', check: ({ rect, $ }) => { const r = rect('.pill'); const p = $('.pill').parentElement.getBoundingClientRect(); return (Math.round(r.width) === 110 && Math.round(r.height) === 28 && r.left > p.left + 10) || `pill ${r.width} × ${r.height}`; } },
        { label: 'nav side by side', mistake: '.nav a { display: inline-block; height: 44px; padding: 0 16px; }', check: ({ $$ }) => { const rs = $$('.nav a').map((a) => a.getBoundingClientRect()); const sameRow = rs.every((r) => Math.abs(r.top - rs[0].top) < 1); return (sameRow && rs.every((r) => Math.round(r.height) === 44) && getComputedStyle($$('.nav a')[0]).paddingLeft === '16px') || `links on one row: ${sameRow}, heights ${rs.map((r) => Math.round(r.height)).join(',')}`; } },
        { label: 'inactive panel removed', mistake: '.panel:not(.active) { display: none; } so the content below moves up.', check: ({ $$, rect }) => { const [active, inactive] = $$('.panel'); return (getComputedStyle(inactive).display === 'none' && getComputedStyle(active).display !== 'none' && Math.round(rect('.after-tabs').top - active.getBoundingClientRect().bottom) <= 16) || 'the inactive panel still takes space'; } },
        { label: 'hidden icon keeps its space', mistake: '.icon.off { visibility: hidden; } so C does not shift left.', check: ({ $$ }) => { const [a, b, c] = $$('.icon').map((i) => i.getBoundingClientRect()); return (getComputedStyle($$('.icon')[1]).visibility === 'hidden' && c.left - a.left > 75 && b.width === 40) || `C is ${c.left - a.left}px from A`; } },
      ],
    },
    {
      id: 'css-positioning',
      title: 'Positioning and containing blocks',
      source: 'HTML & CSS course, Part 20',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<header class="site-header">Toy Shop</header>\n<div class="row"><div class="item">A</div><div class="item shifted">B</div><div class="item">C</div></div>\n<div class="icon-wrapper"><span class="bell">🔔</span><span class="badge">3</span></div>\n<div class="dropdown"><button type="button">Menu</button><ul class="dropdown-menu"><li>Profile</li><li>Settings</li></ul></div>\n<div class="photo"><div class="caption">Caption</div></div>\n<button class="fab" type="button" aria-label="Chat">💬</button>\n<div class="spacer"></div>',
        css: 'body { margin: 0; font: 16px/1.5 sans-serif; }\n.site-header { background: white; border-bottom: 1px solid #ccc; padding: 8px; }\n.row { display: flex; gap: 8px; margin: 16px; }\n.item { width: 60px; height: 60px; background: #e0e7ff; }\n.icon-wrapper { display: inline-block; margin: 24px; width: 40px; height: 40px; background: #f1f5f9; }\n.badge { background: crimson; color: white; width: 18px; height: 18px; font-size: 11px; text-align: center; border-radius: 50%; }\n.dropdown { display: inline-block; margin: 16px; }\n.dropdown-menu { margin: 0; padding: 8px; list-style: none; background: white; box-shadow: 0 4px 12px rgb(0 0 0 / 0.15); min-width: 160px; }\n.photo { width: 240px; height: 140px; margin: 16px; background: #93c5fd; }\n.caption { background: rgb(0 0 0 / 0.6); color: white; padding: 4px 8px; }\n.fab { width: 56px; height: 56px; border-radius: 50%; border: 0; background: #4338ca; }\n.spacer { height: 1500px; }',
      },
      teach: [
        { table: { head: ['position', 'In normal flow?', 'Offsets relative to', 'Scrolls with page?'], rows: [['`static` (default)', 'yes', 'offsets and z-index ignored', 'yes'], ['`relative`', 'yes, space reserved', 'its own normal position (visual shift only)', 'yes'], ['`absolute`', '**no**, space released', 'the nearest **positioned** ancestor (its containing block)', 'with that ancestor'], ['`fixed`', 'no', 'the viewport', '**no**'], ['`sticky`', 'yes', 'scroll position: relative until it reaches its offset, then stuck', 'until its parent scrolls away']] } },
        { h: 'Containing blocks' },
        'An absolutely positioned element measures `top/right/bottom/left` from its nearest ancestor whose `position` is not `static`. If none exists, it uses the page. That is why parents so often get `position: relative` with no offsets: it does nothing visible except become the containing block.',
        { code: '.icon-wrapper { position: relative; }\n.badge { position: absolute; top: -6px; right: -6px; }\n.dropdown-menu { position: absolute; top: 100%; left: 0; }   /* right under its trigger */\n.overlay { position: absolute; inset: 0; }                     /* fills the containing block */', lang: 'css' },
        { warn: 'A `transform`, `filter` or `perspective` on an ancestor makes **it** the containing block of `position: fixed` descendants, so a "fixed" header suddenly scrolls. Check ancestors when fixed stops working.' },
      ],
      example: [
        { code: '.site-header { position: sticky; top: 0; z-index: 50; }\n.fab { position: fixed; right: 24px; bottom: 24px; }', lang: 'css' },
      ],
      task: [
        { ol: ['`.shifted` moves 20px down and 20px right **without** moving A or C.', '`.badge` sits on the top-right corner of `.icon-wrapper`, 6px outside it (`top: -6px; right: -6px`).', '`.dropdown-menu` appears directly below its button, aligned to the left, without pushing anything down.', '`.caption` stretches across the bottom of `.photo` (left 0, right 0, bottom 0).', '`.fab` floats 24px from the bottom-right of the viewport, even when the page scrolls.', '`.site-header` sticks to the top while scrolling, above other content (`z-index: 50`).'] },
      ],
      starter: '.shifted {\n  margin-top: 20px;\n  margin-left: 20px;\n}\n\n.badge {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n}\n',
      solution: '.shifted {\n  position: relative;\n  top: 20px;\n  left: 20px;\n}\n\n.icon-wrapper {\n  position: relative;\n}\n\n.badge {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n}\n\n.dropdown {\n  position: relative;\n}\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n}\n\n.photo {\n  position: relative;\n}\n\n.caption {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.fab {\n  position: fixed;\n  right: 24px;\n  bottom: 24px;\n}\n\n.site-header {\n  position: sticky;\n  top: 0;\n  z-index: 50;\n}\n',
      checks: [
        { label: 'relative shift keeps the space', mistake: 'position: relative; top: 20px; left: 20px (margins would push C away).', check: ({ $$ }) => { const [a, b, c] = $$('.item').map((i) => i.getBoundingClientRect()); return (Math.round(b.top - a.top) === 20 && Math.round(b.left - a.right) === 28 && Math.round(c.left - a.right) === 76) || `B is ${b.top - a.top}px lower, C starts ${c.left - a.right}px after A`; } },
        { label: 'badge on the corner', mistake: '.icon-wrapper needs position: relative to be the containing block.', check: ({ rect }) => { const w = rect('.icon-wrapper'); const b = rect('.badge'); return (Math.round(b.top - w.top) === -6 && Math.round(w.right - b.right) === -6) || `badge is ${b.top - w.top}px from the top and ${w.right - b.right}px from the right`; } },
        { label: 'dropdown below its button', mistake: '.dropdown relative; .dropdown-menu absolute with top: 100%; left: 0.', check: ({ $, rect }) => { const btn = $('.dropdown button').getBoundingClientRect(); const menu = rect('.dropdown-menu'); const photo = rect('.photo'); const box = rect('.dropdown'); return (Math.round(menu.top - box.bottom) === 0 && Math.round(menu.left - btn.left) === 0 && getComputedStyle($('.dropdown-menu')).position === 'absolute' && photo.top - btn.bottom < 60) || `menu is ${menu.top - box.bottom}px below the dropdown`; } },
        { label: 'caption fills the bottom', mistake: '.photo relative; .caption absolute with left: 0; right: 0; bottom: 0.', check: ({ rect }) => { const p = rect('.photo'); const c = rect('.caption'); return (Math.round(c.left - p.left) === 0 && Math.round(p.right - c.right) === 0 && Math.round(p.bottom - c.bottom) === 0) || `caption edges: left ${c.left - p.left}, right ${p.right - c.right}, bottom ${p.bottom - c.bottom}`; } },
        { label: 'fixed action button', mistake: '.fab { position: fixed; right: 24px; bottom: 24px; }', check: async ({ rect, window, settle }) => { window.scrollTo(0, 600); await settle(); const r = rect('.fab'); const ok = Math.round(window.innerWidth - r.right) === 24 && Math.round(window.innerHeight - r.bottom) === 24; window.scrollTo(0, 0); return ok || `fab is ${window.innerWidth - r.right}px from the right and ${window.innerHeight - r.bottom}px from the bottom after scrolling`; } },
        { label: 'sticky header', mistake: '.site-header { position: sticky; top: 0; z-index: 50; }', check: async ({ rect, $, window, settle }) => { window.scrollTo(0, 400); await settle(); const top = rect('.site-header').top; window.scrollTo(0, 0); await settle(); return (Math.round(top) === 0 && getComputedStyle($('.site-header')).zIndex === '50') || `after scrolling the header is at ${top}px`; } },
      ],
    },
    {
      id: 'css-stacking',
      title: 'z-index and stacking contexts',
      source: 'HTML & CSS course, Part 20',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="card card-a">\n  Card A\n  <div class="tooltip">Tooltip from card A</div>\n</div>\n<div class="card card-b">Card B</div>\n<div class="banner">Promo banner</div>',
        css: 'body { margin: 0; }\n.card { position: relative; width: 260px; height: 120px; margin: 16px; padding: 8px; }\n.card-a { background: #e0e7ff; z-index: 1; }\n.card-b { background: #fde68a; z-index: 2; margin-top: -60px; margin-left: 60px; }\n.tooltip { position: absolute; top: 70px; left: 80px; width: 200px; height: 60px; background: #1e293b; color: white; z-index: 9999; }\n.banner { opacity: 0.95; background: #dcfce7; height: 40px; position: relative; top: -10px; }',
      },
      teach: [
        '`z-index` orders overlapping **positioned** elements (it does nothing on `static`). But it is not compared across the whole page: some properties create a **stacking context**, and z-index values inside it only compete with each other. The context then stacks as one unit.',
        { code: 'Page root\n├── .card-a (z-index: 1)     ← a stacking context\n│     └── .tooltip (z-index: 9999)   trapped inside card A\n└── .card-b (z-index: 2)     ← wins at the parent level, so everything in B\n                               paints over everything in A', lang: 'text' },
        'New stacking contexts come from: `position` + a `z-index` other than `auto`; `position: fixed` or `sticky`; `opacity` below 1; `transform`, `filter`, `perspective`, `will-change`; flex/grid items with a z-index; the root element.',
        { warn: 'Raising the trapped element to 99999 cannot help. Find the ancestor that creates the context (DevTools can show it) and fix the stacking **there**.' },
      ],
      example: [
        { code: '/* fix at the ancestor level */\n.card-a { z-index: 3; }   /* or remove its z-index so it no longer forms a context */', lang: 'css' },
      ],
      task: [
        'The tooltip has `z-index: 9999` yet card B covers it. Without touching `.tooltip`, make the tooltip appear above card B (it should also stay above the promo banner). Leave card B\'s `z-index: 2` alone.',
      ],
      starter: '.tooltip {\n  z-index: 999999;\n}\n',
      solution: '.card-a {\n  z-index: 3;\n}\n',
      checks: [
        { label: 'tooltip on top', mistake: 'Raise .card-a above .card-b (the stacking context), not the tooltip.', check: ({ $, document }) => { const t = $('.tooltip').getBoundingClientRect(); const b = $('.card-b').getBoundingClientRect(); const x = Math.max(t.left, b.left) + 5; const y = Math.max(t.top, b.top) + 5; const hit = document.elementFromPoint(x, y); return hit === $('.tooltip') || `at the overlap the visible element is .${hit?.className}`; } },
        { label: 'fixed at the ancestor', mistake: 'Leave .tooltip alone; change the stacking context it lives in.', check: ({ source }) => !/\.tooltip\s*\{/.test(source) || 'do not change .tooltip: the problem is its ancestor' },
        { label: 'card B unchanged', mistake: 'Keep .card-b at z-index: 2.', check: ({ $ }) => getComputedStyle($('.card-b')).zIndex === '2' || `card B z-index is ${getComputedStyle($('.card-b')).zIndex}` },
      ],
    },
    {
      id: 'css-box-position-quiz',
      title: 'Box model, display and positioning check',
      source: 'HTML & CSS course, Parts 18–20 knowledge checks',
      runner: 'quiz',
      teach: [
        'A quick numeric and conceptual review of boxes, display types and positioning.',
      ],
      example: [
        { code: '.box { width: 200px; padding: 10px; border: 2px solid; }\n/* content-box: 224px wide  ·  border-box: 200px wide, 176px content */', lang: 'css' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'content-box, `width: 200px; padding: 10px; border: 2px`. Rendered width?', options: ['200px', '212px', '224px', '220px'], answer: 2, explain: '200 + 2×10 + 2×2.' },
        { q: 'Same box with border-box. Content width?', options: ['200px', '176px', '180px', '196px'], answer: 1, explain: '200 − 20 − 4.' },
        { q: 'Is margin included by `box-sizing: border-box`?', options: ['Yes', 'No, margin is always outside the box', 'Only vertical margin', 'Only in flex'], answer: 1, explain: 'box-sizing covers content, padding and border.' },
        { q: 'Two siblings with 40px bottom and 25px top margins in normal flow. Gap?', options: ['65px', '40px', '25px', '15px'], answer: 1, explain: 'They collapse to the larger.' },
        { q: 'Margins collapse in which case?', options: ['Between flex items', 'Between horizontal margins', 'Between a parent and first child with no padding or border between them', 'When a border separates them'], answer: 2, explain: 'That is the classic "why is there a gap above my container" case.' },
        { q: '`width: 200px` on a `<span>` has no effect because…', options: ['spans cannot be styled', 'it is inline; use inline-block or block', 'width needs !important', 'it needs a height too'], answer: 1, explain: 'Inline boxes ignore width and height.' },
        { q: 'An absolutely positioned child jumps to the page corner instead of its card. Fix:', options: ['z-index: 1 on the child', 'position: relative on the card', 'display: block on the child', 'top: auto'], answer: 1, explain: 'The card must be a positioned ancestor to be the containing block.' },
        { q: 'A `position: fixed` header scrolls away after you add an animation. Likely cause?', options: ['z-index', 'An ancestor got a transform, becoming its containing block', 'The header lost its height', 'Sticky is required'], answer: 1, explain: 'transform, filter and perspective change the containing block of fixed descendants.' },
        { q: 'Which creates a stacking context?', options: ['margin: 10px', 'opacity: 0.99', 'color: red', 'display: block'], answer: 1, explain: 'Any opacity below 1 does.' },
      ],
    },
  ],
};
