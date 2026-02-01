'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'

  const categories = [
    { value: 'all', label: 'All Memes', emoji: '🎭' },
    { value: 'trending', label: 'Trending', emoji: '🔥' },
    { value: 'indian', label: 'Indian', emoji: '🇮🇳' },
    { value: 'international', label: 'International', emoji: '🌍' },
  ]

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }

    const queryString = params.toString()
    router.push(queryString ? `/?${queryString}` : '/')
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleCategoryChange(cat.value)}
          className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
            currentCategory === cat.value
              ? cat.value === 'trending'
                ? 'bg-red-600 text-white shadow-lg'
                : cat.value === 'indian'
                ? 'bg-orange-600 text-white shadow-lg'
                : cat.value === 'international'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
          }`}
        >
          <span className="mr-2">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  )
}
