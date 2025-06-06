'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiBell, FiUser, FiLogOut, FiSearch } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown'
import { Button } from '@/components/ui/button'
import SearchBar from '@/components/common/search-bar'

export default function DashboardHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-primary">
            JobPortal
          </Link>
          {pathname.startsWith('/dashboard') && (
            <SearchBar />
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <FiBell className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <FiUser className="h-4 w-4 text-primary-600" />
                </div>
                <span className="sr-only">User menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-danger-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}