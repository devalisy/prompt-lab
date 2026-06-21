import { analyzePrompt } from "@/lib/prompt-analyzer";
import type { AnalysisResult } from "@/lib/prompt-analyzer";
import { generateWithTokenRouter } from "@/lib/tokenrouter";
import { generateSecureId } from "@/lib/utils";

export interface GenerateOptions {
  categoryId: string;
  categoryName: string;
  goal: string;
  keywords: string[];
  style: "short" | "detailed" | "creative";
  tone?: string;
  audience?: string;
}

export interface GeneratedPrompt {
  id: string;
  title: string;
  content: string;
  tips: string[];
  categoryId: string;
  createdAt: Date;
}

const templates: Record<string, { title: string; content: string; tips: string[] }[]> = {
  marketing: [
    {
      title: "حملة إعلانية متكاملة",
      content: "صمم حملة إعلانية متكاملة لـ {goal} تستهدف {audience}. استخدم قنوات {keywords}.\n\nعنوان الإعلان: [عنوان جذاب]\nالوصف: [فقرة مقنعة]\nعبارة CTA: [زر واحد واضح]\n\nالنبرة: {tone}.\nأضف ثلاثة أشكال A/B/C.",
      tips: ["استخدم أرقاماً محددة لزيادة المصداقية", "اختبر 3 صيغ مختلفة", "أضف دليلاً اجتماعياً"],
    },
    {
      title: "استراتيجية تسويق بالمحتوى",
      content: "ضع استراتيجية تسويق بالمحتوى لـ {goal}. الجمهور: {audience}. الكلمات المفتاحية: {keywords}.\n\n1. تقويم محتوى شهري\n2. أنواع المحتوى (مقالات، فيديوهات، إنفوغرافيك)\n3. قنوات التوزيع\n4. مؤشرات الأداء\n5. خطة الترويج\n\nالنبرة: {tone}.",
      tips: ["ركّز على حل مشكلة العميل", "نوّع بين المحتوى التعليمي والترويجي", "حدد ميزانية واقعية"],
    },
    {
      title: "إيميل ترويجي احترافي",
      content: "اكتب إيميلاً ترويجياً لـ {goal}. الجمهور: {audience}. النقاط الرئيسية: {keywords}.\n\nسطر الموضوع: [جذاب ومباشر]\nالافتتاحية: [جذب الانتباه]\nالعرض: [القيمة المقترحة]\nالدليل: [شهادة أو إحصائية]\nالختام: [عبارة CTA]\n\nالنبرة: {tone}.",
      tips: ["اجعل سطر الموضوع أقل من 50 حرفاً", "أضف رابطاً واحداً فقط", "اختبر أوقات الإرسال"],
    },
    {
      title: "وصف منتج مقنع",
      content: "اكتب وصفاً مقنعاً لـ {goal}. الميزات: {keywords}. الفئة المستهدفة: {audience}.\n\nالعنوان: [جذاب]\nالمزايا: [3 فوائد رئيسية]\nالوصف: [فقرة مقنعة]\nلماذا هذا المنتج: [نقطة تميز]\nالسعر والقيمة: [تبرير السعر]\n\nالنبرة: {tone}.",
      tips: ["ركّز على الفائدة وليس الميزة", "استخدم كلمات محفزة للمشاعر", "أضف عبارات تخفيف المخاطرة"],
    },
  ],
  programming: [
    {
      title: "تطبيق عملي",
      content: "قم ببناء {goal} باستخدام {keywords}. المشروع موجه لـ {audience}.\n\nالمتطلبات:\n- [وظيفية]\n- [غير وظيفية]\n\nخطوات التنفيذ:\n1. إعداد البيئة\n2. هيكلة المشروع\n3. الكود الأساسي\n4. اختبار الوحدات\n5. تحسين الأداء\n\nمستوى الشرح: {tone}.",
      tips: ["استخدم مبادئ SOLID", "أضف اختبارات", "وثّق الكود"],
    },
    {
      title: "حل مشكلة برمجية",
      content: "قدم حلاً للمشكلة: {goal}.\nالقيود: {keywords}.\nالجمهور: {audience}.\n\nالخوارزمية:\n[شرح]\n\nالكود:\n```\n[الكود]\n```\n\nتحليل التعقيد:\nالزمن: O(?)\nالمساحة: O(?)\n\nالنبرة: {tone}.",
      tips: ["حلل المشكلة قبل الكتابة", "فكر في حالات الحافة", "قارن بين حلين"],
    },
    {
      title: "مراجعة كود",
      content: "قم بمراجعة الكود التالي لـ {goal} بلغة {keywords}.\n\nجودة الكود:\n- [تقييم]\n\nالمشاكل:\n1. [مشكلة أمنية]\n2. [مشكلة أداء]\n3. [مشكلة صيانة]\n\nالتحسينات المقترحة:\n- [تحسين]\n\nالنبرة: {tone}. المخاطب: {audience}.",
      tips: ["ابدأ بالأهم", "قدّم حلولاً وليس انتقادات", "استخدم أمثلة"],
    },
  ],
  education: [
    {
      title: "خطة تعليمية شاملة",
      content: "صمم خطة تعليمية لـ {goal} مناسبة لـ {audience}. الموارد: {keywords}.\n\nالأهداف:\n- [أهداف قابلة للقياس]\n\nالمحاور:\n1. [محور 1]\n2. [محور 2]\n3. [محور 3]\n\nالتقويم:\n- اختبارات قصيرة\n- مشاريع\n- مناقشات\n\nالنبرة: {tone}.",
      tips: ["استخدم نموذج بلوم", "نوّع بين الأنشطة", "أضف تفاعل كل 15 دقيقة"],
    },
    {
      title: "اختبار تقييمي",
      content: "صمم اختباراً لـ {goal} لمستوى {audience}. المجالات: {keywords}.\n\nعدد الأسئلة: [10-20]\nالأنواع:\n1. اختيار من متعدد\n2. صح وخطأ\n3. أسئلة مقالية\n\nالتوزيع:\n- سهل: 30%\n- متوسط: 50%\n- صعب: 20%\n\nالنبرة: {tone}.",
      tips: ["غطّ جميع الأهداف", "تجنّب الأسئلة المبهمة", "أضف تغذية راجعة"],
    },
  ],
  design: [
    {
      title: "هوية بصرية متكاملة",
      content: "صمم هوية بصرية لـ {goal}. الجمهور: {audience}. الإلهام: {keywords}.\n\n1. الشعار (3 مقترحات)\n2. لوحة الألوان\n3. نظام الخطوط\n4. العناصر المساعدة\n5. التطبيقات\n\nالأسلوب: {tone}.\nقدّم مبررات لكل اختيار.",
      tips: ["ابحث عن المنافسين أولاً", "حافظ على البساطة", "اختبر على تطبيقات مختلفة"],
    },
    {
      title: "واجهة مستخدم",
      content: "صمم واجهة مستخدم لـ {goal}. المستخدمون: {audience}. التقنيات: {keywords}.\n\nالشاشات:\n1. [رئيسية]\n2. [ثانوية]\n3. [تفاصيل]\n\nالعناصر:\n- نظام الشبكة\n- التباعد\n- الأيقونات\n- الصور\n\nالأسلوب: {tone}.\nأضف تدفق المستخدم.",
      tips: ["ابدأ بـ Wireframes", "طبّق مبادئ Gestalt", "اختبر مع مستخدمين"],
    },
    {
      title: "بوستر إعلاني",
      content: "صمم بوستراً إعلانياً لـ {goal}. الجمهور: {audience}. العناصر: {keywords}.\n\nالتخطيط:\n- [الترويسة]\n- [العنوان الرئيسي]\n- [الصورة/الرسم]\n- [التفاصيل]\n- [الختام]\n\nالأسلوب: {tone}.\nحدد مقاس البوستر ونظام الألوان.",
      tips: ["اختر خطاً واحداً واضحاً", "استخدم التباين لجذب الانتباه", "اترك مسافة بيضاء كافية"],
    },
  ],
  creative: [
    {
      title: "نص أدبي إبداعي",
      content: "اكتب نصاً أدبياً عن {goal} بأسلوب {tone}. العناصر: {keywords}.\n\nالنوع: [قصة/قصيدة/مقال]\n\nالعناصر:\n- شخصيات\n- حبكة\n- وصف\n- حوار\n\nالمشاعر المستهدفة: {audience}.\nاستخدم تقنيات أدبية.",
      tips: ["استخدم الحواس الخمس", "أظهر ولا تخبر", "اقرأ بصوت عالٍ"],
    },
    {
      title: "سيناريو فيديو قصير",
      content: "اكتب سيناريو فيديو قصير عن {goal}. المدة: {keywords}. الجمهور: {audience}.\n\nالمشهد الافتتاحي:\n[وصف]\n\nالحوار:\n[النص]\n\nالمشهد الختامي:\n[وصف + CTA]\n\nالنبرة: {tone}.",
      tips: ["اجعل المقدمة قوية", "استخدم الصور البصرية", "أنهِ بعبارة لا تنسى"],
    },
  ],
  business: [
    {
      title: "خطة عمل تنفيذية",
      content: "اكتب خطة عمل لـ {goal}. الفئة: {audience}. الموارد: {keywords}.\n\n1. الملخص التنفيذي\n2. تحليل السوق\n3. الخطة التشغيلية\n4. الخطة المالية\n5. خطة النمو\n6. المخاطر\n\nالنبرة: {tone}.\nأضف توقعات 3 سنوات.",
      tips: ["ابحث عن منافسيك بدقة", "كن واقعياً في المالية", "حدد مؤشرات نجاح"],
    },
    {
      title: "عرض تقديمي مستثمر",
      content: "صمم عرضاً تقديمياً لـ {goal} لجذب {audience}. النقاط: {keywords}.\n\n1. المشكلة\n2. الحل\n3. السوق\n4. نموذج العمل\n5. الفريق\n6. التوقعات\n7. احتياج التمويل\n\nالنبرة: {tone}.\nأضف 3 شرائح رئيسية.",
      tips: ["اقلّص إلى 10 شرائح", "استخدم رسومات", "ركّز على الجذب"],
    },
  ],
  social: [
    {
      title: "استراتيجية سوشيال ميديا",
      content: "ضع استراتيجية لـ {goal}. الجمهور: {audience}. المنصات: {keywords}.\n\n1. أهداف SMART\n2. شخصية العلامة\n3. تقويم شهري\n4. خطة التفاعل\n5. مؤشرات الأداء\n6. إدارة الأزمات\n\nالنبرة: {tone}.",
      tips: ["تفاعل يومياً", "حلل الأداء السابق", "نوّع المحتوى"],
    },
    {
      title: "منشور تفاعلي",
      content: "اكتب منشوراً لـ {platform} يستهدف {audience}.\n\nصيغة AIDA:\n- جذب: [سؤال أو إحصائية]\n- اهتمام: [قيمة]\n- رغبة: [دليل]\n- فعل: [دعوة]\n\nالموضوع: {goal}. الوسوم: {keywords}.\nالنبرة: {tone}.",
      tips: ["استخدم سؤالاً في البداية", "أضف صورة جذابة", "أنهِ بسؤال للتفاعل"],
    },
    {
      title: "إعلان ممول",
      content: "اكتب إعلاناً ممولاً لـ {goal}. المنصة: {keywords}. الجمهور: {audience}.\n\nالنص الأساسي:\n[فقرة قصيرة]\n\nالعنوان:\n[جذاب]\n\nالوصف:\n[مقنع]\n\nالنبرة: {tone}.\nأضف 3 أشكال مختلفة.",
      tips: ["اختبر الجمهور", "استخدم CTA واضحاً", "راقب التكاليف"],
    },
  ],
  data: [
    {
      title: "تقرير تحليلي شامل",
      content: "أعد تقريراً لـ {goal}. البيانات: {keywords}. القارئ: {audience}.\n\n1. ملخص تنفيذي\n2. المنهجية\n3. النتائج\n4. تصورات\n5. التوصيات\n6. الخطوات التالية\n\nالنبرة: {tone}.\nأضف 3 سيناريوهات.",
      tips: ["نظف البيانات أولاً", "اختر التصور المناسب", "اربط بالتوصيات"],
    },
    {
      title: "لوحة بيانات (Dashboard)",
      content: "صمم لوحة بيانات لـ {goal}. المؤشرات: {keywords}. المستخدم: {audience}.\n\nالمؤشرات الرئيسية:\n1. [KPI 1]\n2. [KPI 2]\n3. [KPI 3]\n\nالتصورات:\n- [رسم بياني]\n- [جدول]\n- [عداد]\n\nالنبرة: {tone}.",
      tips: ["ركّز على أهم 5 مؤشرات", "استخدم ألواناً محدودة", "اجعلها قابلة للتصفية"],
    },
  ],
  content: [
    {
      title: "محتوى تعليمي متكامل",
      content: "أنتج محتوى تعليمياً لـ {goal}. المتعلمون: {audience}. الوسائط: {keywords}.\n\n1. الهيكل\n2. السكريبت\n3. العناصر البصرية\n4. الأنشطة\n5. التمارين\n\nالنبرة: {tone}.\nأضف خطة تحسين.",
      tips: ["قسّم المحتوى لوحدات", "استخدم أمثلة واقعية", "أضف اختبارات قصيرة"],
    },
    {
      title: "سكريبت بودكاست",
      content: "اكتب سكريبت بودكاست عن {goal}. المدة: {keywords}. الجمهور: {audience}.\n\nالمقدمة:\n[ترحيب + موضوع]\n\nالمحتوى:\n[النقاش]\n\nالخاتمة:\n[خلاصة + دعوة]\n\nالنبرة: {tone}.\nأضف أسئلة للمناقشة.",
      tips: ["ابدأ بقصة", "استخدم لغة حوارية", "أنهِ بعبارة قوية"],
    },
  ],
  photography: [
    {
      title: "مشروع تصويري",
      content: "خطط لمشروع تصويري لـ {goal}. الجمهور: {audience}. المعدات: {keywords}.\n\n1. المفهوم\n2. المشاهد\n3. الإضاءة\n4. العدسات\n5. الإعدادات\n6. ما بعد الإنتاج\n\nالأسلوب: {tone}.\nأضف Mood Board.",
      tips: ["جهّز Shot List", "اختبر الإضاءة مسبقاً", "احجز الموقع"],
    },
    {
      title: "جلسة تصوير منتج",
      content: "صمم جلسة تصوير لـ {goal}. المنتج: {keywords}. الاستخدام: {audience}.\n\nالخلفيات: [مقترحات]\nالإضاءة: [نوع + زاوية]\nالزوايا: [3 زوايا]\nالإعدادات: [فتحة ISO سرعة]\n\nالأسلوب: {tone}.",
      tips: ["استخدم ضوء طبيعي", "نظف الخلفية", "صوّر من زوايا متعددة"],
    },
  ],
};

const SYSTEM_PROMPT = `أنت خبير في كتابة البرومتات (prompts) للذكاء الاصطناعي باللغة العربية.
مهمتك: توليد برومت احترافي بناءً على طلب المستخدم.

يجب أن يكون الرد بصيغة JSON بالضبط:
{
  "title": "عنوان البرومت (جذاب ومحدد)",
  "content": "نص البرومت الكامل (بين 100-500 كلمة، منظم، جاهز للنسخ)",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3"]
}

القواعد:
- المحتوى بالعربية الفصحى
- استخدم أقواس [] للعناصر التي يملؤها المستخدم لاحقاً
- اجعل البرومت قابلاً للتطبيق الفوري
- النصائح: 3 نصائح عملية مختصرة`;

function buildUserPrompt(options: GenerateOptions): string {
  return `التصنيف: ${options.categoryName}
الهدف: ${options.goal}
الكلمات المفتاحية: ${options.keywords.join("، ")}
الجمهور المستهدف: ${options.audience || "عام"}
النبرة: ${toneWords[options.style]}
المستوى: ${options.style === "short" ? "مختصر" : options.style === "detailed" ? "مفصل" : "إبداعي"}

المطلوب: برومت احترافي بالعربية في مجال ${options.categoryName} لتحقيق "${options.goal}".`;
}

const toneWords: Record<GenerateOptions["style"], string> = {
  short: "مختصرة ومباشرة",
  detailed: "شاملة ومفصلة مع شرح وافٍ",
  creative: "إبداعية ومبتكرة مع لمسات فنية",
};

const styleModifiers: Record<string, string> = {
  short: "\n\nملاحظة: اجعل الرد في 3-5 نقاط مختصرة.",
  detailed: "\n\nملاحظة: قدم شرحاً مفصلاً لكل نقطة مع أمثلة تطبيقية.",
  creative: "\n\nملاحظة: استخدم أسلوباً إبداعياً غير تقليدي مع استعارات وصور بلاغية.",
};

export async function generateWithAI(options: GenerateOptions): Promise<GeneratedPrompt> {
  return generatePrompt(options);
}

const ANALYSIS_SYSTEM_PROMPT = `أنت خبير في تقييم البرومتات (prompts) للذكاء الاصطناعي.
حلل البرومت المقدم وأعط تقييماً بصيغة JSON:
{
  "qualityScore": (0-100),
  "naturalnessScore": (0-100),
  "suggestions": ["نصيحة 1", "نصيحة 2", ...]
}
- qualityScore: مدى احترافية البرومت (وضوح، تفصيل، عناصر)
- naturalnessScore: مدى طبيعته (قلة العبارات الآلية)
- suggestions: 3-4 نصائح للتحسين`;

export async function analyzeWithAI(content: string): Promise<AnalysisResult> {
  try {
    const raw = await generateWithTokenRouter(ANALYSIS_SYSTEM_PROMPT, `حلل هذا البرومت:\n\n${content}`);
    if (raw) {
      const json = JSON.parse(raw.trim().replace(/^```json|```$/g, "").trim()) as {
        qualityScore: number;
        naturalnessScore: number;
        suggestions: string[];
      };
      if (typeof json.qualityScore === "number" && typeof json.naturalnessScore === "number") {
        const qs = Math.max(0, Math.min(100, json.qualityScore));
        const ns = Math.max(0, Math.min(100, json.naturalnessScore));
        return {
          quality: {
            score: qs,
            label: qs >= 80 ? "ممتاز" : qs >= 60 ? "جيد" : qs >= 40 ? "مقبول" : "ضعيف",
            color: qs >= 80 ? "oklch(0.72 0.19 149)" : qs >= 60 ? "oklch(0.75 0.18 75)" : qs >= 40 ? "oklch(0.75 0.18 75 / 0.7)" : "oklch(0.64 0.2 29)",
          },
          naturalness: {
            score: ns,
            label: ns >= 70 ? "طبيعي" : ns >= 40 ? "آلي قليلاً" : "آلي",
            isRobotic: ns < 50,
            color: ns >= 70 ? "oklch(0.72 0.19 149)" : ns >= 40 ? "oklch(0.75 0.18 75)" : "oklch(0.64 0.2 29)",
          },
          stats: {
            charCount: content.length,
            wordCount: content.split(/\s+/).filter(Boolean).length,
            lineCount: content.split("\n").filter(Boolean).length,
            paragraphCount: content.split(/\n\s*\n/).filter(Boolean).length,
          },
          suggestions: (json.suggestions ?? []).slice(0, 4),
        };
      }
    }
  } catch {}
  return analyzePrompt(content);
}

export async function* streamGenerateWithAI(options: GenerateOptions): AsyncGenerator<string> {
  const prompt = generatePrompt(options);
  const data = await prompt;
  yield JSON.stringify(data);
}

async function generateViaOpenRouter(options: GenerateOptions): Promise<GeneratedPrompt | null> {
  try {
    const userPrompt = buildUserPrompt(options);
    console.log("[AI-Gen] Calling TokenRouter with:", { systemPrompt: SYSTEM_PROMPT.slice(0, 50), userPrompt: userPrompt.slice(0, 100) });
    const raw = await generateWithTokenRouter(SYSTEM_PROMPT, userPrompt);
    console.log("[AI-Gen] TokenRouter raw response:", raw?.slice(0, 300));
    if (!raw) {
      console.error("[AI-Gen] TokenRouter returned null (API key missing or request failed)");
      return null;
    }

    const cleaned = raw.trim().replace(/^```json|```$/g, "").trim();
    console.log("[AI-Gen] Cleaned JSON:", cleaned.slice(0, 200));

    const json = JSON.parse(cleaned) as {
      title: string;
      content: string;
      tips: string[];
    };

    if (!json.title || !json.content) {
      console.error("[AI-Gen] Missing title or content in AI response", JSON.stringify(json).slice(0, 200));
      return null;
    }

    return {
      id: generateSecureId(),
      title: json.title,
      content: json.content,
      tips: Array.isArray(json.tips) ? json.tips.slice(0, 3) : [],
      categoryId: options.categoryId,
      createdAt: new Date(),
    };
  } catch (err) {
    console.error("[AI-Gen] generateViaOpenRouter failed:", err);
    return null;
  }
}

function generateViaTemplate(options: GenerateOptions): GeneratedPrompt {
  const categoryTemplates = templates[options.categoryId] ?? templates.marketing;
  const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];

  let content = template.content
    .replace(/\{goal\}/g, options.goal)
    .replace(/\{audience\}/g, options.audience ?? "جمهور عام")
    .replace(/\{keywords\}/g, options.keywords.join("، "))
    .replace(/\{tone\}/g, toneWords[options.style])
    .replace(/\{platform\}/g, "المنصات الرقمية")
    .replace(/\{duration\}/g, "30")
    .replace(/\{software\}/g, "Adobe")
    .replace(/\{brand\}/g, options.goal)
    .replace(/\{industry\}/g, options.categoryName);

  content += styleModifiers[options.style];

  return {
    id: generateSecureId(),
    title: template.title + " - " + options.goal,
    content,
    tips: template.tips,
    categoryId: options.categoryId,
    createdAt: new Date(),
  };
}

export async function generatePrompt(options: GenerateOptions): Promise<GeneratedPrompt> {
  const aiResult = await generateViaOpenRouter(options);
  if (!aiResult) {
    console.warn("[AI-Gen] TokenRouter failed, falling back to template");
    return generateViaTemplate(options);
  }
  return aiResult;
}
