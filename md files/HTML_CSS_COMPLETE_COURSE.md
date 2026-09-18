# The Complete HTML & CSS Course

### From Zero to Production-Ready Frontend Developer

---

## How to use this book

This is not a skim-and-forget reference. It is a full course: read sections in order the first time through, type out the examples yourself (don't copy-paste — your fingers learn syntax that your eyes skip over), and actually attempt every exercise before opening the solution. Solutions are hidden behind `<details>` blocks specifically so you're not tempted to peek early.

Legend used throughout this book:

> 💡 **Tip** — a piece of practical advice that will save you time.

> ⚠️ **Common mistake** — something almost everyone gets wrong at least once.

> ✅ **Checkpoint** — a moment to stop and verify you actually understand what was just taught, before moving on.

> ♿ **Accessibility note** — something that affects users with disabilities, or users relying on assistive technology.

> 📱 **Responsive design note** — something that affects how a page behaves across screen sizes and devices.

---

# PART 0 — How Web Pages Actually Work

Before touching a single tag, you need a correct mental model of what happens between you typing a URL and a page appearing on your screen. Skipping this is why many self-taught developers can write HTML and CSS but can't reason about *why* something isn't working — they're missing the machine underneath the syntax.

## Website vs. webpage vs. web application

These three terms get used interchangeably in casual speech, but precision matters:

- A **webpage** is a single document — one URL, one HTML file (conceptually), like `https://example.com/about`.
- A **website** is a collection of related webpages, usually under one domain, linked together — `example.com` as a whole, including `/about`, `/contact`, `/blog/post-1`, etc.
- A **web application** is a website where the primary purpose is *interactivity and state* rather than *reading content*. Gmail, Google Docs, and Figma are web applications. A blog or a company's marketing site is a website. The line is blurry in practice (a blog with a comment system has some "app" behavior), but the distinction matters because it changes your priorities: a webpage optimizes for fast content delivery and readability; a web app optimizes for interaction and persisted state.

You are learning the tools (HTML and CSS) that underpin *all three*. HTML and CSS are not "for websites, not apps" — they are the structural and visual layer of literally every interface that runs in a browser, no matter how app-like.

## Frontend vs. backend

- **Frontend** — everything that runs in the user's browser: the HTML structure, the CSS styling, and (later, outside this course) the JavaScript behavior. The frontend is what the user directly sees and touches.
- **Backend** — everything that runs on a server the user never directly interacts with: databases, business logic, authentication, APIs. The backend's job is to receive requests and return data (or full HTML pages, in some architectures).

This course is 100% frontend — specifically the *structure* (HTML) and *presentation* (CSS) layers, without the *behavior* (JavaScript) layer. That's a deliberate scope: HTML and CSS are deep enough disciplines on their own that trying to learn all three at once is how most beginners end up shaky in all three instead of solid in one.

## Browser and server

- The **browser** (Chrome, Firefox, Safari, Edge) is a program on your computer or phone whose job is to: request documents, parse them, and render them visually. It is also, itself, a hugely complex piece of software — the "browser engine" is doing enormous amounts of work you'll start to understand by the end of this Part.
- The **server** is a computer (or, more accurately today, a program running on some computer somewhere, possibly one of thousands behind a load balancer) whose job is to receive requests and send back responses — usually HTML, CSS, JavaScript, images, or data.

## HTTP, URLs, and domains — the absolute basics

When you type `https://example.com/products/shoes` into a browser and press Enter, roughly this happens:

```text
1. Browser looks up "example.com" → converts it to an IP address (DNS)
2. Browser opens a connection to that IP address
3. Browser sends an HTTP request:
       GET /products/shoes HTTP/1.1
       Host: example.com
4. Server receives the request, decides what to send back
5. Server sends an HTTP response:
       HTTP/1.1 200 OK
       Content-Type: text/html

       <!DOCTYPE html>
       <html>...</html>
6. Browser receives the HTML and starts building the page
```

Breaking down the URL itself:

```text
https://example.com:443/products/shoes?color=red#reviews
└─┬─┘   └────┬─────┘└┬┘└──────┬──────┘└────┬────┘└──┬──┘
  │          │        │        │            │        │
scheme    domain    port      path        query   fragment
(protocol) (host)  (usually  (which      (extra    (jump to
                    hidden)  resource)   params)   a section
                                                    in the page)
```

- **Scheme/protocol**: `https` (secure) or `http` (unencrypted — avoid in production). This tells the browser *how* to talk to the server.
- **Domain**: the human-readable address of the server, e.g. `example.com`. Behind the scenes DNS translates this into an IP address like `93.184.216.34`.
- **Port**: which "door" on the server to connect to. `443` is the default for HTTPS and `80` for HTTP, so you almost never see them written explicitly.
- **Path**: which specific resource on the server you want.
- **Query string**: extra key-value parameters, often used for filtering, searching, or pagination.
- **Fragment**: a client-side-only instruction (never sent to the server) usually used to scroll to an element with a matching `id`.

**HTTP methods** you'll encounter conceptually (especially once you reach the Forms section): `GET` (retrieve a resource, safe to repeat, parameters go in the URL) and `POST` (submit data, often changes server state, parameters go in the request body, not the URL). We cover this properly in Part 7.

## What HTML, CSS, and JavaScript each actually do

This is the single most important conceptual split in frontend development:

| Layer | Job | Analogy |
|---|---|---|
| **HTML** | *Structure and meaning*. What is this content? A heading? A paragraph? A button? A list? | The skeleton and organs of a body — what each part *is* |
| **CSS** | *Presentation*. How should it look? Colors, spacing, layout, fonts, animation. | The skin, clothing, and posture — how the body *appears* |
| **JavaScript** | *Behavior*. What happens when the user interacts? Click handlers, dynamic updates, API calls. | The nervous system and muscles — how the body *reacts and moves* |

> 💡 **Tip** — A huge amount of "bad frontend code" comes from blurring these responsibilities: using a `<div>` styled to look like a button instead of an actual `<button>` (blurring structure and presentation), or using JavaScript to fake something CSS could do natively like a hover effect (blurring behavior and presentation). Keeping these three layers doing their own job is what "clean frontend code" actually means in practice — it's not about indentation style, it's about *separation of concerns*.

## Rendering: what the browser does with your HTML and CSS

This is the pipeline every browser runs, conceptually, every time it shows you a page:

```text
HTML  ──parse──▶  DOM
                          \
                           ▶  Render Tree  ──▶  Layout  ──▶  Paint  ──▶  Composite
                          /
CSS   ──parse──▶  CSSOM
```

Let's unpack every stage, because this single diagram explains an enormous number of "why is my CSS not working" bugs later in the course.

**1. Parsing HTML into the DOM (Document Object Model).**
The browser reads your HTML text top to bottom and builds a tree of objects in memory. Every element becomes a *node*. `<body>` contains `<header>`, which contains `<h1>`, and so on. This tree — not your raw HTML text — is what the browser actually works with from here on. It's also what JavaScript manipulates, and what your browser's DevTools "Elements" panel shows you.

```text
<body>
  <header>
    <h1>My Page</h1>
  </header>
  <main>
    <p>Hello</p>
  </main>
</body>
```

becomes, as a tree:

```text
body
├── header
│   └── h1
│       └── "My Page" (text node)
└── main
    └── p
        └── "Hello" (text node)
```

**2. Parsing CSS into the CSSOM (CSS Object Model).**
Similarly, the browser reads all your CSS (from `<style>` tags, external stylesheets, and inline `style` attributes) and builds a tree of style rules and their computed relationships — including things like inheritance and the cascade, which you'll learn formally in Part 15.

**3. Combining DOM + CSSOM into the Render Tree.**
The browser merges these two trees into a single **render tree**: for every DOM node that will actually be *visible*, attach its final, computed styles. Nodes with `display: none` are excluded entirely from the render tree at this stage — they get no box at all (more on this critical distinction in Part 19).

**4. Layout (also called "reflow").**
Now the browser calculates the actual *geometry*: the exact pixel position and size of every box on the render tree, given the viewport size. This is where the box model, Flexbox algorithm, Grid algorithm, and positioning rules you'll learn in Parts 18–25 are actually executed by the browser engine.

**5. Paint.**
The browser fills in actual pixels: colors, text, borders, shadows, images — for every box, based on the layout geometry just computed.

**6. Composite.**
Modern browsers don't paint everything into one single image. Certain elements (those using `transform`, `opacity`, fixed/sticky positioning, and a few other triggers) get painted onto separate *layers*, which the GPU then combines ("composites") together. This is why, as you'll see in Part 30–32 and Part 48, animating `transform` and `opacity` is dramatically cheaper than animating `width` or `top` — the former can often skip Layout and Paint entirely and go straight to a cheap GPU composite step.

### Why this pipeline matters for you, practically

- Changing something that affects **layout** (width, height, margin, position, adding/removing an element) forces the browser to redo Layout → Paint → Composite for potentially large parts of the page. This is expensive.
- Changing something that only affects **paint** (background-color, box-shadow, visibility) skips Layout but still requires a repaint.
- Changing something that's **composite-only** (transform, opacity on a layered element) is the cheapest possible change — no Layout, no Paint, just a GPU recombination.

You don't need to memorize this yet — it becomes concretely useful in Part 30 (Transitions), Part 32 (Animations), and Part 48 (Performance). For now, just hold onto the shape of the pipeline: **HTML → DOM, CSS → CSSOM, DOM+CSSOM → Render Tree → Layout → Paint → Composite.**

## Developer Tools — your most important tool in this entire course

Every modern browser ships with **Developer Tools** (DevTools), usually opened with `F12` or `Ctrl+Shift+I` / `Cmd+Option+I`. You will live in this tool for your entire frontend career. The essentials, which we'll use constantly starting in Part 1:

- **Elements / Inspector panel** — shows you the live DOM tree, lets you click any element on the page and see (and edit, temporarily) its HTML and CSS.
- **Styles pane** — for a selected element, shows every CSS rule affecting it, in cascade order, with rules that got overridden shown with strikethrough. This is the single most important debugging view in this entire course, and we'll return to it constantly.
- **Computed panel** — shows the final, resolved value of every CSS property for the selected element, after the cascade has been resolved.
- **Console** — shows errors, warnings, and lets you run JavaScript (not the focus here, but useful for later).

> ✅ **Checkpoint** — Open your browser's DevTools right now, on any website, and click around the Elements panel. Click a few different elements and watch the Styles pane change. You don't need to understand what you're seeing yet — just get comfortable with the *muscle memory* of opening DevTools and clicking an element to inspect it. You'll be doing this hundreds of times over this course.

## Knowledge Check — Part 0

1. What's the difference between a webpage, a website, and a web application?
2. What job does HTML do that CSS does not, and vice versa?
3. In the URL `https://shop.example.com:443/items?sort=price#reviews`, identify the scheme, domain, port, path, query string, and fragment.
4. What is the DOM, and what turns HTML into a DOM?
5. What is the CSSOM?
6. Put these rendering stages in the correct order: Paint, Layout, Composite, Render Tree.
7. Why is animating `transform` generally cheaper for the browser than animating `width`?
8. What does `display: none` do to an element's presence in the render tree?
9. Name two panels in browser DevTools and what each is used for.
10. Why does mixing structure, presentation, and behavior into one layer (e.g., a clickable `<div>` styled like a button) tend to cause problems later?

<details>
<summary>View solutions</summary>

1. A webpage is a single document/URL. A website is a collection of related webpages under one domain. A web application is a website whose primary purpose is interactivity/state rather than reading content (though the line is blurry).
2. HTML defines *structure and meaning* — what each piece of content is. CSS defines *presentation* — how it looks. Neither one does the other's job; blending them (e.g., using a heading tag purely because it looks big) causes accessibility and maintainability problems.
3. Scheme: `https`. Domain: `shop.example.com`. Port: `443`. Path: `/items`. Query string: `sort=price`. Fragment: `reviews`.
4. The DOM (Document Object Model) is the browser's in-memory tree representation of your HTML document. The browser's HTML parser builds it by reading your HTML text.
5. The CSSOM (CSS Object Model) is the browser's in-memory tree representation of all CSS rules and their relationships (cascade, inheritance), built by parsing all CSS sources.
6. Render Tree → Layout → Paint → Composite.
7. Because `transform` (and `opacity`) can often be handled entirely on a separate GPU-composited layer, skipping the expensive Layout and Paint stages, whereas `width` changes force the browser to recalculate geometry for the element and potentially its neighbors (Layout), then repaint (Paint), then recomposite.
8. It removes the element from the render tree entirely — it gets no box, takes up no space, and is not painted at all. (Compare to `visibility: hidden`, covered in Part 19, which still takes up space.)
9. Elements/Inspector panel (view/edit live DOM and CSS), Styles pane (see all CSS rules affecting a selected element in cascade order), Computed panel (see final resolved property values), Console (errors, warnings, run JS) — any two of these with a correct description is a full answer.
10. It blurs the separation of concerns: a `<div>` styled as a button doesn't automatically get keyboard focusability, Enter/Space activation, or the correct accessible role that a real `<button>` gets for free — so you end up manually re-implementing behavior the browser already gives you, and often getting it subtly wrong (this is explored fully in Part 12).

</details>

---

# PART 1 — HTML From Absolute Beginner Level

## What HTML is

**HTML** stands for **HyperText Markup Language**. Let's unpack that name, because it's actually descriptive:

- **HyperText** — text that contains links to other text (originally, that's *all* the web was: documents linking to other documents).
- **Markup** — HTML doesn't "do" anything computationally; it *marks up* content by wrapping it in tags that describe what that content *is*. You are not writing a program; you are annotating content.
- **Language** — it has rules (syntax) that both you and the browser must follow for it to be understood correctly.

### What it is

HTML is a **markup language**, not a programming language. It has no variables, no loops, no functions, no logic. What it has is a fixed vocabulary of **elements** — `<p>` for a paragraph, `<h1>` for a top-level heading, `<img>` for an image — that you use to describe the *meaning and structure* of your content. The browser then reads that structure and (with the help of default and author-provided CSS) decides how to display it.

### Why it exists

Before any kind of formal markup, sharing formatted documents across different computers, operating systems, and software was chaotic — a document formatted in one word processor often looked wrong or broke entirely when opened in another. HTML was designed to be:

- **Plain text** — readable and writable by any machine, no proprietary format.
- **Structural, not visual, by default** — a `<h1>` just means "the most important heading here"; what it *looks like* is left to the browser's defaults or to CSS, which is a separate concern.
- **Forgiving** — browsers try hard to render even malformed HTML rather than refusing outright, though (as you'll see later) relying on that forgiveness is a bad habit.
- **Linkable** — the entire point of the *web* is that documents reference other documents via hyperlinks.

## Tags, elements, and attributes — the core vocabulary

These three words get used loosely by beginners, but they mean specific, different things:

```text
    ┌── opening tag        content        closing tag ──┐
    │                                                     │
  <p                class="intro">Hello, world!        </p>
    │       │                │
    │       └── attribute value
    └── attribute name
```

- A **tag** is the literal markup syntax: `<p>` is an opening tag, `</p>` is a closing tag.
- An **element** is the tag(s) *plus* everything between them (including nested elements and text). `<p>Hello, world!</p>` — the whole thing — is "the paragraph element."
- An **attribute** is extra information attached to the *opening* tag, in `name="value"` form, that modifies or describes the element. `class="intro"` is an attribute; `class` is the attribute name, `"intro"` is the attribute value.

### Opening tags, closing tags, and self-closing (void) elements

Most HTML elements have both an opening and closing tag, with content between:

```html
<p>This is a paragraph.</p>
```

Some elements can never have content between an opening and closing tag, because by definition they represent a single, self-contained thing — an image, a line break, a horizontal rule. These are called **void elements**, and they have *no closing tag at all*:

```html
<img src="cat.jpg" alt="A sleeping cat">
<br>
<hr>
<input type="text">
<meta charset="UTF-8">
```

> ⚠️ **Common mistake** — Beginners often write `<img src="cat.jpg"></img>` because it "feels" more consistent. This is invalid HTML. Void elements never get a closing tag. In older XHTML-style HTML you'll sometimes see a trailing slash like `<img src="cat.jpg" />` — this is allowed and harmless in HTML5, but it's a stylistic leftover, not a requirement; the browser treats `<img src="cat.jpg">` and `<img src="cat.jpg" />` identically.

The full list of void elements you'll use regularly: `<area>`, `<base>`, `<br>`, `<col>`, `<embed>`, `<hr>`, `<img>`, `<input>`, `<link>`, `<meta>`, `<source>`, `<track>`, `<wbr>`.

## Nesting and indentation

Elements can contain other elements — this is called **nesting**, and it's how you build any non-trivial structure:

```html
<article>
  <h2>Article Title</h2>
  <p>Some text with <strong>bold emphasis</strong> inside it.</p>
</article>
```

The critical rule: **nested elements must close in the reverse order they opened**, like matching parentheses. This is called *proper nesting*.

```html
<!-- ✅ Correct: strong opens last, closes first -->
<p>Some <strong>bold text</strong> here.</p>

<!-- ❌ Wrong: tags overlap/cross each other -->
<p>Some <strong>bold text</p></strong>
```

Think of tags like nested boxes, or like parentheses in math: `(a(b)c)` is valid, `(a(b)c))(` is not. HTML enforces the same discipline.

**Indentation** is not required by HTML at all — the browser does not care about whitespace, line breaks, or indentation in your source code (with a few text-content exceptions covered later). Indentation exists entirely for *humans* — to make nesting visually obvious when reading the source. The convention almost everyone follows: each level of nesting gets 2 (sometimes 4) extra spaces of indentation.

```html
<!-- Both of these render identically — indentation is purely for readability -->
<div><p><strong>Hi</strong></p></div>

<div>
  <p>
    <strong>Hi</strong>
  </p>
</div>
```

> 💡 **Tip** — Always indent consistently from the start. It costs nothing while you're writing, and it's what makes nesting mistakes visually obvious later (a closing tag at the wrong indentation level is often a bug in disguise).

## Comments

HTML comments are ignored entirely by the browser — they're notes for humans reading the source:

```html
<!-- This is a comment and will not be displayed -->
<p>This will be displayed.</p>

<!--
  Multi-line comments
  work exactly the same way.
-->
```

> ⚠️ **Common mistake** — You cannot nest HTML comments (`<!-- outer <!-- inner --> outer -->` breaks, because the parser closes the comment at the *first* `-->` it finds). If you need to "comment out" a block of HTML that already contains a comment, remove the inner comment first.

## The minimal HTML document, explained line by line

Every HTML page you write in this course (and in your career) will start from this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>

</body>
</html>
```

Let's go through every single line — nothing skipped, nothing assumed:

### `<!DOCTYPE html>`

This is not technically an HTML tag — it's a **document type declaration**. Its entire job is to tell the browser: "render this page using the modern HTML5 standards-compliant rendering mode," as opposed to **"quirks mode,"** a legacy compatibility mode browsers use to render old, pre-standards-era pages the way browsers used to (inconsistently) 25 years ago.

Without a correct `<!DOCTYPE html>` at the very top, browsers can silently fall back to quirks mode, which changes how box model calculations, some CSS properties, and even certain layout behaviors work — inconsistently across browsers. This is a class of bug that's *miserable* to diagnose because your CSS looks "right" but behaves wrong for reasons that have nothing to do with your CSS. Always include it, always as the very first line, always exactly as written above (it's case-insensitive, but lowercase is the near-universal convention).

### `<html lang="en">`

The `<html>` element is the **root element** — literally the single outermost container of the entire document. Everything else in your page lives inside it.

The `lang` attribute declares the primary human language of the page's content, using a standard language code (`en` for English, `fr` for French, `hi` for Hindi, `es` for Spanish, etc. — these follow the BCP 47 standard, which also supports regional variants like `en-US` or `en-GB`).

> ♿ **Accessibility note** — `lang` is not decorative. Screen readers use it to select the correct pronunciation engine and voice. Without it (or with a wrong value), a screen reader may read English content using a different language's phonetic rules, making it unintelligible. Browsers also use `lang` for spell-checking and translation features. This single attribute, often skipped by beginners, has a real, measurable accessibility impact — always set it correctly.

### `<head>` and `<body>`

The document splits into exactly two major sections:

- **`<head>`** — metadata *about* the page: its title, character encoding, linked stylesheets, scripts, SEO tags, favicon. Nothing inside `<head>` is directly displayed as visible page content (with rare, specific exceptions like `<title>` showing in the browser tab).
- **`<body>`** — the actual visible content of the page: everything the user reads, sees, and interacts with.

```text
<html>
 ├── <head>   → invisible metadata (title, charset, links to CSS, SEO tags)
 └── <body>   → everything the user actually sees on screen
```

### `<meta charset="UTF-8">`

This declares the **character encoding** of the document — how the raw bytes of the file should be interpreted as text characters. **UTF-8** is the modern, near-universal standard, capable of representing virtually every character and symbol in every human language, plus emoji. Without a correct charset declaration, special characters (accented letters, currency symbols, emoji, non-Latin scripts) can render as garbled text (sometimes called "mojibake") — you may have seen pages online with `Ã©` where `é` should be; that's a charset mismatch.

This should always be the *first* thing inside `<head>` (before `<title>` and everything else), because the browser needs to know the encoding before it can correctly parse any text that follows, including the title itself.

### `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

This is arguably the single most important line for anyone building responsive websites (which, in the modern web, is everyone). Here's the problem it solves:

Mobile browsers, historically, assumed webpages were designed for a **desktop-width layout** (typically ~980px wide) and would render the entire page at that width, then zoom the whole thing out to fit the phone's screen — resulting in tiny, unreadable text that the user had to pinch-zoom to read.

The viewport meta tag overrides this behavior:

- `width=device-width` — tells the browser: "the page's layout width should match the actual physical width of the device's screen" (in CSS pixels, not raw hardware pixels — more on that distinction in Part 17), instead of the old ~980px assumption.
- `initial-scale=1.0` — sets the initial zoom level to 100% (no zoom) when the page first loads.

```html
<!-- Without this tag, your responsive CSS media queries essentially don't work on mobile —
     the browser has already zoomed out the whole 980px-wide layout before your CSS
     breakpoints even get a chance to apply. -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

> 📱 **Responsive design note** — Every single page you build from this point forward, for the rest of this course (and your career), must include this line. It is not optional for responsive design; it is the foundation responsive design is built on. We'll return to the viewport concept in full depth in Part 26.

### `<title>My Page</title>`

Sets the text shown in the browser tab, in bookmarks, and (importantly) as the default clickable headline in search engine results. Every page needs a unique, descriptive title — "Home" or "Untitled Document" tells the user and search engines nothing. We'll cover title-writing best practices properly in Part 11 (Metadata & SEO).

### ✅ Checkpoint

Before moving on, make sure you can answer, without looking back: What does the DOCTYPE actually do? Why does `<meta charset="UTF-8">` need to come before other `<head>` content? What's the practical difference between what lives in `<head>` versus `<body>`?

## Your first real HTML file

Let's put this all together into a complete, valid document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ammaar's First Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my very first HTML page.</p>
</body>
</html>
```

Save this as `index.html` and open it in any browser — no server, no build tools, no dependencies required. This is one of HTML's great strengths: it's directly runnable, everywhere, with zero setup.

## Exercises — Part 1

1. From memory (don't copy the example above), write a complete, valid minimal HTML document with the title "My Practice Page" and a single paragraph inside the body that says "Learning HTML."
2. Explain in your own words, in one or two sentences each: what quirks mode is, and why the DOCTYPE prevents it.
3. Fix this broken nesting:
   ```html
   <p>This is <strong>very <em>important</strong> text</em>.</p>
   ```
4. Is this valid HTML? If not, identify every problem.
   ```html
   <html>
   <head>
   <title>Test</head>
   </title>
   <body>
   <p>Hello</p>
   </body>
   ```

<details>
<summary>View solutions</summary>

**1.**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Practice Page</title>
</head>
<body>
  <p>Learning HTML.</p>
</body>
</html>
```

**2.** Quirks mode is a legacy rendering mode browsers fall back to when there's no valid DOCTYPE, which reproduces inconsistent, non-standard rendering behaviors from browsers circa the late 1990s (particularly around box model calculations). A correct `<!DOCTYPE html>` as the very first line of the document forces the browser into standards mode instead, giving you consistent, spec-compliant rendering across all modern browsers.

**3.** The `<strong>` and `<em>` tags cross each other — `<em>` opens inside `<strong>` but `<strong>` closes before `<em>` does. Fixed:
```html
<p>This is <strong>very <em>important</em></strong><em> text</em>.</p>
```
A cleaner equivalent, restructuring which word ranges get which emphasis:
```html
<p>This is <strong>very <em>important</em> text</strong>.</p>
```
(Either fix is acceptable as long as tags close in the reverse order they open — the important lesson is no overlapping tags.)

**4.** No, it has two problems: (1) missing `<!DOCTYPE html>` at the top, and (2) `</head>` is misplaced — it appears *before* `</title>`, meaning `<title>` never properly closes inside `<head>`, and `</title>` ends up appearing after `</head>` has already closed the head section. Corrected:
```html
<!DOCTYPE html>
<html>
<head>
<title>Test</title>
</head>
<body>
<p>Hello</p>
</body>
</html>
```

</details>

---

# PART 2 — Text Content

Text is the substance of almost every webpage, and HTML gives you a specific vocabulary of elements to describe *what kind* of text something is — not what it should look like. This distinction (semantic meaning vs. visual appearance) is one of the most important ideas in this entire course, and it starts right here with something as basic as headings.

## Headings: `<h1>` through `<h6>`

### What it is

Six levels of heading elements, `<h1>` (most important / highest level) through `<h6>` (least important / deepest level), used to mark section titles and create a hierarchical outline of your document.

### Why it exists

Before HTML, a "heading" in a document was just "text that's big and bold." HTML headings instead express *importance and hierarchy* — a `<h1>` isn't "big text," it's "the single most important heading on this page," typically the page or article title. A `<h3>` nested under a `<h2>` says "this is a subsection of that section."

### Syntax

```html
<h1>Page Title</h1>
<h2>Major Section</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
<h5>Rarely needed</h5>
<h6>Very rarely needed</h6>
```

### Mental model

Think of headings as the **table of contents** of your document, expressed inline. If you stripped away every other tag and kept only the headings, in order, you should get a sensible outline of the page — like a book's chapter/section/subsection structure.

```text
h1 My Page
├── h2 Introduction
├── h2 Main Content
│   ├── h3 First Point
│   └── h3 Second Point
│       └── h4 A Detail Within the Second Point
└── h2 Conclusion
```

### Practical example

```html
<h1>The Complete Guide to Houseplants</h1>

<h2>Choosing the Right Plant</h2>
<p>Consider your light conditions before buying...</p>

<h3>Low-Light Plants</h3>
<p>Snake plants and pothos tolerate low light well...</p>

<h3>High-Light Plants</h3>
<p>Succulents and cacti need direct sun...</p>

<h2>Watering Basics</h2>
<p>Overwatering kills more houseplants than underwatering...</p>
```

### Why using headings only for size is bad

> ⚠️ **Common mistake** — Beginners often pick a heading level based purely on how big or bold they want text to look — e.g., using `<h3>` somewhere just because "it's the right size," skipping `<h1>` and `<h2>` entirely, or using multiple `<h1>`s scattered arbitrarily through a page.

This is wrong for two concrete, serious reasons:

1. **Accessibility.** Screen reader users very commonly navigate a page by jumping between headings (many screen readers have a dedicated keyboard shortcut for "next heading"). If your heading levels don't form a logical, consistent hierarchy, that navigation becomes confusing or actively broken — a user jumping from an `<h2>` straight to an `<h5>`, skipping levels, doesn't know if they've skipped an entire section or not.
2. **Structure and SEO.** Search engines and browser "reading mode" / outline features rely on heading structure to understand what your page is *about* and how it's organized. Visual-only heading choices break this.

If you want text to *look* like a heading (big, bold) without it *being* semantically a heading in the document outline, that's what CSS is for — style a `<p>` or a `<span>` to look however you want. Never choose a heading level for its default visual size.

### Common mistakes

```html
<!-- ❌ Wrong: skipping from h1 straight to h4 for no structural reason -->
<h1>Article Title</h1>
<h4>A subsection</h4>

<!-- ❌ Wrong: multiple h1s used as if they were just "big text," no real hierarchy -->
<h1>Welcome</h1>
<h1>About Us</h1>
<h1>Contact</h1>

<!-- ✅ Correct: one h1 per page (usually), levels used in logical descending order -->
<h1>Company Name</h1>
<h2>About Us</h2>
<h2>Contact</h2>
```

> 💡 **Tip** — A practical rule of thumb: one `<h1>` per page, representing the page's main topic. Then use `<h2>` for major sections, `<h3>` for subsections within those, and so on — never skip a level going *down* (h2 → h4 is wrong), though jumping back *up* (from an h3 back to a new h2 for the next section) is completely normal.

## Paragraphs: `<p>`

The workhorse text container — a single block of related text, like a paragraph in any written document.

```html
<p>This is one paragraph. It can contain several sentences, and even
inline elements like <strong>bold text</strong>, but it represents
one continuous block of prose.</p>

<p>This is a second, separate paragraph.</p>
```

> ⚠️ **Common mistake** — Never nest a `<p>` inside another `<p>`, and never put block-level structural elements (like `<div>`, `<h1>`, another `<p>`) inside a `<p>` — paragraphs are meant to contain only text-level (inline) content. The browser will often "fix" this invalid nesting silently by closing the outer `<p>` early, producing a DOM structure that doesn't match what you wrote — a confusing bug to debug later.

## Semantic emphasis: `<strong>` vs. `<b>`, `<em>` vs. `<i>`

This is one of the most misunderstood pairs of distinctions in HTML, and it's a favorite interview question (see the Interview Questions section later in this course), so let's be exact.

### `<strong>` — strong importance

```html
<p><strong>Warning:</strong> this action cannot be undone.</p>
```

`<strong>` means "this text carries strong importance, seriousness, or urgency." Browsers render it bold by default, but *that's incidental* — the meaning is importance, not boldness. A screen reader may (depending on configuration) audibly change tone or emphasis when reading `<strong>` content, because it's conveying *semantic* importance, not just visual styling.

### `<b>` — stylistically offset text, no extra importance

```html
<p>The recipe calls for <b>cumin</b> and <b>coriander</b>.</p>
```

`<b>` means "text that is stylistically different or offset from the surrounding text for conventional/practical reasons, without conveying extra importance" — think keywords in a recipe, product names in a review, or the bold lead-in words of an article, where bold is a typographic convention, not an indicator of urgency. Browsers also render `<b>` bold by default, but it carries no semantic weight for assistive technology.

### `<em>` — emphatic stress

```html
<p>I <em>did</em> lock the door, I promise.</p>
```

`<em>` means "stress emphasis that changes the meaning of the sentence if you read it aloud with vocal stress on that word." Say that sentence out loud, stressing "did" — you can hear how the meaning shifts (it becomes a rebuttal). Browsers render it italic by default; screen readers may change intonation when reading it.

### `<i>` — alternate voice or mood, technical terms, foreign words

```html
<p>The ship's name was <i>Santa Maria</i>.</p>
<p>He had a certain <i>je ne sais quoi</i>.</p>
<p>The <i>Tyrannosaurus rex</i> was a large predator.</p>
```

`<i>` means "text in an alternate voice or mood" — ship/book/movie titles, foreign-language phrases, taxonomic (scientific) names, technical terms being introduced. Rendered italic by default, but again — no semantic importance is implied.

### The decision table

| | Conveys importance/emphasis | No special importance |
|---|---|---|
| **Bold rendering** | `<strong>` | `<b>` |
| **Italic rendering** | `<em>` | `<i>` |

> 💡 **Tip** — A fast practical heuristic: if removing the tag would change the *meaning* of the sentence when read aloud, you want `<strong>` or `<em>`. If it's purely a visual/typographic convention (a product name, a foreign phrase, a title) that doesn't change the sentence's meaning, you want `<b>` or `<i>`. When in doubt for genuinely important content, `<strong>`/`<em>` is very rarely wrong; reach for `<b>`/`<i>` only when you specifically mean "stylistic convention, not meaning."

You *can* nest these — `<strong><em>very urgent and stressed</em></strong>` is valid and meaningful.

## Other inline text elements

```html
<p>Water freezes at <small>(at standard atmospheric pressure)</small> 0°C.</p>
<!-- <small> = "fine print" — side comments, legal disclaimers, attribution -->

<p>Search results for <mark>houseplants</mark> returned 42 matches.</p>
<!-- <mark> = highlighted/marked relevance, like a highlighter pen -->

<p>Regular <del>price $40</del> <ins>now $25</ins>.</p>
<!-- <del> = deleted/removed content, <ins> = inserted/added content -->
<!-- commonly used to show edits, price changes, tracked changes -->

<p>The chemical formula for water is H<sub>2</sub>O.</p>
<!-- <sub> = subscript -->

<p>Einstein's famous equation is E = mc<sup>2</sup>.</p>
<!-- <sup> = superscript -->
```

## Line breaks and horizontal rules: `<br>` and `<hr>`

```html
<p>123 Main Street<br>
Springfield<br>
United States</p>
```

`<br>` forces a line break *within* the same block of text (an address, a poem) — it does not start a new paragraph or section. It should be used sparingly and only when the line break is part of the actual content's meaning (like an address), never for general spacing between elements — that's CSS's job (`margin`), which you'll learn starting in Part 18.

```html
<p>Chapter one text...</p>
<hr>
<p>Chapter two text...</p>
```

`<hr>` represents a **thematic break** — a shift in topic within content, like a scene change in a story or a subject change between sections. It's rendered as a horizontal line by default, but semantically it means "topic break," not "draw a line" (again — meaning first, appearance second).

> ⚠️ **Common mistake** — Using `<hr>` purely as a decorative divider line with no actual thematic significance. If you just want a visual line for styling purposes with no semantic "topic break" meaning, use CSS (`border-top` on a `<div>`, for example) instead.

## Quotations: `<blockquote>`, `<q>`, and `<cite>`

```html
<blockquote cite="https://example.com/source-article">
  <p>The only way to do great work is to love what you do.</p>
</blockquote>
<p>— <cite>Steve Jobs, Stanford Commencement Address</cite></p>
```

`<blockquote>` marks an **extended quotation**, typically a block of one or more paragraphs, quoted from another source. The optional `cite` *attribute* takes a URL pointing to the source (not displayed, but machine-readable). Browsers typically indent it by default.

```html
<p>As the saying goes, <q>actions speak louder than words</q>.</p>
```

`<q>` is for a **short, inline quotation** — inside a sentence, not a whole block. Browsers automatically add quotation marks around `<q>` content via CSS (`content: open-quote` / `close-quote`), so you should *not* manually type quotation marks inside a `<q>`.

`<cite>` marks the **title of a creative work** being referenced (a book, article, song, movie) — not the *person* who said the quote. This is a common point of confusion:

```html
<!-- ✅ Correct: <cite> wraps the work's title, not the author's name -->
<p><cite>The Great Gatsby</cite> was written by F. Scott Fitzgerald.</p>

<!-- ❌ Wrong: using <cite> for a person's name -->
<p>According to <cite>Dr. Smith</cite>, the results were conclusive.</p>
```

## Code and keyboard content: `<code>`, `<pre>`, `<kbd>`

```html
<p>Use the <code>Array.map()</code> method to transform each item.</p>
```

`<code>` marks a short **inline fragment of computer code** — a function name, a variable, a command. Rendered in monospace font by default.

```html
<pre><code>function greet(name) {
  return `Hello, ${name}!`;
}</code></pre>
```

`<pre>` means **preformatted text** — it's the one place in HTML where whitespace (spaces, tabs, line breaks) *is* preserved exactly as written and displayed exactly as written, rather than being collapsed (HTML normally collapses multiple whitespace characters into a single space — more on that in Part 21). `<pre>` is almost always paired with `<code>` inside it for multi-line code blocks.

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>
```

`<kbd>` represents **user keyboard input** — specific keys or key combinations the user should press. Rendered in monospace by default, visually similar to `<code>` but semantically distinct (one represents code, the other represents input instructions).

## Knowledge Check — Part 2

1. What's the actual semantic difference between `<strong>` and `<b>`?
2. What's the actual semantic difference between `<em>` and `<i>`?
3. Why is it wrong to choose a heading level purely because of its default visual size?
4. What does `<hr>` semantically represent — not what it looks like, what it *means*?
5. What's the difference between `<blockquote>` and `<q>`?
6. Does `<cite>` refer to a person or a work? Give a correct and incorrect example.
7. Why does `<pre>` exist — what problem does it solve that plain `<p>` doesn't?
8. Should `<br>` be used to add visual spacing between two unrelated paragraphs? Why or why not?

<details>
<summary>View solutions</summary>

1. `<strong>` conveys strong semantic importance/urgency (affects how assistive tech may present it); `<b>` is stylistically offset text with no added importance (a keyword, a convention) — both render bold by default, but only `<strong>` carries meaning.
2. `<em>` conveys stress emphasis that changes the sentence's meaning when read aloud; `<i>` marks an alternate voice/mood — titles, foreign phrases, technical terms — with no emphasis implied. Both render italic by default, but only `<em>` carries meaning.
3. Because heading level communicates document structure/hierarchy to both users (especially screen reader users navigating by heading) and machines (search engines, outline tools). Choosing a level by visual size alone can create a broken, illogical outline even though the page "looks" fine visually.
4. A thematic/topic break in content — a shift between subjects or sections — not merely "a horizontal line" (that's just its default visual rendering).
5. `<blockquote>` is for extended/block-level quotations (often multiple paragraphs), typically indented by default. `<q>` is for short, inline quotations within a sentence, and browsers automatically add quotation marks around it via CSS.
6. It refers to the title of a creative work (a book, article, film, song), not a person. Correct: `<cite>The Great Gatsby</cite> was written by...`. Incorrect: `According to <cite>Dr. Smith</cite>...` (should just be plain text or another element, not `<cite>`).
7. `<pre>` preserves whitespace (spaces, tabs, line breaks) exactly as written in the source, which is essential for content like code snippets, ASCII art, or poetry where exact spacing and line breaks are part of the meaning — regular HTML collapses whitespace by default.
8. No — `<br>` should only be used when the line break is part of the actual content's meaning (like an address or a poem's line structure). Visual spacing between unrelated elements/paragraphs should be controlled with CSS (margin), not `<br>` tags, because spacing is a presentation concern, not a content concern.

</details>

---

# PART 3 — Links

Links are the "Hyper" in HyperText. Without them, HTML is just a formatting language for a single isolated document. With them, it's the web.

## The anchor element: `<a>`

### What it is

`<a>` (anchor) creates a hyperlink — clickable text (or an image, or any inline content) that navigates the browser to another location: another page, another site, a specific spot on the current page, an email client, or a phone dialer.

### Why it exists

The entire value proposition of the web over, say, a folder of Word documents, is that content can reference and jump to other content seamlessly. `<a>` is that mechanism.

### Syntax

```html
<a href="destination">Visible link text</a>
```

The `href` (**h**ypertext **ref**erence) attribute is the destination. Without `href`, `<a>` is not a link at all — it's an anchor placeholder with no navigational behavior, and it won't be keyboard-focusable or behave like a link to assistive technology. Always include `href` on a real link.

### Internal vs. external links, and relative vs. absolute paths

**Absolute path/URL** — the full address, including scheme and domain. Always used for linking to a *different* website:

```html
<a href="https://developer.mozilla.org/en-US/">MDN Web Docs</a>
```

**Relative path** — a path *relative to the current page's location*, used for linking to other pages *within your own site*:

```html
<a href="about.html">About</a>              <!-- same folder -->
<a href="products/shoes.html">Shoes</a>      <!-- subfolder -->
<a href="../index.html">Home</a>             <!-- one folder up -->
<a href="/contact.html">Contact</a>          <!-- from the site root, regardless of current page's folder -->
```

```text
Relative path reference table:

./file.html        →  same folder as the current page (the "./" is optional and usually omitted)
folder/file.html    →  a subfolder of the current page's folder
../file.html        →  go up one folder level, then find file.html
../../file.html      →  go up two folder levels
/file.html          →  absolute-from-domain-root: always resolves from the site's root, no matter
                        where the current page lives
```

> 💡 **Tip** — Use relative paths for links within your own site (they keep working if you move the whole site to a different domain) and absolute URLs only for linking to genuinely external sites.

### Linking within the same page: fragments

```html
<h2 id="pricing">Pricing</h2>
...
<a href="#pricing">Jump to Pricing</a>
```

An `href` starting with `#` followed by an element's `id` value scrolls the browser to that element. This is how "table of contents" and "back to top" links work, and it's also how the fragment portion of any URL (recall Part 0) works when linking *into* a specific section of another page:

```html
<a href="https://example.com/article.html#conclusion">Read the conclusion</a>
```

### `mailto:` and `tel:` links

```html
<a href="mailto:hello@example.com">Email us</a>
<a href="mailto:hello@example.com?subject=Support%20Request">Email support</a>
<a href="tel:+919876543210">Call us: +91 98765 43210</a>
```

`mailto:` opens the user's default email client with a new message addressed to that email; you can optionally pre-fill a subject (and other fields like `body` or `cc`) via a query string, URL-encoded (spaces become `%20`). `tel:` opens the device's phone dialer pre-filled with that number — especially useful on mobile.

### `target` — controlling where the link opens

```html
<a href="https://example.com" target="_blank">Opens in a new tab</a>
```

| Value | Behavior |
|---|---|
| `_self` (default) | Opens in the same tab/window, replacing the current page |
| `_blank` | Opens in a new tab/window |
| `_parent` | Opens in the parent frame (relevant only inside `<iframe>`s) |
| `_top` | Opens in the full body of the window, breaking out of any frames |

### Why `rel="noopener noreferrer"` matters with `target="_blank"`

```html
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  Visit external site
</a>
```

This is a real security and performance consideration, not a superstition:

- **`noopener`** prevents the newly opened page from getting a JavaScript reference back to your original page's `window` object. Without it, a malicious destination page could, in older browsers, use that reference to redirect *your* original tab to a phishing page — while the user is still looking at the (legitimate) new tab, unaware their original tab has been hijacked. This is called a "tabnabbing" attack.
- **`noreferrer`** additionally prevents the browser from sending a `Referer` header to the destination site, so it can't see which page linked to it.

> ⚠️ **Common mistake** — Modern browsers have actually made `noopener` the *default* behavior for `target="_blank"` links automatically, which is great — but it's still considered best practice to write it explicitly, both because you can't rely on every browser your users might have, and because it documents your intent clearly in the code.

> 💡 **Tip** — Use `target="_blank"` sparingly. Forcing every external link to open a new tab, especially many of them, takes control away from the user (who may have wanted it in the same tab) and clutters their browser with tabs they didn't ask for. A common convention: use `target="_blank"` for links that would cause the user to lose their place (e.g., linking away from a form they're filling out) and leave ordinary content links to open normally.

## Building a navigation menu with links

Links are the building block of every navigation menu you'll ever build. Structurally, a nav menu is just a list of links (we formalize the semantic wrapper `<nav>` in Part 8, and list markup in Part 5 — here's the shape you're building toward):

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

Using a `<ul>` of `<a>` elements (rather than, say, several `<a>` tags in a row separated only by spaces) is important: it tells screen readers explicitly "this is a list of N navigation items," which is announced to the user ("list, 4 items") — genuinely useful orientation information that's lost if you just place links side by side with no list structure.

## Common mistakes

```html
<!-- ❌ Wrong: href is missing — not a real link, not keyboard focusable -->
<a onclick="goHome()">Home</a>

<!-- ❌ Wrong: using a link for something that isn't navigation (should be a <button>) -->
<a href="#" onclick="submitForm()">Submit</a>

<!-- ❌ Wrong: javascript: URLs — a legacy anti-pattern, avoid entirely -->
<a href="javascript:void(0)" onclick="doSomething()">Click me</a>

<!-- ✅ Correct: a real link, to a real destination -->
<a href="/home">Home</a>

<!-- ✅ Correct: an action that isn't navigation belongs on a <button>, not <a> -->
<button type="button" onclick="submitForm()">Submit</button>
```

> ⚠️ **Common mistake** — This deserves its own callout because it's extremely common: **links navigate, buttons act.** If clicking something takes the user to a different URL (or a different section of the same page), it's a link. If clicking something performs an action on the current page (submits a form, opens a modal, toggles a menu) without navigating anywhere, it should be a `<button>`, not an `<a>` with `href="#"`. We return to this distinction in full depth in Part 12 (Accessibility Foundations) because it has real accessibility consequences — screen readers announce links and buttons differently, and users have different expectations for how each behaves with the keyboard.

## Broken example → why it breaks → correct version

```html
<!-- Broken -->
<a href=about.html>About</a>
```

**Why it breaks:** the attribute value isn't quoted. This *happens* to work in many cases for simple single-word values with no spaces or special characters, because HTML parsers are forgiving — but it's invalid HTML, and it breaks immediately and silently the moment the value contains a space, an `&`, or other special characters. There's no upside to leaving attributes unquoted, ever.

```html
<!-- Correct -->
<a href="about.html">About</a>
```

## Best practices

- Always quote attribute values, always use `href` on real links, always give link text that makes sense out of context (a screen reader user may navigate by pulling up a list of *all links on the page*, out of surrounding context — a page full of links that just say "click here" is a genuine accessibility failure).
- Prefer relative paths for internal links.
- Use `target="_blank"` sparingly, paired with `rel="noopener noreferrer"` when you do use it.
- Never use `<a href="#">` or `<a href="javascript:void(0)">` as a substitute for a `<button>`.

## Exercises — Part 3

1. Write a link to `https://example.com/pricing` that opens in a new tab, safely.
2. Write a link that, when clicked, scrolls down to an element with `id="faq"` on the same page.
3. Write a `mailto:` link to `support@example.com` with the subject pre-filled to "Bug Report".
4. Identify what's wrong with this navigation menu and fix it:
   ```html
   <div>
     <a href="/">Home</a>
     <a href="#" onclick="showProducts()">Products</a>
     <a href="/about">About</a>
   </div>
   ```

<details>
<summary>View solutions</summary>

**1.**
```html
<a href="https://example.com/pricing" target="_blank" rel="noopener noreferrer">Pricing</a>
```

**2.**
```html
<a href="#faq">Jump to FAQ</a>
```
(assuming an element elsewhere on the page has `id="faq"`)

**3.**
```html
<a href="mailto:support@example.com?subject=Bug%20Report">Email support</a>
```

**4.** Two problems: it's not wrapped in a semantic `<nav>` with a list structure (less critical here, more of a Part 8 concern, but worth noting), and — more importantly — "Products" uses `<a href="#" onclick="...">` for what is clearly an *action* (showing a product panel), not real navigation to a new location. It should be a `<button>`:
```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><button type="button" onclick="showProducts()">Products</button></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

</details>

---

# PART 4 — Images and Media

## The image element: `<img>`

### What it is

`<img>` embeds an image into the page. It's a **void element** (no closing tag, recall Part 1) and it's **replaced content** — meaning the browser replaces the element with external content (the actual image file) rather than rendering anything you type between tags (there's nothing to type between tags; it's self-closing).

### Syntax

```html
<img src="path/to/image.jpg" alt="Description of the image">
```

### The `src` attribute

The path to the image file — can be relative (`images/cat.jpg`) or absolute (`https://example.com/cat.jpg`), following the exact same rules as `href` on links (Part 3).

### The `alt` attribute — not optional

This is one of the most consequential single attributes in all of HTML, and it deserves real depth here (we return to it again, with more nuance, in Part 12).

`alt` provides a **text alternative** to the image, used in three real situations:

1. **Screen reader users** — the `alt` text is read aloud in place of the image, since the user cannot see it.
2. **The image fails to load** — broken link, slow connection, image blocked — the browser displays the `alt` text in place of the missing image.
3. **Search engines** — image search and general SEO rely partly on `alt` text to understand what an image depicts, since search engines can't "see" pixels the way humans do (some can do limited image analysis, but `alt` remains the authoritative signal).

```html
<!-- ✅ Good alt text: describes what the image conveys, concisely -->
<img src="golden-retriever.jpg" alt="A golden retriever running on a beach">

<!-- ❌ Bad alt text: redundant, unhelpful, or missing entirely -->
<img src="golden-retriever.jpg" alt="image">
<img src="golden-retriever.jpg" alt="golden-retriever.jpg">
<img src="golden-retriever.jpg">
```

> ♿ **Accessibility note** — Writing `alt` text well is a *skill*, not a formality. Describe the image's *content and function in context* — what it's communicating, not a mechanical list of every visual detail. "A golden retriever running on a beach" is useful; "brown and white dog with tongue out, four legs, tail up, sand, blue sky, waves" is not — it's a transcription of pixels, not a description of meaning. Ask yourself: "if I read only this text aloud, and not see the image, would I understand what this image is telling me in this context?"

### Decorative images — when `alt` should be empty

Some images are purely decorative — they add no informational content (a background flourish, a divider graphic, an icon that's purely stylistic and sits next to text that already conveys the same information). For these, use an **empty** `alt` attribute — `alt=""` — not a missing one:

```html
<!-- A decorative divider icon next to a heading that already says "Settings" -->
<h2><img src="gear-icon.svg" alt=""> Settings</h2>
```

```text
alt="Description"   → meaningful image: screen reader announces the description
alt=""               → decorative image: screen reader SKIPS it entirely (correct — it's noise otherwise)
(missing alt)        → WORST option: screen reader often announces the raw filename instead
                        ("golden dash retriever dot jpg") — actively unhelpful
```

> ⚠️ **Common mistake** — Omitting `alt` entirely is worse than an empty `alt=""`, because many screen readers fall back to announcing the file's URL/filename when `alt` is absent, which is pure noise. If an image is decorative, explicitly write `alt=""` — that's the correct way to say "skip this," not omission.

### `width` and `height` attributes

```html
<img src="photo.jpg" alt="A mountain landscape" width="800" height="600">
```

These specify the image's **intrinsic dimensions** in pixels. This is important for a reason that's easy to underestimate: when the browser knows an image's dimensions *before* the image file has finished downloading, it can reserve exactly the right amount of space in the layout immediately — preventing the rest of the page's content from visibly jumping around as images load in (a phenomenon called **layout shift**, which we'll cover again in Part 48, Performance). Without `width`/`height`, the browser doesn't know how much space to reserve until the image has actually downloaded and its natural dimensions are known.

> 💡 **Tip** — Always set `width` and `height` (matching the image's actual aspect ratio) even on responsive images that will be resized by CSS — the browser uses them to calculate the correct aspect ratio and reserve space, and CSS can still freely override the *displayed* size (we cover exactly how in Part 39, `object-fit` and `aspect-ratio`).

### The `loading` attribute — native lazy loading

```html
<img src="below-the-fold-image.jpg" alt="..." loading="lazy">
```

`loading="lazy"` tells the browser: don't download this image until the user is about to scroll it into view. This is a free, native performance optimization (no JavaScript required) for images far down a long page. The default value is `loading="eager"` (load immediately), which is correct for images visible without scrolling (especially large "hero" images, covered again in Part 48).

> ⚠️ **Common mistake** — Don't apply `loading="lazy"` to images that are visible immediately on page load (above the fold) — doing so can actually *delay* their loading unnecessarily in some browsers, hurting perceived performance instead of helping it.

## `<figure>` and `<figcaption>`

```html
<figure>
  <img src="chart.png" alt="Bar chart showing quarterly revenue growth from Q1 to Q4">
  <figcaption>Figure 1: Revenue grew 34% year-over-year.</figcaption>
</figure>
```

`<figure>` wraps a piece of **self-contained content** (an image, a diagram, a code listing, a chart) *plus its caption*, and semantically declares that this content could be moved elsewhere in the document (or even into an appendix) without breaking the flow of the main narrative — like a figure in a printed book. `<figcaption>` is its caption, and can appear before or after the content inside `<figure>`.

This is meaningfully different from just putting an `<img>` and a `<p>` next to each other: `<figure>`/`<figcaption>` creates an explicit, machine-readable *association* between the image and its caption text.

## Responsive images: `srcset` and `sizes`

### The problem this solves

A single fixed image file is a poor fit for the modern web: the same photo might need to display at 300px wide on a phone and 1200px wide on a desktop monitor. Sending the 1200px version to a phone wastes bandwidth (the user downloads pixels they'll never see, at real cost on a mobile data plan); sending the 300px version to a large desktop display makes it look blurry, stretched.

### Syntax

```html
<img
  src="photo-800w.jpg"
  srcset="photo-400w.jpg 400w,
          photo-800w.jpg 800w,
          photo-1200w.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="A mountain landscape at sunset">
```

Let's unpack this piece by piece, because the syntax looks intimidating but the logic is straightforward:

- **`srcset`** lists multiple versions of the same image, each labeled with its actual pixel width using the `w` unit (not to be confused with the CSS `vw` unit — this is a different, image-candidate-specific descriptor). This tells the browser: "here are your options, and here's how wide each one actually is."
- **`sizes`** tells the browser how wide the image will actually be *displayed* at different viewport widths, so it can calculate which candidate from `srcset` is the best fit *before* downloading anything. `(max-width: 600px) 100vw, 50vw` reads as: "if the viewport is 600px or narrower, this image will display at 100% of the viewport width; otherwise, it'll display at 50% of the viewport width."
- **`src`** remains as a fallback for browsers that don't support `srcset` (extremely rare today, but harmless to include, and required for HTML validity).

The browser combines `sizes` (how big will it actually render?) with the device's screen resolution (a high-DPI "Retina" screen needs more actual pixels for the same displayed size) to pick the single best candidate from `srcset` to download — you never manually pick which one loads; the browser does that math for you, per-user, per-device.

```text
Example decision the browser makes:

Viewport: 375px wide (phone), sizes says "100vw" at this width → needs ~375px of image
Screen is 3x pixel density (common on phones) → needs ~1125 actual pixels to look sharp
Candidates available: 400w, 800w, 1200w
Browser picks: 1200w (the smallest one that's still ≥ 1125px) — NOT the biggest by default,
and NOT the smallest — the best fit for actual rendered sharpness without over-downloading.
```

### `<picture>` and `<source>` — art direction

`srcset`/`sizes` solves *resolution switching* (same image, different sizes). Sometimes you need **art direction** — an entirely *different crop or composition* of an image at different viewport sizes (e.g., a tightly cropped portrait version for mobile vs. a wide landscape version for desktop). That's what `<picture>` is for:

```html
<picture>
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg">
  <source media="(min-width: 601px)" srcset="hero-desktop.jpg">
  <img src="hero-desktop.jpg" alt="A team collaborating around a table">
</picture>
```

The browser evaluates each `<source>`'s `media` condition top to bottom and uses the first one that matches; the final `<img>` is both the fallback (if no `<source>` matches or the browser doesn't support `<picture>`) and also provides the required `alt` text — `alt` always belongs on the `<img>`, never on `<source>`.

`<picture>`/`<source>` is also how you serve **different image formats** with automatic fallback:

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="A mountain landscape">
</picture>
```

The browser picks the first `<source>` whose `type` it supports, falling back to the plain `<img>` (JPG, universally supported) if neither modern format is supported.

## Modern image formats — when to use each

| Format | Best for | Notes |
|---|---|---|
| **JPG/JPEG** | Photographs, complex images with gradients | Lossy compression, no transparency support, universal support |
| **PNG** | Images needing transparency, sharp-edged graphics (logos, icons, screenshots with text) | Lossless (usually), larger file sizes than JPG for photos |
| **WebP** | General-purpose replacement for both JPG and PNG | Smaller file sizes at equivalent quality, supports transparency and animation, excellent modern browser support |
| **AVIF** | Same use cases as WebP, even better compression | Newer, smaller files than WebP in most cases, slightly less universal support, slower to encode |
| **SVG** | Logos, icons, illustrations, anything made of shapes/paths rather than photographic detail | Vector format — infinitely scalable with no quality loss, tiny file size for simple graphics, is actual XML/text (can be styled with CSS) |

> 💡 **Tip** — A practical, safe default for photographs today: serve AVIF and WebP via `<picture>` with a JPG fallback (as shown above), letting the browser pick the best format it supports. For icons and logos, prefer SVG whenever the graphic is made of clean shapes rather than photographic detail — it will look perfectly sharp on every screen density with a tiny file size.

## Audio and video

```html
<audio controls>
  <source src="podcast-episode.mp3" type="audio/mpeg">
  <source src="podcast-episode.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>
```

```html
<video controls width="640" height="360" poster="video-thumbnail.jpg">
  <source src="tutorial.mp4" type="video/mp4">
  <source src="tutorial.webm" type="video/webm">
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English">
  Your browser does not support the video element.
</video>
```

- **`controls`** — shows the browser's built-in play/pause/volume/seek UI. Omitting this means the user has *no way to control playback* unless you build custom controls with JavaScript — never omit `controls` unless you have a specific, deliberate reason and a JavaScript-driven alternative UI.
- **Multiple `<source>` elements** provide fallback formats, evaluated top to bottom, same mechanism as `<picture>`.
- **`poster`** (video only) — an image shown before playback starts, instead of a black/blank frame.
- **`<track kind="captions">`** — provides a caption file (WebVTT format) — essential for accessibility (deaf/hard-of-hearing users, and anyone watching with sound off, which is extremely common).
- The fallback text ("Your browser does not support...") displays only in the vanishingly rare case that neither `<audio>`/`<video>` nor any `<source>` format works.

### `autoplay`, `muted`, and `loop` — use with real caution

```html
<video autoplay muted loop playsinline>
  <source src="background-loop.mp4" type="video/mp4">
</video>
```

- **`autoplay`** — starts playback immediately on page load, with no user action. Nearly all modern browsers **require `muted` to be present alongside `autoplay`** for it to work at all — unmuted autoplay is broadly blocked by browsers specifically because it's a disruptive, widely-hated pattern (unexpected sound blasting from a page you just opened).
- **`muted`** — starts with no sound (required for autoplay to function in practice, as just noted).
- **`loop`** — restarts playback automatically when it ends.
- **`playsinline`** — (mobile-specific) plays the video inline in the page rather than automatically opening fullscreen, which is almost always what you want for background/decorative video.

> ⚠️ **Common mistake** — Autoplaying video *with sound* is one of the most universally disliked patterns on the web, is blocked by most browsers by default anyway, and should essentially never be used. Autoplaying silent, looping background video (`autoplay muted loop playsinline`) for a purely decorative hero section is a common and acceptable pattern — but always still provide a way to pause it if the video is running for more than a few seconds, both as a courtesy and as an accessibility requirement (motion can be genuinely distressing or disorienting for some users — we return to `prefers-reduced-motion` in Part 26 and Part 32).

## Knowledge Check — Part 4

1. What are the three real-world situations where `alt` text actually gets used/seen?
2. When should you use `alt=""` versus omitting `alt` entirely — and why is one clearly worse?
3. Why does specifying `width` and `height` on an `<img>` help prevent layout shift, even though CSS can still resize the image?
4. What problem does `srcset` + `sizes` solve that a single `<img src="...">` cannot?
5. What's the difference between what `srcset`/`sizes` solves versus what `<picture>` with multiple `<source media="...">` solves?
6. Why does `autoplay` on a `<video>` almost always require `muted` to actually function in modern browsers?
7. What does `loading="lazy"` do, and when should you avoid using it?

<details>
<summary>View solutions</summary>

1. (a) Read aloud by screen readers in place of the image, (b) displayed as fallback text if the image fails to load, (c) used by search engines to understand image content for indexing/image search.
2. Use `alt=""` for genuinely decorative images that add no informational content — this tells screen readers to explicitly skip the image (correct, non-noisy behavior). Omitting `alt` entirely is worse because many screen readers fall back to announcing the raw image filename/URL, which is unhelpful noise, not a deliberate "skip this" signal.
3. Because the browser can reserve the correct amount of layout space for the image immediately, using the width/height (and their ratio) as soon as it parses the `<img>` tag, before the actual image file has finished downloading — preventing surrounding content from jumping around once the image loads. CSS can still change the *displayed* size, but the reserved aspect ratio prevents shift.
4. It lets the browser choose the most appropriately-sized image file for the current device's viewport width and screen pixel density, avoiding sending an oversized image to a small/low-density screen (wasting bandwidth) or an undersized one to a large/high-density screen (looking blurry) — a single fixed `<img src>` can only ever be one fixed size.
5. `srcset`/`sizes` solves *resolution switching* — same image content, different file sizes/resolutions, chosen automatically by the browser based on viewport and pixel density. `<picture>` with multiple `<source media="...">` solves *art direction* — serving genuinely different image crops/compositions depending on viewport size (or different image formats), with an explicit developer-defined condition (`media`) rather than the browser's automatic best-fit calculation.
6. Because unmuted autoplay is a widely disliked, disruptive UX pattern (unexpected sound on page load), so modern browsers broadly block autoplay unless the video is also muted — muted autoplay is considered acceptable since it can't produce unexpected sound.
7. `loading="lazy"` defers downloading an image until it's about to scroll into the viewport, saving bandwidth/initial load time for images far down a page. Avoid it on images visible immediately on load (above the fold, especially large hero images) — deferring their load can actually delay them being ready to display, hurting rather than helping perceived load performance.

</details>

---

# PART 5 — Lists

Lists are one of the most common structural patterns on the web — navigation menus, feature lists, step-by-step instructions, glossaries, product listings — and HTML gives you three distinct list types, each with distinct meaning.

## Unordered lists: `<ul>` and `<li>`

### What it is

A list where **order doesn't matter** — the items could be rearranged without changing the meaning.

```html
<ul>
  <li>Milk</li>
  <li>Eggs</li>
  <li>Bread</li>
</ul>
```

Rendered with bullet points by default. `<li>` (list item) is the *only* element allowed directly inside `<ul>` — you cannot put a `<p>` or a `<div>` as a direct child of `<ul>`; anything else you want inside a list item goes *inside* the `<li>` itself.

### When to use it

Grocery lists, feature lists ("What's included"), tag lists, and — very commonly — navigation menus (as shown in Part 3), since the order of nav links, while it has a visual left-to-right/top-to-bottom order, doesn't carry *semantic* sequence meaning the way numbered steps do.

## Ordered lists: `<ol>` and `<li>`

### What it is

A list where **order matters** — sequence, ranking, or steps where rearranging items would change the meaning.

```html
<ol>
  <li>Preheat the oven to 350°F.</li>
  <li>Mix the dry ingredients.</li>
  <li>Fold in the wet ingredients.</li>
  <li>Bake for 25 minutes.</li>
</ol>
```

Rendered with numbers by default (1, 2, 3...). Useful attributes:

```html
<ol start="5">
  <li>Step five</li>
  <li>Step six</li>
</ol>

<ol reversed>
  <li>Third place</li>
  <li>Second place</li>
  <li>First place</li>
</ol>

<ol type="A">
  <li>Option A</li>
  <li>Option B</li>
</ol>
```

- **`start`** — begin numbering from a value other than 1.
- **`reversed`** — count downward instead of upward.
- **`type`** — the numbering style: `1` (default, numeric), `A`/`a` (uppercase/lowercase letters), `I`/`i` (uppercase/lowercase Roman numerals).

> ⚠️ **Common mistake** — Choosing `<ul>` vs. `<ol>` based purely on whether the *default rendering* (bullets vs. numbers) looks right, rather than whether order is actually semantically meaningful. A recipe's steps are inherently sequential (you can't fold in wet ingredients before mixing dry ones and get the same result) — that's an `<ol>`, regardless of whether you'd prefer the visual look of bullets. If you want numbered *visual* bullets on a `<ul>` for styling reasons, or bullet-styled visuals on an `<ol>`, that's a CSS `list-style` concern (covered in Part 21/44), completely separate from the semantic choice of tag.

## Description lists: `<dl>`, `<dt>`, `<dd>`

### What it is

A list of **term/description pairs** — glossaries, metadata, FAQs, key-value data.

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language — defines the structure of web content.</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets — defines the presentation of web content.</dd>
</dl>
```

- **`<dl>`** (description list) wraps the whole set.
- **`<dt>`** (description term) — the term being defined.
- **`<dd>`** (description details) — its definition/description. A single `<dt>` can be followed by multiple `<dd>`s (multiple definitions/values for one term), and multiple `<dt>`s can share one `<dd>` (synonyms sharing a definition) — the pairing is by document order, not 1:1 enforcement.

```html
<!-- Multiple dd for one dt -->
<dl>
  <dt>Color options</dt>
  <dd>Red</dd>
  <dd>Blue</dd>
  <dd>Green</dd>
</dl>
```

This is genuinely underused by beginners — FAQs, product spec sheets, and metadata blocks are extremely common patterns that `<dl>` fits semantically better than a generic `<div>`-based structure, and it's supported by assistive technology as a distinct, announced list type.

## Nested lists

Lists can contain other lists, nested inside an `<li>`:

```html
<ul>
  <li>Fruits
    <ul>
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </li>
  <li>Vegetables
    <ul>
      <li>Carrot</li>
      <li>Broccoli</li>
    </ul>
  </li>
</ul>
```

> ⚠️ **Common mistake** — The nested `<ul>` must go *inside* the parent `<li>`, not as a sibling of it. Putting it outside breaks the semantic (and visual, by default) nesting relationship entirely:

```html
<!-- ❌ Wrong: nested list is a sibling of <li>, not inside it -->
<ul>
  <li>Fruits</li>
  <ul>
    <li>Apple</li>
  </ul>
</ul>
```

## Building a navigation menu (full example, tying Parts 3 + 5 together)

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/shop">Shop</a>
      <ul>
        <li><a href="/shop/new">New Arrivals</a></li>
        <li><a href="/shop/sale">Sale</a></li>
      </ul>
    </li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

This is the exact structural foundation every dropdown navigation menu you'll ever build starts from — nested `<ul>`s inside `<li>`s, styled and made interactive with CSS and (eventually) JavaScript, but the *semantic skeleton* is just nested lists of links.

## Exercises — Part 5

1. Build an unordered list of your three favorite foods.
2. Build an ordered list of the steps to make tea (at least 4 steps), using `start="1"` implicitly (default) — then modify it to start numbering at 10.
3. Build a description list defining three HTML terms of your choice.
4. Find and fix the bug:
   ```html
   <ul>
     <li>Item one</li>
     <p>Item two</p>
   </ul>
   ```

<details>
<summary>View solutions</summary>

**1.**
```html
<ul>
  <li>Pizza</li>
  <li>Sushi</li>
  <li>Mango</li>
</ul>
```

**2.**
```html
<ol>
  <li>Boil water.</li>
  <li>Add tea leaves.</li>
  <li>Steep for 3-5 minutes.</li>
  <li>Strain and serve.</li>
</ol>
```
With `start="10"`:
```html
<ol start="10">
  <li>Boil water.</li>
  <li>Add tea leaves.</li>
  <li>Steep for 3-5 minutes.</li>
  <li>Strain and serve.</li>
</ol>
```

**3.**
```html
<dl>
  <dt>Element</dt>
  <dd>A piece of HTML consisting of a tag (or tags) and its content.</dd>
  <dt>Attribute</dt>
  <dd>Extra information added to an opening tag, in name="value" form.</dd>
  <dt>DOM</dt>
  <dd>The browser's in-memory tree representation of an HTML document.</dd>
</dl>
```

**4.** `<p>` is not a valid direct child of `<ul>` — only `<li>` is allowed. Fixed:
```html
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>
```

</details>

---

# PART 6 — Tables

## What tables are for — and what they are not for

### What it is

`<table>` marks up **tabular data**: information genuinely organized into rows and columns where each cell's meaning depends on both its row and column position — a spreadsheet, a pricing comparison, a schedule, a data export.

### Why it exists (and its infamous misuse)

In the early 2000s, before CSS layout techniques were mature, developers widely misused `<table>` purely for **visual page layout** — placing a page's header, sidebar, and content into table cells just to line them up on screen, with no actual tabular data involved. This is a legacy anti-pattern you should never use today: modern CSS (Flexbox, Grid — Parts 24–25) is built specifically for layout, and using `<table>` for layout creates serious accessibility problems (screen readers announce "table with 3 rows and 2 columns" for what is, semantically, just a page header and sidebar — actively confusing and wrong) plus rigid, hard-to-maintain markup.

> ⚠️ **Common mistake / historical note** — If you ever see old tutorials or old code using nested `<table>`s to build a page layout, that's a legacy technique from an era before CSS layout was reliable across browsers. Never do this today. Use `<table>` only for genuinely tabular data.

## Basic table structure

```html
<table>
  <caption>Monthly Sales Report</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>January</td>
      <td>$12,400</td>
      <td>+5%</td>
    </tr>
    <tr>
      <td>February</td>
      <td>$13,100</td>
      <td>+5.6%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td>$25,500</td>
      <td>—</td>
    </tr>
  </tfoot>
</table>
```

Let's break down every piece:

- **`<table>`** — the container for the entire table.
- **`<caption>`** — the table's title/description, always the *first* child of `<table>`. Like `<figcaption>`, this creates a genuine, machine-readable association between the table and its title — announced by screen readers, unlike a plain heading placed visually near the table.
- **`<thead>`** — groups the header row(s) — the row(s) that label what each column contains.
- **`<tbody>`** — groups the actual data rows (the body of the table). A table can technically have multiple `<tbody>` groups for logically separate blocks of rows, though a single one is by far the most common case.
- **`<tfoot>`** — groups footer row(s) — often totals, summaries, or averages.
- **`<tr>`** (table row) — one row, containing either `<th>` or `<td>` cells.
- **`<th>`** (table header cell) — a cell that *labels* a row or column, rather than containing plain data.
- **`<td>`** (table data cell) — an ordinary data cell.

### The `scope` attribute — essential for accessible tables

```html
<th scope="col">Revenue</th>
<th scope="row">January</th>
```

`scope="col"` declares that a header cell labels the *entire column* below it; `scope="row"` declares that a header cell labels the *entire row* to its right. This is not cosmetic — screen readers use `scope` to announce the correct row/column label as a user navigates cell by cell through a data table ("Revenue, January, $12,400" instead of just reading "$12,400" with no context). Without `scope`, screen reader users navigating a complex data table lose the ability to know what row/column they're currently in.

> ♿ **Accessibility note** — For any table with more than a trivial handful of cells, `scope` (or the more advanced `headers`/`id` pairing for very complex tables with multi-level headers) is not optional polish — it's the difference between a table that's genuinely usable by a screen reader user and one that produces an incomprehensible stream of disconnected numbers.

## `colspan` and `rowspan`

```html
<table>
  <caption>Class Schedule</caption>
  <tr>
    <th scope="col">Time</th>
    <th scope="col">Monday</th>
    <th scope="col">Tuesday</th>
  </tr>
  <tr>
    <th scope="row">9:00 AM</th>
    <td colspan="2">Team Meeting</td>
  </tr>
  <tr>
    <th scope="row">10:00 AM</th>
    <td rowspan="2">Focus Work</td>
    <td>Design Review</td>
  </tr>
  <tr>
    <th scope="row">11:00 AM</th>
    <td>Client Call</td>
  </tr>
</table>
```

- **`colspan="2"`** — this cell spans (merges across) 2 columns.
- **`rowspan="2"`** — this cell spans (merges down) 2 rows.

```text
Visual result of the schedule above:

┌──────────┬─────────────────────────┐
│  Time    │ Monday   │  Tuesday     │
├──────────┼──────────┴──────────────┤
│  9:00 AM │      Team Meeting       │  ← colspan="2"
├──────────┼──────────┬──────────────┤
│ 10:00 AM │          │Design Review │
├──────────┤ Focus    ├──────────────┤
│ 11:00 AM │ Work     │Client Call   │  ← rowspan="2" for "Focus Work"
└──────────┴──────────┴──────────────┘
```

## Building real tables

### Pricing table

```html
<table>
  <caption>Subscription Plans</caption>
  <thead>
    <tr>
      <th scope="col">Plan</th>
      <th scope="col">Price / month</th>
      <th scope="col">Storage</th>
      <th scope="col">Support</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Basic</th>
      <td>₹499</td>
      <td>10 GB</td>
      <td>Email only</td>
    </tr>
    <tr>
      <th scope="row">Pro</th>
      <td>₹1,499</td>
      <td>100 GB</td>
      <td>Priority email + chat</td>
    </tr>
    <tr>
      <th scope="row">Enterprise</th>
      <td>Custom</td>
      <td>Unlimited</td>
      <td>Dedicated account manager</td>
    </tr>
  </tbody>
</table>
```

Notice `<th scope="row">` is used for the plan names — they label each row just as much as the column headers label each column, and marking them as `<th>` (not `<td>`) with `scope="row"` is what makes this genuinely accessible.

### Product inventory table

```html
<table>
  <caption>Warehouse Inventory — Electronics</caption>
  <thead>
    <tr>
      <th scope="col">SKU</th>
      <th scope="col">Product</th>
      <th scope="col">Quantity</th>
      <th scope="col">Unit Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>EL-1001</td>
      <td>Wireless Mouse</td>
      <td>245</td>
      <td>₹899</td>
    </tr>
    <tr>
      <td>EL-1002</td>
      <td>USB-C Hub</td>
      <td>87</td>
      <td>₹1,799</td>
    </tr>
  </tbody>
</table>
```

## When NOT to use tables

- Never for page layout (headers, sidebars, navigation, grids of unrelated content) — use CSS Grid/Flexbox (Parts 24–25).
- Not for a simple list of items with no genuine row/column relationship — use `<ul>`/`<ol>` (Part 5).
- Not for a single key-value list (like a short spec sheet with 3–4 pairs) where `<dl>` (Part 5) might communicate the relationship more directly — though a table is entirely reasonable once you have multiple rows *and* multiple columns of genuinely related data.

> 💡 **Tip** — A quick test: if you removed the borders/lines and the content still makes complete sense read top-to-bottom as separate blocks, it probably wasn't a table to begin with. If removing the grid structure would make the data meaningless or ambiguous (which number belongs to which month, which price belongs to which plan), it's genuinely tabular — use `<table>`.

## Exercises — Part 6

1. Build a table comparing 3 phone models across the columns: Model, Price, Storage, Camera. Include a `<caption>`, `<thead>`, `<tbody>`, and correct `scope` attributes.
2. Add a `<tfoot>` row to a table showing a "Total" that spans two columns using `colspan`.
3. Explain, in your own words, why `scope="col"` and `scope="row"` matter for accessibility — not just "it's required," explain the actual mechanism/benefit.
4. Identify what's wrong with this table:
   ```html
   <table>
     <tr>
       <td>Name</td>
       <td>Age</td>
     </tr>
     <tr>
       <td>Amina</td>
       <td>29</td>
     </tr>
   </table>
   ```

<details>
<summary>View solutions</summary>

**1.**
```html
<table>
  <caption>Phone Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Model</th>
      <th scope="col">Price</th>
      <th scope="col">Storage</th>
      <th scope="col">Camera</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Phone A</th>
      <td>₹49,999</td>
      <td>128 GB</td>
      <td>48 MP</td>
    </tr>
    <tr>
      <th scope="row">Phone B</th>
      <td>₹64,999</td>
      <td>256 GB</td>
      <td>50 MP</td>
    </tr>
    <tr>
      <th scope="row">Phone C</th>
      <td>₹39,999</td>
      <td>128 GB</td>
      <td>32 MP</td>
    </tr>
  </tbody>
</table>
```

**2.**
```html
<tfoot>
  <tr>
    <td colspan="2">Total items</td>
    <td>3 phones compared</td>
  </tr>
</tfoot>
```

**3.** The header cells (`<th>`) visually label rows and columns, but a screen reader user navigating a table cell-by-cell (rather than looking at the whole grid visually) has no inherent way to know which row/column a given cell belongs to just from its position — they can't "see" the grid layout. `scope="col"` tells assistive technology "this header labels every cell below it in this column," and `scope="row"` says "this header labels every cell to its right in this row." This lets a screen reader announce the relevant header alongside each cell's value as the user moves through the table, giving them the same contextual understanding a sighted user gets for free by visually scanning row and column headers.

**4.** No `<th>` elements are used at all — "Name" and "Age" are marked up as plain `<td>` data cells rather than header cells, so there's no semantic distinction between the header row and the data rows (a screen reader has no way to know "Name" and "Age" are labels, not data). No `<caption>`, `<thead>`, or `<tbody>` either. Fixed:
```html
<table>
  <caption>People</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Amina</td>
      <td>29</td>
    </tr>
  </tbody>
</table>
```

</details>

---

# PART 7 — Forms

Forms are how users send information *to* your application — sign-ups, logins, checkouts, search boxes, contact forms, surveys. This is, deliberately, one of the largest sections in this course: forms have a huge, precise vocabulary, and getting them wrong causes real usability and accessibility failures (a form a screen reader user or keyboard-only user cannot complete is a form that has failed at its one job).

## The `<form>` element

### What it is

`<form>` is a container that groups a set of controls (inputs, selects, buttons) into a single unit that can be **submitted** — sent somewhere, as one bundle of data, in response to a user action (typically clicking a submit button or pressing Enter in a text field).

### Syntax

```html
<form action="/submit-contact" method="post">
  <!-- form controls go here -->
</form>
```

### `action` and `method`

- **`action`** — the URL the form's data gets sent to when submitted. If omitted, the form submits to the current page's own URL.
- **`method`** — the HTTP method used to send the data. The two you'll use are `get` and `post`.

### GET vs. POST, conceptually

This is a real, practical distinction, not a technicality:

**`GET`** appends the form's data to the URL itself, as a query string (recall Part 0's URL breakdown):

```text
Form fields: search=houseplants&category=indoor
Submitted with GET to action="/search" produces:
  /search?search=houseplants&category=indoor
```

Use `GET` when:
- The submission **retrieves/reads** data without changing anything on the server (a search form, a filter form).
- You *want* the resulting URL to be bookmarkable/shareable/reloadable — since the data lives in the URL, a user can bookmark a specific search result page, or share the link with someone else, and it reproduces the exact same query.

**`POST`** sends the form's data in the **body** of the HTTP request, invisible in the URL:

```text
POST /submit-contact HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

name=Ammaar&email=example@example.com&message=Hello
```

Use `POST` when:
- The submission **changes something** on the server — creating an account, posting a comment, placing an order, uploading a file.
- The data is **sensitive** (passwords, personal details) — while POST data isn't inherently "encrypted" by the method itself (that's what HTTPS does, at the transport layer), it at least doesn't end up sitting in browser history, server logs, or a bookmarked URL the way GET query strings do.
- The data is large or includes files (GET has practical URL-length limits; POST does not).

> ⚠️ **Common mistake** — Using `GET` for a login form. Submitting a password via GET puts the plaintext password directly into the URL — which then gets stored in the browser's history, potentially logged by the server, and could be visible over someone's shoulder or in a screen-sharing session. Always use `POST` for forms with sensitive data or forms that change server state.

## `<label>` — the most important, most skipped form element

### What it is

`<label>` provides a text description for a form control, and — critically — creates a **programmatic association** between that text and the control, not just a visual proximity.

### Why it matters (a lot)

```html
<label for="email">Email address</label>
<input type="email" id="email" name="email">
```

The `for` attribute on `<label>` must exactly match the `id` attribute on the input. This single connection does two concrete, important things:

1. **Clicking the label text focuses (or, for checkboxes/radios, toggles) the associated input.** Try it: in the example above, clicking the words "Email address" moves keyboard focus into the input box, exactly as if you'd clicked the box itself. This dramatically increases the clickable target size, which matters enormously for users with motor impairments, and for anyone on a touchscreen.
2. **Screen readers announce the label text whenever the input receives focus.** Without a correctly associated label, a screen reader user tabbing into an input hears... nothing meaningful, or at best a generic "edit text" with no indication of *what* they're supposed to type. This is a severe, common, and completely avoidable accessibility failure.

```html
<!-- ❌ Wrong: text near the input, but no programmatic association -->
<p>Email address</p>
<input type="email" name="email">

<!-- ❌ Wrong: for/id mismatch — looks associated, isn't -->
<label for="email-address">Email</label>
<input type="email" id="email" name="email">

<!-- ✅ Correct: for/id match exactly -->
<label for="email">Email address</label>
<input type="email" id="email" name="email">
```

### The alternative: wrapping

```html
<label>
  Email address
  <input type="email" name="email">
</label>
```

Wrapping the input *inside* the `<label>` creates the same association implicitly, without needing matching `for`/`id` values. Both patterns are valid HTML and both work correctly with screen readers; the explicit `for`/`id` version is generally preferred in professional codebases because it doesn't couple your CSS layout to the DOM nesting structure (wrapping can make certain layouts, especially with Flexbox/Grid, awkward — covered later).

> ♿ **Accessibility note** — There is no acceptable substitute for a real `<label>` on every single form input, ever, with the narrow exception of using an `aria-label` attribute when there is truly no visible text possible (rare — e.g., a lone search icon button with no text at all) — covered in Part 12. A `placeholder` attribute (next section) is *never* an acceptable substitute for a label, no matter how tempting it looks visually.

## Core input attributes

```html
<input
  type="text"
  name="username"
  id="username"
  value=""
  placeholder="e.g. jane_doe"
  required
  disabled
  readonly
  autocomplete="username">
```

- **`name`** — the key used when the form data is submitted (`name=value` pairs). Without `name`, an input's value is *not included* in the submitted data at all — this is one of the most common silent form bugs.
- **`id`** — a unique identifier, used to associate the `<label>` (via `for`), and for CSS/JavaScript targeting.
- **`value`** — the initial/current value of the input.
- **`placeholder`** — faint hint text shown *inside* the empty input, disappearing once the user types. This is a hint about the *expected format* (e.g., "e.g. jane_doe" or "MM/DD/YYYY"), **not** a replacement for a label.

> ⚠️ **Common mistake** — Using `placeholder` instead of a `<label>`. This is extremely common and genuinely harmful: placeholder text disappears the instant the user starts typing, so if they get distracted or come back to the field later, they've lost the only clue about what the field is for. It also usually renders in low-contrast gray text, which can be difficult to read for users with low vision, and screen reader behavior around `placeholder` is inconsistent and not a reliable substitute for a proper accessible name. Always use both: a real, visible `<label>`, and optionally a `placeholder` on top of it for format hints.

- **`required`** — the form cannot be submitted until this field has a value (browser-native validation, more below).
- **`disabled`** — the field is inert: not focusable, not editable, and — importantly — **its value is not submitted at all** with the form.
- **`readonly`** — the field displays its value and *is* focusable and its value *is* submitted, but the user cannot edit it. (The distinction between `disabled` and `readonly` is a common point of confusion — see the table below.)
- **`autocomplete`** — hints to the browser what kind of data this field expects, enabling browser autofill (`"email"`, `"name"`, `"tel"`, `"street-address"`, `"cc-number"`, `"new-password"`, `"current-password"`, `"off"` to disable, and many more standardized values). This is a real usability feature users rely on constantly — don't disable it without a strong reason.

### `disabled` vs. `readonly` — the precise distinction

| | Focusable? | Editable? | Submitted with form? | Typical use case |
|---|---|---|---|---|
| **(normal)** | ✅ Yes | ✅ Yes | ✅ Yes | Standard editable field |
| **`readonly`** | ✅ Yes | ❌ No | ✅ Yes | Show a value the user shouldn't change, but should still be able to select/copy and that should still be submitted (e.g., a pre-filled order ID) |
| **`disabled`** | ❌ No | ❌ No | ❌ No | A field that's entirely inactive right now (e.g., a shipping-address field disabled until "ship to different address" is checked) |

## Input types — the full tour

The `type` attribute on `<input>` is what makes HTML forms genuinely powerful — each type brings its own browser-native UI, keyboard behavior (especially on mobile — a huge, underrated benefit), and validation rules.

```html
<input type="text" name="fullname">
```
**`text`** — a single-line free text field. The default type if `type` is omitted entirely.

```html
<input type="password" name="password">
```
**`password`** — masks entered characters as dots/asterisks. Browsers also treat this type specially for autofill/password-manager integration.

```html
<input type="email" name="email">
```
**`email`** — a text field with built-in format validation (must look like `x@y.z`) and, critically, **triggers an email-optimized on-screen keyboard on mobile devices** (with `@` and `.com` easily accessible) — this alone is a meaningful usability win over generic `type="text"`.

```html
<input type="number" name="quantity" min="1" max="10" step="1">
```
**`number`** — restricts input to numeric values, typically shows spinner up/down arrows, and again triggers a numeric keyboard on mobile.

```html
<input type="date" name="birthday">
<input type="time" name="appointment-time">
<input type="datetime-local" name="event-start">
```
**`date`**, **`time`**, **`datetime-local`** — native date/time pickers, format handled entirely by the browser (huge win over manually parsing free-text date strings).

```html
<label><input type="checkbox" name="subscribe" value="yes"> Subscribe to newsletter</label>
```
**`checkbox`** — a binary (or multi-select, when grouped) toggle. Multiple checkboxes sharing the same `name` but different `value`s let the user select several options, all submitted under that shared name.

```html
<fieldset>
  <legend>Preferred contact method</legend>
  <label><input type="radio" name="contact" value="email" checked> Email</label>
  <label><input type="radio" name="contact" value="phone"> Phone</label>
</fieldset>
```
**`radio`** — mutually exclusive single-choice from a group. **Radio buttons sharing the same `name` form a group** — only one can be selected at a time within that group. This is the single most common radio-button bug: forgetting to give all buttons in a group the *same* `name`, which silently breaks the mutual-exclusivity entirely (each becomes independently toggleable).

```html
<input type="file" name="resume" accept=".pdf,.doc,.docx">
<input type="file" name="photos" accept="image/*" multiple>
```
**`file`** — lets the user select one or more files from their device to upload. `accept` restricts which file types the file picker suggests (not a hard security restriction — server-side validation is still required). `multiple` allows selecting several files at once.

```html
<input type="range" name="volume" min="0" max="100" value="50">
```
**`range`** — a slider control for selecting a numeric value within a range, when the *exact* number matters less than the relative position (volume, brightness).

```html
<input type="color" name="theme-color" value="#4f46e5">
```
**`color`** — a native color picker, submitting a hex value.

```html
<input type="search" name="q">
```
**`search`** — semantically a search box; some browsers render a small "clear" (×) button inside it, and mobile keyboards may show a "Search" key instead of "Enter."

```html
<input type="tel" name="phone">
```
**`tel`** — a telephone number field; triggers a numeric phone-style keyboard on mobile. Notably, `tel` does **not** enforce any particular format by default (phone number formats vary wildly by country), so use the `pattern` attribute (below) if you need format validation.

```html
<input type="url" name="website">
```
**`url`** — validates that the entered value looks like a well-formed URL.

```html
<input type="hidden" name="csrf_token" value="a1b2c3d4">
```
**`hidden`** — not rendered visually at all, but its `name`/`value` is still submitted with the form. Commonly used for security tokens or tracking IDs the server needs but the user never sees or edits.

```html
<input type="submit" value="Create Account">
<input type="reset" value="Clear Form">
<button type="button">Not a submit action</button>
```
**`submit`** — submits the form when clicked. **`reset`** — clears all form fields back to their initial values (used rarely today — it's a genuinely dangerous UX pattern if a user accidentally clicks it after filling out a long form, wiping everything). We'll cover `<button>` properly next.

## `<button>` — and why it's usually better than `<input type="submit">`

```html
<button type="submit">Create Account</button>
<button type="reset">Clear Form</button>
<button type="button">Cancel</button>
```

`<button>` has three `type` values with fundamentally different behavior — this is a genuinely important, frequently-mishandled detail:

| `type` value | Behavior |
|---|---|
| `submit` (default!) | Submits the enclosing form |
| `reset` | Resets the enclosing form |
| `button` | Does nothing by default — purely for custom JavaScript-driven behavior |

> ⚠️ **Common mistake** — `<button>`'s default `type`, if you omit the attribute entirely, is `submit`. This means **any `<button>` inside a `<form>` with no explicit `type` will submit that form when clicked** — including buttons you only meant to trigger some unrelated JavaScript action (like "show password" or "add another item"). This is one of the most common real-world form bugs: a button that accidentally, silently submits (and often prematurely navigates away from) a form. **Always explicitly set `type="button"` on any button inside a form that is not meant to submit or reset it.**

`<button>` is generally preferred over `<input type="submit">` for one major reason: `<button>` can contain **rich content** — an icon plus text, multiple lines, nested `<strong>` — whereas `<input>`'s `value` attribute can only ever be plain text.

```html
<!-- <input type="submit"> can only ever show plain text -->
<input type="submit" value="Submit Order">

<!-- <button> can contain markup -->
<button type="submit">
  <svg><!-- checkmark icon --></svg>
  Submit Order
</button>
```

## `<textarea>` — multi-line text

```html
<label for="message">Message</label>
<textarea id="message" name="message" rows="5" cols="40" placeholder="Type your message..."></textarea>
```

Note the syntax difference from `<input>`: `<textarea>` is **not** a void element — its initial value goes *between* the opening and closing tags as text content, not in a `value` attribute. `rows` and `cols` set its initial visible size (in text lines/characters), though in practice CSS `width`/`height` (Part 18) is usually used instead for precise sizing.

> ⚠️ **Common mistake** — Writing `<textarea value="Some text"></textarea>` — `<textarea>` has no `value` attribute; its content goes between the tags: `<textarea>Some text</textarea>`.

## `<select>`, `<option>`, and `<optgroup>`

```html
<label for="country">Country</label>
<select id="country" name="country">
  <option value="">Select a country</option>
  <option value="in">India</option>
  <option value="us">United States</option>
  <option value="gb">United Kingdom</option>
</select>
```

`<select>` creates a dropdown; each `<option>`'s `value` is what actually gets submitted, while the text between the tags is what the user sees. A first `<option value="">` with placeholder-like text ("Select a country") is a common pattern for forcing a deliberate choice, especially combined with `required` on the `<select>`.

```html
<select id="car" name="car">
  <optgroup label="German">
    <option value="bmw">BMW</option>
    <option value="audi">Audi</option>
  </optgroup>
  <optgroup label="Japanese">
    <option value="toyota">Toyota</option>
    <option value="honda">Honda</option>
  </optgroup>
</select>
```

`<optgroup label="...">` groups related options under a visual (and semantic) heading within the dropdown — useful for long option lists with a natural category structure.

```html
<select id="colors" name="colors" multiple size="4">
  <option value="red">Red</option>
  <option value="blue">Blue</option>
  <option value="green">Green</option>
  <option value="yellow">Yellow</option>
</select>
```

`multiple` turns a `<select>` into a multi-select list (Ctrl/Cmd+click, or Shift+click for a range, to select several); `size` controls how many options are visible at once without scrolling.

## `<fieldset>` and `<legend>` — grouping related controls

```html
<fieldset>
  <legend>Shipping Address</legend>

  <label for="street">Street</label>
  <input type="text" id="street" name="street">

  <label for="city">City</label>
  <input type="text" id="city" name="city">
</fieldset>
```

`<fieldset>` groups a set of related form controls (visually rendered with a border by default), and `<legend>` is its caption/title — always the first child of `<fieldset>`. This is especially important for radio button groups and checkbox groups: `<legend>` gives the *group* an accessible name distinct from each individual option's label, which screen readers announce when entering the group ("Shipping Address, group" then each field's own label).

```html
<fieldset disabled>
  <legend>Billing (same as shipping)</legend>
  <label for="billing-street">Street</label>
  <input type="text" id="billing-street" name="billing-street">
</fieldset>
```

`disabled` on a `<fieldset>` disables **every control inside it** at once — a convenient way to disable an entire section (e.g., "billing address" fields, disabled until the user unchecks "same as shipping").

## `<datalist>` — native autocomplete suggestions

```html
<label for="browser">Choose your browser</label>
<input list="browsers" id="browser" name="browser">
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
  <option value="Edge">
</datalist>
```

`<datalist>` provides a set of suggested autocomplete values for a regular text `<input>` (connected via the input's `list` attribute matching the datalist's `id`) — unlike `<select>`, the user can still type a completely free-text value not in the list; the suggestions are just that, suggestions, shown in a native dropdown as the user types.

## Form submission — what actually happens, conceptually

When a form is submitted (via a submit button, or pressing Enter in most single-line text inputs):

1. The browser collects every form control that has a `name` attribute, is not `disabled`, and (for checkboxes/radios) is checked.
2. It bundles them into `name=value` pairs.
3. It sends that bundle to the URL in `action`, using the HTTP method in `method` — as a query string (GET) or a request body (POST), as covered above.
4. Unless something prevents it (JavaScript calling `preventDefault()` — outside this course's scope, but worth knowing it exists), **the browser navigates to the `action` URL**, loading whatever the server sends back as the new page. This "whole page reload on submit" is the default, native HTML form behavior — modern JavaScript-heavy applications often intercept this to submit data in the background instead ("AJAX"/`fetch`), but that is a JavaScript topic, not an HTML one, and is outside this course's scope.

## Validation attributes — native browser validation

HTML provides genuinely useful, zero-JavaScript form validation:

```html
<input type="text" name="username" required minlength="3" maxlength="20">
<input type="number" name="age" min="18" max="120" step="1">
<input type="email" name="email" required>
<input type="password" name="password" required minlength="8"
       pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
       title="Must contain at least one uppercase letter, one lowercase letter, and one number">
```

- **`required`** — field cannot be left empty.
- **`minlength`** / **`maxlength`** — minimum/maximum number of characters (text-like inputs).
- **`min`** / **`max`** — minimum/maximum numeric (or date) value.
- **`step`** — the increment allowed between valid values (e.g., `step="0.01"` for currency, `step="5"` for a range that only allows multiples of 5).
- **`pattern`** — a regular expression the value must match. The `title` attribute alongside it is shown to the user as guidance text in the browser's native validation tooltip.

If any of these constraints are violated, the browser **blocks submission** and shows a native validation message pointing at the offending field, automatically, with zero JavaScript.

### The real limitations of browser-native validation

> ⚠️ **Common mistake** — Relying on HTML validation attributes as your *only* line of defense. This is a genuine security and data-integrity issue, not just a nitpick: **client-side validation (HTML attributes, or JavaScript) can always be bypassed** — a user can disable JavaScript, submit the form via a raw HTTP request (using a tool like `curl` or Postman), or simply edit the page's HTML in DevTools before submitting. HTML validation attributes are a **UX convenience** — they give immediate, helpful, zero-latency feedback to well-intentioned users — but they are **never** a substitute for validating and sanitizing data again on the server, which is the only validation layer you can actually trust. This course doesn't cover backend code, but understanding this boundary is essential to using form validation attributes correctly and not developing a false sense of security.

## Complete, realistic form examples

### Login form

```html
<form action="/login" method="post">
  <div>
    <label for="login-email">Email</label>
    <input type="email" id="login-email" name="email" required autocomplete="email">
  </div>

  <div>
    <label for="login-password">Password</label>
    <input type="password" id="login-password" name="password" required autocomplete="current-password">
  </div>

  <div>
    <label>
      <input type="checkbox" name="remember" value="yes">
      Remember me
    </label>
  </div>

  <button type="submit">Log In</button>
</form>
```

### Registration form

```html
<form action="/register" method="post">
  <div>
    <label for="reg-name">Full name</label>
    <input type="text" id="reg-name" name="name" required autocomplete="name">
  </div>

  <div>
    <label for="reg-email">Email</label>
    <input type="email" id="reg-email" name="email" required autocomplete="email">
  </div>

  <div>
    <label for="reg-password">Password</label>
    <input type="password" id="reg-password" name="password" required minlength="8" autocomplete="new-password">
  </div>

  <fieldset>
    <legend>Account type</legend>
    <label><input type="radio" name="account-type" value="personal" checked> Personal</label>
    <label><input type="radio" name="account-type" value="business"> Business</label>
  </fieldset>

  <div>
    <label>
      <input type="checkbox" name="terms" required>
      I agree to the Terms of Service
    </label>
  </div>

  <button type="submit">Create Account</button>
</form>
```

### Contact form

```html
<form action="/contact" method="post">
  <div>
    <label for="contact-name">Name</label>
    <input type="text" id="contact-name" name="name" required>
  </div>

  <div>
    <label for="contact-email">Email</label>
    <input type="email" id="contact-email" name="email" required>
  </div>

  <div>
    <label for="contact-subject">Subject</label>
    <select id="contact-subject" name="subject" required>
      <option value="">Select a topic</option>
      <option value="support">Technical Support</option>
      <option value="billing">Billing Question</option>
      <option value="feedback">General Feedback</option>
    </select>
  </div>

  <div>
    <label for="contact-message">Message</label>
    <textarea id="contact-message" name="message" rows="6" required></textarea>
  </div>

  <button type="submit">Send Message</button>
</form>
```

## Common mistakes summary

```html
<!-- ❌ Missing name — this field's value will NOT be submitted at all -->
<input type="text" id="username">

<!-- ❌ placeholder used in place of a label -->
<input type="email" name="email" placeholder="Email">

<!-- ❌ for/id mismatch — label not actually associated -->
<label for="user-email">Email</label>
<input type="email" id="email" name="email">

<!-- ❌ radio buttons with different names — breaks mutual exclusivity -->
<input type="radio" name="plan-a" value="basic"> Basic
<input type="radio" name="plan-b" value="pro"> Pro

<!-- ❌ button inside a form with no explicit type — accidentally submits -->
<form>
  <input type="text" name="q">
  <button>Add filter</button> <!-- this SUBMITS the form, probably unintended -->
</form>
```

## Best practices

- Every input gets a real `<label>`, correctly associated via matching `for`/`id`.
- Every meaningful input gets a `name`.
- Use the most specific `type` available (`email`, `tel`, `number`, `date`, etc.) — it's free, correct, native validation and better mobile keyboards.
- Use `<fieldset>`/`<legend>` to group related radio buttons, checkboxes, or logically related fields.
- Explicitly set `type="button"` on any in-form button that shouldn't submit.
- Treat client-side validation attributes as UX sugar, never as your only validation layer.
- Use `autocomplete` correctly — it's a genuine, appreciated convenience for returning users.

## Knowledge Check — Part 7

1. What does the `name` attribute actually control, and what happens if you forget it?
2. Explain the real, functional difference `<label for="x">`/`id="x"` association provides — not "it's good practice," the actual mechanism.
3. Why is `placeholder` never an acceptable replacement for `<label>`?
4. What determines whether multiple radio buttons behave as a mutually exclusive group?
5. What's the difference between `disabled` and `readonly`, in terms of focusability, editability, and form submission?
6. When should a form use `method="get"` vs `method="post"`?
7. Why is HTML/JavaScript form validation never sufficient on its own?
8. What is the default `type` of a `<button>` with no explicit `type` attribute, and why does that commonly cause bugs?
9. What's the actual difference between what `<select multiple>` allows versus a group of checkboxes?

<details>
<summary>View solutions</summary>

1. `name` is the key used when the form's data is submitted, as `name=value` pairs. Without it, that field's value is entirely excluded from the submitted form data — the server never receives it, even though the user filled it in and it looked correct on screen.
2. Matching `for`/`id` creates a real, programmatic association: (a) clicking the label text moves focus into (or toggles) the associated control, increasing the effective clickable area, and (b) screen readers announce the label's text whenever that control receives focus, giving the user meaningful context about what they're filling in. It's not just visual convention — it's a functional link the browser and assistive technology both use.
3. Because placeholder text disappears the moment the user starts typing (so it can't help if they return to the field later or get distracted mid-fill), it's often rendered in low-contrast text that's hard to read for users with low vision, and it is not reliably announced/treated the same way a real accessible label is by assistive technology.
4. Sharing the exact same `name` attribute. Radio buttons with the same `name` form one mutually-exclusive group; different `name`s make them behave as independent, unrelated toggles.
5. `disabled`: not focusable, not editable, value NOT submitted with the form. `readonly`: still focusable (and its text can be selected/copied), not editable, but its value IS still submitted with the form.
6. `GET` for submissions that read/retrieve data without changing server state, especially where a bookmarkable/shareable URL is desirable (search, filters). `POST` for submissions that change server state (create/update/delete) or that involve sensitive data, since POST data isn't embedded in the URL, browser history, or server access logs the way GET query strings are.
7. Because all client-side validation (HTML attributes or JavaScript) runs in the user's browser, which the user fully controls — they can disable JavaScript, edit the page's HTML in DevTools, or submit a raw HTTP request directly, bypassing any client-side check entirely. Only server-side validation, which the user cannot control or bypass, can actually be trusted to enforce data integrity and security.
8. The default type is `submit`. This means any `<button>` placed inside a `<form>` without an explicit `type="button"` will submit that form when clicked — a common, often unintended bug when a button was only meant to trigger some other in-page action.
9. Both allow multiple selections submitted under related name(s), but they present and behave differently: `<select multiple>` shows a single compact scrollable list box requiring Ctrl/Cmd-click (or Shift-click for a range) to select multiple options — less discoverable and harder to use on touch devices — while a group of checkboxes shows every option visibly and individually tappable/clickable at all times, generally more usable, especially for a small number of options.

</details>

## Mini Project — Part 7: Event Registration Form

Build a complete event registration form using only what you've learned so far (Parts 1–7). Requirements:

- Full name (required text input)
- Email (required, correct input type)
- Phone number (correct input type)
- Number of guests attending (correct input type, min 1, max 10)
- Preferred session time — a radio button group with at least 3 options, wrapped in a `<fieldset>`/`<legend>`
- Dietary restrictions — a `<select>` with at least 4 options including a sensible default/placeholder option
- Additional comments — a `<textarea>`
- A checkbox to agree to terms (required)
- A properly typed submit button

Every input must have a correctly associated `<label>`. Use `POST` as the method (this submission would create a new registration — real server state).

<details>
<summary>View solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Registration</title>
</head>
<body>
  <h1>Register for the Frontend Summit 2026</h1>

  <form action="/register-event" method="post">
    <div>
      <label for="full-name">Full name</label>
      <input type="text" id="full-name" name="fullName" required autocomplete="name">
    </div>

    <div>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="email">
    </div>

    <div>
      <label for="phone">Phone number</label>
      <input type="tel" id="phone" name="phone" autocomplete="tel">
    </div>

    <div>
      <label for="guests">Number of guests</label>
      <input type="number" id="guests" name="guests" min="1" max="10" step="1" value="1" required>
    </div>

    <fieldset>
      <legend>Preferred session time</legend>
      <label><input type="radio" name="session" value="morning" checked> Morning (9 AM)</label>
      <label><input type="radio" name="session" value="afternoon"> Afternoon (1 PM)</label>
      <label><input type="radio" name="session" value="evening"> Evening (5 PM)</label>
    </fieldset>

    <div>
      <label for="diet">Dietary restrictions</label>
      <select id="diet" name="diet">
        <option value="none">No restrictions</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten-free</option>
      </select>
    </div>

    <div>
      <label for="comments">Additional comments</label>
      <textarea id="comments" name="comments" rows="4"></textarea>
    </div>

    <div>
      <label>
        <input type="checkbox" name="terms" required>
        I agree to the event Terms and Conditions
      </label>
    </div>

    <button type="submit">Complete Registration</button>
  </form>
</body>
</html>
```

**Explanation:** Every field uses the most semantically correct input type (`tel` for phone, `number` with `min`/`max` for guest count), every field has a properly associated `<label>` via matching `for`/`id`, the radio group is wrapped in `<fieldset>`/`<legend>` for a proper accessible group name, and `method="post"` is used because registering for an event changes server state (creates a new registration record) and could be considered semi-sensitive personal data. The `required` attributes provide immediate native feedback, understanding that server-side validation would still be necessary in a real production system.

</details>

---

# PART 8 — Semantic HTML

## What "semantic HTML" means

### What it is

**Semantic HTML** means choosing elements based on what content *is* (its meaning and role in the document), rather than purely how you want it to look. You've actually been learning semantic HTML since Part 2 — `<strong>` vs `<b>`, proper heading levels, `<blockquote>` vs `<q>` — all of that *is* semantic HTML. This Part focuses specifically on the **page-structure-level** semantic elements: the tags used to lay out the major regions of a page.

### Why it exists

For most of HTML's history (and still today, among developers who never learned better), page structure was built almost entirely from generic `<div>` elements, distinguished only by `class` or `id` names:

```html
<!-- The old, non-semantic way -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main-content">...</div>
<div class="sidebar">...</div>
<div class="footer">...</div>
```

This *works* visually (CSS doesn't care what tag name you use), but it has three real costs:

1. **Accessibility** — a `<div class="nav">` is, to a screen reader, indistinguishable from a `<div class="totally-unrelated-thing">`. Screen readers cannot see your class names; they only understand actual HTML semantics. A screen reader user has no way to jump directly to "the navigation" or "the main content," which sighted users do effortlessly just by looking at the page.
2. **SEO** — search engines use structural semantics as a real signal for understanding what a page is about and how its content is organized.
3. **Maintainability** — a developer reading `<main>` instantly knows what that block is for; a developer reading `<div class="content-wrap-inner-2">` (a genuine pattern that emerges in large, poorly-structured codebases) does not.

HTML5 introduced a set of elements specifically to replace this "div soup" for page-level structure, each communicating an explicit, standardized meaning.

## The core semantic layout elements

```html
<body>
  <header>
    <h1>Site Name</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>Article Title</h2>
      <p>Article content...</p>
    </article>

    <aside>
      <h2>Related Links</h2>
      <ul>
        <li><a href="/link1">Link One</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Company Name</p>
  </footer>
</body>
```

```text
Visual mental model of a typical page's semantic regions:

┌──────────────────────────────────────────┐
│                 <header>                  │
│  (logo, site title, <nav> often lives here)│
├──────────────────────────────────────────┤
│                                            │
│                  <main>                   │
│   ┌──────────────────┐  ┌──────────────┐ │
│   │    <article>      │  │   <aside>    │ │
│   │  (primary content)│  │ (related/    │ │
│   │                    │  │  tangential) │ │
│   └──────────────────┘  └──────────────┘ │
│                                            │
├──────────────────────────────────────────┤
│                 <footer>                  │
└──────────────────────────────────────────┘
```

### `<header>`

Introductory content for its nearest ancestor: usually the page as a whole (logo, site title, primary nav) but can also head an individual `<article>` or `<section>` (an article's title, byline, and publish date). **Not the same thing as `<head>`** — `<head>` (Part 1) is invisible document metadata; `<header>` is a visible, semantic page-structure element. This is a genuinely common naming confusion for beginners.

### `<nav>`

Wraps a *major* block of navigation links — primary site navigation, a table of contents, pagination controls. Not every group of links needs `<nav>` — a handful of links inline within an article's prose doesn't need it — but *the* main navigation menu(s) of a page should be wrapped in `<nav>`. Multiple `<nav>` elements are fine (e.g., primary nav and footer nav) — give each a distinguishing `aria-label` (covered further in Part 12) so screen reader users can tell them apart when jumping between landmarks.

### `<main>`

Wraps the **primary, unique content of the page** — the content that isn't repeated across other pages (unlike the header/nav/footer, which usually are the same everywhere on a site). There should be exactly **one** `<main>` per page, and it should not be nested inside `<header>`, `<footer>`, `<nav>`, `<article>`, or `<aside>`. Screen reader users frequently use a "skip to main content" mechanism (formalized in Part 49) that relies directly on `<main>` existing.

### `<article>`

Wraps content that is **independently distributable/reusable** — content that would make complete sense on its own, out of context, if syndicated elsewhere (an RSS feed, a different site, a search result snippet): a blog post, a news story, a forum post, a product card, a user comment. A useful test: "could this be pulled out and dropped somewhere else, standalone, and still make sense?" If yes, `<article>` fits.

### `<section>`

A **thematic grouping of content**, generally with its own heading, that represents a distinct part of a larger document but isn't necessarily independently distributable the way `<article>` content is. A long page might have `<section>`s for "Features," "Pricing," "Testimonials," "FAQ" — each a distinct topic, but none of them make sense ripped out of the page entirely on their own the way a blog post does.

> 💡 **Tip** — `<section>` vs `<article>` vs generic `<div>` is one of the most common points of genuine, reasonable uncertainty in semantic HTML, so here's a concrete decision process: **Does this block of content have its own heading and represent a distinct, meaningful "chapter" of the page/document? → `<section>`. Would this specific block make complete sense picked up and dropped somewhere else entirely on its own? → `<article>`. Is this purely a styling/layout wrapper with no independent meaning of its own (e.g., a wrapper div just to constrain max-width and center content)? → plain `<div>` — and that's completely correct, not a failure to be "semantic enough."**

### `<aside>`

Content that's **tangentially related** to the main content around it — a sidebar, a pull quote, related links, an advertisement, a "further reading" box. The test: if you deleted this content entirely, would the main content still stand complete and unaffected? If yes, it's aside-worthy.

### `<footer>`

Closing content for its nearest ancestor — usually the whole page (copyright, contact info, sitemap links, social media links) but, like `<header>`, can also close out an individual `<article>` or `<section>` (an article's author bio and publish date at the bottom, for instance).

### `<address>`

Contact information for the nearest `<article>` or the page as a whole — physical address, email, phone, social handles of the person/organization who authored the content. **Not** for arbitrary postal addresses that appear as regular content (e.g., a shipping address the user typed into a form is just data, not "contact info for this document's author" — that's a common point of confusion).

```html
<footer>
  <address>
    Written by <a href="/authors/jane">Jane Doe</a>.
    Contact: <a href="mailto:jane@example.com">jane@example.com</a>
  </address>
</footer>
```

### `<time>`

Marks a specific, machine-readable date/time, using the `datetime` attribute to provide the unambiguous machine-readable value while the visible text can be in any human-friendly format:

```html
<p>Published on <time datetime="2026-09-18">September 18, 2026</time>.</p>
<p>The event starts at <time datetime="2026-09-18T19:00">7:00 PM</time>.</p>
```

This lets browsers, search engines, and other tools (like calendar integrations) reliably parse the actual date/time, even though the human-visible text can be written naturally ("yesterday," "last Tuesday," "Sept 18th").

## `<div>` versus semantic elements — a direct comparison

```html
<!-- Non-semantic: works visually, communicates nothing structurally -->
<div class="page-header">
  <div class="site-title">My Blog</div>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </div>
</div>
<div class="page-body">
  <div class="post">
    <div class="post-title">My First Post</div>
    <div class="post-content">...</div>
  </div>
</div>
<div class="page-footer">© 2026</div>
```

```html
<!-- Semantic: identical visual result achievable with CSS, but real structural meaning -->
<header>
  <h1>My Blog</h1>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <article>
    <h2>My First Post</h2>
    <p>...</p>
  </article>
</main>
<footer>&copy; 2026</footer>
```

Both examples can be styled identically with CSS — semantic HTML costs nothing visually. The difference is entirely in what the structure *communicates*, to browsers, screen readers, search engines, and future developers (including future you).

## Full semantic article page example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Why Semantic HTML Matters — Dev Weekly</title>
</head>
<body>
  <header>
    <h1>Dev Weekly</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/archive">Archive</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Why Semantic HTML Matters</h2>
        <p>By <a href="/authors/ammaar">Ammaar Khatri</a> —
          <time datetime="2026-09-18">September 18, 2026</time></p>
      </header>

      <section>
        <h3>The Problem With Div Soup</h3>
        <p>When every element is a generic div, structure disappears...</p>
      </section>

      <section>
        <h3>What Screen Readers Actually See</h3>
        <p>Assistive technology relies on real semantics, not class names...</p>
      </section>

      <footer>
        <p>Tagged: <a href="/tags/accessibility">accessibility</a>, <a href="/tags/html">html</a></p>
      </footer>
    </article>

    <aside aria-label="Related articles">
      <h2>Related Reading</h2>
      <ul>
        <li><a href="/articles/aria-basics">ARIA Basics Explained</a></li>
        <li><a href="/articles/heading-hierarchy">Getting Heading Hierarchy Right</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <address>
      Dev Weekly, contact: <a href="mailto:hello@devweekly.example">hello@devweekly.example</a>
    </address>
    <p>&copy; 2026 Dev Weekly. All rights reserved.</p>
  </footer>
</body>
</html>
```

Notice `<header>` and `<footer>` each appear *twice* — once for the whole page, once nested inside the `<article>` for that article's own byline/tags. This is entirely valid and a very common real-world pattern: these elements are scoped to their **nearest sectioning ancestor** (`<article>`, `<section>`, `<body>`), not globally unique like `<main>`.

## Interview Questions — Part 8

**Q: What is semantic HTML?**

A: HTML that uses elements chosen for what the content structurally *is* and *means*, rather than purely for its default visual appearance — e.g. using `<nav>` for navigation and `<article>` for a self-contained piece of content, instead of generic `<div>`s distinguished only by class names. It improves accessibility (screen readers can identify and navigate by structural landmarks), SEO (search engines better understand page structure and content relationships), and maintainability (the markup itself documents its own purpose).

**Q: `<div>` vs `<section>` — what's the actual difference, and when should you use each?**

A: `<div>` is a generic, meaning-free container — use it purely for styling/layout grouping with no independent semantic significance (e.g., a wrapper to constrain max-width). `<section>` represents a distinct thematic grouping of content, typically with its own heading, that forms a meaningful part of the document's outline (e.g., a "Pricing" section on a landing page). If a chunk of markup exists only to be a CSS hook and carries no meaningful "this is a distinct topic" semantics, it should stay a `<div>` — wrapping everything in `<section>` "to be more semantic" is itself a misuse of the element.

## Knowledge Check — Part 8

1. What is the concrete difference between `<head>` and `<header>`?
2. Give the test for deciding between `<article>` and `<section>`.
3. Can a page have more than one `<nav>`? More than one `<main>`?
4. Why is `<div class="nav">` meaningfully worse than `<nav>` for a screen reader user, even if they look identical to a sighted user?
5. What is `<aside>` for, and what's a simple test for whether content belongs in one?
6. What does the `datetime` attribute on `<time>` provide that the visible text alone doesn't?
7. Is it valid to have a `<header>` inside an `<article>` in addition to the page's main `<header>`? Why?

<details>
<summary>View solutions</summary>

1. `<head>` is invisible document metadata (title, charset, linked stylesheets) that doesn't render as visible page content. `<header>` is a visible, semantic page-structure element representing introductory content for the page or a section (logo, title, nav, or an article's byline).
2. `<article>`: would this content make complete, standalone sense if pulled out and placed somewhere else entirely (a feed, another site)? If yes, `<article>`. `<section>`: is this a distinct thematic grouping, typically with its own heading, that's part of a larger document but not independently distributable on its own? If yes, `<section>`.
3. Yes to `<nav>` — a page can have multiple (main nav, footer nav, sidebar nav), ideally each distinguished with a unique `aria-label`. No to `<main>` — there should be exactly one `<main>` per page, representing the single primary content region.
4. Because screen readers understand actual HTML semantics, not CSS class names — a `<div class="nav">` is indistinguishable from any other generic div to a screen reader, so a user cannot use landmark/region navigation shortcuts to jump directly to it, unlike a real `<nav>` element which is exposed as an actual navigable landmark.
5. `<aside>` is for content tangentially related to the main content around it (sidebars, pull quotes, related links, ads). Test: if you deleted this content entirely, would the main content still stand complete and unaffected? If yes, it's aside-worthy.
6. `datetime` provides an unambiguous, machine-readable date/time value (in a standardized format) that browsers, search engines, and other tools can reliably parse — independent of whatever human-friendly format the visible text uses (e.g., "yesterday" or "last Tuesday").
7. Yes — `<header>` (and `<footer>`) are scoped to their nearest sectioning ancestor (`<article>`, `<section>`, or `<body>`), not globally unique to the page, so an `<article>` can have its own `<header>` (title, byline, date) in addition to the page-level `<header>` (site title, main nav).

</details>

---

# PART 9 — Generic Containers: `<div>` and `<span>`

## What they are

`<div>` and `<span>` are HTML's two **purely generic, meaning-free containers**. They carry no semantic information whatsoever — no assistive technology, search engine, or human reading the markup learns anything about the *content's meaning* from the tag name alone. Their entire purpose is to be **hooks for CSS (styling) or JavaScript (behavior)** when no more specific, meaningful element fits.

### `<div>` — block-level generic container

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content.</p>
</div>
```

`<div>` is a **block-level** element (more on exactly what that means in Part 19) — by default it takes up the full available width and stacks vertically with other block elements, like a paragraph would. It's the general-purpose wrapper for grouping a chunk of related content purely for layout/styling purposes — a card, a grid item, a layout column, a modal wrapper.

### `<span>` — inline generic container

```html
<p>The price is <span class="highlight-price">$49.99</span> today only.</p>
```

`<span>` is an **inline** element — it doesn't force a line break; it flows within surrounding text/content, like `<strong>` or `<a>` would. It's the general-purpose wrapper for styling or scripting a small piece of text *within* a larger block, without giving it any particular semantic meaning (if the text needed meaning — importance, emphasis, a title — you'd reach for `<strong>`, `<em>`, `<cite>`, etc. instead, from Part 2).

## When div/span are genuinely appropriate

Using `<div>`/`<span>` is **not** a failure of semantic HTML — it's the *correct* choice whenever:

- You need a wrapper purely for layout purposes (constraining width, creating a Flexbox/Grid container, grouping items for spacing) with no independent semantic meaning of its own.
- No existing semantic element actually matches the content's meaning (there's no HTML element for "a decorative icon wrapper" or "a badge pill" — those are `<span>`/`<div>` with classes, appropriately).
- You need a hook purely for JavaScript to target, with nothing to say semantically about the content itself.

```html
<!-- ✅ Appropriate div use: pure layout wrapper -->
<div class="grid-container">
  <div class="grid-item">...</div>
  <div class="grid-item">...</div>
</div>

<!-- ✅ Appropriate span use: styling one word differently, no semantic meaning -->
<p>Available in <span class="color-swatch" style="color: crimson;">Crimson</span> and Navy.</p>
```

## "Div soup" — what it is and why it's a problem

**"Div soup"** is the derogatory (but accurate) term for markup built almost entirely out of nested, meaningless `<div>`s, where semantic elements *should* have been used instead:

```html
<!-- Div soup: technically renders fine, communicates nothing -->
<div class="page">
  <div class="top">
    <div class="logo">My Site</div>
    <div class="links">
      <div class="link">Home</div>
      <div class="link">About</div>
    </div>
  </div>
  <div class="body">
    <div class="post">
      <div class="post-heading">Article Title</div>
      <div class="post-text">Content...</div>
    </div>
  </div>
</div>
```

Every single problem covered in Part 8 applies here, compounded: no landmarks for screen readers to navigate by, worse SEO structural signals, harder-to-read markup, and — notice — even the *links* are fake (`<div class="link">Home</div>` isn't a real, keyboard-focusable, clickable link at all — it's just text styled to look like one, requiring a bunch of extra JavaScript to even function as a link, poorly, and never as well as a real `<a>`).

> ⚠️ **Common mistake** — Div soup often emerges not from ignorance but from *habit* — many beginners learn CSS frameworks or copy-paste patterns that lean heavily on divs, and the habit sticks even after learning semantic elements exist. The fix is a simple mental checklist before reaching for `<div>`: "does a real semantic element (`<nav>`, `<article>`, `<button>`, `<a>`, `<ul>`) already exist for what this content actually *is*? If yes, use it. If this is genuinely just a styling/layout wrapper, `<div>` is correct."

## Knowledge Check — Part 9

1. What's the fundamental difference in purpose between `<div>`/`<span>` and elements like `<nav>`/`<strong>`?
2. Is it ever correct to use a `<div>`? Give an example of an appropriate use.
3. What's the difference in default layout behavior between `<div>` and `<span>`?
4. What real, functional problems does a `<div class="link">` have compared to a real `<a>`, beyond just "it's not semantic"?

<details>
<summary>View solutions</summary>

1. `<div>`/`<span>` carry no semantic meaning at all — they're purely generic containers for styling/scripting hooks. `<nav>`/`<strong>` (and similar) carry explicit semantic meaning about what the content is or its role, which is communicated to browsers, assistive technology, and search engines.
2. Yes — it's correct whenever you need a purely presentational/layout wrapper with no independent meaning, e.g., a `<div class="grid-container">` wrapping several cards purely to apply CSS Grid layout to them.
3. `<div>` is block-level by default (full available width, stacks vertically, forces line breaks around it). `<span>` is inline by default (flows within surrounding text/content, no forced line break).
4. A `<div class="link">` is not natively keyboard-focusable (a user tabbing through the page skips right over it), doesn't respond to Enter/Space activation by default, doesn't get announced as a link by screen readers, and doesn't get any of the browser's native link behaviors (right-click "open in new tab," middle-click to open in background tab, showing the destination URL on hover/focus) — all of which a real `<a href="...">` provides automatically, with zero extra code.

</details>

---

# PART 10 — HTML Entities and Special Content

## What it is

**HTML entities** are special text sequences, always starting with `&` and ending with `;`, used to represent characters that either (a) have special meaning in HTML syntax itself and can't be typed literally, or (b) aren't easily typeable on a standard keyboard.

## Why it exists

Recall from Part 1: `<` and `>` are how the browser recognizes the start of a tag. So what happens if you actually want to display a literal `<` character as visible text — say, writing about HTML itself, or showing a "less than" comparison? Typing it directly would be interpreted as the start of a tag, breaking your markup.

```html
<!-- ❌ Broken: the browser tries to parse "<3" as the start of a tag -->
<p>I love HTML <3</p>

<!-- ✅ Correct: use the entity -->
<p>I love HTML &lt;3</p>
```

## The essential entities

| Entity | Renders as | When you need it |
|---|---|---|
| `&lt;` | `<` | Displaying a literal less-than sign or the start of what looks like a tag |
| `&gt;` | `>` | Displaying a literal greater-than sign (less strictly required than `&lt;`, but good practice for symmetry and clarity) |
| `&amp;` | `&` | Displaying a literal ampersand — `&` also has special meaning (it starts an entity!), so a raw `&` in text should generally be escaped |
| `&quot;` | `"` | Displaying a literal double-quote character, especially relevant inside an attribute value that's itself delimited with double quotes |
| `&apos;` | `'` | Displaying a literal single-quote/apostrophe, similarly relevant inside single-quoted attribute values |
| `&nbsp;` | (a space that won't break/wrap) | A **non-breaking space** — prevents the browser from wrapping a line at that specific space |

```html
<p>To make a link, use the &lt;a&gt; tag with an &quot;href&quot; attribute.</p>
<!-- Renders as: To make a link, use the <a> tag with an "href" attribute. -->

<p>Ben &amp; Jerry's is a well-known ice cream brand.</p>
<!-- Renders as: Ben & Jerry's is a well-known ice cream brand. -->

<p>10&nbsp;km</p>
<!-- The number and unit stay together on the same line, never wrapping between them -->
```

### `&nbsp;` — the non-breaking space, explained properly

Normal spaces are legal line-wrap points — the browser is free to break a line at any regular space if the text needs to wrap to fit its container. Sometimes that's undesirable: you don't want "10" and "km" to end up on different lines, or a person's initials to wrap apart from their surname. `&nbsp;` inserts a space character that *displays* identically to a normal space but is **never** treated as a valid line-break point.

```html
<p>Mr.&nbsp;Smith will arrive at 10&nbsp;AM.</p>
```

> ⚠️ **Common mistake** — Using `&nbsp;` purely to add extra visual spacing (e.g., typing `&nbsp;&nbsp;&nbsp;&nbsp;` to indent a line, or to add gap between two inline elements). This conflates a *content* concern (preventing an undesirable line break at one specific point) with a *presentation* concern (visual spacing), which is CSS's job (`margin`, `padding`, covered starting Part 18). Reach for `&nbsp;` only when you specifically need to prevent wrapping between two particular pieces of text, never as a general spacing hack.

## Unicode basics

Modern HTML, saved with UTF-8 encoding (recall `<meta charset="UTF-8">` from Part 1), can actually contain most special characters — accented letters, currency symbols, even emoji — **directly, as literal characters in the file**, with no entity needed at all:

```html
<p>Café, naïve, résumé — these work fine directly in a UTF-8 file.</p>
<p>Price: €49.99 or £42.50</p>
<p>I love HTML 🎉</p>
```

So when do you actually need entities, given UTF-8 support for nearly everything? In practice, almost exclusively for the small set of characters that have special *syntactic* meaning in HTML itself (`<`, `>`, `&`, and quote characters inside quoted attributes) — those need to be escaped regardless of encoding, because the issue isn't "can this character be represented," it's "this exact character means something else to the parser." Everything else — accented characters, symbols, emoji — can typically just be typed directly into a properly UTF-8-encoded file.

> 💡 **Tip** — There are hundreds of named HTML entities beyond the essential six above (`&copy;` for ©, `&trade;` for ™, `&hellip;` for … , `&mdash;` for —, and many more) — you don't need to memorize them; look them up when you need a specific special character and either use the named entity or, just as validly today, type the Unicode character directly since your file is UTF-8.

## Exercises — Part 10

1. Write a paragraph that correctly displays: `Use <strong> to add emphasis, not <b> & <i> for meaning.`
2. Why would `<p>5 < 10 and 10 > 5</p>` be broken HTML, and how would you fix it?
3. When is `&nbsp;` the correct tool, and when is it being misused?

<details>
<summary>View solutions</summary>

**1.**
```html
<p>Use &lt;strong&gt; to add emphasis, not &lt;b&gt; &amp; &lt;i&gt; for meaning.</p>
```

**2.** The `<` in `5 < 10` will be interpreted by the browser's parser as the start of a new tag (`< 10 and 10 >` looks like an attempt at a tag named " 10 and 10 " which is invalid and will likely just be dropped/ignored, silently breaking the visible content), rather than as literal text. Fixed:
```html
<p>5 &lt; 10 and 10 &gt; 5</p>
```

**3.** `&nbsp;` is correctly used when you need to prevent a line break at one *specific* space — e.g., keeping a number and its unit together ("10&nbsp;km"), or a title and a name together ("Mr.&nbsp;Smith"). It's misused when used purely to create visual spacing/indentation (e.g., multiple `&nbsp;` in a row to push content over) — that's a presentation concern that belongs in CSS (margin/padding), not a content-level line-break concern.

</details>

---

# PART 11 — HTML Metadata and SEO Basics

## What metadata is, and why it lives in `<head>`

Recall from Part 1: `<head>` holds information *about* the page rather than visible page content. This Part covers the specific metadata tags that matter for how your page is represented in browser tabs, search results, and when shared on social media — plus a grounded, honest discussion of what actually affects SEO (search engine optimization) versus common myths.

## `<title>` — done properly

```html
<title>Wireless Noise-Cancelling Headphones | AudioTech</title>
```

Covered briefly in Part 1; here's the depth. The `<title>` is what appears in:
- The browser tab.
- Browser bookmarks.
- The **clickable blue link text** in search engine results (this is a big deal — it's often the very first thing a potential visitor reads about your page).
- Social media link previews, in many cases (alongside Open Graph tags, below).

**Best practices for writing titles:**
- Be specific and descriptive — "Wireless Noise-Cancelling Headphones | AudioTech" tells a searcher and a search engine exactly what the page is, unlike "Home" or "Products."
- Put the most important, specific information first (searchers often only read the first few words before scanning elsewhere).
- Keep it reasonably concise — search engines typically truncate titles beyond roughly 50–60 characters in results, so front-load the important part.
- Every page on your site should have a **unique** title — using the same title everywhere gives search engines and users no way to distinguish pages.

## `<meta name="description">`

```html
<meta name="description" content="Experience studio-quality sound with AudioTech's wireless noise-cancelling headphones. 30-hour battery life, free shipping, 2-year warranty.">
```

This provides the **summary text** search engines often display beneath your title in search results (though search engines sometimes override it with their own extracted snippet if they judge it more relevant to the specific search query — this is normal and out of your control). It has **no direct impact on search ranking** — this is an important, honest correction to a common myth — but it has a very real *indirect* effect: a compelling, accurate description increases the click-through rate from people who see it in search results, which is valuable regardless of ranking position.

**Best practices:** roughly 150–160 characters, unique per page, an honest and specific summary of that page's actual content (not stuffed with unrelated keywords — search engines penalize that, and it misleads real users).

## The viewport meta tag — revisited

Already covered in full depth in Part 1 — `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — included here again only as a reminder that it belongs in this "essential head metadata" checklist for every page.

## Favicon

```html
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

The **favicon** ("favorite icon") is the small icon shown in browser tabs, bookmarks, and history. `<link rel="icon">` provides the general favicon; `<link rel="apple-touch-icon">` provides a (typically larger, 180×180px) version specifically used when a user adds your page to their iOS home screen. Modern practice increasingly favors SVG favicons for their crisp scaling across all display densities, often paired with a PNG fallback for older browser support.

## Open Graph basics — how links look when shared

```html
<meta property="og:title" content="Wireless Noise-Cancelling Headphones | AudioTech">
<meta property="og:description" content="Studio-quality sound, 30-hour battery, free shipping.">
<meta property="og:image" content="https://audiotech.example.com/images/headphones-og.jpg">
<meta property="og:url" content="https://audiotech.example.com/products/headphones">
<meta property="og:type" content="website">
```

**Open Graph** (originally created by Facebook, now a broadly adopted informal standard) controls how your page appears when someone pastes its link into social media, messaging apps, or Slack — the preview card with an image, title, and description. Without these tags, most platforms fall back to guessing from your `<title>`, meta description, and the first image they can find on the page — often producing a poor, inconsistent preview. Setting them explicitly gives you control over exactly what that preview shows.

- **`og:title`** / **`og:description`** — usually mirror (or slightly adapt) your `<title>`/meta description.
- **`og:image`** — a specific image chosen for link previews (typically recommended around 1200×630px), always as a full absolute URL (not relative — this tag gets read by external platforms' servers, which have no concept of "relative to this page").
- **`og:url`** — the canonical URL of this specific page.
- **`og:type`** — the kind of content (`website`, `article`, `product`, and others).

## Canonical link — avoiding duplicate content confusion

```html
<link rel="canonical" href="https://example.com/products/headphones">
```

The **conceptual problem this solves**: the same content is sometimes reachable via multiple URLs — with or without a trailing slash, with tracking query parameters appended, via `http` vs `https`, via `www.` vs no `www.`. Search engines might otherwise treat these as separate, duplicate pages, diluting the page's ranking signal across multiple URLs instead of consolidating it onto one. `rel="canonical"` tells search engines: "no matter which URL variant was used to reach this page, treat *this* URL as the single authoritative version."

## Robots meta basics

```html
<meta name="robots" content="index, follow">
<meta name="robots" content="noindex, nofollow">
```

Tells search engine crawlers how to treat this specific page:
- **`index`** (default) — this page may appear in search results. **`noindex`** — don't include this page in search results (useful for admin pages, thank-you pages, duplicate/internal-only content).
- **`follow`** (default) — the crawler may follow links found on this page to discover other pages. **`nofollow`** — don't follow links from this page.

## SEO — an honest, non-overpromising explanation

> ⚠️ **Common mistake** — A huge amount of misleading "SEO advice" online promises specific ranking improvements from specific tag combinations, or treats meta tags as some kind of hidden lever search engines primarily rely on. The honest picture is more modest: **the meta tags and semantic structure covered in this course (Parts 8 and 11) are necessary groundwork, not a ranking guarantee.** Modern search engines weigh an enormous number of signals — content quality and relevance to the search query, other sites linking to yours, page load performance (Part 48), mobile usability, how long visitors actually stay and engage, and many more — most of which are entirely outside what a meta tag can influence.

**What good HTML structure genuinely, honestly contributes to SEO:**
- A clear, correct heading hierarchy (Part 2) and semantic landmarks (Part 8) help search engines correctly parse *what your content actually is and how it's organized* — this is real and measurable.
- Descriptive, accurate `alt` text (Part 4) helps search engines understand and index images.
- Meaningful link text (Part 3) — not "click here" — helps search engines understand what the linked page is about.
- A correct, unique `<title>` and meta description per page genuinely improve click-through rate from search results (an indirect but real ranking-adjacent benefit).
- Fast-loading pages (Part 48) are an explicit, direct ranking factor for most major search engines.

**What it does not do:** guarantee any specific ranking position, override the fundamental need for genuinely useful, relevant content, or substitute for real inbound links from other reputable sites (a factor entirely outside HTML's control). Be skeptical of any advice implying otherwise.

## A complete, well-formed `<head>`

Pulling this Part together into a realistic, production-quality example:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wireless Noise-Cancelling Headphones | AudioTech</title>
  <meta name="description" content="Studio-quality sound with 30-hour battery life. Free shipping and a 2-year warranty on every pair.">
  <link rel="canonical" href="https://audiotech.example.com/products/headphones">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <meta property="og:title" content="Wireless Noise-Cancelling Headphones | AudioTech">
  <meta property="og:description" content="Studio-quality sound with 30-hour battery life.">
  <meta property="og:image" content="https://audiotech.example.com/images/headphones-og.jpg">
  <meta property="og:url" content="https://audiotech.example.com/products/headphones">
  <meta property="og:type" content="website">

  <link rel="stylesheet" href="/styles/main.css">
</head>
```

## Knowledge Check — Part 11

1. Why does `<title>` matter for both users and search engines, specifically?
2. Does the meta description directly affect search ranking? What does it actually affect?
3. What problem does `rel="canonical"` solve?
4. What's the difference between what `og:image` needs (relative or absolute URL) versus a normal `<img src>`, and why?
5. Name two HTML practices covered earlier in this course that have a genuine, honest connection to SEO, and explain the mechanism for each.

<details>
<summary>View solutions</summary>

1. For users, it's the primary text shown in browser tabs, bookmarks, and — most importantly — as the clickable headline in search results, directly influencing whether someone clicks through. For search engines, it's a strong signal of what the page is specifically about.
2. No — it has no direct ranking effect. What it genuinely affects is click-through rate: a compelling, accurate description shown beneath the title in search results makes users more likely to click, which is valuable independent of ranking position.
3. It solves duplicate-content confusion: when the same content is reachable via multiple URL variants (with/without trailing slash, with tracking parameters, http/https, www/non-www), `rel="canonical"` tells search engines which single URL should be treated as the authoritative version, consolidating ranking signal onto it instead of splitting it across duplicates.
4. `og:image` requires a full absolute URL, while `<img src>` can be relative. This is because Open Graph tags are read by external platforms' servers (Slack, Facebook, etc.) fetching your page's HTML from their own infrastructure — they have no concept of "relative to this page's location," so a relative path would be meaningless or broken in that context, unlike a browser rendering the page directly, which resolves relative paths against the current page's own URL.
5. Any two of: correct heading hierarchy/semantic landmarks (helps search engines parse content structure and topic), descriptive `alt` text (helps search engines understand and index images), meaningful link text instead of "click here" (helps search engines understand the linked page's topic), fast page load performance (an explicit, direct ranking factor for most major search engines).

</details>

---

# PART 12 — Accessibility Foundations

This Part is one of the most important in the entire course. Accessibility (often abbreviated **a11y** — "a," 11 letters, "y") is not an optional add-on skill for frontend developers; it's a core competency, on par with knowing the box model or Flexbox. Poor accessibility isn't a minor inconvenience for a small niche of users — it's a hard barrier that can make a site or application literally unusable for millions of people, and (in many jurisdictions and for many organizations) a genuine legal compliance requirement.

## Who accessibility is for, concretely

It's easy for "accessibility" to feel abstract until you ground it in real, specific user situations:

- **Screen reader users** — blind or low-vision users who navigate the web entirely by listening to a screen reader (like VoiceOver on macOS/iOS, NVDA or JAWS on Windows, TalkBack on Android) read the page's content and structure aloud, navigating with keyboard commands rather than a mouse/touch.
- **Keyboard-only users** — users who cannot use a mouse or touchscreen at all (due to motor impairments, tremors, or the use of assistive switch devices) and navigate entirely via keyboard — Tab to move between focusable elements, Enter/Space to activate them.
- **Low-vision users** — users who rely on browser zoom, high-contrast modes, or specific color/contrast requirements, without necessarily using a full screen reader.
- **Users with cognitive or attention differences** — who benefit from clear, consistent, predictable structure and generous, non-distracting motion/animation defaults.
- **Deaf/hard-of-hearing users** — who rely on captions for audio/video content (Part 4).
- **Temporarily or situationally impaired users** — a broken arm making a mouse difficult, a bright sunny day making low-contrast text unreadable, a noisy environment making audio content need captions even for a hearing user. Accessibility improvements benefit far more people, far more often, than a narrow "disabled users only" framing suggests.

## The single most important rule in accessibility

> **Use native HTML first. Use ARIA only when necessary.**

This one sentence, formalized by the accessibility community as the "first rule of ARIA," should guide essentially every decision in this Part. Native HTML elements (`<button>`, `<a>`, `<input>`, `<nav>`, headings) come with **built-in, browser-tested accessibility behavior for free** — correct keyboard interaction, correct roles announced to screen readers, correct focus behavior. Recreating that behavior manually with generic elements plus ARIA attributes plus JavaScript is difficult to get fully right, and it's very easy to get subtly, invisibly wrong in ways that are hard to catch without dedicated assistive-technology testing.

## Semantic HTML *is* the foundation of accessibility

Nearly everything taught in Parts 2, 4, 7, and 8 already *is* accessibility work:

- Correct heading hierarchy (Part 2) → screen reader users can navigate by heading level, building a mental map of the page's structure.
- Meaningful `alt` text (Part 4) → screen reader users get equivalent information from images.
- Properly labeled form fields (Part 7) → screen reader users know what each field is for.
- Semantic landmarks — `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>` (Part 8) → screen reader users can jump directly between major page regions instead of listening to the entire page linearly, top to bottom, every single time.

This is worth internalizing deeply: **you have already been learning accessibility this entire course.** This Part adds the pieces specific to interactivity and edge cases that go beyond what plain semantic structure covers on its own.

## Focus — what it is and why it's critical

### What it is

**Focus** is the concept of which single element on the page is currently "active" and ready to receive keyboard input — the element a Tab press moves *away from*, and the element Enter/Space would activate if it's interactive. Exactly one element (or none) has focus at any given time.

### Why it's critical

Keyboard-only users navigate *entirely* through focus — pressing Tab moves focus to the next focusable element in the page's DOM order, Shift+Tab moves backward, and Enter or Space activates the currently focused element. If an interactive element can't receive focus, a keyboard-only user **cannot use it at all** — not "it's slightly harder," literally cannot.

### Which elements are focusable by default

Natively focusable, no extra work required: `<a href="...">` (with an `href`!), `<button>`, `<input>`, `<textarea>`, `<select>`, and a few others. **Not** natively focusable: `<div>`, `<span>`, `<p>`, or any element with no `href`/no native interactive role.

```html
<!-- ❌ NOT keyboard focusable — a keyboard user cannot Tab to this or activate it -->
<div onclick="submitOrder()">Submit Order</div>

<!-- ✅ Keyboard focusable automatically, correct role announced, Enter/Space work natively -->
<button onclick="submitOrder()">Submit Order</button>
```

### The `tabindex` attribute

```html
<div tabindex="0">Now keyboard-focusable</div>
<div tabindex="-1">Focusable only programmatically, not via Tab key</div>
<div tabindex="3">Explicit, manually-specified tab order — almost always a bad idea</div>
```

- **`tabindex="0"`** — inserts the element into the page's *natural* tab order (wherever it sits in the DOM). This is the value you'd use if you genuinely must make a non-natively-focusable element focusable — though per the golden rule above, reaching for a real `<button>` instead is almost always the better fix.
- **`tabindex="-1"`** — removes an element from the Tab-key navigation order entirely, while still allowing it to be focused *programmatically* (via JavaScript, e.g., moving focus into a newly-opened modal).
- **`tabindex` with a positive number** (`1`, `2`, `3`...) — manually overrides the natural tab order with an explicit sequence. **This is almost always a mistake.** It's extremely difficult to maintain correctly as a page evolves, and it creates a jarring, unpredictable experience that fights against the page's actual visual/logical layout. The DOM's natural order — meaning your actual HTML source order — should be your tab order; if it isn't logical, the fix is to reorder your HTML, not to patch it with positive `tabindex` values.

> ⚠️ **Common mistake** — Using positive `tabindex` values to "fix" a tab order that only seems wrong because of CSS-driven visual reordering (e.g., using Flexbox's `order` property, covered in Part 24, to visually move an element without changing its DOM position). This creates a mismatch between visual order and keyboard tab order that is deeply disorienting for keyboard users. The real fix is to keep your DOM source order matching your intended reading/interaction order in the first place.

## `focus-visible` vs. `:focus` — a modern distinction

Browsers, by default, draw a visible **focus outline/ring** around the currently focused element (usually a blue glow or outline) — this is genuinely important, not decorative; it's the *only* visual indicator a sighted keyboard user has of where they currently are on the page. We'll cover the exact CSS mechanics of `:focus` vs `:focus-visible` in Part 14; the conceptual point belongs here: **never remove focus outlines (`outline: none`) without providing an equally or more visible custom replacement.** This is one of the most common, most damaging accessibility mistakes in frontend development, and it's almost always done purely for aesthetic reasons ("I don't like how the blue outline looks") without any replacement, leaving keyboard users with literally no visual indication of their position on the page.

## Accessible names — the core concept behind labels, alt text, and ARIA

### What it is

Every interactive element (and many non-interactive ones) has what accessibility tooling and screen readers call an **accessible name** — the text announced to describe what that element *is* or *does*. You've already been creating accessible names this entire course without necessarily using that term:

- A `<button>`'s accessible name is its text content: `<button>Submit</button>` → accessible name "Submit."
- An `<img>`'s accessible name is its `alt` text.
- An `<input>`'s accessible name comes from its associated `<label>`.
- An `<a>`'s accessible name is its link text.

### When there's no visible text — `aria-label`

Sometimes an interactive element has no visible text at all — commonly, an icon-only button:

```html
<!-- ❌ No accessible name at all — a screen reader announces just "button," with zero context -->
<button><svg><!-- a trash-can icon --></svg></button>

<!-- ✅ aria-label provides an accessible name with no visible text needed -->
<button aria-label="Delete item"><svg><!-- a trash-can icon --></svg></button>
```

`aria-label="..."` provides an accessible name directly, as an attribute, without adding any visible text to the page. This is one of the legitimate, necessary uses of ARIA — precisely the "when necessary" case the golden rule allows for, since there's no native HTML mechanism for "give this element an invisible text label."

### `aria-labelledby` — pointing to existing visible text elsewhere

```html
<h2 id="settings-heading">Notification Settings</h2>
<section aria-labelledby="settings-heading">
  ...
</section>
```

`aria-labelledby` gives an element an accessible name by **referencing the `id` of some other element already on the page**, rather than duplicating the text inline as `aria-label` would. Useful when the visible label text already exists elsewhere and you don't want to repeat it (and risk the two copies drifting out of sync if one is edited later).

### `aria-describedby` — supplementary description, not the name itself

```html
<label for="password">Password</label>
<input type="password" id="password" aria-describedby="password-hint">
<p id="password-hint">Must be at least 8 characters, including one number.</p>
```

`aria-describedby` links an element to *additional descriptive text* (announced *after* the accessible name, as supplementary information) — distinct from the accessible name itself. A screen reader user focusing this input hears both the label ("Password") and, following it, the hint text — exactly the same information a sighted user gets by seeing both the label and the hint text visually together.

## `aria-expanded` — communicating toggle/disclosure state

```html
<button aria-expanded="false" aria-controls="menu-panel">
  Menu
</button>
<ul id="menu-panel" hidden>
  <li><a href="/">Home</a></li>
</ul>
```

For any control that shows/hides other content (a dropdown, an accordion, a mobile nav toggle), `aria-expanded="true"`/`"false"` communicates the current open/closed state to screen readers — since a sighted user can *see* whether the panel is currently open, but a screen reader user needs that state announced explicitly. (In real usage, JavaScript would toggle this attribute's value along with actually showing/hiding the panel — outside this course's HTML/CSS scope, but the markup pattern itself belongs here.)

## `aria-hidden` — hiding decorative content from assistive technology

```html
<button>
  <span aria-hidden="true">🗑️</span>
  Delete
</button>
```

`aria-hidden="true"` hides an element **from assistive technology specifically**, while leaving it fully visible on screen. This is the correct pattern for purely decorative icons that sit *alongside* real text that already conveys the same meaning (here, the emoji is redundant with the word "Delete" — without `aria-hidden`, a screen reader might announce something confusing like "trash icon emoji, Delete").

> ⚠️ **Common mistake** — Confusing `aria-hidden="true"` with actually hiding an element visually. They are unrelated: `aria-hidden="true"` still displays the element on screen but removes it from the accessibility tree (screen readers skip it); CSS's `display: none` or `visibility: hidden` (Part 19) hides it visually *and* from assistive technology; and `hidden` (the plain HTML attribute) does both as well. Never put `aria-hidden="true"` on content that is the *only* way to convey some piece of information — that hides it from screen reader users entirely with no visual-only justification.

## The `role` attribute

```html
<div role="button" tabindex="0">Fake button — don't do this</div>
```

`role` overrides what an element is announced as to assistive technology. It exists for cases where you're forced to build a custom widget with no matching native element (a complex custom dropdown, a tab interface) — but per the golden rule, **`role="button"` on a `<div>` is dramatically inferior to just using a real `<button>`**, because `role` only changes what's *announced*; it does absolutely nothing to grant native keyboard focusability, Enter/Space activation, or any of the other built-in behaviors a real `<button>` gets for free. You'd have to manually reimplement `tabindex="0"`, a keydown handler for Enter and Space, and more — all to imperfectly recreate what `<button>` already does correctly, automatically.

```html
<!-- ❌ A LOT of extra work to badly reinvent something free -->
<div role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ')doAction()" onclick="doAction()">
  Click me
</div>

<!-- ✅ All of that, for free, correctly, automatically -->
<button onclick="doAction()">Click me</button>
```

## Why `<div onclick="...">` is (usually) worse than `<button>`

Pulling together everything from this Part into a direct, concrete comparison:

| Capability | `<div onclick="...">` | `<button>` |
|---|---|---|
| Keyboard focusable | ❌ No (without manual `tabindex="0"`) | ✅ Yes, automatically |
| Enter key activates it | ❌ No (without manual JS) | ✅ Yes, automatically |
| Space key activates it | ❌ No (without manual JS) | ✅ Yes, automatically |
| Announced as "button" to screen readers | ❌ No (without manual `role="button"`) | ✅ Yes, automatically |
| Disabled state support | ❌ Manual, imperfect | ✅ Native `disabled` attribute |
| Correct default styling cues (cursor, etc.) | ❌ Manual | ✅ Sensible browser defaults |

Every single row in the "✅" column for `<button>` costs you zero extra code. Every "❌ manual" in the `<div>` column is an opportunity to get something subtly wrong — miss a keyboard case, forget the ARIA role, forget to handle the disabled state — in ways that are easy to miss in casual visual testing but represent a hard, complete barrier for keyboard and screen reader users.

## Misuse examples — a quick gallery

```html
<!-- ❌ Empty alt on a meaningful image — hides real information from screen reader users -->
<img src="warning-icon.png" alt="">
<p>Do not proceed without reading the safety instructions.</p>

<!-- ❌ aria-label duplicating visible text unnecessarily (harmless but redundant) -->
<button aria-label="Submit">Submit</button>

<!-- ❌ role misused where a native element already provides that role -->
<button role="button">Click</button>

<!-- ❌ Heading chosen for size, breaking the outline (from Part 2, repeated here because
     it's fundamentally an accessibility issue, not just a "structure" nitpick) -->
<h1>Page Title</h1>
<h5>Next section</h5> <!-- should be h2 -->

<!-- ❌ tabindex misused to force an unnatural, hard-to-maintain tab order -->
<input tabindex="1" ...>
<input tabindex="3" ...>
<input tabindex="2" ...>
```

## Building an accessible component, start to finish: a toggle button

Pulling this entire Part together into one realistic component:

```html
<button
  type="button"
  aria-pressed="false"
  aria-label="Toggle dark mode">
  <svg aria-hidden="true"><!-- moon/sun icon --></svg>
</button>
```

- Real `<button>` → free keyboard focusability, Enter/Space activation, correct default role.
- `type="button"` → explicitly not a form-submit action (Part 7).
- `aria-pressed="false"` → communicates this is a toggle button and its current state (would be updated to `"true"` by JavaScript when toggled — a native ARIA state specifically for on/off toggle buttons).
- `aria-label` → gives it an accessible name, since it contains no visible text, only an icon.
- `aria-hidden="true"` on the icon → prevents the decorative SVG from being separately, redundantly announced, since `aria-label` on the button already provides the complete accessible name.

## Knowledge Check — Part 12

1. State the "golden rule" of ARIA usage in your own words.
2. Why is focus specifically critical for keyboard-only users — what literally cannot happen without it?
3. Which of these are natively keyboard-focusable by default: `<div>`, `<a href="/">`, `<span>`, `<button>`, `<p>`?
4. What's the real difference between `tabindex="0"`, `tabindex="-1"`, and a positive `tabindex` value?
5. Why is manually assigning positive `tabindex` values almost always a bad idea?
6. What's the difference between `aria-label` and `aria-labelledby`?
7. What's the difference between `aria-describedby` and the accessible name itself?
8. What does `aria-hidden="true"` actually do — and what does it not do?
9. List at least four things a real `<button>` gives you for free that a `<div role="button">` does not, without extra manual work.
10. Why should you never remove focus outlines (`outline: none`) without providing a replacement?

<details>
<summary>View solutions</summary>

1. Use real, native HTML elements and their built-in accessible behavior whenever one exists that fits; reach for ARIA attributes only for the cases native HTML genuinely cannot handle on its own (like naming an icon-only button, since there's no native attribute for "invisible accessible name").
2. Keyboard-only users navigate and interact entirely via focus (Tab to move, Enter/Space to activate). If an interactive element cannot receive focus, a keyboard-only user cannot move to it or activate it at all — not "with difficulty," but literally cannot use it.
3. `<a href="/">` and `<button>` are natively focusable. `<div>`, `<span>`, and `<p>` are not, by default.
4. `tabindex="0"` inserts an element into the natural (DOM-order) tab sequence, making it focusable via Tab. `tabindex="-1"` makes an element focusable only programmatically (via JavaScript), removing it from the Tab-key sequence entirely. A positive `tabindex` value manually overrides the natural tab order with an explicit numeric sequence.
5. It's extremely difficult to keep synchronized correctly as a page's structure evolves over time, and it creates a jarring mismatch between the page's visual/logical layout and the actual keyboard navigation order — disorienting for keyboard users. The correct fix for a bad tab order is reordering the actual HTML/DOM, not patching it with explicit numeric values.
6. `aria-label` provides an accessible name directly as a string in the attribute itself, with no visible on-page text required. `aria-labelledby` provides an accessible name by referencing the `id` of another, already-visible element on the page, reusing its text rather than duplicating it.
7. The accessible name is the primary identifying label for an element (what it "is," announced first). `aria-describedby` links to supplementary descriptive text announced *after* the name, providing additional context (like a form field's format hint) — it does not replace or serve as the accessible name itself.
8. It hides the element from assistive technology (screen readers skip it entirely) while leaving it fully, visually displayed on screen. It does not hide the element visually — that requires `display: none`, `visibility: hidden`, or the `hidden` attribute instead.
9. Any four of: native keyboard focusability, Enter key activation, Space key activation, automatic "button" role announced to screen readers, native `disabled` attribute support, sensible default browser styling/cursor behavior.
10. Because the focus outline is the only visual indicator a sighted keyboard-only user has of their current position on the page. Removing it with no replacement leaves such users with no way to visually track where keyboard focus currently is, making the page effectively unusable for them even though it may look fine to a mouse user.

</details>

## Coding Challenge — Part 12

Take this inaccessible markup and rewrite it to be fully accessible, applying everything from Parts 1–12:

```html
<div class="page">
  <div class="top-bar">
    <div class="logo">ShopEase</div>
    <div class="search-icon" onclick="openSearch()">🔍</div>
  </div>
  <div class="content">
    <div class="title">Wireless Earbuds</div>
    <img src="earbuds.jpg">
    <div class="price">$59.99</div>
    <div class="buy-button" onclick="addToCart()">Add to Cart</div>
  </div>
</div>
```

<details>
<summary>View solution</summary>

```html
<body>
  <header>
    <h1>ShopEase</h1>
    <button type="button" aria-label="Open search" onclick="openSearch()">
      <span aria-hidden="true">🔍</span>
    </button>
  </header>

  <main>
    <article>
      <h2>Wireless Earbuds</h2>
      <img src="earbuds.jpg" alt="White wireless earbuds in an open charging case">
      <p>$59.99</p>
      <button type="button" onclick="addToCart()">Add to Cart</button>
    </article>
  </main>
</body>
```

**What changed and why:**
- `<div class="top-bar">` → `<header>` (Part 8: introductory page content, includes site title and controls).
- `<div class="logo">ShopEase</div>` → `<h1>ShopEase</h1>` (Part 2: this is the site's primary heading, not meaningless generic text — though on an inner page, this might instead be a styled link back home with an `<h1>` reserved for the page's actual main topic; either is defensible depending on the page's role).
- `<div class="search-icon" onclick="...">` → real `<button>` with `aria-label` (Part 12: icon-only control needs native focusability plus an accessible name) and the emoji wrapped in `<span aria-hidden="true">` (Part 12: decorative icon, redundant with the aria-label, hidden from assistive tech).
- `<div class="content">` → `<main>` wrapping an `<article>` (Part 8: this is the page's unique primary content, and specifically a self-contained, independently meaningful product listing).
- `<div class="title">` → `<h2>` (Part 2/8: a real heading, at a level nested correctly under the implicit page structure).
- `<img src="earbuds.jpg">` → added required, descriptive `alt` text (Part 4).
- `<div class="price">` → left as a `<p>` (or could remain a styled `<span>`/`<div>` if purely for layout — plain price text has no more specific semantic element, so simple text markup is appropriate).
- `<div class="buy-button" onclick="...">` → real `<button type="button">` (Part 7/12: this is an action, not navigation, and needs native keyboard focusability/activation).

</details>

---

**Foundations complete.** Parts 0–12 covered HTML from the ground up: how the web works, document structure, text semantics, links, media, lists, tables, forms in full depth, page-level semantic structure, generic containers, entities, metadata/SEO, and accessibility foundations. Every CSS Part from here forward assumes this HTML knowledge as a given — we'll be styling exactly the elements and patterns just covered.

---

# PART 13 — Introduction to CSS

## What CSS is

### What it is

**CSS** stands for **Cascading Style Sheets**. It's a language for describing the *presentation* of HTML content — colors, spacing, sizing, positioning, typography, layout, and animation — completely separately from the HTML that defines the content's structure and meaning (Part 0's three-layer split, now made concrete).

### Why it exists

In HTML's early years, presentation was controlled by presentational *attributes and tags directly in the HTML* — `<font color="red" size="5">`, `<center>`, `bgcolor="yellow"` on `<body>`. This tightly coupled content and appearance: changing a site's color scheme meant hunting through every single page's HTML, one tag at a time. CSS was created specifically to separate these concerns — write your HTML once, describing structure and meaning, and control appearance entirely from a separate stylesheet (or set of stylesheets) that can be changed independently, applied consistently across an entire site, and reused.

### Anatomy of a CSS rule

```css
selector {
    property: value;
}
```

```text
   p {
      color: darkslategray;
   }
   │        │      │
   │        │      └── value: what the property should be set to
   │        └── property: the specific visual aspect being controlled
   └── selector: which element(s) this rule applies to
```

- A **selector** identifies *which* HTML element(s) a rule applies to (Part 14 covers selectors in exhaustive depth).
- A **declaration** is a single `property: value;` pair.
- A **declaration block** — the `{ }` and everything inside — can hold multiple declarations, each ending with a semicolon.
- A **rule** (or "ruleset") is a selector plus its declaration block.

```css
p {
    color: darkslategray;
    font-size: 16px;
    line-height: 1.5;
}
```

This rule says: "for every `<p>` element, set its text color to dark slate gray, its font size to 16 pixels, and its line height to 1.5 times the font size."

> ⚠️ **Common mistake** — Forgetting the semicolon at the end of a declaration. While the *last* declaration in a block technically works without one (CSS is somewhat forgiving here), it's a genuinely bad habit: if you later add another declaration after it without adding the missing semicolon first, you'll accidentally merge two declarations into one invalid line, and CSS will typically just silently ignore the broken declaration rather than showing an error. Always terminate every declaration with a semicolon, no exceptions, as a defensive habit.

## Three ways to apply CSS to HTML

### Inline CSS

```html
<p style="color: darkslategray; font-size: 16px;">Some text.</p>
```

CSS written directly in an element's `style` attribute, applying only to that one element. This is generally the **least preferred** method for anything beyond a genuinely one-off, throwaway situation (or CSS generated dynamically by JavaScript at runtime, which is a different, legitimate use case outside this course's scope) — it can't be reused across elements, it's difficult to maintain at scale, and (as you'll learn in Part 15) it has extremely high specificity, making it hard to override later from a real stylesheet.

### Internal CSS

```html
<head>
  <style>
    p {
        color: darkslategray;
        font-size: 16px;
    }
  </style>
</head>
```

CSS written inside a `<style>` tag in the document's `<head>`, applying to the entire page. Better than inline CSS (reusable across all matching elements on that page, easier to read as a block), but still limited to a single HTML file — if you have a multi-page site, you'd have to duplicate the same `<style>` block into every single page, and any change means editing every page individually.

### External CSS

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

```css
/* styles.css */
p {
    color: darkslategray;
    font-size: 16px;
}
```

CSS written in a completely separate `.css` file, linked into the HTML document via `<link rel="stylesheet" href="...">`. This is, in the overwhelming majority of real-world and professional situations, **the correct approach**, for concrete reasons:

- **One file, many pages** — link the same stylesheet from every page of a multi-page site; a single edit updates the styling everywhere at once.
- **Browser caching** — the browser downloads the CSS file once and reuses the cached copy across every page that links to it, rather than re-parsing identical `<style>` blocks embedded in every single HTML file.
- **Separation of concerns** — your HTML files stay focused purely on structure/content; your CSS file(s) stay focused purely on presentation, exactly matching the three-layer model from Part 0.
- **Maintainability at scale** — for anything beyond a tiny single-page demo, external CSS is what makes a real project's styling manageable as it grows.

> 💡 **Tip** — As a working default for this entire course from here forward: use external CSS. We'll use internal `<style>` blocks occasionally in short, isolated examples purely for compactness on the page, but understand that real projects should almost always use external stylesheets.

## Knowledge Check — Part 13

1. What problem was CSS specifically created to solve?
2. Identify the selector, property, and value in: `h1 { margin-bottom: 20px; }`
3. Rank the three CSS application methods from least to most maintainable for a real, multi-page project, and explain why.
4. Why does browser caching specifically favor external CSS over internal `<style>` blocks?

<details>
<summary>View solutions</summary>

1. Coupling of content/structure and presentation in early HTML (via presentational tags/attributes like `<font>` and `bgcolor`), which made styling changes require editing every page's HTML individually. CSS separates presentation into its own layer, controllable independently of content.
2. Selector: `h1`. Property: `margin-bottom`. Value: `20px`.
3. Least to most maintainable: inline CSS (single-element only, not reusable, hard to override later), internal `<style>` (page-wide but must be duplicated into every HTML file in a multi-page site), external CSS (one file linked from every page, single edit point, cacheable). External CSS is the professional default for real projects.
4. Because an external `.css` file is a single, separate resource the browser downloads once and can cache/reuse across every page that links to it; internal `<style>` blocks are embedded directly inside each individual HTML file's markup, so identical CSS embedded across multiple pages gets re-parsed (and, without a shared external file, potentially re-downloaded as part of each full HTML page) rather than served from a single cached resource.

</details>

---

# PART 14 — CSS Selectors

Selectors are how you tell the browser *which* elements a CSS rule should apply to. This is one of the special-focus areas of this course — selectors are the vocabulary you'll use in literally every single CSS rule you ever write, for the rest of your career, so real fluency here pays off constantly.

## Basic selectors

### Universal selector

```css
* {
    box-sizing: border-box;
}
```

The `*` selector matches **every single element** on the page. Used sparingly — most commonly for global resets (Part 36) like the `box-sizing` reset you'll learn in Part 18, or `margin: 0;` resets.

### Element (type) selector

```css
p {
    line-height: 1.6;
}

h2 {
    color: navy;
}
```

Matches every element of that HTML tag name, everywhere on the page. Simple, but broad — styling `p` directly affects *every* paragraph on the entire page, which is often too broad for anything beyond very general base styling (more on scoping this down next).

### Class selector

```css
.card {
    padding: 16px;
    border-radius: 8px;
}
```

```html
<div class="card">...</div>
<div class="card">...</div>
```

Matches every element carrying that specific `class` attribute value, prefixed with a `.` in CSS. Classes are **reusable** — apply the same class to as many elements as you want, anywhere in the document, and they'll all receive the same styling. This is, by a wide margin, the **most common selector type in real-world CSS** — the vast majority of styling in a professional codebase targets classes, not raw element types or IDs.

An element can carry multiple classes, space-separated:

```html
<button class="btn btn-primary btn-large">Submit</button>
```

```css
.btn { padding: 10px 20px; border-radius: 4px; }
.btn-primary { background: blue; color: white; }
.btn-large { font-size: 18px; }
```

All three rules apply simultaneously to this one button — this composable, multi-class pattern is foundational to the CSS architecture approaches covered later in Part 35.

### ID selector

```css
#site-header {
    position: sticky;
    top: 0;
}
```

```html
<header id="site-header">...</header>
```

Matches the single element carrying that specific `id` value, prefixed with `#` in CSS. Recall from earlier Parts: an `id` value must be **unique within the entire page** — using the same `id` on multiple elements is invalid HTML and produces unpredictable behavior (only the first match may be reliably targeted by CSS and JavaScript alike). Because of this uniqueness constraint, ID selectors are generally used more sparingly than class selectors in modern CSS practice — reserved for genuinely one-off, page-unique elements (a single header, a single main nav) — and, as you'll learn in Part 15, they carry meaningfully higher specificity than classes, which can create maintainability friction later if overused for general styling.

### Attribute selectors

```css
input[type="email"] {
    border-color: steelblue;
}

a[target="_blank"] {
    background: url(external-icon.svg) no-repeat right center;
}

a[href^="https://"] {
    /* href starts with "https://" */
}

a[href$=".pdf"] {
    /* href ends with ".pdf" */
}

a[href*="example.com"] {
    /* href contains "example.com" anywhere */
}
```

Attribute selectors match elements based on the presence, exact value, or a pattern within an attribute's value:

| Syntax | Matches |
|---|---|
| `[attr]` | Element has the attribute at all, any value |
| `[attr="value"]` | Attribute equals exactly this value |
| `[attr^="value"]` | Attribute value **starts with** this string |
| `[attr$="value"]` | Attribute value **ends with** this string |
| `[attr*="value"]` | Attribute value **contains** this string anywhere |
| `[attr~="value"]` | Attribute value contains this word among space-separated words |

These are especially useful for styling based on HTML semantics you've already learned — different `input[type]` values (Part 7), `[href^="mailto:"]` links, `[required]` fields, `[disabled]` states — without needing to add extra classes just to distinguish them.

## Combinators — describing relationships between elements

```text
<article>                       ← ancestor of everything below
  <header>                      ← child of article, parent of h2
    <h2>Title</h2>              ← descendant of article, child of header
  </header>
  <p>First paragraph</p>        ← child of article, sibling of the next p
  <p>Second paragraph</p>       ← adjacent sibling of the first p
  <aside>Note</aside>           ← sibling of both p elements
</article>
```

### Descendant combinator (space)

```css
article p {
    margin-bottom: 1em;
}
```

Matches any `<p>` that is a descendant of an `<article>` **at any nesting depth** — a direct child, a grandchild, arbitrarily deep. This is the most commonly used combinator.

### Child combinator (`>`)

```css
article > p {
    margin-bottom: 1em;
}
```

Matches only `<p>` elements that are a **direct child** of an `<article>` — one level deep, exactly. A `<p>` nested inside a `<div>` inside the `<article>` would **not** match this rule (though it would match the descendant combinator version above).

```text
Descendant (article p) matches BOTH p elements below:
<article>
  <p>Matches — direct child</p>
  <div>
    <p>Also matches — descendant, just deeper</p>
  </div>
</article>

Child (article > p) matches ONLY the first p below:
<article>
  <p>Matches — direct child</p>
  <div>
    <p>Does NOT match — not a direct child of article</p>
  </div>
</article>
```

### Adjacent sibling combinator (`+`)

```css
h2 + p {
    font-weight: bold;
}
```

Matches an element that is **immediately preceded by** a specific sibling — here, a `<p>` that comes directly after an `<h2>`, with nothing in between. Only the *first* paragraph right after each `<h2>` matches; a second, third paragraph after it would not.

### General sibling combinator (`~`)

```css
h2 ~ p {
    color: gray;
}
```

Matches every sibling element that comes **after** a specific sibling, anywhere later among the same set of siblings — not just the immediately adjacent one. Every `<p>` that shares a parent with, and comes after, an `<h2>` matches, no matter how many other elements sit between them.

```text
<article>
  <h2>Title</h2>
  <p>Matches h2 + p AND h2 ~ p (immediately after)</p>
  <div>...</div>
  <p>Does NOT match h2 + p, but DOES match h2 ~ p (later sibling)</p>
</article>
```

## Pseudo-classes

A **pseudo-class** selects elements based on a *state* or *condition* that isn't directly expressed by an attribute or tag name — often something dynamic (user interaction) or positional (where an element sits among its siblings).

### Interaction states

```css
a:hover {
    text-decoration: underline;
}

button:active {
    transform: scale(0.98);
}

input:focus {
    outline: 2px solid steelblue;
}

a:visited {
    color: purple;
}
```

- **`:hover`** — while the pointer is positioned over the element.
- **`:active`** — while the element is being actively clicked/pressed (the brief moment between mouse-down and mouse-up).
- **`:focus`** — while the element currently has keyboard focus (recall Part 12 — this is the CSS mechanism behind that critical visible focus indicator).
- **`:visited`** — a link whose destination URL the user's browser has previously visited. Note: for privacy/security reasons, browsers heavily restrict which CSS properties can actually be styled on `:visited` (essentially just color-related properties) — you cannot use `:visited` to detect and leak a user's browsing history through more elaborate styling differences.

### `:focus-visible` — the modern, smarter focus indicator

```css
button:focus {
    /* applies to EVERY focus event, including a mouse click */
}

button:focus-visible {
    /* applies only when the browser judges focus should be visibly indicated —
       typically keyboard navigation, not a mouse click */
    outline: 2px solid steelblue;
}
```

Here's the real problem `:focus-visible` solves: `:focus` fires for *any* way of focusing an element, including a plain mouse click — and many designers, understandably, don't want a visible focus ring appearing every time a mouse user clicks a button (it can look inconsistent with a "clean" mouse-driven visual design). But naively solving that by writing `button:focus { outline: none; }` **removes the focus ring for keyboard users too** — recreating exactly the accessibility failure flagged as a critical mistake in Part 12.

`:focus-visible` is the browser's own built-in heuristic for "should a focus indicator actually be shown right now" — generally: **yes** for keyboard navigation (Tab), generally **no** for a mouse click on a button (where the visual click feedback itself is enough) — letting you style a clean, un-ringed mouse-click experience *and* a fully accessible, clearly visible keyboard focus experience, correctly, without having to choose between them.

```css
/* The modern, correct, accessible pattern: */
button:focus {
    outline: none; /* remove default outline only when :focus-visible will handle it */
}

button:focus-visible {
    outline: 3px solid steelblue;
    outline-offset: 2px;
}
```

> ♿ **Accessibility note** — This exact pattern — relying on `:focus-visible` rather than unconditionally removing `:focus` styling — is the correct modern solution to "I don't like the default focus ring," full stop. There is no scenario where simply deleting focus indication with no `:focus-visible` replacement is the right call.

### Form and validation states

```css
input:checked { /* a checked checkbox/radio */ }
input:disabled { /* a disabled field */ }
input:required { /* a field with the required attribute */ }
input:valid { /* a field whose current value passes validation */ }
input:invalid { /* a field whose current value fails validation */ }
```

These correspond directly to the form concepts from Part 7 — you can visually style a checked checkbox differently, gray out disabled fields, mark required fields with a visual indicator, or show green/red validation styling as the user types, entirely with CSS, no JavaScript required for the basic visual feedback (we build complete examples of this in Part 34).

### Structural/positional pseudo-classes

```css
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(2) { color: red; }
li:nth-child(odd) { background: #f5f5f5; }
li:nth-child(even) { background: white; }
li:nth-child(3n) { /* every 3rd item: 3, 6, 9... */ }
li:nth-child(3n+1) { /* every 3rd item, starting from the 1st: 1, 4, 7... */ }
```

- **`:first-child`** — matches an element only if it's the *first* child of its parent.
- **`:last-child`** — matches an element only if it's the *last* child of its parent.
- **`:nth-child(n)`** — matches based on numeric position among siblings, extremely flexible: a plain number (`2` — the 2nd child exactly), keywords (`odd`, `even`), or a formula (`an+b` — `3n` means every multiple of 3, `3n+1` means every multiple of 3 offset by 1, producing 1, 4, 7, 10...).

```text
:nth-child(3n+1) walked through, for a list of 10 items:

n = 0 → 3(0)+1 = 1st item   ✓ matches
n = 1 → 3(1)+1 = 4th item   ✓ matches
n = 2 → 3(2)+1 = 7th item   ✓ matches
n = 3 → 3(3)+1 = 10th item  ✓ matches
n = 4 → 3(4)+1 = 13th item  (doesn't exist in a 10-item list, stops)

Result: items 1, 4, 7, 10 match. This is the classic "every 3rd item" pattern
used constantly for grid/card layouts needing a repeating visual rhythm.
```

### `:nth-of-type()` — the crucial distinction from `:nth-child()`

```html
<article>
  <h2>Title</h2>
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <p>Third paragraph</p>
</article>
```

```css
p:nth-child(2) {
    /* Looks for the 2nd CHILD of article overall, of any tag — but the 2nd
       child here is the FIRST <p> (since h2 is child #1). This does NOT
       match "the 2nd paragraph" the way you might expect. */
}

p:nth-of-type(2) {
    /* Looks specifically among only the <p> elements, counting just them,
       ignoring the h2 entirely — this correctly matches the SECOND paragraph. */
}
```

This is one of the most common, genuinely confusing beginner mistakes with `nth-` selectors:

> ⚠️ **Common mistake** — `:nth-child(n)` counts an element's position among **all** its siblings, regardless of tag type, and only then checks whether *that specific positioned sibling* happens to match your selector's tag. `:nth-of-type(n)` instead counts position **only among siblings of the same tag type**, ignoring any other tag types interspersed between them. When there's a mix of different tag types among siblings (like the `h2` before the `p`s above), these two produce different, easily-confused results. If you specifically want "the Nth element of this specific tag among its siblings," `:nth-of-type()` is almost always the one you actually mean.

### Logical/combinator pseudo-classes: `:not()`, `:is()`, `:where()`, `:has()`

```css
li:not(.active) {
    opacity: 0.6;
}
```

**`:not()`** — matches elements that do **not** match the selector inside its parentheses. Here: every `<li>` except ones with the `active` class.

```css
/* Without :is() — repetitive */
header a:hover, main a:hover, footer a:hover {
    text-decoration: underline;
}

/* With :is() — identical result, far more concise */
:is(header, main, footer) a:hover {
    text-decoration: underline;
}
```

**`:is()`** — takes a list of selectors and matches if the element matches *any* of them, letting you write a single combined rule instead of a long comma-separated list of nearly-identical selectors, especially useful for deeply nested combinator patterns.

```css
:where(header, main, footer) a {
    color: navy;
}
```

**`:where()`** — functions almost identically to `:is()` in terms of *which elements match*, but with one crucial difference covered in depth in Part 15: **`:where()` always contributes zero specificity**, no matter how complex the selector inside it is, while `:is()` takes on the specificity of its *most specific* argument. This makes `:where()` particularly valuable for base/reset styles that you want to be trivially easy to override later without a specificity fight.

```css
article:has(> img) {
    display: grid;
    grid-template-columns: 200px 1fr;
}
```

**`:has()`** — matches an element if it **contains** a match for the selector inside its parentheses — often described as the long-awaited "parent selector," since it lets you select an element based on what's *inside* it, something CSS previously had no way to express at all. `article:has(> img)` matches an `<article>` specifically when it has a direct-child `<img>` inside it — letting you apply different layout depending on an article's actual content, without needing JavaScript or an extra manually-added class.

```css
/* A very practical real-world :has() pattern */
.form-field:has(input:invalid) {
    border-left: 3px solid crimson;
}
```

## Pseudo-elements

A **pseudo-element** targets a specific *part* of an element's content or box — not a different state of the whole element (that's pseudo-*classes*, one colon), but a sub-portion of it, conceptually a "fake" extra element the browser generates (using two colons in modern CSS syntax, `::`, to visually distinguish them from pseudo-classes, though a single colon still works for the original four due to legacy compatibility).

```css
p::first-letter {
    font-size: 3em;
    font-weight: bold;
    float: left;
}
```

**`::first-letter`** — targets just the first letter of a block's text content — the classic "drop cap" typographic effect seen in print design and long-form articles.

```css
p::first-line {
    font-weight: bold;
}
```

**`::first-line`** — targets just the first rendered line of a block's text (note: this depends on the actual *rendered* line, which changes based on the container's width — it is not the first sentence or first literal line of your HTML source).

```css
::selection {
    background: gold;
    color: black;
}
```

**`::selection`** — styles the text a user has currently highlighted/selected with their cursor.

```css
li::marker {
    color: crimson;
}
```

**`::marker`** — styles a list item's bullet or number marker directly, without needing older, hackier techniques.

```css
input::placeholder {
    color: #999;
    font-style: italic;
}
```

**`::placeholder`** — styles the placeholder text (Part 7) shown inside an empty input.

```css
.tooltip::before {
    content: "→ ";
}

.external-link::after {
    content: " (opens in new tab)";
}
```

**`::before`** and **`::after`** — the two most powerful and heavily-used pseudo-elements in all of CSS. They insert **generated content** immediately before or after an element's actual content, entirely from CSS, using the `content` property (required for them to render at all — without a `content` value, even an empty string `content: ""`, they don't appear). This unlocks decorative content — icons, shapes, decorative quote marks, tooltip arrows, clearfix hacks (historical, Part 46) — without adding extra, meaningless markup to your HTML purely for visual purposes.

```css
.card {
    position: relative;
}
.card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: steelblue;
}
```

This example — an empty-content decorative accent bar — is an extremely common real-world pattern: adding a purely visual decorative element with zero extra HTML.

> ⚠️ **Common mistake** — Using `::before`/`::after` generated content to insert information that's actually *meaningful*, not purely decorative (e.g., putting essential instructions or data inside `content: "..."`). Content injected this way is invisible to some assistive technology contexts, isn't selectable/copyable as normal text in every browser, and isn't present in the actual DOM/HTML at all — reserve `::before`/`::after` strictly for decorative, non-essential visual content.

## Specificity implications — a preview

Every selector type covered in this Part carries a different **specificity weight** — a numeric-like value the browser uses to decide which rule "wins" when multiple rules target the same element with conflicting declarations. This Part has deliberately avoided the full specificity calculation, because Part 15 covers it as its own complete, dedicated topic (it's substantial enough to deserve full focus on its own) — but here's the shape of what's coming, so the selectors you just learned aren't just abstract syntax:

```text
Roughly increasing specificity weight, left to right:
* (universal)  →  element  →  class / attribute / pseudo-class  →  ID  →  inline style
```

Hold onto that ordering loosely for now; Part 15 makes it exact and rigorous.

## Common mistakes

```css
/* ❌ Confusing descendant and child combinators, producing unexpectedly broad matches */
.sidebar p { color: gray; } /* matches ALL nested p, at any depth — often wider than intended */

/* ❌ Forgetting :nth-of-type vs :nth-child distinction with mixed sibling tag types */

/* ❌ Overusing ID selectors for general, reusable styling (fights specificity later) */
#button { padding: 10px; } /* should almost certainly be a reusable .button class instead */

/* ❌ Forgetting content: "" is required for ::before/::after to render at all */
.icon::before {
    background-image: url(icon.svg);
    /* nothing shows — missing content property entirely */
}
```

## Exercises — Part 14

1. Write a selector that matches every `<button>` with the class `primary`.
2. Write a selector that matches only `<p>` elements that are direct children of `.card`.
3. Write a selector that matches every `<li>` that comes after (not necessarily immediately) an `<h3>` sibling.
4. Write a selector matching every 4th item in a list, starting from the 3rd item.
5. Explain, precisely, why `p:nth-child(2)` and `p:nth-of-type(2)` might select different elements, with a concrete example.
6. Write a rule that removes the default focus outline in mouse-click scenarios but preserves (and enhances) it for keyboard navigation.
7. Write a rule using `:has()` that styles a `.card` differently only when it directly contains a `.badge` element.

<details>
<summary>View solutions</summary>

**1.** `button.primary { }`

**2.** `.card > p { }`

**3.** `h3 ~ li { }`

**4.** `li:nth-child(4n+3) { }` (verify: n=0 → 3rd item, n=1 → 7th item, n=2 → 11th item — every 4th starting from the 3rd).

**5.** `:nth-child(2)` counts an element's position among *all* of its siblings regardless of tag, then checks if that specific sibling matches `p`. `:nth-of-type(2)` counts position only among siblings that are also `<p>` elements. Example: `<div><h2>Title</h2><p>A</p><p>B</p></div>` — here `p:nth-child(2)` matches "A" (the 2nd child overall, which happens to be a `<p>`), while `p:nth-of-type(2)` matches "B" (the 2nd `<p>` specifically, ignoring the `<h2>`).

**6.**
```css
button:focus {
    outline: none;
}
button:focus-visible {
    outline: 3px solid steelblue;
    outline-offset: 2px;
}
```

**7.** `.card:has(> .badge) { }`

</details>

---

# PART 15 — Cascade, Inheritance, and Specificity

This is one of the most important, most consistently misunderstood topics in all of CSS. A huge share of "why isn't my CSS applying?!" frustration, at every skill level from beginner to experienced, traces back to a shaky understanding of exactly what's taught in this Part. Treat this as required, foundational knowledge — not an advanced afterthought.

## The cascade

### What it is

The **cascade** is the algorithm the browser uses to decide, when *multiple* CSS rules target the same element and set the *same* property, which single declaration actually wins and gets applied. "Cascading" is literally the C in CSS — it's not a minor detail, it's the core mechanism the entire language is built around.

### Why it exists

In any real project, many different rules will inevitably apply to the same element simultaneously — a base element-type rule, a component class, a state-based pseudo-class, maybe a more specific override for one particular instance. The cascade is the deterministic, rule-based system that resolves these overlaps predictably, rather than leaving it ambiguous or dependent on arbitrary factors.

### The cascade's decision order

When multiple declarations for the same property, on the same element, conflict, the browser resolves the winner by checking these factors, **in this exact priority order** — falling through to the next factor only when the current one ties:

```text
1. Origin and importance   (where did this rule come from, and is it !important?)
2. Specificity              (how "specific" is the selector?)
3. Source order              (which rule appears LAST in the CSS?)
```

Let's take each of these in turn, in real depth.

## 1. Origin and importance

CSS rules can come from different **origins** — broadly: the **browser's own default stylesheet** (called "user agent styles" — every browser ships built-in defaults, like `<h1>` being large and bold, or `<a>` being blue and underlined, before any of your own CSS is even applied), the **user's own custom stylesheet/settings** (rare today, but browsers do support this), and **author styles** — the CSS you, the developer, actually write. In virtually all everyday development, you're working entirely within "author styles," so origin differences rarely come into play directly — but it's worth knowing this layer exists underneath everything, because it's *why* an unstyled `<h1>` still looks like something (bold, large) even before you've written a single line of CSS: that's the browser's default (user-agent) stylesheet.

**`!important`** is a modifier that can be appended to any declaration to forcibly boost its priority far above normal cascade rules:

```css
p {
    color: blue !important;
}
```

An `!important` declaration wins over a normal (non-important) declaration **regardless of specificity or source order** — it jumps the entire normal cascade queue. (Two competing `!important` declarations on the same property then fall back to being resolved by specificity, then source order, exactly as normal declarations would — `!important` doesn't eliminate the rest of the cascade, it just inserts itself as a higher-priority tier above ordinary declarations.)

### Why `!important` should not be your default solution

> ⚠️ **Common mistake** — Reaching for `!important` as a quick fix the moment a style "isn't applying." This is an extremely common trap: it often *does* immediately fix the visible symptom, which is exactly what makes it so tempting — but it doesn't fix the actual underlying problem (usually a specificity mismatch, covered next), it just forcibly overrides it. The real cost shows up later: once a codebase has scattered `!important` declarations, the *only* way to override one of them is with *another* `!important` (or a same-origin `!important` with higher specificity), which tends to spiral — an "important arms race" that makes a stylesheet dramatically harder to reason about and maintain over time. Legitimate, narrow uses of `!important` do exist (overriding third-party/inline styles you can't otherwise touch, certain utility-class systems that deliberately rely on it in a controlled way) — but as a *default* problem-solving habit, it should be treated as close to a last resort, not a first instinct.

## 2. Specificity — calculated precisely

**Specificity** is a score assigned to every selector, used to determine which rule wins when origin/importance are tied. It's often explained as a simple sum, but the more precise and genuinely useful mental model is a **tuple of counts** — think of it like a scoreboard with distinct, separately-tracked columns:

```text
Specificity = (Inline, IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements)
                 (A)      (B)              (C)                          (D)
```

- **Inline styles** (`style="..."` directly on an element) — counts in the highest column, effectively always beating any selector written in a stylesheet (short of `!important`).
- **ID selectors** (`#header`) — each one adds to the "B" column.
- **Class selectors** (`.card`), **attribute selectors** (`[type="text"]`), and **pseudo-classes** (`:hover`, `:nth-child()`) — each one adds to the "C" column.
- **Element/type selectors** (`p`, `div`) and **pseudo-elements** (`::before`) — each one adds to the "D" column.
- The **universal selector** (`*`) and the combinators themselves (`>`, `+`, `~`, the descendant space) — contribute **zero** specificity on their own; they only establish relationships, they don't add "weight."

**Comparison rule:** compare column by column, left to right (Inline, then IDs, then Classes, then Elements) — the first column where one selector has a higher count wins, *no matter how many* of the lower-priority columns the other selector racks up. A single ID always beats any number of classes; a single class always beats any number of element selectors.

```text
Comparing:

p {}                     → (0, 0, 0, 1)
.card p {}                → (0, 0, 1, 1)
#main .card p {}           → (0, 1, 1, 1)
style="color: red"         → (1, 0, 0, 0)
```

Reading this table: `#main .card p` beats `.card p` because it has 1 ID versus 0 IDs — even though both have the same class and element counts, the ID column decides it outright, before the other columns are even considered. And the inline style beats *all three* of the stylesheet selectors above, regardless of how many classes or elements they stack up, because the Inline column is compared first and none of the others have anything in it.

```css
/* Specificity: (0, 0, 0, 1) */
p {
    color: black;
}

/* Specificity: (0, 0, 1, 1) — WINS: has a class, the p rule above has none */
.card p {
    color: darkred;
}

/* Specificity: (0, 1, 1, 1) — WINS over both above: has an ID */
#main .card p {
    color: navy;
}
```

If all three of these rules apply to the same `<p>`, the final color is **navy** — the `#main .card p` rule wins on specificity, regardless of the order these three rules appear in the stylesheet.

### A common specificity trap: multiple classes vs. an ID

```css
.a.b.c.d.e {
    color: green;
}
/* Specificity: (0, 0, 5, 0) — five classes stacked together */

#x {
    color: red;
}
/* Specificity: (0, 1, 0, 0) — a single ID */
```

Even though `.a.b.c.d.e` piles up *five* class selectors, it still loses to `#x`'s single ID — because the ID column is compared first, and `#x` has a 1 there versus `.a.b.c.d.e`'s 0. This surprises a lot of learners who intuitively (but incorrectly) expect specificity to work like simple addition across all selector types combined — it doesn't; it's a strict column-by-column comparison, IDs categorically outrank any number of classes.

### `:is()`, `:where()`, and `:not()` — their specificity behavior

```css
:is(.card, #sidebar) p {}
/* Takes on the specificity of its MOST specific argument: #sidebar (an ID) wins
   internally, so this whole selector's specificity is as if you'd written
   "#sidebar p" — (0, 1, 0, 1) */

:where(.card, #sidebar) p {}
/* Always contributes ZERO specificity, regardless of its arguments — this whole
   selector's specificity is just "p" — (0, 0, 0, 1) */

p:not(.excluded) {}
/* :not()'s specificity is the specificity of its argument, ADDED to the rest —
   here, (0, 0, 1, 1): the class from inside :not(), plus the element p */
```

## 3. Source order — the final tiebreaker

If two rules have **identical** origin/importance and **identical** specificity, the browser falls back to a simple rule: **the declaration that appears later in the source order (later in the file, or in a later linked stylesheet) wins.**

```css
p {
    color: blue;
}

p {
    color: green; /* WINS — identical specificity to the rule above, but comes later */
}
```

This is the mechanism behind a very common, very practical pattern: linking a third-party library's CSS file *before* your own custom stylesheet, so that when both files happen to define the same class with equal specificity, your later-loaded file's declarations win by source order.

## Inheritance

### What it is

**Inheritance** is a separate mechanism from the cascade (though related): certain CSS properties, when set on a parent element, are automatically **passed down** to its descendant elements — *unless* a descendant has its own explicit, more specific rule overriding it.

```css
body {
    font-family: sans-serif;
    color: #333;
}
```

Every element inside `<body>` — paragraphs, headings, list items, nested divs, arbitrarily deep — will inherit this `font-family` and `color`, without you needing to repeat the declaration on every single element. This is precisely *why* setting base typography on `body` or `html` is such a common, effective pattern: one declaration, inherited everywhere.

### Not all properties inherit

This is the critical nuance: **inheritance is property-specific, not universal.** As a strong general rule (not exhaustive, but reliable): **text-related properties tend to inherit** (`color`, `font-family`, `font-size`, `font-weight`, `line-height`, `text-align`, `letter-spacing`), while **box-model and layout properties tend not to inherit** (`margin`, `padding`, `border`, `width`, `height`, `background`, `display`). This makes intuitive sense once you think about it: it would be actively harmful if every nested `<div>` automatically inherited its parent's exact `margin` or `border` — layout properties need to be independently controllable per element, while text styling benefiting from a shared, consistent default across a whole subtree is usually exactly what you want.

```css
.card {
    border: 1px solid gray; /* does NOT inherit — child elements have no border by default */
    color: #222;             /* DOES inherit — text inside the card defaults to this color */
}
```

### `inherit`, `initial`, `unset`, and `revert` — explicit inheritance control

```css
.reset-color {
    color: inherit;
}
```

**`inherit`** — forces a property to take its parent's *computed* value, even for properties that don't inherit by default. Useful when you deliberately want a child to match its parent regardless of the property's normal inheritance behavior.

```css
.reset-color {
    color: initial;
}
```

**`initial`** — resets a property to the CSS specification's own built-in default value for that property (not the browser's stylesheet default, and not the parent's value — the language-level default), effectively ignoring both inheritance and any cascade rules entirely for that one declaration.

```css
.reset-all {
    all: unset;
}
```

**`unset`** — acts as `inherit` for properties that naturally inherit, and as `initial` for properties that don't — a convenient "do the sensible default thing" reset. Often used with the special `all` property (`all: unset;`), which resets *every* CSS property on an element at once — genuinely useful for stripping all default browser styling from an element (like a `<button>` you want to look nothing like a default button) as a clean starting point before applying your own custom styles.

```css
.reset {
    all: revert;
}
```

**`revert`** — resets a property back to whatever value it would have had from an earlier, higher-priority origin in the cascade (typically the browser's own user-agent default stylesheet) — distinct from `initial`, which ignores the cascade's origin layers entirely and goes straight to the CSS spec's bare default.

## DevTools: inspecting overridden styles

Recall Part 0's introduction to DevTools' **Styles pane** — this is where the cascade becomes concretely visible, not just theoretical. When you select an element in the Elements/Inspector panel, the Styles pane lists **every** CSS rule that targets that element, from every source, in an order that reflects the cascade:

```text
element.style {                    ← inline styles, if any, shown first
}

.card p {                          ← author stylesheet rules, generally listed with
    color: navy;                     more specific / later rules toward the top
}

.card p {                          ← a LOWER-priority rule that lost the cascade battle
    color: darkred;   ← ~~struck through~~  is shown with strikethrough — this is
}                                     DevTools' way of showing you exactly which
                                      declaration got overridden, and (crucially)
p {                                  by what
    color: black;   ← ~~struck through~~
}
```

> 💡 **Tip** — Whenever a style "isn't applying" and you can't figure out why, the very first move should always be: select the element in DevTools, look at the Styles pane, and find the strikethrough. It will show you *exactly* which rule is winning instead, and often that's immediately enough to spot the specificity or source-order issue. This single workflow resolves the vast majority of "why isn't my CSS working" confusion, at every experience level — we return to this exact workflow with dedicated exercises in Part 47 (Debugging).

## Cascade layers: `@layer`

### What it is (advanced)

**Cascade layers**, introduced via the `@layer` at-rule, add an entirely new, *explicit* priority tier to the cascade — sitting **above** source order and **below** `!important`/inline styles in the overall priority chain, letting you group rules into named layers and control which layers win over others, **independent of specificity entirely**.

### The problem it solves

Before cascade layers, managing the interaction between, say, a third-party component library's CSS, your own base/reset styles, and your own component overrides, often meant fighting specificity wars — needing increasingly specific (or `!important`-laden) selectors just to guarantee your own styles win over a library's, even when your selector is conceptually "simpler." Cascade layers let you declare, explicitly and separately from specificity math entirely: "styles in this layer should always lose to styles in that layer," regardless of how specific either layer's individual selectors happen to be.

### Syntax

```css
@layer reset, base, components, utilities;

@layer reset {
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
}

@layer base {
    body {
        font-family: sans-serif;
        color: #222;
    }
}

@layer components {
    .card {
        padding: 16px;
        border-radius: 8px;
    }
}

@layer utilities {
    .text-center {
        text-align: center;
    }
}
```

The first line — `@layer reset, base, components, utilities;` — declares the layers' **priority order**, from lowest to highest. Later-declared layers always beat earlier ones, **regardless of the specificity of the selectors inside each layer.** So even a low-specificity `.text-center` selector inside the `utilities` layer will beat a much higher-specificity selector like `#main .card.featured p` if that selector happens to live inside the earlier-declared `components` layer — because layer priority is checked *before* specificity is ever considered, as an even earlier step in the cascade's decision order than what was outlined at the start of this Part.

```text
Updated, fuller cascade priority order, once layers are introduced:

1. Origin and importance (!important, inline, author/user/browser origin)
2. Layer order (explicitly declared layers, later = higher priority; un-layered
                 author styles are treated as their own implicit highest layer)
3. Specificity
4. Source order
```

**Un-layered CSS** (any normal rule not wrapped in an `@layer` block) is treated as belonging to an implicit final layer that comes *after* all named layers — meaning ordinary, un-layered styles you write will beat anything inside a named layer, by default. This is deliberate: it means you can adopt cascade layers for foundational/library CSS while your own regular day-to-day overrides, written normally with no layer at all, continue to reliably win without extra ceremony.

> 💡 **Tip** — Cascade layers are a genuinely advanced, relatively recent tool, most valuable in larger codebases integrating multiple CSS sources (a design system, a component library, your own app styles) where specificity conflicts between those sources have become a real, recurring maintenance burden. For smaller projects and while you're still building core CSS fluency, understanding cascade/specificity/source-order deeply (the first four-fifths of this Part) matters far more day-to-day than reaching for `@layer` — but knowing it exists, and roughly how it reorders cascade priority, is valuable, professional-level knowledge.

## Common mistakes

```css
/* ❌ Expecting source order alone to matter when specificity actually decides it */
.card p { color: navy; }   /* written FIRST in the file */
p { color: red; }          /* written LATER — but LOWER specificity, so it does NOT win */
/* Actual winner: navy — .card p has higher specificity, and specificity is
   checked BEFORE source order in the cascade's priority chain */

/* ❌ Assuming inheritance applies to non-inherited properties */
.parent { border: 2px solid black; }
/* Children do NOT get this border automatically — border does not inherit */

/* ❌ Reaching for !important instead of understanding why a rule isn't winning */
.card p { color: navy !important; } /* fixes the symptom, hides the real specificity issue */
```

## Broken example → why it breaks → correct version

```css
/* Broken: developer expects this "more specific-looking" rule to win because it has
   more words in the selector, but it actually loses */

.nav .link { color: blue; }              /* specificity: (0,0,2,0) */
#header a { color: red; }                 /* specificity: (0,1,0,1) — WINS, has an ID */
```

**Why it breaks:** The developer may have intuitively expected `.nav .link` to win because it looks "more specific" (two classes chained together feels substantial) — but `#header a`, despite looking simpler (just one ID and one bare element selector), wins outright because it contains an ID, and IDs are compared before classes in the specificity tuple, categorically outranking any number of classes.

```css
/* Correct approach: understand the real specificity, then decide deliberately */

/* Option A: raise .nav .link's specificity intentionally, if it should genuinely win */
#header .nav .link { color: blue; }       /* specificity: (0,1,2,0) — now wins */

/* Option B: lower #header a's specificity by using a class instead of the ID,
   if broad ID-based styling wasn't actually the right call to begin with */
.header a { color: red; }                 /* specificity: (0,0,1,1) */
```

## Best practices

- Keep specificity as **low and flat as possible** for as long as possible — favor single classes over ID selectors or deeply chained/nested selectors for everyday component styling. This keeps future overrides simple, rather than forcing you into an escalating specificity arms race.
- Treat `!important` as a rare escape hatch, not a first response to "my style isn't applying."
- When a style genuinely isn't applying as expected, use DevTools' Styles pane (strikethrough) *before* guessing — verify what's actually winning and why.
- Understand that inheritance is real but property-specific — don't assume box-model properties will cascade down to children the way text properties do.

## Exercises — Part 15

1. Calculate the specificity tuple `(inline, id, class, element)` for each: `p`, `.card`, `#sidebar`, `.card .title`, `#sidebar .card p`, `div p span`.
2. Given the following CSS, and assuming both rules target the same `<p class="intro">` element, which wins, and why?
   ```css
   p { color: black; }
   .intro { color: teal; }
   ```
3. Given the following, which wins?
   ```css
   #main p { color: black; }
   .content p { color: teal !important; }
   ```
4. Does `font-size` set on a `<div>` automatically apply to a `<button>` nested inside it? Does `color`? Explain the difference.
5. In cascade-layer terms, will un-layered CSS beat or lose to CSS inside a named `@layer` block, by default?

<details>
<summary>View solutions</summary>

**1.**
- `p` → (0, 0, 0, 1)
- `.card` → (0, 0, 1, 0)
- `#sidebar` → (0, 1, 0, 0)
- `.card .title` → (0, 0, 2, 0)
- `#sidebar .card p` → (0, 1, 1, 1)
- `div p span` → (0, 0, 0, 3)

**2.** `.intro` wins (color: teal) — its specificity (0,0,1,0) beats `p`'s (0,0,0,1), since the class column is compared before the element column and `.intro` has a 1 there versus 0.

**3.** `.content p { color: teal !important; }` wins — `!important` is checked before specificity in the cascade's priority order, so it overrides `#main p`'s higher specificity entirely, regardless of the fact that `#main p` (0,1,0,1) would otherwise beat `.content p` (0,0,1,1) on specificity alone.

**4.** `font-size` does not automatically apply through inheritance in a meaningful way here because a `<button>` has its own distinct default `font-size` from the browser's user-agent stylesheet that typically overrides pure inheritance for form controls in most browsers (buttons are a known historical exception to clean inheritance behavior for a few text properties) — but focusing on the general principle rather than this specific edge case: `color` reliably inherits from `<div>` down to a nested `<button>` (assuming no other rule overrides it) because `color` is a naturally-inheriting text property, while box-model/layout-adjacent properties in general do not inherit. (This question is deliberately testing the "not all properties inherit, and some elements have their own baked-in defaults" nuance — button/form-control typography inheritance quirks are a well-known, specific exception worth being aware of, covered again briefly in Part 34.)

**5.** Un-layered CSS beats (wins over) CSS inside any named `@layer` block, by default — un-layered rules are treated as belonging to an implicit final layer that comes after all explicitly named layers in priority.

</details>

---

# PART 16 — Colors

## Named colors

```css
.box {
    color: tomato;
    background-color: lightsteelblue;
    border-color: rebeccapurple;
}
```

CSS defines roughly 150 **named colors** — human-readable keywords like `red`, `steelblue`, `tomato`, `rebeccapurple`, `gainsboro`. They're convenient for quick prototyping and genuinely readable in code, but they offer no fine-grained control — you can't get "a slightly darker tomato" with a named color; you need one of the numeric formats below for that.

## Hexadecimal (hex) colors

```css
.box {
    color: #333333;
    background-color: #FFF;
    border-color: #4f46e5;
}
```

Hex colors encode **Red, Green, Blue** as three pairs of hexadecimal digits (base-16, using `0-9` and `A-F`), each pair ranging from `00` (none of that channel) to `FF` (maximum of that channel):

```text
#4F46E5
 └┬┘└┬┘└┬┘
  R   G   B

4F = 79 in decimal  → red channel:   79/255
46 = 70 in decimal  → green channel: 70/255
E5 = 229 in decimal → blue channel:  229/255
```

A shorthand **3-digit** form exists when each pair happens to repeat the same digit twice: `#FFF` is shorthand for `#FFFFFF` (pure white), `#333` for `#333333`.

```css
.box {
    background-color: #4f46e580; /* 8-digit hex: RRGGBBAA — last pair is alpha (opacity) */
}
```

An **8-digit** (or shorthand 4-digit) hex form adds an **alpha channel** — transparency — as a final pair, where `FF`/`ff` is fully opaque and `00` is fully transparent.

## `rgb()` and `rgba()`

```css
.box {
    color: rgb(79, 70, 229);
    background-color: rgba(79, 70, 229, 0.5);
}

/* Modern space-separated syntax, alpha via slash */
.box {
    background-color: rgb(79 70 229 / 50%);
}
```

`rgb()` expresses the same Red/Green/Blue model as hex, but using familiar base-10 numbers (`0`–`255` for each channel) instead of hex digits — often more intuitive to read and hand-write than hex for people without hex fluency. `rgba()` adds a fourth alpha value (`0` fully transparent to `1` fully opaque, or a percentage). Modern CSS syntax has unified `rgb()` and `rgba()` into one function (`rgb()` now optionally accepts an alpha value via a `/` separator), though the separate `rgba()` name still works identically for compatibility and habit.

## `hsl()` and `hsla()`

```css
.box {
    color: hsl(243, 75%, 59%);
    background-color: hsla(243, 75%, 59%, 0.5);
}
```

**HSL** stands for **Hue, Saturation, Lightness** — a genuinely different, often more *intuitive* way to think about color than RGB's channel-mixing model:

```text
Hue:        0–360°, a position on the color wheel
            (0/360 = red, 120 = green, 240 = blue, and everywhere between)

Saturation: 0%–100%, how "intense/vivid" vs "gray/muted" the color is
            (0% = completely gray, 100% = fully saturated/vivid)

Lightness:  0%–100%, how close to black or white the color is
            (0% = black, 50% = the "pure" hue/saturation color, 100% = white)
```

The practical advantage: HSL makes common design tasks — "give me a slightly darker version of this exact color," "give me the same color but less saturated/more muted," "give me a color exactly opposite this one on the wheel" — trivial, predictable arithmetic (adjust Lightness down, adjust Saturation down, add 180 to Hue, respectively) in a way that's genuinely difficult to do by eye or by math with raw RGB/hex values, where all three channels typically need to shift together in non-obvious ways to achieve the same perceptual effect.

```css
:root {
    --brand-hue: 243;
    --brand-sat: 75%;
}
.button          { background: hsl(var(--brand-hue) var(--brand-sat) 59%); }
.button:hover     { background: hsl(var(--brand-hue) var(--brand-sat) 50%); } /* darker */
.button-muted     { background: hsl(var(--brand-hue) 20% 59%); }              /* desaturated */
```

(This preview uses CSS custom properties, `var()` — fully covered in Part 29; included here only to show HSL's practical power for building a coherent, systematically-adjustable color palette, a theme worth revisiting once you've learned custom properties properly.)

## Transparency and `currentColor`

```css
.box {
    border: 1px solid currentColor;
    color: crimson;
    /* the border will render in crimson too, automatically tracking whatever
       "color" is currently set/inherited on this element */
}
```

`currentColor` is a special CSS keyword that always resolves to the element's own current `color` value — genuinely useful for properties like `border-color`, `box-shadow`, or SVG `fill` that you want to automatically stay in sync with the element's text color, without hardcoding (and having to remember to keep in sync) the same color value twice.

## Modern color spaces: `lab()`, `lch()`, `oklab()`, `oklch()`

### What problem these solve

RGB and HSL are both, at their core, built on how *displays* physically produce color (mixing red/green/blue light) — not on how *human perception* actually works. A well-known, genuinely surprising consequence: in HSL, two colors with the *identical* Lightness value can look meaningfully different in perceived brightness to the human eye, because human perception of brightness isn't uniform across all hues at a fixed "Lightness" number — pure yellow at a given HSL lightness looks noticeably *brighter* to us than pure blue at that exact same lightness number, even though HSL treats them as equally "light."

**`oklch()`** (and the related `oklab()`, `lch()`, `lab()`) are newer color spaces specifically designed to be **perceptually uniform** — equal numeric steps correspond to genuinely equal *perceived* steps in lightness, hue, or chroma (roughly "vividness," analogous to saturation), regardless of which hue you're working with.

```css
.box {
    background: oklch(65% 0.15 250);
}
```

```text
oklch(Lightness Chroma Hue)

Lightness: 0%–100%, perceptually uniform lightness
Chroma:    roughly 0 to ~0.4, how vivid/colorful (0 = grayscale)
Hue:       0–360°, same conceptual color-wheel position idea as HSL's hue
```

The practical payoff: generating a consistent, harmonious set of shades (for a design system's color scale, covered again in Part 45) by varying only the Lightness value in `oklch()` produces genuinely, perceptually even steps — something HSL cannot reliably guarantee across different hues. This is genuinely advanced/modern territory — you won't need `oklch()` fluency to build most of what this course teaches, but recognizing it, and understanding conceptually *why* it exists, is valuable, current professional knowledge, and increasingly common in modern design systems and CSS frameworks.

> 💡 **Tip** — For this course's purposes and for the vast majority of everyday work, HSL remains an excellent, intuitive, broadly-supported default for hand-authoring colors and building simple palettes. Reach for `oklch()` once you're working on a more mature design system where perceptually-uniform color scales genuinely matter.

## Accessibility and contrast

> ♿ **Accessibility note** — Color choice is not purely aesthetic — it has a hard, measurable accessibility requirement: **contrast ratio** between text and its background. The Web Content Accessibility Guidelines (WCAG) specify minimum contrast ratios — commonly cited targets are **4.5:1** for normal body text and **3:1** for large text (roughly 18pt+/24px+, or 14pt+/19px+ bold), at the "AA" compliance level most commonly targeted. Low-contrast text (light gray on white, a mid-saturation color on a similar-lightness background) can be difficult or impossible to read for users with low vision, color blindness, or simply in bright ambient lighting on a mobile screen outdoors. Browser DevTools generally include a built-in contrast checker directly in the color picker for any color value you inspect — genuinely worth using as a habit whenever you pick a text/background color pairing, not just for users you're deliberately designing for, but as standard practice.

## Exercises — Part 16

1. Write the same color — a medium blue — in hex, `rgb()`, and `hsl()` notation.
2. Write a semi-transparent version (50% opacity) of `#e63946` using both 8-digit hex and `rgba()`.
3. Using HSL, write a base button color and a ":hover" variant that's visibly darker, changing only the Lightness value.
4. Explain, conceptually, what problem `oklch()` solves that HSL does not.
5. What does `currentColor` do, and give one practical use case for it.

<details>
<summary>View solutions</summary>

**1.** (Any correct medium blue is acceptable — example using the same actual color across all three notations)
```css
color: #4169e1;             /* hex */
color: rgb(65, 105, 225);   /* rgb */
color: hsl(225, 73%, 57%);  /* hsl (approximately equivalent) */
```

**2.**
```css
background-color: #e6394680;             /* 8-digit hex, 80 ≈ 50% alpha */
background-color: rgba(230, 57, 70, 0.5); /* rgba */
```

**3.**
```css
.button       { background: hsl(230, 70%, 55%); }
.button:hover { background: hsl(230, 70%, 40%); } /* same hue/saturation, lower lightness */
```

**4.** HSL is not perceptually uniform — two colors with the same numeric Lightness value can appear noticeably different in perceived brightness to the human eye depending on their hue (e.g., yellow appears brighter than blue at an identical HSL lightness number). `oklch()` is specifically designed so equal numeric changes in its Lightness (and Chroma/Hue) values correspond to genuinely equal *perceived* changes, regardless of hue — making it far more reliable for generating consistent, harmonious color scales.

**5.** `currentColor` resolves to whatever the element's own current `color` value is. A practical use: `border: 1px solid currentColor;` on a button or badge, so the border automatically matches the text color without needing to duplicate and manually keep the same color value in sync in two separate declarations.

</details>

---

# PART 17 — Units

Every size, length, and dimension in CSS needs a unit (with a small number of specific exceptions, like `line-height` and `z-index`, which can be unitless numbers — covered where relevant). Choosing the *right* unit for the right situation is a real skill, and a very common source of both bugs and genuinely superior, more maintainable CSS once understood properly.

## Absolute units: `px`

```css
.box {
    width: 300px;
    border: 1px solid black;
}
```

**`px`** (pixels) is CSS's one commonly-used **absolute** unit — its size does not depend on any other context (a parent's size, the root font size, the viewport). Important nuance: a CSS "pixel" is **not** necessarily one literal physical hardware pixel on a screen — on high-density ("Retina"/high-DPI) displays, one CSS pixel is deliberately mapped to *multiple* physical device pixels, specifically so text and UI elements remain a consistent, comfortable physical size across displays of wildly different pixel densities, rather than shrinking to an unreadable size on very high-density screens. This is exactly why the viewport meta tag from Part 1 (`width=device-width`) matters — it's working with this same CSS-pixel abstraction, not raw hardware pixel counts.

## Relative units

### `%` — percentage

```css
.child {
    width: 50%; /* 50% of the parent's content-box width */
}
```

Percentages are always calculated **relative to some reference value** — most commonly a parent element's size for width/height-related properties, though the exact reference differs by property (covered precisely alongside each relevant property in later Parts, especially the box model in Part 18 and Flexbox/Grid in Parts 24–25).

### `em` — relative to font size

```css
.card {
    font-size: 16px;
    padding: 1.5em; /* 1.5 × 16px = 24px */
}
.card .title {
    font-size: 1.25em; /* 1.25 × the card's OWN font-size (16px) = 20px */
}
```

`em` is relative to the **font size of the element it's used on** (for `font-size` itself, it's relative to the *parent's* font size, since an element can't reference its own not-yet-determined size; for every other property, like `padding` or `margin`, it's relative to that same element's own already-established `font-size`). This creates a genuinely useful but sometimes tricky **compounding** behavior:

```html
<div class="outer">   <!-- font-size: 1.2em, relative to its parent, say 16px → 19.2px -->
  <div class="inner">  <!-- font-size: 1.2em, relative to ITS parent (.outer's 19.2px) → 23.04px -->
    <p>Text</p>
  </div>
</div>
```

```css
.outer { font-size: 1.2em; } /* relative to body's font-size, e.g. 16px → 19.2px */
.inner { font-size: 1.2em; } /* relative to .outer's 19.2px → 23.04px, NOT 16px again */
```

> ⚠️ **Common mistake** — Not anticipating `em`'s compounding behavior across nested elements, each with their own `em`-based `font-size`. Each nested level multiplies against its *immediate* parent's already-computed size, not the original root size — deeply nested `em`-based font sizes can spiral to unexpectedly large or small values in ways that are genuinely difficult to predict and reason about by eye. This exact problem is what `rem` (next) was introduced specifically to solve.

### `rem` — relative to the root font size

```css
html {
    font-size: 16px; /* the "root" font size — this is also the browser's typical default */
}
.card {
    padding: 1.5rem; /* always 1.5 × 16px = 24px, no matter how deeply nested .card is */
}
.card .title {
    font-size: 1.25rem; /* always 1.25 × 16px = 20px, regardless of any ancestor's font-size */
}
```

`rem` ("root em") is always relative to the **root element's** (`<html>`) font size — a single, fixed, predictable reference point, completely immune to the nesting/compounding problem `em` has. This predictability is exactly why `rem` has become the strongly preferred default unit for `font-size` (and very commonly for spacing values like `padding`/`margin` too) in professional, modern CSS.

> 💡 **Tip** — A widely-used, genuinely clever technique: many developers set `html { font-size: 62.5%; }` (which computes to `10px`, since the browser default is `16px` and `62.5% × 16px = 10px`), specifically so that `1rem` conveniently equals exactly `10px` — making it trivial to mentally convert between rem and px while writing CSS (`1.6rem` = `16px`, `2.4rem` = `24px`), without sacrificing any of `rem`'s scalability benefits (covered next).

### Why `rem` matters for accessibility: respecting user font-size preferences

> ♿ **Accessibility note** — Many users — especially users with low vision — increase their browser's *default* font size in their browser/OS settings, specifically to make all text on the web larger and more readable, without needing to zoom the entire page (which also scales layout/images awkwardly). **`rem`-based sizing respects this preference automatically** — if a user's browser default is `20px` instead of the typical `16px`, every `rem` value across your entire page scales up proportionally along with it, exactly as the user intended. **Pixel-based (`px`) font sizes do not respect this preference at all** — a `16px` heading stays locked at exactly 16 literal pixels regardless of the user's browser font-size setting, actively working against a real accessibility feature many users genuinely rely on. This is one of the most concrete, practical reasons `rem` is strongly preferred over `px` specifically for typography in professional, accessible CSS.

### Viewport units: `vw`, `vh`, `vmin`, `vmax`

```css
.hero {
    width: 100vw;   /* 100% of the viewport's width */
    height: 60vh;   /* 60% of the viewport's height */
}
.square {
    width: 50vmin;  /* 50% of whichever is SMALLER: viewport width or height */
    height: 50vmin; /* using vmin for both keeps it perfectly square on any screen shape */
}
```

- **`vw`** — 1% of the viewport's width.
- **`vh`** — 1% of the viewport's height.
- **`vmin`** — 1% of whichever is *smaller*, viewport width or height (useful for sizing something that should stay proportionally consistent regardless of whether the screen is wide/landscape or tall/portrait).
- **`vmax`** — 1% of whichever is *larger*.

### `ch` — relative to character width

```css
.article-text {
    max-width: 65ch; /* roughly 65 characters wide, a well-established comfortable
                         reading line-length target — covered again in Part 21 */
}
```

`ch` is relative to the width of the `"0"` (zero) character in the element's current font — an approximation of average character width, genuinely useful specifically for constraining text block width to a comfortable, readable number of characters per line, independent of the exact font or font-size in use.

### The `100vh` mobile problem

> ⚠️ **Common mistake** — This is one of the most notorious, widely-encountered real-world CSS bugs, worth understanding deeply rather than just memorizing the fix. On mobile browsers, the browser's own UI chrome (the address bar, bottom toolbar) can dynamically show and hide as the user scrolls — and historically, `100vh` was calculated against the *largest possible* viewport height (as if that browser UI were fully hidden), even in the common situation where it's actually currently visible and taking up real screen space. The practical, visible symptom: a `height: 100vh` hero section can end up visibly *taller* than the actually-visible screen area, with its bottom portion hidden behind the mobile browser's address bar/toolbar — despite `100vh` seeming, by definition, like it should exactly fill the visible screen.

**Modern viewport units — the fix:**

```css
.hero {
    height: 100svh; /* Small Viewport Height — sized as if browser UI IS visible/expanded */
    height: 100lvh; /* Large Viewport Height — sized as if browser UI is fully hidden */
    height: 100dvh; /* Dynamic Viewport Height — actively tracks the CURRENT state, live */
}
```

- **`svh`** (small viewport height) — always calculated assuming the browser's UI chrome is at its most expanded/visible state — guaranteeing your element never exceeds the currently-visible area, even in the "worst case."
- **`lvh`** (large viewport height) — the old `100vh` behavior, assuming the UI chrome is fully collapsed/hidden.
- **`dvh`** (dynamic viewport height) — **dynamically recalculates** as the actual browser UI shows/hides in real time while the user scrolls, always exactly matching the true, current visible viewport.

> 📱 **Responsive design note** — For a full-height mobile hero section or a full-screen modal today, `100dvh` is generally the most robust, correct modern choice — it adapts live to the browser chrome's actual current state rather than assuming a fixed worst- or best-case scenario. Browser support for `svh`/`lvh`/`dvh` is broadly solid in modern browsers; for maximum safety with very old browsers you might layer a `100vh` fallback declared first, with `100dvh` declared after it (recall source order from Part 15 — the later, supported declaration simply overrides the earlier fallback in browsers that understand it, while older browsers that don't recognize `dvh` at all simply ignore that later line entirely and keep using the `vh` fallback).

## When to use which unit — a practical decision guide

| Use case | Recommended unit | Why |
|---|---|---|
| Font size | `rem` | Respects user's browser font-size accessibility preference; predictable, non-compounding |
| Spacing that should scale with a *specific* element's own font size (e.g., padding tightly proportional to a button's text size) | `em` | Deliberately leverages compounding/local relativity when that's actually the desired behavior |
| General spacing (margin, padding) at the page/layout level | `rem` (most common) or `px` (for genuinely fixed, small values like a 1px border) | Predictability, consistency with typography scale |
| Fluid, container-relative sizing | `%` | Scales naturally with a parent's size |
| Grid track sizing | `fr` (Part 25) | Purpose-built fractional unit for Grid |
| Full-viewport or near-viewport sizing | `vw` / `vh` / `dvh` | Directly tied to actual screen/viewport dimensions |
| Comfortable text block width | `ch` | Approximates a target character-count line length |
| Fine, fixed details (hairline borders, precise icon sizes) | `px` | Absolute, exact, doesn't need to scale |

> 📱 **Responsive design note** — Use viewport units (`vw`/`vh`) carefully and deliberately, not as a default for everything. Setting `font-size` purely in `vw` with no constraint, for instance, can produce text that becomes uncomfortably tiny on small screens or absurdly huge on large ones, with no natural floor or ceiling — this exact problem, and its modern, elegant solution (`clamp()`), is covered in full depth in Part 26.

## Exercises — Part 17

1. Given `html { font-size: 16px; }`, what pixel value does `2rem` compute to? What about `0.5rem`?
2. Explain, with a concrete nested example, why `em`-based font sizes can compound unpredictably while `rem`-based ones cannot.
3. Why is `rem` generally preferred over `px` for font sizes, specifically for accessibility reasons?
4. What real-world visible bug does `100vh` cause on many mobile browsers, and which modern unit directly fixes it?
5. You want a decorative square that stays perfectly square regardless of whether the viewport is in portrait or landscape orientation, sized relative to the screen. Which unit fits best, and why?

<details>
<summary>View solutions</summary>

1. `2rem` = 32px. `0.5rem` = 8px. (Both always relative to the root `<html>` font-size, regardless of nesting.)
2. Example: `.outer { font-size: 1.5em; }` (relative to its parent, say 16px → 24px), then `.inner { font-size: 1.5em; }` nested inside `.outer` computes relative to `.outer`'s already-computed 24px, giving 36px — not 24px again. Each nested `em` multiplies against its own immediate parent's already-resolved size, so several nested levels of `em` sizing compound multiplicatively and become difficult to predict. `rem` always references the single, fixed root `<html>` font-size directly, no matter how deeply nested the element is, so it never compounds.
3. Because many users, especially those with low vision, increase their browser's default font size specifically to make all web text more readable. `rem`-based sizes scale proportionally with that browser default automatically, respecting the user's accessibility preference; `px`-based font sizes stay fixed at their literal pixel value regardless of the user's browser settings, ignoring that preference entirely.
4. `100vh` can make an element taller than the actually visible screen area on mobile, because it's historically calculated assuming the browser's address bar/toolbar UI is fully hidden — even when it's currently visible and occupying real screen space — causing the bottom of the element to be hidden behind that browser UI. The modern `dvh` (dynamic viewport height) unit fixes this by live-tracking the browser UI's actual current state.
5. `vmin` — because it's always 1% of whichever is smaller, viewport width or height, so a `50vmin` × `50vmin` box stays proportionally sized and perfectly square regardless of whether the current viewport is wide (landscape) or tall (portrait).

</details>

---

# PART 18 — The Box Model

This is one of the special-focus areas of this course, and for good reason: **every single element on every webpage you will ever build is a box**, and every layout bug you will ever debug ultimately comes down to understanding exactly how that box's dimensions are calculated. There is no CSS layout mastery — no Flexbox, no Grid, no positioning — without a rock-solid grasp of this Part first.

## What the box model is

### What it is

Every HTML element, when rendered, generates a rectangular box made up of four concentric layers, from the inside out: **content**, **padding**, **border**, and **margin**.

### Why it exists

Visual design needs a consistent, universal system for controlling an element's size and the space around and within it. The box model is that system — it applies identically to *every* element, whether it's a `<div>`, a `<button>`, an `<img>`, or a single `<span>` of inline text (with some nuances for inline elements, covered in Part 19).

### The diagram

```text
+----------------------------------+
|              margin               |  ← transparent space OUTSIDE the border;
|  +------------------------------+ |    separates this box from its neighbors
|  |            border            | |
|  |  +--------------------------+ | |
|  |  |         padding          | | |  ← space INSIDE the border, around the content;
|  |  |  +--------------------+  | | |    part of the element's own background
|  |  |  |      content       |  | | |
|  |  |  |                    |  | | |  ← the actual text/image/content itself
|  |  |  +--------------------+  | | |
|  |  +--------------------------+ | |
|  +------------------------------+ |
+----------------------------------+
```

- **Content** — the actual content area: text, an image, child elements. Its size is what `width`/`height` set (with an important nuance covered below in `box-sizing`).
- **Padding** — the transparent (or, more precisely, background-colored) space *between* the content and the border. Padding is "inside" the element — it's part of the element's own clickable/background area.
- **Border** — a visible (or invisible, `width: 0`) line drawn around the padding.
- **Margin** — transparent space *outside* the border, separating this element from its neighbors. Margin is never part of the element's own background or clickable area — it's pure external spacing.

## `width` and `height`

```css
.box {
    width: 300px;
    height: 150px;
}
```

By default (in the browser's standard, un-reset `box-sizing` mode, covered next), `width` and `height` set the size of **only the content area** — padding and border are then added *on top of* that, increasing the box's total rendered footprint beyond what `width`/`height` alone specify. This default behavior is the single most common source of box-model confusion for beginners, and it's exactly what the industry-standard `box-sizing: border-box` reset (covered next) fixes.

## `min-width`, `max-width`, `min-height`, `max-height`

```css
.card {
    width: 50%;
    min-width: 250px;
    max-width: 600px;
}
```

These set **constraints** on top of a flexible size:

- **`min-width`/`min-height`** — the element will never shrink smaller than this, even if its normal sizing (like a `%` or flexible layout) would otherwise make it smaller.
- **`max-width`/`max-height`** — the element will never grow larger than this, even if its normal sizing would otherwise make it larger.

This combination — a flexible base size (`%`, or no explicit size at all) constrained by `min-`/`max-` bounds — is one of the single most powerful, most commonly used responsive design patterns in all of CSS, and you'll use it constantly starting in Part 26.

```css
img {
    max-width: 100%;
    height: auto;
}
```

This specific, extremely common pattern deserves calling out on its own: it makes an image **never overflow its container** (it shrinks to fit if the container is narrower than the image's natural size) while **never upscaling beyond its actual natural size** either (`max-width: 100%` only ever constrains *downward*), and `height: auto` ensures the image's aspect ratio is preserved automatically as its width adjusts, rather than stretching or squashing.

## `box-sizing` — the single most important box-model property

### The problem it solves

```css
.box {
    width: 300px;
    padding: 20px;
    border: 5px solid black;
}
```

With the browser's **default** `box-sizing` value (`content-box`), this box's *actual total rendered width* is **not** 300px — it's:

```text
300px (content width, from the `width` property)
+ 20px (left padding) + 20px (right padding)
+ 5px (left border) + 5px (right border)
= 350px total rendered width
```

```text
box-sizing: content-box (the default)

|←────────────── 350px actual rendered width ──────────────→|
+---+----------------------------------------------------+---+
| B |                      padding (20px)                 | B |
| o |  +------------------------------------------------+  | o |
| r |  |          content: exactly 300px wide            |  | r |
| d |  +------------------------------------------------+  | d |
| e |                                                      | e |
| r |                                                      | r |
+---+----------------------------------------------------+---+
```

This is deeply unintuitive for most beginners (and, honestly, plenty of experienced developers still find it annoying): you set `width: 300px`, expecting the box to be 300px wide, but it visually renders at 350px. Every time you add or change padding or border, the box's total size shifts too — making layout math genuinely difficult to reason about, especially once you're combining multiple boxes side by side and trying to get them to add up to a specific total width.

### The fix: `box-sizing: border-box`

```css
.box {
    box-sizing: border-box;
    width: 300px;
    padding: 20px;
    border: 5px solid black;
}
```

```text
box-sizing: border-box

|←────────────── 300px actual rendered width (unchanged!) ──→|
+---+----------------------------------------------------+---+
| B |                      padding (20px)                 | B |
| o |  +------------------------------------------------+  | o |
| r |  |     content: shrinks to fit — 250px wide         |  | r |
| d |  +------------------------------------------------+  | d |
| e |                                                      | e |
| r |                                                      | r |
+---+----------------------------------------------------+---+
```

With `border-box`, `width: 300px` means the **total rendered box (content + padding + border together) is exactly 300px** — the browser now shrinks the *content* area to make room for padding and border, rather than adding padding/border on top of the content size. Margin is still added *outside* this total, unaffected either way (margin was never part of "the box" that `box-sizing` is describing — it's the space *around* the box).

### Why nearly every real project applies this globally

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}
```

This is one of the most universally-adopted, near-mandatory CSS resets in professional frontend development (you'll see it, verbatim or close to it, at the top of nearly every real-world stylesheet, and we formalize it further in Part 36). Applying `border-box` to literally every element (`*`) plus every generated pseudo-element (`::before`/`::after`, since they participate in layout as boxes too and should behave consistently) makes every single `width`/`height` declaration in your entire stylesheet mean exactly what it visually says, with padding and border simply "eating into" that stated size rather than expanding beyond it — dramatically more predictable, and the near-universal professional default.

> ✅ **Checkpoint** — Before continuing, make sure you understand this cold: with `content-box` (the default), `width` sets *only* the content area, and padding/border add on top of it, increasing the total rendered size. With `border-box`, `width` sets the *total* rendered size (content + padding + border combined), and the content area shrinks to accommodate padding/border within that fixed total. From this point forward in the course, assume `border-box` is in effect (via the global reset above) in every example, exactly as it would be in any real, professionally-set-up project.

## Margin collapsing

### What it is

This is a genuinely surprising, frequently-confusing box-model behavior that deserves its own dedicated explanation: when two **block-level** elements are stacked vertically, and the bottom margin of the first element meets the top margin of the second, **the two margins do not add together** — instead, they **collapse** into a single margin equal to the *larger* of the two values.

```html
<p style="margin-bottom: 30px;">First paragraph.</p>
<p style="margin-top: 20px;">Second paragraph.</p>
```

```text
Intuitive (but WRONG) expectation: 30px + 20px = 50px gap between the paragraphs

Actual behavior: margins collapse — the gap is 30px (the LARGER of the two),
not 50px

+---------------------------+
|      First paragraph.     |
+---------------------------+
            ↕  30px (NOT 50px — the 20px top-margin is absorbed into the
               larger 30px bottom-margin, not added alongside it)
+---------------------------+
|     Second paragraph.     |
+---------------------------+
```

### Why it exists

This behavior is deliberate, not a bug: it exists specifically so that a document full of naturally-flowing text elements (headings, paragraphs, list items) doesn't accumulate awkward, ever-growing gaps every time two elements' margins happen to face each other — a single, sensible visual rhythm is maintained (the larger of two adjacent margins "wins") rather than doubling up unpredictably based purely on markup structure.

### When margin collapsing happens (and when it doesn't)

Margin collapsing specifically occurs between:
- **Adjacent siblings** — a bottom margin meeting the next sibling's top margin (as shown above).
- **A parent and its first/last child** — if a parent has no padding, no border, and no other separating content, its own top margin can collapse with its first child's top margin (and equivalently for bottom margin and the last child) — this specific case is a very common source of "why is there a gap *above* my container, that I never set on the container itself?" confusion.

Margin collapsing does **not** happen:
- Between margins on the **same element's** top and bottom (that's not a collapse scenario at all — those are just two independent margins).
- For **horizontal** margins (`margin-left`/`margin-right`) — collapsing is a vertical-margin-only phenomenon.
- When Flexbox or Grid layout is involved — flex/grid *items* never collapse margins with each other or their container, a genuinely useful side benefit of these modern layout modes covered further in Parts 24–25.
- When there's any padding, border, or other content physically separating the two margins — collapsing requires the margins to be *directly, physically adjacent* with literally nothing between them.

> 💡 **Tip** — A common, effective way to sidestep parent/child margin-collapsing confusion entirely: give the parent even a tiny amount of padding (`padding: 1px;` at minimum, or any genuine padding your design calls for) or a border — either one is enough to prevent the parent and child margins from being directly adjacent, breaking the collapse. Alternatively (and increasingly the more modern default), simply designing your spacing system so you consistently rely on Flexbox/Grid with `gap` (Parts 24–25) rather than raw margins for spacing between siblings sidesteps collapsing entirely, since it doesn't occur in flex/grid contexts.

## `overflow`

### What it is

`overflow` controls what happens when an element's **content** is too large to fit inside its own box (its defined width/height, especially when a fixed `height` is set and the content inside genuinely exceeds it).

```css
.box {
    width: 300px;
    height: 100px;
    overflow: visible; /* default: content spills out beyond the box's boundaries, unclipped */
}
```

```css
.box {
    overflow: hidden; /* content that doesn't fit is clipped/cut off, simply invisible */
}
```

```css
.box {
    overflow: scroll; /* ALWAYS shows scrollbars, even if content actually fits — rarely desired */
}
```

```css
.box {
    overflow: auto; /* shows scrollbars ONLY if content actually overflows — the most common, sensible choice */
}
```

```text
overflow: visible (default)          overflow: hidden
+------------------+                 +------------------+
| Some text that    |                | Some text that    |
| overflows the box  |                | overflows the[clip]
[continues below, unclipped]          +------------------+
+------------------+                  (the rest is simply gone, not scrollable)

overflow: scroll                     overflow: auto
+------------------+▲|                +------------------+
| Some text that    |█|               | Some text that    |
| overflows the box  |█|               | overflows the[▲|
+------------------+▼|                +------------------+▼|
(scrollbar ALWAYS shown, even        (scrollbar shown ONLY because
 if content actually fits fine)       this content genuinely overflows)
```

You can also set `overflow-x` and `overflow-y` independently, controlling horizontal and vertical overflow behavior separately (e.g., `overflow-x: hidden; overflow-y: auto;` for a panel that should never scroll sideways but can scroll vertically when needed).

> 💡 **Tip** — `overflow: auto` is, in the overwhelming majority of real situations, the more thoughtful, professional default over `overflow: scroll` — there's rarely a good reason to permanently show a scrollbar on content that doesn't currently need one; it's visual noise and can even subtly suggest to a user that there's more content to scroll to when there genuinely isn't.

## Best practices

- Apply the universal `box-sizing: border-box` reset at the top of every project, essentially without exception.
- Understand margin collapsing well enough to recognize it immediately when a "missing" or "doubled" gap appears — don't guess; know the actual mechanism.
- Default to `overflow: auto` over `overflow: scroll` unless you have a specific reason to always show a scrollbar.
- Use `max-width` + `width: 100%` (a flexible base, constrained by an upper bound) as your default pattern for responsive containers, rather than fixed pixel widths, well before you formally reach Part 26.

## Knowledge Check — Part 18

1. Name the four layers of the box model, from innermost to outermost.
2. With `box-sizing: content-box` (the default), if `width: 200px`, `padding: 10px`, and `border: 2px solid black` are all set, what is the box's total rendered width?
3. Repeat question 2, but with `box-sizing: border-box` instead. What's the resulting content-area width?
4. Is margin included in what `box-sizing: border-box` accounts for? Why or why not?
5. Explain margin collapsing in your own words, including one concrete scenario where it does NOT occur.
6. What's the practical difference between `overflow: hidden` and `overflow: scroll`?
7. Why is `overflow: auto` generally the more sensible default over `overflow: scroll`?

<details>
<summary>View solutions</summary>

1. Content, padding, border, margin (innermost to outermost).
2. 200 (content) + 10+10 (left+right padding) + 2+2 (left+right border) = 224px total rendered width.
3. Total rendered width stays 200px (that's the entire point of `border-box`). Content-area width = 200 − 10 − 10 (padding) − 2 − 2 (border) = 176px.
4. No — margin is never included in what `box-sizing` accounts for, under either `content-box` or `border-box`. `box-sizing` only changes whether `width`/`height` describe just the content area or the content+padding+border total; margin is always additional space added outside that box, unaffected either way.
5. Margin collapsing is when two vertically-adjacent margins (a bottom margin meeting a top margin, either between sibling elements or between a parent and its first/last child with nothing separating them) don't add together, but instead collapse into a single margin equal to the larger of the two values. It does NOT occur for horizontal margins, between an element's own top and bottom margins, within Flexbox/Grid layout contexts, or when any padding/border/content physically separates the two margins.
6. `overflow: hidden` clips overflowing content entirely — it becomes invisible with no way to access it. `overflow: scroll` also clips it visually within the box, but always adds a scrollbar (even if content doesn't actually overflow) so the hidden content can be scrolled into view.
7. Because `overflow: scroll` permanently shows a scrollbar even when content currently fits and there's nothing to scroll to — unnecessary visual clutter and a potentially misleading signal to users. `overflow: auto` only shows a scrollbar when content genuinely overflows, adapting sensibly to the actual content.

</details>

---

# PART 19 — Display

## What `display` is

### What it is

The `display` property is, arguably, **the single most influential property in all of CSS** for determining how an element behaves in layout — it determines whether an element generates a box at all, and if so, what *kind* of box (how it interacts with surrounding elements, whether it can accept `width`/`height`, whether it sits on its own line or flows inline with text).

## Block, inline, and inline-block

### `display: block`

```css
div {
    display: block; /* the browser's actual default for <div> */
}
```

A **block-level** box:
- Takes up the **full available width** of its parent by default, regardless of its content's actual size (unless explicitly constrained with `width`/`max-width`).
- Always starts on a **new line** — forces a line break both before and after itself.
- **Respects** `width`, `height`, and all four margins/paddings fully, exactly as described in Part 18.

Elements that are block-level by browser default: `<div>`, `<p>`, `<h1>`–`<h6>`, `<ul>`/`<ol>`/`<li>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<form>`, and most other "structural" elements from earlier Parts.

### `display: inline`

```css
span {
    display: inline; /* the browser's actual default for <span>, <a>, <strong>, <em>, etc. */
}
```

An **inline** box:
- Only takes up **as much width as its content needs** — it does not force a new line, and multiple inline elements flow side by side, wrapping naturally like words in a sentence.
- **Does not** start on a new line — it flows within the surrounding text/content.
- **Ignores** `width` and `height` entirely — setting them has no effect on an inline element (a critical, frequently-surprising limitation).
- **Only respects horizontal** padding/margin (`padding-left`/`right`, `margin-left`/`right`) visually in terms of pushing neighboring content away; **vertical** padding/margin (`padding-top`/`bottom`, `margin-top`/`bottom`) is rendered (it can visually add background-color padding above/below the text) but does **not** push surrounding lines of content away the way block-level vertical spacing does — another frequently-surprising inline limitation.

Elements that are inline by browser default: `<span>`, `<a>`, `<strong>`, `<em>`, `<img>` (actually `inline-block`-like in practice, see below), and most of the text-level elements from Part 2.

```text
display: block                          display: inline
+----------------------------+          Some text with an [inline-element] flowing
|         block element        |          right alongside it, wrapping naturally like
+----------------------------+          any other word would within the sentence, taking
+----------------------------+          only as much horizontal space as its own content
|      another block element    |          needs, never forcing its own line break.
+----------------------------+
(each takes full width, stacks vertically, forced line breaks)
```

### `display: inline-block`

```css
.badge {
    display: inline-block;
    width: 80px;
    height: 30px;
    padding: 4px 8px;
}
```

`inline-block` is, deliberately, a **hybrid** of the two: it **flows inline** with surrounding content (doesn't force its own line break, sits alongside neighboring inline content) **while still fully respecting** `width`, `height`, and all four margins/paddings exactly like a block element would. This combination is genuinely useful for exactly the situations where you want something to sit inline within a text flow but still needs a controlled, explicit box size — a badge, a small icon-plus-label chip, an inline button.

> ⚠️ **Common mistake** — Setting `width`/`height` on an element and being confused when it visibly has no effect — this is almost always because the element is still `display: inline` (its browser default). Recall from Part 12's `<div>` vs `<button>` comparison, and from earlier Parts generally: if you need to size something and it's naturally an inline element (like `<a>` or `<span>`), you need to change its `display` to `inline-block` or `block` first before `width`/`height` will do anything at all.

## `display: none` vs. `visibility: hidden`

This distinction, briefly previewed in Part 0's rendering pipeline discussion, deserves full, careful treatment here — it's a very common point of confusion with real, practical consequences.

```css
.hidden-none {
    display: none;
}
```

`display: none` removes the element **entirely** from the render tree (recall Part 0's rendering pipeline) — it takes up **zero space**, as if it doesn't exist in the layout at all. Surrounding elements collapse into the space it would have occupied, exactly as if the element had been deleted from the HTML entirely. It is also removed from the **accessibility tree** — screen readers skip it completely, exactly like it's not there.

```css
.hidden-visibility {
    visibility: hidden;
}
```

`visibility: hidden` makes the element **invisible** but **still reserves its full layout space** — surrounding elements do *not* shift or collapse into its space; there's simply an empty, invisible gap exactly where the element would have rendered. It is also removed from the accessibility tree, same as `display: none`, in terms of a screen reader skipping its content — though, notably, its descendants *can* individually override this back to `visibility: visible` to selectively re-show specific nested content, something `display: none` cannot do at all (once a subtree is removed via `display: none`, nothing inside it can be selectively brought back — it's all-or-nothing).

```text
display: none                        visibility: hidden
+---------------+                    +---------------+
|    Box A      |                    |    Box A      |
+---------------+                    +---------------+
+---------------+                    | (empty space, exactly
|    Box C      |                    |  where Box B WOULD be, |
+---------------+                    |  but isn't visible)    |
(Box B is gone entirely —            +---------------+
 space collapses, C moves up         |    Box C      |
 to fill the gap)                    +---------------+
                                      (Box B's space is still
                                       reserved — C does NOT move up)
```

| | Takes up layout space? | Visible? | In accessibility tree? |
|---|---|---|---|
| **(normal)** | ✅ Yes | ✅ Yes | ✅ Yes |
| **`visibility: hidden`** | ✅ Yes (reserved, empty) | ❌ No | ❌ No |
| **`display: none`** | ❌ No | ❌ No | ❌ No |

> 💡 **Tip** — Choosing between them is purely about whether you want surrounding content to *reflow* into the vacated space: use `display: none` when you want the element to genuinely disappear and let neighbors collapse into its place (the far more common real-world case — hiding a mobile menu, hiding an inactive tab panel); use `visibility: hidden` on the comparatively rarer occasions you specifically need to preserve the layout's exact spacing/alignment while making one particular element invisible (e.g., hiding one cell's content in a perfectly aligned grid of icons, without the rest of the grid shifting).

## `display: none` and screen-reader-only content — a preview

There's a third, extremely useful pattern that belongs conceptually right alongside this comparison, even though its full CSS implementation is deferred to Part 49: content that should be **visually hidden but still fully readable by screen readers** (the exact *opposite* combination from anything covered so far — neither `display: none` nor `visibility: hidden` achieve this, since both remove content from the accessibility tree too). This requires a specific, deliberate CSS technique (clipping the element to a 1×1 pixel box while keeping it technically "visible" and in normal document flow) rather than either of these two straightforward properties — we build it properly, with full working code, in Part 49.

## Flow layout — the default layout algorithm

### What it is

**Normal flow** (sometimes called "flow layout") is the browser's **default layout algorithm** — how elements are positioned when you haven't applied any special layout mode (`display: flex`, `display: grid`, `position: absolute`, and similar — all covered in upcoming Parts). Every single example so far in this course, unless stated otherwise, has been rendering in normal flow.

The rules of normal flow, made explicit:
- **Block-level elements** stack **vertically**, one after another, each taking the full available width, top to bottom, in the exact order they appear in the HTML.
- **Inline-level elements** flow **horizontally**, left to right (in left-to-right languages), wrapping to a new line automatically when they run out of horizontal space, exactly like words wrapping within a paragraph.
- Every element's final rendered position is determined by this predictable top-to-bottom, left-to-right algorithm, working purely from document/source order — there is no manual positioning involved in normal flow at all.

Understanding normal flow deeply — really internalizing that it's the browser's *default*, always-active layout mode unless something explicitly overrides it — is essential groundwork for understanding *why* `position` (Part 20), Flexbox (Part 24), and Grid (Part 25) exist at all: each of them is a deliberate, explicit *departure* from normal flow's default rules, chosen specifically for situations where normal flow's simple top-to-bottom/left-to-right stacking isn't sufficient to achieve the layout you need.

## Exercises — Part 19

1. Given a `<span>` with `width: 200px;` set on it, why does the span not actually appear 200px wide on screen? What single change fixes it?
2. You want a row of navigation links that sit side-by-side (not stacked) but each needs a fixed `height` and `padding` to create a comfortable, evenly-sized clickable area. Which `display` value fits this requirement, and why?
3. You're hiding an inactive tab panel in a tabbed interface — should you use `display: none` or `visibility: hidden`? Justify your choice.
4. You have a row of 5 icons that must always stay perfectly aligned in a grid, but you want one specific icon to be invisible in certain states without the other 4 shifting position. Which property fits, and why?
5. Explain "normal flow" in your own words, and name two CSS mechanisms that explicitly override/depart from it.

<details>
<summary>View solutions</summary>

1. Because `<span>` is `display: inline` by default, and inline elements ignore `width`/`height` entirely. Setting `display: inline-block` (or `display: block`, if a forced line break is also acceptable) fixes it, since both respect `width`/`height`.
2. `display: inline-block` — it flows side-by-side like inline content (no forced line break between each link), while still fully respecting `height` and `padding` for a controlled, comfortable click target, unlike plain `inline` which would ignore height and only apply horizontal padding visually.
3. `display: none` — hiding an inactive tab panel should make it disappear entirely, with the active panel's content (and any surrounding layout) not leaving a reserved empty gap where the inactive panel would have been. `visibility: hidden` would leave dead, reserved empty space exactly where the hidden panel was, which is not the desired behavior for tab switching.
4. `visibility: hidden` — because it preserves the element's reserved layout space exactly, so the other 4 icons in the grid don't shift or reflow when one becomes invisible; `display: none` would remove it from layout entirely, causing the remaining icons to collapse into its space and lose alignment.
5. Normal flow is the browser's default layout algorithm, active whenever no special layout mode is applied: block-level elements stack vertically in source order, each taking full available width; inline-level elements flow horizontally, wrapping to new lines as needed, like words in a paragraph. Two mechanisms that explicitly override it: `position` (absolute/fixed positioning removes an element from normal flow entirely, Part 20) and `display: flex`/`display: grid` (both establish entirely new layout algorithms for their children, Parts 24–25).

</details>

---

# PART 20 — Positioning

This is another special-focus area of this course. Positioning is genuinely one of the trickier CSS topics to build solid intuition for, primarily because of one specific concept — **containing blocks** — that most tutorials gloss over, and whose absence is the root cause of a large fraction of all "why is my absolutely-positioned element in the wrong place?!" confusion. We'll build that intuition properly here, not skip past it.

## The five `position` values

### `position: static` — the default

```css
.box {
    position: static; /* the default value for every element, if you never set position at all */
}
```

`static` is simply normal flow (Part 19) — no special positioning behavior at all. An element with `position: static` **ignores** `top`, `right`, `bottom`, `left`, and `z-index` entirely (all covered below) — they have zero effect. Every element is `position: static` unless you explicitly set something else.

### `position: relative`

```css
.box {
    position: relative;
    top: 10px;
    left: 20px;
}
```

`relative` positioning does two genuinely distinct things simultaneously, and conflating them is a common source of confusion:

1. The element is still laid out in **normal flow**, exactly where it would normally appear — its original space in the document is still fully reserved, exactly as if `position` were still `static`.
2. **Then**, it is visually **shifted** from that original position, by the `top`/`right`/`bottom`/`left` offsets you specify — but this shift is purely *visual*; it does not affect surrounding elements' layout at all. Other elements behave exactly as if the relatively-positioned element were still sitting in its original, un-shifted spot.

```text
Before relative shift:              After position: relative; top: 20px; left: 30px;

+--------+--------+--------+        +--------+                +--------+
| Box A  | Box B  | Box C  |        | Box A  |   (Box B's       | Box C  |
+--------+--------+--------+        +--------+    ORIGINAL      +--------+
                                                    space is
                                                    still reserved
                                                    here, empty)
                                              +--------+
                                              | Box B  |  ← visually shifted
                                              +--------+    20px down, 30px right,
                                                             but Box A and Box C
                                                             don't move at all
```

> ⚠️ **Common mistake** — Expecting `top`/`left` on a `position: relative` element to *move* the element out of the document flow the way `absolute` does (covered next), causing surrounding elements to reflow around its new position. This is not what happens — relative positioning's offset is purely a visual shift layered on top of the element's normal-flow position; its original space stays fully reserved and untouched by neighbors regardless of the offset applied.

### `position: absolute`

```css
.parent {
    position: relative; /* establishes a containing block — see below */
}
.child {
    position: absolute;
    top: 0;
    right: 0;
}
```

`absolute` positioning is a genuine, complete departure from normal flow:

1. The element is **removed from normal flow entirely** — it no longer reserves any space at all; surrounding elements behave exactly as if it doesn't exist, collapsing/reflowing into the space it would have otherwise occupied.
2. It is positioned using `top`/`right`/`bottom`/`left`, but **relative to its nearest positioned ancestor** — this is the **containing block** concept, and it is *the* critical idea this entire section builds toward.

### Containing blocks — the concept most tutorials skip

This is, without exaggeration, the single most important idea for actually understanding absolute (and fixed) positioning correctly, rather than just copy-pasting values and hoping.

**The rule:** an absolutely-positioned element's `top`/`right`/`bottom`/`left` offsets are calculated relative to its **nearest ancestor that has a `position` value other than `static`** (i.e., `relative`, `absolute`, `fixed`, or `sticky`) — that ancestor is called its **containing block**. If **no** ancestor has a non-static position, the containing block falls all the way back to the **initial containing block** — effectively, the entire browser viewport/document itself.

```html
<div class="parent">
  <div class="child">I'm absolutely positioned</div>
</div>
```

```css
/* Scenario 1: parent has no explicit position (stays static, the default) */
.parent { /* position: static (default) */ }
.child {
    position: absolute;
    top: 0;
    right: 0;
    /* .child positions itself relative to the ENTIRE PAGE/VIEWPORT,
       because .parent isn't a valid containing block (it's static) —
       the browser keeps looking UP the ancestor tree until it finds
       one that IS positioned, or gives up and uses the viewport */
}
```

```css
/* Scenario 2: parent explicitly given position: relative */
.parent {
    position: relative; /* NOW .parent qualifies as a containing block */
}
.child {
    position: absolute;
    top: 0;
    right: 0;
    /* .child now positions itself relative to .parent's own box,
       NOT the whole page — top: 0; right: 0; places it in
       .parent's own top-right corner */
}
```

```text
Scenario 1 (.parent is static — NOT a valid containing block):

VIEWPORT / PAGE
┌───────────────────────────────────────────────┐
│                                    [.child] ← top:0, right:0
│  ┌─────────────┐                    is relative to the
│  │  .parent     │                     WHOLE PAGE, not .parent —
│  │              │                     it visually "escapes"
│  └─────────────┘                     .parent entirely
└───────────────────────────────────────────────┘

Scenario 2 (.parent has position: relative — IS a valid containing block):

┌─────────────────────────┐
│  .parent      [.child] ←── top:0, right:0 is now relative
│                            to .parent's own corner, staying
│                            visually contained within it
└─────────────────────────┘
```

> 💡 **Tip** — This is exactly why you'll see `position: relative` applied to a parent element **with no `top`/`left`/offset values at all** so often in real CSS — it's an extremely common, deliberate pattern used purely to **establish a containing block** for an absolutely-positioned child, taking advantage of the fact that `relative` positioning (with no offsets specified) has *zero* visible effect on the parent's own layout, while still fully "activating" it as a valid containing block reference point for any absolutely-positioned descendants.

### `position: fixed`

```css
.sticky-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}
```

`fixed` positioning behaves almost identically to `absolute` in most respects (removed from normal flow, positioned via offsets relative to a containing block) — **except** its containing block is, by default, always the **viewport itself** (the visible browser window), and critically, it **stays fixed in place visually even as the page is scrolled** — it does not move with the rest of the document's content at all. This is exactly the mechanism behind persistent headers, floating action buttons, and cookie-consent banners that remain visible regardless of scroll position.

> ⚠️ **Common mistake / advanced nuance** — A `fixed` element's containing block is the viewport **unless** one of its ancestors has a `transform`, `filter`, `perspective`, or a few other specific CSS properties applied — in that specific case, that ancestor becomes the containing block instead of the viewport, and the "stays fixed regardless of scroll" behavior effectively breaks (it now scrolls along with that ancestor instead). This is a genuinely obscure, frequently-baffling real-world bug: applying an *unrelated* `transform` (say, for an animation, Part 31) to some ancestor container can silently break a `position: fixed` element nested deep inside it, with no obvious visual connection between the two. Worth simply being aware this interaction exists, so you know where to look if a "why did my fixed header suddenly stop being fixed" bug ever appears.

### `position: sticky`

```css
.section-heading {
    position: sticky;
    top: 0;
}
```

`sticky` is, conceptually, a genuine **hybrid** of `relative` and `fixed`: the element behaves as `position: relative` (normal flow, fully reserving its space) **until** the page is scrolled to the point where it would scroll past the specified offset (`top: 0` here) — at that exact moment, it "locks" and behaves like `position: fixed`, staying visually pinned at that offset, **until its parent container scrolls entirely out of view**, at which point it unlocks and resumes scrolling normally along with the rest of the page.

```text
Scrolling behavior of position: sticky; top: 0; :

Scroll position 1 (element hasn't reached the sticky point yet):
┌─────────────────────┐
│   ... page content    │
│  ┌─────────────────┐ │
│  │ .section-heading │ │  ← behaves like normal position: relative,
│  └─────────────────┘ │     scrolls normally with the page
│   more content...     │
└─────────────────────┘

Scroll position 2 (user has scrolled further — element has now "stuck"):
┌─────────────────────┐
│ .section-heading      │  ← NOW pinned to top: 0, behaving like
├─────────────────────┤     position: fixed, while the rest of
│   content scrolls      │     the page continues scrolling underneath it
│   underneath it...     │
└─────────────────────┘

(Once the PARENT container's bottom edge scrolls past the top of the
 viewport, the sticky element "releases" and scrolls away with it —
 it can never stick beyond its own parent's boundaries)
```

This is the exact mechanism behind sticky section headers in a long list (like alphabetical contact groupings), sticky table headers, and sticky sidebars that track scroll position until their container ends — all without a single line of JavaScript.

## `top`, `right`, `bottom`, `left`, and `inset`

```css
.box {
    position: absolute;
    top: 10px;
    right: 20px;
    bottom: 10px;
    left: 20px;
}
```

These four **offset properties** only have any effect on positioned elements (anything other than `static`) — as established above, they specify the distance from each respective edge of the element's containing block. Setting **opposite pairs** (both `left` and `right`, or both `top` and `bottom`) on an element **without** an explicit `width`/`height` effectively *stretches* the element to fill the distance between those two edges — a genuinely useful technique.

```css
.overlay {
    position: absolute;
    inset: 0;
}
```

`inset` is a shorthand that sets `top`, `right`, `bottom`, and `left` all at once (following the same shorthand ordering convention as `margin`/`padding`, covered fully in Part 21) — `inset: 0;` is a common, concise way to write "stretch this element to perfectly fill its entire containing block on all four sides," equivalent to writing `top: 0; right: 0; bottom: 0; left: 0;` individually.

## `z-index` and stacking contexts

### What `z-index` is

```css
.modal {
    position: fixed;
    z-index: 100;
}
.overlay-backdrop {
    position: fixed;
    z-index: 90;
}
```

`z-index` controls the **stacking order** (front-to-back layering) of positioned elements that visually overlap — a higher `z-index` value renders *in front of* a lower one. Critically, **`z-index` only has an effect on elements with a `position` value other than `static`** — setting `z-index` on a `static` element does absolutely nothing.

### Stacking contexts — the real reason "z-index isn't working"

This is, hands-down, one of the most common and most genuinely confusing real-world CSS bugs: setting a very high `z-index` on an element (`z-index: 9999;`, even `z-index: 999999;`) and having it *still* render behind some other element with a seemingly much lower `z-index`. The cause is almost always a misunderstanding of **stacking contexts**.

**The core concept:** `z-index` values are **not globally compared across the entire page**. Instead, certain CSS properties/values cause an element to establish a brand new, **self-contained stacking context** — and once that happens, `z-index` values set on that element's *descendants* are only ever compared **against each other, within that same local stacking context** — they can *never* escape it to compete directly against `z-index` values from a completely different part of the page's stacking hierarchy, no matter how numerically large they are.

```html
<div class="context-a">
  <div class="child-a" style="z-index: 9999;">A</div>
</div>
<div class="context-b">
  <div class="child-b" style="z-index: 1;">B</div>
</div>
```

```css
.context-a {
    position: relative;
    z-index: 1; /* .context-a itself establishes a NEW stacking context */
}
.context-b {
    position: relative;
    z-index: 2; /* .context-b ALSO establishes a new stacking context,
                    and — critically — .context-b's OWN z-index (2) is
                    higher than .context-a's OWN z-index (1) */
}
```

In this scenario, **`.child-b` (B) renders in front of `.child-a` (A)**, despite A's `z-index: 9999` being astronomically larger than B's `z-index: 1` — because A's `9999` is only ever compared *within* `.context-a`'s own local stacking context (where it's competing against nothing else, since it's the only positioned child there), and then `.context-a`'s *entire* stacking context, as a single unit, is compared against `.context-b`'s stacking context using **their parent-level `z-index` values** (1 vs. 2) — and `.context-b` wins that comparison, bringing its entire contents, including `.child-b`, in front of everything inside `.context-a`, no matter how high a `z-index` is buried inside it.

```text
The stacking context hierarchy, visualized as nested "layers":

Page root
├── .context-a (z-index: 1) — a self-contained stacking context
│     └── .child-a (z-index: 9999) — compared ONLY against siblings
│                                      inside .context-a; nothing else
│                                      is here to compete with, so it
│                                      "wins" trivially within its own
│                                      tiny local context
│
└── .context-b (z-index: 2) — a SEPARATE self-contained stacking context
      └── .child-b (z-index: 1)

Because .context-b's OWN z-index (2) beats .context-a's OWN z-index (1)
at the PARENT level, .context-b's entire contents render in front of
.context-a's entire contents — .child-a's huge z-index:9999 never
gets a chance to compete against .child-b directly; it's trapped
inside its own local stacking context.
```

### What creates a new stacking context

A new stacking context is established by an element when any of the following are true (a genuinely long list — these are the most common, practically important triggers):

- `position: relative`/`absolute` **combined with** a `z-index` value other than `auto`.
- `position: fixed` or `position: sticky` (these establish a stacking context automatically, even without an explicit `z-index`).
- `opacity` less than `1`.
- `transform`, `filter`, `perspective`, or `will-change` set to a value other than `none` (yes — this means a purely decorative `transform` used for a hover animation, Part 31, can *also* silently create a new stacking context, with the exact same z-index-trapping consequences shown above — another genuinely surprising, real-world-relevant interaction).
- `display: flex`/`display: grid` combined with a `z-index` value other than `auto` on the flex/grid container itself.
- The root `<html>` element (always establishes the outermost stacking context, by definition).

> ⚠️ **Common mistake** — Debugging a "z-index isn't working" issue by simply escalating the z-index value higher and higher (`999`, then `9999`, then `99999`...), hoping a big enough number eventually wins. This treats the *symptom* without understanding the *cause*, and it usually doesn't even work, since the actual issue is almost always that the element is trapped inside a lower-priority stacking context established by one of its ancestors — no z-index value on the trapped descendant, however large, can escape that ancestor's own position in the stacking order. The real fix requires identifying *which ancestor* established the problematic stacking context (using DevTools — most modern browsers' Elements panel can actually visualize the stacking context hierarchy directly) and adjusting *that* ancestor's z-index/stacking behavior instead.

## Building real UI patterns with positioning

### Badge (a small indicator pinned to a corner)

```html
<div class="icon-wrapper">
  <svg><!-- bell icon --></svg>
  <span class="badge">3</span>
</div>
```

```css
.icon-wrapper {
    position: relative; /* establishes the containing block for the badge */
    display: inline-block;
}
.badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: crimson;
    color: white;
    border-radius: 50%;
    min-width: 18px;
    height: 18px;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

### Dropdown menu

```html
<div class="dropdown">
  <button>Menu</button>
  <ul class="dropdown-menu">
    <li><a href="/profile">Profile</a></li>
    <li><a href="/settings">Settings</a></li>
  </ul>
</div>
```

```css
.dropdown {
    position: relative;
}
.dropdown-menu {
    position: absolute;
    top: 100%; /* directly below the button */
    left: 0;
    min-width: 160px;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

### Sticky header

```css
.site-header {
    position: sticky;
    top: 0;
    z-index: 50; /* keeps it above ordinary scrolling content */
    background: white;
}
```

### Full-screen overlay

```css
.modal-backdrop {
    position: fixed;
    inset: 0; /* stretches to fill the entire viewport, all four sides at once */
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
```

### Floating action button

```css
.fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    z-index: 40;
}
```

## Exercises — Part 20

1. A `<div class="badge">` needs `position: absolute; top: 0; right: 0;` to sit in the corner of its parent `<div class="card">`. What single CSS declaration must be added to `.card` for this to work correctly, and why?
2. Explain, precisely, the practical difference in what happens to surrounding elements when you switch an element from `position: relative` to `position: absolute`.
3. Why does `position: fixed` sometimes unexpectedly stop staying fixed relative to the viewport, instead scrolling along with some part of the page? What CSS properties on an ancestor can cause this?
4. You set `z-index: 99999` on an element and it still renders behind another element with `z-index: 5`. What's the most likely underlying cause, and how would you begin diagnosing it?
5. Describe, in your own words, the scroll behavior of `position: sticky` — what does it do before, during, and after the sticky point.

<details>
<summary>View solutions</summary>

1. `position: relative;` must be added to `.card`. Without it, `.card` remains `position: static` (the default) and does not qualify as a containing block, so `.badge`'s absolute positioning would fall back to being positioned relative to the entire viewport/page instead of relative to `.card` specifically.
2. `position: relative` keeps the element fully in normal flow — its original space is still completely reserved, and surrounding elements are entirely unaffected by any `top`/`left` offset applied to it (they behave as if it were still in its unshifted position). `position: absolute` removes the element from normal flow entirely — it no longer reserves any space at all, and surrounding elements reflow/collapse into the space it would have otherwise occupied, exactly as if the element had been removed from the HTML.
3. This happens when an ancestor of the fixed element has a `transform`, `filter`, `perspective`, or `will-change` property set to a value other than `none` — any of these cause that ancestor to become the fixed element's containing block instead of the viewport, so the element then scrolls along with that ancestor rather than staying fixed relative to the whole page.
4. The most likely cause is that the element is trapped inside a stacking context (established by some ancestor, via `position` + `z-index`, `opacity < 1`, a `transform`, or similar) whose own `z-index` (at the ancestor level) loses to the other element's stacking context. Diagnosing it involves identifying which ancestor establishes a stacking context (checking each ancestor's `position`, `z-index`, `opacity`, `transform`, etc. in DevTools, which can often visualize the stacking context hierarchy directly) rather than simply increasing the trapped element's own z-index further, which cannot fix the issue.
5. Before the sticky point is reached while scrolling, the element behaves exactly like `position: relative` — normal flow, fully reserving its space, scrolling normally with the page. Once scrolling reaches the point where the element would cross its specified offset (e.g., `top: 0`), it "locks" and behaves like `position: fixed`, staying visually pinned at that offset while the rest of the page's content continues to scroll underneath/past it. Once its parent container's boundary scrolls entirely past that fixed point, it "releases" and resumes scrolling normally along with the rest of the page — it can never remain stuck beyond its own parent's boundaries.

</details>

---

# PART 21 — Typography

## Font properties

### `font-family`

```css
body {
    font-family: "Helvetica Neue", Arial, sans-serif;
}
```

`font-family` accepts a **comma-separated list** of fonts, tried in order — this is called a **font stack**. The browser attempts to use the first font in the list; if it's not installed on the user's system (or, for web fonts, hasn't loaded), it falls through to the next one, and so on, ultimately ending in a **generic family** keyword (`serif`, `sans-serif`, `monospace`, `cursive`, `fantasy`) as a final, guaranteed fallback — every browser and OS has *some* default font for each generic family, so ending your stack with one guarantees text is never left completely unstyled/fallback-less.

```text
font-family: "Helvetica Neue", Arial, sans-serif;

Browser checks, in order:
1. Is "Helvetica Neue" available?  → use it if yes
2. Is "Arial" available?            → use it if #1 wasn't
3. Use the system's default sans-serif font → guaranteed fallback, always available
```

Font names containing spaces (like `"Helvetica Neue"`) must be quoted; single-word names (`Arial`) don't strictly require quotes but many style guides quote consistently anyway for readability.

### `font-size`

```css
h1 { font-size: 2.5rem; }
p  { font-size: 1rem; }
```

Covered in unit depth already in Part 17 — `rem` is the strongly preferred unit for font-size, for the accessibility reasons already established.

### `font-weight`

```css
p { font-weight: 400; }        /* normal */
strong { font-weight: 700; }   /* bold */
h1 { font-weight: 800; }       /* extra bold */
```

Numeric values from `100` (thinnest) to `900` (heaviest), in steps of 100, corresponding to standard named weights (`400` = `normal`, `700` = `bold` — these keyword aliases work too, but numeric values give finer control when a font family actually provides intermediate weights like 500 "medium" or 600 "semibold").

### `font-style`

```css
em { font-style: italic; }
```

`normal`, `italic`, or `oblique` (a synthetically slanted version of the normal style, used when a font has no true italic design of its own).

### `line-height`

```css
p {
    line-height: 1.6;
}
```

Controls the vertical space allotted to each line of text — critically, when given a **unitless number** (like `1.6`), it's calculated as a *multiple of the element's own font-size*, and (importantly) this unitless value **inherits as the raw multiplier itself**, recalculating correctly against each descendant's own font-size — rather than inheriting a fixed computed pixel value, which is what happens if you instead specify `line-height` with an explicit unit like `line-height: 24px;`.

> ⚠️ **Common mistake** — Setting `line-height` with a fixed unit (`line-height: 24px;`) on a parent, then wondering why a child with a much larger `font-size` renders with cramped, overlapping-looking line spacing. This happens because the fixed `24px` value inherits literally, unchanged, regardless of the child's own font-size — if the child's font-size is `32px`, a `24px` line-height is now smaller than the text itself. Using a unitless value (`line-height: 1.6;`) avoids this entirely, since it inherits as a *ratio*, correctly recalculating against each element's own font-size.

A good general-purpose `line-height` for body text is typically in the `1.4`–`1.6` range — tight enough to keep related lines visually connected, loose enough to keep them comfortably readable and not cramped.

### `letter-spacing` and `word-spacing`

```css
.eyebrow-text {
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
```

`letter-spacing` adjusts space between individual characters; `word-spacing` adjusts space between words. Slightly increased letter-spacing on short, uppercase "eyebrow" or label text (like a small category tag above a headline) is an extremely common, effective typographic convention — improving legibility of all-caps text, which otherwise can read as visually cramped.

## Text alignment and decoration

```css
.text-center { text-align: center; }
.text-right  { text-align: right; }
.text-justify { text-align: justify; }
```

`text-align` controls horizontal alignment of inline content *within* its block container. `justify` stretches each line (except typically the last) to fill the full container width by adjusting inter-word spacing — commonly used in print, but often avoided on the web for body text since uneven, browser-calculated word spacing across lines can hurt readability, especially at narrow widths.

```css
a { text-decoration: none; }
.strikethrough { text-decoration: line-through; }
.underline-offset { text-decoration: underline; text-underline-offset: 3px; }
```

`text-decoration` controls underline/overline/line-through/none. `text-transform: uppercase | lowercase | capitalize` controls letter casing, purely visually — critically, this **does not change the underlying text content** at all (unlike actually typing uppercase text), which matters because assistive technology and copy/paste both still work with the real, original text content, not the transformed visual appearance — a genuinely important distinction from a content-integrity standpoint.

## Handling overflowing and wrapping text

```css
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

This three-property combination is the standard, essential pattern for **single-line text truncation with an ellipsis** ("…") — extremely common for things like a card title or a table cell that must not wrap to multiple lines:

- **`white-space: nowrap`** — prevents the text from wrapping to a new line at all, forcing it to stay on one single line (potentially overflowing its container).
- **`overflow: hidden`** — clips whatever overflows beyond the container's boundary (recall Part 18).
- **`text-overflow: ellipsis`** — replaces the clipped-off portion with a visible "…" character, specifically signaling to the user that content has been truncated.

All three are required together — `text-overflow: ellipsis` alone does nothing without `overflow: hidden` (there's nothing being clipped for it to mark) and `white-space: nowrap` (without it, the text simply wraps to multiple lines instead of overflowing horizontally in the first place, so there's nothing to truncate).

```css
.long-word-wrap {
    overflow-wrap: break-word;
}
```

`overflow-wrap: break-word` (also historically known by the equivalent, older property name `word-wrap: break-word`) allows the browser to break a single, unusually long word (a long URL, a long unbroken string) mid-word if it's too long to fit its container otherwise — normal wrapping only breaks *between* words, which can cause a genuinely long single word to overflow its container entirely without this property.

```css
.controlled-hyphenation {
    word-break: break-all;
}
```

`word-break: break-all` is more aggressive still — it allows breaking **anywhere**, even mid-word, for *any* content that doesn't fit, not just unusually long single words as a fallback case. Use `overflow-wrap: break-word` as the generally gentler, more typically-desired default, reaching for `word-break: break-all` only in specific situations (like a UI that must strictly guarantee no horizontal overflow whatsoever, even at the cost of somewhat awkward mid-word breaks).

## Font stacks and web fonts — conceptual overview

Beyond a system font stack (fonts already installed on the user's device), modern web design very commonly loads **custom web fonts** — font files delivered over the network specifically for use on a given site, guaranteeing a consistent typographic look regardless of what's installed on any given visitor's device.

### `@font-face`

```css
@font-face {
    font-family: "Inter";
    src: url("/fonts/inter-regular.woff2") format("woff2"),
         url("/fonts/inter-regular.woff") format("woff");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

body {
    font-family: "Inter", Arial, sans-serif;
}
```

`@font-face` defines a **custom named font**, pointing to actual font file(s), which you can then reference by that name in any `font-family` declaration exactly like a system font. Key pieces:

- **`src`** — one or more font file URLs, each tagged with its `format()`. Multiple formats provide fallback for different browsers (though modern `.woff2` alone covers the overwhelming majority of current browsers).
- **`font-weight`/`font-style`** — declares which specific weight/style *this particular font file* represents. A typeface with multiple weights (regular, bold, etc.) typically needs a **separate `@font-face` block per weight/style**, each pointing to its own distinct font file, all sharing the same `font-family` name — the browser then automatically picks the correct file when you later request that weight via `font-weight: 700` in your actual styling.
- **`font-display: swap`** — controls what happens during the (often brief, but real) window while the custom font file is still downloading. `swap` tells the browser: show text immediately using a fallback font, then swap to the custom font the instant it finishes loading, rather than leaving text invisible while waiting (the default behavior in some browsers, called a "flash of invisible text," is a real, measurable performance/UX problem — `font-display: swap` is a simple, near-universally-recommended fix).

### Performance considerations for web fonts

> 💡 **Tip** — Custom web fonts are a genuinely common, easy-to-overlook performance cost (we return to this in full depth in Part 48): every font file/weight/style you load is a network request and real download weight, and until it arrives, users may see either invisible text or a visible font-swap "flash" as the fallback gets replaced. Practical, professional guidance: load only the specific weights/styles you actually use in your design (not an entire family's full range "just in case"), prefer the modern, highly-compressed `.woff2` format, and always set `font-display: swap` (or a similar considered value) so text remains visible during the loading window.

## Readable line length

> 💡 **Tip** — This is a well-established typographic principle, not a subjective preference: body text that stretches across an *extremely* wide container (say, the full width of a large desktop monitor, with no constraint) becomes measurably harder to read — the eye has to travel a long horizontal distance and then correctly locate the start of the *next* line, which increases reading fatigue and error rate. A widely-cited, well-supported target is roughly **45–75 characters per line**, with ~66 characters often cited as close to an ideal middle ground. Recall Part 17's `ch` unit — `max-width: 65ch;` on a body-text container is a direct, practical, and very common implementation of this exact principle.

```css
.article-body {
    max-width: 65ch;
    line-height: 1.6;
    font-size: 1.125rem;
}
```

## Exercises — Part 21

1. Write a font stack for body text that prefers "Georgia," falls back to any generic serif font, and explain why ending with a generic family keyword matters.
2. Why is `line-height: 1.5;` (unitless) generally preferred over `line-height: 24px;`, specifically in the context of inheritance across elements with different font sizes?
3. Write the complete CSS needed to truncate a long card title to a single line with an ellipsis.
4. What does `font-display: swap` actually change about the user's experience while a custom web font is loading?
5. Using the `ch` unit, constrain a paragraph to a comfortable reading width.

<details>
<summary>View solutions</summary>

**1.**
```css
body {
    font-family: Georgia, serif;
}
```
Ending with a generic family keyword (`serif`, `sans-serif`, etc.) guarantees a final, universally-available fallback — every browser/OS has some default font mapped to each generic family, so text is never left completely without any font declaration to fall back to, even if every specifically-named font in the stack fails to load or isn't installed.

**2.** A unitless `line-height` value inherits as a *ratio/multiplier*, recalculating correctly against each descendant element's own actual font-size. A fixed-unit value like `24px` inherits as that literal, unchanged pixel value regardless of a descendant's font-size — so a child with a much larger font-size than the parent could end up with a line-height smaller than its own text, causing cramped or overlapping line spacing.

**3.**
```css
.card-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

**4.** Without it, some browsers may render invisible text (blank space where the text should be) for a brief window while the custom font file is still downloading — a "flash of invisible text." `font-display: swap` tells the browser to show the text immediately using a fallback font, then swap it to the custom font the moment it finishes loading, so text is never left invisible during the loading window.

**5.**
```css
.article-paragraph {
    max-width: 65ch;
}
```

</details>

---

# PART 22 — Backgrounds

## Solid backgrounds

```css
.box {
    background-color: #f5f5f5;
}
```

The simplest background — a flat, solid color, exactly as covered in Part 16.

## Background images

```css
.hero {
    background-image: url("hero-photo.jpg");
}
```

`background-image` sets an image as an element's background layer, sitting *behind* the element's actual content (text, child elements) rather than replacing it the way `<img>` does. Multiple background properties work together to control exactly how that image behaves within the element's box.

### `background-repeat`

```css
.tiled-pattern {
    background-image: url("pattern.svg");
    background-repeat: repeat; /* default: tiles infinitely in both directions */
}
.no-repeat {
    background-repeat: no-repeat; /* shows the image exactly once, no tiling */
}
.repeat-x {
    background-repeat: repeat-x; /* tiles horizontally only */
}
```

### `background-position`

```css
.hero {
    background-image: url("hero-photo.jpg");
    background-position: center center; /* keyword pairs: left/center/right, top/center/bottom */
}
.hero-custom {
    background-position: 20px 40px; /* explicit offsets from the top-left */
}
```

Controls where within the element's box the background image is anchored/positioned, using keyword pairs (horizontal then vertical) or explicit length/percentage offsets.

### `background-size`

```css
.hero {
    background-size: cover;
}
```

```css
.logo-bg {
    background-size: contain;
}
```

- **`cover`** — scales the image so it **completely fills** the entire background area, cropping any excess that doesn't fit the element's aspect ratio. This is, by a wide margin, the most common `background-size` value for full-bleed hero images and photographic backgrounds — it guarantees no empty gaps, at the cost of potentially cropping part of the image.
- **`contain`** — scales the image so it **fits entirely within** the background area without any cropping, potentially leaving empty space (matted by `background-color` or simply transparent) on two sides if the image's aspect ratio doesn't exactly match the element's.

```text
background-size: cover                    background-size: contain
+----------------------------+            +----------------------------+
|////////////////////////////|            |     [empty space]          |
|///// IMAGE, CROPPED /////|            |//////// IMAGE //////////|
|///// TO FILL COMPLETELY //|            |//// fully visible, //////|
|////////////////////////////|            |//// no cropping //////|
+----------------------------+            |     [empty space]          |
(no gaps, but edges of the                +----------------------------+
 image may be cut off)                    (whole image visible, but may
                                            leave empty space on 2 sides)
```

### `background-attachment`

```css
.parallax-section {
    background-attachment: fixed;
}
```

`scroll` (default) — the background scrolls along with the element's content. `fixed` — the background stays visually fixed relative to the *viewport*, creating a simple parallax-like effect as the page's foreground content scrolls over it. (Note: `background-attachment: fixed` has known performance and mobile-compatibility quirks in some browsers/contexts — modern parallax effects are often achieved with `transform`-based techniques instead for better performance, a topic connected to Part 48.)

### The `background` shorthand

```css
.hero {
    background: url("hero.jpg") center/cover no-repeat;
}
```

Individual background properties can be combined into the single `background` shorthand, in a fairly flexible order, though `position/size` (separated by a `/`) is a fixed pairing when both are included together.

## Gradients

Gradients are **images**, technically — they're valid values wherever `background-image` (or the `background` shorthand) accepts one, generated entirely by the browser from a mathematical description rather than loaded from a file.

### `linear-gradient()`

```css
.button {
    background: linear-gradient(to right, #4f46e5, #7c3aed);
}
```

```css
.button-angled {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
}
```

```css
.multi-stop {
    background: linear-gradient(to right, red, yellow 50%, green);
}
```

A `linear-gradient()` transitions colors along a straight line/direction:
- **Direction** can be a keyword (`to right`, `to bottom left`) or a precise angle in degrees (`0deg` points up, `90deg` points right, `180deg` down, continuing clockwise; `135deg` is a common diagonal, top-left-to-bottom-right direction).
- **Color stops** are listed in order along that line; you can optionally specify each stop's exact position (`yellow 50%` places yellow precisely at the gradient's midpoint) rather than letting the browser distribute stops evenly by default.

```text
linear-gradient(to right, red, yellow, green)

┌────────────────────────────────────────┐
│ red ────────► yellow ────────► green     │
└────────────────────────────────────────┘
   0%             50%              100%
   (colors evenly distributed along the horizontal direction, left to right)
```

### `radial-gradient()`

```css
.spotlight {
    background: radial-gradient(circle, white, transparent);
}
```

```css
.ellipse-gradient {
    background: radial-gradient(ellipse at top left, #fef3c7, transparent 60%);
}
```

Transitions colors **outward from a center point** in a circular or elliptical pattern, rather than along a straight line — useful for spotlight/glow effects, vignettes, and soft decorative background accents.

### `conic-gradient()`

```css
.pie-chart-segment {
    background: conic-gradient(steelblue 0deg 90deg, lightgray 90deg 360deg);
}
```

```css
.color-wheel {
    background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
}
```

Transitions colors **around a center point**, like the hands of a clock sweeping around — rather than radiating outward (`radial-gradient`) or along a straight line (`linear-gradient`). This makes `conic-gradient()` a natural, purpose-built fit for pie-chart-style visuals, color wheels, and circular progress indicators, entirely in CSS with no image assets required.

## Layering multiple backgrounds

```css
.card {
    background:
        linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
        url("photo.jpg") center/cover no-repeat;
}
```

CSS supports **multiple, comma-separated background layers** on a single element simultaneously — the *first*-listed layer renders on **top**, with each subsequent layer stacking beneath it. This exact pattern — a semi-transparent gradient/color layered on top of a photo background — is an extremely common technique for ensuring text remains legible when placed over a busy, variable-contrast photographic background (a hero section's headline over a photo, for instance).

## Exercises — Part 22

1. Write CSS for a full-bleed hero background image that always completely fills its container, with no gaps, cropping as needed.
2. Write a two-color diagonal linear gradient (top-left to bottom-right) for a button background.
3. Write a radial gradient that creates a soft white "spotlight" glow, fading to transparent, centered on an element.
4. Explain the practical difference between `background-size: cover` and `background-size: contain`, including what happens to the image's edges in each case.
5. Write CSS that layers a semi-transparent black gradient over a background photo, to help ensure white text remains readable over it.

<details>
<summary>View solutions</summary>

**1.**
```css
.hero {
    background-image: url("hero.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
```

**2.**
```css
.button {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
}
```

**3.**
```css
.spotlight {
    background: radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%);
}
```

**4.** `cover` scales the image so it completely fills the element's box, with no empty gaps — but if the image's aspect ratio doesn't match the box's, some of the image's edges get cropped off to achieve this full coverage. `contain` scales the image so the *entire* image is visible with no cropping at all — but if the aspect ratios don't match, this can leave empty (uncovered) space on two opposite sides of the box instead.

**5.**
```css
.hero {
    background:
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url("photo.jpg") center/cover no-repeat;
    color: white;
}
```

</details>

---

# PART 23 — Borders and Shadows

## `border`

```css
.box {
    border: 2px solid steelblue;
}
```

The `border` shorthand combines **width**, **style**, and **color** in that order (though CSS shorthands generally tolerate reordering for this specific property, `width style color` is the conventional order). Individual sides can be controlled independently:

```css
.box {
    border-top: 1px solid #ddd;
    border-bottom: 2px solid black;
    border-left: none;
    border-right: none;
}
```

Common `border-style` values: `solid`, `dashed`, `dotted`, `double`, `none`. A border needs a non-`none` style **and** a non-zero width to actually render visibly — setting only `border-color` with no `border-style` produces no visible border at all, a common beginner oversight.

## `border-radius`

```css
.rounded {
    border-radius: 8px;
}
.pill-button {
    border-radius: 9999px; /* a value larger than half the element's height/width
                               produces a fully rounded "pill" or perfect circle */
}
.circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
```

`border-radius` rounds an element's corners. A value of `50%` on an element with **equal** `width` and `height` produces a perfect circle (since `50%` of each dimension curves the corner all the way to the shape's own center). An arbitrarily large fixed value (like `9999px`, far exceeding the element's actual size) is a common, robust technique for a "pill" shape — it reliably produces fully-rounded ends regardless of the element's exact height, without needing to calculate the precise half-height value.

```css
.custom-corners {
    border-radius: 16px 4px 16px 4px; /* top-left, top-right, bottom-right, bottom-left */
}
```

Like `margin`/`padding` (covered fully in the shorthand notes throughout this course), `border-radius` accepts up to four values for independent corner control, following the same clockwise-from-top-left ordering convention.

## `outline`

```css
button:focus-visible {
    outline: 3px solid steelblue;
    outline-offset: 2px;
}
```

`outline` is visually similar to `border` but has genuinely distinct behavior worth understanding precisely:

- **Outline does not affect layout/box size at all** — unlike `border` (which, recall Part 18, is fully accounted for in the box model under `content-box`, and included in the total under `border-box`), `outline` is drawn *outside* the element's box without taking up any layout space or shifting neighboring elements, ever, regardless of `box-sizing`.
- **`outline-offset`** adds a gap between the element's edge and the outline itself (a property with no real `border` equivalent).
- Outlines can also be non-rectangular in some cases (following an irregular element shape more loosely than a border strictly would), though this is a minor, rarely load-bearing distinction in practice.

This "doesn't affect layout" property is *exactly* why `outline` (rather than `border`) is the correct, standard tool for focus indicators (Part 12, Part 14's `:focus-visible`): a focus ring appearing/disappearing as a user tabs through interactive elements should never cause the surrounding layout to visibly shift or reflow, which is precisely what could happen if focus states were implemented with `border` instead.

## `box-shadow`

```css
.card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

```text
box-shadow: [horizontal-offset] [vertical-offset] [blur-radius] [spread-radius] [color];

     0           4px            12px                              rgba(0,0,0,0.15)
     │            │               │                                       │
 horizontal    vertical        how soft/                             shadow
 offset        offset          feathered                             color
 (left/right)  (up/down)       the edge is
```

- **Horizontal offset** — positive values shift the shadow right, negative shift left.
- **Vertical offset** — positive values shift the shadow down, negative shift up.
- **Blur radius** — larger values produce a softer, more feathered/diffused shadow edge; `0` produces a hard, sharp-edged shadow.
- **Spread radius** (optional, fourth length value) — expands (positive) or contracts (negative) the shadow's size before blurring is applied.
- **Color** — typically a semi-transparent color (`rgba()`/`hsl() / alpha`), since real-world shadows are rarely fully opaque.

```css
.elevated {
    box-shadow:
        0 1px 2px rgba(0,0,0,0.08),
        0 4px 8px rgba(0,0,0,0.08),
        0 12px 24px rgba(0,0,0,0.08);
}
```

Multiple, comma-separated shadows can be **layered** on a single element — a common, effective technique for creating a more soft, realistic sense of depth/elevation than a single flat shadow can achieve on its own (mimicking how real-world shadows actually have both a tight, sharp component close to the object and a broader, softer component further out).

```css
.pressed-in {
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}
```

The `inset` keyword flips the shadow to render *inside* the element's border instead of outside it — commonly used for a "pressed in" or recessed visual effect, like an active/pressed button state or an inset input field.

## `text-shadow`

```css
.hero-heading {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
```

Functions identically to `box-shadow` in terms of its offset/blur/color syntax (minus the `spread` and `inset` options, which `text-shadow` doesn't support), but applies specifically to an element's text glyphs rather than its box — commonly used to improve legibility of light-colored text placed over a busy or variable background image (recall Part 22's layered-gradient technique — `text-shadow` is a complementary, sometimes-sufficient alternative or addition for the same underlying legibility goal).

## Why removing focus outlines without replacement is bad — revisited with full context

This was introduced as a critical accessibility point in Part 12, and referenced again in Part 14's `:focus-visible` discussion — now that you understand `outline` properly as its own distinct property (not affecting layout, purpose-built for exactly this use case), the full picture is complete:

```css
/* ❌ Never do this with nothing to replace it */
* {
    outline: none;
}
```

```css
/* ✅ The correct, complete modern pattern */
:focus {
    outline: none;
}
:focus-visible {
    outline: 3px solid steelblue;
    outline-offset: 2px;
}
```

This is worth stating one final time, explicitly, now that the full technical picture (Parts 12, 14, and 23 combined) is in place: removing `outline` globally with no `:focus-visible` replacement removes the *only* visual signal a sighted keyboard user has for their current position on the page — a severe, common, and completely avoidable accessibility failure. There is no visual-design justification that overrides this; the correct solution is always to *replace* the default outline with an intentionally-styled one (using `outline`, `box-shadow`, or both together), scoped correctly with `:focus-visible`, never to delete it outright.

## Exercises — Part 23

1. Write CSS for a card with a subtle, soft drop shadow appropriate for a clean, modern UI (soft blur, low opacity, slight vertical offset).
2. Create a perfect circle avatar image using `border-radius`, given a 48×48px image.
3. Explain the concrete, functional difference between `border` and `outline` — not visually, but in terms of layout behavior.
4. Write an `inset` box-shadow appropriate for a "pressed" button state.
5. Explain why `outline: none;` applied globally with no replacement is a real accessibility failure, referencing what specifically becomes impossible for a keyboard user as a result.

<details>
<summary>View solutions</summary>

**1.**
```css
.card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

**2.**
```css
.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover; /* covered fully in Part 39 */
}
```

**3.** `border` is fully part of the box model — it's included in the element's total rendered size under `box-sizing: border-box`, or added on top of the content size under `content-box`, and it always takes up real layout space, potentially shifting/affecting neighboring elements. `outline` is drawn outside the element's box entirely, taking up zero layout space, regardless of `box-sizing`, and never affects the positioning of surrounding elements.

**4.**
```css
.button:active {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.25);
}
```

**5.** The default browser focus outline is the only visual indicator a sighted keyboard-only user has for which element on the page currently has keyboard focus — without it, such a user has no way to visually track their current position as they Tab through the page, making it effectively impossible to know what they're about to activate with Enter/Space, or where they currently are at all. This isn't a minor cosmetic issue — it's a complete, hard barrier to using the page via keyboard, for purely aesthetic reasons that have a straightforward, correct alternative (`:focus-visible` with an intentional custom outline).

</details>

---



# PART 24 — Flexbox

This is one of the most important, most heavily-used sections in the entire course. Flexbox fundamentally changed how CSS layout is done, and it remains, to this day, the tool you'll reach for constantly — for navbars, cards, toolbars, centering content, and any layout involving a single row or column of flexible items. Take your time with this Part; rushing it produces exactly the kind of shaky, guess-and-check Flexbox usage that plagues so much real-world CSS.

## What problem does Flexbox solve?

Before Flexbox existed, centering an element vertically within its parent — something that sounds like it should be trivial — was a genuine, well-known pain point in CSS, often requiring awkward combinations of `position: absolute` with negative margins/transforms, or table-display hacks (recall Part 6's warning about `<table>`-based layout — some developers even resorted to `display: table` purely to access table-like vertical-centering behavior for non-tabular layout, a real historical workaround). Distributing a row of items with even spacing between them, or making a row of cards all match the height of their tallest sibling, were similarly awkward without purpose-built tools.

**Flexbox** ("Flexible Box Layout") was designed specifically to solve **one-dimensional layout problems** — arranging a group of items along a single row *or* a single column, with powerful, built-in control over spacing, alignment, sizing, and wrapping — replacing what used to require fragile hacks with a small set of clearly-named, purpose-built properties.

## The main axis and the cross axis — the single most important concept in Flexbox

Every single Flexbox concept in this entire Part builds on one foundational idea: **Flexbox operates along two perpendicular axes**, and which axis is which depends entirely on `flex-direction`.

```text
flex-direction: row (the default)

MAIN AXIS  ────────────────────────────────────────▶
        ┌────────┐ ┌────────┐ ┌────────┐
        │ item 1  │ │ item 2  │ │ item 3  │
        └────────┘ └────────┘ └────────┘
CROSS AXIS
     │
     ▼


flex-direction: column

CROSS AXIS ────────────────────────────────────────▶

MAIN AXIS   ┌────────┐
    │        │ item 1  │
    │        └────────┘
    │        ┌────────┐
    │        │ item 2  │
    │        └────────┘
    │        ┌────────┐
    │        │ item 3  │
    │        └────────┘
    ▼
```

- The **main axis** is the primary direction items are laid out along — horizontal by default (`row`), or vertical if you switch to `column`.
- The **cross axis** is always **perpendicular** to the main axis — vertical when the main axis is horizontal, and horizontal when the main axis is vertical.

**This single distinction is the source of nearly all Flexbox confusion for beginners**, because the two most commonly-used alignment properties — `justify-content` and `align-items` — are each tied to a *specific* axis, not to a fixed "horizontal" or "vertical" meaning:

- **`justify-content` always controls alignment along the main axis.**
- **`align-items` always controls alignment along the cross axis.**

So in `flex-direction: row` (the default), `justify-content` controls *horizontal* spacing/alignment and `align-items` controls *vertical* alignment — but the instant you switch to `flex-direction: column`, those meanings **swap**: `justify-content` now controls *vertical* spacing/alignment (since the main axis is now vertical) and `align-items` now controls *horizontal* alignment. Internalizing "main axis vs. cross axis," rather than memorizing "justify-content = horizontal," is what actually prevents confusion once you start using `column` layouts.

## Turning on Flexbox: `display: flex`

```css
.container {
    display: flex;
}
```

Setting `display: flex` on a **container** element does two things immediately, before any other Flexbox property is even applied:
1. It establishes the container as a **flex container**, and every one of its **direct children** automatically becomes a **flex item**.
2. Flex items default to arranging themselves in a single **row**, all at their natural content size, left-to-right, top-aligned, with no wrapping — this is the unstyled Flexbox starting point every other property then builds on and modifies.

## Container properties

### `flex-direction`

```css
.container { flex-direction: row; }             /* default: left to right */
.container { flex-direction: row-reverse; }      /* right to left */
.container { flex-direction: column; }            /* top to bottom */
.container { flex-direction: column-reverse; }    /* bottom to top */
```

Sets which direction the main axis runs, as diagrammed above. The `-reverse` variants keep the same axis but flip the *order* items are laid out in (visually reversed from their source/DOM order — worth remembering the earlier Part 12 caution: visual reordering via CSS, including this, does **not** change keyboard tab order, which still follows DOM source order — a genuine consideration for accessibility if `row-reverse`/`column-reverse` is used).

### `flex-wrap`

```css
.container { flex-wrap: nowrap; }   /* default: items squeeze onto ONE line, shrinking if needed */
.container { flex-wrap: wrap; }     /* items that don't fit flow onto additional lines */
.container { flex-wrap: wrap-reverse; }  /* like wrap, but new lines stack in reverse order */
```

By default (`nowrap`), Flexbox forces **all** items onto a single line/row, shrinking them (per the sizing algorithm covered below) if necessary to make them all fit — items never wrap to a new line on their own unless you explicitly allow it. `flex-wrap: wrap` permits items that don't fit within the container's available space to flow onto additional lines instead, much like words wrapping in a paragraph.

### `justify-content` — main-axis alignment

```css
.container { justify-content: flex-start; }    /* default: items packed at the main-axis start */
.container { justify-content: flex-end; }       /* items packed at the main-axis end */
.container { justify-content: center; }         /* items packed together, centered */
.container { justify-content: space-between; }  /* first/last items flush to edges, even gaps between */
.container { justify-content: space-around; }   /* even space around EACH item (half-gaps at the edges) */
.container { justify-content: space-evenly; }   /* perfectly even space everywhere, including edges */
```

```text
justify-content: flex-start
[A][B][C]                                              

justify-content: center
          [A][B][C]                                    

justify-content: flex-end
                                              [A][B][C]

justify-content: space-between
[A]              [B]              [C]
 (first/last items touch the container edges, gaps between items are equal)

justify-content: space-around
   [A]           [B]           [C]
 (each item gets equal space AROUND it — edge gaps end up visually HALF
  the size of the gaps between items, since two items' "around" space
  combines between them but not at the outer edges)

justify-content: space-evenly
    [A]          [B]          [C]
 (ALL gaps — including the outer edges — are made perfectly, visually equal)
```

> ⚠️ **Common mistake** — Confusing `space-around` and `space-evenly`. They look similar but produce visibly different edge spacing: `space-around` gives each item equal space on *both* its own sides, which means the outer edges (where only one item's "around" space applies, not two combining) end up looking like *half* the gap size compared to the space between items. `space-evenly` explicitly makes every gap, including the two outer edges, perfectly equal. If you want the outermost items visually flush with equal-looking gaps throughout, `space-evenly` is almost always what you actually want.

### `align-items` — cross-axis alignment (single line)

```css
.container { align-items: stretch; }      /* default: items stretch to fill the cross-axis size */
.container { align-items: flex-start; }   /* items align to the cross-axis start */
.container { align-items: flex-end; }     /* items align to the cross-axis end */
.container { align-items: center; }       /* items centered along the cross axis */
.container { align-items: baseline; }     /* items aligned by their text baselines */
```

**`stretch`**, the default, is a genuinely surprising behavior for many beginners encountering Flexbox for the first time: flex items, *by default*, stretch to fill the entire cross-axis size of the container — this is exactly why, for instance, a row of flex-item cards with `align-items: stretch` (the default, so often achieved with zero extra code) all naturally end up the *same height*, matching whichever sibling has the tallest natural content — one of Flexbox's most immediately useful, "just works" behaviors, and a very common reason developers reach for `display: flex` even for layouts that aren't primarily about horizontal arrangement at all.

### `align-content` — cross-axis alignment across multiple lines

```css
.container {
    flex-wrap: wrap;
    align-content: space-between;
}
```

This is a genuinely common point of confusion: `align-content` looks similar to `align-items`, but they control **different things**. `align-items` aligns items **within their own line**, along the cross axis. `align-content` controls how **multiple wrapped lines**, as a group, are distributed within the container's *total* cross-axis space — it only has any visible effect when `flex-wrap: wrap` is set **and** there's more cross-axis space available than the wrapped lines actually need. It accepts the same set of values as `justify-content`, conceptually applying that same distribution logic to whole *lines* instead of individual items.

### `gap`

```css
.container {
    display: flex;
    gap: 16px;
}
.container-two-axis {
    display: flex;
    flex-wrap: wrap;
    row-gap: 16px;
    column-gap: 24px;
}
```

`gap` (with optional separate `row-gap`/`column-gap`) inserts consistent spacing **between** flex items, without adding any space before the first or after the last item — a dramatic, welcome improvement over the older technique of applying `margin` to individual items and then needing special-case CSS to strip the margin from the first/last item to avoid unwanted edge spacing. `gap` is now the standard, default way to space out flex (and grid) items in modern CSS.

## Item properties

### `flex-grow`

```css
.item { flex-grow: 0; }  /* default: item does NOT grow beyond its base size, even with extra space available */
.item-fills-space { flex-grow: 1; }  /* item grows to consume available extra space */
```

`flex-grow` controls whether — and how much, *relative to sibling items*, — an item grows to fill any **leftover extra space** in the container, beyond what all items' base sizes already account for. A value of `0` (the default) means the item never grows past its natural/base size, even if there's extra room. A positive value means it *will* grow, and the **specific number acts as a ratio relative to other flex-grow values among siblings**:

```css
.item-a { flex-grow: 1; }
.item-b { flex-grow: 2; }
.item-c { flex-grow: 1; }
```

```text
If there's 400px of extra leftover space to distribute:

Total flex-grow "shares" = 1 + 2 + 1 = 4 shares
.item-a gets 1/4 of 400px = 100px extra
.item-b gets 2/4 of 400px = 200px extra   ← grows TWICE as much as A or C
.item-c gets 1/4 of 400px = 100px extra
```

### `flex-shrink`

```css
.item { flex-shrink: 1; }  /* default: item WILL shrink if there isn't enough room for everyone's base size */
.item-never-shrinks { flex-shrink: 0; }  /* item refuses to shrink below its base size, ever */
```

`flex-shrink` is the mirror image of `flex-grow`, working when there **isn't enough space** to fit every item at its base size — by default (`flex-shrink: 1`), items *do* shrink proportionally (relative to sibling flex-shrink values, using the same ratio logic as growth) to fit within the container, rather than overflowing it. Setting `flex-shrink: 0` explicitly prevents an item from ever shrinking below its base size, even if that causes the row to overflow its container — a common, deliberate choice for something like a fixed-size icon or logo that should never be visually squished.

### `flex-basis`

```css
.item {
    flex-basis: 200px; /* the item's "starting" size, before grow/shrink adjustments are applied */
}
```

`flex-basis` sets an item's **initial main-axis size**, before any `flex-grow`/`flex-shrink` adjustments kick in — conceptually similar to `width` (when the main axis is horizontal) or `height` (when it's vertical), but specifically scoped to the main axis regardless of direction. Its default value, `auto`, means "use the item's own natural content-based size (or its explicit `width`/`height` if one is set) as the starting basis."

### The `flex` shorthand — the property you'll actually use constantly

```css
.item {
    flex: 0 1 auto; /* the actual, literal default: don't grow, do shrink, auto basis */
}
```

```css
.item-fill { flex: 1; }             /* shorthand for: flex-grow: 1; flex-shrink: 1; flex-basis: 0%; */
.item-fixed { flex: 0 0 200px; }    /* shorthand for: don't grow, don't shrink, fixed 200px basis */
.item-flexible { flex: 1 1 200px; } /* grow AND shrink, starting from a 200px basis */
```

`flex` is the near-universally-used **shorthand** combining `flex-grow`, `flex-shrink`, and `flex-basis` in that specific order. Understanding `flex: 1;` in genuine depth — not as a magic incantation, but as exactly what it expands to — is one of the most practically valuable things you can take from this entire Part:

```text
flex: 1;
  is shorthand for:
flex-grow: 1;     ← DOES grow to fill available space
flex-shrink: 1;   ← DOES shrink if needed
flex-basis: 0%;   ← starts from essentially ZERO, then grows entirely based on
                      the flex-grow ratio relative to siblings — meaning items
                      with flex: 1 end up SPLITTING the available space roughly
                      evenly (assuming equal flex-grow values), rather than
                      starting from their natural content size and adjusting
                      from there
```

This last point is genuinely important and commonly misunderstood: because `flex: 1`'s basis is `0%`, a row of several `flex: 1` items will divide the container's space **evenly among themselves**, essentially ignoring their own natural content size as a starting point — this is exactly the behavior behind the extremely common "N equal-width columns" pattern:

```css
.column {
    flex: 1;
}
```

```html
<div style="display: flex; gap: 16px;">
  <div class="column">Short</div>
  <div class="column">A much, much longer piece of content here</div>
  <div class="column">Medium length</div>
</div>
```

Despite wildly different amounts of actual text content, all three `.column` divs above render at **exactly the same width** — each splitting the available space evenly, because `flex: 1` (basis `0%`, equal grow ratio) deliberately ignores natural content size as the starting point.

### `align-self`

```css
.item-special {
    align-self: center; /* overrides the container's align-items JUST for this one item */
}
```

`align-self` lets **one individual item** override the container's `align-items` value, without affecting any of its siblings — useful for the occasional item that needs different cross-axis alignment than the rest of the group.

### `order`

```css
.item-move-to-front {
    order: -1; /* visually moves this item before all default-order (order: 0) siblings */
}
```

`order` visually reorders flex items independent of their actual DOM/source order — every item defaults to `order: 0`; a lower value moves an item earlier, a higher value moves it later. **`order` changes only the visual position, never the underlying DOM order or the keyboard tab order**, which is a genuine, real accessibility consideration any time `order` is used to meaningfully reorder content — a mismatch between visual order and tab order is disorienting for keyboard users, echoing the exact same caution given for positive `tabindex` values back in Part 12.

## `flex: 1` in exhaustive detail, and the overflow problem it can cause

This deserves its own dedicated treatment, because it's one of the single most common real-world Flexbox bugs: **a flex item with long, unbreakable content (a long word, a long URL, certain content that resists wrapping) can overflow its container even when using `flex-shrink: 1` (the default) or `flex: 1`.**

The underlying cause: flex items have an implicit **default `min-width: auto`** (for a row layout; `min-height: auto` for a column layout) — meaning, by default, a flex item will never shrink *smaller* than its own content's intrinsic minimum size, **even if `flex-shrink` would otherwise want to shrink it further** to fit the available space. For most content, this default is invisible and harmless — but for content with a long unbreakable string, that intrinsic minimum can be quite large, causing the item (and often its entire container) to visibly overflow.

```css
.flex-item {
    flex: 1;
    min-width: 0; /* explicitly overrides the implicit auto minimum, ALLOWING the
                     item to shrink below its content's natural intrinsic size —
                     the essential fix for this specific overflow scenario */
}
```

```text
Without min-width: 0                       With min-width: 0
+--------------------------+               +--------------------------+
|[Menu][ https://averyveryverylongurl...   |[Menu][ https://averyver...   |
+--------------------------+ overflow!    +--------------------------+
(the long-URL item refuses to shrink        (min-width: 0 allows it to shrink,
 below its intrinsic content width,          typically combined with overflow-wrap
 pushing the whole row past the              or text-overflow/ellipsis from Part 21
 container's boundary)                       to handle the now-truncated text nicely)
```

> ⚠️ **Common mistake** — This exact `min-width: auto` default trap is, genuinely, one of the top real-world sources of "why is my flex layout overflowing even though I set flex-shrink/flex: 1 correctly?!" confusion, precisely because it's an *implicit* default that most Flexbox tutorials skip entirely. Whenever a flex item containing text (especially text that might be long, dynamic, or user-generated — a username, a URL, a product title) seems to be stubbornly refusing to shrink and is overflowing its row, `min-width: 0;` (or, for `flex-direction: column`, `min-height: 0;`) on that item is very often the missing, precise fix.

## Building real UI with Flexbox

### Navbar

```html
<nav class="navbar">
  <div class="navbar-logo">Brand</div>
  <ul class="navbar-links">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
  <button class="navbar-cta">Sign Up</button>
</nav>
```

```css
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
}
.navbar-links {
    display: flex;
    gap: 24px;
    list-style: none;
}
```

### Card with pinned footer (equal-height cards in a row)

```html
<div class="card-row">
  <article class="card">
    <h3>Short Card</h3>
    <p>Brief content.</p>
    <button>Learn more</button>
  </article>
  <article class="card">
    <h3>Long Card</h3>
    <p>Much longer content that takes up significantly more vertical space than its sibling card.</p>
    <button>Learn more</button>
  </article>
</div>
```

```css
.card-row {
    display: flex;
    gap: 16px;
    align-items: stretch; /* default — cards match the tallest sibling's height */
}
.card {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 16px;
}
.card button {
    margin-top: auto; /* pushes the button to the bottom of the card's flex column */
}
```

> 💡 **Tip** — `margin-top: auto` (or `margin-left: auto`, depending on axis) inside a flex container is a genuinely powerful, widely-used technique: an `auto` margin on a flex item consumes **all** available leftover space in that direction, which is exactly how you can reliably pin one item (like a card's action button) to the far end of a flex container while everything above/before it stacks normally — no absolute positioning required.

### Toolbar

```css
.toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid #e5e5e5;
}
.toolbar-spacer {
    flex: 1; /* an empty item that consumes all leftover space, pushing
                everything after it to the far end of the toolbar */
}
```

### Perfectly centered content (the classic Flexbox centering pattern)

```css
.centered {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}
```

This exact three-line pattern — `display: flex`, `align-items: center`, `justify-content: center` — is the modern, standard answer to "how do I center something both horizontally and vertically," replacing the fragile pre-Flexbox hacks referenced at the start of this Part entirely.

### Responsive row (wrapping card grid)

```css
.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}
.card-grid .card {
    flex: 1 1 250px; /* grow and shrink, but never smaller than a 250px basis —
                         cards naturally wrap to new lines as the container narrows */
}
```

### Media object (icon/image + text side by side)

```html
<div class="media">
  <img src="avatar.jpg" alt="User avatar" class="media-figure">
  <div class="media-body">
    <h4>Username</h4>
    <p>Comment text goes here, potentially wrapping across multiple lines.</p>
  </div>
</div>
```

```css
.media {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}
.media-figure {
    flex-shrink: 0; /* the avatar image should NEVER shrink, regardless of
                        how much text is in media-body */
    width: 48px;
    height: 48px;
    border-radius: 50%;
}
.media-body {
    flex: 1;
    min-width: 0; /* the overflow-prevention fix from earlier in this Part */
}
```

## Exercises — Part 24

These fifteen exercises are deliberately ordered from foundational to advanced — work through them in order the first time.

1. Create a flex container with three items arranged in a row, evenly spaced with equal gaps between and around them (edges included).
2. Create a flex container that centers a single child both horizontally and vertically.
3. Create a row of three items where the middle item is twice as wide as the other two, using `flex-grow`.
4. Create a flex container where items wrap onto multiple lines once they no longer fit a single row.
5. Create a navbar with a logo on the far left, nav links centered as a group, and a button on the far right.
6. Create a row of cards that all match the height of the tallest card, with no explicit height set on any of them.
7. Create a card with a header, body, and footer, where the footer is always pinned to the bottom of the card regardless of how much body content there is.
8. Fix this overflowing layout:
   ```css
   .row { display: flex; gap: 12px; }
   .sidebar { flex: 0 0 200px; }
   .content { flex: 1; } /* contains a very long, unbreakable string */
   ```
9. Create three equal-width columns, regardless of how much content is in each.
10. Reverse the visual order of three flex items without changing their HTML source order, and explain the accessibility caveat of doing so.
11. Create a toolbar with a group of icon buttons on the left, and a single button pushed all the way to the right, using an empty flexible spacer element.
12. Build a vertical (column-direction) flex layout and correctly identify which property (`justify-content` or `align-items`) now controls horizontal vs. vertical alignment.
13. Create a flex item that should never shrink below its natural size, even when its siblings do.
14. Build the "media object" pattern (fixed-size avatar + flexible text content that can wrap safely without breaking layout).
15. Using only `align-self`, make exactly one item in a row of otherwise-top-aligned items sit at the vertical center instead.

<details>
<summary>View solutions</summary>

**1.**
```css
.container { display: flex; justify-content: space-evenly; }
```

**2.**
```css
.container { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
```

**3.**
```css
.container { display: flex; }
.item-a { flex-grow: 1; }
.item-b { flex-grow: 2; }
.item-c { flex-grow: 1; }
```

**4.**
```css
.container { display: flex; flex-wrap: wrap; gap: 16px; }
```

**5.**
```css
.navbar { display: flex; align-items: center; justify-content: space-between; }
.navbar-links { display: flex; gap: 16px; margin: 0 auto; }
```

**6.**
```css
.card-row { display: flex; } /* align-items: stretch is the default — no extra code needed */
```

**7.**
```css
.card { display: flex; flex-direction: column; }
.card-footer { margin-top: auto; }
```

**8.**
```css
.content { flex: 1; min-width: 0; } /* the missing min-width: 0 fix */
```

**9.**
```css
.column { flex: 1; } /* equal flex-grow with a 0% basis splits space evenly regardless of content */
```

**10.**
```css
.item-a { order: 3; }
.item-b { order: 2; }
.item-c { order: 1; }
```
Accessibility caveat: `order` changes only the *visual* rendering order — it does not change the underlying DOM/source order, so keyboard Tab navigation still follows the original HTML order, which can become visually mismatched and disorienting for keyboard users if the reordering is significant.

**11.**
```css
.toolbar { display: flex; align-items: center; gap: 8px; }
.toolbar-spacer { flex: 1; }
```

**12.** With `flex-direction: column`, the main axis becomes vertical and the cross axis becomes horizontal — so `justify-content` now controls *vertical* alignment/spacing (since it always targets the main axis) and `align-items` now controls *horizontal* alignment (since it always targets the cross axis) — the exact opposite of their roles under the default `row` direction.

**13.**
```css
.item-fixed { flex-shrink: 0; }
```

**14.**
```css
.media { display: flex; gap: 12px; align-items: flex-start; }
.media-figure { flex-shrink: 0; width: 48px; height: 48px; }
.media-body { flex: 1; min-width: 0; }
```

**15.**
```css
.item-special { align-self: center; }
```

</details>

---

# PART 25 — CSS Grid

While Flexbox (Part 24) solves **one-dimensional** layout problems (a single row or column), **CSS Grid** solves **two-dimensional** layout problems — rows *and* columns simultaneously, in a single, coordinated system. This is the other truly essential modern CSS layout tool, and, like Flexbox, it deserves the maximum depth this course can give it.

## Grid vs. Flexbox — when each applies

Before diving into Grid's mechanics, it's worth being precise about *why* you'd reach for it over Flexbox, since both can sometimes achieve superficially similar results for simple cases:

- **Flexbox** thinks in terms of *content* — items flow along one axis and size themselves based on their content and the `flex` properties you apply; the "grid" it forms (if any, via wrapping) is a side effect, not something you directly control across two dimensions at once.
- **Grid** thinks in terms of *layout* — you define an explicit two-dimensional structure (specific rows and columns, with specific sizes) *first*, and then place items into that structure. You are designing the container's shape directly, rather than letting item content drive it.

A genuinely useful rule of thumb: **if you're laying out in one direction (a row of nav links, a column of stacked form fields), reach for Flexbox. If you need to control alignment across both rows and columns simultaneously (a dashboard, a photo gallery, an entire page layout with header/sidebar/content/footer), reach for Grid.** In real, professional codebases, the two are used constantly *together* — Grid for the page's overall macro-layout, Flexbox for the micro-layout of components within each grid area (exactly the pattern the capstone project later in this course will follow).

## Core vocabulary: container, rows, columns, tracks, cells, lines, areas

```text
Grid terminology, visualized on a 3-column, 2-row grid:

        column line 1  column line 2  column line 3  column line 4
             │              │              │              │
row line 1 ──┼──────────────┼──────────────┼──────────────┤
             │   CELL       │   CELL       │   CELL       │  ← row track 1
             │  (1,1)       │  (1,2)       │  (1,3)       │
row line 2 ──┼──────────────┼──────────────┼──────────────┤
             │   CELL       │   CELL       │   CELL       │  ← row track 2
             │  (2,1)       │  (2,2)       │  (2,3)       │
row line 3 ──┴──────────────┴──────────────┴──────────────┘
             └── column track 1 ──┘└── column track 2 ──┘└── column track 3 ──┘
```

- **Grid container** — the element with `display: grid` applied.
- **Grid item** — a direct child of the grid container.
- **Grid lines** — the numbered dividing lines that make up the grid's structure (both horizontal and vertical) — line numbering starts at **1**, not 0.
- **Grid tracks** — the space *between* two adjacent grid lines — a "row track" (a row's height) or "column track" (a column's width).
- **Grid cell** — the smallest single unit of the grid, the intersection of one row track and one column track.
- **Grid area** — one or more cells combined into a single larger rectangular region (an item can span multiple cells to form an area).

## Turning on Grid: `display: grid`

```css
.container {
    display: grid;
}
```

By itself, this does far less than `display: flex` did by default — with no `grid-template-columns`/`grid-template-rows` defined yet, you get a single-column grid where each child simply stacks in its own implicit row, each sized to its content — Grid's real power only becomes visible once you explicitly define tracks, which is the very next thing to learn.

## Defining columns and rows: `grid-template-columns` and `grid-template-rows`

```css
.container {
    display: grid;
    grid-template-columns: 200px 200px 200px; /* three fixed 200px columns */
}
```

```css
.container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr; /* three FLEXIBLE columns, in a 1:2:1 ratio */
}
```

### The `fr` unit — a purpose-built fraction unit for Grid

`fr` stands for "fraction" — it represents a **share of the available leftover space** within the grid container, conceptually similar to how `flex-grow` ratios work in Flexbox (Part 24), but specifically built for, and exclusively used in, Grid track sizing.

```text
grid-template-columns: 1fr 2fr 1fr;

Total "fr" shares = 1 + 2 + 1 = 4 shares
Column 1 gets 1/4 of the available space
Column 2 gets 2/4 (half) of the available space  ← TWICE as wide as columns 1 and 3
Column 3 gets 1/4 of the available space

+──────────+──────────────────────+──────────+
│ Column 1  │      Column 2         │ Column 3  │
│  (1fr)    │       (2fr)           │  (1fr)    │
+──────────+──────────────────────+──────────+
```

You can freely **mix** fixed units and `fr` in the same declaration:

```css
.container {
    grid-template-columns: 250px 1fr; /* a fixed 250px sidebar, and a flexible
                                          remaining column that fills all leftover space */
}
```

This exact pattern — a fixed-width sidebar plus a flexible content column — is one of the single most common real-world Grid layouts, and it's genuinely difficult to achieve this cleanly with Flexbox alone (Flexbox's `flex: 1` items don't inherently know to leave room for a fixed-width sibling the same precise way Grid's explicit track definition does).

```css
.container {
    grid-template-rows: 80px 1fr 60px; /* fixed header, flexible content, fixed footer */
    height: 100vh;
}
```

`grid-template-rows` works identically, but defines the height of row tracks instead of the width of column tracks — this exact three-value pattern (fixed header, flexible middle, fixed footer, filling the full viewport height) is the classic "sticky footer" / full-page app-shell layout, covered again in Part 46.

## `repeat()`

```css
.container {
    grid-template-columns: repeat(4, 1fr); /* shorthand for: 1fr 1fr 1fr 1fr */
}
```

```css
.container {
    grid-template-columns: repeat(3, 100px 1fr); /* repeats the ENTIRE pattern "100px 1fr"
                                                       three times: 100px 1fr 100px 1fr 100px 1fr */
}
```

`repeat(count, pattern)` avoids manually retyping a repeated track pattern — genuinely useful once you have more than 2-3 identical columns, and essential for the responsive `auto-fit`/`auto-fill` pattern covered next.

## `minmax()`

```css
.container {
    grid-template-columns: repeat(3, minmax(150px, 1fr));
}
```

`minmax(min, max)` sets a track size that's **flexible between two bounds** — it will never shrink below `min`, and never grow beyond `max` (when `max` is a fixed value; using `1fr` as the max, as above, means "grow to fill available space, but never shrink below 150px"). This is a genuinely essential building block for responsive Grid layouts, used constantly in combination with `auto-fit`/`auto-fill`, covered next.

## `auto-fit` and `auto-fill` — the single most important responsive Grid pattern

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
}
```

This exact line — genuinely worth memorizing — deserves a full, careful breakdown, because it's one of the most powerful, most-used single lines in all of modern CSS: it creates a grid that automatically fits **as many columns as will comfortably fit** at a minimum width of `250px` each, and each of those columns then flexibly **grows to fill any remaining leftover space** — all with **zero media queries required**.

```text
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

On a wide screen (say, 1100px container width):
+────────+────────+────────+────────+
│  Card    │  Card    │  Card    │  Card    │   ← 4 columns fit comfortably at
+────────+────────+────────+────────+      ~275px each (250px min, growing
                                              to fill leftover space via 1fr)

On a medium screen (~600px container width):
+──────────────+──────────────+
│     Card       │     Card       │            ← only 2 columns fit at 250px
+──────────────+──────────────+              minimum, so it automatically
                                               drops to 2, each growing wider

On a narrow/mobile screen (~300px container width):
+────────────────────────────+
│           Card               │              ← only 1 column fits — the grid
+────────────────────────────+              automatically collapses to a
                                               single column, full width
```

Let's break down exactly *why* this works, piece by piece:

- **`minmax(250px, 1fr)`** — each column will never be narrower than `250px`, but will grow (via `1fr`, sharing leftover space) if there's room.
- **`repeat(auto-fit, ...)`** — instead of a fixed count (like `repeat(3, ...)`), `auto-fit` tells the browser: "automatically calculate however many columns of this minimum size will actually fit within the container's current width, and use exactly that many" — recalculating live as the container's width changes, with no JavaScript and no media queries needed at all.

### `auto-fit` vs. `auto-fill` — the precise, commonly-confused difference

Both `auto-fit` and `auto-fill` calculate "how many columns of this size fit" identically — the difference only becomes visible when there are **fewer actual grid items than the number of columns that could fit**:

```text
Scenario: container is wide enough to fit 5 columns of the minimum size,
          but there are only 3 actual grid items to place.

auto-fill:
+──────+──────+──────+──────+──────+
│ Item  │ Item  │ Item  │(empty)│(empty)│   ← auto-fill creates 5 column TRACKS
│  1    │  2    │  3    │ track │ track │      regardless, leaving empty,
+──────+──────+──────+──────+──────+      invisible tracks after the 3 items —
                                            items stay at their MINIMUM size,
                                            since the extra empty tracks still
                                            "claim" a share of the 1fr space

auto-fit:
+────────────+────────────+────────────+
│    Item      │    Item      │    Item      │   ← auto-fit COLLAPSES the empty tracks
│     1        │     2        │     3        │      entirely, so the 3fr worth of
+────────────+────────────+────────────+      space is redistributed among just
                                                the 3 real items, growing them WIDER
```

> ⚠️ **Common mistake** — In the overwhelming majority of real-world use cases (a responsive card grid, a product listing), **`auto-fit` is what you actually want** — it lets existing items grow to fill all available space when there aren't enough of them to fill every possible column. `auto-fill` is correct only in the comparatively rare case where you deliberately want items to stay locked at their minimum size and leave visible gaps, reserving space as if more items might arrive later (e.g., a fixed-size swatch grid where visual consistency of item size matters more than filling all available space). If you're not sure which you want, `auto-fit` is very likely the correct default.

## Placing items: `grid-column` and `grid-row`

```css
.item-a {
    grid-column: 1 / 3; /* start at column line 1, end at column line 3 —
                            spans across 2 column TRACKS */
    grid-row: 1 / 2;
}
```

Items are placed using **grid line numbers** (recall: lines are numbered starting at 1, and there's always one more line than the number of tracks — a 3-column grid has 4 column lines). The `/` separates the start line from the end line.

```css
.item-wide {
    grid-column: span 2; /* an alternative syntax: "span N tracks from wherever
                             this item is auto-placed," rather than specific
                             line numbers */
}
```

`span N` is often more convenient than explicit line numbers when you don't need pixel-precise placement, just "this item should be twice as wide as a normal cell, starting wherever it naturally falls."

```css
.item-negative {
    grid-column: 1 / -1; /* from the FIRST line to the LAST line, however many
                             columns the grid currently has — a common, robust
                             way to make an item span the grid's FULL width
                             without needing to know the exact column count */
}
```

Negative line numbers count **backward from the end** — `-1` always refers to the very last line, regardless of how many tracks the grid actually has, making `grid-column: 1 / -1` a robust, common idiom for "span the entire row's full width."

## `grid-template-areas` — named, visual layout

```css
.page-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 80px 1fr 60px;
    grid-template-areas:
        "sidebar header"
        "sidebar content"
        "sidebar footer";
    height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }
```

This is one of Grid's most genuinely elegant, distinctive features, with no real Flexbox equivalent: `grid-template-areas` lets you **literally draw your layout's shape** directly in CSS, using a named string for each cell — each row of the layout is one quoted string, and repeating the same name across adjacent cells (horizontally or vertically) merges them into one larger named area. Individual items are then assigned to a named area via `grid-area`, matching the name used in the template — dramatically more readable, at a glance, than a page of numeric line references.

```text
grid-template-areas:
    "sidebar header"
    "sidebar content"
    "sidebar footer";

Visually represents:

+──────────+────────────────────────+
│           │        header          │
│           +────────────────────────+
│  sidebar   │        content         │
│  (spans    │                        │
│  all 3     +────────────────────────+
│  rows)     │        footer          │
+──────────+────────────────────────+
```

> 💡 **Tip** — `grid-template-areas` is genuinely one of the most valuable CSS tools for whole-page layout precisely because the CSS *itself* visually resembles the layout it produces — a huge readability and maintainability win, especially for anyone (including future-you) reading the stylesheet later without needing to mentally trace numeric grid-line references.

## Implicit vs. explicit grid

### What it is

The **explicit grid** is exactly what you define via `grid-template-columns`/`grid-template-rows`/`grid-template-areas`. But what happens when you have *more items* than the explicit grid's defined cells can hold? The browser doesn't simply overflow or error — it automatically generates additional rows (or columns, depending on `grid-auto-flow`) to hold the extra items. These automatically-generated tracks make up the **implicit grid**.

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* explicitly defines 3 columns */
    grid-auto-rows: 120px; /* controls the SIZE of any implicitly-created rows */
}
```

If this container has, say, 10 items, the explicit grid only defines column structure (3 columns) — the browser automatically creates as many **implicit rows** as needed to place all 10 items (4 rows: 3+3+3+1), and `grid-auto-rows` controls how tall each of those *automatically-generated* rows should be (without it, implicit rows default to sizing themselves based on their content, which can look inconsistent compared to your explicitly-sized rows).

```css
.container {
    grid-auto-flow: row; /* default: fill rows first, left to right, then wrap to new rows */
}
.container-column-flow {
    grid-auto-flow: column; /* fill columns first, top to bottom, then wrap to new columns */
}
```

`grid-auto-flow` controls the *direction* items are automatically placed into the implicit grid when you haven't explicitly positioned them — `row` (the default) fills across each row before moving to the next; `column` fills down each column before moving to the next.

## Alignment in Grid

Grid supports the same conceptual alignment properties as Flexbox, but applied across **two axes simultaneously** rather than one:

```css
.container {
    justify-items: center; /* aligns items horizontally WITHIN their own cell */
    align-items: center;   /* aligns items vertically WITHIN their own cell */
}
```

```css
.container {
    justify-content: center; /* aligns the ENTIRE grid horizontally within the container,
                                 when the grid's total size is smaller than the container */
    align-content: center;   /* aligns the ENTIRE grid vertically within the container */
}
```

The naming parallel with Flexbox is deliberate, but the meaning shifts subtly: in Grid, `justify-items`/`align-items` govern how each item sits *within its own individual cell* (both axes, since Grid doesn't have a single "main axis" the way Flexbox does), while `justify-content`/`align-content` govern how the *entire grid structure as a whole* is positioned within its container, in cases where the grid's total defined size doesn't fill the full container.

```css
.item-special {
    justify-self: end;  /* overrides justify-items for just this ONE item */
    align-self: center; /* overrides align-items for just this ONE item */
}
```

`justify-self`/`align-self` on an individual item override the container's `justify-items`/`align-items` for that one item specifically — directly analogous to Flexbox's `align-self`.

## Dense packing: `grid-auto-flow: dense`

```css
.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: row dense;
}
```

When items of varying sizes (some spanning multiple columns/rows via `grid-column: span 2`, for instance) are placed in normal auto-flow order, gaps can sometimes appear in the grid if a later, smaller item can't fit in the remaining space of the current row and gets pushed to a new one, leaving an unfilled gap behind. `dense` packing tells the browser to **backfill those gaps** with later items that *do* fit, out of strict source order, purely to minimize visual holes in the grid — genuinely useful for a Pinterest-style masonry-adjacent gallery layout with mixed item sizes, though it comes with a real trade-off worth being explicit about: because it can reorder items visually out of their source order (similar in spirit to Flexbox's `order`), it carries the same accessibility caution — visual order and DOM/reading order can diverge, which may be disorienting for keyboard and screen-reader users navigating sequentially.

## Building real layouts with Grid

### Dashboard

```css
.dashboard {
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-template-rows: 64px 1fr;
    grid-template-areas:
        "sidebar topbar"
        "sidebar main";
    height: 100vh;
}
.sidebar { grid-area: sidebar; }
.topbar  { grid-area: topbar; }
.main    { grid-area: main; overflow: auto; }
```

### Photo gallery

```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-auto-rows: 200px;
    gap: 8px;
}
.gallery img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* covered fully in Part 39 — prevents distortion */
}
```

### Product grid

```css
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
}
```

### Complex page layout (full app shell)

```css
.app-shell {
    display: grid;
    grid-template-columns: 260px 1fr;
    grid-template-rows: 70px 1fr 50px;
    grid-template-areas:
        "header  header"
        "sidebar content"
        "footer  footer";
    min-height: 100vh;
}
.app-header  { grid-area: header; }
.app-sidebar { grid-area: sidebar; }
.app-content { grid-area: content; }
.app-footer  { grid-area: footer; }
```

## Grid vs. Flexbox — a direct, side-by-side comparison

| | Flexbox | Grid |
|---|---|---|
| Dimensionality | One-dimensional (a row OR a column) | Two-dimensional (rows AND columns together) |
| Layout driven by | Content size, with flex properties adjusting from there | Explicit container-defined structure, items placed into it |
| Best for | Navbars, toolbars, button groups, centering, any single row/column of flexible items | Whole-page layouts, dashboards, photo/card grids, anything needing coordinated row+column alignment |
| Named layout regions | Not built in | `grid-template-areas` — genuinely distinctive to Grid |
| Typical real-world usage | Used for the *inside* of components (a card's internal layout, a navbar's items) | Used for the *macro* layout (the page shell, a grid of those same cards) |

> 💡 **Tip** — In real, professional frontend work, the question is essentially never "Grid or Flexbox, pick one" — it's "which one fits *this specific* layout problem," and the two are used together, nested inside each other, constantly: a Grid-based page shell containing Flexbox-based navbars and card internals is an extremely standard, common real-world pattern — exactly the approach the capstone project later in this course takes.

## Exercises — Part 25

1. Create a 3-column grid with equal-width columns using `fr`.
2. Create a grid with a fixed 250px sidebar and a flexible content area.
3. Using `repeat()` and `minmax()`, create a responsive card grid that automatically adjusts its column count based on available width, with a 220px minimum card width, and existing cards growing to fill leftover space.
4. Explain the precise difference between `auto-fit` and `auto-fill`, including a scenario where their output visibly differs.
5. Using `grid-template-areas`, build a layout with a header spanning the full width, a sidebar, a main content area, and a footer spanning the full width.
6. Make a single grid item span 2 columns and 2 rows using explicit line numbers.
7. Make a grid item span the full width of its row using negative line-number syntax, without knowing the exact column count.
8. Explain what `grid-auto-rows` controls, and when it becomes relevant.
9. Center a single item both horizontally and vertically within its own grid cell.

<details>
<summary>View solutions</summary>

**1.**
```css
.container { display: grid; grid-template-columns: repeat(3, 1fr); }
```

**2.**
```css
.container { display: grid; grid-template-columns: 250px 1fr; }
```

**3.**
```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}
```

**4.** Both calculate the same number of columns that fit based on the minimum track size. The difference appears only when there are fewer actual items than the number of columns that could fit: `auto-fill` still creates the full number of column tracks, leaving empty invisible tracks after the last item (so existing items stay at their minimum size, since the leftover `fr` space is still divided among the empty tracks too). `auto-fit` collapses those empty tracks entirely, redistributing their share of space to the actual existing items, making them grow wider to fill the container.

**5.**
```css
.layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

**6.**
```css
.item { grid-column: 1 / 3; grid-row: 1 / 3; }
```

**7.**
```css
.item { grid-column: 1 / -1; }
```

**8.** `grid-auto-rows` sets the size of any **implicitly-generated** rows — rows the browser automatically creates when there are more items than the explicit `grid-template-rows`/`grid-template-columns` structure accounts for. It becomes relevant whenever a grid has more items than explicitly-defined rows, and you want those automatically-added extra rows to have a consistent, controlled size rather than sizing purely based on their content.

**9.**
```css
.item { justify-self: center; align-self: center; }
```

</details>

---

# PART 26 — Responsive Design

This is one of the largest, most important sections in the entire course, and another designated special-focus area. Nearly everything taught in Parts 1–25 has been building toward this moment: a real website today must work correctly — not just "not be broken," but genuinely work well — across an enormous range of screen sizes, from a small phone held in portrait orientation to an ultra-wide desktop monitor, and everything in between.

## What responsive design actually is

### What it is

**Responsive design** is the practice of building a single set of HTML and CSS that automatically **adapts its layout, sizing, and sometimes content** to fit whatever screen/viewport it's being viewed on — rather than building separate, entirely distinct versions of a site for "mobile" and "desktop."

### Why it exists

Before responsive design became standard practice (roughly the early 2010s onward), it was common to build a completely separate mobile site, often on its own subdomain (`m.example.com`), duplicating content and requiring double the maintenance effort to keep both versions in sync. Responsive design solves this by making *one* codebase intelligently adapt, using the CSS tools this Part covers — dramatically reducing duplication and the risk of the mobile and desktop experiences drifting out of sync with each other over time.

## Mobile-first vs. desktop-first

### What these mean

These are two **opposite strategies** for structuring your CSS's responsive logic, both valid, but with genuinely different practical implications:

**Desktop-first** — you write your *base* (unqualified) CSS styles targeting a large desktop layout, then use media queries with `max-width` to progressively **override/simplify** the layout as the screen gets smaller.

```css
/* Desktop-first: base styles assume a wide desktop layout */
.sidebar {
    width: 300px;
    float: left; /* legacy example, illustrating the OLD desktop-first pattern */
}

@media (max-width: 768px) {
    .sidebar {
        width: 100%; /* override/simplify for smaller screens */
        float: none;
    }
}
```

**Mobile-first** — you write your *base* (unqualified) CSS styles targeting a small mobile layout first, then use media queries with `min-width` to progressively **enhance/add complexity** as the screen gets larger.

```css
/* Mobile-first: base styles assume a small screen, simple single-column layout */
.sidebar {
    width: 100%;
}

@media (min-width: 768px) {
    .sidebar {
        width: 300px; /* add complexity/layout for larger screens */
    }
}
```

### Why mobile-first is the modern, strongly recommended default

> 💡 **Tip** — Mobile-first is, today, the near-universal professional standard, for concrete, practical reasons worth understanding, not just following as a convention: (1) **it forces you to prioritize genuinely essential content and functionality first** — designing for the most space-constrained context first tends to produce a cleaner, more focused result that then naturally *expands* well, rather than a complex desktop design that has to be awkwardly *stripped down*; (2) **it generally results in less CSS overall**, since your base (unqualified) styles are simple, and media queries only ever *add* complexity for larger screens, rather than a desktop-first approach where your base styles are already complex and every mobile media query has to actively *undo/override* pieces of that complexity; (3) it aligns with how CSS's own cascade and specificity naturally work — `min-width` media queries layering *additively* on top of simple base styles is a more natural fit for the cascade's source-order/additive nature than constantly overriding a complex base.

## Breakpoints — chosen based on layout, not device brands

### What a breakpoint is

A **breakpoint** is the specific viewport width at which your media query changes the layout.

### The critical mistake to avoid: device-specific breakpoints

> ⚠️ **Common mistake** — A genuinely common beginner (and, honestly, even some professional) mistake is choosing breakpoints based on *specific device dimensions* — "iPhone is 375px, iPad is 768px, so I'll breakpoint exactly there." This is a fragile, ultimately losing strategy: there are now hundreds of distinct device screen sizes in active use, spanning phones, foldables, tablets, and an enormous range of desktop/laptop monitor resolutions — chasing every individual device's exact width is an endless, unwinnable task, and new devices with new dimensions ship constantly.

**The correct, robust approach: choose breakpoints based on where *your specific layout* visually starts to break down** — resize your own browser window gradually narrower (or wider) while actually watching your design, and set a breakpoint at the exact point where the current layout genuinely stops looking/working well (text lines becoming too cramped, a 4-column grid becoming uncomfortably squeezed, a sidebar losing usable width) — regardless of whether that width happens to correspond to any particular named device at all.

```text
The RIGHT mental process for choosing a breakpoint:

1. Build your layout, starting mobile-first (simple, single-column, small-screen assumptions)
2. Widen your browser window slowly
3. Watch your ACTUAL design — where does it start to look cramped, awkwardly
   empty, or structurally broken?
4. THAT specific width is where your breakpoint belongs — not a device name

Common, widely-used ROUGH breakpoint ranges (useful starting reference points,
NOT rules to blindly copy without checking your own actual design):

~480px   → small phones
~768px   → tablets / small phones in landscape
~1024px  → small laptops / tablets in landscape
~1280px+ → desktops and larger
```

## Media queries

### Syntax

```css
@media (min-width: 768px) {
    .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}
```

A media query wraps a block of CSS rules in a **condition** — the enclosed rules only apply when that condition is currently true. `@media (min-width: 768px)` reads as: "apply the following rules only when the viewport is **at least** 768px wide."

```css
@media (max-width: 767px) {
    .nav-links { display: none; }
}
```

`max-width` is the inverse: "apply only when the viewport is **at most** this wide."

```css
@media (min-width: 768px) and (max-width: 1023px) {
    /* applies ONLY within this specific range — e.g., "tablet only" styles */
}
```

Combining `min-width` and `max-width` with `and` creates a **range** condition — useful for styles that should apply only within a specific band of widths, neither the smallest nor the largest.

### Other media features

```css
@media (orientation: portrait) { }
@media (orientation: landscape) { }
```

`orientation` detects whether the viewport is currently taller than wide (`portrait`) or wider than tall (`landscape`) — genuinely useful for tablets, which regularly rotate between the two, independent of raw pixel width alone.

```css
@media (prefers-color-scheme: dark) {
    body { background: #111; color: #eee; }
}
```

`prefers-color-scheme` detects the user's OS-level light/dark mode preference — the foundational mechanism behind automatic dark mode support, covered in complete depth in Part 43.

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
    }
}
```

`prefers-reduced-motion` detects a genuine, real OS-level accessibility setting some users deliberately enable because motion/animation can cause them real discomfort, dizziness, or even trigger vestibular disorders. This is not a hypothetical/rare edge case — respecting it is a real accessibility responsibility, covered in full depth alongside animations in Part 32.

```css
@media (hover: hover) {
    .card:hover { transform: translateY(-4px); }
}
```

`hover` detects whether the current input mechanism genuinely **supports** hovering — a mouse/trackpad does; a touchscreen, fundamentally, does not (a "hover" state on touch is either faked via a tap-and-hold, or simply doesn't meaningfully exist). Wrapping hover-dependent visual effects in `@media (hover: hover)` prevents a common, subtly-annoying touch-device problem: a `:hover` style that gets "stuck" showing after a tap on a touchscreen (since there's no genuine mouse-leave event to naturally clear it), because the effect never applies in the first place on devices that can't genuinely hover.

```css
@media (pointer: coarse) {
    button { min-height: 44px; } /* larger touch targets for imprecise finger input */
}
@media (pointer: fine) {
    button { min-height: 32px; } /* smaller targets are fine for a precise mouse cursor */
}
```

`pointer` detects the **precision** of the primary input mechanism — `coarse` (a finger on a touchscreen — imprecise) vs. `fine` (a mouse or stylus — precise). This is genuinely useful for deliberately sizing interactive touch targets larger specifically for imprecise input, a real, practical accessibility/usability consideration (commonly cited touch-target guidance suggests roughly 44×44px as a comfortable minimum).

## Responsive images — revisited in a responsive-design context

Recall Part 4's full treatment of `srcset`/`sizes` and `<picture>` — those techniques *are* responsive design, specifically applied to images. Worth reinforcing here as part of the complete responsive toolkit: images need their own dedicated responsive strategy beyond just `max-width: 100%` (which handles *not overflowing*, but not *serving an appropriately-sized file* — recall the bandwidth-waste problem `srcset` specifically solves).

## Fluid spacing and typography with `clamp()`

### The problem `clamp()` solves

Before `clamp()`, achieving text (or spacing) that scales *smoothly* with the viewport, rather than jumping abruptly at fixed breakpoints, generally required either many, many closely-spaced media queries (tedious, and still technically "stepped" rather than truly fluid) or pure viewport-unit sizing (`font-size: 4vw;`), which has a serious flaw: with no lower or upper bound, text can become uncomfortably tiny on small screens or absurdly, unusably huge on large ones — recall the caution flagged back in Part 17.

### Syntax and mechanics

```css
h1 {
    font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
}
```

```text
clamp(MINIMUM, PREFERRED, MAXIMUM)

MINIMUM:   1.75rem  → the font-size will NEVER go smaller than this, no matter
                        how narrow the viewport gets
PREFERRED: 4vw + 1rem → the font-size FLUIDLY scales based on viewport width,
                          as long as the result stays between MIN and MAX
MAXIMUM:   3.5rem  → the font-size will NEVER go larger than this, no matter
                        how wide the viewport gets
```

`clamp()` takes exactly three values and picks the **middle** one of the three, dynamically, at all times: if the "preferred" fluid value ever calculates to something *smaller* than the minimum, the minimum is used instead; if it calculates to something *larger* than the maximum, the maximum is used instead; otherwise, the fluid preferred value itself is used, scaling smoothly and continuously as the viewport resizes — genuinely, pixel-by-pixel fluid, not stepped between fixed breakpoints at all.

```text
Visualizing clamp(1.75rem, 4vw + 1rem, 3.5rem) as the viewport widens:

font-size
   │
3.5rem ┤                              ┌──────────────  ← MAXIMUM clamp kicks in,
   │                                 ╱                    flat line from here on
   │                                ╱
   │                               ╱   ← fluidly scaling with
   │                              ╱      viewport width in this
   │                             ╱       middle range
1.75rem┤──────────────┐          ╱
   │               ↖ MINIMUM clamp kicks in,
   │                 flat line up to here
   └──────────────────────────────────────────────▶ viewport width
```

### Why the "preferred" middle value typically mixes a viewport unit with a fixed unit

The middle value in the example above, `4vw + 1rem`, deliberately combines `vw` (a pure viewport-relative unit) with `rem` (a fixed, root-relative unit) via `calc()`-like addition (this addition syntax works directly inside `clamp()`, without needing an explicit outer `calc()` wrapper). This combination is a well-established, genuinely effective pattern: pure `vw` alone scales *too* aggressively and unpredictably as viewport width changes across a huge range, while adding a fixed `rem` "base" component dampens/moderates that scaling rate, producing a gentler, more visually pleasant, and more controllable growth curve than `vw` alone would.

```css
.section {
    padding: clamp(1rem, 5vw, 4rem);
}
```

`clamp()` is just as valuable for **spacing** as for typography — fluid padding/margin that scales smoothly with viewport width, bounded within sensible minimum and maximum limits, is an increasingly standard, modern replacement for the older pattern of manually redefining spacing values at every single breakpoint.

## Modern responsive layouts that need fewer media queries

This is worth calling out explicitly, tying together everything from Parts 24–26: a huge amount of what *used* to require many media queries can now be achieved with **zero** media queries at all, purely through modern CSS's own inherent flexibility:

```css
/* Zero media queries — this card grid is FULLY responsive on its own,
   thanks to auto-fit + minmax (Part 25) */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
}

/* Zero media queries — flex-wrap handles this row's responsiveness automatically */
.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

/* Zero media queries — fluid typography that scales smoothly */
h1 {
    font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
}
```

This is a genuinely important, modern mindset shift worth internalizing: media queries remain an essential, powerful tool (especially for genuine *structural* layout changes — switching from a single column to a sidebar+content layout, for instance, really does need an explicit breakpoint) — but a substantial share of what once required careful media-query orchestration can now be handled by Grid's `auto-fit`, Flexbox's `wrap`, and `clamp()`'s fluid scaling alone, resulting in less CSS, fewer breakpoints to maintain, and layouts that adapt more smoothly across the full range of possible viewport widths, rather than only at the specific widths you happened to write a media query for.

## Exercises — Part 26

1. Explain, in your own words, the practical/strategic difference between mobile-first and desktop-first CSS, and why mobile-first is the modern default recommendation.
2. Why is choosing a breakpoint at exactly "768px because that's the iPad width" a fragile strategy? What should drive breakpoint choice instead?
3. Write a media query that applies styles only when the viewport is between 600px and 900px wide (inclusive).
4. Write a `clamp()`-based `font-size` for a heading that's never smaller than 1.5rem, never larger than 3rem, and fluidly scales based on viewport width in between.
5. Why might you wrap a `:hover` effect in `@media (hover: hover)`? What real problem does this prevent on touch devices?
6. Give one concrete example of a fully responsive layout pattern that requires zero media queries, and explain which CSS feature makes that possible.

<details>
<summary>View solutions</summary>

1. Mobile-first means writing simple, unqualified base styles for small screens, then using `min-width` media queries to progressively add complexity/layout for larger screens. Desktop-first means writing complex, unqualified base styles for large screens, then using `max-width` media queries to override/simplify for smaller screens. Mobile-first is the modern default because it forces prioritizing essential content/functionality first, generally results in less overall CSS (queries only add, never need to undo), and aligns more naturally with the cascade's additive, source-order-based nature.
2. Because there are hundreds of distinct real-world device widths in active use, and new devices ship constantly — chasing specific device dimensions is an endless, ultimately unwinnable strategy. Breakpoints should instead be chosen by observing where your *own actual layout* visually starts to break down as the viewport is resized, regardless of whether that width matches any specific named device.
3. ```css
   @media (min-width: 600px) and (max-width: 900px) {
       /* styles */
   }
   ```
4. ```css
   h1 {
       font-size: clamp(1.5rem, 4vw, 3rem);
   }
   ```
   (any reasonable "preferred" middle expression between the given min/max bounds is acceptable)
5. Because a touchscreen device has no genuine, continuous hover capability — a tap can sometimes trigger a `:hover` style that then gets visually "stuck" active, since there's no real mouse-leave event to naturally clear it afterward. Wrapping hover effects in `@media (hover: hover)` ensures they only apply on devices with genuine hover support (a mouse/trackpad), preventing this stuck-hover-state problem on touch devices entirely.
6. Any correct example, such as: a card grid using `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));` automatically adjusts its column count based on available width with zero media queries, because Grid's `auto-fit` + `minmax()` combination inherently recalculates the layout live as the container's width changes.

</details>

---

# PART 27 — Container Queries

## Why component-level responsiveness can be better than viewport-only responsiveness

### The problem

Every media query covered in Part 26 responds to the **viewport's** width — the browser window/screen as a whole. This works well for page-level, structural layout decisions. But it has a real limitation once you start thinking in terms of *reusable components*: a component (say, a card) might need to render differently depending on **how much space its own specific container currently gives it** — which is not always the same as the overall viewport width.

```text
The core problem, concretely:

A ".card" component might be placed in TWO different contexts on the same page:

Context A: inside a wide, full-width main content area → card has ~600px available
Context B: inside a narrow sidebar, on that SAME page, at that SAME viewport width → card has ~250px available

A viewport-based media query has NO WAY to distinguish between these two cases —
both are happening at the exact same overall viewport width. But the card's
IDEAL internal layout is genuinely different in each context (a wide horizontal
card layout works in Context A; a narrow, stacked layout is needed in Context B).
```

**Container queries** solve exactly this: they let a component respond to the size of its own **immediate container**, completely independent of the overall viewport size — enabling genuinely reusable, self-contained components that correctly adapt no matter where they're placed on a page.

## Syntax

### Step 1: opt a container into being "queryable"

```css
.card-container {
    container-type: inline-size;
}
```

`container-type: inline-size` marks an element as a **containment context** — establishing that its descendants are now allowed to write container queries referencing *this specific element's* size, specifically along the inline axis (in standard left-to-right writing modes, this means its width — recall the "inline" terminology previewed here, formalized fully in Part 38's logical properties).

```css
.card-container {
    container-type: inline-size;
    container-name: card; /* optional, but genuinely useful once you have MULTIPLE
                              nested queryable containers and need to target a
                              SPECIFIC one unambiguously */
}
```

### Step 2: write the container query

```css
.card {
    display: flex;
    flex-direction: column;
}

@container (min-width: 400px) {
    .card {
        flex-direction: row; /* switch to a horizontal layout once the CONTAINER
                                 (not the viewport) has at least 400px available */
    }
}
```

```css
@container card (min-width: 400px) {
    /* targets specifically the container named "card" from step 1,
       useful when there are multiple nested/ambiguous containers */
}
```

The syntax deliberately, closely mirrors `@media` — `min-width`/`max-width` conditions work the same way — but critically, `@container` queries the nearest **ancestor with `container-type` set**, not the viewport.

## Practical card example

```html
<div class="sidebar">
  <div class="card-container">
    <article class="card">
      <img src="thumb.jpg" alt="...">
      <div class="card-body">
        <h3>Card Title</h3>
        <p>Card description text.</p>
      </div>
    </article>
  </div>
</div>

<div class="main-content">
  <div class="card-container">
    <article class="card">
      <img src="thumb.jpg" alt="...">
      <div class="card-body">
        <h3>Card Title</h3>
        <p>Card description text.</p>
      </div>
    </article>
  </div>
</div>
```

```css
.card-container {
    container-type: inline-size;
}

.card {
    display: flex;
    flex-direction: column; /* default: stacked layout, safe for narrow contexts */
}

@container (min-width: 400px) {
    .card {
        flex-direction: row; /* horizontal layout, once THIS card's own container
                                 has enough room — completely independent of the
                                 overall page/viewport width */
        align-items: center;
    }
    .card img {
        width: 150px;
        flex-shrink: 0;
    }
}
```

With this setup, the **exact same** `.card` component/markup automatically renders stacked (narrow) inside the constrained `.sidebar` and horizontal (wide) inside the more spacious `.main-content` — **at the same viewport width, on the same page, simultaneously** — something a viewport-based `@media` query fundamentally cannot achieve, since it has no concept of "this specific instance's available space," only the page's overall width.

> 💡 **Tip** — Container queries and media queries are not competitors — they solve genuinely different problems and are commonly used together: media queries remain the right tool for page-level, structural decisions (should the overall page switch from a single column to a sidebar layout?); container queries are the right tool for component-level decisions (how should *this specific card* lay out itself, given whatever space it's actually been placed into?). As component-based development (breaking a UI into small, genuinely reusable pieces) becomes increasingly standard practice, container queries become an increasingly essential tool precisely because they let components be truly self-contained and context-aware, rather than needing to know or assume anything about the overall page they've been dropped into.

## Exercises — Part 27

1. Explain, with a concrete example, a real scenario where a viewport-based media query cannot achieve what a container query can.
2. Write the CSS needed to make a `.widget` element queryable by its descendants, based on its own inline-size (width).
3. Write a container query that switches a `.profile-card`'s `display` from `block` to `flex` once its container reaches at least 350px wide.
4. In your own words, when should you reach for a media query, and when should you reach for a container query?

<details>
<summary>View solutions</summary>

1. Example: the same `.card` component placed both in a wide main content area and a narrow sidebar, at the identical overall viewport width. A media query, which only knows the viewport's total width, cannot distinguish between these two placements and would apply identical styles to both — even though the card's actually-available space differs dramatically between the two contexts. A container query, referencing the card's own immediate container's width, correctly adapts the card's layout differently in each case.

2. ```css
   .widget {
       container-type: inline-size;
   }
   ```

3. ```css
   .profile-card { display: block; }
   @container (min-width: 350px) {
       .profile-card { display: flex; }
   }
   ```
   (assuming `.profile-card`'s relevant ancestor has `container-type: inline-size` set)

4. Reach for a media query for page-level, structural layout decisions that depend on the overall viewport/screen size (e.g., switching the whole page from a single-column to a multi-column layout). Reach for a container query for component-level decisions where a reusable component needs to adapt based on the actual space it's been given in its specific placement, independent of the overall page/viewport width — enabling genuinely portable, self-contained, context-aware components.

</details>

---

# PART 28 — CSS Functions

CSS includes several built-in functions for performing calculations and referencing dynamic values directly within property values — genuinely powerful tools that reduce the need for fixed, hardcoded numbers scattered throughout a stylesheet.

## `calc()`

```css
.sidebar-content {
    width: calc(100% - 300px);
}
```

`calc()` performs **mathematical operations** directly in CSS, and — critically — its real power comes from being able to **mix different units** within a single calculation, which is otherwise impossible in plain CSS (you cannot write `100% - 300px` outside of `calc()`; only `calc()` allows mixing a percentage with an absolute pixel value, or a `vw` with a `rem`, in a single expression). Supports `+`, `-`, `*`, `/`, with standard mathematical operator precedence, and can be nested.

```css
.element {
    /* the classic use case: "fill available space, but leave exactly 300px
       reserved for something else" — impossible to express without calc() */
    width: calc(100vw - 300px);
    padding: calc(1rem + 2vw);
}
```

> ⚠️ **Common mistake** — Forgetting the required spaces around `+` and `-` operators inside `calc()` — `calc(100% -20px)` is actually parsed as a single negative value `-20px` following `100%` with no operator at all (invalid), rather than as subtraction. `calc(100% - 20px)`, with spaces on both sides of the minus sign, is required. (`*` and `/` don't have this specific space requirement, though consistent spacing throughout is good practice regardless.)

## `min()` and `max()`

```css
.container {
    width: min(90%, 600px); /* whichever is SMALLER: 90% of the parent, or a flat 600px */
}
```

```css
.text {
    font-size: max(1rem, 2vw); /* whichever is LARGER: a fixed 1rem, or a fluid 2vw */
}
```

`min()` returns the **smallest** of its comma-separated arguments; `max()` returns the **largest**. These are genuinely useful, simpler alternatives to `clamp()` when you only need a single bound rather than both a minimum *and* a maximum — `min(90%, 600px)` reads naturally as "responsive, fluid width up to a sensible fixed cap," a very common real-world container-width pattern.

## `clamp()` — revisited

Already covered in full depth in Part 26 as part of responsive design — included here for completeness of the CSS-functions reference, since `clamp(MIN, PREFERRED, MAX)` is, precisely, `max(MIN, min(PREFERRED, MAX))` under the hood — worth seeing that equivalence explicitly, since it clarifies exactly how the three functions in this Part relate to and build on each other.

## `var()`

```css
:root {
    --primary-color: #4f46e5;
}
.button {
    background: var(--primary-color);
}
```

`var()` retrieves the value of a **CSS custom property** (CSS variable) — covered in complete, dedicated depth in the very next Part (Part 29), since it's substantial enough to deserve its own full treatment. Included here only for completeness of this Part's function-focused overview.

## `url()`

```css
.hero {
    background-image: url("images/hero.jpg");
}
@font-face {
    src: url("/fonts/inter.woff2") format("woff2");
}
```

`url()` references an external resource — an image, a font file, or (in older/legacy usage) an SVG fragment — by path, exactly as covered in Parts 4 and 21. Quotes around the path are optional but recommended for consistency and to safely handle paths containing spaces or special characters.

## Combining functions — practical patterns

```css
.responsive-container {
    width: min(100% - 2rem, 1200px); /* fluid, but capped, AND respects a
                                         consistent side margin/gutter */
    margin-inline: auto; /* centers it — logical properties covered in Part 38 */
}
```

```css
.fluid-spacing {
    padding: clamp(1rem, calc(1rem + 2vw), 3rem);
}
```

Functions nest and combine freely — this compositional power is a large part of what makes modern CSS capable of expressing genuinely sophisticated responsive behavior with remarkably little code, often entirely without a single media query, extending directly on the "fewer media queries needed" theme introduced in Part 26.

## Exercises — Part 28

1. Write a `width` declaration that fills 100% of the parent minus a fixed 40px, using `calc()`.
2. Write a `width` declaration that's fluid (90% of parent) but never exceeds 800px, using `min()`.
3. Explain why `calc(50% -10px)` is invalid/incorrectly parsed, and provide the corrected version.
4. Write a container width pattern that's fluid with a consistent 2rem total side gutter, but never exceeds 1140px.

<details>
<summary>View solutions</summary>

**1.**
```css
.element { width: calc(100% - 40px); }
```

**2.**
```css
.element { width: min(90%, 800px); }
```

**3.** Without a space before the `-10px`, the parser reads `-10px` as a single negative-length token immediately following `50%`, with no operator between them at all — which is invalid syntax (two length values with no operator), not subtraction. Corrected: `calc(50% - 10px)`, with spaces on both sides of the minus sign.

**4.**
```css
.container { width: min(100% - 2rem, 1140px); margin-inline: auto; }
```

</details>

---

# PART 29 — CSS Custom Properties

CSS Custom Properties (commonly called "CSS variables") are a special-focus area of this course, and for good reason: they are the foundation of virtually every modern theming system, design token system, and maintainable large-scale CSS architecture in professional use today.

## What they are, and why they exist

### What it is

A **custom property** is a CSS-native variable — a named value you define once and reuse throughout your stylesheet, referenced via the `var()` function.

### Why they exist

Before custom properties, if a specific color value (say, your brand's primary blue) was used in fifty different places across a stylesheet, changing it meant either a careful find-and-replace across every occurrence (fragile — easy to miss one, or accidentally replace an *unrelated* identical value) or relying entirely on a build-tool preprocessor like Sass (an external tool, not native CSS at all, with its own real limitations covered specifically below). Custom properties solve this natively, directly in the browser, with no build step required, and — critically, as you'll see — with capabilities that preprocessor variables fundamentally cannot match.

## Syntax

```css
:root {
    --primary-color: #4f46e5;
    --spacing-unit: 1rem;
    --border-radius: 8px;
}

.button {
    background-color: var(--primary-color);
    padding: var(--spacing-unit);
    border-radius: var(--border-radius);
}
```

- A custom property's name always begins with **two dashes** (`--`), distinguishing it clearly from regular CSS property names.
- `:root` is a pseudo-class matching the document's root element (`<html>`) — defining custom properties there makes them available **globally**, throughout the entire document, since (as covered next) custom properties inherit down through the DOM.
- `var(--property-name)` retrieves the custom property's current value, usable anywhere a normal CSS value would be accepted.

## Scope and inheritance

### Custom properties inherit, just like the text properties from Part 15

```css
:root {
    --text-color: #222;
}
.card {
    color: var(--text-color); /* inherited value, available here */
}
```

Custom properties follow the same inheritance mechanism covered in Part 15 — a property defined on an ancestor is available to every descendant, unless overridden. This is exactly why `:root` is the conventional place to define global/site-wide custom properties — defining it at the very top of the DOM tree guarantees it's inherited absolutely everywhere.

### Local/scoped overrides — a genuinely powerful pattern

```css
:root {
    --button-bg: #4f46e5;
}

.button {
    background: var(--button-bg);
}

.button-danger {
    --button-bg: #dc2626; /* overrides the value JUST within .button-danger's scope */
}
```

```html
<button class="button">Normal</button>
<button class="button button-danger">Danger</button>
```

This is one of the most powerful, genuinely distinctive capabilities custom properties have that **preprocessor variables (like Sass) fundamentally cannot replicate**: because custom properties participate in the normal CSS cascade and inheritance, you can **redefine/override** a variable's value *within a specific scope* (here, `.button-danger`), and every use of `var(--button-bg)` *within that scope* automatically picks up the new, locally-overridden value — while everywhere else on the page, the original `:root`-level value continues to apply, completely unaffected. A Sass variable, by contrast, is resolved once, at compile time, into a single static value baked into the output CSS — it has no concept of "this specific value should be different in this specific part of the live page," because Sass variables don't exist anymore once compilation is finished; they're just plain CSS values by the time a browser ever sees them.

## Fallback values

```css
.box {
    color: var(--text-color, #333); /* uses --text-color if defined; falls back to
                                         #333 if --text-color is undefined/unset */
}
```

`var()` accepts an optional **second argument** — a fallback value used if the referenced custom property hasn't been defined at all (or, more precisely, isn't a valid, inherited, in-scope value at the point it's used). This is genuinely useful for writing components that remain safely functional even when used in a context that hasn't defined every expected variable, and especially valuable when building reusable component libraries meant to be dropped into different projects/design systems.

## Theming — the primary real-world use case

```css
:root {
    --bg-color: white;
    --text-color: #1a1a1a;
    --card-bg: #f9fafb;
}

body {
    background: var(--bg-color);
    color: var(--text-color);
}

.card {
    background: var(--card-bg);
}
```

This pattern — defining an entire visual theme purely as a set of `:root` custom properties, then referencing those variables (never hardcoded values) throughout every component's actual styling — is the foundation of essentially every modern theming/dark-mode system. We build a complete, working dark-mode implementation using exactly this technique in Part 43.

## Component-level variables

```css
.button {
    --button-padding: 0.75rem 1.5rem;
    --button-radius: 6px;

    padding: var(--button-padding);
    border-radius: var(--button-radius);
}
```

Custom properties don't need to be global — defining them scoped to a single component (right there in the component's own rule, or a wrapper around it) is a genuinely useful pattern for centralizing a component's own "configuration" values at the top of its ruleset, making them easy to spot and adjust without needing to hunt through every individual declaration inside the component.

## Building a complete theme system

Pulling this entire Part together into one realistic, complete example:

```css
:root {
    /* Color palette */
    --color-primary: #4f46e5;
    --color-primary-dark: #4338ca;
    --color-danger: #dc2626;
    --color-text: #1a1a1a;
    --color-text-muted: #6b7280;
    --color-bg: #ffffff;
    --color-surface: #f9fafb;
    --color-border: #e5e7eb;

    /* Spacing scale */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2.5rem;

    /* Typography */
    --font-family-base: "Inter", system-ui, sans-serif;
    --font-size-base: 1rem;
    --line-height-base: 1.6;

    /* Borders and shadows */
    --radius-sm: 4px;
    --radius-md: 8px;
    --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
}

body {
    font-family: var(--font-family-base);
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
    color: var(--color-text);
    background: var(--color-bg);
}

.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    padding: var(--space-lg);
}

.button-primary {
    background: var(--color-primary);
    color: white;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-sm);
}

.button-primary:hover {
    background: var(--color-primary-dark);
}
```

This single `:root` block is, functionally, a complete **design token system** (a concept formalized further in Part 45) — every visual decision across the entire site (colors, spacing, typography, radii, shadows) flows from these central, named values. Changing the brand's primary color, or the entire spacing scale, becomes a **single-line edit** at the top of the stylesheet, rather than a sprawling find-and-replace across potentially hundreds of individual declarations.

## Knowledge Check — Part 29

1. What syntax distinguishes a custom property's name from a regular CSS property name?
2. Why does defining custom properties on `:root` make them globally available?
3. Explain, with a concrete example, why custom properties can do something Sass/preprocessor variables fundamentally cannot.
4. What does the second argument to `var()` do?
5. Give one practical reason to scope a custom property to a single component rather than defining it globally.

<details>
<summary>View solutions</summary>

1. The name must begin with two dashes (`--`), e.g. `--primary-color`, distinguishing it from standard CSS properties like `color` or `padding`.
2. Because custom properties inherit down through the DOM exactly like text properties (Part 15's inheritance mechanism) — `:root` matches the document's outermost element (`<html>`), so a property defined there is inherited by every single descendant element in the entire document, unless explicitly overridden somewhere further down.
3. Custom properties participate in the live CSS cascade and inheritance, so their value can be *locally overridden* within a specific scope (e.g., redefining `--button-bg` inside a `.button-danger` class), and every use of that variable within that scope picks up the overridden value automatically — while the rest of the page keeps the original value. Sass variables are resolved once, at compile time, into static values baked directly into the final CSS output — they have no runtime/live concept of "this value should differ in this specific scope of the actual rendered page," since the variable itself no longer exists by the time a browser sees the compiled CSS.
4. It provides a fallback value to use if the referenced custom property is undefined/not currently in scope — e.g., `var(--text-color, #333)` uses `#333` if `--text-color` hasn't been defined anywhere applicable.
5. It centralizes a component's own "configuration" values in one visible place at the top of its ruleset, making them easy to locate and adjust without needing to hunt through every individual declaration inside that component — especially useful for a component meant to be reused with different config values in different contexts.

</details>

---

# PART 30 — Transitions

## What problem transitions solve

### What it is

`transition` lets a CSS property change **smoothly over time**, rather than snapping instantly from one value to another the moment a state changes (like `:hover` activating, or a class being toggled).

### Why it exists

Without transitions, any CSS state change — a button's background color on hover, a menu's opacity toggling — happens in a single, instantaneous frame, which can feel abrupt and mechanical. Transitions interpolate smoothly between the "before" and "after" values over a specified duration, producing motion that feels natural and polished, and which also provides real usability benefit: smooth motion helps a user visually track *what* changed and *where*, rather than a jarring instant jump that can be genuinely disorienting, especially for larger visual changes.

## The four transition properties, and the shorthand

```css
.button {
    transition-property: background-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
    transition-delay: 0s;
}
```

- **`transition-property`** — which CSS property (or `all`, for every animatable property) should transition. Being explicit about a specific property, rather than always using `all`, is generally better practice — it's both more predictable (you know exactly what's animating) and better for performance (the browser doesn't need to watch every single property for changes).
- **`transition-duration`** — how long the transition takes, in seconds (`0.2s`) or milliseconds (`200ms`).
- **`transition-timing-function`** — the "pacing" curve of the transition over its duration (covered in depth next).
- **`transition-delay`** — how long to wait before the transition actually begins.

```css
.button {
    transition: background-color 0.2s ease, transform 0.2s ease;
}
```

The `transition` **shorthand** combines all four (property, duration, timing-function, delay, in that general order — delay is optional and often omitted, defaulting to `0s`), and can specify **multiple, independently-configured transitions** on the same element via comma separation, as shown above.

> ⚠️ **Common mistake** — Putting `transition` only on the `:hover` state, rather than on the element's base/default state.

```css
/* ❌ Wrong: transition only applies to the hover state, so the button
   transitions smoothly IN on hover, but SNAPS instantly back on mouse-leave */
.button:hover {
    background: darkblue;
    transition: background 0.2s ease;
}

/* ✅ Correct: transition on the base state applies to BOTH directions —
   entering and leaving the hover state both animate smoothly */
.button {
    background: steelblue;
    transition: background 0.2s ease;
}
.button:hover {
    background: darkblue;
}
```

This is a genuinely common, easy-to-miss mistake: `transition` needs to be declared on the element's **normal/base** state to govern *both* directions of the change (entering and leaving the triggering state) — declaring it only on `:hover` means it only applies while `:hover` styles are being calculated, so the transition *into* hover animates, but reverting back to the base state on mouse-leave happens instantly, with no transition at all, since the base state's own rule never had a `transition` declaration of its own.

## Timing functions

```text
Visualizing how each timing function paces a transition over its duration
(vertical axis = how far through the value change; horizontal = time elapsed):

linear                    ease-in                   ease-out
progress                  progress                  progress
   │      ╱                  │           ╱              │  ╱
   │    ╱                    │         ╱                │╱
   │  ╱                      │       ╱                  │
   │╱                        │    ╱                     │
   │╱                        │  ╱                       │
   └──────▶ time              └──────▶ time               └──────▶ time
(constant speed            (starts slow,               (starts fast,
 throughout)                 accelerates —               decelerates
                              feels like it's             toward the end —
                              "gathering                  feels like it's
                              momentum")                  "settling into place")

ease (the default)
progress
   │        ╱
   │      ╱
   │    ╱
   │  ╱
   │╱
   └──────▶ time
(starts slightly slow, speeds up through
 the middle, slows down again at the end —
 generally the most natural-feeling default
 for most UI transitions)
```

- **`linear`** — constant speed throughout. Feels mechanical; rarely the best choice for UI polish, though genuinely appropriate for certain continuous effects (like a perfectly steady rotating loading spinner, covered in Part 32).
- **`ease`** (the default when `transition-timing-function` is omitted) — a gentle, natural-feeling acceleration-then-deceleration curve; a sensible default for most everyday UI transitions.
- **`ease-in`** — starts slow, accelerates toward the end. Often used for something *leaving*/*exiting* the screen (feels like it's gaining momentum as it exits).
- **`ease-out`** — starts fast, decelerates toward the end. Often used for something *entering*/*arriving* on screen (feels like it's settling naturally into its final position — this asymmetry, where entrances feel slightly different from exits, is a genuinely well-established motion-design principle).

```css
.custom-easing {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**`cubic-bezier(x1, y1, x2, y2)`** — defines a fully **custom** timing curve, giving precise control beyond the built-in keywords. The specific numbers describe a Bézier curve's two control points (the "shape" of the pacing curve). This is genuinely advanced territory — most everyday work is well-served by the built-in keywords, but understanding that `cubic-bezier()` exists (and that many design tools/browser DevTools include a visual curve editor for constructing custom values without needing to understand the underlying math) is valuable, professional-level knowledge. Values with a y-coordinate greater than 1 or less than 0 (like the `1.56` above) produce an "overshoot" effect — the animated value briefly exceeds its final target before settling back, a popular, lively "bounce" effect for certain UI entrances.

## Building interactive UI examples

### Button hover/press feedback

```css
.button {
    background: #4f46e5;
    transform: scale(1);
    transition: background 0.2s ease, transform 0.15s ease;
}
.button:hover {
    background: #4338ca;
}
.button:active {
    transform: scale(0.97);
}
```

### Card lift-on-hover

```css
.card {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transform: translateY(0);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
```

### Smooth accordion-style expand (height-based — with a caveat)

```css
.accordion-panel {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}
.accordion-panel.open {
    max-height: 500px; /* an approximate, sufficiently large upper bound */
}
```

> 💡 **Tip** — This `max-height` trick is a well-known, common workaround for a genuine CSS limitation: **you cannot directly transition to/from `height: auto`** (since a transition needs two concrete, calculable numeric endpoints to interpolate between, and `auto` isn't a fixed number the browser can smoothly animate toward). Transitioning `max-height` to an approximate, generously-large fixed value is a practical, if slightly imperfect, workaround — the timing can feel slightly "off" if the content's actual height is much smaller than the chosen `max-height` value, since the transition duration is calculated against the full `max-height` distance regardless of the content's real height. (A more modern, precise alternative uses the `calc-size()` function or, for simple show/hide, the newer `interpolate-size` mechanism in cutting-edge browsers — genuinely advanced, still-emerging territory worth being aware exists, beyond this course's core scope.)

## Exercises — Part 30

1. Write a transition for a link's `color` property that takes 150ms and uses `ease-out` timing.
2. Explain, precisely, why a transition declared only on `:hover` fails to animate the reverse (mouse-leave) direction, and show the fix.
3. Write CSS for a button that smoothly transitions both its `background-color` and `transform` (a slight scale-down) on `:active`.
4. Explain the practical, felt difference between `ease-in` and `ease-out`, and give one appropriate use case for each.
5. Why can't you directly transition `height: auto`, and what's a common workaround?

<details>
<summary>View solutions</summary>

**1.**
```css
a { transition: color 150ms ease-out; }
```

**2.** Because `transition` only governs how *that specific rule's own declared properties* change — when declared only inside `:hover`, it only takes effect while the hover state's styles are being applied/calculated, so entering hover transitions smoothly, but once the mouse leaves and the element reverts to its base (non-hover) rule, that base rule never declared a `transition` of its own, so the reversion happens instantly. Fix: move `transition` to the base/default state's rule, so it governs both directions.
```css
.link { color: black; transition: color 150ms ease-out; }
.link:hover { color: steelblue; }
```

**3.**
```css
.button {
    transform: scale(1);
    transition: background-color 0.15s ease, transform 0.15s ease;
}
.button:active {
    background-color: darkblue;
    transform: scale(0.96);
}
```

**4.** `ease-in` starts slow and accelerates toward the end, giving a sense of "gaining momentum" — often suited to something exiting/leaving the screen. `ease-out` starts fast and decelerates toward the end, giving a sense of "settling into place" — often suited to something entering/arriving on screen.

**5.** Because a CSS transition needs two concrete, numerically calculable endpoint values to interpolate smoothly between, and `auto` is not a fixed number the browser can animate toward — its actual resolved value depends on content, and isn't known as a fixed quantity ahead of time in the way a transition calculation requires. A common workaround is transitioning `max-height` to a generously large, approximate fixed value instead, though this can make the timing feel slightly imprecise if content is much shorter than the chosen max-height.

</details>

---

# PART 31 — Transforms

## What transforms are

### What it is

The `transform` property applies **geometric transformations** — moving, scaling, rotating, or skewing — to an element, **visually**, without affecting the normal document flow or the layout space the element reserves (a genuinely important distinction, covered in depth below).

### Why it exists

Achieving these same visual effects *without* `transform` would require manipulating actual layout properties (`top`/`left` with `position`, `width`/`height`, or nothing at all for rotation/skew, which have no other CSS equivalent at all) — all of which trigger the expensive Layout stage of the rendering pipeline (recall Part 0). `transform` operates at the Composite stage instead (again, recall Part 0's pipeline) — dramatically cheaper, and the reason `transform` is the preferred, standard tool for animated/interactive visual effects, covered fully in Part 48 (Performance).

## The transform functions

### `translate()`

```css
.box {
    transform: translate(20px, 10px); /* moves 20px right, 10px down */
}
.box-x-only {
    transform: translateX(20px);
}
.box-y-only {
    transform: translateY(-10px); /* negative values move up/left, as expected */
}
```

Moves an element visually, from its normal position, by the specified horizontal/vertical distance — **without** affecting layout at all (surrounding elements do not react or reflow, exactly as if the element hadn't moved, from a layout-space perspective).

```css
.perfectly-centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

This specific combination — `position: absolute` with `top: 50%; left: 50%;`, then `transform: translate(-50%, -50%)` — is a genuinely classic, extremely common pre-Flexbox/Grid technique for perfectly centering an element of *unknown/dynamic* size within its containing block: `top: 50%; left: 50%;` positions the element's **top-left corner** at the exact center, and then `translate(-50%, -50%)` shifts the element back by exactly **half of its own width and height** (note: percentage values in `transform: translate()` are relative to the *element's own* size, not its container's — a distinct, important nuance from `top`/`left`'s own percentages, which are relative to the containing block), landing its true visual center precisely at the container's center — regardless of the element's exact dimensions, without needing to know them in advance. (Flexbox's `align-items: center; justify-content: center;`, covered in Part 24, is generally the more modern, preferred solution today — but this transform-based technique remains genuinely useful, still appears constantly in real-world code, and is worth understanding.)

### `scale()`

```css
.box {
    transform: scale(1.1); /* 110% of original size, both axes */
}
.box-x-only {
    transform: scaleX(0.5); /* 50% width, height unchanged */
}
```

Resizes an element visually — `1` is original size, values above `1` enlarge, values between `0` and `1` shrink, negative values flip the element (a rarely-needed but valid effect).

### `rotate()`

```css
.box {
    transform: rotate(45deg);
}
.box-negative {
    transform: rotate(-15deg); /* counter-clockwise */
}
```

Rotates an element around a pivot point (by default, its own exact center — see `transform-origin` below), specified in degrees (`deg`), positive values rotating clockwise.

### `skew()`

```css
.box {
    transform: skew(10deg, 0deg); /* horizontal skew */
}
```

Distorts an element's shape by slanting it along the X and/or Y axis — used far less frequently than the other three in everyday UI work, but occasionally useful for specific stylized/decorative visual effects.

### Combining multiple transforms

```css
.box {
    transform: translateX(20px) rotate(10deg) scale(1.05);
}
```

Multiple transform functions can be chained in a single `transform` declaration, space-separated — they're applied in the **order written**, left to right, each one operating on the *already-transformed* result of the previous function, which can matter for the final visual outcome when combining rotation with translation especially (rotating first and then translating produces a different result than translating first and then rotating, since the direction "right" itself changes once an element has been rotated).

## Modern individual transform properties

```css
.box {
    translate: 20px 10px;
    rotate: 45deg;
    scale: 1.1;
}
```

Modern CSS also provides `translate`, `rotate`, and `scale` as **entirely separate, standalone properties** (distinct from being bundled functions inside a single `transform` value) — genuinely useful because, being separate properties, each can be **independently transitioned/animated** and independently overridden by more specific selectors, without needing to carefully reconstruct an entire combined `transform` string every time just to change one piece of it. (`skew` has no standalone-property equivalent; it remains accessible only via the `transform: skew()` function.)

> 💡 **Tip** — For simple, single-effect cases, the standalone properties (`translate`, `rotate`, `scale`) are often cleaner and more maintainable. For combining multiple transformations together with precise, deliberate order control, the traditional `transform` property (chaining functions) remains fully valid and, in some cases, more explicit about exact ordering.

## `transform-origin`

```css
.box {
    transform-origin: center; /* default: rotates/scales around its own exact center */
}
.box-corner-origin {
    transform-origin: top left; /* rotates/scales around its top-left corner instead */
}
```

`transform-origin` sets the **pivot point** that `rotate()` and `scale()` operate around — the default (`center`, i.e., `50% 50%`) is correct for the overwhelming majority of cases, but changing it (e.g., to `top left`) is genuinely useful for specific effects, like a menu that should visually "grow" outward from its trigger button's corner rather than expanding symmetrically from its own center.

## Transform performance — why it matters

Recall Part 0's rendering pipeline discussion, and the brief mention at the start of this Part: `transform` (along with `opacity`) can typically be handled by the browser's **Compositor** stage alone, entirely skipping the more expensive **Layout** and often **Paint** stages that most other property changes require. This is *the* concrete, technical reason `transform` is overwhelmingly preferred for animation and interactive effects over animating layout-affecting properties like `width`, `height`, `top`, `left`, or `margin` directly — we build on this exact point with full technical depth in Part 48 (Performance), where it becomes one of the most actionable, high-impact pieces of practical performance guidance in the entire course.

## Exercises — Part 31

1. Write a `transform` that moves an element 30px right and 15px up simultaneously.
2. Write a `transform` that rotates an element 90 degrees clockwise and scales it to 150% of its original size, in that order.
3. Using `position: absolute` and `transform`, perfectly center an element of unknown size within its relatively-positioned parent.
4. Explain why `transform` and `opacity` are generally cheaper for the browser to animate than `width` or `top`.
5. What does `transform-origin: top left;` change about how `rotate()` behaves on an element, compared to the default?

<details>
<summary>View solutions</summary>

**1.**
```css
.element { transform: translate(30px, -15px); }
```

**2.**
```css
.element { transform: rotate(90deg) scale(1.5); }
```

**3.**
```css
.parent { position: relative; }
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

**4.** Because `transform` and `opacity` changes can typically be handled entirely by the browser's Compositor stage, skipping the more expensive Layout stage (recalculating geometry/positions for potentially many elements) and often the Paint stage too — whereas changing `width` or `top` forces the browser to recalculate layout geometry (Layout), repaint the affected area (Paint), and then recomposite, a substantially more expensive sequence of work.

**5.** By default (`center`, i.e., `50% 50%`), an element rotates around its own exact center point. With `transform-origin: top left;`, the element instead rotates around its top-left corner — so instead of spinning symmetrically in place, it swings around that corner point, sweeping through a much larger visual arc.

</details>

---

# PART 32 — CSS Animations

## `@keyframes` and the `animation` properties

### What problem this solves beyond `transition`

Transitions (Part 30) are excellent for simple, **two-state** changes (A to B), typically triggered by a state change like `:hover`. But many real animations need more: multiple intermediate steps, looping/repeating behavior, or animation that begins automatically on page load rather than waiting for a user-triggered state change. **`@keyframes`** and the `animation` property family solve exactly this — genuinely multi-step, potentially looping, potentially self-starting animation sequences.

### `@keyframes` syntax

```css
@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.element {
    animation-name: fade-in;
    animation-duration: 0.4s;
}
```

`@keyframes` defines a **named sequence of styles** at specific points along an animation's timeline. `from`/`to` are convenient shorthand for `0%`/`100%` respectively — the simplest possible two-point animation.

```css
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
```

For more than two steps, use explicit **percentage** keyframe points — any number of them, at any percentages you choose, defining the property values the animation should have at each of those specific moments along its full duration; the browser smoothly interpolates between each consecutive pair of defined keyframe points.

## The `animation` properties, individually

```css
.element {
    animation-name: pulse;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-delay: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-fill-mode: both;
    animation-play-state: running;
}
```

- **`animation-name`** — which `@keyframes` block to use.
- **`animation-duration`** — how long one complete cycle takes.
- **`animation-timing-function`** — the same pacing-curve concept from Part 30 (`ease`, `linear`, `cubic-bezier()`, etc.), applied here across the animation's keyframe sequence.
- **`animation-delay`** — wait time before the animation begins.
- **`animation-iteration-count`** — how many times the animation repeats: a specific number (`3`), or `infinite` for continuous looping.
- **`animation-direction`** — `normal` (always plays forward, 0% → 100%), `reverse` (always plays backward), `alternate` (plays forward on odd iterations, backward on even iterations — creating a smooth back-and-forth effect without needing to manually define the reverse keyframes yourself), `alternate-reverse` (the same alternating pattern, but starting backward first).
- **`animation-fill-mode`** — controls what styles apply **before** the animation starts and **after** it ends (covered in depth next, since it's a genuinely common source of confusion).
- **`animation-play-state`** — `running` (default) or `paused` — can be toggled (commonly via JavaScript, or a `:hover`/`:focus` pseudo-class in pure CSS) to pause/resume an in-progress animation.

## `animation-fill-mode` — a deeper look

This property answers a question that trips up many beginners: "what does the element look like *before* the animation starts, and *after* it finishes?"

```text
animation-fill-mode: none (the default)

Before start: element uses its own normal, un-animated CSS styles
              (NOT the animation's first (0%) keyframe values)
During:       element follows the keyframe animation normally
After end:    element SNAPS BACK to its normal, un-animated CSS styles
              (NOT the animation's last (100%) keyframe values) —
              this can look like a jarring "reset" the instant the
              animation completes
```

```text
animation-fill-mode: forwards

Before start: normal styles (same as "none")
During:       follows the keyframe animation normally
After end:    element RETAINS the animation's FINAL (100%) keyframe
              values, rather than snapping back — no jarring reset
```

```text
animation-fill-mode: backwards

Before start: element immediately adopts the FIRST (0%) keyframe's
              values right away, even during any animation-delay —
              useful to prevent a flash of un-animated styling during
              a delay period
During/After: same as "none" (snaps back to normal styles once finished)
```

```text
animation-fill-mode: both

Combines forwards AND backwards — applies the first keyframe's values
during any delay, and retains the final keyframe's values after
completion. This is, in practice, the most commonly desired/used value
whenever an animation's start or end state should visually "stick"
rather than the element reverting to its un-animated default styling.
```

> ⚠️ **Common mistake** — Building a fade-in or slide-in entrance animation, watching it work perfectly during the animation itself, but then being confused when the element abruptly "resets" or flickers back to its original (often invisible, or off-screen) state the instant the animation completes. This is almost always a missing `animation-fill-mode: forwards` (or `both`) — without it, the default `none` behavior means the element reverts to its plain, un-animated CSS the moment the keyframe sequence finishes, undoing the very entrance effect you just built.

## The `animation` shorthand

```css
.element {
    animation: pulse 2s ease-in-out infinite alternate;
}
```

Combines the individual properties above into a single, compact declaration — the order is fairly flexible (the browser can generally distinguish a time value for duration/delay from a keyword for direction/fill-mode/etc. based on each value's own type), though listing `duration` before `delay` when both are present (as two separate time values) follows the convention of "first time value = duration, second time value = delay."

## Building real animations

### Spinner (loading indicator)

```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #e5e7eb;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
```

Note `linear` timing here, deliberately — a spinner should rotate at a perfectly constant, unvarying speed; `ease`'s natural acceleration/deceleration would look visually wrong for continuous rotation.

### Pulse (drawing attention to an element)

```css
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
.notification-dot {
    animation: pulse 1.5s ease-in-out infinite;
}
```

### Slide-in entrance

```css
@keyframes slide-in-from-right {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
.toast {
    animation: slide-in-from-right 0.3s ease-out forwards;
}
```

### Fade

```css
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
.modal-backdrop {
    animation: fade-in 0.2s ease forwards;
}
```

### Skeleton loader (a common modern loading-state pattern)

```css
@keyframes skeleton-shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
}
.skeleton {
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 400px 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
```

### Notification entrance + auto-exit-ready structure

```css
@keyframes notification-in {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.notification {
    animation: notification-in 0.3s ease-out forwards;
}
```

### Modal entrance (scale + fade combined)

```css
@keyframes modal-in {
    from {
        transform: scale(0.95);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
.modal {
    animation: modal-in 0.25s ease-out forwards;
}
```

## Motion accessibility: `prefers-reduced-motion`

### Why this matters — genuinely, not as a checkbox

Recall this was flagged briefly in Part 26's media features tour — it deserves complete treatment here, in the context of actual animation code, because this is a real, meaningful accessibility responsibility, not a minor nicety. Some users experience genuine physical discomfort, dizziness, nausea, or even triggered vestibular disorder symptoms from motion and animation on screen — this is a documented, real medical reality for a meaningful portion of users, not a hypothetical edge case. Operating systems provide a system-level setting specifically for this ("Reduce Motion" on macOS/iOS, "Show animations" toggles on Windows/Android), and CSS can detect and respect that preference directly.

```css
@keyframes slide-in-from-right {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.toast {
    animation: slide-in-from-right 0.3s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
    .toast {
        animation: none; /* or a much simpler, non-motion alternative, like a
                             plain opacity fade with no translation/movement */
    }
}
```

A more scalable, global pattern for an entire site:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

This global pattern doesn't remove animations entirely (some sites prefer to preserve essential state-change feedback, just without the perceptible motion) — instead, it makes every animation/transition's *duration* effectively instantaneous, so state changes still happen, but without any perceptible motion in between, satisfying users who've explicitly requested reduced motion at the OS level.

> ♿ **Accessibility note** — This is not optional polish for a subset of "edge case" users — treat `prefers-reduced-motion` handling as a standard, expected part of building *any* non-trivial animation or transition in professional, production CSS, exactly as consistently as you'd remember to add `alt` text to an image. At minimum, any animation involving significant movement, scaling, or repeated/looping motion should have a `prefers-reduced-motion: reduce` fallback.

## Exercises — Part 32

1. Write a `@keyframes` animation named `fade-up` that animates an element from `opacity: 0; transform: translateY(20px);` to `opacity: 1; transform: translateY(0);`.
2. Apply that animation to an element so it plays once, over 0.4 seconds, with `ease-out` timing, and the element **retains** its final state after the animation completes.
3. Explain, precisely, what problem `animation-fill-mode: forwards` solves, and what visibly happens without it.
4. Build an infinitely-looping, perfectly constant-speed rotating spinner, explaining why `linear` timing is the correct choice here specifically.
5. Write the CSS needed to respect a user's `prefers-reduced-motion: reduce` setting for an animated element, using the approach of disabling the animation entirely for those users.
6. What's the difference between `animation-direction: alternate` and manually writing keyframes that go forward then backward within a single cycle?

<details>
<summary>View solutions</summary>

**1.**
```css
@keyframes fade-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**2.**
```css
.element {
    animation: fade-up 0.4s ease-out forwards;
}
```

**3.** Without `animation-fill-mode: forwards` (or `both`), an element reverts to its normal, un-animated CSS styling the instant the animation completes — even if the animation's final (100%) keyframe left it in a different visual state (e.g., fully opaque and in position). This produces a jarring "snap back" the moment an entrance animation finishes, undoing the very effect just performed. `forwards` fixes this by making the element retain the animation's final keyframe values after completion, instead of reverting.

**4.**
```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.spinner {
    animation: spin 1s linear infinite;
}
```
`linear` is correct here because a spinner should rotate at a perfectly constant, unvarying speed for a smooth, continuous circular motion — `ease`'s natural acceleration/deceleration would visually look like the spinner is unnaturally speeding up and slowing down repeatedly, which reads as wrong/broken for this specific continuous-rotation use case.

**5.**
```css
@media (prefers-reduced-motion: reduce) {
    .element {
        animation: none;
    }
}
```

**6.** `animation-direction: alternate` automatically reverses playback direction on every other iteration, using the *same* keyframes defined once — the browser handles reversing it for you. Manually writing keyframes that go forward-then-backward within a single cycle requires you to explicitly define every intermediate step for both directions yourself within one longer `@keyframes` block, which is more verbose and error-prone, though it does allow for asymmetric forward/backward timing or easing within that single cycle if genuinely needed, which `alternate` alone cannot express (alternate simply reverses the same curve).

</details>

---

# PART 33 — Responsive Navigation

## Separating HTML/CSS responsibilities from JavaScript interaction

Before building any of the navigation patterns below, it's worth being explicit about scope: this course covers HTML and CSS, not JavaScript. Every pattern in this Part focuses on the **structural HTML** and **CSS layout/styling/responsive behavior** — the actual *showing and hiding* of a mobile menu (toggling a class, listening for a click) requires JavaScript, which is outside this course's boundaries. What's covered here is everything that *can* be done with HTML/CSS alone, plus the precise markup/class "hooks" a small amount of JavaScript would need to actually wire up the interactivity — a clean separation of concerns that mirrors Part 0's three-layer model exactly.

## Desktop navbar

```html
<nav class="navbar" aria-label="Main navigation">
  <a href="/" class="navbar-brand">Brand</a>
  <ul class="navbar-links">
    <li><a href="/products">Products</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="/about">About</a></li>
  </ul>
  <a href="/signup" class="navbar-cta">Sign Up</a>
</nav>
```

```css
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
}
.navbar-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
}
```

## Mobile nav structure with a hamburger toggle

```html
<nav class="navbar" aria-label="Main navigation">
  <a href="/" class="navbar-brand">Brand</a>

  <button
    class="navbar-toggle"
    type="button"
    aria-expanded="false"
    aria-controls="navbar-menu"
    aria-label="Toggle navigation menu">
    <span class="hamburger-icon"></span>
  </button>

  <ul class="navbar-links" id="navbar-menu" hidden>
    <li><a href="/products">Products</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

```css
.navbar-toggle {
    display: none; /* hidden by default; shown only below the mobile breakpoint */
}

@media (max-width: 767px) {
    .navbar-toggle {
        display: block;
    }
    .navbar-links {
        /* on mobile, links stack vertically and are hidden until toggled */
        flex-direction: column;
        width: 100%;
    }
}
```

Every accessibility pattern from Part 12 is directly applicable here, and deliberately present in this markup:
- A real `<button>` for the toggle (not a `<div>` or `<a href="#">`), for native keyboard focusability and activation.
- `aria-expanded="false"` — communicates current open/closed state, updated by JavaScript to `"true"` when opened (recall Part 12's exact `aria-expanded` pattern).
- `aria-controls="navbar-menu"` — associates the button with the specific panel it controls.
- `aria-label` — provides an accessible name, since the button contains only a decorative icon, no visible text.
- The `hidden` attribute on the menu itself — the standard, simplest HTML mechanism for "not currently shown, and not in the accessibility tree" (recall Part 19's `display: none` discussion — the `hidden` attribute is functionally equivalent, toggled via JavaScript alongside `aria-expanded`).

## Dropdown submenu

```html
<nav class="navbar" aria-label="Main navigation">
  <ul class="navbar-links">
    <li><a href="/">Home</a></li>
    <li class="has-dropdown">
      <button type="button" aria-expanded="false" aria-controls="products-menu">
        Products
      </button>
      <ul class="dropdown-menu" id="products-menu" hidden>
        <li><a href="/products/software">Software</a></li>
        <li><a href="/products/hardware">Hardware</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

```css
.has-dropdown {
    position: relative; /* establishes the containing block, exactly as covered in Part 20 */
}
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 180px;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Sticky nav

```css
.navbar {
    position: sticky; /* exactly the Part 20 sticky-positioning mechanism */
    top: 0;
    z-index: 50;
    background: white;
}
```

## Sidebar navigation

```html
<nav class="sidebar-nav" aria-label="Section navigation">
  <ul>
    <li><a href="/docs/intro">Introduction</a></li>
    <li><a href="/docs/setup">Setup</a></li>
    <li><a href="/docs/api">API Reference</a></li>
  </ul>
</nav>
```

```css
.sidebar-nav {
    width: 240px;
    flex-shrink: 0; /* Part 24's overflow-prevention pattern — the sidebar should
                        never be squeezed narrower by its flex siblings */
}
```

## Complete responsive navbar, combining every pattern in this Part

```css
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    position: sticky;
    top: 0;
    z-index: 50;
    background: white;
    border-bottom: 1px solid #e5e7eb;
}

.navbar-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
}

.navbar-toggle {
    display: none;
}

@media (max-width: 767px) {
    .navbar-toggle {
        display: block;
    }
    .navbar-links {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: white;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
}
```

## Exercises — Part 33

1. Explain why the mobile navigation toggle should be a real `<button>` rather than a `<div>` or `<a href="#">`, tying back to Part 12.
2. What ARIA attribute communicates a toggle's current open/closed state to assistive technology, and what values should it take?
3. Write the CSS needed to make a navbar remain visible at the top of the viewport as the page is scrolled.
4. What does the `hidden` HTML attribute do, and why is it an appropriate mechanism for a collapsed mobile menu?
5. For a dropdown submenu using `position: absolute`, what CSS must the parent `<li>` have for the dropdown to position correctly relative to it, rather than the whole page?

<details>
<summary>View solutions</summary>

1. A real `<button>` is natively keyboard-focusable, natively activates on Enter/Space, and is automatically announced with the correct "button" role to screen readers — all without extra code. A `<div>` or `<a href="#">` would require manually re-implementing all of that behavior (recall Part 12's full `<div onclick>` vs `<button>` comparison), and `<a href="#">` specifically misuses a navigation element for what is actually an in-page action (toggling visibility), not real navigation to a new destination.
2. `aria-expanded`, set to `"true"` when the controlled content is currently open/visible, and `"false"` when it's collapsed/hidden.
3. ```css
   .navbar { position: sticky; top: 0; }
   ```
4. The `hidden` attribute removes an element from both visual display and the accessibility tree — functionally similar to `display: none` (Part 19) — making it an appropriate, simple mechanism for a mobile menu that should be completely absent (not just visually hidden) until explicitly toggled open.
5. `position: relative;` — this establishes the `<li>` as the dropdown's containing block (recall Part 20), so the dropdown's `position: absolute; top: 100%; left: 0;` positions it directly relative to that `<li>`, rather than falling back to being positioned relative to the entire page/viewport.

</details>

---

# PART 34 — Forms With CSS

Recall Part 7's exhaustive HTML forms coverage — this Part covers styling those exact same elements professionally, including the genuinely tricky cross-browser default-styling quirks form controls are notorious for.

## Why form controls are trickier to style than most elements

Browsers apply significant, often inconsistent, native default styling to form controls (`<input>`, `<select>`, `<button>`, checkboxes, radios) — rendering them using the operating system's own native UI toolkit in many cases, which is *why* a default checkbox looks slightly different on Windows vs. macOS vs. a mobile browser. This is a real, distinctive challenge in form styling that most other HTML elements don't have to the same degree.

## Basic input, textarea, and select styling

```css
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="tel"],
input[type="url"],
input[type="search"],
textarea,
select {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit; /* form controls do NOT inherit font-family by default
                              in most browsers — recall the Part 15 exercise
                              flagging this exact, well-known exception */
    color: #111827;
    background-color: white;
}
```

> ⚠️ **Common mistake** — Forgetting `font-family: inherit;` on form controls. This connects directly back to Part 15's inheritance discussion: most browsers apply their own default, often different, font to form controls rather than letting them naturally inherit the page's body font the way a `<p>` or `<div>` would — a form styled with a custom web font (Part 21) can end up with mismatched-looking inputs unless you explicitly force inheritance back on.

## Focus states

```css
input:focus,
textarea:focus,
select:focus {
    outline: none;
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
    border-color: #4f46e5;
}
```

Exactly the Part 12/14/23 pattern, applied specifically to form controls — never remove the default focus outline without this kind of deliberate, visible replacement.

## Checkbox and radio styling

```css
input[type="checkbox"],
input[type="radio"] {
    width: 1.15rem;
    height: 1.15rem;
    accent-color: #4f46e5;
}
```

`accent-color` is a genuinely convenient modern property: it recolors a checkbox's or radio's **native** checked-state appearance (the checkmark/dot and its background) to match your brand color, without needing to fully rebuild the control's appearance from scratch with more invasive, complex custom-styling techniques — a huge, welcome simplification for what used to require significant custom markup/CSS trickery just to recolor a checkbox.

## File input styling

```css
input[type="file"] {
    font-size: 0.9rem;
}
input[type="file"]::file-selector-button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    margin-right: 0.75rem;
    cursor: pointer;
}
```

`::file-selector-button` is a pseudo-element specifically targeting the browser-generated "Choose File" button portion of a `type="file"` input, letting you restyle that button independently of the filename-display text next to it.

## Button styling

```css
button {
    font-family: inherit; /* same inheritance quirk as other form controls */
    cursor: pointer;
    border: none;
    border-radius: 6px;
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
    font-weight: 600;
}

.button-primary {
    background: #4f46e5;
    color: white;
}
.button-primary:hover {
    background: #4338ca;
}

.button-secondary {
    background: white;
    color: #4f46e5;
    border: 1px solid #4f46e5;
}
```

## Validation styling: `:valid`, `:invalid`, `:user-valid`, `:user-invalid`

```css
input:invalid {
    border-color: #dc2626;
}
input:valid {
    border-color: #16a34a;
}
```

`:invalid`/`:valid` match based on the current HTML validation state of a field (recall Part 7's `required`, `pattern`, `type="email"`, etc.) — but there's a genuinely important, common usability problem with using them naively: **`:invalid` matches immediately on page load**, the instant an empty `required` field renders, *before the user has even had a chance to type anything* — producing a jarring, premature "wall of red" the moment a form appears, which feels punishing and unhelpful rather than genuinely informative.

```css
input:user-invalid {
    border-color: #dc2626;
}
input:user-valid {
    border-color: #16a34a;
}
```

`:user-invalid`/`:user-valid` are newer, more usability-conscious pseudo-classes: they only match **after the user has actually interacted with the field** (typically, after it's been focused and then blurred/left at least once) — solving the "red on page load" problem directly, and representing the generally preferred, more modern choice for real-time validation styling wherever browser support allows.

> 💡 **Tip** — Prefer `:user-invalid`/`:user-valid` over plain `:invalid`/`:valid` for real-time, as-you-type-or-after-leaving-the-field validation feedback — it respects the user's actual interaction, rather than shaming them with red borders on fields they haven't even reached yet.

## Complete, professionally-styled forms

### Login form

```html
<form class="auth-form" action="/login" method="post">
  <div class="form-field">
    <label for="login-email">Email</label>
    <input type="email" id="login-email" name="email" required>
  </div>
  <div class="form-field">
    <label for="login-password">Password</label>
    <input type="password" id="login-password" name="password" required>
  </div>
  <button type="submit" class="button-primary">Log In</button>
</form>
```

```css
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 360px;
}
.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}
.form-field label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}
```

### Register and contact forms

Follow the exact same `.form-field` pattern established above, extended with the `<select>`, `<textarea>`, `<fieldset>`, and checkbox patterns from Part 7 — the complete registration and contact form HTML from Part 7's Mini Project applies directly here, with this Part's CSS layered on top.

## Exercises — Part 34

1. Explain why `font-family: inherit;` is commonly needed on form controls, but rarely needed on a `<div>` or `<p>`.
2. Write CSS to recolor a checkbox's native checked-state appearance to a specific brand color, using the simplest modern approach available.
3. Explain the specific usability problem with using plain `:invalid` for real-time form validation styling, and name the modern pseudo-class that solves it.
4. Write a focus style for text inputs that removes the default outline but replaces it with a visible, accessible custom one, using `:focus-visible`.

<details>
<summary>View solutions</summary>

1. Because most browsers apply their own default font to form controls, rather than letting them naturally inherit the page's body font the way most other elements do by default — this is a well-known browser default-styling exception. `font-family: inherit;` explicitly forces the control to match the surrounding page's font.

2. ```css
   input[type="checkbox"] { accent-color: #4f46e5; }
   ```

3. `:invalid` matches immediately on page load for any field that currently fails validation (e.g., an empty `required` field), even before the user has had any chance to interact with it — producing a premature, punishing "wall of red" the instant the form appears. `:user-invalid` solves this by only matching after the user has actually interacted with the field (typically after focusing and then leaving it).

4. ```css
   input:focus { outline: none; }
   input:focus-visible {
       outline: 2px solid #4f46e5;
       outline-offset: 2px;
   }
   ```

</details>

---

# PART 35 — CSS Architecture

This is a special-focus area of this course. Everything taught so far has covered individual CSS properties and techniques — this Part is about a genuinely different, higher-level skill: organizing potentially thousands of lines of CSS, across a real, growing project, in a way that stays maintainable, predictable, and comprehensible to other developers (and future-you) over time.

## The problem: why huge, unstructured stylesheets become unmanageable

A CSS file with no organizing principle at all tends to accumulate real, specific problems as it grows:

- **Specificity creep** — recall Part 15: without discipline, developers reach for increasingly specific selectors (or `!important`) to "win" against earlier rules, and the codebase's overall specificity baseline ratchets upward over time, making every *future* override progressively harder to write cleanly.
- **Unclear ownership** — is this `.title` class used by exactly one component, or dozens, scattered unpredictably across the codebase? Changing it becomes genuinely risky without knowing.
- **Dead CSS** — rules that no longer match anything in the current HTML, but nobody's confident enough to delete them, so they accumulate indefinitely (a topic also touched on in Part 48, Performance).
- **Naming collisions** — two unrelated components both using a generic class name like `.card` or `.title`, unintentionally styling each other.

CSS architecture is the set of conventions and structural practices that prevent these problems *before* they happen, rather than cleaning them up after the fact.

## Component-based CSS — the underlying philosophy

The core idea behind essentially every modern CSS architecture approach: **organize your stylesheet around reusable, self-contained UI components** (a button, a card, a nav, a modal) rather than around raw page structure or, worse, individual pages. A component's styles should, ideally, be genuinely **portable** — usable anywhere in the project, in any context, without unpredictable interference from (or interference *with*) unrelated styles elsewhere.

## Utility classes

```css
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-4 { gap: 1rem; }
.text-center { text-align: center; }
```

```html
<div class="flex items-center gap-4">
  <img src="avatar.jpg" alt="...">
  <p class="text-center">Username</p>
</div>
```

**Utility classes** are small, single-purpose classes, each controlling exactly one specific CSS property/value (or a very tightly-scoped combination), composed together directly in HTML via multiple classes on one element, rather than writing custom, one-off CSS rules for every new combination of styles. Popular utility-first frameworks (like Tailwind CSS, mentioned again in this course's final roadmap) are built entirely around this philosophy, generating a comprehensive, pre-defined set of these small utility classes.

**Trade-offs, stated honestly and without favoring one approach dogmatically:**
- ✅ Extremely fast to build with once the utility vocabulary is learned — no need to invent new class names or switch files between HTML and CSS.
- ✅ Naturally prevents CSS file growth/bloat over time, since you're reusing the same small set of utilities everywhere rather than writing new custom rules per component.
- ❌ HTML can become visually dense/cluttered with many classes per element.
- ❌ Less immediately "semantic" at the class-name level (a class like `.mt-2` describes *what it does*, not *what the element conceptually is*).

## BEM (Block, Element, Modifier)

```css
/* Block */
.card { }

/* Element (a part BELONGING TO the block) */
.card__title { }
.card__image { }

/* Modifier (a variation of the block or an element) */
.card--featured { }
.card__title--large { }
```

```html
<article class="card card--featured">
  <img class="card__image" src="..." alt="...">
  <h3 class="card__title card__title--large">Title</h3>
</article>
```

**BEM** is a strict, widely-known naming convention (not a build tool — pure CSS class naming discipline) built around three concepts:
- **Block** — a standalone, reusable component (`.card`).
- **Element** — a part that belongs to, and only makes sense within, a specific block, connected with a double underscore (`.card__title`).
- **Modifier** — a variation/state of a block or element, connected with a double hyphen (`.card--featured`).

**Trade-offs:**
- ✅ Extremely explicit and predictable — a class name alone tells you exactly what component it belongs to and its relationship to that component, at a glance, with zero ambiguity.
- ✅ Naturally low, flat specificity — BEM class names are (by convention) always used alone as single-class selectors, never nested/combined into more specific compound selectors, keeping the entire codebase's specificity uniformly low and easy to override predictably.
- ❌ Class names can become visibly long and verbose (`.product-card__price-label--discounted`).

## CUBE CSS — conceptual overview

**CUBE CSS** ("Composition, Utility, Block, Exception") is a more recent, more flexible methodology that deliberately **combines** ideas from utility classes and component-based/block thinking, rather than picking strictly one or the other:

- **Composition** — broad, layout-level structural styles (often implemented with utility-like classes for layout primitives — a "stack" for consistent vertical spacing, a "cluster" for wrapped horizontal grouping).
- **Utility** — small, single-purpose classes, similar in spirit to the utility-class approach above.
- **Block** — component-specific styles for things that are genuinely unique to one specific component (similar in spirit to BEM's "block" concept, though without BEM's strict naming syntax requirement).
- **Exception** — deliberate, explicitly-marked style overrides for specific states/contexts (often implemented via data attributes, like `[data-state="expanded"]`), kept clearly distinguishable from a component's base styling.

The core philosophy: rather than treating "utility classes vs. component classes" as an either/or decision, CUBE CSS argues most real UIs benefit from **both**, applied deliberately to the right layer of the problem — utilities for broadly-reusable spacing/layout primitives, blocks for genuinely component-specific styling that doesn't generalize well.

## ITCSS — conceptual overview

**ITCSS** ("Inverted Triangle CSS") is a methodology for organizing the **file structure and rule *ordering*** of a large CSS codebase (rather than a class-naming convention like BEM) — specifically designed to manage the cascade and specificity (Part 15) deliberately, at scale, across many files.

```text
ITCSS's layers, ordered from broadest/lowest-specificity to narrowest/highest-specificity:

  ▲  SETTINGS    → variables, config (no actual CSS output — just custom properties/tokens)
  │  TOOLS        → mixins/functions (if using a preprocessor — no direct CSS output either)
  │  GENERIC      → resets, normalize (Part 36) — very low specificity, broad reach
  │  ELEMENTS     → bare HTML element selectors (h1, p, a) — still low specificity
  │  OBJECTS      → layout patterns, structural class-based patterns, no visual "skin"
  │  COMPONENTS   → actual, specific UI components (buttons, cards, modals) — most of a
  │                  typical project's CSS lives here
  ▼  UTILITIES     → highest-specificity, highest-priority overrides (often using !important
                     deliberately, since utilities are meant to reliably win)
```

The "inverted triangle" shape represents both **specificity** and **explicitness/reach** increasing as you move down through the layers: early layers (Settings, Generic) affect broad swaths of the page with low specificity; later layers (Utilities) are narrow, explicit, single-purpose overrides that are *meant* to win the cascade reliably. Organizing file/import order this way means source order (recall Part 15's cascade tiebreaker) and specificity work *with* each other, rather than fighting unpredictably — later-loaded, more specific rules are deliberately meant to override earlier, broader ones, by design, not by accident.

## Choosing an approach — explicit trade-offs, no dogma

> 💡 **Tip** — This course deliberately does not mandate one single "correct" methodology, because there genuinely isn't one — the right choice depends on project size, team preferences, and the specific problem you're solving. What matters far more than *which* named methodology you pick is **consistency**: whichever approach (or thoughtful combination) you choose, apply it *consistently* throughout a given project. A codebase that mixes BEM in some files, ad-hoc utility classes in others, and deeply-nested overqualified selectors elsewhere, with no consistent rule, is worse than a codebase using *any single* approach consistently — even an imperfect one applied uniformly beats a "best" one applied inconsistently.

## Naming conventions and stylesheet organization — practical guidance

```text
A reasonable, common file organization pattern for a mid-sized project:

styles/
├── settings/          (custom properties: colors, spacing, typography scale)
│   └── tokens.css
├── base/               (resets, element defaults — Part 36)
│   └── reset.css
├── layout/             (page-level structural patterns — header, grid, containers)
│   └── layout.css
├── components/         (one file per genuinely reusable component)
│   ├── button.css
│   ├── card.css
│   └── modal.css
└── utilities/          (small, single-purpose utility classes)
    └── utilities.css
```

Practical naming guidance, regardless of which specific methodology you follow:
- Class names should describe **what something is** (`.card`, `.nav-link`) or **what it does** (`.is-active`, `.mt-4`), not incidental visual details that might change (`.red-box`, `.left-column` — if the box stops being red or moves to the right, the class name becomes actively misleading).
- Avoid deeply nested/overqualified selectors (`.page .content .sidebar .widget .title`) — recall Part 15's specificity guidance: flat, low-specificity, class-based selectors are dramatically easier to maintain and override predictably than deep selector chains.
- Keep one component's styles physically grouped together (whether in one file, or one clearly-delimited section of a larger file) rather than scattered across the codebase.

## Knowledge Check — Part 35

1. What specific, concrete problems tend to emerge in a large, unstructured CSS codebase with no organizing principle?
2. What is BEM's Block/Element/Modifier structure, and what specific problem does its naming syntax solve?
3. What's the core trade-off between a utility-class approach and a component-class (BEM-style) approach?
4. In ITCSS, why are Utilities intentionally the highest-specificity layer, loaded last?
5. Why does this course recommend consistency over any one "correct" methodology?

<details>
<summary>View solutions</summary>

1. Specificity creep (increasingly specific selectors/`!important` needed to override earlier rules over time), unclear ownership (uncertainty about which components a given class actually affects), dead/unused CSS accumulating because nobody is confident it's safe to delete, and naming collisions between unrelated components accidentally sharing a generic class name.
2. Block is a standalone reusable component; Element is a part that belongs specifically to a block (connected via `__`); Modifier is a variation/state of a block or element (connected via `--`). This naming syntax makes a class's relationship to its component explicit and unambiguous at a glance, and — by convention — keeps selectors flat/single-class, avoiding the specificity creep of deeply nested selectors.
3. Utility classes are fast to compose and naturally prevent CSS file bloat, but can make HTML visually dense with many classes per element and are less immediately "semantic" by class name alone. Component classes (BEM-style) keep HTML cleaner and class names more descriptive of what a component conceptually is, but can lead to more custom CSS being written overall, and more classes to invent/maintain as the component library grows.
4. Because utility classes are meant to be small, single-purpose, explicit overrides that reliably win the cascade regardless of what else has been applied to an element — placing them last in source order (and often at the highest specificity, sometimes deliberately using `!important`) ensures they consistently achieve that "always wins" behavior by design, rather than unpredictably losing to earlier, more specific component rules.
5. Because the specific problems CSS architecture solves (specificity creep, unclear ownership, unpredictable overrides) stem primarily from *inconsistency* — mixing different unstructured approaches throughout a codebase. Any single, clear approach applied uniformly is more maintainable than an inconsistent mix of several "best practice" approaches applied unevenly, since consistency is what actually makes a codebase predictable to navigate and extend.

</details>

---

# PART 36 — CSS Reset and Normalization

## Browser default styles

Recall Part 15's brief mention: every browser ships its own built-in default stylesheet (the "user-agent stylesheet") applied before any of your own CSS — this is why an unstyled `<h1>` still appears large and bold, an unstyled `<ul>` still has bullet points and left padding, and an unstyled `<button>` still looks like a native OS button. These defaults are genuinely useful as a baseline (a completely unstyled HTML page remains at least somewhat readable and usable) — but they're also **inconsistent across different browsers**, and rarely match what a real design actually calls for.

## Why a reset/normalization step is nearly universal in real projects

A **CSS reset** (or the gentler, related concept of **normalization**) is a small block of CSS, applied at the very start of a project's stylesheet, specifically designed to **neutralize** these inconsistent browser defaults — giving every project a clean, predictable, consistent starting point to build up from, rather than fighting against dozens of scattered browser-specific default assumptions throughout the rest of the stylesheet.

## A simple, modern reset, explained line by line

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}
```

Recall Part 18 in full: applies the `border-box` box-sizing model universally, so every `width`/`height` declaration in the entire project behaves predictably (content+padding+border together, rather than padding/border adding on top).

```css
* {
    margin: 0;
    padding: 0;
}
```

Removes every browser's own inconsistent default margins/paddings (headings, paragraphs, lists, and more all carry different default spacing across different browsers) — starting every element at zero spacing, so all spacing in the final design is *explicitly, deliberately* set by your own CSS, rather than inherited from an inconsistent, invisible browser default.

```css
html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
}
```

Prevents some mobile browsers from automatically, unpredictably resizing text in certain orientation-change scenarios — keeping text sizing fully under your own deliberate control.

```css
body {
    min-height: 100vh;
    line-height: 1.5;
}
```

Sets a sensible base `line-height` (recall Part 21's discussion of unitless line-height and its correct inheritance behavior) and ensures the body fills at least the full viewport height, a common baseline expectation for full-page layouts.

```css
img,
picture,
video,
canvas,
svg {
    display: block;
    max-width: 100%;
}
```

Recall Part 4/18: images (and similar replaced elements) default to `inline` display, which can introduce small, confusing gaps below them due to inline baseline alignment behavior — `display: block` removes this. `max-width: 100%` is the responsive-image safety net from Part 18, applied globally as a sensible default.

```css
input,
button,
textarea,
select {
    font: inherit;
}
```

The Part 34 form-control font-inheritance fix, applied globally and proactively from the very start of the project, rather than needing to remember it individually for every single form you build later.

```css
button {
    cursor: pointer;
    background: none;
    border: none;
}
```

Strips a `<button>`'s native default background/border styling, giving you a clean slate to apply your own button designs (recall Part 34's button styling) without needing to fight the browser's own default button chrome first.

```css
ul,
ol {
    list-style: none;
}
```

Removes default bullet points/numbers — appropriate specifically for lists being used as structural/navigational containers (recall Part 5's navigation-menu pattern, and Part 3/33's nav examples) rather than genuine, content-focused bulleted/numbered lists, where you'd deliberately *keep* the semantic list markers.

> ⚠️ **Common mistake** — Applying `list-style: none` globally to *every* `<ul>`/`<ol>` on a page, including ones containing genuine, reader-facing bulleted/numbered content (like a real recipe's ingredient list or numbered steps, from Part 5/7). Recall Part 12's accessibility note: removing list-style visually does *not* remove the semantic "list" meaning for a screen reader (which still correctly announces "list, N items" — a genuine, useful benefit of choosing `<ul>` semantically remains intact regardless of its visual bullet styling) — but visually stripping bullets from content where a sighted user *does* rely on them for scanning ("Step 1, Step 2...") is a real usability loss for sighted users specifically. Apply a global list-style reset thoughtfully, typically scoped to navigation-context lists specifically, rather than blindly resetting every list on the page.

## `normalize.css` — conceptual overview

**`normalize.css`** is a well-known, historically significant alternative philosophy to a hard reset: rather than *zeroing out* every browser default (as the reset above does), it instead makes cross-browser defaults **more consistent with each other**, while deliberately *preserving* sensible, genuinely useful native default styling wherever it already is reasonably consistent across browsers. The core philosophical difference: a hard reset says "remove everything, I'll add back exactly what I need"; normalization says "keep useful defaults, but fix the specific inconsistencies between browsers." Both approaches are valid, widely used in real production projects, and the modern, hand-rolled "simple modern reset" shown above is, itself, really a thoughtful blend of both philosophies — a common, pragmatic middle ground in contemporary professional practice.

## Exercises — Part 36

1. Explain, precisely, why `* { margin: 0; padding: 0; }` is a common first step in a CSS reset.
2. Why does resetting `img { display: block; }` matter, given that `<img>` is `inline` by default?
3. What's the core philosophical difference between a hard CSS reset and `normalize.css`-style normalization?
4. Why should `list-style: none` typically be scoped to navigation-context lists, rather than applied blindly to every `<ul>`/`<ol>` on a page?

<details>
<summary>View solutions</summary>

1. Because different browsers apply inconsistent default margins/padding to various elements (headings, lists, paragraphs, etc.) — zeroing everything out at the start gives every project a consistent, predictable baseline, so all actual spacing in the final design comes explicitly and deliberately from the project's own CSS, rather than from inconsistent, invisible browser defaults.
2. Because `<img>`'s default `inline` display can introduce small, confusing gaps beneath an image due to inline elements' baseline-alignment behavior with surrounding text — setting it to `display: block` removes this unexpected spacing.
3. A hard reset removes/zeroes out virtually all default browser styling, requiring you to explicitly re-add anything you actually want. Normalization instead preserves genuinely useful native defaults, while specifically fixing inconsistencies *between* different browsers' implementations of those defaults, rather than removing the defaults altogether.
4. Because visually removing bullet/number markers does not remove the underlying semantic "list" meaning for a screen reader (which is a genuine benefit worth preserving), but it does remove a real, useful visual scanning aid for sighted users on genuine reader-facing content (like real ingredient lists or numbered instructions) — appropriate for navigation menus (where the list structure is purely organizational, not content the user reads sequentially for its own sake), but not appropriate to apply blindly to every list regardless of its actual purpose.

</details>

---

# PART 37 — Modern CSS

This Part serves as a consolidated tour of several modern CSS features — some already covered in depth elsewhere in this course (referenced back to their full treatment), others introduced here for the first time. Browser compatibility is noted explicitly where genuinely relevant, following this course's commitment to distinguishing modern-recommended, legacy, and advanced-optional techniques (formalized fully in the Browser Compatibility section later in this course).

## Native CSS nesting

```css
.card {
    padding: 1rem;
    border: 1px solid #e5e7eb;

    & .card-title {
        font-size: 1.25rem;
        font-weight: 700;
    }

    &:hover {
        border-color: #4f46e5;
    }

    & .card-body {
        color: #4b5563;

        & p {
            margin-bottom: 0.5rem;
        }
    }
}
```

Modern CSS now supports **native nesting** directly in the browser, no preprocessor (like Sass) required — the `&` symbol represents "the parent selector," letting you write nested rules that compile, conceptually, to the same flattened selectors covered throughout Parts 14–15 (`.card .card-title`, `.card:hover`, etc.), but organized visually to mirror your HTML's actual nested structure. This genuinely reduces repetition and improves readability for deeply related, component-scoped rules — though it's worth a direct, honest caution:

> ⚠️ **Common mistake** — Nesting nothing new about the cascade or specificity rules from Part 15 — nested selectors still compute their specificity exactly as if you'd written them out flattened by hand (a nested `.card:hover` still has the same specificity as `.card:hover` written flat). Nesting purely changes *how the CSS is written/organized*, not how selector matching or the cascade fundamentally works. Also, deeply nesting many levels can reintroduce exactly the same "hard-to-override, overqualified selector" problems Part 15 and Part 35 warned against — nesting is a readability tool, not a license to build deep selector chains just because the syntax makes it easy to do so.

## `:is()`, `:where()`, `:has()` — revisited

Already covered in complete depth in Part 14 (syntax and matching behavior) and Part 15 (specificity implications, especially `:where()`'s unique zero-specificity behavior) — included here only as part of this Part's "modern CSS survey," confirming their place as genuinely essential, current, well-supported modern selectors.

## Logical properties — a preview

Briefly introduced here; covered in its own complete, dedicated Part next (Part 38), since it's substantial and important enough to deserve full standalone treatment.

## `aspect-ratio`

```css
.video-container {
    aspect-ratio: 16 / 9;
}
.square-thumbnail {
    aspect-ratio: 1 / 1;
}
```

Sets a **preferred width-to-height ratio** for an element — if only one dimension is explicitly set (or the element's size is otherwise determined by its container), the browser calculates the other dimension automatically to maintain that ratio. This is covered in full depth, with practical image/video examples, in Part 39.

## `object-fit` and `object-position`

Covered in full depth in Part 39, immediately following this Part — included here only as part of this survey.

## `accent-color`

Already introduced in Part 34's form-styling coverage — recolors native checkbox/radio/range/progress control appearances to match a brand color, with minimal code and no need to fully rebuild a control's native behavior from scratch.

## `color-scheme`

```css
:root {
    color-scheme: light dark;
}
```

Declares which color scheme(s) an element/page supports, letting the *browser itself* automatically adjust certain native UI elements it controls (scrollbar colors, default form control chrome, text selection highlighting) to match — genuinely useful groundwork for a complete dark-mode implementation, covered again with full working code in Part 43.

## `scroll-behavior`

```css
html {
    scroll-behavior: smooth;
}
```

Makes browser-native scrolling (triggered by clicking an anchor link to an in-page `#fragment`, recall Part 3) animate smoothly to its destination, rather than jumping instantly — a simple, one-line, JavaScript-free scroll-animation enhancement.

> ♿ **Accessibility note** — Like any motion (recall Part 32), `scroll-behavior: smooth` should respect `prefers-reduced-motion`:
> ```css
> @media (prefers-reduced-motion: reduce) {
>     html { scroll-behavior: auto; }
> }
> ```

## `scroll-snap`

```css
.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
}
.carousel-item {
    flex-shrink: 0;
    width: 100%;
    scroll-snap-align: start;
}
```

Creates a **native, JavaScript-free "snapping" scroll experience** — as a user scrolls (via touch swipe, trackpad, or scrollbar drag) through `.carousel`, the browser automatically settles/aligns on each `.carousel-item`'s defined snap point, rather than allowing an arbitrary mid-item stopping position — the mechanism behind countless native-feeling image carousels, story viewers, and horizontally-scrolling card rows built with zero JavaScript.

- **`scroll-snap-type`** (on the container) — `x`/`y`/`both` (which axis snaps), plus `mandatory` (always snaps to the nearest point when scrolling stops) or `proximity` (snaps only if already reasonably close to a snap point).
- **`scroll-snap-align`** (on each child) — where within the child the snap point sits: `start`, `center`, or `end`.

## `text-wrap`

```css
h1, h2, h3 {
    text-wrap: balance;
}
```

`text-wrap: balance` is a genuinely elegant modern typography feature: it tells the browser to distribute a block of wrapped text's line lengths as **evenly as possible**, specifically to avoid the common, slightly awkward look of a heading wrapping to two lines where the second line is just one short, orphaned word. (Best suited to short blocks of text like headings, since the browser's balancing calculation has a practical length limit for performance reasons — not intended for long-form body paragraphs.)

```text
Without text-wrap: balance          With text-wrap: balance
┌─────────────────────────┐        ┌─────────────────────────┐
│ The Complete Guide to     │        │   The Complete Guide      │
│ Modern Web Design          │        │      to Modern Web         │
│ Techniques                 │        │        Design Techniques   │
└─────────────────────────┘        └─────────────────────────┘
(uneven, "orphaned" last line)      (visually balanced line lengths)
```

## Subgrid

```css
.parent-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}
.child-item {
    display: grid;
    grid-column: span 2;
    grid-template-columns: subgrid; /* inherits the PARENT's actual column tracks,
                                        rather than defining its own independent
                                        set of columns */
}
```

Recall Part 25's Grid coverage: normally, a nested `display: grid` element defines its own entirely independent grid, with no direct relationship to its parent grid's specific track sizes. `subgrid` changes this — a grid item that is itself a grid container can **inherit its parent's actual track definitions** directly, letting nested content align precisely to the outer grid's lines, rather than only approximately matching them by coincidence. This solves a genuine, previously-difficult problem: aligning content *within* a grid item (like a card's internal title/body/footer) to the *same* column/row lines as its siblings' internal content, even when each card's own internal content has different amounts of text.

## Container queries — revisited

Covered in complete, dedicated depth in Part 27 — included here only as part of this survey, confirming its place among genuinely modern, current CSS capabilities.

## Cascade layers — revisited

Covered in complete, dedicated depth in Part 15 — included here only as part of this survey.

## Custom properties — revisited

Covered in complete, dedicated depth in Part 29 — included here only as part of this survey.

## Exercises — Part 37

1. Rewrite this flattened CSS using native nesting:
   ```css
   .nav { display: flex; }
   .nav a { color: black; }
   .nav a:hover { color: blue; }
   ```
2. Does nesting change a selector's computed specificity compared to writing it flat? Explain.
3. Write CSS that gives a video container a consistent 16:9 aspect ratio.
4. Write CSS enabling native smooth scrolling for anchor links, while still respecting `prefers-reduced-motion`.
5. In your own words, explain what problem `subgrid` solves that a normal independently-nested `display: grid` cannot.

<details>
<summary>View solutions</summary>

**1.**
```css
.nav {
    display: flex;

    & a {
        color: black;

        &:hover {
            color: blue;
        }
    }
}
```

**2.** No — nesting is purely a syntactic/organizational convenience. A nested selector computes to exactly the same specificity as if it had been written out flat by hand; nesting changes how the CSS is authored and read, not how selector matching or specificity calculation works.

**3.**
```css
.video-container { aspect-ratio: 16 / 9; }
```

**4.**
```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
}
```

**5.** A normal nested `display: grid` element defines its own entirely independent set of grid tracks, with no relationship to its parent grid's specific track sizes/positions — content inside it cannot precisely align to the outer grid's lines except by coincidence. `subgrid` lets a nested grid container inherit its parent's actual track definitions directly, so its own children can align precisely to the same grid lines as the rest of the outer grid, solving the common problem of aligning internal content (like a card's title/body/footer) consistently across sibling grid items with varying amounts of content.

</details>

---

# PART 38 — Logical Properties

## What logical properties are, and why they exist

### The problem with physical properties

Every spacing/sizing property covered so far in this course — `margin-left`, `padding-top`, `width`, `border-right` — is a **physical property**: it refers to a fixed, literal screen direction (left, right, top, bottom), regardless of the page's actual reading direction or writing mode.

This works perfectly fine for **left-to-right (LTR)** languages like English — but the web is genuinely, globally multilingual, and many languages (Arabic, Hebrew, and others) are written **right-to-left (RTL)**. A layout hardcoded with `margin-left` for spacing before a piece of text will, when the page is switched to an RTL language/direction, have that spacing on the visually *wrong* side — the "before the text" spacing needs to flip to the *right* side in an RTL context, but a physical `margin-left` declaration has no awareness of this at all; it stays stubbornly on the left regardless.

### The solution: logical properties

**Logical properties** describe spacing/sizing **relative to the text's actual flow direction**, rather than a fixed physical screen direction — automatically adapting correctly regardless of whether the page's writing mode is LTR, RTL, or even top-to-bottom (used by some vertical scripts).

## The core terminology: block and inline

```text
In a standard LEFT-TO-RIGHT, TOP-TO-BOTTOM writing mode (like English):

INLINE direction = the direction text flows WITHIN a line → horizontal (left to right)
BLOCK direction   = the direction new lines/blocks stack   → vertical (top to bottom)

┌─────────────────────────────────────┐
│ ──────────── INLINE ────────────▶    │  ← text flows this way within a line
│                                        │
│  BLOCK                                 │
│    │                                   │
│    ▼   (new paragraphs/blocks stack    │
│         downward)                       │
└─────────────────────────────────────┘
```

- **Inline** corresponds to the direction text flows *within* a single line — horizontal in English, but this would rotate for a vertical writing mode.
- **Block** corresponds to the direction new lines/blocks stack — vertical in English.

## The logical property vocabulary

```css
.box {
    margin-inline: 1rem;      /* equivalent to margin-left + margin-right, in LTR */
    margin-block: 2rem;       /* equivalent to margin-top + margin-bottom, in LTR */

    padding-inline: 1rem;     /* equivalent to padding-left + padding-right, in LTR */
    padding-block: 0.5rem;    /* equivalent to padding-top + padding-bottom, in LTR */

    inset-inline: 0;          /* equivalent to left + right, in LTR */
    inset-block: 0;           /* equivalent to top + bottom, in LTR */

    inline-size: 300px;       /* equivalent to width, in a standard horizontal writing mode */
    block-size: 200px;        /* equivalent to height, in a standard horizontal writing mode */
}
```

You can also target a **single side**, using `-start`/`-end` suffixes (rather than physical `-left`/`-right`/`-top`/`-bottom`):

```css
.box {
    margin-inline-start: 1rem; /* equivalent to margin-left in LTR, margin-RIGHT in RTL */
    padding-block-end: 0.5rem; /* equivalent to padding-bottom in a standard top-to-bottom mode */
}
```

| Physical property | Logical equivalent (in standard LTR/horizontal mode) |
|---|---|
| `width` | `inline-size` |
| `height` | `block-size` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `margin-top` | `margin-block-start` |
| `margin-bottom` | `margin-block-end` |
| `margin-left` + `margin-right` | `margin-inline` (shorthand for both at once) |
| `margin-top` + `margin-bottom` | `margin-block` (shorthand for both at once) |
| `padding-*` | (identical pattern to margin, above) |
| `top`/`right`/`bottom`/`left` | `inset-block-start`/`inset-inline-end`/`inset-block-end`/`inset-inline-start` |
| `border-left` | `border-inline-start` |

## Practical example: why this matters concretely

```css
/* Physical properties — breaks visually in an RTL context */
.quote {
    border-left: 3px solid #4f46e5;
    padding-left: 1rem;
}

/* Logical properties — automatically correct in BOTH LTR and RTL contexts */
.quote {
    border-inline-start: 3px solid #4f46e5;
    padding-inline-start: 1rem;
}
```

```html
<blockquote class="quote" dir="ltr">A quote in English.</blockquote>
<blockquote class="quote" dir="rtl">اقتباس باللغة العربية</blockquote>
```

With the **physical** version, the decorative accent border stays stubbornly on the left in *both* examples above — visually wrong for the RTL quote, where the accent should conventionally appear on the right (the "start" side in RTL reading order). With the **logical** version, the exact same CSS automatically produces the visually correct result in both cases, because `border-inline-start` and `padding-inline-start` are defined relative to each element's own actual reading direction (recall the `dir` attribute briefly touched on with `lang` in Part 1), not a fixed physical side.

> 💡 **Tip** — Even for projects that will genuinely never need RTL/multilingual support, many professional teams have increasingly adopted logical properties as their **default habit** for margin/padding/sizing, simply because the syntax is just as easy to write and read as the physical equivalent, while keeping the door open for painless future internationalization — with zero cost today for that future-proofing. This course, from this Part forward in the remaining sections, will generally continue using whichever form (physical or logical) is clearest for the specific teaching point at hand, but professional awareness of logical properties as the increasingly-preferred modern default is genuinely valuable, current knowledge.

## Exercises — Part 38

1. Convert this physical CSS to its logical-property equivalent: `margin-top: 1rem; margin-bottom: 1rem; padding-left: 2rem;`
2. Explain, with a concrete example, why a hardcoded `margin-left` can produce visually incorrect results in a right-to-left language context.
3. What's the logical-property equivalent of `width: 100%;`?
4. Write a single logical shorthand property that sets both left and right padding (in a standard LTR context) to `1.5rem`.

<details>
<summary>View solutions</summary>

**1.**
```css
.element {
    margin-block: 1rem;
    padding-inline-start: 2rem;
}
```

**2.** Because `margin-left` always refers to the literal, fixed physical left side of the screen, regardless of the page's actual text direction. In a right-to-left language, the conceptually equivalent spacing ("before" the content, in reading order) should visually appear on the right side — but a hardcoded `margin-left` stays on the left regardless, producing spacing on the visually wrong side relative to the RTL reading flow.

**3.** `inline-size: 100%;`

**4.**
```css
.element { padding-inline: 1.5rem; }
```

</details>

---

# PART 39 — Images and Object Fit

## The problem: images don't naturally fit arbitrary container shapes

An `<img>`'s natural aspect ratio is fixed by its source file. Placing that image into a container with a *different* aspect ratio (a square avatar slot, a wide banner slot) naturally causes either distortion (if you just force `width`/`height` to the container's shape, stretching/squashing the image) or overflow (if you don't). `object-fit` and `object-position` solve this cleanly, without needing to pre-crop image files manually for every possible container shape.

## `object-fit`

```css
.thumbnail {
    width: 200px;
    height: 200px;
    object-fit: cover;
}
```

```text
object-fit: fill (the default, if unset)     object-fit: contain
+──────────────────+                          +──────────────────+
│//////STRETCHED///│                          │   [empty space]    │
│//distorted to////│                          │//// full image ///│
│////fill exactly///│                          │//// visible, no ///│
│//////////////////│                          │//// distortion ////│
+──────────────────+                          │   [empty space]    │
(image is forced to fill the box              +──────────────────+
 exactly, distorting its aspect               (entire image fits within the
 ratio if it doesn't match)                    box, no cropping, but may leave
                                                empty space on 2 sides if aspect
                                                ratios don't match)

object-fit: cover                             object-fit: none
+──────────────────+                          +──────────────────+
│//////////////////│                          │  actual size, │
│// CROPPED to fill │                          │  positioned    │
│// completely, no ///│                          │  per object-   │
│// distortion //////│                          │  position,      │
│//////////////////│                          │  cropped if     │
+──────────────────+                          │  larger than box│
(fills the box completely,                    +──────────────────+
 cropping excess — NO distortion,             (image displayed at its actual
 unlike "fill")                                natural size, ignoring the box
                                                entirely except for cropping)
```

- **`fill`** (the default) — stretches/squashes the image to exactly fill the box, ignoring its natural aspect ratio, causing visible distortion whenever the box's aspect ratio doesn't match the image's.
- **`contain`** — scales the image to fit entirely within the box with no cropping and no distortion, potentially leaving empty space on two sides.
- **`cover`** — scales the image to completely fill the box with no distortion, cropping whatever doesn't fit (this is, by a wide margin, the most commonly used value for photo thumbnails, avatars, and card images).
- **`none`** — displays the image at its actual natural size, entirely ignoring the box's dimensions (cropped by the box if larger than it).

This is directly analogous to `background-size: cover`/`contain` from Part 22 — the same underlying concept, applied to actual `<img>` elements rather than CSS background images.

## `object-position`

```css
.portrait-thumbnail {
    object-fit: cover;
    object-position: top; /* anchor the crop toward the top of the image,
                              e.g. to keep a person's face in frame rather
                              than cropping from dead-center */
}
```

Just as `background-position` (Part 22) controls which part of a background image stays visible/anchored when it's being scaled/cropped, `object-position` does the same for an `<img>` under `object-fit: cover`/`none` — controlling which part of the image is prioritized to remain visible when cropping occurs. Accepts the same keyword (`top`, `center`, `bottom left`, etc.) or explicit percentage/length syntax as `background-position`.

## `aspect-ratio`

```css
.video-embed {
    width: 100%;
    aspect-ratio: 16 / 9;
}
```

Already introduced in Part 37's modern-CSS survey — worth its full, dedicated treatment here in genuine practical image/video context. `aspect-ratio` sets a **preferred proportional relationship** between an element's width and height — commonly used together with `object-fit: cover` on an inner `<img>`/`<video>`, giving you precise, consistent control over both the container's overall shape *and* how its content fills that shape without distortion.

```css
.card-thumbnail-container {
    aspect-ratio: 4 / 3;
    overflow: hidden;
}
.card-thumbnail-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

This exact pattern — a container with a fixed `aspect-ratio`, containing an `<img>` set to `width: 100%; height: 100%; object-fit: cover;` — is the modern, standard way to build **consistently-shaped image cards/thumbnails** regardless of each individual source image's actual native dimensions, a pattern you'll use constantly in real card-grid and gallery layouts (and directly in this course's own capstone project).

## Building card thumbnails and hero images

### Card thumbnails (consistent shape, regardless of source image dimensions)

```css
.product-card-image {
    aspect-ratio: 1 / 1; /* perfectly square, regardless of the source photo's shape */
    object-fit: cover;
    width: 100%;
    border-radius: 8px 8px 0 0;
}
```

### Hero image (full-bleed, responsive, consistent crop point)

```css
.hero-image {
    width: 100%;
    aspect-ratio: 21 / 9; /* a wide, cinematic banner ratio */
    object-fit: cover;
    object-position: center 30%; /* keeps the upper-middle portion in frame,
                                     a common adjustment for hero photos where
                                     the most important visual content sits
                                     slightly above dead-center */
}
```

### Avatar (perfect circle, cropped correctly regardless of source photo shape)

```css
.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}
```

## Exercises — Part 39

1. Write CSS to make an image fill its 300×200px container completely, cropping as needed, with no distortion.
2. Explain, precisely, the visual difference between `object-fit: contain` and `object-fit: cover` in terms of what happens to the image's edges/aspect ratio.
3. Write CSS for a consistently-square product thumbnail, regardless of each individual source photo's actual dimensions, using `aspect-ratio` and `object-fit` together.
4. A cropped headshot photo is cutting off the top of people's heads. Which property would you adjust, and how?

<details>
<summary>View solutions</summary>

**1.**
```css
img { width: 300px; height: 200px; object-fit: cover; }
```

**2.** `object-fit: contain` scales the image so the entire image is visible within the box with no cropping and no distortion, which can leave empty space on two sides if the aspect ratios don't match. `object-fit: cover` scales the image to completely fill the box with no distortion, but crops whatever part of the image doesn't fit — guaranteeing no empty gaps, at the cost of potentially cutting off part of the image.

**3.**
```css
.thumbnail {
    aspect-ratio: 1 / 1;
    object-fit: cover;
    width: 100%;
}
```

**4.** `object-position` — specifically adjusting it toward `top` (e.g., `object-position: top;` or a more precise `object-position: center 20%;`) to shift which part of the image stays anchored/visible when `object-fit: cover` crops it, keeping the top of the frame (where the head is) in view rather than cropping from dead-center.

</details>

---

# PART 40 — Overflow and Scrolling

## `overflow` — revisited in complete depth

Recall Part 18's introduction of `overflow: visible/hidden/scroll/auto` — this Part extends that foundation into fuller, more practical territory.

```css
.container {
    overflow-x: hidden; /* never scrolls horizontally */
    overflow-y: auto;   /* scrolls vertically ONLY if content overflows */
}
```

`overflow-x`/`overflow-y` let you control each axis **independently** — a very common real-world pattern: a container that should never scroll horizontally (preventing unwanted sideways layout shift) but should scroll vertically once its content grows beyond a fixed height.

## `overflow: clip`

```css
.container {
    overflow: clip;
}
```

A newer addition to the `overflow` value set: `clip` behaves similarly to `hidden` (content beyond the box is not rendered/visible) but is explicitly defined to **never** create a scrollable area at all, under any circumstance — not even via keyboard/programmatic scrolling, which `hidden` technically still permits in certain edge cases. For purely decorative clipping where you want an absolute guarantee that no scrolling mechanism of any kind can ever reveal the clipped content, `clip` is the more precise, explicit tool.

## Custom scroll areas — built carefully

```css
.scrollable-panel {
    max-height: 400px;
    overflow-y: auto;
}
```

Creating a deliberately scrollable sub-region within a page (rather than letting the whole page scroll) is a common, legitimate pattern (a chat message list, a long dropdown menu, a code block) — but it comes with genuine, important usability caveats worth stating explicitly:

> ⚠️ **Common mistake** — Creating "nested scroll" situations without care — a scrollable inner panel placed inside a page that *also* scrolls can create a confusing experience where a user's mouse-wheel/trackpad scroll gesture gets unpredictably "captured" by the inner panel instead of the outer page (or vice versa), especially once the inner panel reaches its own scroll limit. This is a genuine, common source of user frustration on real websites. There's no single universal fix in pure CSS (it often benefits from careful JavaScript-driven scroll-boundary handling, outside this course's scope) — but being *aware* of the problem, and using nested scroll regions only when genuinely necessary (rather than as a default layout convenience), is itself valuable, practical guidance.

> ♿ **Accessibility note** — A scrollable region should generally be reachable and operable via keyboard too, not just mouse/touch — a `<div>` with `overflow: auto` and enough content to actually scroll is, by default, keyboard-focusable and scrollable with arrow keys in most browsers once it receives focus, but verifying this actually works as expected (and adding `tabindex="0"` if it doesn't reliably receive focus on its own) is worth explicitly checking, connecting back to Part 12's focus principles.

## Scroll snapping — revisited

Covered in full depth already in Part 37 (`scroll-snap-type`, `scroll-snap-align`) — included here as part of this Part's complete overflow/scrolling coverage for reference completeness. The essential pattern, once more, for a horizontally-snapping card carousel:

```css
.carousel {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 1rem; /* room for a visible scrollbar, if the browser shows one */
}
.carousel-item {
    flex-shrink: 0;
    width: 280px;
    scroll-snap-align: start;
}
```

## Exercises — Part 40

1. Write CSS for a container that never scrolls horizontally but scrolls vertically once its content exceeds 500px in height.
2. Explain the precise difference between `overflow: hidden` and `overflow: clip`.
3. What real usability problem can arise from nesting a scrollable panel inside an already-scrollable page, and why doesn't pure CSS fully solve it?

<details>
<summary>View solutions</summary>

**1.**
```css
.container {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 500px;
}
```

**2.** Both visually clip content beyond the box's boundary. `overflow: hidden` still technically permits scrolling to reveal that clipped content in certain edge cases (e.g., programmatically, or via specific keyboard/assistive-technology interactions). `overflow: clip` is explicitly defined to never create any scrollable area at all, under any circumstance — a stricter, more absolute guarantee that clipped content can never be revealed through any scrolling mechanism.

**3.** A user's scroll gesture (mouse wheel/trackpad) can get unpredictably "captured" by the inner scrollable panel instead of the outer page, especially once the inner panel reaches its own scroll limit — creating a confusing, frustrating experience where the user expects the outer page to keep scrolling but it doesn't (or vice versa). Pure CSS has no built-in mechanism to intelligently hand off scroll capture between nested scroll containers based on reaching a boundary — that kind of nuanced behavior generally requires JavaScript-driven scroll-boundary detection, outside CSS's own capabilities.

</details>

---

# PART 41 — Modals, Dropdowns, and Overlays

## Structural and stacking requirements for overlay UI

Modals, dropdowns, tooltips, and side drawers all share a common structural challenge: they need to visually render **above** the rest of the page's content, often with a **backdrop** dimming/blocking interaction with everything beneath them, and they need to handle **stacking context** correctly (recall Part 20's full stacking-context treatment) to avoid the classic "z-index isn't working" trap.

## Modal

```html
<div class="modal-backdrop">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">Confirm Action</h2>
    <p>Are you sure you want to proceed?</p>
    <button type="button">Cancel</button>
    <button type="button">Confirm</button>
  </div>
</div>
```

```css
.modal-backdrop {
    position: fixed;
    inset: 0; /* the Part 20 shorthand: stretches to fill the entire viewport */
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.modal {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

- **`aria-modal="true"`** and **`role="dialog"`** communicate to assistive technology that this is a modal dialog specifically — content that has captured focus and represents a distinct, temporary interaction context, separate from the rest of the page.
- **`aria-labelledby`** provides the dialog's accessible name by referencing its own visible heading — the exact `aria-labelledby` pattern from Part 12, applied here in a realistic, complete context.

> ♿ **Accessibility note** — A truly accessible modal requires more than the CSS/HTML structure shown here — it also needs **focus trapping** (keeping keyboard Tab navigation contained within the modal while it's open, so a user can't accidentally Tab to content hidden behind the backdrop) and **returning focus** to whatever triggered the modal once it closes. Both of these are JavaScript behaviors, outside this course's HTML/CSS scope — but understanding that they're a *required* part of a genuinely accessible modal (not optional polish) is important context, even though implementing them isn't covered here. Part 42's native `<dialog>` element, covered next, handles a meaningful portion of this focus-management burden natively, which is a significant part of its real-world value.

## Dropdown

```html
<div class="dropdown">
  <button type="button" aria-expanded="false" aria-controls="dropdown-panel">Options</button>
  <ul class="dropdown-panel" id="dropdown-panel" hidden>
    <li><a href="/edit">Edit</a></li>
    <li><a href="/duplicate">Duplicate</a></li>
    <li><a href="/delete">Delete</a></li>
  </ul>
</div>
```

```css
.dropdown {
    position: relative; /* establishes the containing block — recall Part 20 */
}
.dropdown-panel {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 160px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 10;
}
```

This is, precisely, the exact same pattern already introduced in Part 33's dropdown-submenu coverage — repeated here for this Part's complete overlay-pattern reference.

## Tooltip

```html
<button type="button" aria-describedby="tooltip-1">Hover me</button>
<span role="tooltip" id="tooltip-1" class="tooltip">Additional context here</span>
```

```css
.tooltip {
    position: absolute;
    /* positioning logic (often computed dynamically by JS relative to the
       trigger element in real implementations) */
    background: #1f2937;
    color: white;
    font-size: 0.8rem;
    padding: 0.375rem 0.625rem;
    border-radius: 4px;
    z-index: 20;
}
```

`aria-describedby` (recall its full introduction in Part 12) connects the tooltip's content to the button as *supplementary* descriptive information, and `role="tooltip"` gives the panel itself the correct semantic role.

## Side drawer

```css
.drawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 320px;
    background: white;
    box-shadow: -8px 0 24px rgba(0, 0, 0, 0.15);
    transform: translateX(100%); /* off-screen by default */
    transition: transform 0.3s ease;
    z-index: 100;
}
.drawer.is-open {
    transform: translateX(0); /* slides into view — recall Part 30/31's
                                  transform-based transition pattern */
}
```

## Context menu

```css
.context-menu {
    position: fixed; /* positioned dynamically, typically via JS, at the
                         cursor's right-click location */
    background: white;
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    padding: 0.375rem;
    z-index: 1000;
}
```

## Stacking contexts and z-index problems — revisited in this practical context

Recall Part 20's exhaustive stacking-context treatment — overlay UI is precisely where this knowledge becomes most practically essential. A common, real-world scenario worth walking through explicitly: a modal's `z-index: 1000` mysteriously renders *behind* some other page element with a much lower `z-index`, because that other element's *ancestor* happens to establish its own stacking context with a higher priority than the modal's ancestor chain — exactly the trapped-stacking-context scenario diagrammed in full in Part 20. The practical fix in overlay UI specifically is very often to render the modal/overlay as a **direct child of `<body>`** (a technique sometimes called "portaling," though implementing the actual DOM-reparenting typically requires JavaScript, outside this course's scope) — sidestepping any potentially-problematic ancestor stacking contexts entirely by not being nested inside them in the first place.

## Exercises — Part 41

1. Write the CSS needed to center a modal both horizontally and vertically over a full-viewport, semi-transparent backdrop.
2. What do `role="dialog"` and `aria-modal="true"` communicate to assistive technology?
3. Why does a dropdown panel need `position: relative` on its immediate parent to position correctly?
4. Explain, in your own words, why "portaling" a modal to be a direct child of `<body>` can help avoid z-index/stacking-context problems.

<details>
<summary>View solutions</summary>

**1.**
```css
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
```

**2.** They communicate that this element is a modal dialog — a distinct, temporary interaction context that has effectively captured the page's focus, separate from the rest of the underlying page content, which assistive technology should treat as the current primary focus of interaction while it's open.

**3.** Because an absolutely-positioned element's offsets (`top`, `left`, etc.) are calculated relative to its nearest ancestor with a non-static `position` value (its containing block, per Part 20) — without `position: relative` on the immediate parent, the dropdown panel's absolute positioning would fall back to being relative to the entire viewport/page instead, rather than positioning correctly right below its specific trigger button.

**4.** Because a modal nested deep inside the page's normal DOM structure can be trapped inside a lower-priority stacking context established by some ancestor element (via `position` + `z-index`, `opacity`, `transform`, etc., as covered in Part 20) — no `z-index` value on the modal itself, however large, can escape that ancestor's own position in the stacking order. Making the modal a direct child of `<body>` removes it from any such problematic ancestor stacking contexts entirely, since it no longer has those ancestors at all.

</details>

---

# PART 42 — HTML `<dialog>` and Popover

## `<dialog>` — native modal functionality

### What it is

`<dialog>` is a native HTML element specifically designed to represent modal (and non-modal) dialog boxes — bringing meaningful built-in behavior that the manually-constructed modal pattern from Part 41 has to painstakingly recreate.

```html
<dialog id="confirm-dialog">
  <h2>Confirm Action</h2>
  <p>Are you sure you want to proceed?</p>
  <form method="dialog">
    <button value="cancel">Cancel</button>
    <button value="confirm">Confirm</button>
  </form>
</dialog>
```

```css
dialog {
    border: none;
    border-radius: 12px;
    padding: 2rem;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
}
```

### What `<dialog>` provides natively, for free

- A `<dialog>` is **hidden by default** and only becomes visible when explicitly opened (via JavaScript's `.show()` or `.showModal()` methods — the *triggering* of opening/closing a dialog requires JavaScript, outside this course's scope, but the resulting native behavior once opened is worth understanding).
- `.showModal()` specifically opens it as a genuine **modal**: the browser automatically applies **focus trapping** (keyboard Tab navigation is natively contained within the dialog — exactly the accessibility requirement flagged as a manual burden in Part 41) and renders a native **`::backdrop`** pseudo-element behind it, stylable directly with CSS as shown above.
- Pressing the **Escape key** natively closes a `<dialog>` opened via `.showModal()`, with zero extra code required — a keyboard-accessibility expectation that would otherwise need to be manually implemented.
- A `<form method="dialog">` inside a `<dialog>` automatically closes the dialog on submission, without needing a page reload or explicit JavaScript close-handling — the button's `value` attribute becomes available as the dialog's `returnValue`, letting you determine which button the user clicked (in JavaScript, again outside this course's direct scope, but worth knowing this native mechanism exists).

> 💡 **Tip** — This is a genuinely significant real-world advantage: recall Part 41's explicit note that a truly accessible manually-built modal requires JavaScript-implemented focus trapping and Escape-key handling as essential, non-optional requirements. `<dialog>` provides a substantial portion of that correct behavior **natively, for free, built into the browser itself** — a strong, professional argument for reaching for native `<dialog>` over a fully custom-built modal implementation whenever a standard modal dialog is what you actually need.

## The Popover API

### What it is

The **Popover API** provides native, general-purpose show/hide behavior for **any** element — not specifically a dialog, but any transient UI (a dropdown menu, a tooltip, a notification toast) that should overlay other page content.

```html
<button popovertarget="my-popover">Open menu</button>

<div id="my-popover" popover>
  <p>Popover content here.</p>
</div>
```

```css
[popover] {
    border: none;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

The `popover` attribute on any element makes it a **popover** — hidden by default, and (like `<dialog>`) automatically rendered in the browser's **top layer** (a special, guaranteed-topmost rendering layer that exists conceptually above the entire regular page stacking-context hierarchy — recall Part 20's stacking context discussion; the top layer sidesteps that entire problem space by design, since it's not part of the normal document stacking order at all). The `popovertarget` attribute on a `<button>` creates an automatic, **zero-JavaScript** toggle relationship — clicking the button shows/hides the referenced popover natively, with no scripting required at all for this basic toggle behavior.

### Native behaviors popovers provide for free

- Clicking **anywhere outside** an open popover automatically closes it ("light dismiss") — a common, expected UI behavior that would otherwise require manually-written outside-click-detection JavaScript.
- Pressing **Escape** closes an open popover.
- Rendered in the top layer, entirely sidestepping the z-index/stacking-context problems from Parts 20 and 41.

> 💡 **Tip** — The Popover API and `<dialog>` overlap conceptually but serve different primary purposes: `<dialog>` (especially via `.showModal()`) is purpose-built specifically for genuine **modal dialogs** requiring full focus-trapping. The Popover API is a more general-purpose tool for **any** lighter-weight transient overlay UI (dropdowns, tooltips, menus) that wants native top-layer rendering and light-dismiss behavior, without necessarily needing full modal focus-trapping. Both represent a significant, genuinely valuable shift toward native browser support for interaction patterns that, for years, required substantial custom JavaScript and careful manual accessibility work to get right.

## Accessibility implications

> ♿ **Accessibility note** — Both `<dialog>` and the Popover API represent real, meaningful accessibility wins specifically *because* they shift substantial, easy-to-get-wrong accessibility burden (focus trapping, Escape-key handling, correct top-layer stacking, light-dismiss behavior) from custom, manually-written JavaScript into browser-native, standards-tested behavior. This doesn't mean *zero* accessibility work remains — correct accessible naming (recall `aria-labelledby` from Part 12/41), sensible focus placement when a dialog opens, and thoughtful content structure inside the dialog/popover are still the developer's responsibility — but the hardest, most error-prone pieces are now handled natively, which is a genuine, substantial improvement over the fully-manual Part 41 approach for many real-world use cases.

## Exercises — Part 42

1. What two things happen automatically, for free, when a `<dialog>` is opened via `.showModal()`, that a manually-built `position: fixed` modal does not get automatically?
2. Write the minimal HTML needed to create a button that toggles a popover open/closed, with zero JavaScript.
3. What is the "top layer," and why does it help sidestep z-index/stacking-context problems?
4. What does "light dismiss" mean in the context of the Popover API?

<details>
<summary>View solutions</summary>

1. Any two of: automatic focus trapping (keyboard Tab navigation contained within the dialog), a native `::backdrop` behind it, and closing automatically on the Escape key press — none of which a manually-built `position: fixed` modal gets without explicitly-written JavaScript for each one.

2.
```html
<button popovertarget="menu">Open</button>
<div id="menu" popover>Menu content</div>
```

3. The top layer is a special, guaranteed-topmost rendering layer that exists conceptually above the entire regular page's stacking-context hierarchy — elements rendered there (like `<dialog>` and popovers) are not part of the normal document stacking order at all, so they can't get trapped inside a lower-priority ancestor stacking context the way a regular `z-index`-based element can (as covered in Part 20).

4. "Light dismiss" refers to the native behavior where clicking anywhere outside an open popover automatically closes it, without needing any custom-written outside-click-detection JavaScript.

</details>

---

# PART 43 — Dark Mode

## Building a complete theme system

This Part directly combines Part 29 (Custom Properties) and Part 26's `prefers-color-scheme` media feature into one complete, working implementation — exactly the "complete theme system" promised back in Part 29.

## Step 1: define both themes as custom properties

```css
:root {
    --bg: #ffffff;
    --text: #1a1a1a;
    --surface: #f9fafb;
    --border: #e5e7eb;
    --primary: #4f46e5;

    color-scheme: light dark; /* recall Part 37 — lets the browser adjust its
                                  own native UI (scrollbars, form controls) too */
}

[data-theme="dark"] {
    --bg: #0f172a;
    --text: #e2e8f0;
    --surface: #1e293b;
    --border: #334155;
    --primary: #818cf8;
}
```

```css
body {
    background: var(--bg);
    color: var(--text);
}
.card {
    background: var(--surface);
    border: 1px solid var(--border);
}
.button-primary {
    background: var(--primary);
}
```

Every visual property throughout the entire stylesheet references these custom properties, never a hardcoded color value directly — exactly the Part 29 design-token discipline. Because `[data-theme="dark"]` **redefines** the same variable names within its own scope (recall Part 29's local-override mechanism), simply toggling a `data-theme="dark"` attribute onto `<html>` (typically done with a small amount of JavaScript in response to a theme-toggle button click, outside this course's direct scope, though the mechanism this toggle relies on is pure CSS) instantly re-themes the **entire page**, everywhere those variables are used, with zero changes needed to any individual component's own CSS.

## Step 2: respecting the user's OS-level preference automatically

```css
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --bg: #0f172a;
        --text: #e2e8f0;
        --surface: #1e293b;
        --border: #334155;
        --primary: #818cf8;
    }
}
```

This is the specific, deliberate pattern that makes a theme system genuinely respectful of user preference, layering two mechanisms together correctly:

1. If the user's OS is set to dark mode, **and** they haven't explicitly overridden the theme with a manual `data-theme="light"` (via an in-page toggle), the page automatically adopts dark theme values.
2. If the user *has* explicitly chosen a theme manually (via a toggle setting `data-theme="dark"` or `data-theme="light"` directly on `<html>`), that **explicit choice always wins**, regardless of the OS-level preference — the `:not([data-theme="light"])` guard specifically prevents the automatic OS-based dark-mode rule from fighting against a user's own deliberate, explicit light-mode selection.

> 💡 **Tip** — This three-tier priority — explicit user choice (highest priority) → OS-level preference (fallback, if no explicit choice made) → light mode (ultimate default) — is the standard, professional, respectful approach to theme systems. A site that *only* respects OS preference with no manual override option removes user agency; a site that *ignores* OS preference and defaults purely to light mode with no auto-detection at all misses an easy, genuinely appreciated usability win. The layered approach shown here gets both right simultaneously.

## Complete example

```css
:root {
    --bg: #ffffff;
    --text: #1a1a1a;
    --surface: #f9fafb;
    --border: #e5e7eb;
    --primary: #4f46e5;
    color-scheme: light dark;
}

[data-theme="dark"] {
    --bg: #0f172a;
    --text: #e2e8f0;
    --surface: #1e293b;
    --border: #334155;
    --primary: #818cf8;
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --bg: #0f172a;
        --text: #e2e8f0;
        --surface: #1e293b;
        --border: #334155;
        --primary: #818cf8;
    }
}

body {
    background: var(--bg);
    color: var(--text);
    transition: background 0.2s ease, color 0.2s ease;
}
```

The `transition` on `body`, transitioning `background` and `color` smoothly, is a small but genuinely polished, common finishing touch — making the theme switch itself feel like a smooth, deliberate transformation rather than a jarring instant flash.

## Exercises — Part 43

1. Explain, precisely, the priority order between an explicit manual theme choice and the OS-level `prefers-color-scheme` preference in a well-built theme system, and why that order matters.
2. Write CSS that redefines `--surface` and `--text` for a dark theme, scoped to `[data-theme="dark"]`.
3. What does `color-scheme: light dark;` on `:root` provide, beyond your own custom-property-driven theming?
4. Why does using CSS custom properties (rather than hardcoded color values scattered throughout the stylesheet) make implementing dark mode dramatically simpler?

<details>
<summary>View solutions</summary>

1. An explicit manual choice (via an in-page toggle) should always take priority over the OS-level preference, which serves only as a sensible fallback/default when no explicit choice has been made. This order matters because it respects user agency — a user who has deliberately chosen light mode within the site itself shouldn't have that choice silently overridden just because their OS happens to be set to dark mode; the site should remember and honor their specific, deliberate in-app choice.

2. ```css
   [data-theme="dark"] {
       --surface: #1e293b;
       --text: #e2e8f0;
   }
   ```

3. It lets the browser automatically adjust certain **native UI elements it controls directly** — like scrollbar colors, default form control appearances, and text selection highlighting — to match the declared color scheme(s), complementing (but not replacing) your own custom-property-driven theming of the page's actual content.

4. Because every component's styling references the custom properties (`var(--bg)`, `var(--text)`, etc.) rather than hardcoded values, switching themes only requires redefining those variable values once, in one scoped location (like `[data-theme="dark"]`) — every single place in the entire stylesheet that references those variables automatically picks up the new values immediately, with zero changes needed to any individual component's own CSS rules.

</details>

---

# PART 44 — Component Design

## Building reusable UI components with HTML/CSS

This Part is a practical, hands-on gallery, pulling together nearly every technique taught so far in this course into a complete library of genuinely reusable, production-quality UI components — each with multiple variants, following the CSS architecture discipline established in Part 35.

## Button (with variants)

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary" disabled>Disabled</button>
```

```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
}
.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
.btn-secondary { background: transparent; border-color: var(--border); color: var(--text); }
.btn-danger { background: #dc2626; color: white; }
.btn-sm { padding: 0.375rem 0.875rem; font-size: 0.875rem; }
```

## Card

```html
<article class="card">
  <img src="thumb.jpg" alt="..." class="card-image">
  <div class="card-body">
    <h3 class="card-title">Card Title</h3>
    <p class="card-text">Supporting description text.</p>
  </div>
</article>
```

```css
.card {
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
}
.card-image {
    aspect-ratio: 16 / 9;
    object-fit: cover;
    width: 100%;
}
.card-body {
    padding: 1.25rem;
}
```

## Badge

```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
```

```css
.badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}
.badge-success { background: #dcfce7; color: #166534; }
.badge-warning { background: #fef3c7; color: #92400e; }
```

## Alert

```html
<div class="alert alert-error" role="alert">
  <strong>Error:</strong> Something went wrong. Please try again.
</div>
```

```css
.alert {
    padding: 1rem 1.25rem;
    border-radius: 8px;
    border-left: 4px solid;
}
.alert-error {
    background: #fef2f2;
    border-color: #dc2626;
    color: #991b1b;
}
```

`role="alert"` (recall Part 12's ARIA vocabulary) marks this as content that should be announced to screen reader users immediately upon appearing, without requiring the user to navigate to it manually — appropriate specifically for genuinely important, time-sensitive feedback.

## Input

```css
.input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: inherit;
}
.input:focus { outline: none; }
.input:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}
```

## Modal, navbar, table — revisited

Already fully covered with complete code in Parts 41 (modal), 33 (navbar), and 6 (table structure) — not repeated verbatim here, but understood as part of this Part's complete component gallery.

## Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Settings sections">
    <button role="tab" aria-selected="true" aria-controls="panel-general" id="tab-general">General</button>
    <button role="tab" aria-selected="false" aria-controls="panel-privacy" id="tab-privacy" tabindex="-1">Privacy</button>
  </div>
  <div role="tabpanel" id="panel-general" aria-labelledby="tab-general">
    <p>General settings content.</p>
  </div>
  <div role="tabpanel" id="panel-privacy" aria-labelledby="tab-privacy" hidden>
    <p>Privacy settings content.</p>
  </div>
</div>
```

```css
[role="tablist"] {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border);
}
[role="tab"] {
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
}
[role="tab"][aria-selected="true"] {
    border-bottom-color: var(--primary);
    font-weight: 600;
}
```

This full ARIA tab pattern (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`) is a genuinely standard, well-established accessible-pattern structure — worth this dedicated attention because a tabs component is *the* canonical example where custom interactive behavior (not a native HTML element) genuinely requires ARIA roles to communicate its structure and state correctly, directly connecting back to Part 12's "use ARIA when native HTML doesn't provide the needed semantics."

## Accordion

```html
<div class="accordion-item">
  <h3>
    <button type="button" aria-expanded="false" aria-controls="accordion-panel-1" class="accordion-trigger">
      What is your return policy?
    </button>
  </h3>
  <div id="accordion-panel-1" class="accordion-panel" hidden>
    <p>Items can be returned within 30 days of purchase.</p>
  </div>
</div>
```

```css
.accordion-trigger {
    width: 100%;
    text-align: left;
    padding: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
}
.accordion-panel {
    padding: 0 1rem 1rem;
}
```

## Breadcrumbs

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Wireless Headphones</li>
  </ol>
</nav>
```

```css
.breadcrumb {
    display: flex;
    gap: 0.5rem;
    list-style: none;
}
.breadcrumb li:not(:last-child)::after {
    content: "/";
    margin-left: 0.5rem;
    color: var(--border);
}
```

`aria-current="page"` marks the current page within a set of navigational items — a semantically meaningful way to indicate "you are here" beyond purely visual styling, recognized directly by assistive technology.

## Pagination

```html
<nav aria-label="Pagination">
  <ul class="pagination">
    <li><a href="?page=1" aria-label="Previous page">←</a></li>
    <li><a href="?page=1" aria-current="page">1</a></li>
    <li><a href="?page=2">2</a></li>
    <li><a href="?page=3">3</a></li>
    <li><a href="?page=2" aria-label="Next page">→</a></li>
  </ul>
</nav>
```

```css
.pagination {
    display: flex;
    gap: 0.25rem;
    list-style: none;
}
.pagination a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.25rem;
    height: 2.25rem;
    border-radius: 6px;
    text-decoration: none;
}
.pagination a[aria-current="page"] {
    background: var(--primary);
    color: white;
}
```

## Product card

```html
<article class="product-card">
  <div class="product-card-image-wrap">
    <img src="product.jpg" alt="Wireless over-ear headphones in matte black" class="product-card-image">
    <span class="badge badge-warning product-card-badge">Sale</span>
  </div>
  <div class="card-body">
    <h3 class="card-title">Wireless Headphones</h3>
    <p class="product-card-price">
      <span class="price-original">$129.99</span>
      <span class="price-sale">$89.99</span>
    </p>
    <button class="btn btn-primary">Add to Cart</button>
  </div>
</article>
```

```css
.product-card-image-wrap {
    position: relative; /* containing block for the badge — Part 20 */
}
.product-card-image {
    aspect-ratio: 1 / 1;
    object-fit: cover;
    width: 100%;
}
.product-card-badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
}
.price-original {
    text-decoration: line-through;
    color: var(--text-muted);
}
.price-sale {
    color: #dc2626;
    font-weight: 700;
}
```

## Knowledge Check — Part 44

1. Why does the accordion trigger button need `aria-expanded`, and how should its value change?
2. What's the purpose of `role="tablist"`/`role="tab"`/`role="tabpanel"` together, and why is this a case where ARIA is genuinely necessary (recall the Part 12 golden rule)?
3. Why does `aria-current="page"` communicate something beyond what visual styling alone (like a different background color) provides?
4. In the product card, why is `position: relative` needed on `.product-card-image-wrap` specifically?

<details>
<summary>View solutions</summary>

1. `aria-expanded` communicates the accordion panel's current open/closed state to assistive technology, since a sighted user can see whether the panel is visually expanded but a screen reader user needs that state announced explicitly. It should toggle between `"true"` (panel currently open/visible) and `"false"` (panel currently collapsed/hidden), updated whenever the panel's visibility changes.
2. Together, they communicate that this is a tab interface — a set of panels where only one is shown at a time, selected via the tab controls — which has no native HTML element of its own. This is exactly the case the Part 12 golden rule anticipates: native HTML has no built-in "tabs" element, so ARIA roles are genuinely necessary here to convey this custom widget's structure and behavior to assistive technology, since there's no equivalent native element to reach for instead.
3. Visual styling alone (like a highlighted background) conveys "current page" only to sighted users looking directly at it. `aria-current="page"` is a semantic, machine-readable signal that assistive technology can announce explicitly ("current page"), giving non-visual users the same "you are here" information that sighted users get for free from the visual styling.
4. Because the badge inside it uses `position: absolute`, and absolutely-positioned elements are positioned relative to their nearest ancestor with a non-static `position` value (Part 20's containing block concept) — without `position: relative` on `.product-card-image-wrap`, the badge would position itself relative to some other, likely unintended ancestor (or the whole viewport) instead of sitting correctly within the image area specifically.

</details>

---

# PART 45 — Design System Fundamentals

## What a design system is, at the CSS level

A **design system**, at its core CSS-technical level, is a structured, centrally-defined set of **design tokens** — the smallest, most fundamental visual decisions (specific colors, specific spacing values, specific font sizes) — used consistently as the single source of truth throughout an entire product, rather than each component/page inventing its own slightly-different values ad hoc. Everything covered in Part 29 (Custom Properties) is the direct technical foundation this Part builds on.

## Design tokens

```css
:root {
    /* Color tokens */
    --color-primary-500: #4f46e5;
    --color-primary-600: #4338ca;
    --color-gray-50: #f9fafb;
    --color-gray-900: #111827;

    /* Spacing tokens */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;

    /* Typography tokens */
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.5rem;
    --font-size-2xl: 2rem;

    /* Radius tokens */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-full: 9999px;

    /* Shadow tokens */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Spacing scale — why a defined scale matters

> 💡 **Tip** — Rather than using arbitrary spacing values throughout a project (`13px` here, `18px` there, `22px` somewhere else — each individually reasonable-looking in isolation, but collectively inconsistent), a **spacing scale** defines a small, deliberate, limited set of allowed values (as shown above, `--space-1` through `--space-8`, following a consistent progression) that every component draws from exclusively. This constraint is a genuine *feature*, not a limitation: it produces a visually consistent, harmonious rhythm throughout the entire product, and it makes spacing decisions faster (choosing from 6-8 defined options is easier and more consistent than inventing a new value every time), while still leaving enough range to cover virtually every real spacing need.

## Typography scale

```css
:root {
    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-base: 1rem;      /* 16px */
    --font-size-lg: 1.125rem;    /* 18px */
    --font-size-xl: 1.5rem;      /* 24px */
    --font-size-2xl: 2rem;       /* 32px */
    --font-size-3xl: 2.5rem;     /* 40px */
}
```

Similarly, a defined typography scale — rather than arbitrary one-off font-sizes — ensures every heading level and text size throughout a product draws from the same limited, deliberately-chosen set of sizes, producing consistent visual hierarchy across every single page and component.

## Colors as a system, not isolated values

```css
:root {
    --color-primary-50:  #eef2ff;
    --color-primary-100: #e0e7ff;
    --color-primary-500: #4f46e5;
    --color-primary-600: #4338ca;
    --color-primary-900: #312e81;
}
```

Professional design systems typically define each core color as a full **scale/ramp** of related shades (often numbered, like `50` for the lightest tint through `900` for the darkest shade) rather than just one single fixed value — giving components access to appropriately lighter/darker variants of the same base hue for things like hover states, subtle backgrounds, or borders, all while staying visually coherent as clearly related members of the same color family (recall Part 16's HSL discussion — adjusting only the Lightness value while holding Hue/Saturation constant is a common, effective way to generate exactly this kind of coherent shade ramp).

## Component states as part of the system

```css
:root {
    --state-hover-opacity: 0.9;
    --state-disabled-opacity: 0.5;
    --state-focus-ring: 0 0 0 3px var(--color-primary-100);
}
```

A mature design system extends beyond static visual tokens to also define **consistent interaction-state behavior** — how *every* interactive component should visually respond to hover, focus, and disabled states — ensuring a button, a link, and a custom dropdown all feel like they belong to the same coherent system, rather than each component's states being designed independently and inconsistently.

## Consistency as the core value

> 💡 **Tip** — The entire practical point of everything in this Part is **consistency at scale**. A single developer building a single small page can often get away with ad hoc, one-off values without much visible harm. The moment a product grows to many pages, many components, and (realistically) many different developers touching the codebase over time, an undisciplined approach reliably degrades into visual inconsistency — slightly different blues, slightly different spacing, slightly different border-radii scattered unpredictably throughout. A defined, centrally-referenced token system (built on Part 29's custom properties) is the direct, practical technical mechanism that prevents this degradation, and it's genuinely one of the highest-leverage investments a growing frontend codebase can make.

## Exercises — Part 45

1. Explain, in your own words, why a defined spacing scale (a small set of allowed values) tends to produce better results than allowing arbitrary spacing values everywhere.
2. Write a small typography-scale token set (at least 4 sizes) as CSS custom properties.
3. Why might a design system define a full ramp of shades for a color (like `--color-primary-100` through `--color-primary-900`) rather than just one single primary color value?
4. What specific, concrete problem does a design token system solve as a codebase and team grow larger?

<details>
<summary>View solutions</summary>

1. A defined, limited spacing scale constrains spacing decisions to a small, deliberately-chosen, consistent set of values, producing a visually harmonious rhythm throughout an entire product. Arbitrary, unconstrained spacing values tend to accumulate small, inconsistent differences over time (13px here, 18px there) that individually seem harmless but collectively make the product feel visually inconsistent and less polished.

2. ```css
   :root {
       --font-size-sm: 0.875rem;
       --font-size-base: 1rem;
       --font-size-lg: 1.25rem;
       --font-size-xl: 2rem;
   }
   ```

3. Because components frequently need related, coherent variants of the same base color — a lighter tint for a subtle background or hover state, a darker shade for text on a light background or an active/pressed state — and defining a full ramp upfront ensures those variants are deliberately chosen and visually coherent with each other, rather than developers inventing ad hoc lighter/darker variants independently, which risks producing colors that don't actually look like they belong to the same family.

4. It prevents visual inconsistency from accumulating as more pages, components, and developers touch the codebase over time — without a centrally-defined, consistently-referenced set of tokens, different developers (or the same developer at different times) tend to introduce slightly different one-off values for what should be the same design decision, gradually degrading visual consistency across the product.

</details>

---

# PART 46 — Common Layout Patterns

This Part is a practical reference gallery of the most common, recurring page-layout patterns in real-world frontend work — each shown with both a Flexbox and (where genuinely applicable) a Grid implementation, tying together nearly everything taught in Parts 18–25 and 37–39.

## Centered container

```css
.container {
    width: min(100% - 2rem, 1200px);
    margin-inline: auto;
}
```

The near-universal pattern for constraining page content to a comfortable maximum width while remaining fluid and centered on wider screens — combining Part 28's `min()`, Part 17's units, and Part 38's logical `margin-inline` shorthand.

## Full-width hero

```css
.hero {
    width: 100%;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    text-align: center;
}
```

## Split layout (two-column, side by side)

```css
.split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}
@media (max-width: 767px) {
    .split {
        grid-template-columns: 1fr; /* stacks on mobile */
    }
}
```

## Sidebar/content layout

```css
.layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 2rem;
}
@media (max-width: 900px) {
    .layout {
        grid-template-columns: 1fr;
    }
}
```

## Dashboard layout

Already covered in full, complete code in Part 25's Grid section — the canonical `grid-template-areas`-based dashboard pattern (sidebar, topbar, main content).

## Holy grail layout

```css
.holy-grail {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header header"
        "nav    main   aside"
        "footer footer footer";
    min-height: 100vh;
}
.hg-header { grid-area: header; }
.hg-nav    { grid-area: nav; }
.hg-main   { grid-area: main; }
.hg-aside  { grid-area: aside; }
.hg-footer { grid-area: footer; }
```

The **"holy grail" layout** is a classic, historically-significant name for this specific five-region pattern (header, left nav, main content, right sidebar, footer) — named for how notoriously difficult it was to achieve reliably with older, pre-Flexbox/Grid CSS techniques (hence "holy grail" — long sought, historically elusive). With modern `grid-template-areas` (Part 25), it's now a genuinely straightforward pattern, worth knowing both for its practical utility and its name's historical context.

## Card grid

Already covered extensively in Parts 24, 25, and 39 — the `repeat(auto-fit, minmax(...))` pattern remains the canonical modern solution.

## Sticky footer

```css
body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
main {
    flex: 1; /* consumes all leftover vertical space, pushing the footer down */
}
```

This exact three-line pattern — the entire `<body>` as a column flex container with `main { flex: 1; }` — is the modern, minimal solution to a classic layout problem: a footer that sits at the bottom of the viewport on short pages (rather than floating awkwardly partway up the screen), while still being pushed further down naturally by genuinely long content on longer pages, with zero JavaScript and no fixed-height calculations required.

## Media object

Already covered with complete code in Part 24's Flexbox section — the fixed-size avatar/icon plus flexible text-content pattern.

## Masonry alternatives

```css
.masonry-grid {
    columns: 3 250px; /* CSS multi-column layout: creates 3 columns,
                          each roughly 250px, item flow determined by
                          content height, not a strict row-based grid */
    column-gap: 1rem;
}
.masonry-grid > * {
    break-inside: avoid; /* prevents a single card from being awkwardly
                             split across two columns — this exact property
                             is covered again in full depth in Part 51 (Print CSS) */
    margin-bottom: 1rem;
}
```

> 💡 **Tip** — True "masonry" layout (items of varying heights packed tightly into columns, like a Pinterest-style board, with no awkward gaps) does not yet have a single, universally-supported, purpose-built CSS solution (an experimental `grid-template-rows: masonry` value exists in some browsers, but isn't yet universal). The CSS **multi-column** (`columns`) property shown above is the most common, currently-practical approximation — genuinely different from Grid/Flexbox in its underlying model (content flows down each column first, rather than across rows), but it produces a visually similar, tightly-packed masonry-like result for many real use cases.

## Exercises — Part 46

1. Write CSS for a page container that's fluid up to a maximum of 1140px, centered, with a consistent 1.5rem side gutter, using `min()`.
2. Build the "sticky footer" pattern using Flexbox, explaining precisely why `flex: 1` on `<main>` is what makes it work.
3. Using `grid-template-areas`, build a "holy grail" layout with header, left nav, main, right aside, and footer regions.
4. Why is true CSS masonry layout still commonly approximated with the `columns` property rather than a dedicated masonry feature?

<details>
<summary>View solutions</summary>

**1.**
```css
.container {
    width: min(100% - 3rem, 1140px);
    margin-inline: auto;
}
```

**2.**
```css
body { display: flex; flex-direction: column; min-height: 100vh; }
main { flex: 1; }
```
`flex: 1` on `<main>` (recall Part 24's exhaustive `flex: 1` treatment) means it grows to consume all available leftover vertical space within the column-direction flex container (`body`, with `min-height: 100vh`) — so on a short page, `<main>` stretches to fill the remaining space, pushing the footer down to the very bottom of the viewport; on a genuinely long page, `<main>`'s content naturally pushes `body` taller than the viewport, and the footer still sits correctly right after it, at the true end of the content.

**3.**
```css
.holy-grail {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header header"
        "nav main aside"
        "footer footer footer";
    min-height: 100vh;
}
```

**4.** Because a dedicated, purpose-built, universally-supported native CSS masonry layout mechanism does not yet exist in all major browsers (some experimental support exists, but it isn't yet a safe, universal default) — the `columns` multi-column property, while conceptually different (content flows down each column rather than across rows), is currently the most practical, broadly-supported way to approximate a similar tightly-packed, varying-height visual result.

</details>

---

# PART 47 — Debugging HTML and CSS

This is one of the most important, most practically valuable sections in the entire course, and a designated special-focus area. Every technique taught in Parts 1–46 will, at some point, produce an unexpected result — the real skill that separates a fluent developer from a struggling one is not "never making mistakes," it's **debugging efficiently and systematically** rather than guessing randomly. This Part teaches *reasoning*, not memorization — a structured process you can apply to any bug, including ones this course never specifically anticipated.

## The general debugging mindset

> 💡 **Tip** — Before diagnosing any specific bug category below, internalize this general process, which applies to virtually every CSS/HTML problem you'll ever encounter: **(1) Isolate** — narrow down exactly which element and which property is behaving unexpectedly, ideally with DevTools open on that exact element. **(2) Inspect** — look at what's actually happening (computed styles, box model, DOM structure) rather than what you *assume* is happening. **(3) Hypothesize** — form a specific, testable theory about the cause, grounded in the mechanics taught in this course (cascade, box model, flow, etc.) — not a random guess. **(4) Test** — verify your hypothesis, ideally by making a small, temporary change directly in DevTools first, before editing your actual source files. **(5) Fix at the root cause** — once confirmed, apply the real fix in your source code, understanding *why* it works, not just that it happens to work.

## Invalid HTML and incorrect nesting

Recall Part 1's proper-nesting rules. Invalid/malformed HTML doesn't always produce an obvious error — browsers are forgiving parsers (recall Part 0), which means broken nesting can silently produce a DOM structure that doesn't match what you actually wrote, with confusing downstream CSS/layout consequences.

```html
<!-- Broken: p cannot contain a div (block-level content inside a text-only element) -->
<p>
  Some text
  <div class="callout">A callout box</div>
</p>
```

**How to inspect it:** Open DevTools' Elements panel and look at the *actual* rendered DOM tree, not your source file — the browser may have silently restructured this (commonly, closing the `<p>` early, before the `<div>`, then leaving trailing content outside it) in a way that doesn't match your original nesting intent at all, which explains CSS selectors or layout behaving unexpectedly relative to what you assumed the structure was.

## Selector not matching

```css
/* Intended to style all card titles, but nothing happens */
.card-title { color: navy; }
```

```html
<div class="card">
  <h3 class="cardTitle">Title</h3> <!-- camelCase, but the CSS selector uses a hyphen -->
</div>
```

**Likely cause:** a typo, a case mismatch (`.cardTitle` in HTML vs. `.card-title` in CSS — recall Part 14's class selector syntax, which is case-sensitive), or a genuine structural mismatch between what the selector describes and the actual DOM.

**How to inspect it:** select the target element in DevTools' Elements panel and check the Styles pane (recall Part 15's full debugging workflow) — if your rule doesn't appear listed *at all* (not even struck-through), the selector simply isn't matching this element; if it *does* appear but struck through, that's a different problem (specificity/override, covered next), not a matching problem.

## Overridden CSS / specificity problems

Recall Part 15 in full depth. This remains one of the single most common categories of "why isn't my style applying" confusion, so it's worth restating the diagnostic workflow explicitly, in this dedicated debugging context:

```text
Debugging workflow for "my style should apply, but doesn't visually show":

1. Select the element in DevTools
2. Look at the Styles pane
3. Find your rule — is it listed with a STRIKETHROUGH?
   → YES: something else is winning the cascade. Find what's NOT struck through
           for that same property, and compare specificity/source order/origin
           against your rule (Part 15's full priority chain).
   → NOT LISTED AT ALL: your selector isn't matching this element — go back to
           the "selector not matching" diagnosis above instead.
```

## Wrong display mode

```css
.nav-link {
    width: 120px; /* has no visible effect */
}
```

**Likely cause:** recall Part 19 — `<a>` is `display: inline` by default, and inline elements ignore `width`/`height` entirely. **Fix:** `display: inline-block` or `display: block`.

**How to inspect it:** DevTools' Computed panel (or the Styles pane) will show the element's actual current `display` value — if it's `inline` and you're trying to set width/height, that's your answer immediately.

## Margin collapse

```css
.section { margin-bottom: 40px; }
.section + .section { margin-top: 20px; }
/* expecting 60px total gap between sections, but visually seeing only 40px */
```

**Likely cause:** recall Part 18's full margin-collapsing explanation — adjacent vertical margins collapse to the *larger* of the two, not their sum. **How to inspect it:** DevTools' box model diagram (in the Computed/Layout panel, covered fully below) visually shows each side's margin value for the selected element — but recall margin collapsing is a relationship *between* two elements' margins, so you may need to compare the box model of both adjacent elements to spot it. **Fix:** use `gap` on a Flexbox/Grid parent instead of margins between siblings (Part 18's tip — collapsing doesn't occur in flex/grid contexts), or intentionally rely on the collapsed behavior rather than fighting it.

## Overflow issues

```css
.card {
    width: 100%;
    padding: 40px;
}
```

> ⚠️ **"Why is this overflowing?"** — Recall Part 18's `box-sizing` explanation in full: with the default `content-box` model, `width: 100%` sets the *content* area to 100% of the parent, and then `padding: 40px` (80px total, both sides) is added *on top of* that — pushing the element's true total width beyond its parent's, causing overflow. **Fix:** apply the universal `box-sizing: border-box` reset from Part 18/36, which makes `width: 100%` describe the *total* box (content+padding+border combined), so padding no longer pushes the element wider than its stated width.

## Flex item shrinking/overflow unexpectedly

```css
.container { display: flex; }
.child { width: 500px; }
```

> ⚠️ **"Why is this child shrinking?"** — Recall Part 24's `flex-shrink` explanation: flex items have `flex-shrink: 1` by default, meaning they **will** shrink below their stated `width` if the flex container doesn't have enough total space to fit every item at its full stated size — this is deliberate, default Flexbox behavior, not a bug, and it can surprise developers coming from normal block-flow expectations where `width` is normally a hard, reliable size. **Fix:** if the item genuinely should never shrink below 500px, explicitly set `flex-shrink: 0;` on it.

## Grid overflow

```css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
.grid-item {
    /* contains a long, unbreakable string, e.g. a long URL */
}
```

**Likely cause:** analogous to Flexbox's `min-width: auto` default trap (Part 24) — Grid items also have an implicit default minimum size based on their content, which can cause a track to grow wider than intended to accommodate unbreakable content, potentially overflowing the overall grid. **Fix:** `min-width: 0;` on the grid item (same fix as the Flexbox case), and/or `overflow-wrap: break-word;` (Part 21) on the actual text content.

## Absolute-position issues

**Likely cause:** recall Part 20's exhaustive containing-block explanation — an absolutely-positioned element with no `position: relative` (or similar) ancestor falls back to positioning relative to the *entire viewport*, not the intended nearby parent. **How to inspect it:** in DevTools, walk up the element's ancestor chain checking each one's computed `position` value — the containing block is the nearest ancestor where `position` is anything other than `static`.

## `z-index` not working / stacking contexts

Recall Part 20's complete stacking-context treatment — the diagnostic workflow, restated for this debugging context: **check every ancestor of both competing elements for anything that establishes a new stacking context** (`position` + `z-index`, `opacity < 1`, `transform`, `filter`, `will-change`, and the other triggers listed in Part 20). Many modern browsers' DevTools can visualize the stacking-context tree directly (often in a dedicated panel or overlay) — using that tool directly, rather than guessing, is dramatically faster than manually walking the ancestor chain by hand once you know it exists.

## Sticky positioning not working

**Common causes:**
- A missing explicit offset (`top`, `bottom`, etc. — `position: sticky` alone, with no offset value, has no defined "stick point" and won't visibly stick).
- An ancestor with `overflow: hidden`, `overflow: auto`, or `overflow: scroll` — recall that sticky positioning is scoped *within* its nearest scrolling ancestor; if some ancestor between the sticky element and the actual scrolling viewport has its own overflow/scroll behavior, the sticky element may stick relative to *that* ancestor's bounds rather than the whole page, or in some cases fail to stick at all depending on the exact structure.
- The sticky element's parent container being *exactly* the same height as the sticky element itself — recall Part 20: sticky elements release once their *parent's* boundary scrolls past the stick point; if the parent has no extra height beyond the sticky child, there's no room for it to ever visibly "stick" before immediately releasing.

## `100vw` scrollbar issues

> ⚠️ A commonly-encountered, genuinely surprising bug: setting `width: 100vw` on an element can cause unwanted horizontal overflow/a horizontal scrollbar to appear on the whole page. **Why this happens:** recall Part 17 — `100vw` is 100% of the *entire viewport width*, **including** the width taken up by the browser's own vertical scrollbar (if one is currently visible) — but the page's normal `<body>`/content width is typically calculated *excluding* that scrollbar's width. This mismatch means a `100vw`-wide element can be very slightly wider than the visible content area, triggering an additional, unwanted horizontal scrollbar. **Fix:** prefer `width: 100%;` (relative to the parent, which correctly excludes the scrollbar) over `100vw` wherever the intent is simply "fill the parent," reserving `100vw` specifically for the rarer cases where you genuinely need the true, full physical viewport width regardless of scrollbar presence.

## Mobile viewport problems

Recall Part 1's viewport meta tag and Part 17's `100vh`-on-mobile problem in full — both belong in this debugging reference as common, real-world mobile-specific issues: a missing viewport meta tag breaks responsive layout entirely on mobile (Part 1), and `100vh` can visibly overflow behind mobile browser UI chrome, fixed by modern `dvh`/`svh` units (Part 17).

## Browser DevTools — the complete debugging toolkit

Recall Part 0's initial introduction — here is the complete, dedicated tour, now that you have the CSS knowledge to use every panel meaningfully.

### Element inspector

Click any element on the live page to jump directly to its node in the Elements/Inspector panel — the fastest way to go from "this specific thing on screen looks wrong" to "here's its exact HTML and associated CSS."

### Styles pane

Shows every CSS rule matching the selected element, in cascade priority order, with overridden (losing) declarations shown struck-through — the primary tool for diagnosing specificity/cascade issues (Part 15), and the very first place to look whenever a style "isn't applying."

### Computed panel

Shows the single, final, fully-resolved value for every CSS property on the selected element, after the entire cascade has been resolved — useful for confirming *exactly* what value an element actually ended up with, especially for inherited properties or shorthand properties where the Styles pane's raw declarations might not make the final resolved value immediately obvious.

### Box model panel

A visual diagram (directly mirroring the Part 18 box-model diagram you learned) showing the selected element's actual content/padding/border/margin sizes, with real numbers — the fastest way to confirm exactly what's contributing to an element's unexpected total size, especially useful for diagnosing `box-sizing` confusion and margin-collapse scenarios.

### Layout tools: Flexbox and Grid overlays

Most modern browsers' DevTools include dedicated visual overlay tools specifically for Flexbox and Grid containers — clicking a small badge/icon next to `display: flex` or `display: grid` in the Styles pane overlays the actual, live main-axis/cross-axis lines (Flexbox) or grid line numbers/track boundaries (Grid) directly on the rendered page. This is an enormously valuable tool for building the exact spatial intuition Parts 24–25 aimed to teach — actually *seeing* where grid lines fall, or which direction the main axis currently runs, on your real, live layout.

### Responsive design mode

A dedicated DevTools mode that lets you resize the simulated viewport freely (or select preset device dimensions) directly within the browser, without needing a physical device — essential for the exact mobile-first, breakpoint-discovery workflow described in Part 26 ("resize your browser and watch where your own design actually breaks").

## Debugging Exercises — Part 47

For each broken example below, diagnose the cause using the reasoning process from this Part — don't just memorize the answer, understand *why*.

1.
```css
.card {
    width: 100%;
    padding: 40px;
    border: 2px solid black;
}
```
This card visibly overflows its parent container. Why?

2.
```css
.parent {
    position: relative;
    z-index: 1;
}
.parent .badge {
    z-index: 9999;
}
.other-element {
    position: relative;
    z-index: 2;
}
```
`.badge` renders behind `.other-element`, despite its much higher `z-index`. Why?

3.
```css
.container { display: flex; }
.sidebar { width: 250px; }
.content { flex: 1; }
```
The `.sidebar` is visibly narrower than 250px on a small screen. Why?

4.
```css
.hero { height: 100%; }
```
The hero section has zero visible height. Why?

<details>
<summary>View solutions</summary>

**1.** With the default `box-sizing: content-box`, `width: 100%` sets only the *content* area to the parent's full width, and the `padding: 40px` (80px total) plus `border: 2px` (4px total) are then added *on top of* that 100% width — pushing the total rendered width beyond the parent's boundary. Fix: apply `box-sizing: border-box`, which makes `width: 100%` describe the total box including padding/border.

**2.** `.parent` establishes its own stacking context (via `position: relative` + `z-index: 1`). `.badge`'s `z-index: 9999` is only ever compared *within* `.parent`'s own local stacking context, not against elements outside it. `.other-element` establishes a *separate* stacking context with `z-index: 2`, which beats `.parent`'s own `z-index: 1` at the parent level — so `.other-element`'s entire contents render in front of `.parent`'s entire contents, regardless of how high `.badge`'s z-index is inside its own trapped local context.

**3.** `.sidebar` has no `flex-shrink: 0` set, so it uses the default `flex-shrink: 1` — meaning it *will* shrink below its stated `width: 250px` if the flex container doesn't have enough total space to fit both `.sidebar` and `.content` at their full sizes on a narrow screen. Fix: add `flex-shrink: 0;` to `.sidebar` if it should never shrink below 250px.

**4.** `height: 100%` on a percentage-based height requires the *parent* to have an explicitly defined height for the percentage to resolve against — if the parent (and potentially its own parent, and so on up the chain) has no explicit height set (commonly just relying on auto/content-based height), `100%` has nothing concrete to calculate against and effectively resolves to nothing meaningful, producing zero visible height. Fix: either give the necessary ancestor(s) an explicit height (or `min-height: 100vh` at a sufficiently high level), or use a viewport-relative unit (`100vh`/`100dvh`, from Part 17) instead if the intent is genuinely "fill the screen" rather than "fill the parent."

</details>

---

# PART 48 — Performance

## Why frontend performance matters, concretely

A slow-loading, janky page has real, measurable costs: users abandon slow sites at a documented, significant rate, search engines factor load performance directly into ranking (recall Part 11's honest SEO discussion), and on genuinely constrained connections/devices (common in many real-world contexts, not a hypothetical edge case), poor performance can make a site effectively unusable rather than just "slightly annoying."

## Image sizing and optimization

Recall Part 4's full responsive-images treatment (`srcset`/`sizes`, modern formats like WebP/AVIF) — this *is* the primary performance lever for most real-world pages, since images are very often the single largest category of bytes downloaded by a typical webpage. The practical checklist, restated in this performance-focused context: serve appropriately-sized images for the actual display size (never a 3000px-wide source image displayed at 300px), prefer modern compressed formats with fallback, and always specify `width`/`height` (Part 4) to prevent layout shift during load.

## Lazy loading — revisited

Recall Part 4's `loading="lazy"` — the single-line, zero-JavaScript performance win for any image positioned below the initial viewport ("below the fold"), deferring its download until the user is about to scroll it into view.

## Font loading

Recall Part 21's `font-display: swap` — preventing the "flash of invisible text" problem while custom web font files are still downloading. Additional practical guidance for this performance-focused context: load only the specific font weights/styles genuinely used in the actual design (each additional weight is a full separate file download), and prefer the modern, highly-compressed `.woff2` format as the primary/only source wherever feasible.

## Excessive and unused CSS

A large, accumulated stylesheet — especially one containing rules that no longer match anything in the current HTML (recall Part 35's "dead CSS" problem) — costs real, if modest, download/parse time, and genuinely costs real *maintenance* time regardless of its performance weight. Modern browser DevTools generally include a "Coverage" tool that can identify CSS rules never actually applied/used on the currently-loaded page — a genuinely useful, practical tool for auditing and trimming dead CSS in a real project.

## Animations and paint-heavy properties

Recall Part 0's rendering pipeline and Part 31's transform-performance discussion in full — this is the single most actionable, concrete performance principle from this entire course, worth stating one final time, explicitly, in this dedicated Performance Part:

```css
/* ❌ Expensive: triggers Layout + Paint + Composite on every frame */
.box {
    transition: left 0.3s ease, width 0.3s ease;
}
.box:hover {
    left: 20px;
    width: 220px;
}

/* ✅ Cheap: can often be handled by Composite alone */
.box {
    transition: transform 0.3s ease;
}
.box:hover {
    transform: translateX(20px) scale(1.1);
}
```

**`transform` and `opacity` are, as a strong, well-established general rule, the two CSS properties you should reach for when animating anything**, precisely because (recall Part 0's pipeline and Part 31's detailed explanation) they can typically be handled by the browser's Compositor stage alone, skipping the more expensive Layout and often Paint stages entirely. Animating `width`, `height`, `top`, `left`, or `margin` directly forces the browser to recalculate real layout geometry on every single animation frame — for a simple, isolated, one-off transition this cost may be genuinely negligible, but for anything more elaborate, frequent, or running on lower-powered devices, it becomes a real, measurable source of visible jank (dropped/stuttering frames).

## Layout thrashing — a conceptual introduction

**Layout thrashing** (also called "forced synchronous layout") is a specifically *JavaScript*-driven performance problem (reading a layout-dependent value, like an element's current computed width, then immediately writing a style change, then reading again, repeatedly, in a tight loop — each read forces the browser to recompute layout synchronously, right then, rather than batching it efficiently) — genuinely outside this course's HTML/CSS-only scope to fully explain or demonstrate in code, since it requires JavaScript to actually occur. It's included here only as a concept worth being aware of by name, since it's a common, real term you'll encounter in broader frontend performance discussions, and understanding *why* it happens (repeatedly forcing the Layout stage synchronously, rather than letting the browser batch and optimize naturally) connects directly back to this course's Part 0 rendering-pipeline foundation.

## Exercises — Part 48

1. Explain why animating `transform: translateX()` is generally cheaper for the browser than animating `left` to achieve the same visual movement.
2. What specific problem does `loading="lazy"` solve, and for which images should it generally be avoided?
3. Why does loading every weight of a custom web font "just in case" have a real performance cost, even if only one or two weights are actually used in the current design?
4. What browser DevTools feature can help identify CSS rules that aren't actually being used on the current page?

<details>
<summary>View solutions</summary>

1. Animating `left` requires the browser to recalculate real layout geometry (the Layout stage) on every single frame of the animation, since `left` is a layout-affecting property, followed by repainting and recompositing. Animating `transform: translateX()` achieves the same visual movement but can typically be handled entirely by the Compositor stage alone, skipping Layout (and often Paint) entirely — a substantially cheaper operation for the browser to perform repeatedly across many animation frames.

2. `loading="lazy"` defers downloading an image until the user is about to scroll it into view, saving initial page-load bandwidth/time for images far down a long page. It should generally be avoided on images visible immediately on load (above the fold), since deferring their load can actually delay them being ready to display, hurting rather than helping perceived load performance for content the user sees right away.

3. Because each font weight/style is typically its own separate font file that must be downloaded independently — loading unused weights adds real network download weight and parse time with zero actual visual benefit, since those weights are never rendered/used anywhere in the design.

4. A "Coverage" tool (commonly found in modern browsers' DevTools), which identifies which CSS (and JavaScript) rules were actually applied/used versus unused on the currently-loaded page — useful for auditing and trimming dead/unused CSS from a real project's stylesheets.

</details>

---

# PART 49 — Accessibility Advanced

This Part builds directly on Part 12's accessibility foundations, extending into more advanced, specific, production-relevant techniques and patterns.

## Keyboard navigation and focus order — revisited in depth

Recall Part 12's complete focus/tabindex treatment. In a genuinely well-built interface, a keyboard-only user should be able to reach and operate **every** interactive element on the page, in a **logical, predictable order** that matches the page's visual/reading order — this is not an edge-case nicety, it's a baseline, core requirement, and it should be verified directly, not assumed: literally unplug your mouse (or simply don't touch it) and Tab through your own interface as a genuine, practical testing habit.

## `:focus-visible` — revisited

Fully covered in Parts 12, 14, and 23 — the modern, correct pattern for styling focus indication without unconditionally removing it for keyboard users, restated here as part of this Part's complete accessibility reference.

## Skip links

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header>
    <nav aria-label="Main navigation">
      <!-- potentially many navigation links here -->
    </nav>
  </header>
  <main id="main-content">
    <!-- primary page content -->
  </main>
</body>
```

```css
.skip-link {
    position: absolute;
    top: -100px; /* off-screen by default */
    left: 0;
    background: #4f46e5;
    color: white;
    padding: 0.75rem 1.25rem;
    z-index: 1000;
    transition: top 0.2s ease;
}
.skip-link:focus {
    top: 0; /* becomes visible when focused, typically via the very first Tab press */
}
```

### The genuine problem this solves

Without a skip link, a keyboard-only user landing on a page with a long navigation menu (say, 15-20 links in the header) must Tab through **every single one** of those links before reaching the actual main page content — every single time they load or reload the page. This is a real, significant, repeated friction cost. A skip link is a link, visually hidden by default, that becomes visible **the moment it receives keyboard focus** (typically the very first Tab press on the page) — letting a keyboard user immediately jump straight past the repeated navigation and directly to the unique, primary content, exactly as its name describes.

> 💡 **Tip** — Recall Part 8's `<main>` coverage: the skip link's `href="#main-content"` targets the `id` placed directly on the semantic `<main>` element — this is precisely the practical payoff of having correctly used `<main>` in the first place; the skip link mechanism depends directly on it.

## Accessible forms — revisited and extended

Recall Part 7's full form treatment. One additional, important pattern worth adding here: **grouping and announcing validation errors clearly**.

```html
<div class="form-field">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" aria-describedby="email-error" aria-invalid="true">
  <p id="email-error" class="error-text" role="alert">Please enter a valid email address.</p>
</div>
```

- **`aria-invalid="true"`** communicates that this specific field currently has a validation error, distinct from the visual-only red-border styling from Part 34.
- **`aria-describedby`** (recall Part 12) connects the field to its specific error message text.
- **`role="alert"`** (recall Part 44's alert component) ensures the error message is announced to screen reader users as soon as it appears, without requiring them to manually navigate to find it.

## Semantic landmarks — revisited

Recall Part 8's complete semantic-structure Part — `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` all function as **navigable landmarks** for screen reader users, who commonly use a dedicated "jump between landmarks" navigation mode as a primary way to orient themselves on an unfamiliar page, functioning conceptually similarly to how a sighted user visually scans a page's overall layout at a glance.

## Accessible tables — revisited

Recall Part 6's `scope`, `<caption>`, `<thead>`/`<tbody>` treatment in full — the essential foundation for tables a screen reader user can actually navigate meaningfully cell by cell.

## Color contrast — revisited

Recall Part 16's WCAG contrast-ratio guidance (4.5:1 for normal text, 3:1 for large text, at the common "AA" level) and the DevTools built-in contrast-checking tool — worth restating here as a core, standard, non-optional accessibility checklist item for every real project, not merely a passing mention.

## Motion sensitivity — revisited

Recall Part 32's complete `prefers-reduced-motion` treatment — a real, medically-grounded accessibility consideration, not a hypothetical edge case, restated here as part of this Part's complete accessibility checklist.

## Hidden content and screen-reader-only utilities

This is the pattern promised back in Part 19: content that should be **completely invisible visually, but still fully readable by screen readers** — the precise opposite of `aria-hidden` (Part 12), and a genuinely distinct technique from both `display: none` and `visibility: hidden` (neither of which achieves this specific goal, since both remove content from the accessibility tree too).

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

```html
<button type="button">
  <svg aria-hidden="true"><!-- trash icon --></svg>
  <span class="sr-only">Delete item</span>
</button>
```

Let's understand *why* this specific, seemingly-strange combination of properties is necessary, rather than treating it as a magic incantation to copy-paste: the element must remain **genuinely present and "visible"** to the browser's own layout/accessibility-tree logic (ruling out `display: none` and `visibility: hidden`, both of which remove an element from the accessibility tree entirely, exactly as covered in Part 19) — but shrunk down to an imperceptible `1px × 1px` box, with `overflow: hidden` clipping any content that doesn't fit that tiny box, and `clip: rect(0,0,0,0)` (a legacy but still widely-included property providing broader, more robust browser-compatibility coverage for this exact clipping effect) ensuring nothing is visually perceptible at all — while the actual text content remains fully intact and readable by assistive technology, since nothing here removes it from the accessibility tree.

This `.sr-only` (or similarly-named) utility class is an extremely common, standard pattern across virtually every real-world accessible component library — used constantly for exactly the icon-button scenario shown above (recall the very similar `aria-label` alternative from Part 12; both achieve a similar practical outcome, and `.sr-only` is genuinely preferred in some situations, particularly when you want the accessible-name text to also be selectable/copyable, or when working within a system that already has this utility class established and consistently used).

## Building accessible components — a complete, final example

Pulling together the entirety of Parts 12 and 49 into one final, complete component:

```html
<nav aria-label="Main navigation">
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/products" aria-current="page">Products</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>Our Products</h1>

  <form>
    <div class="form-field">
      <label for="search">Search products</label>
      <input type="search" id="search" name="search">
    </div>
    <button type="submit">
      <svg aria-hidden="true"><!-- search icon --></svg>
      <span class="sr-only">Search</span>
    </button>
  </form>
</main>
```

## Knowledge Check — Part 49

1. What specific, repeated friction does a skip link solve for keyboard-only users?
2. Why does a skip link's `href` need to point to `<main>`'s `id` specifically, connecting back to Part 8?
3. What does `aria-invalid="true"` communicate, distinct from purely visual error styling like a red border?
4. Explain, precisely, why `.sr-only` uses `position: absolute` with `width: 1px; height: 1px; overflow: hidden;` rather than simply `display: none`.
5. Name at least three of the five main semantic landmark elements from Part 8 that function as navigable regions for screen reader users.

<details>
<summary>View solutions</summary>

1. Without a skip link, a keyboard-only user must Tab through every single navigation link (and any other content before the main content) every single time the page loads, before reaching the actual primary page content — a repeated, significant friction cost that a skip link solves by letting them jump directly to the main content immediately.
2. Because the skip link's entire purpose is to move focus/scroll position directly to the start of the page's primary, unique content — and `<main>` (Part 8) is specifically the semantic element representing exactly that content region; linking to its `id` is what makes the skip link's destination semantically and practically correct.
3. `aria-invalid="true"` is a semantic, machine-readable signal explicitly communicating validation error state to assistive technology. A red border is a purely visual signal that conveys nothing to a screen reader user who cannot see the color change — `aria-invalid` ensures the same "this field has an error" information reaches non-visual users too.
4. Because `display: none` (and `visibility: hidden`) remove an element from the accessibility tree entirely (Part 19), meaning screen readers would skip the content completely — defeating the entire purpose of `.sr-only`, which is to keep content genuinely present and readable by screen readers while making it visually imperceptible. The `.sr-only` technique keeps the element "visible" from the browser/accessibility-tree's perspective while clipping it down to an imperceptible size.
5. Any three of: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` (all from Part 8).

</details>

---

# PART 50 — SEO and Structure

This Part revisits and consolidates the structural HTML practices connecting directly to SEO, building on Part 11's honest, non-overpromising foundation.

## Semantic page structure — revisited

Recall Part 8 in full: search engines, like screen readers, rely on genuine semantic structure (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) to understand what a page's content actually is and how it's organized — this genuinely, measurably helps search engines parse and index content more accurately than an undifferentiated sea of generic `<div>`s ever could.

## Headings — revisited

Recall Part 2's heading-hierarchy guidance in full: a correct, logical `<h1>`→`<h6>` structure (one `<h1>` per page representing its main topic, descending logically through subsections) is a genuine, direct signal search engines use to understand a page's content hierarchy and topical structure — precisely the same underlying correctness that benefits screen reader navigation also benefits SEO, because both rely on the exact same real structural signal.

## Metadata — revisited

Recall Part 11 in full: `<title>`, meta description, canonical links, and Open Graph tags — the complete, honest picture of what these actually contribute (direct ranking-adjacent signals for some, indirect click-through-rate improvements for others) rather than overstated claims.

## Meaningful links — revisited

Recall Part 3's best-practices note: descriptive link text ("Read our complete pricing guide" rather than "click here") helps both screen reader users (who may review a page's links in isolation, out of surrounding context) and search engines (which use link text as a genuine signal about the linked page's topic) — again, the same underlying practice serving both accessibility and SEO simultaneously, which is a recurring, important pattern worth explicitly naming: **good semantic HTML practice and good SEO practice are, overwhelmingly, the same practice**, approached from two different angles.

## Image alt text — revisited

Recall Part 4 in full: descriptive, accurate `alt` text serves screen reader users directly and also helps search engines understand and index image content, particularly relevant for image-search visibility.

## Structured content

Beyond what's already been covered, one additional, genuinely useful concept belongs specifically in this Part: **structured data** (commonly implemented via a vocabulary called Schema.org, typically embedded as JSON-LD — a block of structured, machine-readable metadata, technically JavaScript-adjacent rather than pure HTML/CSS, and therefore only introduced conceptually here, outside this course's core hands-on scope) can help search engines display **rich results** (star ratings, pricing, recipe cook times, and similar special-formatted search-result enhancements) beyond a plain title/description snippet. This is worth knowing exists as a natural "what's next" direction beyond this course's HTML/CSS foundation, without being covered hands-on here, since implementing it well genuinely benefits from the solid semantic HTML foundation this entire course has built.

## Avoiding false SEO claims — a final, honest restatement

> ⚠️ **Common mistake** — Treating any specific HTML/CSS technique as a guaranteed SEO "hack" or shortcut. As established fully and honestly in Part 11, there is no meta tag or markup trick that overrides the fundamental need for genuinely useful, relevant, well-organized content, reasonable page performance, and genuine external signals like other sites linking to yours. Everything covered across this Part and Part 11 represents necessary, correct *groundwork* — the honest, accurate technical foundation search engines need to understand and fairly evaluate your content — not a guaranteed ranking outcome.

## Exercises — Part 50

1. Explain, in your own words, why "good semantic HTML" and "good SEO practice" so often turn out to be the exact same underlying practice.
2. Give three specific examples from earlier Parts of this course where a practice taught for accessibility reasons also directly benefits SEO.
3. Why should a developer be skeptical of any specific "SEO trick" claiming to guarantee search ranking improvements?

<details>
<summary>View solutions</summary>

1. Because both screen readers and search engines rely on the same underlying signal: genuine, correct HTML structure and semantics — proper heading hierarchy, meaningful link text, descriptive alt text, and semantic landmark elements all communicate the same accurate information about a page's content and organization to both audiences simultaneously, since neither can rely on purely visual presentation to understand the page the way a sighted human user can.

2. Any three of: correct heading hierarchy (helps both screen reader navigation and search engine content-structure understanding), descriptive alt text (helps both screen reader users and image-search indexing), meaningful/descriptive link text instead of "click here" (helps both screen reader users reviewing links out of context and search engines understanding the linked page's topic), semantic landmark elements like `<nav>`/`<main>` (help both screen reader landmark navigation and search engine page-structure parsing).

3. Because modern search engines weigh an enormous number of signals — content quality/relevance, external links from other reputable sites, page performance, and genuine user engagement, among many others — most of which are entirely outside what any single HTML/CSS technique can directly influence. No isolated markup trick can override the fundamental need for genuinely useful content and real external signals like inbound links, so claims of guaranteed ranking improvements from a specific technique alone should be treated with genuine skepticism.

</details>

---

# PART 51 — Print CSS

## `@media print`

### What it is

```css
@media print {
    nav, .sidebar, .cta-button, footer {
        display: none;
    }
}
```

`@media print` is a media query (recall Part 26's full media-query treatment) that applies specifically when a page is being **printed** or exported to a print-oriented PDF, rather than viewed on screen — letting you define an entirely separate visual presentation genuinely optimized for the printed page, rather than forcing the browser to print an unmodified screen layout (which often produces poor, wasteful results — navigation menus, buttons, and interactive controls that mean nothing on paper, dark backgrounds wasting ink, links with no visible destination once printed).

## Hiding non-printable UI

```css
@media print {
    nav,
    .sidebar,
    .site-footer-social-links,
    button,
    .no-print {
        display: none !important;
    }
}
```

The most immediately impactful print-CSS practice: hide anything that has no meaning or function once physically printed — navigation menus, interactive buttons, decorative sidebars, and similar screen-only UI. (The `!important` here is one of the genuinely legitimate, narrow uses flagged back in Part 15 — print styles specifically benefit from reliably overriding screen styles without engaging in a specificity negotiation, since print and screen contexts are so fundamentally different in purpose.)

## Showing link destinations

```css
@media print {
    a[href^="http"]::after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
        color: #555;
    }
}
```

This is a genuinely clever, print-specific technique: since a printed page has no clickable links at all, this rule uses `::after` generated content (recall Part 14) combined with the `attr()` function (retrieving an element's own attribute value directly within CSS) to **print the link's actual URL** directly after its visible text — ensuring the printed document doesn't silently lose the link's destination information.

## Print colors

```css
@media print {
    body {
        background: white;
        color: black;
    }
    * {
        box-shadow: none;
        text-shadow: none;
    }
}
```

Dark backgrounds and colorful decorative elements waste ink/toner and often print poorly (colors can render very differently, or fail to print at all, depending on the printer) — a print stylesheet should generally reset to a clean, high-contrast, ink-conscious black-on-white presentation, and strip purely decorative visual effects like shadows that add no value on paper.

## Page size and margins

```css
@page {
    size: A4;
    margin: 2cm;
}
```

The `@page` at-rule (distinct from `@media print`, though used together) configures the actual physical printed page itself — its `size` (a named paper size like `A4`, `letter`, or explicit dimensions) and page `margin`s.

## `break-before`, `break-after`, `break-inside`

```css
h2 {
    break-after: avoid; /* discourage a page break immediately after a heading,
                            which would visually strand it alone at the bottom
                            of a page, separated from its own content */
}
.card, table, pre {
    break-inside: avoid; /* discourage breaking a single card/table/code-block
                             awkwardly across two separate printed pages */
}
.chapter {
    break-before: page; /* force each new chapter to start on a fresh printed page */
}
```

These properties (already briefly referenced in Part 46's masonry-alternatives discussion) control how content is allowed to flow across printed page boundaries:

- **`break-before`**/**`break-after`** — control whether a page break should be forced, or specifically avoided, immediately before/after a given element.
- **`break-inside: avoid`** — prevents an element's own content from being awkwardly split across two separate printed pages, keeping it as one intact, uninterrupted visual unit wherever the physical page allows.

## Building a printable article/invoice

```css
@media print {
    @page {
        size: A4;
        margin: 2cm;
    }

    body {
        background: white;
        color: black;
        font-size: 12pt;
        line-height: 1.4;
    }

    nav, .no-print, button {
        display: none;
    }

    h1, h2, h3 {
        break-after: avoid;
    }

    table, .invoice-line-item {
        break-inside: avoid;
    }

    a[href^="http"]::after {
        content: " (" attr(href) ")";
        font-size: 0.85em;
    }

    .invoice-total {
        break-before: avoid;
        font-weight: 700;
    }
}
```

## Exercises — Part 51

1. Write a print stylesheet rule that hides the main navigation and any element with the class `.no-print` when the page is printed.
2. Write CSS that prints a link's actual URL after its visible text, only in the print context.
3. Why should a print stylesheet generally reset colorful/dark backgrounds to plain white?
4. Write CSS ensuring a `<table>` never gets awkwardly split across two printed pages.

<details>
<summary>View solutions</summary>

**1.**
```css
@media print {
    nav, .no-print { display: none; }
}
```

**2.**
```css
@media print {
    a[href^="http"]::after {
        content: " (" attr(href) ")";
    }
}
```

**3.** Because dark/colorful backgrounds waste ink/toner when printed, can render inconsistently or fail to print correctly depending on the specific printer, and generally reduce readability/contrast on paper compared to a clean, high-contrast black-on-white presentation optimized for physical printing rather than a backlit screen.

**4.**
```css
@media print {
    table { break-inside: avoid; }
}
```

</details>

---

# PART 52 — CSS for Very Large Documents

## How CSS behaves across long-form content

This Part addresses a genuinely distinct set of practical concerns from typical UI/component work: styling **long-form documents** — extensive articles, technical documentation, and any content intended for print/PDF export at real length — where different rules and considerations apply.

## Page break handling — revisited, at document scale

Everything from Part 51 applies here, but at a meaningfully larger scale: a hundred-page technical document needs *systematic*, consistent page-break rules applied throughout, not just a handful of one-off adjustments.

```css
@media print {
    h1 {
        break-before: page; /* every major heading starts a fresh page */
    }
    h2, h3 {
        break-after: avoid; /* headings never get orphaned alone at a page's bottom */
    }
}
```

## Avoid breaking code blocks

```css
@media print {
    pre, code {
        break-inside: avoid;
        white-space: pre-wrap; /* recall Part 21 — allows long lines to wrap
                                   rather than being silently cut off/clipped
                                   at the physical page's edge */
    }
}
```

Recall Part 2/21's `<pre>`/`<code>` treatment: a long, unbroken code block being awkwardly split mid-line across two printed pages is a genuinely poor experience for a reader following along — `break-inside: avoid` (Part 51) keeps it intact wherever the page allows, and `white-space: pre-wrap` specifically (rather than plain `pre`, which never wraps at all — recall Part 21) ensures genuinely long individual lines still wrap safely to fit the physical page width, rather than being invisibly clipped off the printed edge entirely.

## Print typography

```css
@media print {
    body {
        font-size: 11pt; /* the "pt" (point) unit — a traditional print-specific
                             unit, more conventional than "px" in a genuinely
                             print-focused context, though px/rem continue to
                             work correctly in print too */
        line-height: 1.5;
        font-family: Georgia, "Times New Roman", serif; /* serif fonts are a
            well-established convention for extended print reading, generally
            considered to aid readability in physically-printed long-form text
            more than most sans-serif fonts do */
    }
}
```

## Table overflow in long documents

```css
@media print {
    table {
        width: 100%;
        font-size: 10pt; /* often slightly smaller than body text, to fit
                             more tabular data within the printed page's
                             fixed physical width */
    }
}
```

A wide data table that fits comfortably on a wide screen can easily overflow a fixed physical printed page's width — reducing table-specific font size, and potentially reconsidering very wide tables' column structure specifically for print, are common, practical adjustments.

## Headings near page boundaries

Already directly addressed by the `break-after: avoid` pattern shown above — worth restating explicitly in this large-document context, since it becomes a much more frequent, systematically-relevant concern across a hundred-page document than in a typical single-page printable invoice.

## Professional print CSS — a complete example for long-form documentation

```css
@media print {
    @page {
        size: A4;
        margin: 2.5cm 2cm;
    }

    body {
        font-family: Georgia, serif;
        font-size: 11pt;
        line-height: 1.5;
        color: black;
    }

    nav, .sidebar, .no-print {
        display: none;
    }

    h1 {
        break-before: page;
        font-size: 22pt;
    }
    h2 {
        font-size: 16pt;
        break-after: avoid;
    }
    h3 {
        font-size: 13pt;
        break-after: avoid;
    }

    p, li {
        orphans: 3; /* minimum lines of a paragraph allowed at the BOTTOM of a page
                        before a break, preventing a single stranded "orphan" line */
        widows: 3;  /* minimum lines allowed at the TOP of a NEW page after a break,
                        preventing a single stranded "widow" line at a page's start */
    }

    pre, code {
        break-inside: avoid;
        white-space: pre-wrap;
        font-size: 9.5pt;
    }

    table {
        break-inside: avoid;
        width: 100%;
    }

    a[href^="http"]::after {
        content: " (" attr(href) ")";
        font-size: 0.85em;
        color: #444;
    }
}
```

`orphans`/`widows` are a genuinely classic print-typography concept, worth explaining precisely: an **orphan** is a single line of a paragraph left stranded alone at the very *bottom* of a page, with the rest of that paragraph continuing on the next page — visually awkward and hard to read comfortably. A **widow** is the mirror case: a single line left stranded alone at the very *top* of a new page, with the rest of the paragraph having ended on the previous page. Both properties set the *minimum* number of lines that must appear together before allowing a page break to split a paragraph, preventing these specific, well-known typographic awkwardnesses.

## Exercises — Part 52

1. Explain the precise difference between an "orphan" and a "widow" in print typography.
2. Write CSS ensuring every `<h1>` in a long document starts on a fresh printed page.
3. Why is `white-space: pre-wrap` generally preferred over plain `pre` for printed code blocks specifically?
4. Why might a print stylesheet reduce table font-size specifically, beyond what's used on screen?

<details>
<summary>View solutions</summary>

1. An orphan is a single line of a paragraph stranded alone at the bottom of a page, with the rest of the paragraph continuing on the next page. A widow is a single line stranded alone at the top of a new page, with the rest of the paragraph having already ended on the previous page. Both are considered visually awkward in print typography, and the `orphans`/`widows` CSS properties set minimum line counts to prevent either from occurring.

2.
```css
@media print {
    h1 { break-before: page; }
}
```

3. Because plain `pre` never wraps long lines at all, which can cause a genuinely long line of code to be silently cut off/clipped at the physical printed page's edge, losing that content entirely from the printed output. `white-space: pre-wrap` preserves `pre`'s whitespace-preserving behavior while still allowing long lines to wrap safely within the page's actual physical width, keeping all content visible.

4. Because a physically printed page has a fixed, limited width, and a wide data table that fits comfortably on a wide screen can easily overflow that fixed print width — reducing the table's font size helps fit more columns/data within the available physical page width without the table being cut off or requiring awkward reflow.

</details>

---

# Part 53 — Project-Based Learning: 28 Projects

Reading about HTML and CSS builds vocabulary. Building things builds skill. This Part is a curated sequence of 28 real projects, ordered by difficulty, each one deliberately chosen to force you to combine multiple concepts from earlier Parts rather than practicing one idea in isolation — exactly the way real UI work actually feels.

Every project follows the same format:

- **Project Goal** — what you're building and why it's useful practice
- **Requirements** — a concrete, checkable list of what the finished thing must do
- **Design description** — enough visual detail to build from without a Figma file
- **Concepts tested** — which earlier Parts this project draws on
- **Suggested structure** — a starting HTML skeleton/outline to orient you (not the full solution)
- **Hints** — nudges for the trickiest parts, without giving away the answer
- **Challenge extensions** — ways to push the project further once the base version works
- A hidden **complete solution** — full HTML, full CSS, an explanation of the key decisions, a note on responsive behavior, and a note on accessibility considerations

💡 **Tip:** Attempt every project yourself first — genuinely attempt it, in a real editor, for real — before opening the solution. The value is almost entirely in the struggle of translating "I want it to look like X" into working CSS. Reading a solution you didn't struggle for teaches far less than reading one you did.

⚠️ **Common mistake:** Skipping straight to "View complete solution" and reading it like an article. This produces recognition ("oh yeah, that makes sense") without producing the actual skill of retrieval, which is what you need in a real job or real project when nobody hands you a solution.

---

## Beginner Projects (1–8)

These test HTML structure fundamentals, basic CSS styling, the box model, and simple layout — no Flexbox/Grid required yet (though you may use them if you've already covered those Parts).

### Project 1 — Personal Profile Page

**Project Goal:** Build a single-page personal profile/bio page — the kind of thing you'd link from a resume.

**Requirements:**
- A profile photo (use a placeholder image), name, and short tagline/title
- A short "About" paragraph
- A list of skills (unordered list)
- A list of links (portfolio, GitHub, LinkedIn, email) styled as buttons or a clean link list
- Semantic HTML (`<header>`, `<main>`, `<footer>`, not `<div>` soup)
- Fully valid, accessible HTML (every image has meaningful `alt`, heading levels are sequential)

**Design description:** Centered content column, max-width around 600–700px, generous padding, a circular profile photo, clear visual hierarchy between name (large), tagline (medium, muted color), and body text.

**Concepts tested:** Parts 1–5 (structure, text, links, media), Part 11 (semantic HTML), Part 14–19 (selectors, box model, colors, units).

**Suggested structure:**
```html
<body>
  <header>
    <img src="..." alt="...">
    <h1>Name</h1>
    <p>Tagline</p>
  </header>
  <main>
    <section aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      <p>...</p>
    </section>
    <section aria-labelledby="skills-heading">
      <h2 id="skills-heading">Skills</h2>
      <ul>...</ul>
    </section>
  </main>
  <footer>
    <nav aria-label="Social links">...</nav>
  </footer>
</body>
```

**Hints:** Use `border-radius: 50%` on a square image for the circular photo — make sure the image itself is actually square first (`object-fit: cover` on a fixed width/height helps). Center the whole column with `margin-inline: auto` on a max-width container.

**Challenge extensions:** Add a dark mode toggle using the pattern from Part 40. Add a subtle `box-shadow` and hover states on the link buttons.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ayesha Kapoor — Frontend Developer</title>
<style>
  :root {
    --color-bg: #f7f7f9;
    --color-text: #1a1a1a;
    --color-muted: #63656b;
    --color-accent: #3454d1;
    --color-card: #ffffff;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
  }
  .profile {
    max-width: 640px;
    margin-inline: auto;
    padding: 2rem 1.25rem 4rem;
  }
  header {
    text-align: center;
    padding-block: 2rem;
  }
  header img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  }
  header h1 {
    margin: 1rem 0 0.25rem;
    font-size: 1.75rem;
  }
  header p {
    margin: 0;
    color: var(--color-muted);
  }
  section {
    background: var(--color-card);
    border-radius: 12px;
    padding: 1.5rem;
    margin-block: 1rem;
    box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
  }
  section h2 {
    margin-top: 0;
    font-size: 1.1rem;
  }
  ul.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0;
    list-style: none;
  }
  ul.skills li {
    background: #eef0fb;
    color: var(--color-accent);
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.85rem;
  }
  footer nav {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  footer a {
    display: inline-block;
    padding: 0.6rem 1.1rem;
    background: var(--color-accent);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease;
  }
  footer a:hover,
  footer a:focus-visible {
    background: #263c9e;
  }
</style>
</head>
<body>
  <div class="profile">
    <header>
      <img src="https://placehold.co/280x280" alt="Portrait of Ayesha Kapoor">
      <h1>Ayesha Kapoor</h1>
      <p>Frontend Developer &middot; Mumbai, India</p>
    </header>
    <main>
      <section aria-labelledby="about-heading">
        <h2 id="about-heading">About</h2>
        <p>I build accessible, performant web interfaces. Currently focused on design systems and component architecture.</p>
      </section>
      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        <ul class="skills">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>Accessibility</li>
          <li>Design Systems</li>
        </ul>
      </section>
    </main>
    <footer>
      <nav aria-label="Social links">
        <a href="https://github.com/example">GitHub</a>
        <a href="https://linkedin.com/in/example">LinkedIn</a>
        <a href="mailto:ayesha@example.com">Email</a>
      </nav>
    </footer>
  </div>
</body>
</html>
```

**Explanation:** The whole page is one centered column (`max-width: 640px; margin-inline: auto`), which is the simplest and most common layout pattern in all of web design — you'll use it constantly. Each content block is its own `<section>` with `aria-labelledby` pointing at its own heading, which gives assistive technology users a navigable outline of the page (this is the accessible alternative to giving every section a generic, unlabeled `<div>`). The skills list uses Flexbox with `flex-wrap: wrap` so it reflows naturally regardless of screen width or how many skills you add — no media query needed, which is the whole point of "content-driven" wrapping.

**Responsive behavior:** Because the layout is a single fluid column with a `max-width`, it naturally works at every width from a small phone up to a large desktop without a single media query — this is the "do you even need responsive design tools" case from Part 26: sometimes constraint + flow is enough.

**Accessibility considerations:** `alt` text describes the photo meaningfully rather than saying "profile photo" (redundant, since it's obviously a photo in that position). The social links nav has `aria-label="Social links"` because a `<nav>` with no visible heading needs a label so a screen reader user navigating by landmark regions knows what it is. Focus state (`:focus-visible`) is styled identically to hover, so keyboard users get the same feedback mouse users get.

</details>

---

### Project 2 — Recipe Page

**Project Goal:** Structure a real recipe page — a genuinely common real-world content type that tests your ability to represent structured, ordered, and grouped information correctly.

**Requirements:**
- Recipe title, a short description, a hero image
- Metadata: prep time, cook time, servings (displayed clearly, e.g., as a small stat row)
- Ingredients list (unordered — order doesn't matter)
- Instructions list (ordered — order matters, and matters a lot)
- Use `<time>` elements with `datetime` attributes for the time values

**Design description:** Hero image at top, title below, a metadata "stat bar" (three columns: prep/cook/servings), then a two-column layout on wide screens (ingredients sidebar + instructions main column), collapsing to one column on narrow screens.

**Concepts tested:** Parts 1–7 (lists, tables optional), Part 11 (semantic HTML — `<time>`, `<article>`), Part 24 or Part 25 (Flexbox or Grid for the two-column layout), Part 26 (responsive collapse).

**Suggested structure:**
```html
<article>
  <img src="..." alt="...">
  <h1>Recipe name</h1>
  <p>Description</p>
  <div class="stats">
    <div><time datetime="PT15M">15 min</time><span>Prep</span></div>
    <div><time datetime="PT30M">30 min</time><span>Cook</span></div>
    <div><span>4</span><span>Servings</span></div>
  </div>
  <div class="recipe-body">
    <aside>
      <h2>Ingredients</h2>
      <ul>...</ul>
    </aside>
    <div>
      <h2>Instructions</h2>
      <ol>...</ol>
    </div>
  </div>
</article>
```

**Hints:** The `datetime` attribute on `<time>` takes ISO 8601 duration format for durations: `PT15M` means "15 minutes", `PT1H30M` means "1 hour 30 minutes". This is invisible to sighted users but machine-readable (useful for search engines and any tool that parses recipe data). For the two-column-to-one-column collapse, Grid with `grid-template-columns: 250px 1fr` on wide screens and `grid-template-columns: 1fr` (or just removing the rule) under a media query is the cleanest approach.

**Challenge extensions:** Add a "servings" adjuster that's purely cosmetic (no JS needed — just show the static markup) demonstrating how you'd structure it for a future JS enhancement. Add print styles using Part 51's techniques so the recipe prints cleanly without the hero image wasting ink.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lemon Garlic Roasted Chicken — Recipe</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    color: #232323;
    line-height: 1.6;
  }
  article {
    max-width: 900px;
    margin-inline: auto;
    padding: 1.5rem;
  }
  .hero {
    width: 100%;
    aspect-ratio: 16 / 7;
    object-fit: cover;
    border-radius: 12px;
  }
  h1 {
    margin-block: 1rem 0.25rem;
    font-size: 2rem;
  }
  .description {
    color: #555;
    max-width: 60ch;
  }
  .stats {
    display: flex;
    gap: 2rem;
    padding-block: 1rem;
    border-block: 1px solid #e2e2e2;
    margin-block: 1.5rem;
  }
  .stats > div {
    display: flex;
    flex-direction: column;
  }
  .stats time,
  .stats .value {
    font-weight: 700;
    font-size: 1.1rem;
  }
  .stats .label {
    color: #777;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .recipe-body {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2.5rem;
    align-items: start;
  }
  @media (max-width: 640px) {
    .recipe-body {
      grid-template-columns: 1fr;
    }
  }
  aside, .instructions {
    margin: 0;
  }
  h2 {
    font-size: 1.15rem;
    border-bottom: 2px solid #232323;
    padding-bottom: 0.4rem;
  }
  aside ul {
    padding-left: 1.1rem;
  }
  aside li {
    margin-block: 0.5rem;
  }
  .instructions ol {
    padding-left: 1.3rem;
  }
  .instructions li {
    margin-block: 1rem;
    padding-left: 0.25rem;
  }
</style>
</head>
<body>
  <article>
    <img class="hero" src="https://placehold.co/900x400" alt="Roasted whole chicken with lemon halves and garlic on a sheet pan">
    <h1>Lemon Garlic Roasted Chicken</h1>
    <p class="description">A simple weeknight roast chicken with a crisp skin, built around lemon, garlic, and fresh thyme.</p>
    <div class="stats">
      <div>
        <time class="value" datetime="PT15M">15 min</time>
        <span class="label">Prep</span>
      </div>
      <div>
        <time class="value" datetime="PT1H10M">1 hr 10 min</time>
        <span class="label">Cook</span>
      </div>
      <div>
        <span class="value">4</span>
        <span class="label">Servings</span>
      </div>
    </div>
    <div class="recipe-body">
      <aside aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading">Ingredients</h2>
        <ul>
          <li>1 whole chicken (about 1.6 kg)</li>
          <li>1 lemon, halved</li>
          <li>6 garlic cloves, smashed</li>
          <li>3 tbsp olive oil</li>
          <li>2 tsp salt</li>
          <li>Fresh thyme sprigs</li>
        </ul>
      </aside>
      <div class="instructions" aria-labelledby="instructions-heading">
        <h2 id="instructions-heading">Instructions</h2>
        <ol>
          <li>Preheat the oven to 220&deg;C (425&deg;F).</li>
          <li>Pat the chicken completely dry with paper towels.</li>
          <li>Stuff the cavity with the lemon halves, garlic, and thyme.</li>
          <li>Rub the skin with olive oil and salt.</li>
          <li>Roast for 1 hour 10 minutes, until the internal temperature reaches 74&deg;C (165&deg;F).</li>
          <li>Rest for 10 minutes before carving.</li>
        </ol>
      </div>
    </div>
  </article>
</body>
</html>
```

**Explanation:** Ingredients use `<ul>` because their order carries no meaning — you could list them in any order. Instructions use `<ol>` because sequence is the entire point — step 5 genuinely must come after step 4. This distinction (semantic correctness of list type) matters for both meaning and for assistive technology, which will announce ordered list items with their number ("item 3 of 6"), giving a screen reader user a sense of progress through the recipe that an unordered list wouldn't convey. The `<time>` elements' `datetime` attributes carry the ISO 8601 duration, letting any tool (search engine rich results, a browser extension, a future feature you add) parse the actual duration even though the visible text says "1 hr 10 min" in human-friendly form — this real gap between what's displayed and what's machine-readable is exactly what the `datetime` attribute exists to bridge.

**Responsive behavior:** `.recipe-body` is a two-column CSS Grid (`250px 1fr`) that collapses to a single column under 640px via one media query rule that simply overrides `grid-template-columns`. Because Grid line placement (not source order) controls layout, no HTML reordering is needed for the collapse — the ingredients block just stacks visually above the instructions.

**Accessibility considerations:** `aria-labelledby` on both the ingredients `<aside>` and the instructions container ties each region to its own visible heading, so a screen reader's landmarks list reads "Ingredients", "Instructions" rather than two unlabeled regions. Using real heading elements (`<h2>`) rather than styled `<div>`s or `<strong>` text means these headings appear in any heading-based navigation a screen reader user relies on.

</details>

---

### Project 3 — Product Card

**Project Goal:** Build a single, reusable product card component — the atomic building block of nearly every e-commerce site, and the direct predecessor to the capstone project later in this course.

**Requirements:**
- Product image, name, price, a short one-line description, and an "Add to cart" button
- A "sale" badge that only sometimes appears (build both states)
- Hover state that lifts/highlights the card
- Card must not visually break if the product name is unusually long

**Design description:** A vertical card, rounded corners, subtle shadow, fixed-aspect-ratio image at top, content padding below, price in bold, button full-width at the bottom of the card.

**Concepts tested:** Part 18 (box model), Part 24 (Flexbox — likely `flex-direction: column` with the button pushed to the bottom via `margin-top: auto`), Part 20 (backgrounds/shadows), Part 32 (transitions).

**Hints:** To make the "Add to cart" button always sit at the bottom of the card regardless of how much text is above it, make the card a flex column (`display: flex; flex-direction: column`) and give the button `margin-top: auto` — this is one of the single most useful small Flexbox tricks and worth memorizing.

**Challenge extensions:** Build a row of 4 of these in a responsive grid (revisit after Part 25/26). Add a `prefers-reduced-motion` guard around the hover transition per Part 33.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Product Card</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    background: #f4f4f6;
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
    margin: 0;
  }
  .card {
    display: flex;
    flex-direction: column;
    width: 260px;
    background: white;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .card { transition: none; }
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgb(0 0 0 / 14%);
  }
  .card-media {
    position: relative;
    aspect-ratio: 1 / 1;
  }
  .card-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .badge {
    position: absolute;
    top: 0.6rem;
    left: 0.6rem;
    background: #d6334c;
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.25rem 0.55rem;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1rem;
  }
  .card-body h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    overflow-wrap: break-word;
  }
  .card-body p {
    margin: 0 0 0.75rem;
    color: #666;
    font-size: 0.85rem;
  }
  .price {
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  .price .original {
    font-weight: 400;
    color: #999;
    text-decoration: line-through;
    margin-right: 0.4rem;
    font-size: 0.9rem;
  }
  button {
    margin-top: auto;
    background: #1a1a1a;
    color: white;
    border: none;
    padding: 0.65rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
  button:hover { background: #333; }
</style>
</head>
<body>
  <div class="card">
    <div class="card-media">
      <span class="badge">Sale</span>
      <img src="https://placehold.co/400x400" alt="Ceramic pour-over coffee dripper">
    </div>
    <div class="card-body">
      <h3>Ceramic Pour-Over Coffee Dripper with Matching Wooden Base</h3>
      <p>Hand-glazed, single-cup capacity.</p>
      <div class="price">
        <span class="original">&#8377;1,499</span>&#8377;1,099
      </div>
      <button type="button">Add to cart</button>
    </div>
  </div>
</body>
</html>
```

**Explanation:** `.card` is `display: flex; flex-direction: column`, and `.card-body` is `flex: 1` so it stretches to fill remaining vertical space if the card's height is ever externally constrained (e.g., by `align-items: stretch` in a parent grid of cards with equal heights). The `margin-top: auto` on the button is the key trick: in a flex column, `auto` margins absorb all available free space, so a margin-top of `auto` pushes everything below it (here, just the button) as far down as possible — pinning it to the bottom of the card regardless of how much text sits above. The long product name is handled by `overflow-wrap: break-word`, so an unexpectedly long, unbroken product name wraps instead of overflowing the card's fixed width.

**Responsive behavior:** The card has a fixed `width: 260px` here for a single-card demo; in the capstone project this same card becomes a Grid item with `minmax()`-based flexible sizing instead of a fixed width, but the internal card structure (flex column, image aspect-ratio, button pinned to bottom) doesn't need to change at all — a well-built component's internals are usually independent of how its container sizes it, which is the whole idea behind component-based CSS architecture from Part 39.

**Accessibility considerations:** The `alt` text on the product image describes the actual product ("Ceramic pour-over coffee dripper"), not the filename or "product photo". The struck-through original price and the discounted price are both present as visible text (not conveyed by color/strikethrough alone) — someone using a screen reader hears both numbers and the word "original" giving them the comparison, satisfying the "don't rely on color alone" accessibility principle from Part 12.

</details>

---

### Project 4 — Simple Pricing Table

**Project Goal:** Build a 3-column pricing comparison table, one of the most common real-world marketing-page components — and a great test of both semantic table-vs-non-table judgment and Flexbox row alignment.

**Requirements:**
- Three pricing tiers side by side (e.g., Basic / Pro / Enterprise)
- One tier visually marked as "most popular" / "recommended"
- Each tier: name, price, a short list of included features, a call-to-action button
- All three CTA buttons align at the same vertical position regardless of feature-list length differences

**Design description:** Three cards in a row (stacking on mobile), the middle "recommended" card slightly larger/elevated with an accent border and a "Popular" ribbon/badge, consistent internal padding, feature lists with checkmark icons (can be plain ✓ characters or `::before` content).

**Concepts tested:** Part 24 (Flexbox — `align-items: stretch` + `margin-top: auto` combo from Project 3, applied across a row this time), Part 26 (media query stacking), Part 15 (specificity — the "popular" card needs an additional class, not a different element).

**Hints:** This is *not* a `<table>` — despite being called a "pricing table" colloquially, this content isn't tabular data (rows/columns of related data cells); it's three independent cards that happen to be laid out side by side. Using `<table>` here would be a semantic misuse exactly like the anti-pattern flagged in Part 9. Use three `<article>` elements in a flex row instead.

**Challenge extensions:** Add a monthly/yearly toggle (static markup only — show both states as separate elements you'd toggle with JS later). Add `@media print` rules so it prints as a clean comparison sheet.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pricing</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    background: #fafafa;
    margin: 0;
    padding: 3rem 1.25rem;
  }
  .pricing {
    display: flex;
    gap: 1.5rem;
    align-items: stretch;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1000px;
    margin-inline: auto;
  }
  .tier {
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #e3e3e3;
    border-radius: 14px;
    padding: 2rem 1.5rem;
    width: 280px;
    position: relative;
  }
  .tier.popular {
    border: 2px solid #3454d1;
    box-shadow: 0 8px 24px rgb(52 84 209 / 15%);
    transform: translateY(-8px);
  }
  .tier.popular::before {
    content: "Most Popular";
    position: absolute;
    top: -0.75rem;
    left: 50%;
    translate: -50% 0;
    background: #3454d1;
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    text-transform: uppercase;
  }
  .tier h2 {
    margin: 0.5rem 0 0;
    font-size: 1.1rem;
  }
  .tier .price {
    font-size: 2rem;
    font-weight: 800;
    margin: 0.5rem 0 1.25rem;
  }
  .tier .price span {
    font-size: 0.9rem;
    font-weight: 400;
    color: #777;
  }
  .tier ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem;
    flex: 1;
  }
  .tier li {
    padding-block: 0.4rem;
    padding-left: 1.5rem;
    position: relative;
    font-size: 0.9rem;
    color: #444;
  }
  .tier li::before {
    content: "\2713";
    position: absolute;
    left: 0;
    color: #2fa84f;
    font-weight: 700;
  }
  .tier button {
    margin-top: auto;
    padding: 0.7rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background: #eee;
  }
  .tier.popular button {
    background: #3454d1;
    color: white;
  }
  @media (max-width: 640px) {
    .pricing { flex-direction: column; align-items: center; }
    .tier.popular { transform: none; }
  }
</style>
</head>
<body>
  <div class="pricing">
    <article class="tier">
      <h2>Basic</h2>
      <p class="price">&#8377;499<span>/mo</span></p>
      <ul>
        <li>1 project</li>
        <li>5 GB storage</li>
        <li>Community support</li>
      </ul>
      <button type="button">Choose Basic</button>
    </article>
    <article class="tier popular">
      <h2>Pro</h2>
      <p class="price">&#8377;1,499<span>/mo</span></p>
      <ul>
        <li>Unlimited projects</li>
        <li>100 GB storage</li>
        <li>Priority support</li>
        <li>Team collaboration</li>
      </ul>
      <button type="button">Choose Pro</button>
    </article>
    <article class="tier">
      <h2>Enterprise</h2>
      <p class="price">Custom</p>
      <ul>
        <li>Unlimited everything</li>
        <li>Dedicated account manager</li>
        <li>SLA guarantee</li>
      </ul>
      <button type="button">Contact Sales</button>
    </article>
  </div>
</body>
</html>
```

**Explanation:** Each `.tier` is a flex column with its `<ul>` set to `flex: 1`, meaning the feature list expands to absorb any leftover vertical space, which pushes every button down to the same baseline across all three cards even though the Enterprise tier has fewer list items than Pro — the same `margin-top: auto`-style trick as Project 3, but achieved here via `flex: 1` on the element *above* the button rather than a margin on the button itself (both work; `flex: 1` is often preferred when there's exactly one flexible element to grow, since it also handles the case where the list is *shorter* than its siblings by stretching, not just pushing).

**Responsive behavior:** `flex-wrap: wrap` combined with a `max-width: 640px` media query that switches `flex-direction` to `column` gives a clean three-across-desktop, one-per-row-mobile behavior. The `.popular` card's `translateY(-8px)` "lift" effect is removed on mobile (`transform: none`) since a vertical lift makes no visual sense once cards are stacked vertically rather than sitting in a horizontal row.

**Accessibility considerations:** The "Most Popular" label is real visible text content (via `::before { content: "Most Popular" }`), not an icon-only badge, so its meaning isn't lost on anyone. Note the tradeoff flagged in Part 21: content generated via `::before`/`::after` is not reliably exposed to all screen readers the same way real HTML text is — for a production site you'd move this into real markup (a `<span>` in the HTML) rather than CSS-generated content; it's used here for brevity but is a known limitation worth remembering.

</details>

---

### Project 5 — Contact Page

**Project Goal:** Build a contact page combining a contact form with supporting information (address, map placeholder, hours) — testing full form semantics from Part 10 plus layout composition.

**Requirements:**
- A form with: name, email, subject (select dropdown), message (textarea), submit button
- Every input properly labeled (visible `<label>`, correctly associated)
- Client-side validation attributes (`required`, `type="email"`, `maxlength` on the message)
- A sidebar or adjacent block with company address, phone, email, and hours (use `<address>`)
- Fully keyboard-operable, logical tab order

**Design description:** Two-column layout on desktop (form on the left/main, contact info on the right/aside), single column on mobile with the form first.

**Concepts tested:** Part 10 (forms — labels, fieldsets, input types), Part 12 (accessibility — focus states, label association), Part 11 (`<address>`), Part 24/25 (layout).

**Hints:** Use `<fieldset>` and `<legend>` if you group related fields (not strictly needed for this simple form, but good practice to demonstrate). Remember: `<label for="id">` must match the input's actual `id` exactly — a mismatched `for`/`id` pair is one of the most common real-world accessibility bugs and is invisible unless you test it.

**Challenge extensions:** Add inline error message placeholders (empty by default, styled and ready for JS to fill in) using the `aria-describedby` pattern from Part 49. Add a character counter for the message field (static markup only).

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact Us</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    margin: 0;
    color: #232323;
    line-height: 1.6;
  }
  .contact-wrap {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 3rem;
    max-width: 960px;
    margin-inline: auto;
    padding: 3rem 1.25rem;
  }
  @media (max-width: 700px) {
    .contact-wrap { grid-template-columns: 1fr; }
  }
  h1 { margin-top: 0; }
  form { display: flex; flex-direction: column; gap: 1.1rem; }
  .field { display: flex; flex-direction: column; gap: 0.35rem; }
  label { font-weight: 600; font-size: 0.9rem; }
  input, select, textarea {
    font: inherit;
    padding: 0.6rem 0.7rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #3454d1;
    outline-offset: 1px;
  }
  textarea { resize: vertical; min-height: 120px; }
  button[type="submit"] {
    align-self: flex-start;
    padding: 0.75rem 1.75rem;
    background: #1a1a1a;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
  aside {
    background: #f5f5f7;
    padding: 1.5rem;
    border-radius: 12px;
    height: fit-content;
  }
  aside h2 { margin-top: 0; font-size: 1.05rem; }
  address { font-style: normal; line-height: 1.8; }
</style>
</head>
<body>
  <div class="contact-wrap">
    <div>
      <h1>Get in touch</h1>
      <form action="/submit-contact" method="post">
        <div class="field">
          <label for="name">Full name</label>
          <input type="text" id="name" name="name" required autocomplete="name">
        </div>
        <div class="field">
          <label for="email">Email address</label>
          <input type="email" id="email" name="email" required autocomplete="email">
        </div>
        <div class="field">
          <label for="subject">Subject</label>
          <select id="subject" name="subject" required>
            <option value="">Choose one&hellip;</option>
            <option value="general">General inquiry</option>
            <option value="support">Support</option>
            <option value="billing">Billing</option>
          </select>
        </div>
        <div class="field">
          <label for="message">Message</label>
          <textarea id="message" name="message" maxlength="500" required></textarea>
        </div>
        <button type="submit">Send message</button>
      </form>
    </div>
    <aside aria-labelledby="contact-info-heading">
      <h2 id="contact-info-heading">Contact information</h2>
      <address>
        Flat 302, Marine Heights<br>
        Bandra West, Mumbai 400050<br>
        India<br><br>
        <a href="tel:+912212345678">+91 22 1234 5678</a><br>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </address>
      <p><strong>Hours:</strong> Mon&ndash;Fri, 9am&ndash;6pm IST</p>
    </aside>
  </div>
</body>
</html>
```

**Explanation:** Every `<label for="...">` is matched to its input's `id` exactly — clicking any label focuses its input, and every screen reader announces the label when the input receives focus, both because of this association, not because of visual proximity (visual proximity alone gives sighted mouse users no benefit either, but it gives *zero* benefit to keyboard/screen-reader users, which is why the explicit `for`/`id` pair is non-negotiable, not just a nicety). `autocomplete="name"` and `autocomplete="email"` are real, standardized autofill hints (Part 10) that let browsers and password managers fill the form correctly — a small addition with outsized real-world usability impact.

**Responsive behavior:** The two-column Grid (`1.5fr 1fr`) collapses to one column under 700px, and because the form `<div>` appears first in the HTML source, it naturally stacks above the `<aside>` on mobile — the most useful order for a mobile visitor (they scroll to the form before the supplementary info), achieved for free by source order rather than needing `order` overrides.

**Accessibility considerations:** `<address>` is used for the exact purpose it's designed for (contact info for the page's owner), with `font-style: normal` overriding its default italic — a very common override, since `<address>`'s default styling is more a historical artifact than a useful default. The `aside` has `aria-labelledby` pointing at its own `<h2>`, giving it a clear landmark label. Focus states are visibly distinct (`outline`) on every interactive element, never suppressed.

</details>

---

### Project 6 — Login Form

**Project Goal:** Build a clean, accessible, properly-typed login form — deceptively simple, and one of the most bug-prone real-world components with regard to accessibility and autofill correctness.

**Requirements:**
- Email/username field, password field, "remember me" checkbox, submit button
- A visible "show password" toggle affordance (static markup — the actual JS toggle isn't required, but structure it as if it would work)
- Correct `autocomplete` values (`username`, `current-password`) — this genuinely matters for real password managers
- A "Forgot password?" link
- Clear, obvious focus states

**Design description:** A centered card, generous vertical spacing between fields, primary button styled distinctly from the secondary "forgot password" link.

**Concepts tested:** Part 10 (input types, autocomplete), Part 12 (accessible forms), Part 19 (colors/contrast).

**Hints:** Use `type="password"` for the password field (never plain `text` — the browser's built-in password masking and password-manager detection both depend on the correct type). Give the "show password" toggle button `aria-label="Show password"` if it's icon-only, since a raw eye icon conveys nothing to a screen reader.

**Challenge extensions:** Add a password strength meter as static markup (a set of 4 bars, some filled) demonstrating how you'd structure it for JS to update dynamically. Add a "Continue with Google" style secondary auth button with proper icon + text.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Log In</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    background: #f2f2f5;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 1.5rem;
  }
  .login-card {
    background: white;
    border-radius: 14px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 380px;
  }
  h1 { font-size: 1.4rem; margin: 0 0 1.5rem; }
  form { display: flex; flex-direction: column; gap: 1.1rem; }
  .field { display: flex; flex-direction: column; gap: 0.35rem; }
  label { font-size: 0.85rem; font-weight: 600; }
  .password-wrap { position: relative; display: flex; }
  input {
    font: inherit;
    padding: 0.65rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
  }
  .password-wrap input { padding-right: 2.5rem; }
  .toggle-visibility {
    position: absolute;
    right: 0.4rem;
    top: 50%;
    translate: 0 -50%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.3rem;
    font-size: 0.85rem;
    color: #555;
  }
  input:focus-visible {
    outline: 2px solid #3454d1;
    outline-offset: 1px;
  }
  .row-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
  }
  .remember { display: flex; align-items: center; gap: 0.4rem; }
  a { color: #3454d1; }
  button[type="submit"] {
    padding: 0.75rem;
    background: #1a1a1a;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    margin-top: 0.5rem;
  }
</style>
</head>
<body>
  <div class="login-card">
    <h1>Log in to your account</h1>
    <form action="/login" method="post">
      <div class="field">
        <label for="username">Email or username</label>
        <input type="text" id="username" name="username" autocomplete="username" required>
      </div>
      <div class="field">
        <label for="password">Password</label>
        <div class="password-wrap">
          <input type="password" id="password" name="password" autocomplete="current-password" required>
          <button type="button" class="toggle-visibility" aria-label="Show password">Show</button>
        </div>
      </div>
      <div class="row-between">
        <span class="remember">
          <input type="checkbox" id="remember" name="remember">
          <label for="remember">Remember me</label>
        </span>
        <a href="/forgot-password">Forgot password?</a>
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
</body>
</html>
```

**Explanation:** `autocomplete="username"` and `autocomplete="current-password"` (as opposed to `new-password`, which is the correct value for a *signup* form's password field, not a login form's) are specific, standardized tokens that browsers and password managers rely on to correctly identify and fill these exact fields — using the wrong token, or omitting it, is a routine cause of "why doesn't my password manager work on this site" complaints in real production software. The show/hide toggle button is `type="button"` (critically — not the default `type="submit"`, which would submit the form when clicked, a classic accidental-form-submission bug covered in Part 10).

**Responsive behavior:** The single-card layout with `max-width: 380px` and `width: 100%` scales down gracefully to any phone width with no media query needed — this is a case, like Project 1, where fluid sizing plus a max-width constraint is the entire responsive strategy.

**Accessibility considerations:** The icon-only toggle button has `aria-label="Show password"` (here rendered with visible text "Show" for clarity, but the `aria-label` pattern is shown for when you switch to an icon). All inputs have visible, properly associated `<label>` elements — no placeholder-as-label anti-pattern (Part 10 covers exactly why placeholder text disappearing on focus is an accessibility failure). Focus states use a clearly visible `outline`, never `outline: none` without a replacement.

</details>

---

### Project 7 — Registration Form

**Project Goal:** Extend Project 6's form skills into a longer, multi-field registration form — testing grouped fields, validation patterns, and the `<fieldset>`/`<legend>` grouping pattern for real.

**Requirements:**
- Fields: full name, email, password, confirm password, date of birth, a `<fieldset>` of radio buttons (account type: Personal / Business), a required terms-and-conditions checkbox, submit button
- Password and confirm-password fields both properly typed and labeled
- Use `<fieldset>`/`<legend>` for the account-type radio group (not just visually grouped `<div>`s)
- Correct `autocomplete` values including `new-password` and `bday`

**Design description:** A single card, slightly taller than the login card, with a visually distinct grouped section for the radio buttons (bordered box with a legend label), and the terms checkbox + submit button separated at the bottom by extra spacing to signal "final step."

**Concepts tested:** Part 10 (fieldset/legend, radio groups, checkbox), Part 12 (form accessibility), Part 15 (specificity for nested field styling).

**Hints:** `<fieldset>` and `<legend>` exist precisely for this case — a group of related inputs (here, mutually exclusive radio buttons) that together represent one logical question ("what account type?"). Without a `<legend>`, a screen reader user tabbing into the first radio button hears only "Personal, radio button, 1 of 2" with zero context about what question is being asked.

**Challenge extensions:** Add real (non-JS) `pattern` attribute validation to the password field enforcing a minimum complexity, and connect it to a visible hint below the field explaining the pattern in plain language (never make users guess a regex).

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Create an Account</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    background: #f2f2f5;
    margin: 0;
    padding: 3rem 1.25rem;
    display: flex;
    justify-content: center;
  }
  .signup-card {
    background: white;
    border-radius: 14px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 440px;
  }
  h1 { font-size: 1.4rem; margin: 0 0 1.5rem; }
  form { display: flex; flex-direction: column; gap: 1.1rem; }
  .field { display: flex; flex-direction: column; gap: 0.35rem; }
  label { font-size: 0.85rem; font-weight: 600; }
  input {
    font: inherit;
    padding: 0.65rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  input:focus-visible { outline: 2px solid #3454d1; outline-offset: 1px; }
  .hint { font-size: 0.75rem; color: #777; margin: 0; }
  fieldset {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 0.9rem 1rem 1rem;
    margin: 0;
  }
  legend { font-size: 0.85rem; font-weight: 600; padding-inline: 0.3rem; }
  .radio-row { display: flex; gap: 1.5rem; margin-top: 0.4rem; }
  .radio-row label { font-weight: 400; display: flex; align-items: center; gap: 0.4rem; }
  .terms { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; margin-top: 0.5rem; }
  .terms label { font-weight: 400; }
  button[type="submit"] {
    padding: 0.75rem;
    background: #1a1a1a;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
</head>
<body>
  <div class="signup-card">
    <h1>Create your account</h1>
    <form action="/register" method="post">
      <div class="field">
        <label for="fullname">Full name</label>
        <input type="text" id="fullname" name="fullname" autocomplete="name" required>
      </div>
      <div class="field">
        <label for="reg-email">Email address</label>
        <input type="email" id="reg-email" name="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="dob">Date of birth</label>
        <input type="date" id="dob" name="dob" autocomplete="bday" required>
      </div>
      <div class="field">
        <label for="reg-password">Password</label>
        <input type="password" id="reg-password" name="password"
               autocomplete="new-password"
               pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
               aria-describedby="password-hint" required>
        <p class="hint" id="password-hint">At least 8 characters, with one uppercase letter and one number.</p>
      </div>
      <div class="field">
        <label for="confirm-password">Confirm password</label>
        <input type="password" id="confirm-password" name="confirm_password" autocomplete="new-password" required>
      </div>
      <fieldset>
        <legend>Account type</legend>
        <div class="radio-row">
          <label><input type="radio" name="account_type" value="personal" checked> Personal</label>
          <label><input type="radio" name="account_type" value="business"> Business</label>
        </div>
      </fieldset>
      <div class="terms">
        <input type="checkbox" id="terms" name="terms" required>
        <label for="terms">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</label>
      </div>
      <button type="submit">Create Account</button>
    </form>
  </div>
</body>
</html>
```

**Explanation:** The `<fieldset>`/`<legend>` pair turns the two radio buttons into one coherent, announced question: a screen reader user tabbing in hears "Account type, group" first, then "Personal, radio button, 1 of 2, selected", giving them the context a bare pair of labeled radios never would. The password field's `pattern` attribute enforces real client-side validation (at least 8 characters, one uppercase, one digit) using a genuine regex — but critically, the plain-language `<p class="hint">` describing that same rule sits right below it and is wired via `aria-describedby`, so nobody — sighted or not — has to reverse-engineer a regex to understand what's required. `autocomplete="new-password"` (not `current-password`) on both password fields tells the browser/password manager this is a *new* credential being created, prompting it to offer to *generate and save* a password rather than look one up.

**Responsive behavior:** Identical single-column, max-width-constrained card pattern as Project 6 — this is a deliberately repeated pattern across these beginner projects, because in real work, the "centered card form" layout is used constantly, and repetition here is intentional reinforcement, not laziness.

**Accessibility considerations:** `aria-describedby="password-hint"` links the password input to its plain-language requirements text, so a screen reader announces both the label ("Password") and the hint ("At least 8 characters...") when the field receives focus — this is the correct, accessible way to attach a validation hint, covered fully in Part 49. The terms checkbox's link text ("Terms of Service", "Privacy Policy") is specific and meaningful rather than a bare "click here", satisfying the link-text accessibility guidance from Part 12.

</details>

---

### Project 8 — Article Page

**Project Goal:** Build a long-form article/blog-post reading page — testing typography, readable line lengths, semantic document structure, and the difference between content structure and decoration.

**Requirements:**
- Article title, author byline with publish date (`<time>`), a hero image with a caption (`<figure>`/`<figcaption>`)
- Body content with multiple paragraphs, at least one `<blockquote>`, at least one subheading (`<h2>`), and one code snippet (`<pre><code>`)
- A comfortable reading measure (line length) — not full browser width
- Clear, generous line-height and paragraph spacing tuned for long-form reading

**Design description:** Centered single column, max-width tuned to roughly 65–75 characters per line (not pixels — think in character measure), large serif or humanist sans-serif body font, clear visual distinction for blockquotes (indent + left border) and code blocks (monospace, background tint).

**Concepts tested:** Part 6 (media, figure/figcaption), Part 11 (semantic HTML — article, time, blockquote), Part 22 (typography — line-length, line-height, font pairing), Part 51 (optional: print styles).

**Hints:** Use the `ch` unit (Part 17) for `max-width` on the text column — `max-width: 68ch` gives you a genuinely readable line length regardless of font-size changes, which is exactly what `ch` is designed for and is more robust than guessing a pixel value.

**Challenge extensions:** Add a sticky "reading progress" bar at the very top of the page using `position: sticky` (structure only — the width animation would need JS, but build the static bar). Add print styles per Part 51 so it prints as a clean, readable document.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Why Whitespace Isn't Empty — Article</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #232323;
    background: #fdfdfb;
    margin: 0;
    line-height: 1.75;
  }
  article {
    max-width: 68ch;
    margin-inline: auto;
    padding: 3rem 1.25rem 5rem;
  }
  header {
    font-family: system-ui, sans-serif;
    margin-bottom: 2rem;
  }
  h1 {
    font-size: 2.1rem;
    line-height: 1.25;
    margin-bottom: 0.75rem;
  }
  .byline {
    color: #666;
    font-size: 0.9rem;
  }
  figure {
    margin: 2rem 0;
  }
  figure img {
    width: 100%;
    border-radius: 8px;
    display: block;
  }
  figcaption {
    font-family: system-ui, sans-serif;
    font-size: 0.8rem;
    color: #777;
    margin-top: 0.5rem;
    text-align: center;
  }
  h2 {
    font-family: system-ui, sans-serif;
    font-size: 1.35rem;
    margin-top: 2.5rem;
  }
  p { margin-block: 1.25rem; font-size: 1.08rem; }
  blockquote {
    margin: 2rem 0;
    padding-left: 1.25rem;
    border-left: 3px solid #3454d1;
    font-style: italic;
    color: #444;
  }
  pre {
    background: #1e1e2e;
    color: #e2e2e2;
    padding: 1.1rem 1.25rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
  }
  code {
    font-family: 'SFMono-Regular', Consolas, monospace;
  }
  p code {
    background: #f0f0f0;
    color: #c7254e;
    padding: 0.1em 0.35em;
    border-radius: 4px;
    font-size: 0.9em;
  }
</style>
</head>
<body>
  <article>
    <header>
      <h1>Why Whitespace Isn't Empty</h1>
      <p class="byline">By Ravi Deshmukh &middot; <time datetime="2026-03-14">March 14, 2026</time></p>
    </header>
    <figure>
      <img src="https://placehold.co/900x500" alt="A minimalist desk setup with a single plant and a closed notebook">
      <figcaption>A workspace with room to think. Photo: Studio Archive.</figcaption>
    </figure>
    <p>Every designer eventually learns that the space between things is not the absence of design &mdash; it is design. Margin, padding, and gap are not leftover space; they're the mechanism by which meaning gets structured.</p>
    <h2>The cost of cramming</h2>
    <p>When every element touches its neighbor, the eye has nothing to rest on and no way to group related things at a glance. Consider two paragraphs set with no space between them at all versus a comfortable <code>margin-block: 1.25rem</code> &mdash; the second reads as two distinct thoughts; the first reads as one undifferentiated block.</p>
    <blockquote>
      <p>"Whitespace is to design what silence is to music &mdash; not an absence, but an active structural choice."</p>
    </blockquote>
    <p>In CSS, this is worth encoding deliberately rather than leaving to accident:</p>
    <pre><code>.prose > * + * {
  margin-top: 1.25rem;
}</code></pre>
    <p>This "lobotomized owl" selector (<code>* + *</code>) applies top margin to every element that has a preceding sibling &mdash; a clean way to guarantee consistent rhythm without manually setting margin on every single element type.</p>
  </article>
</body>
</html>
```

**Explanation:** `max-width: 68ch` is the single most important line in this file for reading comfort — `ch` is defined as the width of the `0` character in the current font, so `68ch` reliably produces a line length in the generally-recommended 60-75-characters-per-line range for comfortable reading, and — unlike a fixed pixel width — it automatically adjusts if the font-size or font-family changes, since it's always relative to the actual rendered character width. `line-height: 1.75` on the body (rather than the more common `1.4`–`1.5` used for UI text) is intentionally generous because long-form reading benefits from more vertical breathing room between lines than dense UI text does — this differs deliberately by content type, not a universal "correct" line-height.

**Responsive behavior:** Because the column width is capped by a character-count unit rather than a fixed pixel value, and everything else is fluid (`width: 100%` on the image, relative font sizes), this page requires zero media queries to read comfortably from a phone to a wide desktop — the browser's own default body font-size and the `ch`-based cap do all the responsive work.

**Accessibility considerations:** The `<time datetime="2026-03-14">` provides a machine-readable publish date alongside the human-readable "March 14, 2026" text. The code block's syntax (dark background, light text) maintains strong contrast even though it departs from the page's light theme, since code-block legibility shouldn't be sacrificed for overall page theme consistency. Heading levels are sequential (`h1` then `h2`, no skipped levels), keeping the document outline correct for screen reader navigation.

</details>

---

## Intermediate Projects (9–18)

These require real Flexbox/Grid fluency, responsive breakpoints, and often multiple interacting components — you should have completed at least through Part 33 (transitions/animations) before attempting this tier comfortably.

### Project 9 — Responsive Landing Page

**Project Goal:** Build a marketing landing page for a fictional SaaS product — the archetypal "hero + features + CTA" page structure used across most of the commercial web.

**Requirements:**
- Sticky header with logo + nav links + a CTA button
- Hero section: headline, subheadline, CTA button, and a hero image/illustration
- A 3-column features section (icon + title + description each)
- A closing CTA band with contrasting background
- Footer with link columns

**Design description:** Bold, generous whitespace, large hero typography, feature cards in a responsive grid (3 columns desktop, 1 column mobile), consistent accent color used sparingly for CTAs only.

**Concepts tested:** Part 24/25 (Flexbox for header/nav, Grid for features), Part 26 (mobile-first breakpoints), Part 32 (`position: sticky` header), Part 38 (CSS custom properties for the accent color used throughout).

**Suggested structure:**
```html
<header class="site-header">...</header>
<main>
  <section class="hero">...</section>
  <section class="features">...</section>
  <section class="cta-band">...</section>
</main>
<footer>...</footer>
```

**Hints:** For the sticky header, `position: sticky; top: 0; z-index: 10;` on the `<header>` combined with a solid (non-transparent) background is the entire trick — remember from Part 27 that `sticky` needs a defined offset (`top: 0`) to activate, and needs `z-index` if other content might scroll beneath and behind it.

**Challenge extensions:** Add a scroll-triggered header background change (structure the CSS with a `.scrolled` class ready to be toggled by future JS). Add `@container` queries (Part 37) to the features section so each card's internal layout adapts to its own width rather than the viewport's.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flowbase — Project Management, Simplified</title>
<style>
  :root {
    --accent: #3454d1;
    --accent-dark: #253a94;
    --text: #1a1a1a;
    --muted: #666;
    --bg-alt: #f6f7fb;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); line-height: 1.6; }
  a { color: inherit; text-decoration: none; }
  .container { max-width: 1100px; margin-inline: auto; padding-inline: 1.25rem; }

  .site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    border-bottom: 1px solid #eee;
  }
  .site-header .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 1rem;
  }
  .logo { font-weight: 800; font-size: 1.2rem; }
  .site-header nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  .site-header nav a:not(.btn) { color: var(--muted); font-size: 0.9rem; }
  .btn {
    background: var(--accent);
    color: white;
    padding: 0.55rem 1.2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
  }
  .btn:hover { background: var(--accent-dark); }

  .hero {
    padding-block: 5rem 4rem;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3.25rem);
    max-width: 18ch;
    margin-inline: auto;
    line-height: 1.15;
  }
  .hero p {
    color: var(--muted);
    max-width: 50ch;
    margin: 1.25rem auto 2rem;
    font-size: 1.1rem;
  }
  .hero img {
    width: 100%;
    max-width: 900px;
    border-radius: 14px;
    box-shadow: 0 20px 50px rgb(0 0 0 / 10%);
  }

  .features { padding-block: 4rem; background: var(--bg-alt); }
  .features h2 { text-align: center; font-size: 1.75rem; margin-bottom: 2.5rem; }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  @media (max-width: 800px) {
    .feature-grid { grid-template-columns: 1fr; }
  }
  .feature-card { text-align: center; padding: 1rem; }
  .feature-icon {
    width: 48px;
    height: 48px;
    background: var(--accent);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-inline: auto 1rem;
    font-weight: 800;
  }
  .feature-card h3 { margin: 1rem 0 0.5rem; font-size: 1.05rem; }
  .feature-card p { color: var(--muted); font-size: 0.9rem; margin: 0; }

  .cta-band {
    background: var(--text);
    color: white;
    text-align: center;
    padding-block: 4rem;
  }
  .cta-band h2 { font-size: 1.75rem; margin-bottom: 1.5rem; }

  footer { padding-block: 3rem; }
  .footer-cols {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  @media (max-width: 700px) {
    .footer-cols { grid-template-columns: repeat(2, 1fr); }
  }
  .footer-cols h4 { font-size: 0.85rem; margin-bottom: 0.75rem; }
  .footer-cols ul { list-style: none; padding: 0; margin: 0; }
  .footer-cols li { margin-block: 0.4rem; }
  .footer-cols a { color: var(--muted); font-size: 0.85rem; }
</style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <span class="logo">Flowbase</span>
      <nav aria-label="Primary">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a class="btn" href="#signup">Get started</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="hero container">
      <h1>Project management your team will actually use</h1>
      <p>Flowbase brings tasks, docs, and conversations into one place &mdash; no more switching between six tabs to find one update.</p>
      <a class="btn" href="#signup">Start free trial</a>
      <div style="margin-top: 3rem;">
        <img src="https://placehold.co/900x500" alt="Screenshot of the Flowbase dashboard showing a kanban board">
      </div>
    </section>
    <section class="features" id="features">
      <div class="container">
        <h2>Everything your team needs</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">01</div>
            <h3>Task boards</h3>
            <p>Kanban and list views that stay in sync automatically.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">02</div>
            <h3>Shared docs</h3>
            <p>Write specs and plans right next to the work they describe.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">03</div>
            <h3>Team chat</h3>
            <p>Conversation threads linked directly to the tasks they're about.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="cta-band" id="signup">
      <h2>Ready to try Flowbase?</h2>
      <a class="btn" href="/signup">Start your free trial</a>
    </section>
  </main>
  <footer>
    <div class="container footer-cols">
      <div>
        <h4>Product</h4>
        <ul><li><a href="#">Features</a></li><li><a href="#">Pricing</a></li></ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul><li><a href="#">About</a></li><li><a href="#">Careers</a></li></ul>
      </div>
      <div>
        <h4>Resources</h4>
        <ul><li><a href="#">Docs</a></li><li><a href="#">Blog</a></li></ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul>
      </div>
    </div>
  </footer>
</body>
</html>
```

**Explanation:** The hero headline uses `font-size: clamp(2rem, 5vw, 3.25rem)` (Part 36), giving it fluid scaling between a firm minimum and maximum without any media query — this is exactly the "fluid typography" pattern that reduces the number of breakpoints a page needs. Custom properties (`--accent`, `--text`, `--muted`) defined once on `:root` are reused across the header CTA, hero CTA, feature icons, and CTA band, so a future rebrand is a one-line change — the practical payoff of Part 38's theming pattern.

**Responsive behavior:** Three independent Grid/Flex layouts (feature grid: 3→1 columns at 800px; footer columns: 4→2 at 700px) collapse at different breakpoints chosen by each section's own content needs rather than a single global breakpoint — a deliberate demonstration that "mobile-first breakpoints" means picking the breakpoint where *that specific content* starts to feel cramped, not applying one number everywhere.

**Accessibility considerations:** The feature icons are purely decorative number badges, so they're marked `aria-hidden="true"` — a screen reader skips them entirely and goes straight to the meaningful heading text ("Task boards"), avoiding the noise of announcing "01" before every card. The primary nav has `aria-label="Primary"` distinguishing it from the footer's unlabeled link lists (which aren't `<nav>` elements here since they're simple footer link groups, not primary site navigation).

</details>

---

### Project 10 — Portfolio Homepage

**Project Goal:** Build a personal portfolio homepage for a designer/developer — testing a hero section, a project showcase grid, and a skills/about band, with strong visual identity.

**Requirements:**
- Hero with name, role, short pitch, and social links
- A project showcase: at least 4 project cards with image, title, tags, and a link, in a responsive grid
- An "About" band with a short bio and a skills list
- Consistent, considered typography scale (use Part 22's modular scale idea)

**Concepts tested:** Part 22 (typographic scale), Part 25 (Grid for the project showcase — try `repeat(auto-fit, minmax(280px, 1fr))` from Part 26 for a grid that reflows without a media query), Part 38 (custom properties).

**Hints:** `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` is the single most useful Grid line for card galleries — it lets the browser decide how many columns fit at any width, growing/shrinking column count automatically, with zero media queries required for the grid itself (you may still want a media query for other page elements).

**Challenge extensions:** Add hover-reveal project tags (tags hidden by default, revealed via `opacity`/`transform` transition on card hover) with a `prefers-reduced-motion` fallback that shows tags statically.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meera Nair — Product Designer</title>
<style>
  :root {
    --accent: #d1345a;
    --text: #1a1a1a;
    --muted: #6b6b6b;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); line-height: 1.6; }
  a { color: inherit; }
  .container { max-width: 1100px; margin-inline: auto; padding-inline: 1.25rem; }

  .hero { padding-block: 5rem 3rem; }
  .hero p.eyebrow { color: var(--accent); font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.06em; margin: 0; }
  .hero h1 { font-size: clamp(2.25rem, 5vw, 3.5rem); margin: 0.5rem 0; }
  .hero p.pitch { max-width: 55ch; color: var(--muted); font-size: 1.1rem; }
  .social-links { display: flex; gap: 1rem; margin-top: 1.5rem; }
  .social-links a { text-decoration: underline; font-size: 0.9rem; }

  .work h2 { font-size: 1.5rem; margin-bottom: 1.5rem; }
  .work-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.75rem;
    padding-bottom: 4rem;
  }
  .project-card { display: block; text-decoration: none; color: inherit; }
  .project-card .thumb {
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }
  .project-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
  .project-card:hover img { transform: scale(1.04); }
  @media (prefers-reduced-motion: reduce) {
    .project-card img { transition: none; }
    .project-card:hover img { transform: none; }
  }
  .project-card h3 { margin: 1rem 0 0.35rem; font-size: 1.05rem; }
  .tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .tags span {
    font-size: 0.72rem;
    color: var(--muted);
    background: #f1f1f1;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
  }

  .about { background: #fafafa; padding-block: 4rem; }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
  @media (max-width: 700px) { .about-grid { grid-template-columns: 1fr; } }
  .about h2 { font-size: 1.4rem; }
  .skills { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .skills li { background: white; border: 1px solid #e2e2e2; padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 0.85rem; }
</style>
</head>
<body>
  <div class="container">
    <section class="hero">
      <p class="eyebrow">Product Designer &amp; Frontend Developer</p>
      <h1>Meera Nair</h1>
      <p class="pitch">I design and build interfaces for early-stage products &mdash; from first sketch through shipped, production-grade UI.</p>
      <nav class="social-links" aria-label="Social links">
        <a href="#">Dribbble</a>
        <a href="#">GitHub</a>
        <a href="#">LinkedIn</a>
      </nav>
    </section>
    <section class="work" aria-labelledby="work-heading">
      <h2 id="work-heading">Selected work</h2>
      <div class="work-grid">
        <a class="project-card" href="#">
          <div class="thumb"><img src="https://placehold.co/400x300" alt="Screenshot of the Nimbus banking app redesign"></div>
          <h3>Nimbus &mdash; Banking App Redesign</h3>
          <div class="tags"><span>UI Design</span><span>Fintech</span></div>
        </a>
        <a class="project-card" href="#">
          <div class="thumb"><img src="https://placehold.co/400x300" alt="Screenshot of the Loop analytics dashboard"></div>
          <h3>Loop &mdash; Analytics Dashboard</h3>
          <div class="tags"><span>Dashboard</span><span>Data Viz</span></div>
        </a>
        <a class="project-card" href="#">
          <div class="thumb"><img src="https://placehold.co/400x300" alt="Screenshot of the Fernweave travel booking site"></div>
          <h3>Fernweave &mdash; Travel Booking</h3>
          <div class="tags"><span>Web Design</span><span>Booking</span></div>
        </a>
        <a class="project-card" href="#">
          <div class="thumb"><img src="https://placehold.co/400x300" alt="Screenshot of the Pocket budgeting mobile app"></div>
          <h3>Pocket &mdash; Budgeting App</h3>
          <div class="tags"><span>Mobile</span><span>Fintech</span></div>
        </a>
      </div>
    </section>
  </div>
  <section class="about">
    <div class="container about-grid">
      <div>
        <h2>About</h2>
        <p>I've spent the last six years working with early-stage startups to take products from zero to shipped. I care most about the gap between how something looks in a mockup and how it actually behaves once real content and real users hit it.</p>
      </div>
      <div>
        <h2>Skills</h2>
        <ul class="skills">
          <li>Figma</li><li>HTML/CSS</li><li>JavaScript</li><li>Design Systems</li><li>Prototyping</li>
        </ul>
      </div>
    </div>
  </section>
</body>
</html>
```

**Explanation:** `repeat(auto-fit, minmax(280px, 1fr))` is doing all of the responsive layout work for the project grid: the browser computes how many 280px-minimum columns fit in the available width and lays them out as equal `1fr` columns, automatically going from 1 column on a phone to 3-4 on a wide desktop with zero media queries — this is the single Grid line referenced back to from Part 26's original explanation of `auto-fit` vs `auto-fill`, used here in its most natural real-world context.

**Responsive behavior:** Only the `.about-grid` (a fixed two-column layout, not a reflowing card gallery) needs an explicit media query to collapse to one column, because a two-column *text* layout doesn't have the "how many fit" question that `auto-fit` answers for cards — it's a binary "two columns or one," which is exactly what a simple breakpoint is for.

**Accessibility considerations:** Each project card is one single `<a>` wrapping the image, title, and tags — meaning the entire card is one clickable/tappable target and one single tab stop (rather than, say, a separate link on just the image and a separate link on just the title, which would create two redundant, confusingly-identical stops for keyboard and screen-reader users navigating the page).

</details>

---

### Project 11 — Product Catalogue

**Project Goal:** Build a filterable-looking product catalogue/grid page — direct groundwork for the capstone project, focused specifically on a real e-commerce grid with a sidebar of filters.

**Requirements:**
- Sidebar with filter groups (category checkboxes, price range, a "sort by" select) — static, non-functional structure is fine
- A responsive product grid (reuse Project 3's card)
- A results count / "Showing X of Y results" line
- Pagination controls at the bottom

**Concepts tested:** Part 25 (Grid — page-level two-column layout: sidebar + grid), Part 10 (filter form controls), Part 26 (responsive collapse — sidebar becomes a top filter bar or off-canvas on mobile).

**Hints:** At the page level, use CSS Grid with a fixed sidebar column (`240px 1fr`) rather than Flexbox — Part 25 explains why Grid is the better tool specifically when you have a genuinely two-dimensional page layout (a persistent sidebar alongside a wrapping card grid) versus Flexbox, which is better suited to the one-dimensional card row/wrap *within* that main content column.

**Challenge extensions:** Turn the filter checkboxes into visually distinct "chip" toggles instead of default checkboxes (a common real e-commerce pattern) using the `:has()` selector or sibling-selector styling from Part 42.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shop All &mdash; Catalogue</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; }
  .layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 2rem;
    max-width: 1100px;
    margin-inline: auto;
    padding: 2rem 1.25rem 4rem;
  }
  @media (max-width: 800px) {
    .layout { grid-template-columns: 1fr; }
  }
  aside h2 { font-size: 1rem; margin-top: 0; }
  .filter-group { margin-bottom: 1.75rem; }
  .filter-group h3 { font-size: 0.85rem; text-transform: uppercase; color: #777; margin-bottom: 0.5rem; }
  .filter-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; padding-block: 0.3rem; }

  .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem; }
  .toolbar select { font: inherit; padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid #ccc; }
  .results-count { color: #666; font-size: 0.9rem; }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  .p-card { border: 1px solid #eee; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
  .p-card img { width: 100%; aspect-ratio: 1; object-fit: cover; }
  .p-card .body { padding: 0.85rem; display: flex; flex-direction: column; flex: 1; }
  .p-card h3 { font-size: 0.9rem; margin: 0 0 0.35rem; }
  .p-card .price { font-weight: 700; margin-top: auto; }

  .pagination { display: flex; justify-content: center; gap: 0.4rem; margin-top: 2.5rem; }
  .pagination a, .pagination span {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 6px; text-decoration: none; color: #333; font-size: 0.9rem;
  }
  .pagination a:hover { background: #f0f0f0; }
  .pagination .current { background: #1a1a1a; color: white; }
</style>
</head>
<body>
  <div class="layout">
    <aside aria-labelledby="filters-heading">
      <h2 id="filters-heading">Filters</h2>
      <div class="filter-group">
        <h3>Category</h3>
        <label><input type="checkbox" checked> All</label>
        <label><input type="checkbox"> Kitchen</label>
        <label><input type="checkbox"> Lighting</label>
        <label><input type="checkbox"> Textiles</label>
      </div>
      <div class="filter-group">
        <h3>Price</h3>
        <label><input type="radio" name="price"> Under &#8377;1,000</label>
        <label><input type="radio" name="price"> &#8377;1,000&ndash;&#8377;3,000</label>
        <label><input type="radio" name="price"> Above &#8377;3,000</label>
      </div>
    </aside>
    <div>
      <div class="toolbar">
        <p class="results-count">Showing 12 of 48 results</p>
        <label>
          Sort by
          <select>
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </label>
      </div>
      <div class="product-grid">
        <article class="p-card">
          <img src="https://placehold.co/300x300" alt="Woven cotton table runner">
          <div class="body"><h3>Woven Table Runner</h3><span class="price">&#8377;899</span></div>
        </article>
        <article class="p-card">
          <img src="https://placehold.co/300x300" alt="Brass table lamp">
          <div class="body"><h3>Brass Table Lamp</h3><span class="price">&#8377;2,499</span></div>
        </article>
        <article class="p-card">
          <img src="https://placehold.co/300x300" alt="Ceramic serving bowl set">
          <div class="body"><h3>Ceramic Bowl Set</h3><span class="price">&#8377;1,299</span></div>
        </article>
        <article class="p-card">
          <img src="https://placehold.co/300x300" alt="Linen cushion cover">
          <div class="body"><h3>Linen Cushion Cover</h3><span class="price">&#8377;649</span></div>
        </article>
      </div>
      <nav class="pagination" aria-label="Pagination">
        <a href="#" aria-label="Previous page">&laquo;</a>
        <span class="current" aria-current="page">1</span>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#" aria-label="Next page">&raquo;</a>
      </nav>
    </div>
  </div>
</body>
</html>
```

**Explanation:** The page-level layout is Grid (`240px 1fr`) because it's a genuinely two-dimensional structural relationship — a fixed sidebar next to a flexible main area — while the product cards *within* that main area use their own nested Grid with `auto-fill` (not `auto-fit`, deliberately: `auto-fill` keeps column tracks reserved even when there are fewer items than would fill a row, which is usually what you want for a catalogue grid so partial rows don't stretch oddly — the exact `auto-fit` vs `auto-fill` distinction from Part 26, now applied in a real decision).

**Responsive behavior:** Under 800px, the outer Grid collapses to one column, meaning the filter sidebar now sits *above* the product grid rather than beside it — a genuinely reasonable mobile pattern for a first-pass responsive version (a production site would likely convert the sidebar into a collapsible off-canvas panel or bottom sheet, which needs JavaScript and is explicitly out of scope here, but is worth knowing as the "real" next step).

**Accessibility considerations:** The pagination `<nav>` has `aria-label="Pagination"` and the current page uses `aria-current="page"` on a `<span>` (not a link, since you can't/shouldn't link to the page you're already on) — `aria-current="page"` is the standard way to tell assistive technology which page is presently active without relying purely on visual styling (the dark background) to convey that.

</details>

---

### Project 12 — Blog Layout

**Project Goal:** Build a blog homepage listing multiple posts — a featured post plus a grid/list of secondary posts, testing visual hierarchy and content-driven layout decisions.

**Requirements:**
- One large "featured" post (bigger image, larger title) at the top
- A grid of secondary post previews below (image, category tag, title, excerpt, date, read time)
- A sidebar or footer newsletter signup block

**Concepts tested:** Part 25 (Grid — asymmetric layout, using `grid-column: span 2` or similar for the featured post), Part 22 (visual hierarchy through type scale).

**Hints:** For the "featured post is bigger than the rest" effect within one Grid, you have two clean options: (a) give the featured post its own Grid area entirely separate from the secondary grid (simplest, used in the solution below), or (b) put all posts in one Grid and use `grid-column: span 2; grid-row: span 2` on the featured item (Part 25's spanning technique) so it visually dominates within the same grid. Both are legitimate; (a) is easier to reason about, (b) is more "correct" CSS Grid usage for a true editorial layout.

**Challenge extensions:** Rebuild the layout using option (b) instead, and compare which is easier to maintain as you add/remove posts.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Weekly Read — Blog</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; line-height: 1.6; }
  .container { max-width: 1000px; margin-inline: auto; padding: 2.5rem 1.25rem 4rem; }
  h1.site-title { font-size: 1.5rem; margin-bottom: 2rem; }

  .featured { display: grid; grid-template-columns: 1.3fr 1fr; gap: 2rem; align-items: center; margin-bottom: 3rem; }
  @media (max-width: 700px) { .featured { grid-template-columns: 1fr; } }
  .featured img { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 12px; }
  .tag { display: inline-block; background: #eef0fb; color: #3454d1; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 999px; margin-bottom: 0.75rem; }
  .featured h2 { font-size: 1.7rem; margin: 0 0 0.6rem; line-height: 1.25; }
  .featured p.excerpt { color: #555; }
  .meta { font-size: 0.8rem; color: #888; margin-top: 1rem; }

  .post-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; }
  .post-card img { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 10px; }
  .post-card h3 { font-size: 1.05rem; margin: 0.75rem 0 0.4rem; }
  .post-card p.excerpt { color: #666; font-size: 0.88rem; margin: 0; }

  .newsletter { margin-top: 4rem; background: #f6f7fb; padding: 2.5rem; border-radius: 14px; text-align: center; }
  .newsletter h2 { margin-top: 0; font-size: 1.25rem; }
  .newsletter form { display: flex; gap: 0.6rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; }
  .newsletter input[type="email"] { font: inherit; padding: 0.6rem 0.8rem; border: 1px solid #ccc; border-radius: 8px; min-width: 240px; }
  .newsletter button { padding: 0.6rem 1.4rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>
  <div class="container">
    <h1 class="site-title">The Weekly Read</h1>
    <article class="featured">
      <div>
        <span class="tag">Design</span>
        <h2>Why Most Design Systems Fail Within a Year</h2>
        <p class="excerpt">It's rarely a tooling problem. It's almost always an adoption and maintenance problem &mdash; and the fix starts before a single component is built.</p>
        <p class="meta">By Nikhil Rao &middot; <time datetime="2026-02-02">Feb 2, 2026</time> &middot; 8 min read</p>
      </div>
      <img src="https://placehold.co/600x400" alt="Illustration of interconnected design system components">
    </article>
    <div class="post-grid">
      <article class="post-card">
        <img src="https://placehold.co/400x250" alt="Grid of colorful UI component swatches">
        <span class="tag">CSS</span>
        <h3>The `gap` Property Changed Layout Forever</h3>
        <p class="excerpt">A short history of how we used to fake spacing, and why we finally don't have to.</p>
      </article>
      <article class="post-card">
        <img src="https://placehold.co/400x250" alt="Wireframe sketches on a whiteboard">
        <span class="tag">Process</span>
        <h3>Wireframing Is Not Optional</h3>
        <p class="excerpt">Skipping straight to high-fidelity mockups costs more time than it saves.</p>
      </article>
      <article class="post-card">
        <img src="https://placehold.co/400x250" alt="Screen reader software reading a webpage">
        <span class="tag">Accessibility</span>
        <h3>Accessibility Isn't a Feature, It's a Baseline</h3>
        <p class="excerpt">Reframing a11y from "nice to have" to "the site doesn't work without it."</p>
      </article>
    </div>
    <div class="newsletter">
      <h2>Get one good article a week</h2>
      <form>
        <label class="visually-hidden" for="newsletter-email">Email address</label>
        <input type="email" id="newsletter-email" placeholder="you@example.com" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </div>
</body>
</html>
```

**Explanation:** The featured post uses its own dedicated two-column Grid (image beside text) entirely separate from the secondary post grid below it — option (a) from the hints — which keeps each layout's CSS simple and independently reasoned-about, at the cost of the featured post not being a "true" spanning member of one unified grid. This tradeoff (simplicity vs. structural purity) is a real, everyday CSS architecture decision, not a right-or-wrong one.

**Responsive behavior:** The featured post's two-column layout collapses to one column (image below text) under 700px via a dedicated media query, while the secondary post grid needs no media query at all thanks to `auto-fit`/`minmax` — again demonstrating that different parts of the same page can and should use different responsive techniques suited to their own content shape.

**Accessibility considerations:** Note the `<label class="visually-hidden">` pattern on the newsletter email input — visible instructional text ("Get one good article a week") already establishes context for sighted users, so a large visible "Email address" label would be visually redundant, but the field still needs a *programmatically* associated label for screen reader users, hence a label that's visually hidden but still present in the DOM (this uses the exact `.sr-only`/visually-hidden technique detailed in Part 49 — remember it must never be `display: none`, which would hide it from screen readers too).

</details>

---

### Project 13 — Restaurant Website

**Project Goal:** Build a small restaurant marketing site's homepage — testing rich imagery, a menu section (which genuinely is a table/list judgment call), and a reservation CTA.

**Requirements:**
- Full-bleed hero image with overlaid text (name, tagline, "Reserve a table" CTA)
- A menu preview section with dish name, description, and price, grouped by category (Starters/Mains/Desserts)
- An "hours & location" section
- Warm, editorial visual tone (not a generic SaaS look)

**Concepts tested:** Part 20 (background images, gradients as overlays), Part 22 (typography for tone/mood), Part 9 (deciding menu items are description-list-like, not a `<table>`, since there's no need for sortable rows/columns of comparable data — a `<dl>` or styled list is more appropriate).

**Hints:** For the hero text-over-image effect, layer a `linear-gradient` on top of the `background-image` (`background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(...)`) rather than adding a separate overlay `<div>` — this ensures the darkening effect is purely decorative CSS, not extra non-semantic markup, and guarantees text contrast regardless of the underlying photo's brightness.

**Challenge extensions:** Add `@media print` styles so a printed version of the menu is clean (hero image and CTA hidden, menu items formatted plainly) — direct application of Part 51.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tamarind &amp; Clove</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Georgia, serif; color: #2b2318; line-height: 1.6; }
  .hero {
    height: 60vh;
    min-height: 380px;
    background-image: linear-gradient(rgba(20,15,10,0.45), rgba(20,15,10,0.45)), url('https://placehold.co/1400x800');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 1.5rem;
  }
  .hero p.eyebrow { text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.8rem; margin: 0; }
  .hero h1 { font-size: clamp(2.25rem, 6vw, 3.75rem); margin: 0.5rem 0 1rem; font-weight: 400; }
  .hero a.btn {
    font-family: system-ui, sans-serif;
    background: #c9793a;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.75rem;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .container { max-width: 800px; margin-inline: auto; padding: 4rem 1.25rem; }
  .menu-section h2 { text-align: center; font-size: 1.5rem; margin-bottom: 2.5rem; }
  .menu-category { margin-bottom: 2.5rem; }
  .menu-category h3 { font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.08em; color: #c9793a; border-bottom: 1px solid #eadfce; padding-bottom: 0.5rem; }
  dl.menu-items { margin: 0; }
  .menu-item { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; margin-block: 1rem; }
  .menu-item dt { font-weight: 700; }
  .menu-item .price { font-family: system-ui, sans-serif; white-space: nowrap; }
  .menu-item dd { margin: 0.25rem 0 0; color: #6b5c46; font-size: 0.9rem; flex-basis: 100%; }

  .info-band { background: #2b2318; color: #f2ead9; padding: 3rem 1.25rem; text-align: center; font-family: system-ui, sans-serif; }
  .info-band h2 { font-size: 1.2rem; }

  @media print {
    .hero { display: none; }
    .info-band { background: none; color: #2b2318; }
    .hero a.btn { display: none; }
  }
</style>
</head>
<body>
  <div class="hero">
    <p class="eyebrow">Est. 2014 &middot; Mumbai</p>
    <h1>Tamarind &amp; Clove</h1>
    <a class="btn" href="#reserve">Reserve a table</a>
  </div>
  <div class="container menu-section">
    <h2>From the Kitchen</h2>
    <div class="menu-category">
      <h3>Starters</h3>
      <dl class="menu-items">
        <div class="menu-item">
          <dt>Tamarind Glazed Prawns</dt>
          <span class="price">&#8377;520</span>
          <dd>Charred tiger prawns, tamarind-jaggery glaze, crushed peanuts.</dd>
        </div>
        <div class="menu-item">
          <dt>Beet &amp; Goat Cheese Tikki</dt>
          <span class="price">&#8377;390</span>
          <dd>Roasted beet cutlets, whipped goat cheese, mint chutney.</dd>
        </div>
      </dl>
    </div>
    <div class="menu-category">
      <h3>Mains</h3>
      <dl class="menu-items">
        <div class="menu-item">
          <dt>Clove-Smoked Lamb Shank</dt>
          <span class="price">&#8377;980</span>
          <dd>Slow-braised lamb, clove jus, saffron pilaf.</dd>
        </div>
        <div class="menu-item">
          <dt>Charred Cauliflower Steak</dt>
          <span class="price">&#8377;620</span>
          <dd>Whole roasted cauliflower, almond romesco, herb oil.</dd>
        </div>
      </dl>
    </div>
  </div>
  <div class="info-band" id="reserve">
    <h2>Hours &amp; Location</h2>
    <p>Tue&ndash;Sun, 6pm&ndash;11pm &middot; 12 Clove Lane, Bandra West, Mumbai</p>
    <a class="btn" href="tel:+912212345678" style="display:inline-block;margin-top:1rem;">Call to reserve</a>
  </div>
</body>
</html>
```

**Explanation:** Menu items use `<dl>`/`<dt>`/`<dd>` (description list) rather than a `<table>` because each entry is fundamentally a term-and-description pair (dish name → its description, with price as an associated but secondary value), not tabular data meant to be scanned/sorted by column — this is a genuine, defensible judgment call worth having reasoned through explicitly rather than reaching for `<table>` by default, echoing the semantic-correctness emphasis from Part 9. The hero's gradient-over-image technique (`linear-gradient(...), url(...)` as two comma-separated `background-image` layers) guarantees white text stays legible over any photo without needing a separate overlay element in the HTML.

**Responsive behavior:** The hero uses `height: 60vh` with a `min-height` floor, so it scales proportionally with viewport height on large screens but never collapses to an uncomfortably short strip on a short mobile viewport in landscape orientation. Menu items use `flex-wrap`-style behavior via `flex-basis: 100%` on the `<dd>`, forcing the description onto its own line below the term+price row regardless of container width — a deliberately fixed wrapping choice rather than something that needs a breakpoint.

**Accessibility considerations:** The overlay gradient's opacity (0.45) was chosen specifically to guarantee sufficient contrast between the white hero text and the underlying photo across a range of typical photo brightness — a real, testable accessibility concern (Part 19's contrast guidance) that's easy to overlook when "it just needs to look nice." The print stylesheet actively removes the hero and CTA button (irrelevant/non-functional on paper) rather than simply leaving them in, respecting the print-specific content-relevance principle from Part 51.

</details>

---

### Project 14 — Documentation Page

**Project Goal:** Build a technical documentation page layout — the structure behind nearly every real software docs site (think API references, framework guides).

**Requirements:**
- A fixed/sticky left sidebar with a nested table-of-contents navigation
- A main content column with headings, code blocks, tables, and inline `<code>`
- An optional right-hand "on this page" mini table-of-contents that highlights the currently visible section (structure only; scroll-spy needs JS)
- Clear visual distinction between prose, code, and notes/callouts

**Concepts tested:** Part 25 (3-column Grid: nav / content / on-page-toc), Part 27 (`position: sticky` sidebars), Part 9 (real data tables — this is the correct use case for `<table>`), Part 52 (CSS for large documents).

**Hints:** This is the canonical case for a real `<table>` (an API parameters table: name/type/required/description columns are genuinely tabular, comparable data) — contrast this deliberately against Project 13's menu, which was *not* tabular data despite superficial similarity (rows of items with prices). The distinguishing question, per Part 9: would a user meaningfully want to compare values *across* a column? For an API params table, yes (scan the "required" column). For a restaurant menu, no.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>API Reference — createUser()</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; line-height: 1.65; }
  .docs-layout {
    display: grid;
    grid-template-columns: 220px 1fr 200px;
    gap: 2.5rem;
    max-width: 1200px;
    margin-inline: auto;
    padding: 2rem 1.25rem;
  }
  @media (max-width: 1000px) { .docs-layout { grid-template-columns: 220px 1fr; } .toc-right { display: none; } }
  @media (max-width: 700px) { .docs-layout { grid-template-columns: 1fr; } .sidebar { display: none; } }

  .sidebar, .toc-right { position: sticky; top: 1.5rem; align-self: start; font-size: 0.85rem; }
  .sidebar nav ul, .toc-right ul { list-style: none; padding: 0; margin: 0; }
  .sidebar nav > ul > li { margin-bottom: 0.75rem; }
  .sidebar nav strong { display: block; font-size: 0.75rem; text-transform: uppercase; color: #888; margin-bottom: 0.4rem; }
  .sidebar a, .toc-right a { color: #444; text-decoration: none; display: block; padding-block: 0.2rem; }
  .sidebar a:hover, .toc-right a:hover { color: #3454d1; }
  .sidebar ul ul { padding-left: 0.9rem; margin-top: 0.3rem; }

  main h1 { font-size: 1.6rem; }
  main h2 { font-size: 1.2rem; margin-top: 2.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.4rem; }
  main p code, main li code { background: #f2f2f2; color: #b8114a; padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.88em; }
  pre { background: #1e1e2e; color: #ddd; padding: 1rem 1.2rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; }

  table { border-collapse: collapse; width: 100%; margin-block: 1.5rem; font-size: 0.88rem; }
  th, td { text-align: left; padding: 0.6rem 0.75rem; border-bottom: 1px solid #eee; }
  th { color: #888; font-weight: 600; font-size: 0.78rem; text-transform: uppercase; }
  td code { font-size: 0.82em; }

  .note {
    background: #eef0fb;
    border-left: 4px solid #3454d1;
    padding: 0.9rem 1.1rem;
    border-radius: 0 8px 8px 0;
    font-size: 0.9rem;
    margin-block: 1.5rem;
  }
</style>
</head>
<body>
  <div class="docs-layout">
    <aside class="sidebar">
      <nav aria-label="Documentation sections">
        <ul>
          <li><strong>Getting Started</strong>
            <ul><li><a href="#install">Installation</a></li><li><a href="#auth">Authentication</a></li></ul>
          </li>
          <li><strong>Users API</strong>
            <ul><li><a href="#create-user">createUser()</a></li><li><a href="#get-user">getUser()</a></li></ul>
          </li>
        </ul>
      </nav>
    </aside>
    <main id="create-user">
      <h1><code>createUser()</code></h1>
      <p>Creates a new user record and returns the created object.</p>
      <div class="note">This endpoint requires an authenticated request with the <code>users:write</code> scope.</div>
      <h2>Parameters</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>email</code></td><td>string</td><td>Yes</td><td>The user's email address.</td></tr>
          <tr><td><code>name</code></td><td>string</td><td>Yes</td><td>Full display name.</td></tr>
          <tr><td><code>role</code></td><td>string</td><td>No</td><td>Defaults to <code>"member"</code>.</td></tr>
        </tbody>
      </table>
      <h2>Example</h2>
      <pre><code>const user = await client.users.create({
  email: "priya@example.com",
  name: "Priya Sharma"
});</code></pre>
    </main>
    <aside class="toc-right">
      <strong style="display:block;font-size:0.75rem;text-transform:uppercase;color:#888;margin-bottom:0.4rem;">On this page</strong>
      <ul>
        <li><a href="#create-user">Overview</a></li>
        <li><a href="#create-user">Parameters</a></li>
      </ul>
    </aside>
  </div>
</body>
</html>
```

**Explanation:** This is the deliberate counter-example to Project 13's menu: the parameters table (`name`/`type`/`required`/`description`) genuinely is tabular data — a real user of these docs scans down the "Required" column to see what's mandatory, which is the exact use case `<table>` with `<th>` headers is built for, complete with the implicit row/column relationship that gives assistive technology enough structure to announce "Required: Yes" when a screen reader user navigates to that cell. Three sticky columns (`220px 1fr 200px`) each use `position: sticky; top: 1.5rem; align-self: start` — the `align-self: start` matters because without it, a Grid item defaults to `stretch`, which would make the sticky element as tall as the tallest grid row and break the sticky-scroll effect.

**Responsive behavior:** Two separate breakpoints progressively remove columns rather than collapsing everything at once: under 1000px the right "on this page" column disappears (least essential), and under 700px the left navigation disappears too (main content becomes the sole column) — a graceful degradation pattern rather than an abrupt one-size, reflecting how real documentation sites actually behave on mobile.

**Accessibility considerations:** The sidebar nav is a real nested `<ul>` structure with an `aria-label` distinguishing it from any other navigation on the page. The data table uses proper `<thead>`/`<tbody>`/`<th>` structure (not just styled `<td>`s for the header row), which is what gives screen readers the ability to announce column headers when navigating table cells — a distinction covered in depth in Part 9.

</details>

---

### Project 15 — Pricing Page (Full Page, Toggle-Ready)

**Project Goal:** Extend Project 4's pricing table into a full pricing *page* with a page header, an FAQ section, and a monthly/yearly billing toggle (structured statically, JS-ready).

**Requirements:**
- Page header with title and a monthly/yearly toggle control (a styled checkbox or radio pair functioning as a switch)
- The 3-tier pricing cards from Project 4
- An FAQ accordion-style list (structure only — can use native `<details>`/`<summary>` for genuinely functional accordion behavior without any JS at all)

**Concepts tested:** Part 24/25 (card layout, reused), native `<details>`/`<summary>` (an HTML feature covered implicitly in Part 11 and useful here as a zero-JS accordion), Part 32 (toggle switch styled from a checkbox).

**Hints:** `<details>` and `<summary>` give you a fully functional, keyboard-accessible, zero-JavaScript accordion for free — this is one of the most underused native HTML features for exactly this FAQ use case, and is more robust out of the box than a hand-rolled JS accordion (it has correct keyboard behavior, correct ARIA semantics, and correct default styling baked into the browser).

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pricing</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; }
  .container { max-width: 900px; margin-inline: auto; padding: 3rem 1.25rem 5rem; }
  header { text-align: center; margin-bottom: 2.5rem; }
  header h1 { font-size: 2rem; margin-bottom: 1.5rem; }

  .toggle-row { display: inline-flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 600; }
  .switch { position: relative; width: 46px; height: 26px; }
  .switch input { opacity: 0; width: 100%; height: 100%; position: absolute; margin: 0; cursor: pointer; }
  .switch .track { position: absolute; inset: 0; background: #ccc; border-radius: 999px; transition: background-color 0.15s ease; }
  .switch .thumb { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.15s ease; }
  .switch input:checked ~ .track { background: #3454d1; }
  .switch input:checked ~ .thumb { transform: translateX(20px); }
  .switch input:focus-visible ~ .track { outline: 2px solid #3454d1; outline-offset: 2px; }

  .pricing { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
  .tier { display: flex; flex-direction: column; background: white; border: 1px solid #e3e3e3; border-radius: 14px; padding: 2rem 1.5rem; width: 260px; }
  .tier.popular { border: 2px solid #3454d1; }
  .tier .price { font-size: 1.9rem; font-weight: 800; margin: 0.5rem 0 1.25rem; }
  .tier ul { list-style: none; padding: 0; margin: 0 0 1.5rem; flex: 1; font-size: 0.9rem; }
  .tier li { padding-block: 0.35rem; }
  .tier button { margin-top: auto; padding: 0.65rem; border-radius: 8px; border: none; background: #eee; font-weight: 600; cursor: pointer; }
  .tier.popular button { background: #3454d1; color: white; }

  .faq { max-width: 640px; margin: 4rem auto 0; }
  .faq h2 { text-align: center; margin-bottom: 1.5rem; }
  details { border-bottom: 1px solid #eee; padding-block: 1rem; }
  summary { cursor: pointer; font-weight: 600; }
  details p { color: #555; margin: 0.75rem 0 0; font-size: 0.92rem; }
</style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Simple, transparent pricing</h1>
      <label class="toggle-row">
        Monthly
        <span class="switch">
          <input type="checkbox" aria-label="Toggle yearly billing">
          <span class="track"></span>
          <span class="thumb"></span>
        </span>
        Yearly <span style="color:#2fa84f;">(save 20%)</span>
      </label>
    </header>
    <div class="pricing">
      <article class="tier">
        <h2>Basic</h2>
        <p class="price">&#8377;499<span style="font-size:0.9rem;font-weight:400;color:#777;">/mo</span></p>
        <ul><li>1 project</li><li>5 GB storage</li></ul>
        <button type="button">Choose Basic</button>
      </article>
      <article class="tier popular">
        <h2>Pro</h2>
        <p class="price">&#8377;1,499<span style="font-size:0.9rem;font-weight:400;color:#777;">/mo</span></p>
        <ul><li>Unlimited projects</li><li>100 GB storage</li><li>Priority support</li></ul>
        <button type="button">Choose Pro</button>
      </article>
    </div>
    <section class="faq">
      <h2>Frequently asked questions</h2>
      <details>
        <summary>Can I change plans later?</summary>
        <p>Yes, you can upgrade or downgrade at any time from your account settings. Changes take effect immediately.</p>
      </details>
      <details>
        <summary>Is there a free trial?</summary>
        <p>All plans include a 14-day free trial, no credit card required.</p>
      </details>
      <details>
        <summary>What payment methods do you accept?</summary>
        <p>We accept all major credit cards, UPI, and net banking for customers in India.</p>
      </details>
    </section>
  </div>
</body>
</html>
```

**Explanation:** The toggle switch is a real `<input type="checkbox">` visually restyled to look like an iOS-style switch — `opacity: 0` on the actual input keeps it functionally present (clickable, focusable, keyboard-operable via Space) and layered on top of two decorative `<span>` elements (`.track`, `.thumb`) that are styled with the sibling combinator (`input:checked ~ .track`) to visually represent its checked state. This is a far more robust pattern than building a fake "switch" purely out of `<div>`s and JS click handlers, because it inherits all of a real checkbox's native keyboard and accessibility behavior for free. The FAQ section needs zero custom JavaScript at all — `<details>`/`<summary>` is natively interactive, keyboard-operable (Enter/Space toggles it when focused), and even has correct default ARIA semantics (`role="group"` with expanded state) built into the browser.

**Responsive behavior:** `flex-wrap: wrap` on `.pricing` lets the two cards stack naturally on narrow viewports without a dedicated media query, consistent with the pattern from Project 4.

**Accessibility considerations:** The checkbox retains `aria-label="Toggle yearly billing"` since its visual "Monthly ... Yearly" labels sit outside the checkbox itself as plain text, not as a `<label for>` association — the `aria-label` ensures a screen reader still announces a meaningful name for the control itself. `:focus-visible` on the switch's track ensures keyboard users see exactly where focus is, which is easy to accidentally lose when heavily re-styling a native input like this.

</details>

---

### Project 16 — Dashboard Layout

**Project Goal:** Build an admin/analytics dashboard shell — sidebar navigation, a top bar, and a main content area with stat cards and a placeholder chart panel. This is genuinely one of the most common real-world layout types in professional frontend work.

**Requirements:**
- Fixed/persistent left sidebar with nav icons+labels and an active-state indicator
- Top bar with page title, search input, and user avatar/menu
- A row of stat cards (metric name, big number, small trend indicator)
- A larger content panel below (placeholder for a chart)
- Layout must handle a collapsed/icon-only sidebar state at narrow widths

**Concepts tested:** Part 25 (full-page Grid: sidebar + topbar + main, using `grid-template-areas` from Part 25 — genuinely the cleanest tool for this exact shape), Part 27 (fixed/sticky positioning), Part 38 (custom properties for a consistent dashboard theme).

**Hints:** `grid-template-areas` is built for precisely this "app shell" shape (sidebar, header, main, all named regions) — define the full-page grid once with named areas (`"sidebar topbar" "sidebar main"`) and assign each region via `grid-area`, which reads far more clearly than juggling raw line numbers for a layout this structurally important.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard</title>
<style>
  :root { --sidebar-w: 220px; --accent: #3454d1; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; background: #f6f7fb; }

  .app-shell {
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-rows: 64px 1fr;
    grid-template-areas: "sidebar topbar" "sidebar main";
    min-height: 100vh;
  }
  @media (max-width: 800px) {
    .app-shell { grid-template-columns: 72px 1fr; }
    .sidebar .label { display: none; }
  }

  .sidebar {
    grid-area: sidebar;
    background: #14142b;
    color: #c7c9e0;
    padding: 1.25rem 0.75rem;
    position: sticky;
    top: 0;
    height: 100vh;
  }
  .sidebar .logo { color: white; font-weight: 800; padding: 0 0.5rem 1.5rem; font-size: 1.1rem; }
  .sidebar nav a {
    display: flex; align-items: center; gap: 0.75rem;
    color: inherit; text-decoration: none;
    padding: 0.6rem 0.5rem; border-radius: 8px; font-size: 0.9rem; margin-bottom: 0.15rem;
  }
  .sidebar nav a .icon { width: 20px; text-align: center; flex-shrink: 0; }
  .sidebar nav a:hover { background: #23234a; }
  .sidebar nav a[aria-current="page"] { background: var(--accent); color: white; }

  .topbar {
    grid-area: topbar;
    background: white;
    border-bottom: 1px solid #e6e6ee;
    display: flex; align-items: center; justify-content: space-between;
    padding-inline: 1.5rem;
    position: sticky; top: 0; z-index: 5;
  }
  .topbar h1 { font-size: 1.1rem; margin: 0; }
  .topbar input[type="search"] { font: inherit; padding: 0.4rem 0.75rem; border: 1px solid #ddd; border-radius: 8px; width: 220px; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; }

  main { grid-area: main; padding: 1.75rem; }
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem; }
  .stat-card { background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 4px rgb(0 0 0 / 5%); }
  .stat-card .label { font-size: 0.78rem; color: #888; text-transform: uppercase; }
  .stat-card .value { font-size: 1.6rem; font-weight: 800; margin: 0.3rem 0; }
  .stat-card .trend { font-size: 0.8rem; }
  .trend.up { color: #2fa84f; }
  .trend.down { color: #d1345a; }

  .panel { background: white; border-radius: 12px; padding: 1.5rem; height: 320px; display: flex; align-items: center; justify-content: center; color: #999; }
</style>
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">Nimbus</div>
      <nav aria-label="Primary">
        <a href="#" aria-current="page"><span class="icon" aria-hidden="true">&#9632;</span><span class="label">Overview</span></a>
        <a href="#"><span class="icon" aria-hidden="true">&#9673;</span><span class="label">Analytics</span></a>
        <a href="#"><span class="icon" aria-hidden="true">&#9776;</span><span class="label">Orders</span></a>
        <a href="#"><span class="icon" aria-hidden="true">&#9881;</span><span class="label">Settings</span></a>
      </nav>
    </aside>
    <header class="topbar">
      <h1>Overview</h1>
      <div style="display:flex; align-items:center; gap:1rem;">
        <label class="visually-hidden" for="dash-search">Search</label>
        <input type="search" id="dash-search" placeholder="Search&hellip;">
        <div class="avatar" aria-hidden="true">RD</div>
      </div>
    </header>
    <main>
      <div class="stat-grid">
        <div class="stat-card"><p class="label">Revenue</p><p class="value">&#8377;4.2L</p><p class="trend up">&#8593; 12.4%</p></div>
        <div class="stat-card"><p class="label">Orders</p><p class="value">1,204</p><p class="trend up">&#8593; 4.1%</p></div>
        <div class="stat-card"><p class="label">Refund Rate</p><p class="value">1.8%</p><p class="trend down">&#8595; 0.3%</p></div>
        <div class="stat-card"><p class="label">Active Users</p><p class="value">8,930</p><p class="trend up">&#8593; 9.7%</p></div>
      </div>
      <div class="panel">Chart placeholder</div>
    </main>
  </div>
</body>
</html>
```

**Explanation:** `grid-template-areas: "sidebar topbar" "sidebar main"` reads almost like ASCII art of the actual layout, which is precisely why `grid-template-areas` exists — compare this to achieving the same shape with raw `grid-column`/`grid-row` line numbers, which would be functionally identical but far less self-documenting six months later when you or a teammate revisit this file. The sidebar collapses to icon-only at 800px by shrinking `--sidebar-w`-equivalent column width to `72px` and hiding `.label` text — the icons (as Unicode glyphs here, real icon fonts/SVGs in production) remain, preserving basic navigability in a compact form rather than hiding navigation entirely.

**Responsive behavior:** Both the sidebar's column width and its label visibility change together at the same 800px breakpoint, which matters — changing only the column width without hiding the labels would either truncate/wrap the label text awkwardly or overflow the narrowed sidebar, so the two changes are deliberately coupled in the same media query rather than split across two.

**Accessibility considerations:** `aria-current="page"` marks the active sidebar link (not just a visual color difference), giving assistive technology users the same "you are here" signal sighted users get from the highlighted background. Decorative icon glyphs are `aria-hidden="true"` since the adjacent text label (or, on desktop, the visible label) already conveys the link's purpose — without this, a screen reader would announce a confusing raw glyph character before every nav item's actual label.

</details>

---

### Project 17 — Photo Gallery

**Project Goal:** Build a responsive photo gallery/masonry-style grid — testing `object-fit`, aspect-ratio control, and a lightweight lightbox-ready structure.

**Requirements:**
- A responsive grid of images at varying aspect ratios that still lines up cleanly (no ragged/broken rows)
- Hover state revealing a caption overlay
- Images must never distort (correct `object-fit` usage throughout)
- Structure ready for a future JS-powered lightbox (each image wrapped in a link/button pointing to a full-size version)

**Concepts tested:** Part 6/Part 41 (`object-fit`, `aspect-ratio`), Part 25 (Grid, potentially with `grid-auto-flow: dense` for a masonry-like effect), Part 32 (hover overlay transitions).

**Hints:** True masonry (variable-height rows with no gaps) isn't yet reliably available in plain CSS Grid without `grid-template-rows: masonry` (an experimental, not-universally-supported value as of this course's writing) — the practical, well-supported approach is a uniform grid where every image is forced to the *same* aspect ratio via `aspect-ratio` + `object-fit: cover`, which looks clean and grid-aligned rather than a true Pinterest-style masonry. Build that version; note the masonry alternative as a "when broader support lands" upgrade path.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Photo Gallery</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; background: #111; }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .photo {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 4px;
  }
  .photo img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }
  .photo:hover img { transform: scale(1.06); }
  .caption {
    position: absolute;
    inset: auto 0 0 0;
    padding: 0.6rem 0.75rem;
    background: linear-gradient(transparent, rgb(0 0 0 / 75%));
    color: white;
    font-size: 0.8rem;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .photo:hover .caption,
  .photo:focus-visible .caption { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    .photo img, .caption { transition: none; }
    .photo:hover img { transform: none; }
  }
  .photo:focus-visible { outline: 3px solid #3454d1; outline-offset: 2px; }
</style>
</head>
<body>
  <div class="gallery">
    <a class="photo" href="/full/1.jpg">
      <img src="https://placehold.co/500x500" alt="Sunlight through banyan tree leaves in a Mumbai park">
      <span class="caption">Banyan grove, Shivaji Park</span>
    </a>
    <a class="photo" href="/full/2.jpg">
      <img src="https://placehold.co/500x600" alt="Fishing boats at dawn on a Konkan beach">
      <span class="caption">Dawn, Konkan coast</span>
    </a>
    <a class="photo" href="/full/3.jpg">
      <img src="https://placehold.co/500x500" alt="Street vendor preparing vada pav at a busy stall">
      <span class="caption">Vada pav stall, Dadar</span>
    </a>
    <a class="photo" href="/full/4.jpg">
      <img src="https://placehold.co/500x400" alt="Monsoon clouds over the Bandra-Worli Sea Link">
      <span class="caption">Monsoon over the Sea Link</span>
    </a>
  </div>
</body>
</html>
```

**Explanation:** Every `.photo` is forced to `aspect-ratio: 1` (a perfect square) regardless of the source image's native proportions, and `object-fit: cover` on the `<img>` inside crops (never stretches or distorts) each photo to fill that square — this is exactly the technique from Part 41's `object-fit` coverage, applied here to guarantee a clean, gap-free, grid-aligned gallery even when source photos have wildly different native aspect ratios (a portrait shot, a landscape shot, a square shot — all render identically sized). The caption overlay's gradient (`linear-gradient(transparent, rgb(0 0 0 / 75%))`) darkens only the bottom portion of each photo, keeping the caption text legible without darkening the whole image.

**Responsive behavior:** `repeat(auto-fill, minmax(220px, 1fr))` handles column count at every viewport width automatically, and because every grid item shares the same forced `aspect-ratio`, rows always stay perfectly aligned — there's no risk of the "ragged bottom row" problem that can occur with variable-height Grid items.

**Accessibility considerations:** Each photo is wrapped in a real `<a>` (anchor to a full-size version), so it's keyboard-focusable by default, and the caption overlay is deliberately triggered on `:focus-visible` as well as `:hover` (`.photo:hover .caption, .photo:focus-visible .caption`) — a hover-only reveal would make the caption completely inaccessible to keyboard-only users, a common real-world bug this solution avoids explicitly. `alt` text describes each specific photo's actual content rather than a generic "gallery photo."

</details>

---

### Project 18 — Responsive Navbar

**Project Goal:** Build a fully responsive navigation bar with a mobile hamburger menu — one of the single most common real components, and a genuinely good test of the CSS-only checkbox-hack pattern (structure only; note where real production code would use JS instead).

**Requirements:**
- Desktop: horizontal nav links + logo + CTA button
- Mobile: logo + hamburger icon that reveals a full-height or dropdown menu panel
- Menu open/close state built with a checkbox toggle (CSS-only, no JS) for demonstration — but the writeup must note this is a teaching technique, not a production recommendation

**Concepts tested:** Part 24 (Flexbox nav), Part 26 (responsive nav pattern — this exact case is covered conceptually in Part 26/29), the checkbox-hack pattern combining `:checked` + general sibling combinator.

**Hints:** The "checkbox hack" works by pairing a hidden `<input type="checkbox">`, a `<label>` styled as the hamburger icon (clicking a label toggles its associated checkbox), and CSS that changes the menu panel's visibility based on `input:checked ~ .menu-panel`. It's a legitimate, genuinely zero-JS technique — but be honest about its real limitations: no Escape-to-close, imperfect screen-reader semantics (a checkbox isn't semantically "a menu button"), which is exactly why production code typically uses a real `<button aria-expanded>` wired to JS instead. Build the CSS-only version for the exercise, but read the explanation below for what changes in real production code.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Responsive Navbar</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; }
  .navbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
    position: relative;
  }
  .logo { font-weight: 800; }
  .nav-links {
    display: flex; gap: 1.5rem; align-items: center; list-style: none; margin: 0; padding: 0;
  }
  .nav-links a { text-decoration: none; color: #333; font-size: 0.9rem; }
  .nav-links .btn { background: #1a1a1a; color: white; padding: 0.5rem 1.1rem; border-radius: 8px; }

  #menu-toggle { display: none; }
  .hamburger { display: none; cursor: pointer; padding: 0.4rem; }
  .hamburger span { display: block; width: 22px; height: 2px; background: #1a1a1a; margin: 4px 0; transition: transform 0.2s ease, opacity 0.2s ease; }

  @media (max-width: 700px) {
    .hamburger { display: block; }
    .nav-links {
      position: absolute;
      top: 100%; left: 0; right: 0;
      flex-direction: column;
      align-items: stretch;
      background: white;
      border-bottom: 1px solid #eee;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.25s ease;
      gap: 0;
    }
    .nav-links li { padding: 0.9rem 1.5rem; border-top: 1px solid #f0f0f0; }
    #menu-toggle:checked ~ .nav-links { max-height: 300px; }
    #menu-toggle:checked ~ .hamburger span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    #menu-toggle:checked ~ .hamburger span:nth-child(2) { opacity: 0; }
    #menu-toggle:checked ~ .hamburger span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  }
</style>
</head>
<body>
  <nav class="navbar">
    <span class="logo">Flowbase</span>
    <input type="checkbox" id="menu-toggle">
    <label class="hamburger" for="menu-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </label>
    <ul class="nav-links">
      <li><a href="#">Features</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#">About</a></li>
      <li><a class="btn" href="#">Sign up</a></li>
    </ul>
  </nav>
</body>
</html>
```

**Explanation:** The hidden checkbox's checked state drives the menu panel's `max-height` (animating from `0` to `300px` gives a smooth open/close, since you can't `transition` to/from `height: auto` directly, but `max-height` with a generous fixed ceiling works as the standard workaround) via the general sibling combinator `#menu-toggle:checked ~ .nav-links`. The three hamburger bars animate into an "X" shape purely with `transform`/`opacity` changes driven by the same checked state — no JavaScript anywhere in this file.

**Why production code differs:** This CSS-only pattern is genuinely useful as a teaching example of what selectors and the cascade alone can accomplish, but it has real, known limitations worth stating plainly rather than glossing over: (1) a checkbox has no semantic meaning as "a menu," so screen readers announce it as a plain checkbox, not an expandable menu control — the correct production pattern uses a real `<button aria-expanded="false" aria-controls="nav-menu">` toggled by a small amount of JavaScript that flips `aria-expanded` and toggles a class; (2) there's no way to close the menu on <kbd>Escape</kbd> or on an outside click without JavaScript; (3) focus management (moving focus into the open menu, trapping it there) requires JavaScript entirely. This project is worth building precisely *because* it makes these gaps concrete rather than abstract — you'll feel exactly where CSS's reach ends.

**Responsive behavior:** Under 700px, the horizontal nav becomes a vertical dropdown panel anchored via `position: absolute; top: 100%` directly below the navbar, which requires the `.navbar` itself to be `position: relative` (present here) so the dropdown positions relative to the navbar rather than the whole page.

**Accessibility considerations:** As explained above, this specific pattern has a real, acknowledged accessibility gap (checkbox semantics standing in for button/menu semantics) — flagged deliberately rather than silently presented as production-ready, in keeping with this course's commitment to never overstate a technique's real-world readiness.

</details>

---

## Advanced Projects (19–28)

These combine multiple techniques from every earlier tier into single, larger builds closer to real production components. Explanations here focus on what's *new* relative to earlier projects — cross-reference Projects 1–18 and the relevant Parts for anything not re-explained.

### Project 19 — SaaS Landing Page (Multi-Section)

**Project Goal:** Extend Project 9 into a longer, more complete marketing page: hero, logo cloud (social proof), features (alternating image/text), testimonials, pricing (reuse Project 15), FAQ (reuse Project 15's `<details>` pattern), final CTA, full footer.

**Requirements:** All sections from Project 9 plus a logo/social-proof strip, an alternating "feature spotlight" section (image left/text right, then flipped for the next feature), and a testimonial carousel-style row (static, no JS carousel — just a scrollable or wrapped row).

**Concepts tested:** Everything from Project 9, plus Part 25's `grid-template-columns` reordering via source order for the alternating layout, and `scroll-snap` (Part 27/34) for a lightweight, JS-free horizontal testimonial scroller.

**Hints:** For the alternating feature sections, the cleanest approach is: give each section the *same* two-column grid, and alternate which HTML element (image vs. text) comes first in the source for each section — then use `:nth-of-type(even) { direction: rtl }` trick or simply write the HTML in the opposite order for alternating sections (simpler and more explicit; avoid the `direction` trick for maintainability, since it silently affects text alignment of children too — a real gotcha worth knowing about rather than using blindly).

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flowbase — Full Landing Page</title>
<style>
  :root { --accent: #3454d1; --text: #1a1a1a; --muted: #666; --bg-alt: #f6f7fb; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); line-height: 1.6; }
  a { color: inherit; text-decoration: none; }
  .container { max-width: 1100px; margin-inline: auto; padding-inline: 1.25rem; }
  section { padding-block: 4rem; }

  .hero { text-align: center; padding-block: 5rem 3rem; }
  .hero h1 { font-size: clamp(2rem, 5vw, 3.25rem); max-width: 18ch; margin-inline: auto; }
  .hero p { color: var(--muted); max-width: 50ch; margin: 1.25rem auto 2rem; }
  .btn { display: inline-block; background: var(--accent); color: white; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 600; }

  .logo-cloud { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; opacity: 0.5; font-weight: 700; padding-block: 2rem; }

  .feature-row { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
  @media (max-width: 700px) { .feature-row { grid-template-columns: 1fr; } .feature-row .text-order-2 { order: 2; } }
  .feature-row.reverse .text-block { order: 2; }
  .feature-row img { width: 100%; border-radius: 12px; }
  .feature-row h2 { font-size: 1.5rem; }
  .feature-row p { color: var(--muted); }

  .testimonials { background: var(--bg-alt); }
  .testimonial-scroll {
    display: flex; gap: 1.25rem; overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 1rem;
  }
  .testimonial-card {
    scroll-snap-align: start;
    flex: 0 0 300px;
    background: white; border-radius: 12px; padding: 1.5rem;
  }
  .testimonial-card p { font-style: italic; color: #444; }
  .testimonial-card .who { font-weight: 700; font-size: 0.85rem; margin-top: 1rem; }

  .cta-band { background: var(--text); color: white; text-align: center; }

  footer { padding-block: 3rem; font-size: 0.85rem; color: var(--muted); text-align: center; }
</style>
</head>
<body>
  <section class="hero container">
    <h1>Project management your team will actually use</h1>
    <p>Flowbase brings tasks, docs, and conversations into one place.</p>
    <a class="btn" href="#">Start free trial</a>
  </section>

  <div class="logo-cloud container" aria-hidden="true">
    <span>ACME</span><span>Northwind</span><span>Initech</span><span>Globex</span>
  </div>

  <section class="feature-row container">
    <img src="https://placehold.co/500x350" alt="Screenshot of the Flowbase task board">
    <div class="text-block">
      <h2>Boards that stay in sync</h2>
      <p>Every update reflects instantly across list, board, and calendar views &mdash; no manual refresh, no stale data.</p>
    </div>
  </section>

  <section class="feature-row reverse container">
    <img src="https://placehold.co/500x350" alt="Screenshot of Flowbase shared docs">
    <div class="text-block">
      <h2>Docs, right next to the work</h2>
      <p>Write specs beside the tasks they describe, so context never gets lost across five different tools.</p>
    </div>
  </section>

  <section class="testimonials">
    <div class="container">
      <h2 style="text-align:center;">Loved by teams everywhere</h2>
      <div class="testimonial-scroll">
        <div class="testimonial-card"><p>"We cut our stand-up time in half within a week."</p><p class="who">Anjali M., Eng Lead</p></div>
        <div class="testimonial-card"><p>"Finally a tool the whole team actually opens daily."</p><p class="who">Rohan T., PM</p></div>
        <div class="testimonial-card"><p>"The docs integration alone was worth switching for."</p><p class="who">Sara K., Designer</p></div>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <h2>Ready to try Flowbase?</h2>
    <a class="btn" href="#">Start your free trial</a>
  </section>

  <footer>&copy; 2026 Flowbase Inc.</footer>
</body>
</html>
```

**Explanation:** The alternating feature sections use the simpler, more maintainable approach flagged in the hints: `.feature-row.reverse .text-block { order: 2 }` uses Flexbox/Grid's `order` property (Part 24/25) to visually swap which column the text sits in without reordering the actual HTML source — meaning the reading/DOM order stays consistent (image mentioned first, text second, in the source, every time) while the *visual* order alternates, which is good for maintainability but is a tradeoff worth naming (see accessibility note below). The testimonial row uses `scroll-snap-type: x mandatory` + `scroll-snap-align: start` on each card — a genuinely production-grade, zero-JavaScript horizontal snap-scroller, the same technique introduced in Part 34.

**Responsive behavior:** Under 700px, both `.feature-row` variants collapse to a single column; note the extra rule needed (`.feature-row .text-order-2 { order: 2 }` guard) if you want the *reversed* section's `order` to reset back to natural document order on mobile rather than staying visually reversed in a single-column layout where "left/right" no longer applies — worth testing explicitly rather than assuming `order` "just works" the same way at every breakpoint.

**Accessibility considerations:** Using `order` to visually reverse content while keeping DOM order constant is a deliberate, known accessibility tradeoff (flagged back in Part 24): a screen reader user (who navigates by DOM/reading order, not visual order) always hears "image description, then heading, then paragraph" in the same sequence for both feature rows, even though sighted users see the second row's text on the *left*. This is usually fine (order still makes logical sense either way) but is exactly the kind of visual-vs-DOM-order mismatch worth being conscious of rather than accidental.

</details>

---

### Project 20 — E-commerce Storefront (Home + Category Page)

**Project Goal:** Combine Project 3 (product card), Project 11 (catalogue/filters), and Project 19-style hero/promo sections into a fuller storefront homepage — directly rehearsing the capstone project that follows this Part.

**Requirements:** Promo hero banner, category tile grid (image + label, clickable), a "Best Sellers" product row (reuse Project 3's card), and a footer with newsletter signup (reuse Project 12's pattern).

**Concepts tested:** Composition of Projects 3, 11, 12, 19 into one coherent page — the actual skill being rehearsed here is *assembly*: taking several already-mastered components and composing them into a single, visually coherent page with consistent spacing and typography, which is most of what real frontend work actually is day to day.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nestwell Home &mdash; Shop</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; }
  .container { max-width: 1100px; margin-inline: auto; padding-inline: 1.25rem; }
  section { padding-block: 3rem; }

  .promo { background: #eee8dd; border-radius: 16px; margin: 1.5rem auto; padding: 3rem 2rem; text-align: center; max-width: 1100px; }
  .promo h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin: 0 0 0.75rem; }
  .promo a.btn { display: inline-block; background: #1a1a1a; color: white; padding: 0.65rem 1.5rem; border-radius: 8px; font-weight: 600; margin-top: 0.5rem; }

  .categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1.25rem; }
  .cat-tile { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 1; display: block; }
  .cat-tile img { width: 100%; height: 100%; object-fit: cover; }
  .cat-tile span { position: absolute; inset: auto 0 0 0; padding: 0.6rem; background: linear-gradient(transparent, rgb(0 0 0 / 60%)); color: white; font-weight: 700; font-size: 0.9rem; }

  .product-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
  .p-card { display: flex; flex-direction: column; background: white; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
  .p-card img { width: 100%; aspect-ratio: 1; object-fit: cover; }
  .p-card .body { padding: 1rem; display: flex; flex-direction: column; flex: 1; }
  .p-card h3 { font-size: 0.95rem; margin: 0 0 0.3rem; }
  .p-card .price { font-weight: 700; margin-top: auto; }

  .newsletter { background: #f6f7fb; padding: 2.5rem; border-radius: 14px; text-align: center; }
  .newsletter form { display: flex; gap: 0.6rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; }
  .newsletter input { font: inherit; padding: 0.6rem 0.8rem; border: 1px solid #ccc; border-radius: 8px; min-width: 240px; }
  .newsletter button { padding: 0.6rem 1.4rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 600; }
</style>
</head>
<body>
  <div class="container">
    <div class="promo">
      <h1>New season, new essentials</h1>
      <p>Up to 30% off homeware, this week only.</p>
      <a class="btn" href="#">Shop the sale</a>
    </div>

    <section aria-labelledby="cat-heading">
      <h2 id="cat-heading">Shop by category</h2>
      <div class="categories">
        <a class="cat-tile" href="#"><img src="https://placehold.co/300x300" alt="Kitchenware category"><span>Kitchen</span></a>
        <a class="cat-tile" href="#"><img src="https://placehold.co/300x300" alt="Lighting category"><span>Lighting</span></a>
        <a class="cat-tile" href="#"><img src="https://placehold.co/300x300" alt="Textiles category"><span>Textiles</span></a>
        <a class="cat-tile" href="#"><img src="https://placehold.co/300x300" alt="Storage category"><span>Storage</span></a>
      </div>
    </section>

    <section aria-labelledby="bestsellers-heading">
      <h2 id="bestsellers-heading">Best sellers</h2>
      <div class="product-row">
        <article class="p-card"><img src="https://placehold.co/300x300" alt="Woven table runner"><div class="body"><h3>Woven Table Runner</h3><span class="price">&#8377;899</span></div></article>
        <article class="p-card"><img src="https://placehold.co/300x300" alt="Brass table lamp"><div class="body"><h3>Brass Table Lamp</h3><span class="price">&#8377;2,499</span></div></article>
        <article class="p-card"><img src="https://placehold.co/300x300" alt="Ceramic bowl set"><div class="body"><h3>Ceramic Bowl Set</h3><span class="price">&#8377;1,299</span></div></article>
        <article class="p-card"><img src="https://placehold.co/300x300" alt="Linen cushion cover"><div class="body"><h3>Linen Cushion Cover</h3><span class="price">&#8377;649</span></div></article>
      </div>
    </section>

    <div class="newsletter">
      <h2 style="margin-top:0;">Get 10% off your first order</h2>
      <form>
        <label class="visually-hidden" for="store-email">Email address</label>
        <input type="email" id="store-email" placeholder="you@example.com" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </div>
</body>
</html>
```

**Explanation:** This project is deliberately lighter on new CSS techniques than surrounding ones because its real point is composition discipline: notice how the same spacing rhythm (`section { padding-block: 3rem }`), the same `container` max-width pattern, and the same card structure from Project 3 are reused verbatim across category tiles and product cards — this consistency is what makes a real multi-section page feel like one coherent product rather than four different pages stapled together, and is worth noticing as a *deliberate* outcome of applying the same design tokens/patterns everywhere rather than inventing new spacing values per-section.

**Responsive behavior:** Both grids (`categories`, `product-row`) use `auto-fit`/`minmax`, so this entire page requires zero layout-related media queries — a strong signal, by this point in the course, that fluid Grid patterns should be your default reach for "a row of similar cards," with fixed breakpoints reserved for cases (like Project 16's sidebar collapse) where the layout genuinely needs to change shape, not just column count.

**Accessibility considerations:** Category tiles are full `<a>` elements (entire tile clickable, single tab stop), consistent with Project 10's project-card pattern. Both major content sections have `aria-labelledby` tying them to their own visible `<h2>`, keeping the page's landmark/heading outline meaningful for screen reader navigation across a fairly long page.

</details>

---

### Project 21 — Admin Dashboard (Data Table Focus)

**Project Goal:** Extend Project 16's dashboard shell with a real, dense data table view (a "Users" or "Orders" management screen) — testing table styling at production density, row actions, and status badges.

**Requirements:** Reuse the Project 16 app shell. Main content: a data table with sortable-looking column headers, status badges (colored pill per row), row action buttons (Edit/Delete), and a "select all" checkbox pattern in the header row.

**Concepts tested:** Part 9 (real tabular data, striping, `<th scope="col">`), Part 15 (specificity for badge color variants), Part 25 (shell reused verbatim from Project 16).

**Hints:** Use `<th scope="col">` on every header cell (not just visual bold text) — `scope` is what actually ties a header to its column programmatically for assistive technology, distinct from mere visual styling.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Users — Admin</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; background: #f6f7fb; }
  main { max-width: 1000px; margin-inline: auto; padding: 2rem 1.25rem; }
  .table-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgb(0 0 0 / 5%); }
  table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  thead th { text-align: left; padding: 0.85rem 1rem; background: #fafafa; border-bottom: 1px solid #eee; font-size: 0.75rem; text-transform: uppercase; color: #888; }
  tbody td { padding: 0.85rem 1rem; border-bottom: 1px solid #f2f2f2; }
  tbody tr:hover { background: #fafbff; }
  .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
  .badge.active { background: #e3f7e9; color: #1d7a3b; }
  .badge.pending { background: #fff4e0; color: #b3760b; }
  .badge.suspended { background: #fde3e8; color: #b3123a; }
  .row-actions { display: flex; gap: 0.5rem; }
  .row-actions button { background: none; border: 1px solid #ddd; border-radius: 6px; padding: 0.3rem 0.6rem; font-size: 0.78rem; cursor: pointer; }
  .row-actions button.danger { color: #b3123a; border-color: #f3c2ce; }
</style>
</head>
<body>
  <main>
    <h1 style="font-size:1.3rem;">Users</h1>
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" aria-label="Select all users"></th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Status</th>
            <th scope="col">Joined</th>
            <th scope="col"><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" aria-label="Select Priya Sharma"></td>
            <td>Priya Sharma</td>
            <td>priya@example.com</td>
            <td><span class="badge active">Active</span></td>
            <td>Jan 12, 2026</td>
            <td class="row-actions"><button type="button">Edit</button><button type="button" class="danger">Delete</button></td>
          </tr>
          <tr>
            <td><input type="checkbox" aria-label="Select Arjun Mehta"></td>
            <td>Arjun Mehta</td>
            <td>arjun@example.com</td>
            <td><span class="badge pending">Pending</span></td>
            <td>Feb 3, 2026</td>
            <td class="row-actions"><button type="button">Edit</button><button type="button" class="danger">Delete</button></td>
          </tr>
          <tr>
            <td><input type="checkbox" aria-label="Select Farah Khan"></td>
            <td>Farah Khan</td>
            <td>farah@example.com</td>
            <td><span class="badge suspended">Suspended</span></td>
            <td>Nov 28, 2025</td>
            <td class="row-actions"><button type="button">Edit</button><button type="button" class="danger">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</body>
</html>
```

**Explanation:** `<th scope="col">` on every header cell is what programmatically ties each column to its header for a screen reader — announcing "Status: Active" rather than just "Active" when navigating cell by cell — a distinction that's easy to skip visually (bold text alone *looks* like a header) but only `scope` (or `<th>` at all, versus a styled `<td>`) actually carries that meaning to assistive technology. Status badges use semantic *and* color coding together (the word "Active"/"Pending"/"Suspended" is always present as real text, color is a reinforcing signal, never the sole one) — directly applying the "don't rely on color alone" principle from Part 12/Project 3.

**Responsive behavior:** This table is deliberately left as a horizontally-scrolling table on narrow viewports (no responsive collapse logic added) — a legitimate, common real-world choice for dense admin data tables, where converting to stacked "cards" per row (a common responsive-table technique) often sacrifices scannability that admin users specifically rely on; wrapping the `.table-card` in `overflow-x: auto` would be the one-line addition for graceful narrow-viewport scrolling, left as a natural extension.

**Accessibility considerations:** Each row's "select" checkbox has a specific, per-row `aria-label` ("Select Priya Sharma") rather than a generic "Select row" repeated identically on every checkbox — meaningfully distinct labels matter because a screen reader user tabbing through a list of otherwise-identical "Select row" checkboxes has no way to tell them apart without also checking the visible row content each time.

</details>

---

### Project 22 — Analytics Dashboard (Complex Grid)

**Project Goal:** Build a denser analytics dashboard main-content area: multiple stat cards, a large chart panel, and two smaller side panels — testing asymmetric Grid composition at the component level (not just the page-shell level from Project 16/21).

**Requirements:** A Grid layout mixing differently-sized panels (one large chart panel spanning 2 columns, two smaller panels stacked beside it) — genuinely asymmetric, magazine-style Grid composition.

**Concepts tested:** Part 25 (`grid-column: span 2`, `grid-row: span 2`, explicit line-based placement for irregular layouts).

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Analytics</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; background: #f6f7fb; }
  main { max-width: 1000px; margin-inline: auto; padding: 2rem 1.25rem; }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 110px;
    gap: 1.25rem;
  }
  .panel { background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 4px rgb(0 0 0 / 5%); }
  .stat { grid-column: span 1; display: flex; flex-direction: column; justify-content: center; }
  .stat .label { font-size: 0.75rem; color: #888; text-transform: uppercase; }
  .stat .value { font-size: 1.5rem; font-weight: 800; }
  .chart { grid-column: span 3; grid-row: span 3; display: flex; align-items: center; justify-content: center; color: #999; }
  .side { grid-column: span 1; grid-row: span 3; display: flex; flex-direction: column; gap: 0.75rem; }
  .side .mini { flex: 1; background: #fafbff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 0.8rem; }
  @media (max-width: 750px) {
    .grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: auto; }
    .chart, .side { grid-column: span 2; grid-row: span 1; }
    .chart { height: 260px; }
    .side { flex-direction: row; }
  }
</style>
</head>
<body>
  <main>
    <h1 style="font-size:1.3rem;">Analytics</h1>
    <div class="grid">
      <div class="panel stat"><p class="label">Sessions</p><p class="value">24.8K</p></div>
      <div class="panel stat"><p class="label">Bounce Rate</p><p class="value">38%</p></div>
      <div class="panel stat"><p class="label">Avg. Duration</p><p class="value">3m 42s</p></div>
      <div class="panel stat"><p class="label">Conversions</p><p class="value">612</p></div>
      <div class="panel chart">Traffic chart placeholder</div>
      <div class="side">
        <div class="panel mini">Top pages</div>
        <div class="panel mini">Top referrers</div>
        <div class="panel mini">Devices</div>
      </div>
    </div>
  </main>
</body>
</html>
```

**Explanation:** The 4-column, auto-row Grid places four `1-span` stat cards across the top row implicitly (Grid auto-placement fills them left to right, no explicit line numbers needed since they're all the same size), then the chart panel explicitly claims `grid-column: span 3; grid-row: span 3` and the side panel claims the remaining `span 1; span 3` — a genuinely asymmetric, editorial-style composition that would be difficult to achieve cleanly with Flexbox alone, directly demonstrating Part 25's core argument for *when* Grid is the right tool versus Flexbox (a real two-dimensional, differently-sized-regions layout, not just a wrapping row).

**Responsive behavior:** At 750px, the grid drops to 2 columns and both the chart and side panel are explicitly reset to `span 2; span 1` (full-width, single-row-height) — an explicit override rather than relying on auto-placement to "figure it out," since a naive auto-reflow of asymmetric spans at a different column count can produce visually broken, awkwardly-gapped results if left unspecified.

**Accessibility considerations:** Placeholder panel text ("Traffic chart placeholder", "Top pages") stands in for what would, in a real build, be actual chart content with proper alternative text or an accessible data table fallback — worth flagging explicitly that any real chart (SVG or canvas-rendered) needs a text-based data alternative for screen reader users, a topic belonging to a dedicated data-visualization-accessibility discussion beyond this course's HTML/CSS scope, but important to know exists.

</details>

---

### Project 23 — Product Inventory UI

**Project Goal:** Build an inventory management table+form combination — a table of stock items alongside a slide-in-style "add/edit item" panel (structured statically as an always-visible side panel here, since true slide-in requires JS, but built so the CSS transition is ready).

**Requirements:** A stock table (SKU, name, quantity with a low-stock warning badge, price, actions) beside a fixed-width form panel for adding/editing an item.

**Concepts tested:** Combines Project 21's table patterns with Project 5/7's form patterns in one composed screen — the main new skill is genuinely just careful two-region composition at production density.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inventory</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; background: #f6f7fb; }
  .layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; max-width: 1100px; margin-inline: auto; padding: 2rem 1.25rem; align-items: start; }
  @media (max-width: 850px) { .layout { grid-template-columns: 1fr; } }
  .table-card, .form-card { background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 4px rgb(0 0 0 / 5%); }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { text-align: left; padding: 0.6rem 0.5rem; font-size: 0.72rem; text-transform: uppercase; color: #888; border-bottom: 1px solid #eee; }
  td { padding: 0.6rem 0.5rem; border-bottom: 1px solid #f2f2f2; }
  .low-stock { color: #b3123a; font-weight: 700; }
  .low-stock::after { content: " \26A0"; }
  .form-card h2 { font-size: 1rem; margin-top: 0; }
  .form-card .field { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.9rem; }
  .form-card label { font-size: 0.8rem; font-weight: 600; }
  .form-card input { font: inherit; padding: 0.5rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; }
  .form-card button { width: 100%; padding: 0.6rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 600; }
</style>
</head>
<body>
  <div class="layout">
    <div class="table-card">
      <h1 style="font-size:1.2rem;">Inventory</h1>
      <table>
        <thead><tr><th scope="col">SKU</th><th scope="col">Name</th><th scope="col">Qty</th><th scope="col">Price</th></tr></thead>
        <tbody>
          <tr><td>SKU-1042</td><td>Ceramic Bowl Set</td><td class="low-stock">3</td><td>&#8377;1,299</td></tr>
          <tr><td>SKU-1043</td><td>Brass Table Lamp</td><td>28</td><td>&#8377;2,499</td></tr>
          <tr><td>SKU-1044</td><td>Linen Cushion Cover</td><td>54</td><td>&#8377;649</td></tr>
        </tbody>
      </table>
    </div>
    <div class="form-card">
      <h2>Add item</h2>
      <form>
        <div class="field"><label for="sku">SKU</label><input type="text" id="sku" required></div>
        <div class="field"><label for="item-name">Name</label><input type="text" id="item-name" required></div>
        <div class="field"><label for="qty">Quantity</label><input type="number" id="qty" min="0" required></div>
        <div class="field"><label for="price">Price (&#8377;)</label><input type="number" id="price" min="0" step="0.01" required></div>
        <button type="submit">Save item</button>
      </form>
    </div>
  </div>
</body>
</html>
```

**Explanation:** Low-stock rows get both a text-color change *and* an explicit `::after` warning-triangle glyph (`content: " \26A0"`) appended to the quantity value — again the "never color alone" principle, but here demonstrated with the caveat from Part 21/49 that `::after`-generated content isn't guaranteed to be announced identically across all screen readers, so a genuinely bulletproof production version would instead include a real, visually-hideable text label ("Low stock") in the markup itself rather than relying on generated content — noted here as the more defensible real-world choice even though the simpler CSS-only version is shown.

**Responsive behavior:** Below 850px, the two-column layout (`1fr 320px`) collapses to one column, and because the form card is the second element in the HTML source, it naturally stacks *below* the table on mobile, which is a reasonable default (view the list first, then scroll to add) without any explicit reordering needed.

**Accessibility considerations:** Numeric inputs (`quantity`, `price`) use `type="number"` with `min` (and `step` for price) attributes, giving mobile users the correct numeric keypad and giving the browser baseline validation against negative values — small but real, free wins from choosing the correct input type, a theme repeated throughout this course since Part 10.

</details>

---

### Project 24 — Responsive Design System (Mini Component Library)

**Project Goal:** Build a small, real design-system reference page: a documented set of reusable components (buttons, badges, inputs, cards) all driven from one shared set of CSS custom properties — direct hands-on practice for Part 44/38's design-tokens concept, and a direct rehearsal for the capstone's Stage on design tokens.

**Requirements:** A `:root` token block (colors, spacing scale, radius scale, font sizes) with every component below built to reference *only* those tokens (no hard-coded magic numbers scattered through component rules) — button variants (primary/secondary/danger, each in default/hover/disabled states), badge variants, and a text input, all shown together on one reference page.

**Concepts tested:** Part 38 (custom properties as design tokens), Part 39 (CSS architecture — BEM-style naming used consistently), Part 44 (design systems).

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Design System Reference</title>
<style>
  :root {
    --color-primary: #3454d1;
    --color-primary-dark: #253a94;
    --color-danger: #d1345a;
    --color-danger-dark: #a3203f;
    --color-neutral-100: #f5f5f7;
    --color-neutral-300: #d9d9df;
    --color-neutral-700: #444;
    --color-text: #1a1a1a;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-full: 999px;

    --font-sm: 0.85rem;
    --font-base: 1rem;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: var(--color-text); padding: 2.5rem; }
  h2 { font-size: 1.1rem; margin-top: 2.5rem; }
  .row { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; }

  .btn {
    font-size: var(--font-sm);
    font-weight: 600;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
  }
  .btn--primary { background: var(--color-primary); color: white; }
  .btn--primary:hover { background: var(--color-primary-dark); }
  .btn--secondary { background: var(--color-neutral-100); color: var(--color-text); border: 1px solid var(--color-neutral-300); }
  .btn--danger { background: var(--color-danger); color: white; }
  .btn--danger:hover { background: var(--color-danger-dark); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .badge { display: inline-block; font-size: 0.75rem; font-weight: 700; padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); }
  .badge--success { background: #e3f7e9; color: #1d7a3b; }
  .badge--warning { background: #fff4e0; color: #b3760b; }
  .badge--danger { background: #fde3e8; color: #b3123a; }

  .input {
    font-size: var(--font-base);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-neutral-300);
    border-radius: var(--radius-sm);
    width: 240px;
  }
  .input:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 1px; }

  .swatch { width: 60px; height: 60px; border-radius: var(--radius-md); display: flex; align-items: flex-end; padding: var(--space-1); color: white; font-size: 0.65rem; }
</style>
</head>
<body>
  <h1>Design Tokens &amp; Components</h1>

  <h2>Color tokens</h2>
  <div class="row">
    <div class="swatch" style="background:var(--color-primary);">primary</div>
    <div class="swatch" style="background:var(--color-danger);">danger</div>
    <div class="swatch" style="background:var(--color-neutral-700);">neutral-700</div>
  </div>

  <h2>Buttons</h2>
  <div class="row">
    <button class="btn btn--primary">Primary</button>
    <button class="btn btn--secondary">Secondary</button>
    <button class="btn btn--danger">Danger</button>
    <button class="btn btn--primary" disabled>Disabled</button>
  </div>

  <h2>Badges</h2>
  <div class="row">
    <span class="badge badge--success">Success</span>
    <span class="badge badge--warning">Warning</span>
    <span class="badge badge--danger">Danger</span>
  </div>

  <h2>Text input</h2>
  <div class="row">
    <label class="visually-hidden" for="demo-input">Demo input</label>
    <input class="input" id="demo-input" type="text" placeholder="Type something&hellip;">
  </div>
</body>
</html>
```

**Explanation:** Every single visual value in every component — colors, spacing, radii, font sizes — is a reference to a `:root` custom property, never a hard-coded literal inside a component rule (compare `.btn--primary { background: var(--color-primary) }` against the anti-pattern `.btn--primary { background: #3454d1 }`, which would silently drift out of sync with the rest of the system the moment the brand color changes anywhere else). Component classes follow a consistent BEM-style naming convention (`.btn`, `.btn--primary`, `.badge--success`) from Part 39, making each component's variants immediately scannable by name alone.

**Responsive behavior:** This reference page is intentionally layout-simple (a vertical stack of labeled `.row` demos) since its purpose is documenting *components*, not demonstrating page-level responsive layout — a legitimate, common real-world page type (a living style guide) where responsive page structure is secondary to component correctness.

**Accessibility considerations:** Disabled buttons use the real `disabled` HTML attribute (not just a `.disabled` CSS class with `pointer-events: none`), which correctly removes them from the tab order and is announced as "dimmed"/"unavailable" by screen readers — a real, native-semantics-first choice over a purely visual fake-disabled state, echoing Part 10 and Part 12's emphasis on native HTML semantics over reinvented equivalents.

</details>

---

### Project 25 — Full Multi-Page Portfolio (Shared Layout)

**Project Goal:** Build a 3-page portfolio site (Home, Work, Contact) sharing one consistent header/footer/typography system across pages — testing genuine multi-page consistency, not just single-page polish.

**Requirements:** Three separate HTML files sharing identical header/footer markup and one shared external stylesheet; a consistent active-nav-state pattern per page; consistent spacing/typography tokens across all three.

**Concepts tested:** Part 39/44 (CSS architecture at multi-page scale — a shared `styles.css` rather than duplicated inline styles), Part 5 (internal linking between pages), `aria-current="page"` (reused from Project 16).

**Hints:** This project's real lesson is structural discipline across files, not a new visual technique — build one `styles.css`, link it identically from all three HTML files, and resist the urge to add page-specific inline `<style>` overrides; if a page genuinely needs unique styling, add a page-specific class to its `<body>` (e.g., `<body class="page-contact">`) and scope any exceptions through that, keeping one single source of truth for shared rules.

<details>
<summary>View complete solution</summary>

`styles.css` (shared by all three pages):
```css
:root { --accent: #3454d1; --text: #1a1a1a; --muted: #666; }
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); line-height: 1.6; }
a { color: inherit; }
.container { max-width: 900px; margin-inline: auto; padding-inline: 1.25rem; }

.site-header { border-bottom: 1px solid #eee; }
.site-header .container { display: flex; justify-content: space-between; align-items: center; padding-block: 1.25rem; }
.site-header nav { display: flex; gap: 1.5rem; }
.site-header nav a { text-decoration: none; font-size: 0.9rem; color: var(--muted); }
.site-header nav a[aria-current="page"] { color: var(--accent); font-weight: 700; }

main { padding-block: 3rem; min-height: 50vh; }
footer { border-top: 1px solid #eee; padding-block: 2rem; text-align: center; color: var(--muted); font-size: 0.85rem; }
```

`index.html` (Home):
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meera Nair — Home</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <strong>Meera Nair</strong>
      <nav aria-label="Primary">
        <a href="index.html" aria-current="page">Home</a>
        <a href="work.html">Work</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  </header>
  <main class="container">
    <h1>Product Designer &amp; Frontend Developer</h1>
    <p>I design and build interfaces for early-stage products.</p>
  </main>
  <footer>&copy; 2026 Meera Nair</footer>
</body>
</html>
```

`work.html` and `contact.html` repeat the identical `<header>` and `<footer>` markup verbatim, changing only which nav link carries `aria-current="page"` and the `<main>` content.

**Explanation:** The single shared `styles.css` linked identically from every page is the entire point of this project: change `--accent` once, and every page's active-nav-link color, everywhere, updates together — the direct, tangible payoff of centralizing tokens and shared component styles (Part 38/39/44) rather than copy-pasting a `<style>` block into every page and letting them drift independently over time, which is exactly how real production sites accumulate visual inconsistency.

**Responsive behavior:** Shared header/footer rules apply uniformly across all three pages by construction — there's no way for one page's nav to responsively behave differently from another's, since they're driven by the exact same CSS rules rather than three separately-authored (and inevitably slightly different) copies.

**Accessibility considerations:** Each page sets `aria-current="page"` on its own nav link (and only that page's corresponding link), giving assistive technology users on every single page a correct "you are here" signal specific to that page — a detail worth getting right consistently across every page of a multi-page site, not just the homepage.

</details>

---

### Project 26 — Documentation Website (Multi-Page, Nav-Heavy)

**Project Goal:** Extend Project 14's single documentation page into a small multi-page docs site with a shared sidebar spanning several pages — testing the same shared-stylesheet discipline as Project 25, applied to Project 14's more complex layout.

**Requirements:** At least 3 doc pages sharing one sidebar (with the current page's link visually and programmatically marked active), one shared stylesheet, consistent code-block and callout styling across all pages.

**Concepts tested:** Combination of Project 14 and Project 25's techniques — genuinely no new CSS concepts, but real practice extending a complex shared layout (sidebar + main + on-page-toc) safely across multiple files without duplication drift.

**Hints:** Because this is a direct extension of two already-fully-solved projects, build it by: (1) taking Project 14's HTML structure, (2) extracting all of its `<style>` block into an external `docs.css` per Project 25's pattern, (3) duplicating the *shell* (sidebar + topbar) across 3 pages with different `<main>` content and a different active sidebar link per page. This is left as a direct combination exercise rather than a fully re-typed solution — the two prior solutions above contain every piece needed.

**Challenge extension:** Add a `<link rel="prev">`/`<link rel="next">` pair of page-bottom navigation buttons ("&larr; Authentication" / "getUser() &rarr;") linking between adjacent docs pages, a genuinely common real docs-site pattern.

---

### Project 27 — Mobile-First Catalogue App (Shell Pattern)

**Project Goal:** Build a mobile-app-*feeling* product catalogue shell: a bottom tab bar (mobile-native pattern) that becomes a top nav bar on desktop, plus a scrollable product feed — testing a layout that deliberately changes its navigational *shape*, not just its column count, across breakpoints.

**Requirements:** Mobile: fixed bottom tab bar (Home/Search/Cart/Profile icons+labels) + scrollable content above it. Desktop (min-width breakpoint): tab bar relocates to a conventional top horizontal nav.

**Concepts tested:** Part 26/27 (`position: fixed` bottom bar, `env(safe-area-inset-bottom)` awareness for real mobile devices — worth knowing even though it can't be visually demonstrated outside a real device), a `@media (min-width: ...)` "desktop-up" query genuinely restructuring layout, not just resizing it — the mobile-first methodology from Part 26 applied in its strongest, truest form.

**Hints:** Build the *mobile* layout as your default, unqualified CSS (true mobile-first, per Part 26 — the base styles are the phone styles, with no media query needed to get them), then add a `@media (min-width: 800px)` block that repositions the tab bar from `position: fixed; bottom: 0` to `position: static` at the top of the page, changing both its role in the DOM stacking and its internal Flexbox direction from a common shared class list.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nestwell — Shop</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #1a1a1a; padding-bottom: 64px; }

  .top-header { padding: 1rem 1.25rem; border-bottom: 1px solid #eee; font-weight: 800; }

  .feed { padding: 1rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
  .feed .card { border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
  .feed .card img { width: 100%; aspect-ratio: 1; object-fit: cover; }
  .feed .card .body { padding: 0.6rem; }
  .feed .card h3 { font-size: 0.82rem; margin: 0 0 0.2rem; }
  .feed .card .price { font-weight: 700; font-size: 0.85rem; }

  .tab-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    display: flex;
    background: white;
    border-top: 1px solid #eee;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
  .tab-bar a {
    flex: 1;
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    padding: 0.6rem 0;
    text-decoration: none;
    color: #888;
    font-size: 0.68rem;
  }
  .tab-bar a[aria-current="page"] { color: #3454d1; }
  .tab-bar .icon { font-size: 1.1rem; }

  @media (min-width: 800px) {
    body { padding-bottom: 0; }
    .tab-bar {
      position: static;
      border-top: none;
      border-bottom: 1px solid #eee;
      justify-content: center;
      gap: 2.5rem;
      padding-bottom: 0;
    }
    .tab-bar a { flex: none; flex-direction: row; font-size: 0.9rem; padding: 1rem 0; }
  }
</style>
</head>
<body>
  <header class="top-header">Nestwell</header>
  <main class="feed">
    <div class="card"><img src="https://placehold.co/200x200" alt="Woven table runner"><div class="body"><h3>Table Runner</h3><span class="price">&#8377;899</span></div></div>
    <div class="card"><img src="https://placehold.co/200x200" alt="Brass table lamp"><div class="body"><h3>Table Lamp</h3><span class="price">&#8377;2,499</span></div></div>
    <div class="card"><img src="https://placehold.co/200x200" alt="Ceramic bowl set"><div class="body"><h3>Bowl Set</h3><span class="price">&#8377;1,299</span></div></div>
  </main>
  <nav class="tab-bar" aria-label="Primary">
    <a href="#" aria-current="page"><span class="icon" aria-hidden="true">&#9673;</span>Home</a>
    <a href="#"><span class="icon" aria-hidden="true">&#128269;</span>Search</a>
    <a href="#"><span class="icon" aria-hidden="true">&#128722;</span>Cart</a>
    <a href="#"><span class="icon" aria-hidden="true">&#9679;</span>Profile</a>
  </nav>
</body>
</html>
```

**Explanation:** The tab bar's mobile styling (`position: fixed; bottom: 0`, vertical icon+label stacking) is written as unqualified, default CSS — true mobile-first, per Part 26 — and the desktop override at `min-width: 800px` doesn't just resize things, it fundamentally *relocates and restructures* the same element: `position: static` instead of `fixed`, `flex-direction: row` instead of column, moved conceptually from "bottom bar" to "top nav" entirely through CSS on the exact same markup. `env(safe-area-inset-bottom, 0)` is a real CSS environment variable that accounts for the home-indicator area on notched phones (like recent iPhones) — it can't be meaningfully demonstrated in a desktop browser preview, but is a genuine, important real-world detail for any fixed bottom bar shipped to production, included here specifically so it's on your radar rather than discovered the hard way later.

**Responsive behavior:** `body { padding-bottom: 64px }` reserves space for the fixed mobile tab bar so feed content doesn't get hidden beneath it; this padding is explicitly removed (`padding-bottom: 0`) at the desktop breakpoint once the tab bar becomes `position: static` and no longer overlaps content, which is a paired change worth noticing — a fixed-position element and its "reserve space for me" padding must always be added and removed *together*, or you'll end up with either hidden content (padding missing) or an ugly permanent gap (padding left behind after the element stops being fixed).

**Accessibility considerations:** `aria-current="page"` is applied to the active tab exactly as in Project 16/25. The whole tab bar is one `<nav aria-label="Primary">`, so whether it visually renders as a bottom bar or a top bar, its role and label to assistive technology stay identical and correct regardless of the current viewport.

</details>

---

### Project 28 — Dashboard with Complex Grid/Flexbox Layouts (Capstone-Adjacent Finale)

**Project Goal:** The final project before the course's true capstone: a single-page, densely composed dashboard combining *every* layout technique from this Part — page-shell Grid (Project 16), asymmetric panel Grid (Project 22), data tables (Project 21), a component-driven design-token approach (Project 24), and a responsive nav pattern (Project 18/27) — into one cohesive, non-trivial real screen, deliberately without a step-by-step scaffold this time.

**Requirements:**
- A full app shell: sidebar nav (collapsible to icons on narrow screens) + topbar + main content area
- Main content: a stat-card row, one large asymmetric chart panel plus two side panels (Project 22's pattern), and a data table below it (Project 21's pattern)
- Every color/spacing/radius value drawn from a `:root` token set (Project 24's discipline)
- Fully responsive from a 360px phone width to a 1400px desktop, tested at multiple widths, not just one mobile breakpoint

**Design description:** A cohesive, dark-sidebar/light-content admin theme, generous but consistent spacing throughout, clear visual hierarchy (stat numbers largest, table text smallest), no layout technique used where a simpler one would do (a real, final test of judgment, not just technique — apply Part 25's "when Grid vs Flexbox" framework deliberately at every decision point rather than defaulting to Grid everywhere out of habit).

**Concepts tested:** Genuinely all major layout, theming, and semantics concepts from Parts 14–46, composed at real production complexity — this project has no new individual technique, and that is deliberate: it is a fluency test, not a features test.

**Hints:** Build this one in layers, the way real production work actually proceeds: (1) get the page shell (sidebar/topbar/main) correctly responsive first, entirely with placeholder-colored boxes and no real content; (2) then build and drop in the stat-card row; (3) then the asymmetric chart+side-panel Grid; (4) then the data table; (5) only at the very end, apply your design tokens uniformly across everything you just built, replacing every hard-coded value. Building in this order — structure, then content blocks, then final token pass — mirrors how experienced developers actually work, and is worth practicing deliberately rather than trying to get colors and spacing "final" on the first pass through each piece.

<details>
<summary>View complete solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nimbus Admin — Overview</title>
<style>
  :root {
    --sidebar-w: 220px;
    --sidebar-w-collapsed: 72px;
    --accent: #3454d1;
    --bg: #f6f7fb;
    --surface: #ffffff;
    --text: #1a1a1a;
    --muted: #888;
    --radius-md: 12px;
    --radius-sm: 8px;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); background: var(--bg); }

  .app-shell {
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-rows: 64px 1fr;
    grid-template-areas: "sidebar topbar" "sidebar main";
    min-height: 100vh;
  }
  @media (max-width: 900px) {
    .app-shell { grid-template-columns: var(--sidebar-w-collapsed) 1fr; }
    .sidebar .label { display: none; }
  }

  .sidebar { grid-area: sidebar; background: #14142b; color: #c7c9e0; padding: var(--space-4) var(--space-3); position: sticky; top: 0; height: 100vh; }
  .sidebar .logo { color: white; font-weight: 800; padding: 0 var(--space-2) var(--space-6); }
  .sidebar nav a { display: flex; align-items: center; gap: var(--space-3); color: inherit; text-decoration: none; padding: var(--space-2) var(--space-2); border-radius: var(--radius-sm); font-size: 0.9rem; margin-bottom: 0.15rem; }
  .sidebar nav a:hover { background: #23234a; }
  .sidebar nav a[aria-current="page"] { background: var(--accent); color: white; }

  .topbar { grid-area: topbar; background: var(--surface); border-bottom: 1px solid #e6e6ee; display: flex; align-items: center; justify-content: space-between; padding-inline: var(--space-6); position: sticky; top: 0; z-index: 5; }
  .topbar h1 { font-size: 1.1rem; margin: 0; }

  main { grid-area: main; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-6); }

  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-4); }
  .card { background: var(--surface); border-radius: var(--radius-md); padding: var(--space-4); box-shadow: 0 1px 4px rgb(0 0 0 / 5%); }
  .stat .label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; }
  .stat .value { font-size: 1.6rem; font-weight: 800; margin: 0.3rem 0 0; }

  .panel-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 110px; gap: var(--space-4); }
  .chart { grid-column: span 3; grid-row: span 3; display: flex; align-items: center; justify-content: center; color: var(--muted); }
  .side { grid-column: span 1; grid-row: span 3; display: flex; flex-direction: column; gap: var(--space-3); }
  .side .mini { flex: 1; background: #fafbff; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 0.8rem; }
  @media (max-width: 750px) {
    .panel-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: auto; }
    .chart { grid-column: span 2; grid-row: span 1; height: 220px; }
    .side { grid-column: span 2; grid-row: span 1; flex-direction: row; }
  }

  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { text-align: left; padding: var(--space-3) var(--space-2); font-size: 0.72rem; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid #eee; }
  td { padding: var(--space-3) var(--space-2); border-bottom: 1px solid #f2f2f2; }
</style>
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">Nimbus</div>
      <nav aria-label="Primary">
        <a href="#" aria-current="page"><span aria-hidden="true">&#9632;</span><span class="label">Overview</span></a>
        <a href="#"><span aria-hidden="true">&#9673;</span><span class="label">Analytics</span></a>
        <a href="#"><span aria-hidden="true">&#9776;</span><span class="label">Orders</span></a>
      </nav>
    </aside>
    <header class="topbar"><h1>Overview</h1></header>
    <main>
      <div class="stat-grid">
        <div class="card stat"><p class="label">Revenue</p><p class="value">&#8377;4.2L</p></div>
        <div class="card stat"><p class="label">Orders</p><p class="value">1,204</p></div>
        <div class="card stat"><p class="label">Refund Rate</p><p class="value">1.8%</p></div>
        <div class="card stat"><p class="label">Active Users</p><p class="value">8,930</p></div>
      </div>
      <div class="panel-grid">
        <div class="card chart">Traffic chart placeholder</div>
        <div class="side">
          <div class="card mini">Top pages</div>
          <div class="card mini">Top referrers</div>
          <div class="card mini">Devices</div>
        </div>
      </div>
      <div class="card" style="overflow-x:auto;">
        <table>
          <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Status</th><th scope="col">Total</th></tr></thead>
          <tbody>
            <tr><td>#10234</td><td>Priya Sharma</td><td>Delivered</td><td>&#8377;2,499</td></tr>
            <tr><td>#10235</td><td>Arjun Mehta</td><td>Processing</td><td>&#8377;899</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</body>
</html>
```

**Explanation:** Three distinct layout decisions are made deliberately, each for a different structural reason, exactly per Part 25's decision framework: the *page shell* uses `grid-template-areas` because it's a fixed, named-region, app-frame layout (Project 16's reasoning); the *panel section* uses raw Grid with explicit `span` values because it's a genuinely asymmetric, differently-sized-regions composition (Project 22's reasoning); and the *stat-card row* uses `auto-fit`/`minmax` because it's a simple, uniform, reflowing row of same-sized cards (the reasoning from nearly every card-gallery project in this Part). No Flexbox is used at the macro layout level at all in this build — only Grid — which is itself a legitimate outcome of applying the decision framework consistently rather than a rule to follow blindly; a different dashboard with more one-dimensional row/column needs might reasonably lean on Flexbox more.

**Responsive behavior:** Three independent breakpoints operate at three different structural levels — the shell's sidebar collapses at 900px, the panel grid restructures at 750px — deliberately *different* thresholds, because each region's content dictates its own natural point of visual strain, exactly the "test at multiple widths, not just one" requirement stated in this project's brief; picking one single global breakpoint for a page this compositionally rich would force some regions to collapse too early and others too late.

**Accessibility considerations:** Every pattern established across this Part is present and consistent here: `aria-current="page"` on the active sidebar link, `aria-hidden="true"` on decorative icon glyphs, `<th scope="col">` on every table header, and a coherent heading/landmark structure throughout — this project's accessibility bar is "everything you've already practiced, applied without exception," which is a genuinely realistic (and appropriately high) standard for real production dashboard work.

</details>

---

This completes the 28-project sequence. Notice the deliberate arc: Beginner projects taught you to structure and style a single component correctly; Intermediate projects taught you to compose several components into a coherent page and make real responsive-layout judgment calls; Advanced projects taught you to compose entire multi-region applications and multi-page sites while maintaining design-system discipline throughout. This exact arc — component, page, system — mirrors how real frontend skill actually develops, and is also, not coincidentally, the structure of the capstone project that follows in Part 54.

---

# Part 54 — Capstone Project: Responsive E-Commerce / Product Catalogue Interface

Everything in this course has been leading here. The capstone is one real, substantial interface — a product catalogue/storefront — built across 15 deliberate stages, each stage adding one coherent layer of capability on top of the last, exactly the way a real feature actually gets built in production: never all at once, always in reviewable, buildable increments.

Unlike Part 53's 28 independent projects, this is *one* evolving codebase. Each stage below shows what's added or changed relative to the previous stage, why, and ends with that stage's complete, current-state code — so you can follow along building incrementally, or jump to any stage and see the whole file as it stood at that point.

💡 **Tip:** Build this capstone yourself, stage by stage, in your own editor, rather than only reading it. The entire pedagogical point of staging it this way is to rehearse the actual *process* of building a real feature incrementally — starting from bare structure and layering in visual design, then interaction states, then responsiveness, then polish, then performance and accessibility passes at the end, exactly as real teams do.

---

## Stage 1 — Requirements

Before writing a single line of HTML, a real project starts with requirements. Here is the brief we're building against for the rest of this capstone:

**Product:** "Nestwell" — a home goods storefront catalogue page.

**Must-have features:**
1. Site header with logo, primary nav, search, and cart icon (with item-count badge)
2. A page title/breadcrumb area
3. A filter sidebar (category, price range, availability)
4. A toolbar above the product grid: result count, sort dropdown, view toggle (grid/list — structure only)
5. A responsive product grid using the card pattern established in Part 53
6. Pagination
7. Fully responsive: usable from a 360px phone to a 1440px desktop
8. Fully accessible: correct landmarks, labels, focus states, color contrast
9. A consistent design-token system driving all visual values
10. Clean, maintainable CSS architecture (BEM naming, logical file/section organization)

**Explicitly out of scope:** any actual filtering/sorting/cart *behavior* (that requires JavaScript, which is outside this course's HTML/CSS-only scope) — we build the complete, correct, production-ready *structure and styling* for all of it, ready for a JavaScript layer to attach to later. This distinction matters and is worth sitting with: a huge amount of real frontend value is created before any JavaScript is written at all.

✅ **Checkpoint:** Before moving to Stage 2, make sure you could explain, in one sentence each, what each of the 10 requirements above means concretely. If any are vague to you, that's a sign to clarify them now — exactly as you would in a real project before writing code against an ambiguous spec.

---

## Stage 2 — Wireframe / Structural Plan (No Styling Yet)

Real interface work benefits enormously from getting the *structure* right before any visual design happens — this stage is pure semantic HTML, deliberately ugly (default browser styling only), so that structural decisions get made on their own merits rather than being influenced by how something happens to look once colors and spacing are added.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nestwell — Shop All</title>
</head>
<body>
  <header>
    <div>Nestwell</div>
    <nav>
      <a href="#">Shop</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
    <form role="search">
      <input type="search" placeholder="Search products">
    </form>
    <a href="#">Cart (3)</a>
  </header>

  <main>
    <nav aria-label="Breadcrumb">
      <a href="#">Home</a> / Shop All
    </nav>
    <h1>Shop All</h1>

    <div>
      <aside>
        <h2>Filters</h2>
        <div>
          <h3>Category</h3>
          <label><input type="checkbox"> Kitchen</label>
          <label><input type="checkbox"> Lighting</label>
          <label><input type="checkbox"> Textiles</label>
        </div>
        <div>
          <h3>Price</h3>
          <label><input type="radio" name="price"> Under &#8377;1,000</label>
          <label><input type="radio" name="price"> &#8377;1,000&ndash;&#8377;3,000</label>
        </div>
        <div>
          <h3>Availability</h3>
          <label><input type="checkbox"> In stock only</label>
        </div>
      </aside>

      <div>
        <div>
          <p>Showing 1&ndash;12 of 48 results</p>
          <select>
            <option>Featured</option>
            <option>Price: Low to High</option>
          </select>
        </div>

        <ul>
          <li>
            <article>
              <img src="https://placehold.co/300x300" alt="Woven table runner">
              <h3>Woven Table Runner</h3>
              <p>&#8377;899</p>
              <button>Add to cart</button>
            </article>
          </li>
          <!-- more product items -->
        </ul>

        <nav aria-label="Pagination">
          <a href="#">Previous</a>
          <a href="#">1</a>
          <a href="#">2</a>
          <a href="#">Next</a>
        </nav>
      </div>
    </div>
  </main>

  <footer>
    <p>&copy; 2026 Nestwell</p>
  </footer>
</body>
</html>
```

**Why this stage matters and what to notice:** Every structural/semantic decision is already made here — `<header>`/`<main>`/`<footer>` landmarks, the filter sidebar as `<aside>`, the product list as a real `<ul>`/`<li>` (products are a genuinely unordered collection of comparable items — a correct semantic choice, distinct from Part 53 Project 11's version, which used a bare `<div>` grid; both are defensible, but wrapping in `<ul>`/`<li>` gives screen readers an announced item count, e.g. "list, 12 items," which is a real, free accessibility win worth choosing deliberately here), and the search form using `role="search"` (a landmark role that helps assistive technology users jump straight to site search). None of this needs to change as later stages add visual design — that's the entire benefit of getting structure right first.

⚠️ **Common mistake:** Skipping straight to visual design and only adding semantic structure (landmarks, correct heading levels, list semantics) as an afterthought "accessibility pass" at the end. It's far easier — and produces a structurally sounder result — to get this right at Stage 2 than to retrofit it after 400 lines of CSS already assume a particular `<div>` soup structure.

---

## Stage 3 — Design Tokens

Before styling any single component, define the token set every later stage will draw from — exactly the discipline rehearsed in Part 53 Project 24, now applied from the very start of a real build rather than retrofitted.

```css
:root {
  /* Color */
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-muted: #6b6b6b;
  --color-border: #e3e3e3;
  --color-accent: #3454d1;
  --color-accent-dark: #253a94;
  --color-danger: #d1345a;
  --color-success: #1d7a3b;

  /* Spacing scale (based on a 4px base unit) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 999px;

  /* Typography */
  --font-family-base: system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-size-sm: 0.85rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.75rem;

  /* Shadow */
  --shadow-sm: 0 1px 3px rgb(0 0 0 / 6%);
  --shadow-md: 0 4px 16px rgb(0 0 0 / 10%);

  /* Layout */
  --content-max-width: 1200px;
  --sidebar-width: 240px;
}
```

**Why each category exists:** Color tokens are named by *role* (`--color-accent`, not `--color-blue`) so that a future rebrand or dark-mode variant (Stage 14) only ever needs new *values*, never a hunt-and-replace of every component's CSS — this is the exact distinction from Part 38 between "what it is" (blue) and "what it's for" (accent), and role-based naming is the only version that survives a redesign. The spacing scale is deliberately not arbitrary — every value is a multiple of a consistent base rhythm, so any two spacing decisions across the whole interface relate to each other predictably rather than accumulating fifteen near-identical-but-not-quite magic numbers over time (`14px` here, `15px` there) the way an un-tokenized codebase inevitably does.

💡 **Tip:** Notice this token set has no component-specific tokens yet (no `--button-padding`, no `--card-radius`) — only *global* primitives. Component-specific tokens, when needed, should generally be defined *referencing* these primitives (`--button-padding: var(--space-3) var(--space-5)`) rather than as new arbitrary values, keeping the whole system's ultimate source of truth in one place.

---

## Stage 4 — Base Styles and Reset

With tokens defined, the next layer is the global reset/base layer from Part 41 — the foundation every component sits on.

```css
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--font-family-base);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  font-size: var(--font-size-base);
}

img, picture, svg {
  max-width: 100%;
  display: block;
}

h1, h2, h3, h4, p, figure {
  margin: 0;
}

a {
  color: inherit;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

ul, ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Visually-hidden utility for screen-reader-only text, used throughout */
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* A skip link, per Part 49 */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--color-accent);
  color: white;
  padding: var(--space-3) var(--space-4);
  z-index: 100;
  border-radius: 0 0 var(--radius-sm) 0;
}
.skip-link:focus {
  left: 0;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**What's happening here and why:** `list-style: none` is applied globally to `ul`/`ol` — a deliberate, common real-world reset, made *because* this project's product grid uses `<ul>`/`<li>` for its semantic benefit (Stage 2's reasoning) but explicitly does not want visible bullet markers; removing them via CSS preserves the list's screen-reader announcement benefits (item count, list semantics) while controlling the purely visual bullet presentation independently — exactly the point made in Part 7 that `list-style: none` changes *appearance*, never *meaning*. The `.visually-hidden` utility and `.skip-link` are included in the base layer from the very start (Stage 4), not bolted on during a later "accessibility pass" — both will be used starting in the very next stage.

⚠️ **Common mistake:** Applying `list-style: none` and concluding the list semantics are now "lost" or pointless, then reaching for `<div>` instead. This is a genuine, common misconception worth correcting explicitly: assistive technology reads the DOM's semantic structure, not the computed visual style — a `<ul>` with `list-style: none` is still announced as a list.

---

## Stage 5 — Header and Navigation

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<header class="site-header">
  <div class="site-header__inner">
    <a href="/" class="site-header__logo">Nestwell</a>
    <nav class="site-header__nav" aria-label="Primary">
      <a href="#" aria-current="page">Shop</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
    <form class="site-header__search" role="search">
      <label class="visually-hidden" for="site-search">Search products</label>
      <input type="search" id="site-search" placeholder="Search products&hellip;">
    </form>
    <a href="#" class="site-header__cart" aria-label="Cart, 3 items">
      <span aria-hidden="true">&#128722;</span>
      <span class="site-header__cart-count">3</span>
    </a>
  </div>
</header>
```

```css
.site-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 20;
}
.site-header__inner {
  max-width: var(--content-max-width);
  margin-inline: auto;
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-6);
}
.site-header__logo {
  font-weight: 800;
  font-size: var(--font-size-lg);
  text-decoration: none;
  margin-right: auto;
}
.site-header__nav {
  display: flex;
  gap: var(--space-5);
}
.site-header__nav a {
  text-decoration: none;
  font-size: var(--font-size-sm);
  color: var(--color-muted);
}
.site-header__nav a[aria-current="page"] {
  color: var(--color-accent);
  font-weight: 600;
}
.site-header__search input {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  width: 220px;
}
.site-header__cart {
  position: relative;
  text-decoration: none;
  font-size: var(--font-size-lg);
}
.site-header__cart-count {
  position: absolute;
  top: -6px; right: -8px;
  background: var(--color-accent);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}
```

**What's new:** BEM naming (`.site-header`, `.site-header__inner`, `.site-header__nav`) is applied consistently from this stage onward, per Part 39 — every subsequent component in this capstone follows the same `.block`, `.block__element`, `.block--modifier` pattern, so by the time you reach the full file at Stage 15, the naming is uniform throughout rather than inconsistent across stages. `margin-right: auto` on the logo (inside a flex row) pushes everything after it to the right — the same "auto margin absorbs space" trick from Part 53 Project 3's button, applied here at the header level instead of inside a card.

✅ **Checkpoint:** Confirm the skip link is genuinely the very first focusable element in the DOM (before the header) — tab from a fresh page load and verify it's the first thing to receive focus, exactly as Part 49 describes.

---

## Stage 6 — Page Layout Shell (Breadcrumb, Title, Two-Column Frame)

```html
<main id="main-content">
  <div class="page-container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="#">Home</a> <span aria-hidden="true">/</span> <span>Shop All</span>
    </nav>
    <h1 class="page-title">Shop All</h1>

    <div class="catalogue-layout">
      <!-- aside (Stage 7) and main content (Stages 8-9) go here -->
    </div>
  </div>
</main>
```

```css
.page-container {
  max-width: var(--content-max-width);
  margin-inline: auto;
  padding: var(--space-6) var(--space-5) var(--space-12);
}
.breadcrumb {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin-bottom: var(--space-3);
}
.breadcrumb a { color: var(--color-muted); }
.page-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-6);
}
.catalogue-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  gap: var(--space-8);
  align-items: start;
}
@media (max-width: 900px) {
  .catalogue-layout {
    grid-template-columns: 1fr;
  }
}
```

**Why Grid here specifically:** This is the exact `sidebar + main` two-dimensional relationship from Part 25's core Grid-vs-Flexbox decision framework, rehearsed in Part 53 Project 11 — a persistent, fixed-width sidebar beside a flexible main region is Grid's canonical use case, not Flexbox's. `align-items: start` prevents the sidebar from stretching to match the (likely much taller) product grid's height, keeping it pinned to its own natural content height instead — a detail that's easy to forget and produces a subtly wrong-looking result if omitted (the sidebar's background, if it had one, would otherwise stretch awkwardly tall).

---

## Stage 7 — Filter Sidebar

```html
<aside class="filters" aria-labelledby="filters-heading">
  <h2 id="filters-heading" class="filters__heading">Filters</h2>

  <div class="filter-group">
    <h3 class="filter-group__title">Category</h3>
    <label class="filter-group__option"><input type="checkbox"> Kitchen</label>
    <label class="filter-group__option"><input type="checkbox"> Lighting</label>
    <label class="filter-group__option"><input type="checkbox"> Textiles</label>
    <label class="filter-group__option"><input type="checkbox"> Storage</label>
  </div>

  <div class="filter-group">
    <h3 class="filter-group__title">Price</h3>
    <label class="filter-group__option"><input type="radio" name="price"> Under &#8377;1,000</label>
    <label class="filter-group__option"><input type="radio" name="price"> &#8377;1,000&ndash;&#8377;3,000</label>
    <label class="filter-group__option"><input type="radio" name="price"> Above &#8377;3,000</label>
  </div>

  <div class="filter-group">
    <h3 class="filter-group__title">Availability</h3>
    <label class="filter-group__option"><input type="checkbox"> In stock only</label>
  </div>

  <button type="button" class="filters__clear">Clear all filters</button>
</aside>
```

```css
.filters__heading {
  font-size: var(--font-size-base);
  margin-bottom: var(--space-5);
}
.filter-group {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}
.filter-group:last-of-type {
  border-bottom: none;
}
.filter-group__title {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-muted);
  margin-bottom: var(--space-3);
}
.filter-group__option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  padding-block: var(--space-1);
  cursor: pointer;
}
.filters__clear {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  cursor: pointer;
  width: 100%;
}
.filters__clear:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
```

**Why `<h3>` for filter group titles, not `<h4>` or styled `<div>`:** The heading hierarchy so far is `<h1>` (page title) → `<h2>` ("Filters" region heading) → `<h3>` (each filter group's own title) — a correct, sequential outline (Part 12) that lets a screen reader user navigating by heading jump directly to, say, the "Price" filter group without needing to tab through every checkbox to get there. `:last-of-type` removes the bottom border/margin from the final filter group so the "Clear all filters" button doesn't have an orphaned double border above it — a small polish detail, but the kind that separates "functionally correct" from "actually looks intentional."

---

## Stage 8 — Toolbar (Results Count + Sort)

```html
<div class="catalogue-main">
  <div class="toolbar">
    <p class="toolbar__count">Showing 1&ndash;12 of 48 results</p>
    <label class="toolbar__sort">
      Sort by
      <select>
        <option>Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Newest</option>
      </select>
    </label>
  </div>
  <!-- product grid (Stage 9) goes here -->
</div>
```

```css
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
  gap: var(--space-3);
}
.toolbar__count {
  color: var(--color-muted);
  font-size: var(--font-size-sm);
}
.toolbar__sort {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: 600;
}
.toolbar__sort select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}
```

**Why Flexbox here, not Grid:** This is a genuinely one-dimensional relationship — two items in a single row that need to sit at opposite ends — which is exactly Flexbox's `justify-content: space-between` use case, not a task that benefits from Grid's two-dimensional machinery. Applying Part 25's decision framework consistently means recognizing this is a different shape of problem than Stage 6's sidebar-plus-main layout, even though both are "put two things next to each other" at a glance.

---

## Stage 9 — Product Grid and Card

```html
<ul class="product-grid">
  <li>
    <article class="product-card">
      <a href="#" class="product-card__media-link">
        <div class="product-card__media">
          <span class="product-card__badge">Sale</span>
          <img src="https://placehold.co/400x400" alt="Woven cotton table runner in natural beige">
        </div>
      </a>
      <div class="product-card__body">
        <h3 class="product-card__title"><a href="#">Woven Table Runner</a></h3>
        <p class="product-card__price">
          <span class="product-card__price-original">&#8377;1,499</span>
          &#8377;1,099
        </p>
        <button type="button" class="product-card__add">Add to cart</button>
      </div>
    </article>
  </li>
  <!-- repeated for each product -->
</ul>
```

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-5);
}
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
@media (prefers-reduced-motion: reduce) {
  .product-card { transition: none; }
  .product-card:hover { transform: none; }
}
.product-card__media {
  position: relative;
  aspect-ratio: 1;
}
.product-card__media img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.product-card__badge {
  position: absolute;
  top: var(--space-2); left: var(--space-2);
  background: var(--color-danger);
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}
.product-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-4);
}
.product-card__title {
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-2);
}
.product-card__title a {
  text-decoration: none;
}
.product-card__price {
  font-weight: 700;
  margin-bottom: var(--space-3);
}
.product-card__price-original {
  font-weight: 400;
  color: var(--color-muted);
  text-decoration: line-through;
  margin-right: var(--space-1);
  font-size: 0.9em;
}
.product-card__add {
  margin-top: auto;
  background: var(--color-text);
  color: white;
  border: none;
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
}
.product-card__add:hover {
  background: var(--color-accent-dark);
}
```

**Direct callback to Part 53 Project 3:** This card is structurally identical in its core mechanics (flex column, `margin-top: auto` on the button, `aspect-ratio` + `object-fit: cover` on the image) to Project 3's standalone card — the difference here is entirely in *integration*: it's now driven by the capstone's shared token set rather than one-off values, wrapped in `<li>` for the list-semantics reasoning from Stage 2, and its title is a nested link (`<h3><a>...</a></h3>`) rather than the whole card being one giant link, a deliberate choice explained fully in the accessibility note below.

**Accessibility note on the nested-link structure:** Unlike Part 53 Project 10's portfolio cards (where the *entire* card was one link, appropriate because clicking anywhere should navigate), this product card has *two* separate interactive purposes living side by side — "view this product" and "add this product to cart" — which must remain two genuinely distinct, separately-focusable controls (an image/title link, and a separate `<button>`), never collapsed into one element or, worse, nested (a `<button>` inside an `<a>`, or vice versa, is invalid HTML and produces unpredictable, broken keyboard/screen-reader behavior). This is a meaningfully different structural decision from earlier "whole card is one link" projects, made deliberately based on this component's actual interactive requirements rather than copy-pasted out of habit.

---

## Stage 10 — Pagination and Footer

```html
<nav class="pagination" aria-label="Pagination">
  <a href="#" class="pagination__link" aria-label="Previous page">&laquo;</a>
  <a href="#" class="pagination__link pagination__link--current" aria-current="page">1</a>
  <a href="#" class="pagination__link">2</a>
  <a href="#" class="pagination__link">3</a>
  <a href="#" class="pagination__link" aria-label="Next page">&raquo;</a>
</nav>
```

```css
.pagination {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-8);
}
.pagination__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text);
  font-size: var(--font-size-sm);
}
.pagination__link:hover {
  background: var(--color-border);
}
.pagination__link--current {
  background: var(--color-text);
  color: white;
}
```

```html
<footer class="site-footer">
  <div class="page-container site-footer__inner">
    <p>&copy; 2026 Nestwell Home</p>
    <nav aria-label="Footer">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
    </nav>
  </div>
</footer>
```

```css
.site-footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-12);
}
.site-footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  flex-wrap: wrap;
  gap: var(--space-3);
}
.site-footer__inner nav {
  display: flex;
  gap: var(--space-4);
}
```

**What's structurally complete at this point:** Every piece of markup and every base CSS rule from the original Stage 2 wireframe now has its full, tokenized, production-quality styling. This is a genuine, meaningful milestone — a real "feature complete for desktop, unstyled for mobile" checkpoint, exactly the state a real feature branch might be in before its dedicated responsive pass. The next three stages are explicitly about hardening what already works: responsiveness, interaction states, and polish — never about adding new structural pieces.

---

## Stage 11 — Responsive Pass

With the desktop-oriented build complete, this stage systematically reviews *every* component built so far at three test widths — 360px (small phone), 768px (tablet), 1440px (large desktop) — and adds the media queries each one actually needs, rather than guessing breakpoints up front.

```css
/* Header: search field shrinks and eventually hides on very small screens */
@media (max-width: 640px) {
  .site-header__search { display: none; }
  .site-header__inner { gap: var(--space-4); }
}

/* Page layout: sidebar collapses above the product area */
@media (max-width: 900px) {
  .catalogue-layout {
    grid-template-columns: 1fr;
  }
  .filters {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-5);
  }
}

/* Product grid: fewer minimum-width columns needed at small sizes so cards don't feel cramped */
@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-3);
  }
}

/* Toolbar: stack count and sort on very narrow screens */
@media (max-width: 420px) {
  .toolbar { flex-direction: column; align-items: flex-start; }
}
```

**Why these specific breakpoints, and why so few global ones:** Notice each media query targets a *different* pixel value, chosen individually for that specific component's actual point of visual strain, rather than a single set of "standard" breakpoints (like 576/768/992/1200) applied uniformly everywhere regardless of whether a given component even needs to change at each of them — this is the mobile-first, content-driven breakpoint philosophy from Part 26, deliberately practiced here rather than abandoned under real-project pressure to "just use Bootstrap's breakpoints." Also notice how much of the layout (the `product-grid`'s `auto-fill`/`minmax`, the header's `flex-wrap`-free but naturally shrinking search box) needed *no* media query at all — a strong signal, consistent with the whole course, that fluid techniques should be exhausted first, with media queries reserved for the genuine structural changes fluid CSS can't achieve alone.

⚠️ **Common mistake:** Writing all your media queries in one enormous block at the very end of the stylesheet, disconnected from the components they modify. In the actual capstone file (Stage 15), each component's responsive overrides live directly beneath that component's base rules — co-located, easy to find, easy to reason about when revisiting that one component later — rather than scattered/duplicated across a separate "responsive.css" section, which is a common real-world architecture mistake covered in Part 39's CSS organization discussion.

---

## Stage 12 — Interaction and Focus States Pass

A dedicated pass specifically auditing every interactive element for hover, focus, and active states — because it's extremely easy, when building component-by-component, to nail the default appearance of each piece while quietly forgetting its *other* states.

```css
/* Explicit, consistent focus-visible treatment audit across every interactive element */
.site-header__nav a:focus-visible,
.pagination__link:focus-visible,
.filters__clear:focus-visible,
.product-card__add:focus-visible,
.product-card__title a:focus-visible,
.site-header__cart:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Checkbox/radio focus states in the filter sidebar */
.filter-group__option input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Active/pressed state for the primary add-to-cart action */
.product-card__add:active {
  transform: scale(0.98);
}
@media (prefers-reduced-motion: reduce) {
  .product-card__add:active { transform: none; }
}

/* Search input focus */
.site-header__search input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
  border-color: transparent;
}
```

**Why this is a dedicated stage rather than folded into each earlier component stage:** Building component-by-component naturally biases attention toward each component's *default* appearance, since that's what's visible while you're actively working on it — hover/focus/active states are easy to genuinely forget in the moment and are far more reliably caught with a dedicated, systematic pass across the *whole* finished interface afterward, tabbing through every single interactive element end to end and checking each one has a visible, sufficient focus indicator. This mirrors real QA practice: a focused "keyboard-only pass" as its own explicit testing step, not something assumed to be covered incidentally by general development.

✅ **Checkpoint:** Physically tab through this capstone's full interface (once you've built it) using only your keyboard, no mouse — every single interactive element (nav links, search, filter checkboxes, sort dropdown, every product's title link and add-to-cart button, every pagination link, footer links) should receive a clearly visible focus indicator, in a sensible reading order, with nothing skipped and nothing trapped.

---

## Stage 13 — Performance Pass

```html
<!-- Above-the-fold header logo/critical assets: no special loading attribute needed, they're tiny/text -->

<!-- Product grid images: lazy-load everything below the very first visible row -->
<img src="https://placehold.co/400x400"
     alt="Woven cotton table runner in natural beige"
     loading="lazy"
     width="400" height="400">
```

```css
/* Ensure product images reserve their box before loading, preventing layout shift */
.product-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**What changed and why:** `loading="lazy"` (Part 48) is added to every product card image except the first handful (the ones likely visible in the initial viewport on a typical desktop, which should load eagerly/immediately) — deferring the loading of off-screen images until the user scrolls near them, directly reducing initial page weight and load time on a catalogue page that could realistically have dozens of products. Explicit `width`/`height` attributes on every image (alongside the CSS `aspect-ratio` already implicitly created by the `1:1` `.product-card__media` container) reserve the image's box in the layout *before* the image file finishes downloading, preventing the layout-shift problem discussed in Part 48 — content around a still-loading image should never visibly jump once the image finally arrives.

💡 **Tip:** In a real project, this stage would also include checking font-loading strategy (`font-display: swap`), verifying no unused CSS is being shipped, and confirming the transitions/animations added in Stage 12 only ever animate `transform`/`opacity` (both already true here, by design, following Part 48's compositor-only-properties guidance) rather than layout-triggering properties.

---

## Stage 14 — Dark Mode

Using the exact theming pattern established in Part 40: custom properties redefined under both a system-preference media query and an explicit user-override attribute.

```css
:root {
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #14141c;
    --color-surface: #1e1e2a;
    --color-text: #f0f0f5;
    --color-muted: #9797a8;
    --color-border: #33333f;
    --color-accent: #6c85e6;
    --color-accent-dark: #8fa3ee;
  }
}

:root[data-theme="dark"] {
  --color-bg: #14141c;
  --color-surface: #1e1e2a;
  --color-text: #f0f0f5;
  --color-muted: #9797a8;
  --color-border: #33333f;
  --color-accent: #6c85e6;
  --color-accent-dark: #8fa3ee;
}
```

**Why this "just works" with zero component changes:** Because every single component built across Stages 5–10 was already written exclusively in terms of role-based tokens (`var(--color-surface)`, `var(--color-text)`, never a hard-coded hex value anywhere in any component rule) — flipping those token *values* under a dark-mode condition automatically re-themes the entire interface, header through footer, with not one line of `.product-card`, `.filters`, or `.pagination` CSS touched. This is the single clearest, most concrete payoff of the token discipline established all the way back in Stage 3 and enforced in every stage since — the exact case Part 38 and Part 40 promised this pattern would deliver, now demonstrated at real, whole-interface scale rather than a small isolated example.

⚠️ **Common mistake:** Discovering, only at this stage, that some component rule somewhere used a hard-coded color instead of a token — which would now show up as a jarring, un-themed element in dark mode. This is precisely why the token discipline needs to be enforced *continuously*, stage by stage, not audited for the first time here; treat this stage as a verification pass (confirming the discipline held), not the moment discipline is first applied.

---

## Stage 15 — Final Refactor and Complete Project

The last stage is a deliberate refactor pass — rereading the entire accumulated stylesheet start to finish, looking specifically for: duplicated values that should reference a shared token, components whose BEM naming drifted inconsistent, any remaining hard-coded magic numbers, and any dead/unused CSS left over from earlier stages' iterations. This is real, valuable, unglamorous work, and skipping it is exactly how production codebases accumulate the kind of CSS debt Part 39 and Part 52 both warn about.

Below is the complete, final, refactored capstone file — every stage's HTML and CSS combined into one coherent document, exactly as it would exist at the end of a real feature build.

<details>
<summary>View complete final capstone project (full HTML + CSS)</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nestwell — Shop All</title>
<style>
  :root {
    color-scheme: light dark;
    --color-bg: #fafafa;
    --color-surface: #ffffff;
    --color-text: #1a1a1a;
    --color-muted: #6b6b6b;
    --color-border: #e3e3e3;
    --color-accent: #3454d1;
    --color-accent-dark: #253a94;
    --color-danger: #d1345a;
    --color-success: #1d7a3b;

    --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
    --space-4: 1rem; --space-5: 1.25rem; --space-6: 1.5rem;
    --space-8: 2rem; --space-12: 3rem;

    --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 999px;

    --font-family-base: system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-size-sm: 0.85rem; --font-size-base: 1rem; --font-size-lg: 1.25rem; --font-size-xl: 1.75rem;

    --shadow-md: 0 4px 16px rgb(0 0 0 / 10%);
    --content-max-width: 1200px;
    --sidebar-width: 240px;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --color-bg: #14141c; --color-surface: #1e1e2a; --color-text: #f0f0f5;
      --color-muted: #9797a8; --color-border: #33333f;
      --color-accent: #6c85e6; --color-accent-dark: #8fa3ee;
    }
  }
  :root[data-theme="dark"] {
    --color-bg: #14141c; --color-surface: #1e1e2a; --color-text: #f0f0f5;
    --color-muted: #9797a8; --color-border: #33333f;
    --color-accent: #6c85e6; --color-accent-dark: #8fa3ee;
  }

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: var(--font-family-base); color: var(--color-text); background: var(--color-bg); line-height: 1.6; font-size: var(--font-size-base); }
  img, picture { max-width: 100%; display: block; }
  h1, h2, h3, p { margin: 0; }
  a { color: inherit; }
  button, input, select { font: inherit; color: inherit; }
  ul, ol { margin: 0; padding: 0; list-style: none; }

  .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  .skip-link { position: absolute; left: -9999px; top: 0; background: var(--color-accent); color: white; padding: var(--space-3) var(--space-4); z-index: 100; border-radius: 0 0 var(--radius-sm) 0; }
  .skip-link:focus { left: 0; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

  .site-header { background: var(--color-surface); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 20; }
  .site-header__inner { max-width: var(--content-max-width); margin-inline: auto; padding: var(--space-4) var(--space-5); display: flex; align-items: center; gap: var(--space-6); }
  .site-header__logo { font-weight: 800; font-size: var(--font-size-lg); text-decoration: none; margin-right: auto; }
  .site-header__nav { display: flex; gap: var(--space-5); }
  .site-header__nav a { text-decoration: none; font-size: var(--font-size-sm); color: var(--color-muted); }
  .site-header__nav a[aria-current="page"] { color: var(--color-accent); font-weight: 600; }
  .site-header__search input { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-full); width: 220px; background: var(--color-surface); }
  .site-header__cart { position: relative; text-decoration: none; font-size: var(--font-size-lg); }
  .site-header__cart-count { position: absolute; top: -6px; right: -8px; background: var(--color-accent); color: white; font-size: 0.65rem; font-weight: 700; min-width: 16px; height: 16px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; padding: 0 3px; }
  @media (max-width: 640px) { .site-header__search { display: none; } .site-header__inner { gap: var(--space-4); } }

  .page-container { max-width: var(--content-max-width); margin-inline: auto; padding: var(--space-6) var(--space-5) var(--space-12); }
  .breadcrumb { font-size: var(--font-size-sm); color: var(--color-muted); margin-bottom: var(--space-3); }
  .breadcrumb a { color: var(--color-muted); }
  .page-title { font-size: var(--font-size-xl); margin-bottom: var(--space-6); }
  .catalogue-layout { display: grid; grid-template-columns: var(--sidebar-width) 1fr; gap: var(--space-8); align-items: start; }
  @media (max-width: 900px) { .catalogue-layout { grid-template-columns: 1fr; } .filters { border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5); } }

  .filters__heading { font-size: var(--font-size-base); margin-bottom: var(--space-5); }
  .filter-group { margin-bottom: var(--space-6); padding-bottom: var(--space-5); border-bottom: 1px solid var(--color-border); }
  .filter-group:last-of-type { border-bottom: none; }
  .filter-group__title { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-muted); margin-bottom: var(--space-3); }
  .filter-group__option { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); padding-block: var(--space-1); cursor: pointer; }
  .filters__clear { background: none; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--space-2) var(--space-3); font-size: var(--font-size-sm); color: var(--color-muted); cursor: pointer; width: 100%; }
  .filters__clear:hover { border-color: var(--color-accent); color: var(--color-accent); }

  .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-5); flex-wrap: wrap; gap: var(--space-3); }
  .toolbar__count { color: var(--color-muted); font-size: var(--font-size-sm); }
  .toolbar__sort { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); font-weight: 600; }
  .toolbar__sort select { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); }
  @media (max-width: 420px) { .toolbar { flex-direction: column; align-items: flex-start; } }

  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-5); }
  @media (max-width: 480px) { .product-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-3); } }
  .product-card { display: flex; flex-direction: column; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; transition: box-shadow 0.15s ease, transform 0.15s ease; }
  .product-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  @media (prefers-reduced-motion: reduce) { .product-card, .product-card__add { transition: none; } .product-card:hover, .product-card__add:active { transform: none; } }
  .product-card__media { position: relative; aspect-ratio: 1; }
  .product-card__media img { width: 100%; height: 100%; object-fit: cover; }
  .product-card__badge { position: absolute; top: var(--space-2); left: var(--space-2); background: var(--color-danger); color: white; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; padding: var(--space-1) var(--space-2); border-radius: var(--radius-full); }
  .product-card__body { display: flex; flex-direction: column; flex: 1; padding: var(--space-4); }
  .product-card__title { font-size: var(--font-size-sm); margin-bottom: var(--space-2); }
  .product-card__title a { text-decoration: none; }
  .product-card__price { font-weight: 700; margin-bottom: var(--space-3); }
  .product-card__price-original { font-weight: 400; color: var(--color-muted); text-decoration: line-through; margin-right: var(--space-1); font-size: 0.9em; }
  .product-card__add { margin-top: auto; background: var(--color-text); color: var(--color-bg); border: none; padding: var(--space-3); border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; }
  .product-card__add:hover { background: var(--color-accent-dark); }
  .product-card__add:active { transform: scale(0.98); }

  .pagination { display: flex; justify-content: center; gap: var(--space-2); margin-top: var(--space-8); }
  .pagination__link { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--radius-sm); text-decoration: none; color: var(--color-text); font-size: var(--font-size-sm); }
  .pagination__link:hover { background: var(--color-border); }
  .pagination__link--current { background: var(--color-text); color: var(--color-bg); }

  .site-footer { border-top: 1px solid var(--color-border); margin-top: var(--space-12); }
  .site-footer__inner { display: flex; justify-content: space-between; align-items: center; padding-block: var(--space-6); font-size: var(--font-size-sm); color: var(--color-muted); flex-wrap: wrap; gap: var(--space-3); max-width: var(--content-max-width); margin-inline: auto; padding-inline: var(--space-5); }
  .site-footer__inner nav { display: flex; gap: var(--space-4); }
</style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header class="site-header">
    <div class="site-header__inner">
      <a href="/" class="site-header__logo">Nestwell</a>
      <nav class="site-header__nav" aria-label="Primary">
        <a href="#" aria-current="page">Shop</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
      <form class="site-header__search" role="search">
        <label class="visually-hidden" for="site-search">Search products</label>
        <input type="search" id="site-search" placeholder="Search products&hellip;">
      </form>
      <a href="#" class="site-header__cart" aria-label="Cart, 3 items">
        <span aria-hidden="true">&#128722;</span>
        <span class="site-header__cart-count">3</span>
      </a>
    </div>
  </header>

  <main id="main-content">
    <div class="page-container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#">Home</a> <span aria-hidden="true">/</span> <span>Shop All</span>
      </nav>
      <h1 class="page-title">Shop All</h1>

      <div class="catalogue-layout">
        <aside class="filters" aria-labelledby="filters-heading">
          <h2 id="filters-heading" class="filters__heading">Filters</h2>
          <div class="filter-group">
            <h3 class="filter-group__title">Category</h3>
            <label class="filter-group__option"><input type="checkbox"> Kitchen</label>
            <label class="filter-group__option"><input type="checkbox"> Lighting</label>
            <label class="filter-group__option"><input type="checkbox"> Textiles</label>
            <label class="filter-group__option"><input type="checkbox"> Storage</label>
          </div>
          <div class="filter-group">
            <h3 class="filter-group__title">Price</h3>
            <label class="filter-group__option"><input type="radio" name="price"> Under &#8377;1,000</label>
            <label class="filter-group__option"><input type="radio" name="price"> &#8377;1,000&ndash;&#8377;3,000</label>
            <label class="filter-group__option"><input type="radio" name="price"> Above &#8377;3,000</label>
          </div>
          <div class="filter-group">
            <h3 class="filter-group__title">Availability</h3>
            <label class="filter-group__option"><input type="checkbox"> In stock only</label>
          </div>
          <button type="button" class="filters__clear">Clear all filters</button>
        </aside>

        <div class="catalogue-main">
          <div class="toolbar">
            <p class="toolbar__count">Showing 1&ndash;12 of 48 results</p>
            <label class="toolbar__sort">
              Sort by
              <select>
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </label>
          </div>

          <ul class="product-grid">
            <li>
              <article class="product-card">
                <a href="#" class="product-card__media-link">
                  <div class="product-card__media">
                    <span class="product-card__badge">Sale</span>
                    <img src="https://placehold.co/400x400" alt="Woven cotton table runner in natural beige" loading="eager" width="400" height="400">
                  </div>
                </a>
                <div class="product-card__body">
                  <h3 class="product-card__title"><a href="#">Woven Table Runner</a></h3>
                  <p class="product-card__price"><span class="product-card__price-original">&#8377;1,499</span> &#8377;1,099</p>
                  <button type="button" class="product-card__add">Add to cart</button>
                </div>
              </article>
            </li>
            <li>
              <article class="product-card">
                <a href="#" class="product-card__media-link">
                  <div class="product-card__media">
                    <img src="https://placehold.co/400x400" alt="Brass table lamp with linen shade" loading="eager" width="400" height="400">
                  </div>
                </a>
                <div class="product-card__body">
                  <h3 class="product-card__title"><a href="#">Brass Table Lamp</a></h3>
                  <p class="product-card__price">&#8377;2,499</p>
                  <button type="button" class="product-card__add">Add to cart</button>
                </div>
              </article>
            </li>
            <li>
              <article class="product-card">
                <a href="#" class="product-card__media-link">
                  <div class="product-card__media">
                    <img src="https://placehold.co/400x400" alt="Ceramic serving bowl set, three pieces" loading="lazy" width="400" height="400">
                  </div>
                </a>
                <div class="product-card__body">
                  <h3 class="product-card__title"><a href="#">Ceramic Bowl Set</a></h3>
                  <p class="product-card__price">&#8377;1,299</p>
                  <button type="button" class="product-card__add">Add to cart</button>
                </div>
              </article>
            </li>
            <li>
              <article class="product-card">
                <a href="#" class="product-card__media-link">
                  <div class="product-card__media">
                    <img src="https://placehold.co/400x400" alt="Linen cushion cover in sage green" loading="lazy" width="400" height="400">
                  </div>
                </a>
                <div class="product-card__body">
                  <h3 class="product-card__title"><a href="#">Linen Cushion Cover</a></h3>
                  <p class="product-card__price">&#8377;649</p>
                  <button type="button" class="product-card__add">Add to cart</button>
                </div>
              </article>
            </li>
          </ul>

          <nav class="pagination" aria-label="Pagination">
            <a href="#" class="pagination__link" aria-label="Previous page">&laquo;</a>
            <a href="#" class="pagination__link pagination__link--current" aria-current="page">1</a>
            <a href="#" class="pagination__link">2</a>
            <a href="#" class="pagination__link">3</a>
            <a href="#" class="pagination__link" aria-label="Next page">&raquo;</a>
          </nav>
        </div>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <p>&copy; 2026 Nestwell Home</p>
      <nav aria-label="Footer">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </nav>
    </div>
  </footer>
</body>
</html>
```

</details>

**What this capstone demonstrates, taken as a whole:** every major concept from this entire course — semantic HTML, the cascade and specificity, the box model, Flexbox and Grid used deliberately (never by habit), responsive design driven by content rather than arbitrary breakpoints, a real design-token architecture, dark mode achieved almost for free by that token discipline, accessibility built in from the structural stage rather than retrofitted, and a genuine performance pass — combined into one coherent, staged, real-world build process. This is, deliberately, what actually building a production interface feels like: not one enormous leap from blank file to finished product, but a disciplined sequence of layered, reviewable stages, each one correct and complete on its own terms before the next begins.

---

# Part 55 — The CSS Mastery Track

The capstone showed CSS applied at whole-interface scale. This track goes back the other direction: 15 focused levels, each isolating *one* CSS capability and pushing it hard through progressively harder exercises and a level-closing project — the deliberate-practice complement to the capstone's integration practice. Treat this as a track you can return to independently of the rest of the course, in any order that suits gaps in your own fluency.

Each level: a short framing of what's being drilled, 3–5 progressively harder exercises (solutions hidden), and one small project applying that level's focus in a complete, real mini-build.

---

## Level 1 — Selectors Fluency

**Focus:** Being able to write the *exact* selector needed for any structural situation without guessing-and-checking in DevTools.

**Exercises:**
1. Select every `<p>` that is the first child of its parent.
2. Select every `<li>` that does *not* have the class `.featured`.
3. Select every `<input>` whose `type` attribute is exactly `email`.
4. Select the second-to-last `<div>` among a group of sibling `<div>`s.
5. Select every `<a>` whose `href` starts with `https://` but does not contain `example.com`.

<details>
<summary>View solutions</summary>

1. `p:first-child`
2. `li:not(.featured)`
3. `input[type="email"]`
4. `div:nth-last-child(2)`
5. `a[href^="https://"]:not([href*="example.com"])`

</details>

**Level project:** Build a styled FAQ list where every *other* question has a subtly different background tint, using `:nth-child(even)`/`:nth-child(odd)` with zero classes added to the HTML for the striping itself.

---

## Level 2 — The Cascade and Specificity

**Focus:** Predicting, without testing in a browser, which rule wins in a cascade conflict.

**Exercises:**
1. Given `.card p { color: red; }` and `p { color: blue; }`, which wins, and why?
2. Given `#header .logo { color: red; }` and `.site-header .site-logo.active { color: blue; }`, calculate both specificity tuples and determine the winner.
3. Why does `!important` on a utility class often create *more* long-term specificity problems than it solves?
4. Two rules have identical specificity, one in a stylesheet linked first, one linked second, both targeting the same element with the same property. Which wins?

<details>
<summary>View solutions</summary>

1. `.card p` wins — one class + one element (0,1,1) beats one element alone (0,0,1), regardless of source order.
2. `#header .logo` = one ID + one class (1,1,0). `.site-header .site-logo.active` = three classes (0,3,0). An ID always outweighs any number of classes, so `#header .logo` wins despite being textually shorter.
3. Because `!important` breaks the normal, predictable specificity ordering — once used, the only way to override it later is with *another*, even more forceful `!important` (or a more specific `!important` selector), starting a "specificity war" that makes the cascade progressively harder to reason about and maintain, exactly the failure mode Part 15 warns against.
4. The rule that appears later in source order wins — with equal specificity, the cascade falls back to source order as the tiebreaker.

</details>

**Level project:** Deliberately construct a small HTML page with at least 4 conflicting CSS rules targeting the same element from different specificity levels (element, class, ID, inline), predict the winner on paper first, then verify in a browser.

---

## Level 3 — Box Model Precision

**Focus:** Correctly predicting an element's *actual* rendered dimensions given its content, padding, border, and margin, under both `content-box` and `border-box`.

**Exercises:**
1. A `<div>` has `width: 200px; padding: 20px; border: 5px solid;` under default `content-box` sizing. What is its total rendered width?
2. The same `<div>`, now with `box-sizing: border-box`. What is its total rendered width?
3. Two sibling `<div>`s each have `margin-bottom: 20px` / `margin-top: 30px` respectively, both block-level, no padding/border/flex/grid context. What is the actual visible gap between them?
4. Why does adding `overflow: hidden` to a parent sometimes "fix" a margin-collapsing issue?

<details>
<summary>View solutions</summary>

1. 200 + 20+20 (padding) + 5+5 (border) = 250px.
2. Exactly 200px — `border-box` makes the declared `width` already include padding and border.
3. 30px, not 50px — adjacent vertical margins between block siblings collapse to the *larger* of the two values, not their sum (Part 18).
4. `overflow: hidden` establishes a Block Formatting Context (BFC) on that element, and margin collapsing rules explicitly don't reach across a BFC boundary — this is a real, if slightly accidental-feeling, side effect of BFC creation, and is worth understanding as *why* it works rather than applying it as an unexplained trick.

</details>

**Level project:** Build a vertical stack of 5 cards with intentionally mismatched margin values, first observe the (possibly surprising) collapsed gaps, then refactor to use `gap` on a flex container instead and compare the predictability of the two approaches.

---

## Level 4 — Flexbox Deep Practice (15+ Exercises)

**Focus:** True fluency with the flex sizing algorithm — not just "flexbox centers things," but confidently predicting how `flex-grow`, `flex-shrink`, and `flex-basis` interact under real constraints.

**Exercises:**
1. Center a single `<div>` both horizontally and vertically within its parent.
2. Build a 3-item row where the middle item takes up exactly twice the space of the other two.
3. Build a row where one item is pinned to the far right, the rest cluster on the left.
4. Explain, precisely, why `<img>` elements can overflow a flex item's bounds even when the flex item itself has `overflow: hidden` — and fix it.
5. Given three flex items with `flex: 1 1 200px`, `flex: 2 1 200px`, `flex: 1 1 100px` in a 900px-wide container (no gap), calculate each item's final rendered width.
6. Build a sticky-footer page layout (footer always at the bottom of the viewport, even on pages with very little content) using Flexbox on `<body>`.
7. Make a flex row wrap onto multiple lines, with consistent gap both horizontally and vertically between wrapped items.
8. Explain the "flexbox `min-width: auto` overflow trap" from Part 24 and provide the one-line fix.
9. Build a flex item that should never grow or shrink, remaining exactly its content's natural size regardless of its siblings.
10. Vertically align items within a flex row to their text baselines, not their box edges.
11. Reverse the visual order of flex items without changing the HTML source order, and explain the accessibility caveat of doing so.
12. Build a card where the header is fixed height, the body fills all remaining space, and the footer is fixed height — a 3-part vertical flex stack.
13. Given `justify-content: space-between` on a row with only *one* child, where does that child end up, and why?
14. Explain why `align-items: stretch` (the flex default) can cause child elements with a border to appear at different visual heights than expected when siblings have different content lengths — and how `align-items: flex-start` changes that.
15. Build a horizontally scrollable row of fixed-width cards using Flexbox (not Grid), with `flex-shrink: 0` on each card — explain why `flex-shrink: 0` is essential here.

<details>
<summary>View solutions</summary>

1. `.parent { display: flex; align-items: center; justify-content: center; }`
2. `.item-middle { flex: 2; } .item-side { flex: 1; }` on all three items' shared parent (`display: flex`).
3. `.parent { display: flex; } .right-item { margin-left: auto; }` — the classic auto-margin push, used repeatedly throughout Part 53.
4. Flex items default to `min-width: auto`, which can prevent them from shrinking below their content's intrinsic size — but images have *no* intrinsic minimum width constraint of their own inside a shrinking flex item, so they can overflow the item's visually shrunk box. Fix: add `min-width: 0` to the flex item, or `max-width: 100%` directly on the `<img>`.
5. Total basis: 200+200+100 = 500px. Remaining space: 900-500 = 400px. Total grow factor: 1+2+1 = 4. Each grow unit = 100px. Item 1: 200+100=300px. Item 2: 200+200=400px. Item 3: 100+100=200px. (300+400+200=900, confirms correct.)
6. `body { display: flex; flex-direction: column; min-height: 100vh; } main { flex: 1; }` — `main` absorbs all remaining vertical space, pushing the footer to the true bottom of the viewport even when content is short.
7. `.parent { display: flex; flex-wrap: wrap; gap: 1rem; }` — the single `gap` property (Part 24) handles both axes' spacing simultaneously once wrapping is enabled, unlike the old margin-based wrapping-gap workarounds.
8. The trap: flex items default to `min-width: auto`, preventing them from shrinking smaller than their content demands, which can cause overflow instead of the expected shrink. Fix: `min-width: 0` on the item.
9. `flex: 0 0 auto` (grow: 0, shrink: 0, basis: auto — its own content size, fixed).
10. `align-items: baseline` on the flex container.
11. `order: -1` (or any value lower than its siblings') on that item. Caveat: this changes only *visual* order, not DOM/reading order — screen reader and keyboard tab order remain unaffected, which can create a mismatch between what's seen and what's announced/tabbed-through, as covered in Project 19's explanation.
12. `.card { display: flex; flex-direction: column; height: 400px; } .card-header, .card-footer { flex: 0 0 auto; } .card-body { flex: 1; overflow-y: auto; }`
13. It stays in its default position (start of the main axis, or centered depending on other properties) — `space-between` distributes space *between* multiple items, and with only one item, there's no "between" to distribute, so the behavior effectively falls back to `flex-start`.
14. `align-items: stretch` makes every flex item stretch to match the tallest sibling's height along the cross axis by default — a bordered item next to a much-taller sibling will visually appear the same height as that tallest sibling (border included), which can look "wrong" if you expected each item to hug only its own content; `align-items: flex-start` instead lets each item size purely to its own content height, breaking that shared-height behavior.
15. `.parent { display: flex; overflow-x: auto; } .card { flex: 0 0 240px; }` — `flex-shrink: 0` is essential because without it, the default `flex-shrink: 1` would let the browser shrink every card to fit the container instead of allowing genuine horizontal overflow/scrolling, which defeats the entire purpose of a horizontally scrolling row.

</details>

**Level project:** Rebuild Part 53 Project 4's pricing table from scratch, from memory, without referring back to the original solution, applying at least 6 of the Flexbox techniques drilled above.

---

## Level 5 — Grid Deep Practice

**Focus:** Fluency with track sizing, `fr` units, `grid-template-areas`, and explicit item placement.

**Exercises:**
1. Build a 12-column grid system (the classic "12-col grid" pattern) where a content block can span any number from 1 to 12 columns via a utility class.
2. Explain the difference between `1fr` and `minmax(0, 1fr)` and identify a real scenario where using bare `1fr` causes unwanted overflow.
3. Build a holy-grail layout (header, footer, main content, left sidebar, right sidebar) using `grid-template-areas`, then collapse it to a single column on mobile with the sidebars stacking below main content.
4. Given `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`, explain exactly what happens as the container shrinks below 200px times the current column count.
5. Place a single grid item explicitly at column line 2 through line 4, and row line 1 through line 3, using line-based placement rather than `span`.

<details>
<summary>View solutions</summary>

1. `.grid-12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; } .col-6 { grid-column: span 6; } .col-4 { grid-column: span 4; }` etc. for each needed span value.
2. `1fr` alone doesn't prevent a track from growing to accommodate an oversized, non-shrinkable child (like a long unbroken string or a fixed-width image) — it can overflow its "fair share" if the content refuses to shrink. `minmax(0, 1fr)` explicitly caps the track's minimum size at `0`, allowing it to actually shrink below its content's natural size and forcing that content to wrap/truncate/scroll internally instead of blowing out the grid — a real, common fix for "why is my grid overflowing" bugs.
3. `.layout { display: grid; grid-template-areas: "header header" "sidebar-left main" "sidebar-left sidebar-right" "footer footer"; grid-template-columns: 200px 1fr; } @media (max-width: 700px) { .layout { grid-template-areas: "header" "main" "sidebar-left" "sidebar-right" "footer"; grid-template-columns: 1fr; } }` (exact area names/counts adjustable to the specific brief).
4. Once the container is narrower than what's needed to fit even a single `200px` column, the single remaining column shrinks below `200px` down toward its `1fr` (now effectively `minmax(200px, 1fr)`'s minimum, `200px` — meaning it will NOT shrink below 200px and will instead cause the container to overflow/scroll, unless `minmax(0, 1fr)` or similar was used) — this is a common gotcha worth testing explicitly rather than assuming `auto-fit` gracefully handles every width down to zero.
5. `.item { grid-column: 2 / 4; grid-row: 1 / 3; }`

</details>

**Level project:** Rebuild Part 53 Project 22's asymmetric analytics dashboard panel from scratch, from memory.

---

## Level 6 — Responsive Design and Media Queries

**Focus:** Choosing the right responsive technique (fluid sizing, `clamp()`, container queries, or a media query) for a given problem, rather than reaching for a media query by default.

**Exercises:**
1. A heading should scale fluidly between `1.5rem` at a 320px viewport and `3rem` at a 1200px viewport, with no visible "jump" at any width in between. Write the one-line solution.
2. A card component needs to change its internal layout from stacked to side-by-side based on *its own* available width, not the viewport's — which CSS feature is this, and why can't a media query achieve it?
3. Identify, in one sentence each, which of these situations needs a media query versus which can be solved with fluid CSS alone: (a) a 3-column grid becoming 1 column on mobile, (b) a heading's font-size scaling smoothly with viewport width, (c) a sidebar disappearing entirely below a certain width, (d) a row of cards reflowing from 4 to 2 to 1 columns as the viewport shrinks.
4. Write a media query targeting devices in landscape orientation specifically, regardless of pixel width.

<details>
<summary>View solutions</summary>

1. `font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem);` (the exact linear coefficient may vary depending on desired scaling rate, but the structural answer is a `clamp()` with a `vw`-based middle preferred value).
2. Container queries (`@container`), introduced in Part 37. A media query only has access to the *viewport's* dimensions, with no way to know how wide the specific container housing this specific card happens to be in a given layout context (e.g., the same card component might be narrow in a sidebar and wide in a main content area on the very same page) — container queries solve exactly this "component doesn't know its own context" problem.
3. (a) needs a media query — a genuine structural change in column count at a specific threshold. (b) fluid CSS alone (`clamp()`) — no structural change, just continuous scaling. (c) needs a media query — a genuine presence/absence structural change. (d) needs media queries UNLESS `auto-fit`/`auto-fill` with `minmax()` is used instead, in which case it can be fluid CSS alone — the "correct" answer depends on whether exact column-count control at specific breakpoints is required or a general "as many as fit" behavior is acceptable.
4. `@media (orientation: landscape) { ... }`

</details>

**Level project:** Take any single project from Part 53's Beginner tier and rebuild its responsive behavior using `clamp()`-based fluid typography and spacing instead of any breakpoint-based font-size/spacing changes, keeping only genuinely structural media queries (layout shape changes) if any remain necessary.

---

## Level 7 — Container Queries

**Focus:** Using `@container` correctly — establishing containment contexts and querying against them, distinct from viewport-based media queries.

**Exercises:**
1. Explain why an element cannot container-query against itself, and what the practical implication of that rule is for how you structure a component's HTML.
2. Convert Part 53 Project 3's product card into a version that switches from a vertical (image-on-top) layout to a horizontal (image-on-side) layout when its *container* — not the viewport — is wider than 400px.
3. Name a real scenario (not from this course) where a container query solves a layout problem a media query genuinely cannot.

<details>
<summary>View solutions</summary>

1. A container query needs to know its containing element's size *before* deciding how the queried element itself should render — if the queried element and the containing element were the same element, you'd have a circular dependency (the element's own layout depends on a query about its own size, which depends on its own layout...). Practical implication: you always need a wrapping element with `container-type: inline-size` (or similar) one level up from the element whose styles you actually want to change based on that container's width.
2. ```css
   .card-wrapper { container-type: inline-size; }
   .product-card { display: flex; flex-direction: column; }
   @container (min-width: 400px) {
     .product-card { flex-direction: row; }
     .product-card__media { flex: 0 0 40%; }
   }
   ```
3. Any component library scenario where the same card/widget component is reused in multiple different layout contexts on one page (a wide main content area, a narrow sidebar, a small modal) — a single global viewport-width media query can't give that one component different styles in each of those different contexts simultaneously, since the viewport width is identical in all three cases; only a container query, scoped to each instance's own actual rendered width, can.

</details>

**Level project:** Take Part 53 Project 16's dashboard stat cards and make each stat card internally reflow (stacked value+label vs. side-by-side value+label) based on its own grid-cell width using a container query, so the same card component looks correct whether it ends up in a 4-column or a 2-column stat grid.

---

## Level 8 — CSS Custom Properties as a System

**Focus:** Using custom properties not just for colors, but as genuine computed, cascading, JavaScript-free configuration values.

**Exercises:**
1. Build a single reusable `.avatar` component whose size is controlled entirely by a `--size` custom property set per-instance via inline `style`, with the component's CSS never hard-coding a pixel dimension.
2. Explain why custom properties *inherit* and *cascade* (unlike Sass variables, which are resolved at compile time and have no runtime relationship to the DOM tree) — and describe one practical technique this enables that a preprocessor variable cannot.
3. Use a custom property combined with `calc()` to build a consistent spacing scale where each step is a multiplier of one base unit, changeable globally by editing only that one base unit.
4. Write a fallback value for a custom property that might not be defined, using the two-argument form of `var()`.

<details>
<summary>View solutions</summary>

1. ```css
   .avatar { width: var(--size, 40px); height: var(--size, 40px); border-radius: 50%; }
   ```
   ```html
   <img class="avatar" style="--size: 80px" src="..." alt="...">
   ```
2. Because custom properties are resolved live, in the browser, at render/paint time, following the actual DOM tree's cascade and inheritance — a custom property set on a parent element is visible to (and can be overridden by) any descendant, dynamically, including descendants added to the DOM after the stylesheet was parsed. A Sass variable, by contrast, is substituted once at *compile* time into static CSS text, with zero runtime relationship to the DOM at all. Practical technique this enables: a single component's CSS can reference `var(--component-accent, var(--global-accent))`, letting any *specific instance* of that component override its accent color just by setting `--component-accent` on a wrapping element anywhere in the DOM — impossible with compile-time-only variables, since there'd be no way to know at compile time which specific DOM instance needs which value.
3. ```css
   :root { --space-unit: 4px; }
   .box { margin-bottom: calc(var(--space-unit) * 6); } /* 24px, but scales if --space-unit ever changes */
   ```
4. `color: var(--brand-color, #3454d1);` — if `--brand-color` is undefined anywhere in the cascade, `#3454d1` is used instead.

</details>

**Level project:** Refactor the Part 53 Project 24 design-tokens page so that at least one component (buttons) can have its size (small/medium/large) controlled entirely by a `--btn-scale` custom property multiplied via `calc()` against base padding/font-size values, rather than three separate hard-coded size classes.

---

## Level 9 — Animations and Transitions

**Focus:** Building purposeful, performant motion — knowing which properties are safe to animate, and using `@keyframes` correctly for anything beyond a simple two-state transition.

**Exercises:**
1. Explain why `transition: all 0.3s ease` is generally discouraged in production code, in favor of naming specific properties.
2. Write a `@keyframes` animation that makes an element gently pulse (scale up and back down) infinitely, and explain why `transform: scale()` is used rather than animating `width`/`height` directly.
3. Build a loading skeleton placeholder (a gray box with a subtle shimmer animation moving across it) using a `linear-gradient` background and `background-position` animation.
4. Add a `prefers-reduced-motion` guard to the pulse animation from exercise 2 so it becomes a static state for users who've requested reduced motion, rather than simply removing the visual entirely.

<details>
<summary>View solutions</summary>

1. `transition: all` forces the browser to watch *every* animatable property on that element for changes, which is both wasteful (most properties never actually change) and dangerous (it can accidentally animate a property change you didn't intend to be animated — e.g., a layout shift caused by unrelated JS toggling a class — producing a jarring, unintended visual glitch). Naming specific properties (`transition: transform 0.3s ease, opacity 0.3s ease`) is both more performant and more predictable.
2. ```css
   @keyframes pulse {
     0%, 100% { transform: scale(1); }
     50% { transform: scale(1.05); }
   }
   .badge { animation: pulse 2s ease-in-out infinite; }
   ```
   `transform: scale()` is used instead of animating `width`/`height` because `transform` is a compositor-only property (Part 33/48) — it can be animated smoothly by the GPU without triggering layout recalculation on every frame, unlike animating `width`/`height` directly, which forces a full layout reflow on every single frame of the animation and is far more likely to visibly stutter, especially on lower-powered devices.
3. ```css
   .skeleton {
     background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
     background-size: 200% 100%;
     animation: shimmer 1.5s infinite;
   }
   @keyframes shimmer {
     0% { background-position: 200% 0; }
     100% { background-position: -200% 0; }
   }
   ```
4. ```css
   @media (prefers-reduced-motion: reduce) {
     .badge { animation: none; transform: scale(1.03); }
   }
   ```
   A static, slightly-scaled state (rather than simply removing all styling) preserves *some* visual signal that the element is meant to draw attention, without the motion itself — following Part 33's guidance that `prefers-reduced-motion` should replace, not just delete, an animation's communicative purpose where reasonable.

</details>

**Level project:** Add a fully accessible (staggered-in, `prefers-reduced-motion`-guarded) entrance animation to Part 53 Project 17's photo gallery, where each photo fades and slides in slightly with a small delay increment per item (using `animation-delay` set via `:nth-child()` or a per-item custom property).

---

## Level 10 — CSS Architecture (BEM, CUBE CSS, ITCSS)

**Focus:** Recognizing which architecture methodology fits a given project's scale and team, and applying one consistently.

**Exercises:**
1. Rename a poorly-structured set of classes (`.box`, `.box2`, `.red-text`, `.mt20`) into proper BEM naming for a card component with a title and a "featured" variant.
2. Explain the core difference in philosophy between BEM (component-scoped naming) and a utility-first approach (like Tailwind-style atomic classes) — and describe one real scenario where each approach is the better fit.
3. Describe, in your own words, what ITCSS's layered ordering (Settings → Tools → Generic → Elements → Objects → Components → Utilities) is trying to solve, structurally, about specificity.

<details>
<summary>View solutions</summary>

1. `.card`, `.card--featured`, `.card__title`.
2. BEM scopes styling decisions to named, reusable components, making a component's full visual behavior legible from its class name alone and easy to reuse consistently across a codebase — well-suited to a design-system-driven product with a defined, relatively stable set of components (exactly this course's capstone project). Utility-first scopes styling decisions to individual, composable, single-property classes applied directly in markup, trading some HTML verbosity for extremely fast iteration and a near-total absence of "what does `.card--featured` actually do, let me go find its CSS" lookups — well-suited to rapid prototyping or teams that prioritize velocity and consistency-by-constraint over named, semantic component classes. Neither is objectively superior; the right choice depends on team size, project lifespan, and how much the visual language is expected to be reused versus iterated on rapidly.
3. ITCSS's layer ordering is specifically trying to ensure that *specificity increases monotonically* as you move through the stylesheet, top to bottom — global resets and low-specificity element selectors come first, broad reusable layout "objects" next, more specific named components after that, and highly-specific utility overrides last — so that later rules in the cascade are reliably *at least as specific* as earlier ones, eliminating a huge class of "why isn't my later rule overriding the earlier one" specificity-fight bugs that occur when high- and low-specificity rules are scattered unpredictably throughout a file in no particular order.

</details>

**Level project:** Take the Part 54 capstone's CSS (already BEM-named) and reorganize it into explicit ITCSS-style commented sections (`/* SETTINGS */`, `/* GENERIC */`, `/* ELEMENTS */`, `/* COMPONENTS */`) within the same file, without changing any actual selector or declaration — a pure reordering/labeling exercise that makes the existing architecture's layering explicit.

---

## Level 11 — Debugging Practice

**Focus:** Diagnosing broken layouts fast, using the systematic method from Part 47, without guessing-and-checking randomly.

**Exercises (each is a real bug to diagnose and fix):**
1. `.card { width: 100%; padding: 40px; }` inside a `300px`-wide parent overflows the parent. Diagnose and fix without changing the `300px` parent width.
2. `.modal { position: fixed; z-index: 999; }` renders *behind* a sibling `.header { position: sticky; z-index: 10; }` despite the modal's much higher z-index number. Diagnose why.
3. A flex row of 4 equal-width cards suddenly has one card noticeably narrower than the rest after adding a long, unbroken product name to just that one card's title. Diagnose and fix.
4. `.hero { height: 100%; }` renders as zero height and is invisible, despite its parent clearly having visible content below it. Diagnose why.

<details>
<summary>View solutions</summary>

1. With default `content-box` sizing, `width: 100%` (=300px) plus `40px` padding on each side adds 80px, making the true rendered width 380px — overflowing the 300px parent by 80px. Fix: add `box-sizing: border-box` to `.card` (or globally, per the Part 41 reset), which makes the declared `width: 100%` already include the padding.
2. `position: sticky` and `position: fixed` elements only compete on `z-index` when they share the same *stacking context* — if `.header`'s ancestor creates a new stacking context (e.g., via a `transform`, `opacity < 1`, or `will-change` on some ancestor between it and the root) that `.modal` is not also inside, `.header`'s stacking context could be painted as a whole *above* `.modal`'s stacking context regardless of either element's own individual `z-index` value. Fix: identify the stacking-context-creating property on `.header`'s ancestor and either remove it or move `.modal` to be a direct child of `<body>` (a common, deliberate "portal to body" pattern used specifically to guarantee a modal always stacks above everything else, avoiding ancestor stacking-context traps entirely).
3. This is the classic `min-width: auto` flex overflow trap from Part 24/Level 4 — the long unbroken title is preventing that one flex item from shrinking to match its siblings' width, since flex items refuse to shrink below their content's intrinsic minimum width by default. Fix: add `min-width: 0` to the flex item, and/or `overflow-wrap: break-word` on the title text itself so long words can actually wrap instead of forcing the box wider.
4. Percentage-based `height` values need an ancestor with an *explicitly defined* height (not just `auto`, which is the default) to resolve against — if every ancestor up the chain, including `<html>`/`<body>`, has only `auto` height (i.e., "as tall as my content"), then `height: 100%` has nothing concrete to be 100% *of*, and resolves to `0`. Fix: either give a specific ancestor (commonly `html, body`) an explicit height (`height: 100%` chained all the way up, or `min-height: 100vh` on `body`), or replace the percentage-based height with a viewport unit (`height: 100vh`) if the actual goal was "full viewport height," not "full parent height."

</details>

**Level project:** Deliberately introduce all four bugs above into working copies of earlier course projects, then fix each one using only DevTools (no peeking at your own prior correct code) — the single best rehearsal for real-world debugging speed.

---

## Level 12 — Responsive Forms

**Focus:** Forms that remain usable, labeled, and visually coherent from a small phone through a wide desktop, including touch-target sizing.

**Exercises:**
1. Explain the minimum recommended touch-target size for a mobile form control, and why undersized touch targets are a genuine, measurable usability failure, not just an aesthetic nitpick.
2. Convert a form whose fields are laid out in a fixed two-column Grid on all screen sizes into one that responsively becomes a single column below 600px.
3. Explain why `font-size: 16px` or larger on form inputs specifically matters on iOS Safari, beyond general readability.

<details>
<summary>View solutions</summary>

1. Widely-cited accessibility guidance recommends at minimum roughly 44x44px (or the platform-equivalent, e.g., 48x48dp on Android) as a comfortable, reliably-tappable touch target — below this, real users (not just those with limited fine motor control, though it matters most acutely for them) measurably mis-tap adjacent controls at a higher rate, a concretely testable usability failure rather than a subjective style preference.
2. `.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }`
3. iOS Safari automatically zooms the viewport in when a user focuses an input whose computed `font-size` is smaller than 16px, as a built-in accessibility/usability behavior for typically-tiny mobile text — this zoom is often jarring and unwanted in a well-designed form, so keeping form input font-size at 16px or above sidesteps the automatic zoom entirely, a real, non-obvious mobile-specific detail worth knowing rather than discovering by accident in production.

</details>

**Level project:** Take Part 53 Project 7's registration form and explicitly audit every interactive element's rendered touch-target size at a 375px viewport width using DevTools, resizing any that fall under ~44px.

---

## Level 13 — Print and Alternate Media

**Focus:** Producing genuinely usable printed output, not just "whatever happens to render."

**Exercises:**
1. Hide all navigation, buttons, and non-essential chrome from print output for Part 54's capstone product grid, leaving only product names, images, and prices.
2. Ensure every link's destination URL is visible in the printed output, since a printed page can't be clicked.
3. Force each product card to avoid being split across a page break.

<details>
<summary>View solutions</summary>

1. ```css
   @media print {
     .site-header, .skip-link, .filters, .toolbar, .pagination, .site-footer, .product-card__add { display: none; }
   }
   ```
2. ```css
   @media print {
     .product-card__title a::after { content: " (" attr(href) ")"; font-size: 0.75em; }
   }
   ```
3. ```css
   @media print {
     .product-card { break-inside: avoid; }
   }
   ```

</details>

**Level project:** Build a complete `@media print` stylesheet for the Part 54 capstone's full product grid page, verified via your browser's print preview.

---

## Level 14 — Accessibility Deep Practice

**Focus:** Going beyond "add alt text" into genuinely testing real keyboard and screen-reader flows.

**Exercises:**
1. Identify and fix the accessibility problem: `<div onclick="toggleMenu()">Menu</div>` used as a clickable menu trigger.
2. Add correct `aria-expanded` state management (structurally, in the HTML, ready for JS to toggle) to a collapsible FAQ trigger built from a real `<button>`.
3. Explain why `outline: none` on `:focus` without any replacement styling is one of the single most damaging, common real-world accessibility mistakes.
4. Write the correct accessible markup pattern for an icon-only close button inside a modal.

<details>
<summary>View solutions</summary>

1. A `<div>` with a click handler is invisible to keyboard navigation (not focusable by default, no `tabindex`) and carries no semantic role a screen reader would announce as "button." Fix: use a real `<button type="button" onclick="toggleMenu()">Menu</button>` instead — native buttons are keyboard-focusable, activatable via Enter/Space, and correctly announced, entirely for free.
2. ```html
   <button type="button" aria-expanded="false" aria-controls="faq-answer-1">What is your return policy?</button>
   <div id="faq-answer-1" hidden>...</div>
   ```
   (JS would toggle both the `aria-expanded` value and the `hidden` attribute together.)
3. Because it removes the *only* visual signal a keyboard-only user has for where they currently are on the page — without a visible focus indicator, keyboard navigation becomes effectively unusable (a user can't tell which element their next Enter/Space keypress will activate), which is a complete, not partial, usability failure for that entire class of user, not a minor cosmetic issue.
4. ```html
   <button type="button" aria-label="Close dialog">
     <svg aria-hidden="true">...</svg>
   </button>
   ```
   The icon SVG is `aria-hidden="true"` (purely decorative to assistive tech), and the button itself carries the meaningful `aria-label` since there's no visible text label for the icon.

</details>

**Level project:** Perform a full keyboard-only and screen-reader pass (using your OS's built-in screen reader — VoiceOver, NVDA, or TalkBack) across the entire Part 54 capstone, documenting every issue found, then fix each one.

---

## Level 15 — Full Component Build From a Design Description Alone

**Focus:** The final, integrative level — building a complete, non-trivial component from a plain-English design description with no code scaffold at all, simulating a real work handoff.

**Brief (build this from the description alone, no hints provided):** "Build a 'notification toast' component: a small floating card that appears in the bottom-right corner of the viewport, containing an icon, a title, a short message, and a close button. It should support three visual variants — success (green accent), warning (amber accent), and error (red accent) — distinguished by both an icon and a color, never color alone. It must be keyboard-dismissible, fully readable at 200% browser zoom, and must not visually break if the message text is unusually long."

<details>
<summary>View one complete solution</summary>

```html
<div class="toast toast--success" role="status">
  <span class="toast__icon" aria-hidden="true">&#10003;</span>
  <div class="toast__content">
    <p class="toast__title">Changes saved</p>
    <p class="toast__message">Your profile has been updated successfully.</p>
  </div>
  <button type="button" class="toast__close" aria-label="Dismiss notification">&times;</button>
</div>
```

```css
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  max-width: 360px;
  background: white;
  border-radius: 10px;
  padding: 1rem 1.1rem;
  box-shadow: 0 8px 24px rgb(0 0 0 / 15%);
  border-left: 4px solid;
  z-index: 1000;
}
.toast--success { border-left-color: #1d7a3b; }
.toast--warning { border-left-color: #b3760b; }
.toast--error { border-left-color: #b3123a; }
.toast__icon {
  flex: 0 0 auto;
  width: 22px; height: 22px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; color: white;
}
.toast--success .toast__icon { background: #1d7a3b; }
.toast--warning .toast__icon { background: #b3760b; }
.toast--error .toast__icon { background: #b3123a; }
.toast__content { flex: 1; min-width: 0; }
.toast__title { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.15rem; }
.toast__message { font-size: 0.85rem; color: #555; overflow-wrap: break-word; }
.toast__close {
  flex: 0 0 auto;
  background: none; border: none; cursor: pointer;
  font-size: 1.1rem; line-height: 1; color: #999;
  padding: 0.15rem;
}
.toast__close:hover { color: #333; }
```

**Why this satisfies every stated requirement:** `border-left-color` plus a colored icon background together encode the variant, never relying on the border color alone — a user with color vision deficiency still gets a distinct icon shape/position cue (here a simple checkmark/glyph, in production distinct icons per variant). `role="status"` (rather than `role="alert"`) is the correct choice for a non-critical success confirmation — it's announced politely by screen readers without interrupting whatever the user is currently doing, whereas `role="alert"` would be reserved for a genuinely urgent, interrupting message (an error the user must act on immediately). `min-width: 0` on `.toast__content` (the exact Level 4 flex-overflow-trap fix) combined with `overflow-wrap: break-word` on the message ensures a long, unbroken message string wraps within the toast's `max-width` rather than overflowing it. Using `rem`-based sizing throughout (no fixed pixel font-sizes) ensures the whole component scales correctly and remains fully readable under 200% browser zoom, since `rem` values scale with the user's browser-level font-size/zoom settings rather than staying fixed.

</details>

---

Completing all 15 levels of this track, alongside the capstone, represents genuine, defensible CSS fluency — not memorized syntax, but the kind of pattern-recognition and decision-making speed that separates "can eventually produce correct CSS with enough trial and error" from "can predict what will happen before touching a keyboard." That distinction is the entire goal of this course.

---

# Part 56 — Interview Questions

These are the kinds of HTML/CSS questions that genuinely come up in real frontend interviews, at a range of depths. Each includes a full answer, not just a one-liner — the goal is to understand the reasoning well enough to handle a follow-up question, not to memorize a script.

## Conceptual Questions

**Q: What's the difference between `display: none`, `visibility: hidden`, and `opacity: 0`?**

All three make an element invisible, but they differ in layout impact and interactivity. `display: none` removes the element from the layout entirely — it takes up no space, and it's removed from the accessibility tree (screen readers skip it). `visibility: hidden` keeps the element's space reserved in the layout (an invisible gap remains) but the element is unclickable and skipped by screen readers, though its descendants can override with `visibility: visible` to become visible again inside an otherwise-hidden parent (unlike `display: none`, which no override can undo). `opacity: 0` keeps the element fully in the layout, fully interactive (still clickable, still focusable, still announced to screen readers) — only its visual rendering is transparent. Choosing the right one matters: `opacity: 0` alone on something meant to be truly hidden is a real, common accessibility bug (an invisible-but-still-tabbable element).

**Q: Explain the CSS Box Model.**

Every element's rendered box is composed of four concentric layers, from the inside out: content (the actual text/image/whatever), padding (space between content and border, same background as the content), border (a visible or invisible edge around the padding), and margin (transparent space outside the border, separating this element from its neighbors). `box-sizing: content-box` (the default) means a declared `width`/`height` applies only to the content layer, with padding and border added on top; `box-sizing: border-box` means the declared `width`/`height` already includes padding and border, which is why most production resets set `border-box` globally — it makes sizing far more predictable.

**Q: What is the difference between `em` and `rem`?**

Both are relative units, but they're relative to *different* things. `em` is relative to the font-size of the *current* element (or, when used for a non-font-size property, the current element's own font-size) — and because font-size itself can be set in `em`, nested elements compound their sizing multiplicatively, which can produce surprising, hard-to-predict results. `rem` ("root em") is always relative to the *root* (`<html>`) element's font-size, regardless of nesting depth — giving predictable, non-compounding sizing, which is why `rem` is generally preferred for most sizing in modern CSS, with `em` reserved for cases where you specifically want a value to scale relative to its own component's local font-size (like padding that should grow proportionally if that one button's font-size is increased).

**Q: What causes a Flexbox item to not shrink as expected?**

The most common cause is the `min-width: auto` (or `min-height: auto` in a column flex container) default on flex items, which prevents an item from shrinking below its content's intrinsic minimum size — a long unbroken word, a wide image, or similar content can force the item wider than its siblings even when `flex-shrink` is set to allow shrinking. The fix is explicitly setting `min-width: 0` on the flex item.

**Q: What's the difference between `position: absolute` and `position: fixed`?**

Both remove the element from normal document flow and position it based on offsets (`top`/`right`/`bottom`/`left`). `position: absolute` positions relative to its nearest *positioned* ancestor (any ancestor with `position` set to something other than `static`) — or the initial containing block if none exists — meaning it scrolls along with that ancestor's content. `position: fixed` positions relative to the *viewport* itself (or a `transform`-affected/`will-change`-affected ancestor, a real, easy-to-miss gotcha), staying visually pinned in place even as the page scrolls.

**Q: How does CSS specificity work, and what wins in a tie?**

Specificity is calculated as a tuple: (inline styles, ID selectors, class/attribute/pseudo-class selectors, element/pseudo-element selectors). Higher values in an earlier position in that tuple always outrank any number of lower-position selectors (one ID beats a thousand classes). When two rules have identical specificity, the cascade falls back to source order — whichever rule appears later in the stylesheet (or in a later-linked stylesheet) wins. `!important` overrides normal specificity entirely, and among multiple `!important` declarations, the same specificity-then-source-order rules apply again, just at a higher priority tier.

**Q: What's the difference between `<div>` and semantic elements like `<section>`, `<article>`, `<aside>`?**

`<div>` carries no semantic meaning at all — it's a pure, generic styling/grouping hook, communicating nothing to assistive technology, search engines, or another developer reading the markup. `<section>`, `<article>`, `<aside>`, `<nav>`, `<header>`, `<footer>`, and similar elements each communicate a specific structural role: `<article>` is self-contained, independently distributable content (a blog post, a product card); `<section>` is a thematic grouping, generally expected to have its own heading; `<aside>` is tangentially related content (a sidebar, a pull-quote); `<nav>` is a block of primary navigational links. Using the correct semantic element gives screen reader users navigable landmarks and gives the document a genuine, inspectable outline — value a `<div>` never provides no matter how it's styled.

**Q: Explain how CSS Grid and Flexbox differ, and when you'd choose one over the other.**

Flexbox is fundamentally one-dimensional — it lays out items along a single axis (row or column) and excels at distributing space among items in that one direction, wrapping onto new lines/rows only as an overflow behavior, not as a designed two-dimensional relationship between those lines. Grid is fundamentally two-dimensional — it defines both rows and columns simultaneously as a true, explicit grid, and items can be placed or span across both dimensions intentionally. Choose Flexbox for content that's naturally a single row or column (a nav bar, a card's internal vertical stack, a button group). Choose Grid for anything requiring genuine two-dimensional structure (a page-level layout with a sidebar and main area, a card gallery with defined columns, an asymmetric dashboard).

**Q: What is a stacking context, and what creates one?**

A stacking context is a self-contained "z-order universe" — an element that establishes one becomes the root of its own independent z-index ordering, and its descendants' `z-index` values are only meaningful *relative to each other* within that context, never able to escape above or below elements in a sibling stacking context regardless of how high a `z-index` number is used. Stacking contexts are created by: the root element, any element with `position` other than `static` combined with a `z-index` other than `auto`, any element with `opacity` less than 1, `transform`, `filter`, `will-change`, or `isolation: isolate` (among a few other, less common triggers). This is the direct explanation behind the classic "why won't my `z-index: 9999` show above this other element" bug.

**Q: What's the difference between `visibility: collapse` and `visibility: hidden` for table rows specifically?**

`visibility: hidden` on a table row hides its content but the row still occupies its normal height in the table's layout (an invisible gap remains). `visibility: collapse`, when applied to a table row or column specifically, removes that row/column's space entirely from the table's layout — the table re-flows as if that row didn't exist, distinct from `display: none`'s more universal removal-from-flow behavior, and distinct from `visibility: hidden`'s space-preserving behavior — a narrow, table-specific value worth knowing exists even though it's rarely used in modern layouts.

## Practical / "Explain This Code" Questions

**Q: Why does this fail to center the div?**
```css
.parent { display: flex; }
.child { margin: auto; }
```
*(Trick question — it doesn't fail. `margin: auto` on a flex item, in both axes, is a legitimate and correct way to center a single item within a flex container — the "auto margins absorb all available space equally" behavior from Part 24, applied on both axes simultaneously rather than just one, produces genuine centering. This question tests whether a candidate assumes `justify-content`/`align-items` are the *only* way to center in Flexbox.)*

**Q: What will this render as, and why?**
```css
.box { width: 100px; height: 100px; background: red; }
.box::before { content: ""; }
```
*Answer:* Just a 100x100px red box, unchanged — `::before` generates a pseudo-element, but with no explicit `display` set, it defaults to `inline` and has `content: ""` (empty string), meaning it generates no visible content and takes up no meaningful visual space. This tests whether a candidate understands that `content: ""` still *creates* the pseudo-element (it exists in the render tree) even though it displays nothing by default until sized/styled further.

**Q: A developer reports `"my flex-basis is being ignored"` on an item styled `flex: 1 1 200px`. What's the most likely cause?**

The most likely cause is that the flex container is a *column* (`flex-direction: column`), in which case `flex-basis` controls the item's initial *height*, not width — a very common point of confusion, since `flex-basis` always refers to size along the *main axis*, which is height in a column flex container, not width as most people instinctively assume from Flexbox's row-first mental model.

## Behavioral / "Judgment" Questions (Answer in Your Own Words During a Real Interview)

- "Tell me about a time you had to fix a layout bug you didn't understand at first. How did you debug it?" — a real answer should reference a *systematic* method (isolate, inspect computed styles, bisect by removing rules) rather than "I just tried random things until it worked."
- "How do you decide whether a new component needs its own CSS class versus reusing a utility class?" — a real answer should reference tradeoffs between reusability, semantic clarity, and team conventions, not a dogmatic "always do X."
- "How would you convince a team to invest time in accessibility work that has no visible feature impact?" — a real answer should connect accessibility to concrete business/legal/user-reach reasoning, not just an appeal to abstract virtue.

---

# Part 57 — The 17 Cheat Sheets

Quick-reference sheets for active use while building — not meant to teach concepts (that's what Parts 0-52 are for), but to be the thing you actually glance at mid-project when you've forgotten exact syntax.

## Cheat Sheet 1 — HTML Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <meta name="description" content="...">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- content -->
</body>
</html>
```

## Cheat Sheet 2 — Semantic HTML Elements

| Element | Use for |
|---|---|
| `<header>` | Introductory content / nav for a page or section |
| `<nav>` | A block of primary navigation links |
| `<main>` | The document's primary content (one per page) |
| `<article>` | Self-contained, independently distributable content |
| `<section>` | Thematic grouping, usually with its own heading |
| `<aside>` | Tangentially related content |
| `<footer>` | Closing content for a page or section |
| `<figure>`/`<figcaption>` | Self-contained media with a caption |
| `<time datetime="...">` | Machine-readable dates/times |
| `<address>` | Contact info for the page's author/owner |

## Cheat Sheet 3 — Text and Inline Elements

| Element | Meaning |
|---|---|
| `<strong>` | Strong importance (bold by default) |
| `<em>` | Stress emphasis (italic by default) |
| `<mark>` | Highlighted/relevant text |
| `<small>` | Side comments, fine print |
| `<abbr title="...">` | Abbreviation with expansion |
| `<code>` | Inline code |
| `<sub>`/`<sup>` | Subscript/superscript |
| `<br>` | Line break (visual, use sparingly) |
| `<wbr>` | Optional word-break opportunity |

## Cheat Sheet 4 — Forms

```html
<form action="/submit" method="post">
  <label for="name">Name</label>
  <input type="text" id="name" name="name" required autocomplete="name">

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required autocomplete="email">

  <fieldset>
    <legend>Group label</legend>
    <label><input type="radio" name="opt" value="a"> A</label>
    <label><input type="radio" name="opt" value="b"> B</label>
  </fieldset>

  <button type="submit">Submit</button>
</form>
```

| Input type | Use for |
|---|---|
| `text` | General short text |
| `email` | Email (validated format, email keyboard on mobile) |
| `password` | Masked input |
| `number` | Numeric input, with `min`/`max`/`step` |
| `date` | Native date picker |
| `search` | Search fields |
| `tel` | Phone numbers (numeric keypad on mobile) |
| `checkbox` | Multiple selectable options |
| `radio` | Single selection from a group (shared `name`) |

## Cheat Sheet 5 — CSS Selectors

| Selector | Matches |
|---|---|
| `.class` | Elements with that class |
| `#id` | The element with that ID |
| `*` | Every element |
| `A B` | B, anywhere inside A |
| `A > B` | B, a direct child of A |
| `A + B` | B, immediately after A (same parent) |
| `A ~ B` | B, any later sibling of A |
| `[attr]` | Elements with that attribute |
| `[attr="val"]` | Exact attribute value match |
| `[attr^="val"]` | Attribute value starts with |
| `[attr$="val"]` | Attribute value ends with |
| `[attr*="val"]` | Attribute value contains |
| `:hover` / `:focus` / `:active` | Interaction states |
| `:focus-visible` | Focus shown only for keyboard nav |
| `:first-child` / `:last-child` | Position among siblings |
| `:nth-child(n)` | nth sibling (supports `2n`, `odd`, `even`) |
| `:not(...)` | Negation |
| `:has(...)` | Parent-selection based on descendant |
| `::before` / `::after` | Generated content |

## Cheat Sheet 6 — Specificity Calculation

```
Specificity tuple: (inline, IDs, classes/attrs/pseudo-classes, elements/pseudo-elements)

  Inline style        → (1,0,0,0)
  #id                  → (0,1,0,0)
  .class .attr :hover  → (0,0,1,0) each
  div, p, ::before     → (0,0,0,1) each

  Compare left to right; higher value in an earlier position always wins.
  Equal specificity → later source order wins.
  !important overrides normal specificity entirely.
```

## Cheat Sheet 7 — The Box Model

```
┌─────────────────── margin ───────────────────┐
│  ┌─────────────── border ─────────────────┐  │
│  │  ┌───────────── padding ─────────────┐  │  │
│  │  │           content                  │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘

box-sizing: content-box (default) → width/height = content only
box-sizing: border-box            → width/height = content + padding + border
```

## Cheat Sheet 8 — CSS Units

| Unit | Relative to |
|---|---|
| `px` | Fixed pixels |
| `%` | Parent's corresponding dimension |
| `em` | Current element's font-size |
| `rem` | Root (`<html>`) font-size |
| `vw` / `vh` | 1% of viewport width / height |
| `vmin` / `vmax` | 1% of the smaller / larger viewport dimension |
| `ch` | Width of the "0" character in current font |
| `fr` | A fraction of remaining space (Grid only) |

## Cheat Sheet 9 — Flexbox Properties

```
Container:
  display: flex;
  flex-direction: row | row-reverse | column | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
  justify-content: flex-start | center | space-between | space-around | space-evenly;
  align-items: stretch | flex-start | center | flex-end | baseline;
  align-content: (like justify-content, but for wrapped lines);
  gap: <row-gap> <column-gap>;

Items:
  flex-grow: <number>;      /* default 0 */
  flex-shrink: <number>;    /* default 1 */
  flex-basis: <length | auto>;
  flex: <grow> <shrink> <basis>;  /* shorthand */
  align-self: <overrides align-items for one item>;
  order: <number>;          /* default 0 */
```

## Cheat Sheet 10 — CSS Grid Properties

```
Container:
  display: grid;
  grid-template-columns: 1fr 2fr 100px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "header header" "sidebar main";
  gap: <row-gap> <column-gap>;
  grid-auto-flow: row | column | dense;

Items:
  grid-column: 2 / 4;         /* line-based */
  grid-column: span 2;        /* span-based */
  grid-row: 1 / 3;
  grid-area: header;          /* named area */

Common patterns:
  repeat(auto-fit, minmax(200px, 1fr))   /* flexible reflowing columns */
  repeat(12, 1fr)                         /* 12-column grid */
```

## Cheat Sheet 11 — Positioning

| Value | Behavior |
|---|---|
| `static` | Default; offsets ignored |
| `relative` | Offset from its own normal position; still occupies original space |
| `absolute` | Offset from nearest positioned ancestor; removed from flow |
| `fixed` | Offset from the viewport; removed from flow; stays put on scroll |
| `sticky` | Acts `relative` until a scroll threshold, then acts `fixed` |

## Cheat Sheet 12 — Responsive Design Patterns

```css
/* Fluid typography */
font-size: clamp(1rem, 2vw + 0.5rem, 2rem);

/* Auto-reflowing card grid, no media query */
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

/* Mobile-first breakpoint */
@media (min-width: 768px) { /* tablet-up overrides */ }

/* Container query */
.wrapper { container-type: inline-size; }
@container (min-width: 400px) { /* component-level override */ }
```

## Cheat Sheet 13 — Custom Properties (CSS Variables)

```css
:root {
  --accent: #3454d1;
}
.el {
  color: var(--accent);
  color: var(--undefined-var, #333); /* fallback */
}
/* Runtime-scoped override */
.dark-section { --accent: #6c85e6; }
```

## Cheat Sheet 14 — Transitions and Animations

```css
/* Transition (two states) */
.el { transition: transform 0.2s ease, opacity 0.2s ease; }

/* Animation (keyframes, multi-state / looping) */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.el { animation: fade-in 0.3s ease forwards; }

/* Always guard with: */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## Cheat Sheet 15 — Accessibility Essentials

```
- Every <img> needs alt (empty alt="" only if purely decorative)
- Every form input needs an associated <label for="id">
- Heading levels must be sequential (no skipped levels)
- Interactive elements need visible :focus-visible states
- Never rely on color alone to convey meaning
- Use aria-label only when there's no visible text alternative
- Use aria-current="page" for the active nav link
- Use role="status" for polite live updates, role="alert" for urgent ones
- Minimum touch target: ~44x44px
- Test with keyboard only (Tab/Shift+Tab/Enter/Space/Escape)
```

## Cheat Sheet 16 — Common Debugging Checklist

```
1. Check box-sizing (content-box vs border-box)
2. Check for margin collapsing between block siblings
3. Check flex/grid item min-width/min-height: auto overflow trap
4. Check stacking context boundaries for z-index issues
5. Check specificity/source-order for "my CSS isn't applying"
6. Check parent height chain for % height resolving to 0
7. Check for a missing box-sizing reset causing overflow
8. Use DevTools Computed panel, not just Styles panel
```

## Cheat Sheet 17 — Print CSS Essentials

```css
@media print {
  nav, .no-print, button { display: none; }
  body { color: #000; background: #fff; }
  a[href^="http"]::after { content: " (" attr(href) ")"; }
  h1, h2 { break-after: avoid; }
  table, figure, .card { break-inside: avoid; }
  @page { margin: 2cm; }
}
```

---

# Part 58 — Browser Compatibility and Progressive Enhancement

## What it is

Not every browser your users open supports every CSS feature at the same time — some are recent (container queries, `:has()`, subgrid), some have long, uneven support histories (Flexbox gaps, Grid). Browser compatibility work is the discipline of knowing which features are safe to use unconditionally, which need a fallback, and how to build so that older or less-capable browsers get a *working*, if less polished, experience rather than a broken one.

## Why it exists

The web has no single, centrally-controlled runtime — unlike a native app built for one OS version, a website may be opened in a five-year-old browser on an old Android device, a corporate-locked outdated browser, or the newest Chrome release, often on the very same day. Progressive enhancement is the philosophy that answers this reality directly: build the core experience with widely-supported, robust features first, then layer *enhancements* on top for browsers capable of taking advantage of them — rather than building for the newest browser first and hoping older ones don't break too badly.

## `@supports` — Feature Queries

```css
/* Baseline, works everywhere */
.gallery {
  display: flex;
  flex-wrap: wrap;
}
.gallery > * {
  flex: 1 1 220px;
}

/* Enhancement, only applied where supported */
@supports (display: grid) {
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
```

`@supports` lets you test whether a browser understands a given CSS property/value pair *before* applying rules that depend on it — the Flexbox fallback above still produces a reasonable, functional wrapping layout in a browser that somehow lacks Grid support, while browsers that do support Grid get the more precise Grid-based layout instead. This is progressive enhancement's core mechanical tool.

💡 **Tip:** Write the fallback (baseline) rules first, unconditionally, then wrap only the enhancement in `@supports`. Never invert this — writing the modern rules unconditionally and trying to "undo" them inside a `@supports not (...)` block is more fragile and harder to reason about.

## Checking Real Support Data

Before relying on any modern feature (container queries, `:has()`, `aspect-ratio`, subgrid, cascade layers, the Popover API), check actual current browser support data rather than assuming — support tables change over time, and a feature that had spotty support a year ago may be universally supported now, or vice versa for a brand-new proposal.

⚠️ **Common mistake:** Assuming "if it works in my browser, it works everywhere." Always verify against real compatibility data (a browser compatibility reference site) for any feature you're not already confident is broadly supported, especially before shipping it as a non-enhanced, load-bearing part of a layout.

## Vendor Prefixes (Historical Context, Still Occasionally Relevant)

```css
.el {
  -webkit-backdrop-filter: blur(8px); /* Safari still requires this for some properties */
  backdrop-filter: blur(8px);
}
```

Vendor prefixes (`-webkit-`, `-moz-`, historically `-ms-`, `-o-`) were browsers' mechanism for shipping experimental CSS features before they were standardized, letting developers opt into not-yet-finalized behavior without risking future standard syntax changes breaking their code. Most properties that once needed prefixes are long-since standardized and prefix-free — but a handful of properties (notably some newer Safari-specific behaviors like `backdrop-filter`) still benefit from including the prefixed version alongside the standard one for maximum compatibility. Always write the unprefixed, standard property *last*, so it takes precedence in browsers that support both.

## Graceful Degradation vs. Progressive Enhancement

These are often confused but represent genuinely opposite starting points. **Progressive enhancement** starts from a working baseline and adds capability for browsers that support it (the `@supports` example above). **Graceful degradation** starts by building for the *most* capable browsers first, then attempts to patch/fallback for less-capable ones after the fact. Progressive enhancement is generally the more robust approach precisely because the baseline is *guaranteed* to work everywhere by construction (it's what you built first, deliberately using only broadly-supported features) — graceful degradation's fallback patches are always somewhat reactive and easier to miss a case for.

## Testing Across Real Browsers

Automated support-data lookups tell you what *should* work; only real testing confirms what *actually* works in your specific implementation. At minimum, a real production project should be manually checked in the current versions of Chrome, Firefox, and Safari, plus mobile Safari (iOS) and Chrome (Android) specifically — mobile browsers have real, distinct rendering quirks (the viewport-zoom-on-focus behavior from Part 55's Level 12, `100vh` historically including/excluding the mobile address bar inconsistently across browsers) that desktop testing alone will never surface.

## Common Compatibility Gotchas Worth Knowing

- `100vh` on mobile browsers has historically had inconsistent behavior around the address bar's show/hide state; the newer `100dvh` (dynamic viewport height) unit was introduced specifically to solve this, and is worth checking current support for before relying on it exclusively.
- `gap` on Flexbox (not Grid) had a real, meaningfully later support rollout than `gap` on Grid — worth double-checking if targeting older browser versions specifically.
- `:has()` is a genuinely powerful, relatively recent addition — confirm current support before treating it as universally safe for a production baseline feature (as opposed to a progressive enhancement).

✅ **Checkpoint:** Before shipping any CSS feature you learned about for the first time in Parts 36-46 of this course, get in the habit of asking: "is this safe as a baseline requirement, or does it need an `@supports`-guarded fallback?" — and actually check current support data rather than guessing.

---

# Part 59 — Production Practices

## Code Organization

A real production CSS codebase needs a predictable place for everything. A common, defensible structure:

```
styles/
  tokens.css          /* custom properties: colors, spacing, type scale */
  reset.css           /* the global reset/base layer */
  layout.css          /* page-level layout primitives (containers, grids) */
  components/
    button.css
    card.css
    nav.css
  utilities.css       /* small, single-purpose override classes */
```

This mirrors the ITCSS layering discussed in Part 55 Level 10 — low-specificity, global rules first, increasingly specific/scoped rules later — and gives every future contributor (including future-you) a predictable place to look for, and add, any given rule.

## Naming Conventions

Consistency matters more than which specific convention you choose. BEM (`.block__element--modifier`), used throughout the Part 54 capstone, is one robust, widely-adopted option — but whichever convention a project adopts, the value comes entirely from *never mixing conventions within one codebase*. A file with `.card-title`, `.cardHeader`, and `.Card__Footer` all coexisting is a maintenance liability regardless of which individual convention "wins" — the inconsistency itself is the cost.

## Code Review Checklist for CSS/HTML

A genuinely useful checklist to apply to your own work (or a teammate's) before merging:

- [ ] Does every image have appropriate `alt` text?
- [ ] Is every form input correctly labeled?
- [ ] Are heading levels sequential?
- [ ] Does every interactive element have a visible focus state?
- [ ] Are color-only distinctions avoided?
- [ ] Is `box-sizing: border-box` applied (globally, via the reset)?
- [ ] Are magic numbers replaced with design tokens where a token exists for that purpose?
- [ ] Has the layout been checked at a genuinely narrow width (360px), not just resized-desktop?
- [ ] Are `prefers-reduced-motion` guards present on any non-trivial animation?
- [ ] Is there any unused/dead CSS this change should have removed but didn't?
- [ ] Would a `!important` in this diff be better solved by fixing the actual specificity conflict?

## Performance Budget Awareness

Real production teams often set explicit *budgets* — a maximum acceptable CSS bundle size, a maximum acceptable number of web font files, a target Largest Contentful Paint time — rather than optimizing performance reactively only once a problem is noticed. Even informally, it's worth asking, before adding a new font file, a new large background image, or a new animation library: "is this worth its cost against the loading experience?"

## Version Control Hygiene for CSS

CSS changes are notoriously easy to review poorly, because a diff showing "one line changed" can have sweeping, hard-to-predict visual consequences elsewhere in a large, insufficiently-scoped stylesheet (a classic symptom of poor CSS architecture, not a fundamental property of CSS itself). Well-organized, component-scoped CSS (Part 39, Part 55 Level 10) directly mitigates this risk: a change to `.product-card`'s BEM-scoped rules is far less likely to have surprising side effects elsewhere than a change to a loosely-scoped, deeply-nested selector reused unpredictably across many unrelated contexts.

## Documentation Worth Keeping

A living style guide or component reference page (exactly the pattern rehearsed in Part 53 Project 24) is genuinely valuable production documentation — not a "nice to have" extra, but the concrete artifact that lets a new team member discover "oh, there's already a `.badge--warning` class" instead of accidentally creating a fourth, slightly-different warning-badge style from scratch. Treat it as a real deliverable, kept in sync with the actual production CSS, not a one-time document that drifts out of date the moment it's written.

---

# Part 60 — Final Assessments

These two assessments are meant to be taken seriously, under real conditions: no looking back at earlier Parts while attempting them, a genuine attempt at every question before checking any answer. Passing both, honestly, is a real signal that this course's material has actually landed, not just been read past.

## Final HTML Assessment

**Section A — Short Answer (no code)**

1. What is the difference between an HTML *element* and an HTML *tag*?
2. Why does the `alt` attribute matter even for sighted users on a slow connection?
3. Name three block-level elements and three inline elements.
4. What does the `for` attribute on a `<label>` do, and why does it matter for accessibility?
5. Why is `<table>` the wrong choice for a purely visual, non-tabular layout?
6. What's the difference between `<ol>` and `<ul>`, beyond default bullet styling?
7. Explain what a "void element" is and give two examples.
8. Why must heading levels (`<h1>`–`<h6>`) never skip a level?
9. What does `<meta name="viewport" content="width=device-width, initial-scale=1.0">` actually do, and what breaks without it?
10. What is the difference between `<script>`, `<script async>`, and `<script defer>`? *(Conceptual only — full JS loading behavior is outside this course's scope, but the HTML-level distinction is fair game.)*

**Section B — Fix the Bug**

11. Find and fix every accessibility problem in this markup:
```html
<div class="button" onclick="submitForm()">Submit</div>
<img src="chart.png">
<input type="text" placeholder="Your email">
```

12. This form has a structural bug — identify and fix it:
```html
<form>
  <label>Email</label>
  <input type="email" id="user-email">
</form>
```

**Section C — Build From a Description**

13. Write complete, semantic HTML (no CSS needed) for a blog post preview card containing: a category tag, a title (linked), a publish date (machine-readable), a two-sentence excerpt, and an author byline.

<details>
<summary>View complete answer key</summary>

**Section A:**
1. A tag is the markup syntax itself (`<p>`, `</p>`) — the element is the complete unit the tags define, including its content and attributes (`<p>Hello</p>` is the element; `<p>` alone is the opening tag).
2. Because `alt` text loads (and can be read) even before, or if, the image itself fails to load — on a slow connection, users often see meaningful alt text long before (or instead of) the actual image, making it functionally important for more than just screen reader users.
3. Block-level (examples): `<div>`, `<p>`, `<section>`. Inline (examples): `<span>`, `<a>`, `<strong>`.
4. `for="id"` programmatically associates a label with its input by matching the input's `id` — this lets clicking the label focus/activate the input, and critically, lets screen readers announce the label's text when the input receives focus, which proximity alone never guarantees.
5. Because `<table>` communicates genuine tabular, row/column-related data to assistive technology (announced with row/column context) — using it purely for visual grid positioning misrepresents unrelated content as if it had a data relationship it doesn't actually have, confusing screen reader navigation.
6. `<ol>` communicates that item *order* is meaningful (sequence matters); `<ul>` communicates that it doesn't. This affects how assistive technology announces the list (an ordered list announces item numbers) and communicates real semantic meaning beyond the default bullet-vs-number visual styling, which can be overridden independently of the semantic choice.
7. A void element cannot have any children/content and has no closing tag — examples: `<img>`, `<br>`, `<input>`, `<hr>`.
8. Because assistive technology users rely on the heading hierarchy as a navigable document outline — a skipped level (`<h1>` directly followed by `<h3>`) creates a confusing, inaccurate outline, as if a section of the document's structure is simply missing.
9. It tells the browser to set the layout viewport's width to match the actual device width (rather than defaulting to a wide desktop-oriented layout viewport, historically around 980px, that mobile browsers assumed by default) and sets the initial zoom level to 100%. Without it, a responsive site's media queries and fluid layouts would be evaluated against an incorrect, unnecessarily wide viewport width on mobile, and the page would render tiny and require the user to manually pinch-zoom.
10. Plain `<script>` blocks HTML parsing entirely until the script downloads and executes, right where it appears in the document. `<script async>` downloads in parallel with HTML parsing but executes as soon as it's ready, potentially interrupting parsing at an unpredictable point (and doesn't guarantee execution order relative to other scripts). `<script defer>` also downloads in parallel with parsing, but execution is deferred until after HTML parsing completes, and multiple deferred scripts execute in their original document order — generally the safest default for scripts that need the full DOM to exist and need predictable ordering.

**Section B:**
11. Fixed version:
```html
<button type="button" onclick="submitForm()">Submit</button>
<img src="chart.png" alt="Quarterly revenue trending upward, Q1 to Q4">
<label for="user-email-input">Your email</label>
<input type="email" id="user-email-input">
```
   (A `<div>` isn't keyboard-focusable/activatable by default and has no button semantics; the image had no `alt` at all; the input relied on `placeholder` as its only label, which disappears on focus/input and isn't reliably treated as a label by assistive technology.)
12. The bug: `<label>` has no `for` attribute, so it's not programmatically associated with the input despite visual proximity. Fixed: `<label for="user-email">Email</label>` (matching the input's existing `id="user-email"`).

**Section C:**
```html
<article class="post-preview">
  <span class="tag">Design</span>
  <h2><a href="/posts/design-systems-fail">Why Most Design Systems Fail Within a Year</a></h2>
  <p>It's rarely a tooling problem. It's almost always an adoption and maintenance problem.</p>
  <p class="byline">By Nikhil Rao &middot; <time datetime="2026-02-02">February 2, 2026</time></p>
</article>
```

</details>

---

## Final CSS Assessment

**Section A — Short Answer**

1. Explain the CSS cascade's full priority order, from lowest to highest priority.
2. What's the difference between `inherit`, `initial`, and `unset`?
3. Why does `z-index` sometimes "not work," even with a very high value?
4. What's the difference between `min-width` and `width`, and when would setting both matter?
5. Explain what `overflow: hidden` does to margin collapsing, and why.
6. What does the `gap` property do, and on which layout modes does it work?
7. Why is `transform`/`opacity` generally preferred for animation over `width`/`top`/`left`?
8. What is a "Block Formatting Context" and name one thing it prevents?
9. Explain the difference between `auto-fit` and `auto-fill` in a Grid `repeat()` function.
10. What does `prefers-reduced-motion` detect, and why does it matter?

**Section B — Predict the Output**

11. Given:
```css
.a { color: red !important; }
#b { color: blue; }
```
```html
<p id="b" class="a">Text</p>
```
What color is the text, and why?

12. Given:
```css
.box { width: 50%; padding: 20px; box-sizing: content-box; }
```
Inside a `400px`-wide parent, what is `.box`'s total rendered width?

13. Given:
```css
.parent { display: flex; }
.child { flex: 1 1 0; }
```
Three `.child` elements share this parent, one containing far more text than the others. How will their widths compare, and why?

**Section C — Fix the Bug**

14. This layout overflows its parent. Fix it, explaining why the bug occurs:
```css
.card { width: 100%; padding: 2rem; border: 1px solid; }
```

15. This flex item refuses to shrink below its content's width despite `flex-shrink: 1`. Fix it:
```css
.item { flex: 1 1 auto; }
```

<details>
<summary>View complete answer key</summary>

**Section A:**
1. From lowest to highest priority: user-agent (browser default) styles → user styles (rarely relevant today) → author (your own) styles, with specificity and source order deciding ties within that layer → author `!important` declarations → user `!important` declarations (which, unusually, can override author `!important` — a rare, mostly historical edge case).
2. `inherit` explicitly forces a property to take its computed value from the parent element (useful for properties that don't inherit by default, like `color` on some elements, or to explicitly restore inheritance after an override). `initial` resets a property to its specification-defined default value, ignoring both any inheritance and any other cascade rule. `unset` acts as `inherit` for properties that naturally inherit (like `color`), or as `initial` for properties that don't naturally inherit (like `margin`) — effectively "undo everything and fall back to the natural default behavior for this specific property."
3. Because `z-index` only has meaning *within* a stacking context — two elements in different, sibling stacking contexts never compete directly on `z-index` value; the entire stacking context each belongs to is painted as a unit, in the z-order of *those contexts*, regardless of how extreme a `z-index` is set on an element deep inside one of them.
4. `width` sets a preferred/target size; `min-width` sets a floor that size is never allowed to shrink below, even if other layout pressure (like Flexbox shrinking, or a narrow parent) would otherwise push it smaller. Setting both matters when you want a flexible/fluid width (`width: 100%`, say) that should still never become uncomfortably narrow (`min-width: 200px`), combining fluid sizing with a hard floor.
5. `overflow: hidden` (or any value other than `visible`) on a parent establishes a new Block Formatting Context for that parent, and BFC boundaries are one of the documented conditions under which adjacent-sibling and parent-child margin collapsing is explicitly prevented from happening across that boundary — this is why `overflow: hidden` is a known, if slightly indirect, fix for certain unwanted margin-collapse situations.
6. `gap` sets consistent spacing *between* sibling items in a layout, without adding space around the outer edge of the whole group (unlike margin, which would need `:not(:last-child)` or similar workarounds to avoid an unwanted trailing gap). It works on Flexbox, Grid, and multi-column layout containers.
7. Because `transform` and `opacity` are compositor-only properties — the browser can animate them entirely on the GPU compositing layer without triggering layout recalculation (reflow) or repaint on every single animation frame, making them dramatically smoother and less CPU-intensive than animating properties like `width`, `top`, or `left`, which force a full layout recalculation on every frame of the animation.
8. A Block Formatting Context is an independent layout "mini-world" within which block-level boxes lay out according to their own self-contained rules, isolated from the outer page's layout in specific ways. One concrete thing a BFC prevents: margin collapsing from reaching across its boundary (see answer 5); another: a BFC-establishing parent will correctly contain/wrap floated children that would otherwise "escape" and collapse the parent's height to zero.
9. `auto-fit` collapses any empty, unused tracks to zero width once there are fewer actual items than would fill a row, letting the existing items stretch to fill all available space. `auto-fill` keeps all potential tracks reserved (even empty ones), so existing items stay at their `minmax()`-defined size rather than stretching to fill leftover space, leaving visible empty track-width instead.
10. It detects an operating-system-level user preference (set outside the browser, in OS accessibility settings) indicating the user has asked for reduced motion, typically due to vestibular disorders or motion sensitivity where non-essential animation can cause genuine physical discomfort (dizziness, nausea). It matters because it's the mechanism by which a website can respect that real, sometimes medically-relevant preference rather than forcing motion on every visitor regardless of their needs.

**Section B:**
11. Red. `#b` has higher specificity (0,1,0,0) than `.a` (0,0,1,0), and would normally win — but `.a`'s `color: red !important` overrides normal specificity comparison entirely; `!important` declarations are compared against other `!important` declarations first (and `#b`'s rule has no `!important`), so the `!important` rule wins regardless of the underlying specificity difference.
12. With `content-box` (explicitly set here, matching the default): declared `width: 50%` of 400px = 200px content width, plus `20px` padding on each side (40px total) = 240px total rendered width. (Note: this deliberately overflows the visual "50% of parent" expectation, exactly the kind of `box-sizing` gotcha covered throughout the course.)
13. All three will render at *different* widths, not equal ones, despite identical `flex: 1 1 0` declarations — because `flex-basis: 0` combined with `flex-grow: 1` on all three means available space is distributed equally *in addition to* each item's zero starting basis, which *should* produce equal widths... except the item with far more text still has a non-overridden `min-width: auto` default, which can prevent it from shrinking below its content's intrinsic minimum width even under `flex-basis: 0` — meaning the text-heavy item will typically end up wider than its siblings unless `min-width: 0` is explicitly added, exactly the Level 4 flex-overflow-trap pattern.

**Section C:**
14. Bug cause: default `box-sizing: content-box` means `width: 100%` plus `2rem` padding on each side (adding roughly 64px total, depending on root font-size) plus the `1px` border makes the true rendered width exceed the parent's available space, causing overflow. Fix: `box-sizing: border-box;` on `.card` (or, better, applied globally via a reset), which makes the declared `width: 100%` already account for padding and border.
15. Bug cause: the flex item's `min-width: auto` default is preventing it from shrinking below its content's intrinsic width, overriding the effect of `flex-shrink: 1`. Fix: `.item { flex: 1 1 auto; min-width: 0; }` (and, if the content is text that should wrap rather than just clip, also add `overflow-wrap: break-word`).

</details>

---

# Part 61 — Final Build-It-Yourself Challenge

## The Brief

Build a **"Recipe Discovery" interface** — a single-page application shell (structure and styling only, no JS behavior) combining nearly everything this course has covered, presented here deliberately as a brief rather than a scaffold, exactly as a real assignment or take-home task would be given to you.

**Requirements:**
1. A sticky header with logo, primary nav, and a search bar that visually expands to full-width on focus (CSS-only interaction)
2. A hero section introducing the app, with a large search input as its primary call to action
3. A filter bar (not sidebar this time — a horizontal, scrollable-on-mobile row of filter "chip" toggles: cuisine type, dietary restriction, cook time)
4. A responsive recipe card grid — each card: image, title, cook time badge, difficulty badge, a save/bookmark icon-button
5. An individual recipe detail page (a second HTML file/view) showing: hero image, title, metadata bar (prep/cook/servings/difficulty), ingredients list with adjustable-looking serving-size stepper (structure only), numbered instructions, and a "related recipes" card row at the bottom
6. Full dark mode support via the token-swap pattern
7. Fully responsive from 360px to 1440px
8. A complete design-token system driving every visual value
9. Full accessibility: landmarks, labels, focus states, correct heading hierarchy, no color-only meaning
10. At least one genuinely novel layout decision not directly copy-pasted from an earlier project in this course — a real, if small, act of original design judgment

**Explicitly NOT required:** actual search functionality, actual filter behavior, actual bookmark persistence, actual serving-size recalculation — build the complete, correct, production-ready structure and styling for all of it, exactly as the capstone project did.

Attempt this now, genuinely, before reading further. Sketch the component list you'd need, decide your token set, and build at least the recipe card grid and one detail page before opening the architecture walkthrough below.

---

<details>
<summary>View architecture walkthrough (read after attempting)</summary>

A reasonable approach, broken into the same staged discipline as the Part 54 capstone:

**1. Component inventory first.** Before any code: header, hero-with-search, filter-chip-row, recipe-card, recipe-grid, recipe-detail-hero, metadata-bar, serving-stepper, ingredient-list, instruction-list, related-recipes-row. Naming every component before building it (even roughly) is itself valuable planning discipline, directly mirroring how the capstone's Stage 2 wireframe fixed structural decisions before any visual design began.

**2. Tokens, informed by this specific brief.** Beyond the capstone's token set, this brief specifically needs difficulty-level colors (easy/medium/hard) and cook-time badge styling — plan those token names (`--color-difficulty-easy`, etc.) before writing component CSS, exactly as Part 53 Project 24 rehearsed.

**3. The "expands on focus" search bar** is this challenge's genuinely novel layout requirement (requirement #10). A clean, CSS-only approach: give the search `<input>` a modest default `width`, then a `:focus-visible` (or `:focus-within` on its wrapping `<form>`, which is often the more robust choice since it also reacts to focus reaching any child of the form, not just the input itself) rule that increases its width with a `transition`, e.g.:
```css
.hero-search { width: 320px; transition: width 0.25s ease; }
.hero-search:focus-within { width: 480px; }
```
This is a genuinely new pattern relative to every earlier project in this course, and satisfies requirement #10 legitimately rather than through cosmetic-only variation.

**4. Filter chips as a horizontally-scrolling row** directly reuses the `scroll-snap` technique from Part 53 Project 19's testimonial row, applied to a different content type — a good example of pattern *reuse* being just as valid a skill as pattern *invention*.

**5. The serving-size stepper** (structure-only, no working JS) is best built as a small flex row: a decrement button, a number display, an increment button — reusing the icon-button accessibility pattern (`aria-label`) from Part 53 Project 6's password-visibility toggle.

**6. The two-page structure** (grid page + detail page) should share one external stylesheet, exactly per Part 53 Project 25's multi-page discipline — resist the temptation to duplicate styles between the two files.

</details>

<details>
<summary>View complete reference implementation (recipe grid page)</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kitchenly — Discover Recipes</title>
<style>
  :root {
    color-scheme: light dark;
    --color-bg: #fafaf7; --color-surface: #ffffff; --color-text: #1a1a1a;
    --color-muted: #6b6b6b; --color-border: #e5e2da; --color-accent: #c9793a;
    --color-accent-dark: #a35f28;
    --color-difficulty-easy: #1d7a3b; --color-difficulty-medium: #b3760b; --color-difficulty-hard: #b3123a;
    --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem; --space-5: 1.25rem; --space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem;
    --radius-sm: 8px; --radius-md: 12px; --radius-full: 999px;
    --font-family-base: system-ui, sans-serif;
    --content-max-width: 1100px;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --color-bg: #1a1712; --color-surface: #24211b; --color-text: #f2efe8;
      --color-muted: #a39d8f; --color-border: #3a352c; --color-accent: #e0975a;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: var(--font-family-base); color: var(--color-text); background: var(--color-bg); line-height: 1.6; }
  img { max-width: 100%; display: block; }
  h1, h2, h3, p { margin: 0; }
  a { color: inherit; text-decoration: none; }
  ul { list-style: none; margin: 0; padding: 0; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  .container { max-width: var(--content-max-width); margin-inline: auto; padding-inline: var(--space-5); }

  .site-header { background: var(--color-surface); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 10; }
  .site-header .container { display: flex; align-items: center; gap: var(--space-6); padding-block: var(--space-4); }
  .logo { font-weight: 800; font-size: 1.15rem; margin-right: auto; }
  .site-header nav { display: flex; gap: var(--space-5); font-size: 0.9rem; color: var(--color-muted); }

  .hero { text-align: center; padding-block: var(--space-12) var(--space-8); }
  .hero h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); margin-bottom: var(--space-2); }
  .hero p { color: var(--color-muted); margin-bottom: var(--space-6); }
  .hero-search { display: inline-flex; }
  .hero-search input {
    font: inherit; padding: var(--space-3) var(--space-5);
    border: 1px solid var(--color-border); border-radius: var(--radius-full);
    width: 320px; transition: width 0.25s ease;
    background: var(--color-surface); color: var(--color-text);
  }
  .hero-search:focus-within input { width: 480px; }
  @media (max-width: 560px) {
    .hero-search input, .hero-search:focus-within input { width: 260px; }
  }

  .filter-row { display: flex; gap: var(--space-2); overflow-x: auto; padding: var(--space-2) 0 var(--space-6); scroll-snap-type: x proximity; }
  .filter-chip {
    scroll-snap-align: start; flex: 0 0 auto;
    background: var(--color-surface); border: 1px solid var(--color-border);
    border-radius: var(--radius-full); padding: var(--space-2) var(--space-4);
    font-size: 0.85rem; cursor: pointer;
  }
  .filter-chip[aria-pressed="true"] { background: var(--color-accent); color: white; border-color: var(--color-accent); }

  .recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-5); padding-bottom: var(--space-12); }
  .recipe-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
  .recipe-card__media { position: relative; aspect-ratio: 4/3; }
  .recipe-card__media img { width: 100%; height: 100%; object-fit: cover; }
  .recipe-card__save { position: absolute; top: var(--space-2); right: var(--space-2); background: rgb(255 255 255 / 90%); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 0.9rem; }
  .recipe-card__body { padding: var(--space-4); }
  .recipe-card__title { font-size: 1rem; margin-bottom: var(--space-2); }
  .recipe-card__meta { display: flex; gap: var(--space-2); font-size: 0.75rem; }
  .badge { padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-weight: 700; }
  .badge--time { background: #eef0fb; color: #3454d1; }
  .badge--easy { background: #e3f7e9; color: var(--color-difficulty-easy); }
  .badge--medium { background: #fff4e0; color: var(--color-difficulty-medium); }
  .badge--hard { background: #fde3e8; color: var(--color-difficulty-hard); }
</style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <span class="logo">Kitchenly</span>
      <nav aria-label="Primary"><a href="#">Discover</a><a href="#">Saved</a><a href="#">Meal Plans</a></nav>
    </div>
  </header>

  <section class="hero container">
    <h1>Find your next favorite recipe</h1>
    <p>Search thousands of recipes by ingredient, cuisine, or cook time.</p>
    <form class="hero-search" role="search">
      <label class="visually-hidden" for="recipe-search">Search recipes</label>
      <input type="search" id="recipe-search" placeholder="Try &quot;30-minute pasta&quot;&hellip;">
    </form>
  </section>

  <div class="container">
    <div class="filter-row" role="group" aria-label="Recipe filters">
      <button type="button" class="filter-chip" aria-pressed="true">All</button>
      <button type="button" class="filter-chip" aria-pressed="false">Italian</button>
      <button type="button" class="filter-chip" aria-pressed="false">Vegetarian</button>
      <button type="button" class="filter-chip" aria-pressed="false">Under 30 min</button>
      <button type="button" class="filter-chip" aria-pressed="false">Gluten-Free</button>
    </div>

    <ul class="recipe-grid">
      <li>
        <article class="recipe-card">
          <div class="recipe-card__media">
            <img src="https://placehold.co/400x300" alt="Bowl of lemon garlic pasta with fresh basil">
            <button type="button" class="recipe-card__save" aria-label="Save recipe">&#9825;</button>
          </div>
          <div class="recipe-card__body">
            <h3 class="recipe-card__title"><a href="recipe-detail.html">Lemon Garlic Pasta</a></h3>
            <div class="recipe-card__meta">
              <span class="badge badge--time">25 min</span>
              <span class="badge badge--easy">Easy</span>
            </div>
          </div>
        </article>
      </li>
      <li>
        <article class="recipe-card">
          <div class="recipe-card__media">
            <img src="https://placehold.co/400x300" alt="Slow-braised lamb shank with saffron rice">
            <button type="button" class="recipe-card__save" aria-label="Save recipe">&#9825;</button>
          </div>
          <div class="recipe-card__body">
            <h3 class="recipe-card__title"><a href="recipe-detail.html">Clove-Smoked Lamb Shank</a></h3>
            <div class="recipe-card__meta">
              <span class="badge badge--time">2 hr</span>
              <span class="badge badge--hard">Hard</span>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</body>
</html>
```

**Key decisions explained:** The search bar's `:focus-within` width transition (requirement #10's novel decision) is deliberately applied to the `<form>` wrapper rather than the `<input>` directly — `:focus-within` reacts to focus landing anywhere inside the form, which is more robust than `:focus` alone if a future clear-button or icon were added inside the same wrapper. Filter chips use real `<button aria-pressed="true|false">` elements (a toggle-button pattern) rather than styled checkboxes or plain `<div>`s — `aria-pressed` is the correct ARIA state specifically for a toggle button, giving assistive technology a genuine "currently selected" signal that a purely visual background-color change never would on its own. The recipe grid, again, uses `<ul>`/`<li>` for the same list-semantics reasoning established in the Part 54 capstone.

**What a complete submission would also include** (left as your own exercise, applying patterns already fully solved elsewhere in this course): the `recipe-detail.html` page (combine Part 53 Project 2's recipe structure with this page's shared header/tokens, per Project 25's multi-page pattern), the serving-size stepper (a small flex row of two `aria-label`led icon-buttons flanking a number, per Project 6's icon-button pattern), and the dark-mode `data-theme` toggle control (structurally identical to Part 54 Stage 14's token-swap mechanism).

</details>

---

# Part 62 — Final Reference Section

This closing Part exists purely for lookup — the things you'll actually want at your fingertips months from now, without hunting back through 50+ Parts of teaching prose to find them.

## Quick Reference: HTML Element Decision Tree

```
Is it the page's primary, unique content region?        → <main>
Is it self-contained, independently distributable?      → <article>
Is it a thematic grouping with its own heading?          → <section>
Is it tangential/supplementary to nearby content?        → <aside>
Is it a block of primary navigational links?              → <nav>
Is it introductory content for a page/section?            → <header>
Is it closing content for a page/section?                  → <footer>
Is it tabular data with real row/column relationships?    → <table>
Is it a collection of items where order doesn't matter?    → <ul>
Is it a collection of items where order matters?           → <ol>
Is it a term-and-description pairing?                       → <dl>/<dt>/<dd>
Is it truly just a generic grouping with no other meaning?  → <div>
Is it a generic *inline* span with no other meaning?         → <span>
```

## Quick Reference: Which Layout Tool to Reach For

```
One-dimensional row/column of items, possibly wrapping?  → Flexbox
Two-dimensional grid with defined rows AND columns?        → Grid
A component that should adapt to ITS container's width?    → Container query
A page-wide change based on VIEWPORT width?                 → Media query
Centering ONE item in a container?                            → Flexbox
  (justify-content + align-items, or margin: auto in both axes)
A fixed sidebar beside a flexible main area?                  → Grid
An unknown number of same-sized cards that should reflow?     → Grid with
  repeat(auto-fit, minmax(min, 1fr))
```

## Quick Reference: Common `box-sizing` Gotchas

```
width: 100% + padding, under content-box  → overflows parent
Fix: box-sizing: border-box (ideally globally, in your reset)

height: 100% with no explicit-height ancestor chain → resolves to 0
Fix: give an ancestor explicit height, or use vh/dvh instead

Flex/grid item won't shrink below its content's size → min-width: auto trap
Fix: min-width: 0 on the item
```

## Quick Reference: Accessibility Non-Negotiables

```
[ ] Every <img> has alt (empty alt="" only if decorative)
[ ] Every input has an associated, programmatically-linked <label>
[ ] Every interactive element is keyboard-reachable and operable
[ ] Every interactive element has a visible focus state
[ ] Heading levels never skip
[ ] Color is never the ONLY carrier of meaning
[ ] Landmarks (header/nav/main/footer) are present and make sense
[ ] Live/dynamic updates use appropriate aria-live/role="status"/"alert"
```

## Quick Reference: The Cascade, One More Time

```
1. Origin & importance (user !important > author !important > author > user > browser default)
2. Specificity (inline > ID > class/attr/pseudo-class > element/pseudo-element)
3. Source order (later wins, all else equal)
```

---

## Common HTML/CSS Problems — Troubleshooting Guide

Use this as a first-pass triage the next time something looks broken and you're not sure why.

**"My CSS isn't applying at all."**
- Is the stylesheet actually linked correctly (`<link rel="stylesheet" href="...">`, correct relative path)?
- Is there a typo in the selector (check DevTools' Elements panel — does the rule even show up, struck through or not)?
- Is a more specific rule elsewhere overriding it (check the Computed panel for the property's actual winning value and source)?

**"My layout overflows its container."**
- Check `box-sizing` (Part 18/41) — is padding/border being added on top of a percentage width?
- Check for a flex/grid item's `min-width: auto` trap (Part 24).
- Check for an unbroken long word/URL with no `overflow-wrap: break-word`.

**"My element won't center."**
- Flex/Grid parent missing `display: flex`/`display: grid`?
- Confirm you're setting alignment on the *parent*, not the child (a common mix-up between `justify-content`/`align-items` versus `justify-self`/`align-self`).

**"My `z-index` isn't working."**
- Check for a stacking context boundary between the two elements (Part 27/47) — an ancestor with `transform`, `opacity < 1`, or similar may be trapping one element's stacking order below the other's entire context.

**"My margin isn't behaving as expected."**
- Check for margin collapsing between adjacent block siblings, or between a parent and its first/last child (Part 18).
- Consider whether `gap` on a flex/grid parent would be more predictable than margins here.

**"My image looks stretched/squished."**
- Missing `object-fit: cover` (or `contain`) on an image forced into a fixed-aspect-ratio container (Part 41).

**"My page looks broken only on mobile."**
- Missing `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Check whether a fixed-pixel-width element is wider than the actual mobile viewport.

**"My focus outline disappeared and I don't know why."**
- Search your CSS for `outline: none` or `outline: 0` — if present without a replacement `:focus-visible` style, this is very likely the cause, and is a genuine accessibility regression to fix immediately (Part 12/49).

**"My animation looks janky/stutters."**
- Check whether you're animating `width`/`height`/`top`/`left` instead of `transform`/`opacity` (Part 33/48) — layout-triggering animations are far more prone to visible stutter, especially on lower-powered devices.

**"My print output looks wrong."**
- Check for a missing `@media print` stylesheet entirely, or forgotten `break-inside: avoid` on cards/tables that shouldn't split across a page (Part 51).

---

## Final Learning Roadmap

This course covered HTML and CSS in genuine, working depth — enough to build real, accessible, responsive, production-quality interfaces without a framework. What comes next is up to what you're building toward.

**If you're heading toward general frontend development:**
1. JavaScript fundamentals (DOM manipulation, events, fetch/async) — this is the single most natural next step, since nearly every "structure only, no JS behavior" note throughout this course marks exactly where JavaScript picks up.
2. A component framework (React, Vue, or Svelte) — notice how directly the component thinking from Part 53's projects and the Part 54 capstone's staged, componentized build maps onto a framework's component model; you're not starting that mental model from zero.
3. Build tooling basics (a bundler, package management) — mostly plumbing knowledge, but necessary plumbing.
4. TypeScript, once comfortable with plain JavaScript — adds real safety net value once you're building anything nontrivial.

**If you're heading toward design systems / UI engineering specifically:**
1. Deepen the design-token and component-architecture work from Part 53 Project 24 and Part 55 Level 10/13 — this is genuinely most of the job.
2. Learn a design tool (Figma) well enough to read and critique specs precisely, since UI engineering constantly sits at the design/code boundary.
3. Study existing production design systems (many are open-sourced) specifically for how they structure tokens, document components, and handle theming — you'll recognize nearly every pattern from this course, at greater scale.

**If you're heading toward accessibility specialization:**
1. Go deeper into ARIA beyond this course's foundational coverage — the full ARIA Authoring Practices Guide patterns for complex widgets (comboboxes, complex menus, drag-and-drop) go well beyond what static HTML/CSS alone can achieve.
2. Learn to use a screen reader as a genuine daily tool, not just an occasional test — real fluency changes what you notice.
3. Study WCAG's actual success criteria in detail, beyond the practical patterns this course applied throughout.

**If you're heading toward performance engineering:**
1. Go deeper into the Critical Rendering Pipeline (Part 0/48 only introduced it) — study real performance profiling tools in depth.
2. Learn about resource hints (`preload`, `prefetch`, `preconnect`), HTTP caching, and CDN strategy — the network-and-loading half of performance that sits above pure CSS/rendering concerns.

**Regardless of direction, the single highest-leverage next action:** build something real, from scratch, without following a tutorial — pick a genuine idea, however small, and build its interface using nothing but what this course covered. The projects and capstone here were scaffolded, staged, and explained; a self-directed project with no scaffold at all is where the difference between "recognized the pattern when shown it" and "can produce the pattern from a blank file" gets tested for real. That's the actual finish line this entire course has been building toward.

---

**This concludes HTML & CSS: The Complete Course.**

You began at Part 0 with how a URL becomes a rendered page, and you've now worked through full HTML structure and semantics, the complete CSS cascade and box model, Flexbox and Grid in real depth, responsive and modern CSS, debugging and performance and accessibility and SEO and print, 28 fully-solved projects, a staged 15-step capstone, a 15-level mastery track, interview preparation, 17 cheat sheets, production practices, two full assessments, and a final open-ended challenge. That is a genuinely complete foundation — not a roadmap of things to eventually learn, but working, applicable knowledge you've now seen demonstrated, explained, and exercised at every level from a single selector to a full production interface.
