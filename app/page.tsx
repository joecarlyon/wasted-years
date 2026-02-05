import Link from 'next/link'
import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import RecentBrewCard from '@/components/RecentBrewCard'

export default function Home() {
  const recentBrews = [...batches]
    .sort((a, b) => b.batchNo - a.batchNo)
    .slice(0, 3)
    .map((batch) => {
      // Find matching recipe by name (case-insensitive)
      const recipe = recipes.find(
        (r) => r.name.toLowerCase() === batch.name.toLowerCase()
      )
      return { batch, recipeUuid: recipe?.uuid }
    })

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <section className="mb-12 border-b border-border py-16 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-wide">
          <span className="text-accent">Craft Beer.</span>{' '}
          <span className="text-lavender">Heavy Metal.</span>
        </h2>
        <p className="mx-auto max-w-xl text-lg text-text-secondary">
          Wasted Years Brewing. Recipes born in fire, beers consumed with
          passion, and I occasionally find new ways to screw it up.
        </p>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 border-b border-border pb-2 text-xl uppercase tracking-widest text-accent">
          Recent Brews
        </h3>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {recentBrews.map(({ batch, recipeUuid }) => (
            <RecentBrewCard
              key={batch.batchNo}
              batch={batch}
              recipeUuid={recipeUuid}
            />
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/brews"
            className="inline-block border border-accent px-6 py-3 text-sm uppercase tracking-widest text-accent transition-all duration-300 hover:bg-accent hover:text-bg-dark"
          >
            View All Brews
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 border-b border-border pb-2 text-xl uppercase tracking-widest text-lavender">
          About
        </h3>
        <div className="space-y-4 text-text-secondary">
          <p>
            Wasted Years is a small homebrewing operation dedicated to crafting
            quality beers. From hoppy IPAs to malty stouts, each recipe is
            developed with care and refined over time.
          </p>
          <p>
            Browse the recipes to see what we&apos;re brewing, or check the brew
            log to follow along with our latest batches.
          </p>
        </div>
      </section>
    </main>
  )
}
