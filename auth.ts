import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Edge Runtime requires build-time constants
const AUTH_SECRET = process.env.AUTH_SECRET || "";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: AUTH_SECRET,
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
