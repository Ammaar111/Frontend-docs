// Copies the course from content/ into SQLite. Safe to run any number of
// times: lessons are upserted, lessons that were removed from content/ are
// deleted, and the learner's drafts and attempts on remaining lessons are kept.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './db.js';
import { loadCourse, validateCourse, flatten, lessonRow, listAssetFiles, assetRow } from './content.js';

export async function seed(db) {
  const tracks = await loadCourse();
  const problems = validateCourse(tracks);
  if (problems.length) {
    throw new Error(`The course in content/ has ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  }

  const rows = flatten(tracks).map((entry, index) => lessonRow(entry, index));
  const assets = listAssetFiles().map(assetRow);

  const upsertTrack = db.prepare(`
    INSERT INTO tracks (id, title, description, position) VALUES (@id, @title, @description, @position)
    ON CONFLICT(id) DO UPDATE SET title = excluded.title, description = excluded.description, position = excluded.position`);
  const upsertModule = db.prepare(`
    INSERT INTO modules (id, track_id, title, position) VALUES (@id, @track_id, @title, @position)
    ON CONFLICT(id) DO UPDATE SET track_id = excluded.track_id, title = excluded.title, position = excluded.position`);
  const upsertLesson = db.prepare(`
    INSERT INTO lessons (id, module_id, position, title, source, runner, language, teach, example, task, starter, checks, config, solution, search_text)
    VALUES (@id, @module_id, @position, @title, @source, @runner, @language, @teach, @example, @task, @starter, @checks, @config, @solution, @search_text)
    ON CONFLICT(id) DO UPDATE SET
      module_id = excluded.module_id, position = excluded.position, title = excluded.title, source = excluded.source,
      runner = excluded.runner, language = excluded.language, teach = excluded.teach, example = excluded.example,
      task = excluded.task, starter = excluded.starter, checks = excluded.checks, config = excluded.config,
      solution = excluded.solution, search_text = excluded.search_text`);
  const upsertAsset = db.prepare(`
    INSERT INTO assets (name, mime, bytes, size, sha256) VALUES (@name, @mime, @bytes, @size, @sha256)
    ON CONFLICT(name) DO UPDATE SET mime = excluded.mime, bytes = excluded.bytes, size = excluded.size, sha256 = excluded.sha256
    WHERE assets.sha256 <> excluded.sha256`);

  db.transaction(() => {
    tracks.forEach((track, position) => {
      upsertTrack.run({ id: track.id, title: track.title, description: track.description, position });
      track.modules.forEach((mod, modulePosition) => {
        upsertModule.run({ id: mod.id, track_id: track.id, title: mod.title, position: modulePosition });
      });
    });
    for (const row of rows) upsertLesson.run(row);
    for (const asset of assets) upsertAsset.run(asset);

    // Remove anything that is no longer part of the course.
    removeMissing(db, 'lessons', rows.map((row) => row.id));
    removeMissing(db, 'modules', tracks.flatMap((track) => track.modules.map((mod) => mod.id)));
    removeMissing(db, 'tracks', tracks.map((track) => track.id));
    removeMissing(db, 'assets', assets.map((asset) => asset.name), 'name');
  })();

  return { tracks: tracks.length, lessons: rows.length, assets: assets.length };
}

function removeMissing(db, table, keep, key = 'id') {
  const existing = db.prepare(`SELECT ${key} FROM ${table}`).pluck().all();
  const keepSet = new Set(keep);
  const remove = db.prepare(`DELETE FROM ${table} WHERE ${key} = ?`);
  for (const value of existing) if (!keepSet.has(value)) remove.run(value);
}

// `npm run seed`
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const db = openDatabase();
  const counts = await seed(db);
  db.close();
  console.log(`Seeded ${counts.tracks} tracks, ${counts.lessons} lessons, ${counts.assets} assets.`);
}
