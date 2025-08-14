// components/DeleteConfirmationModal.jsx
import React, { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const DeleteConfirmationModal = ({ article, onClose, onConfirmDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirmDelete(article._id); // Call the parent delete function
      onClose(); // Close on successful deletion
    } catch (err) {
      console.error('Error deleting post in modal:', err);
      toast.error('Failed to delete post.');
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
        <div className="text-center mb-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Confirm Deletion</h2>
          <p className="text-gray-300">
            Are you sure you want to delete the article: <br />
            <span className="font-semibold italic">"{article.headline}"</span>?
          </p>
          <p className="text-red-400 text-sm mt-2">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
