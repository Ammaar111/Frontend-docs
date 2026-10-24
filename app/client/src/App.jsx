import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import HomePage from './pages/HomePage.jsx';
import TrackPage from './pages/TrackPage.jsx';
import LessonPage from './pages/LessonPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
        <Route path="track/:trackId" element={<ErrorBoundary><TrackPage /></ErrorBoundary>} />
        <Route path="lesson/:lessonId" element={<ErrorBoundary><LessonPage /></ErrorBoundary>} />
        <Route path="progress" element={<ErrorBoundary><ProgressPage /></ErrorBoundary>} />
        <Route path="search" element={<ErrorBoundary><SearchPage /></ErrorBoundary>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
