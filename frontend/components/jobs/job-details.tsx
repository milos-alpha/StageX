// src/components/jobs/job-details.tsx
import { Job } from '@/types/job.types'
import { formatDistanceToNow } from 'date-fns'
import { FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiUser } from 'react-icons/fi'
import Markdown from 'react-markdown'
import ApplyJobButton from './apply-job-button'

export default function JobDetails({ job }: { job: Job }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
        <div className="mt-2 flex items-center">
          <span className="text-lg text-primary">{job.company.name}</span>
          {job.company.profile?.companyLogo && (
            <img
              src={job.company.profile.companyLogo}
              alt={`${job.company.name} logo`}
              className="ml-2 h-8 w-8 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center">
          <FiBriefcase className="mr-2 h-5 w-5 text-gray-500" />
          <span className="capitalize">{job.type.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center">
          <FiMapPin className="mr-2 h-5 w-5 text-gray-500" />
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center">
            <FiDollarSign className="mr-2 h-5 w-5 text-gray-500" />
            <span>${job.salary.toLocaleString()}/year</span>
          </div>
        )}
        <div className="flex items-center">
          <FiClock className="mr-2 h-5 w-5 text-gray-500" />
          <span>
            Posted {formatDistanceToNow(new Date(job.createdAt))} ago
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Job Description</h2>
        <div className="prose max-w-none">
          <Markdown>{job.description}</Markdown>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Requirements</h2>
        <ul className="list-inside list-disc space-y-1">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-primary-100 px-3 py-0.5 text-sm font-medium text-primary-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Application Deadline</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Apply before {new Date(job.deadline).toLocaleDateString()} -{' '}
                {job.applicants} applicant{job.applicants !== 1 ? 's' : ''} so far
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}