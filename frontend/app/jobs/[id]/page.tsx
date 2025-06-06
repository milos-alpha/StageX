import { notFound } from 'next/navigation'
import { getJobById } from '@/lib/api'
import JobDetails from '@/components/jobs/job-details'
import ApplyJobButton from '@/components/jobs/apply-job-button'
import { getCurrentUser } from '@/lib/auth'

export default async function JobPage({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id)
  const user = await getCurrentUser()

  if (!job) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <JobDetails job={job} />
      
      {user?.role === 'student' && (
        <div className="mt-8">
          <ApplyJobButton jobId={job._id} />
        </div>
      )}
    </div>
  )
}