// src/app/(dashboard)/dashboard/page.tsx
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StatsCard from '@/components/dashboard/stats-card'
import { FiBriefcase, FiFileText, FiBookmark, FiUser } from 'react-icons/fi'
import RecentApplications from '@/components/applications/recent-applications'
import RecommendedJobs from '@/components/jobs/recommended-jobs'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (user.role === 'employer') {
    redirect('/company/dashboard')
  }

  if (user.role === 'admin') {
    redirect('/admin/dashboard')
  }

  const stats = [
    {
      title: 'Applied Jobs',
      value: 12,
      icon: <FiBriefcase className="h-6 w-6" />,
      trend: {
        value: '20% from last month',
        type: 'up',
      },
    },
    {
      title: 'Applications',
      value: 5,
      icon: <FiFileText className="h-6 w-6" />,
    },
    {
      title: 'Saved Jobs',
      value: 8,
      icon: <FiBookmark className="h-6 w-6" />,
    },
    {
      title: 'Profile Views',
      value: 24,
      icon: <FiUser className="h-6 w-6" />,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
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
          <h2 className="mb-4 text-lg font-medium text-gray-900">Recommended Jobs</h2>
          <RecommendedJobs />
        </div>
      </div>
    </div>
  )
}