// pages/api/posts/[id]/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '../../../../lib/dbConnect';
import Post from '../../../../models/Post';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const { id } = req.query; // Get the post ID from the URL parameter

  if (!id) {
    return res.status(400).json({ success: false, message: 'Post ID is required.' });
  }

  // Helper function to check ownership
  const checkOwnership = async (post) => {
    if (!post) return false;
    return post.uploadedBy === session.user.email;
  };

  switch (req.method) {
    case 'GET':
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found.' });
        }
        return res.status(200).json(post.toObject({ getters: true, virtuals: true }));
      } catch (error) {
        console.error('Error fetching single post:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch post.' });
      }

    case 'PUT':
      const { headline, description } = req.body;

      if (!headline || !description || typeof headline !== 'string' || typeof description !== 'string') {
        return res.status(400).json({ success: false, message: 'Headline and description are required and must be strings.' });
      }

      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found.' });
        }

        if (!await checkOwnership(post)) {
          return res.status(403).json({ success: false, message: 'You are not authorized to edit this post.' });
        }

        // Update fields
        post.headline = headline;
        post.description = description;

        // Optionally, you might want to re-calculate the mlScore here
        // by calling the /api/score-content endpoint again.
        // For simplicity, we are not re-scoring upon edit in this example.
        // If you want to re-score:
        /*
        const scoreResponse = await fetch(`${req.headers.origin}/api/score-content`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ headline, description }),
        });
        const scoreData = await scoreResponse.json();
        if (scoreData.success) {
            post.mlScore = scoreData.credibilityScore;
        } else {
            console.warn('Could not re-score post after edit:', scoreData.message);
        }
        */

        await post.save();

        return res.status(200).json({ success: true, message: 'Post updated successfully.', post: post.toObject({ getters: true, virtuals: true }) });
      } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ success: false, message: 'Failed to update post.' });
      }

    case 'DELETE':
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found.' });
        }

        if (!await checkOwnership(post)) {
          return res.status(403).json({ success: false, message: 'You are not authorized to delete this post.' });
        }

        await Post.deleteOne({ _id: id }); // Use deleteOne for clarity

        return res.status(200).json({ success: true, message: 'Post deleted successfully.' });
      } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete post.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
