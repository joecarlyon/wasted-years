const { PHASE_PRODUCTION_BUILD } = require('next/constants')

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => ({
  // Static export only for `next build`. With it on in dev, Next 14 refuses
  // to serve metadata routes (sitemap.xml, opengraph-image) because it wants
  // generateStaticParams for their internal catch-all segment — even though
  // the production export generates them fine.
  output: phase === PHASE_PRODUCTION_BUILD ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
})
