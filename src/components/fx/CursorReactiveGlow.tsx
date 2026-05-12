import { useEffect, useRef } from 'react'

/**
 * A radial gradient that follows the cursor with lerp inertia.
 * - Pure rAF + ref-based DOM mutation. No setState per mousemove.
 * - Disabled on touch / reduced-motion / small screens.
 */
export default function CursorReactiveGlow({
  size = 600,
  color = 'rgba(118, 33, 176, 0.18)',
  blend = 'screen',
}: {
  size?: number
  color?: string
  blend?: React.CSSProperties['mixBlendMode']
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    if (reduce) return

    const el = ref.current
    if (!el) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let raf: number | null = null
    let running = true

    const tick = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      el.style.transform = `translate3d(${currentX - size / 2}px, ${currentY - size / 2}px, 0)`
      if (running) raf = requestAnimationFrame(tick)
    }
    tick()

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      running = false
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [size])

  return (
    <div
      aria-hidden
      ref={ref}
      className="pointer-events-none fixed top-0 left-0"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 60%)`,
        mixBlendMode: blend,
        willChange: 'transform',
        zIndex: 1,
      }}
    />
  )
}
