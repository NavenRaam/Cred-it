// pages/api/posts/me.js
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // This route should only handle GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const userEmail = session.user.email; // Get the user's email from the session

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email not found in session.' });
    }

    // Find posts where the 'uploadedBy' field matches the current user's email
    // Sort by creation date in descending order (newest first)
    const myPosts = await Post.find({ uploadedBy: userEmail }).sort({ createdAt: -1 });

    // Return the posts, ensuring they are plain objects
    return res.status(200).json(myPosts.map(post => post.toObject({ getters: true, virtuals: true })));

  } catch (error) {
    console.error('Error fetching user-specific posts from MongoDB:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch your posts.' });
  }
}
