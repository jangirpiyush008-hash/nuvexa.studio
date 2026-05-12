import { RefObject, useEffect } from 'react'

interface RevealOptions {
  /** Remove the class when element leaves viewport (default: false = stays visible) */
  once?: boolean
  /** How much of the element must be visible to trigger (0–1, default 0.4) */
  threshold?: number
}

/**
 * Attaches an IntersectionObserver that adds/removes the "visible" CSS class,
 * enabling CSS-only scroll-reveal transitions (.reveal, .reveal-left, .reveal-scale).
 */
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  { once = false, threshold = 0.4 }: RevealOptions = {}
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          if (once) obs.disconnect()
        } else if (!once) {
          el.classList.remove('visible')
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, once, threshold])
}
