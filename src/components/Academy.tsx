import { useState } from 'react'
import FadeIn from '@/components/FadeIn'
import Backdrop3D from '@/components/Backdrop3D'
import ContactButton from '@/components/ContactButton'
import { courses } from '@/content/courses'

const INCLUDED = [
  { title: 'Full HD Video Lessons',      blurb: 'Every module, every lesson, broken into <10-min chapters. Watch on any device, lifetime access.' },
  { title: 'Live Doubt Sessions',        blurb: 'Bi-weekly group calls where we unblock you, review your work, and answer the questions Google can\'t.' },
  { title: 'Email Support',              blurb: 'Stuck on a prompt or a design? Email us — we reply within 24 hours, every time.' },
  { title: 'Prompt & Asset Library',     blurb: 'Every prompt, template, Figma frame, and brand kit we use ourselves — yours to download and remix.' },
  { title: 'Private Community',          blurb: 'A small Discord of AI-curious builders. Ship your work, get feedback, find collaborators.' },
  { title: 'Lifetime Updates',           blurb: 'AI moves fast. We update lessons every quarter — you keep getting them, free.' },
]

export default function Academy() {
  const [selected, setSelected] = useState(courses[0])
  const [form, setForm]         = useState({ name: '', email: '', phone: '' })
  const [enrolled, setEnrolled] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setEnrolled(true)
  }

  return (
    <main style={{ backgroundColor: '#0C0C0C', minHeight: '100vh', position: 'relative' }}>
      <Backdrop3D />
      <section className="relative z-10 px-5 sm:px-8 md:px-10 pt-32 md:pt-44 pb-24 md:pb-32 max-w-6xl mx-auto">
        <FadeIn delay={0} y={30} className="text-center mb-16 md:mb-24">
          <p
            className="uppercase mb-6"
            style={{ color: '#D7E2EA', opacity: 0.5, letterSpacing: '0.3em', fontSize: '0.75rem' }}
          >
            Nuvexa
          </p>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Academy
          </h1>
          <p
            className="mt-6 mx-auto max-w-2xl font-light"
            style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
          >
            Learn the craft. Skip the noise.
          </p>
        </FadeIn>

        {/* Manifesto */}
        <FadeIn delay={0} y={30} className="mb-20 md:mb-24 max-w-4xl">
          <p style={{ color: '#D7E2EA', fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', fontWeight: 300, lineHeight: 1.2 }}>
            The internet doesn't need another <span style={{ color: '#D7E2EA', opacity: 0.4, textDecoration: 'line-through' }}>"Master AI in 30 days"</span> course.
          </p>
          <p className="mt-4" style={{ color: '#D7E2EA', fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', fontWeight: 300, lineHeight: 1.2 }}>
            It needs <span style={{ color: '#BBCCD7', fontWeight: 500 }}>honest workflows</span> that ship real things.
          </p>
        </FadeIn>

        {/* Course tabs */}
        <FadeIn delay={0} y={30} className="flex flex-wrap gap-3 mb-10">
          {courses.map((c) => {
            const active = selected.slug === c.slug
            return (
              <button
                key={c.slug}
                onClick={() => setSelected(c)}
                className="px-5 py-3 rounded-sm uppercase tracking-widest transition-all"
                style={{
                  backgroundColor: active ? '#D7E2EA' : 'transparent',
                  color: active ? '#0C0C0C' : '#D7E2EA',
                  border: '1px solid rgba(215,226,234,0.3)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                }}
              >
                {c.slug.includes('prompt') ? 'Prompt Engineering' : 'Design Academy'}
              </button>
            )
          })}
        </FadeIn>

        {/* Selected course */}
        <FadeIn key={selected.slug} delay={0} y={30}>
          <div
            className="glass glow-border spotlight-card p-6 md:p-12 mb-20 rounded-3xl"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
              e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
            }}
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className="uppercase tracking-widest px-3 py-1 rounded-sm"
                style={{ border: '1px solid rgba(187,204,215,0.4)', color: '#BBCCD7', fontSize: '0.7rem', fontWeight: 500 }}
              >
                {selected.status}
              </span>
              <span style={{ color: '#D7E2EA', opacity: 0.6, fontSize: '0.7rem', letterSpacing: '0.2em' }} className="uppercase">
                {selected.level} · {selected.duration}
              </span>
              <span className="ml-auto font-bold tracking-tight" style={{ color: '#D7E2EA', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                {selected.price}
              </span>
            </div>
            <h3 className="hero-heading font-black tracking-tight uppercase mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.05 }}>
              {selected.title}
            </h3>
            <p className="font-light max-w-3xl mb-12" style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(1rem, 1.8vw, 1.4rem)' }}>
              {selected.tagline}
            </p>

            {/* Outcomes */}
            <div className="pl-6 mb-12" style={{ borderLeft: '2px solid #BBCCD7' }}>
              <p
                className="uppercase mb-4"
                style={{ color: '#BBCCD7', letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 500 }}
              >
                By the end you can
              </p>
              <ul className="space-y-3">
                {selected.outcomes.map((o) => (
                  <li key={o} style={{ color: '#D7E2EA', fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', lineHeight: 1.6 }}>
                    → {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Syllabus */}
            <p
              className="uppercase mb-6"
              style={{ color: '#BBCCD7', letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 500 }}
            >
              Syllabus
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {selected.modules.map((m) => (
                <div key={m.title}>
                  <h4
                    className="font-semibold uppercase mb-3"
                    style={{ color: '#D7E2EA', fontSize: '0.95rem', letterSpacing: '0.15em' }}
                  >
                    {m.title}
                  </h4>
                  <ul className="space-y-2">
                    {m.lessons.map((lesson) => (
                      <li key={lesson} className="flex gap-3" style={{ color: '#D7E2EA', opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>
                        <span style={{ color: '#BBCCD7' }}>›</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* What's included */}
        <FadeIn delay={0} y={30} className="mb-20">
          <p
            className="uppercase mb-4"
            style={{ color: '#BBCCD7', letterSpacing: '0.3em', fontSize: '0.75rem', fontWeight: 500 }}
          >
            After Enrollment
          </p>
          <h2 className="hero-heading font-black tracking-tight uppercase mb-12" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}>
            Everything unlocks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INCLUDED.map((item) => (
              <div
                key={item.title}
                className="glass glow-border spotlight-card p-6 md:p-8 rounded-2xl transition-transform duration-300 hover:-translate-y-1"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
                  e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
                }}
              >
                <h4 className="font-semibold mb-2" style={{ color: '#D7E2EA', fontSize: '1.1rem' }}>{item.title}</h4>
                <p style={{ color: '#D7E2EA', opacity: 0.65, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.blurb}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Refund hook */}
        <FadeIn delay={0} y={30} className="mb-20">
          <div
            className="text-center p-8 md:p-12 rounded-3xl glass"
            style={{ borderColor: 'rgba(187,204,215,0.30)', boxShadow: '0 0 60px rgba(118,33,176,0.18)' }}
          >
            <p
              className="uppercase mb-4"
              style={{ color: '#BBCCD7', letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 500 }}
            >
              The Honest Promise
            </p>
            <h3
              className="hero-heading font-black tracking-tight uppercase mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1.05 }}
            >
              If you don't get it,<br />
              we'll give every rupee back
            </h3>
            <p className="mx-auto max-w-2xl" style={{ color: '#D7E2EA', opacity: 0.7, lineHeight: 1.7 }}>
              Watch the first 3 modules. If it doesn't change how you work with AI — full refund, no questions, no forms, no awkward calls.
            </p>
          </div>
        </FadeIn>

        {/* Enroll form */}
        <FadeIn delay={0} y={30}>
          <div
            id="enroll"
            className="glass p-8 md:p-12 rounded-3xl"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}
          >
            <p
              className="uppercase mb-4"
              style={{ color: '#BBCCD7', letterSpacing: '0.3em', fontSize: '0.75rem', fontWeight: 500 }}
            >
              Enroll
            </p>
            <h2 className="hero-heading font-black tracking-tight uppercase mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}>
              Reserve your seat
            </h2>
            <p style={{ color: '#D7E2EA', opacity: 0.7, marginBottom: '2.5rem', maxWidth: '36rem' }}>
              Drop your details. After payment, the full course unlocks instantly.
            </p>

            {enrolled ? (
              <div className="text-center p-8 rounded-xl" style={{ border: '1px solid rgba(187,204,215,0.4)', backgroundColor: 'rgba(187,204,215,0.05)' }}>
                <div className="text-5xl mb-3" style={{ color: '#BBCCD7' }}>✓</div>
                <h3 style={{ color: '#D7E2EA', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Seat reserved.</h3>
                <p style={{ color: '#D7E2EA', opacity: 0.7 }}>We'll email you the moment payment opens.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block uppercase mb-2" style={{ color: '#D7E2EA', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                    Selected Course
                  </label>
                  <div className="px-4 py-3.5 rounded" style={{ backgroundColor: '#0C0C0C', border: '1px solid rgba(215,226,234,0.18)', color: '#D7E2EA' }}>
                    {selected.title} — <span style={{ color: '#BBCCD7' }}>{selected.price}</span>
                  </div>
                </div>
                <Field label="Your Name">
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="What do we call you?" />
                </Field>
                <Field label="Email">
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@inbox.com" />
                </Field>
                <Field label="Phone (optional)" colSpan>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 90000 00000" />
                </Field>
                <button
                  type="submit"
                  className="contact-pill md:col-span-2 py-5 text-sm md:text-base"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  Reserve My Seat — {selected.price} →
                </button>
              </form>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.2} y={20} className="text-center mt-16">
          <ContactButton to="/contact" label="Have a Question?" />
        </FadeIn>
      </section>
    </main>
  )
}

function Field({ label, children, colSpan }: { label: string; children: React.ReactNode; colSpan?: boolean }) {
  return (
    <div className={colSpan ? 'md:col-span-2' : ''}>
      <label className="block uppercase mb-2" style={{ color: '#D7E2EA', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
        {label}
      </label>
      <div
        style={{
          backgroundColor: '#0C0C0C',
          border: '1px solid rgba(215,226,234,0.18)',
          borderRadius: 6,
        }}
      >
        {children}
      </div>
      <style>{`
        input, textarea {
          width: 100%;
          background: transparent;
          color: #D7E2EA;
          padding: 0.85rem 1rem;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          border: none;
        }
        input::placeholder, textarea::placeholder { color: rgba(215,226,234,0.4); }
      `}</style>
    </div>
  )
}
