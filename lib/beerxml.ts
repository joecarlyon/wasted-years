import { Recipe } from '@/types'
import { RecipeIngredients } from '@/lib/recipe'

// BeerXML 1.0 (http://www.beerxml.com/beerxml.htm) — the format BeerSmith,
// Brewfather, Brewer's Friend, etc. all import. Everything in it is metric.
const LB_TO_KG = 0.45359237
const OZ_TO_KG = 0.028349523125
const GAL_TO_L = 3.785411784

const fToC = (f: number) => ((f - 32) * 5) / 9

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function num(value: number, digits = 4): string {
  return Number(value.toFixed(digits)).toString()
}

function el(name: string, value: string | number, indent: string): string {
  const text = typeof value === 'number' ? num(value) : esc(value)
  return `${indent}<${name}>${text}</${name}>`
}

// BeerXML only knows these five hop uses. Brewfather's "Whirlpool" is what
// BeerXML calls "Aroma" (post-boil); old BeerSmith "Bittering"/"Both" are boil
// additions.
function hopUse(use: string): string {
  const known = ['Boil', 'Dry Hop', 'Mash', 'First Wort', 'Aroma']
  if (known.includes(use)) return use
  if (use === 'Whirlpool') return 'Aroma'
  return 'Boil'
}

function fermentableType(name: string): string {
  if (/\b(dme|dry malt extract)\b/i.test(name)) return 'Dry Extract'
  if (/\b(extract|lme)\b/i.test(name)) return 'Extract'
  if (
    /sugar|honey|dextrose|sucrose|lactose|candi|syrup|molasses|maple|turbinado|piloncillo/i.test(
      name
    )
  )
    return 'Sugar'
  if (/flaked|oats|rice|corn|torrified|unmalted/i.test(name)) return 'Adjunct'
  return 'Grain'
}

// Specialty malts usually carry their color in the name ("Crystal 60L")
function colorFromName(name: string): number | undefined {
  const m = name.match(/(\d+)\s*°?\s*L\b/)
  return m ? parseInt(m[1], 10) : undefined
}

function isDryYeast(lab: string | undefined, name: string): boolean {
  return /fermentis|lallemand|mangrove|safale|saflager|nottingham|us-05|s-04|w-34/i.test(
    `${lab ?? ''} ${name}`
  )
}

export interface BeerXmlOptions {
  ingredients: RecipeIngredients // already scaled to batchSizeGal
  batchSizeGal: number
  boilTime: number
  efficiency?: number // % — unknown for the legacy setup
  sourceUrl?: string
}

export function recipeToBeerXml(recipe: Recipe, opts: BeerXmlOptions): string {
  const { ingredients, batchSizeGal, boilTime } = opts
  const batchL = batchSizeGal * GAL_TO_L
  const i2 = '  '
  const i3 = '    '
  const i4 = '      '
  const i5 = '        '
  const beerType =
    recipe.category === 'lager'
      ? 'Lager'
      : recipe.category === 'ale'
        ? 'Ale'
        : 'Mixed'

  const caveats: string[] = []
  const fermentables = ingredients.fermentables.map((f) => {
    const type = fermentableType(f.name)
    const color = f.color ?? colorFromName(f.name)
    return [
      `${i3}<FERMENTABLE>`,
      el('NAME', f.name, i4),
      el('VERSION', 1, i4),
      el('TYPE', type, i4),
      el('AMOUNT', f.amount * LB_TO_KG, i4),
      el('YIELD', type === 'Sugar' ? 100 : 75, i4),
      el('COLOR', color ?? 2, i4),
      `${i3}</FERMENTABLE>`,
    ].join('\n')
  })
  caveats.push(
    'Fermentable yields are estimates (75% for grain) - check them against your own ingredient library.'
  )
  if (ingredients.fermentables.some((f) => f.color === undefined)) {
    caveats.push(
      'Some malt colors were not recorded and are estimated from the name.'
    )
  }

  const hops = ingredients.hops.map((h) => {
    const use = hopUse(h.use)
    return [
      `${i3}<HOP>`,
      el('NAME', h.name, i4),
      el('VERSION', 1, i4),
      el('ALPHA', h.alpha ?? 0, i4),
      el('AMOUNT', h.amount * OZ_TO_KG, i4),
      el('USE', use, i4),
      el('TIME', use === 'Dry Hop' ? 0 : (h.time ?? 0), i4),
      `${i3}</HOP>`,
    ].join('\n')
  })
  if (ingredients.hops.some((h) => h.alpha === undefined)) {
    caveats.push('Hop alpha acids were not recorded for this recipe.')
  }
  if (
    ingredients.hops.some(
      (h) => h.time === undefined && hopUse(h.use) !== 'Dry Hop'
    )
  ) {
    caveats.push('Hop addition times were not recorded for this recipe.')
  }

  const yeastName =
    recipe.yeastDetail?.name ??
    (recipe.yeast && recipe.yeast !== 'Not specified' ? recipe.yeast : '')
  const yeasts = yeastName
    ? [
        `${i3}<YEAST>`,
        el('NAME', yeastName, i4),
        el('VERSION', 1, i4),
        el('TYPE', beerType === 'Lager' ? 'Lager' : 'Ale', i4),
        el(
          'FORM',
          isDryYeast(recipe.yeastDetail?.lab, yeastName) ? 'Dry' : 'Liquid',
          i4
        ),
        el('AMOUNT', 0, i4),
        ...(recipe.yeastDetail?.lab
          ? [el('LABORATORY', recipe.yeastDetail.lab, i4)]
          : []),
        ...(recipe.yeastDetail?.attenuation !== undefined
          ? [el('ATTENUATION', recipe.yeastDetail.attenuation, i4)]
          : []),
        ...(recipe.yeastDetail?.minTemp !== undefined
          ? [el('MIN_TEMPERATURE', fToC(recipe.yeastDetail.minTemp), i4)]
          : []),
        ...(recipe.yeastDetail?.maxTemp !== undefined
          ? [el('MAX_TEMPERATURE', fToC(recipe.yeastDetail.maxTemp), i4)]
          : []),
        `${i3}</YEAST>`,
      ].join('\n')
    : ''

  const steps = (recipe.mashProfile?.steps ?? []).map((s, idx) =>
    [
      `${i4}<MASH_STEP>`,
      el('NAME', s.name || `Step ${idx + 1}`, i5),
      el('VERSION', 1, i5),
      el(
        'TYPE',
        ['Infusion', 'Temperature', 'Decoction'].includes(s.type)
          ? s.type
          : 'Infusion',
        i5
      ),
      el('STEP_TEMP', fToC(s.stepTemp), i5),
      el('STEP_TIME', s.stepTime, i5),
      `${i4}</MASH_STEP>`,
    ].join('\n')
  )
  if (steps.length === 0) {
    caveats.push('No mash schedule was recorded for this recipe.')
  }
  const efficiency = opts.efficiency ?? 70
  if (opts.efficiency === undefined) {
    caveats.push('Brewhouse efficiency was not recorded; 70% is assumed.')
  }

  const notes = [
    recipe.description,
    `Exported from Wasted Years Brewing${opts.sourceUrl ? ` (${opts.sourceUrl})` : ''}.`,
    ...caveats,
  ]
    .filter(Boolean)
    .join('\n\n')

  const abv = recipe.abv || (recipe.og - recipe.fg) * 131.25

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<RECIPES>',
    `${i2}<RECIPE>`,
    el('NAME', recipe.name, i3),
    el('VERSION', 1, i3),
    el('TYPE', 'All Grain', i3),
    el('BREWER', 'Wasted Years Brewing', i3),
    `${i3}<STYLE>`,
    el('NAME', recipe.style, i4),
    el('VERSION', 1, i4),
    el('CATEGORY', recipe.style, i4),
    el('TYPE', beerType, i4),
    `${i3}</STYLE>`,
    el('BATCH_SIZE', batchL, i3),
    // No pre-boil volume on record; importers recalculate it from their own
    // equipment profile.
    el('BOIL_SIZE', batchL, i3),
    el('BOIL_TIME', boilTime, i3),
    el('EFFICIENCY', efficiency, i3),
    ...(recipe.og > 0
      ? [el('OG', recipe.og, i3), el('EST_OG', recipe.og, i3)]
      : []),
    ...(recipe.fg > 0
      ? [el('FG', recipe.fg, i3), el('EST_FG', recipe.fg, i3)]
      : []),
    ...(recipe.ibu > 0
      ? [el('IBU', recipe.ibu, i3), el('IBU_METHOD', 'Tinseth', i3)]
      : []),
    ...(recipe.color !== undefined && recipe.color > 0
      ? [el('EST_COLOR', recipe.color, i3)]
      : []),
    ...(abv > 0 ? [el('EST_ABV', abv, i3)] : []),
    el('NOTES', notes, i3),
    `${i3}<FERMENTABLES>`,
    ...fermentables,
    `${i3}</FERMENTABLES>`,
    `${i3}<HOPS>`,
    ...hops,
    `${i3}</HOPS>`,
    `${i3}<YEASTS>`,
    ...(yeasts ? [yeasts] : []),
    `${i3}</YEASTS>`,
    `${i3}<MISCS />`,
    `${i3}<WATERS />`,
    `${i3}<MASH>`,
    el('NAME', recipe.mashProfile?.name || 'Mash', i4),
    el('VERSION', 1, i4),
    el('GRAIN_TEMP', 20, i4),
    `${i4}<MASH_STEPS>`,
    ...steps,
    `${i4}</MASH_STEPS>`,
    `${i3}</MASH>`,
    `${i2}</RECIPE>`,
    '</RECIPES>',
    '',
  ].join('\n')
}
