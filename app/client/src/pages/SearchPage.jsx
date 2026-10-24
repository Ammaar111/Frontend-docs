import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { ErrorMessage, Loading, RUNNER_LABEL } from '../components/Status.jsx';

export default function SearchPage() {
  const [params] = useSearchParams();
  const term = (params.get('q') ?? '').trim();
  const { data, error, loading } = useApi(term.length >= 2 ? `/search?q=${encodeURIComponent(term)}` : null);

  useEffect(() => {
    document.title = `Search: ${term} · Frontend Lab`;
  }, [term]);

  return (
    <div className="page">
      <h1>Search</h1>
      {term.length < 2 && <p className="muted">Type at least two characters in the search box.</p>}
      {error && <ErrorMessage error={error} />}
      {term.length >= 2 && loading && <Loading label="Searching" />}
      {term.length >= 2 && data && (
        <>
          <p role="status">
            {data.results.length === 0
              ? `No lessons match "${term}".`
              : `${data.results.length} lesson${data.results.length === 1 ? '' : 's'} match "${term}".`}
          </p>
          <ul className="lesson-list">
            {data.results.map((result) => (
              <li key={result.id}>
                <Link to={`/lesson/${result.id}`}>
                  <span className="lesson-list__title">{result.title}</span>
                  <span className="muted">
                    {result.track_title} · {result.module_title}
                  </span>
                  <span className="tag">{RUNNER_LABEL[result.runner]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
