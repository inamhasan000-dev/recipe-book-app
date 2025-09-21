// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Firebase',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          // Refresh user to get latest emailVerified status
          await user.reload();

          if (!user.emailVerified) {
            throw new Error('Email not verified');
          }

          return {
            id: user.uid,
            name: user.displayName || 'No Name',
            email: user.email,
          };
        } catch (err) {
          console.error('Firebase login failed:', err.message);
          // Let NextAuth send the error to the frontend
          throw new Error(err.message || 'Login failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.uid = token.uid;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});
