// frontend/components/NewsCard.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const NewsCard = ({ article, onViewDetails, onVote, userId }) => {
  // Use MongoDB's _id for checking if user has voted
  const userUpvoted = article.upvotes && article.upvotes.includes(userId);
  const userDownvoted = article.downvotes && article.downvotes.includes(userId);

  // Determine border color based on ML score
  const getScoreBorderColor = (score) => {
    if (score <= 0.3) return 'border-red-500'; // Low credibility
    if (score <= 0.6) return 'border-yellow-500'; // Medium credibility
    return 'border-emerald-500'; // High credibility
  };

  // Determine text/background color for score badge
  const getScoreBadgeColors = (score) => {
    if (score <= 0.3) return 'bg-red-700 text-red-100';
    if (score <= 0.6) return 'bg-yellow-700 text-yellow-100';
    return 'bg-emerald-700 text-emerald-100';
  };

  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between transform hover:scale-102 hover:shadow-xl transition-transform duration-200 border-l-4 ${getScoreBorderColor(article.mlScore)}`}>
      {/* Article content */}
      <div>
        <h3
          className="text-xl font-bold text-gray-100 cursor-pointer hover:text-emerald-400 transition-colors duration-200 mb-2"
          onClick={onViewDetails}
        >
          {article.headline}
        </h3>
        <p className="text-gray-400 text-sm mb-3">By {article.uploadedBy} on {new Date(article.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-300 mb-4 line-clamp-3">{article.description}</p>
      </div>

      {/* Footer: Score and Vote Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
        <span className={`px-3 py-1 text-sm font-bold rounded-full self-start ${getScoreBadgeColors(article.mlScore)}`}>
          Credibility: {(article.mlScore * 100).toFixed(0)}%
        </span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onVote(article._id, 'upvote')} // Use article._id for vote API call
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              userUpvoted ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-emerald-800 hover:text-white'
            }`}
          >
            <ArrowUp className="h-4 w-4" />
            <span>{article.upvotes ? article.upvotes.length : 0}</span>
          </button>
          <button
            onClick={() => onVote(article._id, 'downvote')} // Use article._id for vote API call
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              userDownvoted ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-red-800 hover:text-white'
            }`}
          >
            <ArrowDown className="h-4 w-4" />
            <span>{article.downvotes ? article.downvotes.length : 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;