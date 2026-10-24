import { formatScore, PASS_MARK } from '../grader/grading.js';

const time = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function History({ attempts, onLoad }) {
  return (
    <section className="panel" aria-labelledby="history-heading">
      <h2 id="history-heading">History</h2>
      {attempts.length === 0 ? (
        <p className="muted">No attempts yet.</p>
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-labelledby="history-heading">
          <table className="data-table history">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Score</th>
                <th scope="col">Checks</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{time.format(new Date(attempt.createdAt))}</td>
                  <td className={attempt.score >= PASS_MARK ? 'text-pass' : 'text-fail'}>{formatScore(attempt.score)}</td>
                  <td>
                    {attempt.passed}/{attempt.total}
                  </td>
                  <td>
                    {onLoad && (
                      <button type="button" className="button--small" onClick={() => onLoad(attempt)}>
                        Load this code
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
