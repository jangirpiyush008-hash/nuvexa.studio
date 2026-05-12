import FadeIn from '@/components/FadeIn'
import Backdrop3D from '@/components/Backdrop3D'
import ContactButton from '@/components/ContactButton'

const STATS = [
  { label: 'Avg. delivery', value: '< 5 days' },
  { label: 'Starter price', value: '$49' },
  { label: 'Ego per project', value: 'Zero' },
  { label: 'Approval calls', value: 'Also zero' },
]

export default function About() {
  return (
    <main style={{ backgroundColor: '#0C0C0C', minHeight: '100vh', position: 'relative' }}>
      <Backdrop3D />
      <section className="relative z-10 px-5 sm:px-8 md:px-10 pt-32 md:pt-44 pb-24 md:pb-32 max-w-5xl mx-auto">
        <FadeIn delay={0} y={30} className="text-center mb-16 md:mb-20">
          <p
            className="uppercase mb-6"
            style={{ color: '#D7E2EA', opacity: 0.5, letterSpacing: '0.3em', fontSize: '0.75rem' }}
          >
            About Nuvexa
          </p>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Shipped Friday
          </h1>
        </FadeIn>

        <FadeIn delay={0.1} y={30} className="space-y-7 max-w-3xl mx-auto">
          <p
            className="font-light leading-relaxed"
            style={{ color: '#D7E2EA', fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)' }}
          >
            Most agencies sell you a roadmap. We sell you a build. The kind that's running on the
            internet by the end of the week, not the kind stuck in approval calls until next quarter.
          </p>
          <p
            className="font-light leading-relaxed"
            style={{ color: '#D7E2EA', opacity: 0.8, fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
          >
            We don't have decades of case studies. We have something better — the time, the tools,
            and the obsession to build yours faster than anyone you've worked with before. AI didn't
            replace the craft. It made the craft cheap enough to share.
          </p>
          <p
            className="font-medium leading-relaxed"
            style={{ color: '#BBCCD7', fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)' }}
          >
            Idea on Monday. Live on Friday. Pricing that doesn't need a procurement team.
          </p>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.2} y={30} className="mt-20 md:mt-24">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
            style={{ borderTop: '1px solid rgba(215,226,234,0.18)' }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="hero-heading font-black tracking-tight"
                  style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', lineHeight: 1 }}
                >
                  {s.value}
                </div>
                <div
                  className="uppercase mt-3"
                  style={{ color: '#D7E2EA', opacity: 0.55, letterSpacing: '0.2em', fontSize: '0.7rem' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.3} y={20} className="mt-20 text-center">
          <ContactButton to="/contact" label="Run an Idea Past Us" />
        </FadeIn>
      </section>
    </main>
  )
}
