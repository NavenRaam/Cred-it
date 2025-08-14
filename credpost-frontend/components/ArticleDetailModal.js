// frontend/components/ArticleDetailModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const ArticleDetailModal = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up relative text-gray-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-100 mb-4">{article.headline}</h2>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <span className="mr-4">Credibility: <span className="font-semibold text-emerald-400">{(article.mlScore * 100).toFixed(0)}%</span></span>
          <span className="mr-4">Upvotes: <span className="font-semibold text-emerald-400">{article.upvotes ? article.upvotes.length : 0}</span></span>
          <span>Downvotes: <span className="font-semibold text-red-400">{article.downvotes ? article.downvotes.length : 0}</span></span>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{article.description}</p>
        <p className="text-gray-500 text-xs mt-4">Uploaded by: {article.uploadedBy} on {new Date(article.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ArticleDetailModal;