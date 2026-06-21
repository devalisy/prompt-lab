"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";
import { ArrowRight, Copy, Check, Download, FileText, FileCode, FileJs } from "@phosphor-icons/react";

interface PromptData {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  level: string;
  tags: string | string[];
}

interface Props {
  params: Promise<{ id: string }>;
}

type Format = "txt" | "markdown" | "json";

const FORMATS: { id: Format; label: string; icon: React.ReactNode }[] = [
  { id: "txt", label: "نص عادي", icon: <FileText weight="bold" className="size-4" /> },
  { id: "markdown", label: "Markdown", icon: <FileCode weight="bold" className="size-4" /> },
  { id: "json", label: "JSON", icon: <FileJs weight="bold" className="size-4" /> },
];

export default function ExportPage({ params }: Props) {
  const { id } = use(params);
  const { copy, copied } = useClipboard();
  const [format, setFormat] = useState<Format>("txt");
  const [prompt, setPrompt] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prompts/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        const data = json?.success ? json.data : json;
        setPrompt(data ?? null);
      })
      .catch(() => setPrompt(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="pt-24 pb-16 min-h-screen"><div className="max-w-3xl mx-auto px-4"><div className="animate-pulse space-y-4"><div className="h-4 w-24 rounded bg-surface-elevated" /><div className="h-8 w-1/2 rounded bg-surface-elevated" /><div className="h-64 rounded-2xl bg-surface-elevated" /></div></div></main>;

  if (!prompt) notFound();

  const getTags = () => {
    if (Array.isArray(prompt.tags)) return prompt.tags;
    try { return JSON.parse(prompt.tags as string); } catch { return []; }
  };

  const getExportContent = (fmt: Format): string => {
    const tags = getTags();
    switch (fmt) {
      case "txt":
        return `${prompt.title}\n${"=".repeat(prompt.title.length)}\n\n${prompt.content}\n\n—\nالمستوى: ${prompt.level}\nالوسوم: ${tags.join(", ")}`;
      case "markdown":
        return `# ${prompt.title}\n\n${prompt.content}\n\n---\n*المستوى: ${prompt.level}*  \n*الوسوم: ${tags.join("، ")}*`;
      case "json":
        return JSON.stringify({ id: prompt.id, title: prompt.title, content: prompt.content, level: prompt.level, tags, categoryId: prompt.categoryId }, null, 2);
    }
  };

  const exportContent = getExportContent(format);

  const handleCopy = async () => {
    await copy(exportContent);
    showToast("تم النسخ!");
  };

  const handleDownload = () => {
    const ext = format === "markdown" ? "md" : format;
    const blob = new Blob([exportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("تم التحميل!");
  };

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={`/prompt/${prompt.id}`}
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4"
          >
            <ArrowRight weight="bold" className="size-3" />
            العودة للبرومت
          </Link>

          <div className="rounded-2xl border border-border-light bg-surface-secondary p-5 sm:p-6 mb-6">
            <h1 className="text-xl font-bold text-text-primary mb-1">تصدير البرومت</h1>
            <p className="text-sm text-text-secondary mb-5">{prompt.title}</p>

            <div className="flex gap-1 mb-5 p-0.5 rounded-xl bg-surface border border-border-light">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    format === f.id
                      ? "bg-surface-elevated text-text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border-light mb-5">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap rtl:text-right ltr:text-left max-h-96 overflow-y-auto text-text-secondary font-mono">
                {exportContent}
              </pre>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={handleCopy} icon={copied ? <Check weight="bold" className="size-3.5" /> : <Copy weight="bold" className="size-3.5" />}>
                {copied ? "تم النسخ" : "نسخ"}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleDownload} icon={<Download weight="bold" className="size-3.5" />}>
                تحميل
              </Button>
              <Link href={`/prompt/${prompt.id}`}>
                <Button size="sm" variant="ghost">
                  إلغاء
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
