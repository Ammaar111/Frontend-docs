// Helpers passed to check functions as `h`. Check functions are stored as
// text in the database, so they cannot import anything; whatever they need
// comes in through their argument.
//
// CSS helpers work on any CSSStyleSheet, parsed or live. They read declared
// values, normalized the way the browser normalizes them.

const normSelector = (selector) => selector.replace(/\s+/g, ' ').replace(/\s*([>+~,])\s*/g, '$1').trim();

export function styleRules(sheet) {
  return [...sheet.cssRules].filter((rule) => rule instanceof CSSStyleRule);
}

// Style rules inside @media blocks whose condition contains `query` (any if omitted).
export function mediaRules(sheet, query = '') {
  return [...sheet.cssRules]
    .filter((rule) => rule instanceof CSSMediaRule && rule.conditionText.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')))
    .flatMap((rule) => [...rule.cssRules].filter((inner) => inner instanceof CSSStyleRule));
}

// Style rules inside @container blocks.
export function containerRules(sheet, query = '') {
  return [...sheet.cssRules]
    .filter((rule) => typeof CSSContainerRule !== 'undefined' && rule instanceof CSSContainerRule && rule.conditionText.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')))
    .flatMap((rule) => [...rule.cssRules].filter((inner) => inner instanceof CSSStyleRule));
}

// Every rule of a given CSS rule class name, at any depth (e.g. 'CSSKeyframesRule').
export function allRules(sheet, typeName) {
  const out = [];
  const walk = (rules) => {
    for (const rule of rules) {
      if (!typeName || rule.constructor.name === typeName) out.push(rule);
      if (rule.cssRules) walk(rule.cssRules);
    }
  };
  walk(sheet.cssRules);
  return out;
}

export function rulesFor(rules, selector) {
  const wanted = normSelector(selector);
  return rules.filter((rule) => normSelector(rule.selectorText) === wanted);
}

// Last declared value of `prop` for exactly `selector`, as the cascade would pick
// between rules with the same selector. Pass `rules` to look inside @media.
export function declared(sheet, selector, prop, rules = styleRules(sheet)) {
  let value = '';
  for (const rule of rulesFor(rules, selector)) {
    const found = rule.style.getPropertyValue(prop);
    if (found) value = found.trim();
  }
  return value;
}

// What the browser turns a value into once parsed: white -> rgb(255, 255, 255).
export function normalize(prop, value) {
  const node = document.createElement('div');
  node.style.setProperty(prop, value);
  return node.style.getPropertyValue(prop);
}

// The computed value, from a hidden probe element: catches equal values the
// parser keeps in different forms (white vs #fff, 1rem vs 16px).
let probeHost = null;
function computed(prop, value) {
  if (!probeHost || !probeHost.isConnected) {
    probeHost = document.createElement('div');
    probeHost.setAttribute('aria-hidden', 'true');
    probeHost.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:400px;height:400px;left:-9999px;top:0;font-size:16px';
    document.body.append(probeHost);
  }
  const node = document.createElement('div');
  probeHost.append(node);
  node.style.setProperty(prop, value);
  const result = node.style.getPropertyValue(prop) ? getComputedStyle(node).getPropertyValue(prop) : '';
  node.remove();
  return result;
}

export function sameValue(prop, actual, expected) {
  if (!actual) return false;
  const wanted = normalize(prop, expected);
  if (wanted === '') return false;
  const got = normalize(prop, actual);
  if (got === wanted) return true;
  if (got === '') return false;
  const computedWanted = computed(prop, expected);
  return computedWanted !== '' && computed(prop, actual) === computedWanted;
}

export function is(sheet, selector, prop, expected, rules) {
  return sameValue(prop, declared(sheet, selector, prop, rules), expected);
}

export function hasRule(sheet, selector, rules = styleRules(sheet)) {
  return rulesFor(rules, selector).length > 0;
}

export function customProperty(sheet, selector, name) {
  return declared(sheet, selector, name).trim();
}

const text = (node) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();

export const helpers = {
  styleRules,
  mediaRules,
  containerRules,
  allRules,
  rulesFor,
  declared,
  normalize,
  sameValue,
  is,
  hasRule,
  customProperty,
  text,
};
