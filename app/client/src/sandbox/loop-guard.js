// Inserts a call to __guard() at the top of every loop body, so a loop that
// never ends throws instead of freezing the tab. The iframe may share the
// page's thread, so this is what keeps the app responsive.
import { parse } from 'acorn';
import { simple } from 'acorn-walk';

export function addLoopGuard(code) {
  const ast = parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'script',
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowHashBang: true,
  });

  const inserts = [];
  const visit = (node) => {
    const body = node.body;
    if (body.type === 'BlockStatement') {
      inserts.push({ at: body.start + 1, text: '__guard();' });
    } else {
      inserts.push({ at: body.start, text: '{__guard();' }, { at: body.end, text: '}' });
    }
  };
  simple(ast, {
    ForStatement: visit,
    ForInStatement: visit,
    ForOfStatement: visit,
    WhileStatement: visit,
    DoWhileStatement: visit,
  });

  // Apply from the end so earlier positions stay valid.
  inserts.sort((a, b) => b.at - a.at);
  let out = code;
  for (const { at, text } of inserts) out = out.slice(0, at) + text + out.slice(at);
  return out;
}

export class LoopTimeout extends Error {
  constructor(limitMs) {
    super(`a loop ran for more than ${limitMs / 1000} seconds. Look for a loop whose condition never becomes false.`);
    this.name = 'LoopTimeout';
  }
}

// One guard per run. `arm()` starts a time window; once tripped, it stays
// tripped, so catching the error inside the loop does not keep it going.
export function createGuard(limitMs = 2000) {
  let deadline = Infinity;
  let tripped = null;
  let count = 0;
  const guard = () => {
    if (tripped) throw tripped;
    count += 1;
    if ((count & 1023) === 0 && performance.now() > deadline) {
      tripped = new LoopTimeout(limitMs);
      throw tripped;
    }
  };
  guard.arm = () => {
    deadline = performance.now() + limitMs;
  };
  guard.tripped = () => tripped;
  return guard;
}
