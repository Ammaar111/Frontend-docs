// Loads the course from content/, checks that it is well formed, and turns
// each lesson into the row shape stored in SQLite. Check functions are
// stored as their source text and compiled again in the browser.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const CONTENT_DIR = path.join(here, '..', 'content');
export const ASSETS_DIR = path.join(CONTENT_DIR, 'assets');

export const RUNNERS = ['js', 'html', 'css', 'page', 'react', 'quiz'];
const SLOTS = ['js', 'css', 'html'];
const MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function loadCourse() {
  const { tracks } = await import(path.join(CONTENT_DIR, 'index.js'));
  return tracks;
}

export function languageFor(lesson) {
  switch (lesson.runner) {
    case 'js':
      return 'javascript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'react':
      return 'jsx';
    case 'page':
      return { js: 'javascript', css: 'css', html: 'html' }[lesson.slot];
    default:
      return null;
  }
}

// Every lesson in course order, with its track and module attached.
export function flatten(tracks) {
  const rows = [];
  for (const track of tracks) {
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) rows.push({ track, module: mod, lesson });
    }
  }
  return rows;
}

// Returns a list of problems. An empty list means the course is valid.
export function validateCourse(tracks) {
  const problems = [];
  const ids = new Set();
  const moduleIds = new Set();
  const assets = new Set(listAssetFiles().map((file) => path.basename(file)));

  for (const track of tracks) {
    if (!track.id || !track.title || !track.description) problems.push(`track ${track.id}: needs id, title, description`);
    if (!Array.isArray(track.modules) || track.modules.length === 0) problems.push(`track ${track.id}: has no modules`);

    for (const mod of track.modules ?? []) {
      if (!mod.id || !mod.title) problems.push(`module in ${track.id}: needs id and title`);
      if (moduleIds.has(mod.id)) problems.push(`module ${mod.id}: duplicate id`);
      moduleIds.add(mod.id);
      if (!Array.isArray(mod.lessons) || mod.lessons.length === 0) problems.push(`module ${mod.id}: has no lessons`);

      for (const lesson of mod.lessons ?? []) {
        const where = `lesson ${lesson.id ?? '(no id)'}`;
        if (!lesson.id || !/^[a-z0-9-]+$/.test(lesson.id)) problems.push(`${where}: id must be lowercase letters, digits and dashes`);
        if (ids.has(lesson.id)) problems.push(`${where}: duplicate id`);
        ids.add(lesson.id);

        for (const field of ['title', 'source']) {
          if (typeof lesson[field] !== 'string' || !lesson[field]) problems.push(`${where}: missing ${field}`);
        }
        if (!RUNNERS.includes(lesson.runner)) problems.push(`${where}: unknown runner ${lesson.runner}`);
        if (lesson.runner === 'page' && !SLOTS.includes(lesson.slot)) problems.push(`${where}: page lessons need slot js, css or html`);
        for (const field of ['teach', 'example', 'task']) {
          if (!Array.isArray(lesson[field]) || lesson[field].length === 0) problems.push(`${where}: ${field} must be a non-empty list of blocks`);
          else problems.push(...blockProblems(lesson[field], `${where} ${field}`, assets));
        }

        if (lesson.runner === 'quiz') {
          problems.push(...quizProblems(lesson, where));
          continue;
        }

        if (typeof lesson.starter !== 'string') problems.push(`${where}: missing starter`);
        if (typeof lesson.solution !== 'string' || !lesson.solution.trim()) problems.push(`${where}: missing solution`);
        if (!Array.isArray(lesson.checks) || lesson.checks.length < 3) problems.push(`${where}: needs at least three checks`);

        for (const check of lesson.checks ?? []) {
          const label = `${where} check "${check.label}"`;
          if (!check.label) problems.push(`${where}: a check has no label`);
          if (!check.mistake) problems.push(`${label}: no mistake message`);
          if (check.weight !== undefined && !(check.weight > 0)) problems.push(`${label}: weight must be positive`);
          if (lesson.runner === 'js') {
            if (typeof check.expr !== 'string') problems.push(`${label}: js checks need an expr string`);
            if (!('expect' in check) && check.throws !== true) problems.push(`${label}: needs expect or throws: true`);
            if ('expect' in check && JSON.stringify(check.expect) === undefined) problems.push(`${label}: expect must be JSON (use expr: "x === undefined", expect: true)`);
            if ('expect' in check && !jsonSafe(check.expect)) problems.push(`${label}: expect must survive JSON (no undefined, NaN or Infinity inside)`);
          } else if (typeof check.check !== 'function') {
            problems.push(`${label}: needs a check function`);
          }
        }
      }
    }
  }
  return problems;
}

function jsonSafe(value) {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value) && !containsNonFinite(value);
  } catch {
    return false;
  }
}

function containsNonFinite(value) {
  if (typeof value === 'number') return !Number.isFinite(value);
  if (value && typeof value === 'object') return Object.values(value).some(containsNonFinite);
  return false;
}

function quizProblems(lesson, where) {
  const problems = [];
  if (!Array.isArray(lesson.questions) || lesson.questions.length < 3) {
    problems.push(`${where}: quizzes need at least three questions`);
    return problems;
  }
  lesson.questions.forEach((question, index) => {
    const label = `${where} question ${index + 1}`;
    if (!question.q) problems.push(`${label}: missing q`);
    if (!Array.isArray(question.options) || question.options.length < 2) problems.push(`${label}: needs two or more options`);
    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= (question.options?.length ?? 0)) {
      problems.push(`${label}: answer must be the index of an option`);
    }
    if (!question.explain) problems.push(`${label}: missing explain`);
  });
  return problems;
}

const BLOCK_KEYS = ['code', 'list', 'ol', 'tip', 'warn', 'note', 'h', 'table', 'img', 'output'];

function blockProblems(blocks, where, assets) {
  const problems = [];
  for (const block of blocks) {
    if (typeof block === 'string') continue;
    const keys = Object.keys(block).filter((key) => BLOCK_KEYS.includes(key));
    if (keys.length !== 1) problems.push(`${where}: block must have exactly one of ${BLOCK_KEYS.join(', ')} (${JSON.stringify(block).slice(0, 60)})`);
    if (block.img && !assets.has(block.img)) problems.push(`${where}: image ${block.img} is not in content/assets`);
    if (block.img && !block.alt) problems.push(`${where}: image ${block.img} needs alt text`);
    if (block.table && (!Array.isArray(block.table.head) || !Array.isArray(block.table.rows))) problems.push(`${where}: table needs head and rows`);
  }
  return problems;
}

export function serializeCheck(check) {
  const out = { label: check.label, mistake: check.mistake };
  if (check.weight !== undefined) out.weight = check.weight;
  if (typeof check.check === 'function') out.check = check.check.toString();
  if (check.expr !== undefined) out.expr = check.expr;
  if ('expect' in check) out.expect = check.expect;
  if (check.throws) out.throws = true;
  return out;
}

function blockText(blocks) {
  return blocks
    .map((block) => {
      if (typeof block === 'string') return block;
      if (block.list || block.ol) return (block.list ?? block.ol).join(' ');
      return block.tip ?? block.warn ?? block.note ?? block.h ?? '';
    })
    .join(' ');
}

export function lessonRow({ module: mod, lesson }, position) {
  const config = {};
  for (const key of ['slot', 'fixture', 'setup', 'expose', 'component', 'questions', 'viewport']) {
    if (lesson[key] !== undefined) config[key] = lesson[key];
  }
  return {
    id: lesson.id,
    module_id: mod.id,
    position,
    title: lesson.title,
    source: lesson.source,
    runner: lesson.runner,
    language: languageFor(lesson),
    teach: JSON.stringify(lesson.teach),
    example: JSON.stringify(lesson.example),
    task: JSON.stringify(lesson.task),
    starter: lesson.starter ?? '',
    checks: JSON.stringify((lesson.checks ?? []).map(serializeCheck)),
    config: JSON.stringify(config),
    solution: lesson.runner === 'quiz' ? JSON.stringify(lesson.questions.map((question) => question.answer)) : lesson.solution,
    search_text: `${lesson.title} ${mod.title} ${blockText(lesson.teach)}`.toLowerCase(),
  };
}

export function listAssetFiles() {
  if (!fs.existsSync(ASSETS_DIR)) return [];
  return fs
    .readdirSync(ASSETS_DIR)
    .filter((name) => MIME[path.extname(name).toLowerCase()])
    .map((name) => path.join(ASSETS_DIR, name));
}

export function assetRow(file) {
  const bytes = fs.readFileSync(file);
  return {
    name: path.basename(file),
    mime: MIME[path.extname(file).toLowerCase()],
    bytes,
    size: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
}
