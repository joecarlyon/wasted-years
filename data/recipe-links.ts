// Batches whose names don't match their recipe's (typos, abbreviations, a
// recipe renamed after the brew). Checked before name matching in
// `findMatchingRecipe`. Keyed by batchNo; values are recipe UUIDs.
// Hand-maintained — the Brewfather sync never touches this file.
export const batchRecipeLinks: Record<number, string> = {
  18: '20ee907b-20ee-40ee-20ee-20ee907b20ee', // Blonde → Basic Blonde
  26: '04d0983f-04d0-44d0-04d0-04d0983f04d0', // Raging Redhead → Raging Red Head (updated malt)
  27: '1bf95e4c-1bf9-4bf9-1bf9-1bf95e4c1bf9', // Strawberrysaurus Rex → Strawberry Saurus-Rex
  29: '3411cdb3-3411-4411-3411-3411cdb33411', // Mosaic Dust → Mosiac Dust
  31: '7608648c-7608-4608-7608-7608648c7608', // Withered Stout → Withered Imperial Stout OG
  36: '12340f9d-1234-4234-1234-12340f9d1234', // Blue Moon Clone → Blue Balls
  37: '00b4bb4d-00b4-40b4-00b4-00b4bb4d00b4', // GarabaldiHead 2 → GaribaldiHead 2
  38: '6e1e68cc-6e1e-4e1e-6e1e-6e1e68cc6e1e', // Worlds Best OktoberFest → World's Best Oktoberfest
  39: '17896637-1789-4789-1789-178966371789', // Hop Tarted → Hop Stoopid
  42: '761c7943-761c-461c-761c-761c7943761c', // Devils Wheat → Devil's Wheat 2
  43: '761c7943-761c-461c-761c-761c7943761c', // Devils Wheat → Devil's Wheat 2
  49: '20ee907b-20ee-40ee-20ee-20ee907b20ee', // Blonde → Basic Blonde
  50: '1dd0e4e1-1dd0-4dd0-1dd0-1dd0e4e11dd0', // Rye Usurper → Usurper
  53: '195a2c3b-195a-495a-195a-195a2c3b195a', // Withered Stout 3 → Withered Imperial Stout 3
  60: '3689a985-3689-4689-3689-3689a9853689', // Garabaldi's Head → GaribaldiHead
  64: '1bf95e4c-1bf9-4bf9-1bf9-1bf95e4c1bf9', // Strawberrysaurus Rex → Strawberry Saurus-Rex
  66: '2fe6c90b-2fe6-4fe6-2fe6-2fe6c90b2fe6', // Smore Pumpkin → Smore Punkin
  71: '309a000d-309a-409a-309a-309a000d309a', // GFYS IPA → Go Fuck Yourself IPA
  76: '0547e758-0547-4547-0547-0547e7580547', // Wheat → Hoppy Session Wheat Beer - 4/6/19
  84: '46294688-4629-4629-4629-462946884629', // Hellez Yeah → Helles Yeah
  // Brewed as "Overlord v3" the day after the v3.1 recipe was created; by
  // name alone it would fall back to the 2015 BeerSmith "Overlord"
  91: '7fe5c4d7-7fe5-4fe5-7fe5-7fe5c4d77fe5', // Overlord v3 → Overlord v3.1
}
