import { useMemo } from 'react';
import { highlightCode, classHighlighter } from '@lezer/highlight';
import { javascriptLanguage, jsxLanguage, typescriptLanguage } from '@codemirror/lang-javascript';
import { htmlLanguage } from '@codemirror/lang-html';
import { cssLanguage } from '@codemirror/lang-css';

const PARSERS = {
  js: javascriptLanguage.parser,
  javascript: javascriptLanguage.parser,
  json: javascriptLanguage.parser,
  jsx: jsxLanguage.parser,
  ts: typescriptLanguage.parser,
  tsx: typescriptLanguage.parser,
  html: htmlLanguage.parser,
  css: cssLanguage.parser,
};

// Splits code into highlighted spans. Rendered as React elements, never as HTML.
function tokenize(code, lang) {
  const parser = PARSERS[lang];
  if (!parser) return [[{ text: code, cls: '' }]];
  const lines = [[]];
  highlightCode(
    code,
    parser.parse(code),
    classHighlighter,
    (text, cls) => lines[lines.length - 1].push({ text, cls }),
    () => lines.push([]),
  );
  return lines;
}

export default function CodeBlock({ code, lang = 'js', caption }) {
  const lines = useMemo(() => tokenize(code, lang), [code, lang]);
  return (
    <figure className="code-block">
      {caption && <figcaption>{caption}</figcaption>}
      <pre tabIndex={0} aria-label={caption ? undefined : `${lang.toUpperCase()} code`}>
        <code>
          {lines.map((line, index) => (
            <span key={index} className="code-line">
              {line.map((token, tokenIndex) =>
                token.cls ? (
                  <span key={tokenIndex} className={token.cls}>
                    {token.text}
                  </span>
                ) : (
                  token.text
                ),
              )}
              {index < lines.length - 1 ? '\n' : ''}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
