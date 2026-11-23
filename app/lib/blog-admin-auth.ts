import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'mememaster_blog_admin'
const SESSION_SECONDS = 60 * 60 * 12

function secret() {
  const value = process.env.BLOG_ADMIN_SESSION_SECRET
  if (!value || value.length < 32) throw new Error('BLOG_ADMIN_SESSION_SECRET must be set to a random value of at least 32 characters')
  return value
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS
  const payload = Buffer.from(JSON.stringify({ role: 'blog-admin', exp: expires })).toString('base64url')
  const token = payload + '.' + sign(payload)
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isBlogAdmin() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value
    if (!token) return false
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return false
    const expected = Buffer.from(sign(payload))
    const received = Buffer.from(signature)
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.role === 'blog-admin' && Number(data.exp) > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export function blogAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server Supabase configuration is missing')
  // Import lazily so public pages continue to use the anon client.
  const { createClient } = require('@supabase/supabase-js') as typeof import('@supabase/supabase-js')
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
