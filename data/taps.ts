import { TapEntry } from '@/types'

// What's pouring from the kegerator, shown under "On Tap" on the home page.
// Add an entry when a keg goes on (`tapped` defaults to the batch's kegged
// date); set `kicked` when it runs dry. Kicked entries stay here as history —
// the most recent one is shown as the "last pour" when the taps are empty.
export const taps: TapEntry[] = [{ batchNo: 105, kicked: '2026-09-27' }]
