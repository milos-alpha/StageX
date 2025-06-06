import Link from 'next/link'
import { Job } from '@/types/job.types'
import { formatDistanceToNow } from 'date-fns'
import { FiMapPin, FiClock, FiDollarSign, FiBriefcase } from 'react-icons/fi'
import Badge from '../ui/badge'

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            <Link href={`/jobs/${job._id}`} className="hover:text-primary">
              {job.title}
            </Link>
          </h3>
          <Link href={`/companies/${job.company._id}`} className="text-sm text-primary hover:underline">
            {job.company.name}
          </Link>
        </div>
        <Badge variant={job.type === 'full-time' ? 'primary' : 'secondary'}>
          {job.type.replace('-', ' ')}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
          {job.location}
        </div>
        {job.salary && (
          <div className="flex items-center text-sm text-gray-600">
            <FiDollarSign className="mr-1.5 h-4 w-4 flex-shrink-0" />
            ${job.salary.toLocaleString()} per year
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0" />
          Posted {formatDistanceToNow(new Date(job.createdAt))} ago
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {job.applicants} applicant{job.applicants !== 1 ? 's' : ''}
        </span>
        <Link
          href={`/jobs/${job._id}`}
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          View details
        </Link>
      </div>
    </div>
  )
}