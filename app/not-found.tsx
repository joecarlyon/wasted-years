import Link from 'next/link'
import SpilledPint from '@/components/SpilledPint'

export const metadata = {
  title: 'Page Not Found | Wasted Years',
}

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center md:px-8">
      <SpilledPint className="mb-6 w-full max-w-md" />
      <p className="text-sm uppercase tracking-widest text-lavender">404</p>
      <h2 className="mt-2 text-3xl font-bold text-text-primary">
        This one got dumped.
      </h2>
      <p className="mt-4 max-w-md text-text-secondary">
        Whatever was supposed to be here went down the drain. Bad link, a batch
        that never happened, or someone pulled the wrong valve.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-block border border-accent px-6 py-3 text-sm uppercase tracking-widest text-accent transition-all duration-300 hover:bg-accent hover:text-bg-dark"
        >
          Home
        </Link>
        <Link
          href="/brews"
          className="inline-block border border-border px-6 py-3 text-sm uppercase tracking-widest text-lavender transition-all duration-300 hover:border-accent hover:text-accent"
        >
          Brew Log
        </Link>
        <Link
          href="/recipes"
          className="inline-block border border-border px-6 py-3 text-sm uppercase tracking-widest text-lavender transition-all duration-300 hover:border-accent hover:text-accent"
        >
          Recipes
        </Link>
      </div>
    </main>
  )
}
