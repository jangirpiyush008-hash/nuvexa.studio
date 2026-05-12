import { Link } from 'react-router-dom'
import FadeIn from '@/components/FadeIn'

const PILLARS = [
  { tag: 'Module 01', title: 'Prompt Engineering', blurb: 'Every AI tool. Every workflow. Real prompts that ship.' },
  { tag: 'Module 02', title: 'Design Academy',     blurb: 'Brand systems, motion, AI-assisted design — what we use ourselves.' },
  { tag: 'Module 03', title: 'Build & Ship',       blurb: 'From idea to live URL. Stack-agnostic, AI-native.' },
]

/**
 * Academy highlight on home — extra-loud CTA so it grabs attention.
 * Glowing border + magenta wash + "New" badge.
 */
export default function AcademyHighlight() {
  return (
    <section
      className="relative px-5 sm:px-8 md:px-10 py-24 md:py-32"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      <div className="relative max-w-6xl mx-auto">
        <FadeIn delay={0} y={30}>
          <div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16"
            style={{
              background:
                'linear-gradient(135deg, rgba(118,33,176,0.12) 0%, rgba(12,12,12,1) 50%, rgba(190,76,0,0.10) 100%)',
              border: '1px solid rgba(187,204,215,0.20)',
              boxShadow:
                '0 0 0 1px rgba(118,33,176,0.20), 0 30px 80px rgba(118,33,176,0.18)',
            }}
          >
            {/* "New" badge */}
            <div
              className="absolute top-6 right-6 px-3 py-1.5 rounded-full uppercase tracking-widest"
              style={{
                background:
                  'linear-gradient(123deg, #B600A8 30%, #7621B0 65%, #BE4C00 100%)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.25em',
                boxShadow: '0 0 20px rgba(118,33,176,0.5)',
              }}
            >
              ◉ Now Open
            </div>

            {/* Glowing orb */}
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(187,204,215,0.20) 0%, rgba(118,33,176,0.18) 35%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            <div className="relative">
              <p
                className="uppercase mb-4"
                style={{ color: '#BBCCD7', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 500 }}
              >
                Nuvexa Academy
              </p>
              <h2
                className="hero-heading font-black uppercase tracking-tight leading-[0.95] mb-6 max-w-4xl"
                style={{ fontSize: 'clamp(2.25rem, 7vw, 5.5rem)' }}
              >
                Learn the craft.<br />Skip the noise.
              </h2>
              <p
                className="font-light max-w-2xl mb-12"
                style={{ color: '#D7E2EA', opacity: 0.8, fontSize: 'clamp(1rem, 1.6vw, 1.3rem)' }}
              >
                The same prompts, templates, and workflows we use to build $1,000
                projects for $49. No fluff, no 30-day promises — just honest
                workflows that ship real things.
              </p>

              {/* Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-10" style={{ backgroundColor: 'rgba(215,226,234,0.18)' }}>
                {PILLARS.map((p) => (
                  <div key={p.title} className="p-6 md:p-8" style={{ backgroundColor: '#0C0C0C' }}>
                    <p
                      className="uppercase mb-2"
                      style={{ color: '#BBCCD7', letterSpacing: '0.25em', fontSize: '0.65rem', fontWeight: 500 }}
                    >
                      {p.tag}
                    </p>
                    <h3
                      className="font-bold mb-2"
                      style={{ color: '#D7E2EA', fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)' }}
                    >
                      {p.title}
                    </h3>
                    <p style={{ color: '#D7E2EA', opacity: 0.65, fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {p.blurb}
                    </p>
                  </div>
                ))}
              </div>

              <Link to="/academy" className="contact-pill inline-block px-12 py-5 text-sm md:text-base">
                Enter the Academy →
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
