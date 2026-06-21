"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { showToast } from "@/components/ui/Toast";
import { usePromptStore } from "@/store/promptStore";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { Sparkle, Lightning, FloppyDisk, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export default function NewSkillPage() {
  const router = useRouter();
  const { user } = usePromptStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [variablesStr, setVariablesStr] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "marketing");
  const [tagsStr, setTagsStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [goal, setGoal] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const handleGenerate = async () => {
    if (!goal.trim()) { showToast("اكتب هدف المهارة أولاً", "info"); return; }
    setGenerating(true);
    try {
      const res = await fetch("/api/skills/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal.trim(),
          categoryId,
          categoryName: categories.find((c) => c.id === categoryId)?.name ?? "",
          categoryCustom: customCategory.trim(),
          keywords: tagsStr,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "فشل التوليد");
      setTitle(json.data.title ?? "");
      setDescription(json.data.description ?? "");
      setSystemPrompt(json.data.systemPrompt ?? "");
      setVariablesStr(Array.isArray(json.data.variables) ? json.data.variables.join(", ") : "");
      setExampleInput(json.data.exampleInput ?? "");
      showToast("تم توليد المهارة!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "فشل التوليد", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !systemPrompt.trim()) { showToast("اكتب اسم المهارة والتعليمات", "info"); return; }
    if (!user) { showToast("سجّل الدخول أولاً", "error"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || title.trim(),
          systemPrompt: systemPrompt.trim(),
          variables: JSON.stringify(variablesStr.split(",").map((v) => v.trim()).filter(Boolean)),
          exampleInput: exampleInput.trim() || undefined,
          tags: JSON.stringify(tagsStr.split(",").map((t) => t.trim()).filter(Boolean)),
          categoryId,
          isPublic: true,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "فشل الحفظ");
      showToast("تم نشر المهارة!");
      router.push(`/skills/${json.data.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "فشل الحفظ", "error");
    } finally {
      setSubmitting(false);
    }
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
            href="/skills"
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4"
          >
            <ArrowRight weight="bold" className="size-3" />
            العودة للمهارات
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="size-9 rounded-xl bg-accent/15 flex items-center justify-center">
              <Lightning weight="fill" className="size-4 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">مهارة جديدة</h1>
              <p className="text-sm text-text-secondary">صمم مهارة لوكيل AI أو استخدم الذكاء الاصطناعي لتوليدها</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border-light bg-surface-secondary p-5 mb-6">
            <h2 className="text-xs font-semibold text-text-primary mb-3 flex items-center gap-1.5">
              <Sparkle weight="fill" className="size-3.5 text-accent" />
              توليد بالذكاء الاصطناعي
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="مثلاً: وكيل تسويق متخصص في السوشيال ميديا..."
                className="flex-1 h-9 px-3 rounded-xl border border-border-light bg-surface text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors"
              />
              <Button size="sm" onClick={handleGenerate} loading={generating} icon={<Sparkle weight="fill" className="size-3.5" />}>
                توليد
              </Button>
            </div>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="تصنيف مخصص (اختياري)..."
              className="mt-2 w-full h-9 px-3 rounded-xl border border-border-light bg-surface text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">التصنيف</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border-light bg-surface text-xs text-text-primary outline-none focus:border-accent/40 transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="وسوم (مفصولة بفواصل)"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="تسويق، سوشيال ميديا..."
              />
            </div>

            <Input
              label="اسم المهارة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="وكيل تسويق متقدم"
            />

            <Input
              label="وصف المهارة"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وكيل AI متخصص في إنشاء حملات تسويقية متكاملة"
            />

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">تعليمات النظام (System Prompt)</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={8}
                className="w-full px-3 py-2.5 rounded-xl border border-border-light bg-surface text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors font-mono resize-y"
                placeholder="أنت وكيل متخصص في... اكتب تعليماتك هنا..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="المتغيرات (مفصولة بفواصل)"
                value={variablesStr}
                onChange={(e) => setVariablesStr(e.target.value)}
                placeholder="المنتج، الجمهور، المنصة"
              />
              <Input
                label="مثال استخدام"
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                placeholder="استخدم المهارة مع منتج {المنتج}..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handleSubmit} loading={submitting} icon={<FloppyDisk weight="bold" className="size-4" />}>
                نشر المهارة
              </Button>
              <Link href="/skills">
                <Button variant="ghost">إلغاء</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
