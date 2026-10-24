// The HTTP API. createApp() takes an open database so tests can pass an
// in-memory one. There are no accounts yet: every request acts as user 1.
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.join(here, '..', 'client', 'dist');

export const PASS_MARK = 7;
// The reference solution unlocks after a pass, or after this many attempts.
export const SOLUTION_AFTER_ATTEMPTS = 3;
const MAX_CODE_LENGTH = 100_000;
const HISTORY_LIMIT = 20;
const USER_ID = 1;

export function createApp(db, { serveClient = false } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));

  const q = prepareQueries(db);

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, lessons: q.countLessons.get() });
  });

  app.get('/api/tracks', (req, res) => {
    res.json({ tracks: courseTree(q) });
  });

  app.get('/api/lessons/:id', (req, res) => {
    const row = q.lesson.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ lesson: lessonView(q, row) });
  });

  app.put('/api/lessons/:id/draft', (req, res) => {
    if (!q.lessonExists.get(req.params.id)) return res.status(404).json({ error: 'Lesson not found' });
    const { code } = req.body ?? {};
    if (typeof code !== 'string' || code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({ error: `code must be a string of at most ${MAX_CODE_LENGTH} characters` });
    }
    q.saveDraft.run({ user_id: USER_ID, lesson_id: req.params.id, code });
    res.json({ saved: true });
  });

  app.delete('/api/lessons/:id/draft', (req, res) => {
    q.deleteDraft.run(USER_ID, req.params.id);
    res.status(204).end();
  });

  app.get('/api/lessons/:id/attempts', (req, res) => {
    if (!q.lessonExists.get(req.params.id)) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ attempts: q.attempts.all(USER_ID, req.params.id, HISTORY_LIMIT).map(attemptView) });
  });

  app.post('/api/lessons/:id/attempts', (req, res) => {
    const lesson = q.lesson.get(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    // Quizzes are graded here, because the answers never leave the server.
    // Code lessons are graded in the browser, where the code runs.
    let report = req.body;
    if (lesson.runner === 'quiz') {
      report = gradeQuiz(JSON.parse(lesson.config).questions, req.body?.code);
      if (typeof report === 'string') return res.status(400).json({ error: report });
    } else {
      const problem = attemptProblem(req.body, JSON.parse(lesson.checks));
      if (problem) return res.status(400).json({ error: problem });
    }

    const { code, score, passed, total, mistakes, checks } = report;
    const record = db.transaction(() => {
      const info = q.insertAttempt.run({
        user_id: USER_ID,
        lesson_id: lesson.id,
        code,
        score,
        passed,
        total,
        mistakes: JSON.stringify(mistakes),
        checks: JSON.stringify(checks),
      });
      const attempt = q.attemptById.get(info.lastInsertRowid);
      q.upsertProgress.run({
        user_id: USER_ID,
        lesson_id: lesson.id,
        score,
        passed_at: score >= PASS_MARK ? attempt.created_at : null,
        at: attempt.created_at,
      });
      return attempt;
    })();

    res.status(201).json({
      attempt: attemptView(record),
      result: lesson.runner === 'quiz' ? report.result : undefined,
      progress: progressView(q.progress.get(USER_ID, lesson.id)),
    });
  });

  app.get('/api/lessons/:id/solution', (req, res) => {
    const lesson = q.lesson.get(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    if (!solutionUnlocked(q.progress.get(USER_ID, lesson.id))) {
      return res.status(403).json({
        error: `The solution unlocks after you pass this lesson, or after ${SOLUTION_AFTER_ATTEMPTS} attempts.`,
      });
    }
    res.json({ solution: lesson.solution });
  });

  app.get('/api/progress', (req, res) => {
    const tracks = courseTree(q).map(({ modules, ...track }) => track);
    const totals = tracks.reduce(
      (sum, track) => ({
        lessons: sum.lessons + track.lessonCount,
        passed: sum.passed + track.passedCount,
        tried: sum.tried + track.triedCount,
      }),
      { lessons: 0, passed: 0, tried: 0 },
    );
    res.json({
      totals,
      tracks,
      next: q.nextLesson.get(USER_ID, PASS_MARK) ?? null,
      recent: q.recent.all(USER_ID, 15).map((row) => ({ ...attemptView(row), lessonTitle: row.title })),
      activity: q.activity.all(USER_ID),
    });
  });

  app.get('/api/search', (req, res) => {
    const term = String(req.query.q ?? '').trim().toLowerCase();
    if (term.length < 2) return res.json({ results: [] });
    const like = `%${term.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
    res.json({ results: q.search.all({ like, title: like }) });
  });

  app.get('/api/assets/:name', (req, res) => {
    const asset = q.asset.get(req.params.name);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    const etag = `"${asset.sha256}"`;
    res.set({ ETag: etag, 'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' });
    if (req.headers['if-none-match'] === etag) return res.status(304).end();
    res.type(asset.mime).send(asset.bytes);
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  if (serveClient && fs.existsSync(CLIENT_DIST)) {
    // The sandbox iframe has an opaque origin, so its module scripts are
    // cross-origin requests and need this header to load.
    app.use('/assets', (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      next();
    });
    app.use(express.static(CLIENT_DIST, { index: false }));
    app.get('/{*splat}', (req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
  }

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Request body is not valid JSON' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large' });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on the server' });
  });

  return app;
}

function prepareQueries(db) {
  return {
    countLessons: db.prepare('SELECT COUNT(*) FROM lessons').pluck(),
    tracks: db.prepare('SELECT * FROM tracks ORDER BY position'),
    modules: db.prepare('SELECT * FROM modules ORDER BY track_id, position'),
    lessonSummaries: db.prepare(`
      SELECT l.id, l.module_id, l.title, l.runner, p.best_score, p.attempts, p.passed_at
      FROM lessons l LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ?
      ORDER BY l.position`),
    lesson: db.prepare('SELECT * FROM lessons WHERE id = ?'),
    lessonExists: db.prepare('SELECT 1 FROM lessons WHERE id = ?').pluck(),
    lessonContext: db.prepare(`
      SELECT m.id AS module_id, m.title AS module_title, t.id AS track_id, t.title AS track_title
      FROM modules m JOIN tracks t ON t.id = m.track_id WHERE m.id = ?`),
    neighbour: db.prepare(`
      SELECT
        (SELECT json_object('id', id, 'title', title) FROM lessons WHERE position < @position ORDER BY position DESC LIMIT 1) AS prev,
        (SELECT json_object('id', id, 'title', title) FROM lessons WHERE position > @position ORDER BY position ASC LIMIT 1) AS next`),
    draft: db.prepare('SELECT code, updated_at FROM drafts WHERE user_id = ? AND lesson_id = ?'),
    saveDraft: db.prepare(`
      INSERT INTO drafts (user_id, lesson_id, code) VALUES (@user_id, @lesson_id, @code)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET code = excluded.code,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`),
    deleteDraft: db.prepare('DELETE FROM drafts WHERE user_id = ? AND lesson_id = ?'),
    attempts: db.prepare('SELECT * FROM attempts WHERE user_id = ? AND lesson_id = ? ORDER BY id DESC LIMIT ?'),
    attemptById: db.prepare('SELECT * FROM attempts WHERE id = ?'),
    insertAttempt: db.prepare(`
      INSERT INTO attempts (user_id, lesson_id, code, score, passed, total, mistakes, checks)
      VALUES (@user_id, @lesson_id, @code, @score, @passed, @total, @mistakes, @checks)`),
    progress: db.prepare('SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?'),
    upsertProgress: db.prepare(`
      INSERT INTO progress (user_id, lesson_id, best_score, attempts, passed_at, last_attempt_at)
      VALUES (@user_id, @lesson_id, @score, 1, @passed_at, @at)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        best_score = MAX(progress.best_score, excluded.best_score),
        attempts = progress.attempts + 1,
        passed_at = COALESCE(progress.passed_at, excluded.passed_at),
        last_attempt_at = excluded.last_attempt_at`),
    nextLesson: db.prepare(`
      SELECT l.id, l.title FROM lessons l
      LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ?
      WHERE p.best_score IS NULL OR p.best_score < ?
      ORDER BY l.position LIMIT 1`),
    recent: db.prepare(`
      SELECT a.*, l.title FROM attempts a JOIN lessons l ON l.id = a.lesson_id
      WHERE a.user_id = ? ORDER BY a.id DESC LIMIT ?`),
    activity: db.prepare(`
      SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS attempts, SUM(score >= 7) AS passes
      FROM attempts WHERE user_id = ? GROUP BY day ORDER BY day DESC LIMIT 30`),
    search: db.prepare(`
      SELECT l.id, l.title, l.runner, m.title AS module_title, t.title AS track_title
      FROM lessons l JOIN modules m ON m.id = l.module_id JOIN tracks t ON t.id = m.track_id
      WHERE l.search_text LIKE @like ESCAPE '\\'
      ORDER BY (lower(l.title) LIKE @title ESCAPE '\\') DESC, l.position LIMIT 30`),
    asset: db.prepare('SELECT * FROM assets WHERE name = ?'),
  };
}

function status(row) {
  if (row.passed_at) return 'passed';
  if (row.attempts) return 'tried';
  return 'new';
}

function courseTree(q) {
  const lessons = q.lessonSummaries.all(USER_ID);
  const modules = q.modules.all();
  return q.tracks.all().map((track) => {
    const trackModules = modules
      .filter((mod) => mod.track_id === track.id)
      .map((mod) => ({
        id: mod.id,
        title: mod.title,
        lessons: lessons
          .filter((lesson) => lesson.module_id === mod.id)
          .map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            runner: lesson.runner,
            status: status(lesson),
            bestScore: lesson.best_score,
          })),
      }));
    const all = trackModules.flatMap((mod) => mod.lessons);
    return {
      id: track.id,
      title: track.title,
      description: track.description,
      lessonCount: all.length,
      passedCount: all.filter((lesson) => lesson.status === 'passed').length,
      triedCount: all.filter((lesson) => lesson.status !== 'new').length,
      modules: trackModules,
    };
  });
}

function lessonView(q, row) {
  const context = q.lessonContext.get(row.module_id);
  const { prev, next } = q.neighbour.get({ position: row.position });
  const progress = q.progress.get(USER_ID, row.id);
  const draft = q.draft.get(USER_ID, row.id);
  return {
    id: row.id,
    title: row.title,
    source: row.source,
    runner: row.runner,
    language: row.language,
    teach: JSON.parse(row.teach),
    example: JSON.parse(row.example),
    task: JSON.parse(row.task),
    starter: row.starter,
    checks: JSON.parse(row.checks),
    config: publicConfig(row),
    track: { id: context.track_id, title: context.track_title },
    module: { id: context.module_id, title: context.module_title },
    prev: prev ? JSON.parse(prev) : null,
    next: next ? JSON.parse(next) : null,
    draft: draft ? draft.code : null,
    progress: progressView(progress),
    solutionUnlocked: solutionUnlocked(progress),
  };
}

// Quiz answers are part of the config; they stay on the server.
function publicConfig(row) {
  const config = JSON.parse(row.config);
  if (config.questions) {
    config.questions = config.questions.map(({ q: question, options, code }) => ({ q: question, options, code }));
  }
  return config;
}

function progressView(row) {
  if (!row) return { bestScore: null, attempts: 0, passedAt: null, status: 'new' };
  return { bestScore: row.best_score, attempts: row.attempts, passedAt: row.passed_at, status: status(row) };
}

function solutionUnlocked(progress) {
  return Boolean(progress && (progress.passed_at || progress.attempts >= SOLUTION_AFTER_ATTEMPTS));
}

function attemptView(row) {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    code: row.code,
    score: row.score,
    passed: row.passed,
    total: row.total,
    mistakes: JSON.parse(row.mistakes),
    checks: JSON.parse(row.checks),
    createdAt: row.created_at,
  };
}

// The score is computed in the browser, where the learner's code runs.
// The server checks that the report is well formed and consistent with the
// lesson, so a bad client cannot store nonsense.
function attemptProblem(body, lessonChecks) {
  if (!body || typeof body !== 'object') return 'Expected a JSON object';
  const { code, score, passed, total, mistakes, checks } = body;
  const expectedTotal = lessonChecks.length;
  if (typeof code !== 'string' || code.length > MAX_CODE_LENGTH) return 'code must be a string';
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 10) return 'score must be a number from 0 to 10';
  if (Math.round(score * 10) !== score * 10) return 'score has at most one decimal place';
  if (total !== expectedTotal) return `total must be ${expectedTotal} for this lesson`;
  if (!Number.isInteger(passed) || passed < 0 || passed > total) return 'passed must be a whole number between 0 and total';
  if (!Array.isArray(mistakes) || mistakes.length > 60 || !mistakes.every((item) => typeof item === 'string' && item.length < 2000)) {
    return 'mistakes must be a list of strings';
  }
  if (!Array.isArray(checks) || checks.length !== total) return 'checks must have one entry per check';
  if (!checks.every((item) => item && typeof item.label === 'string' && typeof item.pass === 'boolean')) {
    return 'each check needs a label and a pass flag';
  }
  if (checks.filter((item) => item.pass).length !== passed) return 'passed does not match the checks';
  return null;
}

// `code` is a JSON list with the index of the chosen option per question,
// or null for an unanswered question. Returns an error string or a report.
export function gradeQuiz(questions, code) {
  let answers;
  try {
    answers = JSON.parse(code);
  } catch {
    return 'code must be a JSON list of answers';
  }
  if (!Array.isArray(answers) || answers.length !== questions.length) {
    return `answers must be a list of ${questions.length} entries`;
  }
  if (!answers.every((answer) => answer === null || Number.isInteger(answer))) {
    return 'each answer must be an option index or null';
  }

  const mistakes = [];
  const checks = questions.map((question, index) => {
    const chosen = answers[index];
    const pass = chosen === question.answer;
    if (!pass) {
      const picked = chosen === null || question.options[chosen] === undefined ? 'no answer' : `"${question.options[chosen]}"`;
      mistakes.push(
        `Question ${index + 1}: you chose ${picked}. The answer is "${question.options[question.answer]}". ${question.explain}`,
      );
    }
    return { label: `Question ${index + 1}`, pass };
  });

  const passed = checks.filter((check) => check.pass).length;
  const score = Math.round((passed / questions.length) * 100) / 10;
  return {
    code,
    score,
    passed,
    total: questions.length,
    mistakes,
    checks,
    result: { score, passed, count: questions.length, mistakes, checks },
  };
}
