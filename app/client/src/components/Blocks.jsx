import { Fragment } from 'react';
import CodeBlock from './CodeBlock.jsx';

// Inline formatting inside lesson text: `code`, **bold**, *emphasis*.
// Parsed into React elements; lesson text is never inserted as HTML.
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;

export function Inline({ text }) {
  const parts = String(text).split(INLINE);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function Block({ block, defaultLang }) {
  if (typeof block === 'string') {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }
  if (block.code !== undefined) return <CodeBlock code={block.code} lang={block.lang ?? defaultLang} caption={block.caption} />;
  if (block.output !== undefined) {
    return (
      <figure className="code-block code-block--output">
        <figcaption>Output</figcaption>
        <pre tabIndex={0}>
          <code>{block.output}</code>
        </pre>
      </figure>
    );
  }
  if (block.h) return <h3>{block.h}</h3>;
  if (block.list || block.ol) {
    const items = (block.list ?? block.ol).map((item, index) => (
      <li key={index}>
        <Inline text={item} />
      </li>
    ));
    return block.ol ? <ol>{items}</ol> : <ul>{items}</ul>;
  }
  if (block.tip || block.warn || block.note) {
    const kind = block.tip ? 'tip' : block.warn ? 'warn' : 'note';
    const title = { tip: 'Tip', warn: 'Common mistake', note: 'Note' }[kind];
    return (
      <aside className={`callout callout--${kind}`}>
        <strong className="callout__title">{block.title ?? title}</strong>
        <p>
          <Inline text={block[kind]} />
        </p>
      </aside>
    );
  }
  if (block.table) {
    return (
      <div className="table-wrap" tabIndex={0} role="region" aria-label={block.caption ?? 'Table'}>
        <table className="data-table">
          {block.caption && <caption>{block.caption}</caption>}
          <thead>
            <tr>
              {block.table.head.map((cell, index) => (
                <th key={index} scope="col">
                  <Inline text={cell} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, index) => (
                  <td key={index}>
                    <Inline text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.img) {
    return (
      <figure className="figure">
        <img src={`/api/assets/${encodeURIComponent(block.img)}`} alt={block.alt} loading="lazy" />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  }
  return null;
}

export default function Blocks({ blocks, lang }) {
  return blocks.map((block, index) => <Block key={index} block={block} defaultLang={lang} />);
}
