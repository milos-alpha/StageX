import { ReactNode } from 'react'
import DashboardSidebar from '@/components/layout/sidebar'
import DashboardHeader from '@/components/layout/header'
import ProtectedRoute from '@/components/auth/protected-route'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}