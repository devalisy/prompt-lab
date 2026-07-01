"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const publicPaths = ["/", "/login", "/register"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Let public paths, dashboard, and admin through (middleware handles admin)
  if (publicPaths.includes(pathname) || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
