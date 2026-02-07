'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ThemeColors {
  bgDark: string
  bgCard: string
  bgHover: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentDark: string
  accentLight: string
  lavender: string
  lavenderDark: string
  lavenderLight: string
  border: string
  statusSuccess: string
  statusWarning: string
  statusError: string
}

interface Theme {
  name: string
  description: string
  favorite?: boolean
  colors: ThemeColors
}

const themes: Theme[] = [
  {
    name: 'Midnight Indigo',
    description: 'Midnight Navy depths + Deep Indigo highlights. The blend.',
    favorite: true,
    colors: {
      bgDark: '#0a0a0f',
      bgCard: '#14141c',
      bgHover: '#1e1e2a',
      textPrimary: '#e8e8f2',
      textSecondary: '#c8d0e8',
      accent: '#d0a52e',
      accentDark: '#ab8825',
      accentLight: '#e8bb38',
      lavender: '#a2ace0',
      lavenderDark: '#828cc0',
      lavenderLight: '#c0c8ee',
      border: '#2a2a3a',
      statusSuccess: '#4a8c5e',
      statusWarning: '#d0a52e',
      statusError: '#a84444',
    },
  },
  {
    name: 'Midnight Navy',
    description: 'Dark navy blues with gold accent.',
    colors: {
      bgDark: '#111528',
      bgCard: '#1a1f3a',
      bgHover: '#242a4a',
      textPrimary: '#e8e8f0',
      textSecondary: '#c8d0e4',
      accent: '#c9a227',
      accentDark: '#a68521',
      accentLight: '#e3b832',
      lavender: '#9ca8d8',
      lavenderDark: '#7b88b8',
      lavenderLight: '#b8c2e8',
      border: '#333a55',
      statusSuccess: '#4a8c5e',
      statusWarning: '#c9a227',
      statusError: '#a84444',
    },
  },
  {
    name: 'Obsidian',
    description: 'The original near-black with subtle blue undertones.',
    colors: {
      bgDark: '#0a0a0f',
      bgCard: '#14141c',
      bgHover: '#1e1e2a',
      textPrimary: '#e8e8f0',
      textSecondary: '#c8d0e4',
      accent: '#c9a227',
      accentDark: '#a68521',
      accentLight: '#e3b832',
      lavender: '#9ca8d8',
      lavenderDark: '#7b88b8',
      lavenderLight: '#b8c2e8',
      border: '#2a2a3a',
      statusSuccess: '#4a8c5e',
      statusWarning: '#c9a227',
      statusError: '#a84444',
    },
  },
  {
    name: 'Deep Indigo',
    description: 'Rich, saturated indigo with brighter lavender tones.',
    colors: {
      bgDark: '#12133a',
      bgCard: '#1a1c4a',
      bgHover: '#25285a',
      textPrimary: '#e8e8f4',
      textSecondary: '#c0c6e8',
      accent: '#d4a832',
      accentDark: '#b08a28',
      accentLight: '#eabd3c',
      lavender: '#a8b0e8',
      lavenderDark: '#8890c8',
      lavenderLight: '#c4caf0',
      border: '#3a3d6a',
      statusSuccess: '#4a8c5e',
      statusWarning: '#d4a832',
      statusError: '#a84444',
    },
  },
  {
    name: 'Charcoal Slate',
    description: 'Neutral blue-gray. More breathable and understated.',
    colors: {
      bgDark: '#181b24',
      bgCard: '#21252f',
      bgHover: '#2c313d',
      textPrimary: '#e4e6ec',
      textSecondary: '#b8bcc8',
      accent: '#c9a227',
      accentDark: '#a68521',
      accentLight: '#e3b832',
      lavender: '#8e96ac',
      lavenderDark: '#727a90',
      lavenderLight: '#aab2c4',
      border: '#3c424f',
      statusSuccess: '#4a8c5e',
      statusWarning: '#c9a227',
      statusError: '#a84444',
    },
  },
  {
    name: 'Dark Emerald',
    description: 'Deep green undertones with sage secondary tones.',
    colors: {
      bgDark: '#0c1812',
      bgCard: '#14241c',
      bgHover: '#1e3228',
      textPrimary: '#e4f0e8',
      textSecondary: '#b8d0c4',
      accent: '#c9a227',
      accentDark: '#a68521',
      accentLight: '#e3b832',
      lavender: '#7cb898',
      lavenderDark: '#5e9878',
      lavenderLight: '#9cd4b4',
      border: '#2c4438',
      statusSuccess: '#4a8c5e',
      statusWarning: '#c9a227',
      statusError: '#a84444',
    },
  },
  {
    name: 'Burgundy Night',
    description: 'Dark wine-tinted backgrounds with copper accent.',
    colors: {
      bgDark: '#1a0e12',
      bgCard: '#281820',
      bgHover: '#38242e',
      textPrimary: '#f0e4e8',
      textSecondary: '#d0b8c0',
      accent: '#d4943c',
      accentDark: '#b07830',
      accentLight: '#eaac4c',
      lavender: '#c898a8',
      lavenderDark: '#a87888',
      lavenderLight: '#e0b4c0',
      border: '#4a3540',
      statusSuccess: '#4a8c5e',
      statusWarning: '#d4943c',
      statusError: '#b04444',
    },
  },
  {
    name: 'Plum Dusk',
    description: 'Purple and violet tones with gold highlights.',
    colors: {
      bgDark: '#16101e',
      bgCard: '#201a30',
      bgHover: '#2c2542',
      textPrimary: '#ece8f4',
      textSecondary: '#c8c0d8',
      accent: '#c9a227',
      accentDark: '#a68521',
      accentLight: '#e3b832',
      lavender: '#b098d4',
      lavenderDark: '#9078b4',
      lavenderLight: '#ccb8e8',
      border: '#3e3558',
      statusSuccess: '#4a8c5e',
      statusWarning: '#c9a227',
      statusError: '#a84444',
    },
  },
  {
    name: 'Stormy Gray',
    description: 'Nearly neutral dark grays. Clean and minimal.',
    colors: {
      bgDark: '#141416',
      bgCard: '#1c1c20',
      bgHover: '#28282e',
      textPrimary: '#e8e8ea',
      textSecondary: '#b0b0b8',
      accent: '#c9a227',
      accentDark: '#a68521',
      accentLight: '#e3b832',
      lavender: '#9898a8',
      lavenderDark: '#787888',
      lavenderLight: '#b4b4c0',
      border: '#3a3a42',
      statusSuccess: '#4a8c5e',
      statusWarning: '#c9a227',
      statusError: '#a84444',
    },
  },
  {
    name: 'Ocean Depths',
    description: 'Dark teal and cyan undertones. Cool and aquatic.',
    colors: {
      bgDark: '#0c1518',
      bgCard: '#142024',
      bgHover: '#1e2c32',
      textPrimary: '#e4f0f4',
      textSecondary: '#b8d0d8',
      accent: '#c9a227',
      accentDark: '#a68521',
      accentLight: '#e3b832',
      lavender: '#78b8c8',
      lavenderDark: '#5898a8',
      lavenderLight: '#98d4e0',
      border: '#2a3e44',
      statusSuccess: '#4a8c5e',
      statusWarning: '#c9a227',
      statusError: '#a84444',
    },
  },
  {
    name: 'Warm Espresso',
    description: 'Dark brown warmth with amber accent. Like a stout.',
    colors: {
      bgDark: '#181210',
      bgCard: '#241c16',
      bgHover: '#322820',
      textPrimary: '#f0e8e0',
      textSecondary: '#d0c4b4',
      accent: '#d4a03c',
      accentDark: '#b08430',
      accentLight: '#eab84c',
      lavender: '#c4a888',
      lavenderDark: '#a48868',
      lavenderLight: '#dcc4a4',
      border: '#4a3c30',
      statusSuccess: '#4a8c5e',
      statusWarning: '#d4a03c',
      statusError: '#a84444',
    },
  },
]

const CSS_VAR_MAP: Record<keyof ThemeColors, string> = {
  bgDark: '--color-bg-dark',
  bgCard: '--color-bg-card',
  bgHover: '--color-bg-hover',
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  accent: '--color-accent',
  accentDark: '--color-accent-dark',
  accentLight: '--color-accent-light',
  lavender: '--color-lavender',
  lavenderDark: '--color-lavender-dark',
  lavenderLight: '--color-lavender-light',
  border: '--color-border',
  statusSuccess: '--color-status-success',
  statusWarning: '--color-status-warning',
  statusError: '--color-status-error',
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r} ${g} ${b}`
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    const hex = theme.colors[key as keyof ThemeColors]
    root.style.setProperty(cssVar, hexToRgb(hex))
  }
}

export default function ThemesPage() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    applyTheme(themes[activeIdx])
  }, [activeIdx])

  const theme = themes[activeIdx]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <Link
        href="/brews"
        className="mb-6 inline-flex items-center text-sm text-text-secondary transition-colors hover:text-accent"
      >
        <span className="mr-2">&larr;</span> Back to Brew Log
      </Link>

      <h1 className="mb-2 text-3xl text-text-primary">Theme Gallery</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Click a theme to preview it live. Navigate to other pages to see it in
        context.
      </p>

      {/* Theme selector grid */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {themes.map((t, idx) => (
          <button
            key={t.name}
            onClick={() => setActiveIdx(idx)}
            className={`relative rounded border p-3 text-left transition-all ${
              idx === activeIdx
                ? 'border-accent bg-bg-hover'
                : 'border-border bg-bg-card hover:border-accent/50'
            }`}
          >
            {/* Color swatches */}
            <div className="mb-2 flex gap-1">
              {[t.colors.bgDark, t.colors.bgCard, t.colors.bgHover, t.colors.border].map(
                (c, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-sm"
                    style={{ backgroundColor: c }}
                  />
                )
              )}
              <div
                className="h-4 w-4 rounded-sm"
                style={{ backgroundColor: t.colors.accent }}
              />
              <div
                className="h-4 w-4 rounded-sm"
                style={{ backgroundColor: t.colors.lavender }}
              />
            </div>
            <p className="text-sm font-medium text-text-primary">
              {t.name}
              {t.favorite && (
                <span className="ml-1 text-accent"> *</span>
              )}
            </p>
            <p className="text-xs text-text-secondary">{t.description}</p>
          </button>
        ))}
      </div>

      {/* Live preview */}
      <div className="rounded border border-border">
        <div className="border-b border-border bg-bg-card px-5 py-3">
          <span className="text-xs font-medium uppercase tracking-widest text-lavender">
            Live Preview &mdash; {theme.name}
          </span>
        </div>

        <div className="space-y-8 p-6">
          {/* Mock navbar */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-lg font-bold tracking-wide text-text-primary">
              WASTED YEARS
            </span>
            <div className="flex gap-6 text-sm">
              <span className="text-accent">Brews</span>
              <span className="text-text-secondary">Recipes</span>
            </div>
          </div>

          {/* Mock batch hero */}
          <div className="border-b border-border pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-lavender-dark">
                  Batch
                </div>
                <div className="text-5xl font-bold text-accent">#91</div>
                <h2 className="mt-3 text-3xl text-text-primary">Overlord</h2>
                <p className="text-lg uppercase tracking-wide text-accent">
                  American IPA
                </p>
                <div className="mt-3 inline-flex items-center gap-2">
                  <div
                    className="rounded-full p-1.5"
                    style={{ backgroundColor: 'rgba(205,127,50,0.15)' }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      style={{ color: '#CD7F32' }}
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#CD7F32' }}
                  >
                    Mini B.O.S. (Bronze)
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded border border-status-success/40 bg-status-success/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-status-success">
                  Completed
                </span>
                <span className="rounded border border-border bg-bg-card px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                  brewfather
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-text-secondary">
              <div>
                <span className="mr-2 text-lavender-dark">Brewed:</span>
                May 18, 2024
              </div>
              <div>
                <span className="mr-2 text-lavender-dark">Bottled:</span>
                Jun 2, 2024
              </div>
              <div>
                <span className="mr-2 text-lavender-dark">Brewer:</span>
                Joe Carlyon
              </div>
            </div>
          </div>

          {/* Mock stats bar */}
          <div className="grid grid-cols-3 gap-4 border-b border-border pb-6 sm:grid-cols-7">
            {[
              { label: 'OG', value: '1.066', highlight: false },
              { label: 'FG', value: '1.012', highlight: false },
              { label: 'ABV', value: '7.1%', highlight: true },
              { label: 'IBU', value: '65', highlight: true },
              { label: 'SRM', value: '8', highlight: false },
              { label: 'Eff', value: '72%', highlight: false },
              { label: 'Batch', value: '5.5 gal', highlight: false },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className={`text-xl font-semibold ${s.highlight ? 'text-accent' : 'text-lavender'}`}
                >
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-wide text-text-secondary">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mock ingredients */}
          <div className="grid gap-8 border-b border-border pb-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
                Fermentables
              </h3>
              <ul className="space-y-2">
                {[
                  ['Pale Malt 2-Row', '11.50 lb'],
                  ['Caramel/Crystal 40L', '1.00 lb'],
                  ['Munich Malt', '0.75 lb'],
                ].map(([name, amount]) => (
                  <li key={name} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{name}</span>
                    <span className="text-text-primary">{amount}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
                Hops
              </h3>
              <ul className="space-y-2">
                {[
                  ['Centennial', '2.00 oz \u00b7 Boil 60 min'],
                  ['Cascade', '1.50 oz \u00b7 Boil 15 min'],
                  ['Simcoe', '1.00 oz \u00b7 Dry Hop'],
                ].map(([name, detail]) => (
                  <li key={name} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{name}</span>
                    <span className="text-text-primary">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mock notes */}
          <div className="space-y-6 border-b border-border pb-6">
            <div>
              <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
                Tasting Notes
              </h3>
              <p className="text-sm italic text-text-secondary">
                &ldquo;Pine and citrus hop aroma with a clean malt backbone.
                Medium body with a firm bitterness that lingers. Finishes
                dry.&rdquo;
              </p>
            </div>
          </div>

          {/* Mock competition card */}
          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
              Competition Results
            </h3>
            <div className="border border-border bg-bg-card p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="font-medium text-text-primary">
                    Gregory Roskopf
                  </p>
                  <p className="text-xs text-text-secondary">
                    Brownsburg, USA
                  </p>
                  <p className="text-xs text-lavender-dark">
                    BJCP Certified
                  </p>
                </div>
                <div className="text-xl font-bold text-accent">
                  37
                  <span className="text-xs font-normal text-text-secondary">
                    /50
                  </span>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-5 gap-2">
                {[
                  ['Aroma', '8', '12'],
                  ['App', '3', '3'],
                  ['Flavor', '15', '20'],
                  ['MF', '4', '5'],
                  ['Overall', '7', '10'],
                ].map(([label, score, max]) => (
                  <div key={label} className="text-center">
                    <div className="text-sm font-semibold text-lavender">
                      {score}
                      <span className="text-xs font-normal text-text-secondary">
                        /{max}
                      </span>
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-text-secondary">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mb-3 text-xs text-status-error">
                Flaws: Diacetyl (L)
              </p>
              <p className="text-sm italic text-text-secondary">
                &ldquo;Overall a well crafted IPA. A touch light on IBUs,
                clean fermentation profile. Traditional American hop profile
                of pine, resin, lemon citrus. I enjoyed this beer!&rdquo;
              </p>
            </div>
          </div>

          {/* Mock recipe card */}
          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
              Recipe Card Sample
            </h3>
            <div className="border border-border bg-bg-card p-6 transition-all hover:border-accent hover:bg-bg-hover">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="mb-1 text-xl text-text-primary">Overlord</h4>
                  <p className="mb-4 text-sm uppercase tracking-wide text-accent">
                    American IPA
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="rounded-full p-2"
                    style={{ backgroundColor: 'rgba(205,127,50,0.15)' }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                      style={{ color: '#CD7F32' }}
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: '#CD7F32' }}
                  >
                    3rd Place
                  </span>
                </div>
              </div>
              <p className="mb-1 text-sm text-text-secondary">
                West Coast-style IPA with Centennial, Cascade, and Simcoe hops.
              </p>
              <div className="mb-4 grid grid-cols-5 gap-2 border-b border-t border-border py-4">
                {[
                  { label: 'OG', value: '1.066', accent: false },
                  { label: 'FG', value: '1.012', accent: false },
                  { label: 'ABV', value: '7.1%', accent: true },
                  { label: 'IBU', value: '65', accent: true },
                  { label: 'Size', value: '5.5g', accent: false },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div
                      className={`text-lg font-semibold ${s.accent ? 'text-accent' : 'text-lavender'}`}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-text-secondary">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h5 className="mb-2 text-xs uppercase tracking-wide text-lavender-dark">
                  Grains
                </h5>
                <ul className="text-sm text-text-secondary">
                  {['Pale Malt 2-Row', 'Caramel/Crystal 40L', 'Munich Malt'].map(
                    (g) => (
                      <li
                        key={g}
                        className="relative py-1 pl-4 before:absolute before:left-0 before:text-xs before:text-accent before:content-['//']"
                      >
                        {g}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Link to test on real pages */}
          <div className="flex flex-wrap gap-4 border-t border-border pt-6">
            <span className="text-xs uppercase tracking-widest text-lavender">
              Test on real pages:
            </span>
            <Link
              href="/brews"
              className="text-sm text-text-secondary transition-colors hover:text-accent"
            >
              Brew Log
            </Link>
            <Link
              href="/brews/91"
              className="text-sm text-text-secondary transition-colors hover:text-accent"
            >
              Batch #91
            </Link>
            <Link
              href="/recipes"
              className="text-sm text-text-secondary transition-colors hover:text-accent"
            >
              Recipes
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
