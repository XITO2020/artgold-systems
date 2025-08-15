// frontend/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    isAdmin?: boolean;
  }

  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      isAdmin?: boolean;
    };
  }
}
