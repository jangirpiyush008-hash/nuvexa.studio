import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Msg = { role: 'nova' | 'user'; text: string; cta?: { label: string; href: string } }

const NOVA_FACE =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png'

const knowledge: { match: string[]; answer: string; cta?: { label: string; href: string } }[] = [
  { match: ['hello', 'hi', 'hey'], answer: "Hey! I'm NOVA — Nuvexa's AI helper. Ask me anything about pricing, timelines, or what we build." },
  { match: ['price', 'cost', 'pricing', 'how much', 'charge'], answer: "Starter projects begin at $49 — yes, really. Bigger builds get a custom quote inside 24 hours.", cta: { label: 'Start a Project', href: '/contact' } },
  { match: ['fast', 'time', 'timeline', 'deliver', 'how long', 'how quick', 'days', 'speed'], answer: 'Web in 72 hours. iOS + Android apps in 5 days. Creatives in 24 hours. Automations overnight.', cta: { label: 'See Services', href: '/services' } },
  { match: ['what do you', 'services', 'offer', 'build', 'do you make'], answer: 'Four things: Web, Mobile Apps, Creatives, and Automation. All AI-built. All shipped fast.', cta: { label: 'Browse Services', href: '/services' } },
  { match: ['project', 'portfolio', 'case stud', 'work', 'examples', 'past'], answer: "We're new and proud of it — but here's everything we've shipped so far.", cta: { label: 'See Projects', href: '/projects' } },
  { match: ['where', 'location', 'based', 'office', 'country'], answer: "We're based in India, working async with clients worldwide. Live calls in your timezone." },
  { match: ['retainer', 'maintain', 'after launch', 'support', 'ongoing'], answer: "Yes — flat monthly retainers available after launch." },
  { match: ['nda', 'confidential', 'privacy'], answer: "Yes, we sign NDAs. Send yours before kickoff or use ours." },
  { match: ['academy', 'course', 'learn', 'teach', 'training'], answer: "Nuvexa Academy launched with a Prompt Engineering course covering every major AI tool.", cta: { label: 'Open Academy', href: '/academy' } },
  { match: ['team', 'who', 'founder', 'about'], answer: "We don't lead with names. We lead with shipped work.", cta: { label: 'Read About Us', href: '/about' } },
  { match: ['payment', 'razorpay', 'pay', 'invoice', 'inr', 'usd'], answer: "Razorpay for India. Stripe / Wise for international. Half upfront, half on delivery." },
  { match: ['stack', 'tech', 'technology', 'framework'], answer: "Next.js, React, React Native + Expo, Supabase, Tauri, Claude API, Razorpay." },
  { match: ['revision', 'change', 'edit', 'modify', 'iteration'], answer: 'Two free rounds inside the delivery window.' },
  { match: ['ai', 'artificial', 'tool', 'how do you'], answer: 'Claude, Cursor, v0, Midjourney, Runway, ElevenLabs, n8n. AI does ~80% of the heavy lifting.' },
  { match: ['contact', 'reach', 'email', 'whatsapp', 'call'], answer: "Easiest path: fill the brief form. Or write to hello@nuvexa.studio.", cta: { label: 'Open Brief', href: '/contact' } },
  { match: ['help', 'support'], answer: "That's why I'm here. Ask me anything." },
  { match: ['thanks', 'thank you', 'cool', 'awesome', 'great'], answer: 'Anytime. Ping me again if anything else comes up.' },
]

function findAnswer(input: string) {
  const q = input.toLowerCase().trim()
  if (!q) return null
  for (const k of knowledge) {
    if (k.match.some((m) => q.includes(m))) return { answer: k.answer, cta: k.cta }
  }
  return null
}

/** Single pulsing dot used inside the "NOVA is typing…" bubble */
function TypingDot({ delay }: { delay: number }) {
  return (
    <span
      className="rounded-full"
      style={{
        width: 7,
        height: 7,
        background: '#BBCCD7',
        opacity: 0.4,
        animation: `novaTypingPulse 1.1s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}

// Reusable face avatar — defined outside the component to avoid re-creation
function Avatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 30%, #2a2a2a 0%, #0C0C0C 70%)',
        border: '1px solid rgba(215,226,234,0.25)',
      }}
    >
      <img
        src={NOVA_FACE}
        alt="NOVA"
        className="w-full h-full select-none"
        style={{ objectFit: 'contain', transform: 'scale(1.05)' }}
        draggable={false}
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
      />
    </div>
  )
}

export default function NovaBot() {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState<Msg[]>([{
    role: 'nova',
    text: "Hey, I'm NOVA. Nuvexa's AI helper. Ask me about pricing, timelines, or what we build — I've got answers.",
  }])
  const [input, setInput]         = useState('')
  const [emailMode, setEmailMode] = useState(false)
  const [email, setEmail]         = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [typing, setTyping]       = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimers = useRef<number[]>([])

  // Cleanup any pending timers on unmount
  useEffect(() => () => {
    typingTimers.current.forEach((id) => window.clearTimeout(id))
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, emailMode, open, typing])

  /**
   * Human-feel reply timing:
   *   • 400 ms before NOVA starts "typing" (reading time)
   *   • Typing duration scales with the answer length (~28 chars/sec, capped 800–2400 ms)
   *   • Then the message lands.
   */
  const send = () => {
    const trimmed = input.trim()
    if (!trimmed || typing) return
    const userMsg: Msg = { role: 'user', text: trimmed }
    const result = findAnswer(trimmed)
    setInput('')
    setMessages((m) => [...m, userMsg])

    const reply: Msg = result
      ? { role: 'nova', text: result.answer, cta: result.cta }
      : { role: 'nova', text: "I don't have a preloaded answer for that. Drop your email and a real human from Nuvexa will reply within 24 hours." }

    // 1) Reading delay before typing dots show up
    const readingDelay = 400
    // 2) Typing duration based on answer length, clamped
    const typingDur = Math.min(2400, Math.max(800, reply.text.length * 36))

    const t1 = window.setTimeout(() => setTyping(true), readingDelay)
    const t2 = window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, reply])
      if (!result) setEmailMode(true)
    }, readingDelay + typingDur)

    typingTimers.current.push(t1, t2)
  }

  const submitEmail = () => {
    const e = email.trim()
    if (!e || !e.includes('@')) return
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    window.location.href = `mailto:hello@nuvexa.studio?subject=NOVA%20handoff&body=Email:%20${encodeURIComponent(e)}%0A%0AQuestion:%20${encodeURIComponent(lastUser?.text || '')}`
    setEmailSent(true)
    setEmailMode(false)
  }

  return (
    <>
      {/* Floating toggle — no circle, just the 3D character itself.
           Hover bobs slightly. Drop-shadow makes it feel like a sticker
           hovering above the page. */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[101] w-24 h-24 md:w-28 md:h-28 hover:scale-105 active:scale-95 transition-transform duration-200 nova-float"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
        aria-label={open ? 'Close NOVA chat' : 'Open NOVA chat'}
      >
        {open ? (
          <span
            className="flex items-center justify-center w-full h-full rounded-full"
            style={{
              background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
              border: '2px solid #ffffff',
              outline: '2px solid #D7E2EA',
              outlineOffset: -3,
              boxShadow: '0 10px 24px rgba(118,33,176,0.55)',
              color: '#ffffff',
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            ×
          </span>
        ) : (
          <img
            src={NOVA_FACE}
            alt="NOVA"
            className="w-full h-full select-none"
            style={{
              objectFit: 'contain',
              filter:
                'drop-shadow(0 12px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(118,33,176,0.35))',
              pointerEvents: 'none',
            }}
            draggable={false}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
          />
        )}
      </button>


      {/* Chat panel — AnimatePresence cleanly mounts/unmounts (no pointer-events race) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="nova-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-28 right-4 md:bottom-32 md:right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(215,226,234,0.18)' }}
            role="dialog"
            aria-label="Chat with NOVA"
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: '1px solid rgba(215,226,234,0.12)', backgroundColor: '#0C0C0C' }}
            >
              <Avatar size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm" style={{ color: '#D7E2EA' }}>NOVA</p>
                <p className="text-xs" style={{ color: '#888' }}>Nuvexa's AI helper</p>
              </div>
              <span className="text-xs flex items-center gap-1.5" style={{ color: '#BBCCD7' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#BBCCD7' }} />
                Online
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpen(false) }}
                aria-label="Close chat"
                className="ml-1 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ color: '#D7E2EA', fontSize: 22, lineHeight: 1, background: 'rgba(215,226,234,0.06)' }}
              >
                <span style={{ pointerEvents: 'none' }}>×</span>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {m.role === 'nova' && <Avatar size={28} />}
                  <div
                    className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: m.role === 'user'
                        ? 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'
                        : '#1a1a1a',
                      color: m.role === 'user' ? '#ffffff' : '#D7E2EA',
                      border: m.role === 'nova' ? '1px solid rgba(215,226,234,0.10)' : 'none',
                    }}
                  >
                    {m.text}
                    {m.cta && (
                      <a
                        href={m.cta.href}
                        className="block mt-2 text-xs uppercase tracking-widest"
                        style={{ color: '#BBCCD7' }}
                      >
                        {m.cta.label} →
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* "NOVA is typing…" — three pulsing dots, looks like a real reply */}
              {typing && (
                <div className="flex justify-start gap-2">
                  <Avatar size={28} />
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid rgba(215,226,234,0.10)',
                    }}
                    aria-label="NOVA is typing"
                  >
                    <TypingDot delay={0}    />
                    <TypingDot delay={0.18} />
                    <TypingDot delay={0.36} />
                  </div>
                </div>
              )}

              {emailSent && (
                <div className="text-center text-xs py-2" style={{ color: '#BBCCD7' }}>
                  Got it — we'll be in touch within 24 hours.
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className="p-3"
              style={{ borderTop: '1px solid rgba(215,226,234,0.12)', backgroundColor: '#0C0C0C' }}
            >
              <div className="flex gap-2">
                <input
                  type={emailMode ? 'email' : 'text'}
                  placeholder={typing ? 'NOVA is typing…' : (emailMode ? 'your@email.com' : 'Ask NOVA anything…')}
                  value={emailMode ? email : input}
                  onChange={(e) => emailMode ? setEmail(e.target.value) : setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !typing) (emailMode ? submitEmail : send)()
                  }}
                  disabled={typing && !emailMode}
                  className="flex-1 px-3 py-2 text-sm rounded-md outline-none"
                  style={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(215,226,234,0.18)',
                    color: '#D7E2EA',
                    opacity: typing && !emailMode ? 0.5 : 1,
                  }}
                />
                <button
                  type="button"
                  onClick={emailMode ? submitEmail : send}
                  disabled={typing && !emailMode}
                  className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.97]"
                  style={{
                    backgroundColor: '#D7E2EA',
                    color: '#0C0C0C',
                    opacity: typing && !emailMode ? 0.5 : 1,
                    cursor: typing && !emailMode ? 'not-allowed' : 'pointer',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
