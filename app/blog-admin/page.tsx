'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function BlogAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'Meme Origins',
    published: false,
  })

  // Check if already logged in
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('blog_admin_authenticated')
    if (loggedIn === 'true') {
      setIsAuthenticated(true)
      fetchPosts()
    } else {
      setLoading(false)
    }
  }, [])

  // Handle login
  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    
    const correctPassword = 'TEST123'  // Hardcoded for testing 
    
    if (password === correctPassword) {
      sessionStorage.setItem('blog_admin_authenticated', 'true')
      setIsAuthenticated(true)
      setError('')
      fetchPosts()
    } else {
      setError('❌ Incorrect password. Access denied.')
      setPassword('')
    }
  }

  // Handle logout
  function handleLogout() {
    sessionStorage.removeItem('blog_admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
  }

  async function fetchPosts() {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    setPosts(data || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (editing) {
      await supabase
        .from('blog_posts')
        .update(formData)
        .eq('id', editing.id)
    } else {
      await supabase
        .from('blog_posts')
        .insert([formData])
    }

    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: 'Meme Origins',
      published: false,
    })
    setEditing(null)
    fetchPosts()
    alert('✅ Post saved successfully!')
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this post?')) {
      await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
      fetchPosts()
    }
  }

  function handleEdit(post: any) {
    setEditing(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      category: post.category,
      published: post.published,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Blog Admin
            </h1>
            <p className="text-gray-600">
              Enter password to access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter your password"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg transition shadow-lg hover:shadow-xl"
            >
              🔓 Unlock Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-blue-600">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ADMIN PANEL
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">📝</span>
              <span className="text-2xl font-bold text-gray-900">Blog Admin</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Authenticated
              </span>
            </div>
            <div className="flex gap-4">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">View Blog</a>
              <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Meme Admin</a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                🔒 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editing ? '✏️ Edit Post' : '✨ Create New Post'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value
                      setFormData({ 
                        ...formData, 
                        title: newTitle,
                        slug: !editing ? generateSlug(newTitle) : formData.slug
                      })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Drake Meme: Complete Guide"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="drake-meme-complete-guide"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL: /blog/{formData.slug || 'your-slug-here'}
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt (Short Description)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="A brief summary for the blog listing page..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content (HTML) *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="<h2>Your Section Title</h2>
<p>Your paragraph text here...</p>
<ul>
  <li>Bullet point</li>
</ul>"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;img&gt;
                  </p>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://res.cloudinary.com/..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload to Cloudinary, then paste URL here
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Meme Origins</option>
                    <option>Meme Tutorials</option>
                    <option>Trending Memes</option>
                    <option>Meme Culture</option>
                  </select>
                </div>

                {/* Published */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-gray-900">
                    ✅ Publish immediately (make visible to public)
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition text-lg shadow-lg"
                  >
                    {editing ? '💾 Update Post' : '🚀 Create Post'}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null)
                        setFormData({
                          title: '',
                          slug: '',
                          excerpt: '',
                          content: '',
                          featured_image: '',
                          category: 'Meme Origins',
                          published: false,
                        })
                      }}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Posts List */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📚 All Posts ({posts.length})
              </h2>

              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 text-lg">No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-bold text-gray-900">{post.title}</h3>
                            {post.published ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                ✅ Published
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                                📝 Draft
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {post.excerpt || 'No excerpt'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📂 {post.category}</span>
                            <span>👁️ {post.views} views</span>
                            <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold whitespace-nowrap"
                          >
                            ✏️ Edit
                          </button>
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-semibold text-center"
                          >
                            👁️ View
                          </a>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


