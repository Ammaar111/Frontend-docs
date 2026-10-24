-- Course content. Rebuilt from content/ by the seed step on every start.
CREATE TABLE tracks (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  position    INTEGER NOT NULL
);

CREATE TABLE modules (
  id       TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  title    TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE lessons (
  id          TEXT PRIMARY KEY,
  module_id   TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,       -- order across the whole course
  title       TEXT NOT NULL,
  source      TEXT NOT NULL,          -- which course part the lesson draws on
  runner      TEXT NOT NULL,          -- js | html | css | page | react | quiz
  language    TEXT,                   -- editor language, NULL for quizzes
  teach       TEXT NOT NULL,          -- JSON: list of blocks
  example     TEXT NOT NULL,          -- JSON: list of blocks
  task        TEXT NOT NULL,          -- JSON: list of blocks
  starter     TEXT NOT NULL,
  checks      TEXT NOT NULL,          -- JSON: list of checks, functions stored as source text
  config      TEXT NOT NULL,          -- JSON: fixture, setup, expose, questions...
  solution    TEXT NOT NULL,          -- never sent until the learner unlocks it
  search_text TEXT NOT NULL
);

CREATE INDEX lessons_module ON lessons(module_id, position);

-- Images and diagrams, stored in the database as BLOBs.
CREATE TABLE assets (
  name   TEXT PRIMARY KEY,
  mime   TEXT NOT NULL,
  bytes  BLOB NOT NULL,
  size   INTEGER NOT NULL,
  sha256 TEXT NOT NULL
);

-- Learner data. Kept across reseeds.
CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT INTO users (id, name) VALUES (1, 'Learner');

CREATE TABLE drafts (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id  TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  code       TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE attempts (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id  TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  code       TEXT NOT NULL,
  score      REAL NOT NULL,
  passed     INTEGER NOT NULL,        -- checks passed
  total      INTEGER NOT NULL,        -- checks in the lesson
  mistakes   TEXT NOT NULL,           -- JSON: list of strings
  checks     TEXT NOT NULL,           -- JSON: list of { label, pass }
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX attempts_lesson ON attempts(user_id, lesson_id, id);

-- One row per lesson the learner has tried. Derived from attempts, kept for fast reads.
CREATE TABLE progress (
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id       TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  best_score      REAL NOT NULL,
  attempts        INTEGER NOT NULL,
  passed_at       TEXT,
  last_attempt_at TEXT NOT NULL,
  PRIMARY KEY (user_id, lesson_id)
);
