import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { formatScore, PASS_MARK } from '../grader/grading.js';
import { ErrorMessage, Loading, ProgressBar } from '../components/Status.jsx';

const time = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const day = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export default function ProgressPage() {
  const { data, error, loading, reload } = useApi('/progress');

  useEffect(() => {
    document.title = 'Progress · Frontend Lab';
  }, []);

  if (error) return <div className="page"><ErrorMessage error={error} onRetry={reload} /></div>;
  if (loading && !data) return <div className="page"><Loading label="Loading your progress" /></div>;

  const { totals, tracks, recent, activity, next } = data;
  return (
    <div className="page">
      <header className="page-head">
        <h1>Your progress</h1>
        <ProgressBar value={totals.passed} max={totals.lessons} label="Lessons passed across the course" />
        <p className="muted">
          {totals.tried} lessons tried, {totals.passed} passed.
          {next && (
            <>
              {' '}
              Next up: <Link to={`/lesson/${next.id}`}>{next.title}</Link>.
            </>
          )}
        </p>
      </header>

      <section className="panel" aria-labelledby="tracks-progress">
        <h2 id="tracks-progress">By track</h2>
        {tracks.map((track) => (
          <ProgressBar key={track.id} value={track.passedCount} max={track.lessonCount} label={track.title} />
        ))}
      </section>

      <section className="panel" aria-labelledby="recent-heading">
        <h2 id="recent-heading">Recent attempts</h2>
        {recent.length === 0 ? (
          <p className="muted">Nothing yet. Open a lesson and run your first task.</p>
        ) : (
          <div className="table-wrap" tabIndex={0} role="region" aria-labelledby="recent-heading">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Lesson</th>
                  <th scope="col">Score</th>
                  <th scope="col">When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((attempt) => (
                  <tr key={attempt.id}>
                    <td>
                      <Link to={`/lesson/${attempt.lessonId}`}>{attempt.lessonTitle}</Link>
                    </td>
                    <td className={attempt.score >= PASS_MARK ? 'text-pass' : 'text-fail'}>{formatScore(attempt.score)}</td>
                    <td>{time.format(new Date(attempt.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {activity.length > 0 && (
        <section className="panel" aria-labelledby="activity-heading">
          <h2 id="activity-heading">Activity</h2>
          <ul className="activity">
            {activity.map((entry) => (
              <li key={entry.day}>
                <span>{day.format(new Date(`${entry.day}T00:00:00`))}</span>
                <span>
                  {entry.attempts} attempt{entry.attempts === 1 ? '' : 's'}, {entry.passes} passing
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
