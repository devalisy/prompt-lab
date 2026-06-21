"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getPromptTypesByCategory, type PromptType } from "@/data/prompt-types";
import { PROMPT_STYLES } from "@/lib/constants";
import { PromptResult } from "./PromptResult";
import { PromptAnalyzer } from "./PromptAnalyzer";
import { usePromptStore } from "@/store/promptStore";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { MagicWand, CaretLeft } from "@phosphor-icons/react";
import { showToast } from "@/components/ui/Toast";

interface GeneratedResult {
  id: string;
  title: string;
  content: string;
  tips: string[];
  categoryId: string;
  createdAt: Date;
}

interface Props {
  categoryId: string;
  categoryName: string;
}

export function PromptGeneratorStep({ categoryId, categoryName }: Props) {
  const [step, setStep] = useState<"type" | "form" | "result">("type");
  const [selectedType, setSelectedType] = useState<PromptType | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addToHistory = usePromptStore((s) => s.addToHistory);

  const [goal, setGoal] = useState("");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState<"short" | "detailed" | "creative">("detailed");
  const [audience, setAudience] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [enhancerReady, setEnhancerReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { initLocalAI } = await import("@/lib/client-ai");
        if (!mounted) return;
        const ready = await initLocalAI();
        if (mounted) setEnhancerReady(ready);
      } catch {
        if (mounted) setEnhancerReady(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleEnhance = async () => {
    if (!result) return;
    setEnhancing(true);
    try {
      const { enhanceWithLocalAI } = await import("@/lib/client-ai");
      const enhanced = await enhanceWithLocalAI(result.content, style);
      if (enhanced !== result.content) {
        setResult({ ...result, content: enhanced });
        showToast("تم تحسين البرومت!");
      } else {
        showToast("النموذج غير جاهز بعد، استخدم القوالب", "info");
      }
    } catch {
      showToast("تعذر تحسين البرومت", "error");
    } finally {
      setEnhancing(false);
    }
  };

  const types = getPromptTypesByCategory(categoryId);

  const handleSelectType = (pt: PromptType) => {
    setSelectedType(pt);
    setStep("form");
  };

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError("يرجى كتابة هدف البرومت");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          categoryName,
          goal: `${selectedType?.name ?? ""}: ${goal.trim()}`,
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
          style,
          audience: audience.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "فشل التوليد");
      }
      const generated: GeneratedResult = {
        ...json.data,
        createdAt: new Date(json.data.createdAt),
      };
      setResult(generated);
      addToHistory(generated);
      setStep("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("type");
    setSelectedType(null);
    setResult(null);
    setGoal("");
    setKeywords("");
    setStyle("detailed");
    setAudience("");
    setError(null);
  };

  const renderProgress = () => (
    <div className="flex items-center gap-2 mb-5">
      {[
        { id: "type" as const, label: "اختيار النوع" },
        { id: "form" as const, label: "التفاصيل" },
        { id: "result" as const, label: "النتيجة" },
      ].map((s, i) => (
        <div key={s.id} className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-[11px] transition-colors",
              step === s.id
                ? "text-accent font-semibold"
                : ["result", "form"].includes(step) && (s.id === "type" || (s.id === "form" && step === "result"))
                ? "text-accent/60"
                : "text-text-muted"
            )}
          >
            {s.label}
          </span>
          {i < 2 && <span className="text-text-muted/30 text-[10px]">/</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-xl border border-border-light bg-surface-secondary overflow-hidden">
      <div className="px-4 py-3 bg-surface-secondary/50 border-b border-border-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-primary">مولد البرومتات</span>
        </div>
        {step !== "type" && (
          <button
            onClick={handleReset}
            className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
          >
            ابدأ من جديد
          </button>
        )}
      </div>

      <div className="p-4">
        {step !== "result" && renderProgress()}

        <AnimatePresence mode="wait">
          {step === "type" && (
            <motion.div
              key="type"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p className="text-xs text-text-secondary mb-3">اختر نوع البرومت الذي تريد إنشاءه:</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {types.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => handleSelectType(pt)}
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-surface-elevated hover:border-accent/30 hover:bg-accent/[0.02] transition-all text-right group"
                  >
                    <div className="size-9 rounded-lg bg-accent/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                      <pt.icon />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-text-primary mb-0.5">{pt.name}</div>
                      <div className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{pt.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              {types.length === 0 && (
                <p className="text-xs text-text-muted text-center py-6">لا توجد أنواع متاحة لهذا التصنيف بعد</p>
              )}
            </motion.div>
          )}

          {step === "form" && !loading && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {selectedType && (
                <div className="flex items-center gap-2 pb-3 mb-1 border-b border-border-light">
                  <span className="text-text-accent"><selectedType.icon /></span>
                  <div>
                    <div className="text-xs font-semibold text-text-primary">{selectedType.name}</div>
                    <div className="text-[10px] text-text-muted">{selectedType.description}</div>
                  </div>
                  <button onClick={() => setStep("type")} className="mr-auto text-text-muted hover:text-text-secondary transition-colors">
                    <CaretLeft weight="bold" className="size-4" />
                  </button>
                </div>
              )}

              <Textarea
                label="ما الهدف من البرومت؟"
                placeholder="مثال: أريد إطلاق منتج جديد في السوق"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-text-secondary">نمط البرومت</span>
                <div className="flex gap-x-2.5 gap-y-1 flex-wrap">
                  {PROMPT_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id as "short" | "detailed" | "creative")}
                      className={cn(
                        "text-[11px] font-medium transition-colors",
                        style === s.id
                          ? "text-accent"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="كلمات مفتاحية"
                  placeholder="مثال: مبتكر، سهل"
                  helperText="افصل بفاصلة"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <Input
                  label="الجمهور"
                  placeholder="مثال: مبتدئين"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              {error && <p className="text-xs text-danger">{error}</p>}

              <Button
                size="md"
                onClick={handleGenerate}
                className="w-full"
                icon={<MagicWand weight="fill" className="size-4" />}
              >
                توليد البرومت
              </Button>
            </motion.div>
          )}

          {loading && step === "form" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="relative mb-6">
                <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center animate-breathe">
                  <div className="size-7 text-accent animate-spin-slow rounded-full border-2 border-accent border-t-transparent" />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-text-primary mb-1.5">جاري توليد البرومت</h3>
              <p className="text-xs text-text-secondary text-center max-w-xs mb-5 leading-relaxed">
                الذكاء الاصطناعي يعمل على إنشاء برومت مخصص بناءً على مدخلاتك
              </p>

              <div className="flex items-center gap-1.5 mb-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="size-2 rounded-full bg-accent/60 animate-pulse-dot"
                  />
                ))}
              </div>

              <div className="w-48 h-1 rounded-full bg-surface-elevated overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <PromptResult prompt={result} onRegenerate={handleReset} onEnhance={handleEnhance} enhancing={enhancing} enhancerReady={enhancerReady} />
              <PromptAnalyzer content={result.content} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
