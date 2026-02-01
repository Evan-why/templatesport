import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Meme = {
  id: string
  title: string
  description: string | null
  slug: string
  image_url: string
  cloudinary_id: string | null
  category: 'trending' | 'indian' | 'international'
  tags: string[]
  source_url: string | null
  source_platform: string
  upvotes: number
  downloads: number
  views: number
  is_trending: boolean
  alt_text: string | null
  media_type: 'image' | 'video'  // NEW
  duration: number  // NEW (in seconds)
  created_at: string
  updated_at: string
}


export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  meme_count: number
  created_at: string
}