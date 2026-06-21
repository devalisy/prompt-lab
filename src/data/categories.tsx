import type { ReactNode } from "react";
import { Target, Code, GraduationCap, Palette, PenNib, Briefcase, DeviceMobileCamera, ChartBar, Video, Camera, type IconWeight } from "@phosphor-icons/react";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: () => ReactNode;
  color: string;
  promptCount: number;
}

const w = { weight: "light" as IconWeight, className: "size-5" };

export const categories: Category[] = [
  {
    id: "marketing",
    name: "التسويق والإعلان",
    description: "برومتات لحملات تسويقية، إعلانات، وإيميلات ترويجية",
    icon: () => <Target {...w} />,
    color: "#22c55e",
    promptCount: 48,
  },
  {
    id: "programming",
    name: "البرمجة والتطوير",
    description: "برومتات لكتابة الأكواد، تصحيح الأخطاء، ومراجعة الكود",
    icon: () => <Code {...w} />,
    color: "#3b82f6",
    promptCount: 56,
  },
  {
    id: "education",
    name: "التعليم والتدريب",
    description: "برومتات لتصميم الخطط الدراسية والاختبارات",
    icon: () => <GraduationCap {...w} />,
    color: "#a855f7",
    promptCount: 35,
  },
  {
    id: "design",
    name: "التصميم الجرافيكي",
    description: "برومتات لتصميم الشعارات والواجهات والبوسترات",
    icon: () => <Palette {...w} />,
    color: "#f59e0b",
    promptCount: 42,
  },
  {
    id: "creative",
    name: "الكتابة الإبداعية",
    description: "برومتات لكتابة القصص والروايات والنصوص الأدبية",
    icon: () => <PenNib {...w} />,
    color: "#ec4899",
    promptCount: 39,
  },
  {
    id: "business",
    name: "الأعمال وريادة الأعمال",
    description: "برومتات لخطط العمل والاستراتيجيات",
    icon: () => <Briefcase {...w} />,
    color: "#14b8a6",
    promptCount: 31,
  },
  {
    id: "social",
    name: "السوشيال ميديا",
    description: "برومتات لمحتوى التواصل الاجتماعي والهاشتاقات",
    icon: () => <DeviceMobileCamera {...w} />,
    color: "#f97316",
    promptCount: 44,
  },
  {
    id: "data",
    name: "تحليل البيانات",
    description: "برومتات لإعداد التقارير ولوحات البيانات",
    icon: () => <ChartBar {...w} />,
    color: "#06b6d4",
    promptCount: 27,
  },
  {
    id: "content",
    name: "المحتوى التعليمي",
    description: "برومتات لإنتاج فيديوهات ودورات تعليمية",
    icon: () => <Video {...w} />,
    color: "#e11d48",
    promptCount: 33,
  },
  {
    id: "photography",
    name: "التصوير والفيديو",
    description: "برومتات لتحرير الصور وتصوير الفيديو",
    icon: () => <Camera {...w} />,
    color: "#8b5cf6",
    promptCount: 25,
  },
];
