import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      // The `token.id` is passed from the `jwt` callback
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    jwt({ token, user }) {
      // The `user.id` is passed from the provider on initial sign-in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};