import { API, FileInfo, Options, Transform } from 'jscodeshift';

/**
 * Codemod: Extract Magic Numbers to Constants
 * Looks for literal numbers (except 0, 1, -1, 100) and extracts them to top-level constants.
 */
const transform: Transform = (file: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const EXCLUDED_NUMBERS = [0, 1, -1, 100, 0.5, 2];
  const constants: { name: string; value: number }[] = [];
  let changed = false;

  // 1. Find all numeric literals
  root.find(j.NumericLiteral).forEach(path => {
    const value = path.node.value;

    // Ignore small integers, common percentages, and exclusions
    if (EXCLUDED_NUMBERS.includes(value)) return;

    // Check if it's already in a variable declaration or property
    if (j.VariableDeclarator.check(path.parent.node)) return;
    if (j.ObjectProperty.check(path.parent.node) && path.parent.node.key === path.node) return;
    if (j.TSLiteralType.check(path.parent.node)) return;

    // Generate a name for the constant
    const constName = `CONST_${Math.abs(Math.floor(value))}_${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Replace the literal with the new constant name
    j(path).replaceWith(j.identifier(constName));
    constants.push({ name: constName, value });
    changed = true;
  });

  if (!changed) return file.source;

  // 2. Add the constants at the top of the file (after imports)
  const constantDeclarations = constants.map(c =>
    j.variableDeclaration('const', [
      j.variableDeclarator(j.identifier(c.name), j.numericLiteral(c.value))
    ])
  );

  const firstNode = root.find(j.Program).get('body', 0);
  if (firstNode) {
    j(firstNode).insertBefore(constantDeclarations);
  }

  return root.toSource();
};

export default transform;
