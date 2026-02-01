import { MetadataRoute } from 'next'
import { supabase } from './lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Get all memes
  const { data: memes } = await supabase
    .from('memes')
    .select('slug, created_at')
    .order('created_at', { ascending: false })

  // Generate meme URLs
  const memeUrls = memes?.map((meme) => ({
    url: `${baseUrl}/meme/${meme.slug}`,
    lastModified: new Date(meme.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/?category=trending`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?category=indian`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?category=international`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  return [...staticPages, ...memeUrls]
}