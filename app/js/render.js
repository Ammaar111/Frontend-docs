// Small DOM helpers. Lesson text is inserted with textContent, never innerHTML,
// so nothing in a lesson or a learner's code can inject markup.

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') {
      node.className = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2), value);
    } else if (key in node && typeof value !== 'string') {
      node[key] = value;
    } else {
      node.setAttribute(key, value);
    }
  }

  node.append(
    ...children
      .flat()
      .filter((child) => child !== null && child !== undefined && child !== false)
      .map((child) => (typeof child === 'string' ? document.createTextNode(child) : child)),
  );
  return node;
}

// Text segments between backticks become <code>.
export function inline(text) {
  return text.split('`').map((part, index) => (index % 2 === 1 ? el('code', {}, part) : part));
}

// Lesson blocks: a string is a paragraph, { code } a code block,
// { list } a bullet list, { tip } and { warn } callouts.
export function renderBlocks(blocks) {
  return blocks.map((block) => {
    if (typeof block === 'string') return el('p', {}, inline(block));
    if (block.code !== undefined) {
      return el('pre', { tabindex: '0' }, el('code', {}, block.code));
    }
    if (block.list) {
      return el('ul', {}, block.list.map((item) => el('li', {}, inline(item))));
    }
    if (block.tip) {
      return el('aside', { class: 'callout tip' }, el('strong', {}, 'Tip. '), inline(block.tip));
    }
    if (block.warn) {
      return el('aside', { class: 'callout warn' }, el('strong', {}, 'Common mistake. '), inline(block.warn));
    }
    return el('p', {}, '');
  });
}
