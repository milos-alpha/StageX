'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function ProtectedRoute({
  children,
  roles = [],
}: {
  children: React.ReactNode
  roles?: string[]
}) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login')
    }
  }, [router])

  // In a real app, you would also check the user's role here
  // against the allowed roles passed as props

  return <>{children}</>
}