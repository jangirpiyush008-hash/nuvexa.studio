import FadeIn from '@/components/FadeIn'

const SERVICES = [
  {
    n: '01',
    name: 'Web Builds',
    desc: 'High-performance marketing sites, product pages, and landing flows shipped in 72 hours. Modern stack, premium feel, conversion-tuned.',
  },
  {
    n: '02',
    name: 'Mobile Apps',
    desc: 'iOS + Android apps built end-to-end in 5 days. React Native, Expo, Supabase, Razorpay. Production-ready, store-submission included.',
  },
  {
    n: '03',
    name: 'Brand & Design',
    desc: 'Cohesive identity systems — logos, typography, motion, ad creative — delivered overnight. Memorable, modern, on-spec.',
  },
  {
    n: '04',
    name: 'Workflow Automation',
    desc: 'Boring work, automated. AI agents, scheduled scripts, n8n flows, and custom integrations that quietly run your back office.',
  },
]

export default function ServicesSection() {
  return (
    <section
      className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-28">
        <h2
          className="font-black uppercase"
          style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.1} y={30}>
            <div
              className="flex items-center gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12"
              style={{
                borderTop: i === 0 ? '1px solid rgba(12, 12, 12, 0.15)' : 'none',
                borderBottom: '1px solid rgba(12, 12, 12, 0.15)',
              }}
            >
              <div
                className="font-black flex-shrink-0"
                style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 1 }}
              >
                {s.n}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-medium uppercase mb-2 sm:mb-3"
                  style={{ color: '#0C0C0C', fontSize: 'clamp(1rem, 2.2vw, 2.1rem)', letterSpacing: '0.02em' }}
                >
                  {s.name}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl"
                  style={{ color: '#0C0C0C', opacity: 0.6, fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
