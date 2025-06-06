// src/lib/api/user.ts
import api from './api'
import { User } from '@/types/user.types'

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/users/me', data)
  return response.data.data
}

export const uploadProfilePhoto = async (file: File): Promise<User> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.put('/users/me/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.data
}

export const uploadResume = async (file: File): Promise<User> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.put('/users/me/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.data
}

export const deleteUserAccount = async (): Promise<void> => {
  await api.delete('/users/me')
}