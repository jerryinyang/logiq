'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface ProfilePictureUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  isUploading?: boolean
}

export function ProfilePictureUpload({ value, onChange, isUploading }: ProfilePictureUploadProps) {
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/auth/upload-profile-picture', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed')
      }

      onChange(result.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isUploading ? (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : value ? (
          <>
            <Image
              src={value}
              alt="Profile picture"
              fill
              className="object-cover"
            />
            <div
              className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
            <Camera className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Add photo</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-xs text-muted-foreground mt-2">
        JPG, PNG or GIF. Max 5MB.
      </p>
    </div>
  )
}