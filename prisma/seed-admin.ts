import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@promptlab.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const password = await bcrypt.hash("Admin@123456", 12);
  const user = await prisma.user.create({
    data: {
      name: "مدير النظام",
      email,
      password,
      role: "admin",
      image: null,
    },
  });

  console.log(`Admin user created: ${user.email} / password: Admin@123456`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
