// src/app/(admin)/admin/dashboard/page.tsx
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StatsCard from '@/components/dashboard/stats-card'
import { FiUsers, FiBriefcase, FiFileText, FiDollarSign } from 'react-icons/fi'
import AdminStatsChart from '@/components/admin/admin-stats-chart'
import RecentActivity from '@/components/admin/recent-activity'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/auth/login')
  }

  const stats = [
    {
      title: 'Total Users',
      value: 124,
      icon: <FiUsers className="h-6 w-6" />,
      trend: {
        value: '12% from last month',
        type: 'up',
      },
    },
    {
      title: 'Active Jobs',
      value: 42,
      icon: <FiBriefcase className="h-6 w-6" />,
      trend: {
        value: '5% from last month',
        type: 'up',
      },
    },
    {
      title: 'Applications',
      value: 156,
      icon: <FiFileText className="h-6 w-6" />,
    },
    {
      title: 'Companies',
      value: 28,
      icon: <FiDollarSign className="h-6 w-6" />,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">User Growth</h2>
          <AdminStatsChart />
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}