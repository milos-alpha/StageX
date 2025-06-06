import { create } from 'zustand'
import { User } from '@/types/user.types'
import { getCurrentUser } from '@/lib/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    role: string
  }) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { token, role } = await login({ email, password })
      localStorage.setItem('token', token)
      const user = await getCurrentUser()
      set({ user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      const { token, role } = await register(userData)
      localStorage.setItem('token', token)
      const user = await getCurrentUser()
      set({ user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null })
  },

  fetchUser: async () => {
    set({ loading: true })
    try {
      const user = await getCurrentUser()
      set({ user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))