import { supabase } from '../lib/supabase'
import MemeCard from './MemeCard'

interface RelatedMemesProps {
  category: string
  currentMemeId: string
}

export default async function RelatedMemes({ category, currentMemeId }: RelatedMemesProps) {
  const { data: relatedMemes } = await supabase
    .from('memes')
    .select('*')
    .eq('category', category)
    .neq('id', currentMemeId)
    .limit(4)
    .order('created_at', { ascending: false })

  if (!relatedMemes || relatedMemes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No related memes found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedMemes.map((meme) => (
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