import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              &lt;/&gt;
            </span>
            Frontend Lab
          </Link>
          <nav aria-label="Main" className="main-nav">
            <NavLink to="/" end>
              Course
            </NavLink>
            <NavLink to="/progress">Progress</NavLink>
          </nav>
          <SearchBox />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          Lessons are built from the HTML &amp; CSS and JavaScript &amp; React courses in this repository. Your code runs
          in your browser; progress is saved in SQLite on your machine.
        </p>
      </footer>
    </>
  );
}

function SearchBox() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');

  return (
    <form
      role="search"
      className="search-box"
      onSubmit={(event) => {
        event.preventDefault();
        if (term.trim()) navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        Search lessons
      </label>
      <input
        id="site-search"
        type="search"
        placeholder="Search lessons"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
    </form>
  );
}
