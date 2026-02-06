// Detailed ingredient types for recipe detail pages
export interface RecipeHop {
  name: string
  amount: number
  time?: number
  use: string
  alpha?: number
}

export interface RecipeFermentable {
  name: string
  amount: number
  color?: number
  percentage?: number
}

export interface MashStep {
  name: string
  type: string
  stepTemp: number
  stepTime: number
}

export interface WaterProfile {
  calcium?: number
  magnesium?: number
  sodium?: number
  chloride?: number
  sulfate?: number
  bicarbonate?: number
}

export interface EquipmentProfile {
  name?: string
  batchSize?: number
  boilTime?: number
  efficiency?: number
}

export interface Recipe {
  id: number
  uuid: string // Stable identifier that won't change if recipes are renumbered
  name: string
  style: string
  category: 'ale' | 'lager' | 'spirit'
  description: string
  og: number
  fg: number
  abv: number
  ibu: number
  grains: string[]
  hops: string[]
  yeast: string
  source?: 'brewfather' | 'beersmith'
  brewDate?: string
  // Detail fields (optional - available for Brewfather recipes)
  fermentablesDetail?: RecipeFermentable[]
  hopsDetail?: RecipeHop[]
  yeastDetail?: {
    name: string
    lab?: string
    attenuation?: number
    minTemp?: number
    maxTemp?: number
  }
  mashProfile?: {
    name?: string
    steps: MashStep[]
  }
  waterProfile?: WaterProfile
  equipmentProfile?: EquipmentProfile
  boilTime?: number
  batchSize?: number
  color?: number
  notes?: string
  artwork?: string // Path to recipe artwork image
}

export interface Fermentable {
  name: string
  amount: number
}

export interface Hop {
  name: string
  amount: number
  usage: 'Bittering' | 'Aroma' | 'Both'
}

export interface Yeast {
  name: string
  laboratory: string
  productId: string
}

// Competition judging types
export interface JudgeScore {
  name: string
  location: string
  bjcpRank: string
  certifications?: string
  score: number
  scores: {
    aroma: [number, number]
    appearance: [number, number]
    flavor: [number, number]
    mouthfeel: [number, number]
    overall: [number, number]
  }
  feedback: string
  flaws?: string
}

export interface CompetitionEntry {
  batchNo: number
  competition: string
  entryName: string
  style: string
  score: number
  scoreDescription: string
  categoryAverage: number
  placement?: string
  judges: JudgeScore[]
}

export interface Batch {
  batchNo: number
  name: string
  style: string
  category: string
  brewer: string
  status: 'Completed' | 'Planning' | 'Fermenting' | 'Conditioning'
  brewDate: string
  bottlingDate: string
  og: number
  fg: number
  abv: number
  ibu: number | null
  color: number
  efficiency: number
  batchSize: number
  fermentables: Fermentable[]
  hops: Hop[]
  yeast: Yeast[]
  brewingNotes?: string
  tastingNotes?: string
  source?: 'brewfather' | 'beersmith'
}
