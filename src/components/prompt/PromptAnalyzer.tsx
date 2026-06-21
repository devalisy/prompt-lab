"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { analyzePrompt } from "@/lib/prompt-analyzer";


interface PromptAnalyzerProps {
  content: string;
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="relative h-1.5 rounded-full bg-surface-elevated overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 right-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function PromptAnalyzer({ content }: PromptAnalyzerProps) {
  const analysis = useMemo(() => analyzePrompt(content), [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border divide-y divide-border-light"
      style={{ borderColor: "var(--color-border-light)" }}
    >
      <div className="px-4 py-3 bg-surface-secondary/50 rounded-t-2xl">
        <span className="text-xs font-medium text-text-muted tracking-widest">تحليل البرومت</span>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-text-secondary">جودة البرومت</span>
            <span className="text-xs font-bold" style={{ color: analysis.quality.color }}>
              {analysis.quality.score}% — {analysis.quality.label}
            </span>
          </div>
          <ScoreBar score={analysis.quality.score} color={analysis.quality.color} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-text-secondary">طبيعة النص</span>
            <span className="text-xs font-bold" style={{ color: analysis.naturalness.color }}>
              {analysis.naturalness.score}% — {analysis.naturalness.label}
            </span>
          </div>
          <ScoreBar score={analysis.naturalness.score} color={analysis.naturalness.color} />
        </div>

        <div className="flex flex-wrap gap-x-3 text-[11px] text-text-muted">
          <span>{analysis.stats.wordCount} كلمة</span>
          <span>{analysis.stats.charCount} حرف</span>
          <span>{analysis.stats.paragraphCount} فقرة</span>
          <span>{analysis.stats.lineCount} سطر</span>
        </div>

        {analysis.suggestions.length > 0 && (
          <div>
            <span className="text-[11px] font-medium text-text-secondary">توصيات للتحسين</span>
            <ul className="mt-1 space-y-0.5">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="text-[11px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
