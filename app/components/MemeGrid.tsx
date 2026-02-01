import MemeCard from './MemeCard'
import { Meme } from '../lib/supabase'

interface MemeGridProps {
  memes: Meme[]
  isLoading?: boolean
}

export default function MemeGrid({ memes, isLoading }: MemeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg animate-pulse">
            <div className="aspect-square bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (memes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          No memes found
        </h3>
        <p className="text-gray-500">
          Try a different category or check back later!
        </p>
      </div>
    )
  }

  return (
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
  )
}