import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface Props {
  text: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Character-by-character scroll-driven reveal — each character interpolates
 * opacity 0.2 → 1 based on its position relative to scroll progress.
 */
export default function AnimatedText({ text, className = '', style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = text.split('')

  return (
    <p ref={ref} className={className} style={{ position: 'relative', ...style }}>
      {chars.map((char, i) => (
        <Char key={i} progress={scrollYProgress} index={i} total={chars.length}>
          {char}
        </Char>
      ))}
    </p>
  )
}

function Char({
  children,
  progress,
  index,
  total,
}: {
  children: React.ReactNode
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const start = index / total
  const end = (index + 4) / total
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{ opacity: 0 }}>{children}</span>
      <motion.span style={{ opacity, position: 'absolute', left: 0, top: 0 }}>
        {children}
      </motion.span>
    </span>
  )
}
