import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Handle GET request (Fetch all posts) - (unchanged)
  if (req.method === 'GET') {
    try {
      const posts = await Post.find({}).sort({ createdAt: -1 });
      return res.status(200).json(posts.map(post => post.toObject({ getters: true, virtuals: true })));
    } catch (error) {
      console.error('Error fetching posts from MongoDB:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch posts.' });
    }
  }

  // Handle POST request (Create a new post) - MODIFIED LOGIC
  if (req.method === 'POST') {
    // Expect headline, description, AND mlScore from the client
    const { headline, description, mlScore } = req.body; 

    if (!headline || !description || typeof headline !== 'string' || typeof description !== 'string') {
      return res.status(400).json({ success: false, message: 'Headline and description are required and must be strings.' });
    }

    // Validate mlScore: it should be a number between 0 and 1
    if (typeof mlScore !== 'number' || mlScore < 0 || mlScore > 1) {
      // It's good practice to have a default or throw an error if the score is missing/invalid
      // This indicates a problem in the client-side logic if mlScore is not sent correctly.
      console.warn('Invalid or missing mlScore received for new post, defaulting to 0.5.');
      // You might choose to throw an error here, or use a default as a fallback.
      // For now, let's proceed with a default if it's truly malformed.
      // Alternatively, you could return res.status(400) here if mlScore is mandatory.
    }

    try {
      const newPost = await Post.create({
        headline,
        description,
        mlScore: typeof mlScore === 'number' && mlScore >= 0 && mlScore <= 1 ? mlScore : 0.5, // Use received score or default
        uploadedBy: session.user.email,
        upvotes: [],
        downvotes: [],
        createdAt: new Date(),
      });

      return res.status(201).json({ 
        success: true, 
        message: 'Post created successfully!', 
        post: newPost.toObject({ getters: true, virtuals: true }),
      });
    } catch (error) {
      console.error('Error saving post to MongoDB:', error);
      return res.status(500).json({ success: false, message: 'Failed to create post.' });
    }
  }

  // If the method is not GET or POST
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
