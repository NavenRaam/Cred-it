import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import dbConnect from '../../../../lib/dbConnect';
import Post from '../../../../models/Post';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Expecting POST request for voting
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query; // Get article ID from dynamic route parameter
  const { voteType, userId } = req.body;

  if (!id || !voteType || !userId) {
    return res.status(400).json({ success: false, message: 'Article ID, vote type, and user ID are required.' });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    let currentUpvotes = new Set(post.upvotes.map(String)); // Convert to Set for efficient lookups and uniqueness
    let currentDownvotes = new Set(post.downvotes.map(String));

    const userIdString = String(userId); // Ensure userId is a string for comparison

    const hasUpvoted = currentUpvotes.has(userIdString);
    const hasDownvoted = currentDownvotes.has(userIdString);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // User is un-upvoting
        currentUpvotes.delete(userIdString);
      } else {
        // User is upvoting
        currentUpvotes.add(userIdString);
        if (hasDownvoted) {
          // If previously downvoted, remove downvote
          currentDownvotes.delete(userIdString);
        }
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        // User is un-downvoting
        currentDownvotes.delete(userIdString);
      } else {
        // User is downvoting
        currentDownvotes.add(userIdString);
        if (hasUpvoted) {
          // If previously upvoted, remove upvote
          currentUpvotes.delete(userIdString);
        }
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid voteType. Must be "upvote" or "downvote".' });
    }

    // Convert Sets back to Array for Mongoose
    post.upvotes = Array.from(currentUpvotes);
    post.downvotes = Array.from(currentDownvotes);

    // --- Dynamic Credibility Score Recalculation ---
    const N_BASE = 100; // Initial "imaginary readers"
    const currentUpvoteCount = post.upvotes.length;
    const currentDownvoteCount = post.downvotes.length;
    const totalVotes = currentUpvoteCount + currentDownvoteCount;

    // Ensure initial score is treated as a float
    const initialMlScore = parseFloat(post.mlScore) || 0.5; // Default to 0.5 if not set

    // Apply the Bayesian average inspired formula
    // New_Score = ( (Initial_Score * N_BASE) + Upvotes ) / ( N_BASE + Total_Votes )
    let newMlScore = ((initialMlScore * N_BASE) + currentUpvoteCount) / (N_BASE + totalVotes);

    // If downvotes are present, they should negatively impact the score.
    // A simple approach is to subtract downvotes from upvotes in the numerator,
    // reflecting net positive sentiment.
    newMlScore = ((initialMlScore * N_BASE) + currentUpvoteCount - currentDownvoteCount) / (N_BASE + totalVotes);


    // Clamp the score between 0 and 1
    newMlScore = Math.max(0, Math.min(1, newMlScore));
    post.mlScore = parseFloat(newMlScore.toFixed(4)); // Store with higher precision if needed, or 2

    await post.save();

    // Return the updated post object to the frontend
    return res.status(200).json(post.toObject({ getters: true, virtuals: true }));

  } catch (error) {
    console.error('Error processing vote:', error);
    return res.status(500).json({ success: false, message: 'Failed to process vote.' });
  }
}
