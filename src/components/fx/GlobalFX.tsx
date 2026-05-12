import AmbientGradientLayer from './AmbientGradientLayer'
import CursorReactiveGlow from './CursorReactiveGlow'
import FloatingParticles from './FloatingParticles'
import NoiseOverlay from './NoiseOverlay'

/**
 * Site-wide ambient FX stack. Mounted once at the root.
 * All layers are pointer-events-none and sit behind content.
 */
export default function GlobalFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    >
      <AmbientGradientLayer />
      <FloatingParticles />
      <CursorReactiveGlow />
      <NoiseOverlay />
    </div>
  )
}
