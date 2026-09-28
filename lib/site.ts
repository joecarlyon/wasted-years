// Production origin — used for absolute URLs in the sitemap, social preview
// metadata, and exported BeerXML files.
export const SITE_URL = 'https://wasted-years.vercel.app'

export const SITE_NAME = 'Wasted Years Brewing'

// A page's `openGraph` metadata replaces the root layout's wholesale rather
// than merging, so pages that set one spread this in to keep the site name.
export function openGraph(title: string, description?: string) {
  return {
    siteName: SITE_NAME,
    type: 'website' as const,
    title,
    ...(description && { description }),
  }
}
