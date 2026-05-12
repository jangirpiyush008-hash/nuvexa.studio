import FadeIn from '@/components/FadeIn'
import AnimatedText from '@/components/AnimatedText'
import ContactButton from '@/components/ContactButton'

/**
 * Decorative corner orbs (replaces the four 3D Figma assets in the spec).
 * Pure CSS — no images, no lag.
 */
function CornerOrb({
  size = 180,
  hue = '#BBCCD7',
  className = '',
}: {
  size?: number
  hue?: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 25%, #ffffff 0%, ${hue} 14%, #646973 50%, #1f1f1f 88%, #0C0C0C 100%)`,
        boxShadow:
          'inset -16px -22px 36px rgba(0,0,0,0.85), inset 14px 18px 28px rgba(255,255,255,0.06), 0 18px 30px rgba(0,0,0,0.5)',
      }}
    />
  )
}

export default function AboutSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 md:px-10 py-20"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      {/* Corner orbs */}
      <FadeIn delay={0.10} x={-80} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]">
        <CornerOrb size={210} hue="#BBCCD7" className="w-[120px] sm:w-[160px] md:w-[210px] aspect-square" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]">
        <CornerOrb size={180} hue="#7621B0" className="w-[100px] sm:w-[140px] md:w-[180px] aspect-square" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]">
        <CornerOrb size={210} hue="#BE4C00" className="w-[120px] sm:w-[160px] md:w-[210px] aspect-square" />
      </FadeIn>
      <FadeIn delay={0.30} x={80} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]">
        <CornerOrb size={220} hue="#B600A8" className="w-[130px] sm:w-[170px] md:w-[220px] aspect-square" />
      </FadeIn>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 w-full max-w-[680px] mx-auto">
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About Nuvexa
          </h2>
        </FadeIn>

        <AnimatedText
          text="With more than five years of building, we focus on shipped products, modern brand systems, and AI-native workflows. We work with founders who think in days, not decks. Let's build something incredible together."
          className="font-medium text-center leading-relaxed max-w-[560px] mx-auto"
          style={{
            color: '#D7E2EA',
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
          }}
        />

        <FadeIn delay={0} y={20} className="mt-6 sm:mt-10 md:mt-12">
          <ContactButton to="/contact" label="Drop the Brief" />
        </FadeIn>
      </div>
    </section>
  )
}
