import { ReactNode, useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  cubicBezier,
  MotionValue,
} from 'framer-motion'

/**
 * Reusable scroll-snap + sticky-flip deck.
 *
 * Each child is one slide, full-viewport. As the user scrolls:
 *   • CSS scroll-snap forces the page to snap to one slide per scroll page.
 *   • A spring smooths the scroll progress before driving slide animations.
 *   • Each slide eases in from below + eases out upward at slot boundaries.
 *
 * Usage:
 *   <FlipDeck slides={[
 *     <SlideOne />,
 *     <SlideTwo />,
 *   ]} />
 *
 * The wrapper is `slides.length × 100vh` tall. The sticky inner pin holds
 * the viewport stationary while slides cycle.
 */
export default function FlipDeck({
  slides,
  showCounter = true,
}: {
  slides: ReactNode[]
  showCounter?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const total = slides.length

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 36,
    restDelta: 0.0005,
  })

  // Apply scroll-snap on <html> while this deck is mounted, restore on unmount
  useEffect(() => {
    const root = document.documentElement
    const prevSnap = root.style.scrollSnapType
    const prevBehavior = root.style.scrollBehavior
    root.style.scrollSnapType = 'y mandatory'
    root.style.scrollBehavior = 'smooth'
    return () => {
      root.style.scrollSnapType = prevSnap
      root.style.scrollBehavior = prevBehavior
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative z-10"
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {slides.map((node, i) => (
          <SlideShell key={i} progress={smoothProgress} index={i} total={total}>
            {node}
          </SlideShell>
        ))}
        {showCounter && <SlideCounter progress={smoothProgress} total={total} />}
      </div>

      {/* Snap markers — one per 100vh slot */}
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={`snap-${i}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: `${i * 100}vh`,
            left: 0,
            width: 1,
            height: '100vh',
            pointerEvents: 'none',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        />
      ))}
    </div>
  )
}

const EASE = cubicBezier(0.65, 0, 0.35, 1)

function SlideShell({
  children,
  progress,
  index,
  total,
}: {
  children: ReactNode
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const slotStart = index / total
  const slotEnd   = (index + 1) / total
  const isFirst   = index === 0
  const isLast    = index === total - 1
  // 40% of a slot is transition, 60% holds.
  const dur = 0.4 / total

  let inputs: number[]
  let yValues: number[]
  let opacityValues: number[]
  let easeArr: ((t: number) => number)[]

  if (isFirst && isLast) {
    inputs = [0, 1]; yValues = [0, 0]; opacityValues = [1, 1]; easeArr = [EASE]
  } else if (isFirst) {
    inputs = [slotStart, slotEnd - dur, slotEnd]
    yValues = [0, 0, -100]
    opacityValues = [1, 1, 0]
    easeArr = [EASE, EASE]
  } else if (isLast) {
    inputs = [slotStart - dur, slotStart, 1]
    yValues = [100, 0, 0]
    opacityValues = [0, 1, 1]
    easeArr = [EASE, EASE]
  } else {
    inputs = [slotStart - dur, slotStart, slotEnd - dur, slotEnd]
    yValues = [100, 0, 0, -100]
    opacityValues = [0, 1, 1, 0]
    easeArr = [EASE, EASE, EASE]
  }

  const yPct = useTransform(progress, inputs, yValues, { ease: easeArr })
  const transform = useMotionTemplate`translateY(${yPct}%)`
  const opacity = useTransform(progress, inputs, opacityValues, { ease: easeArr })

  return (
    <motion.div
      style={{ transform, opacity }}
      className="absolute inset-0 will-change-transform"
    >
      {children}
    </motion.div>
  )
}

function SlideCounter({
  progress,
  total,
}: {
  progress: MotionValue<number>
  total: number
}) {
  const label = useTransform(progress, (p) => {
    const i = Math.min(total - 1, Math.floor(p * total))
    return `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
  })
  return (
    <div
      className="absolute top-8 right-8 md:top-10 md:right-12 uppercase pointer-events-none"
      style={{ color: '#BBCCD7', opacity: 0.55, letterSpacing: '0.4em', fontSize: '0.7rem', zIndex: 5 }}
    >
      <motion.span>{label}</motion.span>
    </div>
  )
}
