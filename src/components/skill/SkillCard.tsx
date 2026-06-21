"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Copy, Check, Heart, HeartBreak, ThumbsUp, Lightning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks/useClipboard";
import { showToast } from "@/components/ui/Toast";

interface SkillCardData {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
  categoryId: string;
  tags: string | string[];
  usageCount: number;
  author?: { id: string; name: string; image?: string } | null;
  _count?: { likes: number; savedBy: number };
  likes?: number;
}

interface SkillCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skill: any;
  index?: number;
  onLike?: (id: string) => void;
  isLiked?: boolean;
  onView?: (skill: any) => void;
}

export function SkillCard({ skill, index = 0, onLike, isLiked, onView }: SkillCardProps) {
  const { copy, copied } = useClipboard();
  const tags: string[] = typeof skill.tags === "string" ? JSON.parse(skill.tags) : skill.tags ?? [];
  const likeCount = skill.likes ?? skill._count?.likes ?? 0;

  const handleCopy = async () => {
    await copy(skill.systemPrompt);
    showToast("تم نسخ التعليمات!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.02, ease: [0.16, 1, 0.3, 1] }}
      className="group rounded-xl border border-border-light bg-surface-secondary overflow-hidden transition-all duration-300 hover:border-accent/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {onView ? (
              <button onClick={() => onView(skill)} className="block w-full text-left">
                <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1 hover:text-accent transition-colors flex items-center gap-1.5">
                  <Lightning weight="fill" className="size-3.5 text-accent shrink-0" />
                  {skill.title}
                </h3>
              </button>
            ) : (
              <Link href={`/skills/${skill.id}`} className="block">
                <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1 hover:text-accent transition-colors flex items-center gap-1.5">
                  <Lightning weight="fill" className="size-3.5 text-accent shrink-0" />
                  {skill.title}
                </h3>
              </Link>
            )}
            {skill.author && (
              <span className="text-[10px] text-text-muted">بواسطة {skill.author.name}</span>
            )}
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-[10px] text-text-muted bg-surface-elevated px-1.5 py-0.5 rounded">#{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-muted">{skill.usageCount} استخدام</span>
            {onLike && (
              <button
                onClick={() => onLike(skill.id)}
                className={cn(
                  "flex items-center gap-1 text-[11px] transition-colors",
                  isLiked ? "text-accent" : "text-text-muted hover:text-text-secondary"
                )}
              >
                <ThumbsUp weight={isLiked ? "fill" : "bold"} className="size-3" />
                <span>{isLiked ? likeCount + 1 : likeCount}</span>
              </button>
            )}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "text-[11px] font-medium transition-colors",
              copied ? "text-accent" : "text-text-muted hover:text-text-primary"
            )}
          >
            {copied ? <Check weight="bold" className="size-3" /> : <Copy weight="bold" className="size-3" />}
            {copied ? "تم" : "نسخ التعليمات"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
