"use client";

import { Button } from "@/components/ui/Button";
import { Warning } from "@phosphor-icons/react";

export default function DashboardError({ error: _error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 text-center py-20">
        <div className="size-16 rounded-2xl bg-danger/15 flex items-center justify-center mx-auto mb-4">
          <Warning weight="thin" className="size-8 text-danger" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">حدث خطأ</h2>
        <p className="text-sm text-text-secondary mb-4">تعذر تحميل لوحة التحكم</p>
        <Button onClick={reset}>إعادة المحاولة</Button>
      </div>
    </main>
  );
}
