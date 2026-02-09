import { BrewingSetup } from '@/types'

export const brewingSetups: BrewingSetup[] = [
  {
    id: 'electric-brewing',
    name: 'Electric Brewing',
    tagline: 'Precision meets simplicity',
    description:
      'Built around the Anvil Foundry 18 Gallon all-in-one system. Brew-in-a-bag setup with a recirculating pump for consistent mash temperatures. Water volume is the key adjustment between 5 and 10 gallon batches.',
    method: 'BIAB',
    era: '2022 - Present',
    batchSource: 'brewfather',
    equipment: [
      {
        name: 'Anvil Foundry 18 Gallon',
        role: 'All-In-One Brew System',
        description: '1600W electric element with built-in controller and grain basket',
        url: 'https://anvilbrewing.com/product/anvil-foundry-18-gallon/',
      },
      {
        name: 'Blichmann RipTide Pump',
        role: 'Mash Recirculation',
        description: 'Magnetic drive brewing pump for continuous wort recirculation',
        url: 'https://www.blichmannengineering.com/product/riptide-brewing-pump/',
      },
      {
        name: 'The Brew Bag',
        role: 'Grain Containment',
        description: 'Fine mesh bag inside grain basket for BIAB brewing',
        url: 'https://www.brewinabag.com/',
      },
      {
        name: 'Big Mouth Bubbler EVO 2',
        role: 'Fermentation',
        description: '6.5 gallon wide-mouth plastic fermenter',
        url: 'https://www.northernbrewer.com/collections/big-mouth-bubbler/products/big-mouth-bubbler-evo-2-6-5-gallon',
      },
      {
        name: 'SS Brewtech Brew Bucket 2.0',
        role: 'Fermentation',
        description: 'Stainless steel conical fermenter with rotating racking arm',
        url: 'https://www.ssbrewtech.com/products/brew-bucket-2-0',
      },
      {
        name: 'Chapman UniVessel 14 Gallon',
        role: 'Fermentation',
        description: '14 gallon stainless steel fermenter for large batches',
        url: 'https://www.amazon.com/dp/B018J82JOY',
      },
    ],
    specs: {
      batchSize: '5 - 10 gal',
      boilTime: '60 min',
      brewEfficiency: '63%',
      mashEfficiency: '71%',
      heatSource: 'Electric 1600W',
      mashMethod: 'BIAB + Recirc',
    },
  },
  {
    id: 'caveman-fire',
    name: 'Caveman Fire',
    tagline: 'Old school propane and steel',
    retired: true,
    description:
      'The original setup. Two 15-gallon keggles converted from Sankey kegs serve as the brew kettle and hot liquor tank. Paired with a cooler mash tun and two propane burners for all-grain brewing the old-fashioned way.',
    method: 'Traditional All-Grain',
    era: 'Pre-2022',
    batchSource: 'beersmith',
    equipment: [
      {
        name: '15 Gallon Keggle',
        role: 'Brew Kettle',
        description: 'Converted Sankey keg with ball valve and thermometer',
      },
      {
        name: '15 Gallon Keggle',
        role: 'Hot Liquor Tank',
        description: 'Second converted Sankey keg for sparge water',
      },
      {
        name: 'Cooler Mash Tun',
        role: 'Mash Tun',
        description: 'Insulated cooler with false bottom for mashing',
      },
      {
        name: 'Propane Burners (x2)',
        role: 'Heat Source',
        description: 'Two high-output propane burners for kettle and HLT',
      },
    ],
    specs: {
      batchSize: '5 - 10 gal',
      boilTime: '60 min',
      brewEfficiency: 'N/A',
      mashEfficiency: 'N/A',
      heatSource: 'Propane',
      mashMethod: 'Fly Sparge',
    },
  },
]
