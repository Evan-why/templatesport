'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export default function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      {/* Page info */}
      <p className="text-sm text-gray-600">
        Showing page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span> ({totalItems} total memes)
      </p>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex gap-2">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-400">
                ...
              </span>
            )
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  )
}
