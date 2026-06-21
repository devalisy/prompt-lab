"use client";

import Link from "next/link";
import { Quotes } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <main className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-text-muted/20 select-none">404</div>
        <div className="size-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto -mt-6 mb-6">
          <Quotes weight="thin" className="size-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">الصفحة غير موجودة</h1>
        <p className="text-sm text-text-secondary max-w-xs mx-auto mb-8">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-accent text-surface text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
