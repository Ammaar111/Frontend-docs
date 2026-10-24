import { formatScore, PASS_MARK } from '../grader/grading.js';

// Sections 5 and 6 of every lesson: the score out of 10 and the mistakes made.
export default function Evaluation({ result, running, stale }) {
  if (running) {
    return (
      <>
        <section className="panel" aria-labelledby="evaluation-heading">
          <h2 id="evaluation-heading">5. Evaluation</h2>
          <p role="status">Running your code against the checks…</p>
        </section>
        <section className="panel" aria-labelledby="mistakes-heading">
          <h2 id="mistakes-heading">6. Mistakes made</h2>
          <p className="muted">Waiting for the result.</p>
        </section>
      </>
    );
  }

  if (!result) {
    return (
      <>
        <section className="panel" aria-labelledby="evaluation-heading">
          <h2 id="evaluation-heading">5. Evaluation</h2>
          <p className="muted">
            Not graded yet. Press <kbd>Run and grade</kbd> or <kbd>Ctrl</kbd> + <kbd>Enter</kbd>. You need {PASS_MARK}/10 to pass.
          </p>
        </section>
        <section className="panel" aria-labelledby="mistakes-heading">
          <h2 id="mistakes-heading">6. Mistakes made</h2>
          <p className="muted">Your mistakes will be listed here, one line each, saying what to fix.</p>
        </section>
      </>
    );
  }

  const passed = result.score >= PASS_MARK;
  return (
    <>
      <section className="panel" aria-labelledby="evaluation-heading">
        <h2 id="evaluation-heading">5. Evaluation</h2>
        {stale && <p className="muted">From your last attempt. Run again to grade the code in the editor.</p>}
        <div className="score-line" role="status">
          <span className="score" data-score={result.score}>
            Evaluation: {formatScore(result.score)}
          </span>
          <span className={`verdict ${passed ? 'verdict--pass' : 'verdict--fail'}`}>
            {passed ? 'Passed' : `Not passed yet (${PASS_MARK}/10 needed)`}
          </span>
        </div>
        <p className="muted">
          {result.passed} of {result.count} checks passed.
        </p>
        <ul className="checks">
          {result.checks.map((check, index) => (
            <li key={index} className={check.pass ? 'check--ok' : 'check--miss'}>
              <span aria-hidden="true">{check.pass ? '✓' : '✗'}</span> {check.label}
              <span className="sr-only">{check.pass ? ' (passed)' : ' (failed)'}</span>
            </li>
          ))}
        </ul>
        {result.logs?.length > 0 && (
          <details>
            <summary>Console output ({result.logs.length})</summary>
            <pre className="console-output">
              <code>{result.logs.slice(0, 200).join('\n')}</code>
            </pre>
          </details>
        )}
      </section>
      <section className="panel" aria-labelledby="mistakes-heading">
        <h2 id="mistakes-heading">6. Mistakes made</h2>
        {result.mistakes.length === 0 ? (
          <p className="all-clear">No mistakes. Every check passed.</p>
        ) : (
          <ol className="mistakes">
            {result.mistakes.map((mistake, index) => (
              <li key={index}>{mistake}</li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
