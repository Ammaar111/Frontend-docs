// JavaScript track. Concepts follow the JavaScript course:
// Part 1 (variables), Part 2 (control flow), Part 3 (functions),
// Part 4 (strings, arrays, objects), Part 5.1 (scope and closures),
// Part 9 (errors), Part 10 (asynchronous JavaScript).

export const javascriptLessons = [
  {
    id: 'js-variables',
    track: 'javascript',
    module: 'Foundations',
    title: 'Variables: let, const and types',
    source: 'JavaScript course, Part 1',
    runner: 'js',
    teach: [
      'A variable is a name bound to a value. Use `const` when the binding should never be reassigned, and `let` when it must change. Avoid `var`: it is function-scoped and hoisted, which causes bugs that are hard to trace.',
      '`const` locks the binding, not the contents. A `const` object or array can still change internally.',
      'The primitive types are string, number, boolean, undefined, null, bigint and symbol. `typeof` reports the type of a value.',
      { warn: '`typeof null` returns "object". That is a long-standing bug in the language, not evidence that null is an object.' },
    ],
    example: {
      code: 'const city = "Mumbai";\nlet temperature = 31;\ntemperature = 33;\nconsole.log(typeof city, typeof temperature); // "string" "number"',
    },
    task: [
      'Create a `const` called `productName` with the value "Desk Lamp".',
      'Create a `let` called `stock` with the value 12, then subtract 2 from it on the next line.',
    ],
    starter: '// Write your code here\n',
    tests: [
      {
        label: 'productName holds "Desk Lamp"',
        expr: 'productName',
        expect: 'Desk Lamp',
        mistake: 'productName must hold the string "Desk Lamp".',
      },
      {
        label: 'stock ends at 10',
        expr: 'stock',
        expect: 10,
        mistake: 'stock should end at 10: start it at 12, then subtract 2.',
      },
      {
        label: 'stock is a number',
        expr: "typeof stock",
        expect: 'number',
        mistake: 'stock must be a number. Remove the quotes around 12.',
      },
      {
        label: 'productName cannot be reassigned',
        expr: "(() => { try { productName = 'x'; return 'changed'; } catch (err) { return 'locked'; } })()",
        expect: 'locked',
        mistake: 'productName must be declared with const. A let or var binding can be reassigned.',
      },
    ],
  },

  {
    id: 'js-conditionals',
    track: 'javascript',
    module: 'Control flow',
    title: 'Conditionals: if, else if, else',
    source: 'JavaScript course, Part 2',
    runner: 'js',
    teach: [
      '`if` runs its block only when the condition is truthy. Chain alternatives with `else if`, and use `else` as the fallback.',
      'Use strict equality `===` and `!==`. Loose `==` converts types first, so `0 == ""` and `null == undefined` are both true, which surprises most beginners.',
      'The falsy values are `false`, `0`, `""`, `null`, `undefined` and `NaN`. Everything else is truthy, including the string "0" and the empty array `[]`.',
      { tip: 'Check boundaries deliberately. For "90 or above", write `score >= 90`, not `score > 90`.' },
    ],
    example: {
      code: 'function canVote(age) {\n  if (age >= 18) {\n    return "yes";\n  } else {\n    return "no";\n  }\n}',
    },
    task: [
      'Write `function grade(score)` that returns:',
      { list: ['"A" when score is 90 or above', '"B" when score is 75 or above', '"C" when score is 50 or above', '"F" otherwise'] },
      'Use `if` and `else if`.',
    ],
    starter: 'function grade(score) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'grade(95) is "A"', expr: 'grade(95)', expect: 'A', mistake: 'Scores of 90 or above should return "A".' },
      { label: 'grade(90) is "A" (boundary)', expr: 'grade(90)', expect: 'A', mistake: '90 is the lower boundary for "A". Use >= 90, not > 90.' },
      { label: 'grade(75) is "B" (boundary)', expr: 'grade(75)', expect: 'B', mistake: '75 is the lower boundary for "B". Use >= 75.' },
      { label: 'grade(50) is "C" (boundary)', expr: 'grade(50)', expect: 'C', mistake: '50 is the lower boundary for "C". Use >= 50.' },
      { label: 'grade(49) is "F"', expr: 'grade(49)', expect: 'F', mistake: 'Anything under 50 should return "F".' },
    ],
  },

  {
    id: 'js-loops',
    track: 'javascript',
    module: 'Control flow',
    title: 'Loops: for and while',
    source: 'JavaScript course, Part 2',
    runner: 'js',
    teach: [
      '`for` suits a known number of repetitions: `for (let i = 1; i <= 3; i++)` runs with i equal to 1, 2 and 3.',
      '`while` repeats as long as its condition stays true. Something inside the loop must eventually make the condition false, or the loop never ends.',
      '`for...of` walks the values of an array without managing an index.',
      { warn: 'Off-by-one errors. Whether the last value is included depends on `<` versus `<=`.' },
    ],
    example: {
      code: 'let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i; // 1 + 2 + 3\n}\n// total is 6',
    },
    task: [
      'Write `function sumTo(n)` that returns the sum of every integer from 1 to n, inclusive. Use a loop.',
      'If n is less than 1, return 0.',
    ],
    starter: 'function sumTo(n) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'sumTo(5) is 15', expr: 'sumTo(5)', expect: 15, mistake: 'sumTo(5) should be 1 + 2 + 3 + 4 + 5 = 15. Include n itself: the condition should be i <= n.' },
      { label: 'sumTo(1) is 1', expr: 'sumTo(1)', expect: 1, mistake: 'sumTo(1) should be 1.' },
      { label: 'sumTo(0) is 0', expr: 'sumTo(0)', expect: 0, mistake: 'sumTo(0) should be 0.' },
      { label: 'sumTo(-3) is 0', expr: 'sumTo(-3)', expect: 0, mistake: 'For n below 1 the result must be 0.' },
      { label: 'sumTo(100) is 5050', expr: 'sumTo(100)', expect: 5050, mistake: 'sumTo(100) should be 5050. Check that the accumulator starts at 0 and gets every i added.' },
    ],
  },

  {
    id: 'js-functions',
    track: 'javascript',
    module: 'Functions',
    title: 'Functions, arrows and default parameters',
    source: 'JavaScript course, Part 3',
    runner: 'js',
    teach: [
      'A function bundles logic you can reuse. Parameters are the placeholder names in the definition; arguments are the values passed in at the call.',
      'There are three common forms: a declaration `function f() {}`, an expression `const f = function () {}`, and an arrow `const f = () => {}`. Declarations are hoisted, so they can be called above the line where they are written.',
      'A default parameter applies when the argument is `undefined`: `function greet(name = "friend")`.',
      'A function with no `return` gives back `undefined`.',
      { warn: 'Forgetting `return`. The arithmetic runs, the result is discarded, and the caller receives undefined.' },
    ],
    example: {
      code: 'function add(a, b) { return a + b; }\nconst multiply = (a, b) => a * b;\nfunction greet(name = "friend") {\n  return "Hello, " + name;\n}',
    },
    task: [
      'Write `function area(width, height = width)` that returns width multiplied by height. With one argument, the height defaults to the width, so area(5) is 25.',
      'Write an arrow function `const toCelsius = (f) => ...` that converts Fahrenheit to Celsius with the formula (f - 32) x 5 / 9.',
    ],
    starter: 'function area(width, height) {\n  // Write your code here\n}\n\nconst toCelsius = null;\n',
    tests: [
      { label: 'area(3, 4) is 12', expr: 'area(3, 4)', expect: 12, mistake: 'area should return width * height.' },
      { label: 'area(5) is 25 (default height)', expr: 'area(5)', expect: 25, mistake: 'Give height a default of width: function area(width, height = width).' },
      { label: 'toCelsius(212) is 100', expr: 'toCelsius(212)', expect: 100, mistake: 'toCelsius must use (f - 32) * 5 / 9.' },
      { label: 'toCelsius(32) is 0', expr: 'toCelsius(32)', expect: 0, mistake: 'toCelsius(32) should be 0.' },
      { label: 'toCelsius(50) is 10', expr: 'toCelsius(50)', expect: 10, mistake: 'toCelsius(50) should be 10. Check the operator order in your formula.' },
    ],
  },

  {
    id: 'js-strings',
    track: 'javascript',
    module: 'Data types',
    title: 'Strings and template literals',
    source: 'JavaScript course, Part 4.1',
    runner: 'js',
    teach: [
      'Strings are immutable. Methods like `toUpperCase()` and `trim()` return a new string and leave the original untouched.',
      'Template literals use backticks and `${}` for interpolation: `Hi ${name}` builds a string with the value of name inside it.',
      'Methods you will use constantly: `length`, `includes()`, `slice()`, `trim()`, `split()` and `join()`.',
      { warn: '`split(" ")` on text with double spaces produces empty strings. Trim first, then split on the pattern /\\s+/, which matches any run of whitespace.' },
    ],
    example: {
      code: 'const name = "ada lovelace";\nname.toUpperCase();   // "ADA LOVELACE"\nname.split(" ");      // ["ada", "lovelace"]\nname.includes("love"); // true',
    },
    task: [
      'Write `function initials(fullName)` that returns the uppercase first letter of each word, joined together with no spaces. "ammaar rafiq khatri" becomes "ARK". Extra spaces must not break it: "  ada   lovelace " becomes "AL".',
      'Write `function banner(text)` that returns the text uppercased and wrapped in stars: banner("sale") returns "*** SALE ***".',
    ],
    starter: 'function initials(fullName) {\n  // Write your code here\n}\n\nfunction banner(text) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'initials("ammaar rafiq khatri") is "ARK"', expr: 'initials("ammaar rafiq khatri")', expect: 'ARK', mistake: 'initials should return the first letter of each word, uppercased.' },
      { label: 'initials ignores extra spaces', expr: 'initials("  ada   lovelace ")', expect: 'AL', mistake: 'Extra spaces created empty words. Call trim() first, then split(/\\s+/).' },
      { label: 'initials("grace") is "G"', expr: 'initials("grace")', expect: 'G', mistake: 'A single word should still give one initial.' },
      { label: 'banner("sale") is "*** SALE ***"', expr: 'banner("sale")', expect: '*** SALE ***', mistake: 'banner should uppercase the text and wrap it in "*** " and " ***".' },
    ],
  },

  {
    id: 'js-arrays',
    track: 'javascript',
    module: 'Data types',
    title: 'Arrays',
    source: 'JavaScript course, Part 4.3',
    runner: 'js',
    teach: [
      'An array is an ordered list of values, indexed from 0. It can mix types: `const arr = ["amma", 2, 5, "a"];` holds a string, two numbers and another string.',
      'Read an item by index: `arr[0]` is "amma". `arr.length` is 4. The last item is `arr[arr.length - 1]`.',
      'Change an array in place with `push` (add to the end), `pop` (remove from the end), `unshift` and `shift` (the start). `includes(x)` and `indexOf(x)` search it.',
      '`typeof []` is "object", so check for arrays with `Array.isArray(value)`.',
      { warn: '`arr[arr.length]` is always undefined. The last valid index is `arr.length - 1`.' },
    ],
    example: {
      code: 'const arr = ["amma", 2, 5, "a"];\narr[0];             // "amma"\narr.length;        // 4\narr.push("new");    // arr now has 5 items\nArray.isArray(arr); // true',
    },
    task: [
      'Create `const fruits` containing "mango", "banana" and "apple", in that order.',
      'Add "kiwi" to the end of fruits with `push`.',
      'Write `function lastItem(list)` that returns the last element of any array, or undefined for an empty array.',
    ],
    starter: '// Create fruits here\n\nfunction lastItem(list) {\n  // Write your code here\n}\n',
    tests: [
      {
        label: 'fruits is ["mango", "banana", "apple", "kiwi"]',
        expr: 'fruits',
        expect: ['mango', 'banana', 'apple', 'kiwi'],
        mistake: 'fruits must hold mango, banana and apple in that order, with kiwi pushed onto the end.',
      },
      { label: 'fruits is an array', expr: 'Array.isArray(fruits)', expect: true, mistake: 'fruits must be declared with array brackets [ ].' },
      { label: 'lastItem([1, 2, 3]) is 3', expr: 'lastItem([1, 2, 3])', expect: 3, mistake: 'lastItem should return the item at index length - 1.' },
      { label: 'lastItem(["x"]) is "x"', expr: 'lastItem(["x"])', expect: 'x', mistake: 'A one-item array has its only item as the last item.' },
      { label: 'lastItem([]) is undefined', expr: 'lastItem([])', expect: undefined, mistake: 'An empty array has no last item, so return undefined.' },
    ],
  },

  {
    id: 'js-array-methods',
    track: 'javascript',
    module: 'Data types',
    title: 'map, filter and reduce',
    source: 'JavaScript course, Part 4.4',
    runner: 'js',
    teach: [
      '`map` transforms every item and returns a new array of the same length.',
      '`filter` keeps the items for which the callback returns true.',
      '`reduce` folds an array into one value. Its second argument is the starting value.',
      'None of these modify the original array, so you can chain them: `nums.filter(...).map(...)`.',
      '`forEach` returns undefined. Use it for side effects; use `map` when you need the results.',
      { warn: 'Calling `map` only to loop, then throwing the result away. Use `forEach` or `for...of` for that.' },
    ],
    example: {
      code: 'const nums = [1, 2, 3, 4];\nnums.map((n) => n * 2);               // [2, 4, 6, 8]\nnums.filter((n) => n % 2 === 0);      // [2, 4]\nnums.reduce((acc, n) => acc + n, 0); // 10',
    },
    task: [
      'Write `function doubleEvens(nums)` that keeps only the even numbers, then doubles each one. Return a new array and do not change the input. Use `filter` and `map`.',
      'Write `function total(nums)` that returns the sum of the numbers. Use `reduce`.',
      'Write `function names(people)`. Each person is an object with a `name` property. Return the array of names.',
    ],
    starter: 'function doubleEvens(nums) {\n  // Write your code here\n}\n\nfunction total(nums) {\n  // Write your code here\n}\n\nfunction names(people) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'doubleEvens([1, 2, 3, 4]) is [4, 8]', expr: 'doubleEvens([1, 2, 3, 4])', expect: [4, 8], mistake: 'doubleEvens keeps the evens (2 and 4), then doubles them to [4, 8].' },
      { label: 'doubleEvens([]) is []', expr: 'doubleEvens([])', expect: [], mistake: 'An empty input should return an empty array.' },
      {
        label: 'doubleEvens does not modify its input',
        expr: '(() => { const input = [1, 2]; doubleEvens(input); return input; })()',
        expect: [1, 2],
        mistake: 'doubleEvens must not change the array it receives. filter and map return new arrays.',
      },
      { label: 'total([1, 2, 3]) is 6', expr: 'total([1, 2, 3])', expect: 6, mistake: 'total should add all the numbers together.' },
      { label: 'total([]) is 0', expr: 'total([])', expect: 0, mistake: 'The sum of nothing is 0. Pass 0 as the starting value to reduce.' },
      { label: 'total uses reduce', expr: 'total.toString().includes("reduce")', expect: true, mistake: 'Build total with reduce, as the task asks.' },
      { label: 'names returns the name properties', expr: 'names([{ name: "A" }, { name: "B" }])', expect: ['A', 'B'], mistake: 'names should return person.name for each person, in order.' },
    ],
  },

  {
    id: 'js-objects',
    track: 'javascript',
    module: 'Data types',
    title: 'Objects',
    source: 'JavaScript course, Part 4.6',
    runner: 'js',
    teach: [
      'An object groups related values as key-value pairs: `{ title: "Dune", year: 1965 }`.',
      'Read a property with dot notation (`book.title`) or bracket notation (`book["title"]`). Bracket notation accepts a variable key, as in `book[field]`.',
      'A method is a function stored as a property. Inside a method, `this` refers to the object it was called on.',
      '`Object.keys(obj)` returns the key names as an array.',
      { tip: 'Shorthand: `{ name, age }` means `{ name: name, age: age }`.' },
      { warn: 'Two objects with identical contents are still not equal. `{ a: 1 } === { a: 1 }` is false, because equality compares references.' },
    ],
    example: {
      code: 'const student = { name: "Ammaar", marks: 94 };\nstudent.name;        // "Ammaar"\nstudent["marks"];    // 94\nObject.keys(student); // ["name", "marks"]',
    },
    task: [
      'Create `const book` with these properties: title "Dune", author "Frank Herbert", year 1965, pages 412.',
      'Write `function summary(b)` that returns the book as "Dune (1965) by Frank Herbert", built from its title, year and author.',
    ],
    starter: 'const book = {};\n\nfunction summary(b) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'book.title is "Dune"', expr: 'book.title', expect: 'Dune', mistake: 'book needs a title property set to "Dune".' },
      { label: 'book.pages is 412', expr: 'book.pages', expect: 412, mistake: 'book needs a pages property set to 412.' },
      { label: 'book has exactly four keys', expr: 'Object.keys(book).length', expect: 4, mistake: 'book should have exactly four properties: title, author, year and pages.' },
      { label: 'summary(book)', expr: 'summary(book)', expect: 'Dune (1965) by Frank Herbert', mistake: 'summary must return "<title> (<year>) by <author>".' },
      { label: 'summary uses any book passed in', expr: 'summary({ title: "X", author: "Y", year: 2000 })', expect: 'X (2000) by Y', mistake: 'summary should read the properties of the object it receives, not hard-code Dune.' },
    ],
  },

  {
    id: 'js-closures',
    track: 'javascript',
    module: 'Scope and closures',
    title: 'Scope and closures',
    source: 'JavaScript course, Part 5.1',
    runner: 'js',
    teach: [
      'Scope decides where a name is visible. `let` and `const` are block-scoped. A function creates its own scope. Inner code can read outer variables, but outer code cannot read inner ones.',
      'A closure is a function that keeps access to the variables of the scope where it was created, even after that outer function has returned.',
      'Each call to an outer function creates fresh variables, so each returned closure has its own private state.',
      { tip: 'Closures are how JavaScript gives you private state without classes.' },
    ],
    example: {
      code: 'function makeCounter() {\n  let count = 0;\n  return () => {\n    count += 1;\n    return count;\n  };\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2',
    },
    task: [
      'Write `function makeCounter(start = 0)` that returns a function. Each call to that function adds 1 and returns the new count. The first call returns start + 1.',
      'Keep `count` inside makeCounter. It must not be a top-level variable.',
      'Two counters must not share state.',
    ],
    starter: 'function makeCounter(start = 0) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'first call returns 1', expr: 'makeCounter()()', expect: 1, mistake: 'The first call should return 0 + 1 = 1.' },
      {
        label: 'third call returns 3',
        expr: '(() => { const c = makeCounter(); c(); c(); return c(); })()',
        expect: 3,
        mistake: 'The counter must keep its count between calls. Store it in a variable that the returned function closes over.',
      },
      { label: 'makeCounter(10) starts at 10', expr: 'makeCounter(10)()', expect: 11, mistake: 'The start argument should be the starting count, so the first call returns start + 1.' },
      {
        label: 'two counters are independent',
        expr: '(() => { const a = makeCounter(); const b = makeCounter(); a(); a(); return b(); })()',
        expect: 1,
        mistake: 'Each call to makeCounter must create its own count. Two counters must not share one variable.',
      },
      { label: 'count is private', expr: 'typeof count', expect: 'undefined', mistake: 'count should live inside makeCounter, not at the top level.' },
    ],
  },

  {
    id: 'js-errors',
    track: 'javascript',
    module: 'Errors',
    title: 'Throwing and catching errors',
    source: 'JavaScript course, Part 9.4 to 9.6',
    runner: 'js',
    teach: [
      '`throw new Error("message")` stops the current function and hands control to the nearest `catch` block.',
      '`try { ... } catch (err) { ... } finally { ... }`. The finally block runs whether or not an error happened. Read the message from `err.message`.',
      'Throw Error objects, not plain strings. An Error carries a name, a message and a stack trace.',
      { warn: 'Empty catch blocks. Swallowing an error hides the bug. At least return a meaningful value or log it.' },
    ],
    example: {
      code: 'function parseAge(input) {\n  const n = Number(input);\n  if (Number.isNaN(n)) {\n    throw new Error("Not a number: " + input);\n  }\n  return n;\n}\n\ntry {\n  parseAge("abc");\n} catch (err) {\n  console.log(err.message); // "Not a number: abc"\n}',
    },
    task: [
      'Write `function safeDivide(a, b)`. If b is 0, throw `new Error("Cannot divide by zero")`. Otherwise return a / b.',
      'Write `function divideOrMessage(a, b)`. Call safeDivide inside a try block. Return its result, or return the error message if it threw.',
    ],
    starter: 'function safeDivide(a, b) {\n  // Write your code here\n}\n\nfunction divideOrMessage(a, b) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'safeDivide(10, 2) is 5', expr: 'safeDivide(10, 2)', expect: 5, mistake: 'safeDivide should return a / b when b is not 0.' },
      { label: 'safeDivide(1, 0) throws', expr: 'safeDivide(1, 0)', throws: true, mistake: 'safeDivide must throw when b is 0.' },
      { label: 'divideOrMessage(9, 3) is 3', expr: 'divideOrMessage(9, 3)', expect: 3, mistake: 'divideOrMessage should return the division result when no error happens.' },
      {
        label: 'divideOrMessage(9, 0) returns the message',
        expr: 'divideOrMessage(9, 0)',
        expect: 'Cannot divide by zero',
        mistake: 'In the catch block, return err.message. The text must match exactly: "Cannot divide by zero".',
      },
    ],
  },

  {
    id: 'js-async-await',
    track: 'javascript',
    module: 'Async',
    title: 'Promises, async and await',
    source: 'JavaScript course, Part 10 (Async Levels 5 to 10)',
    runner: 'js',
    teach: [
      'Some work finishes later: timers, network requests, file reads. A Promise represents a value that will exist later. It starts pending, then becomes fulfilled with a value or rejected with an error.',
      '`await` pauses an async function until a promise settles, then gives you its value. It works only inside an `async` function, and an async function always returns a Promise.',
      'When an awaited promise rejects, the error is thrown at the `await` line, so `try` and `catch` work the same way as for synchronous code.',
      { warn: 'Forgetting `await`. `const data = fetchThing();` gives you a pending Promise, not the data.' },
    ],
    example: {
      code: 'function fakeFetch(value) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve(value), 100);\n  });\n}\n\nasync function load() {\n  const v = await fakeFetch("data");\n  return v.toUpperCase();\n}',
    },
    task: [
      'Write `async function wordCount(textPromise)`. Await the promise to get the text, then return how many words it contains. Empty or whitespace-only text returns 0.',
    ],
    starter: 'async function wordCount(textPromise) {\n  // Write your code here\n}\n',
    tests: [
      { label: 'wordCount of "hello big world" is 3', expr: 'wordCount(Promise.resolve("hello big world"))', expect: 3, mistake: 'Await textPromise first, then count the words.' },
      { label: 'whitespace-only text is 0', expr: 'wordCount(Promise.resolve("   "))', expect: 0, mistake: 'Whitespace-only text has no words, so return 0.' },
      { label: 'single word is 1', expr: 'wordCount(Promise.resolve("one"))', expect: 1, mistake: 'A single word counts as one word.' },
      {
        label: 'wordCount returns a Promise',
        expr: 'wordCount(Promise.resolve("a")) instanceof Promise',
        expect: true,
        mistake: 'Declare the function with the async keyword so that it returns a Promise.',
      },
    ],
  },
];
