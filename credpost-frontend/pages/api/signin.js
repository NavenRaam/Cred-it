import { signIn } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      // Call the signIn function from NextAuth.js.
      // This will trigger the `authorize` function in your `[...nextauth].js` file
      // to handle the database lookup and password comparison.
      const result = await signIn('credentials', {
        redirect: false, // Prevents automatic redirection from the API route
        email: email,
        password: password,
      });

      console.log('Sign-in result:', result);

      if (result.error) {
        // If authentication failed, the result object will contain an error
        return res.status(401).json({ success: false, message: result.error });
      }

      // If authentication was successful, result.error will be null
      return res.status(200).json({ success: true, message: 'Sign-in successful' });
      
    } catch (error) {
      // Catch any unexpected errors during the process
      return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}