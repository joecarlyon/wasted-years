'use client'

import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FermentationEvent, TiltReading } from '@/types'

interface FermentationChartProps {
  readings: TiltReading[]
  events?: FermentationEvent[]
  summary: {
    days: number
    og: number
    fg: number
    attenuation: number
    abv: number
  }
}

const ACCENT = 'rgb(208, 165, 46)'
const LAVENDER = 'rgb(162, 172, 224)'
const LAVENDER_DARK = 'rgb(130, 140, 192)'
const BORDER = 'rgb(42, 42, 58)'
const BG_CARD = 'rgb(20, 20, 28)'
const TEXT_SECONDARY = 'rgb(200, 208, 232)'

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const tooltipFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export default function FermentationChart({
  readings,
  events,
  summary,
}: FermentationChartProps) {
  const gravityDomain = useMemo<[number, number]>(() => {
    const gs = readings.map((r) => r.gravity)
    const min = Math.min(...gs)
    const max = Math.max(...gs)
    return [
      Math.floor((min - 0.005) * 1000) / 1000,
      Math.ceil((max + 0.005) * 1000) / 1000,
    ]
  }, [readings])

  const tempDomain = useMemo<[number, number]>(() => {
    const ts = readings.map((r) => r.temperature)
    return [Math.floor(Math.min(...ts) - 2), Math.ceil(Math.max(...ts) + 2)]
  }, [readings])

  return (
    <div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={readings}
            margin={{ top: 24, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid
              stroke={BORDER}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(t) => dateFmt.format(new Date(t))}
              tick={{ fill: TEXT_SECONDARY, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: BORDER }}
              minTickGap={48}
            />
            <YAxis
              yAxisId="gravity"
              domain={gravityDomain}
              tickFormatter={(v: number) => v.toFixed(3)}
              tick={{ fill: TEXT_SECONDARY, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={56}
              tickCount={5}
            />
            <YAxis
              yAxisId="temp"
              orientation="right"
              domain={tempDomain}
              tickFormatter={(v: number) => `${Math.round(v)}°`}
              tick={{ fill: TEXT_SECONDARY, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
              tickCount={5}
            />
            {events?.map((e, i) => (
              <ReferenceLine
                key={i}
                yAxisId="gravity"
                x={e.timestamp}
                stroke={BORDER}
                strokeDasharray="2 4"
                label={{
                  value: e.label.toUpperCase(),
                  position: 'top',
                  fill: LAVENDER_DARK,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                }}
              />
            ))}
            <Tooltip
              content={<ChartTooltip events={events} />}
              cursor={{ stroke: BORDER, strokeDasharray: '2 4' }}
            />
            <Line
              yAxisId="gravity"
              type="monotone"
              dataKey="gravity"
              stroke={ACCENT}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: ACCENT,
                stroke: BG_CARD,
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              stroke={LAVENDER}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{
                r: 3,
                fill: LAVENDER,
                stroke: BG_CARD,
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs uppercase tracking-wide text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-0.5 w-4 bg-accent" />
          Gravity
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block w-4 border-t border-dashed border-lavender"
            aria-hidden
          />
          Temperature
        </span>
      </div>
      <p className="mt-4 text-sm text-text-secondary">
        {summary.days} {summary.days === 1 ? 'day' : 'days'} ·{' '}
        {summary.og.toFixed(3)} → {summary.fg.toFixed(3)} ·{' '}
        {summary.attenuation}% att · {summary.abv}% ABV
      </p>
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
  events,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: number
  events?: FermentationEvent[]
}) {
  if (!active || !payload || payload.length === 0 || label === undefined)
    return null
  const gravity = payload.find((p) => p.dataKey === 'gravity')?.value
  const temperature = payload.find((p) => p.dataKey === 'temperature')?.value
  const nearbyEvent = events?.find(
    (e) => Math.abs(e.timestamp - label) < 12 * 60 * 60 * 1000
  )
  return (
    <div className="border border-border bg-bg-card px-3 py-2 text-xs">
      <div className="text-lavender-dark">
        {tooltipFmt.format(new Date(label))}
      </div>
      {gravity !== undefined && (
        <div>
          <span className="text-accent">Gravity</span>{' '}
          <span className="text-text-primary">{gravity.toFixed(3)}</span>
        </div>
      )}
      {temperature !== undefined && (
        <div>
          <span className="text-lavender">Temp</span>{' '}
          <span className="text-text-primary">{temperature.toFixed(1)}°F</span>
        </div>
      )}
      {nearbyEvent && (
        <div className="mt-1 border-t border-border pt-1 text-lavender-dark">
          {nearbyEvent.label}
        </div>
      )}
    </div>
  )
}
