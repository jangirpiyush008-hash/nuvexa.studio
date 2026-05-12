/**
 * Modern animated 3D backdrop — floating gradient orbs + drifting noise.
 * Pure CSS animations. Zero JS, zero canvas, ~free on the GPU.
 *
 * Looks 3D because each orb uses a radial gradient with off-centre highlight
 * + heavy blur, so they read as glowing spheres / nebulae.
 */
export default function Backdrop3D() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      style={{ contain: 'strict' }}
    >
      {/* Subtle vignette tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(118,33,176,0.10) 0%, transparent 60%)',
        }}
      />

      {/* Orb 1 — purple, top-left, slow */}
      <div
        className="absolute rounded-full backdrop-orb"
        style={{
          width: '60vmin',
          height: '60vmin',
          top: '-10vmin',
          left: '-10vmin',
          background:
            'radial-gradient(circle at 35% 30%, rgba(187,204,215,0.40) 0%, rgba(118,33,176,0.30) 28%, rgba(118,33,176,0.10) 55%, transparent 80%)',
          filter: 'blur(60px)',
          animation: 'orbFloat1 18s ease-in-out infinite',
        }}
      />

      {/* Orb 2 — magenta, bottom-right, medium */}
      <div
        className="absolute rounded-full backdrop-orb"
        style={{
          width: '55vmin',
          height: '55vmin',
          bottom: '-12vmin',
          right: '-12vmin',
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, rgba(182,0,168,0.30) 25%, rgba(182,0,168,0.08) 55%, transparent 80%)',
          filter: 'blur(70px)',
          animation: 'orbFloat2 22s ease-in-out infinite',
        }}
      />

      {/* Orb 3 — orange ember, mid-left, slow drift */}
      <div
        className="absolute rounded-full backdrop-orb"
        style={{
          width: '38vmin',
          height: '38vmin',
          top: '40%',
          left: '-8vmin',
          background:
            'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.20) 0%, rgba(190,76,0,0.30) 25%, rgba(190,76,0,0.05) 60%, transparent 85%)',
          filter: 'blur(55px)',
          animation: 'orbFloat3 26s ease-in-out infinite',
        }}
      />

      {/* Orb 4 — silver-blue accent, top-right, fast */}
      <div
        className="absolute rounded-full backdrop-orb"
        style={{
          width: '32vmin',
          height: '32vmin',
          top: '8vmin',
          right: '6vmin',
          background:
            'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.22) 0%, rgba(187,204,215,0.18) 30%, transparent 70%)',
          filter: 'blur(45px)',
          animation: 'orbFloat4 14s ease-in-out infinite',
        }}
      />

      {/* Orb 5 — small bright accent, lower-mid */}
      <div
        className="absolute rounded-full backdrop-orb"
        style={{
          width: '22vmin',
          height: '22vmin',
          bottom: '20%',
          left: '40%',
          background:
            'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.26) 0%, rgba(118,33,176,0.18) 35%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orbFloat5 16s ease-in-out infinite',
        }}
      />

      {/* Faint horizontal scan beam */}
      <div
        className="absolute left-0 right-0"
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(187,204,215,0.35) 50%, transparent 100%)',
          animation: 'scanBeam 12s linear infinite',
        }}
      />

      {/* Bottom darken */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 70%, rgba(12,12,12,0.7) 100%)',
        }}
      />

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(8vmin, 4vmin, 0) scale(1.10); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(-6vmin, -5vmin, 0) scale(1.08); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(5vmin, -7vmin, 0) scale(1.12); }
        }
        @keyframes orbFloat4 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(-4vmin, 6vmin, 0) scale(1.05); }
        }
        @keyframes orbFloat5 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(7vmin, -3vmin, 0) scale(1.15); }
        }
        @keyframes scanBeam {
          0%   { top: -2%;  opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { top: 102%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .backdrop-orb { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
