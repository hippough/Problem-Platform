import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/db"

import { DefaultSession } from "next-auth";


declare module "next-auth" {
  interface User {
      // Add your additional properties here:
      role: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
      // Add your additional properties here:
      role: string;
  }
}

declare module 'next-auth' {
  interface Session {
      user?: {
        role: string;
      } & DefaultSession["user"];
  }

}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        authorization: {
            params: {
              prompt: "consent",
              access_type: "offline", // Request refresh token
              response_type: "code", // Use authorization code flow
            },
        },
        allowDangerousEmailAccountLinking: true
    })
  ],
  pages: {
    signIn: "/sign-in",
  },

  callbacks: {

    async signIn({ user }) {
      // Assuming user creation occurs here or after signIn
      if (user) {
        try {
          
          const users = client.db().collection('users');

          // Check if the user already exists
          const existingUser = await users.findOne({ email: user.email });

          if (existingUser) {
            // Add or update the role if it doesn't exist
            await users.updateOne(
              { email: user.email },
              { $set: { role: existingUser.role || 'user' } }
            );
          } else {
            const newUser = {
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: null,
              role: 'user' // Default role
            };

            await users.insertOne(newUser);
          }
        } catch (error) {
          console.error('Error updating user with role:', error);
        }
      }

      return true; // Continue the sign-in process
    },

    
    session({ session, user }) {
      session.user.role = user.role
      return session
    }
      
  }
})



