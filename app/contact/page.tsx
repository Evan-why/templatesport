export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-3xl">🎭</span>
              <span className="text-2xl font-bold text-gray-900">MemeMaster</span>
            </a>
            <div className="flex gap-6">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">📬</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions, suggestions, or just want to say hi? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Us</h2>
              <p className="text-gray-700 mb-4">
                For general inquiries, feedback, or support questions, send us an email.
              </p>
              <a 
                href="mailto:contact@memetemplate.lol" 
                className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
              >
                contact@memetemplate.lol
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">💼</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Business Inquiries</h2>
              <p className="text-gray-700 mb-4">
                Interested in partnerships, advertising, or collaborations? Let's talk!
              </p>
              <a 
                href="mailto:business@memetemplate.lol" 
                className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
              >
                business@memetemplate.lol
              </a>
            </div>
          </div>

          {/* What You Can Contact Us About */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What Can We Help You With?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <span className="text-3xl mr-4">🤝</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Partnerships & Collaborations</h3>
                  <p className="text-gray-700">Interested in working together? We're open to collaborations and partnerships.</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">📢</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Advertising Opportunities</h3>
                  <p className="text-gray-700">Want to advertise on MemeMaster? Reach thousands of engaged visitors.</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">💡</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Suggestions & Feedback</h3>
                  <p className="text-gray-700">Have ideas to improve our site? We value your feedback and suggestions!</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">🐛</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Report Issues</h3>
                  <p className="text-gray-700">Found a bug or technical issue? Let us know so we can fix it quickly.</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">📝</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Content Submissions</h3>
                  <p className="text-gray-700">Want to contribute meme templates or write for our blog? We're interested!</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">❓</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">General Questions</h3>
                  <p className="text-gray-700">Any other questions about MemeMaster? Don't hesitate to reach out!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Response Time</h2>
            <p className="text-blue-800 text-lg leading-relaxed">
              We typically respond to all inquiries within <strong>24-48 hours</strong> during business days. 
              For urgent matters, please mention "URGENT" in your email subject line.
            </p>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Follow Us</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Stay updated with the latest memes, trends, and content by following us on social media:
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Twitter / X
              </a>
              <a 
                href="#" 
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Pinterest
              </a>
              <a 
                href="#" 
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                TikTok
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Social media links will be updated once accounts are created
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
            <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
            <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
          </div>
          <div className="text-center text-gray-400 mt-8">
            <p>© 2026 MemeMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
