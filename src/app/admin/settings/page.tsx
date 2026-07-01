"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { showToast } from "@/components/ui/Toast";

interface Provider {
  id: string;
  name: string;
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  createdAt: string;
}

const PROVIDER_TEMPLATES = [
  { name: "bynara", label: "Nara Router", baseUrl: "https://router.bynara.id/v1", model: "mimo-v2.5-pro-free", desc: "Nara AI Router" },
  { name: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", desc: "OpenAI GPT" },
  { name: "anthropic", label: "Anthropic", baseUrl: "https://api.anthropic.com/v1", model: "claude-3-haiku-20240307", desc: "Anthropic Claude" },
  { name: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini", desc: "OpenRouter" },
];

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", label: "", baseUrl: "", apiKey: "", model: "", isActive: false });

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    const res = await fetch("/api/admin/settings/providers");
    const json = await res.json();
    if (json?.success) setProviders(json.data ?? []);
  }

  function fillTemplate(tpl: typeof PROVIDER_TEMPLATES[0]) {
    setForm({ name: tpl.name, label: tpl.label, baseUrl: tpl.baseUrl, apiKey: "", model: tpl.model, isActive: false });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json?.success) {
        setForm({ name: "", label: "", baseUrl: "", apiKey: "", model: "", isActive: false });
        fetchProviders();
        showToast("تمت إضافة المزود");
      } else {
        showToast(json?.error ?? "فشل الإضافة", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(provider: Provider) {
    const res = await fetch(`/api/admin/settings/providers/${provider.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !provider.isActive }),
    });
    const json = await res.json();
    if (json?.success) {
      fetchProviders();
      showToast(`تم تفعيل ${json.data.label}`);
    } else {
      showToast(json?.error ?? "فشل التفعيل", "error");
    }
  }

  async function deleteProvider(id: string) {
    if (!confirm("حذف هذا المزود؟")) return;
    const res = await fetch(`/api/admin/settings/providers/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json?.success) {
      fetchProviders();
      showToast("تم الحذف");
    }
  }

  if (session?.user?.role !== "admin") {
    return <div className="p-8 text-center text-text-muted">غير مصرح</div>;
  }

  return (
    <main className="pt-24 pb-16 min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-2">إعدادات مزودي الذكاء الاصطناعي</h1>
          <p className="text-sm text-text-secondary mb-6">أضف وأدر مزودي الـ AI الذين تريد استخدامهم في التوليد</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {PROVIDER_TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => fillTemplate(tpl)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all"
              >
                {tpl.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 mb-8 p-4 rounded-xl border border-border-light bg-surface-secondary">
            <h2 className="text-sm font-semibold text-text-primary">إضافة مزود جديد</h2>
            <div className="grid grid-cols-2 gap-3">
              <Input id="p_name" label="الاسم (slug)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="openai" />
              <Input id="p_label" label="الاسم المعروض" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} required placeholder="OpenAI" />
            </div>
            <Input id="p_baseUrl" label="عنوان URL الأساسي" value={form.baseUrl} onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))} required placeholder="https://api.openai.com/v1" />
            <Input id="p_apiKey" label="مفتاح API" value={form.apiKey} onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))} required type="password" placeholder="sk-..." />
            <div className="grid grid-cols-2 gap-3">
              <Input id="p_model" label="النموذج" value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} required placeholder="gpt-4o-mini" />
              <label className="flex items-center gap-2 pt-6">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded border-border" />
                <span className="text-xs text-text-secondary">تفعيل فوراً</span>
              </label>
            </div>
            <Button type="submit" loading={loading}>إضافة</Button>
          </form>

          <h2 className="text-sm font-semibold text-text-primary mb-3">المزودين الحاليين ({providers.length})</h2>
          <div className="space-y-2">
            {providers.length === 0 && <p className="text-xs text-text-muted">لا يوجد مزودين بعد. أضف واحداً أعلاه.</p>}
            {providers.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-border-light bg-surface-secondary">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{p.label}</span>
                    {p.isActive && <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-accent/10 text-accent">نشط</span>}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {p.model} — <span className="font-mono">{p.baseUrl.replace(/^https?:\/\//, "").split("/")[0]}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={p.isActive ? "primary" : "ghost"}
                    onClick={() => toggleActive(p)}
                  >
                    {p.isActive ? "مفعل" : "تفعيل"}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteProvider(p.id)}>
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
