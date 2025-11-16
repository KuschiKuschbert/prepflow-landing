/**
 * Breakpoint Migration Codemod
 * Migrates standard Tailwind breakpoints to custom breakpoints:
 * - sm: → tablet:
 * - md: → tablet:
 * - lg: → desktop:
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift.withParser('tsx');
  const root = j(file.source);
  let hasChanges = false;
  let replacementCount = 0;

  // Breakpoint mapping
  const breakpointMap = {
    'sm:': 'tablet:',
    'md:': 'tablet:',
    'lg:': 'desktop:',
  };

  /**
   * Replace breakpoints in a string
   */
  function replaceBreakpoints(str) {
    let newStr = str;
    let count = 0;

    for (const [old, replacement] of Object.entries(breakpointMap)) {
      const regex = new RegExp(`\\b${old.replace(':', '\\:')}`, 'g');
      const matches = newStr.match(regex);
      if (matches) {
        count += matches.length;
        newStr = newStr.replace(regex, replacement);
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

      // Handle string literals: className="sm:text-lg"
      if (value.type === 'Literal' && typeof value.value === 'string') {
        const { newStr, count } = replaceBreakpoints(value.value);
        if (count > 0) {
          value.value = newStr;
          hasChanges = true;
          replacementCount += count;
        }
      }

      // Handle JSXExpressionContainer with template literals: className={`sm:text-lg ${var}`}
      if (value.type === 'JSXExpressionContainer') {
        const expression = value.expression;

        // Template literal
        if (expression.type === 'TemplateLiteral') {
          expression.quasis.forEach(quasi => {
            if (quasi.value && typeof quasi.value.raw === 'string') {
              const { newStr, count } = replaceBreakpoints(quasi.value.raw);
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
          const { newStr, count } = replaceBreakpoints(expression.value);
          if (count > 0) {
            expression.value = newStr;
            hasChanges = true;
            replacementCount += count;
          }
        }
      }
    });

  // Transform string literals in object properties (className: "sm:text-lg")
  root
    .find(j.ObjectProperty, {
      key: { name: 'className' },
    })
    .forEach(path => {
      const value = path.node.value;
      if (value.type === 'Literal' && typeof value.value === 'string') {
        const { newStr, count } = replaceBreakpoints(value.value);
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
        const { newStr, count } = replaceBreakpoints(right.value);
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
            const { newStr, count } = replaceBreakpoints(quasi.value.raw);
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

  // Transform string concatenations with className
  root
    .find(j.BinaryExpression, {
      operator: '+',
    })
    .forEach(path => {
      // Check both sides for string literals
      [path.node.left, path.node.right].forEach(node => {
        if (node.type === 'Literal' && typeof node.value === 'string') {
          const { newStr, count } = replaceBreakpoints(node.value);
          if (count > 0) {
            node.value = newStr;
            hasChanges = true;
            replacementCount += count;
          }
        }
      });
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
