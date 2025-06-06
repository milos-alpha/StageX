import { ApplicationStatus } from '@/types/application.types'
import { cn } from '@/lib/utils'

const statusMap = {
  pending: {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-800',
  },
  reviewed: {
    label: 'Reviewed',
    color: 'bg-blue-100 text-blue-800',
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'bg-purple-100 text-purple-800',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
  },
  hired: {
    label: 'Hired',
    color: 'bg-green-100 text-green-800',
  },
}

export default function ApplicationStatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusMap[status].color,
        className
      )}
    >
      {statusMap[status].label}
    </span>
  )
}