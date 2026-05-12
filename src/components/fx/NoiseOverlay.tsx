/**
 * Fixed SVG noise texture at low opacity — that filmic Linear/Vercel grain.
 */
export default function NoiseOverlay({ opacity = 0.045 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        opacity,
        zIndex: 1,
        mixBlendMode: 'overlay',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>\")",
      }}
    />
  )
}
