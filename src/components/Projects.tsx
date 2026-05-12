import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Backdrop3D from '@/components/Backdrop3D'
import FlipDeck from '@/components/FlipDeck'
import Magnet from '@/components/Magnet'
import { projects } from '@/content/projects'

export default function Projects() {
  const slides = [
    ...projects.map((p, i) => (
      <ProjectSlide key={p.name} project={p} n={i + 1} totalProjects={projects.length} />
    )),
    <CtaSlide key="cta" />,
  ]

  return (
    <main style={{ backgroundColor: '#0C0C0C', position: 'relative' }}>
      <Backdrop3D />
      <FlipDeck slides={slides} />
    </main>
  )
}

function ProjectSlide({
  project,
  n,
  totalProjects,
}: {
  project: typeof projects[0]
  n: number
  totalProjects: number
}) {
  return (
    <div className="h-full w-full flex items-center px-6 md:px-14 pt-24 pb-12">
      <div className="mx-auto w-full grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 items-center" style={{ maxWidth: 1500 }}>
        {/* Left — meta + blurb + CTA */}
        <motion.div
          className="md:col-span-2 glass glow-border spotlight-card rounded-3xl p-7 md:p-9"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, rotateX: 1.5, rotateY: -1.5 }}
          style={{ transformPerspective: 1000, transformStyle: 'preserve-3d' }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
            e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
          }}
        >
          <p
            className="uppercase mb-6 font-medium"
            style={{ color: '#BBCCD7', opacity: 0.7, letterSpacing: '0.3em', fontSize: '0.7rem' }}
          >
            {project.type}  ·  {String(n).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
          </p>
          <p
            className="font-light leading-snug mb-8"
            style={{ color: '#D7E2EA', fontSize: 'clamp(1.15rem, 2vw, 1.75rem)' }}
          >
            {project.blurb}
          </p>
          <ul className="space-y-2.5 mb-8">
            <li className="flex gap-3 font-light" style={{ color: '#D7E2EA', opacity: 0.75, fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
              <span style={{ color: '#BBCCD7' }}>›</span>
              <span>Live and shipping users today</span>
            </li>
            <li className="flex gap-3 font-light" style={{ color: '#D7E2EA', opacity: 0.75, fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
              <span style={{ color: '#BBCCD7' }}>›</span>
              <span>Built end-to-end by Nuvexa</span>
            </li>
            <li className="flex gap-3 font-light" style={{ color: '#D7E2EA', opacity: 0.75, fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
              <span style={{ color: '#BBCCD7' }}>›</span>
              <span>Use it, fork it, get inspired</span>
            </li>
          </ul>
          {project.url && (
            <Magnet padding={100} strength={5}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="live-pill inline-block px-7 py-2.5 text-sm"
              >
                Visit Project ↗
              </a>
            </Magnet>
          )}
        </motion.div>

        {/* Right — big project name */}
        <motion.div
          className="md:col-span-3 md:text-right"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <h2
            className="hero-heading-glow font-black uppercase tracking-tight leading-[0.88]"
            style={{ fontSize: 'clamp(3rem, 8.5vw, 8.5rem)' }}
          >
            {project.name.split(' ').map((word, idx) => (
              <span key={idx} className="block whitespace-nowrap">{word}</span>
            ))}
          </h2>
          <p
            className="uppercase mt-5"
            style={{ color: '#D7E2EA', opacity: 0.7, letterSpacing: '0.15em', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}
          >
            {project.type}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function CtaSlide() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-5 text-center">
      <p
        className="uppercase mb-6"
        style={{ color: '#BBCCD7', opacity: 0.6, letterSpacing: '0.4em', fontSize: '0.75rem' }}
      >
        Your turn
      </p>
      <h2
        className="hero-heading-glow font-black uppercase tracking-tight leading-none mb-8"
        style={{ fontSize: 'clamp(3rem, 11vw, 11rem)' }}
      >
        Yours could be next
      </h2>
      <p
        className="mx-auto max-w-2xl font-light mb-12"
        style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(1rem, 1.7vw, 1.4rem)' }}
      >
        New project shipped almost every week. We'd love yours to headline this list.
      </p>
      <Magnet padding={120} strength={4}>
        <Link to="/contact" className="contact-pill inline-block px-12 py-4 text-sm md:text-base">
          Start a Project →
        </Link>
      </Magnet>
    </div>
  )
}
