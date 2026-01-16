export default function transformer(file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.TSAnyKeyword)
    .replaceWith(path => {
      // Create the unknown keyword node
      const unknownKeyword = j.tsUnknownKeyword();

      // Safety check: ensure we are returning a valid node
      return unknownKeyword;
    })
    .toSource();
}
