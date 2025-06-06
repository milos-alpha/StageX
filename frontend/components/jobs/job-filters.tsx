import { useState } from 'react'
import { JobType } from '@/types/job.types'

const jobTypes: JobType[] = [
  'full-time',
  'part-time',
  'internship',
  'contract',
  'remote',
]

export default function JobFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: {
    search: string
    types: JobType[]
    location: string
  }) => void
}) {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([])
  const [location, setLocation] = useState('')

  const handleTypeToggle = (type: JobType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    )
  }

  const applyFilters = () => {
    onFilterChange({
      search,
      types: selectedTypes,
      location,
    })
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedTypes([])
    setLocation('')
    onFilterChange({ search: '', types: [], location: '' })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Keywords
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Job title, skills, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Type</label>
          <div className="mt-2 space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  id={`type-${type}`}
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`type-${type}`}
                  className="ml-2 block text-sm text-gray-700 capitalize"
                >
                  {type.replace('-', ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="City, state, or remote"
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={applyFilters}
            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}