import Link from 'next/link'
import ImageLightbox from '@/components/ImageLightbox'

const originPhotos = [
    { src: '/images/origins/20110425_001.jpg', alt: 'The Bayou Classic 30-quart turkey fryer — our first brew kettle', caption: 'The Bayou Classic 30-quart turkey fryer — our first "brew kettle"' },
    { src: '/images/origins/20110425_002.jpg', alt: 'Grain in cheesecloth mashing on the apartment stove', caption: 'All-grain with no-brain: cheesecloth mash on the apartment stove' },
    { src: '/images/origins/20110425_003.jpg', alt: 'The boil going in the turkey fryer pot', caption: 'The boil' },
    { src: '/images/origins/20110426_001.jpg', alt: 'Cooling the wort in a bathtub ice bath', caption: 'Ice bath in the tub — our state-of-the-art chiller' },
    { src: '/images/origins/20110426_002.jpg', alt: 'Siphoning wort into the fermentation bucket', caption: 'Siphoning into the fermentation bucket' },
    { src: '/images/origins/20110426_004.jpg', alt: 'Close-up of wort flowing through the siphon tube', caption: 'Wort flowing through the siphon' },
    { src: '/images/origins/20110429_001.jpg', alt: 'Wort in a glass carboy', caption: 'Into the carboy' },
    { src: '/images/origins/20110429_005.jpg', alt: 'Fermenting beer in a carboy with temperature strip', caption: 'Fermentation underway — with a stick-on thermometer for "temperature control"' },
    { src: '/images/origins/20110429_006.jpg', alt: 'Dark beer fermenting in a carboy', caption: 'The dark stuff fermenting' },
]

export default function About() {
    return (
        <main className="mx-auto max-w-6xl px-8 py-8">
            <section className="mb-12">
                <h2 className="mb-6 border-b border-border pb-2 text-xl uppercase tracking-widest text-lavender">
                    About
                </h2>
                <div className="space-y-4 text-text-secondary">
                    <p>
                        Back in 2011, I figured there were maybe 100 beers in the world,
                        tops. So, I set out to try every single one. Turns out, I
                        couldn&apos;t have been more wrong. Every week, I&apos;d grab a new
                        6-pack to keep up. After a few weeks, I realized that was getting
                        pricey, so I thought, &quot;Hey, my friends and I could just brew
                        our own instead.&quot; (Spoiler: also wrong.) Brewing is way more
                        expensive, both in time and effort, than just buying beer.
                    </p>
                    <p>
                        And just like that, BingenBrew was born, named after Vince&apos;s
                        last name. (Wasted Years came later.) Our first attempt? A
                        Bell&apos;s Two Hearted clone. We read{' '}
                        <a href="https://www.goodreads.com/book/show/32446869" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">&quot;How to Brew&quot;</a>{' '}
                        by John Palmer, so we had some ideas, but zero actual experience. We
                        jumped right into all-grain with no-brain: pre-crushed grain in
                        cheesecloth, boiling away on the rickety stove in the cheap
                        apartment I shared with a roommate. We cooled the beer in an ice
                        bath in the tub, totally uncovered. We were a shoestring operation.
                        Better equipment and proper sanitization would come later.
                    </p>
                    <p>
                        That first batch? Absolutely awful. Chris was nice enough to be
                        brutally honest about it, telling us that Miller Lite was honestly
                        better than what we made. But instead of giving up, we got even
                        more into it. We wanted to figure it out. Over the next few years,
                        we kept tinkering with different homemade setups, turning all shapes
                        and sizes of coolers into mashtuns. We even broke out an angle
                        grinder to turn old kegs into keggles. Now we were really cooking
                        with fire! And yeah, we slowly got better.
                    </p>
                    <p>
                        Eventually, Vince moved out to Colorado for a brewing job at Living
                        The Dream, and Tony wanted to learn the ropes, so he took over
                        where we left off. I was moving every year, so the whole brewing
                        setup got dragged to Tony&apos;s garage. We had a ton of good times
                        there! Brewing turned into a full-on social event, with a rotating
                        crew of friends and friends-of-friends dropping in, learning the
                        process, and helping out (while we, of course, crushed way too many
                        beers after being freed up).
                    </p>
                    <p>
                        When Covid hit, everything came to a screeching halt. After finally
                        buying a home (and not having to move every year), I set up shop in
                        my own garage. That&apos;s where this site picks up — about five
                        years into this next chapter. Now, recipes get tracked in Brewfather
                        instead of BeerSmith, we brew on actual equipment (not just a
                        turkey fryer), and sometimes I throw beers into competitions, where
                        strangers let me know everything that&apos;s wrong with them on a
                        score sheet. From hoppy IPAs to malty stouts to the occasional
                        whiskey wash, every recipe gets tweaked over time. Some of them even
                        turn out pretty good.
                    </p>
                    <p>
                        Browse the{' '}
                        <Link href="/recipes" className="text-accent hover:underline">
                            recipes
                        </Link>{' '}
                        to see what&apos;s brewing, check the{' '}
                        <Link href="/brews" className="text-accent hover:underline">
                            brew log
                        </Link>{' '}
                        to follow along with recent batches, or dig through the{' '}
                        <Link href="/brews?filter=competition" className="text-accent hover:underline">
                            competition results
                        </Link>{' '}
                        to see how the judges felt about it all.
                    </p>
                </div>
            </section>

            <section className="mb-12">
                <h3 className="mb-6 border-b border-border pb-2 text-xl uppercase tracking-widest text-accent">
                    Where It All Started — April 2011
                </h3>
                <p className="mb-8 text-text-secondary">
                    Photos from brew day one. A Bell&apos;s Two Hearted clone brewed on
                    a turkey fryer pot, mashed in cheesecloth, and cooled in the
                    bathtub.
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {originPhotos.map((photo) => (
                        <figure key={photo.src} className="flex flex-col items-center gap-2">
                            <ImageLightbox
                                src={photo.src}
                                alt={photo.alt}
                                thumbnailWidth={400}
                                thumbnailHeight={300}
                            />
                            <figcaption className="text-center text-xs text-text-secondary">
                                {photo.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>
        </main>
    )
}
