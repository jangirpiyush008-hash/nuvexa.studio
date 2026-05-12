import { Link } from 'react-router-dom'

interface Props {
  to?: string
  label?: string
  className?: string
}

export default function ContactButton({ to = '/contact', label = 'Contact Me', className = '' }: Props) {
  return (
    <Link
      to={to}
      className={`contact-pill inline-block px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className}`}
    >
      {label}
    </Link>
  )
}
