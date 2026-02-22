export default function TermsPage() {
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: February 22, 2026</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using MemeMaster ("the Website"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Permitted Use</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                MemeMaster provides meme templates and related content for personal and commercial use. You may:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Download and use meme templates for personal projects</li>
                <li>Use templates for social media content</li>
                <li>Use templates for commercial purposes with proper attribution where required</li>
                <li>Share content from the Website with proper attribution</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Prohibited Use</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may NOT:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Claim ownership of templates or content from this Website</li>
                <li>Redistribute templates in bulk or create competing template websites</li>
                <li>Use automated tools to scrape or download content in bulk</li>
                <li>Create content that is illegal, offensive, or violates others' rights</li>
                <li>Attempt to hack, disrupt, or compromise the Website's security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Content and Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Our Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Website's design, logo, branding, and original content are owned by MemeMaster and protected by copyright and intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 User-Generated Content</h3>
              <p className="text-gray-700 leading-relaxed">
                Meme templates are user-generated or sourced from public domains. We respect intellectual property rights and will promptly remove any content that infringes on copyrights upon notification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Website and all content are provided "as is" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or completeness of content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                MemeMaster shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Links and Services</h2>
              <p className="text-gray-700 leading-relaxed">
                The Website may contain links to third-party websites or services. We are not responsible for the content, accuracy, or practices of third-party sites. Your use of third-party sites is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Copyright Infringement</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you believe that content on our Website infringes your copyright, please contact us immediately with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>A description of the copyrighted work</li>
                <li>The URL where the infringing content appears</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief</li>
                <li>Your physical or electronic signature</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Contact: contact@memetemplate.lol
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Service</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the Website or any part thereof at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms of Service from time to time. We will notify users of significant changes by posting the updated terms on the Website. Continued use of the Website after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>• Email: contact@memetemplate.lol</li>
                <li>• Website: <a href="https://memetemplate.lol" className="text-blue-600 hover:underline">https://memetemplate.lol</a></li>
              </ul>
            </section>

            <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-8">
              <p className="text-gray-900 font-semibold mb-2">Summary</p>
              <p className="text-gray-700">
                By using MemeMaster, you agree to use our content responsibly, respect intellectual property rights, and understand that we provide the service "as is" without guarantees. We're here to help you create great content—use it wisely!
              </p>
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
