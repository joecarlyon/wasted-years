'use client'

import { useEffect, useState } from 'react'

// "for 3 days" / "since today", counted from `date` to the viewer's today.
// The site is statically built, so this has to be worked out in the browser
// or it goes stale between deploys. Renders nothing on the server.
export default function DaysSince({
  date,
  prefix = '',
  suffix = '',
}: {
  date: string // YYYY-MM-DD
  prefix?: string
  suffix?: string
}) {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    const [y, m, d] = date.split('-').map(Number)
    const then = new Date(y, m - 1, d)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    setDays(Math.round((today.getTime() - then.getTime()) / 86_400_000))
  }, [date])

  if (days === null || days < 0) return null
  const label =
    days === 0
      ? 'since today'
      : `for ${days.toLocaleString()} day${days === 1 ? '' : 's'}`
  return (
    <>
      {prefix}
      {label}
      {suffix}
    </>
  )
}
