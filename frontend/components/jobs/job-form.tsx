import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Job } from '@/types/job.types'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  requirements: yup.array().of(yup.string()).min(1, 'At least one requirement is required'),
  skills: yup.array().of(yup.string()).min(1, 'At least one skill is required'),
  type: yup.string().required('Job type is required'),
  location: yup.string().required('Location is required'),
  salary: yup.number().typeError('Salary must be a number').positive('Salary must be positive').nullable(),
  deadline: yup.date().required('Deadline is required').min(new Date(), 'Deadline must be in the future'),
})

export default function JobForm({
  job,
  onSubmit,
  isSubmitting,
}: {
  job?: Job
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: job || {
      requirements: [],
      skills: [],
    },
  })

  useEffect(() => {
    if (job) {
      reset(job)
    }
  }, [job, reset])

  const handleSkillsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      const newSkill = e.currentTarget.value.trim()
      if (!watch('skills')?.includes(newSkill)) {
        setValue('skills', [...(watch('skills') || [], newSkill])
        e.currentTarget.value = ''
      }
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setValue(
      'skills',
      watch('skills')?.filter((skill) => skill !== skillToRemove) || []
    )
  }

  const handleRequirementsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      const newReq = e.currentTarget.value.trim()
      if (!watch('requirements')?.includes(newReq)) {
        setValue('requirements', [...(watch('requirements') || [], newReq])
        e.currentTarget.value = ''
      }
    }
  }

  const removeRequirement = (reqToRemove: string) => {
    setValue(
      'requirements',
      watch('requirements')?.filter((req) => req !== reqToRemove) || []
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Job Title*
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.title && <p className="mt-1 text-sm text-danger">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description*
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.description && <p className="mt-1 text-sm text-danger">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Skills*
        </label>
        <input
          id="skills"
          type="text"
          onKeyDown={handleSkillsChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="Type a skill and press Enter"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {watch('skills')?.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
              >
                <span className="sr-only">Remove skill</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        {errors.skills && <p className="mt-1 text-sm text-danger">{errors.skills.message}</p>}
      </div>

      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
          Requirements*
        </label>
        <input
          id="requirements"
          type="text"
          onKeyDown={handleRequirementsChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="Type a requirement and press Enter"
        />
        <ul className="mt-2 list-inside list-disc space-y-1">
          {watch('requirements')?.map((req) => (
            <li key={req} className="flex items-center text-sm text-gray-600">
              {req}
              <button
                type="button"
                onClick={() => removeRequirement(req)}
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:bg-gray-500 focus:text-white focus:outline-none"
              >
                <span className="sr-only">Remove requirement</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
        {errors.requirements && <p className="mt-1 text-sm text-danger">{errors.requirements.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Job Type*
          </label>
          <select
            id="type"
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Select a job type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-danger">{errors.type.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location*
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.location && <p className="mt-1 text-sm text-danger">{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary (optional)
          </label>
          <input
            id="salary"
            type="number"
            {...register('salary')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.salary && <p className="mt-1 text-sm text-danger">{errors.salary.message}</p>}
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Application Deadline*
          </label>
          <input
            id="deadline"
            type="date"
            {...register('deadline')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.deadline && <p className="mt-1 text-sm text-danger">{errors.deadline.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </form>
  )
}