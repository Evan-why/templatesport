import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '../../../../lib/blog-admin-auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const expected = process.env.BLOG_ADMIN_PASSWORD
    if (!expected) return NextResponse.json({ error: 'Admin login is not configured on the server.' }, { status: 503 })
    if (typeof password !== 'string' || password.length === 0 || password.length > 500) {
      return NextResponse.json({ error: 'Enter your admin password.' }, { status: 400 })
    }
    if (password !== expected) return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 })
    await createAdminSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog admin login error:', error)
    return NextResponse.json({ error: 'Admin login is temporarily unavailable.' }, { status: 500 })
  }
}
