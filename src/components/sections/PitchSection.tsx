import { useState } from 'react'
import FadeIn from '@/components/FadeIn'
import BriefModal from '@/components/BriefModal'

/**
 * Mid-page CTA — a big visual break with a single intent: open the brief modal.
 * Uses the same dark + magenta palette as the rest of the site.
 */
export default function PitchSection() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <section
        className="relative px-5 sm:px-8 md:px-10 py-24 md:py-36 overflow-hidden"
        style={{ backgroundColor: '#0C0C0C' }}
      >
        {/* Backdrop glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(118,33,176,0.18) 0%, rgba(190,76,0,0.08) 35%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn delay={0} y={20}>
            <p
              className="uppercase mb-6"
              style={{ color: '#BBCCD7', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 500 }}
            >
              60-Second Pitch
            </p>
          </FadeIn>
          <FadeIn delay={0.1} y={30}>
            <h2
              className="hero-heading font-black uppercase tracking-tight leading-[0.95] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}
            >
              Got an idea?<br />
              Send a smoke signal.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} y={20}>
            <p
              className="mx-auto max-w-xl font-light mb-10"
              style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}
            >
              Three fields. Sixty seconds. We come back in 24 hours with scope,
              price, and a ship date — no decks, no calls.
            </p>
          </FadeIn>
          <FadeIn delay={0.3} y={20}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="contact-pill inline-block px-12 py-5 text-sm md:text-base"
            >
              Send Smoke Signal →
            </button>
          </FadeIn>
        </div>
      </section>

      <BriefModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
