import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { ErrorMessage, Loading, ProgressBar } from '../components/Status.jsx';

const STEPS = [
  ['Teach', 'The concept, why it exists, and the mistakes people make with it.'],
  ['Example', 'Working code to read before you write your own.'],
  ['Task', 'Exactly what to build, with the names the checks will look for.'],
  ['Your code', 'Write it in the editor. Drafts save as you type.'],
  ['Evaluation', 'Your code runs against the checks and gets a score out of 10. 7 passes.'],
  ['Mistakes made', 'One line per failed check, saying what is wrong and what to fix.'],
];

export default function HomePage() {
  const { tracks, error, loading, refresh } = useCourse();
  const progress = useApi('/progress');

  useEffect(() => {
    document.title = 'Frontend Lab · Learn HTML, CSS, JavaScript and React';
  }, []);

  const next = progress.data?.next;
  const totals = progress.data?.totals;

  return (
    <div className="page">
      <section className="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading">Learn front-end development, one graded task at a time</h1>
        <p className="hero__lead">
          HTML, CSS, JavaScript and React from absolute zero, built from the two courses in this repository. Every lesson
          runs the same loop, and every task is checked by running your code.
        </p>
        <div className="hero__actions">
          {next ? (
            <Link className="button button--primary" to={`/lesson/${next.id}`}>
              {totals?.tried ? 'Continue' : 'Start'}: {next.title}
            </Link>
          ) : (
            totals && <p className="all-clear">Every lesson passed. Try the hardest ones again from memory.</p>
          )}
          {totals && (
            <span className="muted">
              {totals.passed} of {totals.lessons} lessons passed
            </span>
          )}
        </div>
      </section>

      <section aria-labelledby="loop-heading">
        <h2 id="loop-heading">How every lesson works</h2>
        <ol className="steps">
          {STEPS.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tracks-heading">
        <h2 id="tracks-heading">Tracks</h2>
        <p className="muted">Take them in order. Each track assumes the ones before it.</p>
        {error && <ErrorMessage error={error} onRetry={refresh} />}
        {loading && tracks.length === 0 && <Loading label="Loading the course" />}
        <ol className="track-grid">
          {tracks.map((track, index) => (
            <li key={track.id} className="track-card">
              <p className="track-card__step">Track {index + 1}</p>
              <h3>
                <Link to={`/track/${track.id}`}>{track.title}</Link>
              </h3>
              <p>{track.description}</p>
              <p className="muted">
                {track.modules.length} modules · {track.lessonCount} lessons
              </p>
              <ProgressBar value={track.passedCount} max={track.lessonCount} label="Passed" />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
