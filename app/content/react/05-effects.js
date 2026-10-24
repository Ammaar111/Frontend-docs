// JavaScript & React course, Part 21: effects.
export default {
  id: 'react-effects',
  title: 'Effects',
  lessons: [
    {
      id: 'effects-basics',
      title: 'useEffect and the dependency array',
      source: 'JavaScript & React course, Part 21.1–21.4',
      runner: 'react',
      expose: ['TitleSync', 'Greeter'],
      teach: [
        'Rendering should be a **pure** calculation of JSX. But apps must touch things outside React: the tab title, timers, the network, a subscription. An **Effect** is where that happens: it runs **after** React has rendered and updated the DOM, to keep something outside React in sync.',
        { code: 'useEffect(() => {\n  document.title = unreadCount > 0 ? `(${unreadCount}) Inbox` : "Inbox";\n}, [unreadCount]);', lang: 'jsx' },
        { table: { head: ['Dependency array', 'Runs'], rows: [['none: `useEffect(fn)`', 'after **every** render (rarely what you want)'], ['`[]`', 'once, after the first render'], ['`[a, b]`', 'after the first render, then whenever `a` or `b` changed since the last render']] } },
        '**Every reactive value the effect reads** (props, state, values derived from them) belongs in the array. Leaving one out means the effect does not re-run when it changes, and whatever it manages silently goes out of sync. The `react-hooks` ESLint rule flags this; treat that warning as a bug report.',
        { warn: 'An effect with no array that sets state loops forever: set state → render → effect → set state…' },
      ],
      example: [
        { code: 'function UserProfile({ userId }) {\n  useEffect(() => {\n    console.log(`Fetching data for user ${userId}...`);\n  }, [userId]); // re-runs only when userId changes\n  return null;\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['`TitleSync({ unreadCount })` keeps `document.title` as `(N) Inbox`, or `Inbox` when the count is 0, and renders `<p>You have N unread messages.</p>`.', '`Greeter({ name })` logs `Hello, <name>!` with `console.log` once per **distinct** name: on mount and whenever `name` changes, not on unrelated re-renders.', 'Fix `App`: it has an infinite loop. It should count its own renders only once on mount, showing `<p className="mounted">Mounted</p>` after the first render.'] },
      ],
      starter: 'import { useState, useEffect } from "react";\n\nfunction TitleSync({ unreadCount }) {\n  document.title = `(${unreadCount}) Inbox`;\n  return <p>You have {unreadCount} unread messages.</p>;\n}\n\nfunction Greeter({ name }) {\n  useEffect(() => {\n    console.log(`Hello, ${name}!`);\n  }, []);\n  return <p>{name}</p>;\n}\n\nexport default function App() {\n  const [mounted, setMounted] = useState(0);\n  useEffect(() => {\n    setMounted(mounted + 1);\n  });\n  return <p className="mounted">{mounted > 0 ? "Mounted" : "Not yet"}</p>;\n}\n',
      solution: 'import { useState, useEffect } from "react";\n\nfunction TitleSync({ unreadCount }) {\n  useEffect(() => {\n    document.title = unreadCount > 0 ? `(${unreadCount}) Inbox` : "Inbox";\n  }, [unreadCount]);\n  return <p>You have {unreadCount} unread messages.</p>;\n}\n\nfunction Greeter({ name }) {\n  useEffect(() => {\n    console.log(`Hello, ${name}!`);\n  }, [name]);\n  return <p>{name}</p>;\n}\n\nexport default function App() {\n  const [mounted, setMounted] = useState(false);\n  useEffect(() => {\n    setMounted(true);\n  }, []);\n  return <p className="mounted">{mounted ? "Mounted" : "Not yet"}</p>;\n}\n',
      checks: [
        { label: 'App mounts without looping', mistake: 'An effect with no dependency array that sets state runs forever. Add [] so it runs once.', check: ({ text }) => text('.mounted') === 'Mounted' || `shows "${text('.mounted')}"` },
        { label: 'title follows the count', mistake: 'Set document.title inside useEffect with [unreadCount], and handle 0 as "Inbox".', check: async ({ render, el, exposed, document }) => { const view = await render(el(exposed.TitleSync, { unreadCount: 3 })); const a = document.title; await view.rerender(el(exposed.TitleSync, { unreadCount: 0 })); const b = document.title; await view.rerender(el(exposed.TitleSync, { unreadCount: 7 })); return (a === '(3) Inbox' && b === 'Inbox' && document.title === '(7) Inbox') || `titles: "${a}", "${b}", "${document.title}"`; } },
        { label: 'title set in an effect', mistake: 'Setting document.title in the render body is a side effect during render; move it into useEffect.', check: ({ source }) => { const body = source.slice(source.indexOf('function TitleSync'), source.indexOf('function Greeter')); return /useEffect\s*\(/.test(body); } },
        { label: 'greets again when the name changes', mistake: 'Greeter reads name, so name belongs in the dependency array: [name].', check: async ({ render, el, exposed, logs }) => { const start = logs.length; const view = await render(el(exposed.Greeter, { name: 'Ammaar' })); await view.rerender(el(exposed.Greeter, { name: 'Ammaar' })); await view.rerender(el(exposed.Greeter, { name: 'Priya' })); const got = logs.slice(start); return JSON.stringify(got) === JSON.stringify(['Hello, Ammaar!', 'Hello, Priya!']) || `logged ${JSON.stringify(got)}`; } },
      ],
    },
    {
      id: 'effects-cleanup',
      title: 'Cleanup: timers, listeners and unmounting',
      source: 'JavaScript & React course, Part 21.5',
      runner: 'react',
      expose: ['Stopwatch', 'WindowWidth'],
      teach: [
        'An effect can **return a cleanup function**. React calls it **before re-running the effect** (when a dependency changed) and **when the component unmounts**.',
        { code: 'useEffect(() => {\n  const intervalId = setInterval(() => console.log("Tick"), 1000);\n  return () => clearInterval(intervalId); // cleanup\n}, []);', lang: 'jsx' },
        'Without cleanup, the interval keeps running after the component is gone: wasted work, and a closure that can never be garbage-collected. The same goes for event listeners: whatever you `add` in an effect, `remove` in its cleanup, with the **same** function reference.',
        { code: 'useEffect(() => {\n  function handleResize() {\n    setWidth(window.innerWidth);\n  }\n  window.addEventListener("resize", handleResize);\n  return () => window.removeEventListener("resize", handleResize);\n}, []);', lang: 'jsx' },
        { tip: 'In development, `<StrictMode>` mounts, unmounts and remounts every component once, on purpose, to expose effects that are missing their cleanup.' },
      ],
      example: [
        { code: 'function Clock() {\n  const [time, setTime] = useState(new Date());\n  useEffect(() => {\n    const id = setInterval(() => setTime(new Date()), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <p>{time.toLocaleTimeString()}</p>;\n}', lang: 'jsx' },
      ],
      task: [
        { ol: ['`Stopwatch({ intervalMs = 1000 })`: shows `<p className="ticks">N</p>` starting at 0, incrementing every `intervalMs` (use the functional update). Its interval must be cleared on unmount.', 'When `intervalMs` changes, the old interval is cleared and a new one starts (it is a dependency).', '`WindowWidth`: shows `<p className="width">Width: Npx</p>`, updates on `resize`, and removes its listener on unmount.'] },
      ],
      starter: 'import { useState, useEffect } from "react";\n\nfunction Stopwatch({ intervalMs = 1000 }) {\n  const [ticks, setTicks] = useState(0);\n  useEffect(() => {\n    setInterval(() => setTicks(ticks + 1), intervalMs);\n  }, []);\n  return <p className="ticks">{ticks}</p>;\n}\n\nfunction WindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    window.addEventListener("resize", () => setWidth(window.innerWidth));\n  }, []);\n  return <p className="width">Width: {width}px</p>;\n}\n\nexport default function App() {\n  return <WindowWidth />;\n}\n',
      solution: 'import { useState, useEffect } from "react";\n\nfunction Stopwatch({ intervalMs = 1000 }) {\n  const [ticks, setTicks] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setTicks((prev) => prev + 1), intervalMs);\n    return () => clearInterval(id);\n  }, [intervalMs]);\n  return <p className="ticks">{ticks}</p>;\n}\n\nfunction WindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    function handleResize() {\n      setWidth(window.innerWidth);\n    }\n    window.addEventListener("resize", handleResize);\n    return () => window.removeEventListener("resize", handleResize);\n  }, []);\n  return <p className="width">Width: {width}px</p>;\n}\n\nexport default function App() {\n  return <WindowWidth />;\n}\n',
      checks: [
        { label: 'stopwatch counts', mistake: 'Use setTicks((prev) => prev + 1): with ticks + 1 the interval callback keeps reading the first render\'s 0.', check: async ({ render, el, exposed, wait }) => { const view = await render(el(exposed.Stopwatch, { intervalMs: 20 })); await wait(110); const n = Number(view.text('.ticks')); return n >= 3 || `after ~110 ms the stopwatch shows ${n}`; } },
        { label: 'interval cleared on unmount', mistake: 'Return () => clearInterval(id) from the effect.', check: async ({ render, el, exposed, window, wait }) => { const active = new Set(); const origSet = window.setInterval; const origClear = window.clearInterval; window.setInterval = (...args) => { const id = origSet(...args); active.add(id); return id; }; window.clearInterval = (id) => { active.delete(id); return origClear(id); }; try { const view = await render(el(exposed.Stopwatch, { intervalMs: 20 })); await wait(30); const running = active.size; await view.unmount(); return (running > 0 && active.size === 0) || `${active.size} interval(s) still running after unmount`; } finally { window.setInterval = origSet; window.clearInterval = origClear; } } },
        { label: 'interval restarts when intervalMs changes', mistake: 'intervalMs is used inside the effect, so put it in the dependency array; the cleanup clears the old interval first.', check: async ({ render, el, exposed, window }) => { const delays = []; const origSet = window.setInterval; window.setInterval = (fn, ms, ...rest) => { delays.push(ms); return origSet(fn, ms, ...rest); }; try { const view = await render(el(exposed.Stopwatch, { intervalMs: 50 })); await view.rerender(el(exposed.Stopwatch, { intervalMs: 25 })); await view.unmount(); return delays.includes(25) || `intervals created with ${JSON.stringify(delays)}`; } finally { window.setInterval = origSet; } } },
        { label: 'width updates on resize', mistake: 'Listen for "resize" on window and set the new width.', check: async ({ window, fire, text }) => { Object.defineProperty(window, 'innerWidth', { value: 640, configurable: true }); await fire(window, 'resize'); const shown = text('.width'); delete window.innerWidth; return shown === 'Width: 640px' || `shows "${shown}"`; } },
        { label: 'resize listener removed on unmount', mistake: 'Name the handler and remove the same function in the cleanup: window.removeEventListener("resize", handleResize).', check: async ({ render, el, exposed, window }) => { const listeners = new Set(); const add = window.addEventListener; const remove = window.removeEventListener; window.addEventListener = function (type, fn, opts) { if (type === 'resize') listeners.add(fn); return add.call(this, type, fn, opts); }; window.removeEventListener = function (type, fn, opts) { if (type === 'resize') listeners.delete(fn); return remove.call(this, type, fn, opts); }; try { const view = await render(el(exposed.WindowWidth)); const added = listeners.size; await view.unmount(); return (added > 0 && listeners.size === 0) || `${listeners.size} resize listener(s) left after unmount`; } finally { window.addEventListener = add; window.removeEventListener = remove; } } },
      ],
    },
    {
      id: 'effects-when-not',
      title: 'When not to use an effect',
      source: 'JavaScript & React course, Part 21.6–21.8',
      runner: 'react',
      expose: ['EligibilityChecker', 'ShoppingCart'],
      teach: [
        'The test: **is this synchronizing my component with something outside React** (a server, a timer, the tab title, a subscription, a DOM API)? If not, it is not an effect.',
        { code: '// 🔴 an effect for a derived value: renders once with a stale total, then again\nconst [total, setTotal] = useState(0);\nuseEffect(() => {\n  setTotal(items.reduce((sum, item) => sum + item.price, 0));\n}, [items]);\n\n// ✅ just calculate it during render\nconst total = items.reduce((sum, item) => sum + item.price, 0);', lang: 'jsx' },
        '**Common incorrect patterns:**',
        { list: ['`useEffect(async () => …)`: an async function returns a promise, but an effect must return nothing or a cleanup. Define an async function inside and call it.', 'A missing dependency: the effect reads `query` but has `[]`, so it never re-runs when `query` changes.', 'No array plus setting state: an infinite render loop.', 'Effects for **user actions** (submit, delete): those belong in the event handler that the action triggers, not in an effect that runs on render.'] },
        'Every legitimate effect has the same shape: **"whenever these values change, make that outside thing match."** For an expensive calculation you do not want to repeat on every render, the tool is `useMemo` (coming up), still not an effect.',
      ],
      example: [
        { code: 'useEffect(() => {\n  async function loadData() {\n    const data = await fetchData();\n    setData(data);\n  }\n  loadData();\n}, []);', lang: 'jsx' },
      ],
      task: [
        { ol: ['Rewrite `EligibilityChecker({ age })` without state or effects: `<p>Eligible</p>` from 18, otherwise `<p>Not eligible</p>`. It must be correct on the very first render.', 'Rewrite `ShoppingCart({ items, coupon })` so `<p className="total">Total: ₹N</p>` is computed during render: sum of `price × qty`, minus 10% when `coupon` is `"SAVE10"` (rounded to the nearest rupee).', '`App` renders `<EligibilityChecker age={17} />`.'] },
      ],
      starter: 'import { useState, useEffect } from "react";\n\nfunction EligibilityChecker({ age }) {\n  const [isEligible, setIsEligible] = useState(false);\n  useEffect(() => {\n    setIsEligible(age >= 18);\n  }, []);\n  return <p>{isEligible ? "Eligible" : "Not eligible"}</p>;\n}\n\nfunction ShoppingCart({ items, coupon }) {\n  const [total, setTotal] = useState(0);\n  useEffect(() => {\n    setTotal(items.reduce((sum, item) => sum + item.price * item.qty, 0));\n  }, [items]);\n  return <p className="total">Total: ₹{total}</p>;\n}\n\nexport default function App() {\n  return <EligibilityChecker age={17} />;\n}\n',
      solution: 'function EligibilityChecker({ age }) {\n  const isEligible = age >= 18;\n  return <p>{isEligible ? "Eligible" : "Not eligible"}</p>;\n}\n\nfunction ShoppingCart({ items, coupon }) {\n  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);\n  const total = coupon === "SAVE10" ? Math.round(subtotal * 0.9) : subtotal;\n  return <p className="total">Total: ₹{total}</p>;\n}\n\nexport default function App() {\n  return <EligibilityChecker age={17} />;\n}\n',
      checks: [
        { label: 'eligibility follows the prop', mistake: 'The effect has [] so it never re-runs when age changes. Compute isEligible = age >= 18 during render instead.', check: async ({ render, el, exposed }) => { const view = await render(el(exposed.EligibilityChecker, { age: 17 })); const a = view.text(); await view.rerender(el(exposed.EligibilityChecker, { age: 21 })); return (a === 'Not eligible' && view.text() === 'Eligible') || `got "${a}" then "${view.text()}"`; } },
        { label: 'cart total and coupon', mistake: 'Compute the total from items and coupon during render: 10% off for "SAVE10", rounded.', check: async ({ render, el, exposed }) => { const items = [{ price: 150, qty: 2 }, { price: 99, qty: 1 }]; const view = await render(el(exposed.ShoppingCart, { items, coupon: '' })); const plain = view.text('.total'); await view.rerender(el(exposed.ShoppingCart, { items, coupon: 'SAVE10' })); return (plain === 'Total: ₹399' && view.text('.total') === 'Total: ₹359') || `got "${plain}" and "${view.text('.total')}"`; } },
        { label: 'correct on the first render', mistake: 'With an effect, the first render shows the default 0 before the effect fixes it. Derived values need no state.', check: async ({ render, el, exposed }) => { let first = null; const Probe = () => { const out = exposed.ShoppingCart({ items: [{ price: 10, qty: 3 }], coupon: '' }); if (first === null) first = out; return out; }; await render(el(Probe)); const html = typeof first?.props?.children === 'object' ? [].concat(first.props.children).join('') : String(first?.props?.children ?? ''); return html.includes('30') || 'the first render did not contain the total'; } },
        { label: 'no effects or extra state', mistake: 'Neither component needs useState or useEffect.', check: ({ source }) => !/useEffect|useState/.test(source) },
      ],
    },
    {
      id: 'effects-quiz',
      title: 'Effects check',
      source: 'JavaScript & React course, Part 21 Knowledge Check',
      runner: 'quiz',
      teach: [
        { list: ['An effect synchronizes the component with something outside React, after render.', 'The dependency array lists every reactive value the effect reads.', 'Cleanup runs before the next run and on unmount.', 'Derived values and user actions are not effects.'] },
      ],
      example: [
        { code: 'useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);', lang: 'jsx' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'When does an effect with `[]` run?', options: ['After every render', 'Once, after the first render', 'Before the first render', 'Never'], answer: 1, explain: 'An empty array never changes, so after the first run it is always skipped.' },
        { q: 'The effect reads `query` but its array is `[]`. What happens when `query` changes?', options: ['It re-runs', 'Nothing: the effect keeps using the old query and the UI goes out of sync', 'React throws', 'It runs twice'], answer: 1, explain: 'Missing dependencies are real bugs, not lint noise.' },
        { q: 'When does a cleanup function run?', options: ['Only on unmount', 'Before the effect runs again, and on unmount', 'After every render', 'Only when an error happens'], answer: 1, explain: 'Both, so each run starts from a clean slate.' },
        { q: 'Why not write `useEffect(async () => {...})`?', options: ['async is slow', 'It returns a promise, but React expects nothing or a cleanup function', 'await is not allowed in React', 'It works fine'], answer: 1, explain: 'Define an async function inside the effect and call it.' },
        { q: 'Which belongs in an effect?', options: ['Filtering a list for display', 'Adding a resize listener to window', 'Computing a total from props', 'Submitting a form when the user clicks Submit'], answer: 1, explain: 'Window is outside React. The others are render calculations or event handlers.' },
        { q: 'What does this do?', code: 'useEffect(() => {\n  setCount(count + 1);\n});', options: ['Increments once', 'Loops forever', 'Never runs', 'Runs on unmount'], answer: 1, explain: 'No array: it runs after every render, and each run causes another render.' },
        { q: 'Where should a DELETE request triggered by a button go?', options: ['In useEffect with the item id as dependency', 'In the button\'s click handler', 'In the render body', 'In a cleanup function'], answer: 1, explain: 'It is a user action, not something to synchronize on every render.' },
      ],
    },
  ],
};
