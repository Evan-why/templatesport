'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function BlogAdmin() {
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

  useEffect(() => {
    fetchPosts()
  }, [])

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
      // Update existing post
      await supabase
        .from('blog_posts')
        .update(formData)
        .eq('id', editing.id)
    } else {
      // Create new post
      await supabase
        .from('blog_posts')
        .insert([formData])
    }

    // Reset form
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
  }

  // Auto-generate slug from title
  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">📝</span>
              <span className="text-2xl font-bold text-gray-900">Blog Admin</span>
            </div>
            <div className="flex gap-4">
              <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600">View Blog</a>
              <a href="/admin" className="text-gray-700 hover:text-blue-600">Meme Admin</a>
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
                {editing ? 'Edit Post' : 'Create New Post'}
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
                      setFormData({ ...formData, title: e.target.value })
                      // Auto-generate slug if not editing
                      if (!editing) {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        })
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="The Ultimate Guide to Drake Memes"
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
                    placeholder="drake-meme-guide"
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
                    placeholder="A brief summary for blog listing..."
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
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="<p>Your blog content here... Use HTML tags for formatting.</p>"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.
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
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-gray-700">
                    Publish immediately (visible to public)
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                  >
                    {editing ? 'Update Post' : 'Create Post'}
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
                All Posts ({posts.length})
              </h2>

              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-600">No posts yet. Create your first post!</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{post.title}</h3>
                            {post.published ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                Published
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                                Draft
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-semibold"
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                          >
                            Delete
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

