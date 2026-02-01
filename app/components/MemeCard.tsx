'use client'

import Image from 'next/image'
import { useState } from 'react'

interface MemeCardProps {
  id: string
  title: string
  imageUrl: string
  category: string
  downloads: number
  views: number
  mediaType?: 'image' | 'video'
  duration?: number
}

export default function MemeCard({ 
  id, 
  title, 
  imageUrl, 
  category, 
  downloads, 
  views,
  mediaType = 'image',
  duration = 0
}: MemeCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      window.open(imageUrl, '_blank')
      console.log('Downloaded:', title)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'trending':
        return 'bg-red-100 text-red-700'
      case 'indian':
        return 'bg-orange-100 text-orange-700'
      case 'international':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {mediaType === 'video' ? (
          <video
            src={imageUrl}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            muted
            loop
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause()
              e.currentTarget.currentTime = 0
            }}
          />
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>

        {mediaType === 'video' && duration > 0 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
            🎥 {formatDuration(duration)}
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform scale-90 group-hover:scale-100 disabled:opacity-50"
          >
            {isDownloading ? 'Downloading...' : '⬇️ Download'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
          {mediaType === 'video' && '🎥 '}{title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {downloads}
          </span>
        </div>
      </div>
    </div>
  )
}