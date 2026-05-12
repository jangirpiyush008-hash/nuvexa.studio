import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Wraps children and translates them based on scroll (parallax).
 * Pure transform, GPU-friendly. Respects reduced-motion.
 */
export default function ParallaxBackground({
  children,
  speed = 0.25,
  className,
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -200 * speed])
  const y = useSpring(yRaw, { stiffness: 80, damping: 20, mass: 0.4 })

  return (
    <div ref={ref} className={className} style={{ position: 'relative' }}>
      <motion.div style={reduce ? undefined : { y, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  )
}
