'use strict';

/**
 * One-time backfill for older blog posts whose heading font sizes were stripped.
 *
 * Usage:
 *   node scripts/backfill-blog-heading-styles.js          # dry run (default)
 *   node scripts/backfill-blog-heading-styles.js --apply  # write changes
 *   node scripts/backfill-blog-heading-styles.js --apply --slug=my-post-slug
 */

const HEADING_FONT_SIZES = {
  h1: '2.25rem',
  h2: '1.875rem',
  h3: '1.5rem',
};

const APPLY_CHANGES = process.argv.includes('--apply');
const SLUG_ARG = process.argv.find((arg) => arg.startsWith('--slug='));
const TARGET_SLUG = SLUG_ARG ? SLUG_ARG.slice('--slug='.length) : null;

function appendFontSizeToStyle(styleValue, fontSize) {
  const trimmed = (styleValue || '').trim();
  if (!trimmed) return `font-size: ${fontSize};`;
  if (/font-size\s*:/i.test(trimmed)) return trimmed;
  return trimmed.endsWith(';')
    ? `${trimmed} font-size: ${fontSize};`
    : `${trimmed}; font-size: ${fontSize};`;
}

function addHeadingFontSizes(html) {
  let changes = 0;

  const nextHtml = html.replace(/<h([1-3])(\s[^>]*)?>/gi, (fullMatch, headingLevel, attrs = '') => {
    const tag = `h${headingLevel.toLowerCase()}`;
    const fontSize = HEADING_FONT_SIZES[tag];
    if (!fontSize) return fullMatch;

    const styleMatch = attrs.match(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/i);
    if (styleMatch) {
      const existingStyle = styleMatch[2];
      if (/font-size\s*:/i.test(existingStyle)) return fullMatch;

      const updatedStyle = appendFontSizeToStyle(existingStyle, fontSize);
      changes += 1;
      return `<h${headingLevel}${attrs.replace(styleMatch[0], ` style=${styleMatch[1]}${updatedStyle}${styleMatch[1]}`)}>`;
    }

    changes += 1;
    return `<h${headingLevel}${attrs} style="font-size: ${fontSize};">`;
  });

  return { html: nextHtml, changes };
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  console.log('🛠️  Starting blog heading font-size backfill...');
  console.log(APPLY_CHANGES ? 'Mode: APPLY' : 'Mode: DRY RUN');
  if (TARGET_SLUG) console.log(`Target slug: ${TARGET_SLUG}`);

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    const docsApi = strapi.documents('api::blog.blog');
    const blogs = await docsApi.findMany({
      fields: ['documentId', 'slug', 'title', 'content'],
    });

    let scanned = 0;
    let changedDocs = 0;
    let changedHeadings = 0;

    for (const blog of blogs) {
      if (TARGET_SLUG && blog.slug !== TARGET_SLUG) continue;
      scanned += 1;

      const content = typeof blog.content === 'string' ? blog.content : '';
      if (!content || !/<h[1-3][\s>]/i.test(content)) continue;

      const { html: updatedHtml, changes } = addHeadingFontSizes(content);
      if (!changes || updatedHtml === content) continue;

      changedDocs += 1;
      changedHeadings += changes;

      console.log(`- ${blog.slug || blog.documentId}: +${changes} heading style update(s)`);

      if (!APPLY_CHANGES) continue;

      await docsApi.update({
        documentId: blog.documentId,
        data: { content: updatedHtml },
      });

      // If there is a published version, update it too.
      try {
        await docsApi.update({
          documentId: blog.documentId,
          status: 'published',
          data: { content: updatedHtml },
        });
      } catch {
        // No published version (or update not needed) - safe to ignore.
      }
    }

    console.log('\nDone.');
    console.log(`Scanned docs: ${scanned}`);
    console.log(`Docs needing update: ${changedDocs}`);
    console.log(`Total heading tags updated: ${changedHeadings}`);

    if (!APPLY_CHANGES && changedDocs > 0) {
      console.log('\nDry run only. Re-run with --apply to write changes.');
    }
  } finally {
    try {
      await app.destroy();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Strapi/knex can throw "aborted" during pool shutdown even after successful writes.
      if (message.includes('aborted')) {
        console.warn('⚠️  Ignoring known shutdown abort during teardown.');
      } else {
        throw err;
      }
    }
  }
}

main().catch((err) => {
  console.error('❌ Backfill failed:', err);
  process.exit(1);
});
