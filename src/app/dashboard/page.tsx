"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { usePromptStore } from "@/store/promptStore";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Gauge, BookmarkSimple, ClockCounterClockwise, Trash, Eye, Quotes } from "@phosphor-icons/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { recentGenerations, savedPrompts, clearHistory, clearAll } = usePromptStore();

  if (!session?.user) {
    return (
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 text-center py-20">
          <div className="size-16 rounded-2xl bg-surface-elevated flex items-center justify-center mx-auto mb-4">
            <Gauge weight="thin" className="size-8 text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">يرجى تسجيل الدخول</h2>
          <p className="text-sm text-text-secondary mb-6">قم بتسجيل الدخول لعرض لوحة التحكم</p>
          <Link href="/login">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </main>
    );
  }

  const user = session.user;

  const uniqueGenCount = new Set(recentGenerations.map((g) => g.title)).size;

  const stats = [
    { label: "برومت منشأ", value: recentGenerations.length, icon: Quotes, color: "accent" },
    { label: "برومت محفوظ", value: savedPrompts.length, icon: BookmarkSimple, color: "accent-secondary" },
    { label: "أيام النشاط", value: Math.min(recentGenerations.length, 7) || 0, icon: Eye, color: "warning" },
    { label: "جلسات التوليد", value: uniqueGenCount, icon: ClockCounterClockwise, color: "danger" },
  ] as const;

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <Gauge weight="fill" className="size-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">لوحة التحكم</h1>
                <p className="text-sm text-text-secondary">مرحباً {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="danger" size="sm" onClick={() => { clearAll(); showToast("تم مسح الكل", "info"); }} icon={<Trash weight="bold" className="size-3.5" />}>
                مسح الكل
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-border-light bg-surface-secondary p-4 text-center"
            >
              <div
                className="size-8 rounded-lg flex items-center justify-center mx-auto mb-2.5"
                style={{ backgroundColor: `var(--color-${stat.color})` + "15" }}
              >
                <stat.icon weight="bold" className="size-4" style={{ color: `var(--color-${stat.color})` }} />
              </div>
              <div className="text-xl font-bold text-text-primary mb-0.5">{stat.value}</div>
              <div className="text-[11px] text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border-light bg-surface-secondary overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
              <h2 className="text-sm font-semibold text-text-primary">آخر التوليدات</h2>
              {recentGenerations.length > 0 && (
                <button
                  onClick={() => { clearHistory(); showToast("تم مسح التاريخ", "info"); }}
                  className="text-[11px] text-text-muted hover:text-danger transition-colors"
                >
                  مسح
                </button>
              )}
            </div>
            <div className="divide-y divide-border-light max-h-72 overflow-y-auto">
              {recentGenerations.length > 0 ? (
                recentGenerations.slice(0, 10).map((gen) => (
                  <div key={gen.id} className="px-4 py-2.5 hover:bg-surface-elevated/50 transition-colors">
                    <p className="text-xs font-medium text-text-primary truncate">{gen.title}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{gen.categoryId}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <ClockCounterClockwise weight="thin" className="size-8 text-text-muted mx-auto mb-2" />
                  <p className="text-xs text-text-secondary">لا توجد توليدات سابقة</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border-light bg-surface-secondary overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
              <h2 className="text-sm font-semibold text-text-primary">المحفوظات</h2>
              {savedPrompts.length > 0 && (
                <Link href="/saved" className="text-[11px] text-accent hover:text-accent/80 transition-colors">
                  عرض الكل
                </Link>
              )}
            </div>
            <div className="divide-y divide-border-light max-h-72 overflow-y-auto">
              {savedPrompts.length > 0 ? (
                savedPrompts.slice(0, 10).map((sp) => (
                  <div key={sp.id} className="px-4 py-2.5 hover:bg-surface-elevated/50 transition-colors">
                    <p className="text-xs font-medium text-text-primary truncate">{sp.title}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">تم الحفظ {new Date(sp.savedAt).toLocaleDateString("ar-SA")}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <BookmarkSimple weight="thin" className="size-8 text-text-muted mx-auto mb-2" />
                  <p className="text-xs text-text-secondary">لا توجد محفوظات</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
