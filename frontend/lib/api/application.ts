import api from '../api'
import { Application } from '@/types/application.types'

export const getApplications = async (): Promise<Application[]> => {
  const response = await api.get('/applications')
  return response.data.data
}

export const getApplicationById = async (id: string): Promise<Application> => {
  const response = await api.get(`/applications/${id}`)
  return response.data.data
}

export const createApplication = async (jobId: string, applicationData: any) => {
  const response = await api.post(`/jobs/${jobId}/applications`, applicationData)
  return response.data.data
}

export const updateApplicationStatus = async (
  id: string,
  status: string
): Promise<Application> => {
  const response = await api.put(`/applications/${id}/status`, { status })
  return response.data.data
}

export const deleteApplication = async (id: string) => {
  await api.delete(`/applications/${id}`)
}