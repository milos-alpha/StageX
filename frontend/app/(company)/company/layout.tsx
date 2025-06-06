import { ReactNode } from 'react'
import CompanySidebar from '@/components/layout/company-sidebar'
import DashboardHeader from '@/components/layout/header'
import ProtectedRoute from '@/components/auth/protected-route'
import { authorize } from '@/lib/auth'

export default async function CompanyLayout({ children }: { children: ReactNode }) {
  await authorize('employer')
  
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <CompanySidebar />
        
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