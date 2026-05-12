import { Link } from 'react-router-dom'
import Backdrop3D from '@/components/Backdrop3D'
import FlipDeck from '@/components/FlipDeck'

const ARCHETYPES = [
  { title: 'The Architects', blurb: 'Translate napkin sketches into systems that scale. We design before we type.' },
  { title: 'The Engineers',  blurb: 'Half human, half AI. Pair-programmed with Claude, Cursor, v0 — taste-tested by humans.' },
  { title: 'The Visualists', blurb: 'Brand, motion, ad creative, thumbnails. Anything visual gets a frame, a feel, a finish.' },
  { title: 'The Operators',  blurb: 'Boring work, automated. Sheets, inboxes, reports — replaced with quiet little robots.' },
]

const MANIFESTO = [
  "We don't bill by the hour. We bill by what landed in your hands.",
  "We don't sell roadmaps. We sell shipped artifacts.",
  "If something can be said in 8 words, we won't use 80.",
]

export default function OurTeamPage() {
  const slides = [
    <CrewSlide key="crew" />,
    <CtaSlide key="cta" />,
  ]
  return (
    <main style={{ backgroundColor: '#0C0C0C', position: 'relative' }}>
      <Backdrop3D />
      <FlipDeck slides={slides} />
    </main>
  )
}

/* ─── Slide 1 — All four archetypes + manifesto ──────────────────────────── */
function CrewSlide() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-5 sm:px-8 md:px-12 pt-24 pb-12 overflow-y-auto">
      <div className="w-full mx-auto" style={{ maxWidth: 1300 }}>
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <p
            className="uppercase mb-3"
            style={{ color: '#BBCCD7', opacity: 0.6, letterSpacing: '0.4em', fontSize: '0.7rem' }}
          >
            Who's behind it
          </p>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(2.25rem, 7.5vw, 6.5rem)' }}
          >
            The Crew
          </h1>
        </div>

        {/* 2 × 2 grid of archetype boxes */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-12"
        >
          {ARCHETYPES.map((a, i) => (
            <div
              key={a.title}
              className="p-5 md:p-7 rounded-2xl"
              style={{
                background: 'rgba(215, 226, 234, 0.03)',
                border: '1px solid rgba(215, 226, 234, 0.18)',
              }}
            >
              <p
                className="uppercase mb-2"
                style={{ color: '#BBCCD7', letterSpacing: '0.2em', fontSize: '0.65rem' }}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3
                className="font-bold mb-2 md:mb-3"
                style={{ color: '#D7E2EA', fontSize: 'clamp(1.15rem, 1.8vw, 1.65rem)' }}
              >
                {a.title}
              </h3>
              <p
                className="font-light leading-relaxed"
                style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(0.85rem, 1.1vw, 1rem)' }}
              >
                {a.blurb}
              </p>
            </div>
          ))}
        </div>

        {/* The way we work — manifesto lines */}
        <div
          className="text-center pt-6 md:pt-8"
          style={{ borderTop: '1px solid rgba(215, 226, 234, 0.12)' }}
        >
          <p
            className="uppercase mb-4"
            style={{ color: '#BBCCD7', letterSpacing: '0.3em', fontSize: '0.7rem' }}
          >
            The way we work
          </p>
          <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto">
            {MANIFESTO.map((line) => (
              <p
                key={line}
                className="font-light leading-snug"
                style={{ color: '#D7E2EA', fontSize: 'clamp(0.95rem, 1.5vw, 1.3rem)' }}
              >
                {line}
              </p>
            ))}
            <p
              className="pt-2 font-medium"
              style={{ color: '#BBCCD7', fontSize: 'clamp(0.95rem, 1.5vw, 1.3rem)' }}
            >
              AI is the new craftsmanship. We treat it like one.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Slide 2 — CTA ───────────────────────────────────────────────────────── */
function CtaSlide() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-5 text-center">
      <p
        className="uppercase mb-6"
        style={{ color: '#BBCCD7', opacity: 0.6, letterSpacing: '0.4em', fontSize: '0.75rem' }}
      >
        Curious yet?
      </p>
      <h2
        className="hero-heading font-black uppercase tracking-tight leading-none mb-8"
        style={{ fontSize: 'clamp(3rem, 11vw, 11rem)' }}
      >
        Run an idea past us
      </h2>
      <p
        className="mx-auto max-w-2xl font-light mb-12"
        style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(1rem, 1.7vw, 1.4rem)' }}
      >
        One paragraph is enough. We'll come back inside 24 hours.
      </p>
      <Link to="/contact" className="contact-pill inline-block px-12 py-4 text-sm md:text-base">
        Drop the Brief →
      </Link>
    </div>
  )
}
