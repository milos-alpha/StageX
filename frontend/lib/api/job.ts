// src/lib/api/job.ts
import api from './api'
import { Job } from '@/types/job.types'

export const getJobs = async (filters = {}): Promise<Job[]> => {
  const response = await api.get('/jobs', { params: filters })
  return response.data.data
}

export const getJobById = async (id: string): Promise<Job | null> => {
  try {
    const response = await api.get(`/jobs/${id}`)
    return response.data.data
  } catch (error) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  const response = await api.post('/jobs', jobData)
  return response.data.data
}

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  const response = await api.put(`/jobs/${id}`, jobData)
  return response.data.data
}

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/jobs/${id}`)
}

export const getJobsByCompany = async (companyId: string): Promise<Job[]> => {
  const response = await api.get(`/jobs/company/${companyId}`)
  return response.data.data
}