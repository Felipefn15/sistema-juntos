import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    psicologaId?: string;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      psicologa?: {
        id: string;
        nome: string;
        email: string;
        documento: string;
        contato: string;
      };
    };
  }
}
