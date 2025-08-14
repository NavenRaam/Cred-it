import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link'; // Keep Link if used in Sidebar or elsewhere for navigation

// Import newly created components
import Sidebar from '../components/Sidebar';
import NewsCard from '../components/NewsCard';
import UploadNewsModal from '../components/UploadNewsModal';
import ArticleDetailModal from '../components/ArticleDetailModal';

import {
  Plus,
  Loader2,
  Menu,
  X // Added X for the sidebar close icon
} from 'lucide-react';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Use session email as user ID, or a fallback if not available
  const currentUserId = session?.user?.email;

  const [newsArticles, setNewsArticles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showArticleDetailModal, setShowArticleDetailModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true); // Component starts in loading state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // --- Fetch initial articles from the API ---
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const articles = await response.json();
      // Ensure mlScore exists for sorting, default to 0 if null/undefined
      setNewsArticles(articles.sort((a, b) => (b.mlScore || 0) - (a.mlScore || 0)));
    } catch (error) {
      toast.error('Could not load articles.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchNews();
  }, [session, status, router, fetchNews]);

  // --- Function to handle uploading a new article ---
  // This function now receives the finalCredibilityScore directly from UploadNewsModal
  const handleUploadNews = async (headline, description, finalCredibilityScore) => {
    setShowUploadModal(false); // Close the modal
    setLoading(true); // Show main dashboard loading spinner

    try {
      // Step 2: Create the article in the database with the obtained score
      // This call now directly uses the score calculated by /api/score-content
      const uploadResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          description,
          mlScore: finalCredibilityScore, // Use the score passed from the modal
        }),
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || 'Failed to upload article to database.');
      }

      // Update local state with the new article from the database response
      // Mongoose _id is typically used as the unique key
      const newArticle = uploadData.post;
      setNewsArticles(prevArticles => {
        const updatedArticles = [...prevArticles, newArticle];
        return updatedArticles.sort((a, b) => (b.mlScore || 0) - (a.mlScore || 0));
      });

      toast.success('Article uploaded and saved!');
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Function to handle voting on an article ---
  const handleVote = useCallback(async (articleId, voteType) => {
    if (!currentUserId) {
      toast.error('You must be logged in to vote.');
      return;
    }

    try {
      // Send the vote to the new API endpoint
      const response = await fetch(`/api/posts/${articleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType, userId: currentUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit vote');
      }

      // The API should return the updated article object
      const updatedArticle = await response.json();

      // Update the local state with the new article from the server
      setNewsArticles(prevArticles => {
        return prevArticles.map(article =>
          article._id === articleId ? updatedArticle : article
        ).sort((a, b) => (b.mlScore || 0) - (a.mlScore || 0));
      });
    } catch (error) {
      toast.error(`Vote failed: ${error.message}`);
      console.error('Vote error:', error);
    }
  }, [currentUserId]);

  // Effect for handling clicks outside the profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);


  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-emerald-400">
        <Loader2 className="h-10 w-10 animate-spin mr-3" />
        Loading session...
      </div>
    );
  }

  if (!session) {
    return null; // Redirect is handled by useEffect
  }

  return (
    <div className="flex min-h-screen relative">
      <Toaster position="top-center" reverseOrder={false} />

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg shadow-lg text-emerald-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="Toggle sidebar menu"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        session={session}
        profileDropdownRef={profileDropdownRef}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
      />

      <main className={`flex-1 p-5 overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 ease-in-out`}>
        <header className="mb-8 p-4 bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-100">Community Feed</h2>
            <p className="text-gray-400">Stay updated with the latest articles, sorted by credibility.</p>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-emerald-400">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            Loading articles...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {newsArticles.length > 0 ? (
              newsArticles.map((article) => (
                <NewsCard
                  key={article._id} // Use article._id for Mongoose unique ID
                  article={article}
                  onViewDetails={() => {
                    setSelectedArticle(article);
                    setShowArticleDetailModal(true);
                  }}
                  onVote={handleVote}
                  userId={currentUserId}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 p-8 bg-gray-800 rounded-lg shadow">
                No news articles available. Be the first to upload one!
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 z-30"
          aria-label="Upload new article"
        >
          <Plus className="h-6 w-6" />
        </button>
      </main>

      {showUploadModal && (
        <UploadNewsModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadNews} // This `handleUploadNews` now receives the score
        />
      )}

      {showArticleDetailModal && selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setShowArticleDetailModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
