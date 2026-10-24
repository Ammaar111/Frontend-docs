// HTML & CSS course, Parts 21–23: typography, backgrounds, borders and shadows.
const PHOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%230ea5e9'/%3E%3Ccircle cx='300' cy='80' r='50' fill='%23fde68a'/%3E%3C/svg%3E";

export default {
  id: 'css-type-surfaces',
  title: 'Typography, backgrounds, borders and shadows',
  lessons: [
    {
      id: 'css-typography',
      title: 'Typography that reads well',
      source: 'HTML & CSS course, Part 21',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<article class="post">\n  <p class="eyebrow">Monsoon guide</p>\n  <h1 class="headline">Getting around Mumbai in July</h1>\n  <p class="body-text">Local trains, BEST buses and the metro all run through the rains, but delays stack up quickly once water collects on the tracks.</p>\n  <p class="link-line">Updates: https://railway.example.in/western-line/service-status/monsoon-2026-special-timetable</p>\n</article>\n<div class="card"><h3 class="card-title">Wooden train set with 24 magnetic carriages and a figure-eight track</h3></div>',
        css: 'body { margin: 0; }\n.post { width: 320px; padding: 16px; }\n.card { width: 220px; border: 1px solid #ccc; padding: 8px; }\n.headline { font-size: 2.5rem; }',
      },
      teach: [
        { list: ['`font-family` is a **stack**: tried in order, ending with a generic family (`serif`, `sans-serif`, `monospace`) that always exists. Quote names with spaces.', '`font-weight` 100–900 (400 normal, 700 bold); `font-style: italic`.', 'Font sizes in `rem` (Part 17).'] },
        { h: 'Unitless line-height' },
        '`line-height: 1.6` inherits as a **ratio**, recomputed for each element\'s own font size. `line-height: 24px` inherits as 24px, so a 40px heading inside gets overlapping lines. Body text reads well at 1.4–1.6.',
        { h: 'Text details' },
        { list: ['`letter-spacing: 0.1em` + `text-transform: uppercase` for small "eyebrow" labels. `text-transform` changes only the look; screen readers and copy-paste see the real text.', '`text-align`, `text-decoration`, `text-underline-offset`.', 'Single-line truncation needs **all three**: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`.', '`overflow-wrap: break-word` lets a long URL break instead of overflowing; `word-break: break-all` breaks anywhere (harsher).', 'Comfortable measure: 45–75 characters per line: `max-width: 65ch`.'] },
        { h: 'Web fonts' },
        { code: '@font-face {\n  font-family: "Inter";\n  src: url("/fonts/inter-regular.woff2") format("woff2");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;   /* show fallback text immediately, swap when loaded */\n}', lang: 'css' },
        'One `@font-face` per weight/style file. Load only the weights you use, prefer WOFF2, and always set `font-display: swap` to avoid invisible text while fonts download.',
      ],
      example: [
        { code: '.card-title {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}', lang: 'css' },
      ],
      task: [
        { ol: ['Declare an `@font-face` named `"Inter"` from `/fonts/inter-regular.woff2` (format woff2), weight 400, normal style, `font-display: swap`.', '`body`: `font-family: "Inter", Arial, sans-serif` and `line-height: 1.6` (unitless) so the big headline inherits a proportional line height.', '`.eyebrow`: uppercase, `letter-spacing: 0.1em`, `font-weight: 600`.', '`.card-title`: one line, truncated with an ellipsis.', '`.link-line`: the long URL must wrap inside the article instead of overflowing.', '`.body-text`: `max-width: 65ch`.'] },
      ],
      starter: 'body {\n  font-family: Inter;\n  line-height: 24px;\n}\n\n.card-title {\n  text-overflow: ellipsis;\n}\n',
      solution: '@font-face {\n  font-family: "Inter";\n  src: url("/fonts/inter-regular.woff2") format("woff2");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n\nbody {\n  font-family: "Inter", Arial, sans-serif;\n  line-height: 1.6;\n}\n\n.eyebrow {\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-weight: 600;\n}\n\n.card-title {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.link-line {\n  overflow-wrap: break-word;\n}\n\n.body-text {\n  max-width: 65ch;\n}\n',
      checks: [
        { label: '@font-face with swap', mistake: 'One @font-face block: family "Inter", the woff2 src, weight 400, style normal, font-display: swap.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const face = h.allRules(sheet, 'CSSFontFaceRule')[0]; return (face && /Inter/.test(face.style.getPropertyValue('font-family')) && /inter-regular\.woff2/.test(face.style.getPropertyValue('src')) && face.style.getPropertyValue('font-display') === 'swap' && ['400', 'normal'].includes(face.style.getPropertyValue('font-weight'))) ? true : 'check the @font-face block'; } },
        { label: 'font stack ends generic', mistake: 'font-family: "Inter", Arial, sans-serif on body.', check: ({ document }) => { const fam = getComputedStyle(document.body).fontFamily.replace(/\s/g, ''); return /^"?Inter"?,Arial,sans-serif$/.test(fam) || `body font-family is ${fam}`; } },
        { label: 'proportional line height', mistake: 'Use unitless line-height: 1.6 so the 40px headline gets 64px lines.', check: ({ $ }) => getComputedStyle($('.headline')).lineHeight === '64px' || `headline line-height is ${getComputedStyle($('.headline')).lineHeight}` },
        { label: 'eyebrow label', mistake: 'uppercase, letter-spacing 0.1em, weight 600.', check: ({ $ }) => { const s = getComputedStyle($('.eyebrow')); return (s.textTransform === 'uppercase' && s.letterSpacing === '1.6px' && s.fontWeight === '600' && $('.eyebrow').textContent === 'Monsoon guide') || `transform ${s.textTransform}, spacing ${s.letterSpacing}, weight ${s.fontWeight}`; } },
        { label: 'ellipsis truncation', mistake: 'All three: white-space: nowrap; overflow: hidden; text-overflow: ellipsis.', check: ({ $ }) => { const t = $('.card-title'); const s = getComputedStyle(t); return (s.whiteSpace === 'nowrap' && s.overflowX === 'hidden' && s.textOverflow === 'ellipsis' && t.scrollWidth > t.clientWidth && t.getBoundingClientRect().height < 40) || `white-space ${s.whiteSpace}, overflow ${s.overflowX}, text-overflow ${s.textOverflow}`; } },
        { label: 'long URL wraps', mistake: '.link-line { overflow-wrap: break-word; }', check: ({ $ }) => { const p = $('.link-line'); return (p.scrollWidth <= p.clientWidth + 1 && getComputedStyle(p).overflowWrap === 'break-word') || 'the URL still overflows the article'; } },
        { label: 'readable measure', mistake: '.body-text { max-width: 65ch; }', check: ({ document, h }) => h.declared(document.querySelector('style[data-source="learner"]').sheet, '.body-text', 'max-width') === '65ch' || 'no max-width: 65ch on .body-text' },
      ],
    },
    {
      id: 'css-backgrounds',
      title: 'Backgrounds, gradients and layers',
      source: 'HTML & CSS course, Part 22',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<section class="hero"><h1>Monsoon sale</h1></section>\n<button class="btn" type="button">Shop now</button>\n<div class="spotlight"></div>\n<div class="pie" role="img" aria-label="25% complete"></div>\n<section class="banner"><h2>Free delivery in Mumbai</h2></section>',
        css: `body { margin: 0; }\n.hero, .banner { height: 180px; color: white; display: grid; place-items: center; }\n.btn { color: white; border: 0; padding: 12px 24px; }\n.spotlight { width: 160px; height: 160px; background-color: #1e293b; }\n.pie { width: 120px; height: 120px; border-radius: 50%; }\n:root { --photo: url("${PHOTO}"); }`,
      },
      teach: [
        { list: ['`background-image: url(…)` paints behind the content.', '`background-repeat`: `repeat` (default), `no-repeat`, `repeat-x`.', '`background-position`: `center`, `right top`, `20px 40px`.', '`background-size: cover` fills the box and crops; `contain` shows the whole image and may leave gaps.', '`background-attachment: fixed` pins it to the viewport (with mobile and performance quirks).', 'Shorthand: `background: url(hero.jpg) center/cover no-repeat;` (position/size joined by a slash).'] },
        { h: 'Gradients are images' },
        { code: 'linear-gradient(135deg, #4f46e5, #7c3aed)            /* 0deg up, 90deg right, 135deg diagonal */\nlinear-gradient(to right, red, yellow 50%, green)    /* explicit stop positions */\nradial-gradient(circle, white, transparent 70%)      /* glows, vignettes */\nconic-gradient(steelblue 0deg 90deg, lightgray 90deg) /* pies, wheels */', lang: 'css' },
        { h: 'Layers' },
        'Comma-separated backgrounds stack, **first on top**. A translucent gradient over a photo keeps white text readable:',
        { code: 'background:\n  linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)),\n  url(photo.jpg) center / cover no-repeat;', lang: 'css' },
      ],
      example: [
        { code: '.hero {\n  background-image: url("hero.jpg");\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}', lang: 'css' },
      ],
      task: [
        'The lesson CSS defines `--photo` as an image you can use with `var(--photo)`.',
        { ol: ['`.hero`: the photo, covering the whole box, centred, not repeated.', '`.btn`: a `135deg` linear gradient from `#4f46e5` to `#7c3aed`.', '`.spotlight`: on top of its dark colour, a radial gradient glow: white in the centre fading to transparent at 70%.', '`.pie`: a conic gradient showing 25%: `#4338ca` from 0 to 90deg, `#e2e8f0` for the rest.', '`.banner`: a 50% black linear-gradient layer **on top of** the photo (cover, centred, no-repeat).'] },
      ],
      starter: '.hero {\n  background: var(--photo);\n}\n\n.banner {\n  background: var(--photo) center / cover no-repeat;\n  opacity: 0.5;\n}\n',
      solution: '.hero {\n  background-image: var(--photo);\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n.btn {\n  background: linear-gradient(135deg, #4f46e5, #7c3aed);\n}\n\n.spotlight {\n  background-image: radial-gradient(circle, white, transparent 70%);\n}\n\n.pie {\n  background: conic-gradient(#4338ca 0deg 90deg, #e2e8f0 90deg 360deg);\n}\n\n.banner {\n  background:\n    linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)),\n    var(--photo) center / cover no-repeat;\n}\n',
      checks: [
        { label: 'cover hero', mistake: 'background-size: cover; background-position: center; background-repeat: no-repeat; with the photo.', check: ({ $ }) => { const s = getComputedStyle($('.hero')); return (s.backgroundImage.startsWith('url(') && s.backgroundSize === 'cover' && s.backgroundPositionX === '50%' && s.backgroundPositionY === '50%' && s.backgroundRepeat === 'no-repeat') || `size ${s.backgroundSize}, position ${s.backgroundPosition}, repeat ${s.backgroundRepeat}`; } },
        { label: 'diagonal button gradient', mistake: 'linear-gradient(135deg, #4f46e5, #7c3aed).', check: ({ $ }) => { const bg = getComputedStyle($('.btn')).backgroundImage; return (/linear-gradient\(135deg, rgb\(79, 70, 229\), rgb\(124, 58, 237\)\)/.test(bg)) || `button background-image: ${bg}`; } },
        { label: 'radial spotlight over the colour', mistake: 'Keep the dark background-color and add a radial-gradient image (white to transparent 70%).', check: ({ $, h }) => { const s = getComputedStyle($('.spotlight')); return (/radial-gradient/.test(s.backgroundImage) && /70%/.test(s.backgroundImage) && h.sameValue('background-color', s.backgroundColor, '#1e293b')) || `spotlight: ${s.backgroundImage}, colour ${s.backgroundColor}`; } },
        { label: 'conic pie', mistake: 'conic-gradient(#4338ca 0deg 90deg, #e2e8f0 90deg 360deg).', check: ({ $ }) => { const bg = getComputedStyle($('.pie')).backgroundImage; return (/conic-gradient/.test(bg) && /rgb\(67, 56, 202\) 0deg,? (rgb\(67, 56, 202\) )?90deg/.test(bg) && /rgb\(226, 232, 240\) 90deg/.test(bg)) || `pie: ${bg}`; } },
        { label: 'gradient layered over the photo', mistake: 'Two comma-separated layers, the gradient first (on top); no opacity on the whole banner.', check: ({ $ }) => { const s = getComputedStyle($('.banner')); const layers = s.backgroundImage.split(/,\s*(?=url|linear|radial)/); return (layers.length === 2 && layers[0].startsWith('linear-gradient') && layers[1].startsWith('url(') && s.opacity === '1' && /cover/.test(s.backgroundSize)) || `banner layers: ${s.backgroundImage.slice(0, 80)}…, opacity ${s.opacity}`; } },
      ],
    },
    {
      id: 'css-borders-shadows',
      title: 'Borders, radius, outlines and shadows',
      source: 'HTML & CSS course, Part 23',
      runner: 'page',
      slot: 'css',
      fixture: {
        html: '<div class="row"><div class="table-row">Order #1042</div><div class="table-row">Order #1043</div></div>\n<button class="pill" type="button">Subscribe</button>\n<img class="avatar" alt="Ammaar" width="48" height="48" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'%3E%3Crect width=\'48\' height=\'48\' fill=\'%23f59e0b\'/%3E%3C/svg%3E">\n<div class="card">Card</div>\n<div class="elevated">Elevated</div>\n<button class="press" type="button">Pressed</button>\n<h1 class="hero-heading">Over a photo</h1>\n<input class="field" aria-label="Name"><span class="after-field">next</span>',
        css: 'body { margin: 16px; }\n.table-row { padding: 8px; }\n.pill { padding: 8px 20px; border: 0; background: #4338ca; color: white; }\n.card, .elevated { width: 200px; padding: 16px; margin: 16px 0; background: white; }\n.hero-heading { color: white; background: #0ea5e9; }',
      },
      teach: [
        { list: ['`border: 2px solid steelblue` (width style colour). A border needs a style: `border-color` alone shows nothing.', 'Per side: `border-top`, `border-bottom: none`…', '`border-radius: 8px`; `50%` on a square = circle; `9999px` = pill for any height; four values go clockwise from top-left.'] },
        { h: 'outline vs border' },
        '`outline` is drawn outside the box and **never affects layout**. That is exactly why focus rings use it: appearing on focus must not shift anything. `outline-offset` adds a gap.',
        { h: 'Shadows' },
        { code: 'box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);   /* x  y  blur  [spread]  colour */\nbox-shadow: 0 1px 2px …, 0 4px 8px …, 0 12px 24px …;   /* layered = realistic depth */\nbox-shadow: inset 0 2px 4px rgb(0 0 0 / 0.2);           /* pressed in */\ntext-shadow: 0 2px 4px rgb(0 0 0 / 0.5);                /* no spread, no inset */', lang: 'css' },
        { warn: '`* { outline: none; }` with no `:focus-visible` replacement removes the keyboard user\'s only sign of where they are.' },
      ],
      example: [
        { code: '.avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }', lang: 'css' },
      ],
      task: [
        { ol: ['`.table-row`: only a bottom border `1px solid #e2e8f0`.', '`.pill`: fully rounded ends using `9999px`.', '`.avatar`: a perfect circle.', '`.card`: a soft shadow `0 2px 8px` in black at 10% opacity.', '`.elevated`: three layered shadows (any values).', '`.press`: an inset shadow.', '`.hero-heading`: a text shadow.', '`.field:focus-visible`: an `outline` of `3px solid #4338ca` with `outline-offset: 2px` (no border change, so nothing moves).'] },
      ],
      starter: '.table-row {\n  border-color: #e2e8f0;\n}\n\n.field:focus {\n  outline: none;\n  border: 3px solid #4338ca;\n}\n',
      solution: '.table-row {\n  border-bottom: 1px solid #e2e8f0;\n}\n\n.pill {\n  border-radius: 9999px;\n}\n\n.avatar {\n  border-radius: 50%;\n  object-fit: cover;\n}\n\n.card {\n  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);\n}\n\n.elevated {\n  box-shadow:\n    0 1px 2px rgb(0 0 0 / 0.08),\n    0 4px 8px rgb(0 0 0 / 0.08),\n    0 12px 24px rgb(0 0 0 / 0.08);\n}\n\n.press {\n  box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.25);\n}\n\n.hero-heading {\n  text-shadow: 0 2px 4px rgb(0 0 0 / 0.5);\n}\n\n.field:focus {\n  outline: none;\n}\n\n.field:focus-visible {\n  outline: 3px solid #4338ca;\n  outline-offset: 2px;\n}\n',
      checks: [
        { label: 'bottom border only', mistake: 'border-bottom: 1px solid #e2e8f0 (a style is required to show a border).', check: ({ $, h }) => { const s = getComputedStyle($('.table-row')); return (s.borderBottomWidth === '1px' && s.borderBottomStyle === 'solid' && h.sameValue('color', s.borderBottomColor, '#e2e8f0') && s.borderTopStyle === 'none') || `bottom ${s.borderBottomWidth} ${s.borderBottomStyle}, top ${s.borderTopStyle}`; } },
        { label: 'pill and circle', mistake: '.pill border-radius: 9999px; .avatar border-radius: 50%.', check: ({ $ }) => (getComputedStyle($('.pill')).borderTopLeftRadius === '9999px' && getComputedStyle($('.avatar')).borderTopLeftRadius === '50%') || `pill ${getComputedStyle($('.pill')).borderTopLeftRadius}, avatar ${getComputedStyle($('.avatar')).borderTopLeftRadius}` },
        { label: 'soft card shadow', mistake: 'box-shadow: 0 2px 8px rgb(0 0 0 / 0.1).', check: ({ $ }) => /rgba\(0, 0, 0, 0\.1\) 0px 2px 8px 0px/.test(getComputedStyle($('.card')).boxShadow) || `card shadow: ${getComputedStyle($('.card')).boxShadow}` },
        { label: 'layered, inset and text shadows', mistake: 'Three comma-separated shadows on .elevated, an inset on .press, a text-shadow on .hero-heading.', check: ({ $ }) => { const layers = (getComputedStyle($('.elevated')).boxShadow.match(/rgba?\(/g) || []).length; return (layers === 3 && /inset/.test(getComputedStyle($('.press')).boxShadow) && getComputedStyle($('.hero-heading')).textShadow !== 'none') || `elevated has ${layers} layer(s)`; } },
        { label: 'outline focus ring', mistake: '.field:focus-visible { outline: 3px solid #4338ca; outline-offset: 2px; } and no border change on focus.', check: ({ document, h }) => { const sheet = document.querySelector('style[data-source="learner"]').sheet; const borderOnFocus = h.declared(sheet, '.field:focus', 'border-top-width') || h.declared(sheet, '.field:focus-visible', 'border-top-width'); return (h.declared(sheet, '.field:focus-visible', 'outline-width') === '3px' && h.declared(sheet, '.field:focus-visible', 'outline-offset') === '2px' && !borderOnFocus) || (borderOnFocus ? 'focus changes the border, which shifts the layout: use outline' : 'no .field:focus-visible outline'); } },
      ],
    },
  ],
};
