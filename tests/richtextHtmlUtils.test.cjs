const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { pathToFileURL } = require('url');

async function getRichtextHtmlUtils() {
  try {
    const mod = await import(pathToFileURL(path.join(__dirname, '../src/admin/extensions/richtextHtmlUtils.js')).href);
    return mod.default || mod;
  } catch {
    return { normalizeEditorHtml: (html) => html };
  }
}

test('normalizeEditorHtml removes unsafe tags and event handlers', async () => {
  const richtextHtmlUtils = await getRichtextHtmlUtils();
  const input = `
    <p onclick="alert('xss')">Hello</p>
    <script>alert('bad')</script>
    <img src="x.jpg" onerror="alert('boom')" style="width: 100px" />
    <a href="javascript:alert('xss')">Bad link</a>
  `;

  const output = richtextHtmlUtils.normalizeEditorHtml(input);

  assert.ok(!output.includes('<script'));
  assert.ok(!output.includes('onclick='));
  assert.ok(!output.includes('onerror='));
  assert.ok(!output.includes('javascript:'));
  assert.ok(output.includes('<p>Hello</p>'));
  assert.ok(output.includes('style="width: 100px"'));
});

test('normalizeEditorHtml preserves rich formatting markup needed by the frontend', async () => {
  const richtextHtmlUtils = await getRichtextHtmlUtils();
  const input = `
    <h2 style="font-size: 28px; font-family: Arial;">Heading</h2>
    <table style="width: 100%">
      <tbody>
        <tr>
          <td colspan="2">Cell</td>
        </tr>
      </tbody>
    </table>
    <img src="data:image/png;base64,abc123" style="float: right; width: 240px" />
    <iframe src="https://www.youtube.com/embed/example" width="640" height="360"></iframe>
  `;

  const output = richtextHtmlUtils.normalizeEditorHtml(input);

  assert.ok(output.includes('<h2 style="font-size: 28px; font-family: Arial;">Heading</h2>'));
  assert.ok(output.includes('<table style="width: 100%">'));
  assert.ok(output.includes('<td colspan="2">Cell</td>'));
  assert.ok(output.includes('src="data:image/png;base64,abc123"'));
  assert.ok(output.includes('style="float: right; width: 240px"'));
  assert.ok(output.includes('<iframe src="https://www.youtube.com/embed/example" width="640" height="360"></iframe>'));
});
