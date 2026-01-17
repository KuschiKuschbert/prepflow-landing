import { API, FileInfo, Options, Transform } from 'jscodeshift';

/**
 * Codemod: Extract Large Callbacks to Functions
 * Looks for large arrow functions (e.g. in .map(), .filter()) and extracts them
 * to separate functions to reduce nesting levels.
 */
const transform: Transform = (file: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;
  const newFunctions: any[] = [];

  // Find arrow functions with more than 5 lines
  root.find(j.ArrowFunctionExpression).forEach(path => {
    const body = path.node.body;
    if (j.BlockStatement.check(body) && body.body.length > 5) {
      // Check if it's an argument to a method call (likely a callback)
      if (j.CallExpression.check(path.parent.node)) {
        const callee = path.parent.node.callee;
        if (j.MemberExpression.check(callee)) {
          const methodName = (callee.property as any).name;
          const fileNameBasename = file.path.split('/').pop()?.split('.')[0] || 'logic';
          const funcName = `handle${methodName.charAt(0).toUpperCase() + methodName.slice(1)}In${fileNameBasename.charAt(0).toUpperCase() + fileNameBasename.slice(1)}_${Math.random().toString(36).substring(7)}`;

          // Create a new top-level function
          const newFunc = j.functionDeclaration(
            j.identifier(funcName),
            path.node.params,
            body
          );
          newFunctions.push(newFunc);

          // Replace the arrow function with the new function identifier
          j(path).replaceWith(j.identifier(funcName));
          changed = true;
        }
      }
    }
  });

  if (!changed) return file.source;

  // Add the new functions at the bottom of the file (or before exports)
  const body = root.find(j.Program).get('body');
  newFunctions.forEach(f => body.push(f));

  return root.toSource();
};

export default transform;
