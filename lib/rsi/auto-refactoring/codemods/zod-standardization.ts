import { API, Collection, FileInfo, JSCodeshift, Transform } from 'jscodeshift';

/**
 * Helper to check if Zod is imported
 */
const hasZod = (root: Collection, j: JSCodeshift) =>
  root.find(j.ImportDeclaration, { source: { value: 'zod' } }).size() > 0;

/**
 * Creates Zod validation nodes
 */
const createValidationNodes = (j: JSCodeshift, schemaName: string) => {
  const call = j.variableDeclaration('const', [
    j.variableDeclarator(
      j.identifier('validation'),
      j.callExpression(j.memberExpression(j.identifier(schemaName), j.identifier('safeParse')), [
        j.identifier('body'),
      ]),
    ),
  ]);

  const check = j.ifStatement(
    j.unaryExpression('!', j.memberExpression(j.identifier('validation'), j.identifier('success'))),
    j.blockStatement([
      j.returnStatement(
        j.callExpression(j.memberExpression(j.identifier('NextResponse'), j.identifier('json')), [
          j.objectExpression([
            j.objectProperty(j.identifier('error'), j.literal('Invalid data')),
            j.objectProperty(
              j.identifier('details'),
              j.memberExpression(
                j.memberExpression(j.identifier('validation'), j.identifier('error')),
                j.identifier('issues'),
              ),
            ),
          ]),
          j.objectExpression([j.objectProperty(j.identifier('status'), j.literal(400))]),
        ]),
      ),
    ]),
  );
  return { call, check };
};

const transform: Transform = (file: FileInfo, api: API) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.find(j.ExportNamedDeclaration).forEach(path => {
    const decl = path.node.declaration;
    if (
      j.FunctionDeclaration.check(decl) &&
      decl.id &&
      ['POST', 'PUT'].includes(decl.id.name as string)
    ) {
      const funcBody = decl.body;
      const collectedFields: string[] = [];
      const nodesToRemove: any[] = [];

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
            const consequent = ifPath.node.consequent;
            if (
              (j.BlockStatement.check(consequent) &&
                consequent.body.some(s => j.ReturnStatement.check(s))) ||
              j.ReturnStatement.check(consequent)
            ) {
              collectedFields.push(test.argument.property.name);
              nodesToRemove.push(ifPath);
            }
          }
        });

      if (collectedFields.length > 0) {
        changed = true;
        const schemaName = `${(decl.id.name as string).toLowerCase()}Schema`;
        const schemaProperties = collectedFields.map(field =>
          j.objectProperty(
            j.identifier(field),
            j.callExpression(j.memberExpression(j.identifier('z'), j.identifier('string')), []),
          ),
        );

        path.insertBefore(
          j.variableDeclaration('const', [
            j.variableDeclarator(
              j.identifier(schemaName),
              j.callExpression(j.memberExpression(j.identifier('z'), j.identifier('object')), [
                j.objectExpression(schemaProperties),
              ]),
            ),
          ]),
        );

        const { call, check } = createValidationNodes(j, schemaName);
        const bodyDecl = j(funcBody)
          .find(j.VariableDeclarator, { id: { name: 'body' } })
          .closest(j.VariableDeclaration);

        if (bodyDecl.size() > 0) {
          bodyDecl.at(0).insertAfter(check);
          bodyDecl.at(0).insertAfter(call);
        } else {
          funcBody.body.unshift(check, call);
        }
        nodesToRemove.forEach(p => j(p).remove());
      }
    }
  });

  if (changed && !hasZod(root, j)) {
    root
      .find(j.Declaration)
      .at(0)
      .insertBefore(j.importDeclaration([j.importSpecifier(j.identifier('z'))], j.literal('zod')));
  }

  return changed ? root.toSource() : file.source;
};

export default transform;
