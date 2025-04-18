import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { validateUser } from "./lib/AuthActions";

export const { auth, handlers, signIn, signOut} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials;
          const user = await validateUser(email, password);
          if (!user) {
            return null;
          }
          return user;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user){
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
});