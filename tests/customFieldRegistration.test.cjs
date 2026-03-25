const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const appFile = path.join(__dirname, '..', 'src', 'admin', 'app.tsx');
const indexFile = path.join(__dirname, '..', 'src', 'index.ts');
const schemaFile = path.join(__dirname, '..', 'src', 'api', 'blog', 'content-types', 'blog', 'schema.json');

test('custom field registration matches schema namespace', () => {
  const adminSource = fs.readFileSync(appFile, 'utf8');
  const serverSource = fs.readFileSync(indexFile, 'utf8');
  const schemaSource = fs.readFileSync(schemaFile, 'utf8');

  assert.match(schemaSource, /"customField"\s*:\s*"global::richtext-html-paste"/);
  assert.match(adminSource, /pluginId:\s*'global'/);
  assert.match(serverSource, /plugin:\s*'global'/);
});
