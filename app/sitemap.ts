import type { MetadataRoute } from 'next'
import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '',
    '/recipes',
    '/brews',
    '/competitions',
    '/equipment',
    '/about',
  ]
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...recipes.map((r) => ({
      url: `${SITE_URL}/recipes/${r.uuid}`,
      ...(r.brewDate && { lastModified: r.brewDate }),
    })),
    ...batches.map((b) => ({
      url: `${SITE_URL}/brews/${b.batchNo}`,
      ...((b.bottlingDate || b.brewDate) && {
        lastModified: b.bottlingDate || b.brewDate,
      }),
    })),
  ]
}
