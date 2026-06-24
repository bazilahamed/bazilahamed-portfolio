'use client'

import { useRef, useState } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  size?: 'small' | 'large'
}

export default function ImageUpload({ value, onChange, label = 'Image', size = 'small' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const handleUpload = async (file: File) => {
    if (!cloudName || !uploadPreset) {
      setError('Cloudinary not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to Vercel env vars.')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.secure_url) {
        onChange(data.secure_url)
      } else {
        setError('Upload failed. Check your Cloudinary settings.')
      }
    } catch {
      setError('Upload failed. Check your internet connection.')
    }

    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleUpload(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const previewHeight = size === 'large' ? 200 : 100

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ color: '#5a7a8a', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'IBM Plex Mono, monospace' }}>
        {label}
      </div>

      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', marginBottom: 8, display: 'inline-block' }}>
          <img
            src={value}
            alt="Preview"
            style={{
              height: previewHeight,
              width: size === 'large' ? '100%' : previewHeight,
              objectFit: 'cover',
              border: '1px solid #163250',
              display: 'block',
            }}
          />
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: 4, right: 4,
              background: 'rgba(255,51,85,0.9)', border: 'none',
              color: '#fff', width: 20, height: 20,
              fontSize: '0.7rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1px dashed #163250',
          padding: '16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: uploading ? 'rgba(0,255,136,0.03)' : 'transparent',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#163250')}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {uploading ? (
          <div style={{ color: '#00ff88', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem' }}>
            Uploading...
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>📁</div>
            <div style={{ color: '#5a7a8a', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem' }}>
              Click or drag & drop image
            </div>
          </div>
        )}
      </div>

      {/* URL input as alternative */}
      <input
        type="text"
        placeholder="Or paste image URL directly"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '8px 12px', marginTop: 6,
          background: '#020408', border: '1px solid #0d2035',
          color: '#5a7a8a', fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.7rem', outline: 'none', cursor: 'text',
        }}
      />

      {error && (
        <div style={{ color: '#ff3355', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', marginTop: 6 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}
