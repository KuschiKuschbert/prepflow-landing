import { API, FileInfo, Options, Transform } from 'jscodeshift';

/**
 * Codemod: Log Sanitization
 * Replaces console.log with standardized logger.info or removes them.
 */
const transform: Transform = (file: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  // 1. Check if logger is imported, if not, we'll need to add it if we use it
  const loggerImport = root.find(j.ImportDeclaration, {
    source: { value: '@/lib/logger' }
  });

  const consoleLogs = root.find(j.CallExpression, {
    callee: {
      object: { name: 'console' },
      property: { name: 'log' }
    }
  });

  if (consoleLogs.length > 0) {
    consoleLogs.forEach(path => {
      // For simplicity, we just replace with logger.info
      // In a real environment, we'd distinguish between log levels
      j(path).replaceWith(
        j.callExpression(
          j.memberExpression(j.identifier('logger'), j.identifier('info')),
          path.node.arguments
        )
      );
      changed = true;
    });

    // Add logger import if it doesn't exist and we made changes
    if (changed && loggerImport.length === 0) {
      const importDecl = j.importDeclaration(
        [j.importSpecifier(j.identifier('logger'))],
        j.literal('@/lib/logger')
      );

      const body = root.find(j.Program).get('body');
      body.unshift(importDecl);
    }
  }

  return changed ? root.toSource() : file.source;
};

export default transform;
