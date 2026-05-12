import { useEffect, useRef, useState } from 'react'

/**
 * Custom cursor — round transparent ring with site-theme border (#BBCCD7).
 * Grows large + tints when hovering interactive elements.
 * rAF-throttled. Disabled on touch devices. Styles live in index.css.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef  = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setEnabled(false)
      return
    }

    const ring = ringRef.current
    const dot  = dotRef.current
    if (!ring || !dot) return

    let pendingX = 0, pendingY = 0
    let rafQ = false
    const move = (e: MouseEvent) => {
      pendingX = e.clientX
      pendingY = e.clientY
      if (!rafQ) {
        rafQ = true
        requestAnimationFrame(() => {
          const rh = ring.offsetWidth / 2
          const dh = dot.offsetWidth / 2
          ring.style.transform = `translate(${pendingX - rh}px, ${pendingY - rh}px)`
          dot.style.transform  = `translate(${pendingX - dh}px, ${pendingY - dh}px)`
          rafQ = false
        })
      }
    }

    let hoverRaf = false
    let pendingHover: boolean | null = null
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'
      )
      pendingHover = !!interactive
      if (!hoverRaf) {
        hoverRaf = true
        requestAnimationFrame(() => {
          if (pendingHover !== null) {
            ring.classList.toggle('hovered', pendingHover)
            dot.classList.toggle('hovered', pendingHover)
          }
          hoverRaf = false
          pendingHover = null
        })
      }
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.body.style.cursor = ''
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef}  className="custom-cursor-dot"  aria-hidden="true" />
    </>
  )
}
