import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔍 جاري فحص قاعدة البيانات...\n");

  const dbUrl = process.env.DATABASE_URL ?? "";
  const dbHost = dbUrl.split("@")[1]?.split("/")[0] ?? "unknown";
  console.log(`📡 Database host: ${dbHost}\n`);

  const adminEmail = "admin@promptlab.com";

  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    console.log("❌ لم يتم العثور على حساب الأدمن");
    console.log(`   البريد المتوقع: ${adminEmail}`);
    console.log("\n💡 شغّل: npm run seed:admin");
  } else {
    console.log("✅ تم العثور على حساب الأدمن:");
    console.log(`   - ID: ${admin.id}`);
    console.log(`   - الاسم: ${admin.name ?? "—"}`);
    console.log(`   - البريد: ${admin.email}`);
    console.log(`   - الدور: ${admin.role}`);
    console.log(`   - أنشئ في: ${admin.createdAt.toISOString()}`);
    console.log(`   - لديه كلمة مرور: ${admin.password ? "نعم ✓" : "لا ✗"}`);

    if (admin.role !== "admin") {
      console.log("\n⚠️  الحساب موجود لكن ليس admin. شغّل seed:admin أو حدّث الدور يدوياً.");
    }
  }

  const counts = {
    users: await prisma.user.count(),
    prompts: await prisma.prompt.count(),
    categories: await prisma.category.count(),
  };
  console.log("\n📊 إحصائيات قاعدة البيانات:");
  console.log(`   - المستخدمون: ${counts.users}`);
  console.log(`   - البرومتات: ${counts.prompts}`);
  console.log(`   - التصنيفات: ${counts.categories}`);

  let eventLogExists = false;
  try {
    await prisma.eventLog.count();
    eventLogExists = true;
  } catch {
    eventLogExists = false;
  }
  console.log(`   - جدول EventLog: ${eventLogExists ? "موجود ✓" : "غير موجود ✗"}`);
  if (!eventLogExists) {
    console.log("\n💡 شغّل: npx prisma db push");
  }
}

main()
  .catch((e) => {
    console.error("❌ خطأ:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });