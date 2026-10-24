// Browser test: drives the real page in Chromium. It types each reference
// solution into the editor, clicks "Run and grade", and checks the score.
// Also checks a starter (should not score 10), an infinite loop (should time
// out with a readable mistake), and that attempts are recorded in History.
//
// Usage (from the app folder, with the app already being served):
//   APP_URL=http://127.0.0.1:8765 node tests/e2e.cjs
const { chromium } = require('playwright');

const BASE = process.env.APP_URL || 'http://127.0.0.1:8765';


// Clicks "Run and grade" and waits for a new History row, so a score left over
// from an earlier attempt is never mistaken for this one.
async function runAndRead(page) {
  const before = await page.$$eval(".history tbody tr", (rows) => rows.length);
  await page.click("button.primary");
  await page.waitForFunction(
    (count) => document.querySelectorAll(".history tbody tr").length > count,
    before,
    { timeout: 10000 },
  );
  const score = await page.$eval(".score", (node) => node.dataset.score);
  const mistakes = await page.$$eval(".mistakes li", (items) => items.map((item) => item.textContent));
  return { score, mistakes };
}

async function main() {
  const { lessons } = await import('../lessons/index.js');
  const { solutions } = await import('./solutions.js');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };

  // Lesson-by-lesson: solution must score 10/10 through the UI.
  for (const lesson of lessons) {
    await page.goto(`${BASE}/#${lesson.id}`);
    await page.waitForSelector('#code');
    await page.fill('#code', solutions[lesson.id]);
    const { score, mistakes } = await runAndRead(page);
    check(score === '10', `${lesson.id}: solution scored ${score}. Mistakes: ${mistakes.join(' | ')}`);
    console.log(`${score === '10' ? 'PASS' : 'FAIL'}  ${lesson.id}  ${score}/10`);
  }

  // Starter code must not already pass.
  const starterLesson = lessons[0];
  await page.goto(`${BASE}/#${starterLesson.id}`);
  await page.waitForSelector('#code');
  page.once('dialog', (dialog) => dialog.accept());
  await page.click('button:has-text("Reset to starter")');
  const { score: starterScore } = await runAndRead(page);
  check(starterScore !== '10', `starter for ${starterLesson.id} scored 10`);

  // Infinite loop: must time out with a readable mistake, not freeze the page.
  await page.fill('#code', 'while (true) {}');
  const { mistakes: loopMistakes } = await runAndRead(page);
  const loopMistake = loopMistakes.join(" | ");
  check(/more than 2 seconds/.test(loopMistake), `infinite loop message missing: ${loopMistake}`);

  // Attempts are recorded: the History table should now have rows for this lesson.
  const historyRows = await page.$$eval('.history tbody tr', (rows) => rows.length);
  check(historyRows >= 2, `expected at least 2 history rows, found ${historyRows}`);

  // Sidebar reflects progress.
  const progress = await page.textContent('.progress');
  check(/lessons passed/.test(progress), `progress line missing: ${progress}`);

  // Ctrl+Enter runs the code.
  await page.fill('#code', solutions[starterLesson.id]);
  const historyBefore = await page.$$eval(".history tbody tr", (rows) => rows.length);
  await page.focus('#code');
  await page.keyboard.press('Control+Enter');
  await page.waitForFunction(
    (count) => document.querySelectorAll(".history tbody tr").length > count,
    historyBefore,
    { timeout: 10000 },
  );
  const ctrlEnterScore = await page.$eval(".score", (node) => node.dataset.score);
  check(ctrlEnterScore === "10", 'Ctrl+Enter did not grade the solution');

  // Drafts survive a reload.
  await page.fill('#code', 'const draftCheck = 1;');
  await page.waitForTimeout(500);
  await page.reload();
  await page.waitForSelector('#code');
  const restored = await page.inputValue('#code');
  check(restored === 'const draftCheck = 1;', 'draft was not restored after reload');

  check(pageErrors.length === 0, `uncaught page errors: ${pageErrors.join(' | ')}`);

  await browser.close();

  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`\nAll ${lessons.length} lessons pass through the UI.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
