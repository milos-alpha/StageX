// src/app/jobs/page.tsx
import { Suspense } from 'react'
import JobList from '@/components/jobs/job-list'
import JobFilters from '@/components/jobs/job-filters'
import { SearchParams } from '@/types/common.types'
import { getJobs } from '@/lib/api/job'
import Pagination from '@/components/ui/pagination'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { page = '1', ...filters } = searchParams
  const { data: jobs, pagination } = await getJobs({
    ...filters,
    page: parseInt(page as string),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Find your next opportunity
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse through thousands of full-time and part-time jobs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <JobFilters />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading jobs...</div>}>
            <JobList jobs={jobs} />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}