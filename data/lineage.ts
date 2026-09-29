// Which recipe each version evolved from, for the "Lineage" section on
// recipe pages. Keyed by the child recipe's UUID; values are the parent's.
// Hand-maintained — the Brewfather sync never touches this file.
export const recipeParents: Record<string, string> = {
  // Overlord
  '7fe5c4d7-7fe5-4fe5-7fe5-7fe5c4d77fe5':
    '4688b472-4688-4688-4688-4688b4724688', // Overlord v3.1 ← Overlord
  '6b780297-6b78-4b78-6b78-6b7802976b78':
    '7fe5c4d7-7fe5-4fe5-7fe5-7fe5c4d77fe5', // Joeoverlord ← Overlord v3.1
  '551217ed-5512-4512-5512-551217ed5512':
    '7fe5c4d7-7fe5-4fe5-7fe5-7fe5c4d77fe5', // Overlord 3.1 5g ← Overlord v3.1
  '7ff0db1e-7ff0-4ff0-7ff0-7ff0db1e7ff0':
    '551217ed-5512-4512-5512-551217ed5512', // Overlord v4.0 5g ← Overlord 3.1 5g

  // Moo Moo Canoe
  '702a2c03-702a-402a-702a-702a2c03702a':
    '014d4bba-014d-414d-014d-014d4bba014d', // Moo Moo Canoe (BeerSmith) ← Milk Stout-OG
  '06b42ae0-06b4-46b4-06b4-06b42ae006b4':
    '702a2c03-702a-402a-702a-702a2c03702a', // Moo Moo Canoe (Brewfather) ← Moo Moo Canoe (BeerSmith)

  // Withered Imperial Stout
  '0f4efd74-0f4e-4f4e-0f4e-0f4efd740f4e':
    '7608648c-7608-4608-7608-7608648c7608', // Withered Imperial Stout - Mashmallow ← OG
  '195a2c3b-195a-495a-195a-195a2c3b195a':
    '7608648c-7608-4608-7608-7608648c7608', // Withered Imperial Stout 3 ← OG

  // Devil's Wheat
  '761c7943-761c-461c-761c-761c7943761c':
    '39be846b-39be-49be-39be-39be846b39be', // Devil's Wheat 2 ← Devil's Wheat
  '4086cdd1-4086-4086-4086-4086cdd14086':
    '761c7943-761c-461c-761c-761c7943761c', // The Devil's Wheat 3 ← Devil's Wheat 2

  // The Devil's Narwhal
  '74f83a2b-74f8-44f8-74f8-74f83a2b74f8':
    '791635f6-7916-4916-7916-791635f67916', // The Devil's Narwhal NEIPA - 5/29/2019 ← The Devil's Narwhal NEIPA
  '27cfc2b0-27cf-47cf-27cf-27cfc2b027cf':
    '74f83a2b-74f8-44f8-74f8-74f83a2b74f8', // The Devil's Narwhal ← NEIPA - 5/29/2019

  '00b4bb4d-00b4-40b4-00b4-00b4bb4d00b4':
    '3689a985-3689-4689-3689-3689a9853689', // GaribaldiHead 2 ← GaribaldiHead
  '781dcec6-781d-481d-781d-781dcec6781d':
    '29e6054c-29e6-49e6-29e6-29e6054c29e6', // Little Heffer 2 ← Little Heffer
  '6ae2246b-6ae2-4ae2-6ae2-6ae2246b6ae2':
    '6419ff1f-6419-4419-6419-6419ff1f6419', // Invade Canada Redux ← Invade Canada
  '25e4c355-25e4-45e4-25e4-25e4c35525e4':
    '3035a803-3035-4035-3035-3035a8033035', // Confirmed Kill IPA 2 ← Confirmed Kill IPA
}
