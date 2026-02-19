'use strict';

/**
 * seed-platform-relations.js
 *
 * Second-pass seed: wires the platform relation on each bot.
 *
 * Prerequisites:
 *   1. Platforms already seeded (run seed.js or seed-strapi.mjs first)
 *   2. Bots already seeded (run seed-appilot.js first)
 *
 * Run from strapi-cms directory:
 *   node scripts/seed-platform-relations.js
 *
 * Safe to re-run: existing relations are overwritten with the same value
 * (idempotent).
 */

// ---------------------------------------------------------------------------
// Bot slug → Platform slug mapping
// ---------------------------------------------------------------------------
const BOT_PLATFORM_MAP = {
  'instagram-mobile-automation': 'instagram',
  'bumble-bot': 'bumble',
  'reddit-bot': 'reddit',
  'tiktok-bot': 'tiktok',
  'snapchat-bot': 'snapchat',
  'gmail-bot': 'gmail',
  'facebook-bot': 'facebook',
  'x-bot': 'x',
  'spotify-stream-bot': 'spotify',
  'linkedin-bot': 'linkedin',
  'chrome-bot': 'chrome',
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  console.log('🔗 Starting platform-relation seed...');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  // 1. Load all platforms into a slug → documentId map
  console.log('\n📋 Loading platforms...');
  const platforms = await strapi.documents('api::platform.platform').findMany({
    fields: ['slug', 'documentId'],
  });

  if (!platforms || platforms.length === 0) {
    console.error('❌ No platforms found in Strapi. Run platform seed first.');
    await app.destroy();
    process.exit(1);
  }

  const platformBySlug = {};
  for (const p of platforms) {
    platformBySlug[p.slug] = p.documentId;
    console.log(`  found platform: ${p.slug} → ${p.documentId}`);
  }

  // 2. Load all bots
  console.log('\n🤖 Loading bots...');
  const bots = await strapi.documents('api::bot.bot').findMany({
    fields: ['slug', 'documentId'],
  });

  if (!bots || bots.length === 0) {
    console.error('❌ No bots found in Strapi. Run seed-appilot.js first.');
    await app.destroy();
    process.exit(1);
  }

  // 3. Wire relations
  console.log('\n🔗 Wiring platform relations...');
  let linked = 0;
  let skipped = 0;

  for (const bot of bots) {
    const platformSlug = BOT_PLATFORM_MAP[bot.slug];
    if (!platformSlug) {
      console.log(`  ⚠️  No platform mapping for bot "${bot.slug}" — skipping`);
      skipped++;
      continue;
    }

    const platformDocId = platformBySlug[platformSlug];
    if (!platformDocId) {
      console.log(`  ⚠️  Platform "${platformSlug}" not found in Strapi — skipping bot "${bot.slug}"`);
      skipped++;
      continue;
    }

    await strapi.documents('api::bot.bot').update({
      documentId: bot.documentId,
      data: {
        platform: platformDocId,
      },
    });

    console.log(`  ✅  ${bot.slug} → ${platformSlug} (${platformDocId})`);
    linked++;
  }

  console.log(`\n✨ Done! ${linked} bots linked, ${skipped} skipped.\n`);
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
