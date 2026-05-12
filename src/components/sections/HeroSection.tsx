import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import FadeIn from '@/components/FadeIn'
import ContactButton from '@/components/ContactButton'
import Magnet from '@/components/Magnet'

const NAV_CENTER = [
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Academy',  to: '/academy', highlight: true },
  { label: 'The Crew', to: '/our-team' },
]
const NAV_RIGHT = [
  { label: 'Manifesto', to: '/about' },
  { label: 'Say Hi',    to: '/contact' },
]

const NOVA_PORTRAIT =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png'

/**
 * NOVA character — gaze tracking via 3-axis head animation.
 *
 * Why no pupil overlays: the painted eyes are baked into the source PNG.
 * Overlaying fake eyes on top requires pixel-precise alignment that's
 * fragile against any image change and never lines up perfectly.
 *
 * What we do instead — a 5-channel head animation that reads as "looking
 * at you" the way any 3D character animation does:
 *
 *   • translate3d  (X, Y)  — head leans toward cursor (max ±60 px)
 *   • rotateY      — head turns left/right based on horizontal offset (±18°)
 *   • rotateX      — head tips up/down based on vertical offset (±12°)
 *   • rotateZ      — slight side-tilt for personality (±3°)
 *   • scale        — micro grow when cursor is close (1 → 1.04)
 *
 * Combined with `perspective: 1200px` on the wrapper, this gives a
 * believable 3D head-track that feels alive, not a sticker on the page.
 */
function NovaCharacter() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number | null = null

    const onMove = (e: MouseEvent) => {
      const wrap = wrapRef.current
      const head = headRef.current
      if (!wrap || !head) return

      const rect = wrap.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy

      // Activation radius — past 1.5× character box, effect plateaus
      const maxX = rect.width * 1.5
      const maxY = rect.height * 1.5
      const nx = Math.max(-1, Math.min(1, dx / maxX))    // -1..1
      const ny = Math.max(-1, Math.min(1, dy / maxY))    // -1..1

      // Proximity factor — 1 when cursor is on character, 0 when far
      const dist = Math.hypot(dx, dy)
      const prox = Math.max(0, 1 - dist / (rect.width * 1.2))

      const tx     = nx * 90                  // bigger drift
      const ty     = ny * 90
      const rotY   = nx * 26                  // more pronounced horizontal turn
      const rotX   = -ny * 18                 // more pronounced vertical tip
      const rotZ   = nx * 5                   // tilt for personality
      const scale  = 1 + prox * 0.07          // grows when cursor is on the head

      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        head.style.transform =
          `translate3d(${tx}px, ${ty}px, 0) ` +
          `rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) ` +
          `scale(${scale})`
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={headRef}
        className="absolute inset-0"
        style={{
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 60%', // pivot at neck/jaw, not centre — feels natural
        }}
      >
        <img
          src={NOVA_PORTRAIT}
          alt="NOVA — Nuvexa's AI Employee"
          draggable={false}
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0')}
          className="w-full h-full object-contain select-none"
          style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.65))' }}
        />
      </div>
    </div>
  )
}

function HeroNavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} end>
      {({ isActive }) => (
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
          style={{
            background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
            border: '1px solid',
            borderColor: isActive ? 'rgba(187,204,215,0.30)' : 'transparent',
            boxShadow: isActive ? 'inset 0 0 12px rgba(118,33,176,0.20)' : 'none',
          }}
        >
          <span
            className="rounded-full transition-all duration-200"
            style={{
              width: isActive ? 7 : 0,
              height: 7,
              background:
                'linear-gradient(123deg, #B600A8 0%, #7621B0 50%, #BE4C00 100%)',
              boxShadow: isActive ? '0 0 8px rgba(118,33,176,0.85)' : 'none',
              flexShrink: 0,
            }}
          />
          <span
            className="font-medium uppercase tracking-wider text-sm md:text-base lg:text-[1.05rem]"
            style={{
              color: isActive ? '#ffffff' : '#D7E2EA',
              opacity: isActive ? 1 : 0.7,
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {label}
          </span>
        </span>
      )}
    </NavLink>
  )
}

function HeroAcademyPill({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} end className="transition-transform duration-200 hover:scale-105">
      {({ isActive }) => (
        <span
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
          style={{
            background: isActive
              ? 'linear-gradient(123deg, rgba(182,0,168,0.55) 7%, rgba(118,33,176,0.65) 50%, rgba(190,76,0,0.55) 100%)'
              : 'linear-gradient(123deg, rgba(182,0,168,0.15) 7%, rgba(118,33,176,0.18) 50%, rgba(190,76,0,0.15) 100%)',
            border: '1.5px solid #BBCCD7',
            boxShadow: isActive
              ? '0 0 28px rgba(182,0,168,0.85), inset 0 0 18px rgba(187,204,215,0.25)'
              : '0 0 18px rgba(118,33,176,0.45), inset 0 0 12px rgba(187,204,215,0.10)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: 'inherit',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          {isActive && (
            <span
              className="rounded-full"
              style={{
                width: 7, height: 7,
                background: '#ffffff',
                boxShadow: '0 0 10px rgba(255,255,255,0.95)',
              }}
            />
          )}
          {label}
        </span>
      )}
    </NavLink>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="hero-heading font-black tracking-tight"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1 }}
      >
        {value}
      </div>
      <div
        className="uppercase mt-1.5"
        style={{
          color: '#D7E2EA',
          opacity: 0.5,
          letterSpacing: '0.2em',
          fontSize: '0.65rem',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section
      className="relative h-screen w-full flex flex-col"
      style={{ overflowX: 'clip', overflowY: 'hidden' }}
    >
      {/* Navbar — three columns: logo left, primary centre, About+Contact extreme right */}
      <FadeIn delay={0} y={-20} className="w-full relative z-30 flex-shrink-0">
        <nav className="grid grid-cols-3 items-center px-6 md:px-10 pt-6 md:pt-8">
          {/* Left — logo */}
          <Link
            to="/"
            className="font-semibold uppercase tracking-wider text-base md:text-2xl lg:text-[1.9rem] transition-opacity duration-200 hover:opacity-70 justify-self-start"
            style={{ color: '#D7E2EA' }}
          >
            Nuvexa<span style={{ opacity: 0.6 }}>.Studio</span>
          </Link>
          {/* Centre — primary nav */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5 justify-self-center">
            {NAV_CENTER.map((n) =>
              n.highlight ? <HeroAcademyPill key={n.label} to={n.to} label={n.label} />
                          : <HeroNavItem    key={n.label} to={n.to} label={n.label} />
            )}
          </div>
          {/* Right (extreme) — About + Contact, creative names */}
          <div className="hidden md:flex gap-3 lg:gap-5 justify-self-end">
            {NAV_RIGHT.map((n) => (
              <HeroNavItem key={n.label} to={n.to} label={n.label} />
            ))}
          </div>
        </nav>
      </FadeIn>

      {/* Heading */}
      <div className="relative z-20 px-4 pt-6 md:pt-8 pb-2 flex-shrink-0">
        {/* Layered glow lighting behind headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-[60vh] max-w-[80vw]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(118,33,176,0.28) 0%, rgba(182,0,168,0.12) 30%, transparent 65%)',
            filter: 'blur(40px)',
            zIndex: -1,
          }}
        />
        <FadeIn delay={0.15} y={20}>
          <h1
            className="hero-heading-glow font-black uppercase tracking-tight leading-[1.05] whitespace-nowrap w-full text-center"
            style={{ fontSize: 'clamp(2.5rem, 11vw, 11vw)' }}
          >
            Hi, I&apos;m NOVA
          </h1>
        </FadeIn>
      </div>

      {/* Character — absolutely centred in viewport, sized to fill the
           middle area. Sits behind the heading + bottom row (z-5) so it
           visually anchors the page without affecting flex flow. */}
      <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
        <FadeIn delay={0.5} y={20}>
          <div
            style={{
              aspectRatio: '1 / 1',
              height: 'min(78vh, 900px)',
              width:  'min(78vh, 900px)',
              maxWidth: '90vw',
            }}
          >
            <NovaCharacter />
          </div>
        </FadeIn>
      </div>

      {/* Spacer fills the flex gap the absolute character no longer occupies */}
      <div className="flex-1" />

      {/* Bottom row — punchy left column with the brand voice */}
      <div className="px-6 md:px-10 pb-10 md:pb-14 relative z-30 flex-shrink-0 max-w-[720px]">
        {/* Status pill — small "we're online" cue */}
        <FadeIn delay={0.20} y={20}>
          <div
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
            style={{
              border: '1px solid rgba(187,204,215,0.25)',
              background: 'rgba(215,226,234,0.04)',
            }}
          >
            <span
              className="rounded-full"
              style={{ width: 7, height: 7, background: '#BBCCD7', boxShadow: '0 0 8px #BBCCD7' }}
            />
            <span
              className="uppercase"
              style={{ color: '#D7E2EA', letterSpacing: '0.25em', fontSize: '0.7rem', fontWeight: 500 }}
            >
              Studio open · 24h reply
            </span>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.30} y={20}>
          <p
            className="font-medium uppercase tracking-wide leading-[1.05] mb-2"
            style={{ color: '#D7E2EA', fontSize: 'clamp(1.4rem, 2.8vw, 2.6rem)' }}
          >
            We don&apos;t tell stories.<br />
            <span className="hero-heading">We ship them.</span>
          </p>
        </FadeIn>

        {/* Two-line spec */}
        <FadeIn delay={0.40} y={20}>
          <p
            className="font-light uppercase tracking-wide leading-snug mt-4 mb-3"
            style={{ color: '#D7E2EA', opacity: 0.78, fontSize: 'clamp(0.78rem, 1.25vw, 1.1rem)' }}
          >
            AI-native studio. Brief on Monday — live by Friday.<br />
            Web in 72 hours. Apps in 5 days. Brand systems overnight.
          </p>
        </FadeIn>

        {/* "We don't / We do" creative trio */}
        <FadeIn delay={0.50} y={20}>
          <ul
            className="space-y-1.5 mb-6 md:mb-8"
            style={{ color: '#D7E2EA', fontSize: 'clamp(0.78rem, 1.2vw, 1.05rem)' }}
          >
            <li className="flex gap-3">
              <span style={{ color: '#BBCCD7', opacity: 0.5 }}>—</span>
              <span><span style={{ opacity: 0.55 }}>No decks.</span> Just shipped artifacts.</span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: '#BBCCD7', opacity: 0.5 }}>—</span>
              <span><span style={{ opacity: 0.55 }}>No retainers.</span> Pay for what landed.</span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: '#BBCCD7', opacity: 0.5 }}>—</span>
              <span><span style={{ opacity: 0.55 }}>No approval calls.</span> Drop the brief, we run.</span>
            </li>
          </ul>
        </FadeIn>

        {/* CTA + tiny secondary link */}
        <FadeIn delay={0.60} y={20}>
          <div className="flex flex-wrap items-center gap-5">
            <Magnet padding={120} strength={4}>
              <ContactButton to="/contact" label="Drop the Brief" />
            </Magnet>
            <Link
              to="/projects"
              className="uppercase font-medium tracking-widest"
              style={{ color: '#D7E2EA', opacity: 0.6, fontSize: '0.8rem' }}
            >
              See what we shipped →
            </Link>
          </div>
        </FadeIn>

        {/* Stat strip — receipts, not slogans */}
        <FadeIn delay={0.75} y={20}>
          <div
            className="mt-8 md:mt-10 pt-5 grid grid-cols-4 gap-3 md:gap-6"
            style={{ borderTop: '1px solid rgba(215,226,234,0.18)' }}
          >
            <Stat value="< 5d" label="Avg ship" />
            <Stat value="$49+" label="Starter" />
            <Stat value="24h"  label="First reply" />
            <Stat value="0"    label="Approval calls" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
