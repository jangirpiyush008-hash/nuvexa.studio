import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const CENTER = [
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Academy',  to: '/academy', highlight: true },
  { label: 'The Crew', to: '/our-team' },
]
const RIGHT = [
  { label: 'Manifesto', to: '/about' },
  { label: 'Say Hi',    to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-300"
      style={{
        paddingTop: scrolled ? '0.85rem' : '1.5rem',
        paddingBottom: scrolled ? '0.85rem' : '1rem',
        background: scrolled
          ? 'linear-gradient(to bottom, rgba(12,12,12,0.85) 0%, rgba(12,12,12,0.55) 100%)'
          : 'linear-gradient(to bottom, rgba(12,12,12,0.95) 0%, rgba(12,12,12,0.75) 60%, rgba(12,12,12,0) 100%)',
        backdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'blur(8px)',
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'blur(8px)',
        borderBottom: scrolled ? '1px solid rgba(215,226,234,0.08)' : '1px solid transparent',
      }}
    >
      <nav className="grid grid-cols-3 items-center">
        <Link
          to="/"
          className="font-semibold uppercase tracking-wider text-base md:text-2xl lg:text-[1.9rem] transition-all duration-300 hover:opacity-70 justify-self-start"
          style={{
            color: '#D7E2EA',
            fontSize: scrolled ? undefined : undefined,
            transform: scrolled ? 'scale(0.95)' : 'scale(1)',
            transformOrigin: 'left center',
          }}
        >
          Nuvexa<span style={{ opacity: 0.6 }}>.Studio</span>
        </Link>

        <div className="hidden md:flex items-center gap-3 lg:gap-5 justify-self-center">
          {CENTER.map((l) => l.highlight ? (
            <AcademyPill key={l.label} to={l.to} label={l.label} />
          ) : (
            <NavItem key={l.label} to={l.to} label={l.label} />
          ))}
        </div>

        <div className="hidden md:flex gap-3 lg:gap-5 justify-self-end">
          {RIGHT.map((l) => (
            <NavItem key={l.label} to={l.to} label={l.label} />
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden justify-self-end w-11 h-11 rounded-full flex items-center justify-center transition-colors"
          style={{
            border: '1px solid rgba(215,226,234,0.25)',
            background: 'rgba(215,226,234,0.04)',
            color: '#D7E2EA',
          }}
        >
          <div className="relative w-5 h-5">
            <span
              className="absolute left-0 right-0 h-[1.5px] bg-current transition-all"
              style={{ top: open ? '50%' : '30%', transform: open ? 'translateY(-50%) rotate(45deg)' : 'none' }}
            />
            <span
              className="absolute left-0 right-0 h-[1.5px] bg-current transition-all"
              style={{ top: open ? '50%' : '70%', transform: open ? 'translateY(-50%) rotate(-45deg)' : 'none' }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mt-4 rounded-2xl p-4 glass-strong"
          >
            <div className="flex flex-col gap-1">
              {[...CENTER, ...RIGHT].map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end
                  className="px-4 py-3 rounded-xl uppercase tracking-wider text-sm font-medium transition-colors"
                  style={({ isActive }) => ({
                    color: isActive ? '#fff' : '#D7E2EA',
                    background: isActive ? 'rgba(118,33,176,0.18)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(187,204,215,0.30)' : 'transparent',
                  })}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/**
 * Plain nav link — when active, gets a soft pill + brand-gradient dot to
 * the left of the label, plus an animated underline on hover.
 */
function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} end>
      {({ isActive }) => (
        <span
          className="relative group inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
          style={{
            background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
            border: '1px solid',
            borderColor: isActive ? 'rgba(187,204,215,0.30)' : 'transparent',
            boxShadow: isActive ? 'inset 0 0 12px rgba(118,33,176,0.20)' : 'none',
          }}
        >
          <span
            className="rounded-full transition-all duration-200"
            style={{
              width: isActive ? 7 : 0,
              height: 7,
              background:
                'linear-gradient(123deg, #B600A8 0%, #7621B0 50%, #BE4C00 100%)',
              boxShadow: isActive ? '0 0 8px rgba(118,33,176,0.85)' : 'none',
              flexShrink: 0,
            }}
          />
          <span
            className="font-medium uppercase tracking-wider text-sm md:text-base lg:text-[1.05rem]"
            style={{
              color: isActive ? '#ffffff' : '#D7E2EA',
              opacity: isActive ? 1 : 0.7,
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {label}
          </span>
          {/* Animated underline on hover (not when active) */}
          {!isActive && (
            <span
              aria-hidden
              className="absolute left-3 right-3 bottom-1 h-[1.5px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, #BBCCD7 50%, transparent 100%)',
              }}
            />
          )}
        </span>
      )}
    </NavLink>
  )
}

/** Academy pill — gradient pill always; brighter when on /academy */
function AcademyPill({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} end className="transition-transform duration-200 hover:scale-105">
      {({ isActive }) => (
        <span
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
          style={{
            background: isActive
              ? 'linear-gradient(123deg, rgba(182,0,168,0.55) 7%, rgba(118,33,176,0.65) 50%, rgba(190,76,0,0.55) 100%)'
              : 'linear-gradient(123deg, rgba(182,0,168,0.15) 7%, rgba(118,33,176,0.18) 50%, rgba(190,76,0,0.15) 100%)',
            border: '1.5px solid #BBCCD7',
            boxShadow: isActive
              ? '0 0 28px rgba(182,0,168,0.85), inset 0 0 18px rgba(187,204,215,0.25)'
              : '0 0 18px rgba(118,33,176,0.45), inset 0 0 12px rgba(187,204,215,0.10)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: 'inherit',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          {isActive && (
            <span
              className="rounded-full"
              style={{
                width: 7, height: 7,
                background: '#ffffff',
                boxShadow: '0 0 10px rgba(255,255,255,0.95)',
              }}
            />
          )}
          {label}
        </span>
      )}
    </NavLink>
  )
}
