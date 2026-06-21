"use client";

import { Quotes } from "@phosphor-icons/react";
import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Quotes weight="fill" className="size-3 text-accent" />
          <span className="text-xs font-medium text-text-secondary">{SITE_NAME}</span>
          <span className="text-[10px] text-text-muted hidden sm:inline">
            &copy; {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {[
            { href: "/", label: "الرئيسية" },
            { href: "/saved", label: "المحفوظات" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-[10px] text-text-muted">
          صنع بـ <span className="text-accent">❤</span> للإبداع العربي
        </p>
      </div>
    </footer>
  );
}
