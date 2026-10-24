import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCourse } from '../context/CourseContext.jsx';
import { ErrorMessage, Loading, ProgressBar, RUNNER_LABEL, ScoreBadge, StatusIcon } from '../components/Status.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function TrackPage() {
  const { trackId } = useParams();
  const { tracks, error, loading, refresh } = useCourse();
  const track = tracks.find((item) => item.id === trackId);

  useEffect(() => {
    if (track) document.title = `${track.title} · Frontend Lab`;
  }, [track]);

  if (error) return <div className="page"><ErrorMessage error={error} onRetry={refresh} /></div>;
  if (loading && !track) return <div className="page"><Loading label="Loading the track" /></div>;
  if (!track) return <NotFoundPage />;

  const firstOpen = track.modules.flatMap((mod) => mod.lessons).find((lesson) => lesson.status !== 'passed');

  return (
    <div className="page">
      <header className="page-head">
        <p className="crumb">
          <Link to="/">Course</Link> <span aria-hidden="true">›</span> {track.title}
        </p>
        <h1>{track.title}</h1>
        <p className="hero__lead">{track.description}</p>
        <ProgressBar value={track.passedCount} max={track.lessonCount} label="Lessons passed" />
        {firstOpen && (
          <p>
            <Link className="button button--primary" to={`/lesson/${firstOpen.id}`}>
              {track.triedCount ? 'Continue' : 'Start'}: {firstOpen.title}
            </Link>
          </p>
        )}
      </header>

      {track.modules.map((mod, index) => {
        const passed = mod.lessons.filter((lesson) => lesson.status === 'passed').length;
        return (
          <section key={mod.id} className="panel module-block" aria-labelledby={`module-${mod.id}`}>
            <h2 id={`module-${mod.id}`}>
              <span className="muted">Module {index + 1}.</span> {mod.title}
            </h2>
            <p className="muted">
              {passed}/{mod.lessons.length} passed
            </p>
            <ol className="lesson-list">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link to={`/lesson/${lesson.id}`}>
                    <StatusIcon status={lesson.status} />
                    <span className="lesson-list__title">{lesson.title}</span>
                    <span className="tag">{RUNNER_LABEL[lesson.runner]}</span>
                    <ScoreBadge score={lesson.bestScore} />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
