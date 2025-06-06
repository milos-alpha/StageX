// src/app/(company)/company/dashboard/page.tsx
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StatsCard from '@/components/dashboard/stats-card'
import { FiBriefcase, FiUsers, FiDollarSign, FiActivity } from 'react-icons/fi'
import RecentApplications from '@/components/applications/recent-applications'
import CompanyJobsList from '@/components/companies/company-jobs-list'

export default async function CompanyDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'employer') {
    redirect('/auth/login')
  }

  const stats = [
    {
      title: 'Active Jobs',
      value: 5,
      icon: <FiBriefcase className="h-6 w-6" />,
    },
    {
      title: 'Total Applications',
      value: 24,
      icon: <FiUsers className="h-6 w-6" />,
    },
    {
      title: 'Hired Candidates',
      value: 3,
      icon: <FiDollarSign className="h-6 w-6" />,
    },
    {
      title: 'Pending Reviews',
      value: 8,
      icon: <FiActivity className="h-6 w-6" />,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">Recent Applications</h2>
          <RecentApplications />
        </div>
        
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">Active Job Postings</h2>
          <CompanyJobsList />
        </div>
      </div>
    </div>
  )
}