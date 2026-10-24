// Browser test: drives the real app in Chromium. For every lesson in the
// course it types the reference solution into the editor (or picks the
// right quiz answers), runs it, and expects 10/10. It also checks that the
// starter code does not already pass, that an infinite loop is stopped, and
// that drafts survive a reload.
//
// Start the app first (npm run build && npm start), then:
//   APP_URL=http://127.0.0.1:3000 npm run test:e2e
//   ONLY=js-closures,react-state  npm run test:e2e   (lesson ids or prefixes)
import { createRequire } from 'node:module';
import { loadCourse, flatten } from '../server/content.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.APP_URL || 'http://127.0.0.1:3000';
const ONLY = (process.env.ONLY || '').split(',').map((item) => item.trim()).filter(Boolean);
const STARTERS = process.env.STARTERS !== '0';

async function setEditor(page, code) {
  await page.waitForSelector('[data-testid="code-editor"] .cm-content');
  await page.evaluate((text) => {
    const view = document.querySelector('[data-testid="code-editor"]').editorView;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
  }, code);
}

// Clicks the run button and waits for a new History row, so a score left
// over from an earlier attempt is never mistaken for this one.
async function runAndRead(page, buttonText = 'Run and grade') {
  const before = await page.$$eval('.history tbody tr', (rows) => rows.length).catch(() => 0);
  await page.click(`button:has-text("${buttonText}")`);
  await page.waitForFunction(
    (count) => document.querySelectorAll('.history tbody tr').length > count && !document.querySelector('[role="status"]')?.textContent?.includes('Running'),
    before,
    { timeout: 30000 },
  );
  await page.waitForSelector('.score');
  const score = await page.$eval('.score', (node) => node.dataset.score);
  const mistakes = await page.$$eval('.mistakes li', (items) => items.map((item) => item.textContent));
  return { score, mistakes };
}

async function answerQuiz(page, answers) {
  const groups = await page.$$('.quiz__question');
  for (let i = 0; i < groups.length; i += 1) {
    const options = await groups[i].$$('input[type="radio"]');
    await options[answers[i]].check();
  }
}

async function main() {
  const course = flatten(await loadCourse());
  const selected = ONLY.length ? course.filter(({ lesson }) => ONLY.some((prefix) => lesson.id.startsWith(prefix))) : course;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('dialog', (dialog) => dialog.accept());

  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };

  for (const { lesson } of selected) {
    await page.goto(`${BASE}/lesson/${lesson.id}`);
    await page.waitForSelector('#lesson-title');

    if (lesson.runner === 'quiz') {
      await answerQuiz(page, lesson.questions.map(() => 0));
      const wrong = await runAndRead(page, 'Submit answers');
      const allFirst = lesson.questions.every((question) => question.answer === 0);
      check(allFirst || wrong.score !== '10', `${lesson.id}: picking the first option everywhere scored 10`);
      await answerQuiz(page, lesson.questions.map((question) => question.answer));
      const { score, mistakes } = await runAndRead(page, 'Submit answers');
      check(score === '10', `${lesson.id}: correct answers scored ${score}. ${mistakes.join(' | ')}`);
      console.log(`${score === '10' ? 'PASS' : 'FAIL'}  ${lesson.id}  ${score}/10`);
      continue;
    }

    if (STARTERS) {
      await setEditor(page, lesson.starter);
      const starter = await runAndRead(page);
      check(starter.score !== '10', `${lesson.id}: the starter code already scores 10`);
    }

    await setEditor(page, lesson.solution);
    const { score, mistakes } = await runAndRead(page);
    check(score === '10', `${lesson.id}: solution scored ${score}. Mistakes: ${mistakes.join(' | ')}`);
    console.log(`${score === '10' ? 'PASS' : 'FAIL'}  ${lesson.id}  ${score}/10${score === '10' ? '' : `  ${mistakes.join(' | ')}`}`);
  }

  if (!ONLY.length) {
    // An infinite loop in a JavaScript lesson stops with a readable mistake.
    const jsLesson = course.find(({ lesson }) => lesson.runner === 'js').lesson;
    await page.goto(`${BASE}/lesson/${jsLesson.id}`);
    await setEditor(page, 'while (true) {}');
    const loop = await runAndRead(page);
    check(loop.score === '0' && /more than \d+ seconds/.test(loop.mistakes.join(' ')), `worker infinite loop: ${loop.mistakes.join(' | ')}`);

    // An infinite loop in a page lesson is stopped by the loop guard.
    const pageLesson = course.find(({ lesson }) => lesson.runner === 'page' && lesson.slot === 'js')?.lesson;
    if (pageLesson) {
      await page.goto(`${BASE}/lesson/${pageLesson.id}`);
      await setEditor(page, 'let i = 0;\nwhile (true) { i++; }');
      const started = Date.now();
      const frameLoop = await runAndRead(page);
      check(/loop ran for more than/.test(frameLoop.mistakes.join(' ')), `iframe infinite loop: ${frameLoop.mistakes.join(' | ')}`);
      check(Date.now() - started < 9000, 'iframe infinite loop took too long to stop');
    }

    // Ctrl+Enter runs the code; drafts survive a reload.
    await page.goto(`${BASE}/lesson/${jsLesson.id}`);
    await setEditor(page, jsLesson.solution);
    const rows = await page.$$eval('.history tbody tr', (items) => items.length);
    await page.click('[data-testid="code-editor"] .cm-content');
    await page.keyboard.press('Control+Enter');
    await page.waitForFunction((count) => document.querySelectorAll('.history tbody tr').length > count, rows, { timeout: 10000 });
    check((await page.$eval('.score', (node) => node.dataset.score)) === '10', 'Ctrl+Enter did not grade the solution');

    await setEditor(page, '// draft check');
    await page.waitForSelector('.draft-state--saved', { timeout: 5000 });
    await page.reload();
    await page.waitForSelector('[data-testid="code-editor"] .cm-content');
    const restored = await page.evaluate(() => document.querySelector('[data-testid="code-editor"]').editorView.state.doc.toString());
    check(restored === '// draft check', `draft was not restored after reload: ${restored}`);
    await setEditor(page, jsLesson.starter);
    await page.waitForSelector('.draft-state--saved', { timeout: 5000 });

    // The other pages render.
    for (const path of ['/', '/track/javascript', '/progress', '/search?q=array', '/nowhere']) {
      await page.goto(`${BASE}${path}`);
      await page.waitForSelector('h1');
    }
  }

  check(pageErrors.length === 0, `uncaught page errors: ${pageErrors.join(' | ')}`);
  await browser.close();

  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`\nAll ${selected.length} lessons pass through the UI.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
