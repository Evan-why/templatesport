import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'MemeMaster - Free Meme Templates & Viral Content',
    template: '%s | MemeMaster'
  },
  description: 'Discover, download, and share the best meme templates. Browse trending, Indian, and international memes. Free to use, no watermarks!',
  keywords: ['memes', 'meme templates', 'viral content', 'indian memes', 'trending memes', 'free memes', 'meme generator', 'funny memes'],
  authors: [{ name: 'MemeMaster' }],
  creator: 'MemeMaster',
  publisher: 'MemeMaster',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'MemeMaster',
    title: 'MemeMaster - Free Meme Templates & Viral Content',
    description: 'Discover, download, and share the best meme templates. Browse trending, Indian, and international memes.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MemeMaster - Free Meme Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemeMaster - Free Meme Templates & Viral Content',
    description: 'Discover, download, and share the best meme templates. Browse trending, Indian, and international memes.',
    images: ['/og-image.jpg'],
    creator: '@mememaster',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MemeMaster',
    description: 'Free meme templates and viral content',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
