import { ReactNode } from 'react'

/**
 * Page wrapper that triggers a CSS entrance animation on every mount.
 * No framer-motion — the `page-enter` keyframe is defined in index.css.
 * React re-mounts this (via AnimatePresence key on Routes) on each navigation,
 * which re-triggers the animation.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="page-enter min-h-screen">
      {children}
    </div>
  )
}
