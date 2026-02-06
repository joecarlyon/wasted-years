import { CompetitionEntry } from '@/types'

export const competitions: CompetitionEntry[] = [
  // NHC 2024 First Round - Chicago, IL
  // Batch 91 "Overlord v3" entered as "Overlord"
  {
    batchNo: 91,
    competition: 'NHC 2024 First Round - Chicago, IL',
    entryName: 'Overlord',
    style: '21A - American IPA',
    score: 36.5,
    scoreDescription: 'Very Good',
    categoryAverage: 32.6,
    placement: 'Mini B.O.S. (Bronze)',
    judges: [
      {
        name: 'Gregory Roskopf',
        location: 'Brownsburg, USA',
        bjcpRank: 'Certified',
        score: 37,
        scores: {
          aroma: [8, 12],
          appearance: [3, 3],
          flavor: [15, 20],
          mouthfeel: [4, 5],
          overall: [7, 10],
        },
        feedback:
          'Overall a well crafted IPA. A touch light on IBUs, more-so on aroma, and flavor seem muted to what would be ideal in the style. Clean fermentation profile. Traditional American hop profile of pine, resin, lemon citrus. Check fermentation temps for diacetyl rest. I enjoyed this beer!',
        flaws: 'Diacetyl (L)',
      },
      {
        name: 'Chris Pisney',
        location: 'Chicago, USA',
        bjcpRank: 'Certified',
        certifications:
          'Master Cicerone, IBD Diploma in Brewing, Siebel Institute grad',
        score: 36,
        scores: {
          aroma: [7, 12],
          appearance: [3, 3],
          flavor: [14, 20],
          mouthfeel: [5, 5],
          overall: [7, 10],
        },
        feedback:
          "The recipe is solid, with some interesting hop flavors. The background note of diacetyl is pretty low, but it muddles up the overall flavor profile and overshadows all of the good things about the recipe. Get rid of that diacetyl and you'll have an excellent beer.",
        flaws: 'Diacetyl (L)',
      },
    ],
  },

  // NHC 2025 First Round
  // Batch 94 "Overlord v3.1" entered as "Overlord"
  {
    batchNo: 94,
    competition: 'NHC 2025 First Round',
    entryName: 'Overlord',
    style: '21A - American IPA',
    score: 30,
    scoreDescription: 'Very Good',
    categoryAverage: 34.2,
    judges: [
      {
        name: 'Chris Williams',
        location: 'USA',
        bjcpRank: 'Certified',
        certifications:
          'Advanced Cicerone, Competition Director of Brewers Association (GABF, World Beer Cup & NHC)',
        score: 32,
        scores: {
          aroma: [7, 12],
          appearance: [3, 3],
          flavor: [12, 20],
          mouthfeel: [4, 5],
          overall: [6, 10],
        },
        feedback:
          "Overall, this is a pretty well-balanced beer. Malt & hops play well together and don't overpower one another, and it certainly has a lingering bitterness typical of an IPA in the finish, but it comes across as more of a strong pale ale in that the hop character (the aromatics and flavors) are just slightly muted and don't distinctly stand out as you'd expect in an IPA. This beer has a great foundation, so just some slight tweaking could take this and make it amazing - just don't overdo it.",
      },
      {
        name: 'Jose Dias',
        location: 'San Diego, USA',
        bjcpRank: 'Recognized',
        score: 28.5,
        scores: {
          aroma: [7, 12],
          appearance: [2.5, 3],
          flavor: [11, 20],
          mouthfeel: [3, 5],
          overall: [5, 10],
        },
        feedback:
          'Unfortunately this sample was oxidized. Look at your packaging process to minimize oxygen exposure, filling bottles on foam and capping quickly. Or perhaps this was an older bottle?',
        flaws: 'Oxidized (M), Astringent (L)',
      },
    ],
  },

  // NHC 2025 First Round - Chicago, IL
  // Batch 97 "Joeoverlord" entered as "Joeverlord"
  {
    batchNo: 97,
    competition: 'NHC 2025 First Round - Chicago, IL',
    entryName: 'Joeverlord',
    style: '21A - American IPA',
    score: 37.5,
    scoreDescription: 'Very Good',
    categoryAverage: 33.1,
    placement: 'Mini B.O.S. (Silver)',
    judges: [
      {
        name: 'Kyle Nordquist',
        location: 'Brookfield, USA',
        bjcpRank: 'National',
        score: 37,
        scores: {
          aroma: [8, 12],
          appearance: [3, 3],
          flavor: [14, 20],
          mouthfeel: [5, 5],
          overall: [7, 10],
        },
        feedback:
          "Good beer that I'd happily drink. Can tell that hop character was once a little more dominant, but appropriate to style with piney and tropical fruit notes. Has since picked up some slight oxidation that diminishes these qualities - would ensure that oxygen ingress during packaging is limited as much as possible; close transfer these delicate styles when possible, if not already part of your procedure.",
        flaws: 'Oxidized (L), Spicy (L)',
      },
      {
        name: 'Eric Duske',
        location: 'Willow Springs, USA',
        bjcpRank: 'Certified',
        score: 38,
        scores: {
          aroma: [9, 12],
          appearance: [3, 3],
          flavor: [14, 20],
          mouthfeel: [5, 5],
          overall: [7, 10],
        },
        feedback:
          "Well made, seems like it might be nearing the end of its really good age. If this goes on you should brew a fresh batch.",
      },
    ],
  },

  // NHC 2025 First Round - Chicago, IL
  // Batch 96 "Moo Moo Canoe"
  {
    batchNo: 96,
    competition: 'NHC 2025 First Round - Chicago, IL',
    entryName: 'Moo Moo Canoe',
    style: '16A - Sweet Stout',
    score: 35.5,
    scoreDescription: 'Very Good',
    categoryAverage: 33.7,
    judges: [
      {
        name: 'Ana Vargas Arriaga',
        location: 'Toluca, Mexico',
        bjcpRank: 'Rank Pending',
        certifications: 'DOEMENS Certified Beersommelier',
        score: 35,
        scores: {
          aroma: [6, 12],
          appearance: [3, 3],
          flavor: [14, 20],
          mouthfeel: [4, 5],
          overall: [8, 10],
        },
        feedback:
          'In general, well done according to the style, however, a little off-white towards the malt and the bitterness is not integrated so uniformly, however there are no faults or notable problems in the fermentation.',
      },
      {
        name: 'Gregory Roskopf',
        location: 'Brownsburg, USA',
        bjcpRank: 'Certified',
        score: 36,
        scores: {
          aroma: [10, 12],
          appearance: [3, 3],
          flavor: [13, 20],
          mouthfeel: [5, 5],
          overall: [5, 10],
        },
        feedback:
          'Incredible sweet, rich, malty flavors dominate this beer. Where it misses the mark on style is the lack of roasted barley/roasted coffee in the balance. There is the residual sweetness that lingers to style, yet there is little to no hop or roasted barley to balance the strong sweetness present. Check IBUs and grist to promote more of the coffee, dark chocolate, and hop notes to help balance the overall impression. While there is room for interpretation, I found this beer out of the balance for the elements present to style.',
      },
    ],
  },
]

// Recipe names that have won competition awards (for recipe card badges)
export const awardWinningRecipes: Record<
  string,
  { competition: string; placement: string; medal: 'gold' | 'silver' | 'bronze' }[]
> = {
  Overlord: [
    {
      competition: 'NHC 2025',
      placement: '2nd Place',
      medal: 'silver',
    },
    {
      competition: 'NHC 2024',
      placement: '3rd Place',
      medal: 'bronze',
    },
  ],
  Joeoverlord: [
    {
      competition: 'NHC 2025',
      placement: '2nd Place',
      medal: 'silver',
    },
  ],
}
