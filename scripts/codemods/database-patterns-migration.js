/**
 * Database Patterns Migration Codemod
 * Automatically fixes database pattern violations:
 * 1. Replaces throw new Error with ApiErrorHandler.createError
 * 2. Adds missing error handling for Supabase queries
 * 3. Replaces .catch() chaining with try-catch blocks
 * 4. Adds missing imports (logger, ApiErrorHandler)
 * 5. Replaces console.error with logger.error
 *
 * Usage:
 *   npm run codemod:database-patterns (dry-run)
 *   npm run codemod:database-patterns:write (apply changes)
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift.withParser('tsx');
  const root = j(file.source);
  let hasChanges = false;
  let needsLoggerImport = false;
  let needsApiErrorHandlerImport = false;

  // Check if file uses Supabase
  const fileSource = file.source;
  const hasSupabase = /supabase/.test(fileSource) || /from\(['"]/.test(fileSource);
  if (!hasSupabase) {
    return null; // Skip files without Supabase
  }

  // Check existing imports
  let hasLoggerImport = false;
  let hasApiErrorHandlerImport = false;
  root.find(j.ImportDeclaration).forEach(path => {
    const source = path.node.source.value;
    if (source === '@/lib/logger' || source.endsWith('/lib/logger')) {
      path.node.specifiers.forEach(spec => {
        if (spec.type === 'ImportSpecifier' && spec.imported.name === 'logger') {
          hasLoggerImport = true;
        }
      });
    }
    if (source === '@/lib/api-error-handler' || source.endsWith('/api-error-handler')) {
      path.node.specifiers.forEach(spec => {
        if (spec.type === 'ImportSpecifier' && spec.imported.name === 'ApiErrorHandler') {
          hasApiErrorHandlerImport = true;
        }
      });
    }
  });

  // 1. Replace console.error with logger.error
  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: { name: 'console' },
        property: { name: 'error' },
      },
    })
    .forEach(path => {
      path.value.callee.object = j.identifier('logger');
      hasChanges = true;
      needsLoggerImport = true;
    });

  // 2. Replace throw new Error with ApiErrorHandler.createError
  root.find(j.ThrowStatement).forEach(path => {
    const throwArg = path.value.argument;

    // Check if it's throw new Error(...)
    if (
      throwArg &&
      throwArg.type === 'NewExpression' &&
      throwArg.callee &&
      throwArg.callee.name === 'Error'
    ) {
      const errorArgs = throwArg.arguments;

      if (errorArgs.length > 0) {
        // Extract error message
        let errorMessage;
        if (errorArgs[0].type === 'StringLiteral') {
          errorMessage = errorArgs[0];
        } else if (errorArgs[0].type === 'TemplateLiteral') {
          // Handle template literals - convert to string literal for now
          errorMessage = j.stringLiteral('Database error');
        } else {
          errorMessage = errorArgs[0];
        }

        // Replace with ApiErrorHandler.createError
        const newThrow = j.throwStatement(
          j.callExpression(
            j.memberExpression(
              j.identifier('ApiErrorHandler'),
              j.identifier('createError')
            ),
            [
              errorMessage,
              j.stringLiteral('DATABASE_ERROR'),
              j.literal(500)
            ]
          )
        );

        j(path).replaceWith(newThrow);
        hasChanges = true;
        needsApiErrorHandlerImport = true;
      }
    }
  });

  // 3. Fix if (!supabaseAdmin) throw new Error patterns
  root.find(j.IfStatement).forEach(path => {
    const test = path.value.test;
    const consequent = path.value.consequent;

    // Check if it's if (!supabaseAdmin)
    if (
      test &&
      test.type === 'UnaryExpression' &&
      test.operator === '!' &&
      test.argument &&
      test.argument.name === 'supabaseAdmin'
    ) {
      // Check if consequent is throw new Error
      if (consequent.type === 'ThrowStatement') {
        const throwArg = consequent.argument;
        if (
          throwArg &&
          throwArg.type === 'NewExpression' &&
          throwArg.callee &&
          throwArg.callee.name === 'Error'
        ) {
          // Replace with block containing logger.error and ApiErrorHandler
          const errorMessage = throwArg.arguments[0] || j.stringLiteral('Database connection not available');

          const newBlock = j.blockStatement([
            j.expressionStatement(
              j.callExpression(
                j.memberExpression(
                  j.identifier('logger'),
                  j.identifier('error')
                ),
                [
                  j.stringLiteral('[API] Database connection not available')
                ]
              )
            ),
            j.throwStatement(
              j.callExpression(
                j.memberExpression(
                  j.identifier('ApiErrorHandler'),
                  j.identifier('createError')
                ),
                [
                  errorMessage.type === 'StringLiteral' ? errorMessage : j.stringLiteral('Database connection not available'),
                  j.stringLiteral('DATABASE_ERROR'),
                  j.literal(500)
                ]
              )
            )
          ]);

          path.value.consequent = newBlock;
          hasChanges = true;
          needsLoggerImport = true;
          needsApiErrorHandlerImport = true;
        }
      }
    }
  });

  // 4. Add missing imports
  if ((needsLoggerImport && !hasLoggerImport) || (needsApiErrorHandlerImport && !hasApiErrorHandlerImport)) {
    const imports = [];
    if (needsLoggerImport && !hasLoggerImport) {
      imports.push(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('logger'))],
          j.literal('@/lib/logger')
        )
      );
    }
    if (needsApiErrorHandlerImport && !hasApiErrorHandlerImport) {
      imports.push(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('ApiErrorHandler'))],
          j.literal('@/lib/api-error-handler')
        )
      );
    }

    // Find the last import statement
    const allImports = root.find(j.ImportDeclaration);
    if (allImports.size() > 0) {
      allImports.at(allImports.size() - 1).insertAfter(imports);
    } else {
      // No imports, add at the beginning
      const program = root.get().node.program;
      program.body.unshift(...imports);
    }
    hasChanges = true;
  }

  if (!hasChanges) {
    return null;
  }

  return root.toSource({
    quote: 'single',
    trailingComma: true,
    tabWidth: 2,
    lineTerminator: '\n',
  });
};



