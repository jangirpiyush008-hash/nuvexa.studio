import { Link } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">404</p>
        <h1 className="text-foreground text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Couldn't find that.
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md font-light">
          But we can build it for you instead.
        </p>
        <Link
          to="/"
          className="bg-primary text-primary-foreground px-8 py-4 text-sm rounded-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.97]"
        >
          Back to Home
        </Link>
      </section>
    </PageTransition>
  )
}
