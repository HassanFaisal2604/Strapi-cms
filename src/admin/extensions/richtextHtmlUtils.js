const DANGEROUS_TAGS = [
  'script',
  'meta',
  'link',
];

const dangerousBlockTagPattern = new RegExp(
  `<(${DANGEROUS_TAGS.join('|')})\\b[^>]*>[\\s\\S]*?<\\/\\1>`,
  'gi'
);
const dangerousSingleTagPattern = new RegExp(
  `<(?:${DANGEROUS_TAGS.join('|')})\\b[^>]*\\/?>`,
  'gi'
);

function stripDangerousTags(html) {
  return html
    .replace(dangerousBlockTagPattern, '')
    .replace(dangerousSingleTagPattern, '');
}

function stripEventHandlers(html) {
  return html
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '');
}

function stripJavascriptUrls(html) {
  return html
    .replace(/\s(href|src)\s*=\s*"javascript:[^"]*"/gi, '')
    .replace(/\s(href|src)\s*=\s*'javascript:[^']*'/gi, '')
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, '');
}

function normalizeEditorHtml(html) {
  if (typeof html !== 'string') {
    return '';
  }
  return stripJavascriptUrls(stripEventHandlers(stripDangerousTags(html)))
    .replace(/\u0000/g, '')
    .trim();
}

export { normalizeEditorHtml };
export default { normalizeEditorHtml };
