'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function BlogAdmin() {
  // SUPER SIMPLE PASSWORD - CHANGE THIS!
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
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
    if (loggedIn) {
      fetchPosts()
    }
  }, [loggedIn])

  async function fetchPosts() {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    
    await supabase.from('blog_posts').insert([{ ...formData, slug }])
    
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: 'Meme Origins',
      published: false,
    })
    fetchPosts()
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // CHANGE "blog123" TO YOUR PASSWORD!
    if (password === "Evanhubby12345") {
      setLoggedIn(true)
    } else {
      alert('Wrong password!')
      setPassword('')
    }
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-3xl font-bold mb-6">🔒 Blog Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-4 text-lg"
              placeholder="Enter password"
              autoFocus
            />
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg">
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Password is in the code on line 49!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border rounded"
              rows={2}
              placeholder="Excerpt"
            />
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded font-mono"
              rows={8}
              placeholder="Content (HTML)"
            />
            <input
              type="url"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              className="w-full px-4 py-2 border rounded"
              placeholder="Image URL"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              Publish
            </label>
            <button className="w-full bg-blue-600 text-white py-3 rounded font-bold">
              Create Post
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">All Posts ({posts.length})</h2>
          {posts.map((post) => (
            <div key={post.id} className="border-b py-2">
              <p className="font-bold">{post.title}</p>
              <a href={`/blog/${post.slug}`} target="_blank" className="text-blue-600 text-sm">
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 