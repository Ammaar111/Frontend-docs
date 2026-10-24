// Turns raw check outcomes into a score out of 10 and a list of mistakes.
// Pure, so the Node tests can use it directly.

export const PASS_MARK = 7;

// `outcome` is { fatal } (the code could not run at all) or { results },
// where results[i] is { pass, detail } for checks[i].
export function summarize(checks, outcome) {
  const total = checks.reduce((sum, check) => sum + (check.weight ?? 1), 0);

  if (outcome.fatal) {
    return {
      score: 0,
      passed: 0,
      count: checks.length,
      fatal: outcome.fatal,
      mistakes: [`Your code could not run: ${outcome.fatal}`],
      checks: checks.map((check) => ({ label: check.label, pass: false })),
      logs: outcome.logs ?? [],
    };
  }

  let earned = 0;
  let passed = 0;
  const mistakes = [];
  const results = checks.map((check, index) => {
    const result = outcome.results[index] ?? { pass: false, detail: 'no result' };
    if (result.pass) {
      earned += check.weight ?? 1;
      passed += 1;
    } else {
      const why = result.detail ? ` (${result.detail})` : '';
      mistakes.push(`${check.mistake ?? `${check.label} failed`}${why}`);
    }
    return { label: check.label, pass: result.pass };
  });

  const score = total === 0 ? 0 : Math.round((earned / total) * 100) / 10;
  return { score, passed, count: checks.length, mistakes, checks: results, logs: outcome.logs ?? [] };
}

export function formatScore(score) {
  return `${Number.isInteger(score) ? score : score.toFixed(1)}/10`;
}
