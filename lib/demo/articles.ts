import { Article, Category } from '@/lib/types';

// Sample content shown while Firebase is not configured. Every story is labelled as a demo
// in the UI, written by the "Clarion Demo Desk", and uses local cover art from /public/demo.

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'world', name: 'World', slug: 'world', description: 'International stories and diplomatic affairs.', createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'technology', name: 'Technology', slug: 'technology', description: 'Innovation, AI, and product launches shaping the world.', createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'business', name: 'Business', slug: 'business', description: 'Markets, finance, and corporate strategy coverage.', createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'sports', name: 'Sports', slug: 'sports', description: 'Results, analysis, and feature coverage from global sports.', createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'entertainment', name: 'Entertainment', slug: 'entertainment', description: 'Film, television, music, and culture.', createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'africa', name: 'Africa', slug: 'africa', description: 'Stories and insights from across the African continent.', createdAt: '2026-06-01T08:00:00.000Z' },
];

type Seed = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  daysAgo: number;
  views: number;
  paragraphs: string[];
  status?: Article['status'];
};

const seeds: Seed[] = [
  {
    slug: 'welcome-to-clarion',
    title: 'Welcome to Clarion: how this newsroom demo works',
    category: 'World',
    summary: 'You are looking at Clarion in demo mode. These sample stories show every part of the site until a Firebase project is connected.',
    tags: ['clarion', 'demo', 'guide'],
    daysAgo: 0,
    views: 5400,
    paragraphs: [
      'Clarion is a news platform built with Next.js, Tailwind CSS and Firebase. Right now it is running in demo mode, which means no database is connected and the stories you see are built-in samples.',
      'Everything still works the way it will in production. The home page ranks stories by date and popularity, every category page lists its own coverage, and search filters by keyword, category and date range.',
      'Comments in demo mode are saved in your own browser so you can try the flow without an account. The admin dashboard is open so you can explore the editorial tools, including the AI assistant.',
      'To go live, create a Firebase project, add its keys to a .env.local file and restart the server. Clarion switches to Firestore automatically and these demo stories disappear.',
    ],
  },
  {
    slug: 'solar-microgrids-rural-clinics',
    title: 'Solar microgrids are changing how rural clinics plan their day',
    category: 'Africa',
    summary: 'Small solar installations with battery storage let clinics refrigerate vaccines and run lights after dark without waiting for the grid.',
    tags: ['energy', 'health', 'solar'],
    daysAgo: 1,
    views: 4100,
    paragraphs: [
      'For a clinic far from the national grid, power decides what care is possible. Vaccines need constant refrigeration, night-time births need light, and diagnostic equipment needs a steady supply.',
      'Solar microgrids pair rooftop panels with battery banks so a clinic can store daytime energy for the evening. Maintenance is simpler than with diesel generators, and running costs drop once the equipment is paid for.',
      'The main challenges are upfront cost and training. Programmes that train local technicians tend to keep systems running longer, because repairs no longer wait for a visiting engineer.',
    ],
  },
  {
    slug: 'what-on-device-ai-means-for-phones',
    title: 'What on-device AI actually means for the phone in your pocket',
    category: 'Technology',
    summary: 'Running AI models directly on a phone trades raw power for privacy and speed. Here is what changes for everyday apps.',
    tags: ['ai', 'mobile', 'privacy'],
    daysAgo: 1,
    views: 6200,
    paragraphs: [
      'Most AI features used to send your request to a data centre and wait for an answer. On-device AI runs a smaller model on the phone itself.',
      'The benefits are latency and privacy: a voice note can be transcribed without leaving the device, and features keep working with a weak signal. The cost is capability, since a phone has far less memory than a server.',
      'Developers increasingly mix both approaches, handling quick tasks locally and sending heavier ones to the cloud only when the user agrees.',
    ],
  },
  {
    slug: 'small-businesses-mobile-payments',
    title: 'Why small shops are leaning on mobile payments',
    category: 'Business',
    summary: 'For market traders and corner shops, mobile money reduces the risk of handling cash and makes bookkeeping easier.',
    tags: ['payments', 'small business', 'fintech'],
    daysAgo: 2,
    views: 3900,
    paragraphs: [
      'A trader who accepts mobile payments carries less cash, which means less risk at the end of the day. Every sale also leaves a digital record.',
      'That record matters. It helps owners track which products sell, and it can support applications for credit where a bank would otherwise ask for formal accounts.',
      'Fees remain the biggest complaint, and many shops still keep cash for customers who prefer it. Most settle on a mix of both.',
    ],
  },
  {
    slug: 'grassroots-football-academies',
    title: 'Inside the grassroots academies building the next generation of footballers',
    category: 'Sports',
    summary: 'Community academies combine coaching with schooling, giving young players a path whether or not they turn professional.',
    tags: ['football', 'youth', 'community'],
    daysAgo: 3,
    views: 3300,
    paragraphs: [
      'Weekend training on a dusty pitch is where many professional careers begin. Community academies try to give that talent structure: regular coaching, fitness work and match experience.',
      'The best programmes also keep players in school. Only a small share of young players will sign professional contracts, so education is part of the deal.',
      'Coaches say the biggest need is equipment and safe pitches, followed by transport to tournaments where scouts are watching.',
    ],
  },
  {
    slug: 'streaming-local-film',
    title: 'Streaming is giving local filmmakers a wider audience',
    category: 'Entertainment',
    summary: 'Online platforms let independent filmmakers reach viewers far beyond their home cities, but discoverability is still hard.',
    tags: ['film', 'streaming', 'culture'],
    daysAgo: 4,
    views: 2800,
    paragraphs: [
      'A decade ago, an independent film needed a cinema deal or a festival slot to be seen. Streaming has changed the route to an audience.',
      'Filmmakers now release directly online, build followings on social media and use viewer data to plan their next project.',
      'The hard part is being found. With thousands of titles competing for attention, many creators rely on community screenings and word of mouth alongside their online release.',
    ],
  },
  {
    slug: 'cities-heat-planning',
    title: 'How cities are planning for hotter summers',
    category: 'World',
    summary: 'Shade, reflective roofs and cooling centres are moving from nice-to-have to core parts of city planning.',
    tags: ['climate', 'cities', 'planning'],
    daysAgo: 5,
    views: 3600,
    paragraphs: [
      'Dense streets with little greenery trap heat, which makes some neighbourhoods several degrees hotter than nearby parks.',
      'City planners are responding with street trees, lighter-coloured roofs and public cooling centres that open during heatwaves.',
      'Early-warning systems matter too. Text alerts and radio announcements help older residents and outdoor workers prepare before temperatures peak.',
    ],
  },
  {
    slug: 'learning-to-code-on-a-phone',
    title: 'Learning to code with nothing but a phone',
    category: 'Technology',
    summary: 'Browser-based editors and offline tutorials make it possible to start programming without a laptop.',
    tags: ['coding', 'education', 'mobile'],
    daysAgo: 6,
    views: 4700,
    paragraphs: [
      'A laptop is still the best tool for programming, but it is no longer the only way to start. Mobile code editors and interactive tutorials let beginners write and run real code on a phone.',
      'Many new developers begin with HTML and CSS because the results are visual and instant. JavaScript usually follows, then a backend language.',
      'The jump to a laptop tends to come with the first serious project, when a bigger screen and proper tools start to matter.',
    ],
  },
  {
    slug: 'agritech-weather-alerts',
    title: 'Text-message weather alerts help farmers time their planting',
    category: 'Africa',
    summary: 'Simple SMS forecasts help smallholder farmers decide when to plant, irrigate and harvest.',
    tags: ['agriculture', 'weather', 'sms'],
    daysAgo: 7,
    views: 2500,
    paragraphs: [
      'Planting a week too early can mean losing a crop to a dry spell. Local weather forecasts sent by text message help farmers pick their moment.',
      'The service works on basic phones, which matters in areas where smartphones and data are expensive.',
      'Farmers say trust grows over a season or two, as the forecasts prove reliable for their own fields.',
    ],
  },
  {
    slug: 'savings-groups-digital',
    title: 'Community savings groups go digital',
    category: 'Business',
    summary: 'Rotating savings groups are moving their records onto phones, which makes contributions easier to track.',
    tags: ['savings', 'community', 'fintech'],
    daysAgo: 9,
    views: 2100,
    paragraphs: [
      'Savings groups, where members contribute regularly and take turns receiving the pot, run on trust. Clear records keep that trust intact.',
      'Group apps and shared spreadsheets now replace paper ledgers in many groups, so every member can see who has paid.',
      'Treasurers say digital records cut down on disputes and make it easier to welcome new members.',
    ],
  },
  {
    slug: 'marathon-training-beginners',
    title: 'A beginner’s guide to training for a first marathon',
    category: 'Sports',
    summary: 'Coaches agree on the basics: build mileage slowly, rest properly and practise race-day fuelling.',
    tags: ['running', 'fitness', 'guide'],
    daysAgo: 11,
    views: 3100,
    paragraphs: [
      'Most first-time marathon plans last four to five months. The goal is to increase weekly distance gradually so the body has time to adapt.',
      'Rest days are part of training, not a break from it. Many injuries come from doing too much too soon.',
      'Long runs are also the time to practise drinking and eating on the move, so nothing on race day is new.',
    ],
  },
  {
    slug: 'podcast-boom-young-creators',
    title: 'Young creators are turning podcasts into full-time projects',
    category: 'Entertainment',
    summary: 'Cheap microphones and free hosting have lowered the barrier to starting a show. Growing an audience is the real work.',
    tags: ['podcasts', 'creators', 'media'],
    daysAgo: 13,
    views: 2600,
    paragraphs: [
      'A podcast needs little more than a decent microphone and a quiet room. Free hosting services handle distribution to the major apps.',
      'The creators who grow fastest publish on a schedule, keep episodes focused and share short clips on social media.',
      'Income usually arrives later, through sponsorships, live events or listener memberships.',
    ],
  },
  {
    slug: 'draft-newsroom-style-guide',
    title: 'Draft: newsroom style guide update',
    category: 'World',
    summary: 'An internal draft used to show how unpublished stories appear in the admin dashboard.',
    tags: ['draft'],
    daysAgo: 0,
    views: 0,
    status: 'draft',
    paragraphs: ['This draft only appears in the admin area. It shows how unpublished stories are listed for editors.'],
  },
];

const BASE = Date.parse('2026-10-16T07:30:00.000Z');

export const DEMO_ARTICLES: Article[] = seeds.map((s, i) => {
  const published = new Date(BASE - s.daysAgo * 86400000 - i * 3600000).toISOString();
  const content = s.paragraphs.join('\n\n');
  const cover = i === 0 ? 'breaking' : s.category.toLowerCase();
  return {
    id: `demo-${i + 1}`,
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    content,
    featuredImage: `/demo/${cover}.svg`,
    author: 'Clarion Demo Desk',
    category: s.category,
    tags: s.tags,
    status: s.status ?? 'published',
    publishedAt: published,
    createdAt: published,
    updatedAt: published,
    viewCount: s.views,
    seoTitle: s.title,
    seoDescription: s.summary,
    readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)),
  };
});
