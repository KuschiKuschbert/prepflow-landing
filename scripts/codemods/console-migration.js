/**
 * Console Migration Codemod
 * Migrates console.* calls to logger.* methods:
 * - console.log(...) → logger.dev(...)
 * - console.error(...) → logger.error(...)
 * - console.warn(...) → logger.warn(...)
 * - console.info(...) → logger.info(...)
 * - console.debug(...) → logger.debug(...)
 *
 * Also adds logger import if not present.
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift.withParser('tsx');
  const root = j(file.source);
  let hasChanges = false;
  let replacementCount = 0;
  let needsLoggerImport = false;

  // Console to logger mapping
  const consoleToLogger = {
    log: 'dev',
    error: 'error',
    warn: 'warn',
    info: 'info',
    debug: 'debug',
  };

  // Check if logger is already imported
  let hasLoggerImport = false;
  root.find(j.ImportDeclaration).forEach(path => {
    const source = path.node.source.value;
    // Check various import path patterns
    if (
      source === '@/lib/logger' ||
      source === '../lib/logger' ||
      source === '../../lib/logger' ||
      source === '../../../lib/logger' ||
      source.endsWith('/lib/logger')
    ) {
      path.node.specifiers.forEach(spec => {
        if (spec.type === 'ImportSpecifier' && spec.imported.name === 'logger') {
          hasLoggerImport = true;
        }
        if (spec.type === 'ImportDefaultSpecifier' && spec.local.name === 'logger') {
          hasLoggerImport = true;
        }
      });
    }
  });

  // Transform console.* CallExpressions
  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: { name: 'console' },
        property: { name: name => Object.keys(consoleToLogger).includes(name) },
      },
    })
    .forEach(path => {
      const callExpr = path.value;
      const methodName = callExpr.callee.property.name;
      const loggerMethod = consoleToLogger[methodName];

      // Replace console.method with logger.method
      callExpr.callee.object = j.identifier('logger');
      callExpr.callee.property = j.identifier(loggerMethod);

      hasChanges = true;
      replacementCount++;
      needsLoggerImport = true;
    });

  // Add logger import if needed
  if (needsLoggerImport && !hasLoggerImport) {
    const importStatement = j.importDeclaration(
      [j.importSpecifier(j.identifier('logger'))],
      j.literal('@/lib/logger'),
    );

    // Find the last import statement or add at the top
    const imports = root.find(j.ImportDeclaration);
    if (imports.length > 0) {
      // Insert after the last import
      imports.at(-1).insertAfter(importStatement);
    } else {
      // Insert at the beginning of the program
      const program = root.get().value.program;
      if (program && program.body) {
        program.body.unshift(importStatement);
      }
    }
    hasChanges = true;
  }

  if (hasChanges) {
    return root.toSource({
      quote: 'single',
      trailingComma: true,
      lineTerminator: '\n',
    });
  }

  return null;
};
