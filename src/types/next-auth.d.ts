import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      dailyGenLimit: number;
      dailyGenCount: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    dailyGenLimit?: number;
    dailyGenCount?: number;
    dailyGenDate?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    dailyGenLimit: number;
    dailyGenCount: number;
    dailyGenDate?: string | null;
  }
}
