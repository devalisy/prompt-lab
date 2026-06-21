"use client";

import Link from "next/link";
import { categories } from "@/data/categories";
import { ArrowRight } from "@phosphor-icons/react";

export default function CategoriesPage() {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2.5 mb-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors shrink-0"
          >
            <ArrowRight weight="bold" className="size-3" />
            الرئيسية
          </Link>
          <span className="text-text-muted text-[10px]">/</span>
          <h1 className="text-sm font-semibold text-text-primary">التصنيفات</h1>
        </div>

        <p className="text-xs text-text-secondary mb-8 max-w-lg leading-relaxed">
          اختر تصنيفاً لتبدأ بتوليد برومتات AI أو استعراض البرومتات الجاهزة
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group rounded-xl border border-border-light bg-surface-secondary p-4 transition-all duration-300 hover:border-accent/20 hover:shadow-[0_4px_20px_var(--color-shadow)]"
            >
              <div className="flex items-start gap-3">
                <div
                  className="size-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat.color}1A` }}
                >
                  <span style={{ color: cat.color }}><cat.icon /></span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
                <span className="text-[11px] text-text-muted">
                  <span className="text-accent font-medium">{cat.promptCount}</span> برومت
                </span>
                <span className="mr-auto text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  استعراض <ArrowRight weight="bold" className="size-2.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
