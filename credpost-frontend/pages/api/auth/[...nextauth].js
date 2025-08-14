import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb"; // This clientPromise is for the NextAuth adapter
import User from "../../../models/User"; // Mongoose User model
import bcrypt from 'bcrypt'; // Ensure bcrypt is imported
import dbConnect from '../../../lib/dbConnect'; // <--- RE-ADD THIS IMPORT

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect(); // <--- RE-ADD THIS CALL HERE

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Incorrect password.");
        }

        // Return minimal user data for the session token
        return { id: user._id.toString(), email: user.email }; // Convert _id to string
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise), // NextAuth's adapter uses this clientPromise
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);