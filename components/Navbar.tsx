'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/equipment', label: 'Equipment' },
  { href: '/brews', label: 'Brew Log' },
  { href: '/competitions', label: 'Competitions' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClasses = (path: string) => {
    const base =
      'text-lavender font-medium uppercase tracking-wide text-sm py-2 border-b-2 border-transparent transition-all duration-300 hover:text-accent hover:border-accent'
    return pathname === path ? `${base} text-accent border-accent` : base
  }

  const mobileLinkClasses = (path: string) => {
    const base =
      'block py-3 text-lavender font-medium uppercase tracking-wide text-sm transition-colors hover:text-accent'
    return pathname === path ? `${base} text-accent` : base
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-accent bg-bg-card">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="logo">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-text-primary">
            Wasted Years
          </h1>
          <span className="block text-xs uppercase tracking-widest text-lavender">
            Spirits, Records, and Beers
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkClasses(href)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={mobileLinkClasses(href)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
