export interface Recipe {
  id: number
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
