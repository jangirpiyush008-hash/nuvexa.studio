/**
 * Shared canvas helpers — keep all background animations cheap:
 *  • Theme reader (CSS vars → HSL strings)         — adapts to .dark toggle
 *  • Frame-throttled RAF (default 30fps)           — halves CPU vs 60fps
 *  • Offscreen pre-render builder                  — one-time draw, blit each frame
 *  • Single hsl() helper                           — no per-frame template strings
 *  • Visibility + IntersectionObserver gating      — pauses fully when off-screen
 */

export interface Theme {
  primary: string  // "119 99% 46%"
  fg: string
  heroBg: string
  tint1: string
  tint2: string
  faceL: string
  faceR: string
  vignette: string
  vignetteA: number
  lineA: number
  fillA: number
  isDark: boolean
}

const cssVar = (s: CSSStyleDeclaration, k: string, fallback: string) =>
  s.getPropertyValue(k).trim() || fallback

const cssNum = (s: CSSStyleDeclaration, k: string, fallback: number) => {
  const v = parseFloat(s.getPropertyValue(k))
  return Number.isFinite(v) ? v : fallback
}

export function readTheme(): Theme {
  const s = getComputedStyle(document.documentElement)
  return {
    primary:   cssVar(s, '--primary',         '119 99% 46%'),
    fg:        cssVar(s, '--foreground',      '0 0% 96%'),
    heroBg:    cssVar(s, '--hero-bg',         '0 0% 8%'),
    tint1:     cssVar(s, '--canvas-tint-1',   '119 30% 4%'),
    tint2:     cssVar(s, '--canvas-tint-2',   '0 0% 6%'),
    faceL:     cssVar(s, '--canvas-face-l',   '0 0% 12%'),
    faceR:     cssVar(s, '--canvas-face-r',   '0 0% 8%'),
    vignette:  cssVar(s, '--canvas-vignette', '0 0% 0%'),
    vignetteA: cssNum(s, '--canvas-vignette-a', 0.55),
    lineA:     cssNum(s, '--canvas-line-a',     0.04),
    fillA:     cssNum(s, '--canvas-fill-a',     0.18),
    isDark:    document.documentElement.classList.contains('dark'),
  }
}

/** Build an `hsla()` string with a comma-separated H S% L% triplet. */
export const hsl = (triplet: string, a = 1) =>
  `hsla(${triplet.replace(/\s+/g, ',')},${a})`

/**
 * Throttle a render fn to ~targetFps. Returns a frame callback for use with RAF.
 * Skips frames when wall-clock interval is below the target.
 */
export function makeThrottle(targetFps: number) {
  const minDelta = 1000 / targetFps - 2 // slight slack
  let last = 0
  return (now: number, draw: (dtSec: number) => void) => {
    if (now - last < minDelta) return
    const dt = last === 0 ? 1 / targetFps : Math.min(0.05, (now - last) / 1000)
    last = now
    draw(dt)
  }
}

/**
 * Resize a canvas for hi-DPI; returns CSS-pixel dimensions and the dpr.
 * Call once on mount and again on resize.
 */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const W = canvas.offsetWidth
  const H = canvas.offsetHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2) // cap dpr at 2 — saves a lot
  canvas.width  = W * dpr
  canvas.height = H * dpr
  return { W, H, dpr }
}

/** Create an offscreen canvas pre-rendered with `paint`. CSS pixels. */
export function preRender(W: number, H: number, dpr: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = W * dpr; c.height = H * dpr
  const ctx = c.getContext('2d')!
  ctx.scale(dpr, dpr)
  paint(ctx)
  return c
}

/**
 * Bind IntersectionObserver + Page Visibility + html.dark MutationObserver
 * to a canvas with a (re-)init function and a per-frame draw function.
 * Returns a cleanup fn.
 */
export function bindAnimatedCanvas(opts: {
  canvas: HTMLCanvasElement
  fps?: number
  init: (theme: Theme) => void
  draw: (now: number, theme: Theme) => void
  /** Optional gate — return false to keep the loop paused even when visible (e.g. only on home route) */
  enabled?: () => boolean
}) {
  const { canvas, init, draw, fps = 30, enabled } = opts
  let theme = readTheme()
  init(theme)

  const minDelta = 1000 / fps - 2
  let last = 0
  let raf = 0
  let running = false

  const loop = (now: number) => {
    if (!running) return
    if (now - last >= minDelta) {
      last = now
      draw(now, theme)
    }
    raf = requestAnimationFrame(loop)
  }
  const start = () => {
    if (running) return
    if (enabled && !enabled()) return
    running = true
    last = 0
    raf = requestAnimationFrame(loop)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  const onVis = () => (document.visibilityState === 'hidden' ? stop() : start())
  document.addEventListener('visibilitychange', onVis)

  const obs = new IntersectionObserver(
    ([e]) => (e.isIntersecting ? start() : stop()),
    { threshold: 0 }
  )
  obs.observe(canvas)

  // Re-init when theme toggles (.dark toggled on <html>)
  const themeObs = new MutationObserver(() => {
    theme = readTheme()
    init(theme)
  })
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  const onResize = () => init(theme)
  window.addEventListener('resize', onResize)

  return () => {
    stop()
    obs.disconnect()
    themeObs.disconnect()
    document.removeEventListener('visibilitychange', onVis)
    window.removeEventListener('resize', onResize)
  }
}
