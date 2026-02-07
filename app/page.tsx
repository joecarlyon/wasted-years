import Link from 'next/link'
import {batches} from '@/data/batches'
import RecentBrewCard from '@/components/RecentBrewCard'

export default function Home() {
    const recentBrews = [...batches]
        .sort((a, b) => b.batchNo - a.batchNo)
        .slice(0, 3)

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
                    {recentBrews.map((batch) => (
                        <RecentBrewCard key={batch.batchNo} batch={batch}/>
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
        </main>
    )
}
