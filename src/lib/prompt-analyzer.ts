export interface AnalysisResult {
  quality: {
    score: number;
    label: "ممتاز" | "جيد" | "مقبول" | "ضعيف";
    color: string;
  };
  naturalness: {
    score: number;
    label: "طبيعي" | "آلي قليلاً" | "آلي";
    isRobotic: boolean;
    color: string;
  };
  stats: {
    charCount: number;
    wordCount: number;
    lineCount: number;
    paragraphCount: number;
  };
  suggestions: string[];
}

const roboticPatterns = [
  /\b(as an AI|I cannot|I apologize|as a language model|I don't have personal)\b/i,
  /\b(furthermore|moreover|additionally|consequently|in conclusion)\b/gi,
  /\b(it is important to note that|it should be noted that)\b/gi,
  /\b(in order to|due to the fact that|with regard to)\b/gi,
  /\.{2,}/g,
  /\b(leverage|utilize|optimize|innovate|streamline)\b/gi,
  /\b(revolutionize|game-changer|cutting-edge|state-of-the-art)\b/gi,
  /\b(empower|holistic|synergize|paradigm)\b/gi,
];

const qualityIndicators = [
  { pattern: /\{.*?\}/g, weight: 15, label: "متغيرات مخصصة" },
  { pattern: /\d+[%]/, weight: 10, label: "أرقام ونسب" },
  { pattern: /(خطوة|مرحلة|أولاً|ثانياً|أخيراً)/g, weight: 10, label: "تسلسل منطقي" },
  { pattern: /\[.*?\]/g, weight: 10, label: "قوالب مخصصة" },
  { pattern: /(مثال|على سبيل المثال|مثل)/g, weight: 10, label: "أمثلة توضيحية" },
  { pattern: /(أنت|انت|المستخدم)/g, weight: 5, label: "مخاطبة مباشرة" },
  { pattern: /\b(لأن|بسبب|نتيجة)\b/g, weight: 5, label: "تفسير وربط" },
];

export function analyzePrompt(content: string): AnalysisResult {
  const charCount = content.length;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const lineCount = content.split("\n").filter(Boolean).length;
  const paragraphCount = content.split(/\n\s*\n/).filter(Boolean).length;

  let qualityScore = 30;
  const suggestions: string[] = [];

  for (const indicator of qualityIndicators) {
    const matches = content.match(indicator.pattern);
    if (matches) {
      qualityScore += Math.min(indicator.weight * matches.length, indicator.weight * 2);
    } else {
      suggestions.push(`أضف ${indicator.label} لتحسين جودة البرومت`);
    }
  }

  if (wordCount < 20) {
    qualityScore -= 15;
    suggestions.push("اجعل البرومت أكثر تفصيلاً (أقل من 20 كلمة)");
  } else if (wordCount > 200) {
    qualityScore -= 10;
    suggestions.push("البرومت طويل جداً، حاول اختصاره");
  } else if (wordCount > 50) {
    qualityScore += 10;
  }

  if (lineCount > 3) {
    qualityScore += 10;
  }
  if (paragraphCount > 1) {
    qualityScore += 5;
  }

  if (content.includes("?") || content.includes("؟")) {
    qualityScore += 5;
  }

  qualityScore = Math.max(0, Math.min(100, qualityScore));

  let naturalnessScore = 85;
  let roboticMatchCount = 0;
  const matchedPatterns: string[] = [];

  for (const pattern of roboticPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      roboticMatchCount += matches.length;
      matchedPatterns.push(matches[0]);
    }
  }

  naturalnessScore -= roboticMatchCount * 12;
  const hasAIClosing = /(أتمنى|آمل|if you have any questions|feel free)/i.test(content);
  if (hasAIClosing) naturalnessScore -= 10;

  if (wordCount < 15) naturalnessScore -= 10;
  if (wordCount > 300) naturalnessScore -= 5;

  naturalnessScore = Math.max(0, Math.min(100, naturalnessScore));

  let qualityLabel: AnalysisResult["quality"]["label"];
  let qualityColor: string;
  if (qualityScore >= 80) {
    qualityLabel = "ممتاز";
    qualityColor = "oklch(0.72 0.19 149)";
  } else if (qualityScore >= 60) {
    qualityLabel = "جيد";
    qualityColor = "oklch(0.75 0.18 75)";
  } else if (qualityScore >= 40) {
    qualityLabel = "مقبول";
    qualityColor = "oklch(0.75 0.18 75 / 0.7)";
  } else {
    qualityLabel = "ضعيف";
    qualityColor = "oklch(0.64 0.2 29)";
  }

  let naturalnessLabel: AnalysisResult["naturalness"]["label"];
  let naturalnessColor: string;
  const isRobotic = naturalnessScore < 50;

  if (naturalnessScore >= 70) {
    naturalnessLabel = "طبيعي";
    naturalnessColor = "oklch(0.72 0.19 149)";
  } else if (naturalnessScore >= 40) {
    naturalnessLabel = "آلي قليلاً";
    naturalnessColor = "oklch(0.75 0.18 75)";
  } else {
    naturalnessLabel = "آلي";
    naturalnessColor = "oklch(0.64 0.2 29)";
  }

  if (naturalnessScore < 70 && !roboticMatchCount) {
    if (!suggestions.includes("أضف أمثلة واقعية لتحسين طبيعة النص")) {
      suggestions.push("أضف أمثلة واقعية لتحسين طبيعة النص");
    }
  }

  if (roboticMatchCount > 0) {
    suggestions.push(`قلل استخدام العبارات الآلية (تم العثور على ${roboticMatchCount})`);
  }

  return {
    quality: { score: qualityScore, label: qualityLabel, color: qualityColor },
    naturalness: { score: naturalnessScore, label: naturalnessLabel, isRobotic, color: naturalnessColor },
    stats: { charCount, wordCount, lineCount, paragraphCount },
    suggestions: suggestions.slice(0, 4),
  };
}
