/**
 * Console Migration Codemod
 * Transforms console.* to logger.*:
 *   console.log   -> logger.dev
 *   console.error -> logger.error
 *   console.warn  -> logger.warn
 *   console.info  -> logger.info
 *   console.debug -> logger.debug
 *
 * Automatically adds import { logger } from '@/lib/logger' if not present.
 * Usage: npx jscodeshift -t scripts/codemods/console-migration.js --write app components lib hooks
 */

const CONSOLE_TO_LOGGER = {
  log: 'dev',
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
};

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Skip excluded files (ignore-pattern handles test files; this catches lib/logger, scripts)
  const filePath = fileInfo.path;
  if (
    filePath.includes('lib/logger.ts') ||
    filePath.includes('lib/logger.js') ||
    filePath.includes('scripts/cleanup/') ||
    filePath.includes('scripts/cleanup.js') ||
    filePath.includes('scripts/check-file-sizes.js') ||
    filePath.includes('scripts/protect-curbos')
  ) {
    return fileInfo.source;
  }

  let hasChanges = false;

  // Find console.log, console.error, etc. calls
  root
    .find(j.CallExpression)
    .filter(path => {
      const callee = path.value.callee;
      return (
        j.MemberExpression.check(callee) &&
        j.Identifier.check(callee.object) &&
        callee.object.name === 'console' &&
        j.Identifier.check(callee.property) &&
        Object.prototype.hasOwnProperty.call(CONSOLE_TO_LOGGER, callee.property.name)
      );
    })
    .forEach(path => {
      const method = path.value.callee.property.name;
      const loggerMethod = CONSOLE_TO_LOGGER[method];

      j(path).replaceWith(
        j.callExpression(
          j.memberExpression(j.identifier('logger'), j.identifier(loggerMethod)),
          path.value.arguments,
        ),
      );
      hasChanges = true;
    });

  if (!hasChanges) {
    return fileInfo.source;
  }

  // Add logger import if not present
  const hasLoggerImport = root.find(j.ImportDeclaration).some(impPath => {
    const node = impPath.value;
    return (
      node.source.value === '@/lib/logger' &&
      node.specifiers.some(s => s.type === 'ImportSpecifier' && s.imported?.name === 'logger')
    );
  });

  if (!hasLoggerImport) {
    const loggerImport = j.importDeclaration(
      [j.importSpecifier(j.identifier('logger'))],
      j.literal('@/lib/logger'),
    );

    const lastImport = root.find(j.ImportDeclaration).at(-1);
    if (lastImport.length) {
      lastImport.insertAfter(loggerImport);
    } else {
      root.get().node.program.body.unshift(loggerImport);
    }
  }

  return root.toSource({ quote: 'single', trailingComma: true });
};
