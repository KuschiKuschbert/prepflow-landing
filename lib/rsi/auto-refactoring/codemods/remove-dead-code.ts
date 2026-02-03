import { API, FileInfo, Transform } from 'jscodeshift';

/**
 * Codemod: Remove Unused Imports
 * Note: This is a basic implementation. Real-world dead code detection is better handled
 * by ESLint --fix, but listing it here as a placeholder for more advanced dead-code logic.
 */
const transform: Transform = (file: FileInfo, api: API) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.find(j.ImportDeclaration).forEach(path => {
    const specifiers = path.node.specifiers;
    if (!specifiers) return;

    const usedSpecifiers = specifiers.filter(specifier => {
      const localName = specifier.local?.name;
      if (!localName || typeof localName !== 'string') return true;

      // Special case: React might be implicitly used
      if (localName === 'React') return true;

      // Look for ANY usage of the identifier name in AST
      const hasAstUsage = root.find(j.Identifier, { name: localName }).some(idPath => {
        const p = idPath.parent.node;
        return (
          !j.ImportSpecifier.check(p) &&
          !j.ImportDefaultSpecifier.check(p) &&
          !j.ImportNamespaceSpecifier.check(p)
        );
      });

      if (hasAstUsage) return true;

      // Regex fallback: Search in source code (stripping single-line comments for better accuracy)
      // This catches type references that some parsers might miss
      const sourceWithoutComments = file.source.replace(/\/\/.*$/gm, '');
      const nameRegex = new RegExp(`\\b${localName}\\b`, 'g');
      const matches = sourceWithoutComments.match(nameRegex) || [];

      // If found more than once (one is the import itself), keep it
      return matches.length > 1;
    });

    if (usedSpecifiers.length < specifiers.length) {
      if (usedSpecifiers.length === 0) {
        j(path).remove();
      } else {
        path.node.specifiers = usedSpecifiers;
      }
      changed = true;
    }
  });

  return changed ? root.toSource() : file.source;
};

export default transform;
