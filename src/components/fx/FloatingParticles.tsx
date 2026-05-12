import { useEffect, useRef } from 'react'

/**
 * Very subtle canvas particles. Sparse — ~28 dots at most.
 * Off on touch, small screens, or prefers-reduced-motion.
 */
export default function FloatingParticles({ count = 28 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 768px)').matches
    ) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number | null = null
    let running = true
    let w = (canvas.width = window.innerWidth * window.devicePixelRatio)
    let h = (canvas.height = window.innerHeight * window.devicePixelRatio)
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'

    const parts = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.4 + 0.4) * window.devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.15 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.15 * window.devicePixelRatio,
      a: Math.random() * 0.35 + 0.1,
    }))

    const onResize = () => {
      w = canvas.width = window.innerWidth * window.devicePixelRatio
      h = canvas.height = window.innerHeight * window.devicePixelRatio
    }
    window.addEventListener('resize', onResize)

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.fillStyle = `rgba(187, 204, 215, ${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (running) raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  )
}
