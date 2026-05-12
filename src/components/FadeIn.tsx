import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  as?: 'div' | 'span' | 'section' | 'h1' | 'h2' | 'p'
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  as = 'div',
}: Props) {
  const Component = motion[as] as typeof motion.div
  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
