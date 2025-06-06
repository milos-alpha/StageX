// src/app/(auth)/layout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="mx-auto flex w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-center justify-center py-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-6 flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}