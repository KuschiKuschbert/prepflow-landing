import { API, FileInfo, Options, Transform } from 'jscodeshift';

/**
 * Codemod: Remove Unused Imports
 * Note: This is a basic implementation. Real-world dead code detection is better handled
 * by ESLint --fix, but listing it here as a placeholder for more advanced dead-code logic.
 */
const transform: Transform = (file: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.find(j.ImportDeclaration).forEach(path => {
    const specifiers = path.node.specifiers;
    if (!specifiers) return;

    const usedSpecifiers = specifiers.filter(specifier => {
      const name = specifier.local?.name;
      if (!name) return true;

      const usages = root.find(j.Identifier, { name }).filter(idPath => {
        const parent = idPath.parent.node;
        // Ignore the definition in the import itself
        return (
          !j.ImportSpecifier.check(parent) &&
          !j.ImportDefaultSpecifier.check(parent) &&
          !j.ImportNamespaceSpecifier.check(parent)
        );
      });

      return usages.length > 0;
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
