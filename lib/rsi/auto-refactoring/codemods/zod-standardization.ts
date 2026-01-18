import { API, FileInfo, Options, Transform } from 'jscodeshift';

/**
 * Codemod: Zod Validation Standardization
 * Migrates manual 'body' Property checks to safeParse (Placeholder implementation)
 * Note: Real-world structural migration is complex; this identifies the pattern
 * and prepares the structure.
 */
const transform: Transform = (file: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  // 1. Identify POST/PUT handlers
  root.find(j.ExportNamedDeclaration).forEach(path => {
    const decl = path.node.declaration;
    if (j.FunctionDeclaration.check(decl) && decl.id && ['POST', 'PUT'].includes(decl.id.name)) {
      // 2. Look for manual property checks on 'body'
      // Example: if (!body.id) return NextResponse.json(...)
      const bodyChecks = j(path)
        .find(j.IfStatement)
        .filter(ifPath => {
          const test = ifPath.node.test;
          // Basic check for !body.prop
          return (
            j.UnaryExpression.check(test) &&
            test.operator === '!' &&
            j.MemberExpression.check(test.argument) &&
            j.Identifier.check(test.argument.object) &&
            test.argument.object.name === 'body'
          );
        });

      if (bodyChecks.length > 0) {
        // Here we would ideally insert zod schema logic
        // For this demo, we'll add a comment indicating the need for Zod
        bodyChecks
          .at(0)
          .get()
          .insertBefore(
            j.commentBlock(' TODO: Replace manual body validation with Zod safeParse '),
          );
        changed = true;
      }
    }
  });

  return changed ? root.toSource() : file.source;
};

export default transform;
