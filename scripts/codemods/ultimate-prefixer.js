const j = require('jscodeshift');

module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const fileMapPath = options.fileMap;
  const fileMap = fileMapPath ? JSON.parse(require('fs').readFileSync(fileMapPath, 'utf8')) : {};
  const fileReport = fileMap[fileInfo.path];

  if (!fileReport) return fileInfo.source;

  process.stderr.write(`Analyzing ${fileInfo.path} with ${fileReport.length} warnings\n`);
  let dirty = false;

  fileReport.forEach(w => {
    process.stderr.write(`  Looking for ${w.name} at ${w.line}:${w.column}\n`);
    // Find identifiers at the reported location
    root.find(j.Identifier).forEach(p => {
      if (!p.value.loc) return;
      const { line, column } = p.value.loc.start;
      if (line === w.line && column === w.column - 1 && p.value.name === w.name) {
        process.stderr.write(`    Matched ${w.name}!\n`);
        const parent = p.parent.value;

        // CASE: Object destructuring { name } or { name: localName }
        if (j.ObjectProperty.check(parent) && parent.value === p.value) {
          if (parent.shorthand) {
            // Change { name } to { name: _name }
            parent.shorthand = false;
            parent.value = j.identifier('_' + w.name);
            dirty = true;
          } else {
            // Change { name: localName } to { name: _localName }
            p.value.name = '_' + w.name;
            dirty = true;
          }
        }
        // CASE: Array destructuring [_, name]
        else if (j.ArrayPattern.check(p.parent.value)) {
          p.value.name = '_' + w.name;
          dirty = true;
        }
        // CASE: Function parameter
        else if (
          j.Function.check(p.parent.parent.value) &&
          p.parent.parent.value.params.includes(p.parent.value)
        ) {
          p.value.name = '_' + w.name;
          dirty = true;
        } else if (j.Function.check(p.parent.value) && p.parent.value.params.includes(p.value)) {
          p.value.name = '_' + w.name;
          dirty = true;
        }
        // CASE: Variable declaration
        else if (j.VariableDeclarator.check(parent) && parent.id === p.value) {
          p.value.name = '_' + w.name;
          dirty = true;
        }
        // CASE: Simple assignment (not recommended but sometimes suggested)
        else if (j.AssignmentExpression.check(parent) && parent.left === p.value) {
          p.value.name = '_' + w.name;
          dirty = true;
        }
      }
    });
  });

  return dirty ? root.toSource() : fileInfo.source;
};
