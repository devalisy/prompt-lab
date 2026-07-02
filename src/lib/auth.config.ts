import type { NextAuthConfig } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id ?? "";
        token.role = user.role ?? "user";
        token.dailyGenLimit = user.dailyGenLimit ?? 5;
        token.dailyGenCount = user.dailyGenCount ?? 0;
        token.dailyGenDate = user.dailyGenDate ?? null;
      } else {
        // refresh daily count from DB on each JWT refresh
        try {
          const { prisma } = await import("@/lib/prisma");
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { dailyGenLimit: true, dailyGenCount: true, dailyGenDate: true },
          });
          if (dbUser) {
            token.dailyGenLimit = dbUser.dailyGenLimit;
            const today = new Date().toISOString().slice(0, 10);
            if (dbUser.dailyGenDate !== today) {
              token.dailyGenCount = 0;
            } else {
              token.dailyGenCount = dbUser.dailyGenCount;
            }
          }
        } catch {
          // keep existing token values
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "user";
        session.user.dailyGenLimit = token.dailyGenLimit ?? 5;
        session.user.dailyGenCount = token.dailyGenCount ?? 0;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;