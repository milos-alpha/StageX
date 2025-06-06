import api from './api'
import { User } from '@/types/user.types'

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials)
  const { token, role } = response.data
  localStorage.setItem('token', token)
  return { token, role }
}

export const register = async (userData: {
  name: string
  email: string
  password: string
  role: string
}) => {
  const response = await api.post('/auth/register', userData)
  const { token, role } = response.data
  localStorage.setItem('token', token)
  return { token, role }
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me')
  return response.data.data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/auth/login'
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

export const getToken = () => {
  return localStorage.getItem('token')
}