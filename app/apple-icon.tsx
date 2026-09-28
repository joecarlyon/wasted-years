import { readFile } from 'fs/promises'
import { join } from 'path'
import { ImageResponse } from 'next/og'

// Home-screen icon, rendered from app/icon.svg so there's one source of
// truth. Full-bleed dark background: iOS rounds the corners itself.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), 'app/icon.svg'))
  const src = `data:image/svg+xml;base64,${svg.toString('base64')}`
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0a0a0f',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={180} height={180} alt="" />
    </div>,
    size
  )
}
