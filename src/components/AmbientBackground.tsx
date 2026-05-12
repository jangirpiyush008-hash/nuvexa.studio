import { useEffect, useRef } from 'react'
import { Theme, fitCanvas, preRender, hsl, bindAnimatedCanvas } from '@/lib/canvas-helpers'

/**
 * AmbientBackground — used on Services / Projects / Our Team / About / Contact.
 * Modern AI-data-flow aesthetic. CPU-light:
 *   • 30fps cap
 *   • Background gradient + grid + vignette + faint dots → pre-rendered ONCE
 *   • Animated layer = ~9 nodes + 12 edges + ~6 data packets + 3 fireflies
 *   • Solid circles only, no per-frame radial gradients
 */

interface Node { x: number; y: number; phase: number }
interface Edge { a: number; b: number; phase: number }
interface Packet { e: number; t: number; speed: number }   // travels along edge `e`
interface Fly { x: number; y: number; vy: number; size: number; phase: number }

interface Scene {
  W: number; H: number; dpr: number
  bg: HTMLCanvasElement
  nodes: Node[]
  edges: Edge[]
  packets: Packet[]
  flies: Fly[]
}

const NODE_LAYOUT: [number, number][] = [
  [0.10, 0.18], [0.28, 0.08], [0.46, 0.20], [0.68, 0.10], [0.86, 0.24],
  [0.18, 0.50], [0.42, 0.62], [0.66, 0.48], [0.88, 0.62],
]

const EDGE_LAYOUT: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[1,5],[2,6],[3,7],[4,8],
  [5,6],[6,7],[7,8],
]

function buildStatic(W: number, H: number, dpr: number, theme: Theme) {
  return preRender(W, H, dpr, (ctx) => {
    // Very subtle gradient
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0,   hsl(theme.heroBg, 1))
    g.addColorStop(0.5, hsl(theme.tint1,  1))
    g.addColorStop(1,   hsl(theme.heroBg, 1))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = hsl(theme.primary, theme.lineA)
    ctx.lineWidth = 0.5
    const GS = 90
    for (let x = 0; x < W; x += GS) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 0; y < H; y += GS) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // Faint static dots scattered
    ctx.fillStyle = hsl(theme.primary, theme.lineA * 2)
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * W, y = Math.random() * H
      ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill()
    }

    // Vignette
    const vg = ctx.createRadialGradient(W/2, H/2, H * 0.3, W/2, H/2, H * 0.95)
    vg.addColorStop(0, hsl(theme.vignette, 0))
    vg.addColorStop(1, hsl(theme.vignette, theme.vignetteA))
    ctx.fillStyle = vg
    ctx.fillRect(0, 0, W, H)
  })
}

function buildScene(canvas: HTMLCanvasElement, theme: Theme): Scene {
  const { W, H, dpr } = fitCanvas(canvas)
  const bg = buildStatic(W, H, dpr, theme)

  const nodes: Node[] = NODE_LAYOUT.map(([nx, ny], i) => ({
    x: nx * W, y: ny * H, phase: i * 0.6,
  }))
  const edges: Edge[] = EDGE_LAYOUT.map(([a, b], i) => ({ a, b, phase: i * 0.45 }))
  const packets: Packet[] = Array.from({ length: 6 }, (_, i) => ({
    e: i % edges.length,
    t: Math.random(),
    speed: 0.18 + Math.random() * 0.18,
  }))
  const flies: Fly[] = Array.from({ length: 3 }, (_, i) => ({
    x: (0.2 + i * 0.3) * W,
    y: H + Math.random() * H,
    vy: -(0.4 + Math.random() * 0.3),
    size: 1.4 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
  }))

  return { W, H, dpr, bg, nodes, edges, packets, flies }
}

export default function AmbientBackground() {
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

      // Edges (alpha pulse)
      ctx.lineWidth = 0.7
      for (const e of s.edges) {
        const a = s.nodes[e.a], b = s.nodes[e.b]
        const alpha = 0.05 + Math.abs(Math.sin(t * 0.5 + e.phase)) * 0.20
        ctx.strokeStyle = hsl(theme.primary, alpha)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // Data packets travelling along edges
      for (const pk of s.packets) {
        pk.t += pk.speed * 0.016
        if (pk.t > 1) {
          pk.t = 0
          pk.e = Math.floor(Math.random() * s.edges.length)
        }
        const e = s.edges[pk.e]
        const a = s.nodes[e.a], b = s.nodes[e.b]
        const px = a.x + (b.x - a.x) * pk.t
        const py = a.y + (b.y - a.y) * pk.t
        ctx.beginPath()
        ctx.arc(px, py, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, 0.85)
        ctx.fill()
      }

      // Nodes — 2 stacked solid circles fake a glow without radial gradients
      for (const n of s.nodes) {
        const pulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 0.7 + n.phase))
        const r = 1.5 + pulse * 1.8
        // Halo
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, pulse * 0.10)
        ctx.fill()
        // Core
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, 0.4 + pulse * 0.5)
        ctx.fill()
      }

      // Fireflies
      for (const f of s.flies) {
        f.y += f.vy
        f.x += Math.sin(t * 0.9 + f.phase) * 0.4
        if (f.y < -8) { f.y = s.H + 4; f.x = Math.random() * s.W }
        const a = 0.4 + 0.4 * Math.abs(Math.sin(t + f.phase))
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, a * 0.15)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fillStyle = hsl(theme.primary, a)
        ctx.fill()
      }

      // Slow scan beam (single line, pure alpha cycle)
      const beamY = ((t * 0.04) % 1) * (s.H + 100) - 40
      ctx.strokeStyle = hsl(theme.primary, 0.05)
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, beamY); ctx.lineTo(s.W, beamY); ctx.stroke()
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
