import { getStatusClasses } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={getStatusClasses(status)}>{status}</span>
}
