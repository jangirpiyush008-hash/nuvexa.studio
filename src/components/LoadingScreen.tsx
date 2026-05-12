import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

const WORDS = ['Design', 'Create', 'Inspire']
const COUNTER_DURATION_MS = 2700
const COMPLETE_DELAY_MS = 400
const WORD_SWAP_MS = 900

export default function LoadingScreen({ onComplete }: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => {
        if (i >= WORDS.length - 1) {
          clearInterval(id)
          return i
        }
        return i + 1
      })
    }, WORD_SWAP_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min((elapsed / COUNTER_DURATION_MS) * 100, 100)
      setProgress(pct)
      if (pct < 100) raf = requestAnimationFrame(tick)
      else setTimeout(() => onCompleteRef.current(), COMPLETE_DELAY_MS)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <motion.div
      key="loader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      {/* Soft brand glow in the corners — same vibe as Backdrop3D */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background:
            'radial-gradient(ellipse at 8% 0%, rgba(118,33,176,0.18) 0%, transparent 45%), radial-gradient(ellipse at 92% 100%, rgba(190,76,0,0.12) 0%, transparent 45%)',
        }}
      />

      {/* Top-left brand logo — same style as Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-8 left-8 md:top-12 md:left-12"
      >
        <p
          className="font-semibold uppercase tracking-wider"
          style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 1.4vw, 1.4rem)' }}
        >
          Nuvexa<span style={{ opacity: 0.6 }}>.Studio</span>
        </p>
      </motion.div>

      {/* Top-right small status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-8 right-8 md:top-12 md:right-12"
      >
        <p
          className="uppercase"
          style={{ color: '#BBCCD7', opacity: 0.55, letterSpacing: '0.4em', fontSize: '0.7rem' }}
        >
          Initialising Studio
        </p>
      </motion.div>

      {/* Centre — only the rotating word, larger */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="italic"
            style={{
              fontFamily: '"Instrument Serif", serif',
              color: 'rgba(215, 226, 234, 0.9)',
              fontWeight: 400,
              fontSize: 'clamp(4rem, 13vw, 11rem)',
              lineHeight: 1,
            }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute bottom-10 right-8 md:bottom-14 md:right-12 tabular-nums"
        style={{
          fontFamily: '"Instrument Serif", serif',
          color: '#D7E2EA',
          fontWeight: 400,
          fontSize: 'clamp(3.5rem, 8vw, 7rem)',
          lineHeight: 1,
        }}
      >
        {Math.round(progress).toString().padStart(3, '0')}
      </motion.div>

      {/* Bottom progress bar — brand gradient */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '3px', backgroundColor: 'rgba(187, 204, 215, 0.10)' }}
      >
        <motion.div
          className="h-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{
            background: 'linear-gradient(90deg, #B600A8 0%, #7621B0 50%, #BE4C00 100%)',
            boxShadow: '0 0 12px rgba(118, 33, 176, 0.55)',
          }}
        />
      </div>
    </motion.div>
  )
}
