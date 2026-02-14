'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ⚠️ CHANGE THIS PASSWORD TO WHATEVER YOU WANT!
const ADMIN_PASSWORD = "Evan1.2.3.4.5"

export default function BlogAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
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

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('blog_logged_in')
    if (loggedIn === 'true') {
      setIsLoggedIn(true)
      fetchPosts()
    } else {
      setLoading(false)
    }
  }, [])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('blog_logged_in', 'true')
      setIsLoggedIn(true)
      setError('')
      fetchPosts()
    } else {
      setError('Wrong password! Check the password in the code.')
      setPasswordInput('')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('blog_logged_in')
    setIsLoggedIn(false)
    setPasswordInput('')
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

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Admin</h1>
            <p className="text-gray-600">Enter your password</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter password"
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
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg"
            >
              🔓 Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</a>
          </div>
        </div>
      </div>
    )
  }

  // ADMIN PANEL
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">📝</span>
              <span className="text-2xl font-bold">Blog Admin</span>
            </div>
            <div className="flex gap-4">
              <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600">Blog</a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editing ? 'Edit Post' : 'Create Post'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
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
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">URL: /blog/{formData.slug || 'slug'}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Content (HTML) *</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Featured Image URL</label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option>Meme Origins</option>
                    <option>Meme Tutorials</option>
                    <option>Trending Memes</option>
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
                  <label htmlFor="published">Publish immediately</label>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {editing ? 'Update' : 'Create'} Post
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Posts ({posts.length})</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <h3 className="font-bold">{post.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          Edit
                        </button>
                        
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="px-3 py-1 bg-gray-100 rounded text-sm"
                        >
                          View
                        </a>
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