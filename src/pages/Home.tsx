import HeroSection      from '@/components/sections/HeroSection'
import MarqueeSection   from '@/components/sections/MarqueeSection'
import PitchSection     from '@/components/sections/PitchSection'
import ServicesSection  from '@/components/sections/ServicesSection'

export default function Home() {
  return (
    <main style={{ backgroundColor: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <PitchSection />
      <ServicesSection />
    </main>
  )
}
