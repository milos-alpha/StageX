// src/app/(auth)/register/page.tsx
import RegisterForm from '@/components/auth/register-form'
import AuthLayout from '@/app/(auth)/layout'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your role and join our platform
          </p>
        </div>
        <RegisterForm />
      </div>
    </AuthLayout>
  )
}