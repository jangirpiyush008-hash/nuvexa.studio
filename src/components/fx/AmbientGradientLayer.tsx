/**
 * Slow-drifting gradient blobs behind the entire site.
 * GPU-friendly: animates only transform & opacity via Tailwind keyframes
 * defined in tailwind.config.ts (`ambient-drift-a/b/c`).
 */
export default function AmbientGradientLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute rounded-full motion-safe:animate-[ambient-drift-a_22s_ease-in-out_infinite]"
        style={{
          top: '-15%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background:
            'radial-gradient(circle at center, rgba(118,33,176,0.22) 0%, rgba(118,33,176,0) 65%)',
          filter: 'blur(40px)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full motion-safe:animate-[ambient-drift-b_28s_ease-in-out_infinite]"
        style={{
          bottom: '-20%',
          right: '-15%',
          width: '70vw',
          height: '70vw',
          background:
            'radial-gradient(circle at center, rgba(190,76,0,0.16) 0%, rgba(190,76,0,0) 65%)',
          filter: 'blur(60px)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full motion-safe:animate-[ambient-drift-c_34s_ease-in-out_infinite]"
        style={{
          top: '35%',
          left: '40%',
          width: '50vw',
          height: '50vw',
          background:
            'radial-gradient(circle at center, rgba(182,0,168,0.12) 0%, rgba(182,0,168,0) 60%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
