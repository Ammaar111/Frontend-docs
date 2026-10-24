// HTML and CSS lessons are parsed, never executed. A DOMParser document is
// inert (its scripts never run), and a CSSStyleSheet that is never attached
// to the page styles nothing.
import { compileCheck } from './compile.js';
import { helpers } from './helpers.js';
import { describeError } from './values.js';

export function checkMarkup(lesson, code) {
  let ctx;
  try {
    ctx =
      lesson.runner === 'css'
        ? { sheet: parseCss(code), h: helpers, source: code }
        : { doc: new DOMParser().parseFromString(code, 'text/html'), h: helpers, source: code };
  } catch (err) {
    return { fatal: `your ${lesson.runner.toUpperCase()} could not be read (${describeError(err)})` };
  }
  return { results: lesson.checks.map((check) => runCheck(check, ctx)) };
}

function parseCss(code) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(code);
  return sheet;
}

function runCheck(check, ctx) {
  try {
    const value = compileCheck(check.check)(ctx);
    if (value === true) return { pass: true, detail: '' };
    return { pass: false, detail: typeof value === 'string' ? value : '' };
  } catch (err) {
    return { pass: false, detail: describeError(err) };
  }
}
