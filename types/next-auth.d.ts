import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      fontColor?: string | null;
      fontFamily?: string | null;
      isAdmin?: boolean;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name: string | null;
    fontColor?: string | null;
    fontFamily?: string | null;
    isAdmin?: boolean;
  }

  interface JWT {
    id: string;
    email: string;
    fontColor?: string | null;
    fontFamily?: string | null;
    isAdmin?: boolean;
  }
}