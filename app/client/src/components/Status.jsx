import { formatScore } from '../grader/grading.js';

const LABEL = { passed: 'Passed', tried: 'Tried, not passed yet', new: 'Not started' };
const ICON = { passed: '✓', tried: '●', new: '○' };

export function StatusIcon({ status }) {
  return (
    <span className={`status status--${status}`} title={LABEL[status]}>
      <span aria-hidden="true">{ICON[status]}</span>
      <span className="sr-only">{LABEL[status]}</span>
    </span>
  );
}

export function ProgressBar({ value, max, label }) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="progress">
      <div className="progress__label">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="progress__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function ScoreBadge({ score }) {
  if (score === null || score === undefined) return null;
  return <span className={`score-badge ${score >= 7 ? 'score-badge--pass' : 'score-badge--fail'}`}>{formatScore(score)}</span>;
}

export function Loading({ label = 'Loading' }) {
  return (
    <p className="loading" role="status">
      {label}…
    </p>
  );
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="panel error-panel" role="alert">
      <p>{error?.message ?? String(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export const RUNNER_LABEL = {
  js: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  page: 'Live page',
  react: 'React',
  quiz: 'Quiz',
};
