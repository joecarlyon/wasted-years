import { readFile } from 'fs/promises'
import { join } from 'path'
import { ImageResponse } from 'next/og'

// Social preview cards (og:image), rendered to PNG at build time. Satori only
// reads TTF/OTF/WOFF — not the woff2 next/font serves — so Inter is vendored
// in assets/fonts.

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const C = {
  bg: '#0a0a0f',
  card: '#14141c',
  border: '#2a2a3a',
  text: '#e8e8f2',
  secondary: '#c8d0e8',
  accent: '#d0a52e',
  lavender: '#a2ace0',
}

async function fonts() {
  const dir = join(process.cwd(), 'assets/fonts')
  const [regular, bold] = await Promise.all([
    readFile(join(dir, 'Inter-Regular.ttf')),
    readFile(join(dir, 'Inter-Bold.ttf')),
  ])
  return [
    {
      name: 'Inter',
      data: regular,
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Inter',
      data: bold,
      weight: 700 as const,
      style: 'normal' as const,
    },
  ]
}

// Inline a /public image as a data URI so the renderer doesn't need a server
export async function publicImage(path: string): Promise<string | undefined> {
  try {
    const data = await readFile(join(process.cwd(), 'public', path))
    const type = path.endsWith('.png') ? 'image/png' : 'image/jpeg'
    return `data:${type};base64,${data.toString('base64')}`
  } catch {
    return undefined
  }
}

export interface OgCardProps {
  eyebrow?: string
  title: string
  subtitle?: string
  stats?: { label: string; value: string }[]
  image?: string // data URI
  medal?: { color: string; label: string }
}

export async function ogCard({
  eyebrow,
  title,
  subtitle,
  stats = [],
  image,
  medal,
}: OgCardProps) {
  const titleSize = title.length > 28 ? 60 : title.length > 18 ? 72 : 84

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: C.bg,
        color: C.text,
        fontFamily: 'Inter',
      }}
    >
      {/* Header, like the site's navbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          padding: '36px 64px 28px',
          background: C.card,
          borderBottom: `4px solid ${C.accent}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 3 }}>
            WASTED YEARS
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 5,
              color: C.lavender,
              marginTop: 4,
            }}
          >
            SPIRITS, RECORDS, AND BEERS
          </div>
        </div>
        <div style={{ fontSize: 22, color: C.lavender, display: 'flex' }}>
          wasted-years.vercel.app
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '48px 64px',
          gap: 56,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {eyebrow && (
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: 4,
                  color: C.lavender,
                  marginBottom: 12,
                }}
              >
                {eyebrow}
              </div>
            )}
            <div
              style={{
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 30,
                  letterSpacing: 2,
                  color: C.accent,
                  marginTop: 18,
                  textTransform: 'uppercase',
                }}
              >
                {subtitle}
              </div>
            )}
            {medal && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 22,
                  fontSize: 24,
                  color: C.text,
                }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24">
                  <path
                    fill={medal.color}
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  />
                </svg>
                <div style={{ marginLeft: 12, display: 'flex' }}>
                  {medal.label}
                </div>
              </div>
            )}
          </div>

          {stats.length > 0 && (
            <div style={{ display: 'flex', gap: 48 }}>
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{ fontSize: 44, fontWeight: 700, color: C.accent }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      letterSpacing: 3,
                      color: C.secondary,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div
            style={{
              display: 'flex',
              width: 300,
              height: 386,
              border: `6px solid ${C.text}`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              width={288}
              height={374}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() }
  )
}
