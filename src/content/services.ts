export type Service = {
  tag: string // top label (different per service)
  bigOne: string // first line of huge headline (the SERVICE category, screams what it is)
  bigTwo: string // second line (highlighted in green)
  caption: string // creative codename
  title: string // canonical name
  eta: string
  promise: string
  points: string[]
}

export const services: Service[] = [
  {
    tag: '01 / Build',
    bigOne: 'Website',
    bigTwo: 'Builds',
    caption: 'Velocity Web — 72-hour delivery',
    title: 'Web Development',
    eta: '< 72 hours',
    promise: 'AI-built websites that ship in three days, not three months.',
    points: [
      'Marketing sites, landing pages, full SaaS dashboards',
      'Next.js, React, Supabase, Vercel — battle-tested stack',
      'SEO-ready, mobile-first, blazing Lighthouse scores',
      'Hand-off clean, fork-friendly code',
      'Fixed price. No surprise invoices.',
    ],
  },
  {
    tag: '02 / Launch',
    bigOne: 'Mobile',
    bigTwo: 'Apps',
    caption: 'Pocket Empires — iOS & Android in 5 days',
    title: 'iOS & Android Apps',
    eta: '< 5 days',
    promise: 'One codebase. Both stores. Five days flat.',
    points: [
      'React Native + Expo — single team, two platforms',
      'Auth, payments (Razorpay), push, deep links built-in',
      'EAS Build for store-ready APK / IPA',
      'OTA updates so you fix bugs without re-submitting',
      'We handle Apple + Google submissions end-to-end',
    ],
  },
  {
    tag: '03 / Craft',
    bigOne: 'Brand',
    bigTwo: '& Design',
    caption: 'Visual Voltage — overnight creative',
    title: 'Brand & Creative Design',
    eta: '< 24 hours',
    promise: 'Brand kits, ads, thumbnails, social packs — overnight.',
    points: [
      'Logos, brand guidelines, color systems',
      'Static + animated ads for Meta, YouTube, LinkedIn',
      'Thumbnails, social packs, banner systems',
      'Pitch decks and one-pagers',
      'Brand-locked: one consistent style across 50+ assets',
    ],
  },
  {
    tag: '04 / Operate',
    bigOne: 'Workflow',
    bigTwo: 'Automation',
    caption: 'Silent Workers — quiet little robots',
    title: 'Workflow Automation',
    eta: '< 24 hours',
    promise: 'The boring task you do every day. Gone by tomorrow.',
    points: [
      'Email triage, scraping, reporting, scheduled scripts',
      'Zapier, Make, n8n, or custom Node / Python',
      'AI agents that draft, summarize, classify, route',
      'Plug into Notion, Google Sheets, Slack, anything',
      'Saves hours per week from week one',
    ],
  },
]
