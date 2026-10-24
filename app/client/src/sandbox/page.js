// Page lessons: a fixture page (HTML and CSS from the lesson), plus the
// learner's JavaScript, CSS or HTML. Checks then inspect the live page:
// computed styles, layout boxes, and how it reacts to clicks and typing.
import {
  addStyle,
  compileProgram,
  createState,
  describeFatal,
  domHelpers,
  installEnvironment,
  newGuard,
  runChecks,
  settle,
} from './harness.js';

export async function runPageJob(job) {
  const { config, code, checks } = job;
  const fixture = config.fixture ?? {};
  const state = createState();
  const guard = newGuard();
  installEnvironment(state);

  if (fixture.css) addStyle(fixture.css, 'fixture');

  let doc = document;
  if (config.slot === 'html') {
    // The learner wrote the page. Scripts inside it do not run.
    doc = new DOMParser().parseFromString(code, 'text/html');
    document.documentElement.lang = doc.documentElement.lang;
    document.title = doc.title;
    for (const style of doc.querySelectorAll('style')) addStyle(style.textContent, 'learner');
    document.body.innerHTML = doc.body.innerHTML;
  } else {
    document.body.innerHTML = fixture.html ?? '';
  }
  if (config.slot === 'css') addStyle(code, 'learner');

  let exposed = {};
  if (config.slot === 'js') {
    try {
      const program = compileProgram(code, {
        prelude: { console: state.console },
        setup: config.setup ?? '',
        expose: config.expose ?? [],
      });
      guard.arm();
      exposed = await program(guard);
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      await settle();
    } catch (err) {
      return { fatal: describeFatal(err, guard), logs: state.logs };
    }
  }

  const ctx = {
    ...domHelpers(),
    document,
    window,
    doc,
    exposed,
    logs: state.logs,
    alerts: state.alerts,
    submits: state.submits,
    navigations: state.navigations,
    errors: state.errors,
    storage: window.localStorage,
    session: window.sessionStorage,
    source: code,
    state,
  };
  const results = await runChecks(checks, async () => ctx, { guard, state });
  return { results, logs: state.logs };
}
