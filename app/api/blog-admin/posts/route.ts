import { NextRequest, NextResponse } from 'next/server'
import { blogAdminSupabase, isBlogAdmin } from '../../../lib/blog-admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  if (!await isBlogAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { data, error } = await blogAdminSupabase().from('blog_posts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ posts: data || [] })
  } catch (error) {
    console.error('Blog admin list error:', error)
    return NextResponse.json({ error: 'Could not load articles.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!await isBlogAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const allowed = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'category', 'published']
    const payload = Object.fromEntries(allowed.filter(key => key in body).map(key => [key, body[key]]))
    if (typeof payload.title !== 'string' || !payload.title.trim() || typeof payload.slug !== 'string' || !payload.slug.trim() || typeof payload.content !== 'string') {
      return NextResponse.json({ error: 'Title, URL and article content are required.' }, { status: 400 })
    }
    const { data, error } = await blogAdminSupabase().from('blog_posts').insert([payload]).select().single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Blog admin create error:', error)
    return NextResponse.json({ error: 'Could not save the article.' }, { status: 500 })
  }
}
