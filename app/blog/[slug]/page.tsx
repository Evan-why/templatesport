import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '../../lib/supabase'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
  if (!post) return { title: 'Post Not Found - MemeMaster Blog' }

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) notFound()

  await supabase.from('blog_posts').update({ views: post.views + 1 }).eq('id', post.id)

  const publishedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#202124]">
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🎭</span>
            <span className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">MemeMaster</span>
          </a>
          <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium sm:gap-7">
            <a href="/" className="text-gray-600 transition hover:text-blue-700">Home</a>
            <a href="/blog" className="text-blue-700">Blog</a>
          </nav>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 sm:py-14">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
            <a href="/" className="transition hover:text-blue-700">Home</a>
            <span className="mx-2 text-gray-300">/</span>
            <a href="/blog" className="transition hover:text-blue-700">Blog</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700" aria-current="page">{post.title}</span>
          </nav>

          <header className="mb-8">
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">{post.category}</span>
              <time dateTime={post.created_at} className="text-gray-500">{publishedDate}</time>
              <span className="text-gray-500">{post.views + 1} views</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl md:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 border-b border-gray-200 pb-7 text-lg leading-8 text-gray-600 sm:text-xl sm:leading-9">{post.excerpt}</p>}
          </header>

          {post.featured_image && (
            <figure className="mb-10 overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              <img src={post.featured_image} alt={post.title} className="max-h-[520px] w-full object-cover" />
            </figure>
          )}

          <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <section className="mt-14 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold text-gray-950">About MemeMaster</h2>
            <p className="mt-3 leading-7 text-gray-600">
              MemeMaster is your go-to resource for understanding and using the internet&apos;s best memes. We research the origins, cultural impact, and best practices behind the formats people share every day.
            </p>
          </section>

          <section className="mt-6 rounded-2xl bg-[#172554] px-6 py-9 text-center text-white sm:px-10">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to create your own?</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-blue-100">Explore meme templates and find the right format for your next post.</p>
            <a href="/" className="mt-6 inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-blue-950 transition hover:bg-blue-50">
              Browse Meme Templates <span className="ml-2" aria-hidden="true">→</span>
            </a>
          </section>
        </article>
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500 sm:px-6">
          © 2026 MemeMaster. All memes are user-generated content.
        </div>
      </footer>
    </div>
  )
}
