import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext.jsx';
import { StatusIcon } from './Status.jsx';

// The outline of the current track, with the current lesson marked.
export default function LessonSidebar({ trackId, lessonId }) {
  const { tracks } = useCourse();
  const track = tracks.find((item) => item.id === trackId);
  const current = useRef(null);
  const nav = useRef(null);

  // Scroll the sidebar (not the page) so the current lesson is visible.
  useEffect(() => {
    const box = nav.current;
    const item = current.current;
    if (box && item && box.scrollHeight > box.clientHeight) {
      box.scrollTop = item.offsetTop - box.clientHeight / 2;
    }
  }, [lessonId, track]);

  if (!track) return null;
  return (
    <nav className="lesson-sidebar" aria-label={`${track.title} lessons`} ref={nav}>
      <p className="lesson-sidebar__track">
        <Link to={`/track/${track.id}`}>{track.title}</Link>
        <span className="muted">
          {' '}
          {track.passedCount}/{track.lessonCount} passed
        </span>
      </p>
      {track.modules.map((mod) => (
        <div key={mod.id} className="lesson-sidebar__module">
          <h2>{mod.title}</h2>
          <ul>
            {mod.lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  to={`/lesson/${lesson.id}`}
                  aria-current={lesson.id === lessonId ? 'page' : undefined}
                  ref={lesson.id === lessonId ? current : undefined}
                >
                  <StatusIcon status={lesson.status} />
                  <span>{lesson.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
