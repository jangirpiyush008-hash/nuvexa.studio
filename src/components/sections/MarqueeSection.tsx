import { useEffect, useRef, useState } from 'react'

/**
 * Marquee with animated SVG cards — each card represents what we ship.
 * Sliding past horizontally based on scroll position.
 * No external images; pure SVG + CSS keyframes = instant + always works.
 */

type CardKind =
  | 'web' | 'mobile' | 'brand' | 'automation'
  | 'motion' | 'ai' | 'startup' | 'commerce'

interface Card { kind: CardKind; label: string; sub: string }

const ROW_1: Card[] = [
  { kind: 'web',        label: 'Web Builds',     sub: '72 Hours' },
  { kind: 'mobile',     label: 'Mobile Apps',    sub: '5 Days' },
  { kind: 'brand',      label: 'Brand Systems',  sub: 'Overnight' },
  { kind: 'ai',         label: 'AI Workflows',   sub: 'Always-on' },
]
const ROW_2: Card[] = [
  { kind: 'automation', label: 'Automation',     sub: 'Set & Forget' },
  { kind: 'motion',     label: 'Motion',         sub: 'In Frame' },
  { kind: 'startup',    label: 'MVPs',           sub: 'Idea → Live' },
  { kind: 'commerce',   label: 'Commerce',       sub: 'INR / USD' },
]

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const o = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      setOffset(o)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="pt-24 sm:pt-32 md:pt-40 pb-10"
      style={{ backgroundColor: '#0C0C0C', overflow: 'hidden' }}
    >
      <Row tiles={[...ROW_1, ...ROW_1, ...ROW_1]} translate={offset - 200} className="mb-3" />
      <Row tiles={[...ROW_2, ...ROW_2, ...ROW_2]} translate={-(offset - 200)} />
    </section>
  )
}

function Row({ tiles, translate, className = '' }: { tiles: Card[]; translate: number; className?: string }) {
  return (
    <div
      className={`flex gap-3 ${className}`}
      style={{ transform: `translateX(${translate}px)`, willChange: 'transform' }}
    >
      {tiles.map((c, i) => (
        <CardTile key={i} card={c} />
      ))}
    </div>
  )
}

function CardTile({ card }: { card: Card }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex-shrink-0 relative"
      style={{
        width: 420,
        height: 270,
        background:
          'linear-gradient(135deg, rgba(118,33,176,0.18) 0%, rgba(12,12,12,1) 50%, rgba(190,76,0,0.10) 100%)',
        border: '1px solid rgba(215,226,234,0.14)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Illustration kind={card.kind} />
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
        <p
          className="font-bold uppercase tracking-tight"
          style={{ color: '#D7E2EA', fontSize: '1.05rem', letterSpacing: '0.04em' }}
        >
          {card.label}
        </p>
        <p
          className="uppercase"
          style={{ color: '#BBCCD7', opacity: 0.7, fontSize: '0.65rem', letterSpacing: '0.3em' }}
        >
          {card.sub}
        </p>
      </div>
    </div>
  )
}

/* ─── Animated SVG illustrations ─────────────────────────────────────────── */
function Illustration({ kind }: { kind: CardKind }) {
  switch (kind) {
    case 'web':        return <WebIllo />
    case 'mobile':     return <MobileIllo />
    case 'brand':      return <BrandIllo />
    case 'ai':         return <AIIllo />
    case 'automation': return <AutomationIllo />
    case 'motion':     return <MotionIllo />
    case 'startup':    return <StartupIllo />
    case 'commerce':   return <CommerceIllo />
  }
}

const STROKE = '#BBCCD7'
const ACCENT = '#B600A8'
const ACCENT2 = '#7621B0'

function WebIllo() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      <rect x="14" y="14" width="152" height="92" rx="6" stroke={STROKE} strokeWidth="1.4" opacity="0.6" />
      <line x1="14" y1="32" x2="166" y2="32" stroke={STROKE} strokeWidth="1" opacity="0.4" />
      <circle cx="22" cy="23" r="2" fill={STROKE} opacity="0.7" />
      <circle cx="30" cy="23" r="2" fill={STROKE} opacity="0.7" />
      <circle cx="38" cy="23" r="2" fill={STROKE} opacity="0.7" />
      <rect x="24" y="44" width="64" height="6" rx="3" fill={STROKE} opacity="0.8">
        <animate attributeName="width" values="20;64;20" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="24" y="58" width="120" height="4" rx="2" fill={STROKE} opacity="0.35" />
      <rect x="24" y="68" width="100" height="4" rx="2" fill={STROKE} opacity="0.35" />
      <rect x="24" y="84" width="46" height="14" rx="3" fill={ACCENT}>
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

function MobileIllo() {
  return (
    <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
      <rect x="20" y="8" width="80" height="144" rx="14" stroke={STROKE} strokeWidth="1.4" opacity="0.6" />
      <rect x="44" y="14" width="32" height="3" rx="1.5" fill={STROKE} opacity="0.4" />
      <rect x="28" y="28" width="64" height="22" rx="4" fill={STROKE} opacity="0.20">
        <animate attributeName="y" values="28;26;28" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="58" width="64" height="22" rx="4" fill={STROKE} opacity="0.16">
        <animate attributeName="y" values="58;60;58" dur="3s" begin="0.4s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="88" width="64" height="22" rx="4" fill={ACCENT2} opacity="0.55">
        <animate attributeName="opacity" values="0.55;0.85;0.55" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="118" width="64" height="22" rx="4" fill={STROKE} opacity="0.16">
        <animate attributeName="y" values="118;120;118" dur="3s" begin="0.8s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

function BrandIllo() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      <circle cx="50" cy="60" r="22" fill={ACCENT}>
        <animate attributeName="r" values="20;24;20" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="60" r="22" fill={ACCENT2}>
        <animate attributeName="r" values="24;20;24" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="60" r="22" fill="#BE4C00">
        <animate attributeName="r" values="20;24;20" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      <text x="138" y="48" fill={STROKE} fontSize="14" fontWeight="900" fontFamily="Kanit">N</text>
      <text x="138" y="64" fill={STROKE} fontSize="14" fontWeight="900" fontFamily="Kanit" opacity="0.7">U</text>
      <text x="138" y="80" fill={STROKE} fontSize="14" fontWeight="900" fontFamily="Kanit" opacity="0.5">V</text>
    </svg>
  )
}

function AIIllo() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      {/* Three layers of nodes */}
      {[
        [40, 30], [40, 60], [40, 90],
        [90, 22], [90, 52], [90, 82], [90, 112],
        [140, 30], [140, 60], [140, 90],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={STROKE} opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Connecting lines */}
      {[
        ['40,30','90,22'],['40,30','90,52'],
        ['40,60','90,52'],['40,60','90,82'],
        ['40,90','90,82'],['40,90','90,112'],
        ['90,22','140,30'],['90,52','140,60'],
        ['90,82','140,60'],['90,82','140,90'],
        ['90,112','140,90'],
      ].map((pts, i) => (
        <line key={i} x1={pts[0].split(',')[0]} y1={pts[0].split(',')[1]} x2={pts[1].split(',')[0]} y2={pts[1].split(',')[1]} stroke={STROKE} strokeWidth="0.7" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur="3s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
        </line>
      ))}
    </svg>
  )
}

function AutomationIllo() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      <rect x="16" y="48" width="36" height="24" rx="4" stroke={STROKE} strokeWidth="1.2" opacity="0.7" />
      <rect x="72" y="22" width="36" height="24" rx="4" stroke={STROKE} strokeWidth="1.2" opacity="0.7" />
      <rect x="72" y="74" width="36" height="24" rx="4" stroke={STROKE} strokeWidth="1.2" opacity="0.7" />
      <rect x="128" y="48" width="36" height="24" rx="4" stroke={STROKE} strokeWidth="1.2" opacity="0.7" />
      {/* lines */}
      <path d="M 52 60 L 72 34" stroke={STROKE} strokeWidth="1" opacity="0.4" />
      <path d="M 52 60 L 72 86" stroke={STROKE} strokeWidth="1" opacity="0.4" />
      <path d="M 108 34 L 128 60" stroke={STROKE} strokeWidth="1" opacity="0.4" />
      <path d="M 108 86 L 128 60" stroke={STROKE} strokeWidth="1" opacity="0.4" />
      {/* travelling dots */}
      <circle r="3" fill={ACCENT}>
        <animateMotion dur="2.5s" repeatCount="indefinite" path="M 34 60 L 72 34 L 108 34 L 146 60" />
      </circle>
      <circle r="3" fill={ACCENT2}>
        <animateMotion dur="2.8s" repeatCount="indefinite" path="M 34 60 L 72 86 L 108 86 L 146 60" begin="1.4s" />
      </circle>
    </svg>
  )
}

function MotionIllo() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      <path d="M 14 60 Q 47 20 90 60 T 166 60" stroke={STROKE} strokeWidth="1.5" opacity="0.5" fill="none">
        <animate attributeName="d" dur="4s" repeatCount="indefinite"
          values="M 14 60 Q 47 20 90 60 T 166 60;
                  M 14 60 Q 47 100 90 60 T 166 60;
                  M 14 60 Q 47 20 90 60 T 166 60" />
      </path>
      <path d="M 14 70 Q 47 30 90 70 T 166 70" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" fill="none">
        <animate attributeName="d" dur="4s" begin="0.5s" repeatCount="indefinite"
          values="M 14 70 Q 47 30 90 70 T 166 70;
                  M 14 70 Q 47 110 90 70 T 166 70;
                  M 14 70 Q 47 30 90 70 T 166 70" />
      </path>
      <circle cx="14" cy="60" r="3" fill={STROKE} />
      <circle cx="166" cy="60" r="3" fill={STROKE} />
    </svg>
  )
}

function StartupIllo() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 4; 0 -4; 0 4" dur="2.5s" repeatCount="indefinite" />
        <path d="M 80 20 L 96 60 L 80 56 L 64 60 Z" fill={ACCENT} />
        <path d="M 80 56 L 96 60 L 88 100 L 80 92 Z" fill={ACCENT2} />
        <path d="M 80 56 L 64 60 L 72 100 L 80 92 Z" fill="#BE4C00" />
        <circle cx="80" cy="40" r="4" fill={STROKE} />
      </g>
      {/* exhaust trail */}
      <line x1="76" y1="100" x2="76" y2="140" stroke={ACCENT} strokeWidth="2" opacity="0.5">
        <animate attributeName="y2" values="100;140;100" dur="0.8s" repeatCount="indefinite" />
      </line>
      <line x1="84" y1="100" x2="84" y2="140" stroke={ACCENT2} strokeWidth="2" opacity="0.5">
        <animate attributeName="y2" values="100;140;100" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
      </line>
    </svg>
  )
}

function CommerceIllo() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      <rect x="40" y="30" width="100" height="70" rx="6" stroke={STROKE} strokeWidth="1.4" opacity="0.6" />
      <text x="90" y="68" fill={ACCENT} fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="Kanit">
        ₹
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </text>
      <text x="120" y="68" fill={ACCENT2} fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="Kanit">
        $
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </text>
      <rect x="60" y="84" width="60" height="6" rx="3" fill={STROKE} opacity="0.3" />
    </svg>
  )
}
