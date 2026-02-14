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

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">📝</span>
              <span className="text-2xl font-bold text-gray-900">Blog Admin (TEMP - NO PASSWORD)</span>
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
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 font-semibold">
            ⚠️ WARNING: This admin has NO password protection. Add password after testing!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editing ? 'Edit Post' : 'Create New Post'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      if (!editing) {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        })
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Drake Meme Guide"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">URL: /blog/{formData.slug || 'your-slug'}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content (HTML) *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Meme Origins</option>
                    <option>Meme Tutorials</option>
                    <option>Trending Memes</option>
                    <option>Meme Culture</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-gray-700">
                    Publish immediately
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    {editing ? 'Update' : 'Create'} Post
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
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Posts ({posts.length})
              </h2>

              {loading ? (
                <p>Loading...</p>
              ) : posts.length === 0 ? (
                <p>No posts yet</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <h3 className="font-bold">{post.title}</h3>
                      <p className="text-sm text-gray-600">{post.excerpt}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          Edit
                        </button>
                        
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                        >
                          Delete
                        </button>
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