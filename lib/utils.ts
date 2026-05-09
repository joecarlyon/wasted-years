import { Batch, Recipe } from '@/types'

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function findMatchingRecipe(
  batch: Pick<Batch, 'name'>,
  recipes: Recipe[]
): Recipe | undefined {
  const batchLower = batch.name.toLowerCase()
  const exact = recipes.find((r) => r.name.toLowerCase() === batchLower)
  if (exact) return exact
  return recipes.find((r) => {
    const recipeLower = r.name.toLowerCase()
    return (
      batchLower.startsWith(recipeLower) || recipeLower.startsWith(batchLower)
    )
  })
}

export function getStatusClasses(status: string): string {
  const baseClasses =
    'inline-block px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full'

  switch (status.toLowerCase()) {
    case 'completed':
      return `${baseClasses} bg-status-success text-text-primary`
    case 'fermenting':
      return `${baseClasses} bg-lavender-dark text-bg-dark`
    case 'conditioning':
      return `${baseClasses} bg-lavender text-bg-dark`
    case 'planning':
      return `${baseClasses} bg-accent text-bg-dark`
    default:
      return `${baseClasses} bg-border text-text-secondary`
  }
}
