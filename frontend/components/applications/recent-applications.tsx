// src/components/applications/recent-applications.tsx
import { Application } from '@/types/application.types'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import ApplicationStatusBadge from './application-status'

export default function RecentApplications({
  applications = [],
}: {
  applications?: Application[]
}) {
  if (applications.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="text-gray-500">No recent applications</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <ul className="divide-y divide-gray-200">
        {applications.map((application) => (
          <li key={application._id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/jobs/${application.job._id}`}
                  className="font-medium text-gray-900 hover:text-primary"
                >
                  {application.job.title}
                </Link>
                <p className="text-sm text-gray-500">
                  Applied {formatDistanceToNow(new Date(application.appliedAt))} ago
                </p>
              </div>
              <ApplicationStatusBadge status={application.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}