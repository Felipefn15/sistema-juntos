import NextAuth from "next-auth";
import { Psicologa } from "./types";

declare module "next-auth" {
  interface User {
    psicologaId?: string;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      psicologa?: Psicologa | null;
    };
  }
}
