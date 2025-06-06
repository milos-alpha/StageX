import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  className,
}: {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: string
    type: 'up' | 'down'
  }
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-full bg-primary-100 p-3 text-primary-600">
          {icon}
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            'mt-4 flex items-center text-sm',
            trend.type === 'up' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {trend.type === 'up' ? (
            <svg
              className="mr-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="mr-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  )
}