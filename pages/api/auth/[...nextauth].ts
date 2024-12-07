import NextAuth, { Account, NextAuthOptions, Profile, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getPsicologaByEmail, updatePsicologa, insertPsicologa } from "@/utils/apiUtils";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      try {
        if (account?.provider === "google" && profile?.email) {
          const { email, name, image } = profile;

          const existingUser = await getPsicologaByEmail(email);

          if (existingUser) {
            console.log("Existing user found:", existingUser);
            await updatePsicologa(existingUser.id, name || "", image || "");
          } else {
            console.log("No existing user found. Creating a new one...");
            await insertPsicologa(email, name || "", image || "", user.id);
          }

          return true; // Allow sign-in
        }
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // Deny sign-in
      }

      console.log("SignIn callback returning false");
      return false;
    },
    async session({ session }: { session: Session; }) {
      // Fetch psicologa data using the email from the session
      if (session?.user?.email) {
        const psicologa = await getPsicologaByEmail(session.user.email);
        if (psicologa) {
          // Add psicologa data to the session
          session.user.psicologa = {
            ...psicologa,
          };
        }
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
