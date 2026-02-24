/**
 * Breakpoint Migration Codemod
 * Transforms rogue Tailwind breakpoints to PrepFlow custom breakpoints:
 *   sm: -> tablet:
 *   md: -> tablet:
 *   lg: -> desktop:
 *
 * ONLY targets Tailwind class strings in:
 *   - JSX className="..." or class="..."
 *   - JSX className={`...`} template literals
 *   - String literals in style/config objects (values, not keys)
 *
 * Does NOT replace object keys like { sm: '...', md: '...', lg: '...' } (size variants).
 *
 * Usage: npx jscodeshift -t scripts/codemods/breakpoint-migration.js --parser tsx app components lib
 */

const REPLACEMENTS = [
  [/\bsm:/g, 'tablet:'],
  [/\bmd:/g, 'tablet:'],
  [/\blg:/g, 'desktop:'],
];

function transformClassString(str) {
  if (typeof str !== 'string' || !/\b(sm|md|lg):/.test(str)) return str;
  let result = str;
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function isClassAttribute(path) {
  let current = path.parentPath;
  while (current) {
    const node = current.value;
    if (node?.type === 'JSXAttribute') {
      const name = node.name?.name ?? node.name?.value;
      return name === 'className' || name === 'class';
    }
    if (node?.type === 'JSXExpressionContainer') {
      current = current.parentPath;
      continue;
    }
    break;
  }
  return false;
}

function isObjectPropertyValue(path) {
  const parent = path.parentPath?.value;
  // Property (babel) or ObjectProperty (flow/ts)
  if (!parent || (parent.type !== 'Property' && parent.type !== 'ObjectProperty')) return false;
  // Skip if we're the key (parent.key)
  if (path.parentPath?.name === 'key') return false;
  // We're the value - but avoid replacing when the KEY is sm/md/lg (size variant)
  const key = parent.key;
  const keyName = key?.name ?? key?.value;
  if (keyName === 'sm' || keyName === 'md' || keyName === 'lg') {
    return false; // Size variant: { sm: '...' } - don't treat value as breakpoint string
  }
  return true;
}

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  if (!/\.(tsx?|jsx?|css)$/.test(fileInfo.path)) {
    return fileInfo.source;
  }

  let hasChanges = false;

  // 1. JSX StringLiteral: className="sm:text-lg"
  root
    .find(j.Literal)
    .filter(path => {
      if (typeof path.value.value !== 'string') return false;
      if (!/\b(sm|md|lg):/.test(path.value.value)) return false;
      return isClassAttribute(path);
    })
    .forEach(path => {
      const newValue = transformClassString(path.value.value);
      if (newValue !== path.value.value) {
        path.value.value = newValue;
        hasChanges = true;
      }
    });

  // 2. JSX TemplateLiteral: className={`sm:text-lg ${x}`}
  root
    .find(j.TemplateLiteral)
    .filter(path => {
      const raw = path.value.quasis?.map(q => q.value?.raw ?? '').join('');
      if (!/\b(sm|md|lg):/.test(raw)) return false;
      return isClassAttribute(path);
    })
    .forEach(path => {
      path.value.quasis.forEach(quasi => {
        if (quasi.value?.raw) {
          const transformed = transformClassString(quasi.value.raw);
          if (transformed !== quasi.value.raw) {
            quasi.value.raw = transformed;
            quasi.value.cooked = transformed;
            hasChanges = true;
          }
        }
      });
    });

  // 3. Object property values (style configs): container: 'sm:px-6 lg:px-8'
  // Only when the key is NOT sm/md/lg (those are size variants)
  root
    .find(j.Literal)
    .filter(path => {
      if (typeof path.value.value !== 'string') return false;
      if (!/\b(sm|md|lg):/.test(path.value.value)) return false;
      return isObjectPropertyValue(path);
    })
    .forEach(path => {
      const newValue = transformClassString(path.value.value);
      if (newValue !== path.value.value) {
        path.value.value = newValue;
        hasChanges = true;
      }
    });

  return hasChanges ? root.toSource({ quote: 'single', trailingComma: true }) : fileInfo.source;
};
