"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Company = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  defaults?: Record<string, any>;
};

export default function ProfilePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", logo: "", tone: "", audience: "", language: "" });

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    const res = await fetch('/api/user/company');
    const json = await res.json();
    if (json?.success) setCompanies(json.data ?? []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const defaults = { tone: form.tone || undefined, audience: form.audience || undefined, language: form.language || undefined };
      const res = await fetch('/api/user/company', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, slug: form.slug, description: form.description, logo: form.logo, defaults }) });
      const json = await res.json();
      if (json?.success) {
        setForm({ name: "", slug: "", description: "", logo: "", tone: "", audience: "", language: "" });
        fetchCompanies();
      } else {
        alert(json?.error ?? 'فشل إنشاء الشركة');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">الملف الشخصي - تعريف الشركة</h1>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2">شركاتك</h2>
        {companies.length === 0 ? (
          <p className="text-sm text-text-muted">لم تنضم إلى أية شركة بعد.</p>
        ) : (
          <ul className="space-y-3">
            {companies.map((c) => (
              <li key={c.id} className="p-3 border border-border rounded-xl flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-text-muted">{c.description}</div>
                </div>
                <div className="text-xs text-text-muted">{c.slug}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">أنشئ شركة</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <Input id="c_name" name="c_name" label="اسم الشركة" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input id="c_slug" name="c_slug" label="slug (اختياري)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          <Input id="c_desc" name="c_desc" label="وصف" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input id="c_logo" name="c_logo" label="رابط الشعار" value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} />

          <div className="grid grid-cols-3 gap-3">
            <Input id="c_tone" name="c_tone" label="tone (مثال: رسمي)" value={form.tone} onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))} />
            <Input id="c_audience" name="c_audience" label="audience" value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))} />
            <Input id="c_lang" name="c_lang" label="language" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} />
          </div>

          <Button type="submit" loading={loading}>أنشئ الشركة</Button>
        </form>
      </section>
    </div>
  );
}
