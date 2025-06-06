import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number
  label?: string
  className?: string
}

export default function FileUpload({
  onUpload,
  accept = 'image/*,.pdf',
  maxSize = 5 * 1024 * 1024, // 5MB
  label = 'Drag & drop file here, or click to select',
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0]
      if (!selectedFile) return

      if (selectedFile.size > maxSize) {
        toast.error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
        return
      }

      setFile(selectedFile)

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result as string)
        reader.readAsDataURL(selectedFile)
      }
    },
    [maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!file) return
    try {
      setIsUploading(true)
      await onUpload(file)
      setFile(null)
      setPreview(null)
      toast.success('File uploaded successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className={className}>
      {!file ? (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center ${
            isDragActive ? 'border-primary bg-primary-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-1 text-xs text-gray-500">
            {accept.includes('image') ? 'PNG, JPG, GIF' : ''}{' '}
            {accept.includes('.pdf') ? 'PDF' : ''} up to {maxSize / 1024 / 1024}MB
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-12 w-12 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                  <FiUpload className="h-5 w-5 text-gray-400" />
                </div>
              )}
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
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}