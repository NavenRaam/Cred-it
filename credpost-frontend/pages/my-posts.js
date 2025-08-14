// pages/myposts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import Sidebar from '../components/Sidebar';
import NewsCard from '../components/NewsCard'; // Reusing NewsCard for display
import ArticleDetailModal from '../components/ArticleDetailModal'; // Reusing modal
import EditPostModal from '../components/EditPostModal'; // New component to create
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // New component to create

import { Loader2, Menu, X, Edit, Trash2 } from 'lucide-react';

const MyPostsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const currentUserId = session?.user?.email;

  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [showArticleDetailModal, setShowArticleDetailModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Fetch only user's posts
  const fetchMyPosts = useCallback(async () => {
    if (!currentUserId) return; // Don't fetch if user ID is not available yet

    setLoading(true);
    try {
      const response = await fetch('/api/posts/me', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch your articles');
      }
      const posts = await response.json();
      setMyArticles(posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error('Could not load your articles.');
      console.error('Fetch my posts error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);


  // --- Handlers for Edit/Delete ---

  const handleEditClick = (article) => {
    setArticleToEdit(article);
    setShowEditModal(true);
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleUpdatePost = async (updatedHeadline, updatedDescription, postId) => {
    setShowEditModal(false);
    setLoading(true); // Show loading while updating

    try {
      // Re-score the content if it changed significantly (optional, but good for dynamic scores)
      // For simplicity here, we'll just update the text. Re-scoring ML model would happen
      // if you were passing content back to /api/score-content
      const updateResponse = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline: updatedHeadline, description: updatedDescription }),
      });

      const data = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(data.message || 'Failed to update post.');
      }

      toast.success('Post updated successfully!');
      fetchMyPosts(); // Re-fetch posts to get latest data
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
      console.error('Post update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (postId) => {
    setShowDeleteModal(false);
    setLoading(true); // Show loading while deleting

    try {
      const deleteResponse = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      const data = await deleteResponse.json();

      if (!deleteResponse.ok) {
        throw new Error(data.message || 'Failed to delete post.');
      }

      toast.success('Post deleted successfully!');
      fetchMyPosts(); // Re-fetch posts to remove deleted item
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
      console.error('Post deletion error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-emerald-400">
        <Loader2 className="h-10 w-10 animate-spin mr-3" />
        Loading session...
      </div>
    );
  }

  if (!session) {
    return null;
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
        // No need for profile dropdown logic here as it's typically in the Dashboard
        // but passing props if Sidebar expects it
      />

      <main className={`flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 ease-in-out`}>
        <header className="mb-8 p-4 bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-100">My Uploaded Articles</h2>
            <p className="text-gray-400">Manage your contributions to the community feed.</p>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-emerald-400">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            Loading your articles...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {myArticles.length > 0 ? (
              myArticles.map((article) => (
                <div key={article._id} className="relative group">
                  <NewsCard
                    article={article}
                    onViewDetails={() => {
                      setSelectedArticle(article);
                      setShowArticleDetailModal(true);
                    }}
                    // Voting is not needed on "My Posts" view
                    onVote={() => {}} // No-op for voting
                    userId={currentUserId}
                  />
                  {/* Edit and Delete Buttons */}
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditClick(article)}
                      className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                      title="Edit Post"
                      aria-label="Edit Post"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(article)}
                      className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors"
                      title="Delete Post"
                      aria-label="Delete Post"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 p-8 bg-gray-800 rounded-lg shadow">
                You haven't uploaded any articles yet.
                <Link href="/dashboard" className="text-emerald-400 hover:underline ml-2">
                  Upload one now!
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {showArticleDetailModal && selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setShowArticleDetailModal(false)}
        />
      )}

      {showEditModal && articleToEdit && (
        <EditPostModal
          article={articleToEdit}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdatePost}
        />
      )}

      {showDeleteModal && articleToDelete && (
        <DeleteConfirmationModal
          article={articleToDelete}
          onClose={() => setShowDeleteModal(false)}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default MyPostsPage;
