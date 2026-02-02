import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { supabase } from '../../lib/supabase'
import ShareButtons from '../../components/ShareButtons'
import RelatedMemes from '../../components/RelatedMemes'
import DownloadButton from '../../components/DownloadButton'

// Generate metadata for SEO
export async function generateMetadata({
  params 
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { data: meme } = await supabase
    .from('memes')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!meme) {
    return {
      title: 'Meme Not Found - MemeMaster',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const memeUrl = `${siteUrl}/meme/${params.slug}`

  return {
    title: meme.title,
    description: meme.description || `Download ${meme.title} meme template for free. No watermarks, instant download. Perfect for social media and content creation.`,
    keywords: meme.tags || ['meme', 'template', 'viral', 'funny'],
    openGraph: {
      title: meme.title,
      description: meme.description || `Download ${meme.title} meme template for free`,
      url: memeUrl,
      siteName: 'MemeMaster',
      images: [
        {
          url: meme.image_url,
          width: 1200,
          height: 1200,
          alt: meme.title,
        },
      ],
      type: 'article',
      publishedTime: meme.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: meme.title,
      description: meme.description || `Download ${meme.title} meme template for free`,
      images: [meme.image_url],
    },
    alternates: {
      canonical: memeUrl,
    },
  }
}

export default async function MemePage({
  params 
}: {
  params: { slug: string }
}) {
  // Fetch meme data
  const { data: meme, error } = await supabase
    .from('memes')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !meme) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('memes')
    .update({ views: meme.views + 1 })
    .eq('id', meme.id)

  // Get current URL for sharing
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const currentUrl = `${siteUrl}/meme/${params.slug}`

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: meme.title,
    description: meme.description || `${meme.title} meme template`,
    contentUrl: meme.image_url,
    url: currentUrl,
    datePublished: meme.created_at,
    author: {
      '@type': 'Organization',
      name: 'MemeMaster'
    },
    publisher: {
      '@type': 'Organization',
      name: 'MemeMaster',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/DownloadAction',
        userInteractionCount: meme.downloads
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: meme.views
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-3xl">🎭</span>
              <span className="text-2xl font-bold text-gray-900">MemeMaster</span>
            </a>
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image/Video */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  {meme.media_type === 'video' ? (
                    <video
                      src={meme.image_url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image
                      src={meme.image_url}
                      alt={meme.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {meme.views + 1}
                    </div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {meme.downloads}
                    </div>
                    <div className="text-sm text-gray-600">Downloads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {meme.upvotes}
                    </div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    meme.category === 'trending' ? 'bg-red-100 text-red-700' :
                    meme.category === 'indian' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {meme.category === 'trending' && '🔥 '}
                    {meme.category === 'indian' && '🇮🇳 '}
                    {meme.category === 'international' && '🌍 '}
                    {meme.category.charAt(0).toUpperCase() + meme.category.slice(1)}
                  </span>
                  {meme.media_type === 'video' && meme.duration > 0 && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                      🎥 {Math.floor(meme.duration / 60)}:{(meme.duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {meme.title}
                </h1>

                {meme.description && (
                  <p className="text-lg text-gray-600 mb-6">
                    {meme.description}
                  </p>
                )}
              </div>

              {/* Tags */}
              {meme.tags && meme.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meme.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Download Button */}
              <DownloadButton 
                memeId={meme.id} 
                imageUrl={meme.image_url}
                title={meme.title}
              />

              {/* Share Buttons */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Share this meme
                </h3>
                <ShareButtons 
                  url={currentUrl}
                  title={meme.title}
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  ℹ️ How to use
                </h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>✓ Click download button to save</li>
                  <li>✓ Free to use for personal projects</li>
                  <li>✓ Share with friends using buttons above</li>
                  <li>✓ No watermarks, completely free!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Memes */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Related Memes
            </h2>
            <RelatedMemes 
              category={meme.category}
              currentMemeId={meme.id}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 MemeMaster. All memes are user-generated content.
          </p>
        </div>
      </footer>
    </div>
  )
}

