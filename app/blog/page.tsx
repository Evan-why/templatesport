export default function BlogPage() {
  // In future, you can fetch from Supabase. For now, hardcoded.
  const blogPosts = [
    {
      id: 1,
      slug: 'distracted-boyfriend-meme-explained',
      title: 'The Distracted Boyfriend Meme: Origins and Why It Went Viral',
      excerpt: 'Discover the story behind one of the internet\'s most popular memes and why it resonates with millions.',
      image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      date: '2026-02-08',
      category: 'Meme Origins'
    },
    // Add more blog posts here
  ]

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
              <a href="/blog" className="text-blue-600 font-medium">
                📝 Blog
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Meme Stories & Context 📖
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the stories, origins, and cultural impact behind your favorite memes
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
                    Read More 
                    <span>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="mt-16 text-center bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">
              More Stories Coming Soon! 🚀
            </h3>
            <p className="text-blue-700">
              We're constantly researching and writing about the memes you love. Check back regularly for new content!
            </p>
          </div>
        </div>
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
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
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
