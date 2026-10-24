// CSS track. Concepts follow the HTML & CSS course:
// Part 14 (selectors), Part 18 (box model), Part 24 (Flexbox), Part 26 (media queries).
//
// Each check receives { sheet }, a CSSStyleSheet parsed from the learner's CSS
// and never attached to the page, so it styles nothing.

const norm = (selector) => selector.replace(/\s+/g, ' ').trim();

// Top-level style rules only (not those inside @media).
function plainRules(sheet) {
  return [...sheet.cssRules].filter((rule) => rule instanceof CSSStyleRule);
}

// Style rules inside an @media block whose condition contains `query`.
function mediaRules(sheet, query) {
  return [...sheet.cssRules]
    .filter((rule) => rule instanceof CSSMediaRule && rule.conditionText.includes(query))
    .flatMap((rule) => [...rule.cssRules].filter((inner) => inner instanceof CSSStyleRule));
}

// Value of `prop` for `selector`. When the selector appears more than once,
// the last declaration wins, the same as in the browser.
function declared(sheet, selector, prop) {
  let value = '';
  for (const rule of plainRules(sheet)) {
    if (norm(rule.selectorText) !== selector) continue;
    const found = rule.style.getPropertyValue(prop);
    if (found) value = found;
  }
  return value;
}

// Browsers normalize values (white becomes rgb(255, 255, 255), 1.25rem stays as is).
// Compare what each value becomes once a browser has parsed it, not the raw text.
function sameValue(prop, actual, expected) {
  if (!actual) return false;
  const probe = (value) => {
    const node = document.createElement('div');
    node.style.setProperty(prop, value);
    return node.style.getPropertyValue(prop);
  };
  const normalizedExpected = probe(expected);
  return normalizedExpected !== '' && probe(actual) === normalizedExpected;
}

const is = (sheet, selector, prop, expected) => sameValue(prop, declared(sheet, selector, prop), expected);

export const cssLessons = [
  {
    id: 'css-selectors',
    track: 'css',
    module: 'Selectors',
    title: 'Selectors and specificity',
    source: 'HTML & CSS course, Part 14',
    runner: 'css',
    teach: [
      'A rule is a selector followed by declarations: `h1 { color: #222; }`. The selector picks the elements, and each declaration sets one property.',
      'Class selectors (`.card`) are for reusable styles. ID selectors (`#main-nav`) match one element and carry much more weight, so they are hard to override later.',
      'A space means descendant (`.card h2` matches any h2 inside a card). `>` means direct child only (`ul > li`).',
      '`:focus-visible` shows a focus ring for keyboard users without showing it after every mouse click. Never remove focus outlines without a replacement.',
      { warn: 'Using IDs for styling. `#header a` beats every class rule, which forces you to write `!important` to override it later. Prefer classes.' },
    ],
    example: {
      code: 'h1 { color: #222; }\n.card p { margin: 0; }\n#site-header { background: #111; }\nnav > a:hover { text-decoration: underline; }',
    },
    task: [
      {
        list: [
          '`.card`: a background-color of white and a border-radius of 8px.',
          '`.card h2`: a font-size of 1.25rem.',
          '`#main-nav a`: a color of #4f46e5.',
          '`button:focus-visible`: an outline with a width of 2px, a solid style and a color of #4f46e5.',
          '`ul > li`: a list-style of none.',
        ],
      },
    ],
    starter: '/* Write your CSS here */\n',
    tests: [
      {
        label: 'your CSS contains rules',
        check: ({ sheet }) => plainRules(sheet).length > 0,
        mistake: 'Your CSS did not produce any rules. Check for missing braces, semicolons or colons.',
      },
      {
        label: '.card background-color is white',
        check: ({ sheet }) => is(sheet, '.card', 'background-color', 'white'),
        mistake: 'Set background-color: white on .card.',
      },
      {
        label: '.card border-radius is 8px',
        check: ({ sheet }) => is(sheet, '.card', 'border-radius', '8px'),
        mistake: 'Set border-radius: 8px on .card.',
      },
      {
        label: '.card h2 font-size is 1.25rem',
        check: ({ sheet }) => is(sheet, '.card h2', 'font-size', '1.25rem'),
        mistake: 'The selector must be ".card h2" (a descendant selector, with a space), and the size must be 1.25rem.',
      },
      {
        label: '#main-nav a color is #4f46e5',
        check: ({ sheet }) => is(sheet, '#main-nav a', 'color', '#4f46e5'),
        mistake: 'The selector must be "#main-nav a", and the color must be #4f46e5.',
      },
      {
        label: 'button:focus-visible outline is 2px solid #4f46e5',
        check: ({ sheet }) =>
          is(sheet, 'button:focus-visible', 'outline-width', '2px') &&
          declared(sheet, 'button:focus-visible', 'outline-style') === 'solid' &&
          is(sheet, 'button:focus-visible', 'outline-color', '#4f46e5'),
        mistake: 'Use the selector "button:focus-visible" with outline: 2px solid #4f46e5.',
      },
      {
        label: 'ul > li has list-style none',
        check: ({ sheet }) => declared(sheet, 'ul > li', 'list-style-type') === 'none',
        mistake: 'Use the selector "ul > li" (with >, not a space) and set list-style: none.',
      },
    ],
  },

  {
    id: 'css-box-model',
    track: 'css',
    module: 'Box model',
    title: 'The box model and centering',
    source: 'HTML & CSS course, Part 18',
    runner: 'css',
    teach: [
      'Every element is a box: content, then padding, then border, then margin. By default `width` sets only the content box, so padding and border add to the total size.',
      '`box-sizing: border-box` makes `width` include padding and border. Almost every project sets it globally with `* { box-sizing: border-box; }`.',
      'A block element with a set width can be centered horizontally with `margin: 0 auto`, which gives the left and right margins equal, automatic values.',
      '`px` is an absolute length. `rem` scales with the user\'s root font size, which respects their accessibility settings.',
      { warn: 'Setting `width: 50%` and `padding: 20px` on a content-box element. The rendered width becomes 50% plus 40px, which can overflow the parent.' },
    ],
    example: {
      code: '*, *::before, *::after { box-sizing: border-box; }\n.container { max-width: 720px; margin: 0 auto; padding: 1rem; }',
    },
    task: [
      {
        list: [
          '`*`: box-sizing of border-box.',
          '`.container`: max-width of 720px, horizontally centered with `margin: 0 auto`, and padding of 1.5rem.',
          '`.box`: width of 50%, padding of 20px, and a border of 2px solid #ccc.',
        ],
      },
    ],
    starter: '/* Write your CSS here */\n',
    tests: [
      {
        label: '* uses border-box',
        check: ({ sheet }) => declared(sheet, '*', 'box-sizing') === 'border-box',
        mistake: 'Add * { box-sizing: border-box; }.',
      },
      {
        label: '.container max-width is 720px',
        check: ({ sheet }) => is(sheet, '.container', 'max-width', '720px'),
        mistake: 'Set max-width: 720px on .container.',
      },
      {
        label: '.container is horizontally centered',
        check: ({ sheet }) =>
          ['margin-left', 'margin-inline', 'margin'].some((prop) => declared(sheet, '.container', prop).includes('auto')),
        mistake: 'Center .container with margin: 0 auto, which gives the left and right margins the value auto.',
      },
      {
        label: '.container padding is 1.5rem',
        check: ({ sheet }) => is(sheet, '.container', 'padding', '1.5rem'),
        mistake: 'Set padding: 1.5rem on .container.',
      },
      {
        label: '.box width is 50%',
        check: ({ sheet }) => is(sheet, '.box', 'width', '50%'),
        mistake: 'Set width: 50% on .box.',
      },
      {
        label: '.box padding is 20px',
        check: ({ sheet }) => is(sheet, '.box', 'padding', '20px'),
        mistake: 'Set padding: 20px on .box.',
      },
      {
        label: '.box has a 2px solid border',
        check: ({ sheet }) =>
          is(sheet, '.box', 'border-top-width', '2px') && declared(sheet, '.box', 'border-top-style') === 'solid',
        mistake: 'Set border: 2px solid #ccc on .box.',
      },
    ],
  },

  {
    id: 'css-flexbox',
    track: 'css',
    module: 'Layout',
    title: 'Flexbox and a responsive row',
    source: 'HTML & CSS course, Parts 24 and 26',
    runner: 'css',
    teach: [
      '`display: flex` makes an element a flex container. Its children line up along the main axis, which is a row by default.',
      '`justify-content` distributes children along the main axis. `align-items` aligns them on the cross axis.',
      '`gap` adds space between children without adding space at the outer edges.',
      '`flex: 1` lets an item grow to fill leftover space. It sets flex-grow to 1, flex-shrink to 1 and flex-basis to 0%.',
      '`@media (min-width: 768px) { ... }` applies rules only when the viewport is at least 768px wide. Write the mobile styles first, then add wider layouts inside a media query: the mobile-first approach.',
      { tip: 'If a flex item refuses to shrink below its content width, its min-width is the cause. Setting `min-width: 0` on it usually fixes the overflow.' },
    ],
    example: {
      code: '.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}\n.nav .search { flex: 1; }',
    },
    task: [
      {
        list: [
          '`.toolbar`: display flex, justify-content space-between, align-items center, gap of 1rem, and flex-wrap wrap.',
          '`.toolbar .search`: flex of 1, so it grows to fill the space.',
          '`.cards`: display flex and flex-direction column.',
          'Inside `@media (min-width: 768px)`, give `.cards` a flex-direction of row.',
        ],
      },
    ],
    starter: '/* Write your CSS here */\n',
    tests: [
      {
        label: '.toolbar is a flex container',
        check: ({ sheet }) => declared(sheet, '.toolbar', 'display') === 'flex',
        mistake: 'Set display: flex on .toolbar.',
      },
      {
        label: '.toolbar justify-content is space-between',
        check: ({ sheet }) => declared(sheet, '.toolbar', 'justify-content') === 'space-between',
        mistake: 'Set justify-content: space-between on .toolbar.',
      },
      {
        label: '.toolbar align-items is center',
        check: ({ sheet }) => declared(sheet, '.toolbar', 'align-items') === 'center',
        mistake: 'Set align-items: center on .toolbar.',
      },
      {
        label: '.toolbar gap is 1rem',
        check: ({ sheet }) => is(sheet, '.toolbar', 'row-gap', '1rem'),
        mistake: 'Set gap: 1rem on .toolbar.',
      },
      {
        label: '.toolbar wraps its items',
        check: ({ sheet }) => declared(sheet, '.toolbar', 'flex-wrap') === 'wrap',
        mistake: 'Set flex-wrap: wrap on .toolbar so items move to a new line on narrow screens.',
      },
      {
        label: '.toolbar .search grows (flex-grow 1)',
        check: ({ sheet }) => declared(sheet, '.toolbar .search', 'flex-grow') === '1',
        mistake: 'Set flex: 1 on .toolbar .search, so the search field fills the leftover space.',
      },
      {
        label: '.cards is a column flex container',
        check: ({ sheet }) =>
          declared(sheet, '.cards', 'display') === 'flex' && declared(sheet, '.cards', 'flex-direction') === 'column',
        mistake: 'Set display: flex and flex-direction: column on .cards.',
      },
      {
        label: '.cards becomes a row at 768px and up',
        check: ({ sheet }) =>
          mediaRules(sheet, '768px').some(
            (rule) => norm(rule.selectorText) === '.cards' && rule.style.getPropertyValue('flex-direction') === 'row',
          ),
        mistake: 'Inside @media (min-width: 768px) { ... }, add a .cards rule with flex-direction: row.',
      },
    ],
  },
];
