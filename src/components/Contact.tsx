import { useState } from 'react'
import FadeIn from '@/components/FadeIn'
import Backdrop3D from '@/components/Backdrop3D'

const budgetOptions = [
  '$49 — Starter sprint',
  '$500 — Real product',
  '$1,000 — Full launch',
  '$2,500+ — Build me an empire',
  "Let's talk numbers",
]
const timelineOptions = [
  'Yesterday (rush)',
  'This week',
  'In 2–4 weeks',
  'Next month or two',
  'No rush — exploring',
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', budget: '', build: '', when: '',
  })
  const [sent, setSent]   = useState(false)
  const [error, setError] = useState('')

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm({ ...form, [k]: e.target.value })
      setError('')
    }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.build) {
      setError('Name, email, and the dream — those three we need.')
      return
    }
    if (!form.email.includes('@')) {
      setError("That email looks off. Mind double-checking?")
      return
    }
    const body = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || '—'}\nBudget: ${form.budget || '—'}\nTimeline: ${form.when || '—'}\n\nThe Build:\n${form.build}`
    window.location.href = `mailto:hello@nuvexa.studio?subject=${encodeURIComponent(`New brief from ${form.name}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <main style={{ backgroundColor: '#0C0C0C', minHeight: '100vh', position: 'relative' }}>
      <Backdrop3D />
      <section className="relative z-10 px-5 sm:px-8 md:px-10 pt-32 md:pt-44 pb-24 md:pb-32 max-w-3xl mx-auto">
        <FadeIn delay={0} y={30} className="text-center mb-16">
          <p
            className="uppercase mb-6"
            style={{ color: '#D7E2EA', opacity: 0.5, letterSpacing: '0.3em', fontSize: '0.75rem' }}
          >
            Drop the brief
          </p>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(2.75rem, 11vw, 140px)' }}
          >
            Tell us the dream
          </h1>
          <p
            className="mt-6 mx-auto max-w-xl font-light"
            style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
          >
            One paragraph is enough. We'll come back within 24 hours with a scope, a price, and a ship date.
          </p>
        </FadeIn>

        {sent ? (
          <FadeIn delay={0} y={20}>
            <div
              className="glass text-center p-10 rounded-3xl"
              style={{ boxShadow: '0 0 60px rgba(118,33,176,0.18)' }}
            >
              <div className="text-5xl mb-4" style={{ color: '#BBCCD7' }}>✓</div>
              <h2
                className="font-bold mb-3"
                style={{ color: '#D7E2EA', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
              >
                Brief in the inbox.
              </h2>
              <p style={{ color: '#D7E2EA', opacity: 0.7 }}>
                We'll be back to you within 24 hours.
              </p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.15} y={30}>
            <form onSubmit={submit} className="glass p-6 sm:p-8 md:p-10 rounded-3xl space-y-7" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
              <Field label="What should we call you?" hint="Your name, nickname, or alter ego.">
                <input type="text" value={form.name} onChange={update('name')} placeholder="e.g. Piyush, or Captain Caffeine" className={inputClass} />
              </Field>
              <Field label="Where can we reach you?" hint="The inbox you actually check.">
                <input type="email" value={form.email} onChange={update('email')} placeholder="you@yourdomain.com" className={inputClass} />
              </Field>
              <Field label="Got a number we can ping?" hint="WhatsApp friendly. Optional.">
                <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 90000 00000" className={inputClass} />
              </Field>
              <Field label="How much fuel for the rocket?" hint="Ballpark is fine.">
                <select value={form.budget} onChange={update('budget')} className={inputClass}>
                  <option value="">Pick a launchpad…</option>
                  {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Paint us the dream." hint="What are we building? Who's it for?">
                <textarea value={form.build} onChange={update('build')} rows={5} placeholder="A landing page that converts. An app for stylists…" className={inputClass} />
              </Field>
              <Field label="When do you want this live?" hint="Yesterday is a valid answer.">
                <select value={form.when} onChange={update('when')} className={inputClass}>
                  <option value="">Pick a horizon…</option>
                  {timelineOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>}

              <button
                type="submit"
                className="contact-pill w-full py-5 text-sm md:text-base"
                style={{ display: 'block', textAlign: 'center' }}
              >
                Send the Signal →
              </button>

              <p className="text-center pt-2" style={{ color: '#D7E2EA', opacity: 0.5, fontSize: '0.75rem' }}>
                Or write directly to{' '}
                <a href="mailto:hello@nuvexa.studio" style={{ color: '#BBCCD7' }}>
                  hello@nuvexa.studio
                </a>
              </p>
            </form>
          </FadeIn>
        )}
      </section>
    </main>
  )
}

const inputClass = 'w-full px-4 py-3.5 text-base font-light'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block font-medium mb-1"
        style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 1.4vw, 1.125rem)' }}
      >
        {label}
      </label>
      {hint && (
        <p style={{ color: '#D7E2EA', opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          {hint}
        </p>
      )}
      <div
        className="brief-input-wrap transition-all"
        style={{
          backgroundColor: 'rgba(215,226,234,0.04)',
          border: '1px solid rgba(215,226,234,0.18)',
          borderRadius: 12,
          color: '#D7E2EA',
          backdropFilter: 'blur(10px)',
        }}
      >
        {children}
      </div>
      <style>{`
        .${inputClass.split(' ')[0]} {
          background: transparent;
          color: #D7E2EA;
          outline: none;
        }
        input::placeholder, textarea::placeholder {
          color: rgba(215,226,234,0.4);
        }
      `}</style>
    </div>
  )
}
