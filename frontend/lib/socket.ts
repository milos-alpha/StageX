import io from 'socket.io-client'
import { getToken } from './auth'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

let socket: any = null

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: getToken(),
      },
      transports: ['websocket'],
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not connected. Call connectSocket first.')
  }
  return socket
}