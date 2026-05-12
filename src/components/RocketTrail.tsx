import { useEffect, useRef, useState } from 'react'

/**
 * Rocket-comet cursor follower.
 *
 *   • A small SVG rocket sits AT the cursor, rotated to face the direction
 *     of motion.
 *   • A bright comet trail streams BEHIND the rocket in the opposite
 *     direction of motion: 18 dots, brand-coloured (orange→magenta→purple),
 *     fading and shrinking over distance.
 *   • Every layer has `pointer-events: none` and never affects clicks.
 *   • Disabled on touch devices.
 *
 * Z-stack: trail at 9996, rocket at 9997, custom cursor still on top.
 */

const TRAIL_LENGTH = 22

export default function RocketTrail() {
  const rocketRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const [enabled, setEnabled] = useState(true)
  const seenMouseRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setEnabled(false)
      return
    }

    const positions: { x: number; y: number }[] = []
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let lastAngle = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      seenMouseRef.current = true
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      // Don't render anything until the user has moved the mouse at least
      // once — prevents the rocket "floating in the middle" before first move
      if (!seenMouseRef.current) {
        raf = requestAnimationFrame(tick)
        return
      }

      positions.unshift({ x: mouseX, y: mouseY })
      if (positions.length > TRAIL_LENGTH) positions.pop()

      // Velocity over the last 4 frames → smoother rotation
      let dx = 0, dy = 0
      if (positions.length >= 4) {
        dx = positions[0].x - positions[3].x
        dy = positions[0].y - positions[3].y
      }
      const moving = Math.hypot(dx, dy) > 1.5

      if (moving) {
        const target = Math.atan2(dy, dx) * (180 / Math.PI)
        let delta = target - lastAngle
        while (delta > 180) delta -= 360
        while (delta < -180) delta += 360
        lastAngle = lastAngle + delta * 0.3
      }

      // Rocket sits at cursor, rotated toward motion
      if (rocketRef.current) {
        rocketRef.current.style.transform =
          `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(${lastAngle}deg)`
        rocketRef.current.style.opacity = moving ? '1' : '0.45'
      }

      // Trail dots — each shows a recorded position
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const el = trailRefs.current[i]
        if (!el) continue
        const p = positions[i]
        if (!p) {
          el.style.opacity = '0'
          continue
        }
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
        el.style.opacity = String(1 - i / TRAIL_LENGTH)
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      {/* Comet-trail dots — gradient fade, shrinking, blurring */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
        const t = i / (TRAIL_LENGTH - 1)
        const color = i < 6 ? '#FFFFFF' : i < 12 ? '#BE4C00' : i < 18 ? '#B600A8' : '#7621B0'
        const size = 22 - t * 17   // 22 → 5
        const blur = t * 3.2
        return (
          <div
            key={i}
            ref={(el) => { trailRefs.current[i] = el }}
            className="fixed top-0 left-0 pointer-events-none rounded-full"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop:  -size / 2,
              background: color,
              filter: `blur(${blur}px)`,
              boxShadow: `0 0 ${20 - i * 0.6}px ${color}`,
              opacity: 0,
              zIndex: 9996,
              willChange: 'transform, opacity',
            }}
          />
        )
      })}

      {/* Rocket icon AT cursor */}
      <div
        ref={rocketRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: 52,
          height: 52,
          marginLeft: -26,
          marginTop: -26,
          zIndex: 9997,
          willChange: 'transform, opacity',
          transition: 'opacity 200ms ease',
          opacity: 0,
          filter: 'drop-shadow(0 0 14px rgba(182,0,168,0.7))',
        }}
        aria-hidden="true"
      >
        <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
          <defs>
            <linearGradient id="rb" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#BE4C00" />
              <stop offset="50%"  stopColor="#B600A8" />
              <stop offset="100%" stopColor="#7621B0" />
            </linearGradient>
            <linearGradient id="rf" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%"  stopColor="#FFD27A" />
              <stop offset="100%" stopColor="#BE4C00" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Flame trailing the back (rocket points right at angle 0) */}
          <path d="M -2 18 L 8 14 L 9 18 L 8 22 Z" fill="url(#rf)" />

          {/* Body */}
          <path
            d="M 8 13.5 L 26 13.5 L 32 18 L 26 22.5 L 8 22.5 Z"
            fill="url(#rb)"
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="0.6"
          />
          {/* Window */}
          <circle cx="22" cy="18" r="2.2" fill="#ffffff" fillOpacity="0.95" />
          {/* Top fin */}
          <path d="M 13 13.5 L 10 9 L 16 13.5 Z" fill="#7621B0" />
          {/* Bottom fin */}
          <path d="M 13 22.5 L 10 27 L 16 22.5 Z" fill="#7621B0" />
        </svg>
      </div>
    </>
  )
}
