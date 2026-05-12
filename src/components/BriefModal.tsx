import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
}

export default function BriefModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', build: '' })
  const [sent, setSent] = useState(false)

  // Esc closes; lock body scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.build) return
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\nIdea:\n${form.build}`
    window.location.href = `mailto:hello@nuvexa.studio?subject=${encodeURIComponent(`Smoke signal from ${form.name}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="brief-modal"
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(16px) saturate(140%)',
              WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            }}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 md:p-10 glass-strong glow-border"
            style={{
              boxShadow:
                '0 40px 80px rgba(0,0,0,0.65), 0 0 60px rgba(118,33,176,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ color: '#D7E2EA', fontSize: 22, lineHeight: 1 }}
            >
              <span style={{ pointerEvents: 'none' }}>×</span>
            </button>

            <p
              className="uppercase mb-3"
              style={{ color: '#BBCCD7', letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 500 }}
            >
              60-Second Pitch
            </p>
            <h2
              className="hero-heading font-black uppercase tracking-tight leading-none mb-3"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
            >
              Send a smoke signal
            </h2>
            <p style={{ color: '#D7E2EA', opacity: 0.7, marginBottom: '1.75rem' }}>
              Three fields. We come back inside 24 hours with scope, price, and ship date.
            </p>

            {sent ? (
              <div
                className="text-center p-8 rounded-xl"
                style={{ border: '1px solid rgba(187,204,215,0.4)', backgroundColor: 'rgba(187,204,215,0.05)' }}
              >
                <div className="text-5xl mb-3" style={{ color: '#BBCCD7' }}>✓</div>
                <h3 style={{ color: '#D7E2EA', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Signal received.
                </h3>
                <p style={{ color: '#D7E2EA', opacity: 0.7 }}>
                  Reply incoming within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <Field label="Your name">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="What do we call you?"
                  />
                </Field>
                <Field label="Where to reach you">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@inbox.com"
                  />
                </Field>
                <Field label="The dream — in one paragraph">
                  <textarea
                    required
                    rows={4}
                    value={form.build}
                    onChange={(e) => setForm({ ...form, build: e.target.value })}
                    placeholder="A landing page that converts. An app for stylists. A bot that drafts our weekly reports…"
                  />
                </Field>
                <button type="submit" className="contact-pill w-full py-4 text-sm md:text-base">
                  Send Signal →
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block uppercase mb-2"
        style={{ color: '#D7E2EA', fontSize: '0.7rem', letterSpacing: '0.2em' }}
      >
        {label}
      </label>
      <div
        className="brief-input-wrap"
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(215,226,234,0.18)',
          borderRadius: 8,
        }}
      >
        {children}
      </div>
    </div>
  )
}
