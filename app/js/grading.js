// Turns raw test outcomes into a score out of 10 and a list of mistakes.
// Pure: no DOM access, so the Node test suite can exercise it directly.

export const PASS_MARK = 7;

// `outcome` is either { fatal } (the code could not run at all) or
// { results } where results[i] is { pass, detail } for tests[i].
export function summarize(tests, outcome) {
  const total = tests.reduce((sum, test) => sum + (test.weight ?? 1), 0);

  if (outcome.fatal) {
    return {
      score: 0,
      passed: 0,
      count: tests.length,
      mistakes: [`Your code could not run: ${outcome.fatal}`],
      checks: tests.map((test) => ({ label: test.label, pass: false })),
    };
  }

  let earned = 0;
  let passed = 0;
  const mistakes = [];
  const checks = [];

  tests.forEach((test, index) => {
    const result = outcome.results[index] ?? { pass: false, detail: 'no result' };
    checks.push({ label: test.label, pass: result.pass });

    if (result.pass) {
      earned += test.weight ?? 1;
      passed += 1;
      return;
    }

    const why = result.detail ? ` (${result.detail})` : '';
    mistakes.push(`${test.mistake ?? `${test.label} failed`}${why}`);
  });

  const score = total === 0 ? 0 : Math.round((earned / total) * 100) / 10;
  return { score, passed, count: tests.length, mistakes, checks };
}

export function formatScore(score) {
  return `${Number.isInteger(score) ? score : score.toFixed(1)}/10`;
}
