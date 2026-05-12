export type CourseModule = {
  title: string
  lessons: string[]
}

export type Course = {
  slug: string
  title: string
  tagline: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'Live' | 'Coming Soon' | 'Early Access'
  price: string
  modules: CourseModule[]
  outcomes: string[]
}

export const courses: Course[] = [
  {
    slug: 'prompt-engineering-101',
    title: 'Prompt Engineering: Every AI Tool That Matters',
    tagline:
      'One course to make every AI tool — text, image, video, audio, design, code — bend to your intent.',
    duration: '6 hours',
    level: 'Beginner',
    status: 'Live',
    price: '₹4,999',
    outcomes: [
      'Stop fighting AI. Make it your unfair advantage.',
      'Cut your content / design / dev time by 70%+',
      'Build a personal prompt library you reuse for years',
      'Speak the same language as the people building AI products',
    ],
    modules: [
      {
        title: 'Module 1 — Foundations',
        lessons: [
          'What a prompt actually is (and why most people get it wrong)',
          'The 5 prompt patterns that work everywhere',
          'Anatomy: role, context, task, format, constraints',
          'Iteration vs. one-shot: when to use which',
        ],
      },
      {
        title: 'Module 2 — Text & Reasoning (Claude, ChatGPT, Gemini)',
        lessons: [
          'Claude vs. GPT vs. Gemini: when each one wins',
          'System prompts that change behavior permanently',
          'Chain of thought, tree of thought, self-critique',
          'Long-context workflows (100k+ tokens)',
          'Prompt caching for cheaper iterations',
        ],
      },
      {
        title: 'Module 3 — Image (Midjourney, DALL·E, Stable Diffusion, Nano Banana)',
        lessons: [
          'Style anchors: how to get a consistent look across 50 images',
          'Aspect ratios, weights, negative prompts',
          'Image-to-image vs. text-to-image workflows',
          'Brand kit generation in under an hour',
        ],
      },
      {
        title: 'Module 4 — Video (Runway, Pika, Sora, Kling)',
        lessons: [
          'Motion prompts: camera moves, pacing, transitions',
          'Stitching shots into a 30-second ad',
          'Voiceover + B-roll workflow',
          'When to AI-generate vs. record real footage',
        ],
      },
      {
        title: 'Module 5 — Audio (ElevenLabs, Suno, Udio)',
        lessons: [
          'Voice cloning ethics & quality knobs',
          'Music generation for ads, intros, podcasts',
          'Multilingual TTS (Hindi + English mix)',
        ],
      },
      {
        title: 'Module 6 — Design (Canva AI, Figma AI, Recraft)',
        lessons: [
          'Brand-locked Canva templates with Magic Design',
          'Figma Make: prompt → component → variants',
          'Recraft for vector-style consistency',
        ],
      },
      {
        title: 'Module 7 — Code (Claude Code, Cursor, v0, Bolt)',
        lessons: [
          'Spec → working app in one prompt',
          'Multi-file refactors without breaking things',
          'Vibe coding vs. structured prompting',
          'Reading and reviewing AI-written code',
        ],
      },
      {
        title: 'Module 8 — Capstone',
        lessons: [
          'Launch a full product (web + creatives + automation) in one weekend',
          'Building a personal prompt library',
          'Pricing your AI services in INR',
        ],
      },
    ],
  },
  {
    slug: 'design-academy',
    title: 'AI-Native Design: From Blank Canvas to Brand System',
    tagline:
      'Design fast, on-brand, and at scale — using AI tools that turn taste into output.',
    duration: '5 hours',
    level: 'Beginner',
    status: 'Early Access',
    price: '₹3,999',
    outcomes: [
      'Build a brand system from a single Figma frame in 60 minutes',
      'Generate 50 on-brand ad creatives without ever opening Photoshop',
      'Animate your visuals in Runway and ship them to social',
      'Land design clients with a portfolio you built in a week',
    ],
    modules: [
      {
        title: 'Module 1 — Taste First',
        lessons: [
          'Why "good design" is not subjective (mostly)',
          'The 4 references every brand should steal from',
          'How to brief AI like a creative director',
        ],
      },
      {
        title: 'Module 2 — Brand Systems',
        lessons: [
          'Color, type, spacing, motion — the 4 dials',
          'Logo systems with Recraft + Midjourney',
          'Building a brand kit you can hand to a junior',
        ],
      },
      {
        title: 'Module 3 — Static Creative at Scale',
        lessons: [
          'Canva AI workflows for batch ad production',
          'Figma + AI plugins for variant generation',
          'Photo / mockup / hero shot generation',
        ],
      },
      {
        title: 'Module 4 — Motion & Video',
        lessons: [
          'Runway and Pika for motion ads',
          'Storyboarding before generating',
          'Sound design with ElevenLabs + Suno',
        ],
      },
      {
        title: 'Module 5 — Ship It',
        lessons: [
          'Export pipelines for Meta / YouTube / LinkedIn',
          'Pricing AI-assisted design work',
          'Building a portfolio that wins clients',
        ],
      },
    ],
  },
]
