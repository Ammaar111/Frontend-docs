// HTML track. Concepts follow the HTML & CSS course:
// Part 1 (document structure), Part 3 (links), Part 4 (images), Part 7 (forms).
//
// Each check receives { doc }, a DOMParser document. That document is inert:
// scripts in it never run and images never load.

const text = (node) => (node?.textContent ?? '').trim();

export const htmlLessons = [
  {
    id: 'html-document',
    track: 'html',
    module: 'Document structure',
    title: 'A complete HTML document',
    source: 'HTML & CSS course, Part 1',
    runner: 'html',
    teach: [
      'Every page starts with `<!DOCTYPE html>`, which puts the browser into standards mode. Without it, browsers fall back to quirks mode and lay things out inconsistently.',
      'The `<html lang="en">` attribute declares the page language, which screen readers and translation tools rely on.',
      'The `<head>` holds information about the page that is not shown in the body: the charset, the viewport and the title. `<meta charset="UTF-8">` and the viewport meta tag are the two you need on every page.',
      'The `<body>` holds everything the user sees. Heading levels form an outline, so use exactly one `<h1>` per page, and do not skip levels.',
      { warn: 'Putting the title in the body. `<title>` belongs inside `<head>`, and it is what appears in the browser tab.' },
    ],
    example: {
      code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n    <p>Hello, world.</p>\n  </body>\n</html>',
    },
    task: [
      'Write a complete HTML document with:',
      {
        list: [
          'the doctype and `<html lang="en">`',
          'a UTF-8 charset meta tag and a viewport meta tag',
          'a title of: Ammaar\'s Portfolio',
          'one `<h1>` reading: Ammaar Khatri',
          'an `<h2>` reading: About, placed after the h1',
          'a `<p>` with any sentence about you, inside the body',
        ],
      },
    ],
    starter: '<!-- Write your HTML here -->\n',
    tests: [
      {
        label: 'starts with <!DOCTYPE html>',
        check: ({ doc }) => doc.doctype?.name === 'html',
        mistake: 'Start the file with <!DOCTYPE html> on the first line.',
      },
      {
        label: '<html lang="en">',
        check: ({ doc }) => doc.documentElement.getAttribute('lang') === 'en',
        mistake: 'Add lang="en" to the <html> tag.',
      },
      {
        label: 'UTF-8 charset meta tag',
        check: ({ doc }) => /^utf-8$/i.test(doc.querySelector('meta[charset]')?.getAttribute('charset') ?? ''),
        mistake: 'Add <meta charset="UTF-8"> inside <head>.',
      },
      {
        label: 'viewport meta tag',
        check: ({ doc }) => (doc.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? '').includes('width=device-width'),
        mistake: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head>.',
      },
      {
        label: 'title is "Ammaar\'s Portfolio"',
        check: ({ doc }) => doc.title === "Ammaar's Portfolio",
        mistake: 'The <title> must read exactly: Ammaar\'s Portfolio',
      },
      {
        label: 'exactly one h1 reading "Ammaar Khatri"',
        check: ({ doc }) => doc.querySelectorAll('h1').length === 1 && text(doc.querySelector('h1')) === 'Ammaar Khatri',
        mistake: 'Use exactly one <h1> with the text Ammaar Khatri.',
      },
      {
        label: 'h2 reading "About" comes after the h1',
        check: ({ doc }) => {
          const h1 = doc.querySelector('h1');
          const h2 = [...doc.querySelectorAll('h2')].find((node) => text(node) === 'About');
          return Boolean(h1 && h2) && Boolean(h1.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING);
        },
        mistake: 'Add an <h2> reading "About" after the <h1>.',
      },
      {
        label: 'body contains a paragraph with text',
        check: ({ doc }) => text(doc.body?.querySelector('p')).length > 0,
        mistake: 'Add a <p> with some text inside <body>.',
      },
    ],
  },

  {
    id: 'html-links-media',
    track: 'html',
    module: 'Links and images',
    title: 'Links and images',
    source: 'HTML & CSS course, Parts 3 and 4',
    runner: 'html',
    teach: [
      '`<a href="...">` creates a link. Use an absolute URL for another site, a relative path for a file on your own site, and `#id` to jump to an element on the same page.',
      '`target="_blank"` opens a link in a new tab. Always pair it with `rel="noopener noreferrer"`. Without it, the new page can reach back into your page through `window.opener`.',
      '`<img>` needs `src` and `alt`. `alt` describes the image for screen readers and for people on slow connections. If the image is purely decorative, use `alt=""`: the empty value tells assistive technology to skip it.',
      'Set `width` and `height` on images. The browser reserves the right amount of space before the image loads, which prevents layout shift.',
      { warn: 'Leaving out `alt` entirely. A missing alt attribute makes screen readers announce the file name. Empty alt is only correct for decorative images.' },
    ],
    example: {
      code: '<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs</a>\n<a href="#contact">Jump to contact</a>\n\n<img src="cat.jpg" alt="A ginger cat asleep on a sofa" width="300" height="200">\n<img src="divider.svg" alt="">',
    },
    task: [
      'Add a link with `href="https://github.com/ammaar111"`, `target="_blank"` and a `rel` that includes `noopener`.',
      'Add a link with `href="#contact"`, and a `<section id="contact">` with an h2 inside it.',
      'Add an image with `src="profile.jpg"`, meaningful alt text, and width and height attributes.',
      'Add a decorative image with `src="divider.svg"` and an empty alt attribute.',
    ],
    starter: '<!-- Write your HTML here -->\n',
    tests: [
      {
        label: 'GitHub link opens in a new tab',
        check: ({ doc }) => doc.querySelector('a[href="https://github.com/ammaar111"][target="_blank"]') !== null,
        mistake: 'The GitHub link needs href="https://github.com/ammaar111" and target="_blank".',
      },
      {
        label: 'new-tab link has rel noopener',
        check: ({ doc }) => (doc.querySelector('a[target="_blank"]')?.getAttribute('rel') ?? '').split(/\s+/).includes('noopener'),
        mistake: 'Add rel="noopener noreferrer" to any link with target="_blank".',
      },
      {
        label: 'jump link points to an element with id "contact"',
        check: ({ doc }) => doc.querySelector('a[href="#contact"]') !== null && doc.querySelector('#contact') !== null,
        mistake: 'You need both a link with href="#contact" and an element with id="contact".',
      },
      {
        label: 'profile image has alt text, width and height',
        check: ({ doc }) => {
          const img = doc.querySelector('img[src="profile.jpg"]');
          return Boolean(img) && (img.getAttribute('alt') ?? '').trim() !== '' && img.hasAttribute('width') && img.hasAttribute('height');
        },
        mistake: 'profile.jpg needs descriptive alt text plus width and height attributes.',
      },
      {
        label: 'decorative image has empty alt',
        check: ({ doc }) => doc.querySelector('img[src="divider.svg"]')?.getAttribute('alt') === '',
        mistake: 'divider.svg is decorative, so give it alt="" (present, but empty).',
      },
    ],
  },

  {
    id: 'html-forms',
    track: 'html',
    module: 'Forms',
    title: 'Forms and labels',
    source: 'HTML & CSS course, Part 7',
    runner: 'html',
    teach: [
      'A `<form>` groups inputs and sends them to a server. `action` is the URL that receives the data, and `method="post"` sends it in the request body.',
      '`<label for="x">` must match an input with `id="x"`. That link is what lets a screen reader announce the label when the input is focused, and it makes clicking the label focus the input.',
      '`type` changes the input: `text`, `email`, `number`, `date`, and so on. `email` gives mobile users the right keyboard and gives the browser something to validate.',
      '`required` stops the browser from submitting until the field is filled in.',
      { warn: 'Using `placeholder` as the only label. Placeholder text disappears as soon as the user types, so it is not a label.' },
    ],
    example: {
      code: '<form action="/subscribe" method="post">\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required>\n  <button type="submit">Subscribe</button>\n</form>',
    },
    task: [
      'Create a `<form action="/signup" method="post">`.',
      {
        list: [
          'A label "Full name" tied to a required text input with id and name "name".',
          'A label "Email" tied to a required email input with id and name "email".',
          'A label "Course" tied to a `<select>` with id and name "course" and three options with values "js", "css" and "html".',
          'A label "Message" tied to a `<textarea>` with name "message".',
          'A submit button with type="submit" reading: Sign up',
        ],
      },
    ],
    starter: '<!-- Write your form here -->\n',
    tests: [
      {
        label: 'form has action /signup and method post',
        check: ({ doc }) => {
          const form = doc.querySelector('form');
          return form?.getAttribute('action') === '/signup' && form.getAttribute('method')?.toLowerCase() === 'post';
        },
        mistake: 'The form needs action="/signup" and method="post".',
      },
      {
        label: '"Full name" label tied to input#name',
        check: ({ doc }) => text(doc.querySelector('label[for="name"]')) === 'Full name' && doc.querySelector('input#name') !== null,
        mistake: 'Use <label for="name">Full name</label> and an input with id="name". The for and id must match.',
      },
      {
        label: 'name input is type text and required',
        check: ({ doc }) => {
          const input = doc.querySelector('input#name');
          return input?.getAttribute('type') === 'text' && input.hasAttribute('required');
        },
        mistake: 'The name input needs type="text" and the required attribute.',
      },
      {
        label: '"Email" label tied to a required email input',
        check: ({ doc }) => {
          const input = doc.querySelector('input#email');
          return text(doc.querySelector('label[for="email"]')) === 'Email' && input?.getAttribute('type') === 'email' && input.hasAttribute('required');
        },
        mistake: 'The email field needs <label for="email">Email</label> and <input type="email" id="email" required>.',
      },
      {
        label: 'course select has options js, css, html',
        check: ({ doc }) => {
          const select = doc.querySelector('select#course');
          if (!select || select.getAttribute('name') !== 'course') return false;
          return [...select.options].map((option) => option.value).join(',') === 'js,css,html';
        },
        mistake: 'The select needs id and name "course", with three options whose values are js, css and html, in that order.',
      },
      {
        label: 'message textarea named "message"',
        check: ({ doc }) => doc.querySelector('textarea[name="message"]') !== null,
        mistake: 'Add a <textarea name="message"> and a label for it.',
      },
      {
        label: 'submit button reads "Sign up"',
        check: ({ doc }) => [...doc.querySelectorAll('button')].some((button) => text(button) === 'Sign up' && button.getAttribute('type') === 'submit'),
        mistake: 'Add <button type="submit">Sign up</button>. The type must be written out.',
      },
    ],
  },
];
