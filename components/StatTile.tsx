export default function StatTile({
  label,
  value,
  unit,
}: {
  label: string
  value: string
  unit?: string
}) {
  return (
    <div className="border border-border bg-bg-card p-4">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-text-primary">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-text-secondary">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
