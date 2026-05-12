export type Project = {
  name: string
  type: 'Web' | 'App' | 'Automation' | 'Creative'
  blurb: string
  url?: string
}

// TODO: Replace placeholders with your real projects.
export const projects: Project[] = [
  {
    name: 'FitProof',
    type: 'App',
    blurb: 'Fitness accountability app — proof-of-workout video logging, streaks, leaderboards.',
    url: '#',
  },
  {
    name: 'Course Marketplace',
    type: 'Web',
    blurb: 'Marketplace for AI-generated courses with Razorpay checkout and creator payouts.',
    url: '#',
  },
  {
    name: 'HYPD Deal Generator',
    type: 'Automation',
    blurb: 'Internal tool that drafts affiliate campaign briefs in seconds.',
    url: '#',
  },
  {
    name: 'Personal Dashboard',
    type: 'Web',
    blurb: 'Telegram → Claude → Notion pipeline. Captures every idea, surfaces the top three each morning.',
    url: '#',
  },
]
