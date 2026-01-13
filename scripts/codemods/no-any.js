export default function transformer(file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.TSAnyKeyword)
    .replaceWith(() => j.tsUnknownKeyword())
    .toSource();
}
