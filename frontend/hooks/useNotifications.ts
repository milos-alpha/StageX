import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { connectSocket, getSocket } from '@/lib/socket'
import { useAuth } from './useAuth'

export default function useNotifications() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Connect to socket
    connectSocket()
    const socket = getSocket()

    // Listen for notifications
    socket.on('notification', (data: { message: string; type: string }) => {
      toast[data.type](data.message)
    })

    // Listen for application updates
    socket.on('application:updated', (data: { jobTitle: string; status: string }) => {
      toast.info(`Your application for "${data.jobTitle}" is now ${data.status}`)
    })

    // Clean up on unmount
    return () => {
      socket.off('notification')
      socket.off('application:updated')
    }
  }, [user])
}