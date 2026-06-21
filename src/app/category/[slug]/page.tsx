"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { categories } from "@/data/categories";
import { PromptCard } from "@/components/prompt/PromptCard";
import { PromptGeneratorStep } from "@/components/prompt/PromptGeneratorStep";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react";

interface BrowsePrompt {
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
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const category = categories.find((c) => c.id === slug);
  if (!category) notFound();

  const [tab, setTab] = useState<"generator" | "browse">("generator");
  const [prompts, setPrompts] = useState<BrowsePrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/prompts?categoryId=${slug}`);
        if (res.ok) {
          const json = await res.json();
          setPrompts(json.data?.prompts ?? []);
          return;
        }
      } catch {
        setError("فشل الاتصال بالخادم");
      }
      setPrompts([]);
    };
    fetchData().finally(() => setLoading(false));
  }, [slug]);

  const categoryPrompts = prompts;

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors shrink-0"
            >
              <ArrowRight weight="bold" className="size-3" />
              الرئيسية
            </Link>
            <span className="text-text-muted text-[10px]">/</span>
            <h1 className="text-sm font-semibold text-text-primary break-words">{category.name}</h1>
          </div>

          <p className="text-xs text-text-secondary mb-4 max-w-lg leading-relaxed">{category.description}</p>

          <div className="grid grid-cols-2 gap-1 mb-6 p-0.5 rounded-xl bg-surface-secondary border border-border-light">
            <button
              onClick={() => setTab("generator")}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-medium transition-all text-center",
                tab === "generator"
                  ? "bg-surface-elevated text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              مولد البرومتات
            </button>
            <button
              onClick={() => setTab("browse")}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-medium transition-all text-center",
                tab === "browse"
                  ? "bg-surface-elevated text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              برومتات جاهزة
              <span className="text-[10px] text-text-muted">({categoryPrompts.length})</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === "generator" ? (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <PromptGeneratorStep categoryId={slug} categoryName={category.name} />
            </motion.div>
          ) : (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border-light bg-surface-secondary p-3.5 space-y-3 animate-pulse">
                      <div className="h-4 w-3/4 rounded bg-surface-elevated" />
                      <div className="h-3 w-1/2 rounded bg-surface-elevated" />
                      <div className="h-3 w-full rounded bg-surface-elevated" />
                      <div className="h-3 w-2/3 rounded bg-surface-elevated" />
                    </div>
                  ))}
                </div>
              ) : error && categoryPrompts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-danger mb-2">حدث خطأ أثناء تحميل البيانات</p>
                  <p className="text-xs text-text-muted">{error}</p>
                </div>
              ) : categoryPrompts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryPrompts.map((prompt, i) => (
                    <PromptCard key={prompt.id} prompt={prompt} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-text-secondary">لا توجد برومتات جاهزة بعد</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
