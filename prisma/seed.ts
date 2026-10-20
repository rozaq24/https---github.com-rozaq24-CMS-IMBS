import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await db.user.upsert({
    where: { email: "admin@sekolah.sch.id" },
    update: {},
    create: { name: "Super Admin", email: "admin@sekolah.sch.id", passwordHash, role: "SUPERADMIN" },
  });
  await db.siteSetting.upsert({ where: { key: "theme" }, update: {}, create: { key: "theme", value: JSON.stringify({ default: "emerald", mode: "light" }) } });
  await db.siteSetting.upsert({ where: { key: "identity" }, update: {}, create: { key: "identity", value: JSON.stringify({ title: "CMS IMBS", desc: "Website resmi sekolah" }) } });
  await db.greeting.upsert({ where: { id: 1 }, update: {}, create: { id: 1, title: "Sambutan Kepala Sekolah", body: "Selamat datang.", principalName: "Kepala Sekolah" } });
  console.log("Seed minimal OK:", admin.email, "/ admin123");
}

main().finally(() => db.$disconnect());
