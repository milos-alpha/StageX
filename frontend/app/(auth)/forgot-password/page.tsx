// src/app/(auth)/forgot-password/page.tsx
import ForgotPasswordForm from '@/components/auth/forgot-password-form'
import AuthLayout from '@/app/(auth)/layout'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  )
}