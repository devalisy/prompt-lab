# مختصر البرومت — Prompt Lab

منصة عربية لإنشاء وإدارة برومتات الذكاء الاصطناعي (AI Prompts). توليد، تصنيف، مشاركة، ونشر للمجتمع.

## التقنيات

- **Next.js 16** (Turbopack, App Router)
- **Tailwind CSS v4**
- **Prisma** (SQLite للتطوير / PostgreSQL للإنتاج)
- **NextAuth v5** (Email + Google OAuth)
- **Zustand** (إدارة الحالة)
- **TokenRouter API** (توليد البرومتات بالذكاء الاصطناعي)
- **Zod v4** (التحقق من البيانات)

## متطلبات التشغيل

- Node.js 20+
- مفتاح API من [TokenRouter](https://tokenrouter.com) (مجاني)

## الإعداد للتطوير

```bash
# 1. نسخ المتغيرات
cp .env.example .env

# 2. تعبئة المتغيرات في .env:
#    - TOKENROUTER_API_KEY: مفتاحك من TokenRouter
#    - AUTH_SECRET + NEXTAUTH_SECRET: قيمة عشوائية (مثلاً: openssl rand -base64 32)

# 3. تثبيت الحزم
npm install

# 4. مزامنة قاعدة البيانات
npx prisma db push

# 5. بذرة البيانات (تصنيفات + برومتات)
npm run seed

# 6. تشغيل الخادم التطويري
npm run dev
```

فتح [http://localhost:3000](http://localhost:3000).

## النشر على Vercel + Neon

1. ارفع المشروع على GitHub
2. أنشئ قاعدة PostgreSQL مجانية على [Neon](https://neon.new) وانسخ رابط الاتصال
3. وصِّل المستودع بـ [Vercel](https://vercel.com/new)
4. أضف المتغيرات في Vercel Dashboard:
   - `DATABASE_URL` = رابط PostgreSQL من Neon
   - `TOKENROUTER_API_KEY` = مفتاحك
   - `NEXTAUTH_SECRET` + `AUTH_SECRET` = قيمة عشوائية
   - `NEXTAUTH_URL` = رابط موقعك على Vercel
5. شغّل `npx prisma db push` محلياً على قاعدة PostgreSQL (أو استخدم Vercel Post-Deploy hook)

## الأوامر المتاحة

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل الخادم التطويري |
| `npm run build` | بناء للإنتاج |
| `npm start` | تشغيل نسخة الإنتاج |
| `npm run lint` | فحص الأكواد |
| `npm run seed` | بذرة البيانات الأولية |

## هيكل المشروع

```
src/
├── app/           # صفحات التطبيق (App Router)
│   ├── api/       # نقاط API
│   └── (auth)/    # صفحات تسجيل الدخول
├── components/    # المكونات
│   ├── layout/    # Header, Footer
│   ├── prompt/    # PromptCard, PromptResult, PromptGenerator
│   ├── skill/     # SkillCard
│   └── ui/        # Button, Input, Modal, Toast
├── lib/           # أدوات مساعدة (AI, API, auth)
├── store/         # Zustand store
└── data/          # بيانات ثابتة (تصنيفات)
```

## الترخيص

MIT
