// src/components/profile/resume-upload.tsx
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiX } from 'react-icons/fi'
import { uploadResume } from '@/lib/api/user'
import { useAuth } from '@/hooks/useAuth'

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { user, updateUser } = useAuth()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0])
    },
  })

  const handleUpload = async () => {
    if (!file || !user) return
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      const updatedUser = await uploadResume(formData)
      updateUser(updatedUser)
      setFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-4">
      {user?.profile?.resume ? (
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Current Resume</p>
                <p className="text-xs text-gray-500">Uploaded</p>
              </div>
            </div>
            <a
              href={user.profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View
            </a>
          </div>
        </div>
      ) : null}

      {!file ? (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center ${
            isDragActive ? 'border-primary bg-primary-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop your resume here'
              : 'Drag & drop your resume here, or click to select'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PDF, DOC, DOCX up to 5MB
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="inline-flex items-center rounded-md border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}