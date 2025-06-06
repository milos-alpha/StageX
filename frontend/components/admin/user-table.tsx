import { User } from '@/types/user.types'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useState } from 'react'
import ConfirmationModal from '../ui/confirmation-modal'
import { deleteUser } from '@/lib/api/user'
import { toast } from 'react-toastify'
import Link from 'next/link'

interface UserTableProps {
  users: User[]
  onDelete: (id: string) => void
}

export default function UserTable({ users, onDelete }: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!userToDelete) return
    try {
      setIsDeleting(true)
      await deleteUser(userToDelete)
      onDelete(userToDelete)
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete user')
    } finally {
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Joined
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.profile?.profilePicture || '/images/default-avatar.png'}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-primary-100 px-2 text-xs font-semibold leading-5 text-primary-800 capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/users/${user._id}`}
                    className="mr-3 inline-flex items-center text-primary-600 hover:text-primary-900"
                  >
                    <FiEdit2 className="mr-1 h-4 w-4" /> Edit
                  </Link>
                  <button
                    onClick={() => setUserToDelete(user._id)}
                    className="inline-flex items-center text-danger-600 hover:text-danger-900"
                  >
                    <FiTrash2 className="mr-1 h-4 w-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmColor="danger"
      />
    </>
  )
}