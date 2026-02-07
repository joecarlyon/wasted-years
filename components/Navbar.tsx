'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const linkClasses = (path: string) => {
    const base =
      'text-lavender font-medium uppercase tracking-wide text-sm py-2 border-b-2 border-transparent transition-all duration-300 hover:text-accent hover:border-accent'
    return pathname === path ? `${base} text-accent border-accent` : base
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-accent bg-bg-card">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <Link href="/" className="logo">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-text-primary">
            Wasted Years
          </h1>
          <span className="block text-xs uppercase tracking-widest text-lavender">
            Spirits, Records, and Beers
          </span>
        </Link>

        <ul className="flex gap-8">
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
      </nav>
    </header>
  )
}
