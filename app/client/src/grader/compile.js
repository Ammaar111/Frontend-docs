// Check functions arrive from the API as source text. They are written by
// the course author, not the learner, so compiling them is safe.
const cache = new Map();

export function compileCheck(source) {
  let fn = cache.get(source);
  if (!fn) {
    fn = new Function(`"use strict"; return (${source});`)();
    cache.set(source, fn);
  }
  return fn;
}
