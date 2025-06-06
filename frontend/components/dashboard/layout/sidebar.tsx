// src/components/layout/sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiBriefcase, FiUser, FiFileText, FiSettings } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

const studentLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Jobs', href: '/jobs', icon: FiBriefcase },
  { name: 'Applications', href: '/dashboard/applications', icon: FiFileText },
  { name: 'Profile', href: '/dashboard/profile', icon: FiUser },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
]

const employerLinks = [
  { name: 'Dashboard', href: '/company/dashboard', icon: FiHome },
  { name: 'Jobs', href: '/company/jobs', icon: FiBriefcase },
  { name: 'Applications', href: '/company/applications', icon: FiFileText },
  { name: 'Profile', href: '/company/profile', icon: FiUser },
  { name: 'Analytics', href: '/company/analytics', icon: FiSettings },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const links = user?.role === 'employer' ? employerLinks : studentLinks

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <h1 className="text-xl font-semibold text-gray-900">JobPortal</h1>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              pathname === item.href
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                pathname === item.href ? 'text-primary-500' : 'text-gray-400'
              }`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}