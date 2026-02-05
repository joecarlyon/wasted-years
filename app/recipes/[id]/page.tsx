import { notFound } from 'next/navigation'
import Link from 'next/link'
import { recipes } from '@/data/recipes'
import ImageLightbox from '@/components/ImageLightbox'

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.uuid }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const recipe = recipes.find((r) => r.uuid === params.id)
  if (!recipe) return { title: 'Recipe Not Found' }
  return {
    title: `${recipe.name} | Wasted Years`,
    description: recipe.description || `${recipe.style} - ${recipe.abv}% ABV`,
  }
}

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = recipes.find((r) => r.uuid === params.id)

  if (!recipe) {
    notFound()
  }

  const isLegacy = recipe.source === 'beersmith'
  const hasDetailedData =
    recipe.mashProfile || recipe.waterProfile || recipe.equipmentProfile

  return (
    <main className="mx-auto max-w-4xl px-8 py-8">
      {/* Back link */}
      <Link
        href="/recipes"
        className="mb-6 inline-flex items-center text-sm text-text-secondary transition-colors hover:text-accent"
      >
        <span className="mr-2">&larr;</span> Back to Recipes
      </Link>

      {/* Two-column layout: content left, artwork right */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {/* Hero section */}
          <div className="mb-8 border-b border-border pb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl text-text-primary">
                  {recipe.name}
                </h1>
                <p className="text-lg uppercase tracking-wide text-accent">
                  {recipe.style}
                </p>
                {recipe.brewDate && (
                  <p className="mt-1 text-sm text-text-secondary">
                    Created{' '}
                    {new Date(recipe.brewDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
              {recipe.source && (
                <span className="rounded border border-border bg-bg-card px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                  {recipe.source}
                </span>
              )}
            </div>
            {recipe.description && (
              <p className="mt-4 whitespace-pre-line text-text-secondary">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Stats bar */}
          <div className="mb-8 grid grid-cols-3 gap-4 border-b border-border pb-8 sm:grid-cols-6">
            <StatBox label="OG" value={recipe.og.toFixed(3)} />
            <StatBox label="FG" value={recipe.fg.toFixed(3)} />
            <StatBox
              label="ABV"
              value={`${recipe.abv.toFixed(1)}%`}
              highlight
            />
            <StatBox label="IBU" value={recipe.ibu.toString()} highlight />
            {recipe.color !== undefined && (
              <StatBox label="SRM" value={recipe.color.toString()} />
            )}
            {recipe.batchSize !== undefined && (
              <StatBox label="Batch" value={`${recipe.batchSize} gal`} />
            )}
          </div>

          {/* Main content grid - single column when artwork present */}
          <div className={`grid gap-8 ${recipe.artwork ? '' : 'lg:grid-cols-2'}`}>
            {/* Fermentables */}
            <Section title="Fermentables">
              {recipe.fermentablesDetail &&
              recipe.fermentablesDetail.length > 0 ? (
                <ul className="space-y-2">
                  {recipe.fermentablesDetail.map((f, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-text-secondary">{f.name}</span>
                      <span className="text-text-primary">
                        {f.amount.toFixed(2)} lb
                        {f.percentage !== undefined && (
                          <span className="ml-2 text-lavender-dark">
                            ({f.percentage.toFixed(1)}%)
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-1">
                  {recipe.grains.map((grain, idx) => (
                    <li
                      key={idx}
                      className="relative py-1 pl-4 text-sm text-text-secondary before:absolute before:left-0 before:text-xs before:text-accent before:content-['//']"
                    >
                      {grain}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* Hops */}
            <Section title="Hops">
              {recipe.hopsDetail && recipe.hopsDetail.length > 0 ? (
                <ul className="space-y-2">
                  {recipe.hopsDetail.map((h, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {h.name}
                        {h.alpha !== undefined && (
                          <span className="ml-1 text-lavender-dark">
                            ({h.alpha}% AA)
                          </span>
                        )}
                      </span>
                      <span className="text-text-primary">
                        {h.amount.toFixed(2)} oz @ {h.use}
                        {h.time !== undefined && h.time > 0 && ` ${h.time} min`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : recipe.hops.length > 0 ? (
                <ul className="space-y-1">
                  {recipe.hops.map((hop, idx) => (
                    <li
                      key={idx}
                      className="relative py-1 pl-4 text-sm text-text-secondary before:absolute before:left-0 before:text-xs before:text-accent before:content-['//']"
                    >
                      {hop}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-text-secondary">No hops</p>
              )}
            </Section>

            {/* Yeast */}
            <Section title="Yeast">
              {recipe.yeastDetail ? (
                <div className="space-y-2 text-sm">
                  <p className="text-text-primary">{recipe.yeastDetail.name}</p>
                  {recipe.yeastDetail.lab && (
                    <p className="text-text-secondary">
                      Lab: {recipe.yeastDetail.lab}
                    </p>
                  )}
                  {recipe.yeastDetail.attenuation !== undefined && (
                    <p className="text-text-secondary">
                      Attenuation: {recipe.yeastDetail.attenuation}%
                    </p>
                  )}
                  {recipe.yeastDetail.minTemp !== undefined &&
                    recipe.yeastDetail.maxTemp !== undefined && (
                      <p className="text-text-secondary">
                        Temp Range: {recipe.yeastDetail.minTemp}-
                        {recipe.yeastDetail.maxTemp}°F
                      </p>
                    )}
                </div>
              ) : (
                <p className="relative pl-4 text-sm text-text-secondary before:absolute before:left-0 before:text-xs before:text-accent before:content-['//']">
                  {recipe.yeast}
                </p>
              )}
            </Section>

            {/* Equipment Profile (Brewfather only) */}
            {recipe.equipmentProfile && (
              <Section title="Equipment">
                <div className="space-y-2 text-sm">
                  {recipe.equipmentProfile.name && (
                    <p className="text-text-primary">
                      {recipe.equipmentProfile.name}
                    </p>
                  )}
                  {recipe.equipmentProfile.batchSize !== undefined && (
                    <p className="text-text-secondary">
                      Batch Size: {recipe.equipmentProfile.batchSize} gal
                    </p>
                  )}
                  {recipe.boilTime !== undefined && (
                    <p className="text-text-secondary">
                      Boil Time: {recipe.boilTime} min
                    </p>
                  )}
                  {recipe.equipmentProfile.efficiency !== undefined && (
                    <p className="text-text-secondary">
                      Efficiency: {recipe.equipmentProfile.efficiency}%
                    </p>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* Mash Profile (Brewfather only) */}
          {recipe.mashProfile && recipe.mashProfile.steps.length > 0 && (
            <div className="mt-8">
              <Section title="Mash Profile" fullWidth>
                {recipe.mashProfile.name && (
                  <p className="mb-4 text-sm text-text-secondary">
                    {recipe.mashProfile.name}
                  </p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 pr-4 font-normal uppercase tracking-wide text-lavender-dark">
                          Step
                        </th>
                        <th className="pb-2 pr-4 font-normal uppercase tracking-wide text-lavender-dark">
                          Type
                        </th>
                        <th className="pb-2 pr-4 font-normal uppercase tracking-wide text-lavender-dark">
                          Temp
                        </th>
                        <th className="pb-2 font-normal uppercase tracking-wide text-lavender-dark">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.mashProfile.steps.map((step, idx) => (
                        <tr key={idx} className="border-b border-border/50">
                          <td className="py-2 pr-4 text-text-primary">
                            {step.name}
                          </td>
                          <td className="py-2 pr-4 text-text-secondary">
                            {step.type}
                          </td>
                          <td className="py-2 pr-4 text-text-secondary">
                            {step.stepTemp}°F
                          </td>
                          <td className="py-2 text-text-secondary">
                            {step.stepTime} min
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}

          {/* Water Profile (Brewfather only) */}
          {recipe.waterProfile && hasWaterData(recipe.waterProfile) && (
            <div className="mt-8">
              <Section title="Water Profile" fullWidth>
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                  {recipe.waterProfile.calcium !== undefined && (
                    <MineralBox
                      label="Ca"
                      value={recipe.waterProfile.calcium}
                    />
                  )}
                  {recipe.waterProfile.magnesium !== undefined && (
                    <MineralBox
                      label="Mg"
                      value={recipe.waterProfile.magnesium}
                    />
                  )}
                  {recipe.waterProfile.sodium !== undefined && (
                    <MineralBox label="Na" value={recipe.waterProfile.sodium} />
                  )}
                  {recipe.waterProfile.chloride !== undefined && (
                    <MineralBox
                      label="Cl"
                      value={recipe.waterProfile.chloride}
                    />
                  )}
                  {recipe.waterProfile.sulfate !== undefined && (
                    <MineralBox
                      label="SO4"
                      value={recipe.waterProfile.sulfate}
                    />
                  )}
                  {recipe.waterProfile.bicarbonate !== undefined && (
                    <MineralBox
                      label="HCO3"
                      value={recipe.waterProfile.bicarbonate}
                    />
                  )}
                </div>
              </Section>
            </div>
          )}

          {/* Legacy recipe note */}
          {isLegacy && !hasDetailedData && (
            <div className="mt-8 border border-border bg-bg-card p-4">
              <p className="text-sm italic text-text-secondary">
                This is a legacy recipe
                {recipe.brewDate &&
                  ` from ${new Date(recipe.brewDate).getFullYear()}`}
                . Mash, water, and equipment profiles are not available.
              </p>
            </div>
          )}
        </div>

        {/* Artwork sidebar */}
        {recipe.artwork && (
          <div className="hidden shrink-0 lg:block lg:sticky lg:top-24 lg:self-start">
            <ImageLightbox
              src={recipe.artwork}
              alt={`${recipe.name} artwork`}
              thumbnailWidth={250}
              thumbnailHeight={320}
            />
          </div>
        )}
      </div>
    </main>
  )
}

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="text-center">
      <div
        className={`text-xl font-semibold ${highlight ? 'text-accent' : 'text-lavender'}`}
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-text-secondary">
        {label}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
  fullWidth = false,
}: {
  title: string
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? '' : ''}>
      <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
        {title}
      </h3>
      {children}
    </div>
  )
}

function MineralBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-lg text-text-primary">{Math.round(value)}</div>
      <div className="text-xs text-text-secondary">{label} (ppm)</div>
    </div>
  )
}

function hasWaterData(water: {
  calcium?: number
  magnesium?: number
  sodium?: number
  chloride?: number
  sulfate?: number
  bicarbonate?: number
}): boolean {
  return (
    water.calcium !== undefined ||
    water.magnesium !== undefined ||
    water.sodium !== undefined ||
    water.chloride !== undefined ||
    water.sulfate !== undefined ||
    water.bicarbonate !== undefined
  )
}
