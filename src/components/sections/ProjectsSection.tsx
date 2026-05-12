import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface Proj {
  n: string
  category: string
  name: string
  blurb: string
  href?: string
  imgs: [string, string, string]
}

const PROJECTS: Proj[] = [
  {
    n: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    blurb: 'A premium agency portfolio site built end-to-end in 72 hours.',
    href: '/projects',
    imgs: [
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80&auto=format&fit=crop',
    ],
  },
  {
    n: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    blurb: 'Full brand system — logotype, motion, ad creatives, in 5 days.',
    href: '/projects',
    imgs: [
      'https://images.unsplash.com/photo-1545665277-5937489579f2?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80&auto=format&fit=crop',
    ],
  },
  {
    n: '03',
    category: 'Client',
    name: 'Solaris Digital',
    blurb: 'A storefront + Razorpay integration shipped over a single weekend.',
    href: '/projects',
    imgs: [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop',
    ],
  },
]

/**
 * Pinned-flip pattern:
 *   • The whole section container is N × 100vh tall.
 *   • The visible viewport area is sticky (top:0, h:100vh).
 *   • Inside the sticky area, the "Projects" heading + status row stays
 *     fixed and ALL project cards are absolute-stacked, fading to swap.
 *   • Each card holds full opacity for ~80% of its slot, fades hard at edges.
 *
 * Visually it reads as: heading pinned at top → big card area below →
 * scroll swaps the card without the layout actually moving.
 */
export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section style={{ backgroundColor: '#0C0C0C' }}>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${PROJECTS.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
          {/* Compact pinned heading row */}
          <div className="flex items-center justify-between px-6 md:px-12 pt-24 md:pt-28 pb-2 flex-shrink-0">
            <h2
              className="hero-heading font-black uppercase tracking-tight"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)', lineHeight: 1 }}
            >
              Projects
            </h2>
            <div className="flex items-center gap-2">
              {PROJECTS.map((_, i) => (
                <DotIndicator key={i} progress={scrollYProgress} index={i} total={PROJECTS.length} />
              ))}
            </div>
          </div>

          {/* Card stack — fade + slide swap */}
          <div className="flex-1 relative px-5 sm:px-8 md:px-10 pb-8 md:pb-12">
            {PROJECTS.map((p, i) => (
              <Card
                key={p.n}
                project={p}
                progress={scrollYProgress}
                index={i}
                total={PROJECTS.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DotIndicator({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  const slotStart = index / total
  const slotEnd   = (index + 1) / total
  const opacity = useTransform(progress, (p) => (p >= slotStart && p < slotEnd) ? 1 : 0.35)
  const scale   = useTransform(progress, (p) => (p >= slotStart && p < slotEnd) ? 1.4 : 1)
  return (
    <motion.div
      style={{ opacity, scale, backgroundColor: '#BBCCD7', width: 8, height: 8 }}
      className="rounded-full"
      role="presentation"
    />
  )
}

function Card({
  project,
  progress,
  index,
  total,
}: {
  project: Proj
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const slotStart = index / total
  const slotEnd   = (index + 1) / total
  const fadeInEnd = slotStart + (slotEnd - slotStart) * 0.12
  const fadeOutSt = slotStart + (slotEnd - slotStart) * 0.88
  const isLast = index === total - 1

  const inputs = [slotStart, fadeInEnd, fadeOutSt, slotEnd]
  const opacity = useTransform(progress, inputs, isLast ? [0, 1, 1, 1] : [0, 1, 1, 0])
  const y       = useTransform(progress, inputs, [50, 0, 0, isLast ? 0 : -50])

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div
        className="w-full max-w-7xl rounded-[28px] sm:rounded-[40px] md:rounded-[50px] p-4 sm:p-5 md:p-7"
        style={{ backgroundColor: '#0C0C0C', border: '2px solid #D7E2EA' }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 min-w-0">
            <div
              className="font-black flex-shrink-0"
              style={{ color: '#D7E2EA', fontSize: 'clamp(2.25rem, 5vw, 70px)', lineHeight: 1 }}
            >
              {project.n}
            </div>
            <div className="min-w-0">
              <p
                className="uppercase mb-1 truncate"
                style={{ color: '#888', fontSize: 'clamp(0.65rem, 0.95vw, 0.85rem)', letterSpacing: '0.2em' }}
              >
                {project.category}
              </p>
              <h3
                className="font-medium truncate"
                style={{ color: '#D7E2EA', fontSize: 'clamp(1.15rem, 2vw, 1.75rem)', lineHeight: 1.1 }}
              >
                {project.name}
              </h3>
              <p
                className="mt-1 font-light line-clamp-1"
                style={{ color: '#D7E2EA', opacity: 0.55, fontSize: 'clamp(0.8rem, 1vw, 0.95rem)' }}
              >
                {project.blurb}
              </p>
            </div>
          </div>
          <a
            href={project.href || '#'}
            className="live-pill px-5 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm flex-shrink-0 hidden sm:inline-block"
          >
            Live Project
          </a>
        </div>

        {/* Image grid */}
        <div className="flex gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4" style={{ width: '40%' }}>
            <img
              src={project.imgs[0]} alt="" loading="lazy" decoding="async"
              className="w-full object-cover rounded-[20px] sm:rounded-[28px] md:rounded-[36px]"
              style={{ height: 'clamp(90px, 12vw, 150px)' }}
            />
            <img
              src={project.imgs[1]} alt="" loading="lazy" decoding="async"
              className="w-full object-cover rounded-[20px] sm:rounded-[28px] md:rounded-[36px]"
              style={{ height: 'clamp(120px, 16vw, 220px)' }}
            />
          </div>
          <div className="flex-1">
            <img
              src={project.imgs[2]} alt="" loading="lazy" decoding="async"
              className="w-full h-full object-cover rounded-[20px] sm:rounded-[28px] md:rounded-[36px]"
              style={{ minHeight: 'clamp(220px, 28vw, 380px)' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
