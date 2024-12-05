import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // async authorize(credentials) {
      async authorize(credentials) {
        // Replace this with real user authentication
        const user = {
          id: "1",
          name: "Psychologist",
          email: "psychologist@example.com",
        };
        console.log({credentials})
        return user;
        // if (
        //   credentials?.username === "user" &&
        //   credentials?.password === "password"
        // ) {
        //   return user;
        // }
        // return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Use a strong secret in production
});