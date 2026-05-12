import { useEffect, useRef } from 'react'
import { Theme, fitCanvas, preRender, hsl, bindAnimatedCanvas } from '@/lib/canvas-helpers'

/**
 * AcademyBackground — cosmic / constellation aesthetic.
 * CPU-light strategy:
 *   • 30fps cap
 *   • Static layer (gradient + grid + faint stars + vignette) pre-rendered ONCE
 *   • Compass dial (with all 72 ticks) pre-rendered ONCE to a square offscreen, then rotated cheaply via ctx.rotate
 *   • Animated layer = ~25 twinkling stars + 3 constellation polylines + 4 fireflies + 8 anchor pulses
 */

const STARS: [number, number][] = [
  [0.08, 0.10],[0.24, 0.15],[0.42, 0.12],[0.60, 0.20],[0.78, 0.10],[0.92, 0.22],
  [0.15, 0.32],[0.34, 0.42],[0.55, 0.34],[0.74, 0.40],[0.88, 0.35],
  [0.20, 0.55],[0.42, 0.62],[0.62, 0.58],[0.82, 0.66],
  [0.10, 0.78],[0.30, 0.84],[0.50, 0.78],[0.70, 0.82],[0.90, 0.76],
  [0.04, 0.45],[0.96, 0.52],[0.50, 0.04],[0.50, 0.96],[0.04, 0.92],
]

const CONSTELLATIONS: number[][] = [
  [0, 1, 6, 11, 7, 0],         // Scholar
  [4, 5, 10, 21, 14, 13, 4],   // Architect
  [8, 12, 17, 18, 13, 8],      // Engine
]
const ANCHORS = [0, 1, 6, 4, 10, 13, 17, 23]

interface Star { x: number; y: number; phase: number; freq: number; r: number }
interface Anchor { x: number; y: number; phase: number }
interface Fly { x: number; y: number; vy: number; size: number; phase: number }

interface Scene {
  W: number; H: number; dpr: number
  bg: HTMLCanvasElement
  compass: HTMLCanvasElement   // square pre-rendered dial
  compassR: number             // half size
  stars: Star[]
  anchors: Anchor[]
  flies: Fly[]
}

function buildStatic(W: number, H: number, dpr: number, theme: Theme) {
  return preRender(W, H, dpr, (ctx) => {
    // Subtle vertical gradient
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, hsl(theme.heroBg, 1))
    g.addColorStop(0.5, hsl(theme.tint1, 1))
    g.addColorStop(1, hsl(theme.heroBg, 1))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    // Faint grid (160px)
    ctx.strokeStyle = hsl(theme.primary, theme.lineA * 0.8)
    ctx.lineWidth = 0.5
    for (let x = 0; x < W; x += 160) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 0; y < H; y += 160) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // ~80 background pin-prick stars (static, won't twinkle)
    ctx.fillStyle = hsl(theme.primary, theme.lineA * 4)
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * W, y = Math.random() * H
      ctx.beginPath(); ctx.arc(x, y, Math.random() < 0.2 ? 1 : 0.6, 0, Math.PI * 2); ctx.fill()
    }

    // Vignette
    const vg = ctx.createLinearGradient(0, 0, 0, H)
    vg.addColorStop(0,   hsl(theme.vignette, theme.vignetteA * 0.5))
    vg.addColorStop(0.5, hsl(theme.vignette, 0))
    vg.addColorStop(1,   hsl(theme.vignette, theme.vignetteA))
    ctx.fillStyle = vg
    ctx.fillRect(0, 0, W, H)
  })
}

function buildCompass(size: number, dpr: number, theme: Theme) {
  return preRender(size, size, dpr, (ctx) => {
    const c = size / 2
    ctx.translate(c, c)
    // Outer dashed circle
    ctx.strokeStyle = hsl(theme.primary, 0.13)
    ctx.lineWidth = 0.6
    ctx.setLineDash([2, 10])
    ctx.beginPath(); ctx.arc(0, 0, c - 8, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([])
    // 72 tick marks
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2
      const major = i % 6 === 0
      const r1 = c - 8
      const r2 = r1 - (major ? 26 : 12)
      ctx.beginPath()
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1)
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2)
      ctx.strokeStyle = hsl(theme.primary, 0.13)
      ctx.lineWidth = major ? 1.2 : 0.5
      ctx.stroke()
    }
    // Inner dashed circle
    ctx.strokeStyle = hsl(theme.primary, 0.10)
    ctx.setLineDash([3, 14])
    ctx.beginPath(); ctx.arc(0, 0, c * 0.55, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([])
  })
}

function buildScene(canvas: HTMLCanvasElement, theme: Theme): Scene {
  const { W, H, dpr } = fitCanvas(canvas)
  const bg = buildStatic(W, H, dpr, theme)
  const compassR = Math.min(W, H) * 0.50
  const compass = buildCompass(compassR * 2, dpr, theme)

  const stars: Star[] = STARS.map(([nx, ny], i) => ({
    x: nx * W, y: ny * H,
    phase: (i * 0.13) % (Math.PI * 2),
    freq: 0.5 + (i % 3) * 0.25,
    r: i % 5 === 0 ? 1.6 : 1.0,
  }))
  const anchors: Anchor[] = ANCHORS.map((idx, i) => ({
    x: STARS[idx][0] * W, y: STARS[idx][1] * H, phase: i * 0.5,
  }))
  const flies: Fly[] = Array.from({ length: 4 }, (_, i) => ({
    x: (0.15 + i * 0.22) * W,
    y: H + Math.random() * H,
    vy: -(0.4 + Math.random() * 0.3),
    size: 1.5 + Math.random(),
    phase: i * 1.3,
  }))

  return { W, H, dpr, bg, compass, compassR, stars, anchors, flies }
}

export default function AcademyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef  = useRef<Scene | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = (now: number, theme: Theme) => {
      const s = sceneRef.current!
      const t = now / 1000
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0)

      // Static background
      ctx.drawImage(s.bg, 0, 0, s.W, s.H)

      // Rotating compass — single drawImage with rotation
      ctx.save()
      ctx.translate(s.W / 2, s.H / 2)
      ctx.rotate(t * (Math.PI * 2 / 90))
      ctx.drawImage(s.compass, -s.compassR, -s.compassR, s.compassR * 2, s.compassR * 2)
      ctx.restore()

      // Twinkling stars
      for (const star of s.stars) {
        const a = 0.2 + 0.7 * Math.abs(Math.sin(t * star.freq + star.phase))
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, a)
        ctx.fill()
      }

      // Constellation lines — fade-in, hold, fade-out cycle
      const cyclesS = [11, 13, 12]
      const phases = [0, 3, 6]
      ctx.lineWidth = 0.8
      for (let ci = 0; ci < CONSTELLATIONS.length; ci++) {
        const dur = cyclesS[ci]
        const cyc = (t + phases[ci]) % dur
        let opacity = 0
        if (cyc < dur * 0.30)      opacity = (cyc / (dur * 0.30)) * 0.5
        else if (cyc < dur * 0.70) opacity = 0.5
        else                       opacity = ((dur - cyc) / (dur * 0.30)) * 0.5
        if (opacity <= 0) continue

        ctx.strokeStyle = hsl(theme.primary, opacity)
        ctx.beginPath()
        const pts = CONSTELLATIONS[ci]
        for (let i = 0; i < pts.length; i++) {
          const star = STARS[pts[i]]
          const x = star[0] * s.W, y = star[1] * s.H
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Anchor stars — pulsing core + halo (2 solid circles, no gradient)
      for (const an of s.anchors) {
        const pulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 0.7 + an.phase))
        const r = 2 + pulse * 2
        ctx.beginPath()
        ctx.arc(an.x, an.y, r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, pulse * 0.18)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(an.x, an.y, r, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, 0.5 + pulse * 0.5)
        ctx.fill()
      }

      // Fireflies
      for (const f of s.flies) {
        f.y += f.vy
        f.x += Math.sin(t * 0.9 + f.phase) * 0.4
        if (f.y < -8) { f.y = s.H + 4; f.x = Math.random() * s.W }
        const a = 0.5 + 0.4 * Math.abs(Math.sin(t + f.phase))
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, a * 0.12)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, a)
        ctx.fill()
      }
    }

    return bindAnimatedCanvas({
      canvas,
      fps: 30,
      init: (theme) => { sceneRef.current = buildScene(canvas, theme) },
      draw,
    })
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
