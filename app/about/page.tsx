export default function AboutPage() {
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🎭</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">About MemeMaster</h1>
            <p className="text-xl text-gray-600">
              Your ultimate destination for meme templates and viral content
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                MemeMaster was created with a simple goal: to provide the internet's best collection of meme templates, completely free and without watermarks. We believe that memes are a powerful form of communication and creative expression in the digital age.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're a social media manager, content creator, or just someone who loves making people laugh, we're here to provide you with the tools you need to create engaging, shareable content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Free Templates</h3>
                  <p className="text-gray-700">
                    Thousands of meme templates available for instant download. No sign-up required, no watermarks, completely free.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-4xl mb-3">📖</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Meme Stories</h3>
                  <p className="text-gray-700">
                    Learn about the origins, history, and cultural impact of your favorite memes through our in-depth blog posts.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-4xl mb-3">🔥</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Trending Content</h3>
                  <p className="text-gray-700">
                    Stay up-to-date with the latest viral memes and trends. We update our collection daily with new content.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="text-4xl mb-3">🌍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Global & Local</h3>
                  <p className="text-gray-700">
                    From international viral sensations to Indian meme culture, we celebrate memes from around the world.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MemeMaster?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong className="text-lg text-gray-900">100% Free:</strong>
                    <p className="text-gray-700">All templates are completely free to download and use. No hidden fees, no subscriptions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong className="text-lg text-gray-900">No Watermarks:</strong>
                    <p className="text-gray-700">Download clean, professional meme templates without any watermarks or branding.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong className="text-lg text-gray-900">Easy to Use:</strong>
                    <p className="text-gray-700">Simple interface with search and category filters to find exactly what you need.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong className="text-lg text-gray-900">Educational Content:</strong>
                    <p className="text-gray-700">Learn the stories behind memes with our detailed blog posts and guides.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong className="text-lg text-gray-900">Regularly Updated:</strong>
                    <p className="text-gray-700">New templates and content added daily to keep up with internet trends.</p>
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Community</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                MemeMaster serves content creators, social media managers, marketers, students, and meme enthusiasts from around the world. Our community includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li>Social media influencers and content creators</li>
                <li>Digital marketing professionals</li>
                <li>Students and educators</li>
                <li>Businesses looking to engage their audience</li>
                <li>Anyone who loves memes and wants to create their own</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Content Standards</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We are committed to providing high-quality, appropriate content:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li>All content is family-friendly and appropriate for general audiences</li>
                <li>We respect intellectual property rights and proper attribution</li>
                <li>Templates are curated for quality and relevance</li>
                <li>We welcome user-generated content that meets our guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We love hearing from our users! Whether you have questions, suggestions, or just want to share your favorite meme creation, we're here to listen.
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <p className="text-lg text-gray-900 mb-3">
                  <strong>Contact us:</strong>
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>📧 Email: contact@memetemplate.lol</li>
                  <li>🌐 Website: <a href="https://memetemplate.lol" className="text-blue-600 hover:underline">https://memetemplate.lol</a></li>
                  <li>📝 <a href="/contact" className="text-blue-600 hover:underline">Contact Form</a></li>
                </ul>
              </div>
            </section>
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
