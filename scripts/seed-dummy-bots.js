'use strict';

/**
 * seed-dummy-bots.js
 *
 * Seeds additional dummy bots for each of the 11 existing platforms.
 * Each platform gets 2–3 new bots with distinct roles/use-cases.
 * Platform relations are wired in the same pass (no second script needed).
 *
 * Existing bots (already in Strapi) are skipped automatically.
 *
 * Run from strapi-cms directory (Strapi must be STOPPED first):
 *   node scripts/seed-dummy-bots.js
 *
 * Safe to re-run: skips any slug that already exists.
 */

// ---------------------------------------------------------------------------
// New dummy bots — 2-3 per platform, distinct role from existing bot
// ---------------------------------------------------------------------------
// platform slug → used to look up documentId at runtime
const DUMMY_BOTS = [

  // ─── Instagram (existing: instagram-mobile-automation) ───────────────────
  {
    slug: 'instagram-story-viewer-bot',
    name: 'Instagram Story Viewer Bot',
    role: 'Story Automation Bot',
    platformSlug: 'instagram',
    description:
      'Automatically view and react to Instagram Stories from targeted accounts to boost your profile visibility and trigger reciprocal engagement. The Instagram Story Viewer Bot cycles through a customizable list of accounts, viewing stories at human-like intervals to avoid detection. Ideal for growth hackers, influencers, and agencies who want passive visibility without manual effort.',
    quote: 'My story views tripled overnight and the follow-backs started rolling in.',
    rating: 4.6,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'instagram-dm-bot',
    name: 'Instagram DM Bot',
    role: 'Direct Message Automation Bot',
    platformSlug: 'instagram',
    description:
      'Send personalised direct messages at scale to new followers, commenters, or targeted users on Instagram. The DM Bot supports multi-template rotation and smart throttling to keep your account safe while reaching hundreds of prospects daily. Perfect for lead generation, influencer outreach, and customer onboarding campaigns.',
    quote: 'Booked 12 client calls in the first week. The personalisation is surprisingly good.',
    rating: 4.5,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'instagram-comment-bot',
    name: 'Instagram Comment Bot',
    role: 'Engagement Bot',
    platformSlug: 'instagram',
    description:
      'Auto-comment on posts from hashtags, locations, or competitor followers to drive organic engagement back to your profile. The Instagram Comment Bot uses a rotating bank of natural-sounding comments and supports emoji-only replies for ultra-safe operation. Built-in delay randomisation mimics human behaviour and reduces the risk of action blocks.',
    quote: 'Comments are indistinguishable from real ones. My engagement rate went through the roof.',
    rating: 4.3,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── Bumble (existing: bumble-bot) ───────────────────────────────────────
  {
    slug: 'bumble-profile-booster-bot',
    name: 'Bumble Profile Booster Bot',
    role: 'Profile Visibility Bot',
    platformSlug: 'bumble',
    description:
      'Maximise your Bumble profile visibility by automating Spotlight and SuperSwipe actions at the statistically best times of day. The Profile Booster Bot tracks your match rate and adjusts its activity schedule to send boosts when user activity on your target demographic peaks, giving you the highest return on each credit spent.',
    quote: 'I was invisible before. Now I am getting 3x the matches with the same profile.',
    rating: 4.4,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'bumble-opener-bot',
    name: 'Bumble Opener Bot',
    role: 'Conversation Starter Bot',
    platformSlug: 'bumble',
    description:
      'Never let a match expire because you ran out of time to open. The Bumble Opener Bot detects new matches and fires a personalised opening message within the 24-hour window, choosing from a library of openers you define. It respects Bumble\'s first-move rules and operates entirely on-device for maximum stealth.',
    quote: 'I stopped losing matches to the timer. Every match gets a thoughtful opener now.',
    rating: 4.2,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── Reddit (existing: reddit-bot) ───────────────────────────────────────
  {
    slug: 'reddit-upvote-bot',
    name: 'Reddit Upvote Bot',
    role: 'Vote Automation Bot',
    platformSlug: 'reddit',
    description:
      'Boost the visibility of your posts and comments with coordinated upvote automation across multiple aged Reddit accounts. The Upvote Bot staggers votes over time to mimic organic traction, helping your content reach the Hot section of target subreddits. Supports per-subreddit rate limiting to stay within safe thresholds.',
    quote: 'My product launch post hit the front page of the subreddit within two hours.',
    rating: 4.1,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'reddit-comment-auto-responder',
    name: 'Reddit Comment Auto-Responder',
    role: 'Community Engagement Bot',
    platformSlug: 'reddit',
    description:
      'Monitor specified subreddits for keywords and automatically post pre-written replies or promotional comments. The Auto-Responder filters posts by flair, score, and age before responding, ensuring your replies are contextually relevant. Great for SaaS founders, affiliate marketers, and community managers who want persistent subreddit presence.',
    quote: 'Went from lurking to top commenter in three subreddits within a month.',
    rating: 4.0,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── TikTok (existing: tiktok-bot) ───────────────────────────────────────
  {
    slug: 'tiktok-follow-bot',
    name: 'TikTok Follow Bot',
    role: 'Follower Growth Bot',
    platformSlug: 'tiktok',
    description:
      'Grow your TikTok following through targeted follow and unfollow campaigns aimed at users who engage with specific hashtags or creator accounts. The Follow Bot operates within TikTok\'s daily action limits and randomises session timing to maintain account safety. Pair it with the TikTok Bot for a complete growth stack.',
    quote: 'Gained 4,000 real followers in two weeks without spending a cent on ads.',
    rating: 4.3,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'tiktok-auto-liker-bot',
    name: 'TikTok Auto Liker Bot',
    role: 'Engagement Bot',
    platformSlug: 'tiktok',
    description:
      'Automatically like videos from target accounts, hashtags, or the For You page to increase your profile\'s exposure and attract reciprocal engagement. The Auto Liker Bot uses human-like scrolling patterns and variable like speeds to avoid algorithmic detection. Configurable daily caps keep your account well within safe operating limits.',
    quote: 'The For You page exposure from like-for-like is real. My video views doubled.',
    rating: 4.2,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── Snapchat (existing: snapchat-bot) ───────────────────────────────────
  {
    slug: 'snapchat-streak-bot',
    name: 'Snapchat Streak Bot',
    role: 'Streak Maintenance Bot',
    platformSlug: 'snapchat',
    description:
      'Never lose a Snapchat streak again. The Streak Bot automatically sends a blank or image snap to every streak contact once per day, at a randomised time within a configurable window. Supports bulk streak management across large friend lists and sends alerts if any streak is at risk of being missed.',
    quote: 'Maintaining 300 streaks used to take 40 minutes a day. Now it takes zero.',
    rating: 4.5,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'snapchat-friend-adder-bot',
    name: 'Snapchat Friend Adder Bot',
    role: 'Network Growth Bot',
    platformSlug: 'snapchat',
    description:
      'Rapidly expand your Snapchat network by auto-adding users from Quick Add, phone contacts, or username lists. The Friend Adder Bot throttles additions to stay under Snapchat\'s daily limits and rotates session times to appear organic. Ideal for businesses, creators, and marketers who need to build a large audience quickly.',
    quote: 'Added 500 targeted friends in a week. My story views went up 8x.',
    rating: 4.1,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── Gmail (existing: gmail-bot) ─────────────────────────────────────────
  {
    slug: 'gmail-bulk-sender-bot',
    name: 'Gmail Bulk Sender Bot',
    role: 'Email Campaign Bot',
    platformSlug: 'gmail',
    description:
      'Send personalised bulk emails through your own Gmail account without triggering spam filters. The Bulk Sender Bot rotates sending times, randomises subject line tokens, and manages unsubscribe replies automatically. Supports mail-merge style variable substitution from CSV contact lists, making it perfect for cold outreach and newsletter campaigns.',
    quote: 'A 38% open rate on cold outreach. My old ESP was getting 12%.',
    rating: 4.3,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'gmail-inbox-cleaner-bot',
    name: 'Gmail Inbox Cleaner Bot',
    role: 'Inbox Management Bot',
    platformSlug: 'gmail',
    description:
      'Automatically archive, label, and delete emails based on customisable rules — sender domain, subject keywords, age, and size. The Inbox Cleaner Bot runs scheduled sweeps of your Gmail inbox and executes bulk actions that would take hours to do manually. Also detects and unsubscribes from recurring marketing emails with a single tap.',
    quote: 'Went from 14,000 unread emails to inbox zero in under an hour.',
    rating: 4.0,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── Facebook (existing: facebook-bot) ───────────────────────────────────
  {
    slug: 'facebook-group-poster-bot',
    name: 'Facebook Group Poster Bot',
    role: 'Group Marketing Bot',
    platformSlug: 'facebook',
    description:
      'Post your content, listings, or promotions to hundreds of Facebook Groups on a schedule. The Group Poster Bot cycles through your joined groups, posts at configurable intervals to avoid spam detection, and rotates post copy to keep content fresh. Supports image and text posts, making it ideal for real estate agents, e-commerce sellers, and local businesses.',
    quote: 'I sell 5x more on Facebook Marketplace now just from automated group posting.',
    rating: 4.4,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'facebook-page-liker-bot',
    name: 'Facebook Page Liker Bot',
    role: 'Page Growth Bot',
    platformSlug: 'facebook',
    description:
      'Grow your Facebook Page likes organically by targeting users who interact with competitor pages or specific interest groups. The Page Liker Bot invites users to like your page, reacts to their public posts, and follows up with a friendly welcome message to new page followers. All actions are throttled to stay within Facebook\'s safe operating limits.',
    quote: 'Our community page went from 200 to 2,000 likes in three weeks.',
    rating: 4.2,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── X / Twitter (existing: x-bot) ───────────────────────────────────────
  {
    slug: 'x-retweet-bot',
    name: 'X Retweet Bot',
    role: 'Content Amplification Bot',
    platformSlug: 'x',
    description:
      'Automatically retweet and quote-tweet content matching your chosen keywords, hashtags, or accounts. The Retweet Bot curates a real-time stream of relevant content and amplifies it through your account, keeping your profile active between original posts. Supports scheduled retweet windows so your account only posts during peak hours.',
    quote: 'My account looks constantly active even when I am not. Engagement is way up.',
    rating: 4.3,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'x-dm-outreach-bot',
    name: 'X DM Outreach Bot',
    role: 'Direct Message Bot',
    platformSlug: 'x',
    description:
      'Send targeted direct messages to followers, people who liked a specific tweet, or users in a keyword search. The DM Outreach Bot personalises each message with the recipient\'s name and username, rotates message templates, and enforces daily sending caps to protect your account. Built for sales outreach, podcast guest booking, and influencer partnerships.',
    quote: 'Landed 3 podcast appearances in a week by DMing guests with this bot.',
    rating: 4.1,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── Spotify (existing: spotify-stream-bot) ──────────────────────────────
  {
    slug: 'spotify-playlist-follow-bot',
    name: 'Spotify Playlist Follow Bot',
    role: 'Playlist Growth Bot',
    platformSlug: 'spotify',
    description:
      'Automatically follow curated playlists and independent curator accounts to get your music on their radar. The Playlist Follow Bot targets playlists by genre, follower count, and activity level, then follows and saves them at human-like intervals. Boosts your discoverability on Spotify\'s algorithm by building real playlist placements through relationship-based outreach.',
    quote: 'Got added to 14 independent playlists in a month. Streams went from 200 to 4,000 a day.',
    rating: 4.4,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'spotify-artist-follow-bot',
    name: 'Spotify Artist Follow Bot',
    role: 'Artist Growth Bot',
    platformSlug: 'spotify',
    description:
      'Grow your Spotify follower count by targeting fans of similar artists. The Artist Follow Bot identifies listeners who follow comparable artists, follows them, and saves their public playlists to appear in their listening ecosystem. Pairs perfectly with the Spotify Stream Bot for a full artist growth campaign.',
    quote: 'My follower count grew by 800 in the first month. The targeting is spot on.',
    rating: 4.2,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── LinkedIn (existing: linkedin-bot) ───────────────────────────────────
  {
    slug: 'linkedin-post-engagement-bot',
    name: 'LinkedIn Post Engagement Bot',
    role: 'Content Engagement Bot',
    platformSlug: 'linkedin',
    description:
      'Automatically like, comment, and react to posts from target accounts, hashtags, or your own network to maximise your content\'s algorithmic reach. The Post Engagement Bot uses a library of professional comments tailored by industry and rotates them to avoid repetition. Consistent engagement signals push your profile higher in LinkedIn\'s feed ranking.',
    quote: 'My posts now regularly hit 5,000+ impressions. The engagement loop really works.',
    rating: 4.4,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'linkedin-profile-visitor-bot',
    name: 'LinkedIn Profile Visitor Bot',
    role: 'Profile Visibility Bot',
    platformSlug: 'linkedin',
    description:
      'Drive profile views and inbound connection requests by systematically visiting the profiles of your ideal prospects. The Profile Visitor Bot targets users by job title, company size, industry, and location — then visits their profiles to trigger the "Who viewed your profile" notification. A highly effective top-of-funnel tactic for B2B sales and recruiting.',
    quote: 'I get 10–15 inbound connection requests a day now. Pipeline is full.',
    rating: 4.3,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },

  // ─── Chrome (existing: chrome-bot) ───────────────────────────────────────
  {
    slug: 'chrome-auto-form-filler-bot',
    name: 'Chrome Auto Form Filler Bot',
    role: 'Form Automation Bot',
    platformSlug: 'chrome',
    description:
      'Automatically fill and submit web forms — contact forms, lead capture pages, job applications, and survey forms — at scale. The Auto Form Filler Bot reads field labels to intelligently map your data to the right inputs and handles multi-page forms, dropdowns, and file uploads. Built for recruiters, lead generators, and data entry automation.',
    quote: 'Submitted 200 job applications in a day. Got 18 callbacks within a week.',
    rating: 4.1,
    technologies: ['Android', 'Chrome Extension', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'chrome-web-scraper-bot',
    name: 'Chrome Web Scraper Bot',
    role: 'Data Extraction Bot',
    platformSlug: 'chrome',
    description:
      'Extract structured data from any website directly through your Chrome browser without writing a single line of code. The Web Scraper Bot lets you define click paths and target selectors visually, then runs scheduled scrapes and exports results to CSV or JSON. Handles pagination, infinite scroll, and login-protected pages with ease.',
    quote: 'I scrape competitor pricing every night and wake up to a clean spreadsheet. No engineers needed.',
    rating: 4.5,
    technologies: ['Android', 'Chrome Extension', 'WebSocket'],
    youtubeVideoId: null,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function entryExists(slug) {
  const existing = await strapi.documents('api::bot.bot').findMany({
    filters: { slug: { $eq: slug } },
  });
  return existing && existing.length > 0 ? existing[0] : null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  console.log('🤖 Starting dummy-bot seed...');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  // 1. Build platform slug → documentId map
  console.log('\n📋 Loading platforms...');
  const platforms = await strapi.documents('api::platform.platform').findMany({
    fields: ['slug', 'documentId'],
  });

  if (!platforms || platforms.length === 0) {
    console.error('❌ No platforms found. Run platform seed first.');
    await app.destroy();
    process.exit(1);
  }

  const platformBySlug = {};
  for (const p of platforms) {
    platformBySlug[p.slug] = p.documentId;
  }
  console.log(`  Loaded ${platforms.length} platforms.`);

  // 2. Seed bots + wire platform relation in one pass
  console.log('\n📱 Seeding dummy bots...\n');
  let created = 0;
  let skipped = 0;

  for (const bot of DUMMY_BOTS) {
    const { platformSlug, ...botData } = bot;

    // Skip if already exists
    const existing = await entryExists(botData.slug);
    if (existing) {
      console.log(`  ⏭  "${botData.slug}" already exists — skipping`);
      skipped++;
      continue;
    }

    // Resolve platform documentId
    const platformDocId = platformBySlug[platformSlug];
    if (!platformDocId) {
      console.warn(`  ⚠️  Platform "${platformSlug}" not found in Strapi — creating bot without platform relation`);
    }

    // Create bot with platform relation wired immediately
    const entry = await strapi.documents('api::bot.bot').create({
      data: {
        ...botData,
        ...(platformDocId ? { platform: platformDocId } : {}),
        publishedAt: new Date().toISOString(),
      },
    });

    console.log(`  ✅  [${platformSlug}] "${botData.slug}" created (documentId: ${entry.documentId})`);
    created++;
  }

  console.log(`\n✨ Done! ${created} bots created, ${skipped} skipped.\n`);
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
