"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      if (errorTimer.current) clearTimeout(errorTimer.current);
    };
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        if (!document.queryCommandSupported?.("copy")) {
          throw new Error("copy not supported");
        }
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      setCopied(true);
      setError(null);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      if (errorTimer.current) clearTimeout(errorTimer.current);
      setError("فشل النسخ");
      errorTimer.current = setTimeout(() => setError(null), 3000);
    }
  }, []);

  return { copy, copied, error };
}
