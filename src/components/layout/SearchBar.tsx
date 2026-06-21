"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  title: string;
  content: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`, { signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.success) setResults(json.data?.prompts ?? json.data ?? []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [debouncedQuery]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) setIsOpen(true);
    else { setIsOpen(false); setResults([]); }
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg border transition-colors ${
          focused
            ? "border-accent/40 bg-surface-elevated"
            : "border-border bg-surface-secondary"
        }`}
      >
        <MagnifyingGlass weight="bold" className="size-3.5 text-text-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { setFocused(true); if (query.trim()) setIsOpen(true); }}
          placeholder="بحث..."
          className="w-28 lg:w-36 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none"
        />
        {query && (
          <button onClick={clear} className="text-text-muted hover:text-text-primary">
            <X weight="bold" className="size-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1.5 right-0 w-72 rounded-xl bg-surface-secondary border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-1.5 space-y-0.5">
              {results.map((prompt) => (
                <Link
                  key={prompt.id}
                  href={`/prompt/${prompt.id}`}
                  onClick={clear}
                  className="flex flex-col gap-0.5 px-2.5 py-2 rounded-lg transition-colors hover:bg-surface-elevated"
                >
                  <span className="text-xs font-medium text-text-primary leading-snug line-clamp-1">
                    {prompt.title}
                  </span>
                  <span className="text-[10px] text-text-muted line-clamp-1">
                    {prompt.content.slice(0, 60)}...
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
