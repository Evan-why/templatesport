import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase } from '../../lib/supabase' 

export const revalidate = 60 // Revalidate every 60 seconds

// Generate metadata for SEO
export async function generateMetadata({
  params 
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) {
    return {
      title: 'Post Not Found - MemeMaster Blog',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || `Read about ${post.title} on MemeMaster Blog`,
    keywords: ['memes', 'meme culture', post.category, 'viral content'],
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.created_at,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
  }
}

export default async function BlogPostPage({
  params 
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Fetch blog post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ views: post.views + 1 })
    .eq('id', post.id)

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
            <div className="flex gap-6">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                🏠 Home
              </a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition">
                📝 Blog
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            {' '}/{' '}
            <a href="/blog" className="hover:text-blue-600">Blog</a>
            {' '}/{' '}
            <span className="text-gray-900">{post.title}</span>
          </div>

          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {post.category}
            </span>
            <span className="text-gray-600">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="text-gray-600">
              👁️ {post.views + 1} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-200">
              {post.excerpt}
            </p>
          )}

          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-ul:list-disc prose-ul:list-inside prose-ul:text-gray-700 prose-ul:mb-6 prose-ul:space-y-2 prose-ol:list-decimal prose-ol:list-inside prose-ol:text-gray-700 prose-ol:mb-6 prose-ol:space-y-2 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Section */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              About MemeMaster
            </h3>
            <p className="text-gray-700">
              MemeMaster is your go-to resource for understanding and using the internet's best memes. We research the origins, cultural impact, and best practices for meme formats so you can create content that resonates.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-blue-700 mb-6">
              Browse our collection of meme templates and start creating viral content today!
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              Browse Meme Templates →
            </a>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 MemeMaster. All memes are user-generated content.
          </p>
        </div>
      </footer>
    </div>
  )
}
