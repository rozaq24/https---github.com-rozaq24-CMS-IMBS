import { db } from "../src/lib/db";
import { FAQ } from "../src/lib/faq";
import { DEFAULT_PUBLIC_MENU } from "../src/lib/menus";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("ImbsDemo!2026", 10);
  const users = [
    ["admin@sekolah.sch.id", "Super Admin", "SUPERADMIN"],
    ["operator.berita@sekolah.sch.id", "Operator Berita", "OPERATOR_BERITA"],
    ["operator.spmb@sekolah.sch.id", "Operator SPMB", "OPERATOR_SPMB"],
    ["guru@sekolah.sch.id", "Guru Demo", "GURU"],
    ["wali@sekolah.sch.id", "Wali Demo", "WALI_READONLY"],
  ] as const;
  const admin = await db.user.upsert({ where: { email: users[0][0] }, update: { name: users[0][1], role: users[0][2], passwordHash, active: true }, create: { email: users[0][0], name: users[0][1], role: users[0][2], passwordHash } });
  for (const [email, name, role] of users.slice(1)) await db.user.upsert({ where: { email }, update: { name, role, passwordHash, active: true }, create: { email, name, role, passwordHash } });

  const settings = [
    ["site.theme", "emerald"],
    ["site.identity", JSON.stringify({ siteTitle: "CMS IMBS", description: "Informasi profil, berita, dan layanan sekolah IMBS.", keywords: "IMBS, sekolah, pendidikan", logo: "", favicon: "", address: "", phone: "", email: "", mapUrl: "", facebook: "", instagram: "", youtube: "" })],
    ["site.faq", JSON.stringify(FAQ)],
  ];
  for (const [key, value] of settings) await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });

  await db.greeting.upsert({ where: { id: 1 }, update: {}, create: { id: 1, title: "Sambutan Kepala Sekolah", body: "Selamat datang di website resmi sekolah IMBS. Mari belajar, berkarya, dan tumbuh bersama.", principalName: "Kepala Sekolah" } });
  const pages = [
    ["visi-misi", "Visi dan Misi", "<h2>Visi</h2><p>Mewujudkan peserta didik yang berilmu, berkarakter, dan siap berkontribusi.</p><h2>Misi</h2><p>Menyelenggarakan pembelajaran yang aman, terarah, dan mendorong potensi setiap murid.</p>"],
    ["sejarah", "Sejarah Sekolah", "<p>Halaman demo ini menunggu riwayat resmi sekolah dari pengelola. Ganti konten contoh melalui menu halaman di admin.</p>"],
    ["kontak", "Kontak", "<p>Hubungi sekolah melalui informasi kontak resmi pada footer atau kirim pesan melalui formulir pengaduan.</p>"],
  ] as const;
  for (const [slug, title, content] of pages) await db.customPage.upsert({ where: { slug }, update: {}, create: { slug, title, content, showInMenu: true } });

  const posts = [
    ["kegiatan-belajar", "Kegiatan Belajar di Sekolah", "Berita", "Murid mengikuti kegiatan pembelajaran dan diskusi di kelas."],
    ["pengumuman-akademik", "Pengumuman Akademik", "Pengumuman", "Periksa informasi akademik terbaru melalui kanal resmi sekolah."],
    ["agenda-kegiatan", "Agenda Kegiatan Sekolah", "Agenda", "Jadwal kegiatan sekolah akan diperbarui pada halaman agenda."],
    ["karya-murid", "Karya dan Kreativitas Murid", "Artikel", "Sekolah mendukung murid untuk terus berkarya dan berbagi."],
    ["kegiatan-literasi", "Mendorong Budaya Literasi", "Berita", "Kegiatan literasi menjadi bagian dari pengalaman belajar murid."],
    ["informasi-layanan", "Informasi Layanan Sekolah", "Pengumuman", "Gunakan halaman layanan untuk menemukan informasi yang tersedia."],
    ["belajar-bersama", "Belajar dan Tumbuh Bersama", "Artikel", "Lingkungan belajar yang baik membantu murid mengembangkan potensinya."],
    ["kabar-sekolah", "Kabar Sekolah IMBS", "Berita", "Berita demo ini dapat diganti oleh operator berita melalui admin."],
  ] as const;
  for (let index = 0; index < posts.length; index++) { const [slug, title, type, excerpt] = posts[index]; await db.post.upsert({ where: { slug }, update: {}, create: { slug, title, type: type.toUpperCase(), excerpt, content: `<p>${excerpt}</p>`, status: "PUBLISHED", publishedAt: new Date(Date.UTC(2026, 0, 5 + index)), authorId: admin.id } }); }

  const major = await db.major.upsert({ where: { code: "DEMO" }, update: {}, create: { code: "DEMO", name: "Program Contoh", desc: "Ganti informasi demo ini dengan program resmi sekolah." } });
  const teacher = await db.teacher.upsert({ where: { nip: "DEMO-GURU-001" }, update: {}, create: { nip: "DEMO-GURU-001", name: "Guru Demo", position: "Guru", education: "Data demo; perbarui melalui admin." } });
  const classroom = await db.classRoom.upsert({ where: { name: "Kelas Contoh" }, update: {}, create: { name: "Kelas Contoh", year: "2026/2027", majorId: major.id, homeroomTeacherId: teacher.id } });
  const student = await db.student.upsert({ where: { nis: "DEMO-001" }, update: {}, create: { nis: "DEMO-001", name: "Murid Demo", gender: "L", classId: classroom.id, year: "2026/2027", status: "AKTIF" } });
  if (!await db.achievement.findFirst({ where: { title: "Prestasi Contoh" } })) await db.achievement.create({ data: { title: "Prestasi Contoh", level: "Sekolah", year: "2026", desc: "Ganti dengan prestasi resmi.", studentId: student.id } });
  await db.extracurricular.upsert({ where: { name: "Kegiatan Contoh" }, update: {}, create: { name: "Kegiatan Contoh", schedule: "Jadwal diumumkan sekolah", desc: "Informasi demo kegiatan ekstrakurikuler." } });
  if (!await db.agenda.findFirst({ where: { title: "Agenda Contoh" } })) await db.agenda.create({ data: { title: "Agenda Contoh", desc: "Perbarui dengan jadwal resmi sekolah.", location: "Sekolah", startAt: new Date("2026-12-01T02:00:00.000Z") } });

  const albums = [];
  for (const title of ["Kegiatan Contoh", "Literasi Contoh"]) albums.push(await db.album.findFirst({ where: { title } }) ?? await db.album.create({ data: { title, category: "Demo" } }));
  if (!await db.photo.findFirst({ where: { albumId: albums[0].id } })) await db.photo.create({ data: { albumId: albums[0].id, url: "https://picsum.photos/seed/imbs-school/960/640", caption: "Foto demo — ganti dengan dokumentasi sekolah." } });
  if (!await db.photo.findFirst({ where: { albumId: albums[1].id } })) await db.photo.create({ data: { albumId: albums[1].id, url: "https://picsum.photos/seed/imbs-literasi/960/640", caption: "Foto demo literasi — ganti dengan dokumentasi sekolah." } });
  await db.sPMBPeriod.upsert({ where: { id: "demo-spmb-2026" }, update: {}, create: { id: "demo-spmb-2026", name: "Periode Demo", year: "2026", quota: 100, openAt: new Date("2026-01-01T00:00:00.000Z"), closeAt: new Date("2026-12-31T23:59:59.000Z"), terms: "Periode demo. Perbarui persyaratan resmi sebelum digunakan.", active: true } });

  for (const { id, label, href, parentId, order, visible, target, pageSlug } of DEFAULT_PUBLIC_MENU) {
    await db.menuItem.upsert({ where: { id }, update: {}, create: { id, label, href, parentId, order, visible, target, pageSlug } });
  }
  console.log(`Seed demo selesai: ${users.length} akun, ${posts.length} berita, ${albums.length} album, halaman profil, data akademik, SPMB, dan FAQ. Login demo: ${users.map(([email]) => email).join(", ")} / ImbsDemo!2026`);
}

main().finally(() => db.$disconnect());
