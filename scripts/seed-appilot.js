'use strict';

/**
 * seed-appilot.js
 *
 * Seeds all 12 Appilot bots + 2 top-level services (real-device-automation,
 * stealth-browser-automation) into Strapi via the Documents API.
 *
 * Run from strapi-cms directory:
 *   node scripts/seed-appilot.js
 *
 * Safe to re-run: existing entries (matched by slug) are skipped, not duplicated.
 */

// ---------------------------------------------------------------------------
// Bot data — 12 bots from public/data/products.json
// ---------------------------------------------------------------------------
const BOTS = [
  {
    slug: 'instagram-mobile-automation',
    name: 'Instagram follow/unfollow bot',
    role: 'Automation Bot',
    description:
      'Boost your Instagram presence with powerful automation focused on strategic follow/unfollow actions, plus posting and engagement tools. Schedule and auto-publish posts and stories, and manage DMs with automated replies to keep your account responsive while saving time.',
    quote: 'The best Instagram bot I have ever used. Safe, reliable, and incredibly powerful.',
    rating: 4.8,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'bumble-bot',
    name: 'Bumble Bot',
    role: 'Automation Bot',
    description:
      'Take your Bumble experience to the next level with this intelligent automation tool designed to help you get more matches and streamline interactions. The Bumble Bot automatically swipes based on your preferences, allowing you to cover more profiles in less time. It also sends instant, personalized messages to new matches, keeping the conversation flowing without delays.',
    quote: 'Got three dates in a week using this bot. Absolutely love it!',
    rating: 4.5,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'reddit-bot',
    name: 'Reddit Bot',
    role: 'Automation Bot',
    description:
      'Streamline your Reddit activity with smart automation designed to boost your engagement across subreddits. The Reddit Bot allows you to schedule and automate posts, ensuring your content reaches the right audience at the best times. Monitor specific subreddits for real-time updates. With intuitive controls, this bot makes it easier than ever to grow your presence and manage your Reddit activity directly from your Android phone.',
    quote: 'My subreddit engagement doubled in just two weeks.',
    rating: 4.3,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'tiktok-bot',
    name: 'TikTok Bot',
    role: 'Automation Bot',
    description:
      'Automate your TikTok growth with a powerful bot that helps you engage, post, and build a larger following effortlessly. The TikTok Bot enables you to schedule video uploads at peak times, ensuring your content reaches the widest audience possible. Designed for seamless integration with Android, this bot saves time while optimizing your TikTok strategy for maximum growth.',
    quote: 'Went from 500 to 10,000 followers in a month. This bot is insane.',
    rating: 4.4,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'snapchat-bot',
    name: 'Snapchat Bot',
    role: 'Automation Bot',
    description:
      'Effortlessly manage your Snapchat interactions and boost your engagement with smart automation tools. The Snapchat Bot lets you schedule and auto-post stories, ensuring your audience stays engaged without constant manual updates. Keep your snap streaks alive by automating daily snaps, so you never miss a day. You can also manage your friends list, adding or removing contacts based on your preferences.',
    quote: 'Never missed a streak since I started using this. Game changer!',
    rating: 4.2,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'gmail-bot',
    name: 'Gmail Bot',
    role: 'Automation Bot',
    description:
      'Take control of your Gmail inbox with smart automation tools that simplify email management on the go. The Gmail Bot allows you to automatically sort and categorize incoming emails, helping you prioritize important messages and declutter your inbox. Schedule emails to be sent at the perfect time, ensuring timely communication without manual effort. Use the auto-responder feature to instantly reply to emails with personalized templates.',
    quote: 'My inbox is finally under control. The auto-sort feature is brilliant.',
    rating: 4.1,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'facebook-bot',
    name: 'Facebook Bot',
    role: 'Automation Bot',
    description:
      'Automate your Facebook activity and enhance your social media presence with ease. The Facebook Bot helps you schedule and auto-post content, ensuring your profile or page stays active at peak engagement times. Streamline your friend and group management by automating friend requests and group join requests based on your interests. Additionally, manage your messages with instant, customized auto-replies.',
    quote: 'My Facebook page engagement is up 60% since I started using this.',
    rating: 4.3,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'x-bot',
    name: 'X Bot',
    role: 'Automation Bot',
    description:
      'Elevate your X (formerly Twitter) presence with a bot that automates your tweets, interactions, and follower growth effortlessly. The X Bot allows you to schedule tweets and threads, ensuring consistent posting during peak engagement times. With automated follow and unfollow features, you can strategically build a targeted follower base while maintaining engagement. Hashtag optimization and trending topic monitoring ensure your content reaches a wider audience.',
    quote: 'My follower count went from 200 to 5000 in two months. Incredible!',
    rating: 4.4,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'spotify-stream-bot',
    name: 'Spotify Stream Bot',
    role: 'Automation Bot',
    description:
      'The Professional Spotify Stream Bot for Android. Automate plays, manage multiple accounts, and schedule sessions from a professional dashboard. Safe, reliable automation with no rooting required. Perfect for artists, marketers, and users managing large-scale operations across multiple devices with ease.',
    quote: 'Perfect for managing my artist account. The dashboard is very professional.',
    rating: 4.6,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'linkedin-bot',
    name: 'LinkedIn Bot',
    role: 'Automation Bot',
    description:
      'LinkedIn Bot for Android Phones is an intelligent automation tool built to help professionals streamline their LinkedIn activities and grow their network with minimal effort. Whether you want to expand your network, keep your profile active, or engage with industry-relevant content, LinkedIn Bot takes care of the repetitive tasks. Features include auto-connection requests based on keywords, scheduled post publishing, and auto-messaging.',
    quote: 'Grew my LinkedIn network by 500+ connections in just 30 days.',
    rating: 4.5,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
  {
    slug: 'chrome-bot',
    name: 'Chrome Bot',
    role: 'Automation Bot',
    description:
      'Enhance your social media management directly from your Chrome browser with a versatile automation tool. Easily schedule posts and manage multiple accounts, ensuring your social presence remains active and engaging. With custom alerts and notifications, stay updated on key activities without the hassle of constant checking. Designed for seamless integration with your Chrome experience.',
    quote: 'The Chrome integration is seamless. Saves me hours every week.',
    rating: 4.0,
    technologies: ['Android', 'Real Device Automation', 'WebSocket'],
    youtubeVideoId: null,
  },
];

// ---------------------------------------------------------------------------
// Service data — 2 main services
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    slug: 'real-device-automation',
    name: 'Real Device Automation',
    label: 'Real Device Automation',
    category: 'Automation',
    summary:
      'Bespoke social media bots on real Android devices — giving you a unique and powerful competitive advantage.',
    description:
      'We design and build bespoke social media bots on real devices, using proprietary non-ADB technology that mimics human behavior more closely and is harder to detect. From custom bot development and device fleet orchestration to engagement engines and analytics, our team handles the full delivery lifecycle: consultation, development, testing, deployment, and ongoing support.',
    icon: '📱',
    deliverables: [
      'Custom bot development tailored to your growth strategy',
      'Device fleet orchestration for dozens of Android devices',
      'Content scheduling with intelligent timing and multi-account rotation',
      'Engagement engines: follow/unfollow, DMs, comments, story interactions',
      'Analytics dashboard with per-device and per-account KPIs',
      'Team integrations via REST API and webhook events',
      'Full documentation and team onboarding',
    ],
    startingPrice: 1000,
    typicalDuration: '2–8 weeks',
  },
  {
    slug: 'stealth-browser-automation',
    name: 'Stealth Browser Automation',
    label: 'Stealth Browser Automation',
    category: 'Automation',
    summary:
      'Undetectable browser automation built by experts using advanced fingerprinting, session isolation, and proxy integration.',
    description:
      'We build custom stealth automation systems that mimic real human behavior, leveraging cutting-edge fingerprint spoofing and session isolation tools like GoLogin, Multilogin, and AdsPower. Whether you need multi-account management at scale, high-volume data extraction, automated outreach flows, or full automation infrastructure, we design, build, and deploy the entire stack.',
    icon: '🕵️',
    deliverables: [
      'Custom stealth bots tailored to any platform and workflow',
      'Multi-account management using GoLogin, Multilogin, or AdsPower',
      'Advanced scraping and data extraction bypassing blocks',
      'Custom growth and outreach flows with follow-up logic',
      'Automation infrastructure and scaling in cloud or VPS environments',
      'Optional dashboards, logging pipelines, and CLI tooling',
      '15 days free post-delivery support',
    ],
    startingPrice: 1000,
    typicalDuration: '1–6 weeks',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function entryExists(model, slug) {
  const existing = await strapi.documents(`api::${model}.${model}`).findMany({
    filters: { slug: { $eq: slug } },
  });
  return existing && existing.length > 0 ? existing[0] : null;
}

async function createOrSkip(model, data) {
  const existing = await entryExists(model, data.slug);
  if (existing) {
    console.log(`  ⏭  ${model} "${data.slug}" already exists — skipping`);
    return existing;
  }

  const entry = await strapi.documents(`api::${model}.${model}`).create({
    data: {
      ...data,
      publishedAt: new Date().toISOString(),
    },
  });
  console.log(`  ✅  ${model} "${data.slug}" created (documentId: ${entry.documentId})`);
  return entry;
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

async function seedBots() {
  console.log('\n📱 Seeding bots...');
  for (const bot of BOTS) {
    await createOrSkip('bot', bot);
  }
}

async function seedServices() {
  console.log('\n🛠  Seeding services...');
  for (const service of SERVICES) {
    await createOrSkip('service', service);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  console.log('🚀 Starting Appilot seed script...');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  await seedBots();
  await seedServices();

  console.log('\n✨ Seed complete!\n');
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
