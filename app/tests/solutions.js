// Reference solutions, one per lesson. The test suite checks that each one
// scores 10/10, which proves every lesson is solvable and its tests are correct.
// These are never shown in the app.

export const solutions = {
  'js-variables': `
const productName = "Desk Lamp";
let stock = 12;
stock = stock - 2;
`,

  'js-conditionals': `
function grade(score) {
  if (score >= 90) return "A";
  else if (score >= 75) return "B";
  else if (score >= 50) return "C";
  return "F";
}
`,

  'js-loops': `
function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
`,

  'js-functions': `
function area(width, height = width) {
  return width * height;
}

const toCelsius = (f) => (f - 32) * 5 / 9;
`,

  'js-strings': `
function initials(fullName) {
  return fullName.trim().split(/\\s+/).map((word) => word[0].toUpperCase()).join("");
}

function banner(text) {
  return "*** " + text.toUpperCase() + " ***";
}
`,

  'js-arrays': `
const fruits = ["mango", "banana", "apple"];
fruits.push("kiwi");

function lastItem(list) {
  return list[list.length - 1];
}
`,

  'js-array-methods': `
function doubleEvens(nums) {
  return nums.filter((n) => n % 2 === 0).map((n) => n * 2);
}

function total(nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

function names(people) {
  return people.map((person) => person.name);
}
`,

  'js-objects': `
const book = { title: "Dune", author: "Frank Herbert", year: 1965, pages: 412 };

function summary(b) {
  return b.title + " (" + b.year + ") by " + b.author;
}
`,

  'js-closures': `
function makeCounter(start = 0) {
  let count = start;
  return () => {
    count += 1;
    return count;
  };
}
`,

  'js-errors': `
function safeDivide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

function divideOrMessage(a, b) {
  try {
    return safeDivide(a, b);
  } catch (err) {
    return err.message;
  }
}
`,

  'js-async-await': `
async function wordCount(textPromise) {
  const text = await textPromise;
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\\s+/).length;
}
`,

  'html-document': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ammaar's Portfolio</title>
  </head>
  <body>
    <h1>Ammaar Khatri</h1>
    <h2>About</h2>
    <p>I am learning front-end development.</p>
  </body>
</html>`,

  'html-links-media': `<nav>
  <a href="https://github.com/ammaar111" target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href="#contact">Contact</a>
</nav>
<img src="profile.jpg" alt="Profile photo of Ammaar Khatri" width="200" height="200">
<img src="divider.svg" alt="">
<section id="contact">
  <h2>Contact</h2>
</section>`,

  'html-forms': `<form action="/signup" method="post">
  <label for="name">Full name</label>
  <input type="text" id="name" name="name" required>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <label for="course">Course</label>
  <select id="course" name="course">
    <option value="js">JavaScript</option>
    <option value="css">CSS</option>
    <option value="html">HTML</option>
  </select>
  <label for="message">Message</label>
  <textarea id="message" name="message"></textarea>
  <button type="submit">Sign up</button>
</form>`,

  'css-selectors': `.card { background-color: white; border-radius: 8px; }
.card h2 { font-size: 1.25rem; }
#main-nav a { color: #4f46e5; }
button:focus-visible { outline: 2px solid #4f46e5; }
ul > li { list-style: none; }`,

  'css-box-model': `* { box-sizing: border-box; }
.container { max-width: 720px; margin: 0 auto; padding: 1.5rem; }
.box { width: 50%; padding: 20px; border: 2px solid #ccc; }`,

  'css-flexbox': `.toolbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.toolbar .search { flex: 1; }
.cards { display: flex; flex-direction: column; }
@media (min-width: 768px) { .cards { flex-direction: row; } }`,
};
