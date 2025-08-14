// components/EditPostModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditPostModal = ({ article, onClose, onUpdate }) => {
  const [headline, setHeadline] = useState(article.headline);
  const [description, setDescription] = useState(article.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Sync state if article prop changes (useful if modal is reused)
    setHeadline(article.headline);
    setDescription(article.description);
  }, [article]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!headline.trim() || !description.trim()) {
      setError('Both headline and description are required.');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(headline, description, article._id); // Call the parent update function
      onClose(); // Close on successful update
    } catch (err) {
      console.error('Error updating post in modal:', err);
      setError('Failed to update post. Please try again.');
      toast.error('Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md animate-fade-in-up relative text-gray-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Edit Article</h2>
        {error && (
          <div className="bg-red-800 bg-opacity-30 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-headline" className="block text-gray-300 text-sm font-medium mb-2">
              Headline
            </label>
            <textarea
              id="edit-headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 placeholder-gray-500"
              placeholder="Enter news headline"
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="edit-description" className="block text-gray-300 text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 placeholder-gray-500"
              placeholder="Write your article content here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
