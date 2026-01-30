import { API, FileInfo, Options, Transform } from 'jscodeshift';

/**
 * Codemod: Zod Validation Standardization
 * Migrates manual 'body' Property checks to safeParse
 */
const transform: Transform = (file: FileInfo, api: API, _options: Options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;
  let hasZodImport = false;

  // Check if Zod is already imported
  if (root.find(j.ImportDeclaration, { source: { value: 'zod' } }).size() > 0) {
    hasZodImport = true;
  }

  // 1. Identify POST/PUT handlers
  root.find(j.ExportNamedDeclaration).forEach(path => {
    const decl = path.node.declaration;
    if (j.FunctionDeclaration.check(decl) && decl.id && ['POST', 'PUT'].includes(decl.id.name)) {
      const funcBody = decl.body;
      const collectedFields: string[] = [];
      const nodesToRemove: any[] = [];

      // 2. Look for manual property checks on 'body'
      // Example: if (!body.email) ...
      j(funcBody)
        .find(j.IfStatement)
        .forEach(ifPath => {
          const test = ifPath.node.test;
          if (
            j.UnaryExpression.check(test) &&
            test.operator === '!' &&
            j.MemberExpression.check(test.argument) &&
            j.Identifier.check(test.argument.object) &&
            test.argument.object.name === 'body' &&
            j.Identifier.check(test.argument.property)
          ) {
            const fieldName = test.argument.property.name;
            // Check if the body is just a return or simple error
            // We assume this is a validation check if it returns
            const consequent = ifPath.node.consequent;
            if (
              j.BlockStatement.check(consequent) &&
              consequent.body.some(s => j.ReturnStatement.check(s))
            ) {
              collectedFields.push(fieldName);
              nodesToRemove.push(ifPath);
            } else if (j.ReturnStatement.check(consequent)) {
              collectedFields.push(fieldName);
              nodesToRemove.push(ifPath);
            }
          }
        });

      if (collectedFields.length > 0) {
        changed = true;
        const schemaName = `${decl.id.name.toLowerCase()}Schema`;

        // 3. Create Zod Schema
        const schemaProperties = collectedFields.map(field => {
          return j.objectProperty(
            j.identifier(field),
            j.callExpression(j.memberExpression(j.identifier('z'), j.identifier('string')), []),
          );
        });

        const schemaDecl = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(schemaName),
            j.callExpression(j.memberExpression(j.identifier('z'), j.identifier('object')), [
              j.objectExpression(schemaProperties),
            ]),
          ),
        ]);

        // Insert schema before the function
        path.insertBefore(schemaDecl);

        // 4. Create safeParse call
        // const validation = schema.safeParse(body);
        const validationCall = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier('validation'),
            j.callExpression(
              j.memberExpression(j.identifier(schemaName), j.identifier('safeParse')),
              [j.identifier('body')],
            ),
          ),
        ]);

        // 5. Create validation check
        // if (!validation.success) { return NextResponse.json({ error: 'Invalid data' }, { status: 400 }); }
        const validationCheck = j.ifStatement(
          j.unaryExpression(
            '!',
            j.memberExpression(j.identifier('validation'), j.identifier('success')),
          ),
          j.blockStatement([
            j.returnStatement(
              j.callExpression(
                j.memberExpression(j.identifier('NextResponse'), j.identifier('json')),
                [
                  j.objectExpression([
                    j.objectProperty(j.identifier('error'), j.literal('Invalid data')),
                    j.objectProperty(
                      j.identifier('details'),
                      j.memberExpression(
                        j.memberExpression(j.identifier('validation'), j.identifier('error')),
                        j.identifier('errors'),
                      ),
                    ),
                  ]),
                  j.objectExpression([j.objectProperty(j.identifier('status'), j.literal(400))]),
                ],
              ),
            ),
          ]),
        );

        // Find where 'body' is defined to insert validation after it
        const bodyDecl = j(funcBody)
          .find(j.VariableDeclarator, { id: { name: 'body' } })
          .closest(j.VariableDeclaration);

        if (bodyDecl.size() > 0) {
          bodyDecl.at(0).insertAfter(validationCheck);
          bodyDecl.at(0).insertAfter(validationCall);
        } else {
          // Fallback: insert at beginning of function
          funcBody.body.unshift(validationCheck);
          funcBody.body.unshift(validationCall);
        }

        // 6. Remove old checks
        nodesToRemove.forEach(p => j(p).remove());
      }
    }
  });

  // Add import if needed
  if (changed && !hasZodImport) {
    const importDecl = j.importDeclaration(
      [j.importSpecifier(j.identifier('z'))],
      j.literal('zod'),
    );
    root.find(j.Declaration).at(0).insertBefore(importDecl);
  }

  return changed ? root.toSource() : file.source;
};

export default transform;
