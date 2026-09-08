import { cn } from '../../lib/utils'

type StatusValue = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PAID' | 'ISSUED'

interface StatusBadgeProps {
  status: StatusValue
  className?: string
}

const statusConfig: Record<StatusValue, { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'bg-[#eef3ff] text-[#5f73f8]' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-[#fff5df] text-[#d99b2b]' },
  COMPLETED: { label: 'Completed', className: 'bg-[#eafaf1] text-[#2a9d6d]' },
  CANCELLED: { label: 'Cancelled', className: 'bg-[#ffe9ea] text-[#d65a5a]' },
  PAID: { label: 'Paid', className: 'bg-[#eafaf1] text-[#2a9d6d]' },
  ISSUED: { label: 'Issued', className: 'bg-[#eef3ff] text-[#5f73f8]' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.OPEN

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
