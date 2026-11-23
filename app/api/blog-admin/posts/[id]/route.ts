import { NextRequest, NextResponse } from 'next/server'
import { blogAdminSupabase, isBlogAdmin } from '../../../../../lib/blog-admin-auth'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isBlogAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const allowed = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'category', 'published']
    const payload = Object.fromEntries(allowed.filter(key => key in body).map(key => [key, body[key]]))
    const { data, error } = await blogAdminSupabase().from('blog_posts').update(payload).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Blog admin update error:', error)
    return NextResponse.json({ error: 'Could not update the article.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isBlogAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const { error } = await blogAdminSupabase().from('blog_posts').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog admin delete error:', error)
    return NextResponse.json({ error: 'Could not delete the article.' }, { status: 500 })
  }
}
