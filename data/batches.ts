import { Batch } from '@/types'

export const batches: Batch[] = [
  {
    batchNo: 12,
    name: 'Czech It Out',
    style: 'Czech Amber Lager',
    category: 'Czech Lager',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-08-08',
    bottlingDate: '2023-08-22',
    og: 1.035,
    fg: 1.005,
    abv: 3.9,
    ibu: 16,
    color: 21.1,
    efficiency: 52.2,
    batchSize: 0,
    fermentables: [
      {
        name: 'Vienna Malt',
        amount: 2.72,
      },
      {
        name: 'Munich',
        amount: 0.91,
      },
      {
        name: 'Caramunich II',
        amount: 0.45,
      },
      {
        name: 'Carafa Special I',
        amount: 0.23,
      },
      {
        name: 'Dark Munich Malt 30L',
        amount: 0.23,
      },
    ],
    hops: [
      {
        name: 'Saaz',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Saaz',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Saaz',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'Lutra Kveik',
        laboratory: 'Omega',
        productId: 'OYL-071',
      },
    ],
  },
  {
    batchNo: 18,
    name: 'Overlord v3',
    style: 'American IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-04-28',
    bottlingDate: '2024-05-17',
    og: 1.056,
    fg: 0,
    abv: 5.6,
    ibu: 82,
    color: 9,
    efficiency: 62.5,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 9.98,
      },
      {
        name: 'Caramel Malt 20L',
        amount: 0.91,
      },
      {
        name: 'Carapils',
        amount: 0.91,
      },
      {
        name: 'Rye, Flaked',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Citra',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 5,
        usage: 'Aroma',
      },
      {
        name: 'Citra',
        amount: 6,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast IV',
        laboratory: 'Omega',
        productId: 'OYL-050',
      },
    ],
  },
  {
    batchNo: 7,
    name: 'Spicy Sprinkles',
    style: 'Unknown',
    category: 'ale',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-03-18',
    bottlingDate: '2023-04-01',
    og: 0,
    fg: 0,
    abv: 6.7,
    ibu: 39,
    color: 22.8,
    efficiency: 60,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pilsner Malt 2-Row',
        amount: 5.44,
      },
      {
        name: 'Caramel Rye',
        amount: 1.36,
      },
      {
        name: 'Carared',
        amount: 0.91,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Special B',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Pacific Jade',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Cascade',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Pacific Jade',
        amount: 2.5,
        usage: 'Aroma',
      },
      {
        name: 'Cascade',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Pacific Jade',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'Star Party',
        laboratory: 'Omega Yeast',
        productId: 'OYL-404',
      },
    ],
  },
  {
    batchNo: 9,
    name: 'Beginning Bourbon',
    style: 'Whiskey',
    category: 'spirit',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-04-29',
    bottlingDate: '2023-05-13',
    og: 0,
    fg: 0,
    abv: 6.4,
    ibu: null,
    color: 4.1,
    efficiency: 63.6,
    batchSize: 0,
    fermentables: [
      {
        name: 'Corn Yellow, Flaked',
        amount: 2.95,
      },
      {
        name: 'Organic 2row Pale Malt',
        amount: 1.36,
      },
      {
        name: 'Rye Malt',
        amount: 0.68,
      },
      {
        name: 'Wheat Malt',
        amount: 0.45,
      },
    ],
    hops: [],
    yeast: [
      {
        name: 'HotHead Ale',
        laboratory: 'Omega',
        productId: 'OYL-057',
      },
    ],
  },
  {
    batchNo: 19,
    name: 'Bavarian hefeweizen',
    style: 'Weissbier',
    category: 'German Wheat Beer',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-05-24',
    bottlingDate: '2024-06-07',
    og: 1.039,
    fg: 0,
    abv: 3.8,
    ibu: 17,
    color: 3.9,
    efficiency: 56.5,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Malt 2-Row',
        amount: 4.08,
      },
      {
        name: 'Wheat White Malt',
        amount: 3.18,
      },
      {
        name: 'Wheat Flaked',
        amount: 0.91,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Munich I',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Cascade',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Mandarina Bavaria',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Cascade',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'Hefeweizen Ale',
        laboratory: 'Omega',
        productId: 'OYL-021',
      },
    ],
  },
  {
    batchNo: 13,
    name: 'Wheat vodka',
    style: 'Vodka',
    category: 'spirit',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-08-19',
    bottlingDate: '2023-09-02',
    og: 0,
    fg: 0,
    abv: 4.1,
    ibu: null,
    color: 5,
    efficiency: 63.6,
    batchSize: 0,
    fermentables: [
      {
        name: 'Wheat White Malt',
        amount: 5.98,
      },
    ],
    hops: [],
    yeast: [
      {
        name: 'Pinnacle Distillers (S)',
        laboratory: 'White Labs',
        productId: 'WLDPINNACLE S',
      },
    ],
  },
  {
    batchNo: 31,
    name: 'Rum Wash',
    style: 'Rum',
    category: 'spirit',
    brewer: 'Joe',
    status: 'Planning',
    brewDate: '2025-07-29',
    bottlingDate: '2025-08-11',
    og: 1.155,
    fg: 1.032,
    abv: 16.1,
    ibu: null,
    color: 79.3,
    efficiency: 124.2,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Blackstrap Molasses',
        amount: 3.63,
      },
      {
        name: 'Cane (Beet) Sugar',
        amount: 2.72,
      },
    ],
    hops: [],
    yeast: [
      {
        name: 'Red Star Ale',
        laboratory: 'Red Star',
        productId: '',
      },
    ],
  },
  {
    batchNo: 16,
    name: 'Moo Moo Canoe',
    style: 'American Stout',
    category: 'American Porter and Stout',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-11-22',
    bottlingDate: '2023-12-06',
    og: 1.072,
    fg: 1.024,
    abv: 6.3,
    ibu: 43,
    color: 45.4,
    efficiency: 68.9,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 7.26,
      },
      {
        name: 'Milk Sugar (Lactose)',
        amount: 1.36,
      },
      {
        name: 'Chocolate',
        amount: 1.13,
      },
      {
        name: 'Barley, Flaked',
        amount: 0.91,
      },
      {
        name: 'Caramel Malt 60L',
        amount: 0.91,
      },
      {
        name: 'Munich II',
        amount: 0.91,
      },
      {
        name: 'Roasted Barley',
        amount: 0.91,
      },
      {
        name: 'Oats, Flaked',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Magnum',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Goldings, East Kent',
        amount: 2,
        usage: 'Bittering',
      },
    ],
    yeast: [
      {
        name: 'British Ale I',
        laboratory: 'Omega',
        productId: 'OYL-006',
      },
    ],
  },
  {
    batchNo: 3,
    name: 'Wry Smile Rye IPA',
    style: 'Rye IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2022-07-24',
    bottlingDate: '2022-08-07',
    og: 1.064,
    fg: 0,
    abv: 6.4,
    ibu: 83,
    color: 9.9,
    efficiency: 60.7,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Pale Malt 2-Row',
        amount: 4.99,
      },
      {
        name: 'Rye Malt',
        amount: 1.36,
      },
      {
        name: 'Crystal 60L',
        amount: 0.45,
      },
      {
        name: 'Carapils',
        amount: 0.23,
      },
      {
        name: 'Wheat White',
        amount: 0.23,
      },
    ],
    hops: [
      {
        name: 'Mount Hood',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Columbus (Tomahawk)',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Mount Hood',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Mount Hood',
        amount: 1,
        usage: 'Aroma',
      },
      {
        name: 'Columbus (Tomahawk)',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: "Denny's Favorite",
        laboratory: 'Wyeast Labs',
        productId: '1450',
      },
    ],
  },
  {
    batchNo: 14,
    name: 'Imperial Hefe',
    style: 'Weissbier',
    category: 'German Wheat Beer',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-09-17',
    bottlingDate: '2023-09-27',
    og: 1.056,
    fg: 0,
    abv: 5.5,
    ibu: 33,
    color: 6.2,
    efficiency: 43.7,
    batchSize: 19.9,
    fermentables: [
      {
        name: 'Pale Malt 2-Row',
        amount: 3.18,
      },
      {
        name: 'Wheat White Malt',
        amount: 3.18,
      },
      {
        name: 'Wheat Flaked',
        amount: 0.91,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Munich',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Lemondrop',
        amount: 1,
        usage: 'Bittering',
      },
    ],
    yeast: [
      {
        name: 'Hefeweizen Ale',
        laboratory: 'Omega',
        productId: 'OYL-021',
      },
    ],
  },
  {
    batchNo: 21,
    name: "The Devil's Narwhal",
    style: 'Hazy IPA (New England / NEIPA)',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-05-24',
    bottlingDate: '2024-06-14',
    og: 0,
    fg: 0,
    abv: 6,
    ibu: 61,
    color: 6.1,
    efficiency: 63.2,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 9.98,
      },
      {
        name: 'Oats, Flaked',
        amount: 1.36,
      },
      {
        name: 'Wheat White Malt',
        amount: 1.36,
      },
      {
        name: 'Carapils',
        amount: 0.91,
      },
      {
        name: 'Rye Malt',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Columbus (Tomahawk)',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Centennial',
        amount: 3,
        usage: 'Bittering',
      },
      {
        name: 'Columbus (Tomahawk)',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Cascade',
        amount: 4,
        usage: 'Aroma',
      },
      {
        name: 'Centennial',
        amount: 4,
        usage: 'Aroma',
      },
      {
        name: 'Centennial',
        amount: 3,
        usage: 'Aroma',
      },
      {
        name: 'Motueka',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Saaz',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Nelson Sauvin',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'British Ale V',
        laboratory: 'Omega',
        productId: 'OYL-011',
      },
    ],
  },
  {
    batchNo: 11,
    name: "The Devil's Wheat 3",
    style: 'American Wheat Beer',
    category: 'Standard American Beer',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-06-23',
    bottlingDate: '2023-07-07',
    og: 0,
    fg: 1.012,
    abv: 4.1,
    ibu: 26,
    color: 5.3,
    efficiency: 62.2,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 4.99,
      },
      {
        name: 'Wheat White Malt',
        amount: 4.99,
      },
      {
        name: 'Vienna Malt',
        amount: 0.59,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Rye, Flaked',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Columbus (Tomahawk)',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Amarillo',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Amarillo',
        amount: 4,
        usage: 'Aroma',
      },
      {
        name: 'Columbus (Tomahawk)',
        amount: 0.5,
        usage: 'Aroma',
      },
      {
        name: 'Amarillo',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Columbus (Tomahawk)',
        amount: 2,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'American Wheat',
        laboratory: 'Omega',
        productId: 'OYL-002',
      },
    ],
  },
  {
    batchNo: 2,
    name: 'Bavarian hefeweizen',
    style: 'Weissbier',
    category: 'German Wheat Beer',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2022-03-20',
    bottlingDate: '2022-04-03',
    og: 0,
    fg: 0,
    abv: 4.9,
    ibu: 21,
    color: 4.1,
    efficiency: 72,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Malt 2-Row',
        amount: 4.08,
      },
      {
        name: 'Wheat White Malt',
        amount: 3.18,
      },
      {
        name: 'Wheat Flaked',
        amount: 0.91,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Munich',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Aroma',
      },
      {
        name: 'Lemondrop',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'Hefeweizen Ale',
        laboratory: 'Omega',
        productId: 'OYL-021',
      },
    ],
  },
  {
    batchNo: 17,
    name: 'Second City Session IPA',
    style: 'Specialty IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-03-10',
    bottlingDate: '2024-03-24',
    og: 1.036,
    fg: 0,
    abv: 3.8,
    ibu: 48,
    color: 6,
    efficiency: 56,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 3.18,
      },
      {
        name: 'Caramel Malt 10L',
        amount: 0.45,
      },
      {
        name: 'Carapils',
        amount: 0.34,
      },
      {
        name: 'Caramel Malt 20L',
        amount: 0.23,
      },
      {
        name: 'Munich',
        amount: 0.23,
      },
    ],
    hops: [
      {
        name: 'Citra',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Amarillo',
        amount: 1,
        usage: 'Aroma',
      },
      {
        name: 'Simcoe',
        amount: 1,
        usage: 'Aroma',
      },
      {
        name: 'Chinook',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Simcoe',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast III',
        laboratory: 'Omega',
        productId: 'OYL-043',
      },
    ],
  },
  {
    batchNo: 1,
    name: 'Star Maker Imperial Stout',
    style: 'Imperial Stout',
    category: 'American Porter and Stout',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2022-09-21',
    bottlingDate: '2022-10-05',
    og: 0,
    fg: 1.032,
    abv: 13,
    ibu: 98,
    color: 86.5,
    efficiency: 59.6,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 8.16,
      },
      {
        name: 'Dark Chocolate Malt',
        amount: 1.02,
      },
      {
        name: 'Finest Maris Otter® Ale Malt',
        amount: 1.02,
      },
      {
        name: 'Oats, Flaked',
        amount: 1.02,
      },
      {
        name: 'Wheat White Malt',
        amount: 0.79,
      },
      {
        name: 'Crystal Medium',
        amount: 0.79,
      },
      {
        name: 'Special Roast',
        amount: 0.79,
      },
      {
        name: 'Roasted Barley',
        amount: 0.68,
      },
      {
        name: 'Carafa II',
        amount: 0.34,
      },
      {
        name: 'Crystal 120L',
        amount: 0.34,
      },
      {
        name: 'Brown Malt',
        amount: 0.23,
      },
    ],
    hops: [
      {
        name: 'Chinook',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Perle',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Chinook',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Perle',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Chinook',
        amount: 1,
        usage: 'Bittering',
      },
    ],
    yeast: [
      {
        name: 'Irish Ale',
        laboratory: 'Omega',
        productId: 'OYL-005',
      },
    ],
  },
  {
    batchNo: 6,
    name: 'Twin Pines Piney IPA',
    style: 'American IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2022-11-09',
    bottlingDate: '2022-11-23',
    og: 1.048,
    fg: 0,
    abv: 4.9,
    ibu: 115,
    color: 6,
    efficiency: 52.6,
    batchSize: 19.9,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 5.45,
      },
      {
        name: 'Vienna Malt',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Chinook',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Chinook',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Nelson Sauvin',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Chinook',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Nelson Sauvin',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Nelson Sauvin',
        amount: 2,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast Ale I',
        laboratory: 'Omega',
        productId: 'OYL-004',
      },
    ],
  },
  {
    batchNo: 29,
    name: 'Overlord 3.1 5g',
    style: 'American IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2025-05-11',
    bottlingDate: '2025-05-25',
    og: 1.069,
    fg: 0,
    abv: 7,
    ibu: 65,
    color: 7.7,
    efficiency: 71.7,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 5.44,
      },
      {
        name: 'Caramel Malt 20L',
        amount: 0.45,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Rye, Flaked',
        amount: 0.23,
      },
    ],
    hops: [
      {
        name: 'Citra',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 3,
        usage: 'Aroma',
      },
      {
        name: 'Citra',
        amount: 3,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast IV',
        laboratory: 'Omega',
        productId: 'OYL-050',
      },
    ],
  },
  {
    batchNo: 25,
    name: 'Joeoverlord',
    style: 'American IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-12-30',
    bottlingDate: '2025-02-03',
    og: 1.063,
    fg: 1.01,
    abv: 7,
    ibu: 44,
    color: 8.6,
    efficiency: 57.7,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 5.9,
      },
      {
        name: 'Caramel Malt 20L',
        amount: 0.57,
      },
      {
        name: 'Carapils',
        amount: 0.57,
      },
      {
        name: 'Rye, Flaked',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Cascade',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Cascade',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Cascade',
        amount: 3,
        usage: 'Aroma',
      },
      {
        name: 'Motueka',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Cascade',
        amount: 3,
        usage: 'Aroma',
      },
      {
        name: 'Nelson Sauvin',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast IV',
        laboratory: 'Omega',
        productId: 'OYL-050',
      },
    ],
  },
  {
    batchNo: 28,
    name: 'Overlord 3.1 5g',
    style: 'American IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2025-02-23',
    bottlingDate: '2025-03-08',
    og: 1.064,
    fg: 1.011,
    abv: 7,
    ibu: 67,
    color: 7.7,
    efficiency: 66.5,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 5.44,
      },
      {
        name: 'Caramel Malt 20L',
        amount: 0.45,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Rye, Flaked',
        amount: 0.23,
      },
    ],
    hops: [
      {
        name: 'Citra',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 3,
        usage: 'Aroma',
      },
      {
        name: 'Citra',
        amount: 3,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast IV',
        laboratory: 'Omega',
        productId: 'OYL-050',
      },
    ],
  },
  {
    batchNo: 22,
    name: 'Overlord v3.1',
    style: 'American IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-06-30',
    bottlingDate: '2024-07-14',
    og: 1.055,
    fg: 0,
    abv: 5.5,
    ibu: 71,
    color: 7.9,
    efficiency: 55.8,
    batchSize: 37.9,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 9.98,
      },
      {
        name: 'Caramel Malt 20L',
        amount: 0.91,
      },
      {
        name: 'Carapils',
        amount: 0.91,
      },
      {
        name: 'Rye, Flaked',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Citra',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Citra',
        amount: 6,
        usage: 'Aroma',
      },
      {
        name: 'Citra',
        amount: 6,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast IV',
        laboratory: 'Omega',
        productId: 'OYL-050',
      },
    ],
  },
  {
    batchNo: 1,
    name: 'Bavarian hefeweizen',
    style: 'Weissbier',
    category: 'German Wheat Beer',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2022-03-15',
    bottlingDate: '2022-03-29',
    og: 0,
    fg: 0,
    abv: 4.9,
    ibu: 21,
    color: 4.1,
    efficiency: 72,
    batchSize: 0,
    fermentables: [
      {
        name: 'Pale Malt 2-Row',
        amount: 4.08,
      },
      {
        name: 'Wheat White Malt',
        amount: 3.18,
      },
      {
        name: 'Wheat Flaked',
        amount: 0.91,
      },
      {
        name: 'Carapils',
        amount: 0.45,
      },
      {
        name: 'Munich',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Aroma',
      },
      {
        name: 'Lemondrop',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'Hefeweizen Ale',
        laboratory: 'Omega',
        productId: 'OYL-021',
      },
    ],
  },
  {
    batchNo: 24,
    name: 'Moo Moo Canoe',
    style: 'American Stout',
    category: 'American Porter and Stout',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-12-27',
    bottlingDate: '2025-01-18',
    og: 1.067,
    fg: 1.029,
    abv: 5,
    ibu: 43,
    color: 45.4,
    efficiency: 64.1,
    batchSize: 41.6,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 7.26,
      },
      {
        name: 'Milk Sugar (Lactose)',
        amount: 1.36,
      },
      {
        name: 'Chocolate',
        amount: 1.13,
      },
      {
        name: 'Barley, Flaked',
        amount: 0.91,
      },
      {
        name: 'Caramel Malt 60L',
        amount: 0.91,
      },
      {
        name: 'Munich II',
        amount: 0.91,
      },
      {
        name: 'Roasted Barley',
        amount: 0.91,
      },
      {
        name: 'Oats, Flaked',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Magnum',
        amount: 2,
        usage: 'Bittering',
      },
      {
        name: 'Goldings, East Kent',
        amount: 2,
        usage: 'Bittering',
      },
    ],
    yeast: [
      {
        name: 'British Ale I',
        laboratory: 'Omega',
        productId: 'OYL-006',
      },
    ],
  },
  {
    batchNo: 23,
    name: '4PyRyeO Pale Ale',
    style: 'American Pale Ale',
    category: 'Pale American Ale',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2024-09-30',
    bottlingDate: '2024-10-10',
    og: 1.05,
    fg: 0,
    abv: 5,
    ibu: 38,
    color: 10,
    efficiency: 53.4,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Pale Ale Golden Promise',
        amount: 3.63,
      },
      {
        name: 'BEST Red X®',
        amount: 0.91,
      },
      {
        name: 'Rye, Flaked',
        amount: 0.91,
      },
      {
        name: 'Melanoidin',
        amount: 0.45,
      },
      {
        name: 'Wheat Malt, Pale',
        amount: 0.45,
      },
      {
        name: 'Munich II',
        amount: 0.23,
      },
    ],
    hops: [
      {
        name: 'Columbus (Tomahawk)',
        amount: 0.4,
        usage: 'Bittering',
      },
      {
        name: 'Columbus (Tomahawk)',
        amount: 1.1,
        usage: 'Bittering',
      },
      {
        name: 'Mosaic',
        amount: 3,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'West Coast Ale I',
        laboratory: 'Omega',
        productId: 'OYL-004',
      },
    ],
  },
  {
    batchNo: 27,
    name: 'The Vienna',
    style: 'Vienna Lager',
    category: 'Amber Bitter European Beer',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2025-01-05',
    bottlingDate: '2025-02-06',
    og: 1.056,
    fg: 1.01,
    abv: 6,
    ibu: 27,
    color: 12.5,
    efficiency: 70.1,
    batchSize: 21.8,
    fermentables: [
      {
        name: 'Munich I',
        amount: 2.27,
      },
      {
        name: 'Pale Ale Finest Maris Otter',
        amount: 1.59,
      },
      {
        name: 'Vienna Malt',
        amount: 1.59,
      },
      {
        name: 'Chocolate',
        amount: 0.11,
      },
    ],
    hops: [
      {
        name: 'Nugget',
        amount: 0.8,
        usage: 'Bittering',
      },
      {
        name: 'Hallertau',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Nugget',
        amount: 0.2,
        usage: 'Bittering',
      },
    ],
    yeast: [
      {
        name: 'German Lager I PLUS Series (DKO)',
        laboratory: 'Omega',
        productId: 'OYL-437',
      },
    ],
  },
  {
    batchNo: 30,
    name: 'Anklebiter',
    style: 'American IPA',
    category: 'IPA',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2025-06-20',
    bottlingDate: '2025-06-29',
    og: 1.066,
    fg: 1.012,
    abv: 7.1,
    ibu: 51,
    color: 7.8,
    efficiency: 70,
    batchSize: 20.8,
    fermentables: [
      {
        name: 'Pale Ale Malt 2-Row',
        amount: 4.76,
      },
      {
        name: 'Vienna Malt',
        amount: 0.68,
      },
      {
        name: 'Honey Malt',
        amount: 0.45,
      },
      {
        name: 'Wheat Flaked',
        amount: 0.45,
      },
    ],
    hops: [
      {
        name: 'Eukanot',
        amount: 0.5,
        usage: 'Bittering',
      },
      {
        name: 'Cashmere',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Mandarina Bavaria',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Cashmere',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Aroma',
      },
      {
        name: 'Mandarina Bavaria',
        amount: 1,
        usage: 'Aroma',
      },
      {
        name: 'Cashmere',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Mosaic',
        amount: 2,
        usage: 'Aroma',
      },
      {
        name: 'Hallertau Blanc',
        amount: 1,
        usage: 'Aroma',
      },
    ],
    yeast: [
      {
        name: 'Voss Kveik',
        laboratory: 'Omega',
        productId: 'OYL-061',
      },
    ],
  },
  {
    batchNo: 10,
    name: 'Hellez Yeah',
    style: 'German Helles Exportbier',
    category: 'Pale Bitter European Beer',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '2023-04-29',
    bottlingDate: '2023-05-13',
    og: 0,
    fg: 0,
    abv: 4.5,
    ibu: 25,
    color: 5.3,
    efficiency: 64.2,
    batchSize: 0,
    fermentables: [
      {
        name: 'Bohemian Pilsner',
        amount: 2.27,
      },
      {
        name: 'Pilsner Malt',
        amount: 1.81,
      },
      {
        name: 'Vienna Malt',
        amount: 0.57,
      },
      {
        name: 'Munich Malt, Germany',
        amount: 0.45,
      },
      {
        name: 'Carapils',
        amount: 0.29,
      },
      {
        name: 'Carahell',
        amount: 0.18,
      },
    ],
    hops: [
      {
        name: 'Hallertau',
        amount: 1,
        usage: 'Bittering',
      },
      {
        name: 'Hallertau',
        amount: 1,
        usage: 'Bittering',
      },
    ],
    yeast: [
      {
        name: 'Voss Kveik',
        laboratory: 'Omega',
        productId: 'OYL-061',
      },
    ],
  },
]
