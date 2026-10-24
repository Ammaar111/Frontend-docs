import { useEffect, useState } from 'react';

const PREVIEW_DELAY_MS = 400;

// Which lessons get a live preview: anything whose code is HTML or CSS.
// JavaScript page lessons are left out, because the preview never runs scripts.
export function hasPreview(lesson) {
  if (lesson.runner === 'html' || lesson.runner === 'css') return true;
  return lesson.runner === 'page' && (lesson.config.slot === 'html' || lesson.config.slot === 'css');
}

function escapeStyle(css) {
  return css.replace(/<\/style/gi, '<\\/style');
}

function buildDocument(lesson, code) {
  const fixture = lesson.config.fixture ?? {};
  const fixtureStyle = fixture.css ? `<style>${escapeStyle(fixture.css)}</style>` : '';
  const isHtml = lesson.runner === 'html' || lesson.config.slot === 'html';
  if (isHtml) {
    // Put the lesson's own CSS first, so the learner's styles can override it.
    if (/<head[\s>]/i.test(code)) return code.replace(/<head([^>]*)>/i, `<head$1>${fixtureStyle}`);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">${fixtureStyle}</head><body>${code}</body></html>`;
  }
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">${fixtureStyle}<style>${escapeStyle(code)}</style></head><body>${fixture.html ?? ''}</body></html>`;
}

// A sandboxed frame with no permissions: scripts, forms and popups are all
// blocked, so the preview shows structure and styles only.
export default function Preview({ lesson, code }) {
  const [doc, setDoc] = useState(() => buildDocument(lesson, code));

  useEffect(() => {
    const timer = setTimeout(() => setDoc(buildDocument(lesson, code)), PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [lesson, code]);

  return (
    <figure className="preview">
      <figcaption>
        Live preview <span className="muted">(updates as you type; scripts do not run here)</span>
      </figcaption>
      <iframe title="Live preview of your code" sandbox="" srcDoc={doc} className="preview__frame" />
    </figure>
  );
}
