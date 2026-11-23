'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  category: string
  published: boolean
  views: number
  created_at: string
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  category: 'Meme Origins',
  published: false,
}

const fieldClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export default function BlogAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('blog_admin_authenticated')
    if (loggedIn === 'true') {
      setIsAuthenticated(true)
      void fetchPosts()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchPosts() {
    const { data, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      alert('Could not load posts: ' + fetchError.message)
    } else {
      setPosts((data || []) as Post[])
    }
    setLoading(false)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // This preserves the current login behaviour for now. It must be replaced
    // with server-verified authentication before the admin is considered secure.
    const correctPassword = process.env.NEXT_PUBLIC_BLOG_ADMIN_PASSWORD || 'changeme123'
    if (password === correctPassword) {
      sessionStorage.setItem('blog_admin_authenticated', 'true')
      setIsAuthenticated(true)
      setError('')
      void fetchPosts()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('blog_admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
  }

  function generateSlug(title: string) {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function updateContent() {
    setFormData(current => ({ ...current, content: editorRef.current?.innerHTML || '' }))
  }

  function formatText(command: string, value?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    updateContent()
  }

  function insertLink() {
    const url = window.prompt('Paste the link URL')
    if (url) formatText('createLink', url)
  }

  function insertImage() {
    const url = window.prompt('Paste the image URL')
    if (url) formatText('insertImage', url)
  }

  function startNewPost() {
    setEditing(null)
    setFormData(emptyForm)
    if (editorRef.current) editorRef.current.innerHTML = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleEdit(post: Post) {
    setEditing(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image: post.featured_image || '',
      category: post.category,
      published: post.published,
    })
    if (editorRef.current) editorRef.current.innerHTML = post.content || ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const content = editorRef.current?.innerHTML || ''
    if (!content.replace(/<[^>]*>/g, '').trim()) {
      alert('Please write some article content before saving.')
      return
    }
    if (!formData.title.trim() || !formData.slug.trim()) {
      alert('Please add a title and URL slug.')
      return
    }

    setSaving(true)
    const payload = { ...formData, content }
    const result = editing
      ? await supabase.from('blog_posts').update(payload).eq('id', editing.id)
      : await supabase.from('blog_posts').insert([payload])

    setSaving(false)
    if (result.error) {
      alert('Could not save the post: ' + result.error.message)
      return
    }

    alert(editing ? 'Post updated successfully.' : 'Post saved successfully.')
    startNewPost()
    await fetchPosts()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this post permanently?')) return
    const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', id)
    if (deleteError) {
      alert('Could not delete the post: ' + deleteError.message)
      return
    }
    await fetchPosts()
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f5f9] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mb-3 text-5xl">📝</div>
            <h1 className="text-3xl font-bold text-gray-950">Blog Admin</h1>
            <p className="mt-2 text-gray-600">Sign in to manage your articles</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm font-semibold text-gray-800" htmlFor="admin-password">Admin password</label>
            <input id="admin-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className={fieldClass} placeholder="Enter your password" autoComplete="current-password" />
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800">Open Blog Admin</button>
          </form>
          <a href="/" className="mt-6 block text-center text-sm text-gray-500 hover:text-blue-700">← Back to website</a>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h1 className="font-bold text-gray-950">MemeMaster Blog Studio</h1>
              <p className="text-xs text-gray-500">Write, preview and publish</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <a href="/" className="text-gray-600 hover:text-blue-700">Website</a>
            <a href="/blog" className="text-gray-600 hover:text-blue-700">Public blog</a>
            <button onClick={handleLogout} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50">Log out</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">{editing ? 'Editing article' : 'New article'}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">{editing ? editing.title : 'Create your next story'}</h2>
            <p className="mt-1 text-sm text-gray-600">Your writing is on the left. The reader preview is on the right.</p>
          </div>
          <button type="button" onClick={startNewPost} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">＋ New article</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
            <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-950">✍️ Writing desk</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Editor</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="post-title" className="mb-1.5 block text-sm font-semibold text-gray-800">Article title *</label>
                  <input id="post-title" required value={formData.title} onChange={e => {
                    const title = e.target.value
                    setFormData(current => ({ ...current, title, slug: editing ? current.slug : generateSlug(title) }))
                  }} className={fieldClass} placeholder="e.g. The Story Behind the Distracted Boyfriend Meme" />
                </div>

                <div>
                  <label htmlFor="post-slug" className="mb-1.5 block text-sm font-semibold text-gray-800">Article URL *</label>
                  <input id="post-slug" required value={formData.slug} onChange={e => setFormData(current => ({ ...current, slug: generateSlug(e.target.value) }))} className={fieldClass} placeholder="article-url-slug" />
                  <p className="mt-1.5 text-xs text-gray-500">Your article address: <span className="font-medium text-blue-700">/blog/{formData.slug || 'your-article'}</span></p>
                </div>

                <div>
                  <label htmlFor="post-excerpt" className="mb-1.5 block text-sm font-semibold text-gray-800">Short description</label>
                  <textarea id="post-excerpt" rows={3} value={formData.excerpt} onChange={e => setFormData(current => ({ ...current, excerpt: e.target.value }))} className={fieldClass} placeholder="A short introduction shown on the blog listing and in search descriptions." />
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <label className="text-sm font-semibold text-gray-800">Article body *</label>
                    <span className="text-xs text-gray-500">Select text, then apply formatting</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
                    <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
                      {[
                        { label: 'B', command: 'bold', title: 'Bold' },
                        { label: 'I', command: 'italic', title: 'Italic' },
                        { label: 'U', command: 'underline', title: 'Underline' },
                        { label: 'H2', command: 'formatBlock', value: 'h2', title: 'Section heading' },
                        { label: 'H3', command: 'formatBlock', value: 'h3', title: 'Small heading' },
                        { label: '¶', command: 'formatBlock', value: 'p', title: 'Paragraph' },
                        { label: '• List', command: 'insertUnorderedList', title: 'Bullet list' },
                        { label: '1. List', command: 'insertOrderedList', title: 'Numbered list' },
                      ].map(item => (
                        <button key={item.label} type="button" title={item.title} onMouseDown={e => e.preventDefault()} onClick={() => formatText(item.command, item.value)} className="min-w-9 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">{item.label}</button>
                      ))}
                      <button type="button" title="Insert link" onMouseDown={e => e.preventDefault()} onClick={insertLink} className="rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50">Link</button>
                      <button type="button" title="Insert image from URL" onMouseDown={e => e.preventDefault()} onClick={insertImage} className="rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50">Image</button>
                      <button type="button" title="Undo" onMouseDown={e => e.preventDefault()} onClick={() => formatText('undo')} className="rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100">↶</button>
                      <button type="button" title="Redo" onMouseDown={e => e.preventDefault()} onClick={() => formatText('redo')} className="rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100">↷</button>
                    </div>
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={updateContent}
                      onBlur={updateContent}
                      role="textbox"
                      aria-label="Write your blog article"
                      aria-multiline="true"
                      className="min-h-[440px] bg-white px-5 py-5 text-base leading-8 text-gray-900 outline-none empty:before:text-gray-400 empty:before:content-['Start_writing_your_story_here...'] [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-950 [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-bold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-7 [&_a]:text-blue-700 [&_a]:underline [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg"
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-gray-500">Tip: press Enter for a new paragraph. Use the toolbar for section headings, lists, links and images.</p>
                </div>

                <div>
                  <label htmlFor="cover-image" className="mb-1.5 block text-sm font-semibold text-gray-800">Cover image URL</label>
                  <input id="cover-image" type="url" value={formData.featured_image} onChange={e => setFormData(current => ({ ...current, featured_image: e.target.value }))} className={fieldClass} placeholder="https://..." />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="post-category" className="mb-1.5 block text-sm font-semibold text-gray-800">Category</label>
                    <select id="post-category" value={formData.category} onChange={e => setFormData(current => ({ ...current, category: e.target.value }))} className={fieldClass}>
                      <option>Meme Origins</option>
                      <option>Meme Tutorials</option>
                      <option>Trending Memes</option>
                      <option>Meme Culture</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 self-end rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-800">
                    <input type="checkbox" checked={formData.published} onChange={e => setFormData(current => ({ ...current, published: e.target.checked }))} className="h-4 w-4 accent-blue-700" />
                    Publish immediately
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                  <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save changes' : 'Save article'}</button>
                  {editing && <button type="button" onClick={startNewPost} className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>}
                </div>
              </div>
            </section>

            <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 xl:sticky xl:top-24">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-950">👀 Reader preview</h3>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Live preview</span>
              </div>
              <div className="max-h-[850px] overflow-y-auto rounded-xl border border-gray-200 bg-[#f7f7f5] p-5 sm:p-8">
                <article className="mx-auto max-w-2xl">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-blue-700">{formData.category}</p>
                  <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl">{formData.title || 'Your article title will appear here'}</h1>
                  {formData.excerpt && <p className="mt-4 border-b border-gray-200 pb-6 text-lg leading-8 text-gray-600">{formData.excerpt}</p>}
                  {formData.featured_image && <img src={formData.featured_image} alt="Article cover preview" className="mt-7 max-h-80 w-full rounded-xl object-cover" />}
                  <div className="article-content mt-7" dangerouslySetInnerHTML={{ __html: formData.content || '<p>Your article preview will appear here as you write.</p>' }} />
                </article>
              </div>
              <p className="mt-3 text-xs text-gray-500">This preview uses the same article typography as the public reading page.</p>
            </section>
          </div>
        </form>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-950">Your articles ({posts.length})</h3>
              <p className="text-sm text-gray-500">Edit drafts or update published posts.</p>
            </div>
          </div>
          {loading ? <p className="text-gray-500">Loading articles…</p> : posts.length === 0 ? (
            <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No articles yet. Start with your first story above.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {posts.map(post => (
                <div key={post.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{post.title}</h4>
                      <span className={post.published ? 'rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700' : 'rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700'}>{post.published ? 'Published' : 'Draft'}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{post.category} · {post.views} views · {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleEdit(post)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Edit</button>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">View</a>
                    <button type="button" onClick={() => handleDelete(post.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
