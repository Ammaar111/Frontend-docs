import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../hooks/useApi.js';
import { useCourse } from '../context/CourseContext.jsx';
import { gradeLesson } from '../grader/index.js';
import Blocks from '../components/Blocks.jsx';
import CodeBlock from '../components/CodeBlock.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import Evaluation from '../components/Evaluation.jsx';
import History from '../components/History.jsx';
import QuizForm from '../components/QuizForm.jsx';
import LessonSidebar from '../components/LessonSidebar.jsx';
import Preview, { hasPreview } from '../components/Preview.jsx';
import { ErrorMessage, Loading, RUNNER_LABEL, ScoreBadge } from '../components/Status.jsx';

const DRAFT_DELAY_MS = 800;
const LANG_FOR_BLOCKS = { javascript: 'js', jsx: 'jsx', html: 'html', css: 'css' };

export default function LessonPage() {
  const { lessonId } = useParams();
  const { data, error, loading, reload } = useApi(`/lessons/${lessonId}`);

  useEffect(() => {
    if (data?.lesson) document.title = `${data.lesson.title} · Frontend Lab`;
  }, [data]);

  if (error) {
    return (
      <div className="page">
        <ErrorMessage error={error} onRetry={error.status === 404 ? undefined : reload} />
        {error.status === 404 && <Link to="/">Back to the course</Link>}
      </div>
    );
  }
  if (loading && !data) return <div className="page"><Loading label="Loading lesson" /></div>;
  // Keyed by id, so moving to another lesson starts with fresh state.
  return <Lesson key={data.lesson.id} lesson={data.lesson} />;
}

function initialCode(lesson) {
  if (lesson.runner === 'quiz') {
    const empty = lesson.config.questions.map(() => null);
    try {
      const saved = JSON.parse(lesson.draft);
      return Array.isArray(saved) && saved.length === empty.length ? saved : empty;
    } catch {
      return empty;
    }
  }
  return lesson.draft ?? lesson.starter;
}

function Lesson({ lesson }) {
  const { refresh } = useCourse();
  const isQuiz = lesson.runner === 'quiz';
  const blockLang = LANG_FOR_BLOCKS[lesson.language] ?? 'js';

  const [code, setCode] = useState(() => initialCode(lesson));
  const [progress, setProgress] = useState(lesson.progress);
  const [solutionUnlocked, setSolutionUnlocked] = useState(lesson.solutionUnlocked);
  const [result, setResult] = useState(null);
  const [resultIsStale, setResultIsStale] = useState(false);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState(null);
  const [draftState, setDraftState] = useState('saved');
  const [solution, setSolution] = useState(null);

  const history = useApi(`/lessons/${lesson.id}/attempts`);
  const attempts = history.data?.attempts ?? [];

  // Show the last attempt's evaluation when the lesson opens.
  const shownLast = useRef(false);
  useEffect(() => {
    if (shownLast.current || !history.data) return;
    shownLast.current = true;
    const last = history.data.attempts[0];
    if (last) {
      setResult({ score: last.score, passed: last.passed, count: last.total, mistakes: last.mistakes, checks: last.checks, logs: [] });
      setResultIsStale(true);
    }
  }, [history.data]);

  // Save the draft shortly after typing stops.
  const serialized = isQuiz ? JSON.stringify(code) : code;
  const lastSaved = useRef(isQuiz ? JSON.stringify(initialCode(lesson)) : initialCode(lesson));
  useEffect(() => {
    if (serialized === lastSaved.current) return undefined;
    setDraftState('unsaved');
    const timer = setTimeout(() => {
      api(`/lessons/${lesson.id}/draft`, { method: 'PUT', body: { code: serialized } })
        .then(() => {
          lastSaved.current = serialized;
          setDraftState('saved');
        })
        .catch(() => setDraftState('error'));
    }, DRAFT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [serialized, lesson.id]);

  const recordAttempt = useCallback(
    (response) => {
      setProgress(response.progress);
      if (response.progress.passedAt || response.progress.attempts >= 3) setSolutionUnlocked(true);
      history.setData((previous) => ({ attempts: [response.attempt, ...(previous?.attempts ?? [])].slice(0, 20) }));
      refresh();
    },
    [history, refresh],
  );

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setNotice(null);
    try {
      if (isQuiz) {
        const response = await api(`/lessons/${lesson.id}/attempts`, { method: 'POST', body: { code: JSON.stringify(code) } });
        setResult({ ...response.result, logs: [] });
        recordAttempt(response);
      } else {
        const graded = await gradeLesson(lesson, code);
        setResult(graded);
        try {
          const response = await api(`/lessons/${lesson.id}/attempts`, {
            method: 'POST',
            body: {
              code,
              score: graded.score,
              passed: graded.passed,
              total: graded.count,
              mistakes: graded.mistakes,
              checks: graded.checks,
            },
          });
          recordAttempt(response);
        } catch (err) {
          setNotice(`Graded, but not saved: ${err.message}`);
        }
      }
      setResultIsStale(false);
    } catch (err) {
      setNotice(err.message);
    } finally {
      setRunning(false);
    }
  }, [running, isQuiz, lesson, code, recordAttempt]);

  const reset = () => {
    if (window.confirm('Replace your code with the starter code? Your current code will be lost.')) {
      setCode(initialCode({ ...lesson, draft: null }));
    }
  };

  const showSolution = async () => {
    try {
      const response = await api(`/lessons/${lesson.id}/solution`);
      setSolution(response.solution);
    } catch (err) {
      setNotice(err.message);
    }
  };

  const solutionText = useMemo(() => {
    if (solution === null) return null;
    if (!isQuiz) return solution;
    const answers = JSON.parse(solution);
    return answers.map((answer, index) => `Question ${index + 1}: ${lesson.config.questions[index].options[answer]}`).join('\n');
  }, [solution, isQuiz, lesson]);

  return (
    <div className="lesson-layout">
      <LessonSidebar trackId={lesson.track.id} lessonId={lesson.id} />

      <article className="lesson" aria-labelledby="lesson-title">
        <header className="lesson__head">
          <p className="crumb">
            <Link to={`/track/${lesson.track.id}`}>{lesson.track.title}</Link> <span aria-hidden="true">›</span>{' '}
            {lesson.module.title}
          </p>
          <h1 id="lesson-title">{lesson.title}</h1>
          <p className="lesson__meta">
            <span className="tag">{RUNNER_LABEL[lesson.runner]}</span>
            <span className="muted">From the {lesson.source}</span>
            {progress.bestScore !== null && (
              <span>
                Best: <ScoreBadge score={progress.bestScore} />
              </span>
            )}
          </p>
        </header>

        <section className="panel" aria-labelledby="teach-heading">
          <h2 id="teach-heading">1. Teach</h2>
          <Blocks blocks={lesson.teach} lang={blockLang} />
        </section>

        <section className="panel" aria-labelledby="example-heading">
          <h2 id="example-heading">2. Example</h2>
          <Blocks blocks={lesson.example} lang={blockLang} />
        </section>

        <section className="panel panel--task" aria-labelledby="task-heading">
          <h2 id="task-heading">3. Task</h2>
          <Blocks blocks={lesson.task} lang={blockLang} />
        </section>

        <section className="panel" aria-labelledby="code-heading">
          <h2 id="code-heading">4. {isQuiz ? 'Your answers' : 'Your code'}</h2>
          {isQuiz ? (
            <QuizForm questions={lesson.config.questions} answers={code} onChange={setCode} onSubmit={run} running={running} />
          ) : (
            <>
              <p id="editor-help" className="muted editor-help">
                {lesson.language === 'jsx' ? 'JSX' : lesson.language?.toUpperCase()} · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd>{' '}
                runs. <kbd>Esc</kbd> then <kbd>Tab</kbd> leaves the editor.
              </p>
              <CodeEditor
                value={code}
                onChange={setCode}
                onRun={run}
                language={lesson.language}
                labelId="code-heading"
                describedBy="editor-help"
              />
              {hasPreview(lesson) && <Preview lesson={lesson} code={code} />}
              <div className="actions">
                <button type="button" className="button--primary" onClick={run} disabled={running}>
                  {running ? 'Running…' : 'Run and grade'}
                </button>
                <button type="button" onClick={reset} disabled={running}>
                  Reset to starter
                </button>
                <button
                  type="button"
                  onClick={showSolution}
                  disabled={!solutionUnlocked}
                  title={solutionUnlocked ? undefined : 'Unlocks after you pass, or after 3 attempts'}
                >
                  Show solution
                </button>
                <span className={`draft-state draft-state--${draftState}`} role="status">
                  {{ saved: 'Draft saved', unsaved: 'Saving…', error: 'Draft not saved' }[draftState]}
                </span>
              </div>
            </>
          )}
          {isQuiz && (
            <div className="actions">
              <button
                type="button"
                onClick={showSolution}
                disabled={!solutionUnlocked}
                title={solutionUnlocked ? undefined : 'Unlocks after you pass, or after 3 attempts'}
              >
                Show answers
              </button>
            </div>
          )}
          {!solutionUnlocked && <p className="muted">The reference solution unlocks after you pass, or after 3 attempts.</p>}
          {notice && (
            <p className="notice" role="alert">
              {notice}
            </p>
          )}
          {solutionText !== null && (
            <div className="solution">
              <h3>Reference solution</h3>
              <p className="muted">One correct answer. Yours can differ and still pass.</p>
              <CodeBlock code={solutionText} lang={isQuiz ? 'text' : blockLang} />
              {!isQuiz && (
                <button type="button" onClick={() => setCode(solution)}>
                  Load into the editor
                </button>
              )}
            </div>
          )}
        </section>

        <Evaluation result={result} running={running} stale={resultIsStale} />

        <History
          attempts={attempts}
          onLoad={
            isQuiz
              ? undefined
              : (attempt) => {
                  setCode(attempt.code);
                  setResult({ score: attempt.score, passed: attempt.passed, count: attempt.total, mistakes: attempt.mistakes, checks: attempt.checks, logs: [] });
                  setResultIsStale(true);
                }
          }
        />

        <nav className="pager" aria-label="Lesson">
          {lesson.prev ? (
            <Link to={`/lesson/${lesson.prev.id}`} rel="prev">
              ← {lesson.prev.title}
            </Link>
          ) : (
            <span />
          )}
          {lesson.next && (
            <Link to={`/lesson/${lesson.next.id}`} rel="next">
              {lesson.next.title} →
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
