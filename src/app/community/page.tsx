"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { PromptCard } from "@/components/prompt/PromptCard";
import { PromptDetailModal } from "@/components/prompt/PromptDetailModal";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { Users, Fire, Clock, MagnifyingGlass } from "@phosphor-icons/react";

interface CommunityPrompt {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  level: string;
  tags: string;
  author: { id: string; name: string; image?: string } | null;
  _count: { likes: number; savedBy: number; comments: number };
  createdAt: string;
}

type Tab = "all" | "popular" | "latest";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "الكل", icon: <Users weight="bold" className="size-3.5" /> },
  { id: "popular", label: "الأكثر إعجاباً", icon: <Fire weight="bold" className="size-3.5" /> },
  { id: "latest", label: "الأحدث", icon: <Clock weight="bold" className="size-3.5" /> },
];

export default function CommunityPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("all");
  const [prompts, setPrompts] = useState<CommunityPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [viewingPrompt, setViewingPrompt] = useState<CommunityPrompt | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortParam = tab === "popular" ? "popular" : "latest";
        const res = await fetch(`/api/community?sort=${sortParam}&limit=50`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data?.prompts)) {
            setPrompts(json.data.prompts);
            const counts: Record<string, number> = {};
            json.data.prompts.forEach((p: CommunityPrompt) => { counts[p.id] = p._count?.likes ?? 0; });
            setLikeCounts(counts);
            return;
          }
        }
      } catch {}
      setPrompts([]);
    };
    fetchData().finally(() => setLoading(false));
  }, [tab]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrompts((prev) => prev.filter((p) => p.id !== id));
        showToast("تم حذف البرومت");
      } else {
        const d = await res.json();
        showToast(d.error || "فشل الحذف", "error");
      }
    } catch {
      showToast("خطأ في الاتصال", "error");
    }
  }, []);

  const handleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setLikeCounts((c) => ({ ...c, [id]: (c[id] ?? 0) - 1 }));
      } else {
        next.add(id);
        setLikeCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
      }
      return next;
    });
    fetch(`/api/community/${id}/like`, { method: "POST" }).catch(() => {});
  };

  const displayed = prompts.map((p) => ({
    ...p,
    likes: likeCounts[p.id] ?? p._count?.likes ?? 0,
    usageCount: p._count?.savedBy ?? 0,
    isLiked: liked.has(p.id),
  }));

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="size-9 rounded-xl bg-accent/15 flex items-center justify-center">
              <Users weight="fill" className="size-4 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">المجتمع</h1>
              <p className="text-sm text-text-secondary">برومتات مقدمة من المستخدمين</p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-1 mb-6 p-0.5 rounded-xl bg-surface-secondary border border-border-light overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                tab === t.id
                  ? "bg-surface-elevated text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border-light bg-surface-secondary p-3.5 space-y-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-surface-elevated" />
                  <div className="h-3 w-24 rounded bg-surface-elevated" />
                </div>
                <div className="h-4 w-3/4 rounded bg-surface-elevated" />
                <div className="h-3 w-full rounded bg-surface-elevated" />
                <div className="h-3 w-1/2 rounded bg-surface-elevated" />
              </div>
            ))}
          </div>
        ) : displayed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayed.map((prompt, i) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                index={i}
                onLike={handleLike}
                isLiked={liked.has(prompt.id)}
                onView={(p) => setViewingPrompt(p)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="size-16 rounded-2xl bg-surface-elevated flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlass weight="thin" className="size-8 text-text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">لا توجد برومتات</h2>
            <p className="text-sm text-text-secondary">لم يتم مشاركة أي برومت بعد</p>
          </motion.div>
        )}
      </div>

      <PromptDetailModal prompt={viewingPrompt} onClose={() => setViewingPrompt(null)} />
    </main>
  );
}
