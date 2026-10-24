export default {
  id: 'smoke-css',
  title: 'Smoke',
  lessons: [
    {
      id: 'smoke-css-static',
      title: 'Smoke CSS',
      source: 'test',
      runner: 'css',
      teach: ['x'], example: ['x'], task: ['x'],
      starter: '',
      solution: '.card { color: white; padding: 1rem; }\n@media (min-width: 600px) { .card { padding: 2rem; } }',
      checks: [
        { label: 'color', mistake: 'c', check: ({ sheet, h }) => h.is(sheet, '.card', 'color', '#fff') },
        { label: 'padding', mistake: 'p', check: ({ sheet, h }) => h.is(sheet, '.card', 'padding', '16px') || h.is(sheet, '.card', 'padding', '1rem') },
        { label: 'media', mistake: 'm', check: ({ sheet, h }) => h.is(sheet, '.card', 'padding', '2rem', h.mediaRules(sheet, 'min-width: 600px')) },
      ],
    },
    {
      id: 'smoke-css-page',
      title: 'Smoke CSS page',
      source: 'test',
      runner: 'page',
      slot: 'css',
      fixture: { html: '<div class="row"><div class="a">A</div><div class="b">B</div></div>' },
      teach: ['x'], example: ['x'], task: ['x'],
      starter: '',
      solution: '.row { display: flex; gap: 10px; } .a, .b { width: 100px; }',
      checks: [
        { label: 'flex', mistake: 'f', check: ({ style }) => style('.row', 'display') === 'flex' },
        { label: 'side by side', mistake: 's', check: ({ rect }) => rect('.a').top === rect('.b').top },
        { label: 'gap', mistake: 'g', check: ({ rect }) => Math.round(rect('.b').left - rect('.a').right) === 10 },
      ],
    },
  ],
};
