// frontend/components/UploadNewsModal.jsx
import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadNewsModal = ({ onClose, onUpload }) => {
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isScoring, setIsScoring] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!headline.trim() || !description.trim()) {
      setError('Both headline and description are required.');
      return;
    }

    setIsScoring(true); // Indicate that scoring is starting
    try {
      // Call the Next.js API proxy route to get the credibility score
      const response = await fetch('/api/score-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // *** THIS IS THE CORRECTED LINE ***
        body: JSON.stringify({ headline, description }), // Send headline and description as separate fields
      });

      const data = await response.json();

      if (data.success) {
        // Pass the headline, description, AND the actual ML score to the onUpload prop
        onUpload(headline, description, data.credibilityScore);
        // Toast is now handled in DashboardPage after DB save confirmation
        // onClose(); // Close modal immediately after sending to parent
      } else {
        setError(data.message || 'Failed to get credibility score.');
        toast.error(data.message || 'Failed to get credibility score.');
      }
    } catch (err) {
      console.error('Error during article scoring:', err);
      setError('An unexpected error occurred during scoring.');
      toast.error('An unexpected error occurred during scoring.');
    } finally {
      setIsScoring(false); // Always set to false when scoring is done
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
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Upload New Article</h2>
        {error && (
          <div className="bg-red-800 bg-opacity-30 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="headline" className="block text-gray-300 text-sm font-medium mb-2">
              Headline
            </label>
            <textarea
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-20 placeholder-gray-500"
              placeholder="Enter news headline"
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y h-32 placeholder-gray-500"
              placeholder="Write your article content here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 flex items-center justify-center"
            disabled={isScoring}
          >
            {isScoring ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Scoring & Uploading...
              </>
            ) : (
              'Upload Article'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNewsModal;
