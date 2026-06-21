"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { useClipboard } from "@/hooks/useClipboard";
import { usePromptStore } from "@/store/promptStore";
import { EXPERIENCE_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, Copy, Check, Heart, HeartBreak, BookmarkSimple, Share, ThumbsUp, MagicWand } from "@phosphor-icons/react";

interface PromptDetail {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  level: string;
  tags: string | string[];
  usageCount: number;
  author?: { id: string; name: string; image?: string } | null;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function PromptDetailPage({ params }: Props) {
  const { id } = use(params);
  const { copy, copied } = useClipboard();
  const { addToSaved, removeFromSaved, isSaved } = usePromptStore();
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryPrompts, setCategoryPrompts] = useState<PromptDetail[]>([]);

  useEffect(() => {
    const fetchPrompt = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) throw new Error("غير موجود");
        const json = await res.json();
        const data = json.success ? json.data : json;
        setPrompt(data);
        setSaved(isSaved(data.id));

        const catRes = await fetch(`/api/prompts?categoryId=${data.categoryId}&limit=4`);
        if (catRes.ok) {
          const catJson = await catRes.json();
          const related = (catJson.data?.prompts ?? []).filter((p: PromptDetail) => p.id !== data.id).slice(0, 3);
          setCategoryPrompts(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "فشل التحميل");
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id, isSaved]);

  if (loading) {
    return (
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 rounded bg-surface-elevated" />
            <div className="h-8 w-3/4 rounded bg-surface-elevated" />
            <div className="h-64 rounded-2xl bg-surface-elevated" />
          </div>
        </div>
      </main>
    );
  }

  if (!prompt || error) notFound();

  const promptTags = (() => {
    if (Array.isArray(prompt.tags)) return prompt.tags;
    try { return JSON.parse(prompt.tags as string); } catch { return []; }
  })();

  const levelLabel = EXPERIENCE_LEVELS.find((l) => l.id === prompt.level)?.label ?? prompt.level;

  const handleCopy = async () => {
    await copy(prompt.content);
    showToast("تم النسخ!");
  };

  const handleSave = () => {
    if (saved) {
      removeFromSaved(prompt.id);
      setSaved(false);
      showToast("تمت الإزالة", "info");
    } else {
      addToSaved({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        tips: [],
        categoryId: prompt.categoryId,
        createdAt: new Date(),
      });
      setSaved(true);
      showToast("تم الحفظ!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: prompt.title, text: prompt.content, url: window.location.href });
    } else {
      await copy(window.location.href);
      showToast("تم نسخ الرابط!");
    }
  };

  const handleLike = () => {
    fetch(`/api/community/${prompt.id}/like`, { method: "POST" }).catch(() => {});
  };

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={`/category/${prompt.categoryId}`}
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4"
          >
            <ArrowRight weight="bold" className="size-3" />
            العودة للتصنيف
          </Link>

          <div className="rounded-2xl border border-border-light bg-surface-secondary p-5 sm:p-6 mb-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">{prompt.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-accent font-medium bg-accent/10 px-2 py-0.5 rounded-md">{levelLabel}</span>
                  {promptTags.map((tag: string) => (
                    <span key={tag} className="text-[11px] text-text-muted bg-surface-elevated px-2 py-0.5 rounded-md">#{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSave}
                className={cn(
                  "shrink-0 size-9 rounded-xl border transition-all flex items-center justify-center",
                  saved
                    ? "bg-danger/10 border-danger/20 text-danger"
                    : "border-border-light text-text-muted hover:text-text-secondary hover:bg-surface-elevated"
                )}
              >
                {saved ? <HeartBreak weight="fill" className="size-4" /> : <Heart weight="bold" className="size-4" />}
              </button>
            </div>

            <div className="bg-surface rounded-xl p-4 mb-5 border border-border-light">
              <div className="relative max-h-80 overflow-y-auto">
                <pre className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono whitespace-pre-wrap rtl:text-right ltr:text-left">
                  {prompt.content}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={handleCopy} icon={copied ? <Check weight="bold" className="size-3.5" /> : <Copy weight="bold" className="size-3.5" />}>
                {copied ? "تم النسخ" : "نسخ"}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleSave} icon={<BookmarkSimple weight="bold" className="size-3.5" />}>
                {saved ? "إزالة" : "حفظ"}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleShare} icon={<Share weight="bold" className="size-3.5" />}>
                مشاركة
              </Button>

              <Link href={`/export/${prompt.id}`}>
                <Button size="sm" variant="ghost" icon={<ArrowRight weight="bold" className="size-3.5" />}>
                  تصدير
                </Button>
              </Link>

              <Link href={`/category/${prompt.categoryId}`}>
                <Button size="sm" icon={<MagicWand weight="fill" className="size-3.5" />}>
                  استخدم البرومت
                </Button>
              </Link>

              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all mr-auto",
                  "text-text-muted hover:text-text-secondary hover:bg-surface-elevated"
                )}
              >
                <ThumbsUp weight="bold" className="size-3.5" />
                إعجاب
              </button>
            </div>
          </div>

          {categoryPrompts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-text-primary mb-3">برومتات مقترحة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryPrompts.map((rp, i) => (
                  <PromptCard key={rp.id} prompt={{ ...rp, author: rp.author ?? undefined }} index={i} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
