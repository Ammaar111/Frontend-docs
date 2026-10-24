// Parses learner code before it runs, so a syntax error is reported with a
// line and column instead of the engine's bare message.
import { parse } from 'acorn';

export function syntaxProblem(code) {
  try {
    parse(code, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
      allowHashBang: true,
    });
    return null;
  } catch (err) {
    if (!(err instanceof SyntaxError) || !err.loc) throw err;
    const message = err.message.replace(/\s*\(\d+:\d+\)$/, '');
    if (/'import' and 'export' may appear only/.test(message)) {
      return `SyntaxError: import and export are not available in this lesson. Write your code without them (line ${err.loc.line}).`;
    }
    return `SyntaxError: ${message} (line ${err.loc.line}, column ${err.loc.column + 1})`;
  }
}
