import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">🎭</span>
            <span className="text-2xl font-bold text-gray-900">
              MemeMaster
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </Link>
            <Link 
              href="/trending" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Trending
            </Link>
            <Link 
              href="/indian" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Indian
            </Link>
            <Link 
              href="/international" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              International
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}