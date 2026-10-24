// HTML & CSS course, Parts 39–41: object-fit, overflow and overlays.
const LANDSCAPE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect width='400' height='250' fill='%230ea5e9'/%3E%3Ccircle cx='200' cy='125' r='60' fill='%23fde68a'/%3E%3C/svg%3E";
const PORTRAIT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%23a78bfa'/%3E%3Ccircle cx='150' cy='90' r='60' fill='%23fcd34d'/%3E%3C/svg%3E";

export default {
  id: 'css-media-overlays',
  title: 'Images, overflow and overlays',
  lessons: [
    {
      id: 'css-object-fit',
      title: 'object-fit, object-position and consistent thumbnails',
      source: 'HTML & CSS course, Part 39',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: `<img class="thumb" src="${LANDSCAPE}" alt="Train set" width="400" height="250">\n<img class="whole" src="${LANDSCAPE}" alt="Puzzle box" width="400" height="250">\n<div class="card-media"><img src="${PORTRAIT}" alt="Doll house" width="300" height="450"></div>\n<img class="portrait" src="${PORTRAIT}" alt="Ammaar" width="300" height="450">\n<img class="hero" src="${LANDSCAPE}" alt="Toy shop front" width="400" height="250">`,
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; }\nimg { display: block; margin-bottom: 16px; background: #f1f5f9; }\n.card-media { width: 240px; margin-bottom: 16px; }\n.hero { max-width: 840px; }',
      },
      teach: [
        'An image\'s shape comes from its file. Force it into a box of another shape with plain `width` and `height` and it **stretches**. `object-fit` decides how the picture fills its box instead, exactly like `background-size` does for backgrounds (Part 22):',
        { table: { head: ['object-fit', 'Distorts?', 'Crops?', 'Use'], rows: [['`fill` (default)', 'yes', 'no', 'almost never with photos'], ['`contain`', 'no', 'no, may leave empty bands', 'logos, product shots that must be shown whole'], ['`cover`', 'no', 'yes', 'thumbnails, avatars, hero images'], ['`none`', 'no', 'yes, natural size', 'rare'], ['`scale-down`', 'no', 'no', 'the smaller of none and contain']] } },
        '`object-position` chooses which part survives a crop: `top` keeps faces in portraits, `center 30%` keeps the upper middle of a hero photo.',
        { h: 'The consistent-thumbnail pattern' },
        { code: '.card-media { aspect-ratio: 4 / 3; overflow: hidden; }\n.card-media img { width: 100%; height: 100%; object-fit: cover; }\n/* every card has the same shape, whatever photo the shop owner uploads */', lang: 'css' },
        'Keep the `width` and `height` attributes on `<img>` even when CSS sizes it: the browser uses their ratio to reserve space before the file arrives, which prevents layout shift (CLS, Part 48).',
        { warn: 'Those attributes also act as CSS `width`/`height` values. With both set, `aspect-ratio` has nothing to compute and is ignored. When you size an image by width and ratio, add `height: auto` so the ratio can take over.' },
      ],
      example: [
        { code: '.avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }', lang: 'css' },
      ],
      task: [
        { ol: ['`.thumb`: a 200 × 200px square, filled completely without distortion.', '`.whole`: a 200 × 200px box showing the **whole** image without distortion.', '`.card-media`: a 4:3 box; its image fills it completely, cropped, without distortion.', '`.portrait`: a 120 × 120px circle, cropped so the top of the picture (the face) is kept.', '`.hero`: full width of its container, 21:9 (remember its `height` attribute), covered, focused on `center 30%`.'] },
      ],
      starter: '.thumb {\n  width: 200px;\n  height: 200px;\n}\n\n.card-media img {\n  width: 100%;\n  height: 180px;\n}\n',
      solution: '.thumb {\n  width: 200px;\n  height: 200px;\n  object-fit: cover;\n}\n\n.whole {\n  width: 200px;\n  height: 200px;\n  object-fit: contain;\n}\n\n.card-media {\n  aspect-ratio: 4 / 3;\n  overflow: hidden;\n}\n\n.card-media img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.portrait {\n  width: 120px;\n  height: 120px;\n  border-radius: 50%;\n  object-fit: cover;\n  object-position: top;\n}\n\n.hero {\n  width: 100%;\n  height: auto;\n  aspect-ratio: 21 / 9;\n  object-fit: cover;\n  object-position: center 30%;\n}\n',
      checks: [
        { label: 'cover square', mistake: '.thumb { width: 200px; height: 200px; object-fit: cover; }', check: ({ $, rect }) => { const r = rect('.thumb'); const fit = getComputedStyle($('.thumb')).objectFit; return (Math.round(r.width) === 200 && Math.round(r.height) === 200 && fit === 'cover') || `thumb is ${Math.round(r.width)}×${Math.round(r.height)}, object-fit ${fit}`; } },
        { label: 'whole image shown', mistake: '.whole { width: 200px; height: 200px; object-fit: contain; }', check: ({ $, rect }) => { const r = rect('.whole'); const fit = getComputedStyle($('.whole')).objectFit; return (Math.round(r.width) === 200 && Math.round(r.height) === 200 && fit === 'contain') || `whole is ${Math.round(r.width)}×${Math.round(r.height)}, object-fit ${fit}`; } },
        { label: 'consistent card media', mistake: '.card-media { aspect-ratio: 4 / 3; overflow: hidden; } and its img { width: 100%; height: 100%; object-fit: cover; }', check: ({ $, rect }) => { const box = rect('.card-media'); const img = rect('.card-media img'); const fit = getComputedStyle($('.card-media img')).objectFit; return (Math.round(box.height) === 180 && Math.round(img.width) === 240 && Math.round(img.height) === 180 && fit === 'cover') || `box ${Math.round(box.width)}×${Math.round(box.height)}, image ${Math.round(img.width)}×${Math.round(img.height)} (${fit})`; } },
        { label: 'portrait keeps the face', mistake: '.portrait { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; object-position: top; }', check: ({ $, rect }) => { const s = getComputedStyle($('.portrait')); const r = rect('.portrait'); return (Math.round(r.width) === 120 && Math.round(r.height) === 120 && s.borderTopLeftRadius === '50%' && s.objectFit === 'cover' && s.objectPosition === '50% 0%') || `portrait ${Math.round(r.width)}×${Math.round(r.height)}, radius ${s.borderTopLeftRadius}, fit ${s.objectFit}, position ${s.objectPosition}`; } },
        { label: 'cinematic hero', mistake: '.hero { width: 100%; height: auto; aspect-ratio: 21 / 9; object-fit: cover; object-position: center 30%; }: without height: auto the height attribute wins over aspect-ratio.', check: ({ $, rect }) => { const r = rect('.hero'); const s = getComputedStyle($('.hero')); return (Math.round(r.width) === 840 && Math.round(r.height) === 360 && s.objectFit === 'cover' && s.objectPosition === '50% 30%') || `hero ${Math.round(r.width)}×${Math.round(r.height)}, fit ${s.objectFit}, position ${s.objectPosition}`; } },
      ],
    },
    {
      id: 'css-overflow-scroll',
      title: 'Overflow, scroll areas and scroll chaining',
      source: 'HTML & CSS course, Part 40',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="chat" tabindex="0" role="region" aria-label="Messages">\n' + Array.from({ length: 12 }, (_, i) => `  <p>Message ${i + 1}: is the train set still in stock?</p>`).join('\n') + '\n</div>\n<div class="hidden-box"><div class="tall">Hidden overflow</div></div>\n<div class="clip-box"><div class="tall">Clipped overflow</div></div>\n<div class="list"><p>Short list</p></div>',
        css: 'body { margin: 16px; font: 16px/1.4 Arial, sans-serif; height: 1500px; }\n.chat { width: 320px; border: 1px solid #cbd5e1; margin-bottom: 16px; }\n.chat p { margin: 0; padding: 8px; white-space: nowrap; }\n.hidden-box, .clip-box { width: 200px; height: 60px; border: 1px solid #cbd5e1; margin-bottom: 16px; }\n.tall { height: 200px; background: linear-gradient(#e0e7ff, #a5b4fc); }\n.list { width: 320px; height: 100px; border: 1px solid #cbd5e1; }',
      },
      teach: [
        { list: ['`overflow-x` and `overflow-y` are independent: a panel that scrolls down but never sideways is `overflow-x: hidden; overflow-y: auto;`.', '`auto` shows a scrollbar only when needed; `scroll` always reserves one.', '`hidden` hides the overflow, but the box is still a scroll container: JavaScript (`scrollTop`, `scrollIntoView`, focusing a link inside) can still scroll it.', '`clip` hides it and is **never** scrollable, and does not create a scroll container (so `position: sticky` children keep working).'] },
        { h: 'Nested scrolling' },
        'When the inner panel reaches its end, the wheel or swipe "chains" to the page, which suddenly scrolls. `overscroll-behavior: contain` stops the chaining (it also stops pull-to-refresh inside the panel). Use it on chat lists, drawers and modals.',
        { h: 'Layout shift from scrollbars' },
        'On desktop, a scrollbar appearing takes about 15px from the content, so the layout jumps when content grows. `scrollbar-gutter: stable` reserves the space up front.',
        { h: 'Keyboard access' },
        'Recent Chromium versions make scroll containers focusable automatically, but other browsers do not. A scroll region that has no focusable content inside needs `tabindex="0"`, plus `role="region"` and an `aria-label` so screen readers announce what it is (the chat in this lesson already has them).',
      ],
      example: [
        { code: '.code-block { overflow-x: auto; }               /* long lines scroll, page does not */\n.modal-body { overflow-y: auto; overscroll-behavior: contain; }', lang: 'css' },
      ],
      task: [
        { ol: ['`.chat`: at most `240px` tall; scrolls vertically when needed, never horizontally (the long lines are cut); scrolling past its end must not scroll the page; reserve the scrollbar space.', '`.hidden-box`: hide its overflow with `overflow: hidden`.', '`.clip-box`: clip its overflow so that it can never be scrolled, even by script.', '`.list`: always reserve the scrollbar gutter (`scrollbar-gutter: stable`) with vertical `overflow: auto`, so it will not jump when items are added.'] },
      ],
      starter: '.chat {\n  height: 240px;\n  overflow: scroll;\n}\n\n.clip-box {\n  overflow: hidden;\n}\n',
      solution: '.chat {\n  max-height: 240px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-gutter: stable;\n}\n\n.hidden-box {\n  overflow: hidden;\n}\n\n.clip-box {\n  overflow: clip;\n}\n\n.list {\n  overflow-y: auto;\n  scrollbar-gutter: stable;\n}\n',
      checks: [
        { label: 'vertical scrolling only', mistake: '.chat { max-height: 240px; overflow-x: hidden; overflow-y: auto; }', check: ({ $, rect }) => { const chat = $('.chat'); const s = getComputedStyle(chat); return (s.maxHeight === '240px' && s.overflowX === 'hidden' && s.overflowY === 'auto' && Math.round(rect(chat).height) <= 242 && chat.scrollHeight > chat.clientHeight) || `chat: max-height ${s.maxHeight}, overflow-x ${s.overflowX}, overflow-y ${s.overflowY}`; } },
        { label: 'no scroll chaining', mistake: '.chat { overscroll-behavior: contain; }', check: ({ $ }) => getComputedStyle($('.chat')).overscrollBehaviorY === 'contain' || `overscroll-behavior is ${getComputedStyle($('.chat')).overscrollBehaviorY}` },
        { label: 'hidden is still scrollable by script', mistake: '.hidden-box { overflow: hidden; }', check: ({ $ }) => { const box = $('.hidden-box'); box.scrollTop = 50; const moved = box.scrollTop; box.scrollTop = 0; return (getComputedStyle(box).overflowY === 'hidden' && moved === 50) || `hidden-box: overflow ${getComputedStyle(box).overflowY}`; } },
        { label: 'clip is never scrollable', mistake: '.clip-box { overflow: clip; }: hidden would still let scripts scroll it.', check: ({ $ }) => { const box = $('.clip-box'); box.scrollTop = 50; const moved = box.scrollTop; return (getComputedStyle(box).overflowY === 'clip' && moved === 0) || `clip-box: overflow ${getComputedStyle(box).overflowY}, a script scrolled it to ${moved}px`; } },
        { label: 'stable gutters', mistake: 'scrollbar-gutter: stable on .chat and .list (with overflow-y: auto on .list).', check: ({ $ }) => { const a = getComputedStyle($('.chat')).scrollbarGutter; const b = getComputedStyle($('.list')); return (a === 'stable' && b.scrollbarGutter === 'stable' && b.overflowY === 'auto') || `scrollbar-gutter: chat ${a}, list ${b.scrollbarGutter} (overflow-y ${b.overflowY})`; } },
      ],
    },
    {
      id: 'css-overlays',
      title: 'Modals, drawers and the stacking-context trap',
      source: 'HTML & CSS course, Parts 41–42',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<header class="site-header">ToyShop</header>\n<div class="page-wrapper">\n  <p>Your cart has 2 items.</p>\n  <div class="modal-backdrop">\n    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">\n      <h2 id="modal-title">Remove item?</h2>\n      <p>The train set will be removed from your cart.</p>\n      <button type="button">Cancel</button> <button type="button">Remove</button>\n    </div>\n  </div>\n</div>\n<aside class="drawer" aria-label="Cart"><a href="/checkout">Checkout</a></aside>\n<dialog class="native"><p>Native dialog</p></dialog>',
        css: '*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font: 16px/1.4 Arial, sans-serif; }\n.site-header { position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #1e293b; color: white; z-index: 10; }\n/* legacy layout CSS: */\n.page-wrapper { position: relative; z-index: 1; padding-top: 60px; }',
      },
      teach: [
        { h: 'A full-screen backdrop and a centred modal' },
        { code: '.modal-backdrop {\n  position: fixed;\n  inset: 0;                         /* top/right/bottom/left: 0 = the whole viewport */\n  background: rgb(0 0 0 / 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.modal { width: 90%; max-width: 480px; }', lang: 'css' },
        '`role="dialog"`, `aria-modal="true"` and `aria-labelledby` (pointing at the heading) tell assistive technology what it is. A hand-built modal still needs JavaScript for focus trapping, Escape to close, and returning focus to the button that opened it. `<dialog>` with `showModal()` does all three natively, sits in the **top layer** above every z-index, and styles its backdrop with `dialog::backdrop` (HTML Part 42).',
        { h: 'The stacking-context trap' },
        'z-index only competes **within** a stacking context. If any ancestor of the modal creates one (`position` + `z-index`, `opacity` < 1, `transform`, `filter`…, Part 20), the modal\'s `z-index: 1000` is ranked inside that ancestor, and the ancestor competes with the header as a whole: `.page-wrapper { z-index: 1 }` loses to a header at `z-index: 10`, so the header covers the backdrop. Fixes: remove the ancestor\'s stacking context, render the modal as a direct child of `<body>` (a React portal), or use `<dialog>`.',
        { h: 'Side drawers' },
        { code: '.drawer {\n  position: fixed;\n  inset-block: 0;\n  right: 0;\n  width: 320px;\n  transform: translateX(100%);       /* parked off-screen */\n  visibility: hidden;                /* and out of the Tab order */\n  transition: transform 0.3s ease, visibility 0.3s;\n}\n.drawer.is-open { transform: translateX(0); visibility: visible; }', lang: 'css' },
        { warn: 'A drawer that is only translated off-screen is still in the Tab order: keyboard users tab into invisible links. `visibility: hidden` removes it; transitioning `visibility` keeps it visible until the slide-out has finished, because visibility switches at the visible end of the transition.' },
      ],
      example: [
        { code: 'dialog { border: none; border-radius: 12px; padding: 2rem; }\ndialog::backdrop { background: rgb(0 0 0 / 0.5); }', lang: 'css' },
      ],
      task: [
        { ol: ['`.modal-backdrop`: fixed over the whole viewport, `rgb(0 0 0 / 0.5)`, centring `.modal` both ways, `z-index: 1000`.', '`.modal`: white, `12px` radius, `32px` padding, `90%` wide up to `480px`.', 'The backdrop must cover the fixed header too. The legacy `.page-wrapper` rule traps it in a stacking context: undo that rule\'s stacking context (do not raise the modal\'s z-index).', '`.drawer`: fixed to the right edge, full height, `320px` wide, white; off-screen with `translateX(100%)` and `visibility: hidden` when closed; `.drawer.is-open` slides in and is visible; transform transitions over `0.3s ease` and visibility over `0.3s`; `z-index: 1100`.', '`dialog::backdrop`: `rgb(0 0 0 / 0.5)`.'] },
      ],
      starter: '.modal-backdrop {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgb(0 0 0 / 0.5);\n  z-index: 99999;\n}\n\n.drawer {\n  position: fixed;\n  right: -320px;\n  width: 320px;\n}\n',
      solution: '.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgb(0 0 0 / 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n\n.modal {\n  background: white;\n  border-radius: 12px;\n  padding: 32px;\n  width: 90%;\n  max-width: 480px;\n}\n\n.page-wrapper {\n  z-index: auto;\n}\n\n.drawer {\n  position: fixed;\n  inset-block: 0;\n  right: 0;\n  width: 320px;\n  background: white;\n  transform: translateX(100%);\n  visibility: hidden;\n  transition: transform 0.3s ease, visibility 0.3s;\n  z-index: 1100;\n}\n\n.drawer.is-open {\n  transform: translateX(0);\n  visibility: visible;\n}\n\ndialog::backdrop {\n  background: rgb(0 0 0 / 0.5);\n}\n',
      checks: [
        { label: 'full-viewport backdrop', mistake: '.modal-backdrop { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); z-index: 1000; }', check: ({ document, $, rect }) => { const s = getComputedStyle($('.modal-backdrop')); const r = rect('.modal-backdrop'); return (s.position === 'fixed' && Math.round(r.top) === 0 && Math.round(r.left) === 0 && Math.round(r.width) === document.documentElement.clientWidth && Math.round(r.height) === window.innerHeight && s.backgroundColor === 'rgba(0, 0, 0, 0.5)' && s.zIndex === '1000') || `backdrop: position ${s.position}, ${Math.round(r.width)}×${Math.round(r.height)} at (${Math.round(r.left)}, ${Math.round(r.top)}), z-index ${s.zIndex}`; } },
        { label: 'centred modal box', mistake: 'Backdrop: display flex, align-items and justify-content center. .modal: white, radius 12px, padding 32px, width 90%, max-width 480px.', check: async ({ $, atWidth, h }) => { const wide = await atWidth(1024); const r = wide.rect('.modal'); const cx = Math.abs(r.left + r.width / 2 - wide.width / 2); const cy = Math.abs(r.top + r.height / 2 - window.innerHeight / 2); const w1 = Math.round(r.width); const phone = await atWidth(375); const w2 = Math.round(phone.rect('.modal').width); const want2 = Math.round(phone.width * 0.9); const s = getComputedStyle($('.modal')); return (cx < 1 && cy < 1 && w1 === 480 && w2 === want2 && h.sameValue('background-color', s.backgroundColor, 'white') && s.borderTopLeftRadius === '12px' && s.paddingTop === '32px') || `modal ${w1}px wide at 1024px and ${w2}px at 375px (want 480 / ${want2}), off centre by ${Math.round(cx)}/${Math.round(cy)}px`; } },
        { label: 'backdrop above the header', mistake: 'The legacy .page-wrapper { position: relative; z-index: 1 } makes a stacking context that ranks the whole modal below the header. Set .page-wrapper { z-index: auto; }.', check: ({ document, $ }) => { const top = document.elementFromPoint(30, 30); const covered = top && $('.modal-backdrop').contains(top); const z = getComputedStyle($('.modal-backdrop')).zIndex; return (covered && z === '1000') || (z !== '1000' ? `the backdrop z-index is ${z}: keep it at 1000 and fix the trap instead` : 'the header still shows above the backdrop'); } },
        { label: 'drawer parked off-screen and hidden', mistake: '.drawer { position: fixed; inset-block: 0; right: 0; width: 320px; transform: translateX(100%); visibility: hidden; z-index: 1100; }', check: ({ document, $, rect }) => { const s = getComputedStyle($('.drawer')); const r = rect('.drawer'); return (s.position === 'fixed' && Math.round(r.top) === 0 && Math.round(r.height) === window.innerHeight && Math.round(r.width) === 320 && Math.round(r.left) >= document.documentElement.clientWidth && s.visibility === 'hidden' && s.zIndex === '1100') || `closed drawer: ${s.position}, left ${Math.round(r.left)}, height ${Math.round(r.height)}, visibility ${s.visibility}, z-index ${s.zIndex}`; } },
        { label: 'drawer slides in', mistake: '.drawer.is-open { transform: translateX(0); visibility: visible; } with transition: transform 0.3s ease, visibility 0.3s.', check: async ({ document, $, rect, settle, h }) => { const d = $('.drawer'); const s = getComputedStyle(d); const timed = s.transitionProperty === 'transform, visibility' && s.transitionDuration === '0.3s, 0.3s'; d.classList.add('is-open'); await settle(); const sliding = d.getAnimations().some((a) => a.transitionProperty === 'transform'); d.getAnimations().forEach((a) => a.finish()); await settle(); const r = rect(d); const open = Math.round(r.right) === document.documentElement.clientWidth && getComputedStyle(d).visibility === 'visible' && h.sameValue('background-color', getComputedStyle(d).backgroundColor, 'white'); d.classList.remove('is-open'); d.getAnimations().forEach((a) => a.finish()); await settle(); return (timed && sliding && open) || `transition "${s.transitionProperty}" ${s.transitionDuration}; open drawer right edge ${Math.round(r.right)}, visibility ${getComputedStyle(d).visibility}`; } },
        { label: 'native dialog backdrop', mistake: 'dialog::backdrop { background: rgb(0 0 0 / 0.5); }', check: ({ document }) => { const rule = [...document.querySelector('style[data-source="learner"]').sheet.cssRules].find((r) => /::backdrop/.test(r.selectorText || '')); return Boolean(rule && rule.style.backgroundColor === 'rgba(0, 0, 0, 0.5)') || 'no dialog::backdrop rule with rgb(0 0 0 / 0.5)'; } },
      ],
    },
  ],
};
