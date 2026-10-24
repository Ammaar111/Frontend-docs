// HTML & CSS course, Parts 8–10: semantic structure, generic containers, entities.
export default {
  id: 'html-semantics',
  title: 'Semantic structure and special characters',
  lessons: [
    {
      id: 'html-semantic-layout',
      title: 'From div soup to a semantic page',
      source: 'HTML & CSS course, Parts 8–9',
      runner: 'html',
      teach: [
        '**Semantic HTML** picks elements for what content **is**. Screen readers cannot see class names: `<div class="nav">` is just another div, but `<nav>` is a **landmark** users can jump to. Search engines and future developers read the structure too. Visually, both can look identical.',
        { code: '┌──────────────── <header> ────────────────┐\n│  site title, <nav>                         │\n├──────────────── <main> ──────────────────┤\n│  <article> primary content │  <aside>      │\n├──────────────── <footer> ────────────────┤', lang: 'text' },
        { table: { head: ['Element', 'Meaning'], rows: [['`<header>`', 'introduction for the page **or** for an article/section (not `<head>`!)'], ['`<nav>`', 'a major block of navigation; several are fine, each with its own `aria-label`'], ['`<main>`', 'the page\'s unique content; exactly **one**, not inside header/footer/nav/article/aside'], ['`<article>`', 'makes sense on its own if syndicated: a post, a product card, a comment'], ['`<section>`', 'a thematic chapter with its own heading, not standalone'], ['`<aside>`', 'tangential: delete it and the main content still stands'], ['`<footer>`', 'closing content for the page or an article'], ['`<address>`', 'contact details for the article/page author, not any postal address'], ['`<time datetime>`', 'a machine-readable date/time behind human text']] } },
        { h: 'div and span are fine, as wrappers' },
        '`<div>` (block) and `<span>` (inline) carry **no meaning**: they are styling and scripting hooks. Use them when no meaningful element fits, e.g. a max-width wrapper or a grid container. The problem is **div soup**: divs where `<nav>`, `<a>`, `<button>` or `<ul>` should be. A `<div class="link">` is not focusable, not announced as a link and cannot be opened in a new tab.',
        { tip: 'Section or article? Would it make sense pasted somewhere else on its own → `<article>`. A titled chapter of this page → `<section>`. Purely for layout → `<div>`.' },
      ],
      example: [
        { code: '<article>\n  <header>\n    <h2>Why Semantic HTML Matters</h2>\n    <p>By Ammaar Khatri, <time datetime="2026-09-18">18 September 2026</time></p>\n  </header>\n  <section>\n    <h3>The Problem With Div Soup</h3>\n    <p>…</p>\n  </section>\n  <footer><p>Tagged: <a href="/tags/html">html</a></p></footer>\n</article>', lang: 'html' },
      ],
      task: [
        'Rewrite the div soup as a semantic page with the same content:',
        { ol: ['A page `<header>` with the site name `Dev Weekly` as the `<h1>` and a `<nav aria-label="Main navigation">` holding a list of real links: Home `/`, Archive `/archive`, About `/about`.', 'One `<main>` containing an `<article>` with its own `<header>` (an `<h2>` `Why Semantic HTML Matters` and a byline with `<time datetime="2026-09-18">`), two `<section>`s each with an `<h3>`, and an article `<footer>` with tag links.', 'In `<main>`, an `<aside aria-label="Related articles">` with an `<h2>` and a list of two links.', 'A page `<footer>` with an `<address>` containing a mailto link and a copyright line.', 'Keep the `<div class="wrapper">` around everything inside the body: a layout wrapper is a legitimate div.'] },
      ],
      starter: '<div class="wrapper">\n  <div class="top">\n    <div class="logo">Dev Weekly</div>\n    <div class="links">\n      <div class="link">Home</div>\n      <div class="link">Archive</div>\n      <div class="link">About</div>\n    </div>\n  </div>\n  <div class="body">\n    <div class="post">\n      <div class="post-heading">Why Semantic HTML Matters</div>\n      <div class="post-text">When every element is a generic div, structure disappears.</div>\n    </div>\n  </div>\n  <div class="bottom">© 2026 Dev Weekly</div>\n</div>\n',
      solution: '<div class="wrapper">\n  <header>\n    <h1>Dev Weekly</h1>\n    <nav aria-label="Main navigation">\n      <ul>\n        <li><a href="/">Home</a></li>\n        <li><a href="/archive">Archive</a></li>\n        <li><a href="/about">About</a></li>\n      </ul>\n    </nav>\n  </header>\n\n  <main>\n    <article>\n      <header>\n        <h2>Why Semantic HTML Matters</h2>\n        <p>By <a href="/authors/ammaar">Ammaar Khatri</a>, <time datetime="2026-09-18">18 September 2026</time></p>\n      </header>\n      <section>\n        <h3>The Problem With Div Soup</h3>\n        <p>When every element is a generic div, structure disappears.</p>\n      </section>\n      <section>\n        <h3>What Screen Readers Actually See</h3>\n        <p>Assistive technology relies on real semantics, not class names.</p>\n      </section>\n      <footer>\n        <p>Tagged: <a href="/tags/accessibility">accessibility</a>, <a href="/tags/html">html</a></p>\n      </footer>\n    </article>\n\n    <aside aria-label="Related articles">\n      <h2>Related Reading</h2>\n      <ul>\n        <li><a href="/articles/aria-basics">ARIA Basics Explained</a></li>\n        <li><a href="/articles/heading-hierarchy">Getting Heading Hierarchy Right</a></li>\n      </ul>\n    </aside>\n  </main>\n\n  <footer>\n    <address>Dev Weekly, contact: <a href="mailto:hello@devweekly.example">hello@devweekly.example</a></address>\n    <p>&copy; 2026 Dev Weekly. All rights reserved.</p>\n  </footer>\n</div>\n',
      checks: [
        { label: 'page header and navigation', mistake: 'A <header> with <h1>Dev Weekly</h1> and <nav aria-label="Main navigation"> with a list of real <a href> links.', check: ({ doc, h }) => { const header = [...doc.querySelectorAll('header')].find((x) => !x.closest('article, section, aside, main')); const links = [...(header?.querySelectorAll('nav[aria-label="Main navigation"] li > a[href]') ?? [])].map((a) => `${h.text(a)}→${a.getAttribute('href')}`); return (h.text(header?.querySelector('h1')) === 'Dev Weekly' && JSON.stringify(links) === '["Home→/","Archive→/archive","About→/about"]') || `header h1 "${h.text(header?.querySelector('h1'))}", nav links ${JSON.stringify(links)}`; } },
        { label: 'exactly one main, at the top level', mistake: 'One <main>, not nested inside header, footer, nav, article or aside.', check: ({ doc }) => { const mains = doc.querySelectorAll('main'); return (mains.length === 1 && !mains[0].parentElement.closest('header, footer, nav, article, aside, section')) || `${mains.length} <main> element(s)`; } },
        { label: 'the article', mistake: '<article> with its own <header> (h2 + <time datetime="2026-09-18">), two <section>s with <h3>, and a <footer>.', check: ({ doc, h }) => { const art = doc.querySelector('main article'); if (!art) return 'no <article> inside <main>'; const head = art.querySelector(':scope > header'); const sections = [...art.querySelectorAll(':scope > section')].map((s) => s.firstElementChild?.tagName); return (h.text(head?.querySelector('h2')) === 'Why Semantic HTML Matters' && head.querySelector('time')?.getAttribute('datetime') === '2026-09-18' && JSON.stringify(sections) === '["H3","H3"]' && art.querySelector(':scope > footer a[href]')) ? true : `article header ${head ? 'ok' : 'missing'}, sections ${JSON.stringify(sections)}`; } },
        { label: 'aside', mistake: '<aside aria-label="Related articles"> inside <main>, with an <h2> and two links.', check: ({ doc }) => { const aside = doc.querySelector('main aside[aria-label="Related articles"]'); return (aside?.querySelector('h2') && aside.querySelectorAll('li > a[href]').length === 2) ? true : 'check the related-articles aside'; } },
        { label: 'page footer', mistake: 'A page-level <footer> with <address> containing a mailto link, and the copyright.', check: ({ doc, h }) => { const footer = [...doc.querySelectorAll('footer')].find((f) => !f.closest('article, section, aside, main')); return (footer?.querySelector('address a[href^="mailto:"]') && h.text(footer).includes('©')) ? true : 'the page footer needs an <address> with a mailto link and ©'; } },
        { label: 'no fake links, wrapper kept', mistake: 'Replace div.link with real links; keep the div.wrapper.', check: ({ doc }) => (!doc.querySelector('.link, .logo, .post-heading') && doc.querySelector('body > div.wrapper')) ? true : 'leftover div-soup classes, or the wrapper is gone' },
      ],
    },
    {
      id: 'html-semantics-quiz',
      title: 'Semantics check',
      source: 'HTML & CSS course, Parts 8–9 knowledge checks',
      runner: 'quiz',
      teach: [
        'Landmarks let screen-reader users jump straight to "main", "navigation" or "complementary" content, the way sighted users glance at regions. Each landmark element maps to an ARIA role: `header` (page-level) → banner, `nav` → navigation, `main` → main, `aside` → complementary, `footer` (page-level) → contentinfo, `section` with an accessible name → region.',
      ],
      example: [
        { code: '<nav aria-label="Main navigation">…</nav>\n<nav aria-label="Footer">…</nav>   <!-- two navs, told apart by their labels -->', lang: 'html' },
      ],
      task: ['Answer every question.'],
      questions: [
        { q: 'The difference between `<head>` and `<header>`:', options: ['None', '<head> is invisible metadata; <header> is visible introductory content', '<header> must be inside <head>', '<head> is for headings'], answer: 1, explain: 'A common naming confusion.' },
        { q: 'A product card (image, name, price) listed on a shop page is best marked up as…', options: ['<section>', '<article>', '<aside>', '<main>'], answer: 1, explain: 'It makes sense on its own if moved elsewhere.' },
        { q: 'A "Pricing" chapter of a landing page with its own heading:', options: ['<article>', '<section>', '<nav>', '<div> always'], answer: 1, explain: 'A thematic part of this page, not standalone.' },
        { q: 'How many `<main>` elements per page?', options: ['Any number', 'Exactly one', 'One per article', 'Zero or more'], answer: 1, explain: 'It marks the single primary content region.' },
        { q: 'A wrapper used only to centre content with max-width should be…', options: ['<section>', '<main>', '<div>', '<article>'], answer: 2, explain: 'A purely presentational wrapper has no meaning to express.' },
        { q: 'Why is `<div class="link">Home</div>` worse than `<a href="/">Home</a>`?', options: ['It is slower', 'It is not focusable, not announced as a link, and has no native link behaviour', 'Divs cannot hold text', 'It is not'], answer: 1, explain: 'Keyboard, screen reader, open-in-new-tab, URL preview: all lost.' },
        { q: 'What does `<time datetime="2026-09-18">last Friday</time>` add?', options: ['Nothing', 'A machine-readable date behind the human-friendly text', 'Automatic translation', 'A calendar widget'], answer: 1, explain: 'Search engines and tools can parse the real date.' },
        { q: '`<span>` vs `<div>` by default:', options: ['Both block', 'span is inline, div is block', 'span is block, div is inline', 'Both inline'], answer: 1, explain: 'div stacks and takes full width; span flows in text.' },
        { q: 'Should a shipping address a customer typed into a form be in `<address>`?', options: ['Yes', 'No: <address> is contact info for the page or article author', 'Only in footers', 'Only with <time>'], answer: 1, explain: 'Arbitrary addresses are just data.' },
      ],
    },
    {
      id: 'html-entities',
      title: 'Entities, non-breaking spaces and Unicode',
      source: 'HTML & CSS course, Part 10',
      runner: 'html',
      teach: [
        'Some characters mean something to the parser: `<` starts a tag and `&` starts an entity. To show them as text, write **entities**: `&` + name + `;`.',
        { table: { head: ['Entity', 'Shows', 'Needed when'], rows: [['`&lt;`', '<', 'showing a less-than sign or tag-like text'], ['`&gt;`', '>', 'for symmetry and clarity'], ['`&amp;`', '&', 'a literal ampersand'], ['`&quot;`', '"', 'inside a double-quoted attribute'], ['`&apos;`', "'", 'inside a single-quoted attribute'], ['`&nbsp;`', 'a non-breaking space', 'keeping "10 km" or "Mr. Smith" on one line']] } },
        { code: '<!-- ❌ the parser sees the start of a tag -->\n<p>I love HTML <3</p>\n\n<!-- ✅ -->\n<p>I love HTML &lt;3</p>', lang: 'html' },
        { warn: '`&nbsp;&nbsp;&nbsp;` for indentation mixes content with presentation. Spacing is CSS (`margin`, `padding`); `&nbsp;` is only for preventing a line break at one specific space.' },
        'With `<meta charset="UTF-8">` you can type é, ₹, — and 🎉 directly. Entities are really only needed for the syntax characters. Named entities like `&copy;` © and `&mdash;` — still work and are fine to use.',
      ],
      example: [
        { code: '<p>To make a link, use the &lt;a&gt; tag with an &quot;href&quot; attribute.</p>\n<p>Ben &amp; Jerry\'s</p>\n<p>The race is 10&nbsp;km long.</p>', lang: 'html' },
      ],
      task: [
        { ol: ['A paragraph that displays exactly: `Use <strong> to add emphasis, not <b> & <i> for meaning.`', 'A paragraph that displays exactly: `5 < 10 and 10 > 5`', 'A paragraph `Dr. Kalam arrives at 10 AM.` where `Dr. Kalam` and `10 AM` can never be split across lines.', 'A button whose `title` attribute is exactly `Say "namaste"` (double quotes inside a double-quoted attribute).', 'A footer paragraph `© 2026 Toy Shop` using an entity or the character, and no runs of `&nbsp;` used as spacing anywhere.'] },
      ],
      starter: '<p>Use <strong> to add emphasis, not <b> & <i> for meaning.</p>\n<p>5 < 10 and 10 > 5</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;Dr. Kalam arrives at 10 AM.</p>\n',
      solution: '<p>Use &lt;strong&gt; to add emphasis, not &lt;b&gt; &amp; &lt;i&gt; for meaning.</p>\n<p>5 &lt; 10 and 10 &gt; 5</p>\n<p>Dr.&nbsp;Kalam arrives at 10&nbsp;AM.</p>\n<button type="button" title="Say &quot;namaste&quot;">Greet</button>\n<footer>\n  <p>&copy; 2026 Toy Shop</p>\n</footer>\n',
      checks: [
        { label: 'tags shown as text', mistake: 'Escape < > and & as &lt; &gt; &amp;.', check: ({ doc }) => { const p = doc.querySelectorAll('body > p')[0]; return (p?.textContent === 'Use <strong> to add emphasis, not <b> & <i> for meaning.' && p.children.length === 0) || `first paragraph shows "${p?.textContent}"`; } },
        { label: 'comparison operators', mistake: 'Write 5 &lt; 10 and 10 &gt; 5.', check: ({ doc }) => doc.querySelectorAll('body > p')[1]?.textContent === '5 < 10 and 10 > 5' || `second paragraph shows "${doc.querySelectorAll('body > p')[1]?.textContent}"` },
        { label: 'non-breaking where it matters', mistake: 'Dr.&nbsp;Kalam and 10&nbsp;AM; ordinary spaces elsewhere.', check: ({ doc }) => { const text = doc.querySelectorAll('body > p')[2]?.textContent ?? ''; return text === 'Dr. Kalam arrives at 10 AM.' || `third paragraph is ${JSON.stringify(text)}`; } },
        { label: 'quotes inside an attribute', mistake: 'title="Say &quot;namaste&quot;".', check: ({ doc }) => doc.querySelector('button')?.getAttribute('title') === 'Say "namaste"' || `title is ${JSON.stringify(doc.querySelector('button')?.getAttribute('title'))}` },
        { label: 'copyright and no spacing hacks', mistake: '© via &copy; or the character; never several &nbsp; in a row for spacing.', check: ({ doc, source }) => (doc.querySelector('footer p')?.textContent === '© 2026 Toy Shop' && !/(&nbsp;\s*){2,}/.test(source)) || 'check the copyright line, and remove runs of &nbsp;' },
      ],
    },
  ],
};
