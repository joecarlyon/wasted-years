import { ImageResponse } from 'next/og'

// Home-screen icon; the same pint as app/icon.svg, full-bleed (iOS rounds
// the corners itself).
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0a0a0f',
      }}
    >
      <svg width="180" height="180" viewBox="0 0 32 32">
        <path
          d="M7.5 10.5 L10.2 27.2 Q10.4 28.5 11.7 28.5 L20.3 28.5 Q21.6 28.5 21.8 27.2 L24.5 10.5 Z"
          fill="#d0a52e"
        />
        <circle cx="11" cy="9.2" r="3.4" fill="#e8e8f2" />
        <circle cx="16.2" cy="7.4" r="4" fill="#e8e8f2" />
        <circle cx="21.2" cy="9.2" r="3.4" fill="#e8e8f2" />
        <rect x="7.5" y="9.2" width="17" height="3" rx="1.5" fill="#e8e8f2" />
      </svg>
    </div>,
    size
  )
}
