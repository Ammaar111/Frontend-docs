// Runs DOM and React lessons inside a sandboxed iframe.
//
// The iframe has sandbox="allow-scripts" and no allow-same-origin, so its
// origin is opaque: the learner's code cannot read this page, its storage
// or its cookies. Loops in the learner's code are instrumented in the
// iframe to stop after a time limit, and if the iframe still does not
// answer in time, it is removed.
export const FRAME_TIME_LIMIT_MS = 8000;
const LOAD_TIME_LIMIT_MS = 15000;

export function runInFrame(job) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.title = 'Code sandbox';
    iframe.className = 'sandbox-frame';
    iframe.style.width = `${job.config.viewport?.width ?? 1024}px`;
    iframe.style.height = `${job.config.viewport?.height ?? 768}px`;

    let timer;
    const finish = (outcome) => {
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      iframe.remove();
      resolve(outcome);
    };
    const startTimer = (ms, message) => {
      clearTimeout(timer);
      timer = setTimeout(() => finish({ fatal: message }), ms);
    };

    function onMessage(event) {
      if (event.source !== iframe.contentWindow || !event.data) return;
      if (event.data.type === 'ready') {
        startTimer(
          FRAME_TIME_LIMIT_MS,
          `it ran for more than ${FRAME_TIME_LIMIT_MS / 1000} seconds. Look for a loop or a promise that never finishes.`,
        );
        // The iframe's origin is opaque, so '*' is the only target that reaches it.
        iframe.contentWindow.postMessage({ type: 'run', job }, '*');
      } else if (event.data.type === 'result') {
        finish(event.data.outcome);
      }
    }

    window.addEventListener('message', onMessage);
    startTimer(LOAD_TIME_LIMIT_MS, 'the code sandbox did not load. Reload the page and try again.');
    iframe.src = `${import.meta.env.BASE_URL}sandbox.html`;
    document.body.append(iframe);
  });
}
