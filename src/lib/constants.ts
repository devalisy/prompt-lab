export const SITE_NAME = "مختصر البرومت";
export const SITE_TAGLINE = "توليد برومتات احترافية لمختلف المجالات";
export const SITE_DESCRIPTION = "أداة ذكية لتوليد برومتات مخصصة للتسويق، البرمجة، التعليم، التصميم، وأكثر";

export const STORAGE_KEYS = {
  SAVED_PROMPTS: "prompt-lab-saved",
  FAVORITE_CATEGORIES: "prompt-lab-favorites",
  SETTINGS: "prompt-lab-settings",
  HISTORY: "prompt-lab-history",
} as const;

export const PROMPT_STYLES = [
  { id: "short", label: "مختصر", description: "برومت قصير ومباشر" },
  { id: "detailed", label: "مفصل", description: "برومت شامل بتفاصيل دقيقة" },
  { id: "creative", label: "إبداعي", description: "برومت إبداعي بخيارات مبتكرة" },
] as const;

export const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "مبتدئ" },
  { id: "intermediate", label: "متوسط" },
  { id: "advanced", label: "متقدم" },
] as const;

export const SOCIAL_SHARE_TEXT = "اكتشف برومتات احترافية في مختصر البرومت";
