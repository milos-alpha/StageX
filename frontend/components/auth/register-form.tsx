// src/components/auth/register-form.tsx
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { register } from '@/lib/auth'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['student', 'employer']).required('Role is required'),
})

export default function RegisterForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const selectedRole = watch('role')

  const onSubmit = async (data) => {
    try {
      const response = await register(data)
      toast.success('Registration successful!')
      router.push(
        response.role === 'student' 
          ? '/dashboard' 
          : '/company/dashboard'
      )
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="student"
              type="radio"
              value="student"
              {...register('role')}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="student" className="ml-2 block text-sm text-gray-700">
              Student
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="employer"
              type="radio"
              value="employer"
              {...register('role')}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="employer" className="ml-2 block text-sm text-gray-700">
              Employer
            </label>
          </div>
        </div>
        {errors.role && <p className="mt-1 text-sm text-danger">{errors.role.message}</p>}
      </div>

      {selectedRole === 'employer' && (
        <div className="rounded-md bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            As an employer, you'll be able to post jobs and manage applications after verifying your company details.
          </p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  )
}