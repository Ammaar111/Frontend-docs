import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

// Loads `path` and re-loads when it changes. A response that arrives after
// the path has changed is ignored, so a slow request can never overwrite a
// newer one.
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    const controller = new AbortController();
    setState((previous) => ({ data: previous.data, error: null, loading: true }));
    api(path, { signal: controller.signal })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error, loading: false });
      });
    return () => controller.abort();
  }, [path, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const setData = useCallback((update) => {
    setState((previous) => ({ ...previous, data: typeof update === 'function' ? update(previous.data) : update }));
  }, []);

  return { ...state, reload, setData };
}
