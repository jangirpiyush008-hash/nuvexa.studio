import { ReactNode, useEffect, useRef, useState } from 'react'

interface Props {
  children: ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

/**
 * Mouse-following magnetic effect. Tracks pointer relative to element
 * centre and applies translate3d divided by `strength`. Activates only
 * when cursor is within `padding` of the element edge.
 */
export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf: number | null = null
    const onMove = (e: MouseEvent) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const within =
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (within) {
          setActive(true)
          el.style.transition = activeTransition
          el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`
        } else if (active) {
          setActive(false)
          el.style.transition = inactiveTransition
          el.style.transform = 'translate3d(0, 0, 0)'
        }
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [padding, strength, activeTransition, inactiveTransition, active])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
