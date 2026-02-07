'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
        <ul className="hidden gap-8 md:flex">
          <li>
            <Link href="/" className={linkClasses('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/recipes" className={linkClasses('/recipes')}>
              Recipes
            </Link>
          </li>
          <li>
            <Link href="/equipment" className={linkClasses('/equipment')}>
              Equipment
            </Link>
          </li>
          <li>
            <Link href="/brews" className={linkClasses('/brews')}>
              Brew Log
            </Link>
          </li>
          <li>
            <Link href="/about" className={linkClasses('/about')}>
              About
            </Link>
          </li>
        </ul>

        {/* Hamburger button */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          <Link href="/" className={mobileLinkClasses('/')} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/recipes" className={mobileLinkClasses('/recipes')} onClick={() => setMenuOpen(false)}>
            Recipes
          </Link>
          <Link href="/equipment" className={mobileLinkClasses('/equipment')} onClick={() => setMenuOpen(false)}>
            Equipment
          </Link>
          <Link href="/brews" className={mobileLinkClasses('/brews')} onClick={() => setMenuOpen(false)}>
            Brew Log
          </Link>
          <Link href="/about" className={mobileLinkClasses('/about')} onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </div>
      )}
    </header>
  )
}
