'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function MemeUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video'>('image')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'trending' | 'indian' | 'international'>('trending')
  const [tags, setTags] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const isVideo = selectedFile.type.startsWith('video/')
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File must be less than 100MB')
      return
    }

    if (isVideo) {
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src)
        if (video.duration > 60) {
          setError('Video must be 60 seconds or less')
          return
        }
        setError(null)
      }
      
      video.src = URL.createObjectURL(selectedFile)
    }
    
    setFile(selectedFile)
    setFileType(isVideo ? 'video' : 'image')
    setError(null)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
    
    if (!title) {
      const filename = selectedFile.name.replace(/\.[^/.]+$/, '')
      setTitle(filename.replace(/-|_/g, ' '))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !title) {
      setError('Please provide a file and title')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)
    setUploadProgress(`Uploading ${fileType}...`)

    try {
      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      setUploadProgress('Saving to database...')

      // Generate unique slug client-side only
      const baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50)
      
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 11)}`
      
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t)
      
      const insertData = {
        title: title.trim(),
        description: description.trim() || null,
        slug: uniqueSlug,
        image_url: uploadData.url,
        cloudinary_id: uploadData.publicId,
        category,
        tags: tagArray,
        alt_text: title.trim(),
        is_trending: category === 'trending',
        media_type: fileType,
        duration: Math.floor(uploadData.duration || 0),
        source_platform: 'manual',
        upvotes: 0,
        downloads: 0,
        views: 0,
      }

      const { data: insertedData, error: dbError } = await supabase
        .from('memes')
        .insert([insertData])
        .select()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error(`Database error: ${dbError.message}`)
      }

      setUploadProgress('Success!')
      setSuccess(true)
      
      // Reset and reload
      setTimeout(() => {
        setFile(null)
        setPreview(null)
        setTitle('')
        setDescription('')
        setTags('')
        setFileType('image')
        setUploadProgress('')
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        
        window.location.reload()
      }, 2000)

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
      setUploadProgress('')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image or Video *
        </label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          disabled={uploading}
        />
        <p className="text-xs text-gray-500 mt-2">
          📸 Images: JPG, PNG, GIF, WebP<br/>
          🎥 Videos: MP4, WebM, MOV (max 60 seconds)
        </p>
      </div>

      {preview && (
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
          {fileType === 'video' ? (
            <video src={preview} controls className="w-full h-full object-contain" />
          ) : (
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          )}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {fileType === 'video' ? '🎥 Video' : '📸 Image'}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Funny trending meme"
          disabled={uploading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Brief description..."
          disabled={uploading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        >
          <option value="trending">🔥 Trending</option>
          <option value="indian">🇮🇳 Indian</option>
          <option value="international">🌍 International</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="funny, viral, relatable"
          disabled={uploading}
        />
      </div>

      {uploadProgress && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {uploadProgress}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ {fileType === 'video' ? 'Video' : 'Image'} uploaded successfully! Reloading...
        </div>
      )}

      <button
        type="submit"
        disabled={uploading || !file || !title}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        ) : (
          `📤 Upload ${file ? (fileType === 'video' ? 'Video' : 'Image') : 'File'}`
        )}
      </button>
    </form>
  )
}