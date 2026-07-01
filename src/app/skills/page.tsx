"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SkillCard } from "@/components/skill/SkillCard";
import { PromptDetailModal } from "@/components/prompt/PromptDetailModal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { Lightning, Plus, MagnifyingGlass, Users, Fire, Clock } from "@phosphor-icons/react";

interface SkillData {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
  categoryId: string;
  tags: string;
  author: { id: string; name: string; image?: string } | null;
  _count: { likes: number; savedBy: number };
  usageCount: number;
  createdAt: string;
}

type Tab = "all" | "popular" | "latest";

export default function SkillsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [viewingSkill, setViewingSkill] = useState<SkillData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sortParam = tab === "popular" ? "popular" : "latest";
        const res = await fetch(`/api/skills?sort=${sortParam}&limit=50`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data?.skills)) {
            setSkills(json.data.skills);
            const counts: Record<string, number> = {};
            json.data.skills.forEach((s: SkillData) => { counts[s.id] = s._count?.likes ?? 0; });
            setLikeCounts(counts);
          }
        }
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [tab]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        showToast("تم حذف المهارة");
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
      if (next.has(id)) { next.delete(id); setLikeCounts((c) => ({ ...c, [id]: (c[id] ?? 0) - 1 })); }
      else { next.add(id); setLikeCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })); }
      return next;
    });
  };

  const sorted = tab === "popular"
    ? [...skills].sort((a, b) => (likeCounts[b.id] ?? 0) - (likeCounts[a.id] ?? 0))
    : skills;

  const displayed = sorted.map((s) => ({
    ...s,
    likes: likeCounts[s.id] ?? s._count?.likes ?? 0,
    isLiked: liked.has(s.id),
  }));

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "الكل", icon: <Lightning weight="bold" className="size-3.5" /> },
    { id: "popular", label: "الأكثر إعجاباً", icon: <Fire weight="bold" className="size-3.5" /> },
    { id: "latest", label: "الأحدث", icon: <Clock weight="bold" className="size-3.5" /> },
  ];

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-accent/15 flex items-center justify-center">
                <Lightning weight="fill" className="size-4 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">مهارات الوكلاء</h1>
                <p className="text-sm text-text-secondary">مهارات جاهزة لوكلاء AI</p>
              </div>
            </div>
            <Link href="/skills/new">
              <Button size="sm" icon={<Plus weight="bold" className="size-4" />}>
                مهارة جديدة
              </Button>
            </Link>
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
                <div className="h-4 w-3/4 rounded bg-surface-elevated" />
                <div className="h-3 w-full rounded bg-surface-elevated" />
                <div className="h-3 w-1/2 rounded bg-surface-elevated" />
              </div>
            ))}
          </div>
        ) : displayed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayed.map((skill, i) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={i}
                onLike={handleLike}
                isLiked={liked.has(skill.id)}
                onView={(s) => setViewingSkill(s)}
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
            <h2 className="text-xl font-semibold text-text-primary mb-2">لا توجد مهارات بعد</h2>
            <p className="text-sm text-text-secondary mb-4">كن أول من ينشر مهارة</p>
            <Link href="/skills/new">
              <Button icon={<Plus weight="bold" className="size-4" />}>
                إنشاء مهارة
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      <PromptDetailModal
        prompt={viewingSkill ? {
          id: viewingSkill.id,
          title: viewingSkill.title,
          content: viewingSkill.systemPrompt,
          categoryId: viewingSkill.categoryId,
          author: viewingSkill.author,
        } : null}
        onClose={() => setViewingSkill(null)}
      />
    </main>
  );
}
