/**
 * Color Migration Codemod
 * Migrates hardcoded colors to CSS variables for theme support:
 * - bg-[#1f1f1f], bg-[#2a2a2a] → bg-[var(--surface)], bg-[var(--muted)]
 * - border-[#2a2a2a] → border-[var(--border)]
 * - text-gray-400, text-gray-500 → text-[var(--foreground-muted)], text-[var(--foreground-subtle)]
 * - text-white → text-[var(--foreground)]
 * - text-gray-300 → text-[var(--foreground-secondary)]
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift.withParser('tsx');
  const root = j(file.source);
  let hasChanges = false;
  let replacementCount = 0;

  // Color mapping - order matters (more specific patterns first)
  const colorMap = {
    // Background colors with opacity (must come before exact matches)
    'bg-[#1f1f1f]/': 'bg-[var(--surface)]/',
    'bg-[#2a2a2a]/': 'bg-[var(--muted)]/',
    'bg-[#3a3a3a]/': 'bg-[var(--surface-variant)]/',
    'bg-[#0a0a0a]/': 'bg-[var(--background)]/',

    // Background colors exact
    'bg-[#0a0a0a]': 'bg-[var(--background)]',
    'bg-[#1f1f1f]': 'bg-[var(--surface)]',
    'bg-[#2a2a2a]': 'bg-[var(--muted)]',
    'bg-[#3a3a3a]': 'bg-[var(--surface-variant)]',
    'bg-black': 'bg-[var(--background)]',

    // Border colors with opacity
    'border-[#2a2a2a]/': 'border-[var(--border)]/',
    'border-[#3a3a3a]/': 'border-[var(--border)]/',

    // Border colors exact
    'border-[#2a2a2a]': 'border-[var(--border)]',
    'border-[#3a3a3a]': 'border-[var(--border)]',

    // Text colors with opacity
    'text-white/': 'text-[var(--foreground)]/',
    'text-gray-300/': 'text-[var(--foreground-secondary)]/',
    'text-gray-400/': 'text-[var(--foreground-muted)]/',
    'text-gray-500/': 'text-[var(--foreground-subtle)]/',

    // Text colors exact
    'text-white': 'text-[var(--foreground)]',
    'text-gray-300': 'text-[var(--foreground-secondary)]',
    'text-gray-400': 'text-[var(--foreground-muted)]',
    'text-gray-500': 'text-[var(--foreground-subtle)]',
  };

  /**
   * Replace colors in a string
   */
  function replaceColors(str) {
    let newStr = str;
    let count = 0;

    // Sort by length (longest first) to avoid partial matches
    const sortedEntries = Object.entries(colorMap).sort((a, b) => b[0].length - a[0].length);

    for (const [old, replacement] of sortedEntries) {
      // Handle patterns that end with / (for opacity variants)
      if (old.endsWith('/')) {
        // Match the pattern followed by digits (opacity value)
        const basePattern = old.slice(0, -1); // Remove trailing /
        const regex = new RegExp(
          basePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/(\\d+)',
          'g'
        );
        const matches = newStr.match(regex);
        if (matches) {
          count += matches.length;
          newStr = newStr.replace(regex, (match, opacity) => {
            return replacement.slice(0, -1) + '/' + opacity;
          });
        }
      } else {
        // Exact match for patterns without trailing /
        // Use word boundary or ensure not followed by /
        const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('\\b' + escaped + '(?!/)', 'g');
        const matches = newStr.match(regex);
        if (matches) {
          count += matches.length;
          newStr = newStr.replace(regex, replacement);
        }
      }
    }

    return { newStr, count };
  }

  // Transform string literals in JSX attributes (className, etc.)
  root
    .find(j.JSXAttribute, {
      name: { name: 'className' },
    })
    .forEach(path => {
      const value = path.node.value;

      // Handle string literals: className="bg-[#1f1f1f]"
      if (value.type === 'Literal' && typeof value.value === 'string') {
        const { newStr, count } = replaceColors(value.value);
        if (count > 0) {
          value.value = newStr;
          hasChanges = true;
          replacementCount += count;
        }
      }

      // Handle JSXExpressionContainer with template literals: className={`bg-[#1f1f1f] ${var}`}
      if (value.type === 'JSXExpressionContainer') {
        const expression = value.expression;

        // Template literal
        if (expression.type === 'TemplateLiteral') {
          expression.quasis.forEach(quasi => {
            if (quasi.value && typeof quasi.value.raw === 'string') {
              const { newStr, count } = replaceColors(quasi.value.raw);
              if (count > 0) {
                quasi.value.raw = newStr;
                quasi.value.cooked = newStr;
                hasChanges = true;
                replacementCount += count;
              }
            }
          });
        }

        // String literal in expression
        if (expression.type === 'Literal' && typeof expression.value === 'string') {
          const { newStr, count } = replaceColors(expression.value);
          if (count > 0) {
            expression.value = newStr;
            hasChanges = true;
            replacementCount += count;
          }
        }
      }
    });

  // Transform string literals in object properties (className: "bg-[#1f1f1f]")
  root
    .find(j.ObjectProperty, {
      key: { name: 'className' },
    })
    .forEach(path => {
      const value = path.node.value;
      if (value.type === 'Literal' && typeof value.value === 'string') {
        const { newStr, count } = replaceColors(value.value);
        if (count > 0) {
          value.value = newStr;
          hasChanges = true;
          replacementCount += count;
        }
      }
    });

  // Transform template literals used in className assignments
  root.find(j.AssignmentExpression).forEach(path => {
    const left = path.node.left;
    const right = path.node.right;

    // Check if assigning to className property
    if (left.type === 'MemberExpression' && left.property && left.property.name === 'className') {
      // Handle string literals
      if (right.type === 'Literal' && typeof right.value === 'string') {
        const { newStr, count } = replaceColors(right.value);
        if (count > 0) {
          right.value = newStr;
          hasChanges = true;
          replacementCount += count;
        }
      }

      // Handle template literals
      if (right.type === 'TemplateLiteral') {
        right.quasis.forEach(quasi => {
          if (quasi.value && typeof quasi.value.raw === 'string') {
            const { newStr, count } = replaceColors(quasi.value.raw);
            if (count > 0) {
              quasi.value.raw = newStr;
              quasi.value.cooked = newStr;
              hasChanges = true;
              replacementCount += count;
            }
          }
        });
      }
    }
  });

  if (hasChanges) {
    return root.toSource({
      quote: 'single',
      trailingComma: true,
      lineTerminator: '\n',
    });
  }

  return null;
};
