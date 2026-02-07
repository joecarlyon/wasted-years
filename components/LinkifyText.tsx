import React from 'react'

const URL_REGEX = /(https?:\/\/[^\s]+)/g

function labelFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, '')
    const slug = pathname.split('/').pop() || ''
    if (!slug) return url
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  } catch {
    return url
  }
}

export default function LinkifyText({ text, linkPrefix }: { text: string; linkPrefix?: React.ReactNode }) {
  const parts = text.split(URL_REGEX)
  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <React.Fragment key={i}>
            {linkPrefix}
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline transition-colors hover:text-lavender"
            >
              {labelFromUrl(part)}
            </a>
          </React.Fragment>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}
