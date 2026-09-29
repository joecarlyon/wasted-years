export default function SectionTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <h3 className="mb-6 border-b border-border pb-2 text-xs uppercase tracking-widest text-lavender">
      {children}
    </h3>
  )
}
