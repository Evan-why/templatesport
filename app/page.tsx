import { Suspense } from 'react'
import { supabase } from './lib/supabase'
import MemeCard from './components/MemeCard'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import Pagination from './components/Pagination'
import { LoadingGrid } from './components/LoadingCard'

const ITEMS_PER_PAGE = 12

async function MemeGrid({
  searchQuery,
  categoryFilter,
  currentPage,
}: {
  searchQuery: string
  categoryFilter: string
  currentPage: number
}) {
  // Calculate offset for pagination
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // Build query for count
  let countQuery = supabase
    .from('memes')
    .select('*', { count: 'exact', head: true })

  if (categoryFilter && categoryFilter !== 'all') {
    countQuery = countQuery.eq('category', categoryFilter)
  }

  if (searchQuery) {
    countQuery = countQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
  }

  // Get total count
  const { count } = await countQuery

  // Build query for memes
  let query = supabase
    .from('memes')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)

  if (categoryFilter && categoryFilter !== 'all') {
    query = query.eq('category', categoryFilter)
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
  }

  const { data: memes } = await query

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <>
      {/* Search Results Info */}
      {(searchQuery || categoryFilter !== 'all') && (
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700">
            {memes && memes.length > 0 ? (
              <>
                Found <span className="font-bold text-blue-600">{count}</span> meme{count !== 1 ? 's' : ''}
                {searchQuery && (
                  <> matching <span className="font-bold">"{searchQuery}"</span></>
                )}
                {categoryFilter !== 'all' && (
                  <> in <span className="font-bold">{categoryFilter}</span> category</>
                )}
              </>
            ) : (
              <>
                No memes found
                {searchQuery && <> for "{searchQuery}"</>}
                {categoryFilter !== 'all' && <> in {categoryFilter} category</>}
              </>
            )}
          </p>
        </div>
      )}

      {/* Memes Grid */}
      {memes && memes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memes.map((meme) => (
              <a key={meme.id} href={`/meme/${meme.slug}`}>
                <MemeCard
                  id={meme.id}
                  title={meme.title}
                  imageUrl={meme.image_url}
                  category={meme.category}
                  downloads={meme.downloads}
                  views={meme.views}
                  mediaType={meme.media_type}
                  duration={meme.duration}
                />
              </a>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={count || 0}
          />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No memes found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            View All Memes
          </a>
        </div>
      )}
    </>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; page?: string }
}) {
  const searchQuery = searchParams.search || ''
  const categoryFilter = searchParams.category || 'all'
  const currentPage = parseInt(searchParams.page || '1', 10)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-3xl">🎭</span>
              <span className="text-2xl font-bold text-gray-900">MemeMaster</span>
            </a>
            <a
              href="/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Upload Meme
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Memes 🎭
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse, download, and share the best meme templates
          </p>

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <SearchBar />
          </div>

          {/* Category Filter */}
          <CategoryFilter />
        </div>

        {/* Memes Grid with Loading State */}
        <Suspense fallback={<LoadingGrid />}>
          <MemeGrid
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            currentPage={currentPage}
          />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🎭 MemeMaster</h3>
              <p className="text-gray-400">
                Your ultimate destination for meme templates and viral content.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/?category=trending" className="hover:text-white">🔥 Trending</a></li>
                <li><a href="/?category=indian" className="hover:text-white">🇮🇳 Indian Memes</a></li>
                <li><a href="/?category=international" className="hover:text-white">🌍 International</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/admin" className="hover:text-white">Upload Meme</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 MemeMaster. All memes are user-generated content.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

