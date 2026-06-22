"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSession, signOut } from "next-auth/react";
import { categories } from "@/data/categories";
import { usePromptStore } from "@/store/promptStore";
import { useTheme } from "@/hooks/useTheme";
import { Quotes, BookmarkSimple, Sun, Moon, List, X, CaretDown, Gauge, SignOut as SignOutIcon, UserCircle, Shield, ArrowLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const { theme, toggle, mounted } = useTheme();
  const { data: session } = useSession();
  const savedCount = usePromptStore((s) => s.savedPrompts.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isCategory = pathname === "/categories" || categories.some((c) => pathname === `/category/${c.id}`);
  const user = session?.user;

  useEffect(() => {
    const store = usePromptStore.getState();
    if (user) {
      store.setUser({
        id: (user as { id?: string }).id ?? "",
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? undefined,
        role: ((user as { role?: string }).role === "admin" ? "admin" : "user"),
      });
      if (user.email) store.syncSavedFromAPI();
    } else {
      store.setUser(null);
    }
  }, [user?.id, user?.email, user]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-3 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl mx-3">
        <div className="relative rounded-2xl border border-border/60 bg-surface/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between h-12 px-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="size-7 rounded-lg bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                <Quotes weight="fill" className="size-3.5 text-accent" />
              </div>
              <span className="font-bold text-sm text-text-primary">{SITE_NAME}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5 mx-2">
              <Link
                href="/"
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isHome ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                الرئيسية
              </Link>

              <Link
                href="/community"
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  pathname === "/community" ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                المجتمع
              </Link>

              <Link
                href="/skills"
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  pathname.startsWith("/skills") ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                المهارات
              </Link>

              <div className="relative">
                <div className="flex items-center gap-0">
                  <Link
                    href="/categories"
                    className={cn(
                      "px-2.5 py-1.5 rounded-r-lg text-xs font-medium transition-colors",
                      pathname === "/categories" ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                    )}
                  >
                    التصنيفات
                  </Link>
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                    className={cn(
                      "flex items-center justify-center w-5 py-1.5 rounded-l-lg text-xs font-medium transition-colors",
                      isCategory ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                    )}
                  >
                    <CaretDown weight="bold" className={cn("size-2.5 transition-transform", categoriesOpen && "rotate-180")} />
                  </button>
                </div>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-1.5 right-0 w-56 rounded-xl bg-surface-secondary border border-border shadow-2xl overflow-hidden"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.id}`}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors",
                            pathname === `/category/${cat.id}`
                              ? "text-accent bg-accent/10"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                          )}
                        >
                          <span style={{ color: cat.color }}><cat.icon /></span>
                          <span className="font-medium">{cat.name}</span>
                          <span className="mr-auto text-[10px] text-text-muted">{cat.promptCount}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/saved"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors relative",
                  pathname === "/saved" ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                <BookmarkSimple weight="bold" className="size-3.5" />
                المحفوظات
                {savedCount > 0 && (
                  <span className="size-3.5 rounded-full bg-accent text-[8px] font-bold text-surface flex items-center justify-center">
                    {savedCount > 9 ? "9+" : savedCount}
                  </span>
                )}
              </Link>
            </nav>

            <div className="flex items-center gap-1">
              {mounted && (
                <button
                  onClick={toggle}
                  className="size-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all"
                  aria-label="تبديل الثيم"
                >
                  {theme === "dark" ? <Sun weight="bold" className="size-3.5" /> : <Moon weight="bold" className="size-3.5" />}
                </button>
              )}

              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                    className="size-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all"
                    aria-label="قائمة المستخدم"
                  >
                    <UserCircle weight="bold" className="size-4" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-1.5 left-0 w-44 rounded-xl bg-surface-secondary border border-border shadow-2xl overflow-hidden"
                      >
                        <div className="px-3 py-2 border-b border-border-light">
                          <p className="text-xs font-medium text-text-primary truncate">{user.name}</p>
                          <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                        >
                          <Gauge weight="bold" className="size-3.5" />
                          لوحة التحكم
                        </Link>
                        <Link
                          href="/saved"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                        >
                          <BookmarkSimple weight="bold" className="size-3.5" />
                          المحفوظات
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                          >
                            <Shield weight="bold" className="size-3.5" />
                            لوحة الإدارة
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-danger hover:bg-danger/10 transition-colors"
                        >
                          <SignOutIcon weight="bold" className="size-3.5" />
                          تسجيل خروج
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1">
                  <Link
                    href="/login"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                  >
                    دخول
                  </Link>
                  <Link
                    href="/register"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-accent text-surface hover:bg-accent/90 transition-colors"
                  >
                    تسجيل
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden size-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all"
              >
                {mobileOpen ? <X weight="bold" className="size-4" /> : <List weight="bold" className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            className="absolute top-full mt-2 inset-x-3 md:hidden max-w-5xl mx-auto pointer-events-auto"
          >
            <div className="rounded-2xl border border-border/60 bg-surface/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <nav className="p-2 space-y-0.5 max-h-[70vh] overflow-y-auto">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                    isHome ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                  )}
                >
                  الرئيسية
                </Link>

                <Link
                  href="/community"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                    pathname === "/community" ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                  )}
                >
                  المجتمع
                </Link>

                <Link
                  href="/skills"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                    pathname.startsWith("/skills") ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                  )}
                >
                  المهارات
                </Link>

                <div className="text-[10px] text-text-muted px-3 py-1.5 font-medium tracking-widest">التصنيفات</div>

                <Link
                  href="/categories"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-accent hover:bg-accent/5 transition-colors"
                >
                  عرض الكل
                  <ArrowLeft weight="bold" className="size-3" />
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors",
                      pathname === `/category/${cat.id}`
                        ? "text-accent bg-accent/10"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                    )}
                  >
                    <span style={{ color: cat.color }}><cat.icon /></span>
                    <span className="font-medium">{cat.name}</span>
                    <span className="mr-auto text-[10px] text-text-muted opacity-60">{cat.promptCount}</span>
                  </Link>
                ))}

                <div className="border-t border-border-light my-1" />

                <Link
                  href="/saved"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                    pathname === "/saved" ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                  )}
                >
                  <BookmarkSimple weight="bold" className="size-3.5" />
                  المحفوظات
                  {savedCount > 0 && (
                    <span className="size-4 rounded-full bg-accent text-[9px] font-bold text-surface flex items-center justify-center mr-auto">
                      {savedCount > 9 ? "9+" : savedCount}
                    </span>
                  )}
                </Link>

                {user && (
                  <>
                    <div className="border-t border-border-light my-1" />
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium text-text-primary truncate">{user.name}</p>
                      <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    >
                      <Gauge weight="bold" className="size-3.5" />
                      لوحة التحكم
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                      >
                        <Shield weight="bold" className="size-3.5" />
                        لوحة الإدارة
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
                    >
                      <SignOutIcon weight="bold" className="size-3.5" />
                      تسجيل خروج
                    </button>
                  </>
                )}

                {!user && (
                  <>
                    <div className="border-t border-border-light my-1" />
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    >
                      <UserCircle weight="bold" className="size-3.5" />
                      دخول
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                    >
                      تسجيل
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
