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
      },
      {
        name: 'Recirculating Pump',
        role: 'Mash Recirculation',
        description: 'Continuous wort recirculation for even mash temperatures',
      },
      {
        name: 'Brew Bag',
        role: 'Grain Containment',
        description: 'Fine mesh bag inside grain basket for BIAB brewing',
      },
      {
        name: 'Anvil Bucket Fermenter',
        role: 'Fermentation',
        description: '7.5 gallon stainless steel bucket fermenter with rotating racking arm',
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
    description:
      'The original setup. Two 15-gallon keggles converted from Sankey kegs serve as the brew kettle and hot liquor tank. Paired with a cooler mash tun and two propane burners for all-grain brewing the old-fashioned way.',
    method: 'Traditional All-Grain',
    era: 'Pre-2020',
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
