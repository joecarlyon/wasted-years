'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { EfficiencyPoint } from '@/lib/stats'

// Validated as a pair on the card surface (lightness band, chroma, CVD
// separation): the site's darker gold and a more saturated lavender than the
// text token, which reads gray as a line
const MASH = '#AB8825'
const BREW = '#7B86D8'
const BORDER = 'rgb(42, 42, 58)'
const BG_CARD = 'rgb(20, 20, 28)'
const TEXT_SECONDARY = 'rgb(200, 208, 232)'

const SERIES = [
  { key: 'mash', label: 'Mash', color: MASH },
  { key: 'brew', label: 'Brewhouse', color: BREW },
] as const

export default function EfficiencyChart({ data }: { data: EfficiencyPoint[] }) {
  return (
    <div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid stroke={BORDER} vertical={false} />
            <XAxis
              dataKey="batchNo"
              type="number"
              domain={['dataMin', 'dataMax']}
              allowDecimals={false}
              tickFormatter={(n: number) => `#${n}`}
              tick={{ fill: TEXT_SECONDARY, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: BORDER }}
              minTickGap={24}
            />
            <YAxis
              domain={[40, 90]}
              ticks={[40, 50, 60, 70, 80, 90]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fill: TEXT_SECONDARY, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              content={<EfficiencyTooltip />}
              cursor={{ stroke: BORDER }}
            />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="linear"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                connectNulls
                dot={{ r: 4, fill: s.color, stroke: BG_CARD, strokeWidth: 2 }}
                activeDot={{
                  r: 5,
                  fill: s.color,
                  stroke: BG_CARD,
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs uppercase tracking-wide text-text-secondary">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2">
            <span
              className="inline-block h-0.5 w-4"
              style={{ backgroundColor: s.color }}
            />
            {s.label} efficiency
          </span>
        ))}
      </div>
    </div>
  )
}

function EfficiencyTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: EfficiencyPoint }>
}) {
  const point = active ? payload?.[0]?.payload : undefined
  if (!point) return null
  return (
    <div className="border border-border bg-bg-card px-3 py-2 text-xs">
      <div className="text-lavender-dark">
        #{point.batchNo} {point.name}
      </div>
      {SERIES.map((s) => {
        const value = point[s.key]
        return value === undefined ? null : (
          <div key={s.key} className="flex items-center gap-2">
            <span
              className="inline-block h-0.5 w-3"
              style={{ backgroundColor: s.color }}
            />
            <span className="font-semibold text-text-primary">
              {value.toFixed(1)}%
            </span>
            <span className="text-text-secondary">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
