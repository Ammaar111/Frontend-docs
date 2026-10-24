import { createContext, useContext, useMemo } from 'react';
import { useApi } from '../hooks/useApi.js';

// The course outline (tracks, modules, lessons and their status) is needed
// by the sidebar, the home page and the track pages, so it is loaded once.
const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const { data, error, loading, reload } = useApi('/tracks');

  const value = useMemo(() => {
    const tracks = data?.tracks ?? [];
    const lessonIndex = new Map();
    for (const track of tracks) {
      for (const mod of track.modules) {
        for (const lesson of mod.lessons) lessonIndex.set(lesson.id, { ...lesson, trackId: track.id, moduleId: mod.id });
      }
    }
    return { tracks, lessonIndex, error, loading, refresh: reload };
  }, [data, error, loading, reload]);

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourse() {
  const value = useContext(CourseContext);
  if (!value) throw new Error('useCourse must be used inside <CourseProvider>');
  return value;
}
