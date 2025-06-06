import LoginForm from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Job Portal',
  description: 'Login to your account',
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account?</span>{' '}
        <a href="/auth/register" className="font-medium text-primary hover:text-primary-dark">
          Sign up
        </a>
      </div>
    </div>
  )
}