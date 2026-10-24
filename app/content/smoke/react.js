export default {
  id: 'smoke-react',
  title: 'Smoke',
  lessons: [
    {
      id: 'smoke-react-counter',
      title: 'Smoke React',
      source: 'test',
      runner: 'react',
      teach: ['x'], example: ['x'], task: ['x'],
      starter: 'export default function App() {\n  return <p>hi</p>;\n}\n',
      solution: 'import { useState, useEffect } from "react";\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  const [name, setName] = useState("");\n  useEffect(() => { document.title = `Count ${count}`; }, [count]);\n  return (\n    <div>\n      <button onClick={() => setCount((c) => c + 1)}>Clicked {count}</button>\n      <input aria-label="name" value={name} onChange={(e) => setName(e.target.value)} />\n      <p>Hello {name}</p>\n    </div>\n  );\n}\n',
      checks: [
        { label: 'click', mistake: 'c', check: async ({ click, text }) => { await click('button'); await click('button'); return text('button') === 'Clicked 2' || text('button'); } },
        { label: 'type', mistake: 't', check: async ({ type, text }) => { await type('input', 'Ammaar'); return text('p') === 'Hello Ammaar' || text('p'); } },
        { label: 'effect', mistake: 'e', check: async ({ click, document }) => { await click('button'); return document.title === 'Count 1' || document.title; } },
      ],
    },
    {
      id: 'smoke-react-router',
      title: 'Smoke Router',
      source: 'test',
      runner: 'react',
      teach: ['x'], example: ['x'], task: ['x'],
      starter: '',
      solution: 'import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";\n\nfunction Product() { const { id } = useParams(); return <h1>Product {id}</h1>; }\n\nexport default function App() {\n  return (\n    <BrowserRouter>\n      <nav><Link to="/about">About</Link></nav>\n      <Routes>\n        <Route path="/" element={<h1>Home</h1>} />\n        <Route path="/about" element={<h1>About us</h1>} />\n        <Route path="/products/:id" element={<Product />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n',
      checks: [
        { label: 'home', mistake: 'h', check: ({ text }) => text('h1') === 'Home' },
        { label: 'link', mistake: 'l', check: async ({ click, text }) => { await click('a'); return text('h1') === 'About us' || text('h1'); } },
        { label: 'param', mistake: 'p', check: async ({ render, el, App }) => { const v = await render(el(App), { path: '/products/42' }); return v.text('h1') === 'Product 42' || v.text('h1'); } },
      ],
    },
  ],
};
