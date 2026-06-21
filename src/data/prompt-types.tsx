import type { ReactNode } from "react";
import {
  Megaphone,
  Code,
  GraduationCap,
  Palette,
  PenNib,
  Briefcase,
  DeviceMobileCamera,
  ChartBar,
  Video,
  Camera,
  type IconWeight,
} from "@phosphor-icons/react";

export interface PromptType {
  id: string;
  name: string;
  description: string;
  icon: () => ReactNode;
  categoryId: string;
}

const iconProps = { weight: "light" as IconWeight, className: "size-5" };

export const promptTypes: PromptType[] = [
  // التسويق
  { id: "mkt-ad", name: "إعلان منتج", description: "برومت احترافي لإعلانات المنتجات والخدمات", icon: () => <Megaphone {...iconProps} />, categoryId: "marketing" },
  { id: "mkt-campaign", name: "حملة تسويقية", description: "استراتيجية متكاملة لحملة إعلانية", icon: () => <Megaphone {...iconProps} />, categoryId: "marketing" },
  { id: "mkt-email", name: "إيميل ترويجي", description: "برومت لإيميلات تسويقية احترافية", icon: () => <Megaphone {...iconProps} />, categoryId: "marketing" },
  { id: "mkt-social", name: "محتوى تواصل", description: "منشورات منسقة لوسائل التواصل", icon: () => <DeviceMobileCamera {...iconProps} />, categoryId: "marketing" },
  { id: "mkt-strategy", name: "استراتيجية تسويق", description: "خطة تسويقية شاملة ومتكاملة", icon: () => <ChartBar {...iconProps} />, categoryId: "marketing" },

  // البرمجة
  { id: "prog-code", name: "كتابة كود", description: "برومت لإنشاء أكواد برمجية نظيفة", icon: () => <Code {...iconProps} />, categoryId: "programming" },
  { id: "prog-review", name: "مراجعة كود", description: "تدقيق وتحسين جودة الكود الموجود", icon: () => <Code {...iconProps} />, categoryId: "programming" },
  { id: "prog-explain", name: "شرح مفهوم", description: "تبسيط وشرح المفاهيم البرمجية", icon: () => <GraduationCap {...iconProps} />, categoryId: "programming" },
  { id: "prog-debug", name: "تصحيح أخطاء", description: "حل المشاكل البرمجية والأخطاء", icon: () => <Code {...iconProps} />, categoryId: "programming" },
  { id: "prog-docs", name: "توثيق", description: "كتابة توثيق احترافي للأكواد", icon: () => <PenNib {...iconProps} />, categoryId: "programming" },

  // التعليم
  { id: "edu-plan", name: "خطة درس", description: "تصميم خطة درس تفاعلية", icon: () => <GraduationCap {...iconProps} />, categoryId: "education" },
  { id: "edu-exam", name: "اختبار تقييمي", description: "برومت لإنشاء اختبارات وتمارين", icon: () => <PenNib {...iconProps} />, categoryId: "education" },
  { id: "edu-material", name: "مادة تعليمية", description: "إنتاج محتوى تعليمي منظم", icon: () => <Video {...iconProps} />, categoryId: "education" },
  { id: "edu-activity", name: "نشاط تفاعلي", description: "تصميم أنشطة صفية تفاعلية", icon: () => <GraduationCap {...iconProps} />, categoryId: "education" },

  // التصميم
  { id: "dsgn-logo", name: "تصميم شعار", description: "برومت لتصميم هوية بصرية وشعارات", icon: () => <Palette {...iconProps} />, categoryId: "design" },
  { id: "dsgn-poster", name: "بوستر إعلاني", description: "تصميم بوسترات ومواد بصرية", icon: () => <Palette {...iconProps} />, categoryId: "design" },
  { id: "dsgn-ui", name: "واجهة مستخدم", description: "برومت لتصميم واجهات UI/UX", icon: () => <Palette {...iconProps} />, categoryId: "design" },
  { id: "dsgn-brand", name: "هوية بصرية", description: "نظام هوية بصرية متكامل", icon: () => <Palette {...iconProps} />, categoryId: "design" },

  // الكتابة الإبداعية
  { id: "crea-story", name: "قصة قصيرة", description: "برومت لكتابة قصص أدبية احترافية", icon: () => <PenNib {...iconProps} />, categoryId: "creative" },
  { id: "crea-character", name: "شخصية روائية", description: "تطوير شخصيات أدبية عميقة", icon: () => <PenNib {...iconProps} />, categoryId: "creative" },
  { id: "crea-poem", name: "نص شعري", description: "برومت لكتابة قصائد ونصوص شعرية", icon: () => <PenNib {...iconProps} />, categoryId: "creative" },
  { id: "crea-article", name: "مقال أدبي", description: "كتابة مقالات أدبية ونقدية", icon: () => <PenNib {...iconProps} />, categoryId: "creative" },

  // الأعمال
  { id: "bus-plan", name: "خطة عمل", description: "برومت لخطة عمل متكاملة", icon: () => <Briefcase {...iconProps} />, categoryId: "business" },
  { id: "bus-pitch", name: "عرض استثماري", description: "مقترح استثماري جذاب للمستثمرين", icon: () => <Briefcase {...iconProps} />, categoryId: "business" },
  { id: "bus-strategy", name: "استراتيجية", description: "تطوير استراتيجيات النمو والتوسع", icon: () => <ChartBar {...iconProps} />, categoryId: "business" },
  { id: "bus-report", name: "تقرير تنفيذي", description: "تقارير مهنية واحترافية", icon: () => <Briefcase {...iconProps} />, categoryId: "business" },

  // السوشيال ميديا
  { id: "soc-post", name: "منشور تفاعلي", description: "برومت لمنشورات جذابة وتفاعلية", icon: () => <DeviceMobileCamera {...iconProps} />, categoryId: "social" },
  { id: "soc-strategy", name: "استراتيجية محتوى", description: "خطة محتوى متكاملة للمنصات", icon: () => <ChartBar {...iconProps} />, categoryId: "social" },
  { id: "soc-hashtag", name: "هاشتاقات", description: "توليد هاشتاقات مخصصة وفعالة", icon: () => <DeviceMobileCamera {...iconProps} />, categoryId: "social" },
  { id: "soc-ad", name: "إعلان ممول", description: "برومت لإعلانات مدفوعة احترافية", icon: () => <Megaphone {...iconProps} />, categoryId: "social" },

  // تحليل البيانات
  { id: "data-analysis", name: "تحليل تقرير", description: "برومت لتحليل البيانات والتقارير", icon: () => <ChartBar {...iconProps} />, categoryId: "data" },
  { id: "data-dashboard", name: "لوحة بيانات", description: "تصميم لوحات مؤشرات تفاعلية", icon: () => <ChartBar {...iconProps} />, categoryId: "data" },
  { id: "data-viz", name: "تصور بياني", description: "اختيار التصور المناسب للبيانات", icon: () => <ChartBar {...iconProps} />, categoryId: "data" },

  // المحتوى التعليمي
  { id: "cont-script", name: "سكريبت فيديو", description: "برومت لسكريبتات الفيديو التعليمية", icon: () => <Video {...iconProps} />, categoryId: "content" },
  { id: "cont-course", name: "دورة تدريبية", description: "تصميم منهج لدورة كاملة", icon: () => <GraduationCap {...iconProps} />, categoryId: "content" },
  { id: "cont-lesson", name: "درس تعليمي", description: "إنتاج محتوى درس متكامل", icon: () => <Video {...iconProps} />, categoryId: "content" },

  // التصوير
  { id: "photo-shoot", name: "مشهد تصويري", description: "برومت لوصف مشاهد التصوير", icon: () => <Camera {...iconProps} />, categoryId: "photography" },
  { id: "photo-edit", name: "تعديل صورة", description: "خطوات تعديل وتحسين الصور", icon: () => <Camera {...iconProps} />, categoryId: "photography" },
  { id: "photo-light", name: "إعدادات إضاءة", description: "برومت لإعدادات الإضاءة المثالية", icon: () => <Camera {...iconProps} />, categoryId: "photography" },
];

export function getPromptTypesByCategory(categoryId: string): PromptType[] {
  return promptTypes.filter((pt) => pt.categoryId === categoryId);
}
