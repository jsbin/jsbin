export default async function transform(source) {
  const commonmark = await import(/* webpackChunkName: "commonmark" */ 'commonmark');
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();

  return writer.render(reader.parse(source));
}
