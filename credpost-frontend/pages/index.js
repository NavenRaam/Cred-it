import React, { useState } from 'react';
import Link from 'next/link'; // Import Link for client-side navigation

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // The main container will inherit the global background from _app.js
    <div className="font-sans text-gray-100">
      {/* Header & Hero Section */}
      <header className="bg-gray-900 text-white pb-12 md:pb-24 px-4 sm:px-6 lg:px-8 shadow-lg">
        {/* Navigation Bar */}
        <nav className="container mx-auto py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white tracking-tight hover:text-emerald-400 transition-colors">
            Cred-it
          </Link>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300">Features</a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-colors duration-300">Why Cred-it?</a>
            <a href="#api" className="text-gray-300 hover:text-white transition-colors duration-300">API</a>
          </div>
          <Link href="/login" className="hidden md:inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105">
            Join Now
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation (Conditional) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 rounded-lg mx-auto max-w-sm py-4 mt-4 space-y-3 text-center transition-all duration-300 ease-in-out">
            <a href="#features" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#benefits" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Why Cred-it?</a>
            <a href="#api" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>API</a>
            <Link href="/login" className="block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full mx-auto w-fit mt-3" onClick={() => setIsMobileMenuOpen(false)}>
              Join Now
            </Link>
          </div>
        )}

        {/* Hero Content */}
        <div className="container mx-auto text-center mt-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Introducing <span className="text-emerald-400">Cred-it</span>
            <br />
            Where Trust Is Built In.
          </h1>
          <p className="mt-4 md:mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            A community-driven platform where every post gets an AI-powered credibility score,
            and your voice helps build a more trustworthy online world.
          </p>
          <div className="mt-8 md:mt-10 flex justify-center space-x-4">
            <a href="#features" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
              Learn More
            </a>
            <Link href="/login" className="inline-block bg-white text-emerald-600 hover:bg-gray-200 font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
              Join the Community
            </Link>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-b-2xl shadow-inner mt-[-1rem]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">How It Works</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Cred-it combines the power of artificial intelligence with the wisdom of the crowd to establish trust.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105 border-b-4 border-emerald-500">
              <div className="text-5xl text-emerald-500 mb-4">
                <span role="img" aria-label="shield">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-100">AI Credibility Scoring</h3>
              <p className="mt-2 text-gray-400">
                Every submission is instantly analyzed by our custom AI model to provide an initial credibility score.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105 border-b-4 border-emerald-500">
              <div className="text-5xl text-emerald-500 mb-4">
                <span role="img" aria-label="group">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-100">Community Feedback</h3>
              <p className="mt-2 text-gray-400">
                Users can "agree" or "disagree" with the AI's score, creating a dynamic feedback loop that refines trust.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105 border-b-4 border-emerald-500">
              <div className="text-5xl text-emerald-500 mb-4">
                <span role="img" aria-label="chart">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-100">Dynamic Demotion</h3>
              <p className="mt-2 text-gray-400">
                Content with low scores or strong community disagreement is automatically demoted to keep the feed clean.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Cred-it? Section */}
      <section id="benefits" className="bg-gray-900 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">Why Cred-it?</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            We're building more than a platform; we're building a trust ecosystem.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit Card 1 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105 border-b-4 border-indigo-500">
              <h3 className="text-xl font-bold text-gray-100 flex items-center justify-center space-x-2">
                <span className="text-indigo-400 text-3xl">✨</span> <span>Beyond Simple Detection</span>
              </h3>
              <p className="mt-2 text-gray-400">
                We don't just flag fake news. We empower our community to participate in a transparent and dynamic verification process.
              </p>
            </div>
            {/* Benefit Card 2 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105 border-b-4 border-indigo-500">
              <h3 className="text-xl font-bold text-gray-100 flex items-center justify-center space-x-2">
                <span className="text-yellow-400 text-3xl">🤝</span> <span>Transparency First</span>
              </h3>
              <p className="mt-2 text-gray-400">
                Every post's credibility score is prominently displayed, giving you a clear view of its trustworthiness right from the start.
              </p>
            </div>
            {/* Benefit Card 3 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105 border-b-4 border-indigo-500">
              <h3 className="text-xl font-bold text-gray-100 flex items-center justify-center space-x-2">
                <span className="text-red-400 text-3xl">🎯</span> <span>Proactive Moderation</span>
              </h3>
              <p className="mt-2 text-gray-400">
                Our system automatically removes or demotes low-scoring content, ensuring a cleaner and more reliable information feed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="bg-gray-800 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">Powering a Trustworthy Web</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Our Cred-it API allows other platforms to leverage our credibility scores and help build a more reliable internet.
          </p>
          <div className="mt-12 p-8 bg-gray-900 text-gray-300 rounded-2xl shadow-lg text-left overflow-x-auto">
            <pre className="language-javascript text-sm md:text-base">
              <code>{`
fetch('[https://api.Cred-it.com/v1/score](https://api.Cred-it.com/v1/score)', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: "Your article headline or content here."
  })
})
.then(response => response.json())
.then(data => console.log('Credibility Score:', data.score))
.catch(error => console.error('Error:', error));
              `}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-900 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">Ready to build a trusted community?</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Join Cred-it today and be a part of the movement to highlight trustworthiness and fight misinformation.
          </p>
          <div className="mt-8">
            <Link href="/login" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Cred-it. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
