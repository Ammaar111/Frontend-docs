// Starts the API. The course is reseeded from content/ on every start, so
// editing a lesson file and restarting is enough to see the change.
import { openDatabase } from './db.js';
import { seed } from './seed.js';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const db = openDatabase();
const counts = await seed(db);
const app = createApp(db, { serveClient: true });

const server = app.listen(PORT, HOST, () => {
  console.log(`Frontend Lab API on http://${HOST}:${PORT} (${counts.lessons} lessons)`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
