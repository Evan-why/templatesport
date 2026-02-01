'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    
    if (value.trim()) {
      router.push(`/?q=${encodeURIComponent(value)}`)
    } else {
      router.push('/')
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    router.push('/')
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search memes by title, description, or tags..."
          className="w-full px-6 py-4 pr-24 text-lg border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none transition-all shadow-sm"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search hint */}
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Searching for: <span className="font-semibold">"{searchTerm}"</span>
        </div>
      )}
    </div>
  )
}
